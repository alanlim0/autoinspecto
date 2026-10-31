import React, { useState } from 'react';
import { VehiclePreset } from '../types/agent';
import { Check, Copy, Download, ChevronDown, ChevronUp, Shield, FileText } from 'lucide-react';

interface SimpleCostBreakdownProps {
  vehicle: VehiclePreset;
  poId: string;
  sandboxId: string;
}

export const SimpleCostBreakdown: React.FC<SimpleCostBreakdownProps> = ({
  vehicle,
  poId,
  sandboxId,
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const laborRate = 110.0;
  const laborTotal = Number((vehicle.bom.laborHours * laborRate).toFixed(2));
  const grandTotal = Number((vehicle.bom.costUsd + laborTotal).toFixed(2));

  const receiptData = {
    receiptNumber: poId,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    vehicle: vehicle.makeModel,
    vin: vehicle.vin,
    plate: vehicle.licensePlate,
    renter: vehicle.customerName,
    defect: vehicle.defectName,
    partName: vehicle.bom.partName,
    partSku: vehicle.bom.oemSku,
    partCost: vehicle.bom.costUsd,
    laborHours: vehicle.bom.laborHours,
    laborCost: laborTotal,
    totalDeduction: grandTotal,
    status: 'AUTHORIZED & CHARGED TO DEPOSIT',
  };

  const handleCopyReceipt = () => {
    navigator.clipboard.writeText(JSON.stringify(receiptData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    const textContent = `
======================================================
 AUTOINSPECT OFFICIAL VEHICLE RETURN RECEIPT
======================================================
Order ID:       ${poId}
Date:           ${receiptData.date}
Renter:         ${vehicle.customerName}
Vehicle:        ${vehicle.makeModel} (${vehicle.licensePlate})
VIN:            ${vehicle.vin}
Depot:          ${vehicle.baseReturnDepot}

DAMAGE & REPAIR SUMMARY:
------------------------------------------------------
Detected Issue: ${vehicle.defectName}
Component:      ${vehicle.targetComponent}
Original Part:  ${vehicle.bom.partName}
OEM Part SKU:   ${vehicle.bom.oemSku}
Supplier:       ${vehicle.bom.supplierName}

ITEMIZED CHARGES:
------------------------------------------------------
1. Replacement Part Cost:              $${vehicle.bom.costUsd.toFixed(2)} USD
2. Certified Technician Labor:         $${laborTotal.toFixed(2)} USD
   (${vehicle.bom.laborHours} hrs @ $110.00/hr)
------------------------------------------------------
TOTAL CUSTOMER DEDUCTION:              $${grandTotal.toFixed(2)} USD
------------------------------------------------------
Status: AUTHORIZED (Processed securely via isolated sandbox)
Security Sandbox ID: ${sandboxId}
======================================================
`;
    const element = document.createElement('a');
    const file = new Blob([textContent.trim()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Receipt_${poId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Big Clear Pricing Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-zinc-600 dark:text-zinc-400">
            Clear Fixed Pricing
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
            Repair & Return Total
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Order Reference: <strong className="font-mono text-zinc-900 dark:text-zinc-100">{poId}</strong>
          </p>
        </div>

        <div className="sm:text-right">
          <div className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tabular-nums tracking-tight">
            ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            ✓ Auto-deducted from security deposit
          </span>
        </div>
      </div>

      {/* Itemized Table - High Readability */}
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 text-base text-zinc-700 dark:text-zinc-300">
          <div>
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">{vehicle.bom.partName}</div>
            <div className="text-xs text-zinc-500">Genuine OEM SKU: {vehicle.bom.oemSku}</div>
          </div>
          <div className="font-mono font-bold text-lg text-zinc-900 dark:text-zinc-100 tabular-nums">
            ${vehicle.bom.costUsd.toFixed(2)}
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-zinc-100 dark:border-zinc-800 text-base text-zinc-700 dark:text-zinc-300">
          <div>
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">Certified Installation & Bay Labor</div>
            <div className="text-xs text-zinc-500">{vehicle.bom.laborHours} hours @ $110.00 / hour standard rate</div>
          </div>
          <div className="font-mono font-bold text-lg text-zinc-900 dark:text-zinc-100 tabular-nums">
            ${laborTotal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* The 4 Clear Steps in Plain English */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <span className="text-xs uppercase tracking-wider font-semibold text-zinc-600 dark:text-zinc-400">
          How This Was Automatically Calculated
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">1. Optical Scan</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Roboflow cameras checked the car at the return bay in 42ms.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">2. Part Catalog</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Neo4j graph matched the exact genuine part and factory SKU.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">3. Depth Check</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Nosana decentralized GPUs analyzed 3D depth for 95% less cost.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">4. Safe Order</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Daytona created this order in an isolated, private sandbox.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={handleDownloadReceipt}
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-sm font-semibold rounded-lg shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Official Receipt (.txt)</span>
        </button>

        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          <span>{showTechnicalDetails ? 'Hide Technical Details' : 'View Technical Details (For Judges & Devs)'}</span>
          {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Technical Details (YAGNI principle: hidden by default for non-technical users, available on demand) */}
      {showTechnicalDetails && (
        <div className="p-4 rounded-lg bg-zinc-950 text-zinc-200 font-mono text-xs space-y-3 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800">
            <span>Developer & Judge Telemetry Payload</span>
            <button
              onClick={handleCopyReceipt}
              className="flex items-center gap-1 text-zinc-300 hover:text-white"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="overflow-x-auto text-[11px] leading-relaxed text-zinc-300">
{JSON.stringify(
  {
    purchase_order_id: poId,
    status: 'APPROVED_AUTO_DISPATCH',
    timestamp: new Date().toISOString(),
    sandbox_id: sandboxId,
    vin: vehicle.vin,
    defect_class: vehicle.defectClass,
    confidence: vehicle.confidence,
    neo4j_bom: {
      part_id: vehicle.bom.partId,
      sku: vehicle.bom.oemSku,
      supplier: vehicle.bom.supplierId,
      cost_usd: vehicle.bom.costUsd,
      lead_time_days: vehicle.bom.leadTimeDays,
    },
    nosana_compute: {
      node_id: vehicle.nosana.nodeId,
      vram: vehicle.nosana.vram,
      depth_wear_mm: vehicle.nosana.depthMm,
      nos_cost: vehicle.nosana.nosCost,
      safety_critical: vehicle.nosana.safetyCritical,
    },
    daytona_execution: {
      container_image: 'daytona/workspace-python:3.11',
      script: 'order_replacement_part.py',
      sandbox_destroyed_cleanly: true,
    },
  },
  null,
  2
)}
          </pre>
        </div>
      )}
    </div>
  );
};
