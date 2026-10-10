import { create } from 'zustand';
import { getAuditRequirements, isAuditReady } from '@/lib/auditRequirements';
import {
  initialAreasMine,
  initialLegalMatrixMine,
  initialDocumentsMine,
  initialAreasOil,
  initialLegalMatrixOil,
  initialDocumentsOil,
  initialAreasAirport,
  initialLegalMatrixAirport,
  initialDocumentsAirport
} from './initialCompanyData';

export interface EnvAspect {
  id: string;
  name: string;
  impact: string;
  severity: number; // 1-5
  probability: number; // 1-5
  significanceScore: number; // severity * probability
  isSignificant: boolean;
  mitigated: boolean;
  controlId?: string;
}

export interface OperationalControl {
  id: string;
  name: string;
  description: string;
  cost: number;
  active: boolean;
  impacts: {
    energy?: number;
    water?: number;
    waste?: number;
    emissions?: number;
    risk?: number;
    compliance?: number;
  };
}

export interface CompanyArea {
  id: string;
  name: string;
  description: string;
  category: 'admin' | 'ops' | 'support';
  aspects: EnvAspect[];
  controls: OperationalControl[];
  energyUsage: number;
  waterUsage: number;
  wasteGenerated: number;
  emissions: number;
  riskLevel: number;
  workersCount: number;
  trainingProgress: number;
}

export interface EMSDocument {
  id: string;
  type: 'policy' | 'aspect_matrix' | 'legal_matrix' | 'objectives' | 'procedures' | 'emergency_plan' | 'audit_report' | 'action_plan';
  title: string;
  content: string;
  status: 'draft' | 'under_review' | 'signed' | 'approved_ceo';
  lastUpdated: string;
}

export interface ChatMessage {
  id: string;
  sender: 'player' | 'auditor' | 'consultor' | 'inspector' | 'ceo';
  text: string;
  timestamp: string;
}

export interface SimulationTickData {
  week: number;
  budget: number;
  legalCompliance: number;
  environmentalScore: number;
  reputation: number;
  operationalRisk: number;
  carbonFootprint: number;
}

export interface CompanyState {
  id: string;
  name: string;
  sector: string;
  description: string;
  
  // Metrics
  week: number;
  budget: number;
  legalCompliance: number;
  environmentalScore: number;
  reputation: number;
  operationalRisk: number;
  certificationProbability: number;
  carbonScope1: number;
  carbonScope2: number;
  carbonScope3: number;
  
  // Progression status
  activeClause: number;
  certificationStatus: 'not_started' | 'preparing' | 'in_audit' | 'certified' | 'failed';
  
  // SWOT & PESTEL (Clause 4)
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
  pestel: { political: string[]; economic: string[]; social: string[]; technological: string[]; environmental: string[]; legal: string[] };
  climateRelevanceDetermined: boolean;
  climateRelevanceReasoning: string;
  climateStakeholderRequirements: string;
  stakeholders: Array<{ name: string; interest: number; influence: number; requirements: string }>;
  scopeStatement: string;
  
  // Roles (Clause 5)
  rolesAssigned: Array<{ role: string; person: string; responsibilities: string }>;
  
  // Legal Matrix (Clause 6)
  legalMatrix: Array<{ id: string; regulation: string; area: string; requirement: string; status: 'compliant' | 'non_compliant'; penalty: number }>;
  
  // Clause 6.3 Change Management
  changeManagementCompleted: boolean;

  // Training & Competence (Clause 7)
  trainingLevel: number;
  competenceQuizCompleted: boolean;
  awarenessScore: number;
  
  // Incidents and Audits (Clause 8, 9, 10)
  incidents: Array<{ id: string; week: number; area: string; description: string; impact: string; severity: 'low' | 'medium' | 'high'; status: 'open' | 'investigating' | 'closed'; correctiveActions: string[] }>;
  areas: Record<string, CompanyArea>;
  documents: EMSDocument[];
  chatHistory: Record<string, ChatMessage[]>;
  newsFeed: Array<{ id: string; week: number; type: 'info' | 'success' | 'warning' | 'error'; message: string }>;
  historyData: SimulationTickData[];
}

export interface GameState extends Omit<CompanyState, 'id' | 'name' | 'sector' | 'description'> {
  // Global player progression
  xp: number;
  level: number;
  badges: string[];
  
  // Multi-company architecture
  currentCompanyId: 'metal' | 'chem' | 'power' | 'mine' | 'oil' | 'airport';
  companies: Record<'metal' | 'chem' | 'power' | 'mine' | 'oil' | 'airport', CompanyState>;
  
  // Actions
  switchCompany: (companyId: 'metal' | 'chem' | 'power' | 'mine' | 'oil' | 'airport') => void;
  tickWeek: () => void;
  assignBudget: (amount: number) => boolean;
  toggleControl: (areaId: string, controlId: string) => void;
  updateDocument: (id: string, content: string, status?: EMSDocument['status']) => void;
  signPolicy: () => void;
  addChatMessage: (agent: string, message: ChatMessage) => void;
  triggerEvent: (event: { type: 'info' | 'success' | 'warning' | 'error'; message: string }) => void;
  assignRole: (roleIndex: number, person: string) => void;
  updateSwotPestel: (type: 'swot' | 'pestel', key: string, values: string[]) => void;
  updateClimateImpact: (reasoning: string, requirements: string) => void;
  updateStakeholderRequirements: (index: number, reqs: string) => void;
  setScopeStatement: (scope: string) => void;
  updateLegalStatus: (id: string, status: 'compliant' | 'non_compliant') => void;
  conductTraining: (cost: number) => void;
  investigateIncident: (id: string, correctiveAction: string) => void;
  completeChangeManagement: () => void;
  runFinalAudit: () => void;
  resetGame: () => void;
}

// ==========================================================
// 1. METALMECÁNICA INITIAL STATE
// ==========================================================
const initialAreasMetal = (): Record<string, CompanyArea> => ({
  dg: {
    id: 'dg',
    name: 'Dirección General',
    description: 'Oficina ejecutiva de EnviroPro Metalmecánica. Punto de partida para el liderazgo y asignación de recursos.',
    category: 'admin',
    energyUsage: 1200,
    waterUsage: 20,
    wasteGenerated: 15,
    emissions: 400,
    riskLevel: 10,
    workersCount: 5,
    trainingProgress: 0,
    aspects: [
      { id: 'dg_paper', name: 'Consumo de papel de oficina', impact: 'Agotamiento de recursos forestales', severity: 2, probability: 4, significanceScore: 8, isSignificant: false, mitigated: false }
    ],
    controls: [
      { id: 'dg_paperless', name: 'Política de Oficina Cero Papel', description: 'Digitalización completa de flujos de trabajo.', cost: 3000, active: false, impacts: { waste: -70, risk: -5 } }
    ]
  },
  prod: {
    id: 'prod',
    name: 'Producción y Prensas',
    description: 'Línea de estampado y corte metálico pesado. Alto consumo de electricidad y generación de ruido.',
    category: 'ops',
    energyUsage: 25000,
    waterUsage: 350,
    wasteGenerated: 1800,
    emissions: 8500,
    riskLevel: 85,
    workersCount: 45,
    trainingProgress: 0,
    aspects: [
      { id: 'prod_energy', name: 'Alto consumo de energía eléctrica', impact: 'Emisión indirecta de gases (Scope 2)', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'prod_noise', name: 'Generación de ruido industrial perimetral', impact: 'Contaminación acústica y afectación vecinal', severity: 3, probability: 4, significanceScore: 12, isSignificant: true, mitigated: false },
      { id: 'prod_scrap', name: 'Generación de chatarra de cobre y acero', impact: 'Agotamiento de recursos naturales y residuos', severity: 3, probability: 5, significanceScore: 15, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'prod_led', name: 'Motores Eficientes IE3 e Iluminación LED', description: 'Reemplazo de motores obsoletos y lámparas de sodio.', cost: 25000, active: false, impacts: { energy: -30, emissions: -20 } },
      { id: 'prod_acoustic', name: 'Cabinas de Insonorización Acústica', description: 'Paneles absorbentes en prensas hidráulicas.', cost: 12000, active: false, impacts: { risk: -20 } },
      { id: 'prod_recycle_scrap', name: 'Programa de Logística Inversa de Scrap', description: 'Retorno directo al proveedor de fundición.', cost: 8000, active: false, impacts: { waste: -50 } }
    ]
  },
  alm: {
    id: 'alm',
    name: 'Almacén de Insumos',
    description: 'Depósito de solventes, pallets y embalajes. Riesgo de derrames sobre suelo de tierra.',
    category: 'ops',
    energyUsage: 3200,
    waterUsage: 15,
    wasteGenerated: 350,
    emissions: 900,
    riskLevel: 65,
    workersCount: 10,
    trainingProgress: 0,
    aspects: [
      { id: 'alm_spill', name: 'Riesgo de derrame de disolventes químicos', impact: 'Contaminación directa de suelos y agua subterránea', severity: 5, probability: 3, significanceScore: 15, isSignificant: true, mitigated: false },
      { id: 'alm_packing', name: 'Desecho de pallets de madera dañados', impact: 'Aumento de residuos sólidos no peligrosos', severity: 2, probability: 4, significanceScore: 8, isSignificant: false, mitigated: false }
    ],
    controls: [
      { id: 'alm_bunds', name: 'Cubetos de Retención de Acero (110%)', description: 'Barreras secundarias antiderrames bajo cilindros.', cost: 9500, active: false, impacts: { risk: -40, compliance: 15 } },
      { id: 'alm_pallets', name: 'Contrato de Reutilización de Pallets', description: 'Logística inversa con los aserraderos locales.', cost: 4000, active: false, impacts: { waste: -40 } }
    ]
  },
  log: {
    id: 'log',
    name: 'Logística de Despacho',
    description: 'Flota propia de camiones diésel para entrega de piezas metálicas a clientes.',
    category: 'support',
    energyUsage: 8500,
    waterUsage: 80,
    wasteGenerated: 120,
    emissions: 12400,
    riskLevel: 60,
    workersCount: 15,
    trainingProgress: 0,
    aspects: [
      { id: 'log_diesel', name: 'Consumo de diésel en camiones pesados', impact: 'Emisiones directas de gases de efecto invernadero (Scope 1)', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'log_wash', name: 'Efluentes de lavado de camiones con hidrocarburos', impact: 'Contaminación de redes pluviales públicas', severity: 3, probability: 4, significanceScore: 12, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'log_route', name: 'Optimizador de Rutas por IA', description: 'Algoritmo para recortar kilometraje improductivo.', cost: 7000, active: false, impacts: { emissions: -15, energy: -10 } },
      { id: 'log_water_recycle', name: 'Planta de Recirculación de Agua de Lavado', description: 'Recupera el 80% del agua del taller de lavado.', cost: 11000, active: false, impacts: { water: -60, risk: -10, compliance: 10 } }
    ]
  },
  maint: {
    id: 'maint',
    name: 'Mantenimiento Mecánico',
    description: 'Taller de reparación, lubricación de prensas y engrase general.',
    category: 'ops',
    energyUsage: 2800,
    waterUsage: 45,
    wasteGenerated: 480,
    emissions: 1100,
    riskLevel: 70,
    workersCount: 8,
    trainingProgress: 0,
    aspects: [
      { id: 'maint_oils', name: 'Generación de aceites usados de motores', impact: 'Contaminación grave del agua y degradación de suelos', severity: 5, probability: 4, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'maint_rags', name: 'Desecho de trapos y EPP con hidrocarburos', impact: 'Aumento de residuos peligrosos enviados a incinerar', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'maint_biodegradable', name: 'Aceites Bio-Ésteres Biodegradables', description: 'Sustitución de lubricantes minerales en prensas.', cost: 6500, active: false, impacts: { risk: -20 } },
      { id: 'maint_laundry', name: 'Lavadora de Paños Industriales en Comodato', description: 'Evita desechar trapos como residuo peligroso.', cost: 9000, active: false, impacts: { waste: -60, compliance: 15 } }
    ]
  },
  hr: {
    id: 'hr',
    name: 'Recursos Humanos',
    description: 'Gestión de personal y capacitación en concientización ISO 14001:2026.',
    category: 'admin',
    energyUsage: 1500,
    waterUsage: 25,
    wasteGenerated: 40,
    emissions: 500,
    riskLevel: 20,
    workersCount: 6,
    trainingProgress: 0,
    aspects: [
      { id: 'hr_competence', name: 'Brecha de competencia ambiental en planta', impact: 'Accidentes e infracciones por errores de operarios', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'hr_training_platform', name: 'Portal de Gamificación ISO 14001:2026', description: 'Adiestramiento interactivo obligatorio en planta.', cost: 5000, active: false, impacts: { risk: -30, compliance: 20 } }
    ]
  },
  purch: {
    id: 'purch',
    name: 'Compras',
    description: 'Suministro e insumos. Manejo de cadena de valor y ciclo de vida.',
    category: 'support',
    energyUsage: 900,
    waterUsage: 10,
    wasteGenerated: 20,
    emissions: 300,
    riskLevel: 25,
    workersCount: 4,
    trainingProgress: 0,
    aspects: [
      { id: 'purch_lifecycle', name: 'Proveedores sin evaluación ecológica', impact: 'Aumento de huella indirecta de carbono (Scope 3)', severity: 3, probability: 5, significanceScore: 15, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'purch_procurement', name: 'Homologación de Compras Sostenibles', description: 'Exigir ISO 14001:2026 o auditoría ambiental previa.', cost: 4000, active: false, impacts: { compliance: 10 } }
    ]
  },
  lab: {
    id: 'lab',
    name: 'Laboratorio de Calidad',
    description: 'Verificación de dureza y calidad metalúrgica. Uso de ácidos para pruebas.',
    category: 'support',
    energyUsage: 4500,
    waterUsage: 150,
    wasteGenerated: 180,
    emissions: 1800,
    riskLevel: 55,
    workersCount: 5,
    trainingProgress: 0,
    aspects: [
      { id: 'lab_acid', name: 'Emisión de neblinas de ácido nítrico', impact: 'Contaminación del aire local y corrosión estructural', severity: 3, probability: 3, significanceScore: 9, isSignificant: false, mitigated: false },
      { id: 'lab_waste_liquids', name: 'Descarga de disoluciones de ataque ácido', impact: 'Alteración del pH de colectores urbanos públicos', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'lab_scrubber', name: 'Filtro de Neblinas Húmedo (Scrubber)', description: 'Neutraliza vapores de chimenea antes de la descarga.', cost: 14000, active: false, impacts: { emissions: -30, compliance: 25 } },
      { id: 'lab_neutralization', name: 'Dosificador Automático de Cal Neutralizadora', description: 'Ajustador de pH en caja de efluente químico.', cost: 8500, active: false, impacts: { water: -20, risk: -20, compliance: 15 } }
    ]
  },
  pt: {
    id: 'pt',
    name: 'Planta de Tratamiento',
    description: 'Tratamiento de efluentes de enfriamiento y aguas grises de planta.',
    category: 'ops',
    energyUsage: 12000,
    waterUsage: 80,
    wasteGenerated: 1200,
    emissions: 3200,
    riskLevel: 75,
    workersCount: 4,
    trainingProgress: 0,
    aspects: [
      { id: 'pt_effluent', name: 'Vertimiento de efluentes con aceites flotantes', impact: 'Eutrofización y muerte de peces en río aledaño', severity: 5, probability: 4, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'pt_sludge', name: 'Generación de lodos de sedimentación', impact: 'Aumento de lodos húmedos en rellenos especiales', severity: 3, probability: 4, significanceScore: 12, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'pt_osmosis', name: 'Filtro de Ósmosis Inversa de Pulido', description: 'Recirculación al 100% de efluente tratado a calderas.', cost: 35000, active: false, impacts: { water: -70, risk: -30, compliance: 30 } },
      { id: 'pt_filterpress', name: 'Filtro Prensa y Floculantes Ecológicos', description: 'Deshidrata lodos reduciendo el peso de transporte.', cost: 16000, active: false, impacts: { waste: -40, energy: -10 } }
    ]
  },
  patio: {
    id: 'patio',
    name: 'Patio de Residuos',
    description: 'Centro de segregación y almacenamiento temporal de residuos.',
    category: 'ops',
    energyUsage: 800,
    waterUsage: 10,
    wasteGenerated: 3500,
    emissions: 400,
    riskLevel: 70,
    workersCount: 3,
    trainingProgress: 0,
    aspects: [
      { id: 'patio_lix', name: 'Escurrimiento de lixiviados por lluvia en chatarra', impact: 'Filtración de metales pesados en subsuelo', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false },
      { id: 'patio_segregation', name: 'Mezcla de residuos sólidos peligrosos y urbanos', impact: 'Infracción regulatoria y sobrecostos de traslado', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'patio_canopy', name: 'Techado de Acero e Impermeabilización', description: 'Estructura metálica y losa con canaletas ciegas.', cost: 15000, active: false, impacts: { risk: -40, compliance: 20 } },
      { id: 'patio_bins', name: 'Contenedores Colorimétricos Rotulados', description: 'Segregación en base a código nacional de colores.', cost: 4500, active: false, impacts: { waste: -30, compliance: 10 } }
    ]
  },
  off: {
    id: 'off',
    name: 'Oficinas Administrativas',
    description: 'Ventas, Contabilidad y Finanzas de la organizaci��n.',
    category: 'admin',
    energyUsage: 4500,
    waterUsage: 90,
    wasteGenerated: 80,
    emissions: 1500,
    riskLevel: 15,
    workersCount: 20,
    trainingProgress: 0,
    aspects: [
      { id: 'off_ac', name: 'Consumo eléctrico de climatización y PCs', impact: 'Huella de carbono indirecta (Scope 2)', severity: 2, probability: 5, significanceScore: 10, isSignificant: false, mitigated: false }
    ],
    controls: [
      { id: 'off_smart_ac', name: 'Termostatos y Sensores de Presencia', description: 'Apagado automático fuera del horario laboral.', cost: 5500, active: false, impacts: { energy: -25 } }
    ]
  }
});

