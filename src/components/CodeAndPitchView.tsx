import React, { useState } from 'react';
import { Copy, Check, Download, Terminal, Sparkles, Shield, Cpu, Network, Camera, Layers } from 'lucide-react';
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
      {/* Hackathon Judge Pitch Card */}
      <div className="p-6 bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-lg space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
          <Sparkles className="w-4 h-4" />
          <span className="uppercase tracking-wider">3-Sentence Hackathon Judge Pitch</span>
        </div>

        <blockquote className="text-base sm:text-lg font-medium text-neutral-100 leading-relaxed border-l-2 border-cyan-400 pl-4 py-1">
          "AutoInspect transforms the multi-billion-dollar fleet and rental return bottleneck from a 45-minute manual check into a sub-second autonomous transaction. By uniting Roboflow computer vision with Neo4j vehicle knowledge graphs, decentralized Nosana GPU clusters for heavy 3D volumetric analysis at 95% lower cost, and ephemeral Daytona code execution sandboxes, we eliminate human inspection error while safeguarding customer privacy and backend infrastructure. This delivers a production-grade multi-agent loop that autonomously spots damage, resolves certified OEM parts, verifies structural safety, and issues binding purchase orders without human intervention."
        </blockquote>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
          <div className="p-3 bg-neutral-950/70 border border-neutral-850 rounded">
            <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>Roboflow (The Eyes)</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Millisecond optical defect localization and confidence scoring right at the check-in gate.
            </p>
          </div>

          <div className="p-3 bg-neutral-950/70 border border-neutral-850 rounded">
            <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" />
              <span>Neo4j (The Brain)</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Traverses complex OEM Bill of Materials (BOM) to link surface defects to exact SKUs and labor hours.
            </p>
          </div>

          <div className="p-3 bg-neutral-950/70 border border-neutral-850 rounded">
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Nosana (The Muscle)</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Offloads heavy 3D point-cloud and volumetric depth modeling to decentralized GPU grids for fractions of a cent.
            </p>
          </div>

          <div className="p-3 bg-neutral-950/70 border border-neutral-850 rounded">
            <div className="text-[11px] font-mono text-purple-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Daytona (The Hands & Shield)</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Spins up isolated, ephemeral execution sandboxes to run dynamic remediation scripts, destroying containers after PO dispatch.
            </p>
          </div>
        </div>
      </div>

      {/* Code Viewer Card */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <span>car_return_agent.py</span>
              <span aria-hidden="true">·</span>
              <span>Self-Contained Python Script</span>
              <span aria-hidden="true">·</span>
              <span>Official SDKs + Resilient Mock Fallbacks</span>
            </div>
            <h2 className="text-base font-semibold text-neutral-100 mt-1">
              Production Codebase Inspector
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyScript}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-neutral-950 border border-neutral-800 rounded text-neutral-300 hover:text-neutral-100 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
              <span>{copied ? 'Copied Code' : 'Copy Script'}</span>
            </button>
            <button
              onClick={downloadScript}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-semibold rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download car_return_agent.py</span>
            </button>
          </div>
        </div>

        {/* CLI Execution Guide */}
        <div className="p-3 bg-neutral-950 rounded border border-neutral-800 text-xs font-mono space-y-2">
          <div className="text-neutral-400"># Direct Execution Instructions:</div>
          <div className="text-cyan-300">
            $ python3 car_return_agent.py --vin SG-BUS-8821X --defect deep-scratch --confidence 0.94
          </div>
          <div className="text-neutral-400 text-[11px]">
            # Compatible with Python 3.10+. Fully executes with zero setup using resilient mock modes, or connects to live Neo4j, Nosana API, and Daytona credentials when defined in environment variables.
          </div>
        </div>

        {/* Code Content */}
        <div className="bg-neutral-950 rounded-lg border border-neutral-800 p-4 font-mono text-xs overflow-x-auto max-h-[500px]">
          <pre className="text-neutral-300 leading-relaxed">
            {PYTHON_SCRIPT_CONTENT}
          </pre>
        </div>
      </div>
    </div>
  );
};
