import type { CompanyArea, EMSDocument } from './gameStore';

// Helper to get current ISO date
const getTodayDate = () => new Date().toISOString().split('T')[0];

// ==========================================================
// 1. METALMECÁNICA INITIAL DATA
// ==========================================================
export const initialAreasMetal = (): Record<string, CompanyArea> => ({
  dg: {
    id: 'dg',
    name: 'Dirección General',
    description: 'Oficina estratégica de EnviroPro Metalmecánica. Dirección estratégica y recursos.',
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
    description: 'Línea de estampado y corte metálico pesado. Consumo eléctrico y ruido.',
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
      { id: 'alm_bunds', name: 'Diques de Contención Antiderrames del 110%', description: 'Estructuras de retención secundaria en zonas de almacenaje.', cost: 15000, active: false, impacts: { risk: -30, compliance: 20 } },
      { id: 'alm_recycle_wood', name: 'Donación y Triturado de Pallets de Madera', description: 'Programa de reuso de pallets para biocombustibles.', cost: 4000, active: false, impacts: { waste: -40 } }
    ]
  },
  pt: {
    id: 'pt',
    name: 'Planta de Tratamiento de Efluentes',
    description: 'Filtros y decantación de vertimientos líquidos con refrigerantes solubles hacia el río local.',
    category: 'support',
    energyUsage: 8000,
    waterUsage: 1200,
    wasteGenerated: 450,
    emissions: 2200,
    riskLevel: 75,
    workersCount: 8,
    trainingProgress: 0,
    aspects: [
      { id: 'pt_discharge', name: 'Vertimiento de agua industrial con trazas de grasas', impact: 'Alteración de la calidad del cuerpo receptor (río)', severity: 5, probability: 4, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'pt_sludge', name: 'Generación de lodos de tratamiento (químicos)', impact: 'Residuos peligrosos para confinamiento', severity: 4, probability: 3, significanceScore: 12, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'pt_separator', name: 'Celda de Flotación e Intercambiador de Iones', description: 'Purificación avanzada para reducir grasas y metales.', cost: 32000, active: false, impacts: { water: -20, risk: -25, compliance: 30 } },
      { id: 'pt_filter_press', name: 'Filtro Prensa de Deshidratación de Lodos', description: 'Reduce el volumen de lodo peligroso en un 60%.', cost: 18000, active: false, impacts: { waste: -40 } }
    ]
  },
  log: {
    id: 'log',
    name: 'Logística y Despacho',
    description: 'Flota de camiones propios y montacargas para la distribución de componentes metálicos.',
    category: 'support',
    energyUsage: 2500,
    waterUsage: 50,
    wasteGenerated: 120,
    emissions: 15400,
    riskLevel: 45,
    workersCount: 15,
    trainingProgress: 0,
    aspects: [
      { id: 'log_emissions', name: 'Emisión de gases de combustión diésel', impact: 'Contribución directa al Cambio Climático (Scope 1)', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'log_route', name: 'Planificador de Rutas Inteligente AI', description: 'Algoritmo para acortar recorridos de reparto en un 15%.', cost: 9000, active: false, impacts: { emissions: -15 } },
      { id: 'log_electric', name: 'Montacargas Eléctricos con Baterías de Litio', description: 'Reemplazo de montacargas a gas licuado de petróleo.', cost: 22000, active: false, impacts: { emissions: -10, energy: 5 } }
    ]
  },
  purch: {
    id: 'purch',
    name: 'Adquisiciones y Compras',
    description: 'Gestión de cadena de suministro y compra de bobinas de metal virgen y solventes.',
    category: 'support',
    energyUsage: 1000,
    waterUsage: 15,
    wasteGenerated: 25,
    emissions: 15000,
    riskLevel: 30,
    workersCount: 4,
    trainingProgress: 0,
    aspects: [
      { id: 'purch_scope3', name: 'Adquisición de metales vírgenes sin reciclar', impact: 'Agotamiento indirecto de recursos naturales (Scope 3)', severity: 3, probability: 5, significanceScore: 15, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'purch_procurement', name: 'Criterio de Compra de Acero con 50% Reciclado', description: 'Exigencia contractual a proveedores de materia prima homologada.', cost: 7000, active: false, impacts: { risk: -10 } }
    ]
  }
});

export const initialLegalMatrixMetal = () => [
  { id: 'R-DS001', regulation: 'Ley de Gestión Integral de Residuos Sólidos (DL 1278)', area: 'Patio de Residuos', requirement: 'Segregación obligatoria y almacenamiento techado de peligrosos.', status: 'non_compliant', penalty: 8000 },
  { id: 'R-DS002', regulation: 'Límites Máximos Permisibles de Vertimientos Industriales', area: 'Planta de Tratamiento', requirement: 'Concentración de grasas y aceites < 20 mg/L y pH entre 6.5-8.5.', status: 'non_compliant', penalty: 15000 },
  { id: 'R-DS003', regulation: 'Estándares de Calidad Ambiental (ECA) para Ruido Diurno', area: 'Producción y Prensas', requirement: 'No exceder los 80 dB en el perímetro colindante.', status: 'compliant', penalty: 5000 },
  { id: 'R-DS004', regulation: 'Reglamento de Almacenamiento de Sustancias Peligrosas', area: 'Almacén de Insumos', requirement: 'Implementación obligatoria de diques de contención del 110%.', status: 'non_compliant', penalty: 12000 },
];

export const initialDocumentsMetal = (): EMSDocument[] => [
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
    lastUpdated: getTodayDate()
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
    lastUpdated: getTodayDate()
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
    lastUpdated: getTodayDate()
  },
  {
    id: 'objectives_doc',
    type: 'objectives',
    title: 'Objetivos Ambientales del SGA',
    content: `<h1>OBJETIVOS AMBIENTALES ESTABLECIDOS (§6.2)</h1>
<p><strong>Periodo:</strong> 2026-2027 | <strong>Norma:</strong> ISO 14001:2026</p>
<hr/>
<ul>
  <li><strong>Objetivo 1:</strong> Disminuir el consumo eléctrico relativo en un 20% anual en Producción.</li>
  <li><strong>Objetivo 2:</strong> Reciclar el 95% de la chatarra metálica pesada producida en prensas.</li>
  <li><strong>Objetivo 3:</strong> Cero incidentes de contaminación de suelos y escurrimientos químicos al río local.</li>
</ul>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'programs_doc',
    type: 'objectives',
    title: 'Programas de Gestión Ambiental (PGA)',
    content: `<h1>PROGRAMA DE GESTIÓN AMBIENTAL - ENVIROPRO</h1>
<p><strong>Meta:</strong> Certificación ISO 14001:2026</p>
<table border="1" cellpadding="5" style="border-collapse:collapse; width:100%; font-size:11px;">
  <tr style="background:#f1f5f9;">
    <th>Proyecto</th>
    <th>Meta</th>
    <th>Presupuesto</th>
    <th>Responsable</th>
  </tr>
  <tr>
    <td>Cambio de iluminación y motores LED IE3</td>
    <td>-30% energía</td>
    <td>$25,000</td>
    <td>Mantto.</td>
  </tr>
  <tr>
    <td>Diques de retención secundaria</td>
    <td>Contener 110%</td>
    <td>$15,000</td>
    <td>Logística</td>
  </tr>
</table>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'procedures_doc',
    type: 'procedures',
    title: 'Procedimientos de Control Operacional',
    content: `<h1>PROTOCOLO DE RESPUESTA A DERRAMES (EP-SOP-001)</h1>
<p><strong>Norma:</strong> ISO 14001:2026 §8.1</p>
<hr/>
<p>En caso de derrame accidental de aceites o solventes en el Almacén:</p>
<ol>
  <li><strong>Proteger (P):</strong> Evaluar y colocarse el Equipo de Protección Personal (EPP) adecuado (MSDS).</li>
  <li><strong>Avisar (A):</strong> Alertar a la brigada interna y reportar volumen al Coordinador de Emergencia.</li>
  <li><strong>Contener (S):</strong> Bloquear el origen de la fuga y esparcir arena o paños absorbentes de los kits.</li>
</ol>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'emergency_plan_doc',
    type: 'emergency_plan',
    title: 'Plan de Preparación y Respuesta ante Emergencias',
    content: `<h1>PLAN DE CONTINGENCIAS AMBIENTALES (§8.2)</h1>
<p><strong>Organización:</strong> EnviroPro Metalmecánica S.A. | <strong>Edición:</strong> 2026</p>
<hr/>
<p>Este plan especifica los protocolos para las amenazas físicas identificadas, incluyendo lluvias extremas e inundación por desborde del río colindante. Las brigadas realizarán simulacros anuales.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'records_doc',
    type: 'procedures',
    title: 'Registro de Evidencias de Capacitación',
    content: `<h1>REGISTRO DE ENTRENAMIENTO Y TOMA DE CONCIENCIA (§7.2/7.3)</h1>
<p><strong>Código:</strong> ENV-REC-012 | <strong>Estado:</strong> Borrador</p>
<hr/>
<p>[Falta registro de asistencia al taller práctico de uso de kits antiderrames y segregación de residuos peligrosos. Requiere talleres aprobados en Cláusula 7].</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'kpis_doc',
    type: 'procedures',
    title: 'Tablero de KPIs y Desempeño GEI',
    content: `<h1>DESEMPEÑO AMBIENTAL E INVENTARIO GEI (§9.1.1)</h1>
<table border="1" cellpadding="5" style="border-collapse:collapse; width:100%; font-size:11px;">
  <tr style="background:#f1f5f9;">
    <th>Métrica</th>
    <th>Unidad</th>
    <th>Valor actual</th>
    <th>Meta</th>
  </tr>
  <tr>
    <td>Emisiones Scope 1</td>
    <td>tCO2e/mes</td>
    <td>12.4</td>
    <td>10.0</td>
  </tr>
  <tr>
    <td>Emisiones Scope 2</td>
    <td>tCO2e/mes</td>
    <td>43.2</td>
    <td>30.0</td>
  </tr>
</table>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'audit_report_doc',
    type: 'audit_report',
    title: 'Informe de Auditoría Interna',
    content: `<h1>INFORME DE AUDITORÍA INTERNA DEL SGA (§9.2)</h1>
<p><strong>Auditoría:</strong> Pre-Certificación ISO 14001:2026 | <strong>Fecha:</strong> 2026</p>
<hr/>
<p><strong>NC Mayor:</strong> La Política Ambiental carece de firma y no contempla la Enmienda Climática (§4.1/4.2).</p>
<p><strong>NC Menor:</strong> Faltan diques de contención secundaria en el Almacén y techado del Patio de Residuos.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'action_plan_doc',
    type: 'action_plan',
    title: 'Plan de Acciones Correctivas',
    content: `<h1>PLAN DE ACCIÓN CORRECTIVA Y MEJORA (§10.2)</h1>
<p>Mapeo de acciones correctivas basadas en análisis de 5 Porqués para las desviaciones reportadas por el Auditor e Inspectores.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  }
];