const initialLegalMatrixMetal = () => [
  { id: 'R-DS001', regulation: 'Ley de Gestión Integral de Residuos Sólidos (DL 1278)', area: 'Patio de Residuos', requirement: 'Segregación obligatoria y almacenamiento techado de peligrosos.', status: 'non_compliant', penalty: 8000 } as const,
  { id: 'R-DS002', regulation: 'Límites Máximos Permisibles de Vertimientos Industriales', area: 'Planta de Tratamiento', requirement: 'Concentración de grasas y aceites < 20 mg/L y pH entre 6.5-8.5.', status: 'non_compliant', penalty: 15000 } as const,
  { id: 'R-DS003', regulation: 'Estándares de Calidad Ambiental (ECA) para Ruido Diurno', area: 'Producción y Prensas', requirement: 'No exceder los 80 dB en el perímetro colindante.', status: 'compliant', penalty: 5000 } as const,
  { id: 'R-DS004', regulation: 'Reglamento de Almacenamiento de Sustancias Peligrosas', area: 'Almacén de Insumos', requirement: 'Implementación obligatoria de diques de contención del 110%.', status: 'non_compliant', penalty: 12000 } as const,
];

const initialDocumentsMetal = (): EMSDocument[] => [
  {
    id: 'policy_doc',
    type: 'policy',
    title: 'Política Ambiental de EnviroPro Metalmecánica',
    content: `<h1>POLÍTICA AMBIENTAL - ENVIROPRO S.A. (ISO 14001:2026)</h1>
<p><strong>Código:</strong> ENV-POL-001 | <strong>Versión:</strong> 3.0</p>
<hr />
<p>En EnviroPro S.A., empresa de manufactura metalmecánica de componentes de precisión, nos comprometemos a liderar nuestra actividad bajo un enfoque preventivo alineado con la norma ISO 14001:2026 y los ODS:</p>
<ol>
  <li><strong>Protección del medio ambiente:</strong> Prevenir la contaminación asociada a nuestros ruidos, aceites y residuos de chatarra. Reducir la huella de carbono Scope 1, 2 y 3 para mitigar el Cambio Climático (§4.1).</li>
  <li><strong>Cumplimiento legal:</strong> Cumplir de forma irrestricta los requisitos regulatorios en vertimientos y manejo de residuos peligrosos.</li>
  <li><strong>Mejora continua:</strong> Evaluar y elevar sistemáticamente el desempeño del SGA mediante metas validadas científicamente.</li>
  <li><strong>Perspectiva de Ciclo de Vida:</strong> Exigir criterios ambientales en compras e impulsar la valorización del scrap metálico.</li>
</ol>
<p><em>[Pendiente de firma de la Dirección General]</em></p>`,
    status: 'draft',
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    id: 'matrix_doc',
    type: 'aspect_matrix',
    title: 'Matriz de Aspectos e Impactos Ambientales',
    content: `<h1>MATRIZ DE SIGNIFICANCIA AMBIENTAL (ISO 14001:2026 §6.1.2)</h1>
<p>Criterio: Severidad (1-5) x Probabilidad (1-5). Significativo si es >= 12.</p>
<table border="1" cellpadding="5" style="border-collapse:collapse; width:100%; font-size:11px;">
  <tr style="background:#f1f5f9;">
    <th>Área</th>
    <th>Aspecto Ambiental</th>
    <th>Impacto Asociado</th>
    <th>Score</th>
    <th>Significativo</th>
  </tr>
  <tr>
    <td>Producción</td>
    <td>Alto consumo de energía eléctrica</td>
    <td>Indirecto por generación eléctrica (Scope 2)</td>
    <td>20</td>
    <td>SÍ</td>
  </tr>
  <tr>
    <td>Almacén</td>
    <td>Riesgo de derrame de reactivos</td>
    <td>Contaminación química de suelo e hidrología</td>
    <td>15</td>
    <td>SÍ</td>
  </tr>
  <tr>
    <td>Logística</td>
    <td>Consumo de diésel</td>
    <td>Emisión directa de CO2 y partículas (Scope 1)</td>
    <td>20</td>
    <td>SÍ</td>
  </tr>
</table>`,
    status: 'draft',
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    id: 'legal_doc',
    type: 'legal_matrix',
    title: 'Matriz de Obligaciones Legales',
    content: `<h1>COMPENDIO DE OBLIGACIONES DE CUMPLIMIENTO (ISO 14001:2026 §6.1.3)</h1>
<table border="1" cellpadding="5" style="border-collapse:collapse; width:100%; font-size:11px;">
  <tr style="background:#f1f5f9;">
    <th>Ley</th>
    <th>Área</th>
    <th>Requisito</th>
    <th>Estado</th>
  </tr>
  <tr>
    <td>DL 1278 (Residuos)</td>
    <td>Patio Residuos</td>
    <td>Almacenamiento techado e impermeable de peligrosos.</td>
    <td>Incumple (EPP contaminado al aire libre)</td>
  </tr>
  <tr>
    <td>LMP Vertamientos</td>
    <td>Planta Tratamiento</td>
    <td>Monitoreo de grasas y aceites por debajo de 20 mg/L.</td>
    <td>Incumple (Fugas de refrigerante)</td>
  </tr>
</table>`,
    status: 'draft',
    lastUpdated: new Date().toISOString().split('T')[0]
  }
];

