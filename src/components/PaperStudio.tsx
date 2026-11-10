/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Download,
  Printer,
  Sparkles,
  Edit3,
  Check,
  RefreshCw,
  Quote,
  BookOpen,
  Clock,
  Layers,
  ChevronRight,
  FileCheck,
} from 'lucide-react';
import { ResearchPaper } from '../types/research.ts';

interface PaperStudioProps {
  paper: ResearchPaper;
  onUpdateSection: (sectionKey: string, newContent: string) => void;
  onRegenerateSection: (sectionKey: string, customInstructions?: string) => void;
  onOpenCitationModal: () => void;
  onOpenEditorModal: (textToEdit: string, sectionTitle: string) => void;
  isRegeneratingSection: boolean;
}

const SECTION_KEYS = [
  'abstract',
  'introduction',
  'literature_review',
  'methodology',
  'results_discussion',
  'conclusion',
  'references',
];

const SECTION_LABELS: Record<string, string> = {
  abstract: 'Abstract & Keywords',
  introduction: '1. Introduction',
  literature_review: '2. Literature Review',
  methodology: '3. Research Methodology',
  results_discussion: '4. Results & Discussion',
  conclusion: '5. Conclusion & Recommendations',
  references: 'References',
};

export const PaperStudio: React.FC<PaperStudioProps> = ({
  paper,
  onUpdateSection,
  onRegenerateSection,
  onOpenCitationModal,
  onOpenEditorModal,
  isRegeneratingSection,
}) => {
  const [activeSectionKey, setActiveSectionKey] = useState<string>('abstract');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableContent, setEditableContent] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [showPromptBox, setShowPromptBox] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeSection = paper.sections[activeSectionKey] || {
    key: activeSectionKey,
    title: SECTION_LABELS[activeSectionKey] || activeSectionKey,
    content: 'Drafting section in accordance with research blueprint...',
    wordCount: 0,
  };

  const totalWords = Object.values(paper.sections).reduce(
    (acc, s) => acc + (s.wordCount || 0),
    0
  );

  const handleStartEdit = () => {
    setEditableContent(activeSection.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onUpdateSection(activeSectionKey, editableContent);
    setIsEditing(false);
  };

  const handleCopySection = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyFullPaper = () => {
    const fullText = Object.values(paper.sections)
      .map((sec) => `## ${sec.title}\n\n${sec.content}\n\n`)
      .join('---\n\n');
    const header = `# ${paper.topic}\n\n**Academic Level**: ${paper.academicLevel} | **Citation Style**: ${paper.citationStyle}\n\n---\n\n`;
    navigator.clipboard.writeText(header + fullText);
    setCopiedKey('full');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Download as Markdown file (.md)
  const handleDownloadMarkdown = () => {
    const fullText = Object.values(paper.sections)
      .map((sec) => `## ${sec.title}\n\n${sec.content}\n\n`)
      .join('---\n\n');
    const meta = `# ${paper.topic}\n\n**Academic Level**: ${paper.academicLevel}\n**Target Length**: ${paper.wordCountTarget}\n**Citation Style**: ${paper.citationStyle}\n**Generated via ResearchMate AI (Your Ideas. Your Research. Your Way.)**\n\n---\n\n`;
    const blob = new Blob([meta + fullText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paper.topic.replace(/[^a-zA-Z0-9]/g, '_')}_Manuscript.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download as Word Document (.doc format for Microsoft Word / Google Docs)
  const handleDownloadWordDoc = () => {
    let sectionsHtml = '';
    for (const key of SECTION_KEYS) {
      const sec = paper.sections[key];
      if (sec) {
        const htmlContent = sec.content
          .replace(/### (.*)/g, '<h3 style="font-size: 13pt; margin-top: 16pt; margin-bottom: 6pt; font-weight: bold; color: #172554;">$1</h3>')
          .replace(/## (.*)/g, '<h2 style="font-size: 15pt; margin-top: 22pt; margin-bottom: 8pt; font-weight: bold; color: #172554;">$1</h2>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n\n/g, '</p><p style="margin-bottom: 11pt; text-align: justify; line-height: 1.6;">')
          .replace(/\n/g, '<br/>');

        sectionsHtml += `
          <h2 style="font-size: 16pt; margin-top: 24pt; margin-bottom: 8pt; font-weight: bold; color: #172554; border-bottom: 1pt solid #cbd5e1; padding-bottom: 4pt;">${sec.title}</h2>
          <p style="margin-bottom: 11pt; text-align: justify; line-height: 1.6;">${htmlContent}</p>
        `;
      }
    }

    const docContent = `
      <!DOCTYPE html>
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${paper.topic} - ResearchMate</title>
        <style>
          body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.6; margin: 1in; color: #202938; }
          h1 { font-size: 20pt; text-align: center; margin-bottom: 14pt; color: #172554; font-weight: bold; }
          .meta { text-align: center; font-size: 11pt; color: #64748b; margin-bottom: 24pt; }
        </style>
      </head>
      <body>
        <h1>${paper.topic}</h1>
        <div class="meta">
          <strong>Academic Level:</strong> ${paper.academicLevel} &nbsp;|&nbsp; 
          <strong>Citation Style:</strong> ${paper.citationStyle} &nbsp;|&nbsp; 
          <strong>Word Count:</strong> ~${totalWords.toLocaleString()} words &nbsp;|&nbsp;
          <strong>Generated via ResearchMate</strong>
        </div>
        <hr style="border: 0; border-top: 1pt solid #cbd5e1; margin-bottom: 24pt;" />
        ${sectionsHtml}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paper.topic.replace(/[^a-zA-Z0-9]/g, '_')}_Paper.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Studio Top Control Strip: Cohesive layout with Deep Navy & Soft Lavender actions */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9E7FF] border border-[#D8D4FF] text-xs font-semibold text-[#172554]">
            <BookOpen className="w-3.5 h-3.5 text-[#3659C9]" />
            <span>Manuscript Studio & Section Editor</span>
            <span className="text-slate-300">·</span>
            <span>{paper.academicLevel}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#172554] leading-snug">
            {paper.topic}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
            <span className="font-semibold text-slate-800">Total Words: {totalWords.toLocaleString()}</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Reading Time: ~{Math.ceil(totalWords / 220)} min
            </span>
            <span>·</span>
            <span className="font-semibold text-[#172554] bg-[#E9E7FF]/70 px-2 py-0.5 rounded-md border border-[#D8D4FF]">
              {paper.citationStyle}
            </span>
          </div>
        </div>

        {/* Action Suite: Copy, Word Doc, Markdown, Print, Citations */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleCopyFullPaper}
            className="h-9 px-3.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
            title="Copy full manuscript with headers to clipboard"
          >
            {copiedKey === 'full' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Full Paper</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadWordDoc}
            className="h-9 px-3.5 text-xs font-semibold text-[#172554] bg-[#F8F9FE] hover:bg-[#E9E7FF] border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
            title="Download formatted for Microsoft Word or Google Docs"
          >
            <Download className="w-3.5 h-3.5 text-[#3659C9]" />
            <span>Word (.doc)</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="h-9 px-3.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
            title="Download as Markdown file"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Markdown (.md)</span>
          </button>

          <button
            onClick={handlePrint}
            className="h-9 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={onOpenCitationModal}
            className="h-9 px-4 text-xs font-semibold text-[#172554] bg-[#E9E7FF] hover:bg-[#dcd7ff] border border-[#D8D4FF] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
            title="Format references in APA 7th or IEEE style"
          >
            <Quote className="w-3.5 h-3.5 text-[#3659C9]" />
            <span>Citations ({paper.citationStyle.split(' ')[0]})</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Section Nav + Reading Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Paper Sections Deck */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="px-2 py-1 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Paper Structure</span>
            <span>Word Count</span>
          </div>

          <div className="space-y-1.5">
            {SECTION_KEYS.map((key, index) => {
              const sec = paper.sections[key];
              const isSelected = activeSectionKey === key;
              const words = sec?.wordCount || 0;

              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveSectionKey(key);
                    setIsEditing(false);
                    setShowPromptBox(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs transition-all text-left cursor-pointer border ${
                    isSelected
                      ? 'bg-[#172554] text-white border-[#172554] shadow-xs'
                      : 'bg-white hover:bg-[#F8F9FE] text-slate-700 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-white/20 text-[#E9E7FF]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <span className="font-semibold truncate">
                      {SECTION_LABELS[key] || key}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[11px] shrink-0 font-medium ${
                      isSelected ? 'text-[#E9E7FF]' : 'text-slate-500'
                    }`}
                  >
                    {words}w
                  </span>
                </button>
              );
            })}
          </div>

          {/* Academic Polish Tip Card */}
          <div className="pt-4 mt-3 border-t border-slate-100 p-3.5 bg-[#F8F9FE] rounded-xl border border-slate-200/80 text-xs space-y-1.5">
            <div className="font-bold text-[#172554] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#3659C9]" />
              <span>Academic Tone Engine</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Click <strong className="text-slate-800">Academic Polish</strong> on any section to automatically evaluate and optimize sentence transitions, scholarly register, and epistemic hedging.
            </p>
          </div>
        </div>

        {/* Right Column: Reading & Editing Stage */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-9 shadow-xs space-y-6">
          {/* Section Sub-Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-[#172554]">
                {activeSection.title}
              </h3>
              <div className="flex items-center gap-2.5 text-xs text-slate-500 mt-1 font-mono">
                <span className="font-semibold text-slate-800">{activeSection.wordCount || 0} words</span>
                <span>·</span>
                <span>Standard: {paper.citationStyle}</span>
              </div>
            </div>

            {/* Section Tools: Polish, Edit, Copy, Regenerate */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onOpenEditorModal(activeSection.content, activeSection.title)}
                className="h-9 px-3 text-xs font-semibold text-[#172554] bg-[#E9E7FF] hover:bg-[#dcd7ff] border border-[#D8D4FF] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
                title="Check grammar, tone, clarity, and logical flow"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#3659C9]" />
                <span>Academic Polish</span>
              </button>

              {isEditing ? (
                <button
                  onClick={handleSaveEdit}
                  className="h-9 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  Save Section
                </button>
              ) : (
                <button
                  onClick={handleStartEdit}
                  className="h-9 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}

              <button
                onClick={() => handleCopySection(activeSectionKey, activeSection.content)}
                className="h-9 px-3 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-98 flex items-center gap-1.5 text-xs font-semibold"
                title="Copy section to clipboard"
              >
                {copiedKey === activeSectionKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowPromptBox(!showPromptBox)}
                className="h-9 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          {/* Regenerate Section Prompt Box */}
          {showPromptBox && (
            <div className="p-4 sm:p-5 bg-[#F8F9FE] rounded-2xl border border-slate-200 space-y-3 animate-in fade-in-50 duration-150">
              <div className="text-xs font-bold text-[#172554]">
                Regenerate &ldquo;{activeSection.title}&rdquo; with Targeted Guidance
              </div>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g., Elaborate more deeply on empirical findings, incorporate specific statistical controls, or strengthen transitional phrasing..."
                rows={2}
                className="w-full p-3 text-xs text-[#202938] bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3659C9]/20 focus:border-[#3659C9] shadow-2xs"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowPromptBox(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onRegenerateSection(activeSectionKey, customInstructions);
                    setShowPromptBox(false);
                    setCustomInstructions('');
                  }}
                  disabled={isRegeneratingSection}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isRegeneratingSection ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <span>Regenerate Section</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Content Reader / Editor Area: Premium Academic Typography */}
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                rows={18}
                className="w-full p-4 sm:p-5 text-sm sm:text-base font-paper text-[#202938] bg-slate-50/70 border border-slate-300 rounded-2xl leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3659C9]/20 focus:border-[#3659C9] shadow-2xs"
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Markdown supported: ### Subheading, **bold**, *italics*, - list</span>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          ) : (
            <article className="font-paper text-[#202938] text-sm sm:text-base leading-relaxed space-y-4 max-w-none">
              {activeSection.content.split('\n\n').map((paragraph, pIdx) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                // Handle Subheadings
                if (trimmed.startsWith('### ')) {
                  return (
                    <h4
                      key={pIdx}
                      className="text-base sm:text-lg font-bold font-sans-ui text-[#172554] pt-3 pb-1 border-b border-slate-100"
                    >
                      {trimmed.replace('### ', '')}
                    </h4>
                  );
                }
                if (trimmed.startsWith('## ')) {
                  return (
                    <h3
                      key={pIdx}
                      className="text-lg sm:text-xl font-bold font-sans-ui text-[#172554] pt-5 pb-1 border-b border-slate-200"
                    >
                      {trimmed.replace('## ', '')}
                    </h3>
                  );
                }

                // Handle Bullet Lists
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  const items = trimmed.split('\n').filter(Boolean);
                  return (
                    <ul key={pIdx} className="list-disc pl-6 space-y-1.5 text-slate-800 font-paper">
                      {items.map((item, iIdx) => (
                        <li key={iIdx} className="leading-relaxed">
                          {item.replace(/^[-*]\s+/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }

                // Handle numbered references or list items
                if (/^\d+\.\s/.test(trimmed)) {
                  const items = trimmed.split('\n').filter(Boolean);
                  return (
                    <ol key={pIdx} className="list-decimal pl-6 space-y-2 text-slate-800 font-paper">
                      {items.map((item, iIdx) => (
                        <li key={iIdx} className="pl-1 leading-relaxed">
                          {item.replace(/^\d+\.\s+/, '')}
                        </li>
                      ))}
                    </ol>
                  );
                }

                // Standard Scholarly Paragraph
                return (
                  <p key={pIdx} className="text-justify leading-[1.8] text-slate-800">
                    {trimmed}
                  </p>
                );
              })}
            </article>
          )}
        </div>
      </div>
    </div>
  );
};