// ==========================================================
// 2. BIOCHEM AGROQUÍMICA INITIAL DATA
// ==========================================================
export const initialAreasChem = (): Record<string, CompanyArea> => ({
  dg: {
    id: 'dg',
    name: 'Dirección General',
    description: 'Dirección de BioChem Agroquímica. Liderazgo estratégico y prevención de desastres.',
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
    description: 'Mezcladores y reactores de reactivos de alta temperatura. Fugas de gases (COV).',
    category: 'ops',
    energyUsage: 18000,
    waterUsage: 900,
    wasteGenerated: 600,
    emissions: 12500,
    riskLevel: 90,
    workersCount: 22,
    trainingProgress: 0,
    aspects: [
      { id: 'react_voc', name: 'Fugas y venteo de Compuestos Orgánicos Volátiles (COV)', impact: 'Contaminación de aire y neblinas tóxicas en planta', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'react_energy', name: 'Consumo de calor y vapor de calentamiento', impact: 'Emisiones de gases indirectos de combustión (Scope 2)', severity: 3, probability: 4, significanceScore: 12, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'react_scrubber', name: 'Lavador de Gases Húmedo (Scrubber)', description: 'Neutralizador químico de gases ácidos y vapores orgánicos.', cost: 28000, active: false, impacts: { emissions: -50, risk: -20, compliance: 20 } },
      { id: 'react_recovery', name: 'Intercambiador de Calor Placas', description: 'Precalentador de fluidos de entrada con calor residual.', cost: 14000, active: false, impacts: { energy: -20 } }
    ]
  },
  alm_haz: {
    id: 'alm_haz',
    name: 'Almacén de Sustancias Críticas',
    description: 'Depósito central de concentrados tóxicos y ácidos fuertes. Alto riesgo de derrames.',
    category: 'ops',
    energyUsage: 2200,
    waterUsage: 20,
    wasteGenerated: 450,
    emissions: 800,
    riskLevel: 80,
    workersCount: 8,
    trainingProgress: 0,
    aspects: [
      { id: 'alm_spill', name: 'Riesgo de derrame de materias primas tóxicas concentradas', impact: 'Contaminación severa de suelos y acuífero de cuenca', severity: 5, probability: 4, significanceScore: 20, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'alm_impermeable', name: 'Impermeabilización de Suelo con Resina Epóxica', description: 'Revestimiento químico resistente a derrames ácidos.', cost: 16000, active: false, impacts: { risk: -25, compliance: 20 } },
      { id: 'alm_dikes', name: 'Diques Modulares Autoportantes', description: 'Bandejas y cubetas recolectoras para bidones e IBCs.', cost: 8500, active: false, impacts: { risk: -15 } }
    ]
  },
  pt_chem: {
    id: 'pt_chem',
    name: 'Decantación y Neutralización',
    description: 'Planta de efluentes especiales. Control de metales solubles, pH y neutralización con soda.',
    category: 'support',
    energyUsage: 6500,
    waterUsage: 1400,
    wasteGenerated: 800,
    emissions: 1800,
    riskLevel: 85,
    workersCount: 6,
    trainingProgress: 0,
    aspects: [
      { id: 'discharge_toxic', name: 'Vertimiento de agua con alta concentración química y pH ácido', impact: 'Destrucción de la fauna fluvial y eutrofización acelerada', severity: 5, probability: 4, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'sludge_heavy', name: 'Generación de lodo químico pesado (tóxico)', impact: 'Contaminación por metales en confinamiento especial', severity: 4, probability: 3, significanceScore: 12, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'pt_neutralizer', name: 'Dosificador Automatizado de Soda Caústica y Floculantes', description: 'Control de pH en tiempo real antes de verter al colector.', cost: 24000, active: false, impacts: { water: -15, risk: -30, compliance: 35 } },
      { id: 'pt_activated_carbon', name: 'Filtros de Carbón Activado y Lecho Profundo', description: 'Retiene el 99% de las trazas de pesticidas solubles.', cost: 15500, active: false, impacts: { water: -10 } }
    ]
  },
  log_haz: {
    id: 'log_haz',
    name: 'Logística de Distribución HAZMAT',
    description: 'Gestión del transporte y envasado de plaguicidas bajo normativa de materiales peligrosos.',
    category: 'support',
    energyUsage: 1800,
    waterUsage: 30,
    wasteGenerated: 250,
    emissions: 18600,
    riskLevel: 55,
    workersCount: 12,
    trainingProgress: 0,
    aspects: [
      { id: 'log_emissions', name: 'Emisión de gases Scope 1 en camiones de despacho', impact: 'Contribución al calentamiento global por quema de diésel', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'log_safe_route', name: 'Optimización de Cargas y Rutas Libres de Centros Urbanos', description: 'Reduce el kilometraje de transporte de plaguicidas peligrosos.', cost: 8000, active: false, impacts: { emissions: -10 } },
      { id: 'log_kit_hazmat', name: 'Kits HAZMAT Móviles en Cada Camión', description: 'Contenedores de absorción rápida e instrucciones para conductores.', cost: 5000, active: false, impacts: { risk: -15 } }
    ]
  },
  purch_bio: {
    id: 'purch_bio',
    name: 'Abastecimiento Sostenible',
    description: 'Adquisición de solventes y principios activos. Evaluación del origen de materias primas.',
    category: 'support',
    energyUsage: 800,
    waterUsage: 10,
    wasteGenerated: 15,
    emissions: 22000,
    riskLevel: 40,
    workersCount: 3,
    trainingProgress: 0,
    aspects: [
      { id: 'purch_actives', name: 'Compra de principios activos no orgánicos persistentes', impact: 'Contaminación indirecta persistente en suelo receptor (Scope 3)', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'purch_provider_audit', name: 'Homologación de Proveedores con Certificación ISO 14001:2026', description: 'Auditoría en origen de la síntesis sustentable.', cost: 9500, active: false, impacts: { risk: -15 } }
    ]
  }
});

export const initialLegalMatrixChem = () => [
  { id: 'R-CH001', regulation: 'Ley de Control de Insumos Químicos y Bienes Fiscalizados', area: 'Almacén de Sustancias Críticas', requirement: 'Licencia vigente, registro diario de ingresos y egresos de solventes.', status: 'non_compliant', penalty: 10000 },
  { id: 'R-CH002', regulation: 'Reglamento Nacional de Residuos Peligrosos (SGA)', area: 'Decantación y Neutralización', requirement: 'Manifiestos de lodos químicos peligrosos visados por operador autorizado.', status: 'non_compliant', penalty: 12000 },
  { id: 'R-CH003', regulation: 'Estándares de Calidad Ambiental (ECA) para Aire (COVs)', area: 'Reactores de Síntesis', requirement: 'Concentración perimetral de bencenos y COVs < 100 ug/m³.', status: 'compliant', penalty: 6000 },
  { id: 'R-CH004', regulation: 'LMP para Efluentes de la Industria Química y Plaguicidas', area: 'Decantación y Neutralización', requirement: 'Vertimiento con pH neutralizado (6.0 a 9.0) y plomo < 0.1 mg/L.', status: 'non_compliant', penalty: 18000 }
];

