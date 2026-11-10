/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Quote,
  Clock,
  Loader2,
  FileCheck,
  CheckCircle2,
  Lightbulb,
  Compass,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { AcademicLevel, WordCountTarget, CitationStyle } from '../types/research.ts';
import { FEW_SHOT_EXAMPLES } from '../data/fewShotExamples.ts';

interface TopicSetupFormProps {
  topic: string;
  setTopic: (topic: string) => void;
  academicLevel: AcademicLevel;
  setAcademicLevel: (level: AcademicLevel) => void;
  wordCountTarget: WordCountTarget;
  setWordCountTarget: (target: WordCountTarget) => void;
  citationStyle: CitationStyle;
  setCitationStyle: (style: CitationStyle) => void;
  onGenerate: (mode: 'full' | 'step-by-step') => void;
  isLoading: boolean;
  loadingStepText: string;
  onOpenFewShotModal: () => void;
}

const ACADEMIC_LEVELS: AcademicLevel[] = [
  'High School / AP Capstone',
  'Undergraduate (BA / BS)',
  'Master\'s / Graduate (MA / MS)',
  'PhD / Doctoral',
  'Postdoctoral / Peer-Reviewed Journal',
];

const WORD_COUNTS: WordCountTarget[] = [
  '1500 words (Brief / Short Paper)',
  '3000 words (Standard Conference / Journal)',
  '5000 words (Extended Research Manuscript)',
  '8000 words (Comprehensive Thesis Chapter)',
];

const CITATION_STYLES: CitationStyle[] = [
  'APA 7th Edition',
  'IEEE Format',
  'MLA 9th Edition',
  'Chicago Author-Date',
  'Harvard',
];

