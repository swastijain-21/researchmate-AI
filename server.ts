/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '10mb' }));

// System prompt with few-shot prompting exemplars embedded
const FEW_SHOT_SYSTEM_PROMPT = `You are ResearchMate, an expert Academic Research Paper Assistant Agent designed for university students, graduate researchers, and academic scholars.

You rigorously apply FEW-SHOT PROMPTING principles to transform research topics into structured, methodologically sound, and publication-ready academic papers.

### FEW-SHOT EXEMPLARS:

Example 1:
Input: "Artificial Intelligence in Healthcare"
Expected Output: A structured research outline covering AI applications in diagnosis, clinical benefits, technical & computational challenges, bioethical & privacy concerns, and future scope.

Example 2:
Input: "Impact of Social Media on Student Learning"
Expected Output: A structured research outline covering learning habits, cognitive attention, empirical academic performance, collaborative advantages, psychological disadvantages, and possible research gaps in current longitudinal literature.

### STRICT SCHOLARLY RULES:
1. Grounding & Truthfulness: NEVER invent fake authors, fictitious paper titles, or nonexistent DOIs. Use verified real-world academic studies (e.g. Nature, Lancet, JAMA, IEEE, Science, ACM, PubMed) or established disciplinary consensus.
2. Tone & Voice: Maintain objective, formal, authoritative scholarly tone. Employ disciplined academic hedging (e.g., "evidence suggests", "correlates indicate", "hypothesized to reflect" rather than dogmatic absolutes).
3. Section Rigor: Follow standard IMRaD (Introduction, Methods, Results, Discussion) architecture. In Results & Discussion, clearly distinguish actual documented empirical findings from illustrative or prospective hypotheses.
4. Citation Compliance: Strictly follow requested format (APA 7th Edition: Author, A. A. (Year)... or IEEE Format: [1] A. Author...).`;

// Shared helper to call Gemini with timeout and model fallback
async function generateWithGemini(params: {
  contents: string;
  responseMimeType?: string;
  timeoutMs?: number;
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please check the Secrets panel.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const timeoutMs = params.timeoutMs || 25000;
  // Prioritize ultra-fast, high-availability models with generous quota
  const candidateModels = [
    'gemini-flash-lite-latest',
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-3-flash-preview',
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
  ];

  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const requestConfig: any = {
        systemInstruction: FEW_SHOT_SYSTEM_PROMPT,
      };
      if (params.responseMimeType) {
        requestConfig.responseMimeType = params.responseMimeType;
      }
      // Low thinking level on models that support it to prevent latency spikes
      if (model === 'gemini-3.8-flash') {
        requestConfig.thinkingConfig = { thinkingLevel: 'LOW' };
      }

      const responsePromise = ai.models.generateContent({
        model,
        contents: params.contents,
        config: requestConfig,
      });

      const abortPromise = new Promise<never>((_, reject) => {
        controller.signal.addEventListener('abort', () => {
          reject(new Error(`Model request timed out after ${timeoutMs}ms for ${model}`));
        });
      });

      const response = await Promise.race([responsePromise, abortPromise]);
      clearTimeout(timer);

      const text = response.text;
      if (text && text.trim().length > 0) {
        return text;
      }
    } catch (err: any) {
      console.warn(`[Gemini SDK] Model ${model} failed or timed out:`, err?.message || err);
      // If quota exceeded or 429, try the next model immediately
      if (model === candidateModels[candidateModels.length - 1]) {
        throw err;
      }
    }
  }

  throw new Error('All Gemini model candidates failed to return a response.');
}

// Robust JSON parser helper that strips markdown code fences if present
function parseJsonSafely(raw: string): any {
  if (!raw) return {};
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      } catch {
        // continue to throw below
      }
    }
    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      try {
        return JSON.parse(cleaned.substring(firstBracket, lastBracket + 1));
      } catch {
        // continue to throw below
      }
    }
    throw new Error(`Failed to parse response as JSON: ${cleaned.slice(0, 150)}`);
  }
}

// Clean and user-friendly error message formatter
function formatErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred.';
  const msg = error.message || String(error);
  try {
    const parsed = JSON.parse(msg);
    if (parsed.error?.message) {
      if (parsed.error.code === 429) {
        return 'Gemini API request quota reached for the free tier. Please retry shortly or check API key quota.';
      }
      if (parsed.error.code === 503) {
        return 'The AI model is experiencing high demand. Please try again in a moment.';
      }
      return parsed.error.message;
    }
  } catch {
    // not a JSON string
  }
  return msg;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    geminiKeySet: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 1. TOPIC ANALYSIS ENDPOINT