export const initialDocumentsChem = (): EMSDocument[] => [
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
    lastUpdated: getTodayDate()
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
    lastUpdated: getTodayDate()
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
    lastUpdated: getTodayDate()
  },
  {
    id: 'objectives_doc',
    type: 'objectives',
    title: 'Objetivos Ambientales del SGA',
    content: `<h1>OBJETIVOS AMBIENTALES DE BIOCHEM (ISO 14001:2026 §6.2)</h1>
<hr/>
<ul>
  <li><strong>Objetivo 1:</strong> Reducir la emisión de Compuestos Orgánicos Volátiles (COV) en un 50% en Reactores.</li>
  <li><strong>Objetivo 2:</strong> Cero multas regulatorias por vertimientos con pesticidas solubles.</li>
  <li><strong>Objetivo 3:</strong> Reducir el volumen de lodos peligrosos generados en un 30% mediante deshidratación.</li>
</ul>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'programs_doc',
    type: 'objectives',
    title: 'Programas de Gestión Ambiental (PGA)',
    content: `<h1>PROGRAMAS DE GESTIÓN Y REMEDIACIÓN - BIOCHEM</h1>
<table border="1" cellpadding="5" style="border-collapse:collapse; width:100%; font-size:11px;">
  <tr style="background:#f1f5f9;">
    <th>Proyecto</th>
    <th>Inversión</th>
    <th>Meta de Impacto</th>
  </tr>
  <tr>
    <td>Instalación de Scrubber húmedo en Reactores</td>
    <td>$28,000</td>
    <td>Reducir gases ácidos en 50%</td>
  </tr>
  <tr>
    <td>Dosificador automatizado de Soda en Efluentes</td>
    <td>$24,000</td>
    <td>pH neutro controlado automáticamente</td>
  </tr>
</table>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'procedures_doc',
    type: 'procedures',
    title: 'Procedimientos de Control Operacional',
    content: `<h1>PROTOCOLO DE RESPUESTA A DERRAMES QUÍMICOS (HAZMAT)</h1>
<p><strong>Norma:</strong> ISO 14001:2026 §8.1.1</p>
<hr/>
<p>Procedimientos obligatorios para la brigada EHS ante derrames en Almacén Químico:</p>
<ul>
  <li>Confinar y absorber usando diques modulares y arena silícea.</li>
  <li>Recoger los residuos peligrosos con herramientas antichispas.</li>
  <li>Disponer de manera certificada los materiales de recojo con manifiesto de residuos peligrosos.</li>
</ul>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'emergency_plan_doc',
    type: 'emergency_plan',
    title: 'Plan de Preparación y Respuesta ante Emergencias',
    content: `<h1>PLAN DE CONTINGENCIAS DE SUSTANCIAS PELIGROSAS (§8.2)</h1>
<p><strong>Edición:</strong> 2026 | <strong>Aprobado por:</strong> EHS Manager</p>
<hr/>
<p>Protocolos de respuesta frente a fallas catastróficas de tanques químicos, reacciones térmicas descontroladas e intoxicaciones. Incluye la red de llamadas de ayuda externa (Bomberos, Centros de Salud) y MSDS actualizadas.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'records_doc',
    type: 'procedures',
    title: 'Registro de Evidencias de Capacitación',
    content: `<h1>REGISTRO DE CAPACITACIONES EN BRIGADAS HAZMAT</h1>
<p>[Requiere validación y simulación práctica del kit absorbente y duchas de emergencia químicas en Almacén].</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'kpis_doc',
    type: 'procedures',
    title: 'Tablero de KPIs y Desempeño GEI',
    content: `<h1>DASHBOARD DE ECO-KPIs - BIOCHEM</h1>
<p>KPIs de monitoreo de efluentes químicos y emisiones de COVs alineados con GRI 303.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'audit_report_doc',
    type: 'audit_report',
    title: 'Informe de Auditoría Interna',
    content: `<h1>REPORTE DE AUDITORÍA INTERNA DEL SGA - BIOCHEM</h1>
<p><strong>NC Mayor:</strong> Vertimiento ácido y metales excediendo LMP en efluentes.</p>
<p><strong>NC Menor:</strong> Cajas de reactivos químicos sin almacenamiento impermeable secundario (sin diques).</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'action_plan_doc',
    type: 'action_plan',
    title: 'Plan de Acciones Correctivas',
    content: `<h1>ACCIONES CORRECTIVAS Y ANÁLISIS DE CAUSAS RAÍZ (§10.2)</h1>
<p>Estructuración del análisis de 5 Porqués para las brechas de derrames químicos y efluentes contaminados.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  }
];

// ==========================================================
// 3. ECOPOWER REFINERÍA INITIAL DATA
// ==========================================================
export const initialAreasPower = (): Record<string, CompanyArea> => ({
  dg: {
    id: 'dg',
    name: 'Dirección General',
    description: 'Dirección de EcoPower Refinería. Gestión ESG, carbono neutralidad y presupuesto.',
    category: 'admin',
    energyUsage: 2000,
    waterUsage: 30,
    wasteGenerated: 25,
    emissions: 800,
    riskLevel: 10,
    workersCount: 8,
    trainingProgress: 0,
    aspects: [
      { id: 'dg_dec', name: 'Aprobación de fondos estratégicos', impact: 'Falta de inversión en sistemas de reuso hídrico y trazabilidad', severity: 3, probability: 3, significanceScore: 9, isSignificant: false, mitigated: false }
    ],
    controls: [
      { id: 'dg_esg_policy', name: 'Comité de Compras Verdes y ESG', description: 'Procedimientos de selección sustentable obligatorios.', cost: 5000, active: false, impacts: { risk: -15, compliance: 15 } }
    ]
  },
  ref: {
    id: 'ref',
    name: 'Área de Refinamiento',
    description: 'Unidad de craqueo térmico y catalítico de aceites para biodiésel. Consumo de vapor y calor.',
    category: 'ops',
    energyUsage: 32000,
    waterUsage: 1500,
    wasteGenerated: 1200,
    emissions: 24000,
    riskLevel: 85,
    workersCount: 38,
    trainingProgress: 0,
    aspects: [
      { id: 'ref_steam', name: 'Alto consumo de vapor de calentamiento', impact: 'Emisión directa de gases de efecto invernadero (Scope 1)', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'ref_waste', name: 'Generación de borras y gomas ácidas de destilación', impact: 'Aumento de residuos peligrosos para confinamiento', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'ref_boiler_eff', name: 'Optimización de Caldera e Integración de Vapor', description: 'Recuperador de calor en chimenea y aislamiento térmico.', cost: 30000, active: false, impacts: { energy: -25, emissions: -20 } },
      { id: 'ref_neutralizer', name: 'Tratamiento y Co-Procesamiento de Borras de Destilación', description: 'Conversión de borras en emulsiones para hornos cementeros.', cost: 16000, active: false, impacts: { waste: -50 } }
    ]
  },
  dep: {
    id: 'dep',
    name: 'Depósito de Biocombustible',
    description: 'Tanques de almacenamiento de biodiésel puro y alcoholes. Fugas invisibles al acuífero.',
    category: 'ops',
    energyUsage: 1500,
    waterUsage: 15,
    wasteGenerated: 100,
    emissions: 500,
    riskLevel: 75,
    workersCount: 6,
    trainingProgress: 0,
    aspects: [
      { id: 'dep_leak', name: 'Riesgo de filtración invisible de biodiésel', impact: 'Contaminación y alteración del acuífero subterráneo', severity: 5, probability: 3, significanceScore: 15, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'dep_sensors', name: 'Sensores de Caída de Presión y Doble Pared', description: 'Detección automática de micro-fugas en tanques enterrados.', cost: 20000, active: false, impacts: { risk: -30, compliance: 20 } },
      { id: 'dep_imp_ground', name: 'Losa Impermeabilizada de Descarga de Cisternas', description: 'Construcción de losa de concreto con sumideros ciegos.', cost: 11000, active: false, impacts: { risk: -10 } }
    ]
  },
  zld: {
    id: 'zld',
    name: 'Planta de Reuso Hídrico Cero',
    description: 'Sistema de tratamiento de purgas y ósmosis inversa para descarga líquida cero (ZLD).',
    category: 'support',
    energyUsage: 9000,
    waterUsage: 2500,
    wasteGenerated: 750,
    emissions: 3200,
    riskLevel: 70,
    workersCount: 8,
    trainingProgress: 0,
    aspects: [
      { id: 'zld_salts', name: 'Generación de sales de ósmosis y purgas de alta temperatura', impact: 'Salinización localizada y afectación térmica de suelos', severity: 4, probability: 3, significanceScore: 12, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'zld_evaporator', name: 'Evaporador al Vacío de Salmueras de Alta Eficiencia', description: 'Recuperación de agua de purga para reuso en calderas.', cost: 35000, active: false, impacts: { water: -40, risk: -20, compliance: 25 } }
    ]
  },
  log_dist: {
    id: 'log_dist',
    name: 'Logística de Distribución Biocombustibles',
    description: 'Transporte terrestre y distribución de biodiésel a puertos de despacho.',
    category: 'support',
    energyUsage: 3500,
    waterUsage: 40,
    wasteGenerated: 180,
    emissions: 28000,
    riskLevel: 50,
    workersCount: 18,
    trainingProgress: 0,
    aspects: [
      { id: 'log_diesel', name: 'Quema de combustibles fósiles en tractocamiones de despacho', impact: 'Emisión directa de GEI y contribución al Cambio Climático (Scope 1)', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'log_rail_bio', name: 'Transición a Distribución Multimodal por Tren', description: 'Sustitución de transporte por carretera por trenes eficientes.', cost: 26000, active: false, impacts: { emissions: -30 } }
    ]
  },
  purch_agri: {
    id: 'purch_agri',
    name: 'Abastecimiento de Biomasa',
    description: 'Compra de soya y aceites crudos en la cadena de suministro agrícola.',
    category: 'support',
    energyUsage: 1200,
    waterUsage: 20,
    wasteGenerated: 30,
    emissions: 38000,
    riskLevel: 60,
    workersCount: 5,
    trainingProgress: 0,
    aspects: [
      { id: 'purch_deforestation', name: 'Abastecimiento de cultivos vinculados a riesgo de deforestación', impact: 'Pérdida irreversible de biodiversidad y bosques (Scope 3)', severity: 5, probability: 4, significanceScore: 20, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'purch_sat_tracking', name: 'Monitoreo Satelital de Deforestación Cero', description: 'Sistema de trazabilidad geoespacial para parcelas agrícolas.', cost: 18000, active: false, impacts: { risk: -30, compliance: 30 } }
    ]
  }
});