// ==========================================================
// 2. BIOCHEM AGROQUÍMICA INITIAL STATE
// ==========================================================
const initialAreasChem = (): Record<string, CompanyArea> => ({
  dg: {
    id: 'dg',
    name: 'Dirección General',
    description: 'Dirección de BioChem Agroquímica. Liderazgo estratégico enfocado en la prevención de desastres químicos e impacto a la biodiversidad.',
    category: 'admin',
    energyUsage: 1500,
    waterUsage: 25,
    wasteGenerated: 20,
    emissions: 500,
    riskLevel: 10,
    workersCount: 6,
    trainingProgress: 0,
    aspects: [
      { id: 'dg_dec', name: 'Toma de decisiones presupuestarias', impact: 'Asignación tardía de fondos para diques de emergencia', severity: 4, probability: 2, significanceScore: 8, isSignificant: false, mitigated: false }
    ],
    controls: [
      { id: 'dg_risk_funds', name: 'Presupuesto Bloqueado para Emergencias', description: 'Fondo intocable de $20,000 para contención de incidentes.', cost: 4000, active: false, impacts: { risk: -20, compliance: 10 } }
    ]
  },
  react: {
    id: 'react',
    name: 'Reactores de Síntesis',
    description: 'Formulación y reacción química a alta temperatura. Genera emisiones de Gases Ácidos y Compuestos Orgánicos Volátiles (COVs).',
    category: 'ops',
    energyUsage: 35000,
    waterUsage: 800,
    wasteGenerated: 2500,
    emissions: 15400,
    riskLevel: 90,
    workersCount: 20,
    trainingProgress: 0,
    aspects: [
      { id: 'react_voc', name: 'Emisión de vapores y compuestos orgánicos volátiles (COV)', impact: 'Contaminación del aire local y afectación pulmonar de operarios', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'react_temp', name: 'Fugas térmicas por sobrepresión en reactores', impact: 'Riesgo de explosión atmosférica y daño ecológico perimetral', severity: 5, probability: 3, significanceScore: 15, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'react_scrubber_gas', name: 'Lavador de Gases de Doble Etapa (Scrubber)', description: 'Neutralización química de vapores ácidos y COVs de reactores.', cost: 28000, active: false, impacts: { emissions: -45, compliance: 20 } },
      { id: 'react_ir_sensors', name: 'Sensores Infrarrojos de VOCs por IoT', description: 'Detección en tiempo real de microfugas de bridas.', cost: 9000, active: false, impacts: { risk: -25 } }
    ]
  },
  alm_chem: {
    id: 'alm_chem',
    name: 'Almacén de Sustancias Críticas',
    description: 'Depósito de materias primas tóxicas e insumos reactivos concentrados.',
    category: 'ops',
    energyUsage: 2500,
    waterUsage: 20,
    wasteGenerated: 400,
    emissions: 600,
    riskLevel: 80,
    workersCount: 8,
    trainingProgress: 0,
    aspects: [
      { id: 'alm_spill_toxic', name: 'Derrame de materias primas agroquímicas concentradas', impact: 'Contaminación de napas freáticas y degradación grave de suelos', severity: 5, probability: 4, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'alm_pack_contaminated', name: 'Generación de envases plásticos contaminados', impact: 'Acumulación de residuos peligrosos de difícil reciclaje', severity: 3, probability: 4, significanceScore: 12, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'alm_bunds_chem', name: 'Cubetos de Retención de Polietileno Químico', description: 'Contención antiderrames anticorrosión bajo tambores.', cost: 12000, active: false, impacts: { risk: -45, compliance: 25 } },
      { id: 'alm_neutralizers', name: 'Estación de Neutralizadores Absorbentes', description: 'Kits provistos de vermiculita y soda ash para ácidos.', cost: 4500, active: false, impacts: { waste: -30 } }
    ]
  },
  log_haz: {
    id: 'log_haz',
    name: 'Logística de Sustancias Peligrosas',
    description: 'Transporte de fertilizantes y herbicidas líquidos a distribuidores agrícolas.',
    category: 'support',
    energyUsage: 9500,
    waterUsage: 120,
    wasteGenerated: 150,
    emissions: 18600,
    riskLevel: 75,
    workersCount: 12,
    trainingProgress: 0,
    aspects: [
      { id: 'log_haz_spill', name: 'Riesgo de volcadura de camiones cisterna químicos', impact: 'Derrame masivo en vías públicas y daño a cuerpos de agua superficiales', severity: 5, probability: 3, significanceScore: 15, isSignificant: true, mitigated: false },
      { id: 'log_co2', name: 'Emisión por distribución de media y larga distancia', impact: 'Gases de efecto invernadero directos (Scope 1)', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'log_safe_route', name: 'Plan de Rutas Críticas y Sensores IoT', description: 'Monitoreo de fatiga y evasión de zonas de reserva natural.', cost: 8500, active: false, impacts: { risk: -25, energy: -10 } },
      { id: 'log_adr_drivers', name: 'Programa de Certificación de Cargas Peligrosas', description: 'Capacitación externa obligatoria a transportistas.', cost: 6000, active: false, impacts: { compliance: 20, risk: -15 } }
    ]
  },
  maint_chem: {
    id: 'maint_chem',
    name: 'Mantenimiento de Planta Química',
    description: 'Inspección de empaquetaduras de reactores y sellos de bombas químicas.',
    category: 'ops',
    energyUsage: 3000,
    waterUsage: 50,
    wasteGenerated: 600,
    emissions: 1200,
    riskLevel: 75,
    workersCount: 10,
    trainingProgress: 0,
    aspects: [
      { id: 'maint_acid_purges', name: 'Generación de purgas ácidas de limpieza de tuberías', impact: 'Residuos líquidos tóxicos con sales pesadas corrosivas', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false },
      { id: 'maint_chlorinated', name: 'Uso de solventes clorados para limpieza de filtros', impact: 'Agotamiento de ozono y generación de vapores peligrosos', severity: 4, probability: 3, significanceScore: 12, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'maint_aqueous', name: 'Sustitución por Desengrasantes Acuosos', description: 'Reemplazo de solventes clorados por fluidos ecológicos base agua.', cost: 7500, active: false, impacts: { risk: -20, waste: -25 } },
      { id: 'maint_loto', name: 'Protocolo de Purga y Lockout-Tagout (LOTO)', description: 'Procedimiento seguro para neutralización previa de tuberías.', cost: 5000, active: false, impacts: { compliance: 15, risk: -15 } }
    ]
  },
  hr: {
    id: 'hr',
    name: 'Recursos Humanos',
    description: 'Adiestramiento de brigadas contra emergencias químicas e intoxicación.',
    category: 'admin',
    energyUsage: 1600,
    waterUsage: 30,
    wasteGenerated: 35,
    emissions: 400,
    riskLevel: 20,
    workersCount: 5,
    trainingProgress: 0,
    aspects: [
      { id: 'hr_toxic_awareness', name: 'Desconocimiento de brigadistas de hojas MSDS', impact: 'Exposición accidental a químicos e inacción ante derrames', severity: 5, probability: 3, significanceScore: 15, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'hr_hazmat_drill', name: 'Simulacros HAZMAT Avanzados Anuales', description: 'Capacitación presencial con trajes encapsulados.', cost: 7000, active: false, impacts: { risk: -35, compliance: 25 } }
    ]
  },
  purch_bio: {
    id: 'purch_bio',
    name: 'Compras Sostenibles',
    description: 'Sourcing de materias primas ecológicas e ingredientes activos biodegradables.',
    category: 'support',
    energyUsage: 1000,
    waterUsage: 15,
    wasteGenerated: 15,
    emissions: 300,
    riskLevel: 30,
    workersCount: 4,
    trainingProgress: 0,
    aspects: [
      { id: 'purch_biodiversity', name: 'Insumos químicos de proveedores con daño ecosistémico', impact: 'Pérdida indirecta de biodiversidad por extracción (Scope 3)', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'purch_provider_audit', name: 'Auditorías Ambientales a Proveedores de Insumos', description: 'Exigir trazabilidad ecológica y reporte de impactos en biodiversidad.', cost: 5000, active: false, impacts: { compliance: 15 } }
    ]
  },
  lab_anal: {
    id: 'lab_anal',
    name: 'Laboratorio Analítico',
    description: 'Control de formulaciones químicas y análisis de metales.',
    category: 'support',
    energyUsage: 5000,
    waterUsage: 250,
    wasteGenerated: 250,
    emissions: 2200,
    riskLevel: 60,
    workersCount: 6,
    trainingProgress: 0,
    aspects: [
      { id: 'lab_solvent_waste', name: 'Generación de mezclas de reactivos orgánicos líquidos', impact: 'Residuos químicos inflamables de alta toxicidad', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false },
      { id: 'lab_acid_vapors', name: 'Ataques ácidos con neblinas corrosivas', impact: 'Contaminación ácida atmosférica y lluvias localizadas', severity: 3, probability: 4, significanceScore: 12, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'lab_waste_segregation', name: 'Sistema de Disposición Separada de Reactivos', description: 'Recolección selectiva fraccionada en bidones rotulados.', cost: 8000, active: false, impacts: { waste: -40, risk: -15 } },
      { id: 'lab_scrubber_chem', name: 'Scrubber en Vitrina de Extracción', description: 'Neutraliza humos ácidos de análisis antes de chimenea.', cost: 13000, active: false, impacts: { emissions: -35, compliance: 15 } }
    ]
  },
  pt_ind: {
    id: 'pt_ind',
    name: 'Tratamiento de Efluentes Especiales',
    description: 'Planta de neutralización fisicoquímica para metales pesados y trazas orgánicas.',
    category: 'ops',
    energyUsage: 18000,
    waterUsage: 110,
    wasteGenerated: 2800,
    emissions: 4500,
    riskLevel: 80,
    workersCount: 5,
    trainingProgress: 0,
    aspects: [
      { id: 'pt_heavy_metals', name: 'Vertimiento de agua con exceso de plomo y cobre', impact: 'Destrucción de flora y fauna en río (Eutrofización de cuenca)', severity: 5, probability: 4, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'pt_toxic_sludge', name: 'Generación de lodos de precipitación química', impact: 'Contaminación de suelos por depósito en rellenos ordinarios', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'pt_adsorption', name: 'Módulo de Adsorción por Carbón Activado y Ozono', description: 'Eliminación final de trazas orgánicas y plaguicidas.', cost: 38000, active: false, impacts: { water: -60, risk: -30, compliance: 30 } },
      { id: 'pt_sludge_dryer', name: 'Filtro Prensa de Alta Presión y Deshidratación', description: 'Reduce peso de lodos químicos disminuyendo residuo peligroso.', cost: 22000, active: false, impacts: { waste: -50 } }
    ]
  },
  patio_haz: {
    id: 'patio_haz',
    name: 'Patio de Residuos Peligrosos',
    description: 'Zona externa para almacenamiento temporal de tambores de lodos y envases peligrosos.',
    category: 'ops',
    energyUsage: 1000,
    waterUsage: 15,
    wasteGenerated: 4500,
    emissions: 500,
    riskLevel: 80,
    workersCount: 4,
    trainingProgress: 0,
    aspects: [
      { id: 'patio_acid_lix', name: 'Lixiviados ácidos debido a lluvias intensas', impact: 'Acidificación directa del terreno natural colindante', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false },
      { id: 'patio_fire', name: 'Riesgo de incendio en chatarra de envases químicos', impact: 'Emisión de humos negros tóxicos y riesgo perimetral', severity: 4, probability: 3, significanceScore: 12, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'patio_bund_roof', name: 'Diques de Contención y Techo Impermeable', description: 'Losa de hormigón sellada con canaletas ciegas antiderrames.', cost: 18000, active: false, impacts: { risk: -45, compliance: 25 } },
      { id: 'patio_deluge', name: 'Rociadores y Alarma Térmica Antiexplosiva', description: 'Sistema automático de enfriamiento por espuma.', cost: 14000, active: false, impacts: { risk: -30 } }
    ]
  },
  off: {
    id: 'off',
    name: 'Oficinas Administrativas',
    description: 'Oficinas corporativas de BioChem.',
    category: 'admin',
    energyUsage: 5000,
    waterUsage: 100,
    wasteGenerated: 90,
    emissions: 1600,
    riskLevel: 15,
    workersCount: 25,
    trainingProgress: 0,
    aspects: [
      { id: 'off_electricity', name: 'Consumo eléctrico de iluminación y servidores', impact: 'Huella de carbono Scope 2 por compra eléctrica', severity: 2, probability: 5, significanceScore: 10, isSignificant: false, mitigated: false }
    ],
    controls: [
      { id: 'off_green_energy', name: 'Luminarias Inteligentes de Baja Densidad', description: 'Sensores e iluminación regulable LED.', cost: 5000, active: false, impacts: { energy: -20 } }
    ]
  }
});

const initialLegalMatrixChem = () => [
  { id: 'R-Q001', regulation: 'Ley de Control de Sustancias Químicas Fiscalizadas (Ley 29037)', area: 'Almacén de Sustancias Críticas', requirement: 'Registro diario de stock, almacenamiento seguro y entrega documentada.', status: 'non_compliant', penalty: 10000 } as const,
  { id: 'R-Q002', regulation: 'LMP para Vertimientos de la Industria Agroquímica', area: 'Tratamiento de Efluentes Especiales', requirement: 'Concentración de plaguicidas < 0.1 ppm y metales pesados dentro de límites.', status: 'non_compliant', penalty: 20000 } as const,
  { id: 'R-Q003', regulation: 'Estándares de Emisiones para Reactores Químicos', area: 'Reactores de Síntesis', requirement: 'Instalación obligatoria de scrubber para neutralización de gases ácidos.', status: 'non_compliant', penalty: 18000 } as const,
  { id: 'R-Q004', regulation: 'Reglamento de Seguridad Contra Incendios de Químicos', area: 'Patio de Residuos Peligrosos', requirement: 'Diques de contención pluvial y sistema de aspersores contra fuego.', status: 'non_compliant', penalty: 15000 } as const,
];

const initialDocumentsChem = (): EMSDocument[] => [
  {
    id: 'policy_doc',
    type: 'policy',
    title: 'Política Ambiental de BioChem Agroquímica',
    content: `<h1>POLÍTICA DE SOSTENIBILIDAD - BIOCHEM AGROQUÍMICA S.A. (ISO 14001:2026)</h1>
<p><strong>Código:</strong> BCM-POL-001 | <strong>Versión:</strong> 3.0</p>
<hr />
<p>En BioChem Agroquímica S.A., nos dedicamos a la síntesis y envasado de soluciones de nutrición vegetal. Nos comprometemos a establecer un SGA que minimice nuestros altos riesgos de contaminación y potencie la conservación de ecosistemas:</p>
<ol>
  <li><strong>Protección ambiental y prevención:</strong> Prevenir de forma activa los derrames químicos en suelos y la atmósfera. Mitigar nuestra huella de carbono y el impacto en la biodiversidad y ecosistemas locales (§3.2.1).</li>
  <li><strong>Cumplimiento normativo:</strong> Cumplir rigurosamente las normas de almacenamiento de fiscalizados y LMP de efluentes químicos.</li>
  <li><strong>Mejora continua:</strong> Monitorear nuestros KPIs de toxicidad bajo estándares GRI 303 y 305 para elevar la eficacia del SGA.</li>
  <li><strong>Ciclo de vida y cadena de suministro:</strong> Promover el uso de bio-insumos y auditar la procedencia sostenible de nuestros activos.</li>
</ol>
<p><em>[Pendiente de firma de la Dirección General]</em></p>`,
    status: 'draft',
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    id: 'matrix_doc',
    type: 'aspect_matrix',
    title: 'Matriz de Aspectos e Impactos Ambientales',
    content: `<h1>MATRIZ DE SIGNIFICANCIA AMBIENTAL - BIOCHEM (ISO 14001:2026 §6.1.2)</h1>
<table border="1" cellpadding="5" style="border-collapse:collapse; width:100%; font-size:11px;">
  <tr style="background:#f1f5f9;">
    <th>Área</th>
    <th>Aspecto Ambiental</th>
    <th>Impacto Asociado</th>
    <th>Score</th>
    <th>Significativo</th>
  </tr>
  <tr>
    <td>Reactores</td>
    <td>Emisión de compuestos orgánicos volátiles (COV)</td>
    <td>Contaminación de aire y neblinas tóxicas</td>
    <td>20</td>
    <td>SÍ</td>
  </tr>
  <tr>
    <td>Almacén Químico</td>
    <td>Derrame de materias primas concentradas</td>
    <td>Contaminación severa de suelos y acuíferos</td>
    <td>20</td>
    <td>SÍ</td>
  </tr>
  <tr>
    <td>Efluentes</td>
    <td>Descarga con metales y plaguicidas</td>
    <td>Destrucción de fauna y eutrofización de cuenca</td>
    <td>20</td>
    <td>SÍ</td>
  </tr>
</table>`,
    status: 'draft',
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    id: 'legal_doc',
    type: 'legal_matrix',
    title: 'Matriz de Obligaciones de Cumplimiento',
    content: `<h1>REQUISITOS LEGALES APLICABLES (ISO 14001:2026 §6.1.3)</h1>
<table border="1" cellpadding="5" style="border-collapse:collapse; width:100%; font-size:11px;">
  <tr style="background:#f1f5f9;">
    <th>Cód Reg</th>
    <th>Normativa</th>
    <th>Requisito Específico</th>
    <th>Estado</th>
  </tr>
  <tr>
    <td>Ley 29037</td>
    <td>Fiscalizados</td>
    <td>Control e inventario diario de precursores químicos.</td>
    <td>Incumple (Sin control de pesajes)</td>
  </tr>
  <tr>
    <td>LMP Vertimiento</td>
    <td>Efluentes Especiales</td>
    <td>Concentraciones de agroquímicos solubles < 0.1 ppm.</td>
    <td>Incumple (Presencia de trazas en desagües)</td>
  </tr>
</table>`,
    status: 'draft',
    lastUpdated: new Date().toISOString().split('T')[0]
  }
];

