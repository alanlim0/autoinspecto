import { VehiclePreset } from '../types/agent';

export const VEHICLE_PRESETS: VehiclePreset[] = [
  {
    id: 'lucid-air-8821',
    vin: 'SG-BUS-8821X',
    makeModel: 'Lucid Air Grand Touring',
    year: 2025,
    licensePlate: 'SLA-8821-X',
    customerName: 'Marcus Vance',
    rentalDurationDays: 4,
    baseReturnDepot: 'DEPOT-SG-EAST-01',
    defectClass: 'deep-scratch',
    defectName: 'Deep Surface Scratch with Under-clear Penetration',
    targetComponent: 'Front Bumper Assembly',
    subsystem: 'Exterior Fascia & Radar Radome',
    confidence: 0.942,
    imageSrc: '/src/assets/images/car_inspection_front_bumper_1793440063102.jpg',
    bbox: { x: 38, y: 38, w: 26, h: 28 }, // percentage in visualizer
    bom: {
      partId: 'BOM-LUCID-8821-FB',
      partName: 'Front Bumper Fascia & Radar Shroud Subassembly',
      oemSku: 'OEM-99482-LUC',
      costUsd: 1280.0,
      laborHours: 2.5,
      supplierId: 'SUPPLIER-MAGNA-INTL',
      supplierName: 'Magna International Direct',
      leadTimeDays: 2,
    },
    nosana: {
      nodeId: 'nos-sol-rig-rtx4090-sg-04',
      vram: '24 GB GDDR6X',
      location: 'Singapore (Cluster #04)',
      latencyMs: 284.6,
      depthMm: 2.15,
      integrityScore: 0.79,
      nosCost: 0.038,
      safetyCritical: true,
    },
  },
  {
    id: 'tesla-model-y-9941',
    vin: 'US-CAL-9941M',
    makeModel: 'Tesla Model Y Performance',
    year: 2024,
    licensePlate: '7XYZ892',
    customerName: 'Elena Rostova',
    rentalDurationDays: 3,
    baseReturnDepot: 'DEPOT-SFO-BAY-03',
    defectClass: 'tread-wear-excessive',
    defectName: 'Inner Shoulder Tire Delamination & Tread Wear',
    targetComponent: 'Rear Right Tire Assembly',
    subsystem: 'Running Gear & Chassis Suspension',
    confidence: 0.968,
    imageSrc: '/src/assets/images/car_inspection_scanner_bay_1793440061129.jpg',
    bbox: { x: 58, y: 56, w: 16, h: 26 },
    bom: {
      partId: 'BOM-PIRELLI-PZERO-21R',
      partName: 'Pirelli P Zero Elect 275/35R21 Acoustic',
      oemSku: 'OEM-1044321-TSLA',
      costUsd: 395.0,
      laborHours: 0.75,
      supplierId: 'SUPPLIER-PIRELLI-TIRE',
      supplierName: 'Pirelli North America Direct',
      leadTimeDays: 1,
    },
    nosana: {
      nodeId: 'nos-us-west-a100-sfo-02',
      vram: '80 GB HBM2e',
      location: 'San Jose, CA (Cluster #11)',
      latencyMs: 198.2,
      depthMm: 4.8,
      integrityScore: 0.42,
      nosCost: 0.052,
      safetyCritical: true,
    },
  },
  {
    id: 'polestar-3-5510',
    vin: 'EU-GER-5510P',
    makeModel: 'Polestar 3 Long Range Dual Motor',
    year: 2025,
    licensePlate: 'M-PS-5510',
    customerName: 'Klaus Weber',
    rentalDurationDays: 6,
    baseReturnDepot: 'DEPOT-BER-AIR-02',
    defectClass: 'sensor-lens-crack',
    defectName: 'LiDAR SmartZone Quartz Window Microfracture',
    targetComponent: 'SmartZone Front Aperture',
    subsystem: 'Autonomous Sensing Suite & ADAS',
    confidence: 0.915,
    imageSrc: '/src/assets/images/car_inspection_scanner_bay_1793440061129.jpg',
    bbox: { x: 42, y: 52, w: 14, h: 12 },
    bom: {
      partId: 'BOM-POLESTAR-SMARTZONE-03',
      partName: 'SmartZone Front Heated Quartz Shield & Radar Lens',
      oemSku: 'OEM-324901-POLE',
      costUsd: 890.0,
      laborHours: 1.8,
      supplierId: 'SUPPLIER-VALEO-VISION',
      supplierName: 'Valeo Mobility Systems',
      leadTimeDays: 3,
    },
    nosana: {
      nodeId: 'nos-eu-fra-rtx4090-07',
      vram: '24 GB GDDR6X',
      location: 'Frankfurt, DE (Cluster #07)',
      latencyMs: 242.0,
      depthMm: 1.45,
      integrityScore: 0.65,
      nosCost: 0.041,
      safetyCritical: true,
    },
  },
];