app.post('/api/analyze-topic', async (req, res) => {
  try {
    const { topic, academicLevel, citationStyle } = req.body;
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Research topic is required' });
    }

    const prompt = `Analyze this research topic: "${topic.trim()}".
Academic Level: ${academicLevel || "Undergraduate (BA / BS)"}
Citation Standard: ${citationStyle || "APA 7th Edition"}

Provide an in-depth topic breakdown formatted as strict JSON:
{
  "mainSubject": "Clear descriptive statement of the primary subject and problem domain",
  "fieldOfStudy": "Primary academic field and sub-discipline",
  "coreObjectives": [
    "Specific primary objective 1",
    "Specific primary objective 2",
    "Specific primary objective 3"
  ],
  "scope": {
    "included": [
      "Explicitly investigated parameter 1",
      "Explicitly investigated parameter 2",
      "Explicitly investigated parameter 3"
    ],
    "excluded": [
      "Delimited out-of-scope boundary 1",
      "Delimited out-of-scope boundary 2"
    ],
    "targetContext": "Target demographic, clinical, computational, or theoretical population context"
  },
  "keyThemes": [
    "Theme 1",
    "Theme 2",
    "Theme 3",
    "Theme 4"
  ],
  "suggestedMethodology": "Detailed recommended research design (e.g. Mixed-Methods Empirical, Systematic Meta-Analysis, Computational Benchmarking)"
}`;

    const textOutput = await generateWithGemini({
      contents: prompt,
      responseMimeType: 'application/json',
      timeoutMs: 15000,
    });

    const parsed = parseJsonSafely(textOutput || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing topic:', error);
    res.status(500).json({
      error: formatErrorMessage(error),
    });
  }
});

// 2. RESEARCH PLANNING & OUTLINE ENDPOINT
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { topic, analysis, academicLevel, wordCountTarget } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'Research topic is required' });
    }

    const prompt = `Formulate a comprehensive Research Plan and Outline for: "${topic.trim()}".
Academic Level: ${academicLevel || "Undergraduate (BA / BS)"}
Target Length: ${wordCountTarget || "3000 words (Standard Conference / Journal)"}
Context: ${JSON.stringify(analysis || {})}

Few-Shot Pattern: Formulate specific research questions that challenge current methodologies and identify empirical boundaries.
Format strictly as JSON:
{
  "thesisStatement": "A rigorous, testable central thesis statement or working hypothesis",
  "primaryObjective": "Overarching research aim",
  "secondaryObjectives": [
    "Specific objective 1",
    "Specific objective 2",
    "Specific objective 3"
  ],
  "researchQuestions": [
    { "id": "RQ1", "question": "Formulated research question 1", "type": "descriptive" },
    { "id": "RQ2", "question": "Formulated research question 2", "type": "analytical" },
    { "id": "RQ3", "question": "Formulated research question 3", "type": "evaluative" }
  ],
  "outline": [
    { "sectionKey": "abstract", "title": "Abstract & Keywords", "subsections": ["Background & Purpose", "Methodology Summary", "Key Findings", "Significance", "Keywords"], "estimatedWordCount": 250, "description": "Concise synthesis of research objectives, methods, and outcomes." },
    { "sectionKey": "introduction", "title": "1. Introduction & Research Framework", "subsections": ["Background & Problem Statement", "Research Objectives & Questions", "Study Scope & Contributions"], "estimatedWordCount": 600, "description": "Contextual background, motivation, research questions, and theoretical framework." },
    { "sectionKey": "literature_review", "title": "2. Literature Review & Theoretical Synthesis", "subsections": ["Thematic Literature Synthesis", "Seminal Frameworks", "Identification of Research Gaps"], "estimatedWordCount": 850, "description": "Critical thematic synthesis of prior scholarship and explicit unaddressed gaps." },
    { "sectionKey": "methodology", "title": "3. Research Methodology", "subsections": ["Research Design & Approach", "Data Collection & Sources", "Analytical Framework & Ethics"], "estimatedWordCount": 500, "description": "Methodological design, validity safeguards, and procedural ethics." },
    { "sectionKey": "results_discussion", "title": "4. Results & Discussion", "subsections": ["Key Findings & Evidence", "Comparative Discussion", "Implications & Limitations"], "estimatedWordCount": 750, "description": "Analysis of findings, theoretical/practical implications, and constraints." },
    { "sectionKey": "conclusion", "title": "5. Conclusion & Recommendations", "subsections": ["Summary of Core Findings", "Research Questions Answered", "Future Research Agenda"], "estimatedWordCount": 350, "description": "Synthesis of answers, practical recommendations, and forward directions." },
    { "sectionKey": "references", "title": "References", "subsections": ["Primary Bibliography"], "estimatedWordCount": 200, "description": "Verified peer-reviewed publications formatted strictly according to citation standard." }
  ]
}`;

    const textOutput = await generateWithGemini({
      contents: prompt,
      responseMimeType: 'application/json',
      timeoutMs: 15000,
    });

    const parsed = parseJsonSafely(textOutput || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating plan:', error);
    res.status(500).json({ error: formatErrorMessage(error) });
  }
});

