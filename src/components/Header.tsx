/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  PlusCircle,
  Menu,
  X,
  GraduationCap,
  ChevronRight,
  FileText,
  Compass,
  Layers,
  BookOpen,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewPaper: () => void;
  hasPaper: boolean;
  onOpenFewShotModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onNewPaper,
  hasPaper,
  onOpenFewShotModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'setup', label: 'Topic Setup', icon: Compass },
    { id: 'analysis', label: 'Topic Analysis', icon: Layers, requiresPaper: true },
    { id: 'plan', label: 'Research Plan', icon: FileText, requiresPaper: true },
    { id: 'literature', label: 'Literature & Gaps', icon: BookOpen, requiresPaper: true },
    { id: 'paper', label: 'Paper Studio', icon: GraduationCap, requiresPaper: true },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 md:gap-8">
        {/* Left: ResearchMate Brand Identity with Subtitle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleTabClick('setup')}
            className="flex items-center gap-3 group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3659C9] rounded-lg p-0.5"
            aria-label="ResearchMate Home"
          >
            {/* Elegant Book-Inspired Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#172554] via-[#1e3a8a] to-[#3659C9] text-white flex items-center justify-center shadow-xs ring-1 ring-slate-900/10 group-hover:shadow-md transition-all">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-[#E9E7FF]"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M8 7h8" />
                <path d="M8 11h6" />
                <path d="M12 2v6l2-1.5L16 8V2" fill="#E9E7FF" stroke="none" opacity="0.9" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight text-[#172554] group-hover:text-[#3659C9] transition-colors leading-tight">
                ResearchMate
              </span>
              <span className="text-[11px] font-medium text-slate-500 tracking-normal leading-tight">
                AI Research Paper Assistant
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Bar with Equal Alignment & Consistent Icons */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F1F3F9] p-1.5 rounded-xl border border-slate-200/80 shadow-inner">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isDisabled = item.requiresPaper && !hasPaper;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                disabled={isDisabled}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-white text-[#172554] shadow-xs font-bold ring-1 ring-slate-200'
                    : isDisabled
                    ? 'text-slate-400 cursor-not-allowed opacity-50'
                    : 'text-slate-600 hover:text-[#172554] hover:bg-white/70'
                }`}
                title={isDisabled ? 'Generate a research paper to unlock this section' : item.label}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? 'text-[#3659C9]' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Few-Shot Guide + New Project + Mobile toggle) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenFewShotModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#172554] bg-[#E9E7FF]/70 hover:bg-[#E9E7FF] border border-[#D8D4FF] rounded-xl transition-all whitespace-nowrap shadow-2xs cursor-pointer active:scale-98"
            title="Explore Few-Shot Exemplars and Prompt Patterns"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3659C9]" />
            <span className="hidden md:inline">Few-Shot Exemplars</span>
            <span className="md:hidden">Exemplars</span>
          </button>

          <button
            onClick={onNewPaper}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#172554] hover:bg-[#1e3a8a] active:scale-98 rounded-xl transition-all whitespace-nowrap shadow-xs ring-1 ring-[#172554]/20 cursor-pointer"
            title="Start a fresh research inquiry"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#E9E7FF]" />
            <span>New Research</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/90 bg-white px-4 pt-3 pb-5 space-y-2.5 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            Research Navigation
          </div>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const isDisabled = item.requiresPaper && !hasPaper;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  disabled={isDisabled}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors text-left ${
                    isActive
                      ? 'bg-[#E9E7FF] text-[#172554] font-bold border border-[#D8D4FF]'
                      : isDisabled
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#3659C9]' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#3659C9]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenFewShotModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#172554] bg-[#E9E7FF] hover:bg-[#dcd7ff] rounded-xl transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3659C9]" />
              <span>Explore Few-Shot Prompt Guide</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