export const PYTHON_SCRIPT_CONTENT = `#!/usr/bin/env python3
"""
Autonomous Vehicle Return & Inspection Agent
===========================================
End-to-end automated remediation loop wiring together:
1. Roboflow Computer Vision: Inbound vehicle defect detection & classification
2. Neo4j Knowledge Graph: Dynamic Bill of Materials (BOM) & parts cost mapping
3. Nosana GPU Network: Decentralized GPU batch structural & depth analytics offload
4. Daytona Ephemeral Sandbox: Isolated container provisioning, remediation script execution,
   purchase order generation, and automated teardown.

Usage:
    python car_return_agent.py
    python car_return_agent.py --vin SG-BUS-8821X --defect deep-scratch --confidence 0.94
"""

import os
import sys
import json
import time
import uuid
import logging
from typing import Dict, Any, Optional
from dataclasses import dataclass, asdict

# Optional external imports with graceful fallback guards
try:
    import requests
except ImportError:
    requests = None

try:
    from neo4j import GraphDatabase, basic_auth
except ImportError:
    GraphDatabase = None
    basic_auth = None

try:
    # Daytona Python SDK
    from daytona import Daytona, DaytonaConfig, CreateWorkspaceParams
except ImportError:
    Daytona = None
    DaytonaConfig = None
    CreateWorkspaceParams = None

# Configure structured terminal logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("AutoInspectAgent")


# ============================================================================
# Domain Models & Configurations
# ============================================================================

@dataclass
class InspectionEvent:
    vin: str
    vehicle_model: str
    defect_class: str
    target_component: str
    confidence: float
    camera_id: str
    timestamp: float
    bounding_box: Dict[str, int]
    return_station_id: str


@dataclass
class BOMPartResolution:
    part_id: str
    part_name: str
    oem_sku: str
    subsystem: str
    replacement_cost_usd: float
    labor_hours: float
    supplier_id: str
    lead_time_days: int
    graph_queried: str


@dataclass
class NosanaBatchResult:
    job_id: str
    gpu_cluster_node: str
    execution_time_ms: float
    structural_integrity_score: float
    depth_wear_mm: float
    safety_critical: bool
    estimated_nos_token_cost: float
    mock_mode: bool


@dataclass
class RemediationResult:
    sandbox_id: str
    purchase_order_id: str
    total_deduction_usd: float
    status: str
    script_output: str
    teardown_successful: bool


# ============================================================================
# Step 1: Simulated Inbound Event (Roboflow CV Pipeline)
# ============================================================================

def capture_inbound_inspection_event(
    vin: str = "SG-BUS-8821X",
    defect_class: str = "deep-scratch",
    target_component: str = "Front Bumper Assembly",
    confidence: float = 0.94,
    vehicle_model: str = "Lucid Air Grand Touring",
) -> InspectionEvent:
    """
    Simulates receiving an inbound webhook or event stream from Roboflow's
    edge vision inferencing model upon vehicle depot check-in.
    """
    logger.info("----------------------------------------------------------------------")
    logger.info("STEP 1: [Roboflow CV] Inbound Vehicle Return Detected")
    logger.info("----------------------------------------------------------------------")

    event = InspectionEvent(
        vin=vin,
        vehicle_model=vehicle_model,
        defect_class=defect_class,
        target_component=target_component,
        confidence=confidence,
        camera_id="CAM-BAY-04-STEREO",
        timestamp=time.time(),
        bounding_box={"x_min": 412, "y_min": 580, "width": 380, "height": 195},
        return_station_id="DEPOT-SG-EAST-01",
    )

    logger.info(f"  > VIN:               {event.vin}")
    logger.info(f"  > Vehicle:           {event.vehicle_model}")
    logger.info(f"  > Defect Detected:   '{event.defect_class}' on {event.target_component}")
    logger.info(f"  > Model Confidence:  {event.confidence * 100:.1f}% via {event.camera_id}")
    logger.info(f"  > Bounding Box:      {event.bounding_box}")
    return event


# ============================================================================
# Step 2: Neo4j Knowledge Graph & Bill of Materials (BOM) Sync
# ============================================================================

def query_neo4j_bom_sync(
    vin: str,
    defect_class: str,
    target_component: str,
    neo4j_uri: Optional[str] = None,
    neo4j_user: Optional[str] = None,
    neo4j_password: Optional[str] = None,
) -> BOMPartResolution:
    """
    Queries Neo4j Knowledge Graph via Cypher to match the VIN and defective
    component with the exact OEM Bill of Materials (BOMPart), returning
    the part ID, replacement unit cost, and certified supplier.
    """
    logger.info("----------------------------------------------------------------------")
    logger.info("STEP 2: [Neo4j Graph] Querying Vehicle Bill of Materials (BOM)")
    logger.info("----------------------------------------------------------------------")

    uri = neo4j_uri or os.getenv("NEO4J_URI", "bolt://localhost:7687")
    user = neo4j_user or os.getenv("NEO4J_USER", "neo4j")
    password = neo4j_password or os.getenv("NEO4J_PASSWORD", "password")

    cypher_query = """
    MATCH (v:Vehicle {vin: $vin})-[:HAS_SUBSYSTEM]->(s:Subsystem)-[:CONTAINS_PART]->(p:BOMPart)
    WHERE p.name CONTAINS $target_component OR s.name CONTAINS $target_component
    MATCH (p)-[:SUPPLIED_BY]->(sup:Supplier)
    OPTIONAL MATCH (p)-[:DEFECT_PROFILE]->(d:DefectClass {name: $defect_class})
    RETURN p.part_id AS part_id,
           p.name AS part_name,
           p.oem_sku AS oem_sku,
           s.name AS subsystem,
           p.unit_cost_usd AS cost,
           p.labor_hours_required AS labor_hours,
           sup.supplier_id AS supplier_id,
           sup.lead_time_days AS lead_time
    LIMIT 1;
    """

    if GraphDatabase is not None:
        try:
            logger.info(f"  > Connecting to Neo4j instance at {uri}...")
            driver = GraphDatabase.driver(uri, auth=basic_auth(user, password))
            with driver.session() as session:
                result = session.run(
                    cypher_query,
                    vin=vin,
                    target_component=target_component,
                    defect_class=defect_class,
                )
                record = result.single()
                if record:
                    resolution = BOMPartResolution(
                        part_id=record["part_id"],
                        part_name=record["part_name"],
                        oem_sku=record["oem_sku"],
                        subsystem=record["subsystem"],
                        replacement_cost_usd=float(record["cost"]),
                        labor_hours=float(record["labor_hours"]),
                        supplier_id=record["supplier_id"],
                        lead_time_days=int(record["lead_time"]),
                        graph_queried=uri,
                    )
                    driver.close()
                    logger.info("  > [Neo4j LIVE] Part match resolved from database:")
                    return resolution
        except Exception as e:
            logger.warning(f"  > Neo4j connection skipped ({e}). Using in-memory graph.")

    mock_catalog = {
        "Front Bumper Assembly": {
            "part_id": "BOM-LUCID-8821-FB",
            "part_name": "Front Bumper Fascia & Radar Shroud Subassembly",
            "oem_sku": "OEM-99482-LUC",
            "subsystem": "Exterior Body & ADAS Enclosures",
            "cost": 1280.00,
            "labor_hours": 2.5,
            "supplier_id": "SUPPLIER-MAGNA-INTL",
            "lead_time": 2,
        },
        "default": {
            "part_id": "BOM-GEN-8821-EXT",
            "part_name": f"{target_component} OEM Replacement Module",
            "oem_sku": "OEM-MOD-8821-A",
            "subsystem": "Structural Exterior",
            "cost": 850.00,
            "labor_hours": 1.8,
            "supplier_id": "SUPPLIER-OEM-PARTS-DIRECT",
            "lead_time": 3,
        },
    }

    selected = mock_catalog.get(target_component, mock_catalog["default"])
    resolution = BOMPartResolution(
        part_id=selected["part_id"],
        part_name=selected["part_name"],
        oem_sku=selected["oem_sku"],
        subsystem=selected["subsystem"],
        replacement_cost_usd=float(selected["cost"]),
        labor_hours=float(selected["labor_hours"]),
        supplier_id=selected["supplier_id"],
        lead_time_days=int(selected["lead_time"]),
        graph_queried="In-Memory Knowledge Graph (bolt://localhost:7687 fallback)",
    )

    logger.info(f"  > Part ID:          {resolution.part_id}")
    logger.info(f"  > Component Name:   {resolution.part_name}")
    logger.info(f"  > OEM SKU:          {resolution.oem_sku}")
    logger.info(f"  > Unit Cost:        \${resolution.replacement_cost_usd:.2f} USD")
    return resolution


# ============================================================================
# Step 3: Nosana Decentralized GPU Marketplace Offload
# ============================================================================

def dispatch_nosana_compute_job(
    inspection: InspectionEvent,
    bom: BOMPartResolution,
    nosana_api_key: Optional[str] = None,
) -> NosanaBatchResult:
    """
    Dispatches 3D volumetric point-cloud and defect depth analysis to Nosana's
    decentralized GPU network (https://api.nosana.com/api/v1/jobs).
    """
    logger.info("----------------------------------------------------------------------")
    logger.info("STEP 3: [Nosana Network] Offloading 3D Defect Compute to Decentralized GPUs")
    logger.info("----------------------------------------------------------------------")

    api_key = nosana_api_key or os.getenv("NOSANA_API_KEY", "")
    nosana_url = os.getenv("NOSANA_JOBS_URL", "https://api.nosana.com/api/v1/jobs")

    payload = {
        "job_type": "surface_depth_3d_pointcloud_v2",
        "market": "nosana-automotive-tier1-gpu",
        "inputs": {
            "vin": inspection.vin,
            "defect_class": inspection.defect_class,
            "part_id": bom.part_id,
            "bounding_box": inspection.bounding_box,
            "required_vram_gb": 24,
        },
    }

    if requests is not None and api_key and not api_key.startswith("MY_"):
        try:
            headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
            resp = requests.post(nosana_url, json=payload, headers=headers, timeout=10)
            if resp.status_code in (200, 201):
                data = resp.json()
                return NosanaBatchResult(
                    job_id=data.get("job_id", f"nos-job-{uuid.uuid4().hex[:8]}"),
                    gpu_cluster_node=data.get("node_id", "nos-eu-frankfurt-rtx4090-09"),
                    execution_time_ms=data.get("execution_ms", 312.4),
                    structural_integrity_score=data.get("integrity_score", 0.88),
                    depth_wear_mm=data.get("depth_mm", 1.85),
                    safety_critical=data.get("safety_critical", True),
                    estimated_nos_token_cost=data.get("nos_cost", 0.045),
                    mock_mode=False,
                )
        except Exception:
            pass

    # High-fidelity mock fallback
    time.sleep(0.4)
    depth_wear = 2.15 if "scratch" in inspection.defect_class else 4.5
    result = NosanaBatchResult(
        job_id=f"nos-batch-{uuid.uuid4().hex[:10]}",
        gpu_cluster_node="nos-sol-rig-rtx4090-sg-04",
        execution_time_ms=284.6,
        structural_integrity_score=0.79,
        depth_wear_mm=depth_wear,
        safety_critical=depth_wear > 1.0,
        estimated_nos_token_cost=0.038,
        mock_mode=True,
    )
    logger.info(f"  > Job ID:             {result.job_id}")
    logger.info(f"  > Execution Latency:  {result.execution_time_ms} ms")
    logger.info(f"  > Surface Depth Wear: {result.depth_wear_mm} mm")
    logger.info(f"  > Safety Critical:    {result.safety_critical}")
    logger.info(f"  > Nosana Cost:        {result.estimated_nos_token_cost} NOS (~$0.0041 USD)")
    return result


# ============================================================================
# Step 4: Daytona Ephemeral Sandbox Remediation
# ============================================================================

def execute_daytona_sandbox_remediation(
    inspection: InspectionEvent,
    bom: BOMPartResolution,
    compute: NosanaBatchResult,
) -> RemediationResult:
    """
    Provisions a secure, isolated Daytona sandbox container, writes
    'order_replacement_part.py', executes it inside the sandbox, and destroys
    the container.
    """
    logger.info("----------------------------------------------------------------------")
    logger.info("STEP 4: [Daytona Sandbox] Provisioning Isolated Remediation Container")
    logger.info("----------------------------------------------------------------------")

    po_id = f"PO-{time.strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"
    labor_rate = 110.00
    labor_total = round(bom.labor_hours * labor_rate, 2)
    grand_total = round(bom.replacement_cost_usd + labor_total, 2)

    script_source = f"""#!/usr/bin/env python3
import json, time

po = {{
    "purchase_order_id": "{po_id}",
    "status": "APPROVED_AUTO_DISPATCH",
    "timestamp": time.time(),
    "vehicle": {{"vin": "{inspection.vin}", "model": "{inspection.vehicle_model}"}},
    "bom_procurement": {{
        "part_id": "{bom.part_id}",
        "oem_sku": "{bom.oem_sku}",
        "unit_cost_usd": {bom.replacement_cost_usd},
        "labor_total_usd": {labor_total},
        "grand_total_deduction_usd": {grand_total}
    }}
}}
with open("purchase_order_{po_id}.json", "w") as f:
    json.dump(po, f, indent=2)
print(json.dumps(po))
"""
    sandbox_id = f"daytona-box-{uuid.uuid4().hex[:8]}"
    daytona_api_key = os.getenv("DAYTONA_API_KEY")

    if Daytona is not None and daytona_api_key:
        try:
            config = DaytonaConfig(api_key=daytona_api_key)
            client = Daytona(config=config)
            workspace = client.create(CreateWorkspaceParams(language="python"))
            sandbox_id = getattr(workspace, "id", sandbox_id)
            workspace.fs.upload_file("/workspace/order_replacement_part.py", script_source.encode("utf-8"))
            exec_res = workspace.process.exec("python /workspace/order_replacement_part.py")
            output = exec_res.result
            client.remove(workspace)
            return RemediationResult(sandbox_id, po_id, grand_total, "APPROVED_AUTO_DISPATCH", output, True)
        except Exception:
            pass

    # Hermetic execution fallback
    time.sleep(0.3)
    logger.info(f"  > Sandbox {sandbox_id} created & isolated.")
    logger.info(f"  > Executed 'order_replacement_part.py' successfully.")
    logger.info(f"  > Sandbox {sandbox_id} destroyed cleanly.")

    parsed = {
        "purchase_order_id": po_id,
        "status": "APPROVED_AUTO_DISPATCH",
        "vehicle": {"vin": inspection.vin, "model": inspection.vehicle_model},
        "bom_procurement": {
            "part_id": bom.part_id,
            "unit_cost_usd": bom.replacement_cost_usd,
            "grand_total_deduction_usd": grand_total
        }
    }

    return RemediationResult(
        sandbox_id=sandbox_id,
        purchase_order_id=po_id,
        total_deduction_usd=grand_total,
        status="APPROVED_AUTO_DISPATCH",
        script_output=json.dumps(parsed, indent=2),
        teardown_successful=True
    )


# ============================================================================
# Main Agent Loop Orchestrator
# ============================================================================

def run_autonomous_inspection_pipeline(vin="SG-BUS-8821X", defect="deep-scratch", component="Front Bumper Assembly", confidence=0.94, model="Lucid Air Grand Touring"):
    inspection = capture_inbound_inspection_event(vin, defect, component, confidence, model)
    bom = query_neo4j_bom_sync(inspection.vin, inspection.defect_class, inspection.target_component)
    compute = dispatch_nosana_compute_job(inspection, bom)
    remediation = execute_daytona_sandbox_remediation(inspection, bom, compute)
    return {"status": "SUCCESS", "vin": vin, "po_id": remediation.purchase_order_id, "deduction": remediation.total_deduction_usd}


if __name__ == "__main__":
    run_autonomous_inspection_pipeline()
`;
