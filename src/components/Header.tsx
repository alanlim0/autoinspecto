import React from 'react';
import { Play, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'pipeline' | 'graph' | 'nosana' | 'daytona' | 'code';
  onSelectTab: (tab: 'pipeline' | 'graph' | 'nosana' | 'daytona' | 'code') => void;
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
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('pipeline');
        }}
        className="flex items-center gap-2.5 text-base font-bold tracking-tight text-neutral-100 whitespace-nowrap shrink-0 hover:text-white transition-colors"
      >
        <span className="w-2.5 h-2.5 bg-cyan-400 rounded-sm inline-block" />
        <span>AutoInspect Agent</span>
      </a>

      {/* Zone 2: 4-5 concise single-line text links */}
      <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-neutral-400">
        <button
          onClick={() => onSelectTab('pipeline')}
          className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'pipeline' ? 'text-cyan-400 font-semibold border-b border-cyan-400' : ''
          }`}
        >
          Live Pipeline
        </button>
        <button
          onClick={() => onSelectTab('graph')}
          className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'graph' ? 'text-cyan-400 font-semibold border-b border-cyan-400' : ''
          }`}
        >
          Neo4j BOM Graph
        </button>
        <button
          onClick={() => onSelectTab('nosana')}
          className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'nosana' ? 'text-cyan-400 font-semibold border-b border-cyan-400' : ''
          }`}
        >
          Nosana GPU Grid
        </button>
        <button
          onClick={() => onSelectTab('daytona')}
          className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'daytona' ? 'text-cyan-400 font-semibold border-b border-cyan-400' : ''
          }`}
        >
          Daytona Sandbox
        </button>
        <button
          onClick={() => onSelectTab('code')}
          className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'code' ? 'text-cyan-400 font-semibold border-b border-cyan-400' : ''
          }`}
        >
          Python Script & Pitch
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onTriggerRun}
          disabled={isRunning}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
            isRunning
              ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-sm shadow-cyan-500/20 active:translate-y-px'
          }`}
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Processing Loop...' : 'Trigger Inspection'}</span>
        </button>
      </div>
    </header>
  );
};
