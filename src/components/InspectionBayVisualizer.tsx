import React, { useState } from 'react';
import { Camera, Scan, Eye, Layers, ShieldAlert, Cpu } from 'lucide-react';
import { VehiclePreset } from '../types/agent';

interface InspectionBayVisualizerProps {
  vehicle: VehiclePreset;
  isInspecting: boolean;
  onSelectVehicle: (v: VehiclePreset) => void;
  allVehicles: VehiclePreset[];
}

export const InspectionBayVisualizer: React.FC<InspectionBayVisualizerProps> = ({
  vehicle,
  isInspecting,
  onSelectVehicle,
  allVehicles,
}) => {
  const [showLaserGrid, setShowLaserGrid] = useState(true);
  const [showDepthMesh, setShowDepthMesh] = useState(false);

  return (
    <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-5">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Roboflow Vision Node</span>
            <span aria-hidden="true">·</span>
            <span>Stereo Bay CAM-04</span>
            <span aria-hidden="true">·</span>
            <span>4096 × 2160 @ 60fps</span>
          </div>
          <h2 className="text-base font-semibold text-neutral-100 mt-1">
            Optical Surface Inferencing
          </h2>
        </div>

        {/* Vehicle Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-md">
          {allVehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => onSelectVehicle(v)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                v.id === vehicle.id
                  ? 'bg-neutral-800 text-cyan-400 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {v.makeModel.split(' ')[0]} {v.vin.slice(0, 6)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Optical Frame with Laser Overlays */}
        <div className="lg:col-span-8 relative aspect-[16/10] bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800/90 group">
          <img
            src={vehicle.imageSrc}
            alt={vehicle.makeModel}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none"
          />

          {/* Laser Scanning Line Animation when active */}
          {isInspecting && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse absolute top-1/2 -translate-y-1/2" />
            </div>
          )}

          {/* Laser Grid Simulation Overlay */}
          {showLaserGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(34,211,238,0.4) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          )}

          {/* Depth Heatmap Overlay */}
          {showDepthMesh && (
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-gradient-to-tr from-amber-500/40 via-red-500/20 to-cyan-500/40 mix-blend-color" />
          )}

          {/* Bounding Box Render */}
          <div
            className="absolute border-2 border-red-500 bg-red-500/15 rounded-sm transition-all duration-300"
            style={{
              left: `${vehicle.bbox.x}%`,
              top: `${vehicle.bbox.y}%`,
              width: `${vehicle.bbox.w}%`,
              height: `${vehicle.bbox.h}%`,
            }}
          >
            {/* Corner Crosshairs */}
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-red-400" />
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-red-400" />
            <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-red-400" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-red-400" />

            {/* Bounding Tag */}
            <div className="absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 bg-red-950/90 border border-red-600/80 rounded text-[11px] font-mono text-red-200 whitespace-nowrap shadow-md">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
              <span>{vehicle.defectClass}</span>
              <span className="text-red-400 font-bold tabular-nums">
                {(vehicle.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Camera Telemetry Bar Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 bg-neutral-950/85 backdrop-blur-md rounded border border-neutral-800 text-[11px] font-mono text-neutral-300">
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 font-semibold">{vehicle.vin}</span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-400">{vehicle.targetComponent}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLaserGrid(!showLaserGrid)}
                className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                  showLaserGrid ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setShowDepthMesh(!showDepthMesh)}
                className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                  showDepthMesh ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Depth Mesh
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry Breakdown Details */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="p-3.5 bg-neutral-950/60 rounded-lg border border-neutral-800/80 space-y-2">
              <span className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
                Inbound Vehicle Record
              </span>
              <div className="text-sm font-semibold text-neutral-100">{vehicle.makeModel}</div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-neutral-400 border-t border-neutral-850">
                <div>
                  <div className="text-neutral-400 text-[11px]">Plate Number</div>
                  <div className="text-neutral-200 font-mono font-medium">{vehicle.licensePlate}</div>
                </div>
                <div>
                  <div className="text-neutral-400 text-[11px]">Renter</div>
                  <div className="text-neutral-200 font-medium">{vehicle.customerName}</div>
                </div>
                <div>
                  <div className="text-neutral-400 text-[11px]">Trip Duration</div>
                  <div className="text-neutral-200 font-medium">{vehicle.rentalDurationDays} Days</div>
                </div>
                <div>
                  <div className="text-neutral-400 text-[11px]">Check-in Depot</div>
                  <div className="text-neutral-200 font-mono text-[11px]">{vehicle.baseReturnDepot}</div>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-neutral-950/60 rounded-lg border border-neutral-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
                  Roboflow Detection Result
                </span>
                <span className="text-xs font-mono font-bold text-red-400 tabular-nums">
                  {(vehicle.confidence * 100).toFixed(1)}% match
                </span>
              </div>
              <div className="text-xs font-medium text-neutral-200">{vehicle.defectName}</div>
              <div className="text-xs text-neutral-400">
                Subsystem: <span className="text-neutral-300">{vehicle.subsystem}</span>
              </div>

              {/* Confidence Bar */}
              <div className="w-full bg-neutral-850 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${vehicle.confidence * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-neutral-400 flex items-center gap-2 px-1">
            <Camera className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Roboflow inference completed in 42ms via localized Edge TensorRT instance.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
