/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  BookOpen,
  Layers,
  Lightbulb,
  ChevronRight,
} from 'lucide-react';
import { FEW_SHOT_EXAMPLES } from '../data/fewShotExamples.ts';
import { FewShotExample } from '../types/research.ts';

interface FewShotShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExample: (example: FewShotExample) => void;
}

export const FewShotShowcase: React.FC<FewShotShowcaseProps> = ({
  isOpen,
  onClose,
  onSelectExample,
}) => {
  const [selectedId, setSelectedId] = useState<string>(FEW_SHOT_EXAMPLES[0].id);

  if (!isOpen) return null;

  const currentExample =
    FEW_SHOT_EXAMPLES.find((e) => e.id === selectedId) || FEW_SHOT_EXAMPLES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200/80 flex items-center justify-between bg-gradient-to-r from-slate-50 via-[#E9E7FF]/30 to-slate-50">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#172554]">
              <Sparkles className="w-4 h-4 text-[#3659C9]" />
              <span>Prompt Engineering Technique</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#172554]">
              Few-Shot In-Context Prompting Guide
            </h2>
            <p className="text-xs text-slate-500">
              Structured exemplars transforming general topics into peer-reviewed research outlines.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Example Selector Tabs */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Curated Exemplars
            </span>

            <div className="space-y-2">
              {FEW_SHOT_EXAMPLES.map((ex, index) => {
                const isSelected = selectedId === ex.id;
                return (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedId(ex.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs cursor-pointer ${
                      isSelected
                        ? 'border-[#172554] bg-[#F8F9FE] text-[#172554] shadow-xs ring-1 ring-[#172554]/10'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#3659C9]">Exemplar {index + 1}</span>
                      {isSelected && <ChevronRight className="w-4 h-4 text-[#172554]" />}
                    </div>
                    <div className="font-bold text-[#172554] text-sm mt-1">{ex.topic}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">{ex.domain}</div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 bg-[#F8F9FE] rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5 mt-3">
              <div className="font-bold text-[#172554] flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>The Few-Shot Advantage</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Without few-shot exemplars, AI models often output generic summaries. Supplying calibrated models primes specific academic behaviors: nuanced sub-theses, clinical/empirical metrics, methodological gap identification, and balanced counter-arguments.
              </p>
            </div>
          </div>

          {/* Detailed Exemplar Flow: Input -> Expected Output */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Input Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#172554] uppercase tracking-wider">
                    Model Input Topic
                  </span>
                  <span className="text-[10px] font-mono font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                    Input String
                  </span>
                </div>
                <div className="text-lg font-bold font-display text-[#172554]">
                  &ldquo;{currentExample.topic}&rdquo;
                </div>
                <div className="text-xs text-slate-600 leading-relaxed pt-0.5">
                  {currentExample.summary}
                </div>
              </div>

              {/* Expected Output Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-[#3659C9]" />
                    <span>Expected Structured Research Outline</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {currentExample.expectedOutline.length} Core Sections
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {currentExample.expectedOutline.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1 shadow-2xs"
                    >
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-[#E9E7FF] text-[#172554] font-mono text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{sec.title}</span>
                      </div>
                      <ul className="pl-7 space-y-1 list-disc text-slate-600 text-[11px]">
                        {sec.points.map((pt, pIdx) => (
                          <li key={pIdx} className="leading-relaxed">{pt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Research Questions */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-[#3659C9]" />
                  <span>Calibrated Research Questions</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {currentExample.sampleResearchQuestions.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-800 flex items-start gap-2"
                    >
                      <span className="font-bold font-mono text-[#172554] bg-[#E9E7FF] px-1.5 py-0.5 rounded text-[10px] shrink-0">
                        RQ{qIdx + 1}
                      </span>
                      <span className="leading-relaxed font-medium">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="h-10 px-4 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Close Guide
              </button>
              <button
                onClick={() => {
                  onSelectExample(currentExample);
                  onClose();
                }}
                className="h-10 px-4.5 text-xs font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] active:scale-98 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Use This Exemplar in Workspace</span>
                <ArrowRight className="w-4 h-4 text-[#E9E7FF]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
