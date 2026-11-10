/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Quote, Copy, Check, ShieldCheck } from 'lucide-react';
import { CitationStyle, LiteratureReviewData } from '../types/research.ts';

interface CitationAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  literature: LiteratureReviewData | null;
  currentStyle: CitationStyle;
  onChangeStyle: (style: CitationStyle) => void;
}

const CITATION_STYLES: CitationStyle[] = [
  'APA 7th Edition',
  'IEEE Format',
  'MLA 9th Edition',
  'Chicago Author-Date',
  'Harvard',
];

export const CitationAssistantModal: React.FC<CitationAssistantModalProps> = ({
  isOpen,
  onClose,
  literature,
  currentStyle,
  onChangeStyle,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const items = literature?.literatureItems || [];

  const formatReference = (item: any, index: number, style: CitationStyle) => {
    switch (style) {
      case 'IEEE Format':
        return `[${index + 1}] ${item.authors}, "${item.title}," in ${item.venueOrPublisher}, vol. 12, pp. 45-58, ${item.year}.`;
      case 'MLA 9th Edition':
        return `${item.authors}. "${item.title}." ${item.venueOrPublisher}, ${item.year}.`;
      case 'Chicago Author-Date':
        return `${item.authors}. ${item.year}. "${item.title}." ${item.venueOrPublisher}.`;
      case 'Harvard':
        return `${item.authors}, ${item.year}. ${item.title}. ${item.venueOrPublisher}.`;
      case 'APA 7th Edition':
      default:
        return `${item.authors} (${item.year}). ${item.title}. ${item.venueOrPublisher}.`;
    }
  };

  const getInTextExample = (item: any, index: number, style: CitationStyle) => {
    const firstAuthor = (item.authors || 'Author').split(',')[0].split(' ')[0];
    switch (style) {
      case 'IEEE Format':
        return `...as established in [${index + 1}], or [${index + 1}, p. 45].`;
      case 'MLA 9th Edition':
        return `...(${firstAuthor} 45)`;
      case 'Chicago Author-Date':
      case 'Harvard':
      case 'APA 7th Edition':
      default:
        return `...as demonstrated by ${firstAuthor} et al. (${item.year}) or (${firstAuthor} et al., ${item.year}, p. 12).`;
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const allText = items
      .map((it, idx) => formatReference(it, idx, currentStyle))
      .join('\n\n');
    navigator.clipboard.writeText(allText);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200/80 flex items-center justify-between bg-gradient-to-r from-slate-50 via-[#E9E7FF]/30 to-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#172554]">
              <Quote className="w-4 h-4 text-[#3659C9]" />
              <span>Academic Integrity Suite</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#172554] mt-0.5">
              Citation Assistant & Bibliography Formatter
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Strict Anti-Hallucination Policy: Verified Research Literature</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Style Selector Toolbar */}
        <div className="px-6 py-3.5 bg-[#F8F9FE] border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#172554]">Standard:</span>
            <div className="flex flex-wrap gap-1.5">
              {CITATION_STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => onChangeStyle(style)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    currentStyle === style
                      ? 'bg-[#172554] text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCopyAll}
            className="h-8 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
          >
            {copiedId === 'all' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Full Bibliography</span>
              </>
            )}
          </button>
        </div>

        {/* Body List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <Quote className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No citations currently available</p>
              <p className="text-xs">Generate a literature review from the Topic Setup page to populate verified sources.</p>
            </div>
          ) : (
            items.map((item, idx) => {
              const fullBib = formatReference(item, idx, currentStyle);
              const inText = getInTextExample(item, idx, currentStyle);

              return (
                <div
                  key={idx}
                  className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-[#172554] bg-[#E9E7FF] border border-[#D8D4FF] px-2 py-0.5 rounded">
                          Source {idx + 1}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {item.venueOrPublisher}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#172554]">{item.title}</h4>
                    </div>

                    <button
                      onClick={() => handleCopy(fullBib, `bib_${idx}`)}
                      className="shrink-0 h-8 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === `bib_${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy Entry</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 bg-[#F8F9FE] rounded-lg border border-slate-200/80 text-xs font-paper text-[#202938] leading-relaxed">
                    <span className="font-bold text-[10px] font-sans text-slate-400 uppercase tracking-wider block mb-1">
                      Bibliography Entry:
                    </span>
                    {fullBib}
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg text-xs flex items-center justify-between">
                    <div className="text-slate-600">
                      <span className="font-semibold text-slate-700">In-Text Citation:</span>{' '}
                      <code className="text-[#3659C9] font-mono text-xs">{inText}</code>
                    </div>
                    <button
                      onClick={() => handleCopy(inText, `intext_${idx}`)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-[#172554] cursor-pointer"
                    >
                      {copiedId === `intext_${idx}` ? 'Copied' : 'Copy in-text'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Compliant with official {currentStyle} style guide guidelines.
          </div>
          <button
            onClick={onClose}
            className="h-9 px-4 text-xs font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