export const initialLegalMatrixPower = () => [
  { id: 'R-PW001', regulation: 'Reglamento Ambiental para el Abastecimiento de Biocombustibles', area: 'Abastecimiento de Biomasa', requirement: 'Garantizar auditorías agrícolas libres de talas ilegales.', status: 'non_compliant', penalty: 15000 },
  { id: 'R-PW002', regulation: 'ECA para Emisiones de Calderas Industriales y Turbinas de Vapor', area: 'Área de Refinamiento', requirement: 'Límites máximos de emisiones de partículas PM10 < 50 mg/Nm³.', status: 'non_compliant', penalty: 18000 },
  { id: 'R-PW003', regulation: 'Reglamento de Vertimientos Industriales y Reuso de Agua', area: 'Planta de Reuso Hídrico Cero', requirement: 'Cumplimiento estricto del caudal y conductividad eléctrica en purgas.', status: 'compliant', penalty: 8000 },
  { id: 'R-PW004', regulation: 'Reglamento de Seguridad de Instalaciones de Almacenamiento', area: 'Depósito de Biocombustible', requirement: 'Pruebas de hermeticidad y monitoreo continuo de tanques enterrados.', status: 'non_compliant', penalty: 16000 }
];

export const initialDocumentsPower = (): EMSDocument[] => [
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
    lastUpdated: getTodayDate()
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
    lastUpdated: getTodayDate()
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
    lastUpdated: getTodayDate()
  },
  {
    id: 'objectives_doc',
    type: 'objectives',
    title: 'Objetivos Ambientales del SGA',
    content: `<h1>OBJETIVOS AMBIENTALES DE ECOPOWER (ISO 14001:2026 §6.2)</h1>
<hr/>
<ul>
  <li><strong>Objetivo 1:</strong> Reducir en un 25% el consumo energético en Refinamiento.</li>
  <li><strong>Objetivo 2:</strong> Implementar 100% de reuso de agua y ZLD en la planta.</li>
  <li><strong>Objetivo 3:</strong> Garantizar 100% de trazabilidad de biomasa de deforestación cero.</li>
</ul>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'programs_doc',
    type: 'objectives',
    title: 'Programas de Gestión Ambiental (PGA)',
    content: `<h1>PROGRAMA DE MITIGACIÓN Y CARBONO NEUTRO - ECOPOWER</h1>
<p>Proyectos de caldera biomasa, filtros ZLD y trazabilidad satelital en cadena de suministro.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'procedures_doc',
    type: 'procedures',
    title: 'Procedimientos de Control Operacional',
    content: `<h1>PROCEDIMIENTO DE CONTROL DE FUGAS E IMPERMEABILIDAD (EP-SOP-003)</h1>
<p><strong>Normativa:</strong> ISO 14001:2026 §8.1</p>
<hr/>
<p>Instrucciones de inspección y respuesta a micro-filtraciones en tanques enterrados mediante telemetría de caída de presión.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'emergency_plan_doc',
    type: 'emergency_plan',
    title: 'Plan de Preparación y Respuesta ante Emergencias',
    content: `<h1>PLAN DE CONTINGENCIAS Y DERRAMES DE BIOCOMBUSTIBLES</h1>
<p>Procedimientos de respuesta ante vertidos accidentales de hidrocarburos en zonas fluviales o fallas estructurales de tanques centrales.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'records_doc',
    type: 'procedures',
    title: 'Registro de Evidencias de Capacitación',
    content: `<h1>REGISTRO DE MONITOREO SATELITAL Y TRAZABILIDAD AGRÍCOLA</h1>
<p>[Falta registro de auditorías en origen a campos de soya y capacitación de analistas en GIS].</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'kpis_doc',
    type: 'procedures',
    title: 'Tablero de KPIs y Desempeño GEI',
    content: `<h1>BALANCE DE CARBONO SCOPE 1/2/3 - ECOPOWER</h1>
<p>Métricas de contabilidad de carbono e intensidad hídrica bajo lineamientos SBTi.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'audit_report_doc',
    type: 'audit_report',
    title: 'Informe de Auditoría Interna',
    content: `<h1>REPORTE DE AUDITORÍA INTERNA DEL SGA - ECOPOWER</h1>
<p><strong>NC Mayor:</strong> Compra de biomasa sin trazabilidad física de deforestación cero.</p>
<p><strong>NC Menor:</strong> Purgas salinas de caldera vertidas temporalmente en suelo del predio.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'action_plan_doc',
    type: 'action_plan',
    title: 'Plan de Acciones Correctivas',
    content: `<h1>ACCIONES CORRECTIVAS Y MEJORA CONTINUA - ECOPOWER</h1>
<p>Cierre de desvíos legales del abastecimiento y caldera biomasa mediante el análisis de 5 Porqués.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  }
];

// ==========================================================
// 4. MINEGOLD AURUM VALLEY INITIAL DATA (GOLD MINE)
// ==========================================================
export const initialAreasMine = (): Record<string, CompanyArea> => ({
  dg: {
    id: 'dg',
    name: 'Dirección de Asuntos Ambientales',
    description: 'Oficina estratégica del SGA minero. Licencias sociales y plan de cierre progresivo.',
    category: 'admin',
    energyUsage: 1800,
    waterUsage: 35,
    wasteGenerated: 30,
    emissions: 600,
    riskLevel: 10,
    workersCount: 10,
    trainingProgress: 0,
    aspects: [
      { id: 'dg_dec', name: 'Aprobación de fondos para plan de cierre', impact: 'Falta de provisión para remediación de relaveras al cierre', severity: 4, probability: 3, significanceScore: 12, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'dg_reclamation', name: 'Fondo de Garantía Ambiental y Plan de Cierre Progresivo', description: 'Fideicomiso para remediación paralela de áreas perturbadas.', cost: 30000, active: false, impacts: { risk: -25, compliance: 20 } }
    ]
  },
  open_pit: {
    id: 'open_pit',
    name: 'Tajo Abierto y Voladura',
    description: 'Extracción de mineral de roca a gran escala. Voladuras pesadas, polvo y carguío diésel.',
    category: 'ops',
    energyUsage: 38000,
    waterUsage: 4500,
    wasteGenerated: 45000, // mineral bulk
    emissions: 32000,
    riskLevel: 85,
    workersCount: 85,
    trainingProgress: 0,
    aspects: [
      { id: 'pit_dust', name: 'Generación de material particulado (PM10 / PM2.5) por voladuras', impact: 'Afectación a la calidad del aire local y comunidades vecinas', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'pit_diesel', name: 'Consumo de diésel en camiones volquetes gigantes', impact: 'Emisiones directas de GEI y óxidos de nitrógeno (Scope 1)', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'pit_irrigation', name: 'Riego con Agua Industrial y Captadores en Perforación', description: 'Aspersores en pistas de acarreo y supresores de polvo.', cost: 22000, active: false, impacts: { emissions: -40, risk: -15, compliance: 20 } },
      { id: 'pit_telemetry', name: 'Optimización AI de Acarreo y Despacho', description: 'Sistema de telemetría para acortar tiempos muertos en ralentí.', cost: 12000, active: false, impacts: { emissions: -15 } }
    ]
  },
  leach_pad: {
    id: 'leach_pad',
    name: 'Pad de Lixiviación y Cianuración',
    description: 'Riego de mineral con cianuro de sodio para disolución de oro. Alto riesgo químico de suelo.',
    category: 'ops',
    energyUsage: 14000,
    waterUsage: 8500,
    wasteGenerated: 1400,
    emissions: 1500,
    riskLevel: 95,
    workersCount: 24,
    trainingProgress: 0,
    aspects: [
      { id: 'leach_cyanide', name: 'Uso y riesgo de filtración de solución cianurada', impact: 'Contaminación crítica de suelos y acuíferos profundos', severity: 5, probability: 4, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'leach_water', name: 'Captación excesiva de agua de río fresco para procesos', impact: 'Agotamiento del recurso hídrico superficial de la cuenca', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'leach_membrane', name: 'Doble Geomembrana de HDPE con Sensores de Fuga', description: 'Sensores eléctricos de conductividad para detectar micro-filtraciones.', cost: 42000, active: false, impacts: { risk: -40, compliance: 30 } },
      { id: 'leach_recycle', name: 'Circuito Cerrado de Agua de Proceso (Recirculación)', description: 'Recirculación del 95% del agua de lixiviación sin vertido.', cost: 25000, active: false, impacts: { water: -45 } }
    ]
  },
  tailings: {
    id: 'tailings',
    name: 'Presa de Relaves',
    description: 'Depósito de lodos de descarte minero con metales pesados. Estabilidad física y drenaje ácido.',
    category: 'ops',
    energyUsage: 4500,
    waterUsage: 1200,
    wasteGenerated: 35000,
    emissions: 2000,
    riskLevel: 90,
    workersCount: 15,
    trainingProgress: 0,
    aspects: [
      { id: 'tailings_acid', name: 'Riesgo de generación de drenaje ácido de roca (DAR)', impact: 'Lixiviación de metales pesados hacia cursos de agua', severity: 5, probability: 4, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'tailings_sludge', name: 'Acumulación de lodos metalúrgicos con reactivos residuales', impact: 'Pérdida de hábitat y riesgo geotécnico de rotura de presa', severity: 5, probability: 3, significanceScore: 15, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'tailings_treatment', name: 'Neutralización con Cal y Adición de Sulfuro de Sodio', description: 'Precipitación y neutralización química de relaves antes del descarte.', cost: 29000, active: false, impacts: { risk: -25, compliance: 25 } },
      { id: 'tailings_piezometer', name: 'Sensores de Inclinación e Instrumentación Geotécnica', description: 'Monitoreo automatizado en tiempo real de estabilidad de la presa.', cost: 18000, active: false, impacts: { risk: -20 } }
    ]
  },
  comm_rel: {
    id: 'comm_rel',
    name: 'Relaciones Comunitarias',
    description: 'Gestión social de la mina con comunidades campesinas locales.',
    category: 'support',
    energyUsage: 1200,
    waterUsage: 150,
    wasteGenerated: 80,
    emissions: 400,
    riskLevel: 50,
    workersCount: 8,
    trainingProgress: 0,
    aspects: [
      { id: 'comm_protest', name: 'Conflictos sociales por percepciones de contaminación de agua', impact: 'Afectación severa a la reputación y paralización productiva', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'comm_participatory', name: 'Monitoreo Ambiental Participativo Mensual', description: 'Muestreos de agua conjuntos con autoridades y vecinos.', cost: 11000, active: false, impacts: { risk: -30, compliance: 15 } }
    ]
  },
  lab_mine: {
    id: 'lab_mine',
    name: 'Laboratorio Metalúrgico',
    description: 'Análisis de leyes de mineral y control de calidad químico del agua de procesos.',
    category: 'support',
    energyUsage: 3500,
    waterUsage: 500,
    wasteGenerated: 380,
    emissions: 1200,
    riskLevel: 65,
    workersCount: 6,
    trainingProgress: 0,
    aspects: [
      { id: 'lab_acid_waste', name: 'Generación de desechos líquidos ácidos y sales de metales', impact: 'Residuos químicos peligrosos de alta toxicidad para disposición', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'lab_evap_pan', name: 'Sistema de Cristalización y Evaporación de Soluciones', description: 'Secado e inmovilización de sales metálicas peligrosas.', cost: 15000, active: false, impacts: { waste: -45, risk: -15 } }
    ]
  }
});

