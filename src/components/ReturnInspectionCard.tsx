import React, { useState } from 'react';
import { VehiclePreset } from '../types/agent';
import { AlertCircle, CheckCircle, Eye, EyeOff, ShieldCheck, Car } from 'lucide-react';

interface ReturnInspectionCardProps {
  vehicle: VehiclePreset;
  allVehicles: VehiclePreset[];
  onSelectVehicle: (v: VehiclePreset) => void;
  isInspecting: boolean;
}

export const ReturnInspectionCard: React.FC<ReturnInspectionCardProps> = ({
  vehicle,
  allVehicles,
  onSelectVehicle,
  isInspecting,
}) => {
  const [showDamageMarker, setShowDamageMarker] = useState(true);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* Top Bar: Vehicle Selector */}
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-zinc-600 dark:text-zinc-400">
            Selected Vehicle for Return
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
            {vehicle.makeModel}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200">
              License: {vehicle.licensePlate}
            </span>
            <span aria-hidden="true">·</span>
            <span>Renter: {vehicle.customerName}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-xs">{vehicle.vin}</span>
          </div>
        </div>

        {/* Big accessible vehicle switcher buttons */}
        <div className="flex items-center gap-2">
          {allVehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                onSelectVehicle(v);
                setImgError(false);
              }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                v.id === vehicle.id
                  ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white shadow-sm'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
              }`}
            >
              {v.makeModel.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Inspection View */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Photo Container with Damage Marker */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-950 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner">
            {!imgError ? (
              <img
                src={vehicle.imageSrc}
                alt={vehicle.makeModel}
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none"
              />
            ) : (
              /* Fallback container with zero broken image */
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800 p-6 text-center">
                <Car className="w-16 h-16 text-zinc-400 mb-3" />
                <span className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                  {vehicle.makeModel} Diagnostic Camera Feed
                </span>
                <span className="text-xs text-zinc-500 mt-1">
                  High-definition optical scan loaded from return portal
                </span>
              </div>
            )}

            {/* Scanning line indicator when running */}
            {isInspecting && (
              <div className="absolute inset-0 bg-zinc-950/20 flex items-center justify-center">
                <div className="px-5 py-2.5 bg-zinc-900/90 text-white rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg backdrop-blur-sm">
                  <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
                  <span>Scanning vehicle surfaces for marks...</span>
                </div>
              </div>
            )}

            {/* Clear, High-Contrast Damage Box (Can be toggled) */}
            {showDamageMarker && !isInspecting && (
              <div
                className="absolute border-3 border-amber-500 bg-amber-500/20 rounded-md transition-all shadow-lg pointer-events-none"
                style={{
                  left: `${vehicle.bbox.x}%`,
                  top: `${vehicle.bbox.y}%`,
                  width: `${vehicle.bbox.w}%`,
                  height: `${vehicle.bbox.h}%`,
                }}
              >
                <div className="absolute -top-7 left-0 px-2.5 py-1 bg-amber-600 text-white text-xs font-bold rounded shadow-md whitespace-nowrap">
                  ⚠️ Damage Spot Found ({Math.round(vehicle.confidence * 100)}% match)
                </div>
              </div>
            )}

            {/* Bottom Photo Controls */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={() => setShowDamageMarker(!showDamageMarker)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/80 hover:bg-zinc-900 text-white text-xs font-medium rounded-lg backdrop-blur-md shadow transition-colors"
              >
                {showDamageMarker ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Marker</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show Marker</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Clear, Human-Readable Damage Report Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Inspection Result: Repair Needed</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {vehicle.defectName}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Located on the <strong>{vehicle.targetComponent}</strong>. Our automated system is{' '}
              <strong>{Math.round(vehicle.confidence * 100)}% certain</strong> of this finding.
            </p>
          </div>

          <div className="p-5 bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-zinc-600 dark:text-zinc-400">
              What This Means For You
            </span>
            <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-2.5">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>100% Genuine OEM Part:</strong> Direct replacement from certified supplier{' '}
                  <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                    {vehicle.bom.supplierName}
                  </span>
                  .
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Fair Fixed Pricing:</strong> Parts and certified technician labor are
                  calculated automatically with zero surprise fees.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Safe & Secure:</strong> All orders are created inside an isolated sandbox
                  so your credit card and private info stay protected.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
