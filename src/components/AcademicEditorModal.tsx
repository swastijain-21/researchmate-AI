/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { AcademicLevel, EditSuggestion } from '../types/research.ts';

interface AcademicEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  sectionTitle: string;
  academicLevel: AcademicLevel;
  onApplyRevisedText: (revised: string) => void;
}

export const AcademicEditorModal: React.FC<AcademicEditorModalProps> = ({
  isOpen,
  onClose,
  initialText,
  sectionTitle,
  academicLevel,
  onApplyRevisedText,
}) => {
  const [inputText, setInputText] = useState<string>(initialText);
  const [focusArea, setFocusArea] = useState<string>(
    'Comprehensive (Grammar, Tone, Clarity, and Flow)'
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<EditSuggestion | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'comparison' | 'feedback'>('comparison');

  if (!isOpen) return null;

  const handleRunEdit = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/academic-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          focusArea,
          academicLevel,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuggestion(data);
      } else {
        alert(data.error || 'Failed to edit text');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error contacting academic editing agent');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200/80 flex items-center justify-between bg-gradient-to-r from-slate-50 via-[#E9E7FF]/30 to-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#172554]">
              <Sparkles className="w-4 h-4 text-[#3659C9]" />
              <span>Academic Tone & Style Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#172554] mt-0.5">
              Review & Polish: {sectionTitle}
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              Refines scholarly register, epistemic hedging, conciseness, and transitions.
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#F8F9FE] rounded-xl border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-[#172554]">Analytical Focus:</span>
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3659C9]/20 focus:border-[#3659C9] cursor-pointer shadow-2xs"
              >
                <option value="Comprehensive (Grammar, Tone, Clarity, and Flow)">
                  Comprehensive (All Criteria)
                </option>
                <option value="Academic Tone & Epistemic Hedging">
                  Academic Tone & Epistemic Hedging
                </option>
                <option value="Logical Flow & Transitions">
                  Logical Flow & Argumentative Transitions
                </option>
                <option value="Grammar, Punctuation & Precision">
                  Grammar, Punctuation & Syntax Precision
                </option>
              </select>
            </div>

            <button
              onClick={handleRunEdit}
              disabled={isLoading || !inputText.trim()}
              className="h-9 px-4 text-xs font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Evaluating Prose...' : 'Evaluate & Polish'}</span>
            </button>
          </div>

          {/* Result Scorecard and Side-by-Side Review */}
          {suggestion && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              {/* Scorecard Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-gradient-to-r from-[#172554] via-[#1a2c68] to-[#172554] text-white rounded-2xl shadow-sm border border-blue-950/80">
                <div className="space-y-0.5">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Initial Rigor Score
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-300">
                    {suggestion.academicScoreBefore} <span className="text-xs text-slate-500">/100</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Polished Rigor Score</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    {suggestion.academicScoreAfter} <span className="text-xs text-emerald-600">/100</span>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => {
                      onApplyRevisedText(suggestion.revisedText);
                      onClose();
                    }}
                    className="w-full sm:w-auto h-10 px-4.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply Revised Text</span>
                  </button>
                </div>
              </div>

              {/* View Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'comparison'
                      ? 'border-[#172554] text-[#172554] font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Side-by-Side Review
                </button>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'feedback'
                      ? 'border-[#172554] text-[#172554] font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Linguistic Feedback ({suggestion.feedback.length})
                </button>
              </div>

              {activeTab === 'comparison' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Original Draft */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Original Draft
                    </div>
                    <div className="p-4.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl font-paper text-xs sm:text-sm text-slate-700 leading-relaxed max-h-80 overflow-y-auto whitespace-pre-wrap">
                      {suggestion.originalText}
                    </div>
                  </div>

                  {/* Polished Academic Revision */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#172554] uppercase tracking-wider">
                        Polished Academic Revision
                      </span>
                      <button
                        onClick={() => handleCopy(suggestion.revisedText)}
                        className="text-xs text-[#3659C9] hover:text-[#172554] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-4.5 bg-white border border-[#D8D4FF] rounded-2xl font-paper text-xs sm:text-sm text-slate-900 leading-relaxed max-h-80 overflow-y-auto whitespace-pre-wrap shadow-2xs">
                      {suggestion.revisedText}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {suggestion.feedback.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#F8F9FE] border border-slate-200/80 rounded-xl text-xs space-y-1.5"
                    >
                      <span className="font-bold text-[#172554] font-sans-ui block text-xs">
                        {item.category}
                      </span>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {item.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Input text box (when no suggestion or to re-edit input) */}
          {!suggestion && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#172554] uppercase tracking-wider">
                Text to Analyze & Polish
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={12}
                className="w-full p-4.5 text-xs sm:text-sm font-paper text-slate-900 bg-slate-50/60 border border-slate-300 rounded-2xl leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3659C9]/20 focus:border-[#3659C9] shadow-2xs"
                placeholder="Paste paragraph or section content here..."
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4.5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Academic Standard: {academicLevel}
          </div>
          <div className="flex items-center gap-2.5">
            {suggestion && (
              <button
                onClick={() => setSuggestion(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Reset / Try Another Text
              </button>
            )}
            <button
              onClick={onClose}
              className="h-10 px-5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
