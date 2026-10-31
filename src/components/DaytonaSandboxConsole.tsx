import React, { useState } from 'react';
import { Terminal, Shield, CheckCircle2, Copy, Check, FileCode, Trash2, ArrowUpRight } from 'lucide-react';
import { VehiclePreset } from '../types/agent';

interface DaytonaSandboxConsoleProps {
  vehicle: VehiclePreset;
  sandboxId: string;
  poId: string;
  isExecuting: boolean;
  teardownCompleted: boolean;
}

export const DaytonaSandboxConsole: React.FC<DaytonaSandboxConsoleProps> = ({
  vehicle,
  sandboxId,
  poId,
  isExecuting,
  teardownCompleted,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'console' | 'script' | 'po'>('po');
  const [copied, setCopied] = useState(false);

  const laborRate = 110.0;
  const laborTotal = Number((vehicle.bom.laborHours * laborRate).toFixed(2));
  const grandTotal = Number((vehicle.bom.costUsd + laborTotal).toFixed(2));

  const generatedScript = `#!/usr/bin/env python3
# Daytona Ephemeral Remediation Worker: ${poId}
# Target Sandbox: ${sandboxId}
import json
import sys
import time

payload = {
    "purchase_order_id": "${poId}",
    "status": "APPROVED_AUTO_DISPATCH",
    "timestamp": ${Math.floor(Date.now() / 1000)},
    "vehicle": {
        "vin": "${vehicle.vin}",
        "model": "${vehicle.makeModel}",
        "depot_id": "${vehicle.baseReturnDepot}"
    },
    "defect_telemetry": {
        "class": "${vehicle.defectClass}",
        "component": "${vehicle.targetComponent}",
        "confidence": ${vehicle.confidence},
        "depth_wear_mm": ${vehicle.nosana.depthMm},
        "safety_critical": ${vehicle.nosana.safetyCritical}
    },
    "bom_procurement": {
        "part_id": "${vehicle.bom.partId}",
        "oem_sku": "${vehicle.bom.oemSku}",
        "part_name": "${vehicle.bom.partName}",
        "supplier_id": "${vehicle.bom.supplierId}",
        "lead_time_days": ${vehicle.bom.leadTimeDays},
        "unit_cost_usd": ${vehicle.bom.costUsd},
        "labor_hours": ${vehicle.bom.laborHours},
        "labor_total_usd": ${laborTotal},
        "grand_total_deduction_usd": ${grandTotal}
    },
    "financial_actions": [
        "HOLD_CUSTOMER_SECURITY_DEPOSIT",
        "DISPATCH_EDI_850_PURCHASE_ORDER",
        "SCHEDULE_CERTIFIED_BAY_TECHNICIAN"
    ]
}

with open("purchase_order_${poId}.json", "w") as f:
    json.dump(payload, f, indent=2)

print(json.dumps(payload))
`;

  const poPayload = {
    purchase_order_id: poId,
    status: 'APPROVED_AUTO_DISPATCH',
    timestamp: new Date().toISOString(),
    vehicle: {
      vin: vehicle.vin,
      model: vehicle.makeModel,
      depot_id: vehicle.baseReturnDepot,
    },
    bom_procurement: {
      part_id: vehicle.bom.partId,
      oem_sku: vehicle.bom.oemSku,
      part_name: vehicle.bom.partName,
      supplier_id: vehicle.bom.supplierId,
      lead_time_days: vehicle.bom.leadTimeDays,
      unit_cost_usd: vehicle.bom.costUsd,
      labor_hours: vehicle.bom.laborHours,
      labor_total_usd: laborTotal,
      grand_total_deduction_usd: grandTotal,
    },
    financial_actions: [
      'HOLD_CUSTOMER_SECURITY_DEPOSIT',
      'DISPATCH_EDI_850_PURCHASE_ORDER',
      'SCHEDULE_CERTIFIED_BAY_TECHNICIAN',
    ],
  };

  const copyPoJson = () => {
    navigator.clipboard.writeText(JSON.stringify(poPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Daytona Ephemeral Sandbox</span>
            <span aria-hidden="true">·</span>
            <span>Container: {sandboxId}</span>
            <span aria-hidden="true">·</span>
            <span>Isolated cgroup</span>
          </div>
          <h2 className="text-base font-semibold text-neutral-100 mt-1">
            Secure Remediation Container & PO Issuance
          </h2>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-md">
          <button
            onClick={() => setActiveSubTab('po')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeSubTab === 'po'
                ? 'bg-neutral-800 text-cyan-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Purchase Order
          </button>
          <button
            onClick={() => setActiveSubTab('script')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeSubTab === 'script'
                ? 'bg-neutral-800 text-cyan-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            order_replacement_part.py
          </button>
          <button
            onClick={() => setActiveSubTab('console')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeSubTab === 'console'
                ? 'bg-neutral-800 text-cyan-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Sandbox Terminal Logs
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Left Container Display */}
        <div className="lg:col-span-8 bg-neutral-950 rounded-lg border border-neutral-800 p-4 font-mono text-xs overflow-hidden">
          {activeSubTab === 'po' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-neutral-100 text-sm">
                    Purchase Order {poId}
                  </span>
                </div>
                <button
                  onClick={copyPoJson}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-neutral-900 border border-neutral-800 rounded text-neutral-300 hover:text-neutral-100 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-neutral-400" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="text-neutral-300 overflow-x-auto text-[11px] leading-relaxed p-2 bg-neutral-900/60 rounded border border-neutral-850">
                {JSON.stringify(poPayload, null, 2)}
              </pre>
            </div>
          )}

          {activeSubTab === 'script' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-neutral-400 pb-2 border-b border-neutral-850 text-[11px]">
                <div className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dynamically Injected Python Script inside Daytona Container</span>
                </div>
                <span className="text-neutral-400">/workspace/order_replacement_part.py</span>
              </div>
              <pre className="text-cyan-200/90 overflow-x-auto text-[11px] leading-relaxed p-2.5 bg-neutral-900/60 rounded border border-neutral-850">
                {generatedScript}
              </pre>
            </div>
          )}

          {activeSubTab === 'console' && (
            <div className="space-y-2 text-[11px] leading-relaxed">
              <div className="text-neutral-400 pb-2 border-b border-neutral-850 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                <span>Daytona Container Stdout & Lifecycle Daemon</span>
              </div>
              <p className="text-neutral-400">[00:00:01] Initializing Daytona client with DaytonaConfig(api_key=***)</p>
              <p className="text-neutral-400">[00:00:01] Requesting ephemeral container: daytona/workspace-python:3.11</p>
              <p className="text-cyan-400">[00:00:02] Container {sandboxId} provisioned with isolated network & 512MB RAM cap</p>
              <p className="text-neutral-300">[00:00:02] workspace.fs.upload_file('/workspace/order_replacement_part.py')</p>
              <p className="text-neutral-300">[00:00:03] workspace.process.exec('python /workspace/order_replacement_part.py')</p>
              <p className="text-emerald-400">[00:00:03] Process exited with status 0. Purchase order generated.</p>
              <p className="text-purple-400">[00:00:04] daytona_client.remove(workspace): Container {sandboxId} destroyed.</p>
              <p className="text-emerald-400 font-semibold">[00:00:04] Clean teardown complete. Zero attack surface remaining.</p>
            </div>
          )}
        </div>

        {/* Right Financial Breakdown & Remediation Card */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="p-4 bg-neutral-950/60 rounded-lg border border-neutral-800/80 space-y-3">
            <span className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
              Financial Remediation Summary
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-neutral-300">
                <span>Replacement Part:</span>
                <span className="font-mono tabular-nums">${vehicle.bom.costUsd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Labor ({vehicle.bom.laborHours}h @ $110/h):</span>
                <span className="font-mono tabular-nums">${laborTotal.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-neutral-800 flex justify-between font-semibold text-sm text-neutral-100">
                <span>Total Customer Ledger:</span>
                <span className="font-mono text-cyan-400 tabular-nums">${grandTotal.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="pt-2 space-y-2 border-t border-neutral-850">
              <span className="text-[10px] font-mono uppercase text-neutral-400">
                Automated Actions Dispatched
              </span>
              <ul className="text-[11px] text-neutral-300 space-y-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Security deposit hold registered</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>EDI 850 PO sent to {vehicle.bom.supplierName.split(' ')[0]}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Technician service scheduled ({vehicle.bom.leadTimeDays}d lead)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sandbox Security Box */}
          <div className="p-3 bg-neutral-950/40 rounded border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
              <Trash2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Container Teardown: Complete</span>
            </div>
            <p>
              Daytona ephemeral environment purged in 420ms immediately after artifact generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
