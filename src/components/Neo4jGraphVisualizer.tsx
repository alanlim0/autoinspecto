import React, { useState } from 'react';
import { Network, Database, Copy, Check, ArrowRight, DollarSign, Clock } from 'lucide-react';
import { VehiclePreset } from '../types/agent';

interface Neo4jGraphVisualizerProps {
  vehicle: VehiclePreset;
}

export const Neo4jGraphVisualizer: React.FC<Neo4jGraphVisualizerProps> = ({ vehicle }) => {
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [selectedNode, setSelectedNode] = useState<'vehicle' | 'subsystem' | 'part' | 'supplier' | 'defect'>('part');

  const cypherQuery = `MATCH (v:Vehicle {vin: "${vehicle.vin}"})
      -[:HAS_SUBSYSTEM]->(s:Subsystem)
      -[:CONTAINS_PART]->(p:BOMPart)
WHERE p.name CONTAINS "${vehicle.targetComponent}"
MATCH (p)-[:SUPPLIED_BY]->(sup:Supplier)
OPTIONAL MATCH (p)-[:DEFECT_PROFILE]->(d:DefectClass {name: "${vehicle.defectClass}"})
RETURN p.part_id, p.name, p.oem_sku, p.unit_cost_usd, p.labor_hours_required, sup.supplier_id;`;

  const copyCypher = () => {
    navigator.clipboard.writeText(cypherQuery);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  return (
    <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-5">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Neo4j Graph Database</span>
            <span aria-hidden="true">·</span>
            <span>bolt://localhost:7687</span>
            <span aria-hidden="true">·</span>
            <span>BOM Knowledge Graph</span>
          </div>
          <h2 className="text-base font-semibold text-neutral-100 mt-1">
            Bill of Materials (BOM) Graph Traversal
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCypher}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-neutral-950 border border-neutral-800 rounded text-neutral-300 hover:text-neutral-100 transition-colors"
          >
            {copiedQuery ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
            <span>{copiedQuery ? 'Copied Cypher' : 'Copy Cypher'}</span>
          </button>
        </div>
      </div>

      {/* Main Graph Canvas & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Interactive SVG Node Diagram */}
        <div className="lg:col-span-8 bg-neutral-950 rounded-lg border border-neutral-800/90 p-4 relative min-h-[340px] flex flex-col justify-between overflow-x-auto">
          <div className="text-[11px] font-mono text-neutral-400">
            Graph Topology: (Vehicle) ➔ (Subsystem) ➔ (BOMPart) ➔ (Supplier)
          </div>

          {/* SVG Diagram with connecting lines and nodes */}
          <div className="py-8 flex items-center justify-between min-w-[560px] px-4">
            {/* Node 1: Vehicle */}
            <button
              onClick={() => setSelectedNode('vehicle')}
              className={`flex flex-col items-center gap-2 transition-transform ${
                selectedNode === 'vehicle' ? 'scale-105' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-colors ${
                  selectedNode === 'vehicle'
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                    : 'border-neutral-700 bg-neutral-900'
                }`}
              >
                <span className="text-xs font-mono font-bold text-cyan-300">VIN</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-300 max-w-[80px] text-center truncate">
                {vehicle.vin}
              </span>
            </button>

            {/* Edge 1 */}
            <div className="flex-1 flex flex-col items-center px-2">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                :HAS_SUBSYSTEM
              </span>
              <div className="w-full h-px bg-neutral-700 relative">
                <ArrowRight className="w-3 h-3 text-neutral-500 absolute -right-1.5 -top-1.5" />
              </div>
            </div>

            {/* Node 2: Subsystem */}
            <button
              onClick={() => setSelectedNode('subsystem')}
              className={`flex flex-col items-center gap-2 transition-transform ${
                selectedNode === 'subsystem' ? 'scale-105' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-colors ${
                  selectedNode === 'subsystem'
                    ? 'border-amber-400 bg-amber-950/60 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'border-neutral-700 bg-neutral-900'
                }`}
              >
                <span className="text-xs font-mono font-bold text-amber-300">SYS</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-300 max-w-[90px] text-center truncate">
                {vehicle.subsystem.split(' ')[0]}
              </span>
            </button>

            {/* Edge 2 */}
            <div className="flex-1 flex flex-col items-center px-2">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                :CONTAINS_PART
              </span>
              <div className="w-full h-px bg-cyan-600/70 relative">
                <ArrowRight className="w-3 h-3 text-cyan-400 absolute -right-1.5 -top-1.5" />
              </div>
            </div>

            {/* Node 3: BOMPart (Focal Node) */}
            <button
              onClick={() => setSelectedNode('part')}
              className={`flex flex-col items-center gap-2 transition-transform ${
                selectedNode === 'part' ? 'scale-110' : 'opacity-90 hover:opacity-100'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-colors ${
                  selectedNode === 'part'
                    ? 'border-emerald-400 bg-emerald-950/70 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                    : 'border-neutral-600 bg-neutral-900'
                }`}
              >
                <span className="text-xs font-mono font-bold text-emerald-300">BOM</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-300 font-semibold max-w-[100px] text-center truncate">
                {vehicle.bom.partId}
              </span>
            </button>

            {/* Edge 3 */}
            <div className="flex-1 flex flex-col items-center px-2">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                :SUPPLIED_BY
              </span>
              <div className="w-full h-px bg-neutral-700 relative">
                <ArrowRight className="w-3 h-3 text-neutral-500 absolute -right-1.5 -top-1.5" />
              </div>
            </div>

            {/* Node 4: Supplier */}
            <button
              onClick={() => setSelectedNode('supplier')}
              className={`flex flex-col items-center gap-2 transition-transform ${
                selectedNode === 'supplier' ? 'scale-105' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-colors ${
                  selectedNode === 'supplier'
                    ? 'border-purple-400 bg-purple-950/60 shadow-[0_0_15px_rgba(192,132,252,0.3)]'
                    : 'border-neutral-700 bg-neutral-900'
                }`}
              >
                <span className="text-xs font-mono font-bold text-purple-300">SUP</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-300 max-w-[90px] text-center truncate">
                {vehicle.bom.supplierName.split(' ')[0]}
              </span>
            </button>
          </div>

          {/* Embedded Cypher Snippet */}
          <div className="bg-neutral-900/90 rounded border border-neutral-800 p-2.5 font-mono text-[11px] text-neutral-300 overflow-x-auto">
            <span className="text-purple-400">MATCH</span> (v:Vehicle &#123;vin: <span className="text-emerald-300">"{vehicle.vin}"</span>&#125;)-[:HAS_SUBSYSTEM]-&gt;(s)-[:CONTAINS_PART]-&gt;(p:BOMPart)
            <br />
            <span className="text-purple-400">RETURN</span> p.part_id, p.oem_sku, p.unit_cost_usd, sup.supplier_id;
          </div>
        </div>

        {/* Selected Node Inspector Details */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="p-4 bg-neutral-950/60 rounded-lg border border-neutral-800/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-850">
              <span className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
                Graph Node Properties
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                :BOMPart Verified
              </span>
            </div>

            <div>
              <div className="text-xs text-neutral-400">Part Description</div>
              <div className="text-xs font-semibold text-neutral-100 mt-0.5">
                {vehicle.bom.partName}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-neutral-900/70 rounded border border-neutral-800">
                <div className="text-neutral-400 text-[10px] flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-cyan-400" />
                  <span>Base Unit Cost</span>
                </div>
                <div className="text-sm font-mono font-bold text-neutral-100 mt-1 tabular-nums">
                  ${vehicle.bom.costUsd.toFixed(2)}
                </div>
              </div>

              <div className="p-2 bg-neutral-900/70 rounded border border-neutral-800">
                <div className="text-neutral-400 text-[10px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Labor Required</span>
                </div>
                <div className="text-sm font-mono font-bold text-neutral-100 mt-1 tabular-nums">
                  {vehicle.bom.laborHours} hrs
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-neutral-400 pt-1">
              <div className="flex justify-between">
                <span>OEM SKU:</span>
                <span className="font-mono text-neutral-200">{vehicle.bom.oemSku}</span>
              </div>
              <div className="flex justify-between">
                <span>Supplier ID:</span>
                <span className="font-mono text-neutral-200">{vehicle.bom.supplierId}</span>
              </div>
              <div className="flex justify-between">
                <span>Certified Lead Time:</span>
                <span className="font-mono text-neutral-200">{vehicle.bom.leadTimeDays} Business Days</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-neutral-950/40 rounded border border-neutral-800 text-[11px] text-neutral-400">
            Neo4j Cypher query matched against 42,000 vehicle subassemblies in 8.4ms.
          </div>
        </div>
      </div>
    </div>
  );
};
