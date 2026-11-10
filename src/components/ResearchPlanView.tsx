/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  FileText,
  Target,
  ArrowRight,
  ListOrdered,
  Clock,
  CheckCircle2,
  BookOpen,
  RefreshCw,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { ResearchPlan } from '../types/research.ts';

interface ResearchPlanViewProps {
  topic: string;
  plan: ResearchPlan | null;
  onProceedToLiterature: () => void;
  onProceedToPaper: () => void;
  onRegeneratePlan: () => void;
  isLoading: boolean;
}

export const ResearchPlanView: React.FC<ResearchPlanViewProps> = ({
  topic,
  plan,
  onProceedToLiterature,
  onProceedToPaper,
  onRegeneratePlan,
  isLoading,
}) => {
  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#172554]">No Research Plan Generated</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
          Complete topic analysis first to formulate the working hypothesis, research questions, and structured manuscript outline.
        </p>
      </div>
    );
  }

  const totalWords = plan.outline.reduce((acc, curr) => acc + curr.estimatedWordCount, 0);

  return (
    <div className="w-full space-y-6 pb-12">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9E7FF] border border-[#D8D4FF] text-xs font-semibold text-[#172554]">
              <FileText className="w-3.5 h-3.5 text-[#3659C9]" />
              <span>Step 2 of 5: Objectives, Questions & Section Blueprint</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#172554] leading-tight">
              Research Plan & Structural Blueprint
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
              <span className="font-semibold text-slate-700">Allocated Length: ~{totalWords.toLocaleString()} words</span>
              <span>·</span>
              <span>{plan.researchQuestions.length} Formulated RQs</span>
              <span>·</span>
              <span>{plan.outline.length} Standard Sections</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onRegeneratePlan}
              disabled={isLoading}
              className="h-10 px-4 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Re-Generate</span>
            </button>
            <button
              onClick={onProceedToLiterature}
              className="h-10 px-4.5 text-xs font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] active:scale-98 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Literature & Gaps</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E9E7FF]" />
            </button>
          </div>
        </div>

        {/* Central Thesis Statement */}
        <div className="p-6 bg-gradient-to-r from-[#F8F9FE] via-white to-[#F8F9FE] rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172554]">
            <Target className="w-4 h-4 text-[#3659C9]" />
            <span>Central Working Thesis Statement / Core Hypothesis</span>
          </div>
          <p className="text-sm sm:text-base font-paper italic text-[#202938] leading-relaxed pl-1">
            &ldquo;{plan.thesisStatement}&rdquo;
          </p>
        </div>

        {/* 2-Column: Objectives vs. Research Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Objectives Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172554]">
                <Target className="w-4 h-4 text-[#3659C9]" />
                <span>Primary Research Objective</span>
              </div>
              <div className="p-4 bg-[#F8F9FE] border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-800 font-semibold leading-relaxed shadow-2xs">
                {plan.primaryObjective}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172554]">
                <ListOrdered className="w-4 h-4 text-[#3659C9]" />
                <span>Secondary Specific Inquiries</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {plan.secondaryObjectives.map((obj, i) => (
                  <li
                    key={i}
                    className="p-3.5 bg-white border border-slate-200/90 rounded-xl flex items-start gap-3 hover:border-slate-300 transition-colors shadow-2xs"
                  >
                    <span className="font-mono text-[#172554] text-[11px] font-bold bg-[#E9E7FF] border border-[#D8D4FF] px-2 py-0.5 rounded-md shrink-0">
                      S.0{i + 1}
                    </span>
                    <span className="leading-relaxed font-medium text-slate-800">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Research Questions Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172554]">
              <HelpCircle className="w-4 h-4 text-[#3659C9]" />
              <span>Formulated Research Questions (RQs)</span>
            </div>
            <div className="space-y-3">
              {plan.researchQuestions.map((rq, idx) => (
                <div
                  key={rq.id || idx}
                  className="p-4 bg-white border border-slate-200/90 rounded-xl space-y-2 shadow-2xs hover:border-[#3659C9]/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#172554] bg-[#E9E7FF] border border-[#D8D4FF] px-2.5 py-0.5 rounded-md">
                      {rq.id || `RQ${idx + 1}`}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {rq.type} inquiry
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] font-medium text-slate-800 leading-relaxed">
                    {rq.question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hierarchical Manuscript Outline Breakdown */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172554]">
              <Layers className="w-4 h-4 text-[#3659C9]" />
              <span>Hierarchical 7-Section Manuscript Blueprint</span>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Total Target: ~{totalWords.toLocaleString()} words
            </div>
          </div>

          <div className="space-y-3">
            {plan.outline.map((sec, sIdx) => (
              <div
                key={sec.sectionKey || sIdx}
                className="p-4.5 bg-[#F8F9FE] border border-slate-200 rounded-xl space-y-2.5 shadow-2xs hover:bg-white hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] font-bold text-[#172554] bg-[#E9E7FF] border border-[#D8D4FF] px-2 py-0.5 rounded-md">
                      0{sIdx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-[#172554]">
                      {sec.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>~{sec.estimatedWordCount} words</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium pl-8">
                  {sec.description}
                </p>

                {sec.subsections && sec.subsections.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pl-8 pt-1">
                    {sec.subsections.map((sub, subIdx) => (
                      <span
                        key={subIdx}
                        className="text-[11px] font-medium text-slate-700 bg-white border border-slate-200/80 px-2.5 py-0.5 rounded-md shadow-2xs"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-medium">
            Outline structured in strict compliance with university IMRaD standards.
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onProceedToPaper}
              className="w-full sm:w-auto h-10 px-4 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Skip to Paper Studio
            </button>
            <button
              onClick={onProceedToLiterature}
              className="w-full sm:w-auto h-10 px-5 text-xs font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] active:scale-98 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next: Literature & Gaps</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E9E7FF]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
