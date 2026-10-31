/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PipelineStepIndicator } from './components/PipelineStepIndicator';
import { InspectionBayVisualizer } from './components/InspectionBayVisualizer';
import { Neo4jGraphVisualizer } from './components/Neo4jGraphVisualizer';
import { NosanaComputeCard } from './components/NosanaComputeCard';
import { DaytonaSandboxConsole } from './components/DaytonaSandboxConsole';
import { CodeAndPitchView } from './components/CodeAndPitchView';
import { VEHICLE_PRESETS } from './data/mockVehicles';
import { VehiclePreset, PipelineLog } from './types/agent';
import { CheckCircle2, RotateCcw, Clock, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'graph' | 'nosana' | 'daytona' | 'code'>('pipeline');
  const [selectedVehicle, setSelectedVehicle] = useState<VehiclePreset>(VEHICLE_PRESETS[0]);
  const [currentStep, setCurrentStep] = useState<number>(5); // 0=idle, 1=roboflow, 2=neo4j, 3=nosana, 4=daytona, 5=complete
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sandboxId, setSandboxId] = useState<string>('daytona-box-a4eb557f');
  const [poId, setPoId] = useState<string>('PO-202610-3E41B0');
  const [logs, setLogs] = useState<PipelineLog[]>([
    {
      id: '1',
      timestamp: '09:51:07',
      step: 'ROBOFLOW',
      level: 'info',
      message: 'Vehicle return detected at Depot-SG-East. Running Roboflow vision model...',
    },
    {
      id: '2',
      timestamp: '09:51:07',
      step: 'ROBOFLOW',
      level: 'warn',
      message: 'Defect identified: deep-scratch on Front Bumper Assembly (94.2% confidence).',
    },
    {
      id: '3',
      timestamp: '09:51:07',
      step: 'NEO4J',
      level: 'info',
      message: 'Cypher query executed on Neo4j BOM graph. Matched part BOM-LUCID-8821-FB ($1280.00).',
    },
    {
      id: '4',
      timestamp: '09:51:08',
      step: 'NOSANA',
      level: 'info',
      message: 'Job dispatched to Nosana GPU node nos-sol-rig-rtx4090-sg-04. Depth wear: 2.15mm (Safety Critical).',
    },
    {
      id: '5',
      timestamp: '09:51:08',
      step: 'DAYTONA',
      level: 'success',
      message: 'Daytona sandbox created, order_replacement_part.py executed, PO-202610-3E41B0 issued ($1555.00), container purged.',
    },
  ]);

  const triggerPipelineRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(1);

    const newSandbox = `daytona-box-${Math.random().toString(16).substring(2, 10)}`;
    const newPo = `PO-202610-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;
    setSandboxId(newSandbox);
    setPoId(newPo);

    const now = () => new Date().toLocaleTimeString();
    setLogs([
      {
        id: 'init-1',
        timestamp: now(),
        step: 'ROBOFLOW',
        level: 'info',
        message: `Inbound inspection initiated for ${selectedVehicle.vin} (${selectedVehicle.makeModel})...`,
      },
    ]);

    // Step 1: Roboflow Vision
    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        {
          id: `step-1-${Date.now()}`,
          timestamp: now(),
          step: 'ROBOFLOW',
          level: 'warn',
          message: `[Roboflow CV] Defect detected: ${selectedVehicle.defectClass} on ${selectedVehicle.targetComponent} (${(selectedVehicle.confidence * 100).toFixed(1)}%).`,
        },
      ]);
      setCurrentStep(2);

      // Step 2: Neo4j Graph
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          {
            id: `step-2-${Date.now()}`,
            timestamp: now(),
            step: 'NEO4J',
            level: 'info',
            message: `[Neo4j Graph] BOM sync resolved: Part ID ${selectedVehicle.bom.partId} (${selectedVehicle.bom.oemSku}) at $${selectedVehicle.bom.costUsd.toFixed(2)}.`,
          },
        ]);
        setCurrentStep(3);

        // Step 3: Nosana GPU Network
        setTimeout(() => {
          setLogs((prev) => [
            ...prev,
            {
              id: `step-3-${Date.now()}`,
              timestamp: now(),
              step: 'NOSANA',
              level: 'info',
              message: `[Nosana Compute] 3D depth analysis finished on ${selectedVehicle.nosana.nodeId}. Depth: ${selectedVehicle.nosana.depthMm}mm (Safety critical: ${selectedVehicle.nosana.safetyCritical}). Cost: ${selectedVehicle.nosana.nosCost} NOS.`,
            },
          ]);
          setCurrentStep(4);

          // Step 4: Daytona Sandbox
          setTimeout(() => {
            const laborTotal = selectedVehicle.bom.laborHours * 110.0;
            const grandTotal = selectedVehicle.bom.costUsd + laborTotal;
            setLogs((prev) => [
              ...prev,
              {
                id: `step-4-${Date.now()}`,
                timestamp: now(),
                step: 'DAYTONA',
                level: 'success',
                message: `[Daytona Sandbox] Provisioned ${newSandbox}, executed order_replacement_part.py, issued ${newPo} ($${grandTotal.toFixed(2)} USD), sandbox destroyed.`,
              },
              {
                id: `step-5-${Date.now()}`,
                timestamp: now(),
                step: 'COMPLETE',
                level: 'success',
                message: `Autonomous pipeline finished in 0.89s. Vehicle return clearance processed.`,
              },
            ]);
            setCurrentStep(5);
            setIsRunning(false);
          }, 900);
        }, 900);
      }, 800);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* 3-Zone Header Contract */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isRunning={isRunning}
        onTriggerRun={triggerPipelineRun}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Sub-Header Context Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span>Autonomous Return & Inspection Loop</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-cyan-400">{selectedVehicle.vin}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedVehicle.baseReturnDepot}</span>
              </div>
              <h1 className="text-sm font-semibold text-neutral-100">
                {selectedVehicle.makeModel} ({selectedVehicle.licensePlate})
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="px-3 py-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Pipeline: {currentStep === 5 ? 'Ready / Complete' : `Running Step ${currentStep}/4`}</span>
            </div>
            <button
              onClick={triggerPipelineRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>Rerun Pipeline</span>
            </button>
          </div>
        </div>

        {/* 4-Step Architectural Indicator */}
        <PipelineStepIndicator
          currentStep={currentStep}
          onSelectStep={(step) => {
            if (step === 1) setActiveTab('pipeline');
            else if (step === 2) setActiveTab('graph');
            else if (step === 3) setActiveTab('nosana');
            else if (step === 4) setActiveTab('daytona');
          }}
        />

        {/* Tab Routing */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            {/* Step 1: Roboflow Inspection Bay */}
            <InspectionBayVisualizer
              vehicle={selectedVehicle}
              isInspecting={isRunning && currentStep === 1}
              onSelectVehicle={setSelectedVehicle}
              allVehicles={VEHICLE_PRESETS}
            />

            {/* Side-by-Side: Neo4j Graph + Nosana Compute */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Neo4jGraphVisualizer vehicle={selectedVehicle} />
              <NosanaComputeCard vehicle={selectedVehicle} />
            </div>

            {/* Step 4: Daytona Sandbox Console */}
            <DaytonaSandboxConsole
              vehicle={selectedVehicle}
              sandboxId={sandboxId}
              poId={poId}
              isExecuting={isRunning && currentStep === 4}
              teardownCompleted={currentStep === 5}
            />

            {/* Live Event Stream Logs */}
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                <span className="text-xs font-semibold text-neutral-200">
                  Autonomous Multi-Agent Activity Ledger
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {logs.length} events logged
                </span>
              </div>
              <div className="mt-3 space-y-2 font-mono text-xs max-h-48 overflow-y-auto">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-2 bg-neutral-950/70 rounded border border-neutral-850"
                  >
                    <span className="text-neutral-400 shrink-0 text-[11px]">{log.timestamp}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                        log.step === 'ROBOFLOW'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : log.step === 'NEO4J'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : log.step === 'NOSANA'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {log.step}
                    </span>
                    <span
                      className={`text-neutral-300 ${
                        log.level === 'warn' ? 'text-amber-300 font-medium' : ''
                      }`}
                    >
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'graph' && (
          <div className="space-y-6">
            <Neo4jGraphVisualizer vehicle={selectedVehicle} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-900/60 rounded-lg border border-neutral-800 space-y-1">
                <span className="text-xs text-neutral-400">Total Vehicle Subsystems</span>
                <div className="text-xl font-bold font-mono text-neutral-100">14 Assemblies</div>
                <p className="text-[11px] text-neutral-400">Chassis, Powertrain, ADAS, Body, Glass</p>
              </div>
              <div className="p-4 bg-neutral-900/60 rounded-lg border border-neutral-800 space-y-1">
                <span className="text-xs text-neutral-400">BOM Parts Indexed</span>
                <div className="text-xl font-bold font-mono text-neutral-100">42,850 SKUs</div>
                <p className="text-[11px] text-neutral-400">Directly mapped to certified OEM suppliers</p>
              </div>
              <div className="p-4 bg-neutral-900/60 rounded-lg border border-neutral-800 space-y-1">
                <span className="text-xs text-neutral-400">Average Cypher Latency</span>
                <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">8.4 ms</div>
                <p className="text-[11px] text-neutral-400">Real-time subassembly matching</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nosana' && (
          <div className="space-y-6">
            <NosanaComputeCard vehicle={selectedVehicle} />
            <div className="p-5 bg-neutral-900/60 rounded-lg border border-neutral-800 space-y-3">
              <h3 className="text-sm font-semibold text-neutral-100">
                Why Decentralized GPU Compute for Fleet Logistics?
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Centralized cloud compute (e.g., AWS p4d/g5 instances) carries heavy standing costs and high minimum egress fees that make continuous, 24/7 volumetric optical vehicle inspection economically prohibitive for rental depots. By offloading point-cloud surface reconstructor models to Nosana's decentralized GPU grid, fleet operators achieve a 95% reduction in cost per vehicle return ($0.0041 vs $0.082) with deterministic Solana-backed cryptographic verification.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'daytona' && (
          <div className="space-y-6">
            <DaytonaSandboxConsole
              vehicle={selectedVehicle}
              sandboxId={sandboxId}
              poId={poId}
              isExecuting={isRunning && currentStep === 4}
              teardownCompleted={currentStep === 5}
            />
            <div className="p-5 bg-neutral-900/60 rounded-lg border border-neutral-800 space-y-3">
              <h3 className="text-sm font-semibold text-neutral-100">
                Daytona Ephemeral Sandbox Security Guarantee
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Fleet operations require dynamic business logic execution (EDI purchase order creation, ERP balance updates, technician scheduling) that should never run directly on customer-facing edge gateways or central production database hosts. Daytona dynamically provisions a short-lived container sandbox, executes <code className="text-cyan-300">order_replacement_part.py</code> with strictly whitelisted network egress, exports signed JSON artifacts, and completely destroys the container environment within seconds.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <CodeAndPitchView />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-800/80 bg-neutral-950 px-6 py-4 text-xs text-neutral-400 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span>AutoInspect Agent v1.0</span>
          <span>·</span>
          <span>Roboflow + Neo4j + Nosana + Daytona</span>
          <span>·</span>
          <span>Open Source Architecture</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('code');
            }}
            className="hover:text-cyan-400 transition-colors"
          >
            car_return_agent.py
          </a>
          <span>·</span>
          <span>Depot: DEPOT-SG-EAST-01</span>
        </div>
      </footer>
    </div>
  );
}