// 3. LITERATURE REVIEW & VERIFIED CITATIONS ENDPOINT
app.post('/api/literature-review-search', async (req, res) => {
  try {
    const { topic, citationStyle } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const style = citationStyle || 'APA 7th Edition';
    const prompt = `Synthesize peer-reviewed literature for the academic topic: "${topic.trim()}".
Citation Standard: ${style}

MANDATORY SCHOLARLY INTEGRITY RULES:
1. Cite only REAL seminal research papers, genuine authors, and established journals (e.g. Nature, Lancet, Science, JAMA, IEEE Transactions, ACM, Cell, etc.).
2. Never invent fake authors, nonexistent DOIs, or fabricated paper titles.
3. Clearly identify explicit, genuine research gaps in the literature.

Format strictly as JSON:
{
  "summary": "2-3 comprehensive paragraphs providing a state-of-the-art scholarly synthesis of current literature, methodological evolutions, and conceptual debates.",
  "synthesizedThemes": [
    { "theme": "Core Theme 1", "findings": "Key consensus or debate", "sources": "Primary authors and years" },
    { "theme": "Core Theme 2", "findings": "Key consensus or debate", "sources": "Primary authors and years" },
    { "theme": "Core Theme 3", "findings": "Key consensus or debate", "sources": "Primary authors and years" }
  ],
  "researchGaps": [
    "Explicit Research Gap 1: Specific unaddressed problem, scarcity of longitudinal data, or methodological contradiction",
    "Explicit Research Gap 2: Demographic, clinical, or computational boundary not covered in existing work",
    "Explicit Research Gap 3: Future empirical requirement or evaluation bottleneck"
  ],
  "groundedSources": [
    { "title": "Seminal Publication 1 Title", "url": "https://scholar.google.com" },
    { "title": "Seminal Publication 2 Title", "url": "https://pubmed.ncbi.nlm.nih.gov" }
  ],
  "literatureItems": [
    {
      "title": "Actual Published Paper Title 1",
      "authors": "Author, A. A., & Co-author, B. B.",
      "year": "2020",
      "venueOrPublisher": "Journal / Conference Name",
      "summary": "Analytical summary of the study's scope and design.",
      "keyFindings": "Documented empirical or theoretical outcome.",
      "identifiedGap": "Specific gap left open by this study.",
      "doiOrUrl": "Verified publication reference"
    },
    {
      "title": "Actual Published Paper Title 2",
      "authors": "Author, C. C., et al.",
      "year": "2022",
      "venueOrPublisher": "Journal / Conference Name",
      "summary": "Analytical summary of the study's scope and design.",
      "keyFindings": "Documented empirical or theoretical outcome.",
      "identifiedGap": "Specific gap left open by this study.",
      "doiOrUrl": "Verified publication reference"
    },
    {
      "title": "Actual Published Paper Title 3",
      "authors": "Author, D. D., & Author, E. E.",
      "year": "2024",
      "venueOrPublisher": "Journal / Conference Name",
      "summary": "Analytical summary of the study's scope and design.",
      "keyFindings": "Documented empirical or theoretical outcome.",
      "identifiedGap": "Specific gap left open by this study.",
      "doiOrUrl": "Verified publication reference"
    }
  ]
}`;

    const textOutput = await generateWithGemini({
      contents: prompt,
      responseMimeType: 'application/json',
      timeoutMs: 16000,
    });

    const parsed = parseJsonSafely(textOutput || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in literature search:', error);
    res.status(500).json({ error: formatErrorMessage(error) });
  }
});

// 4. GENERATE SPECIFIC SECTION ENDPOINT
app.post('/api/generate-section', async (req, res) => {
  try {
    const {
      topic,
      sectionKey,
      academicLevel,
      wordCountTarget,
      citationStyle,
      plan,
      literature,
      customInstructions,
    } = req.body;

    if (!topic || !sectionKey) {
      return res.status(400).json({ error: 'Topic and sectionKey are required' });
    }

    const sectionTitleMap: Record<string, string> = {
      abstract: 'Abstract & Keywords',
      introduction: '1. Introduction & Research Framework',
      literature_review: '2. Literature Review & Theoretical Synthesis',
      methodology: '3. Research Methodology',
      results_discussion: '4. Results & Discussion',
      conclusion: '5. Conclusion & Recommendations',
      references: 'References',
    };

    const sectionGuidance: Record<string, string> = {
      abstract: 'Write 200-250 words covering: Background, Problem Statement, Objectives, Methodology Summary, Key Findings, Significance, and 5-6 Keywords.',
      introduction: 'Write an introduction covering: Scholarly Context, Problem Statement, Core Objectives, Specific Research Questions (RQs), Study Scope, and Paper Organization Roadmap.',
      literature_review: 'Write a literature review covering: Thematic Synthesis of Existing Literature, Seminal Theoretical Frameworks, Comparative Evaluation, and Explicit Identification of Research Gaps.',
      methodology: 'Write a research methodology covering: Research Design & Approach, Data Collection Procedures & Sampling, Computational/Analytical Instrumentation, Validity & Reliability Safeguards, and Ethical Compliance.',
      results_discussion: 'Write a Results & Discussion section. IMPORTANT: Clearly demarcate actual empirical findings from prospective or illustrative hypotheses. Include comparative analysis against existing literature, theoretical/practical implications, and study limitations.',
      conclusion: 'Write a conclusion covering: Synthesis of Key Findings, Direct Answers to the Research Questions, Practical/Policy Recommendations, and Directions for Future Research.',
      references: `Provide a comprehensive bibliography formatted strictly in ${citationStyle || 'APA 7th Edition'}. Every entry must reference real, verified publications (authors, year, title, journal/venue, volume). Never fabricate sources.`,
    };

    const sectionTitle = sectionTitleMap[sectionKey] || sectionKey.toUpperCase();
    const guidance = sectionGuidance[sectionKey] || '';

    const prompt = `Write a comprehensive, peer-reviewed caliber academic paper section:
Section: "${sectionTitle}"
Topic: "${topic}"
Academic Standard: ${academicLevel || "Undergraduate (BA / BS)"}
Target Paper Length: ${wordCountTarget || "3000 words"}
Citation Standard: ${citationStyle || "APA 7th Edition"}
Specific Requirements: ${guidance}

Context:
- Central Thesis: ${plan?.thesisStatement || "Investigating " + topic}
- Research Questions: ${JSON.stringify(plan?.researchQuestions || [])}
- Identified Research Gaps: ${JSON.stringify(literature?.researchGaps || [])}
${customInstructions ? `User Custom Guidance: ${customInstructions}` : ''}

Formatting Guidelines:
- Use markdown subheadings (### Subheading) for subsections.
- Write in formal academic prose with natural argumentative transitions.
- Use in-text citations matching ${citationStyle || 'APA 7th Edition'}.
- Output ONLY the section markdown content.`;

    const content = await generateWithGemini({
      contents: prompt,
      timeoutMs: 18000,
    });

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    res.json({
      key: sectionKey,
      title: sectionTitle,
      content,
      wordCount,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating section:', error);
    res.status(500).json({ error: formatErrorMessage(error) });
  }
});

// 5. GENERATE FULL PAPER END-TO-END ENDPOINT
app.post('/api/generate-full-paper', async (req, res) => {
  try {
    const {
      topic,
      academicLevel,
      wordCountTarget,
      citationStyle,
      plan,
      literature,
    } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `You are tasked with generating a structured academic research paper on: "${topic.trim()}".
Academic Standard: ${academicLevel || "Undergraduate (BA / BS)"}
Target Length: ${wordCountTarget || "3000 words"}
Citation Standard: ${citationStyle || "APA 7th Edition"}

Context:
- Thesis: ${plan?.thesisStatement || 'Investigating key dimensions of ' + topic}
- Primary Objective: ${plan?.primaryObjective || ''}
- Research Questions: ${JSON.stringify(plan?.researchQuestions || [])}
- Research Gaps: ${JSON.stringify(literature?.researchGaps || [])}

Generate all 7 core academic sections formatted strictly as a JSON object:
{
  "abstract": "200-250 words covering Background, Objectives, Methodology Summary, Key Findings, Contribution & Significance, and 5-6 Keywords.",
  "introduction": "Comprehensive introduction with background, problem statement, research objectives, formulated research questions (RQ1, RQ2...), scope, and structural roadmap.",
  "literature_review": "Thematic literature synthesis referencing seminal real studies, comparative evaluation, and explicit identification of research gaps.",
  "methodology": "Detailed research design, data collection procedures, computational/empirical framework, reliability safeguards, and ethical compliance.",
  "results_discussion": "Comprehensive results and analytical discussion. Clearly distinguish actual empirical findings from prospective hypotheses. Address implications and limitations.",
  "conclusion": "Synthesis of core findings, direct answers to the research questions, practical recommendations, and future research directions.",
  "references": "Verified academic bibliography formatted strictly in ${citationStyle || 'APA 7th Edition'}. Cite real authors, publication years, and journals. Never invent fake sources."
}`;

    const textOutput = await generateWithGemini({
      contents: prompt,
      responseMimeType: 'application/json',
      timeoutMs: 25000,
    });

    const parsed = parseJsonSafely(textOutput || '{}');

    const titles: Record<string, string> = {
      abstract: 'Abstract & Keywords',
      introduction: '1. Introduction & Research Framework',
      literature_review: '2. Literature Review & Theoretical Synthesis',
      methodology: '3. Research Methodology',
      results_discussion: '4. Results & Discussion',
      conclusion: '5. Conclusion & Recommendations',
      references: 'References',
    };

    const sectionKeys = [
      'abstract',
      'introduction',
      'literature_review',
      'methodology',
      'results_discussion',
      'conclusion',
      'references',
    ];

    const sections: Record<string, any> = {};
    for (const key of sectionKeys) {
      const text = parsed[key] || '';
      sections[key] = {
        key,
        title: titles[key],
        content: text,
        wordCount: text.trim().split(/\s+/).filter(Boolean).length,
        lastUpdated: new Date().toISOString(),
      };
    }

    res.json({ sections });
  } catch (error: any) {
    console.error('Error generating full paper:', error);
    res.status(500).json({ error: formatErrorMessage(error) });
  }
});

// 6. CITATION ASSISTANCE ENDPOINT
app.post('/api/citation-assistant', async (req, res) => {
  try {
    const { sources, targetStyle } = req.body;
    if (!sources || !Array.isArray(sources)) {
      return res.status(400).json({ error: 'Array of sources is required' });
    }

    const style = targetStyle || 'APA 7th Edition';
    const prompt = `Convert the following academic sources into ${style}.
Sources:
${JSON.stringify(sources, null, 2)}

Format strictly as JSON:
{
  "style": "${style}",
  "citations": [
    {
      "sourceTitle": "Title",
      "fullReference": "Formatted bibliography entry",
      "inTextCitation": "Formatted in-text citation (e.g. (Author, 2023) or [1])",
      "citationNotes": "Formatting notes"
    }
  ]
}`;

    const textOutput = await generateWithGemini({
      contents: prompt,
      responseMimeType: 'application/json',
      timeoutMs: 15000,
    });

    const parsed = parseJsonSafely(textOutput || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error assisting citations:', error);
    res.status(500).json({ error: formatErrorMessage(error) });
  }
});

// 7. ACADEMIC EDITING ENDPOINT
app.post('/api/academic-edit', async (req, res) => {
  try {
    const { text, focusArea, academicLevel } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text to edit is required' });
    }

    const prompt = `Perform an academic editorial review of this excerpt:
"""
${text}
"""
Target Academic Standard: ${academicLevel || "Undergraduate (BA / BS)"}
Focus Area: ${focusArea || "Comprehensive"}

Format strictly as JSON:
{
  "originalText": "The original text",
  "revisedText": "The refined, scholarly academic revision with improved tone and transitions",
  "academicScoreBefore": 68,
  "academicScoreAfter": 94,
  "feedback": [
    {
      "category": "Academic Tone",
      "explanation": "Concrete explanation of revisions made"
    },
    {
      "category": "Logical Flow & Transitions",
      "explanation": "Concrete explanation of transitions strengthened"
    }
  ]
}`;

    const textOutput = await generateWithGemini({
      contents: prompt,
      responseMimeType: 'application/json',
      timeoutMs: 15000,
    });

    const parsed = parseJsonSafely(textOutput || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error editing text:', error);
    res.status(500).json({ error: formatErrorMessage(error) });
  }
});

// Serve frontend with Vite in dev, or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ResearchMate research assistant listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