// ==========================================================
// 3. ECOPOWER REFINERÍA INITIAL STATE
// ==========================================================
const initialAreasPower = (): Record<string, CompanyArea> => ({
  dg: {
    id: 'dg',
    name: 'Dirección General',
    description: 'Dirección de EcoPower Refinería. Gestión enfocada en transición energética, neutralidad de carbono y gobernanza climática.',
    category: 'admin',
    energyUsage: 1800,
    waterUsage: 30,
    wasteGenerated: 25,
    emissions: 600,
    riskLevel: 10,
    workersCount: 6,
    trainingProgress: 0,
    aspects: [
      { id: 'dg_esg', name: 'Gobierno de datos corporativos ESG', impact: 'Reporte deficiente de emisiones de Alcance 3 a inversores', severity: 3, probability: 3, significanceScore: 9, isSignificant: false, mitigated: false }
    ],
    controls: [
      { id: 'dg_esg_system', name: 'Software de Trazabilidad ESG Automatizado', description: 'Reportes transparentes integrados bajo GHG Protocol.', cost: 6000, active: false, impacts: { risk: -10, compliance: 15 } }
    ]
  },
  ref: {
    id: 'ref',
    name: 'Columnas de Destilación',
    description: 'Refinamiento de aceites vegetales para la producción de biodiésel. Consumo elevado de vapor.',
    category: 'ops',
    energyUsage: 45000,
    waterUsage: 1200,
    wasteGenerated: 1900,
    emissions: 22600,
    riskLevel: 80,
    workersCount: 22,
    trainingProgress: 0,
    aspects: [
      { id: 'ref_steam', name: 'Alto consumo de vapor de calentamiento', impact: 'Agotamiento de combustible y emisiones directas (Scope 1)', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'ref_voc_leak', name: 'Fuga de vapores inflamables de alcoholes', impact: 'Generación de gases explosivos y huella de carbono', severity: 5, probability: 3, significanceScore: 15, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'ref_heat_recovery', name: 'Intercambiador de Calor y Recuperador de Condensados', description: 'Reutilización del calor residual de purgas de destilación.', cost: 32000, active: false, impacts: { energy: -35, emissions: -25 } },
      { id: 'ref_gas_valves', name: 'Detector Óptico de Gases y Válvulas Neumáticas', description: 'Bloqueo automático de líneas de metanol ante alarmas.', cost: 12000, active: false, impacts: { risk: -25 } }
    ]
  },
  alm_bio: {
    id: 'alm_bio',
    name: 'Depósito de Biocombustible',
    description: 'Tanques de almacenamiento de producto terminado biodiésel y tanques de metanol.',
    category: 'ops',
    energyUsage: 3500,
    waterUsage: 20,
    wasteGenerated: 120,
    emissions: 800,
    riskLevel: 75,
    workersCount: 7,
    trainingProgress: 0,
    aspects: [
      { id: 'alm_evap', name: 'Pérdidas por evaporación en válvulas de tanques', impact: 'Emisiones de vapores combustibles volátiles al aire', severity: 3, probability: 4, significanceScore: 12, isSignificant: true, mitigated: false },
      { id: 'alm_seepage', name: 'Filtración de biodiésel a acuíferos subterráneos', impact: 'Contaminación de recursos hídricos en cuenca crítica', severity: 5, probability: 3, significanceScore: 15, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'alm_floating_roofs', name: 'Instalación de Techo Flotante Interno en Tanques', description: 'Reduce las pérdidas por evaporación en un 90%.', cost: 22000, active: false, impacts: { emissions: -20 } },
      { id: 'alm_piezometers', name: 'Red de Pozos Piezométricos Perimetrales', description: 'Monitoreo preventivo del agua freática.', cost: 15000, active: false, impacts: { risk: -30, compliance: 20 } }
    ]
  },
  log_dist: {
    id: 'log_dist',
    name: 'Logística de Distribución',
    description: 'Despacho de biocombustible por camión y ferrocarril. Generación de Scope 3.',
    category: 'support',
    energyUsage: 12000,
    waterUsage: 60,
    wasteGenerated: 80,
    emissions: 24000,
    riskLevel: 65,
    workersCount: 15,
    trainingProgress: 0,
    aspects: [
      { id: 'log_rail_co2', name: 'Huella de carbono en la cadena de distribución', impact: 'Contribución al cambio climático por emisiones indirectas (Scope 3)', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'log_rail_bio', name: 'Socio Logístico con Flota Ferroviaria Bioeléctrica', description: 'Sustitución de camiones diésel por tracción ferroviaria.', cost: 11000, active: false, impacts: { emissions: -30, energy: -20 } },
      { id: 'log_carbon_offset', name: 'Programa de Compensación de Carbono con Bonos', description: 'Inversión en reforestación de selva virgen.', cost: 9000, active: false, impacts: { compliance: 15 } }
    ]
  },
  maint_solar: {
    id: 'maint_solar',
    name: 'Mantenimiento y Calderas de Biomasa',
    description: 'Mantenimiento de caldera generadora de vapor a biomasa y parque solar térmico.',
    category: 'ops',
    energyUsage: 4000,
    waterUsage: 250,
    wasteGenerated: 1100,
    emissions: 4200,
    riskLevel: 65,
    workersCount: 12,
    trainingProgress: 0,
    aspects: [
      { id: 'maint_boiler_particulates', name: 'Emisión de hollín y ceniza fina de biomasa', impact: 'Material particulado en suspensión (PM10) en la atmósfera', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false },
      { id: 'maint_transformer_oil', name: 'Generación de aceites dieléctricos usados de subestación', impact: 'Riesgo de contaminación por bifenilos policlorados (PCB)', severity: 5, probability: 3, significanceScore: 15, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'maint_baghouse', name: 'Filtro de Mangas y Ciclón Multitubular', description: 'Captura el 99.5% de partículas suspendidas en calderas.', cost: 24000, active: false, impacts: { emissions: -40, compliance: 25 } },
      { id: 'maint_natural_esters', name: 'Sustitución de Aceite Transformador por Ésteres Naturales', description: 'Uso de aceites de semillas biodegradables.', cost: 11500, active: false, impacts: { risk: -25 } }
    ]
  },
  hr: {
    id: 'hr',
    name: 'Recursos Humanos',
    description: 'Formación del personal y sensibilización de huella de carbono.',
    category: 'admin',
    energyUsage: 1800,
    waterUsage: 35,
    wasteGenerated: 40,
    emissions: 500,
    riskLevel: 15,
    workersCount: 5,
    trainingProgress: 0,
    aspects: [
      { id: 'hr_carbon_literacy', name: 'Desconocimiento del impacto de huella individual', impact: 'Desperdicio de insumos en planta y calefacción ineficiente', severity: 2, probability: 4, significanceScore: 8, isSignificant: false, mitigated: false }
    ],
    controls: [
      { id: 'hr_carbon_literacy_program', name: 'Taller de Huella de Carbono y ODS 13', description: 'Capacitación presencial en mitigación de huella.', cost: 4500, active: false, impacts: { risk: -15, compliance: 10 } }
    ]
  },
  purch_agri: {
    id: 'purch_agri',
    name: 'Compras Agrícolas',
    description: 'Adquisición de biomasa y aceite vegetal crudo de campos de soja.',
    category: 'support',
    energyUsage: 1200,
    waterUsage: 15,
    wasteGenerated: 20,
    emissions: 400,
    riskLevel: 45,
    workersCount: 4,
    trainingProgress: 0,
    aspects: [
      { id: 'purch_deforestation', name: 'Aceite vegetal crudo ligado a deforestación', impact: 'Pérdida irreversible de biodiversidad y bosques nativos (Scope 3)', severity: 5, probability: 4, significanceScore: 20, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'purch_sat_tracking', name: 'Plataforma de Trazabilidad Satelital de Cultivos', description: 'Bloquear compras a proveedores en zonas deforestadas.', cost: 12000, active: false, impacts: { compliance: 20 } }
    ]
  },
  lab_fuel: {
    id: 'lab_fuel',
    name: 'Laboratorio de Biocombustible',
    description: 'Análisis de calidad de combustibles, porcentaje de azufre y glicerina.',
    category: 'support',
    energyUsage: 4800,
    waterUsage: 180,
    wasteGenerated: 220,
    emissions: 1500,
    riskLevel: 50,
    workersCount: 5,
    trainingProgress: 0,
    aspects: [
      { id: 'lab_methanol_waste', name: 'Desecho de metanol sucio de destilación experimental', impact: 'Generación de residuos orgánicos peligrosos inflamables', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'lab_methanol_recovery', name: 'Módulo Destilador de Recuperación de Metanol', description: 'Recupera y purifica el 85% de alcohol de muestras para reusarlo.', cost: 9500, active: false, impacts: { waste: -45, risk: -15 } }
    ]
  },
  pt_reuse: {
    id: 'pt_reuse',
    name: 'Planta de Reúso y Osmosis hídrica',
    description: 'Sistema de filtración de agua industrial con ósmosis e intercambio iónico.',
    category: 'ops',
    energyUsage: 22000,
    waterUsage: 150,
    wasteGenerated: 3200,
    emissions: 4800,
    riskLevel: 80,
    workersCount: 5,
    trainingProgress: 0,
    aspects: [
      { id: 'pt_reuse_effluent', name: 'Descargas salinas de rechazo de ósmosis al río', impact: 'Salinización del cauce hídrico y afectación ecosistémica', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false },
      { id: 'pt_water_draw', name: 'Alto consumo de agua fresca de red pública', impact: 'Agotamiento del recurso hídrico en cuenca en sequía', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'pt_zld_system', name: 'Módulo Cero Descarga Líquida (ZLD)', description: 'Evaporadores de salmuera para recuperar el 98% del agua.', cost: 40000, active: false, impacts: { water: -75, risk: -30, compliance: 30 } },
      { id: 'pt_water_softeners', name: 'Ablandadores Avanzados de Intercambio Cationico', description: 'Previene incrustaciones de calderas alargando vida útil del agua.', cost: 15000, active: false, impacts: { water: -25 } }
    ]
  },
  patio_eco: {
    id: 'patio_eco',
    name: 'Patio de Cenizas y Compostaje',
    description: 'Acopio de cenizas procedentes de calderas de biomasa y residuos.',
    category: 'ops',
    energyUsage: 1200,
    waterUsage: 20,
    wasteGenerated: 5200,
    emissions: 600,
    riskLevel: 65,
    workersCount: 4,
    trainingProgress: 0,
    aspects: [
      { id: 'patio_ash_dispersion', name: 'Dispersión eólica de cenizas de caldera', impact: 'Contaminación por material particulado alcalino en suelo', severity: 3, probability: 4, significanceScore: 12, isSignificant: true, mitigated: false },
      { id: 'patio_organic', name: 'Generación de biomasa orgánica no conforme', impact: 'Descomposición a la intemperie y proliferación de vectores', severity: 3, probability: 4, significanceScore: 12, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'patio_ash_reuse', name: 'Compostador Industrial y Valorización de Cenizas', description: 'Venta de cenizas como abono orgánico mineral silíceo.', cost: 12000, active: false, impacts: { waste: -60, compliance: 20 } },
      { id: 'patio_shredder', name: 'Trituradora de Restos Vegetales Biomasa', description: 'Acelera compostaje reduciendo el volumen de acopio.', cost: 8500, active: false, impacts: { waste: -30 } }
    ]
  },
  off: {
    id: 'off',
    name: 'Oficinas Administrativas',
    description: 'Oficinas administrativas de la refinería.',
    category: 'admin',
    energyUsage: 4800,
    waterUsage: 110,
    wasteGenerated: 95,
    emissions: 1650,
    riskLevel: 15,
    workersCount: 18,
    trainingProgress: 0,
    aspects: [
      { id: 'off_serv', name: 'Consumo eléctrico de equipos de cómputo', impact: 'Huella de carbono indirecta (Scope 2)', severity: 2, probability: 5, significanceScore: 10, isSignificant: false, mitigated: false }
    ],
    controls: [
      { id: 'off_led_solar', name: 'Paneles Solares Integrados en Azotea', description: 'Generación renovable distribuida para consumo propio.', cost: 14000, active: false, impacts: { energy: -40 } }
    ]
  }
});

const initialLegalMatrixPower = () => [
  { id: 'R-E001', regulation: 'Reglamento de Biocombustibles y Deforestación Cero', area: 'Compras Agrícolas', requirement: 'Garantía documentada de abastecimiento libre de deforestación nativa.', status: 'non_compliant', penalty: 12000 } as const,
  { id: 'R-E002', regulation: 'Ley de Eficiencia Energética Industrial (Ley 27345)', area: 'Columnas de Destilación', requirement: 'Auditoría energética trienal e implementación de recuperadores de calor.', status: 'non_compliant', penalty: 8000 } as const,
  { id: 'R-E003', regulation: 'LMP para Emisiones Atmosféricas de Calderas de Biomasa', area: 'Mantenimiento y Calderas', requirement: 'Concentración de material particulado (PM10) < 50 mg/Nm³.', status: 'non_compliant', penalty: 15000 } as const,
  { id: 'R-E004', regulation: 'Reglamento de Conservación de Acuíferos Subterráneos', area: 'Depósito de Biocombustible', requirement: 'Instalación de piezómetros de control e informes de calidad de agua.', status: 'non_compliant', penalty: 10000 } as const,
];