export const initialLegalMatrixMine = () => [
  { id: 'R-MN001', regulation: 'Reglamento Ambiental para Actividades Minero-Metalúrgicas (DS 040)', area: 'Dirección de Asuntos Ambientales', requirement: 'Plan de Cierre de Minas aprobado e instrumento financiero de garantía al día.', status: 'non_compliant', penalty: 20000 },
  { id: 'R-MN002', regulation: 'Estándares de Calidad Ambiental (ECA) para Aire (Partículas)', area: 'Tajo Abierto y Voladura', requirement: 'Límite máximo diario PM10 < 100 ug/m³.', status: 'non_compliant', penalty: 12000 },
  { id: 'R-MN003', regulation: 'LMP para Vertimientos de la Actividad Minero-Metalúrgica', area: 'Pad de Lixiviación y Cianuración', requirement: 'Cianuro WAD < 1.0 mg/L y metales pesados (plomo/cobre) controlados.', status: 'non_compliant', penalty: 18000 },
  { id: 'R-MN004', regulation: 'Ley de Recursos Hídricos y Permisos de Uso de Agua', area: 'Pad de Lixiviación y Cianuración', requirement: 'Licencia vigente de uso de agua y caudal autorizado por la ANA.', status: 'compliant', penalty: 10000 }
];

