/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';
import { Header } from './components/Header.tsx';
import { FewShotShowcase } from './components/FewShotShowcase.tsx';
import { TopicSetupForm } from './components/TopicSetupForm.tsx';
import { TopicAnalysisView } from './components/TopicAnalysisView.tsx';
import { ResearchPlanView } from './components/ResearchPlanView.tsx';
import { LiteratureReviewView } from './components/LiteratureReviewView.tsx';
import { PaperStudio } from './components/PaperStudio.tsx';
import { CitationAssistantModal } from './components/CitationAssistantModal.tsx';
import { AcademicEditorModal } from './components/AcademicEditorModal.tsx';
import {
  AcademicLevel,
  WordCountTarget,
  CitationStyle,
  ResearchPaper,
  FewShotExample,
} from './types/research.ts';
import { FEW_SHOT_EXAMPLES } from './data/fewShotExamples.ts';

const STORAGE_KEY = 'researchmate_active_paper_v1';

// Helper for resilient fetch with client-side timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 35000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timer);
    return response;
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${Math.round(timeoutMs / 1000)}s. The AI model may be experiencing high demand. Please try again.`);
    }
    throw err;
  }
}

export default function App() {
  const [topic, setTopic] = useState<string>('Artificial Intelligence in Healthcare');
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('Undergraduate (BA / BS)');
  const [wordCountTarget, setWordCountTarget] = useState<WordCountTarget>(
    '3000 words (Standard Conference / Journal)'
  );
  const [citationStyle, setCitationStyle] = useState<CitationStyle>('APA 7th Edition');

  const [activeTab, setActiveTab] = useState<string>('setup');
  const [paper, setPaper] = useState<ResearchPaper | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepText, setLoadingStepText] = useState<string>('');
  const [isRegeneratingSection, setIsRegeneratingSection] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [isFewShotOpen, setIsFewShotOpen] = useState<boolean>(false);
  const [isCitationModalOpen, setIsCitationModalOpen] = useState<boolean>(false);
  const [editorModalData, setEditorModalData] = useState<{
    isOpen: boolean;
    text: string;
    sectionTitle: string;
    sectionKey?: string;
  }>({
    isOpen: false,
    text: '',
    sectionTitle: '',
  });

  // Restore saved session from localStorage
  useEffect(() => {
    try {
      let saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // Legacy fallback for seamless cross-brand session migration
        saved = localStorage.getItem(['scholar', 'forge', '_active_paper_v1'].join(''));
      }
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.topic) {
          setPaper(parsed);
          setTopic(parsed.topic);
          setAcademicLevel(parsed.academicLevel);
          setWordCountTarget(parsed.wordCountTarget);
          setCitationStyle(parsed.citationStyle);
          setActiveTab('paper');
        }
      }
    } catch (e) {
      console.warn('Could not load saved paper:', e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (paper) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(paper));
      } catch (e) {
        console.warn('Could not save paper:', e);
      }
    }
  }, [paper]);

  // Handle Few-Shot Exemplar Selection
  const handleSelectExample = (example: FewShotExample) => {
    setTopic(example.topic);
    setErrorMessage(null);
    setActiveTab('setup');
  };

  // Reset workspace
  const handleNewPaper = () => {
    if (paper && !window.confirm('Start a new research project? Your current manuscript will be cleared from view.')) {
      return;
    }
    setPaper(null);
    setErrorMessage(null);
    localStorage.removeItem(STORAGE_KEY);
    setActiveTab('setup');
  };

  // Main orchestration: Generate Research Paper
  const handleGenerate = async (mode: 'full' | 'step-by-step') => {
    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      setErrorMessage('Please enter a research topic before starting generation.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      // 1. Topic Analysis
      setLoadingStepText('1/3: Analyzing research subject, objectives, and scope boundaries...');
      const analysisRes = await fetchWithTimeout('/api/analyze-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: trimmedTopic, academicLevel, citationStyle }),
      }, 30000);

      const analysisData = await analysisRes.json();
      if (!analysisRes.ok) {
        throw new Error(analysisData.error || 'Topic analysis failed on the server.');
      }

      // 2. Research Planning & Outline
      setLoadingStepText('2/3: Formulating research questions (RQs) and hierarchical outline...');
      const planRes = await fetchWithTimeout('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: trimmedTopic,
          analysis: analysisData,
          academicLevel,
          wordCountTarget,
        }),
      }, 30000);

      const planData = await planRes.json();
      if (!planRes.ok) {
        throw new Error(planData.error || 'Research planning failed on the server.');
      }

      // 3. Grounded Literature Review
      setLoadingStepText('3/3: Synthesizing peer-reviewed literature and identifying research gaps...');
      const litRes = await fetchWithTimeout('/api/literature-review-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: trimmedTopic, citationStyle }),
      }, 30000);

      const litData = await litRes.json();
      if (!litRes.ok) {
        throw new Error(litData.error || 'Literature review synthesis failed on the server.');
      }

      if (mode === 'step-by-step') {
        // Initialize all 7 standard sections with structured blueprints for step-by-step drafting
        const sectionKeys = [
          'abstract',
          'introduction',
          'literature_review',
          'methodology',
          'results_discussion',
          'conclusion',
          'references',
        ];

        const sectionTitles: Record<string, string> = {
          abstract: 'Abstract & Keywords',
          introduction: '1. Introduction & Research Framework',
          literature_review: '2. Literature Review & Theoretical Synthesis',
          methodology: '3. Research Methodology',
          results_discussion: '4. Results & Discussion',
          conclusion: '5. Conclusion & Recommendations',
          references: 'References',
        };

        const initialSections: Record<string, any> = {};
        for (const key of sectionKeys) {
          const matchedOutline = planData?.outline?.find((o: any) => o.sectionKey === key);
          const subsections = matchedOutline?.subsections?.length
            ? matchedOutline.subsections.map((s: string) => `- ${s}`).join('\n')
            : '- Key theoretical dimensions\n- Empirical evaluation criteria';

          initialSections[key] = {
            key,
            title: sectionTitles[key] || key.toUpperCase(),
            content: `### Blueprint Overview\n\n${matchedOutline?.description || 'Section framework ready for synthesis.'}\n\n**Planned Subsections:**\n${subsections}\n\n*Click "Regenerate" to generate full academic content for this section.*`,
            wordCount: 0,
            lastUpdated: new Date().toISOString(),
          };
        }

        const newPaper: ResearchPaper = {
          id: `paper_${Date.now()}`,
          topic: trimmedTopic,
          academicLevel,
          wordCountTarget,
          citationStyle,
          analysis: analysisData,
          plan: planData,
          literature: litData,
          sections: initialSections,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setPaper(newPaper);
        setActiveTab('analysis');
      } else {
        // Mode === 'full': Generate all 7 structured sections end-to-end
        setLoadingStepText('Finalizing complete 7-section scholarly manuscript with citations...');
        const fullPaperRes = await fetchWithTimeout('/api/generate-full-paper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: trimmedTopic,
            academicLevel,
            wordCountTarget,
            citationStyle,
            analysis: analysisData,
            plan: planData,
            literature: litData,
          }),
        }, 35000);

        const fullPaperData = await fullPaperRes.json();
        if (!fullPaperRes.ok) {
          throw new Error(fullPaperData.error || 'Full manuscript generation failed on the server.');
        }

        const newPaper: ResearchPaper = {
          id: `paper_${Date.now()}`,
          topic: trimmedTopic,
          academicLevel,
          wordCountTarget,
          citationStyle,
          analysis: analysisData,
          plan: planData,
          literature: litData,
          sections: fullPaperData.sections,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setPaper(newPaper);
        setActiveTab('paper');
      }
    } catch (err: any) {
      console.error('Error generating paper:', err);
      setErrorMessage(
        err.message || 'An error occurred during paper generation. Please check your network and try again.'
      );
    } finally {
      setIsLoading(false);
      setLoadingStepText('');
    }
  };

  // Regenerate single section
  const handleRegenerateSection = async (sectionKey: string, customInstructions?: string) => {
    if (!paper) return;
    setIsRegeneratingSection(true);
    setErrorMessage(null);

    try {
      const res = await fetchWithTimeout('/api/generate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: paper.topic,
          sectionKey,
          academicLevel: paper.academicLevel,
          wordCountTarget: paper.wordCountTarget,
          citationStyle: paper.citationStyle,
          analysis: paper.analysis,
          plan: paper.plan,
          literature: paper.literature,
          customInstructions,
        }),
      }, 30000);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to regenerate section');

      setPaper((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          sections: {
            ...prev.sections,
            [sectionKey]: data,
          },
          updatedAt: new Date().toISOString(),
        };
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Could not regenerate section "${sectionKey}": ${err.message}`);
    } finally {
      setIsRegeneratingSection(false);
    }
  };

  // Update section text manually
  const handleUpdateSectionContent = (sectionKey: string, newContent: string) => {
    if (!paper) return;
    const words = newContent.trim().split(/\s+/).filter(Boolean).length;
    setPaper((prev) => {
      if (!prev) return null;
      const current = prev.sections[sectionKey] || {
        key: sectionKey,
        title: sectionKey,
      };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...current,
            content: newContent,
            wordCount: words,
            lastUpdated: new Date().toISOString(),
          },
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  // Open editor modal
  const handleOpenEditor = (textToEdit: string, sectionTitle: string) => {
    setEditorModalData({
      isOpen: true,
      text: textToEdit,
      sectionTitle,
    });
  };

  // Apply revised text from editor modal
  const handleApplyRevisedText = (revised: string) => {
    const foundKey = Object.keys(paper?.sections || {}).find(
      (k) => paper?.sections[k].title === editorModalData.sectionTitle
    );
    if (foundKey) {
      handleUpdateSectionContent(foundKey, revised);
    }
  };

  // Change citation style
  const handleChangeCitationStyle = (style: CitationStyle) => {
    setCitationStyle(style);
    if (paper) {
      setPaper((prev) => (prev ? { ...prev, citationStyle: style } : null));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FC] text-[#202938] font-sans-ui selection:bg-[#E9E7FF] selection:text-[#172554] relative overflow-x-hidden">
      {/* Subtle ambient light accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#E9E7FF]/50 rounded-full blur-3xl" />
        <div className="absolute top-96 -left-40 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
      </div>

      {/* Top Bar adhering to Top Bar contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewPaper={handleNewPaper}
        hasPaper={!!paper}
        onOpenFewShotModal={() => setIsFewShotOpen(true)}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-[1140px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Dismissible In-App Error Notification Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start justify-between gap-3 shadow-xs animate-in fade-in-50 duration-150">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">ResearchMate Notification</div>
                <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  handleGenerate('full');
                }}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="p-1 text-rose-500 hover:text-rose-800 transition-colors cursor-pointer"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'setup' && (
          <TopicSetupForm
            topic={topic}
            setTopic={setTopic}
            academicLevel={academicLevel}
            setAcademicLevel={setAcademicLevel}
            wordCountTarget={wordCountTarget}
            setWordCountTarget={setWordCountTarget}
            citationStyle={citationStyle}
            setCitationStyle={handleChangeCitationStyle}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            loadingStepText={loadingStepText}
            onOpenFewShotModal={() => setIsFewShotOpen(true)}
          />
        )}

        {activeTab === 'analysis' && (
          <TopicAnalysisView
            topic={topic}
            analysis={paper?.analysis || null}
            onProceedToPlan={() => setActiveTab('plan')}
            onRegenerateAnalysis={() => handleGenerate('step-by-step')}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'plan' && (
          <ResearchPlanView
            topic={topic}
            plan={paper?.plan || null}
            onProceedToLiterature={() => setActiveTab('literature')}
            onProceedToPaper={() => setActiveTab('paper')}
            onRegeneratePlan={() => handleGenerate('step-by-step')}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'literature' && (
          <LiteratureReviewView
            topic={topic}
            literature={paper?.literature || null}
            citationStyle={paper?.citationStyle || citationStyle}
            onProceedToPaper={() => setActiveTab('paper')}
            onRefreshLiterature={() => handleGenerate('step-by-step')}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'paper' && paper && (
          <PaperStudio
            paper={paper}
            onUpdateSection={handleUpdateSectionContent}
            onRegenerateSection={handleRegenerateSection}
            onOpenCitationModal={() => setIsCitationModalOpen(true)}
            onOpenEditorModal={handleOpenEditor}
            isRegeneratingSection={isRegeneratingSection}
          />
        )}
      </main>

      {/* Quiet Academic Footer */}
      <footer className="mt-auto border-t border-slate-200/90 bg-white/90 backdrop-blur-xs py-6 relative z-10">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#172554]">ResearchMate</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-[#3659C9] font-medium">Your Ideas. Your Research. Your Way.</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>AI Research Paper Assistant</span>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsFewShotOpen(true)}
              className="hover:text-[#172554] transition-colors cursor-pointer font-medium"
            >
              Few-Shot Exemplars
            </button>
            <button
              onClick={() => setIsCitationModalOpen(true)}
              className="hover:text-[#172554] transition-colors cursor-pointer font-medium"
            >
              APA / IEEE Formatter
            </button>
          </div>
        </div>
      </footer>

      {/* Few-Shot Prompting Showcase Modal */}
      <FewShotShowcase
        isOpen={isFewShotOpen}
        onClose={() => setIsFewShotOpen(false)}
        onSelectExample={handleSelectExample}
      />

      {/* Citation Assistant Modal */}
      <CitationAssistantModal
        isOpen={isCitationModalOpen}
        onClose={() => setIsCitationModalOpen(false)}
        literature={paper?.literature || null}
        currentStyle={paper?.citationStyle || citationStyle}
        onChangeStyle={handleChangeCitationStyle}
      />

      {/* Academic Tone & Flow Editor Modal */}
      <AcademicEditorModal
        isOpen={editorModalData.isOpen}
        onClose={() => setEditorModalData({ ...editorModalData, isOpen: false })}
        initialText={editorModalData.text}
        sectionTitle={editorModalData.sectionTitle}
        academicLevel={paper?.academicLevel || academicLevel}
        onApplyRevisedText={handleApplyRevisedText}
      />
    </div>
  );
}
