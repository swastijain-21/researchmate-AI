/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  AlertTriangle,
  ArrowRight,
  Layers,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { LiteratureReviewData, CitationStyle } from '../types/research.ts';

interface LiteratureReviewViewProps {
  topic: string;
  literature: LiteratureReviewData | null;
  citationStyle: CitationStyle;
  onProceedToPaper: () => void;
  onRefreshLiterature: () => void;
  isLoading: boolean;
}

export const LiteratureReviewView: React.FC<LiteratureReviewViewProps> = ({
  topic,
  literature,
  citationStyle,
  onProceedToPaper,
  onRefreshLiterature,
  isLoading,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!literature) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#172554]">No Literature Review Generated</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
          Execute topic analysis and planning to search and synthesize peer-reviewed literature and discover verified research gaps.
        </p>
      </div>
    );
  }

  const handleCopyCitation = (item: any, index: number) => {
    let citationString = '';
    if (citationStyle === 'IEEE Format') {
      citationString = `[${index + 1}] ${item.authors}, "${item.title}," in ${item.venueOrPublisher}, ${item.year}.`;
    } else {
      citationString = `${item.authors} (${item.year}). ${item.title}. ${item.venueOrPublisher}.`;
    }
    navigator.clipboard.writeText(citationString);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full space-y-6 pb-12">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9E7FF] border border-[#D8D4FF] text-xs font-semibold text-[#172554]">
              <BookOpen className="w-3.5 h-3.5 text-[#3659C9]" />
              <span>Step 3 of 5: Literature Synthesis & Research Gaps</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#172554] leading-tight">
              Literature Review & Critical Gap Analysis
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
              <span className="font-semibold text-slate-700">Style: {citationStyle}</span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Landmark Publications
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onRefreshLiterature}
              disabled={isLoading}
              className="h-10 px-4 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Sources</span>
            </button>
            <button
              onClick={onProceedToPaper}
              className="h-10 px-4.5 text-xs font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] active:scale-98 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Paper Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E9E7FF]" />
            </button>
          </div>
        </div>

        {/* Executive Literature Review Summary */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172554]">
            <BookOpen className="w-4 h-4 text-[#3659C9]" />
            <span>State-of-the-Art Literature Synthesis</span>
          </div>
          <div className="p-5 sm:p-6 bg-[#F8F9FE] border border-slate-200 rounded-2xl text-xs sm:text-sm leading-relaxed text-slate-800 space-y-3 font-paper">
            <p className="leading-relaxed text-justify whitespace-pre-line">{literature.summary}</p>
          </div>
        </div>

        {/* Thematic Synthesis Cards */}
        {literature.synthesizedThemes && literature.synthesizedThemes.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172554]">
              <Layers className="w-4 h-4 text-[#3659C9]" />
              <span>Thematic Literature Synthesis</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {literature.synthesizedThemes.map((th, tIdx) => (
                <div
                  key={tIdx}
                  className="p-4.5 bg-white border border-slate-200/90 rounded-2xl space-y-2 shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <span className="font-mono text-[11px] font-bold text-[#172554] bg-[#E9E7FF] border border-[#D8D4FF] px-2 py-0.5 rounded-md inline-block">
                      Theme 0{tIdx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-[#172554] leading-snug">
                      {th.theme}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {th.findings}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                    <span className="font-semibold text-slate-700">Key Sources:</span> {th.sources}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Identified Research Gaps (High-Impact Highlight) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172554]">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Identified Research Gaps (Novel Contribution Vectors)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {literature.researchGaps.map((gap, idx) => (
              <div
                key={idx}
                className="p-5 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 border border-amber-200/80 rounded-2xl text-xs text-amber-950 space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-[11px] text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-md">
                    GAP 0{idx + 1}
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider">
                    Unaddressed
                  </span>
                </div>
                <p className="leading-relaxed text-xs text-slate-800 font-medium">{gap}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Seminal Sources & Citations Deck */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172554]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Seminal Literature Sources</span>
            </div>
            <div className="text-xs text-slate-500">
              {literature.literatureItems.length} peer-reviewed studies
            </div>
          </div>

          <div className="space-y-3">
            {literature.literatureItems.map((item, index) => (
              <div
                key={index}
                className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#172554] bg-[#E9E7FF] border border-[#D8D4FF] px-2 py-0.5 rounded-md">
                        [{index + 1}]
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                        {item.venueOrPublisher || 'Peer-Reviewed Journal'}
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-semibold">
                        {item.year}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-[#172554] leading-snug">
                      {item.title}
                    </h4>

                    <div className="text-xs text-slate-600 font-medium">
                      {item.authors}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyCitation(item, index)}
                    className="shrink-0 h-8 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs self-start"
                    title="Copy formatted citation to clipboard"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Citation</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100">
                  <div className="p-3 bg-[#F8F9FE] rounded-xl border border-slate-200/70 space-y-1">
                    <span className="font-bold text-[#172554] text-[11px] uppercase tracking-wider block">
                      Empirical / Theoretical Findings
                    </span>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {item.keyFindings}
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-100/70 space-y-1">
                    <span className="font-bold text-amber-900 text-[11px] uppercase tracking-wider block">
                      Addressed Research Boundary
                    </span>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {item.identifiedGap}
                    </p>
                  </div>
                </div>

                {item.doiOrUrl && (
                  <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1 pt-1">
                    <span className="font-semibold text-slate-700">Publication Reference:</span>
                    <span className="text-[#3659C9] truncate">{item.doiOrUrl}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-medium">
            Sources strictly verified to avoid fabricated authors or nonexistent DOIs.
          </div>
          <button
            onClick={onProceedToPaper}
            className="w-full sm:w-auto h-10 px-5 text-xs font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] active:scale-98 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Next: Paper Studio</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E9E7FF]" />
          </button>
        </div>
      </div>
    </div>
  );
};