export const initialDocumentsMine = (): EMSDocument[] => [
  {
    id: 'policy_doc',
    type: 'policy',
    title: 'Política Ambiental de Aurum Valley S.A.',
    content: `<h1>POLÍTICA AMBIENTAL Y SOCIAL - MINEGOLD AURUM VALLEY (ISO 14001:2026)</h1>
<p><strong>Código:</strong> MN-POL-001 | <strong>Versión:</strong> 4.0</p>
<hr />
<p>En MineGold Aurum Valley S.A., nos dedicamos a la exploración y explotación de oro a tajo abierto. Nos comprometemos a integrar el control ambiental en cada etapa de la operación minera bajo la norma ISO 14001:2026:</p>
<ol>
  <li><strong>Protección del medio ambiente:</strong> Prevenir de forma absoluta filtraciones de cianuro e infiltraciones de drenaje ácido de roca. Reducir nuestro material particulado y mitigar riesgos climáticos físicos como lluvias extremas e inundaciones perimetrales (§4.1).</li>
  <li><strong>Cumplimiento regulatorio:</strong> Cumplir rigurosamente las obligaciones del Plan de Cierre de Minas y los LMP de descargas químicas.</li>
  <li><strong>Llamado al Diálogo y Transparencia:</strong> Promover el monitoreo ambiental participativo mensual con nuestras comunidades vecinas.</li>
  <li><strong>Mejora continua:</strong> Restaurar de forma progresiva las áreas perturbadas y reforestar taludes de relaveras.</li>
</ol>
<p><em>[Pendiente de firma de la Dirección General]</em></p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'matrix_doc',
    type: 'aspect_matrix',
    title: 'Matriz de Aspectos e Impactos Ambientales',
    content: `<h1>MATRIZ DE SIGNIFICANCIA AMBIENTAL - AURUM VALLEY (ISO 14001:2026 §6.1.2)</h1>
<table border="1" cellpadding="5" style="border-collapse:collapse; width:100%; font-size:11px;">
  <tr style="background:#f1f5f9;">
    <th>Área</th>
    <th>Aspecto Ambiental</th>
    <th>Impacto Asociado</th>
    <th>Score</th>
    <th>Significativo</th>
  </tr>
  <tr>
    <td>Voladura</td>
    <td>Emisión de PM10 y polvo</td>
    <td>Afectación a comunidades y calidad de aire</td>
    <td>20</td>
    <td>SÍ</td>
  </tr>
  <tr>
    <td>Lixiviación</td>
    <td>Riesgo de filtración de cianuro</td>
    <td>Contaminación crítica de suelos y acuíferos</td>
    <td>20</td>
    <td>SÍ</td>
  </tr>
  <tr>
    <td>Relavera</td>
    <td>Riesgo de drenaje ácido</td>
    <td>Lixiviación de metales en cuenca hidrográfica</td>
    <td>20</td>
    <td>SÍ</td>
  </tr>
</table>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'legal_doc',
    type: 'legal_matrix',
    title: 'Matriz de Obligaciones de Cumplimiento',
    content: `<h1>COMPENDIO DE REQUISITOS MINEROS LEGALES (ISO 14001:2026 §6.1.3)</h1>
<table border="1" cellpadding="5" style="border-collapse:collapse; width:100%; font-size:11px;">
  <tr style="background:#f1f5f9;">
    <th>Normativa</th>
    <th>Área</th>
    <th>Requisito Legal</th>
    <th>Estado</th>
  </tr>
  <tr>
    <td>DS 040 (Cierre)</td>
    <td>Dirección</td>
    <td>Garantía ambiental aprobada para remediación del tajo.</td>
    <td>Incumple (Fondo desactualizado)</td>
  </tr>
  <tr>
    <td>LMP Minería</td>
    <td>Lixiviación</td>
    <td>Cianuro WAD en vertimientos < 1.0 mg/L.</td>
    <td>Incumple (Trazas en zanjas externas)</td>
  </tr>
</table>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'objectives_doc',
    type: 'objectives',
    title: 'Objetivos Ambientales del SGA',
    content: `<h1>OBJETIVOS AMBIENTALES DE AURUM VALLEY (ISO 14001:2026 §6.2)</h1>
<hr/>
<ul>
  <li><strong>Objetivo 1:</strong> Reducir el PM10 en un 40% en pistas de acarreo.</li>
  <li><strong>Objetivo 2:</strong> Implementar 95% de recirculación de agua en el circuito de lixiviación.</li>
  <li><strong>Objetivo 3:</strong> Iniciar la revegetación progresiva del 100% de la presa de relaves.</li>
</ul>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'programs_doc',
    type: 'objectives',
    title: 'Programas de Gestión Ambiental (PGA)',
    content: `<h1>PROGRAMA DE CIERRE PROGRESIVO Y REMEDIACIÓN</h1>
<p>Proyectos de riego automatizado, doble geomembrana de HDPE en pads y dosificación de cal en relaveras.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'procedures_doc',
    type: 'procedures',
    title: 'Procedimientos de Control Operacional',
    content: `<h1>PROTOCOLO DE NEUTRALIZACIÓN QUÍMICA DE CIANURO (MN-SOP-002)</h1>
<p><strong>Norma:</strong> ISO 14001:2026 §8.1</p>
<hr/>
<p>Instrucciones ante escapes de solución de lixiviación: aplicación inmediata de hipoclorito de sodio o peróxido de hidrógeno a pH > 10 para destruir el cianuro residual.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'emergency_plan_doc',
    type: 'emergency_plan',
    title: 'Plan de Preparación y Respuesta ante Emergencias',
    content: `<h1>PLAN DE CONTINGENCIA Y RESPUESTA ANTE ROTURA DE PRESA DE RELAVES</h1>
<p>Protocolos ante sismos y fisuras de relaveras: activación de compuertas de sedimentadores, contención del lodo pesado y alerta a poblaciones de la cuenca baja.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'records_doc',
    type: 'procedures',
    title: 'Registro de Evidencias de Capacitación',
    content: `<h1>REGISTRO DE SIMULACROS DE EMERGENCIA MINERA</h1>
<p>[Falta registro de entrenamiento práctico en respuesta a contingencias químicas e integridad de presa].</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'kpis_doc',
    type: 'procedures',
    title: 'Tablero de KPIs y Desempeño GEI',
    content: `<h1>KPIs DE CONTAMINACIÓN Y EMISIONES - AURUM VALLEY</h1>
<p>Métricas de cianuro libre, intensidad de agua captada de río, y emisiones Scope 1 de volquetes.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'audit_report_doc',
    type: 'audit_report',
    title: 'Informe de Auditoría Interna',
    content: `<h1>REPORTE DE AUDITORÍA INTERNA DEL SGA - AURUM VALLEY</h1>
<p><strong>NC Mayor:</strong> Garantía financiera de plan de cierre no formalizada.</p>
<p><strong>NC Menor:</strong> Fuga leve en zanja perimetral de agua de proceso con sales metálicas.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'action_plan_doc',
    type: 'action_plan',
    title: 'Plan de Acciones Correctivas',
    content: `<h1>ACCIONES CORRECTIVAS DE AUDITORÍA MINERA</h1>
<p>Estructuración del análisis de 5 Porqués para las NC de la relavera y el Plan de Cierre.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  }
];

// ==========================================================
// 5. PETROGLOW OIL & GAS INITIAL DATA
// ==========================================================
export const initialAreasOil = (): Record<string, CompanyArea> => ({
  dg: {
    id: 'dg',
    name: 'Dirección EHS Corporativa',
    description: 'Dirección estratégica del SGA de hidrocarburos. Auditoría e inversiones.',
    category: 'admin',
    energyUsage: 2200,
    waterUsage: 40,
    wasteGenerated: 30,
    emissions: 800,
    riskLevel: 10,
    workersCount: 12,
    trainingProgress: 0,
    aspects: [
      { id: 'dg_dec', name: 'Asignación de presupuesto de mantenimiento', impact: 'Falta de preventivos de corrosión en ductos', severity: 4, probability: 3, significanceScore: 12, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'dg_integrity', name: 'Plan de Integridad EHS y Gestión de Activos', description: 'Garantía presupuestaria para auditoría e inspección técnica de tanques.', cost: 28000, active: false, impacts: { risk: -20, compliance: 15 } }
    ]
  },
  drilling: {
    id: 'drilling',
    name: 'Plataformas de Pozos',
    description: 'Pozos de extracción terrestres. Perforación, lodos base aceite y gas de venteo.',
    category: 'ops',
    energyUsage: 19000,
    waterUsage: 2200,
    wasteGenerated: 12000,
    emissions: 26000,
    riskLevel: 90,
    workersCount: 45,
    trainingProgress: 0,
    aspects: [
      { id: 'drill_sludge', name: 'Generación de lodos de perforación base aceite (peligrosos)', impact: 'Contaminación de suelos con hidrocarburos aromáticos', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'drill_spill', name: 'Riesgo de fugas y derrames de crudo en boca de pozo', impact: 'Contaminación directa de hábitats naturales terrestres', severity: 5, probability: 4, significanceScore: 20, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'drill_separator', name: 'Centrifugadora y Secador de Lodos Térmico', description: 'Recupera el 85% del aceite y reduce el residuo sólido.', cost: 34000, active: false, impacts: { waste: -45, risk: -15 } },
      { id: 'drill_trays', name: 'Bandejas Recolectoras y Válvulas ESD', description: 'Estructuras de contención alrededor de cabezas de pozos.', cost: 14000, active: false, impacts: { risk: -25, compliance: 20 } }
    ]
  },
  refinery: {
    id: 'refinery',
    name: 'Unidad de Destilación',
    description: 'Hornos de destilación y cracking. Combustión, quema de gas y emisiones de azufre.',
    category: 'ops',
    energyUsage: 36000,
    waterUsage: 3200,
    wasteGenerated: 1600,
    emissions: 42000,
    riskLevel: 85,
    workersCount: 52,
    trainingProgress: 0,
    aspects: [
      { id: 'ref_sox', name: 'Emisión de Compuestos de Azufre (SOx) y óxidos de nitrógeno', impact: 'Neblina ácida y contribución a lluvia ácida en la región', severity: 4, probability: 4, significanceScore: 16, isSignificant: true, mitigated: false },
      { id: 'ref_methane', name: 'Fugas y quema rutinaria de gas en antorchas ( flares )', impact: 'Emisión directa de metano y CO2 a la atmósfera (Scope 1)', severity: 5, probability: 5, significanceScore: 25, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'ref_sru', name: 'Unidad de Recuperación de Azufre (SRU - Claus)', description: 'Recupera el azufre gaseoso en forma sólida elemental.', cost: 38000, active: false, impacts: { emissions: -45, risk: -20, compliance: 30 } },
      { id: 'ref_flare_gas', name: 'Sistema de Recuperación de Gas de Antorcha (FGRS)', description: 'Comprime el gas de venteo para reusar como combustible de caldera.', cost: 24000, active: false, impacts: { emissions: -30 } }
    ]
  },
  pipeline: {
    id: 'pipeline',
    name: 'Terminal y Oleoducto',
    description: 'Estaciones de bombeo y oleoductos de distribución. Riesgo de corrosión y descargas pluviales.',
    category: 'ops',
    energyUsage: 5000,
    waterUsage: 450,
    wasteGenerated: 600,
    emissions: 3500,
    riskLevel: 80,
    workersCount: 16,
    trainingProgress: 0,
    aspects: [
      { id: 'pipe_corrosion', name: 'Riesgo de rotura de ducto por corrosión externa', impact: 'Derrames masivos de crudo en ríos y terrenos colindantes', severity: 5, probability: 4, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'pipe_water', name: 'Generación de aguas de purga oleosas con fenoles', impact: 'Contaminación del medio acuático por fenoles y TPH', severity: 5, probability: 3, significanceScore: 15, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'pipe_scada', name: 'Inspección con Smart Pigs y Telemetría SCADA', description: 'Monitoreo de presión y ultrasonido interno periódico.', cost: 26000, active: false, impacts: { risk: -35, compliance: 20 } },
      { id: 'pipe_flotation', name: 'Celda de Flotación por Aire Inducido (IAF)', description: 'Separa aceites emulsionados y fenoles del agua de purga.', cost: 18000, active: false, impacts: { water: -30 } }
    ]
  },
  restoration: {
    id: 'restoration',
    name: 'Área de Remediación de Suelos',
    description: 'Unidad de biopilas y remediación de suelos históricamente impactados.',
    category: 'support',
    energyUsage: 1400,
    waterUsage: 800,
    wasteGenerated: 450,
    emissions: 900,
    riskLevel: 40,
    workersCount: 6,
    trainingProgress: 0,
    aspects: [
      { id: 'rest_microbes', name: 'Uso de bioestimulantes y bacterias para biodegradación', impact: 'Remediación y recuperación de suelos degradados por crudo', severity: 3, probability: 5, significanceScore: 15, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'rest_biopiles', name: 'Tratamiento por Biopilas y Volteo Mecánico', description: 'Oxigenación acelerada del suelo con bacterias nativas.', cost: 13000, active: false, impacts: { waste: -50 } }
    ]
  }
});

export const initialLegalMatrixOil = () => [
  { id: 'R-OL001', regulation: 'Reglamento Ambiental para Actividades de Hidrocarburos (DS 039)', area: 'Dirección EHS Corporativa', requirement: 'Plan de Contingencias contra Derrames visado y vigente ante reguladores.', status: 'non_compliant', penalty: 18000 },
  { id: 'R-OL002', regulation: 'ECA para Aire: Límites de Dióxido de Azufre (SO2)', area: 'Unidad de Destilación', requirement: 'Emisión perimetral de SO2 < 250 ug/m³ diario.', status: 'compliant', penalty: 8000 },
  { id: 'R-OL003', regulation: 'LMP para Vertimientos de Actividades de Hidrocarburos', area: 'Terminal y Oleoducto', requirement: 'Hidrocarburos Totales de Petróleo (TPH) < 10 mg/L en aguas de purga.', status: 'non_compliant', penalty: 20000 },
  { id: 'R-OL004', regulation: 'Reglamento de Seguridad y Gestión de Ductos', area: 'Terminal y Oleoducto', requirement: 'Plan de Gestión de Integridad de Oleoductos al día con reguladores.', status: 'non_compliant', penalty: 15000 }
];

export const initialDocumentsOil = (): EMSDocument[] => [
  {
    id: 'policy_doc',
    type: 'policy',
    title: 'Política Ambiental de PetroGlow Oil & Gas',
    content: `<h1>POLÍTICA DE EHS - PETROGLOW S.A. (ISO 14001:2026)</h1>
<p><strong>Código:</strong> PG-POL-001 | <strong>Versión:</strong> 3.0</p>
<hr />
<p>En PetroGlow Oil & Gas S.A., empresa enfocada en la perforación y destilación de crudo, nos comprometemos con un desempeño sustentable regulado por la norma ISO 14001:2026:</p>
<ol>
  <li><strong>Prevención de contaminación y derrames:</strong> Cero pérdidas accidentales de hidrocarburos hacia ríos o tierra. Mitigación sistemática de fugas por corrosión.</li>
  <li><strong>Mitigación Climática y Descarbonización:</strong> Implementar programas para eliminar la quema rutinaria en antorchas e inventariar Scope 1, 2 y 3 (§4.1/4.2).</li>
  <li><strong>Cumplimiento de Obligaciones Legales:</strong> Mantener al día los Planes de Integridad de Ductos y LMP de vertimientos de purga oleosa.</li>
  <li><strong>Remediación y Recuperación:</strong> Restaurar de forma acelerada suelos históricamente impactados mediante biopilas.</li>
</ol>
<p><em>[Pendiente de firma de la Dirección General]</em></p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'matrix_doc',
    type: 'aspect_matrix',
    title: 'Matriz de Aspectos e Impactos Ambientales',
    content: `<h1>MATRIZ DE SIGNIFICANCIA AMBIENTAL - PETROGLOW (ISO 14001:2026 §6.1.2)</h1>
<table border="1" cellpadding="5" style="border-collapse:collapse; width:100%; font-size:11px;">
  <tr style="background:#f1f5f9;">
    <th>Área</th>
    <th>Aspecto Ambiental</th>
    <th>Impacto Asociado</th>
    <th>Score</th>
    <th>Significativo</th>
  </tr>
  <tr>
    <td>Perforación</td>
    <td>Generación de lodos de base aceite</td>
    <td>Contaminación del suelo con hidrocarburos</td>
    <td>20</td>
    <td>SÍ</td>
  </tr>
  <tr>
    <td>Destilación</td>
    <td>Quema de gas en antorchas (flares)</td>
    <td>Emisión directa de metano y CO2 (Scope 1)</td>
    <td>25</td>
    <td>SÍ</td>
  </tr>
  <tr>
    <td>Oleoducto</td>
    <td>Riesgo de derrame de crudo por corrosión</td>
    <td>Destrucción ecológica de ríos y cuencas</td>
    <td>20</td>
    <td>SÍ</td>
  </tr>
</table>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'legal_doc',
    type: 'legal_matrix',
    title: 'Matriz de Obligaciones de Cumplimiento',
    content: `<h1>COMPENDIO LEGAL DE HIDROCARBUROS (ISO 14001:2026 §6.1.3)</h1>
<table border="1" cellpadding="5" style="border-collapse:collapse; width:100%; font-size:11px;">
  <tr style="background:#f1f5f9;">
    <th>Reglamento</th>
    <th>Área</th>
    <th>Requisito Obligatorio</th>
    <th>Estado</th>
  </tr>
  <tr>
    <td>DS 039 (Contingencias)</td>
    <td>Dirección EHS</td>
    <td>Plan de Contingencias visado para emergencias.</td>
    <td>Incumple (Sin firma oficial)</td>
  </tr>
  <tr>
    <td>LMP Vertimiento</td>
    <td>Oleoducto</td>
    <td>TPH en efluentes < 10 mg/L.</td>
    <td>Incumple (Trazas oleosas)</td>
  </tr>
</table>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'objectives_doc',
    type: 'objectives',
    title: 'Objetivos Ambientales del SGA',
    content: `<h1>OBJETIVOS AMBIENTALES DE PETROGLOW (ISO 14001:2026 §6.2)</h1>
<hr/>
<ul>
  <li><strong>Objetivo 1:</strong> Reducir la quema de gas de antorcha en un 30% mediante recuperación.</li>
  <li><strong>Objetivo 2:</strong> Cero incidentes y volumen de derrames en el oleoducto.</li>
  <li><strong>Objetivo 3:</strong> Tratar y remediar el 90% de suelos contaminados mediante biopilas.</li>
</ul>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'programs_doc',
    type: 'objectives',
    title: 'Programas de Gestión Ambiental (PGA)',
    content: `<h1>PROGRAMA DE INTEGRIDAD Y REMEDIACIÓN EHS</h1>
<p>Proyectos de secador de lodos en pozos, SCADA y biopilas bacterianas de restauración de suelos.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'procedures_doc',
    type: 'procedures',
    title: 'Procedimientos de Control Operacional',
    content: `<h1>PROCEDIMIENTO DE CONTENCIÓN RÁPIDA DE CRUDO (PG-SOP-002)</h1>
<p><strong>Norma:</strong> ISO 14001:2026 §8.1</p>
<hr/>
<p>Instrucciones ante caídas de presión en oleoducto: cierre manual o automático de válvulas ESD, tendido de barreras absorbentes en cursos fluviales y bombeo de crudo hacia cisternas de auxilio.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'emergency_plan_doc',
    type: 'emergency_plan',
    title: 'Plan de Preparación y Respuesta ante Emergencias',
    content: `<h1>PLAN DE RESPUESTA ANTE EXPLOSIÓN O DERRAME DE CRUDO (§8.2)</h1>
<p>Protocolos ante incendios en hornos de destilación o rotura catastrófica de tanques de almacenamiento. Planes de simulacros semestrales de la brigada y hojas MSDS.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'records_doc',
    type: 'procedures',
    title: 'Registro de Evidencias de Capacitación',
    content: `<h1>REGISTRO DE MONITOREO DE DUCTOS Y BRIGADAS</h1>
<p>[Falta registro de entrenamiento práctico en SCADA y brigada HAZMAT].</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'kpis_doc',
    type: 'procedures',
    title: 'Tablero de KPIs y Desempeño GEI',
    content: `<h1>KPIs DE EMISIÓN DE METANO E INTENSIDAD DE DERRAMES</h1>
<p>Métricas de volumen derramado, quema de gas residual, y TPH en vertimiento.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'audit_report_doc',
    type: 'audit_report',
    title: 'Informe de Auditoría Interna',
    content: `<h1>REPORTE DE AUDITORÍA INTERNA DEL SGA - PETROGLOW</h1>
<p><strong>NC Mayor:</strong> Inexistencia de auditoría de integridad periódica del oleoducto.</p>
<p><strong>NC Menor:</strong> Acumulación de lodos base aceite sin techado temporal en plataformas.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'action_plan_doc',
    type: 'action_plan',
    title: 'Plan de Acciones Correctivas',
    content: `<h1>PLANES CORRECTIVOS DE ACCIDENTES Y CUMPLIMIENTO</h1>
<p>Acciones correctivas EHS basadas en análisis de 5 Porqués para el oleoducto y vertimientos.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  }
];