const initialDocumentsPower = (): EMSDocument[] => [
  {
    id: 'policy_doc',
    type: 'policy',
    title: 'Política Ambiental de EcoPower Refinería',
    content: `<h1>POLÍTICA DE SOSTENIBILIDAD - ECOPOWER REFINERÍA (ISO 14001:2026)</h1>
<p><strong>Código:</strong> ECO-POL-001 | <strong>Versión:</strong> 3.0</p>
<hr />
<p>En EcoPower Refinería S.A., enfocados en la refinación de biocombustibles sostenibles, nos comprometemos a mitigar nuestra huella de carbono y potenciar la neutralidad climática bajo la norma ISO 14001:2026:</p>
<ol>
  <li><strong>Protección del medio ambiente:</strong> Reducir las emisiones de material particulado y prevenir vertimientos salinos. Mitigar los Scopes 1, 2 y 3 para alcanzar la neutralidad carbónica.</li>
  <li><strong>Cumplimiento de obligaciones legales:</strong> Garantizar trazabilidad de deforestación cero y cumplimiento de la Ley de Eficiencia Energética.</li>
  <li><strong>Mejora continua del SGA:</strong> Definir metas de reducción científicas (SBTi) y reportar bajo los indicadores GRI 302, 303 y 305.</li>
  <li><strong>Economía circular y agua:</strong> Optimizar la captación de agua mediante tecnologías de cero descarga líquida (ZLD).</li>
</ol>
<p><em>[Pendiente de firma de la Dirección General]</em></p>`,
    status: 'draft',
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    id: 'matrix_doc',
    type: 'aspect_matrix',
    title: 'Matriz de Aspectos e Impactos Ambientales',
    content: `<h1>MATRIZ DE SIGNIFICANCIA AMBIENTAL - ECOPOWER (ISO 14001:2026 §6.1.2)</h1>
<table border="1" cellpadding="5" style="border-collapse:collapse; width:100%; font-size:11px;">
  <tr style="background:#f1f5f9;">
    <th>Área</th>
    <th>Aspecto Ambiental</th>
    <th>Impacto Asociado</th>
    <th>Score</th>
    <th>Significativo</th>
  </tr>
  <tr>
    <td>Refinería</td>
    <td>Alto consumo de vapor de calentamiento</td>
    <td>Emisión directa de GEI por consumo de combustible (Scope 1)</td>
    <td>20</td>
    <td>SÍ</td>
  </tr>
  <tr>
    <td>Depósito</td>
    <td>Riesgo de filtración de biodiésel</td>
    <td>Efecto nocivo y contaminación en agua subterránea</td>
    <td>15</td>
    <td>SÍ</td>
  </tr>
  <tr>
    <td>Compras</td>
    <td>Compra de aceite con riesgo de deforestación</td>
    <td>Pérdida irreversible de biodiversidad (Scope 3)</td>
    <td>20</td>
    <td>SÍ</td>
  </tr>
</table>`,
    status: 'draft',
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    id: 'legal_doc',
    type: 'legal_matrix',
    title: 'Matriz de Obligaciones de Cumplimiento',
    content: `<h1>OBLIGACIONES LEGALES VIGENTES - ECOPOWER (ISO 14001:2026 §6.1.3)</h1>
<table border="1" cellpadding="5" style="border-collapse:collapse; width:100%; font-size:11px;">
  <tr style="background:#f1f5f9;">
    <th>Cód Ley</th>
    <th>Norma</th>
    <th>Requisito Legal Específico</th>
    <th>Estado</th>
  </tr>
  <tr>
    <td>Reglamento Biocombustibles</td>
    <td>Trazabilidad cero deforestación</td>
    <td>Garantizar auditorías agrícolas libres de talas ilegales.</td>
    <td>Incumple (Sourcing sin certificar)</td>
  </tr>
  <tr>
    <td>ECA Calderas Biomasa</td>
    <td>Material Particulado</td>
    <td>Emisiones por chimenea de PM10 < 50 mg/Nm³.</td>
    <td>Incumple (Humos grises en filtros de agua)</td>
  </tr>
</table>`,
    status: 'draft',
    lastUpdated: new Date().toISOString().split('T')[0]
  }
];

// Helper to create initial company state structure
const createCompanyState = (
  id: 'metal' | 'chem' | 'power' | 'mine' | 'oil' | 'airport',
  name: string,
  sector: string,
  description: string,
  initialBudget: number,
  initialAreas: Record<string, CompanyArea>,
  initialLegal: CompanyState['legalMatrix'],
  initialDocs: EMSDocument[],
  initialCarbon1: number,
  initialCarbon2: number,
  initialCarbon3: number,
  welcomeMsg: string,
  consultorWelcome: string
): CompanyState => ({
  id,
  name,
  sector,
  description,
  week: 1,
  budget: initialBudget,
  legalCompliance: 25,
  environmentalScore: 20,
  reputation: 40,
  operationalRisk: 75,
  certificationProbability: 5,
  carbonScope1: initialCarbon1,
  carbonScope2: initialCarbon2,
  carbonScope3: initialCarbon3,
  activeClause: 4,
  certificationStatus: 'preparing',
  
  swot: {
    strengths: ['Alta dirección comprometida con la certificación', 'Personal técnico con experiencia en operaciones'],
    weaknesses: ['Instalaciones operativas con pasivos', 'Presupuesto restringido asignado previamente', 'Falta de capacitación formal de la plantilla'],
    opportunities: ['Clientes corporativos exigen ISO 14001:2026', 'Subsidios estatales para infraestructura sustentable'],
    threats: ['Clausura de planta por fiscalización ambiental sorpresa', 'Multas severas por exceder límites permisibles de vertimiento']
  },
  pestel: {
    political: ['Incentivos estatales para reducción de emisiones y transición energética', 'Leyes de sostenibilidad alineadas con el Pacto Verde'],
    economic: ['Aumento de tarifas eléctricas industriales y penalizaciones', 'Sobrecosto en traslado y disposición final de desechos peligrosos'],
    social: ['Quejas de comunidades locales por descargas y ruidos nocturnos', 'Preferencia en licitaciones públicas por empresas homologadas ESG'],
    technological: ['Sensores automáticos e IoT de bajo costo para control de fugas', 'Sistemas de automatización y recuperación de condensados'],
    environmental: ['Cambio Climático: Aumento de sequías extremas y lluvias torrenciales (§4.1)', 'Estrés hídrico en la cuenca que encarece la compra de agua fresca'],
    legal: ['Obligación legal de reporte periódico auditado de emisiones y residuos', 'Escala de penalidades severas y paralización preventiva de planta']
  },
  climateRelevanceDetermined: false,
  climateRelevanceReasoning: '',
  climateStakeholderRequirements: '',
  stakeholders: [
    { name: 'Comunidad Vecina', interest: 8, influence: 5, requirements: 'Control de malos olores, cero ruidos molestos perimetrales y cero fugas hídricas.' },
    { name: 'Ente Fiscalizador (OEFA / ANA)', interest: 10, influence: 9, requirements: 'Reportes ambientales al día y cumplimiento de los LMP obligatorios.' },
    { name: 'Clientes Industriales Premium', interest: 9, influence: 7, requirements: 'Certificación ISO 14001:2026 vigente y auditoría de huella de carbono.' },
    { name: 'Accionistas / Directorio', interest: 6, influence: 10, requirements: 'Estrategia de mitigación de riesgos y evitar paralizaciones productivas.' }
  ],
  scopeStatement: '',
  
  rolesAssigned: [
    { role: 'Representante de la Dirección', person: '', responsibilities: 'Reportar el desempeño ambiental e impulsar la mejora continua del SGA.' },
    { role: 'Responsable de Control Operacional', person: '', responsibilities: 'Supervisar el funcionamiento de scrubbers, filtros y segregación en patios.' },
    { role: 'Coordinador de Emergencias', person: '', responsibilities: 'Gestionar simulacros HAZMAT y mantener vigentes kits absorbentes y extintores.' },
    { role: 'Comité de Auditoría Interna', person: '', responsibilities: 'Planificar, coordinar y ejecutar auditorías del SGA una vez al año.' }
  ],
  
  legalMatrix: initialLegal,
  changeManagementCompleted: false,
  trainingLevel: 0,
  competenceQuizCompleted: false,
  awarenessScore: 10,
  
  incidents: [
    {
      id: `inc_${id}_1`,
      week: 1,
      area: id === 'metal' ? 'Almacén de Insumos' :
            id === 'chem' ? 'Almacén de Sustancias Críticas' :
            id === 'power' ? 'Depósito de Biocombustible' :
            id === 'mine' ? 'Pad de Lixiviación y Cianuración' :
            id === 'oil' ? 'Terminal y Oleoducto' :
            'Pistas y Rodaje',
      description: id === 'metal' ? 'Goteo de reactivo químico debido a envase deteriorado sobre tierra natural.' :
                   id === 'chem' ? 'Goteo de reactivo químico debido a envase deteriorado sobre tierra natural.' :
                   id === 'power' ? 'Goteo de reactivo químico debido a envase deteriorado sobre tierra natural.' :
                   id === 'mine' ? 'Filtración menor detectada en la zanja colectora de la geomembrana del Pad.' :
                   id === 'oil' ? 'Goteo de crudo en la brida de conexión de la estación de rebombeo.' :
                   'Derrame de líquido descongelante (propilenglicol) durante servicio de rampa sin bandeja.',
      impact: id === 'mine' ? 'Riesgo de contaminación de acuíferos' :
              id === 'oil' ? 'Contaminación localizada de suelo y drenajes' :
              id === 'airport' ? 'Escorrentía química contaminada hacia canales de tormenta' :
              'Contaminación localizada de suelo',
      severity: 'medium',
      status: 'open',
      correctiveActions: []
    }
  ],
  areas: initialAreas,
  documents: initialDocs,
  
  chatHistory: {
    auditor: [
      { id: 'aud_1', sender: 'auditor', text: `Estimado Environmental Manager. Soy el Auditor Líder de Certificación ISO 14001:2026. Evaluaré la implementación en su planta de ${name}. Verifique tener su política firmada, matriz de aspectos completa, cumplimiento de leyes, y el Plan de Gestión de Cambios (§6.3) ejecutado.`, timestamp: '09:00' }
    ],
    consultor: [
      { id: 'con_1', sender: 'consultor', text: consultorWelcome, timestamp: '09:01' }
    ],
    inspector: [
      { id: 'ins_1', sender: 'inspector', text: 'Saludos. Inspector Ambiental del Estado. Realizo visitas preventivas de fiscalización. La mezcla ilegal de residuos peligrosos o descargas ácidas al río conllevan multas automáticas.', timestamp: '09:02' }
    ],
    ceo: [
      { id: 'ceo_1', sender: 'ceo', text: `Bienvenido a bordo. Disponemos de $${initialBudget.toLocaleString('es-ES')} de presupuesto inicial para este año. Logre la certificación ISO 14001:2026 sin descuidar los costos recurrentes ni elevar el riesgo operativo.`, timestamp: '09:03' }
    ]
  },
  newsFeed: [
    { id: 'news_1', week: 1, type: 'info', message: welcomeMsg }
  ],
  historyData: [
    { week: 1, budget: initialBudget, legalCompliance: 25, environmentalScore: 20, reputation: 40, operationalRisk: 75, carbonFootprint: initialCarbon1 + initialCarbon2 + initialCarbon3 }
  ]
});

