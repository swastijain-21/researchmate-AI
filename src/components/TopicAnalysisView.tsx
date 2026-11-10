/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Compass,
  Target,
  Layers,
  CheckCircle2,
  XCircle,
  FlaskConical,
  ArrowRight,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { TopicAnalysis } from '../types/research.ts';

interface TopicAnalysisViewProps {
  topic: string;
  analysis: TopicAnalysis | null;
  onProceedToPlan: () => void;
  onRegenerateAnalysis: () => void;
  isLoading: boolean;
}

export const TopicAnalysisView: React.FC<TopicAnalysisViewProps> = ({
  topic,
  analysis,
  onProceedToPlan,
  onRegenerateAnalysis,
  isLoading,
}) => {
  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#172554]">No Topic Analysis Available</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
          Submit your research topic in the Topic Setup section to perform an initial subject, objective, and scope analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Stage Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9E7FF] border border-[#D8D4FF] text-xs font-semibold text-[#172554]">
              <Compass className="w-3.5 h-3.5 text-[#3659C9]" />
              <span>Step 1 of 5: Topic Analysis & Scope Delimitation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#172554] leading-tight">
              {topic}
            </h2>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <span className="font-semibold text-slate-800">Disciplinary Field:</span>
              <span className="text-[#172554] font-semibold bg-[#E9E7FF]/70 px-2.5 py-0.5 rounded-md border border-[#D8D4FF]">
                {analysis.fieldOfStudy}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onRegenerateAnalysis}
              disabled={isLoading}
              className="h-10 px-4 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Re-Analyze</span>
            </button>
            <button
              onClick={onProceedToPlan}
              className="h-10 px-4.5 text-xs font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] active:scale-98 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Research Plan</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E9E7FF]" />
            </button>
          </div>
        </div>

        {/* 2-Column Content Grid: Subject & Objectives vs. Scope */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Primary Subject & Objectives */}
          <div className="space-y-5">
            <div className="p-5 bg-[#F8F9FE] rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172554]">
                <Compass className="w-4 h-4 text-[#3659C9]" />
                <span>Primary Subject & Problem Domain</span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
                {analysis.mainSubject}
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172554]">
                <Target className="w-4 h-4 text-[#3659C9]" />
                <span>Core Research Objectives</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {analysis.coreObjectives.map((obj, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <span className="font-bold text-[#172554] font-mono text-[11px] bg-[#E9E7FF] border border-[#D8D4FF] px-2 py-0.5 rounded-md shrink-0">
                      0{i + 1}
                    </span>
                    <span className="leading-relaxed font-medium text-slate-800">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: In-Scope vs. Out-of-Scope Delimitations */}
          <div className="space-y-5">
            {/* In-Scope */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172554]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>In-Scope Parameters (Included)</span>
              </div>
              <ul className="space-y-2 text-xs">
                {analysis.scope.included.map((inc, i) => (
                  <li
                    key={i}
                    className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span className="leading-relaxed font-medium">{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Out-of-Scope */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172554]">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Out-of-Scope Boundaries (Delimited Exclusions)</span>
              </div>
              <ul className="space-y-2 text-xs">
                {analysis.scope.excluded.map((exc, i) => (
                  <li
                    key={i}
                    className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl text-xs text-rose-950 flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                    <span className="leading-relaxed font-medium">{exc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Population / Context */}
            <div className="p-4 bg-[#F8F9FE] border border-slate-200/80 rounded-xl text-xs space-y-1">
              <div className="font-bold text-[#172554] text-[11px] uppercase tracking-wider">
                Target Context & Demographic Scope
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {analysis.scope.targetContext}
              </p>
            </div>
          </div>
        </div>

        {/* Footer: Thematic Pillars & Recommended Methodology */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172554]">
              <Layers className="w-4 h-4 text-[#3659C9]" />
              <span>Key Thematic Pillars</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.keyThemes.map((theme, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold text-[#172554] bg-[#E9E7FF]/60 border border-[#D8D4FF] px-3 py-1 rounded-lg"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172554]">
              <FlaskConical className="w-4 h-4 text-[#3659C9]" />
              <span>Recommended Research Design</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium p-3.5 bg-[#F8F9FE] rounded-xl border border-slate-200/70">
              {analysis.suggestedMethodology}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