// ==========================================================
// 6. SKYGATE AIRPORT INITIAL DATA
// ==========================================================
export const initialAreasAirport = (): Record<string, CompanyArea> => ({
  dg: {
    id: 'dg',
    name: 'Dirección de Sostenibilidad SkyGate',
    description: 'Gestión estratégica del SGA del aeropuerto. Gobernanza climática y ruido.',
    category: 'admin',
    energyUsage: 2500,
    waterUsage: 60,
    wasteGenerated: 50,
    emissions: 1000,
    riskLevel: 10,
    workersCount: 15,
    trainingProgress: 0,
    aspects: [
      { id: 'dg_dec', name: 'Decisiones sobre ruidos de aeronaves y vuelos nocturnos', impact: 'Conflictos vecinales por contaminación sonora nocturna', severity: 4, probability: 3, significanceScore: 12, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'dg_noise_map', name: 'Mapeo de Ruido e Incentivos Aeronáuticos (NEF)', description: 'Impuesto extra a aerolíneas con motores obsoletos y restrictivas nocturnas.', cost: 20000, active: false, impacts: { risk: -25, compliance: 20 } }
    ]
  },
  runway: {
    id: 'runway',
    name: 'Pistas y Rodaje',
    description: 'Pistas de aterrizaje, despegue y calles de rodaje. Ruido y pluviales plomizos.',
    category: 'ops',
    energyUsage: 14000,
    waterUsage: 3500,
    wasteGenerated: 8500,
    emissions: 36000,
    riskLevel: 80,
    workersCount: 48,
    trainingProgress: 0,
    aspects: [
      { id: 'runway_noise', name: 'Emisión de ruido por operaciones de despegue y aterrizaje', impact: 'Contaminación sonora en zonas urbanas colindantes', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false },
      { id: 'runway_runoff', name: 'Escurrimiento pluvial con caucho y metales pesados en pista', impact: 'Contaminación por escorrentía pluvial en suelo y canales', severity: 3, probability: 5, significanceScore: 15, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'runway_thrust', name: 'Procedimiento de Despegue con Reducción de Empuje (NAD)', description: 'Protocolos de abatimiento de ruido exigidos a aerolíneas.', cost: 11000, active: false, impacts: { risk: -20, compliance: 15 } },
      { id: 'runway_trap', name: 'Desarenadores y Trampas de Hidrocarburos Pluviales', description: 'Filtros pluviales en los colectores perimetrales de la pista.', cost: 18000, active: false, impacts: { water: -30, risk: -10 } }
    ]
  },
  fuel_farm: {
    id: 'fuel_farm',
    name: 'Granja de Combustible (Jet-A1)',
    description: 'Depósitos y tuberías de combustible de aviación. Alto riesgo de fugas.',
    category: 'ops',
    energyUsage: 3800,
    waterUsage: 50,
    wasteGenerated: 450,
    emissions: 1500,
    riskLevel: 85,
    workersCount: 12,
    trainingProgress: 0,
    aspects: [
      { id: 'fuel_spill', name: 'Riesgo de derrame de combustible de aviación Jet-A1', impact: 'Contaminación crítica por hidrocarburos en suelo de rampa', severity: 5, probability: 4, significanceScore: 20, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'fuel_cathodic', name: 'Tuberías con Protección Catódica y Telemetría', description: 'Evita la corrosión del metal enterrado y monitorea fugas.', cost: 30000, active: false, impacts: { risk: -35, compliance: 25 } },
      { id: 'fuel_bunds', name: 'Diques de Concreto del 110% en Granja de Tanques', description: 'Muros de contención secundaria impermeabilizados.', cost: 15000, active: false, impacts: { risk: -20 } }
    ]
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal de Pasajeros',
    description: 'Edificio comercial de pasajeros. Consumo energético y residuos sólidos.',
    category: 'support',
    energyUsage: 28000,
    waterUsage: 8000,
    wasteGenerated: 14000,
    emissions: 8500,
    riskLevel: 55,
    workersCount: 150,
    trainingProgress: 0,
    aspects: [
      { id: 'term_energy', name: 'Consumo eléctrico masivo de iluminación y climatización', impact: 'Huella de carbono indirecta (Scope 2) por draw eléctrico', severity: 3, probability: 5, significanceScore: 15, isSignificant: true, mitigated: false },
      { id: 'term_waste', name: 'Generación de residuos sólidos urbanos por pasajeros', impact: 'Aumento de volumen de residuos enviados al vertedero municipal', severity: 3, probability: 5, significanceScore: 15, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'term_smart_glass', name: 'Fachada Termo-Eficiente de Vidrio Inteligente', description: 'Reduce la necesidad de aire acondicionado en salas de espera.', cost: 32000, active: false, impacts: { energy: -25, emissions: -15 } },
      { id: 'term_smart_bins', name: 'Islas de Reciclaje Inteligentes Automatizadas', description: 'Compactadoras selectivas con sensores para incentivar el reuso.', cost: 14000, active: false, impacts: { waste: -40 } }
    ]
  },
  support_base: {
    id: 'support_base',
    name: 'Base de Apoyo en Rampa (GSE)',
    description: 'Taller de mantenimiento de vehículos de rampa (escaleras, remolcadores).',
    category: 'support',
    energyUsage: 3500,
    waterUsage: 600,
    wasteGenerated: 850,
    emissions: 22000,
    riskLevel: 65,
    workersCount: 28,
    trainingProgress: 0,
    aspects: [
      { id: 'gse_diesel', name: 'Quema de combustibles fósiles en vehículos de rampa GSE', impact: 'Emisiones directas de GEI en operaciones de plataforma (Scope 1)', severity: 4, probability: 5, significanceScore: 20, isSignificant: true, mitigated: false }
    ],
    controls: [
      { id: 'gse_electrification', name: 'Electrificación de Flota de Remolcadores y Escaleras', description: 'Reemplazo de GSE diésel por vehículos 100% eléctricos.', cost: 25000, active: false, impacts: { emissions: -35 } }
    ]
  }
});