// Setup Initial Store Companies
const initialCompanies = () => ({
  metal: createCompanyState(
    'metal',
    'EnviroPro Metalmecánica S.A.',
    'Manufactura y Metalmecánica',
    'Fábrica de estampado y maquinado de componentes de precisión de cobre y acero. Enfocada en control de ruido, reciclaje de scrap de metal y reducción de emisiones indirectas eléctricas.',
    150000,
    initialAreasMetal(),
    initialLegalMatrixMetal(),
    initialDocumentsMetal(),
    12400, // Scope 1: Diesel logistics
    43200, // Scope 2: Production grid draw
    15000, // Scope 3: Supply chain scrap
    '¡Asumiste el cargo de Gestor Ambiental en EnviroPro Metalmecánica! Certifica el SGA implementando controles de ruido y scrap.',
    '¡Hola! Soy tu Consultor de cabecera. Te guiaré en la norma ISO 14001:2026. Empieza determinando la relevancia del Cambio Climático y el Alcance de la planta en la Cláusula 4.'
  ),
  chem: createCompanyState(
    'chem',
    'BioChem Agroquímica S.A.',
    'Formulación Química y Agroinsumos',
    'Planta de formulación química de plaguicidas y fertilizantes agrícolas. Enfocada en prevención de derrames de activos concentrados, de pH de efluentes y de gases orgánicos volátiles.',
    180000,
    initialAreasChem(),
    initialLegalMatrixChem(),
    initialDocumentsChem(),
    18600, // Scope 1: Transport of hazmat
    36000, // Scope 2: Reactor heat and mixers
    22000, // Scope 3: Sourcing ingredients
    '¡Has asumido el rol de EHS Manager en BioChem Agroquímica! Prioriza la impermeabilización de almacenes y la contención de vertidos tóxicos.',
    '¡Saludos! En esta planta agroquímica, la norma ISO 14001:2026 exige controles de ingeniería HAZMAT robustos y adiestramiento de brigadas bajo las Cláusulas 7 y 8. ¡Manos a la obra!'
  ),
  power: createCompanyState(
    'power',
    'EcoPower Refinería S.A.',
    'Refinamiento de Biocombustibles',
    'Planta industrial de refinamiento de biodiésel y etanol biológico. Enfocada en neutralidad climática (SBTi), reducción del consumo de agua mediante Cero Descarga Líquida y abastecimiento libre de deforestación.',
    200000,
    initialAreasPower(),
    initialLegalMatrixPower(),
    initialDocumentsPower(),
    24000, // Scope 1: Refining steam combustion
    28000, // Scope 2: Solar vs Grid
    38000, // Scope 3: Deforestation risk soy supply
    '¡Te integras como Gerente ESG en EcoPower Refinería! Conduce la planta hacia la descarbonización y cero descargas hídricas.',
    'Bienvenido a la Refinería EcoPower. Aquí la gobernanza del carbono (Scope 1/2/3) y la preservación de la biodiversidad agrícola son críticas bajo la nueva norma ISO 14001:2026.'
  ),
  mine: createCompanyState(
    'mine',
    'MineGold Aurum Valley S.A.',
    'Minería de Oro a Tajo Abierto',
    'Operación minera de oro a gran escala. Enfocada en la gestión de cianuro, estabilidad física y química de presas de relaves, prevención de drenaje ácido de roca (DAR) y relaciones con comunidades campesinas locales.',
    250000,
    initialAreasMine(),
    initialLegalMatrixMine() as CompanyState['legalMatrix'],
    initialDocumentsMine(),
    35000, // Scope 1: Heavy machinery and blasting diesel
    55000, // Scope 2: Cyanide extraction grid draw
    20000, // Scope 3: Supply logistics and chemicals
    '¡Bienvenido a MineGold Aurum Valley! Te integras como EHS Manager para implementar el SGA y controlar los impactos críticos en suelo y agua.',
    'En la minería, la norma ISO 14001:2026 exige controles de cianuro e instrumentación de relaveras estrictos. La licencia social (§4.2) y el plan de cierre (§6.1.2) son determinantes.'
  ),
  oil: createCompanyState(
    'oil',
    'PetroGlow Oil & Gas S.A.',
    'Extracción y Refinación de Hidrocarburos',
    'Planta de extracción onshore y refinería de petróleo. Enfocada en monitoreo SCADA de oleoductos, reducción de gas de antorcha (flaring), respuesta a emergencias por derrames crudos y biorremediación de suelos impactados.',
    280000,
    initialAreasOil(),
    initialLegalMatrixOil() as CompanyState['legalMatrix'],
    initialDocumentsOil(),
    48000, // Scope 1: Gas flaring and logistics
    38000, // Scope 2: Distillation tower grid draw
    45000, // Scope 3: Crud feedstock transport
    '¡Asumiste el rol de Gerente Corporativo EHS en PetroGlow! Previene contingencias operativas críticas en ductos y minimiza las quemas de gas.',
    'El sector hidrocarburos exige cumplimiento del estándar ISO 14001:2026 en preparación ante emergencias (§8.2) y control operativo en ductos. Diseñemos una estrategia robusta.'
  ),
  airport: createCompanyState(
    'airport',
    'SkyGate Airport S.A.',
    'Operación Aeroportuaria Internacional',
    'Terminal de aviación internacional. Enfocada en la gestión de ruido perimetral de aeronaves, tratamiento de aguas de escorrentía con descongelantes, electrificación de equipos de rampa (GSE) y gestión integral de residuos de pasajeros.',
    220000,
    initialAreasAirport(),
    initialLegalMatrixAirport() as CompanyState['legalMatrix'],
    initialDocumentsAirport(),
    15000, // Scope 1: Ground vehicles diesel
    32000, // Scope 2: Terminal systems electricity
    85000, // Scope 3: Airlines flight fuel and passenger travel
    '¡Has asumido el cargo de Director de Sostenibilidad de SkyGate Airport! Gestiona la huella de carbono Scope 3 y reduce el impacto acústico de la terminal.',
    'En aeropuertos, la norma ISO 14001:2026 destaca por la influencia indirecta en aerolíneas (Scope 3), control de efluentes por deshelado (§8.1) y acústica. ¡Planifiquemos con cuidado!'
  )
});

