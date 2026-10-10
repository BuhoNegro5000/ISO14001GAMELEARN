import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { 
  CheckCircle2, ShieldAlert, Check, BookOpen,
  Users, Award, FileText, AlertCircle
} from 'lucide-react';

// Clause 6.3 Change Management (ISO 14001:2026)
export interface ChangeStep {
  id: string;
  title: string;
  desc: string;
  order: number;
}

export const getInitialChangeSteps = (companyId: 'metal' | 'chem' | 'power' | 'mine' | 'oil' | 'airport'): ChangeStep[] => {
  const steps: ChangeStep[] = [
    {
      id: 'aspects',
      title: "1. Aspectos y Riesgos (§6.1.2)",
      order: 1,
      desc: companyId === 'metal' 
        ? "Identificar el incremento de ruido (nueva prensa 500T) y consumos eléctricos." 
        : companyId === 'chem'
          ? "Evaluar riesgos de fugas térmicas, emisiones de COVs y derrames del reactor R-302."
          : companyId === 'power'
            ? "Determinar la huella de carbono Scope 1 (vapor de caldera) y riesgo de inflamabilidad del metanol."
            : companyId === 'mine'
              ? "Identificar el incremento de drenaje ácido de roca (DAR) por la nueva galería e impactos de cianuración."
              : companyId === 'oil'
                ? "Evaluar riesgos de corrosión en el oleoducto troncal y fugas en bridas por presión."
                : "Identificar la curva de ruido NEF por nuevos vuelos nocturnos y escorrentía en rampa."
    },
    {
      id: 'legal',
      title: "2. Requisitos Legales (§6.1.3)",
      order: 2,
      desc: companyId === 'metal'
        ? "Tramitar la ampliación de la licencia municipal y reportar el aumento de consumo eléctrico."
        : companyId === 'chem'
          ? "Obtener autorización para almacenamiento de sustancias fiscalizadas y actualizar FDS."
          : companyId === 'power'
            ? "Declarar la ampliación de capacidad de refinación ante el Ministerio de Energía y Minas."
            : companyId === 'mine'
              ? "Tramitar el permiso de vertimiento minero y actualizar la licencia ambiental ante el Ministerio."
              : companyId === 'oil'
                ? "Actualizar el reporte anual de emisiones y registrar la fosa ante las entidades supervisoras."
                : "Tramitar la adenda del Estudio de Impacto Ambiental (EIA) por ampliación de pista."
    },
    {
      id: 'controls',
      title: "3. Controles Operativos (§8.1)",
      order: 3,
      desc: companyId === 'metal'
        ? "Instalar cabina insonorizada para la prensa y trampa de lodos de fosfatizado."
        : companyId === 'chem'
          ? "Instalar un lavador de gases de doble etapa (scrubber) y cubetos de retención anticorrosión."
          : companyId === 'power'
            ? "Implementar sensores de vapores explosivos y sistema de recuperación de glicerina."
            : companyId === 'mine'
              ? "Implementar geomembrana HDPE en pad de lixiviación e instalar piezómetros perimetrales."
              : companyId === 'oil'
                ? "Instalar telemetría SCADA inteligente y centinelas térmicos automáticos de presión."
                : "Construir desarenadores y trampas de grasas pluviales e instalar sonómetros."
    },
    {
      id: 'training',
      title: "4. Capacitación (§7.2)",
      order: 4,
      desc: companyId === 'metal'
        ? "Entrenar a operarios en el uso de EPP auditivo y segregación de lodos de fosfatizado."
        : companyId === 'chem'
          ? "Capacitar en el protocolo HAZMAT, contención de derrames y neutralización de gases."
          : companyId === 'power'
            ? "Entrenar en seguridad de procesos de alta presión y combate de incendios de alcoholes."
            : companyId === 'mine'
              ? "Capacitar a los mineros en seguridad química de cianuro de sodio y planes sociales."
              : companyId === 'oil'
                ? "Capacitar al personal de rampa en control de derrames fluviales con barreras flotantes."
                : "Capacitar en uso de descongelantes y restricción de empuje de motores (NAD)."
    },
    {
      id: 'documents',
      title: "5. Información Documentada (§7.5)",
      order: 5,
      desc: companyId === 'metal'
        ? "Registrar la nueva prensa en el inventario de activos y actualizar la matriz legal del SGA."
        : companyId === 'chem'
          ? "Actualizar el plan de contingencias químicas y registrar el nuevo reactor R-302 en el SGA."
          : companyId === 'power'
            ? "Actualizar diagramas de flujo de procesos (PFD) e inventario corporativo de gases GEI."
            : companyId === 'mine'
              ? "Actualizar la matriz de significancia ambiental minera e informar cambios del plan de cierre."
              : companyId === 'oil'
                ? "Registrar los nuevos tramos de oleoducto en la matriz de aspectos y el Plan de Contingencias."
                : "Actualizar las curvas de ruido en el gestor documental e inventariar Scope 3."
    }
  ];
  return [steps[0], steps[1], steps[2], steps[3], steps[4]].map((step, index) => ({
    ...step,
    order: index + 1
  }));
};

