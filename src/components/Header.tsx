import React from 'react';
import { Car, Play, Code2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'inspection' | 'code';
  onSelectTab: (tab: 'inspection' | 'code') => void;
  isRunning: boolean;
  onTriggerRun: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  isRunning,
  onTriggerRun,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-6 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md">
      {/* Zone 1: Brand title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm shadow-sm">
          <Car className="w-4 h-4" />
        </div>
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('inspection');
            }}
            className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            AutoInspect
          </a>
          <span className="hidden sm:inline-block ml-2 text-xs text-zinc-400 dark:text-zinc-400">
            Car Return Assistant
          </span>
        </div>
      </div>

      {/* Zone 2: Just 2 simple tabs for non-technical & technical users */}
      <nav className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
        <button
          onClick={() => onSelectTab('inspection')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
            activeTab === 'inspection'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Vehicle Check</span>
        </button>
        <button
          onClick={() => onSelectTab('code')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
            activeTab === 'code'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Code & Pitch</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onTriggerRun}
          disabled={isRunning}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap ${
            isRunning
              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
              : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold'
          }`}
        >
          <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Inspecting...' : 'Check Car Now'}</span>
        </button>
      </div>
    </header>
  );
};