export const useGameStore = create<GameState>((set) => {
  const defaultCompanies = initialCompanies();
  const activeCompany = defaultCompanies.metal;

  return {
    // Multi-company architecture
    currentCompanyId: 'metal',
    companies: defaultCompanies,

    // Copy active variables from initial active company
    week: activeCompany.week,
    budget: activeCompany.budget,
    legalCompliance: activeCompany.legalCompliance,
    environmentalScore: activeCompany.environmentalScore,
    reputation: activeCompany.reputation,
    operationalRisk: activeCompany.operationalRisk,
    certificationProbability: activeCompany.certificationProbability,
    carbonScope1: activeCompany.carbonScope1,
    carbonScope2: activeCompany.carbonScope2,
    carbonScope3: activeCompany.carbonScope3,
    activeClause: activeCompany.activeClause,
    certificationStatus: activeCompany.certificationStatus,
    swot: activeCompany.swot,
    pestel: activeCompany.pestel,
    climateRelevanceDetermined: activeCompany.climateRelevanceDetermined,
    climateRelevanceReasoning: activeCompany.climateRelevanceReasoning,
    climateStakeholderRequirements: activeCompany.climateStakeholderRequirements,
    stakeholders: activeCompany.stakeholders,
    scopeStatement: activeCompany.scopeStatement,
    rolesAssigned: activeCompany.rolesAssigned,
    legalMatrix: activeCompany.legalMatrix,
    changeManagementCompleted: activeCompany.changeManagementCompleted,
    trainingLevel: activeCompany.trainingLevel,
    competenceQuizCompleted: activeCompany.competenceQuizCompleted,
    awarenessScore: activeCompany.awarenessScore,
    incidents: activeCompany.incidents,
    areas: activeCompany.areas,
    documents: activeCompany.documents,
    chatHistory: activeCompany.chatHistory,
    newsFeed: activeCompany.newsFeed,
    historyData: activeCompany.historyData,

    // Global player metrics
    xp: 0,
    level: 1,
    badges: [],

    // Action: Switch Active Company
    switchCompany: (companyId: 'metal' | 'chem' | 'power' | 'mine' | 'oil' | 'airport') => set((state) => {
      if (state.currentCompanyId === companyId) return {};

      // 1. Pack current active state into old company record
      const oldCompanyRecord: CompanyState = {
        id: state.currentCompanyId,
        name: state.companies[state.currentCompanyId].name,
        sector: state.companies[state.currentCompanyId].sector,
        description: state.companies[state.currentCompanyId].description,
        week: state.week,
        budget: state.budget,
        legalCompliance: state.legalCompliance,
        environmentalScore: state.environmentalScore,
        reputation: state.reputation,
        operationalRisk: state.operationalRisk,
        certificationProbability: state.certificationProbability,
        carbonScope1: state.carbonScope1,
        carbonScope2: state.carbonScope2,
        carbonScope3: state.carbonScope3,
        activeClause: state.activeClause,
        certificationStatus: state.certificationStatus,
        swot: state.swot,
        pestel: state.pestel,
        climateRelevanceDetermined: state.climateRelevanceDetermined,
        climateRelevanceReasoning: state.climateRelevanceReasoning,
        climateStakeholderRequirements: state.climateStakeholderRequirements,
        stakeholders: state.stakeholders,
        scopeStatement: state.scopeStatement,
        rolesAssigned: state.rolesAssigned,
        legalMatrix: state.legalMatrix,
        changeManagementCompleted: state.changeManagementCompleted,
        trainingLevel: state.trainingLevel,
        competenceQuizCompleted: state.competenceQuizCompleted,
        awarenessScore: state.awarenessScore,
        incidents: state.incidents,
        areas: state.areas,
        documents: state.documents,
        chatHistory: state.chatHistory,
        newsFeed: state.newsFeed,
        historyData: state.historyData
      };

      const newCompany = state.companies[companyId];

      // 2. Unpack new company state into active store fields
      return {
        currentCompanyId: companyId,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: oldCompanyRecord
        },
        // Unpacked variables
        week: newCompany.week,
        budget: newCompany.budget,
        legalCompliance: newCompany.legalCompliance,
        environmentalScore: newCompany.environmentalScore,
        reputation: newCompany.reputation,
        operationalRisk: newCompany.operationalRisk,
        certificationProbability: newCompany.certificationProbability,
        carbonScope1: newCompany.carbonScope1,
        carbonScope2: newCompany.carbonScope2,
        carbonScope3: newCompany.carbonScope3,
        activeClause: newCompany.activeClause,
        certificationStatus: newCompany.certificationStatus,
        swot: newCompany.swot,
        pestel: newCompany.pestel,
        climateRelevanceDetermined: newCompany.climateRelevanceDetermined,
        climateRelevanceReasoning: newCompany.climateRelevanceReasoning,
        climateStakeholderRequirements: newCompany.climateStakeholderRequirements,
        stakeholders: newCompany.stakeholders,
        scopeStatement: newCompany.scopeStatement,
        rolesAssigned: newCompany.rolesAssigned,
        legalMatrix: newCompany.legalMatrix,
        changeManagementCompleted: newCompany.changeManagementCompleted,
        trainingLevel: newCompany.trainingLevel,
        competenceQuizCompleted: newCompany.competenceQuizCompleted,
        awarenessScore: newCompany.awarenessScore,
        incidents: newCompany.incidents,
        areas: newCompany.areas,
        documents: newCompany.documents,
        chatHistory: newCompany.chatHistory,
        newsFeed: newCompany.newsFeed,
        historyData: newCompany.historyData
      };
    }),

    // Action: Advance week simulation
    tickWeek: () => set((state) => {
      if (state.week >= 52) {
        state.triggerEvent({ type: 'warning', message: 'Has alcanzado el límite de 52 semanas. ¡Es momento de realizar la auditoría final!' });
        return {};
      }

      const nextWeek = state.week + 1;
      
      // Calculate operational parameters
      let currentEnergy = 0;
      let baseRisk = 0;

      Object.values(state.areas).forEach((area) => {
        let areaEnergy = area.energyUsage;
        let areaRisk = area.riskLevel;

        area.controls.forEach((ctrl) => {
          if (ctrl.active) {
            if (ctrl.impacts.energy) areaEnergy += (area.energyUsage * ctrl.impacts.energy) / 100;
            if (ctrl.impacts.risk) areaRisk += ctrl.impacts.risk;
          }
        });

        currentEnergy += areaEnergy;
        baseRisk += areaRisk;
      });

      baseRisk = Math.max(10, Math.min(95, baseRisk / Object.keys(state.areas).length));

      // Calculate Carbon Scope Footprints based on company profile
      let scope1 = 0;
      let scope2 = 0;
      let scope3 = 0;

      if (state.currentCompanyId === 'metal') {
        const routeOpt = state.areas.log.controls.find(c => c.id === 'log_route')?.active;
        scope1 = routeOpt ? 12400 * 0.85 : 12400;
        scope2 = currentEnergy * 0.85;
        const sustainablePurch = state.areas.purch.controls.find(c => c.id === 'purch_procurement')?.active;
        scope3 = sustainablePurch ? 15000 * 0.7 : 15000;
      } else if (state.currentCompanyId === 'chem') {
        const routeOpt = state.areas.log_haz.controls.find(c => c.id === 'log_safe_route')?.active;
        scope1 = routeOpt ? 18600 * 0.9 : 18600;
        scope2 = currentEnergy * 0.9;
        const organicSourcing = state.areas.purch_bio.controls.find(c => c.id === 'purch_provider_audit')?.active;
        scope3 = organicSourcing ? 22000 * 0.75 : 22000;
      } else if (state.currentCompanyId === 'power') {
        const railOpt = state.areas.log_dist.controls.find(c => c.id === 'log_rail_bio')?.active;
        scope1 = railOpt ? 24000 * 0.7 : 24000;
        scope2 = currentEnergy * 0.6; // biofuels process has high internal recovery
        const satelliteZeroDef = state.areas.purch_agri.controls.find(c => c.id === 'purch_sat_tracking')?.active;
        scope3 = satelliteZeroDef ? 38000 * 0.6 : 38000;
      } else if (state.currentCompanyId === 'mine') {
        const telemetryOpt = state.areas.open_pit.controls.find(c => c.id === 'pit_telemetry')?.active;
        scope1 = telemetryOpt ? 35000 * 0.85 : 35000;
        scope2 = currentEnergy * 0.8;
        const recycleOpt = state.areas.leach_pad.controls.find(c => c.id === 'leach_recycle')?.active;
        scope3 = recycleOpt ? 20000 * 0.75 : 20000;
      } else if (state.currentCompanyId === 'oil') {
        const flareOpt = state.areas.refinery.controls.find(c => c.id === 'ref_flare_gas')?.active;
        scope1 = flareOpt ? 48000 * 0.7 : 48000;
        scope2 = currentEnergy * 0.85;
        const scadaOpt = state.areas.pipeline.controls.find(c => c.id === 'pipe_scada')?.active;
        scope3 = scadaOpt ? 45000 * 0.8 : 45000;
      } else if (state.currentCompanyId === 'airport') {
        const gseOpt = state.areas.support_base.controls.find(c => c.id === 'gse_electrification')?.active;
        scope1 = gseOpt ? 15000 * 0.65 : 15000;
        const glassOpt = state.areas.terminal.controls.find(c => c.id === 'term_smart_glass')?.active;
        scope2 = glassOpt ? currentEnergy * 0.75 : currentEnergy;
        const noiseOpt = state.areas.dg.controls.find(c => c.id === 'dg_noise_map')?.active;
        scope3 = noiseOpt ? 85000 * 0.85 : 85000;
      }

      const totalCarbon = scope1 + scope2 + scope3;

      // Legal compliance percent
      const compliantCount = state.legalMatrix.filter(l => l.status === 'compliant').length;
      const totalLegals = state.legalMatrix.length;
      const legalCompliancePercent = Math.round((compliantCount / totalLegals) * 100);

      // Environmental Score calculation
      const totalAspects = Object.values(state.areas).flatMap(a => a.aspects).length;
      const mitigatedAspects = Object.values(state.areas).flatMap(a => a.aspects).filter(asp => asp.mitigated).length;
      const aspectRatio = totalAspects > 0 ? (mitigatedAspects / totalAspects) : 0;

      const envScore = Math.max(10, Math.min(100, Math.round(
        (aspectRatio * 40) + 
        (legalCompliancePercent * 0.3) + 
        (state.awarenessScore * 0.2) + 
        (100 - baseRisk) * 0.1
      )));

      // Certification probability (requires Clause 6.3 Change Mgmt in 2026 standard)
      const policySigned = state.documents.find(d => d.type === 'policy')?.status === 'approved_ceo';
      const aspectMatrixFilled = state.documents.find(d => d.type === 'aspect_matrix')?.status !== 'draft';
      const legalMatrixFilled = state.documents.find(d => d.type === 'legal_matrix')?.status !== 'draft';
      
      let prob = Math.round(
        (legalCompliancePercent * 0.4) + 
        (envScore * 0.3) + 
        (state.awarenessScore * 0.1)
      );
      if (!policySigned) prob = Math.round(prob * 0.2);
      if (!aspectMatrixFilled) prob = Math.round(prob * 0.4);
      if (!legalMatrixFilled) prob = Math.round(prob * 0.4);
      if (!state.climateRelevanceDetermined) prob = Math.round(prob * 0.8);
      if (!state.changeManagementCompleted) prob = Math.round(prob * 0.7); // Clause 6.3 check

      const finalProb = Math.max(0, Math.min(99, prob));

      // Dynamic Event Loop
      const events = [...state.newsFeed];
      let budgetChange = -2000; // base running environmental costs
      let incidentsChange = [...state.incidents];
      let reputationPenalty = 0;
      let operationalRiskIncrease = 0;
      let levelUpBonus = 0;

      // Maintenance of active controls
      Object.values(state.areas).flatMap(a => a.controls).forEach(c => {
        if (c.active) {
          budgetChange -= Math.round(c.cost * 0.015);
        }
      });

      // Random events based on current risks
      if (nextWeek > 2 && Math.random() < 0.22) {
        if (baseRisk > 60 && Math.random() < 0.6) {
          // Spill event
          const openIncidentId = `inc_${state.currentCompanyId}_ev_${Date.now()}`;
          const riskAreas = Object.values(state.areas).filter(a => a.riskLevel > 50);
          const randomArea = riskAreas[Math.floor(Math.random() * riskAreas.length)] || Object.values(state.areas)[1];
          
          events.unshift({
            id: `ev_${Date.now()}`,
            week: nextWeek,
            type: 'error',
            message: `🚨 INCIDENTE: Derrame o descarga no controlada en el área de ${randomArea.name}. La reputación se ve afectada.`
          });
          
          incidentsChange = [
            ...incidentsChange,
            { id: openIncidentId, week: nextWeek, area: randomArea.name, description: `Derrame químico accidental debido a desgaste operativo.`, impact: 'Fugas y contaminación localizada', severity: 'high', status: 'open', correctiveActions: [] }
          ];
          reputationPenalty += 15;
          operationalRiskIncrease += 10;

        } else if (legalCompliancePercent < 60 && Math.random() < 0.5) {
          // Inspection fine
          const nonCompliantRules = state.legalMatrix.filter(l => l.status === 'non_compliant');
          if (nonCompliantRules.length > 0) {
            const targetReg = nonCompliantRules[Math.floor(Math.random() * nonCompliantRules.length)];
            const penaltyCost = targetReg.penalty;
            budgetChange -= penaltyCost;
            
            events.unshift({
              id: `ev_${Date.now()}`,
              week: nextWeek,
              type: 'error',
              message: `👮 FISCALIZACIÓN: Inspector ambiental detecta brecha legal en '${targetReg.regulation}'. Multa de $${penaltyCost.toLocaleString('es-ES')} impuesta.`
            });
          }
        } else if (Math.random() < 0.4) {
          events.unshift({
            id: `ev_${Date.now()}`,
            week: nextWeek,
            type: 'warning',
            message: `🗣️ QUEJA VECINAL: Reclamos de la comunidad sobre las emisiones y ruidos nocturnos de la planta.`
          });
          reputationPenalty += 8;
        }
      }

      // XP Progression
      let gainedXp = 50;
      if (envScore > 70) gainedXp += 50;
      if (legalCompliancePercent > 80) gainedXp += 50;
      const currentXp = state.xp + gainedXp;
      const nextLevel = Math.floor(currentXp / 1000) + 1;
      const levelUp = nextLevel > state.level;

      if (levelUp) {
        events.unshift({
          id: `ev_lvl_${Date.now()}`,
          week: nextWeek,
          type: 'success',
          message: `🎉 ¡NIVEL SUBIDO! Nivel ${nextLevel} alcanzado. Bonificación presupuestaria estratégica de +$20,000.`
        });
        levelUpBonus = 20000;
      }

      const finalRisk = Math.min(95, baseRisk + operationalRiskIncrease);
      const finalBudget = Math.max(0, state.budget + budgetChange + levelUpBonus);

      // Reputation Score taking complaint penalty into account
      const reputationScore = Math.max(10, Math.min(100, Math.round(
        (envScore * 0.4) + 
        (legalCompliancePercent * 0.3) + 
        (100 - finalRisk) * 0.2 + 
        (state.climateRelevanceDetermined ? 10 : 0) -
        reputationPenalty
      )));

      const newHistoryTick: SimulationTickData = {
        week: nextWeek,
        budget: finalBudget,
        legalCompliance: legalCompliancePercent,
        environmentalScore: envScore,
        reputation: reputationScore,
        operationalRisk: finalRisk,
        carbonFootprint: Math.round(totalCarbon)
      };

      const finalStateUpdates = {
        week: nextWeek,
        budget: finalBudget,
        legalCompliance: legalCompliancePercent,
        environmentalScore: envScore,
        reputation: reputationScore,
        operationalRisk: finalRisk,
        certificationProbability: finalProb,
        carbonScope1: Math.round(scope1),
        carbonScope2: Math.round(scope2),
        carbonScope3: Math.round(scope3),
        xp: currentXp,
        level: nextLevel,
        newsFeed: events,
        historyData: [...state.historyData, newHistoryTick]
      };

      // Synchronize changes to active company inside companies map
      return {
        ...finalStateUpdates,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            ...finalStateUpdates,
            areas: state.areas,
            documents: state.documents,
            legalMatrix: state.legalMatrix,
            incidents: incidentsChange,
            chatHistory: state.chatHistory
          }
        }
      };
    }),

    assignBudget: (amount: number) => {
      let success = false;
      set((state) => {
        if (state.budget >= amount) {
          success = true;
          const updatedBudget = state.budget - amount;
          return {
            budget: updatedBudget,
            companies: {
              ...state.companies,
              [state.currentCompanyId]: {
                ...state.companies[state.currentCompanyId],
                budget: updatedBudget
              }
            }
          };
        }
        return {};
      });
      return success;
    },

    toggleControl: (areaId: string, controlId: string) => set((state) => {
      const updatedAreas = { ...state.areas };
      const area = updatedAreas[areaId];
      if (!area) return {};

      const controlIndex = area.controls.findIndex(c => c.id === controlId);
      if (controlIndex === -1) return {};

      const control = area.controls[controlIndex];
      const newActiveState = !control.active;

      if (newActiveState && state.budget < control.cost) {
        state.triggerEvent({ type: 'error', message: `Presupuesto insuficiente para implementar: ${control.name}` });
        return {};
      }

      const updatedControls = [...area.controls];
      updatedControls[controlIndex] = { ...control, active: newActiveState };
      updatedAreas[areaId] = { ...area, controls: updatedControls };

      const budgetModifier = newActiveState ? -control.cost : 0;
      const eventMsg = newActiveState 
        ? `✅ CONTROL IMPLEMENTADO: '${control.name}' en ${area.name}.`
        : `⏸️ CONTROL DESACTIVADO: '${control.name}' en ${area.name}.`;

      const feed = [{ id: `ctrl_${Date.now()}`, week: state.week, type: 'info' as const, message: eventMsg }, ...state.newsFeed];

      // Mitigate aspects linked to this area
      const updatedAspects = area.aspects.map(asp => {
        // Metalmecánica mappings
        if (controlId === 'alm_bunds' && asp.id === 'alm_spill') return { ...asp, mitigated: newActiveState };
        if (controlId === 'prod_acoustic' && asp.id === 'prod_noise') return { ...asp, mitigated: newActiveState };
        if (controlId === 'prod_led' && asp.id === 'prod_energy') return { ...asp, mitigated: newActiveState };
        if (controlId === 'prod_recycle_scrap' && asp.id === 'prod_scrap') return { ...asp, mitigated: newActiveState };
        if (controlId === 'log_water_recycle' && asp.id === 'log_wash') return { ...asp, mitigated: newActiveState };
        if (controlId === 'pt_osmosis' && asp.id === 'pt_effluent') return { ...asp, mitigated: newActiveState };
        if (controlId === 'pt_filterpress' && asp.id === 'pt_sludge') return { ...asp, mitigated: newActiveState };
        if (controlId === 'patio_canopy' && asp.id === 'patio_lix') return { ...asp, mitigated: newActiveState };
        if (controlId === 'patio_bins' && asp.id === 'patio_segregation') return { ...asp, mitigated: newActiveState };
        if (controlId === 'hr_training_platform' && asp.id === 'hr_competence') return { ...asp, mitigated: newActiveState };
        if (controlId === 'lab_scrubber' && asp.id === 'lab_acid') return { ...asp, mitigated: newActiveState };
        if (controlId === 'lab_neutralization' && asp.id === 'lab_waste_liquids') return { ...asp, mitigated: newActiveState };
        
        // Agroquímica mappings
        if (controlId === 'react_scrubber_gas' && asp.id === 'react_voc') return { ...asp, mitigated: newActiveState };
        if (controlId === 'react_ir_sensors' && asp.id === 'react_temp') return { ...asp, mitigated: newActiveState };
        if (controlId === 'alm_bunds_chem' && asp.id === 'alm_spill_toxic') return { ...asp, mitigated: newActiveState };
        if (controlId === 'alm_neutralizers' && asp.id === 'alm_pack_contaminated') return { ...asp, mitigated: newActiveState };
        if (controlId === 'log_safe_route' && asp.id === 'log_haz_spill') return { ...asp, mitigated: newActiveState };
        if (controlId === 'log_adr_drivers' && asp.id === 'log_co2') return { ...asp, mitigated: newActiveState };
        if (controlId === 'maint_aqueous' && asp.id === 'maint_chlorinated') return { ...asp, mitigated: newActiveState };
        if (controlId === 'maint_loto' && asp.id === 'maint_acid_purges') return { ...asp, mitigated: newActiveState };
        if (controlId === 'hr_hazmat_drill' && asp.id === 'hr_toxic_awareness') return { ...asp, mitigated: newActiveState };
        if (controlId === 'purch_provider_audit' && asp.id === 'purch_biodiversity') return { ...asp, mitigated: newActiveState };
        if (controlId === 'lab_waste_segregation' && asp.id === 'lab_solvent_waste') return { ...asp, mitigated: newActiveState };
        if (controlId === 'lab_scrubber_chem' && asp.id === 'lab_acid_vapors') return { ...asp, mitigated: newActiveState };
        if (controlId === 'pt_adsorption' && asp.id === 'pt_heavy_metals') return { ...asp, mitigated: newActiveState };
        if (controlId === 'pt_sludge_dryer' && asp.id === 'pt_toxic_sludge') return { ...asp, mitigated: newActiveState };
        if (controlId === 'patio_bund_roof' && asp.id === 'patio_acid_lix') return { ...asp, mitigated: newActiveState };
        if (controlId === 'patio_deluge' && asp.id === 'patio_fire') return { ...asp, mitigated: newActiveState };

        // Refinería mappings
        if (controlId === 'ref_heat_recovery' && asp.id === 'ref_steam') return { ...asp, mitigated: newActiveState };
        if (controlId === 'ref_gas_valves' && asp.id === 'ref_voc_leak') return { ...asp, mitigated: newActiveState };
        if (controlId === 'alm_floating_roofs' && asp.id === 'alm_evap') return { ...asp, mitigated: newActiveState };
        if (controlId === 'alm_piezometers' && asp.id === 'alm_seepage') return { ...asp, mitigated: newActiveState };
        if (controlId === 'log_rail_bio' && asp.id === 'log_rail_co2') return { ...asp, mitigated: newActiveState };
        if (controlId === 'maint_baghouse' && asp.id === 'maint_boiler_particulates') return { ...asp, mitigated: newActiveState };
        if (controlId === 'maint_natural_esters' && asp.id === 'maint_transformer_oil') return { ...asp, mitigated: newActiveState };
        if (controlId === 'hr_carbon_literacy_program' && asp.id === 'hr_carbon_literacy') return { ...asp, mitigated: newActiveState };
        if (controlId === 'purch_sat_tracking' && asp.id === 'purch_deforestation') return { ...asp, mitigated: newActiveState };
        if (controlId === 'lab_methanol_recovery' && asp.id === 'lab_methanol_waste') return { ...asp, mitigated: newActiveState };
        if (controlId === 'pt_zld_system' && asp.id === 'pt_water_draw') return { ...asp, mitigated: newActiveState };
        if (controlId === 'pt_water_softeners' && asp.id === 'pt_reuse_effluent') return { ...asp, mitigated: newActiveState };
        if (controlId === 'patio_ash_reuse' && asp.id === 'patio_ash_dispersion') return { ...asp, mitigated: newActiveState };
        if (controlId === 'patio_shredder' && asp.id === 'patio_organic') return { ...asp, mitigated: newActiveState };

        return asp;
      });

      updatedAreas[areaId].aspects = updatedAspects;

      // Update compliance matrix if control directly solves a legal obligation
      const updatedLegalMatrix = state.legalMatrix.map(leg => {
        // Metalmecánica legal links
        if (controlId === 'patio_canopy' && leg.id === 'R-DS001') return { ...leg, status: newActiveState ? ('compliant' as const) : ('non_compliant' as const) };
        if (controlId === 'pt_osmosis' && leg.id === 'R-DS002') return { ...leg, status: newActiveState ? ('compliant' as const) : ('non_compliant' as const) };
        if (controlId === 'alm_bunds' && leg.id === 'R-DS004') return { ...leg, status: newActiveState ? ('compliant' as const) : ('non_compliant' as const) };
        
        // Agroquímica legal links
        if (controlId === 'alm_bunds_chem' && leg.id === 'R-Q001') return { ...leg, status: newActiveState ? ('compliant' as const) : ('non_compliant' as const) };
        if (controlId === 'pt_adsorption' && leg.id === 'R-Q002') return { ...leg, status: newActiveState ? ('compliant' as const) : ('non_compliant' as const) };
        if (controlId === 'react_scrubber_gas' && leg.id === 'R-Q003') return { ...leg, status: newActiveState ? ('compliant' as const) : ('non_compliant' as const) };
        if (controlId === 'patio_bund_roof' && leg.id === 'R-Q004') return { ...leg, status: newActiveState ? ('compliant' as const) : ('non_compliant' as const) };

        // Refinería legal links
        if (controlId === 'purch_sat_tracking' && leg.id === 'R-E001') return { ...leg, status: newActiveState ? ('compliant' as const) : ('non_compliant' as const) };
        if (controlId === 'ref_heat_recovery' && leg.id === 'R-E002') return { ...leg, status: newActiveState ? ('compliant' as const) : ('non_compliant' as const) };
        if (controlId === 'maint_baghouse' && leg.id === 'R-E003') return { ...leg, status: newActiveState ? ('compliant' as const) : ('non_compliant' as const) };
        if (controlId === 'alm_piezometers' && leg.id === 'R-E004') return { ...leg, status: newActiveState ? ('compliant' as const) : ('non_compliant' as const) };

        return leg;
      });

      // Badges
      const newBadges = [...state.badges];
      if (controlId === 'prod_led' && newActiveState && !newBadges.includes('green_energy')) {
        newBadges.push('green_energy');
      }
      if (controlId === 'alm_bunds_chem' && newActiveState && !newBadges.includes('zero_spill')) {
        newBadges.push('zero_spill');
      }
      
      const allCompliant = updatedLegalMatrix.every(l => l.status === 'compliant');
      if (allCompliant && !newBadges.includes('legal_compliant')) {
        newBadges.push('legal_compliant');
      }

      const storeUpdates = {
        areas: updatedAreas,
        budget: state.budget + budgetModifier,
        legalMatrix: updatedLegalMatrix,
        badges: newBadges,
        newsFeed: feed
      };

      return {
        ...storeUpdates,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            ...storeUpdates
          }
        }
      };
    }),

    updateDocument: (id: string, content: string, status?: EMSDocument['status']) => set((state) => {
      const updatedDocs = state.documents.map((doc) => {
        if (doc.id === id) {
          return {
            ...doc,
            content,
            status: status || doc.status,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return doc;
      });

      const isFirstTimeUpdate = state.documents.find(d => d.id === id)?.content.includes('Pendiente') && !content.includes('Pendiente');
      const additionalXp = isFirstTimeUpdate ? 150 : 0;

      return {
        documents: updatedDocs,
        xp: state.xp + additionalXp,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            documents: updatedDocs
          }
        }
      };
    }),

    signPolicy: () => set((state) => {
      const policyDoc = state.documents.find(d => d.type === 'policy');
      if (!policyDoc) return {};

      const signedContent = policyDoc.content
        .replace('<em>[Pendiente de firma de la Dirección General]</em>', '<p style="color:green; font-weight:bold;">✍️ FIRMADO DIGITALMENTE Y APROBADO POR DIRECCIÓN GENERAL (ISO 14001:2026)</p>');

      const updatedDocs = state.documents.map(d => d.type === 'policy' ? { ...d, content: signedContent, status: 'approved_ceo' as const } : d);
      
      const newBadges = [...state.badges];
      if (!newBadges.includes('policy_approved')) {
        newBadges.push('policy_approved');
      }

      const feed = [{
        id: `pol_${Date.now()}`,
        week: state.week,
        type: 'success' as const,
        message: '✍️ LIDERAZGO: Política ambiental firmada y oficializada por el Director General. Cumplimiento de la Cláusula 5.2.'
      }, ...state.newsFeed];

      const storeUpdates = {
        documents: updatedDocs,
        badges: newBadges,
        newsFeed: feed,
        xp: state.xp + 250
      };

      return {
        ...storeUpdates,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            documents: updatedDocs
          }
        }
      };
    }),

    addChatMessage: (agent: string, message: ChatMessage) => set((state) => {
      const history = state.chatHistory[agent] ? [...state.chatHistory[agent]] : [];
      const updatedHistory = {
        ...state.chatHistory,
        [agent]: [...history, message]
      };
      return {
        chatHistory: updatedHistory,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            chatHistory: updatedHistory
          }
        }
      };
    }),

    triggerEvent: (event: { type: 'info' | 'success' | 'warning' | 'error'; message: string }) => set((state) => {
      const updatedFeed = [
        { id: `feed_${Date.now()}`, week: state.week, type: event.type, message: event.message },
        ...state.newsFeed
      ];
      return {
        newsFeed: updatedFeed,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            newsFeed: updatedFeed
          }
        }
      };
    }),

    assignRole: (roleIndex: number, person: string) => set((state) => {
      const updatedRoles = [...state.rolesAssigned];
      updatedRoles[roleIndex] = { ...updatedRoles[roleIndex], person };

      const assignedCount = updatedRoles.filter(r => r.person !== '').length;
      const isComplete = assignedCount === updatedRoles.length;
      
      const feed = [...state.newsFeed];
      if (isComplete) {
        feed.unshift({
          id: `role_all_${Date.now()}`,
          week: state.week,
          type: 'success' as const,
          message: '👔 ORGANIGRAMA: Matriz de roles y responsabilidades completada (ISO 14001:2026 §5.3).'
        });
      }

      const storeUpdates = {
        rolesAssigned: updatedRoles,
        newsFeed: feed,
        xp: state.xp + 50
      };

      return {
        ...storeUpdates,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            rolesAssigned: updatedRoles
          }
        }
      };
    }),

    updateSwotPestel: (type, key, values) => set((state) => {
      let swotObj = { ...state.swot };
      let pestelObj = { ...state.pestel };
      
      if (type === 'swot') {
        swotObj = { ...state.swot, [key]: values };
      } else {
        pestelObj = { ...state.pestel, [key]: values };
      }

      return {
        swot: swotObj,
        pestel: pestelObj,
        xp: state.xp + 30,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            swot: swotObj,
            pestel: pestelObj
          }
        }
      };
    }),

    updateClimateImpact: (reasoning, requirements) => set((state) => {
      const feed = [{
        id: `clim_${Date.now()}`,
        week: state.week,
        type: 'success' as const,
        message: '🌍 CAMBIO CLIMÁTICO: Declaración de relevancia y requisitos ambientales formulados (ISO 14001:2026 §4.1/4.2).'
      }, ...state.newsFeed];

      const storeUpdates = {
        climateRelevanceDetermined: true,
        climateRelevanceReasoning: reasoning,
        climateStakeholderRequirements: requirements,
        newsFeed: feed,
        xp: state.xp + 200
      };

      return {
        ...storeUpdates,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            ...storeUpdates
          }
        }
      };
    }),

    updateStakeholderRequirements: (index, reqs) => set((state) => {
      const updated = [...state.stakeholders];
      updated[index] = { ...updated[index], requirements: reqs };
      return {
        stakeholders: updated,
        xp: state.xp + 20,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            stakeholders: updated
          }
        }
      };
    }),

    setScopeStatement: (scope) => set((state) => {
      const feed = [{
        id: `scope_${Date.now()}`,
        week: state.week,
        type: 'success' as const,
        message: `📐 ALCANCE DEFINIDO: '${scope.substring(0, 45)}...' aprobado bajo ciclo de vida.`
      }, ...state.newsFeed];

      return {
        scopeStatement: scope,
        newsFeed: feed,
        xp: state.xp + 100,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            scopeStatement: scope,
            newsFeed: feed
          }
        }
      };
    }),

    updateLegalStatus: (id, status) => set((state) => {
      const updatedMatrix = state.legalMatrix.map(l => l.id === id ? { ...l, status } : l);
      return {
        legalMatrix: updatedMatrix,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            legalMatrix: updatedMatrix
          }
        }
      };
    }),

    conductTraining: (cost: number) => set((state) => {
      if (state.budget < cost) {
        state.triggerEvent({ type: 'error', message: 'Presupuesto insuficiente para la capacitación.' });
        return {};
      }

      const currentTrain = state.trainingLevel + 1;
      const addition = 25;
      const newScore = Math.min(100, state.awarenessScore + addition);

      const updatedAreas = { ...state.areas };
      Object.keys(updatedAreas).forEach(key => {
        updatedAreas[key].trainingProgress = Math.min(100, updatedAreas[key].trainingProgress + 30);
      });

      const feed = [{
        id: `train_${Date.now()}`,
        week: state.week,
        type: 'success' as const,
        message: `🎓 CAPACITACIÓN: Plan de concientización ambiental ejecutado. Competencia del personal sube al ${newScore}%.`
      }, ...state.newsFeed];

      const storeUpdates = {
        trainingLevel: currentTrain,
        budget: state.budget - cost,
        awarenessScore: newScore,
        areas: updatedAreas,
        newsFeed: feed,
        xp: state.xp + 150
      };

      return {
        ...storeUpdates,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            ...storeUpdates
          }
        }
      };
    }),

    investigateIncident: (id, correctiveAction) => set((state) => {
      const updatedIncidents = state.incidents.map(inc => {
        if (inc.id === id) {
          return {
            ...inc,
            status: 'closed' as const,
            correctiveActions: [...inc.correctiveActions, correctiveAction]
          };
        }
        return inc;
      });

      const feed = [{
        id: `inc_cls_${Date.now()}`,
        week: state.week,
        type: 'success' as const,
        message: `🛠️ ACCIÓN CORRECTIVA: Incidente resuelto mediante plan de acción y causa raíz (ISO 14001:2026 §10.2).`
      }, ...state.newsFeed];

      const storeUpdates = {
        incidents: updatedIncidents,
        operationalRisk: Math.max(10, state.operationalRisk - 15),
        newsFeed: feed,
        xp: state.xp + 200
      };

      return {
        ...storeUpdates,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            ...storeUpdates
          }
        }
      };
    }),

    completeChangeManagement: () => set((state) => {
      const feed = [{
        id: `change_mgmt_${Date.now()}`,
        week: state.week,
        type: 'success' as const,
        message: '🧱 GESTIÓN DEL CAMBIO: Completada satisfactoriamente (ISO 14001:2026 §6.3). SGA protegido.'
      }, ...state.newsFeed];

      const newBadges = [...state.badges];
      if (!newBadges.includes('aspects_mapped')) {
        newBadges.push('aspects_mapped');
      }

      return {
        changeManagementCompleted: true,
        badges: newBadges,
        newsFeed: feed,
        xp: state.xp + 200,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            changeManagementCompleted: true,
            newsFeed: feed
          }
        }
      };
    }),

    runFinalAudit: () => set((state) => {
      const success = isAuditReady(getAuditRequirements(state));
      const status: GameState['certificationStatus'] = success ? 'certified' : 'failed';

      const feedMsg = success 
        ? `🏆 AUDITORÍA CERTIFICADA: ¡Felicidades! ${state.companies[state.currentCompanyId].name} obtuvo la certificación ISO 14001:2026.`
        : '❌ AUDITORÍA RECHAZADA: El auditor identificó no conformidades mayores activas en tu SGA.';

      const feed = [{
        id: `audit_fin_${Date.now()}`,
        week: state.week,
        type: success ? ('success' as const) : ('error' as const),
        message: feedMsg
      }, ...state.newsFeed];

      return {
        certificationStatus: status,
        newsFeed: feed,
        companies: {
          ...state.companies,
          [state.currentCompanyId]: {
            ...state.companies[state.currentCompanyId],
            certificationStatus: status,
            newsFeed: feed
          }
        }
      };
    }),

    resetGame: () => set(() => {
      const freshCompanies = initialCompanies();
      const freshActive = freshCompanies.metal;
      
      return {
        currentCompanyId: 'metal',
        companies: freshCompanies,
        
        // Reset active variables
        week: freshActive.week,
        budget: freshActive.budget,
        legalCompliance: freshActive.legalCompliance,
        environmentalScore: freshActive.environmentalScore,
        reputation: freshActive.reputation,
        operationalRisk: freshActive.operationalRisk,
        certificationProbability: freshActive.certificationProbability,
        carbonScope1: freshActive.carbonScope1,
        carbonScope2: freshActive.carbonScope2,
        carbonScope3: freshActive.carbonScope3,
        activeClause: freshActive.activeClause,
        certificationStatus: freshActive.certificationStatus,
        swot: freshActive.swot,
        pestel: freshActive.pestel,
        climateRelevanceDetermined: freshActive.climateRelevanceDetermined,
        climateRelevanceReasoning: freshActive.climateRelevanceReasoning,
        climateStakeholderRequirements: freshActive.climateStakeholderRequirements,
        stakeholders: freshActive.stakeholders,
        scopeStatement: freshActive.scopeStatement,
        rolesAssigned: freshActive.rolesAssigned,
        legalMatrix: freshActive.legalMatrix,
        changeManagementCompleted: freshActive.changeManagementCompleted,
        trainingLevel: freshActive.trainingLevel,
        competenceQuizCompleted: freshActive.competenceQuizCompleted,
        awarenessScore: freshActive.awarenessScore,
        incidents: freshActive.incidents,
        areas: freshActive.areas,
        documents: freshActive.documents,
        chatHistory: freshActive.chatHistory,
        newsFeed: freshActive.newsFeed,
        historyData: freshActive.historyData,

        // Reset player progression
        xp: 0,
        level: 1,
        badges: []
      };
    })
  };
});