export default function IsoModules() {
  const store = useGameStore();
  const { 
    currentCompanyId, climateRelevanceDetermined, updateClimateImpact, scopeStatement, setScopeStatement,
    assignRole, documents, awarenessScore, conductTraining, incidents, 
    rolesAssigned, investigateIncident, budget, xp, level
  } = store;

  const [activeTab, setActiveTab] = useState<number>(4); // Clauses 4 to 10

  // ==========================================
  // CLAUSE 4 LAB STATE
  // ==========================================
  const [cl4Step, setCl4Step] = useState(1);
  const [cl4PestelClass, setCl4PestelClass] = useState<Record<string, string>>({
    f1: '', f2: '', f3: '', f4: '', f5: '', f6: ''
  });
  const [cl4SwotClass, setCl4SwotClass] = useState<Record<string, string>>({
    f1: '', f2: '', f3: '', f4: '', f5: '', f6: ''
  });
  const [cl4Feedback, setCl4Feedback] = useState<string | null>(null);
  const [cl4Success, setCl4Success] = useState(false);
  const [cl4ClimateDecision, setCl4ClimateDecision] = useState<number | null>(() => climateRelevanceDetermined ? 2 : null);
  const [cl4ClimateFeedback, setCl4ClimateFeedback] = useState<string | null>(() => climateRelevanceDetermined ? "Cargado del SGA activo." : null);
  const [cl4ScopeSelection, setCl4ScopeSelection] = useState<Record<string, boolean>>({
    prod: false,
    alm: false,
    log: false,
    pt: false
  });
  const [cl4ScopeSaved, setCl4ScopeSaved] = useState(() => !!scopeStatement);

  const cl4Factors = [
    { id: 'f1', text: "Aumento de lluvias torrenciales e inundaciones perimetrales", correctPestel: "environmental", correctSwot: "threats" },
    { id: 'f2', text: "Exigencia de clientes premium de reportar huella de carbono Scope 1/2/3", correctPestel: "social", correctSwot: "opportunities" },
    { id: 'f3', text: "Subsidios gubernamentales para transición a paneles solares y eficiencia", correctPestel: "political", correctSwot: "opportunities" },
    { id: 'f4', text: "Maquinaria de producción obsoleta con picos de consumo eléctrico", correctPestel: "technological", correctSwot: "weaknesses" },
    { id: 'f5', text: "Personal técnico con experiencia en optimización y EHS", correctPestel: "social", correctSwot: "strengths" },
    { id: 'f6', text: "Multas regulatorias severas por exceder LMP de efluentes", correctPestel: "legal", correctSwot: "threats" }
  ];

  const handleVerifyCl4Step1 = () => {
    let errors = 0;
    cl4Factors.forEach(f => {
      if (cl4PestelClass[f.id] !== f.correctPestel || cl4SwotClass[f.id] !== f.correctSwot) {
        errors++;
      }
    });

    if (errors === 0) {
      setCl4Feedback("¡Excelente! Has clasificado todos los factores del entorno correctamente. Comprendes cómo los elementos FODA y PESTEL configuran el contexto organizacional.");
      setCl4Success(true);
      store.triggerEvent({ type: 'success', message: '🏆 CLÁUSULA 4.1: FODA/PESTEL Completado con éxito. (+100 XP)' });
      useGameStore.setState({ xp: xp + 100 });
    } else {
      setCl4Feedback(`Tienes desvíos en la clasificación. Revisa los conceptos: recuerda que las multas son Legales/Amenazas, las lluvias extremas son Ambientales/Amenazas y la maquinaria es Tecnológica/Debilidad.`);
    }
  };

  const handleVerifyCl4Step2 = (decision: number) => {
    setCl4ClimateDecision(decision);
    if (decision === 2) {
      setCl4ClimateFeedback("¡Excelente decisión! Declarar formalmente el estrés hídrico y las inundaciones como factores del contexto cumple estrictamente con los requisitos integrados de Cambio Climático en la norma ISO 14001:2026. Habilitas la gestión integrada de riesgos.");
      updateClimateImpact(
        "Riesgos físicos por inundaciones torrenciales en el Patio de Residuos y estrés hídrico para la captación de agua fresca en calderas.",
        "Los clientes exigen trazabilidad del Scope 1, 2 y 3. El regulador fiscaliza vertimientos efluentes bajo estándares estrictos."
      );
      store.triggerEvent({ type: 'success', message: '🌱 CLÁUSULA 4.2: Evaluación de Acción Climática Aprobada. (+100 XP)' });
      useGameStore.setState({ xp: xp + 100 });
    } else {
      setCl4ClimateFeedback("Error de cumplimiento. La norma ISO 14001:2026 exige determinar de manera obligatoria la relevancia de los riesgos del cambio climático en el contexto organizacional (§4.1/4.2). Ignorarlo resultará en una No Conformidad Mayor del auditor.");
    }
  };

  const handleSaveCl4Scope = () => {
    const selectedText = Object.entries(cl4ScopeSelection)
      .filter(([, checked]) => checked)
      .map(([key]) => {
        if (key === 'prod') return 'Procesos de producción (Prensas de extrusión)';
        if (key === 'alm') return 'Almacenamiento y trasvase de sustancias químicas';
        if (key === 'log') return 'Logística y distribución final';
        return 'Planta de tratamiento de efluentes líquidos';
      }).join(', ');

    if (!selectedText) {
      alert("Por favor selecciona al menos un área para declarar el alcance.");
      return;
    }

    const finalStatement = `El Sistema de Gestión Ambiental de EnviroPro comprende: ${selectedText}, considerando un enfoque de ciclo de vida en la planta industrial central.`;
    setScopeStatement(finalStatement);
    setCl4ScopeSaved(true);
    store.triggerEvent({ type: 'success', message: '📄 CLÁUSULA 4.3: Alcance del SGA establecido. (+100 XP)' });
    useGameStore.setState({ xp: xp + 100 });
  };

  // ==========================================
  // CLAUSE 5 LAB STATE
  // ==========================================
  const [cl5Step, setCl5Step] = useState(1);
  const [cl5PolicyCommitments, setCl5PolicyCommitments] = useState<Record<string, boolean>>({
    prev: false, leg: false, improve: false, profit: false, climate: false
  });
  const [cl5PolicyFeedback, setCl5PolicyFeedback] = useState<string | null>(null);
  const [cl5PolicySuccess, setCl5PolicySuccess] = useState(() => {
    const policyDoc = documents.find(d => d.type === 'policy');
    return !!(policyDoc && policyDoc.status === 'approved_ceo');
  });
  const [cl5Roles, setCl5Roles] = useState<Record<string, string>>(() => {
    const hasRoles = rolesAssigned && rolesAssigned[0] && rolesAssigned[0].person;
    return {
      rep: hasRoles ? "maria" : "",
      ops: hasRoles ? "juan" : "",
      emerg: hasRoles ? "carlos" : ""
    };
  });
  const [cl5RolesFeedback, setCl5RolesFeedback] = useState<string | null>(null);
  const [cl5RolesSuccess, setCl5RolesSuccess] = useState(() => {
    return !!(rolesAssigned && rolesAssigned[0] && rolesAssigned[0].person);
  });

  const handleVerifyPolicy = () => {
    const { prev, leg, improve, profit, climate } = cl5PolicyCommitments;
    
    if (profit) {
      setCl5PolicyFeedback("Rechazado por Dirección. La política ambiental no debe incluir metas corporativas puramente comerciales (como maximizar utilidades). Debe centrarse en el desempeño sustentable.");
      return;
    }

    if (prev && leg && improve && climate) {
      setCl5PolicyFeedback("¡Felicidades! La Política Ambiental cumple con los 4 compromisos obligatorios de ISO 14001 y la Enmienda Climática. Está lista para la firma del CEO.");
      setCl5PolicySuccess(true);
      // Actualizar el documento de política en el store a signed
      const policyDoc = documents.find(d => d.type === 'policy');
      if (policyDoc) {
        store.updateDocument(policyDoc.id, policyDoc.content, 'approved_ceo');
      }
      store.triggerEvent({ type: 'success', message: '✍️ CLÁUSULA 5.2: Política redactada y aprobada por CEO. (+100 XP)' });
      useGameStore.setState({ xp: xp + 100 });
    } else {
      setCl5PolicyFeedback("Faltan compromisos obligatorios. Asegúrate de incluir: Prevención de la contaminación, Cumplimiento legal, Mejora continua y Acción Climática.");
    }
  };

  const handleVerifyRoles = () => {
    const { rep, ops, emerg } = cl5Roles;
    if (rep === 'maria' && ops === 'juan' && emerg === 'carlos') {
      setCl5RolesFeedback("¡Excelente asignación! Has mapeado las competencias de tu equipo con los roles críticos requeridos para el control operativo y de auditoría interna.");
      setCl5RolesSuccess(true);
      assignRole(0, "Ing. Maria Rojas");
      assignRole(1, "Ing. Juan Perez");
      assignRole(2, "Carlos Gomez");
      store.triggerEvent({ type: 'success', message: '👥 CLÁUSULA 5.3: Organigrama de roles consolidado. (+100 XP)' });
      useGameStore.setState({ xp: xp + 100 });
    } else {
      setCl5RolesFeedback("Revisa la asignación de perfiles: María tiene experiencia en auditoría, Juan en procesos químicos de planta y Carlos en MSDS y emergencias químicas en almacén.");
    }
  };

  // ==========================================
  // CLAUSE 6 LAB STATE
  // ==========================================
  const [cl6Scenario, setCl6Scenario] = useState(() => {
    const matrixDoc = documents.find(d => d.type === 'aspect_matrix');
    return (matrixDoc && matrixDoc.status === 'signed') ? 4 : 1;
  });
  const [cl6Aspect, setCl6Aspect] = useState('');
  const [cl6Impact, setCl6Impact] = useState('');
  const [cl6Severity, setCl6Severity] = useState(3);
  const [cl6Probability, setCl6Probability] = useState(3);
  const [cl6Feedback, setCl6Feedback] = useState<string | null>(null);
  const [cl6AwaitingNext, setCl6AwaitingNext] = useState(false);
  const [cl6SuccessCount, setCl6SuccessCount] = useState(() => {
    const matrixDoc = documents.find(d => d.type === 'aspect_matrix');
    return (matrixDoc && matrixDoc.status === 'signed') ? 3 : 0;
  });

  const [changeSteps, setChangeSteps] = useState<ChangeStep[]>(() => {
    return getInitialChangeSteps(store.currentCompanyId);
  });
  const [changeFeedback, setChangeFeedback] = useState<string | null>(null);
  const [changeSuccess, setChangeSuccess] = useState(() => {
    return store.changeManagementCompleted || false;
  });

  const aspectScenarios = {
    metal: [
      {
        scenario: 1,
        title: "Producción (Prensas de metal)",
        desc: "La maquinaria pesada de prensado opera en 3 turnos continuos generando consumos eléctricos elevados de hasta 43,200 kWh mensuales.",
        aspect: "energy",
        aspectLabel: "Consumo de energía eléctrica",
        impact: "depletion",
        impactLabel: "Agotamiento de recursos y emisiones de CO2"
      },
      {
        scenario: 2,
        title: "Almacén de Reactivos Químicos",
        desc: "Se almacenan bidones de solventes y aceites sobre suelos de cemento sin diques de contención, con riesgo latente de quiebre y derrames.",
        aspect: "spill",
        aspectLabel: "Riesgo de derrames de lubricantes y solventes",
        impact: "soil",
        impactLabel: "Contaminación de suelos y acuíferos locales"
      },
      {
        scenario: 3,
        title: "Planta de Tratamiento de Efluentes",
        desc: "Las descargas de vertimientos hídricos directos al río perimetral transportan sedimentos y metales pesados en suspensión por encima del LMP.",
        aspect: "effluent",
        aspectLabel: "Descargas líquidas industriales con sedimentos",
        impact: "water",
        impactLabel: "Alteración de flora y fauna en río (eutrofización)"
      }
    ],
    chem: [
      {
        scenario: 1,
        title: "Reactores de Síntesis (Química)",
        desc: "La reacción química a alta temperatura libera vapores ácidos y Compuestos Orgánicos Volátiles (COV) a través de bridas sin mantenimiento.",
        aspect: "emissions_voc",
        aspectLabel: "Emisiones de vapores y compuestos orgánicos volátiles (COV)",
        impact: "air_pollution",
        impactLabel: "Deterioro de la calidad del aire y afectación a la salud"
      },
      {
        scenario: 2,
        title: "Almacén de Sustancias Críticas",
        desc: "Sustancias químicas altamente concentradas e insumos reactivos se almacenan con cubetos de retención de capacidad insuficiente.",
        aspect: "spill_hazmat",
        aspectLabel: "Riesgo de derrames de reactivos peligrosos",
        impact: "groundwater_pollution",
        impactLabel: "Contaminación por infiltración en el acuífero subterráneo"
      },
      {
        scenario: 3,
        title: "Logística de Cargas Peligrosas",
        desc: "Los camiones cisterna transportan agroquímicos terminados a granel por carreteras adyacentes a una reserva ecológica protegida sin plan de contingencia.",
        aspect: "accident_spill",
        aspectLabel: "Riesgo de accidentes y derrames en ruta de transporte",
        impact: "biodiversity_loss",
        impactLabel: "Pérdida crítica de biodiversidad y muerte de especies en la reserva"
      }
    ],
    power: [
      {
        scenario: 1,
        title: "Caldera de Vapor (Refinería)",
        desc: "La caldera consume grandes volúmenes de combustibles fósiles para generar el vapor necesario para las torres de destilación de biodiésel.",
        aspect: "fossil_fuel",
        aspectLabel: "Consumo de combustibles fósiles para calefacción industrial",
        impact: "greenhouse_gases",
        impactLabel: "Emisión directa de gases de efecto invernadero (Scope 1 CO2)"
      },
      {
        scenario: 2,
        title: "Control de Proveedores Agrícolas",
        desc: "Se adquiere materia prima (aceite de soya) de intermediarios que no certifican el origen libre de deforestación de sus tierras de cultivo.",
        aspect: "deforested_sourcing",
        aspectLabel: "Adquisición de insumos de zonas con deforestación no regulada",
        impact: "forest_loss",
        impactLabel: "Deforestación inducida en la cadena de suministro indirecta"
      },
      {
        scenario: 3,
        title: "Sistema de Reuso y Descarga Cero",
        desc: "La planta de reciclaje de agua recircula el 95% del efluente, pero acumula sales pesadas y calor residual en las purgas que se vierten al suelo del predio.",
        aspect: "saline_effluent",
        aspectLabel: "Vertido de purgas salinas de alta temperatura en terreno propio",
        impact: "soil_salinization",
        impactLabel: "Salinización del suelo y pérdida permanente de aptitud agrícola"
      }
    ],
    mine: [
      {
        scenario: 1,
        title: "Tajo Abierto y Voladura (Minería)",
        desc: "Las voladuras de roca para la extracción de mineral liberan material particulado PM10 y PM2.5 a gran distancia, afectando poblaciones vecinas.",
        aspect: "dust",
        aspectLabel: "Generación de material particulado por voladuras",
        impact: "air_quality",
        impactLabel: "Deterioro de la calidad del aire y problemas respiratorios en vecinos"
      },
      {
        scenario: 2,
        title: "Pad de Lixiviación (Uso de Cianuro)",
        desc: "Se irriga el mineral apilado con solución cianurada a pH 10.5. Si la geomembrana de HDPE se fisura, el cianuro se infiltra en las aguas subterráneas.",
        aspect: "cyanide",
        aspectLabel: "Uso y escurrimiento de solución de cianuro de sodio",
        impact: "aquifer",
        impactLabel: "Contaminación crítica y envenenamiento de acuíferos subterráneos"
      },
      {
        scenario: 3,
        title: "Presa de Relaves (DAR)",
        desc: "Los lodos metalúrgicos con sulfuros se depositan en la presa expuestos al oxígeno y agua de lluvia, iniciando la generación de drenaje ácido de roca.",
        aspect: "acid_drainage",
        aspectLabel: "Generación de drenaje ácido de roca (DAR) con metales pesados",
        impact: "watercourse",
        impactLabel: "Acidificación extrema y destrucción de vida acuática en la cuenca"
      }
    ],
    oil: [
      {
        scenario: 1,
        title: "Plataforma de Pozos (Derrames de Crudo)",
        desc: "El cabezal del pozo extractor terrestre presenta un acople deteriorado por vibración, generando goteo de crudo sobre suelo orgánico sin bandeja.",
        aspect: "crude_spill",
        aspectLabel: "Riesgo de fugas y derrames de petróleo crudo en boca de pozo",
        impact: "soil_degradation",
        impactLabel: "Contaminación e infertilidad permanente del suelo por hidrocarburos"
      },
      {
        scenario: 2,
        title: "Unidad de Destilación (Flaring)",
        desc: "La planta quema gas natural asociado al petróleo crudo de forma rutinaria a través de la antorcha por falta de un compresor de recuperación.",
        aspect: "flaring",
        aspectLabel: "Quema rutinaria de gas en antorcha (flaring)",
        impact: "greenhouse_gases",
        impactLabel: "Emisiones masivas de CO2 y metano (Scope 1) al Cambio Climático"
      },
      {
        scenario: 3,
        title: "Terminal y Oleoducto (Corrosión)",
        desc: "El oleoducto troncal que cruza el río local no tiene protección catódica y el metal muestra corrosión exterior con riesgo de rotura inminente.",
        aspect: "pipe_rupture",
        aspectLabel: "Riesgo de rotura de oleoducto por fatiga o corrosión",
        impact: "water_pollution",
        impactLabel: "Marea negra localizada y colapso de captación de agua para la ciudad"
      }
    ],
    airport: [
      {
        scenario: 1,
        title: "Pistas y Rodaje (Ruido Acústico)",
        desc: "El aterrizaje y despegue de aeronaves comerciales durante el turno nocturno sobrepasa los estándares de calidad ambiental (ECA) de ruido perimetral.",
        aspect: "noise",
        aspectLabel: "Emisión de ondas acústicas por turbinas de aeronaves",
        impact: "noise_pollution",
        impactLabel: "Afectación de la salud auditiva y disturbios de sueño en poblaciones colindantes"
      },
      {
        scenario: 2,
        title: "Plataforma de Aeronaves (De-icing fluid)",
        desc: "El descongelamiento de alas en rampa durante el invierno genera un escurrimiento químico de propilenglicol que ingresa directo a los canales de lluvia.",
        aspect: "deicing",
        aspectLabel: "Vertido de líquido descongelante químico en rampa",
        impact: "stormwater_contamination",
        impactLabel: "Contaminación química de colectores de tormenta y humedales locales"
      },
      {
        scenario: 3,
        title: "Terminal de Pasajeros (Emisiones indirectas)",
        desc: "El sistema de iluminación y climatización de la terminal comercial requiere un flujo constante de electricidad de la red nacional termoeléctrica.",
        aspect: "electricity",
        aspectLabel: "Consumo eléctrico masivo de iluminación y HVAC",
        impact: "scope2_emissions",
        impactLabel: "Emisiones indirectas de CO2 (Scope 2) por generación de red"
      }
    ]
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === changeSteps.length - 1) return;
    
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...changeSteps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setChangeSteps(updated);
  };

  const handleVerifyChangeManagement = () => {
    const isCorrect = changeSteps.every((step, index) => step.order === index + 1);
    
    if (isCorrect) {
      setChangeFeedback("¡Excelente! Has planificado el cambio de manera impecable siguiendo la secuencia preventiva y sistemática exigida por la Cláusula 6.3 de ISO 14001:2026. Al definir primero los aspectos (1) y requisitos legales (2), garantizas que los controles (3), el entrenamiento (4) y la documentación (5) estén alinear antes del arranque. ¡SGA Protegido!");
      setChangeSuccess(true);
      store.completeChangeManagement();
    } else {
      let firstMistakeIndex = -1;
      for (let i = 0; i < changeSteps.length; i++) {
        if (changeSteps[i].order !== i + 1) {
          firstMistakeIndex = i;
          break;
        }
      }
      
      let helperText = "";
      if (firstMistakeIndex === 0) {
        helperText = "El primer paso siempre debe ser identificar los Aspectos y Riesgos (§6.1.2) del cambio. No podemos planificar nada sin saber qué impacto generará.";
      } else if (changeSteps[firstMistakeIndex].order === 3 && firstMistakeIndex < 2) {
         helperText = "No puedes definir los Controles Operativos (§8.1) antes de revisar si existen Requisitos Legales (§6.1.3) aplicables que debas cumplir por norma.";
      } else if (changeSteps[firstMistakeIndex].order === 4 && firstMistakeIndex < 3) {
         helperText = "No puedes capacitar al personal (§7.2) sobre controles que aún no has diseñado o instalado (§8.1). Primero diseña los controles.";
      } else if (changeSteps[firstMistakeIndex].order === 5 && firstMistakeIndex < 4) {
         helperText = "La actualización de la información documentada (§7.5) es el paso de cierre que consolida el cambio una vez definidos los aspectos, leyes, controles y capacitaciones.";
      } else {
        helperText = "Revisa la jerarquía lógica de prevención: Identificación (1) -> Cumplimiento Legal (2) -> Controles Técnicos (3) -> Capacitación (4) -> Registro Documental (5).";
      }
      
      setChangeFeedback(`Orden incorrecto en el Paso ${firstMistakeIndex + 1}. ${helperText}`);
    }
  };



  const handleVerifyAspectLab = () => {
    const companyScenarios = aspectScenarios[currentCompanyId as keyof typeof aspectScenarios];
    const currentScenario = companyScenarios[cl6Scenario - 1];
    
    const isCorrect = cl6Aspect === currentScenario.aspect && cl6Impact === currentScenario.impact;

    if (isCorrect) {
      const score = cl6Severity * cl6Probability;
      const isSignificant = score >= 12;
      
      setCl6Feedback(`¡Correcto! Aspecto e Impacto asociados correctamente. Puntaje de significancia: ${score} (${isSignificant ? 'SIGNIFICATIVO' : 'NO SIGNIFICATIVO'}).`);
      setCl6SuccessCount(prev => prev + 1);

      if (cl6Scenario < 3) {
        setCl6AwaitingNext(true);
      } else {
        const companyName = currentCompanyId === 'metal' ? 'EnviroPro' : 
                            currentCompanyId === 'chem' ? 'BioChem' : 
                            currentCompanyId === 'power' ? 'EcoPower' :
                            currentCompanyId === 'mine' ? 'MineGold' :
                            currentCompanyId === 'oil' ? 'PetroGlow' : 'SkyGate';
        store.triggerEvent({ type: 'success', message: `📊 CLÁUSULA 6.1.2: Matriz de Aspectos e Impactos completada para ${companyName}. (+150 XP)` });
        useGameStore.setState({ xp: xp + 150 });
        const matrixDoc = documents.find(d => d.type === 'aspect_matrix');
        if (matrixDoc) {
          store.updateDocument(matrixDoc.id, matrixDoc.content, 'signed');
        }
        
        // La transición queda bajo control del jugador para conservar el feedback y permitir revisar el razonamiento.
        setCl6AwaitingNext(true);
      }
    } else {
      setCl6Feedback("Revisa el mapeo. El Aspecto es la causa operativa y el Impacto es el cambio real en el medio ambiente.");
    }
  };

  // ==========================================
  // CLAUSE 7 LAB STATE
  // ==========================================
  const [cl7Training, setCl7Training] = useState<Record<string, string>>({
    patio: '', maint: '', lab: ''
  });
  const [cl7Feedback, setCl7Feedback] = useState<string | null>(null);
  const [cl7Success, setCl7Success] = useState(() => awarenessScore >= 100);
  const [cl7QuizAnswer, setCl7QuizAnswer] = useState<number | null>(null);
  const [cl7QuizChecked, setCl7QuizChecked] = useState(false);

  const handleVerifyCl7Step1 = () => {
    if (cl7Training.patio === 'segregation' && cl7Training.maint === 'spill' && cl7Training.lab === 'neutralization') {
      if (budget < 5000) {
        setCl7Feedback("Presupuesto insuficiente para lanzar el taller ($5,000 requerido).");
        return;
      }
      setCl7Feedback("¡Competencias validadas! Los temas han sido asignados correctamente a las áreas críticas. Lanzando taller...");
      setCl7Success(true);
      conductTraining(5000);
      store.triggerEvent({ type: 'success', message: '🎓 CLÁUSULA 7.2: Talleres de concientización aprobados. (+150 XP)' });
      useGameStore.setState({ xp: xp + 150 });
    } else {
      setCl7Feedback("Mapeo incorrecto. Revisa qué tipo de adiestramiento técnico requiere cada operador según su labor.");
    }
  };

  const handleVerifyCl7Step2 = (answer: number) => {
    setCl7QuizAnswer(answer);
    setCl7QuizChecked(true);
    if (answer === 1) {
      store.triggerEvent({ type: 'success', message: '🗣️ CLÁUSULA 7.3: Respuesta de concientización correcta en auditoría. (+100 XP)' });
      useGameStore.setState({ xp: xp + 100 });
    }
  };

  // ==========================================
  // CLAUSE 8 LAB STATE
  // ==========================================
  const [cl8Step, setCl8Step] = useState(1);
  const [cl8Hierarchy, setCl8Hierarchy] = useState<Record<string, string>>({
    substitute: '', engineering: '', admin: '', epp: ''
  });
  const [cl8HierarchyFeedback, setCl8HierarchyFeedback] = useState<string | null>(null);
  const [cl8HierarchySuccess, setCl8HierarchySuccess] = useState(false);
  const [cl8DrillStep, setCl8DrillStep] = useState(1);
  const [cl8DrillFail, setCl8DrillFail] = useState(false);
  const [cl8DrillFeedback, setCl8DrillFeedback] = useState<string | null>(null);
  const [cl8DrillSuccess, setCl8DrillSuccess] = useState(false);

  const handleVerifyHierarchy = () => {
    const { substitute, engineering, admin, epp } = cl8Hierarchy;
    if (substitute === 'bio' && engineering === 'bund' && admin === 'sop' && epp === 'gloves') {
      setCl8HierarchyFeedback("¡Excelente! Comprendes el orden de la Jerarquía de Controles, priorizando mitigar los riesgos en su origen antes de depender de elementos de protección.");
      setCl8HierarchySuccess(true);
      store.triggerEvent({ type: 'success', message: '🧱 CLÁUSULA 8.1: Jerarquía de controles aplicada al almacén. (+150 XP)' });
      useGameStore.setState({ xp: xp + 150 });
    } else {
      setCl8HierarchyFeedback("Asignación incorrecta. Recuerda: Sustitución es cambiar el químico, Ingeniería es la losa física, Administrativo es la inspección escrita y EPP es el equipo del trabajador.");
    }
  };

  const handleDrillOption = (step: number, option: string) => {
    if (step === 1) {
      if (option === 'epp') {
        setCl8DrillStep(2);
        setCl8DrillFeedback("EPP colocado. Avanzando a la zona.");
      } else {
        setCl8DrillFail(true);
        setCl8DrillFeedback("🚨 INCIDENTE CRÍTICO: Lavar con agua hacia la canaleta común ha dispersado el disolvente y contaminado el río perimetral. El regulador impone una sanción inmediata de $15,000.");
        store.assignBudget(15000);
        store.triggerEvent({ type: 'error', message: 'Contaminación pluvial en simulacro. Penalidad cobrada.' });
      }
    } else if (step === 2) {
      if (option === 'absorbent') {
        setCl8DrillStep(3);
        setCl8DrillFeedback("Derrame contenido en su perímetro.");
      } else {
        setCl8DrillFail(true);
        setCl8DrillFeedback("🚨 INCIDENTE CRÍTICO: Echar agua extendió la pluma del derrame y superó el laboratorio. Pérdida de reputación y multa de $8,000.");
        store.assignBudget(8000);
      }
    } else if (step === 3) {
      if (option === 'red') {
        setCl8DrillFeedback("¡Simulacro exitoso! El derrame fue confinado y los residuos peligrosos dispuestos de acuerdo a la ley R-DS001. Brigada lista.");
        setCl8DrillSuccess(true);
        store.triggerEvent({ type: 'success', message: '📢 CLÁUSULA 8.2: Simulacro de emergencia aprobado con éxito. (+150 XP)' });
        useGameStore.setState({ xp: xp + 150 });
      } else {
        setCl8DrillFail(true);
        setCl8DrillFeedback("🚨 INCIDENTE CRÍTICO: Desechar absorbentes tóxicos en basura común es una infracción de la ley de residuos peligrosos. Multa de $5,000.");
        store.assignBudget(5000);
      }
    }
  };

  const resetDrill = () => {
    setCl8DrillStep(1);
    setCl8DrillFail(false);
    setCl8DrillFeedback(null);
  };

  // ==========================================
  // CLAUSE 9 LAB STATE
  // ==========================================
  const [cl9Step, setCl9Step] = useState(1);
  const [cl9Gri, setCl9Gri] = useState<Record<string, string>>({
    energy: '', water: '', scope1: '', scope2: ''
  });
  const [cl9GriFeedback, setCl9GriFeedback] = useState<string | null>(null);
  const [cl9GriSuccess, setCl9GriSuccess] = useState(false);
  const [cl9Audit, setCl9Audit] = useState<Record<string, string>>({
    f1: '', f2: '', f3: ''
  });
  const [cl9AuditFeedback, setCl9AuditFeedback] = useState<string | null>(null);
  const [cl9AuditSuccess, setCl9AuditSuccess] = useState(false);

  const handleVerifyGri = () => {
    const { energy, water, scope1, scope2 } = cl9Gri;
    if (energy === '302' && water === '303' && scope1 === '305-1' && scope2 === '305-2') {
      setCl9GriFeedback("¡Correcto! Has asignado todos los indicadores GRI y alcances de la huella de carbono según el GHG Protocol con precisión.");
      setCl9GriSuccess(true);
      store.triggerEvent({ type: 'success', message: '📊 CLÁUSULA 9.1.1: KPIs alineados con estándares GRI. (+150 XP)' });
      useGameStore.setState({ xp: xp + 150 });
      const kpisDoc = documents.find(d => d.id === 'kpis_doc');
      if (kpisDoc) {
        store.updateDocument(kpisDoc.id, kpisDoc.content, 'signed');
      }
    } else {
      setCl9GriFeedback("Asignación incorrecta. GRI 302 es energía, GRI 303 es agua, 305-1 son emisiones directas (Scope 1) y 305-2 indirectas eléctricas (Scope 2).");
    }
  };

  const handleVerifyCl9Audit = () => {
    const { f1, f2, f3 } = cl9Audit;
    if (f1 === 'ncmayor' && f2 === 'ncmenor' && f3 === 'om') {
      setCl9AuditFeedback("¡Auditoría interna validada! Has clasificado correctamente las desviaciones operativas, distinguiendo entre fallas estructurales de la norma y oportunidades de mejora.");
      setCl9AuditSuccess(true);
      store.triggerEvent({ type: 'success', message: '🕵️ CLÁUSULA 9.2: Reporte de auditoría interna validado. (+150 XP)' });
      useGameStore.setState({ xp: xp + 150 });
      const auditDoc = documents.find(d => d.type === 'audit_report');
      if (auditDoc) {
        store.updateDocument(auditDoc.id, auditDoc.content, 'signed');
      }
    } else {
      setCl9AuditFeedback("Asignación de hallazgos incorrecta. Recuerda: La falta de firma del CEO o la falta de cumplimiento legal son NC Mayores. Una falla de calibración es NC Menor, y sugerencias estéticas son Oportunidades de Mejora.");
    }
  };

  // ==========================================
  // CLAUSE 10 LAB STATE
  // ==========================================
  const [cl10Whys, setCl10Whys] = useState<Record<string, string>>({
    w1: '', w2: '', w3: '', w4: '', w5: ''
  });
  const [cl10Feedback, setCl10Feedback] = useState<string | null>(null);
  const [cl10Success, setCl10Success] = useState(false);



  const handleVerifyCl10 = () => {
    const { w1, w2, w3, w4, w5 } = cl10Whys;
    if (w1 === 'q1' && w2 === 'q2' && w3 === 'q3' && w4 === 'q4' && w5 === 'q5') {
      setCl10Feedback("¡Causa Raíz resuelta! Has estructurado el análisis de los 5 Porqués perfectamente. Esto demuestra que los desvíos técnicos (plomo) siempre se originan en brechas organizacionales (falta de inspecciones y procedimientos).");
      setCl10Success(true);
      store.triggerEvent({ type: 'success', message: '🔧 CLÁUSULA 10.2: Análisis de 5 Porqués completado. (+150 XP)' });
      useGameStore.setState({ xp: xp + 150 });
      
      // Cerrar primer incidente si existe
      if (incidents.length > 0 && incidents[0].status === 'open') {
        investigateIncident(incidents[0].id, "Cerrado mediante análisis de 5 Porqués y plan correctivo implementado.");
      }
      const actionDoc = documents.find(d => d.id === 'action_plan_doc');
      if (actionDoc) {
        store.updateDocument(actionDoc.id, actionDoc.content, 'signed');
      }
    } else {
      setCl10Feedback("La cadena lógica de causa y efecto no coincide. Recuerda seguir un flujo descendente: el síntoma (plomo) -> proceso inmediato -> falla de equipo -> falta de mantenimiento -> brecha en el procedimiento.");
    }
  };

  const edu = {
    4: {
      title: 'Comprensión de la Cláusula 4: Contexto de la Organización',
      requirements: [
        '**4.1 Contexto**: Determinar cuestiones externas e internas relevantes para el propósito de la organización. (Enmienda 2024: Se debe evaluar explícitamente la relevancia del cambio climático). Relacionado directamente con **SDG 13 (Acción por el Clima)**.',
        '**4.2 Partes Interesadas**: Identificar necesidades y expectativas de trabajadores, vecinos, reguladores e inversores.',
        '**4.3 Alcance**: Definir los límites físicos y operacionales del SGA, considerando el ciclo de vida e impactos indirectos como emisiones Scope 3.'
      ],
      definitions: [
        { term: 'Acción Climática (Amd 1:2024)', definition: 'Obligación de evaluar si las sequías, inundaciones, olas de calor o leyes de transición de carbono representan riesgos reales para la continuidad del negocio o sus aspectos.' },
        { term: 'GHG Protocol (Alcance 1, 2, 3)', definition: 'Estándar para medir la huella de carbono. Alcance 1: Directas (flota/diésel). Alcance 2: Indirectas por electricidad comprada. Alcance 3: Cadena de suministro y logística de terceros.' },
        { term: 'ODS de la ONU (Objetivos de Desarrollo Sostenible)', definition: 'Metas mundiales de desarrollo. En el contexto organizacional destacan el ODS 6 (Agua), ODS 12 (Producción responsable) y ODS 13 (Acción climática).' }
      ],
      caseStudy: 'Una fábrica metalúrgica en zona de estrés hídrico determinó que el Cambio Climático (§4.1) es crítico debido a sequías periódicas que amenazan sus líneas de enfriamiento. Integraron el reciclaje del 80% del agua de planta en el alcance de su SGA, alineándose con el ODS 6.',
      auditorTips: 'El auditor exigirá actas o análisis (FODA/PESTEL) donde figure el debate sobre el cambio climático y cómo se comunican las necesidades de los vecinos (OEFA / Comunidad).'
    },
    5: {
      title: 'Comprensión de la Cláusula 5: Liderazgo y Compromiso',
      requirements: [
        '**5.1 Liderazgo**: La Alta Dirección debe rendir cuentas del SGA, alinear metas con la estrategia empresarial, proveer el presupuesto y promover la sostenibilidad corporativa.',
        '**5.2 Política**: Redactar un marco escrito con promesas de prevenir la contaminación, cumplir las leyes, buscar la mejora continua e incorporar la acción climática (ISO 14001/Amd 1:2024).',
        '**5.3 Roles y Responsabilidades**: Asignar líderes de planta que reporten directamente los desvíos y el avance de los indicadores de sostenibilidad al CEO.'
      ],
      definitions: [
        { term: 'Política Ambiental', definition: 'Declaración pública y firmada que guía el comportamiento ecológico de toda la plantilla y subcontratistas, fundamentando los compromisos ESG.' },
        { term: 'Rendición de Cuentas (Accountability)', definition: 'La dirección general asume la responsabilidad legal y operativa final de las multas o fallas, no pudiendo delegar la culpa al especialista.' }
      ],
      caseStudy: 'El CEO de una firma química firmó la política ambiental e integró metas de reducción de emisiones de Alcance 1/2 en el plan de bonos de los gerentes de producción, demostrando liderazgo real y alinear con estándares GRI 302 y 305.',
      auditorTips: 'El auditor entrevistará a operarios al azar en la planta para preguntarles si conocen la Política Ambiental. También buscará la firma física o digital del CEO vigente.'
    },
    6: {
      title: 'Comprensión de la Cláusula 6: Planificación (ISO 14001:2026)',
      requirements: [
        '**6.1.2 Aspectos Ambientales**: Identificar causas operacionales que interactúan con el medio ambiente considerando una perspectiva de ciclo de vida (evaluando inputs/outputs según GHG Protocol).',
        '**6.1.3 Requisitos Legales**: Confeccionar una matriz con las leyes locales e internacionales vigentes (ej. límites de vertimientos y manejo de residuos).',
        '**6.2 Objetivos Ambientales**: Metas específicas y medibles alineadas con metas científicas **SBTi** (1.5°C) y los **ODS 6, 12 y 13**.',
        '**6.3 Planificación de cambios (ISO 14001:2026)**: Cuando la organización determine la necesidad de realizar cambios que afecten al SGA, estos se deben llevar a cabo de manera planificada y estructurada.'
      ],
      definitions: [
        { term: 'Planificación de Cambios (§6.3)', definition: 'Requisito preventivo obligatorio incorporado en la cuarta edición (2026). Exige evaluar y mitigar los efectos e impactos de cualquier modificación operacional (nuevos equipos, procesos, leyes o materias primas) antes de su puesta en marcha.' },
        { term: 'SBTi (Science Based Targets)', definition: 'Iniciativa que valida científicamente si las metas corporativas de reducción de carbono están alineadas con los objetivos del Acuerdo de París de limitar el calentamiento global a 1.5°C.' },
        { term: 'GRI Standards (302, 303, 305)', definition: 'Estándares mundiales de sostenibilidad: GRI 302 (Energía), GRI 303 (Agua y Efluentes) y GRI 305 (Emisiones de CO2e y GEI) que garantizan reportes transparentes y comparables.' },
        { term: 'Perspectiva de Ciclo de Vida', definition: 'Analizar el impacto desde la extracción de insumos, embalaje, uso por el cliente, hasta su disposición final.' }
      ],
      caseStudy: 'BioChem Agroquímica planificó la instalación del reactor R-302 aplicando la Cláusula 6.3. Identificó riesgos de fugas y emisiones de COVs antes de la puesta en marcha, gestionando los permisos ambientales necesarios e instalando un lavador de gases. Esto evitó multas graves y protegió los ecosistemas.',
      auditorTips: 'El auditor exigirá actas del plan de gestión de cambios. Verificará que las modificaciones físicas o de procesos cuenten con una evaluación de aspectos previa y que se actualizara la matriz legal e información documentada.'
    },
    7: {
      title: 'Comprensión de la Cláusula 7: Soporte y Apoyo',
      requirements: [
        '**7.1 Recursos**: Suministrar presupuesto, tecnología e infraestructura para la transición energética.',
        '**7.2 Competencia**: Asegurar que las personas que afectan el desempeño ambiental tengan la capacitación necesaria acreditada mediante registros de adiestramiento.',
        '**7.3 Concienciación**: Que los empleados entiendan las consecuencias de incumplir el SGA y el impacto de la huella de carbono.'
      ],
      definitions: [
        { term: 'Competencia Técnica', definition: 'Conocimientos prácticos acreditados mediante registros, diplomas o evaluaciones internas.' },
        { term: 'Toma de Conciencia', definition: 'Comprensión por parte de los trabajadores del impacto de sus errores (ej. saber qué hacer si un contenedor derrama aceite).' }
      ],
      caseStudy: 'Para bajar los desvíos del patio de residuos, una empresa instaló una plataforma e-learning gamificada. Los operarios con 100% de aprobación redujeron un 40% las mezclas peligrosas accidentales.',
      auditorTips: 'El auditor buscará las listas de asistencia firmadas de los talleres de capacitación y los perfiles de puesto con sus respectivos títulos profesionales.'
    },
    8: {
      title: 'Comprensión de la Cláusula 8: Operación',
      requirements: [
        '**8.1 Planificación y Control Operacional**: Implementar barreras físicas y controles para mitigar aspectos significativos y reducir el consumo de agua/electricidad (ODS 6/12).',
        '**8.2 Respuesta ante Emergencias**: Diseñar planes y simulacros para reaccionar ante accidentes, fugas, explosiones o catástrofes climáticas.'
      ],
      definitions: [
        { term: 'Jerarquía de Controles', definition: 'Método estructurado: 1. Eliminar, 2. Sustituir, 3. Ingeniería (ej. cubetos), 4. Administrativo, 5. EPP.' },
        { term: 'Dique de Retención Secundario', definition: 'Control de ingeniería consistente en un cubeto receptor que recolecta el líquido fugado para evitar contacto directo con el suelo.' }
      ],
      caseStudy: 'Una empresa logística sustituyó montacargas diesel por eléctricos (eliminación Alcance 1 / sustitución por Alcance 2 de baja emisión), instaló canaletas antiderrames (ingeniería) y capacitó en hojas de seguridad (administrativo).',
      auditorTips: 'El auditor examinará el estado de los kits antiderrames en planta. Si un extintor está vencido o un kit no tiene material absorbente, es no conformidad.'
    },
    9: {
      title: 'Comprensión de la Cláusula 9: Evaluación del Desempeño',
      requirements: [
        '**9.1 Monitoreo y Medición**: Rastrear consumos energéticos, agua, y emisiones de CO2e. Recomiendo estructurar los KPIs mensuales según **GRI 302, 303 y 305**.',
        '**9.2 Auditoría Interna**: Autoevaluar el SGA de forma objetiva una vez al año.',
        '**9.3 Revisión por la Dirección**: El CEO debe analizar las metas y reajustar presupuestos.'
      ],
      definitions: [
        { term: 'Monitoreo bajo GRI Standards', definition: 'Asegurar que los datos de energía (GRI 302), agua (GRI 303) y huella de carbono (GRI 305) tengan trazabilidad e informes auditables.' },
        { term: 'Revisión por la Dirección', definition: 'Una junta formal donde se evalúan los incidentes y no conformidades para dictaminar si el sistema es eficaz.' }
      ],
      caseStudy: 'Un laboratorio químico analizó que sus descargas de pH fluctuaban entre 5 y 10. Tras la auditoría interna, instalaron una estación de neutralización que estabilizó el pH en 7.2 antes de verter al alcantarillado, reportando bajo GRI 303.',
      auditorTips: 'El auditor solicitará la Minuta firmada de la Revisión por la Dirección y los informes de calibración periódica de los instrumentos de medición.'
    },
    10: {
      title: 'Comprensión de la Cláusula 10: Mejora',
      requirements: [
        '**10.2 No Conformidades y Acciones Correctivas**: Reaccionar ante el desvío, analizar la causa de raíz e implementar cambios para evitar repetición.',
        '**10.3 Mejora Continua**: Aumentar la idoneidad y adecuación del SGA para mejorar el desempeño ambiental general.'
      ],
      definitions: [
        { term: 'Análisis Causa Raíz', definition: 'Técnica analítica (ej. 5 Porqués) para encontrar el origen sistémico de una falla y no quedarse en el error humano superficial.' },
        { term: 'Acción Correctiva', definition: 'Modificación en el proceso o infraestructura diseñada para evitar permanentemente la reaparición del incidente.' }
      ],
      caseStudy: 'Una fuga de reactivo ocurrió en almacén. Causa raíz: Envase podrido debido a humedad en piso de tierra por falta de techo. Acción correctiva: Construcción de solera de concreto con techado metálico.',
      auditorTips: 'El auditor buscará el registro histórico de incidentes y verificará si las acciones propuestas realmente se implementaron o si los incidentes se repiten periódicamente.'
    }
  }[activeTab as 4|5|6|7|8|9|10];

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Tab Selector Buttons */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-1 pb-1">
        {[4, 5, 6, 7, 8, 9, 10].map((clauseNum) => {
          const names = ['Contexto', 'Liderazgo', 'Planificación', 'Apoyo', 'Operación', 'Desempeño', 'Mejora'];
          const isSelected = activeTab === clauseNum;
          return (
            <button
              key={clauseNum}
              onClick={() => {
                setActiveTab(clauseNum);
                setCl4Feedback(null);
                setCl5PolicyFeedback(null);
                setCl5RolesFeedback(null);
                setCl6Feedback(null);
                setCl7Feedback(null);
                setCl8HierarchyFeedback(null);
                setCl9GriFeedback(null);
                setCl9AuditFeedback(null);
                setCl10Feedback(null);
              }}
              className={`px-3 py-2 text-xs font-bold transition-all rounded-t-xl cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-t-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Cláusula {clauseNum}: {names[clauseNum - 4]}
            </button>
          );
        })}
      </div>

      {/* Twin-Panel Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 h-full min-h-[550px]">
        {/* Left Side (3/5): Doing-to-Learn Laboratory */}
        <div className="xl:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-5 justify-between">
          
          {/* ==========================================
              CLAUSE 4 WORKSHOP
             ========================================== */}
          {activeTab === 4 && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider">
                  Laboratorio de Contexto e Impacto Climático (§4.1/4.2)
                </h4>
                <div className="flex gap-1.5 text-[10px] font-bold">
                  <span className={`px-2 py-0.5 rounded ${cl4Step >= 1 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Paso 1</span>
                  <span className={`px-2 py-0.5 rounded ${cl4Step >= 2 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Paso 2</span>
                  <span className={`px-2 py-0.5 rounded ${cl4Step >= 3 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Paso 3</span>
                </div>
              </div>

              {/* EHS Academy Guide Card */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl flex gap-4 text-xs leading-relaxed shadow-3xs">
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-emerald-500/10 rounded-xl text-emerald-500 shrink-0 self-start">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs mb-0.5 uppercase tracking-wider">Academia EHS: Cláusula 4 - Contexto de la Organización (Edición 2026)</h5>
                  <p className="text-slate-500 dark:text-slate-400">
                    <strong>Requisito 4.1 y 4.2 (Acción Clima):</strong> Bajo la enmienda de 2026, las empresas deben determinar si el <strong>Cambio Climático</strong> es un factor relevante para su contexto operacional. Esto impacta los requisitos de las partes interesadas (comunidades, clientes y reguladores). Además, en el requisito 4.3 se define el <strong>Alcance del SGA</strong>, delimitando físicamente las áreas y procesos incluidos en la certificación.
                  </p>
                </div>
              </div>

              {cl4Step === 1 && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    <strong>Paso 1: Diagnóstico FODA/PESTEL Interactivo.</strong> Clasifica cada factor ambiental clave del entorno industrial de la empresa para contextualizar el SGA.
                  </p>

                  <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {cl4Factors.map((f) => (
                      <div key={f.id} className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-2.5 items-start sm:items-center">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{f.text}</span>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <select
                            value={cl4PestelClass[f.id]}
                            onChange={(e) => setCl4PestelClass({ ...cl4PestelClass, [f.id]: e.target.value })}
                            className="text-[10px] p-1.5 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-1/2 sm:w-28"
                          >
                            <option value="">PESTEL...</option>
                            <option value="political">Político</option>
                            <option value="social">Social</option>
                            <option value="technological">Tecnológico</option>
                            <option value="environmental">Ambiental</option>
                            <option value="legal">Legal</option>
                          </select>
                          <select
                            value={cl4SwotClass[f.id]}
                            onChange={(e) => setCl4SwotClass({ ...cl4SwotClass, [f.id]: e.target.value })}
                            className="text-[10px] p-1.5 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-1/2 sm:w-28"
                          >
                            <option value="">FODA...</option>
                            <option value="strengths">Fortaleza</option>
                            <option value="weaknesses">Debilidad</option>
                            <option value="opportunities">Oportunidad</option>
                            <option value="threats">Amenaza</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  {cl4Feedback && (
                    <div className={`text-xs p-3.5 rounded-xl border ${cl4Success ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}`}>
                      {cl4Feedback}
                    </div>
                  )}

                  <div className="flex justify-end gap-2.5 mt-2">
                    <button
                      onClick={handleVerifyCl4Step1}
                      className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-xl text-white cursor-pointer"
                    >
                      Verificar Diagnóstico
                    </button>
                    {cl4Success && (
                      <button
                        onClick={() => { setCl4Step(2); setCl4Feedback(null); }}
                        className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white cursor-pointer"
                      >
                        Siguiente Paso
                      </button>
                    )}
                  </div>
                </div>
              )}

              {cl4Step === 2 && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    <strong>Paso 2: Enmienda de Acción Climática (2024).</strong> El auditor te interroga sobre la relevancia del cambio climático. Determina la posición legal y estratégica de EnviroPro:
                  </p>

                  <div className="flex flex-col gap-2.5 mt-2">
                    <button
                      onClick={() => handleVerifyCl4Step2(1)}
                      className={`text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${
                        cl4ClimateDecision === 1 
                          ? 'border-rose-500 bg-rose-500/5 text-rose-700 dark:text-rose-400' 
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <strong>Opción A:</strong> Declarar que la fábrica manufactura bajo techo, por lo que el cambio climático no tiene relevancia en el alcance ni en las operaciones.
                    </button>
                    <button
                      onClick={() => handleVerifyCl4Step2(2)}
                      className={`text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${
                        cl4ClimateDecision === 2 
                          ? 'border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 font-semibold' 
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <strong>Opción B:</strong> Reconocer y declarar formalmente los riesgos de inundación extrema en el Patio de Residuos y el estrés hídrico de la cuenca que encarece la captación de agua industrial.
                    </button>
                  </div>

                  {cl4ClimateFeedback && (
                    <div className={`text-xs p-3.5 rounded-xl border ${cl4ClimateDecision === 2 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                      {cl4ClimateFeedback}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3">
                    <button onClick={() => setCl4Step(1)} className="text-xs text-slate-400 hover:text-slate-600 font-bold">Atrás</button>
                    {cl4ClimateDecision === 2 && (
                      <button
                        onClick={() => { setCl4Step(3); }}
                        className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white cursor-pointer"
                      >
                        Siguiente Paso
                      </button>
                    )}
                  </div>
                </div>
              )}

              {cl4Step === 3 && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    <strong>Paso 3: Definición del Alcance (§4.3).</strong> Selecciona qué operaciones de la planta central deben estar integradas bajo el alcance certificado de tu SGA:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2 text-xs">
                    <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={cl4ScopeSelection.prod} 
                        onChange={(e) => setCl4ScopeSelection({ ...cl4ScopeSelection, prod: e.target.checked })}
                      />
                      <span>Procesos productivos de Prensas</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={cl4ScopeSelection.alm} 
                        onChange={(e) => setCl4ScopeSelection({ ...cl4ScopeSelection, alm: e.target.checked })}
                      />
                      <span>Almacén químico de reactivos</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={cl4ScopeSelection.log} 
                        onChange={(e) => setCl4ScopeSelection({ ...cl4ScopeSelection, log: e.target.checked })}
                      />
                      <span>Logística y transporte de flota</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={cl4ScopeSelection.pt} 
                        onChange={(e) => setCl4ScopeSelection({ ...cl4ScopeSelection, pt: e.target.checked })}
                      />
                      <span>Planta de Tratamiento (Vertimientos)</span>
                    </label>
                  </div>

                  {scopeStatement && (
                    <div className="bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3.5 rounded-xl text-xs leading-normal">
                      <strong>Alcance Declarado:</strong><br /> {scopeStatement}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3">
                    <button onClick={() => setCl4Step(2)} className="text-xs text-slate-400 hover:text-slate-600 font-bold">Atrás</button>
                    {!cl4ScopeSaved ? (
                      <button
                        onClick={handleSaveCl4Scope}
                        className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white cursor-pointer"
                      >
                        Establecer Alcance Oficial
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Alcance Consolidado
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              CLAUSE 5 WORKSHOP
             ========================================== */}
          {activeTab === 5 && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider">
                  Laboratorio de Liderazgo, Política y Roles (§5.2/5.3)
                </h4>
                <div className="flex gap-1.5 text-[10px] font-bold">
                  <span className={`px-2 py-0.5 rounded ${cl5Step >= 1 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Paso 1</span>
                  <span className={`px-2 py-0.5 rounded ${cl5Step >= 2 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Paso 2</span>
                </div>
              </div>

              {/* EHS Academy Guide Card */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl flex gap-4 text-xs leading-relaxed shadow-3xs">
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-purple-500/10 rounded-xl text-purple-500 shrink-0 self-start">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs mb-0.5 uppercase tracking-wider">Academia EHS: Cláusula 5 - Liderazgo y Roles del SGA</h5>
                  <p className="text-slate-500 dark:text-slate-400">
                    <strong>Requisito 5.1 y 5.3:</strong> La alta dirección debe demostrar liderazgo y compromiso con el SGA. Esto no solo implica firmar la política ambiental, sino asegurar los recursos financieros y tecnológicos. En el requisito 5.3 se asignan y comunican las <strong>responsabilidades y autoridades</strong> para reportar el desempeño ambiental del sistema.
                  </p>
                </div>
              </div>

              {cl5Step === 1 && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    <strong>Paso 1: Redacción de la Política de Sostenibilidad.</strong> Para que la Política sea válida ante el organismo certificador, debe contener los compromisos normativos obligatorios. Selecciona cuáles integrar:
                  </p>

                  <div className="flex flex-col gap-2.5 text-xs">
                    <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={cl5PolicyCommitments.prev} 
                        onChange={(e) => setCl5PolicyCommitments({ ...cl5PolicyCommitments, prev: e.target.checked })}
                      />
                      <span>Compromiso de protección del medio ambiente y prevención de la contaminación.</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={cl5PolicyCommitments.leg} 
                        onChange={(e) => setCl5PolicyCommitments({ ...cl5PolicyCommitments, leg: e.target.checked })}
                      />
                      <span>Compromiso de cumplir con los requisitos legales y otros aplicables.</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={cl5PolicyCommitments.improve} 
                        onChange={(e) => setCl5PolicyCommitments({ ...cl5PolicyCommitments, improve: e.target.checked })}
                      />
                      <span>Compromiso de mejora continua del SGA para la mejora del desempeño ambiental.</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={cl5PolicyCommitments.climate} 
                        onChange={(e) => setCl5PolicyCommitments({ ...cl5PolicyCommitments, climate: e.target.checked })}
                      />
                      <span>Compromiso de acción climática ante riesgos físicos y de transición (Enmienda 2024).</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={cl5PolicyCommitments.profit} 
                        onChange={(e) => setCl5PolicyCommitments({ ...cl5PolicyCommitments, profit: e.target.checked })}
                      />
                      <span className="text-amber-600 dark:text-amber-500 font-semibold">Compromiso de maximizar los dividendos y las utilidades operativas de los socios.</span>
                    </label>
                  </div>

                  {cl5PolicyFeedback && (
                    <div className={`text-xs p-3.5 rounded-xl border ${cl5PolicySuccess ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                      {cl5PolicyFeedback}
                    </div>
                  )}

                  <div className="flex justify-end gap-2.5 mt-2">
                    <button
                      onClick={handleVerifyPolicy}
                      className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 rounded-xl text-white cursor-pointer"
                    >
                      Presentar Borrador al CEO
                    </button>
                    {cl5PolicySuccess && (
                      <button
                        onClick={() => { setCl5Step(2); setCl5PolicyFeedback(null); }}
                        className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white cursor-pointer"
                      >
                        Siguiente Paso
                      </button>
                    )}
                  </div>
                </div>
              )}

              {cl5Step === 2 && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    <strong>Paso 2: Organigrama y Asignación de Roles (§5.3).</strong> Analiza el perfil técnico de tus operarios y asígnales las funciones que mejor se ajusten a su competencia para consolidar la rendición de cuentas del SGA.
                  </p>

                  <div className="flex flex-col gap-3.5 mt-2 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                      <span className="font-bold text-slate-800 dark:text-white">Rol 1: Representante de la Dirección (Informes, mejora general, auditorías del SGA)</span>
                      <select
                        value={cl5Roles.rep}
                        onChange={(e) => setCl5Roles({ ...cl5Roles, rep: e.target.value })}
                        className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300"
                      >
                        <option value="">Seleccionar perfil...</option>
                        <option value="maria">María Rojas - Ing. EHS con posgrados en Auditoría Interna</option>
                        <option value="juan">Juan Pérez - Ing. Químico especialista en control de calderas</option>
                        <option value="carlos">Carlos Gómez - Sup. Almacén certificado en MSDS y rescate</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                      <span className="font-bold text-slate-800 dark:text-white">Rol 2: Control Operacional (Filtros, efluentes, segregación de residuos)</span>
                      <select
                        value={cl5Roles.ops}
                        onChange={(e) => setCl5Roles({ ...cl5Roles, ops: e.target.value })}
                        className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300"
                      >
                        <option value="">Seleccionar perfil...</option>
                        <option value="maria">María Rojas - Ing. EHS con posgrados en Auditoría Interna</option>
                        <option value="juan">Juan Pérez - Ing. Químico especialista en control de calderas</option>
                        <option value="carlos">Carlos Gómez - Sup. Almacén certificado en MSDS y rescate</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                      <span className="font-bold text-slate-800 dark:text-white">Rol 3: Coordinación de Emergencias (Simulacros, extintores, kits antiderrames)</span>
                      <select
                        value={cl5Roles.emerg}
                        onChange={(e) => setCl5Roles({ ...cl5Roles, emerg: e.target.value })}
                        className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300"
                      >
                        <option value="">Seleccionar perfil...</option>
                        <option value="maria">María Rojas - Ing. EHS con posgrados en Auditoría Interna</option>
                        <option value="juan">Juan Pérez - Ing. Químico especialista en control de calderas</option>
                        <option value="carlos">Carlos Gómez - Sup. Almacén certificado en MSDS y rescate</option>
                      </select>
                    </div>
                  </div>

                  {cl5RolesFeedback && (
                    <div className={`text-xs p-3.5 rounded-xl border ${cl5RolesSuccess ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                      {cl5RolesFeedback}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3">
                    <button onClick={() => setCl5Step(1)} className="text-xs text-slate-400 hover:text-slate-600 font-bold">Atrás</button>
                    {!cl5RolesSuccess ? (
                      <button
                        onClick={handleVerifyRoles}
                        className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white cursor-pointer"
                      >
                        Aprobar Estructura de Roles
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Estructura Aprobada
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              CLAUSE 6 WORKSHOP
             ========================================== */}
          {activeTab === 6 && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider">
                  Planificación Ambiental (§6.1 / §6.3 - ISO 14001:2026)
                </h4>
              </div>

              {/* EHS Academy Guide Card */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl flex gap-4 text-xs leading-relaxed shadow-3xs">
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-amber-500/10 rounded-xl text-amber-500 shrink-0 self-start">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs mb-0.5 uppercase tracking-wider">Academia EHS: Cláusula 6 - Planificación e Impactos</h5>
                  <p className="text-slate-500 dark:text-slate-400">
                    <strong>Requisito 6.1.2 y 6.3:</strong> Identificar los aspectos ambientales (causas) de tus operaciones y evaluar sus impactos (efectos) mediante severidad y probabilidad. Bajo la Cláusula 6.3 <strong>(Gestión de Cambios)</strong>, cualquier modificación en la planta (como nuevos equipos o ampliación de líneas) debe ser planificada de forma preventiva: identificando riesgos y leyes antes de instalar los controles y capacitar.
                  </p>
                </div>
              </div>
                <div className="flex gap-1.5 text-[10px] font-bold">
                  <span 
                    onClick={() => { if (cl6Scenario >= 4) setCl6Scenario(1); }}
                    className={`px-2 py-0.5 rounded cursor-pointer ${cl6Scenario <= 3 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                  >
                    Paso 1: Aspectos
                  </span>
                  <span 
                    onClick={() => { if (cl6SuccessCount >= 3) setCl6Scenario(4); }}
                    className={`px-2 py-0.5 rounded ${cl6Scenario === 4 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'} ${cl6SuccessCount >= 3 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                  >
                    Paso 2: Cambios (2026)
                  </span>
                </div>


              {cl6Scenario <= 3 && (() => {
                const companyScenarios = aspectScenarios[currentCompanyId as keyof typeof aspectScenarios];
                const currentScenario = companyScenarios[cl6Scenario - 1];
                const allAspects = companyScenarios.map((s: { aspect: string; aspectLabel: string }) => ({ value: s.aspect, label: s.aspectLabel }));
                const allImpacts = companyScenarios.map((s: { impact: string; impactLabel: string }) => ({ value: s.impact, label: s.impactLabel }));

                return (
                  <div className="flex flex-col gap-3 text-xs">
                    <p className="text-slate-500 dark:text-slate-400 leading-normal">
                      <strong>Cláusula 6.1.2 Lab:</strong> Evalúa los aspectos ambientales significativos de la planta para la empresa actual. Asocia correctamente la Causa Operativa (Aspecto) con el Efecto Ambiental (Impacto) y calcula el puntaje de significancia.
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                      <h5 className="font-bold text-slate-800 dark:text-white uppercase text-[10px] tracking-wider">
                        Área a Evaluar: {currentScenario.title} (Escenario {cl6Scenario} de 3)
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-normal bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        {currentScenario.desc}
                      </p>

                      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 mt-1">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Aspecto Ambiental (Causa)</label>
                          <select
                            value={cl6Aspect}
                            onChange={(e) => setCl6Aspect(e.target.value)}
                            className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-[11px]"
                          >
                            <option value="">Seleccionar aspecto...</option>
                            {allAspects.map((opt: { value: string; label: string }) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Impacto Ambiental (Efecto)</label>
                          <select
                            value={cl6Impact}
                            onChange={(e) => setCl6Impact(e.target.value)}
                            className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-[11px]"
                          >
                            <option value="">Seleccionar impacto...</option>
                            {allImpacts.map((opt: { value: string; label: string }) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 mt-1.5 border-t border-slate-200/50 dark:border-slate-800 pt-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Severidad del Impacto (1-5): {cl6Severity}</label>
                          <input 
                            type="range" min="1" max="5" 
                            value={cl6Severity} 
                            onChange={(e) => setCl6Severity(parseInt(e.target.value))} 
                            className="accent-emerald-500 cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Probabilidad de Ocurrencia (1-5): {cl6Probability}</label>
                          <input 
                            type="range" min="1" max="5" 
                            value={cl6Probability} 
                            onChange={(e) => setCl6Probability(parseInt(e.target.value))}
                            className="accent-emerald-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {cl6Feedback && (
                      <div className="text-xs p-3 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl">
                        {cl6Feedback}
                      </div>
                    )}

                    <div className="flex flex-wrap justify-end gap-2 mt-2">
                      {cl6AwaitingNext && (
                        <button type="button" onClick={() => {
                          setCl6Scenario((value) => value < 3 ? value + 1 : 4);
                          setCl6Aspect('');
                          setCl6Impact('');
                          setCl6Feedback(null);
                          setCl6AwaitingNext(false);
                        }} className="rounded-xl bg-lime-300 px-4 py-2 text-xs font-black text-emerald-950 hover:bg-lime-200">
                          {cl6Scenario < 3 ? `Continuar al escenario ${cl6Scenario + 1}` : 'Continuar a Gestión del Cambio'}
                        </button>
                      )}

                      <div className="flex justify-end">
                      <button
                        onClick={handleVerifyAspectLab}
                        disabled={!cl6Aspect || !cl6Impact}
                        className={`px-4 py-2 text-xs font-bold rounded-xl text-white cursor-pointer ${
                          cl6Aspect && cl6Impact ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Evaluar Significancia (Sev x Prob)
                      </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {cl6Scenario === 4 && (
                <div className="flex flex-col gap-3 text-xs">
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                    <h5 className="font-extrabold text-emerald-800 dark:text-emerald-400 uppercase text-[10px] tracking-wider mb-1">
                      Escenario de Cambio: {currentCompanyId === 'metal' 
                        ? "Ampliación de la Línea de Troquelado y Pintura Electrostática" 
                        : currentCompanyId === 'chem'
                          ? "Instalación del Reactor de Síntesis R-302 para Plaguicidas"
                          : "Puesta en marcha de la Columna de Destilación D-205"}
                    </h5>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-normal">
                      {currentCompanyId === 'metal' 
                        ? "Se planea instalar una nueva prensa de estampado de 500 toneladas y un horno de curado. Esto aumentará el nivel de ruido, el consumo eléctrico y la generación de lodos de fosfatizado. Sigue la Cláusula 6.3 para planificar este cambio sin comprometer la integridad del SGA."
                        : currentCompanyId === 'chem' 
                          ? "Se añadirá un reactor químico de 10,000L para sintetizar nuevos plaguicidas. Esto implica riesgo de emisiones de COVs, fugas térmicas exotérmicas y generación de aguas de lavado peligrosas. Organiza el cambio de manera sistemática."
                          : "Se integrará una columna de destilación fraccionada de alta presión para biodiésel. Aumentará el consumo de vapor de caldera (Scope 1 carbono), los vapores de metanol inflamables y la glicerina residual. Ordena los pasos lógicos del cambio."}
                    </p>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 leading-normal mt-1">
                    <strong>Cláusula 6.3 Lab (Gestión del Cambio):</strong> Ordena los 5 pasos lógicos para planificar e implementar este cambio sin poner en riesgo el SGA. Usa los botones <span className="font-bold text-slate-700 dark:text-slate-300">▲</span> y <span className="font-bold text-slate-700 dark:text-slate-300">▼</span> para ajustar el orden de los elementos.
                  </p>

                  <div className="flex flex-col gap-2 mt-2">
                    {changeSteps.map((step, index) => (
                      <div 
                        key={step.id} 
                        className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3 transition-all"
                      >
                        <div className="flex gap-3 items-center">
                          <span className="text-slate-400 dark:text-slate-500 font-extrabold text-xs w-6 text-center">{index + 1}</span>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 dark:text-white text-[11px]">{step.title}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">{step.desc}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            disabled={index === 0 || changeSuccess}
                            onClick={() => moveStep(index, 'up')}
                            className="p-1 px-1.5 text-[9px] font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            ▲
                          </button>
                          <button
                            disabled={index === changeSteps.length - 1 || changeSuccess}
                            onClick={() => moveStep(index, 'down')}
                            className="p-1 px-1.5 text-[9px] font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {changeFeedback && (
                    <div className={`text-xs p-3 rounded-xl border ${changeSuccess ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                      {changeFeedback}
                    </div>
                  )}

                  <div className="flex justify-end mt-2">
                    {!changeSuccess ? (
                      <button
                        onClick={handleVerifyChangeManagement}
                        className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white cursor-pointer"
                      >
                        Validar Planificación del Cambio (§6.3)
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-500 font-bold flex items-center gap-1.5 bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/10">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Planificación de Cambio Aprobada (§6.3)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              CLAUSE 7 WORKSHOP
             ========================================== */}
          {activeTab === 7 && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider">
                  Plan de Competencia y Concientización (§7.2/7.3)
                </h4>
                <div className="flex gap-1.5 text-[10px] font-bold">
                  <span className={`px-2 py-0.5 rounded ${!cl7Success ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Paso 1</span>
                  <span className={`px-2 py-0.5 rounded ${cl7Success ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Paso 2</span>
                </div>
              </div>

              {/* EHS Academy Guide Card */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl flex gap-4 text-xs leading-relaxed shadow-3xs">
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-sky-500/10 rounded-xl text-sky-500 shrink-0 self-start">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs mb-0.5 uppercase tracking-wider">Academia EHS: Cláusula 7 - Competencia y Concientización</h5>
                  <p className="text-slate-500 dark:text-slate-400">
                    <strong>Requisito 7.2 y 7.3:</strong> Determinar la competencia necesaria de las personas que realizan trabajos bajo el control de la organización que afecten su desempeño ambiental. Se debe impartir educación técnica adecuada (como contención HAZMAT o segregación de residuos) y asegurar que el personal conozca la política ambiental y las consecuencias de incumplir el SGA.
                  </p>
                </div>
              </div>

              {!cl7Success ? (
                <div className="flex flex-col gap-3 text-xs">
                  <p className="text-slate-500 dark:text-slate-400 leading-normal">
                    <strong>Paso 1: Mapeo de Matriz de Competencias.</strong> Asigna a cada área de la empresa el taller ambiental adecuado para capacitar a los operarios según sus aspectos y riesgos operacionales.
                  </p>

                  <div className="flex flex-col gap-3.5 mt-2">
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Área: Patio de Residuos</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Riesgo: Lixiviación y mezcla de residuos peligrosos.</span>
                      </div>
                      <select
                        value={cl7Training.patio}
                        onChange={(e) => setCl7Training({ ...cl7Training, patio: e.target.value })}
                        className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-44"
                      >
                        <option value="">Seleccionar taller...</option>
                        <option value="spill">Contención de derrames y aceites</option>
                        <option value="segregation">Segregación de residuos peligrosos (GRI 306)</option>
                        <option value="neutralization">Uso de kits y neutralización de pH</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Área: Mantenimiento</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Riesgo: Generación de aceites quemados y fugas mecánicas.</span>
                      </div>
                      <select
                        value={cl7Training.maint}
                        onChange={(e) => setCl7Training({ ...cl7Training, maint: e.target.value })}
                        className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-44"
                      >
                        <option value="">Seleccionar taller...</option>
                        <option value="spill">Contención de derrames y aceites</option>
                        <option value="segregation">Segregación de residuos peligrosos (GRI 306)</option>
                        <option value="neutralization">Uso de kits y neutralización de pH</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Área: Laboratorio / Efluentes</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Riesgo: Descarga de líquidos ácidos y neutralización.</span>
                      </div>
                      <select
                        value={cl7Training.lab}
                        onChange={(e) => setCl7Training({ ...cl7Training, lab: e.target.value })}
                        className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-44"
                      >
                        <option value="">Seleccionar taller...</option>
                        <option value="spill">Contención de derrames y aceites</option>
                        <option value="segregation">Segregación de residuos peligrosos (GRI 306)</option>
                        <option value="neutralization">Uso de kits y neutralización de pH</option>
                      </select>
                    </div>
                  </div>

                  {cl7Feedback && (
                    <div className="text-xs p-3 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-xl">
                      {cl7Feedback}
                    </div>
                  )}

                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleVerifyCl7Step1}
                      className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white cursor-pointer"
                    >
                      Ejecutar Programa de Capacitación ($5,000)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 text-xs">
                  <p className="text-slate-500 dark:text-slate-400 leading-normal">
                    <strong>Paso 2: Entrevista de Toma de Conciencia (Simulación de Auditoría).</strong> El auditor le pregunta a un operario de Producción: <em>&quot;¿Qué compromisos de la política ambiental se aplican a su trabajo diario y qué haría ante un incidente?&quot;</em> Elige la respuesta esperada que demuestre que tu capacitación dio resultados:
                  </p>

                  <div className="flex flex-col gap-2.5 mt-2">
                    <button
                      onClick={() => handleVerifyCl7Step2(1)}
                      className={`text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${
                        cl7QuizAnswer === 1 
                          ? 'border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 font-semibold' 
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <strong>Opción A:</strong> &quot;Sé que debemos prevenir la contaminación optimizando el uso de energía de las prensas para reducir la huella de carbono y que si ocurre un derrame de lubricante, debo ponerme el EPP y llamar al brigadista usando el absorbente del kit.&quot;
                    </button>
                    <button
                      onClick={() => handleVerifyCl7Step2(2)}
                      className={`text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${
                        cl7QuizAnswer === 2 
                          ? 'border-rose-500 bg-rose-500/5 text-rose-700 dark:text-rose-400' 
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <strong>Opción B:</strong> &quot;No recuerdo exactamente los compromisos firmados, pero mi meta diaria es producir la mayor cantidad de piezas y si hay una fuga, limpio con agua de manguera hacia el caño común rápido.&quot;
                    </button>
                  </div>

                  {cl7QuizChecked && (
                    <div className={`text-xs p-3.5 rounded-xl border ${cl7QuizAnswer === 1 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                      {cl7QuizAnswer === 1 
                        ? '¡Correcto! El operario demuestra conocimiento de la política y el protocolo ante incidentes, validando la toma de conciencia del SGA (Cláusula 7.3).' 
                        : '¡Incorrecto! Esa respuesta alertaría de inmediato al auditor, quien registrará una No Conformidad Mayor por fallas en la Cláusula 7.3 y contaminación in situ.'}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3">
                    <button onClick={() => { setCl7Success(false); setCl7QuizChecked(false); setCl7QuizAnswer(null); }} className="text-xs text-slate-400 hover:text-slate-600 font-bold">Atrás</button>
                    {cl7QuizAnswer === 1 && (
                      <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Concientización Certificada
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              CLAUSE 8 WORKSHOP
             ========================================== */}
          {activeTab === 8 && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider">
                  Laboratorio de Control Operacional y Emergencias (§8.1/8.2)
                </h4>
                <div className="flex gap-1.5 text-[10px] font-bold">
                  <span className={`px-2 py-0.5 rounded ${cl8Step === 1 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Paso 1</span>
                  <span className={`px-2 py-0.5 rounded ${cl8Step === 2 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Paso 2</span>
                </div>
              </div>

              {/* EHS Academy Guide Card */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 p-4.5 rounded-2xl flex gap-4 text-xs leading-relaxed shadow-3xs">
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-orange-500/10 rounded-xl text-orange-500 shrink-0 self-start">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs mb-0.5 uppercase tracking-wider">Academia EHS: Cláusula 8 - Control Operacional y Emergencias</h5>
                  <p className="text-slate-500 dark:text-slate-400">
                    <strong>Requisito 8.1 y 8.2:</strong> Planificar e implementar procesos de control operacional aplicando la <strong>Jerarquía de Controles</strong> (Sustitución ➔ Ingeniería ➔ Control Administrativo ➔ EPP). Asimismo, bajo el requisito 8.2 se formulan planes de preparación y respuesta rápida ante emergencias ambientales (derrames o incendios) y se ejecutan simulacros periódicos.
                  </p>
                </div>
              </div>

              {cl8Step === 1 && (
                <div className="flex flex-col gap-3 text-xs">
                  <p className="text-slate-500 dark:text-slate-400 leading-normal">
                    <strong>Paso 1: Aplicación de la Jerarquía de Controles.</strong> Organiza los siguientes controles ambientales para mitigar la no conformidad de lubricantes vertidos in situ en el taller mecánico:
                  </p>

                  <div className="flex flex-col gap-3.5 mt-2">
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Control 1: Cambiar lubricantes de petróleo por bio-degradables</span>
                        <span className="text-[10px] text-slate-400">Acción: Eliminar toxicidad molecular.</span>
                      </div>
                      <select
                        value={cl8Hierarchy.substitute}
                        onChange={(e) => setCl8Hierarchy({ ...cl8Hierarchy, substitute: e.target.value })}
                        className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-40"
                      >
                        <option value="">Nivel de control...</option>
                        <option value="substitute">Sustitución</option>
                        <option value="engineering">Ingeniería</option>
                        <option value="admin">Administrativo</option>
                        <option value="epp">EPP</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Control 2: Construir diques de retención y losa impermeable</span>
                        <span className="text-[10px] text-slate-400">Acción: Contención física de filtraciones.</span>
                      </div>
                      <select
                        value={cl8Hierarchy.engineering}
                        onChange={(e) => setCl8Hierarchy({ ...cl8Hierarchy, engineering: e.target.value })}
                        className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-40"
                      >
                        <option value="">Nivel de control...</option>
                        <option value="substitute">Sustitución</option>
                        <option value="engineering">Ingeniería</option>
                        <option value="admin">Administrativo</option>
                        <option value="epp">EPP</option>
                      </select>
                    </div>

                    <div className="bg-slate-55 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Control 3: Inspección escrita semanal obligatoria del almacén</span>
                        <span className="text-[10px] text-slate-400">Acción: Controles de conducta y registros.</span>
                      </div>
                      <select
                        value={cl8Hierarchy.admin}
                        onChange={(e) => setCl8Hierarchy({ ...cl8Hierarchy, admin: e.target.value })}
                        className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-40"
                      >
                        <option value="">Nivel de control...</option>
                        <option value="substitute">Sustitución</option>
                        <option value="engineering">Ingeniería</option>
                        <option value="admin">Administrativo</option>
                        <option value="epp">EPP</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Control 4: Dotar al técnico de botas químicas y guantes de nitrilo</span>
                        <span className="text-[10px] text-slate-400">Acción: Resguardo personal final.</span>
                      </div>
                      <select
                        value={cl8Hierarchy.epp}
                        onChange={(e) => setCl8Hierarchy({ ...cl8Hierarchy, epp: e.target.value })}
                        className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-40"
                      >
                        <option value="">Nivel de control...</option>
                        <option value="substitute">Sustitución</option>
                        <option value="engineering">Ingeniería</option>
                        <option value="admin">Administrativo</option>
                        <option value="epp">EPP</option>
                      </select>
                    </div>
                  </div>

                  {cl8HierarchyFeedback && (
                    <div className={`text-xs p-3.5 rounded-xl border ${cl8HierarchySuccess ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                      {cl8HierarchyFeedback}
                    </div>
                  )}

                  <div className="flex justify-end gap-2.5 mt-2">
                    <button
                      onClick={handleVerifyHierarchy}
                      className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 rounded-xl text-white cursor-pointer"
                    >
                      Verificar Jerarquía
                    </button>
                    {cl8HierarchySuccess && (
                      <button
                        onClick={() => { setCl8Step(2); setCl8HierarchyFeedback(null); }}
                        className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white cursor-pointer"
                      >
                        Siguiente Paso
                      </button>
                    )}
                  </div>
                </div>
              )}

              {cl8Step === 2 && (
                <div className="flex flex-col gap-3 text-xs">
                  <p className="text-slate-500 dark:text-slate-400 leading-normal">
                    <strong>Paso 2: Simulador Interactivo de Emergencias (§8.2).</strong> ¡ALERTA! Se ha quebrado un bidón de ácido de 50L en el laboratorio químico. Toma las decisiones en orden lógico:
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                    <span className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-[10px]">
                      Fase Actual: {cl8DrillStep === 1 ? 'Seguridad del Brigadista' : cl8DrillStep === 2 ? 'Confinamiento de Sustancia' : 'Disposición de Residuos'}
                    </span>
                    <p className="text-[11px] leading-relaxed text-slate-500 bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      {cl8DrillStep === 1 
                        ? 'El ácido nítrico se expande en el piso de cemento emitiendo gases irritantes. Un operario entra en pánico.' 
                        : cl8DrillStep === 2 
                          ? 'Estás equipado con el respirador y traje protector. El ácido avanza hacia el sumidero pluvial que conecta con el río.' 
                          : 'El ácido ha sido neutralizado y absorbido por las mangas de polietileno. El piso está seco, pero tienes 15 kg de absorbentes empapados.'}
                    </p>

                    <div className="flex flex-col gap-2 mt-1">
                      {cl8DrillStep === 1 && !cl8DrillFail && (
                        <>
                          <button onClick={() => handleDrillOption(1, 'epp')} className="text-left p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                            Equiparse EPP con respirador químico de inmediato e identificar la hoja MSDS.
                          </button>
                          <button onClick={() => handleDrillOption(1, 'wash')} className="text-left p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-500 font-semibold">
                            Lavar el derrame arrojándole agua de manguera para diluir el ácido rápidamente.
                          </button>
                        </>
                      )}

                      {cl8DrillStep === 2 && !cl8DrillFail && (
                        <>
                          <button onClick={() => handleDrillOption(2, 'absorbent')} className="text-left p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                            Rodear el perímetro del derrame con barreras absorbentes del kit y neutralizar con carbonato sódico.
                          </button>
                          <button onClick={() => handleDrillOption(2, 'flush')} className="text-left p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                            Abrir la llave de paso de agua para forzar la dilución hacia el desagüe común.
                          </button>
                        </>
                      )}

                      {cl8DrillStep === 3 && !cl8DrillFail && (
                        <>
                          <button onClick={() => handleDrillOption(3, 'red')} className="text-left p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                            Disponer los absorbentes en bolsas rojas gruesas y depositarlos en el contenedor de residuos peligrosos.
                          </button>
                          <button onClick={() => handleDrillOption(3, 'trash')} className="text-left p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                            Descartar los paños en el tacho de basura municipal urbana para ahorrar costos de disposición.
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {cl8DrillFeedback && (
                    <div className={`text-xs p-3.5 rounded-xl border ${cl8DrillFail ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}>
                      {cl8DrillFeedback}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3">
                    <button onClick={() => setCl8Step(1)} className="text-xs text-slate-400 hover:text-slate-600 font-bold">Atrás</button>
                    {cl8DrillFail && (
                      <button onClick={resetDrill} className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer">
                        Reiniciar Simulacro
                      </button>
                    )}
                    {cl8DrillSuccess && (
                      <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Simulacro Consolidado
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              CLAUSE 9 WORKSHOP
             ========================================== */}
          {activeTab === 9 && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider">
                  Evaluación de Desempeño y Auditoría Interna (§9.1.1/9.2)
                </h4>
                <div className="flex gap-1.5 text-[10px] font-bold">
                  <span className={`px-2 py-0.5 rounded ${cl9Step >= 1 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Paso 1</span>
                  <span className={`px-2 py-0.5 rounded ${cl9Step >= 2 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Paso 2</span>
                </div>
              </div>

              {/* EHS Academy Guide Card */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 p-4.5 rounded-2xl flex gap-4 text-xs leading-relaxed shadow-3xs">
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-indigo-500/10 rounded-xl text-indigo-500 shrink-0 self-start">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs mb-0.5 uppercase tracking-wider">Academia EHS: Cláusula 9 - Evaluación del Desempeño</h5>
                  <p className="text-slate-500 dark:text-slate-400">
                    <strong>Requisito 9.1 y 9.2:</strong> Realizar el seguimiento, medición, análisis y evaluación del desempeño ambiental de la planta (usando KPIs como consumo energético y tasa de reciclaje). Se deben conducir auditorías internas independientes (§9.2) periódicas para verificar la conformidad con los requisitos del SGA y reportar los hallazgos a la dirección.
                  </p>
                </div>
              </div>

              {cl9Step === 1 && (
                <div className="flex flex-col gap-3 text-xs">
                  <p className="text-slate-500 dark:text-slate-400 leading-normal">
                    <strong>Paso 1: Mapeo de Indicadores GRI y Alcances (GHG).</strong> Relaciona los KPIs de la planta industrial con sus respectivos estándares de reporte GRI y alcances de emisiones:
                  </p>

                  <div className="flex flex-col gap-3.5 mt-2">
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Consumo eléctrico de la red (43,200 kWh)</span>
                        <span className="text-[10px] text-slate-400">KPI: Eficiencia energética.</span>
                      </div>
                      <select
                        value={cl9Gri.energy}
                        onChange={(e) => setCl9Gri({ ...cl9Gri, energy: e.target.value })}
                        className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-44"
                      >
                        <option value="">Código estándar...</option>
                        <option value="302">GRI 302: Energía</option>
                        <option value="303">GRI 303: Agua y Efluentes</option>
                        <option value="305-1">GRI 305-1: Emisiones Scope 1</option>
                        <option value="305-2">GRI 305-2: Emisiones Scope 2</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Captación y efluente vertido (1.2 m³/t con pH 8.2)</span>
                        <span className="text-[10px] text-slate-400">KPI: Control de descargas líquidas al río.</span>
                      </div>
                      <select
                        value={cl9Gri.water}
                        onChange={(e) => setCl9Gri({ ...cl9Gri, water: e.target.value })}
                        className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-44"
                      >
                        <option value="">Código estándar...</option>
                        <option value="302">GRI 302: Energía</option>
                        <option value="303">GRI 303: Agua y Efluentes</option>
                        <option value="305-1">GRI 305-1: Emisiones Scope 1</option>
                        <option value="305-2">GRI 305-2: Emisiones Scope 2</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Consumo de diésel de camiones (Flota Logística Directa)</span>
                        <span className="text-[10px] text-slate-400">Emisiones Directas de Combustión.</span>
                      </div>
                      <select
                        value={cl9Gri.scope1}
                        onChange={(e) => setCl9Gri({ ...cl9Gri, scope1: e.target.value })}
                        className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-44"
                      >
                        <option value="">Código estándar...</option>
                        <option value="302">GRI 302: Energía</option>
                        <option value="303">GRI 303: Agua y Efluentes</option>
                        <option value="305-1">GRI 305-1: Emisiones Scope 1</option>
                        <option value="305-2">GRI 305-2: Emisiones Scope 2</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Emisiones indirectas por la generación eléctrica de la red</span>
                        <span className="text-[10px] text-slate-400">Huella eléctrica externa.</span>
                      </div>
                      <select
                        value={cl9Gri.scope2}
                        onChange={(e) => setCl9Gri({ ...cl9Gri, scope2: e.target.value })}
                        className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-44"
                      >
                        <option value="">Código estándar...</option>
                        <option value="302">GRI 302: Energía</option>
                        <option value="303">GRI 303: Agua y Efluentes</option>
                        <option value="305-1">GRI 305-1: Emisiones Scope 1</option>
                        <option value="305-2">GRI 305-2: Emisiones Scope 2</option>
                      </select>
                    </div>
                  </div>

                  {cl9GriFeedback && (
                    <div className={`text-xs p-3.5 rounded-xl border ${cl9GriSuccess ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                      {cl9GriFeedback}
                    </div>
                  )}

                  <div className="flex justify-end gap-2.5 mt-2">
                    <button
                      onClick={handleVerifyGri}
                      className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 rounded-xl text-white cursor-pointer"
                    >
                      Alinear con Estándares GRI
                    </button>
                    {cl9GriSuccess && (
                      <button
                        onClick={() => { setCl9Step(2); setCl9GriFeedback(null); }}
                        className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white cursor-pointer"
                      >
                        Siguiente Paso
                      </button>
                    )}
                  </div>
                </div>
              )}

              {cl9Step === 2 && (
                <div className="flex flex-col gap-3 text-xs">
                  <p className="text-slate-500 dark:text-slate-400 leading-normal">
                    <strong>Paso 2: Clasificación de Hallazgos en Auditoría Interna (§9.2).</strong> Actúa como auditor líder y clasifica cada uno de los siguientes hallazgos encontrados en los registros operativos:
                  </p>

                  <div className="flex flex-col gap-3.5 mt-2">
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Hallazgo 1: Política ambiental sin firmar por el CEO actual.</span>
                        <span className="text-[10px] text-slate-400">Evidencia: La versión oficial web carece de firma digital.</span>
                      </div>
                      <select
                        value={cl9Audit.f1}
                        onChange={(e) => setCl9Audit({ ...cl9Audit, f1: e.target.value })}
                        className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-44"
                      >
                        <option value="">Tipo de Hallazgo...</option>
                        <option value="ncmayor">No Conformidad Mayor</option>
                        <option value="ncmenor">No Conformidad Menor</option>
                        <option value="om">Oportunidad de Mejora</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Hallazgo 2: Medidores de caudal de vertimiento sin calibración anual.</span>
                        <span className="text-[10px] text-slate-400">Evidencia: Calibración vencida hace 4 meses.</span>
                      </div>
                      <select
                        value={cl9Audit.f2}
                        onChange={(e) => setCl9Audit({ ...cl9Audit, f2: e.target.value })}
                        className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-44"
                      >
                        <option value="">Tipo de Hallazgo...</option>
                        <option value="ncmayor">No Conformidad Mayor</option>
                        <option value="ncmenor">No Conformidad Menor</option>
                        <option value="om">Oportunidad de Mejora</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Hallazgo 3: Pictogramas de advertencia desgastados en almacén.</span>
                        <span className="text-[10px] text-slate-400">Evidencia: Las etiquetas secundarias del suelo se desvanecieron.</span>
                      </div>
                      <select
                        value={cl9Audit.f3}
                        onChange={(e) => setCl9Audit({ ...cl9Audit, f3: e.target.value })}
                        className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-44"
                      >
                        <option value="">Tipo de Hallazgo...</option>
                        <option value="ncmayor">No Conformidad Mayor</option>
                        <option value="ncmenor">No Conformidad Menor</option>
                        <option value="om">Oportunidad de Mejora</option>
                      </select>
                    </div>
                  </div>

                  {cl9AuditFeedback && (
                    <div className={`text-xs p-3.5 rounded-xl border ${cl9AuditSuccess ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                      {cl9AuditFeedback}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3">
                    <button onClick={() => setCl9Step(1)} className="text-xs text-slate-400 hover:text-slate-600 font-bold">Atrás</button>
                    {!cl9AuditSuccess ? (
                      <button
                        onClick={handleVerifyCl9Audit}
                        className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white cursor-pointer"
                      >
                        Validar Hallazgos de Auditoría
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Informe de Auditoría Aprobado
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              CLAUSE 10 WORKSHOP
             ========================================== */}
          {activeTab === 10 && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider">
                  Acciones Correctivas y Taller de 5 Porqués (§10.2)
                </h4>
                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded px-2 py-0.5">Doing to Learn</span>
              </div>

              {/* EHS Academy Guide Card */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 p-4.5 rounded-2xl flex gap-4 text-xs leading-relaxed shadow-3xs">
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-rose-500/10 rounded-xl text-rose-500 shrink-0 self-start">
                  <AlertCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs mb-0.5 uppercase tracking-wider">Academia EHS: Cláusula 10 - Mejora y Acciones Correctivas</h5>
                  <p className="text-slate-500 dark:text-slate-400">
                    <strong>Requisito 10.2 y 10.3:</strong> Cuando ocurra una no conformidad (por ejemplo, incumplimiento legal de vertidos o fallos de control), la empresa debe reaccionar de forma inmediata: determinar la causa raíz del fallo y establecer <strong>acciones correctivas</strong> eficaces para evitar su recurrencia, logrando así la mejora continua del SGA.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                <p className="text-slate-500 dark:text-slate-400 leading-normal">
                  <strong>Cláusula 10.2 Lab: Causa Raíz.</strong> Se detectó plomo por encima del LMP legal en el vertimiento hídrico. Reconstruye de forma descendente y lógica los 5 Porqués para identificar la falla sistémica:
                </p>

                <div className="flex flex-col gap-3.5 mt-2">
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">1. ¿Por qué ocurrió la descarga de plomo?</span>
                    <select
                      value={cl10Whys.w1}
                      onChange={(e) => setCl10Whys({ ...cl10Whys, w1: e.target.value })}
                      className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-52"
                    >
                      <option value="">Seleccionar causa...</option>
                      <option value="q1">El río se contaminó porque la planta de tratamiento vertió agua sin filtrar.</option>
                      <option value="q2">La planta vertió agua sin filtrar porque el filtro de ósmosis estaba colmatado.</option>
                      <option value="q3">El filtro colapsó porque no se le realizó la limpieza ni el mantenimiento semanal.</option>
                      <option value="q4">No se hizo mantenimiento porque el personal de procesos no tenía órdenes de revisión.</option>
                      <option value="q5">No había órdenes porque no existían procedimientos documentados ni roles asignados para inspeccionar el filtro.</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">2. ¿Por qué la planta vertió agua sin filtrar?</span>
                    <select
                      value={cl10Whys.w2}
                      onChange={(e) => setCl10Whys({ ...cl10Whys, w2: e.target.value })}
                      className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-52"
                    >
                      <option value="">Seleccionar causa...</option>
                      <option value="q1">El río se contaminó porque la planta de tratamiento vertió agua sin filtrar.</option>
                      <option value="q2">La planta vertió agua sin filtrar porque el filtro de ósmosis estaba colmatado.</option>
                      <option value="q3">El filtro colapsó porque no se le realizó la limpieza ni el mantenimiento semanal.</option>
                      <option value="q4">No se hizo mantenimiento porque el personal de procesos no tenía órdenes de revisión.</option>
                      <option value="q5">No había órdenes porque no existían procedimientos documentados ni roles asignados para inspeccionar el filtro.</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">3. ¿Por qué el filtro colapsó por lodos?</span>
                    <select
                      value={cl10Whys.w3}
                      onChange={(e) => setCl10Whys({ ...cl10Whys, w3: e.target.value })}
                      className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-52"
                    >
                      <option value="">Seleccionar causa...</option>
                      <option value="q1">El río se contaminó porque la planta de tratamiento vertió agua sin filtrar.</option>
                      <option value="q2">La planta vertió agua sin filtrar porque el filtro de ósmosis estaba colmatado.</option>
                      <option value="q3">El filtro colapsó porque no se le realizó la limpieza ni el mantenimiento semanal.</option>
                      <option value="q4">No se hizo mantenimiento porque el personal de procesos no tenía órdenes de revisión.</option>
                      <option value="q5">No había órdenes porque no existían procedimientos documentados ni roles asignados para inspeccionar el filtro.</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">4. ¿Por qué no se le hizo limpieza?</span>
                    <select
                      value={cl10Whys.w4}
                      onChange={(e) => setCl10Whys({ ...cl10Whys, w4: e.target.value })}
                      className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-52"
                    >
                      <option value="">Seleccionar causa...</option>
                      <option value="q1">El río se contaminó porque la planta de tratamiento vertió agua sin filtrar.</option>
                      <option value="q2">La planta vertió agua sin filtrar porque el filtro de ósmosis estaba colmatado.</option>
                      <option value="q3">El filtro colapsó porque no se le realizó la limpieza ni el mantenimiento semanal.</option>
                      <option value="q4">No se hizo mantenimiento porque el personal de procesos no tenía órdenes de revisión.</option>
                      <option value="q5">No había órdenes porque no existían procedimientos documentados ni roles asignados para inspeccionar el filtro.</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">5. ¿Por qué no tenían órdenes ni roles?</span>
                    <select
                      value={cl10Whys.w5}
                      onChange={(e) => setCl10Whys({ ...cl10Whys, w5: e.target.value })}
                      className="text-[10px] p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 w-52"
                    >
                      <option value="">Seleccionar causa...</option>
                      <option value="q1">El río se contaminó porque la planta de tratamiento vertió agua sin filtrar.</option>
                      <option value="q2">La planta vertió agua sin filtrar porque el filtro de ósmosis estaba colmatado.</option>
                      <option value="q3">El filtro colapsó porque no se le realizó la limpieza ni el mantenimiento semanal.</option>
                      <option value="q4">No se hizo mantenimiento porque el personal de procesos no tenía órdenes de revisión.</option>
                      <option value="q5">No había órdenes porque no existían procedimientos documentados ni roles asignados para inspeccionar el filtro.</option>
                    </select>
                  </div>
                </div>

                {cl10Feedback && (
                  <div className={`text-xs p-3.5 rounded-xl border ${cl10Success ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                    {cl10Feedback}
                  </div>
                )}

                <div className="flex justify-end mt-2">
                  {!cl10Success ? (
                    <button
                      onClick={handleVerifyCl10}
                      className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white cursor-pointer"
                    >
                      Ejecutar Análisis Causa Raíz
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Desvío Cerrado Correctamente
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Side (2/5): Rich Reference Study Hub */}
        <div className="xl:col-span-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-5 shadow-sm justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5 border-b border-slate-200/60 dark:border-slate-800 pb-3">
              <BookOpen className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider">
                  Centro de Referencia y Guía de Estudio
                </h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-0.5">
                  Biblioteca ISO 14001:2026 (4ª Edición)
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[420px] pr-1 text-xs leading-normal">
              {/* Title */}
              <div>
                <h5 className="font-extrabold text-slate-800 dark:text-white text-[13px] leading-snug">
                  {edu.title}
                </h5>
              </div>

              {/* Requerimientos */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Requisitos de la Norma</span>
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-slate-600 dark:text-slate-300 flex flex-col gap-2 shadow-2xs">
                  {edu.requirements.map((req, idx) => (
                    <p key={idx} dangerouslySetInnerHTML={{ 
                      __html: req.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }} />
                  ))}
                </div>
              </div>

              {/* Definiciones */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Glosario y Conceptos Clave</span>
                <div className="flex flex-col gap-2">
                  {edu.definitions.map((d, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs">
                      <span className="font-black text-emerald-600 dark:text-emerald-400 block mb-1 text-[10px] uppercase">{d.term}</span>
                      <p className="text-slate-500 dark:text-slate-400 leading-normal">{d.definition}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Caso Práctico */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Caso Práctico Industrial</span>
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-xl text-slate-600 dark:text-slate-300 leading-relaxed shadow-2xs">
                  <p>{edu.caseStudy}</p>
                </div>
              </div>

              {/* Tips del Auditor */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Criterio de Auditoría</span>
                <div className="bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl text-slate-600 dark:text-slate-300 leading-relaxed shadow-2xs flex gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p>{edu.auditorTips}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom stats recap widget */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 bg-slate-100/50 dark:bg-slate-950/20 p-3.5 rounded-xl flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="flex flex-col">
              <span className="text-slate-400">Progreso</span>
              <span className="text-slate-800 dark:text-white text-xs mt-0.5">Nivel {level}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-slate-400">Puntaje Competencia</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-xs mt-0.5">{awarenessScore}% / 100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
