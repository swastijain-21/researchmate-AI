/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AcademicLevel = 
  | 'High School / AP Capstone'
  | 'Undergraduate (BA / BS)'
  | 'Master\'s / Graduate (MA / MS)'
  | 'PhD / Doctoral'
  | 'Postdoctoral / Peer-Reviewed Journal';

export type WordCountTarget = 
  | '1500 words (Brief / Short Paper)'
  | '3000 words (Standard Conference / Journal)'
  | '5000 words (Extended Research Manuscript)'
  | '8000 words (Comprehensive Thesis Chapter)';

export type CitationStyle = 'APA 7th Edition' | 'IEEE Format' | 'MLA 9th Edition' | 'Chicago Author-Date' | 'Harvard';

export interface TopicAnalysis {
  mainSubject: string;
  fieldOfStudy: string;
  coreObjectives: string[];
  scope: {
    included: string[];
    excluded: string[];
    targetContext: string;
  };
  keyThemes: string[];
  suggestedMethodology: string;
}

export interface ResearchPlan {
  thesisStatement: string;
  primaryObjective: string;
  secondaryObjectives: string[];
  researchQuestions: {
    id: string;
    question: string;
    type: 'descriptive' | 'analytical' | 'evaluative' | 'exploratory';
  }[];
  outline: {
    sectionKey: string;
    title: string;
    subsections: string[];
    estimatedWordCount: number;
    description: string;
  }[];
}

export interface LiteratureItem {
  title: string;
  authors: string;
  year: string;
  venueOrPublisher: string;
  summary: string;
  keyFindings: string;
  identifiedGap: string;
  doiOrUrl?: string;
}

export interface LiteratureReviewData {
  summary: string;
  synthesizedThemes: {
    theme: string;
    findings: string;
    sources: string;
  }[];
  researchGaps: string[];
  groundedSources: {
    title: string;
    url: string;
    snippet?: string;
  }[];
  literatureItems: LiteratureItem[];
}

export interface PaperSection {
  key: 'abstract' | 'introduction' | 'literature_review' | 'methodology' | 'results_discussion' | 'conclusion' | 'references';
  title: string;
  content: string;
  wordCount: number;
  lastUpdated?: string;
}

export interface ResearchPaper {
  id: string;
  topic: string;
  academicLevel: AcademicLevel;
  wordCountTarget: WordCountTarget;
  citationStyle: CitationStyle;
  analysis: TopicAnalysis;
  plan: ResearchPlan;
  literature: LiteratureReviewData;
  sections: Record<string, PaperSection>;
  createdAt: string;
  updatedAt: string;
}

export interface EditSuggestion {
  originalText: string;
  revisedText: string;
  academicScoreBefore: number;
  academicScoreAfter: number;
  feedback: {
    category: 'Grammar & Syntax' | 'Academic Tone' | 'Clarity & Conciseness' | 'Logical Flow & Transitions';
    explanation: string;
  }[];
}

export interface FewShotExample {
  id: string;
  topic: string;
  domain: string;
  summary: string;
  expectedOutline: {
    title: string;
    points: string[];
  }[];
  sampleResearchQuestions: string[];
}
