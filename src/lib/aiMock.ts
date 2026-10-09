import { GameState } from '@/store/gameStore';

export const getAiMockResponse = (
  agent: 'auditor' | 'consultor' | 'inspector' | 'ceo',
  userText: string,
  state: GameState
): string => {
  const query = userText.toLowerCase();
  
  // Extract state details
  const policySigned = state.documents.find(d => d.type === 'policy')?.status === 'approved_ceo';
  const aspectMatrixFilled = state.documents.find(d => d.type === 'aspect_matrix')?.status !== 'draft';

  const allCompliant = state.legalMatrix.every(l => l.status === 'compliant');
  const nonCompliantRules = state.legalMatrix.filter(l => l.status === 'non_compliant');
  const openIncidents = state.incidents.filter(i => i.status === 'open');
  const trainingScore = state.awarenessScore;
  const climateDetermined = state.climateRelevanceDetermined;
  
  // --- AUDITOR IA ---
  if (agent === 'auditor') {
    if (query.includes('auditoria') || query.includes('certificar') || query.includes('final') || query.includes('aprobar')) {
      const checklist = [];
      if (policySigned) checklist.push('✅ Cláusula 5.2: Política Ambiental firmada por Alta Dirección.');
      else checklist.push('❌ Cláusula 5.2: Política Ambiental sin firmar.');
      
      if (climateDetermined) checklist.push('✅ Cláusula 4.1: Cambio climático evaluado (Enmienda 2024).');
      else checklist.push('❌ Cláusula 4.1: Falta determinar relevancia del cambio climático.');
      
      if (aspectMatrixFilled) checklist.push('✅ Cláusula 6.1.2: Aspectos e Impactos identificados.');
      else checklist.push('❌ Cláusula 6.1.2: Matriz de aspectos en borrador.');
      
      if (allCompliant) checklist.push('✅ Cláusula 6.1.3: Matriz legal al 100% de cumplimiento.');
      else checklist.push(`❌ Cláusula 6.1.3: Incumplimiento legal detectado (${nonCompliantRules.length} regulaciones pendientes).`);
      
      if (trainingScore >= 60) checklist.push(`✅ Cláusula 7.2: Competencia del personal apta (${trainingScore}%).`);
      else checklist.push(`❌ Cláusula 7.2: Nivel de concientización bajo (${trainingScore}%, requiere capacitaciones).`);
      
      if (openIncidents.length === 0) checklist.push('✅ Cláusula 10.2: Cero incidentes o no conformidades abiertas.');
      else checklist.push(`❌ Cláusula 10.2: Existen ${openIncidents.length} incidentes pendientes de corregir.`);

      return `### Reporte de Auditoría de Certificación (Pre-evaluación):
Aquí está el estado actual del cumplimiento bajo la norma ISO 14001:2026:

${checklist.join('\n')}

**Estado de la probabilidad de certificación:** ${state.certificationProbability}%.
${state.certificationProbability >= 80 
  ? 'El sistema cuenta con la madurez necesaria. Puede proceder a solicitar la Auditoría Final de Certificación.' 
  : 'Aún tiene brechas importantes. El consultor puede guiarle en las cláusulas con tachas rojas.'}`;
    }

    if (query.includes('aspecto') || query.includes('impacto') || query.includes('6.1.2')) {
      return aspectMatrixFilled
        ? 'He verificado la **Matriz de Aspectos e Impactos Ambientales**. Muestra una metodología clara basada en Severidad x Probabilidad y define la significancia. Buen trabajo con el cumplimiento de la cláusula 6.1.2.'
        : 'La **Cláusula 6.1.2** exige identificar los aspectos ambientales de sus actividades que puede controlar y sus impactos asociados. Actualmente su matriz está vacía o en borrador. Complete el análisis en la pestaña de Cláusulas > Planificación.';
    }

    if (query.includes('politica') || query.includes('5.2')) {
      return policySigned
        ? 'La **Política Ambiental (Cláusula 5.2)** está firmada y disponible. Incluye el compromiso de protección ambiental, cumplimiento legal, mejora continua y mitigación del cambio climático. Cumplimiento OK.'
        : 'Observo que ha redactado la Política Ambiental pero **no ha sido firmada por la Dirección General**. Sin la firma de la alta dirección, esta política carece de validez legal para el auditor. Diríjase al Despacho del Director General para que la oficialice.';
    }

    if (query.includes('legal') || query.includes('cumplimiento') || query.includes('6.1.3')) {
      return allCompliant
        ? 'Excelente. La organización no registra incumplimientos normativos activos. Esto reduce sustancialmente el riesgo de una no conformidad mayor durante la auditoría de certificación.'
        : `Atención: Su cumplimiento legal es de solo ${state.legalCompliance}%. Registra ${nonCompliantRules.length} incumplimientos normativos activos. Le recuerdo que **el cumplimiento legal es un requisito no negociable** para obtener la certificación ISO 14001. Debe activar los controles operativos adecuados en las áreas correspondientes.`;
    }

    if (query.includes('emergencia') || query.includes('simulacro') || query.includes('8.2')) {
      const activeEmergencyControls = state.areas.alm.controls.find(c => c.id === 'alm_bunds')?.active;
      return activeEmergencyControls 
        ? 'Veo que ha establecido cubetos de retención en el almacén químicos. Esto demuestra control operativo ante emergencias (Cláusula 8.2).'
        : 'Para la **Cláusula 8.2 (Preparación ante emergencias)**, requiero evidencia de que existen planes y equipamiento de contención para responder ante incidentes de derrame o incendios. Actualmente hay riesgos altos en el Almacén y el Patio de Residuos.';
    }

    if (query.includes('objetivo') || query.includes('programa') || query.includes('6.2')) {
      const objFilled = state.documents.find(d => d.id === 'objectives_doc')?.status !== 'draft';
      const prgFilled = state.documents.find(d => d.id === 'programs_doc')?.status !== 'draft';
      return objFilled && prgFilled
        ? 'Cumplimiento de la **Cláusula 6.2** verificado. Los Objetivos Ambientales están definidos y alineados con los Programas de Gestión que detallan plazos, presupuestos y responsabilidades específicas. Excelente planificación.'
        : 'Para la **Cláusula 6.2 (Objetivos y Programas)**, requiero ver los Objetivos Ambientales y sus Programas de Gestión (PGA) fuera de borrador. Asegúrese de redactarlos y guardarlos en el Centro de Documentos.';
    }

    if (query.includes('procedimiento') || query.includes('registro') || query.includes('8.1') || query.includes('7.5')) {
      const procFilled = state.documents.find(d => d.id === 'procedures_doc')?.status !== 'draft';
      const recFilled = state.documents.find(d => d.id === 'records_doc')?.status !== 'draft';
      return procFilled && recFilled
        ? 'La documentación operativa cumple con los requisitos de la **Cláusula 8.1** (Control Operacional) y **Cláusula 7.5** (Información Documentada). Contamos con procedimientos de contención de derrames y registros oficiales de capacitación.'
        : 'Brecha detectada: La norma exige procedimientos documentados para operaciones críticas (§8.1) y registros como evidencia objetiva de competencia (§7.2/7.5). Actualmente sus Procedimientos y Registros están en borrador en el Centro de Documentos.';
    }

    if (query.includes('kpi') || query.includes('indicador') || query.includes('9.1')) {
      const kpiFilled = state.documents.find(d => d.id === 'kpis_doc')?.status !== 'draft';
      return kpiFilled
        ? 'He auditado la Hoja de Indicadores (KPIs). Cumple adecuadamente con la **Cláusula 9.1.1 (Seguimiento, medición, análisis y evaluación)**, mostrando metas claras para energía, agua y emisiones Scope 1/2.'
        : 'Para cumplir con la **Cláusula 9.1 (Evaluación del desempeño)**, es imperativo establecer KPIs cuantificables en su Hoja Mensual de Indicadores. Agréguelos y guárdelos en el Centro de Documentos.';
    }

    if (query.includes('ghg') || query.includes('sbti') || query.includes('gri') || query.includes('sdg') || query.includes('ods')) {
      return 'Auditoría Climática: Evaluando enmiendas de Acción Climática (Cláusula 4.1/4.2). Su alineación con el **GHG Protocol** para Scope 1/2/3, la formulación de metas **SBTi** a 1.5°C, el reporte bajo **GRI Standards** (302, 303, 305) y el mapeo de los **ODS (6, 12, 13)** demuestra un sistema de clase mundial. Siga implementando controles operacionales para sustentar estas declaraciones.';
    }

    return `Entendido. Evaluando el Sistema de Gestión Ambiental bajo los estándares ISO 14001:2026. 
Su nivel actual de madurez arroja un **Score Ambiental del ${state.environmentalScore}%** y un **Riesgo Operativo del ${state.operationalRisk}%**. 
¿Desea que evaluemos una cláusula específica, la política ambiental, la matriz de aspectos (6.1.2) o la gestión de cambios (6.3) en la preparación para la certificación?`;
  }

  // --- CONSULTOR IA ---
  if (agent === 'consultor') {
    if (query.includes('clausula 4') || query.includes('contexto') || query.includes('foda') || query.includes('pestel') || query.includes('partes interesadas')) {
      return `### Guía de la Cláusula 4: Contexto de la Organización
Para cumplir con esta sección de la norma, debes:
1. **FODA / PESTEL**: Identificar factores internos y externos. Presta atención al **Cambio Climático** (Enmienda ISO 2024).
2. **Cambio Climático**: Determinar si la empresa se ve afectada por inundaciones, estrés hídrico o si las partes interesadas exigen descarbonización.
3. **Partes Interesadas**: Registrar los requisitos de la Comunidad Vecina y de OEFA.
4. **Alcance**: Redactar una declaración que especifique las fronteras de tu SGA (ej. "Diseño y fabricación de componentes en la planta central").

*Haz esto desde la pestaña de Cláusula 4 en la barra de herramientas.*`;
    }

    if (query.includes('clausula 5') || query.includes('liderazgo') || query.includes('politica') || query.includes('roles')) {
      return `### Guía de la Cláusula 5: Liderazgo
El liderazgo de la Alta Dirección se demuestra mediante:
1. **Política Ambiental**: Debe contener los compromisos de prevención, legalidad y mejora continua. Debe ser firmada por el CEO.
2. **Matriz de Roles**: Asignar líderes responsables para el control de operaciones, reportes de auditoría y simulacros.

*Acciones clave: Redactar la política en la sección de documentos, ir a la Dirección General para la firma, y asignar cargos.*`;
    }

    if (query.includes('clausula 6') || query.includes('planificacion') || query.includes('aspectos') || query.includes('impactos') || query.includes('legal')) {
      return `### Guía de la Cláusula 6: Planificación
La planificación se enfoca en gestionar riesgos y oportunidades:
1. **Aspectos e Impactos**: Evaluar la severidad y probabilidad. Los aspectos con valor >= 12 son significativos.
2. **Requisitos Legales**: Identificar normas nacionales aplicables.
3. **Objetivos**: Plantear metas de reducción de agua, energía o carbono.

*Recomendación: Entra a Cláusula 6 y define los riesgos ambientales.*`;
    }

    if (query.includes('clausula 7') || query.includes('apoyo') || query.includes('recursos') || query.includes('capacitar') || query.includes('concienciar')) {
      return `### Guía de la Cláusula 7: Apoyo
La organización debe proveer recursos y asegurar la competencia:
1. **Capacitación**: Ejecuta talleres ambientales para aumentar la competencia del personal.
2. **Toma de Conciencia**: Asegura que los operarios de Producción y Patio de Residuos conozcan la política.

*Recomendación: Utiliza la sección "Capacitar Personal" en la Cláusula 7. Esto aumentará de inmediato la competencia.*`;
    }

    if (query.includes('clausula 8') || query.includes('operacion') || query.includes('control') || query.includes('compras')) {
      return `### Guía de la Cláusula 8: Operación
La cláusula 8 exige controles operativos en las áreas críticas:
1. **Controles**: Ve al Mapa y compra/activa equipos ecológicos (ej. cubetos en Almacén, scrubber en Laboratorio).
2. **Ciclo de vida**: Integra criterios verdes en las compras de materias primas.
3. **Emergencias**: Prepara kits y duchas de emergencia.`;
    }

    if (query.includes('clausula 9') || query.includes('evaluacion') || query.includes('desempeño') || query.includes('auditoria interna')) {
      return `### Guía de la Cláusula 9: Evaluación del Desempeño
Deberás monitorear y medir los indicadores claves:
1. **Monitoreo**: Revisa las gráficas de consumo eléctrico, consumo de agua y huella de carbono.
2. **Auditoría Interna**: Realiza una evaluación previa de tus documentos antes de pasar a la auditoría de certificación.
3. **Revisión por la Dirección**: Presentar un resumen ejecutivo del desempeño anual al Director General.`;
    }

    if (query.includes('clausula 10') || query.includes('mejora') || query.includes('no conformidad') || query.includes('5 porques')) {
      return `### Guía de la Cláusula 10: Mejora
Cuando ocurra un incidente o desvío legal (No Conformidad):
1. **Acción Correctiva**: Investigar la causa raíz utilizando el método de los 5 Porqués.
2. **Implementar acciones**: Evitar que el evento vuelva a suceder.

*Si tienes incidentes abiertos en Almacén u otra área, resuélvelos de inmediato en la pestaña Cláusula 10.*`;
    }

    if (query.includes('ghg') || query.includes('sbti') || query.includes('gri') || query.includes('sdg') || query.includes('ods') || query.includes('carbono')) {
      return `### Marcos de Desempeño y Clima (Guía del Consultor):
1. **GHG Protocol (Huella de Carbono)**: Clasifica las emisiones en:
   * **Alcance 1 (Directo)**: Emisiones in situ (ej. combustión de diésel).
   * **Alcance 2 (Indirecto Eléctrico)**: Emisiones por consumo de electricidad de la red.
   * **Alcance 3 (Cadena de Suministro)**: Logística, materias primas compradas y transporte de terceros.
2. **SBTi (Science Based Targets)**: Metas científicas obligatorias para limitar el calentamiento global a 1.5°C.
3. **GRI Standards (Reporte)**: Estándares internacionales de reporte: GRI 302 (Energía), GRI 303 (Agua/Efluentes), GRI 305 (Emisiones).
4. **ODS (Objetivos ONU)**: Recomiendo alinear su SGA con el **ODS 6** (Agua limpia), **ODS 12** (Consumo responsable) y **ODS 13** (Acción por el clima). Esto demuestra madurez estratégica al auditor.`;
    }

    if (query.includes('objetivo') || query.includes('programa') || query.includes('procedimiento') || query.includes('registro') || query.includes('kpi') || query.includes('indicador')) {
      return `### Estructura Documental Recomendada (§6.2, §7.5, §8.1):
1. **Objetivos Ambientales**: Metas medibles (ej. -20% energía) con plazos y responsables definidos en los **Programas (PGA)**.
2. **Procedimientos (SOP)**: Guías paso a paso para tareas de alto riesgo o control (como el procedimiento de derrames EP-SOP-001).
3. **Registros**: Evidencia de firmas de capacitación o bitácoras de simulacros. Es lo que el auditor pide para validar la toma de conciencia (§7.3).
4. **KPIs**: Indicadores cuantitativos mensuales (kWh/ton, m3/ton, kg CO2e) para evaluar el desempeño (§9.1).`;
    }

    return `¡Hola! Soy tu Consultor ISO 14001. Puedo guiarte detalladamente a través de los requisitos de la norma.
¿Sobre qué cláusula (4, 5, 6, 7, 8, 9 o 10) tienes dudas hoy? También puedes preguntarme sobre cómo resolver incidentes o estructurar matrices ambientales.`;
  }

  // --- INSPECTOR IA ---
  if (agent === 'inspector') {
    if (query.includes('multa') || query.includes('sancion') || query.includes('clausura') || query.includes('legal')) {
      return `### Reporte de Fiscalización Ambiental:
* **Estado de Cumplimiento Legal:** ${state.legalCompliance}%
* **Incumplimientos Activos:** ${nonCompliantRules.length}

Las multas actuales por cada infracción no mitigada ascienden a:
${state.legalMatrix.map(l => `- **[${l.id}] ${l.area}**: $${l.penalty.toLocaleString()} (${l.status === 'compliant' ? '✅ SUBSANADO' : '❌ PENDIENTE MULTA'})`).join('\n')}

**Advertencia:** Si mantenemos un nivel de cumplimiento legal inferior al 50% por más de 3 semanas seguidas, procederé a emitir una orden de suspensión parcial de actividades en Producción.`;
    }

    if (query.includes('derrame') || query.includes('quimico') || query.includes('suelo')) {
      const activeBunds = state.areas.alm.controls.find(c => c.id === 'alm_bunds')?.active;
      return activeBunds
        ? 'El área de Almacén cuenta con cubetos de retención del 110%. Esto cumple con el estándar de almacenamiento de reactivos. No hay infracciones asociadas.'
        : 'Alerta: Los reactivos y solventes del Almacén se encuentran directamente sobre el suelo sin diques de contención secundaria. En caso de una fuga, el suelo absorberá los ácidos. Esto amerita una infracción grave con multa directa.';
    }

    if (query.includes('residuos') || query.includes('mezcla') || query.includes('patio')) {
      const activeBins = state.areas.patio.controls.find(c => c.id === 'patio_bins')?.active;
      const activeCanopy = state.areas.patio.controls.find(c => c.id === 'patio_canopy')?.active;
      
      if (activeBins && activeCanopy) {
        return 'Hemos verificado el Patio de Residuos. Cuenta con techado para evitar lixiviados por lluvia y los contenedores de segregación están correctamente etiquetados. Sanción archivada.';
      } else {
        return 'Infracción detectada en Patio de Residuos: Se observa mezcla de residuos peligrosos (trapos con aceite, envases de pintura) con basura común, expuestos a la lluvia. Se genera lixiviación ácida hacia el suelo. Debe techamiento e instalar contenedores segregados.';
      }
    }

    if (query.includes('agua') || query.includes('vertido') || query.includes('rio') || query.includes('efluente')) {
      const activeOsmosis = state.areas.pt.controls.find(c => c.id === 'pt_osmosis')?.active;
      return activeOsmosis
        ? 'El vertimiento se encuentra controlado mediante ósmosis inversa de pulido. Los metales pesados y la DBO5 están dentro de los Límites Máximos Permisibles (LMP).'
        : 'Infracción crítica: La planta de tratamiento de efluentes no cuenta con un sistema de filtración secundario. Los análisis indican exceso de DBO5 y sedimentos vertidos al río local. El OEFA aplicará multas severas si esto no se subsana.';
    }
    
    if (query.includes('ghg') || query.includes('sbti') || query.includes('gri') || query.includes('sdg') || query.includes('ods') || query.includes('carbono')) {
      return `### Nota de OEFA (Inspector):
Como fiscalizador de OEFA, nuestra prioridad reglamentaria es la mitigación de vertimientos reales (§6.1.3) y la segregación física de residuos peligrosos. Sin embargo, reconocemos el valor del **GHG Protocol** y de reportar bajo **GRI (302/303/305)**. Recuerde que redactar reportes corporativos no lo exime de multas si el efluente al río sigue excediendo los LMP de sólidos suspendidos.`;
    }

    return `He inspeccionado la planta. Actualmente su **Riesgo Operativo General es de ${state.operationalRisk}%**. 
Le sugiero que implemente los controles operacionales antes de mi próxima visita sorpresa. 
¿Desea consultar el reporte de cumplimiento legal o detalles específicos de un área física?`;
  }

  // --- DIRECTOR GENERAL IA (CEO) ---
  if (agent === 'ceo') {
    if (query.includes('presupuesto') || query.includes('dinero') || query.includes('fondos') || query.includes('costo')) {
      return `### Estado del Presupuesto Corporativo:
* **Presupuesto disponible:** $${state.budget.toLocaleString()}
* **Reputación corporativa:** ${state.reputation}%
* **Maturity Score:** ${state.environmentalScore}%

Entiendo que la gestión ambiental requiere recursos, pero debes demostrar que cada inversión reduce costos operativos u optimiza la eficiencia energética y el cumplimiento legal. ¡No apruebo fondos adicionales a menos que subas de nivel!`;
    }

    if (query.includes('politica') || query.includes('firmar')) {
      return policySigned
        ? 'La política ya fue firmada. Estoy respaldando su implementación. ¡Asegúrese de comunicarla a toda la plantilla para cumplir la Cláusula 5.2!'
        : 'He revisado la propuesta de **Política Ambiental**. Contiene los compromisos clave. Procederé a estampar mi firma digital para hacerla oficial de inmediato.';
    }

    if (query.includes('carbono') || query.includes('huella') || query.includes('descarbonizar') || query.includes('co2') || query.includes('ghg') || query.includes('sbti') || query.includes('gri') || query.includes('sdg') || query.includes('ods')) {
      const totalCo2 = state.carbonScope1 + state.carbonScope2 + state.carbonScope3;
      return `### Reporte de Huella de Carbono y Sostenibilidad Corporativa:
* **Alcance 1 (Directo - diésel/combustible):** ${state.carbonScope1.toLocaleString()} kg CO2e
* **Alcance 2 (Indirecto Eléctrico):** ${state.carbonScope2.toLocaleString()} kg CO2e
* **Alcance 3 (Cadena de Suministro/logística):** ${state.carbonScope3.toLocaleString()} kg CO2e
* **Emisión Total (GHG Protocol):** ${totalCo2.toLocaleString()} kg CO2e
 
Exijo que alineemos nuestro reporte con los estándares **GRI (302/303/305)** e implementemos metas científicas **SBTi** a 1.5°C. Esto apoya directamente los **ODS 6, 12 y 13**. Prioriza la firma de contratos de energía verde y la eficiencia de procesos para reducir costos y riesgos ante auditorías.`;
    }

    if (query.includes('riesgo') || query.includes('clausura') || query.includes('multa')) {
      return state.operationalRisk > 60
        ? `¡Alerta! El riesgo operativo está en un nivel muy alto (${state.operationalRisk}%). Esto es inaceptable para la junta directiva. Si un inspector clausura la planta, perderemos millones. Exijo que instales contenciones antiderrames e implementes planes de respuesta ante emergencias de inmediato.`
        : 'Me alegra ver que el riesgo operativo está bajo control. Mantenga las auditorías internas y los simulacros activos.';
    }

    return `Saludos, Environmental Manager. El objetivo estratégico es claro: obtener la certificación ISO 14001 para acceder a contratos de exportación, manteniendo controlados los costos.
¿Tiene alguna propuesta de presupuesto, inquietudes sobre descarbonización o requiere que firme la Política Ambiental?`;
  }

  return 'Mensaje recibido. Como agente del Sistema de Gestión Ambiental, quedo a disposición para guiarle.';
};
