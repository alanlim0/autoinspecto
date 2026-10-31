/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ReturnInspectionCard } from './components/ReturnInspectionCard';
import { SimpleCostBreakdown } from './components/SimpleCostBreakdown';
import { CodeAndPitchView } from './components/CodeAndPitchView';
import { VEHICLE_PRESETS } from './data/mockVehicles';
import { VehiclePreset } from './types/agent';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'inspection' | 'code'>('inspection');
  const [selectedVehicle, setSelectedVehicle] = useState<VehiclePreset>(VEHICLE_PRESETS[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sandboxId, setSandboxId] = useState<string>('daytona-box-a4eb557f');
  const [poId, setPoId] = useState<string>('PO-202610-3E41B0');
  const [inspectionSuccessMsg, setInspectionSuccessMsg] = useState<string | null>(null);

  const triggerPipelineRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setInspectionSuccessMsg(null);

    const newSandbox = `daytona-box-${Math.random().toString(16).substring(2, 10)}`;
    const newPo = `PO-202610-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;

    setTimeout(() => {
      setSandboxId(newSandbox);
      setPoId(newPo);
      setIsRunning(false);
      setInspectionSuccessMsg(
        `Inspection complete for ${selectedVehicle.makeModel} (${selectedVehicle.licensePlate})! Official purchase order ${newPo} generated.`
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      {/* Cal.com / Dub.co Minimalist Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isRunning={isRunning}
        onTriggerRun={triggerPipelineRun}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Inspection Success Toast */}
        {inspectionSuccessMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3 text-sm font-medium shadow-sm animate-fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{inspectionSuccessMsg}</span>
            </div>
            <button
              onClick={() => setInspectionSuccessMsg(null)}
              className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Vehicle Check (Simple, Accessible, Elderly-Friendly) */}
        {activeTab === 'inspection' && (
          <div className="space-y-8">
            {/* Visual Inspection Card */}
            <ReturnInspectionCard
              vehicle={selectedVehicle}
              allVehicles={VEHICLE_PRESETS}
              onSelectVehicle={(v) => {
                setSelectedVehicle(v);
                setInspectionSuccessMsg(null);
              }}
              isInspecting={isRunning}
            />

            {/* Clear Pricing & Order Summary */}
            <SimpleCostBreakdown
              vehicle={selectedVehicle}
              poId={poId}
              sandboxId={sandboxId}
            />
          </div>
        )}

        {/* Tab 2: Code & Pitch (Technical & Judge Review) */}
        {activeTab === 'code' && (
          <CodeAndPitchView />
        )}
      </main>

      {/* Minimal Cal.com / Dub.co Footer */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 px-6 py-6 text-sm text-zinc-500 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">AutoInspect</span>
          <span>·</span>
          <span>Roboflow · Neo4j · Nosana · Daytona</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => setActiveTab('code')}
            className="hover:text-zinc-900 dark:hover:text-zinc-100 underline transition-colors"
          >
            View car_return_agent.py
          </button>
          <span>·</span>
          <span>README.md available</span>
        </div>
      </footer>
    </div>
  );
}