export const TopicSetupForm: React.FC<TopicSetupFormProps> = ({
  topic,
  setTopic,
  academicLevel,
  setAcademicLevel,
  wordCountTarget,
  setWordCountTarget,
  citationStyle,
  setCitationStyle,
  onGenerate,
  isLoading,
  loadingStepText,
  onOpenFewShotModal,
}) => {
  const [generationMode, setGenerationMode] = useState<'full' | 'step-by-step'>('full');
  const [isFewShotExpanded, setIsFewShotExpanded] = useState<boolean>(true);

  const handleSelectPreset = (presetTopic: string) => {
    setTopic(presetTopic);
  };

  return (
    <div className="w-full space-y-8 pb-12">
      {/* 1. Hero Section: Clean, Centred, Balanced Typography */}
      <div className="text-center space-y-3.5 pt-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E9E7FF] border border-[#D8D4FF] text-xs font-semibold text-[#172554] shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#3659C9]" />
          <span className="font-bold">ResearchMate</span>
          <span className="text-[#3659C9]/40">·</span>
          <span className="text-[#3659C9] font-medium">Your Ideas. Your Research. Your Way.</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold font-display text-[#172554] tracking-tight leading-tight text-balance">
          Turn Your Ideas Into Meaningful Research.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance">
          From research topic discovery to structured academic manuscripts, ResearchMate helps you develop better research with clarity and confidence.
        </p>
      </div>

      {/* 2. Few-Shot Prompting Section: Compact, Professional Information Card */}
      <div className="bg-gradient-to-br from-[#172554] via-[#1a2c68] to-[#172554] text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-blue-950/80 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-md bg-[#3659C9]/40 border border-[#3659C9]/60 text-[11px] font-bold uppercase tracking-wider text-[#E9E7FF]">
                Powered by Few-Shot Prompting
              </span>
              <span className="text-xs text-slate-300 hidden md:inline">
                In-Context Exemplar Calibrations
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFewShotExpanded(!isFewShotExpanded)}
                className="text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-expanded={isFewShotExpanded}
              >
                <span>{isFewShotExpanded ? 'Collapse' : 'Expand'}</span>
                {isFewShotExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={onOpenFewShotModal}
                className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explore Exemplars</span>
                <ArrowRight className="w-3 h-3 text-[#E9E7FF]" />
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed max-w-3xl">
            Calibrated academic examples guide the AI in decomposing broad subjects into rigorous research questions, empirical metrics, theoretical frameworks, and verified literature gaps.
          </p>

          {isFewShotExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 animate-in fade-in-50 duration-150">
              {/* Example 1 Card */}
              <div className="bg-white/7 border border-white/12 rounded-xl p-4 text-xs space-y-2 backdrop-blur-xs flex flex-col justify-between">
                <div>
                  <div className="text-[11px] uppercase font-mono tracking-wider text-[#E9E7FF] font-bold mb-1">
                    Exemplar 1: Biomedical & AI
                  </div>
                  <div className="text-white font-medium">
                    <span className="text-[#93c5fd] font-bold">Input:</span> &ldquo;Artificial Intelligence in Healthcare&rdquo;
                  </div>
                </div>
                <div className="text-slate-300 text-xs leading-relaxed pt-1 border-t border-white/10">
                  <span className="text-[#93c5fd] font-bold">Expected Output:</span> A structured research outline covering AI applications in diagnosis, clinical benefits, computational challenges, bioethical liability, and future scope.
                </div>
              </div>

              {/* Example 2 Card */}
              <div className="bg-white/7 border border-white/12 rounded-xl p-4 text-xs space-y-2 backdrop-blur-xs flex flex-col justify-between">
                <div>
                  <div className="text-[11px] uppercase font-mono tracking-wider text-[#E9E7FF] font-bold mb-1">
                    Exemplar 2: Education & Social Science
                  </div>
                  <div className="text-white font-medium">
                    <span className="text-[#93c5fd] font-bold">Input:</span> &ldquo;Impact of Social Media on Student Learning&rdquo;
                  </div>
                </div>
                <div className="text-slate-300 text-xs leading-relaxed pt-1 border-t border-white/10">
                  <span className="text-[#93c5fd] font-bold">Expected Output:</span> A structured research outline covering learning habits, academic GPA correlations, collaborative benefits, psychological disadvantages, and longitudinal literature gaps.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Central Research Topic Setup Form Card: Pure White, Structured */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-9 shadow-xs space-y-9">
        {/* SECTION A – RESEARCH TOPIC */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display text-[#172554] flex items-center gap-2">
              <span className="text-sm font-sans font-bold text-[#3659C9] tracking-wider uppercase">01.</span>
              <span>Define Your Research Topic</span>
            </h2>
            <p className="text-sm text-slate-600">
              Specify your primary research inquiry, working title, or comparative hypothesis.
            </p>
          </div>

          <div className="relative">
            <input
              id="research-topic-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Artificial Intelligence in Healthcare: Diagnostic Accuracy, Clinical Utility, and Ethical Governance"
              className="w-full h-13 pl-4 pr-16 text-sm sm:text-base text-[#202938] bg-slate-50/70 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3659C9]/25 focus:border-[#3659C9] transition-all shadow-2xs placeholder:text-slate-400 font-medium"
            />
            {topic && (
              <button
                type="button"
                onClick={() => setTopic('')}
                className="absolute right-3.5 top-3.5 px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/50 transition-colors cursor-pointer"
                title="Clear topic input"
              >
                Clear
              </button>
            )}
          </div>

          {/* Recommended Topics / Chips */}
          <div className="pt-1 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Recommended Topics (Click to select):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {FEW_SHOT_EXAMPLES.map((ex) => {
                const isSelected = topic === ex.topic;
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => handleSelectPreset(ex.topic)}
                    className={`text-xs px-3.5 py-2 rounded-xl border transition-all text-left cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#172554] text-white border-[#172554] shadow-xs font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <span>{ex.topic}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#E9E7FF]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION B – ACADEMIC PREFERENCES */}
        <div className="pt-2 border-t border-slate-100 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display text-[#172554] flex items-center gap-2">
              <span className="text-sm font-sans font-bold text-[#3659C9] tracking-wider uppercase">02.</span>
              <span>Set Your Academic Preferences</span>
            </h2>
            <p className="text-sm text-slate-600">
              Configure target scholarly rigor, manuscript length, and bibliographic citation standard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Academic Level */}
            <div className="p-5 bg-[#F8F9FE] border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <label
                  htmlFor="academic-level-select"
                  className="flex items-center gap-2 text-sm font-bold text-[#172554]"
                >
                  <GraduationCap className="w-4 h-4 text-[#3659C9]" />
                  <span>Academic Level</span>
                </label>
                <select
                  id="academic-level-select"
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                  className="w-full h-11 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#202938] bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3659C9]/25 focus:border-[#3659C9] transition-all cursor-pointer shadow-2xs"
                >
                  {ACADEMIC_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500 leading-normal">
                Calibrates scholarly vocabulary, research methodology, and conceptual depth.
              </p>
            </div>

            {/* Card 2: Target Word Count */}
            <div className="p-5 bg-[#F8F9FE] border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <label
                  htmlFor="word-count-select"
                  className="flex items-center gap-2 text-sm font-bold text-[#172554]"
                >
                  <Clock className="w-4 h-4 text-[#3659C9]" />
                  <span>Target Word Count</span>
                </label>
                <select
                  id="word-count-select"
                  value={wordCountTarget}
                  onChange={(e) => setWordCountTarget(e.target.value as WordCountTarget)}
                  className="w-full h-11 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#202938] bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3659C9]/25 focus:border-[#3659C9] transition-all cursor-pointer shadow-2xs"
                >
                  {WORD_COUNTS.map((wc) => (
                    <option key={wc} value={wc}>
                      {wc}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500 leading-normal">
                Distributes word quotas proportionally across all 7 standard IMRaD sections.
              </p>
            </div>

            {/* Card 3: Citation Style */}
            <div className="p-5 bg-[#F8F9FE] border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <label
                  htmlFor="citation-style-select"
                  className="flex items-center gap-2 text-sm font-bold text-[#172554]"
                >
                  <Quote className="w-4 h-4 text-[#3659C9]" />
                  <span>Citation Style</span>
                </label>
                <select
                  id="citation-style-select"
                  value={citationStyle}
                  onChange={(e) => setCitationStyle(e.target.value as CitationStyle)}
                  className="w-full h-11 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#202938] bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3659C9]/25 focus:border-[#3659C9] transition-all cursor-pointer shadow-2xs"
                >
                  {CITATION_STYLES.map((cs) => (
                    <option key={cs} value={cs}>
                      {cs}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500 leading-normal">
                Enforces bibliography rules and verified in-text citations.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION C – EXECUTION MODE */}
        <div className="pt-2 border-t border-slate-100 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display text-[#172554] flex items-center gap-2">
              <span className="text-sm font-sans font-bold text-[#3659C9] tracking-wider uppercase">03.</span>
              <span>Choose Your Research Workflow</span>
            </h2>
            <p className="text-sm text-slate-600">
              Select your preferred generation approach for this academic project.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Card 1: Complete Manuscript */}
            <div
              onClick={() => setGenerationMode('full')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                generationMode === 'full'
                  ? 'border-[#172554] bg-[#F8F9FE] shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      generationMode === 'full'
                        ? 'bg-[#172554] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-[#172554]">
                      Complete Manuscript
                    </div>
                    <div className="text-[11px] font-medium text-slate-500">
                      All-in-One Autonomous Generation
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    generationMode === 'full'
                      ? 'border-[#172554] bg-[#172554]'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {generationMode === 'full' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically executes topic analysis, research questions, search-grounded literature review, and writes all 7 structured sections end-to-end.
              </p>
            </div>

            {/* Card 2: Step-by-Step Guided */}
            <div
              onClick={() => setGenerationMode('step-by-step')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                generationMode === 'step-by-step'
                  ? 'border-[#172554] bg-[#F8F9FE] shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      generationMode === 'step-by-step'
                        ? 'bg-[#172554] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-[#172554]">
                      Step-by-Step Guided
                    </div>
                    <div className="text-[11px] font-medium text-slate-500">
                      Iterative Section Review
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    generationMode === 'step-by-step'
                      ? 'border-[#172554] bg-[#172554]'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {generationMode === 'step-by-step' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Step sequentially through Topic Analysis, Research Plan & RQs, Literature & Gaps review, and then generate or edit sections individually.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION D – GENERATION BUTTON */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onGenerate(generationMode)}
            disabled={!topic.trim() || isLoading}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#3659C9] hover:from-[#131d45] hover:via-[#19327a] hover:to-[#2e4eae] active:scale-[0.99] text-white font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ring-1 ring-blue-950/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#E9E7FF]" />
                <span className="font-semibold text-white tracking-wide">
                  {loadingStepText || 'Synthesizing Academic Research...'}
                </span>
              </>
            ) : (
              <>
                <FileCheck className="w-5 h-5 text-[#E9E7FF]" />
                <span className="tracking-wide">Generate Research Paper</span>
                <ArrowRight className="w-5 h-5 ml-1 text-[#E9E7FF]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Supporting Academic Rigor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs text-slate-600">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="font-bold text-[#172554] text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Search-Grounded Citations</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            All citations and literature reviews reference genuine peer-reviewed studies (Nature, Lancet, JAMA, IEEE), eliminating fabricated authors or fake DOIs.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="font-bold text-[#172554] text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#3659C9] shrink-0" />
            <span>Rigorous IMRaD Blueprint</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Standard 7-section architecture: Abstract, Introduction, Literature Review, Methodology, Results/Discussion, Conclusion, and References.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="font-bold text-[#172554] text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Academic Tone Polish</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            In-place evaluation for grammar, academic tone, epistemic hedging, and seamless logical transitions between arguments.
          </p>
        </div>
      </div>
    </div>
  );
};
