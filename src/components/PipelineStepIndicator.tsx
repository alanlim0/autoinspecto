import React from 'react';
import { Camera, Network, Cpu, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

interface PipelineStepIndicatorProps {
  currentStep: number; // 0 = idle, 1 = roboflow, 2 = neo4j, 3 = nosana, 4 = daytona, 5 = done
  onSelectStep: (step: number) => void;
}

const STEPS = [
  {
    num: 1,
    title: 'Roboflow CV',
    subtitle: 'Optical defect inferencing',
    icon: Camera,
  },
  {
    num: 2,
    title: 'Neo4j Graph',
    subtitle: 'BOM & OEM part mapping',
    icon: Network,
  },
  {
    num: 3,
    title: 'Nosana Network',
    subtitle: 'Decentralized GPU 3D wear',
    icon: Cpu,
  },
  {
    num: 4,
    title: 'Daytona Sandbox',
    subtitle: 'Isolated PO remediation',
    icon: ShieldCheck,
  },
];

export const PipelineStepIndicator: React.FC<PipelineStepIndicatorProps> = ({
  currentStep,
  onSelectStep,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {STEPS.map((s) => {
        const isDone = currentStep > s.num || currentStep === 5;
        const isActive = currentStep === s.num;
        const isPending = currentStep < s.num && currentStep !== 5;
        const Icon = s.icon;

        return (
          <button
            key={s.num}
            onClick={() => onSelectStep(s.num)}
            className={`flex items-start gap-3.5 p-3.5 rounded-lg border text-left transition-all ${
              isActive
                ? 'border-cyan-500/80 bg-neutral-900/90 shadow-sm shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                : isDone
                ? 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900 hover:border-neutral-700'
                : 'border-neutral-850 bg-neutral-950/40 text-neutral-400 hover:border-neutral-800'
            }`}
          >
            <div
              className={`p-2 rounded-md shrink-0 transition-colors ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : isDone
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-neutral-850 text-neutral-500'
              }`}
            >
              {isActive ? (
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              ) : isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-400">0{s.num}.</span>
                <span
                  className={`text-xs font-semibold tracking-tight ${
                    isActive ? 'text-cyan-300' : isDone ? 'text-neutral-100' : 'text-neutral-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 truncate mt-0.5">{s.subtitle}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
