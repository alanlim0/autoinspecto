import React, { useState } from 'react';
import { Copy, Check, Download, Terminal, Sparkles, Shield, Cpu, Network, Camera } from 'lucide-react';
import { PYTHON_SCRIPT_CONTENT } from '../data/mockVehicles';

export const CodeAndPitchView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyScript = () => {
    navigator.clipboard.writeText(PYTHON_SCRIPT_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadScript = () => {
    const element = document.createElement('a');
    const file = new Blob([PYTHON_SCRIPT_CONTENT], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'car_return_agent.py';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Hackathon Judge Pitch Card - Dub.co / Cal.com Style */}
      <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Hackathon Judge Pitch (3 Sentences)
          </span>
        </div>

        <blockquote className="text-lg sm:text-xl font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed border-l-3 border-zinc-900 dark:border-zinc-100 pl-5 py-1">
          "AutoInspect transforms the multi-billion-dollar fleet and rental return bottleneck from a 45-minute manual check into a sub-second autonomous transaction. By uniting Roboflow computer vision with Neo4j vehicle knowledge graphs, decentralized Nosana GPU clusters for heavy 3D volumetric analysis at 95% lower cost, and ephemeral Daytona code execution sandboxes, we eliminate human inspection error while safeguarding customer privacy and backend infrastructure. This delivers a production-grade multi-agent loop that autonomously spots damage, resolves certified OEM parts, verifies structural safety, and issues binding purchase orders without human intervention."
        </blockquote>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Camera className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>1. Roboflow (The Eyes)</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
              Detects scratches, dents, and tire wear at check-in bay cameras within 42ms.
            </p>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Network className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>2. Neo4j (The Brain)</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
              Traverses vehicle Bill of Materials (BOM) to link defects to exact OEM parts and labor.
            </p>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>3. Nosana (The Muscle)</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
              Decentralized GPU marketplace computes 3D volumetric depth analysis at 95% lower cost than AWS.
            </p>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>4. Daytona (The Shield)</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
              Spins up isolated execution sandboxes to generate purchase orders, then safely destroys them.
            </p>
          </div>
        </div>
      </div>

      {/* Code Inspector Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Complete Python Implementation
            </span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
              car_return_agent.py
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Self-contained script ready to run locally, on GitHub, or in production.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={copyScript}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
            <button
              onClick={downloadScript}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .py</span>
            </button>
          </div>
        </div>

        {/* CLI Quickstart Command */}
        <div className="p-4 bg-zinc-100 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono text-xs space-y-1.5">
          <div className="text-zinc-500"># Direct execution command:</div>
          <div className="text-zinc-900 dark:text-zinc-100 font-semibold select-all">
            python3 car_return_agent.py --vin SG-BUS-8821X --defect deep-scratch --confidence 0.94 --json
          </div>
        </div>

        {/* Script Viewer */}
        <div className="bg-zinc-950 rounded-lg border border-zinc-800 p-4 font-mono text-xs overflow-x-auto max-h-[500px]">
          <pre className="text-zinc-300 leading-relaxed">
            {PYTHON_SCRIPT_CONTENT}
          </pre>
        </div>
      </div>
    </div>
  );
};