export const initialLegalMatrixAirport = () => [
  { id: 'R-AP001', regulation: 'Reglamento de Aviación Civil: Ruido perimetral (ECA Ruido)', area: 'Dirección de Sostenibilidad SkyGate', requirement: 'Elaborar curvas de ruido NEF anuales y no exceder 65 dB en zonas vecinas.', status: 'non_compliant', penalty: 15000 },
  { id: 'R-AP002', regulation: 'Reglamento Nacional de Residuos y Reciclaje de Terminales', area: 'Terminal de Pasajeros', requirement: 'Garantizar la segregación y valorización de al menos 40% de residuos sólidos.', status: 'compliant', penalty: 8000 },
  { id: 'R-AP003', regulation: 'Normas EHS de Hidrocarburos y Aviación Pluvial', area: 'Granja de Combustible (Jet-A1)', requirement: 'Instalar sistemas de control de micro-fugas y protección catódica en tuberías.', status: 'non_compliant', penalty: 18000 },
  { id: 'R-AP004', regulation: 'LMP para Vertimientos de Aguas de Lavado de Aeronaves', area: 'Pistas y Rodaje', requirement: 'Concentración de hidrocarburos y grasas < 15 mg/L antes de la descarga.', status: 'non_compliant', penalty: 12000 }
];

export const initialDocumentsAirport = (): EMSDocument[] => [
  {
    id: 'policy_doc',
    type: 'policy',
    title: 'Política Ambiental de SkyGate Airport',
    content: `<h1>POLÍTICA AMBIENTAL Y CLIMÁTICA - SKYGATE (ISO 14001:2026)</h1>
<p><strong>Código:</strong> SG-POL-001 | <strong>Versión:</strong> 3.0</p>
<hr />
<p>En SkyGate Airport S.A., operador del Aeropuerto Internacional, nos comprometemos a liderar la aviación sostenible integrando el control de impactos bajo la norma ISO 14001:2026:</p>
<ol>
  <li><strong>Mitigación de Ruido y Afectación Vecinal:</strong> Monitorear y establecer restricciones nocturnas para aeronaves ruidosas (§3.2.3).</li>
  <li><strong>Protección del Suelo y Agua Pluvial:</strong> Prevenir efluentes oleosos mediante desarenadores y contención de Jet-A1.</li>
  <li><strong>Carbono Neutralidad de Rampa:</strong> Reducir el consumo eléctrico del terminal (Scope 2) y electrificar la flota GSE (Scope 1). Colaborar en Scope 3 con las aerolíneas (§4.1/4.2).</li>
  <li><strong>Economía Circular:</strong> Valorizar los residuos de los pasajeros mediante segregación en terminal.</li>
</ol>
<p><em>[Pendiente de firma de la Dirección General]</em></p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'matrix_doc',
    type: 'aspect_matrix',
    title: 'Matriz de Aspectos e Impactos Ambientales',
    content: `<h1>MATRIZ DE SIGNIFICANCIA AMBIENTAL - SKYGATE (ISO 14001:2026 §6.1.2)</h1>
<table border="1" cellpadding="5" style="border-collapse:collapse; width:100%; font-size:11px;">
  <tr style="background:#f1f5f9;">
    <th>Área</th>
    <th>Aspecto Ambiental</th>
    <th>Impacto Asociado</th>
    <th>Score</th>
    <th>Significativo</th>
  </tr>
  <tr>
    <td>Pistas</td>
    <td>Emisión de ruido de aviones</td>
    <td>Contaminación sonora en vecindarios urbanos</td>
    <td>20</td>
    <td>SÍ</td>
  </tr>
  <tr>
    <td>Plataforma</td>
    <td>Riesgo de derrames de Jet-A1</td>
    <td>Contaminación química en pistas y suelo pluvial</td>
    <td>20</td>
    <td>SÍ</td>
  </tr>
  <tr>
    <td>Rampa (GSE)</td>
    <td>Combustión de camiones y remolcadores diésel</td>
    <td>Emisión Scope 1 de GEI en plataforma</td>
    <td>20</td>
    <td>SÍ</td>
  </tr>
</table>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'legal_doc',
    type: 'legal_matrix',
    title: 'Matriz de Obligaciones de Cumplimiento',
    content: `<h1>COMPENDIO LEGAL AEROPORTUARIO (ISO 14001:2026 §6.1.3)</h1>
<table border="1" cellpadding="5" style="border-collapse:collapse; width:100%; font-size:11px;">
  <tr style="background:#f1f5f9;">
    <th>Norma</th>
    <th>Área</th>
    <th>Requisito Específico</th>
    <th>Estado</th>
  </tr>
  <tr>
    <td>ECA Ruido Civil</td>
    <td>Dirección</td>
    <td>Curvas acústicas NEF anuales y monitoreo.</td>
    <td>Incumple (Sin informe consolidado)</td>
  </tr>
  <tr>
    <td>Reglamento Hidrantes</td>
    <td>Plataforma</td>
    <td>Protección catódica e integridad de hidrantes.</td>
    <td>Incumple (Tubería expuesta a corrosión)</td>
  </tr>
</table>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'objectives_doc',
    type: 'objectives',
    title: 'Objetivos Ambientales del SGA',
    content: `<h1>OBJETIVOS AMBIENTALES DE SKYGATE (ISO 14001:2026 §6.2)</h1>
<hr/>
<ul>
  <li><strong>Objetivo 1:</strong> Lograr la neutralidad climática en Scope 1 y 2 en operaciones terrestres para 2028.</li>
  <li><strong>Objetivo 2:</strong> Implementar desarenadores y trampas de combustible en el 100% de canales de pista.</li>
  <li><strong>Objetivo 3:</strong> Valorizar el 50% de los residuos generados en el Terminal de Pasajeros.</li>
</ul>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'programs_doc',
    type: 'objectives',
    title: 'Programas de Gestión Ambiental (PGA)',
    content: `<h1>PROGRAMA DE REDUCCIÓN DE RUIDO Y DESCARBONIZACIÓN</h1>
<p>Proyectos de electrificación de rampa (GSE), colectores pluviales con trampas, y fachadas low-E en terminal.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'procedures_doc',
    type: 'procedures',
    title: 'Procedimientos de Control Operacional',
    content: `<h1>PROCEDIMIENTO DE SEGURIDAD EN REPOSTAJE Y FUGAS (SG-SOP-004)</h1>
<p><strong>Norma:</strong> ISO 14001:2026 §8.1</p>
<hr/>
<p>Instrucciones de recarga de Jet-A1: acople estricto de hidrantes de rampa, monitoreo de presión diferencial, y prohibición de repostaje con alarmas pluviales activadas.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'emergency_plan_doc',
    type: 'emergency_plan',
    title: 'Plan de Preparación y Respuesta ante Emergencias',
    content: `<h1>PLAN DE CONTINGENCIA ANTE DERRAMES MAYORES DE JET-A1</h1>
<p>Protocolos ante incendios en rampa o roturas en hidrantes de aviación. Simulacros y comunicación externa con bomberos aeroportuarios.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'records_doc',
    type: 'procedures',
    title: 'Registro de Evidencias de Capacitación',
    content: `<h1>REGISTRO DE MONITOREO DE RUIDO EN TIEMPO REAL</h1>
<p>[Falta registro de capacitación de oficiales de rampa en control de ruido perimetral].</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'kpis_doc',
    type: 'procedures',
    title: 'Tablero de KPIs y Desempeño GEI',
    content: `<h1>KPIs DE CARBONO Y TRÁFICO AEROPORTUARIO</h1>
<p>Métricas de consumo eléctrico de terminal, emisiones de vehículos GSE, y volumen de residuos urbanos reciclados.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'audit_report_doc',
    type: 'audit_report',
    title: 'Informe de Auditoría Interna',
    content: `<h1>REPORTE DE AUDITORÍA INTERNA DEL SGA - SKYGATE</h1>
<p><strong>NC Mayor:</strong> Inexistencia de curvas acústicas NEF del último año fiscalizado.</p>
<p><strong>NC Menor:</strong> Cajas de residuos en terminal mezcladas sin recojo automatizado.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  },
  {
    id: 'action_plan_doc',
    type: 'action_plan',
    title: 'Plan de Acciones Correctivas',
    content: `<h1>ACCIONES CORRECTIVAS DE AUDITORÍA AEROPORTUARIA</h1>
<p>Plan de cierres basados en análisis de 5 Porqués para ruidos y control pluvial de rampa.</p>`,
    status: 'draft',
    lastUpdated: getTodayDate()
  }
];
