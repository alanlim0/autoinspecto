export interface VehiclePreset {
  id: string;
  vin: string;
  makeModel: string;
  year: number;
  licensePlate: string;
  customerName: string;
  rentalDurationDays: number;
  baseReturnDepot: string;
  defectClass: string;
  defectName: string;
  targetComponent: string;
  subsystem: string;
  confidence: number;
  imageSrc: string;
  bbox: { x: number; y: number; w: number; h: number };
  bom: {
    partId: string;
    partName: string;
    oemSku: string;
    costUsd: number;
    laborHours: number;
    supplierId: string;
    supplierName: string;
    leadTimeDays: number;
  };
  nosana: {
    nodeId: string;
    vram: string;
    location: string;
    latencyMs: number;
    depthMm: number;
    integrityScore: number;
    nosCost: number;
    safetyCritical: boolean;
  };
}

export interface PipelineLog {
  id: string;
  timestamp: string;
  step: 'ROBOFLOW' | 'NEO4J' | 'NOSANA' | 'DAYTONA' | 'COMPLETE';
  level: 'info' | 'warn' | 'success';
  message: string;
  detail?: string;
}

export interface PurchaseOrderArtifact {
  poId: string;
  timestamp: string;
  status: string;
  vin: string;
  vehicleModel: string;
  depotId: string;
  partId: string;
  partName: string;
  oemSku: string;
  supplierId: string;
  partsCostUsd: number;
  laborCostUsd: number;
  totalDeductionUsd: number;
  actions: string[];
}
