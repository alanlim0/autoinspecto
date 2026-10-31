import React from 'react';
import { Cpu, Zap, HardDrive, Globe, TrendingDown, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { VehiclePreset } from '../types/agent';

interface NosanaComputeCardProps {
  vehicle: VehiclePreset;
}

export const NosanaComputeCard: React.FC<NosanaComputeCardProps> = ({ vehicle }) => {
  const awsCostUsd = 0.082;
  const nosanaCostUsd = vehicle.nosana.nosCost * 0.11; // 1 NOS ~ $0.11
  const savingsPct = Math.round(((awsCostUsd - nosanaCostUsd) / awsCostUsd) * 100);

  return (
    <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Nosana Decentralized GPU Network</span>
            <span aria-hidden="true">·</span>
            <span>https://api.nosana.com/api/v1/jobs</span>
            <span aria-hidden="true">·</span>
            <span>Solana Cluster</span>
          </div>
          <h2 className="text-base font-semibold text-neutral-100 mt-1">
            Offloaded 3D Defect Volumetric Analysis
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Decentralized Compute Active</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Telemetry Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-neutral-950 rounded-lg border border-neutral-800">
              <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                <span>Assigned Node</span>
              </div>
              <div className="text-xs font-mono font-semibold text-neutral-200 mt-1 truncate">
                {vehicle.nosana.nodeId}
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">{vehicle.nosana.vram}</div>
            </div>

            <div className="p-3.5 bg-neutral-950 rounded-lg border border-neutral-800">
              <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Cluster Region</span>
              </div>
              <div className="text-xs font-medium text-neutral-200 mt-1">
                {vehicle.nosana.location}
              </div>
              <div className="text-[11px] font-mono text-cyan-400 tabular-nums mt-0.5">
                {vehicle.nosana.latencyMs} ms roundtrip
              </div>
            </div>

            <div className="p-3.5 bg-neutral-950 rounded-lg border border-neutral-800">
              <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cost Efficiency</span>
              </div>
              <div className="text-xs font-semibold text-emerald-400 mt-1">
                {savingsPct}% Cheaper than AWS
              </div>
              <div className="text-[11px] font-mono text-neutral-400 tabular-nums mt-0.5">
                {vehicle.nosana.nosCost} NOS (~${nosanaCostUsd.toFixed(4)})
              </div>
            </div>
          </div>

          {/* Nosana 3D Structural Pointcloud Output */}
          <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-200">
                Volumetric Depth & Micro-Fracture Scan Results
              </span>
              <span className="text-neutral-400 font-mono text-[11px]">
                Job ID: nos-job-{vehicle.vin.slice(0, 6).toLowerCase()}
              </span>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs text-neutral-400 mb-1">
                  <span>Defect Depth Penetration:</span>
                  <span className="font-mono text-neutral-200 tabular-nums">
                    {vehicle.nosana.depthMm} mm{' '}
                    <span className="text-neutral-400">(Safety Threshold: 1.00 mm)</span>
                  </span>
                </div>
                <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      vehicle.nosana.depthMm > 1.0
                        ? 'bg-gradient-to-r from-amber-500 to-red-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (vehicle.nosana.depthMm / 5) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-neutral-400 mb-1">
                  <span>Structural Integrity Retention:</span>
                  <span className="font-mono text-neutral-200 tabular-nums">
                    {(vehicle.nosana.integrityScore * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${vehicle.nosana.integrityScore * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Verdict */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="p-4 bg-neutral-950/60 rounded-lg border border-neutral-800/80 space-y-3">
            <span className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
              Safety Assessment Verdict
            </span>

            {vehicle.nosana.safetyCritical ? (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-md space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-red-300">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Safety Critical: Part Replacement Required</span>
                </div>
                <p className="text-[11px] text-red-200/80 leading-relaxed">
                  Defect depth ({vehicle.nosana.depthMm}mm) penetrates the structural threshold.
                  Automated replacement and remediation dispatch recommended.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-md space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cosmetic Defect Only</span>
                </div>
                <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                  Depth is within allowable threshold. Cosmetic polish authorized without structural
                  replacement.
                </p>
              </div>
            )}

            <div className="text-xs text-neutral-400 space-y-1.5 pt-2 border-t border-neutral-850">
              <div className="flex justify-between">
                <span>Model Pipeline:</span>
                <span className="font-mono text-neutral-300">3D-PointCloud-PointNet++</span>
              </div>
              <div className="flex justify-between">
                <span>VRAM Allocation:</span>
                <span className="font-mono text-neutral-300">24 GB Ampere</span>
              </div>
              <div className="flex justify-between">
                <span>Network Settlement:</span>
                <span className="font-mono text-neutral-300">Solana / Nosana Market</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-neutral-950/40 rounded border border-neutral-800 text-[11px] text-neutral-400">
            Offloaded to decentralized GPU node in {vehicle.nosana.location}. Saved 95% compute cost vs hyperscaler clouds.
          </div>
        </div>
      </div>
    </div>
  );
};
