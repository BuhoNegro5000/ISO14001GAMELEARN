export interface FormatContext {
  company: string;
  sector: string;
  logoUrl: string;
  date: string;
}

export type FormatKind = 'Política' | 'Procedimiento' | 'Formato' | 'Matriz' | 'Plan' | 'Registro' | 'Informe' | 'Acta';

export interface DocFormat {
  id: string;
  group: string;
  clause: string;
  code: string;
  title: string;
  kind: FormatKind;
  owner: string;
  summary: string;
  build: (ctx: FormatContext) => string;
}

export const formatGroups = [
  'Contexto y liderazgo (Cl. 4-5)',
  'Planificación (Cl. 6)',
  'Apoyo (Cl. 7)',
  'Operación (Cl. 8)',
  'Evaluación del desempeño (Cl. 9)',
  'Mejora (Cl. 10)',
] as const;

const INK = '#0f2a1d';
const GREEN = '#166534';
const SOFT = '#ecfdf3';
const LINE = '#b7c4bd';
const MUTED = '#475569';

const baseFont = "font-family:'Segoe UI',Arial,Helvetica,sans-serif;color:" + INK + ';';
const cell = `border:1px solid ${LINE};padding:6px 8px;font-size:11px;vertical-align:top;line-height:1.45;`;
const head = `border:1px solid ${GREEN};background:${GREEN};color:#ffffff;padding:6px 8px;font-size:10px;text-transform:uppercase;letter-spacing:.05em;text-align:left;`;
const label = `border:1px solid ${LINE};background:${SOFT};color:${GREEN};padding:6px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;width:16%;vertical-align:top;`;

const blankRow = (cols: number, h = 26) =>
  `<tr>${Array.from({ length: cols }, () => `<td style="${cell}height:${h}px;">&nbsp;</td>`).join('')}</tr>`;

export function table(headers: string[], rows: string[][], blanks = 3, widths?: string[]): string {
  const ths = headers
    .map((h, i) => `<th style="${head}${widths?.[i] ? `width:${widths[i]};` : ''}">${h}</th>`)
    .join('');
  const trs = rows
    .map(
      (r, i) =>
        `<tr style="background:${i % 2 ? '#f8faf9' : '#ffffff'};">${r.map((c) => `<td style="${cell}">${c}</td>`).join('')}</tr>`,
    )
    .join('');
  const empty = Array.from({ length: blanks }, () => blankRow(headers.length)).join('');
  return `<table style="width:100%;border-collapse:collapse;margin:8px 0 14px;"><thead><tr>${ths}</tr></thead><tbody>${trs}${empty}</tbody></table>`;
}

function kv(rows: Array<[string, string]>, pairs = true): string {
  if (!pairs) {
    return `<table style="width:100%;border-collapse:collapse;margin:8px 0 14px;">${rows
      .map(([k, v]) => `<tr><td style="${label}">${k}</td><td style="${cell}">${v || '&nbsp;'}</td></tr>`)
      .join('')}</table>`;
  }
  const out: string[] = [];
  for (let i = 0; i < rows.length; i += 2) {
    const a = rows[i];
    const b = rows[i + 1];
    out.push(
      `<tr><td style="${label}">${a[0]}</td><td style="${cell}width:34%;">${a[1] || '&nbsp;'}</td>${
        b ? `<td style="${label}">${b[0]}</td><td style="${cell}width:34%;">${b[1] || '&nbsp;'}</td>` : `<td style="${cell}" colspan="2">&nbsp;</td>`
      }</tr>`,
    );
  }
  return `<table style="width:100%;border-collapse:collapse;margin:8px 0 14px;">${out.join('')}</table>`;
}

const sec = (n: string, title: string, html: string) =>
  `<h2 style="${baseFont}font-size:13px;margin:18px 0 6px;padding:5px 10px;background:${SOFT};border-left:4px solid ${GREEN};color:${GREEN};text-transform:uppercase;letter-spacing:.04em;">${n}. ${title}</h2>${html}`;

const p = (t: string) => `<p style="${baseFont}font-size:12px;line-height:1.6;margin:4px 0 8px;">${t}</p>`;
const ul = (items: string[]) =>
  `<ul style="${baseFont}font-size:12px;line-height:1.6;margin:4px 0 10px;padding-left:20px;">${items.map((i) => `<li style="margin-bottom:3px;">${i}</li>`).join('')}</ul>`;
const ol = (items: string[]) =>
  `<ol style="${baseFont}font-size:12px;line-height:1.6;margin:4px 0 10px;padding-left:22px;">${items.map((i) => `<li style="margin-bottom:3px;">${i}</li>`).join('')}</ol>`;
const checkbox = '&#9744;';

interface Meta {
  code: string;
  title: string;
  clause: string;
  kind: FormatKind;
  owner: string;
  reviewer?: string;
  approver?: string;
}

function frame(m: Meta, ctx: FormatContext, body: string): string {
  const header = `
<table style="width:100%;border-collapse:collapse;${baseFont}margin-bottom:10px;">
  <tr>
    <td style="border:1px solid ${GREEN};padding:8px 12px;width:22%;text-align:center;vertical-align:middle;">
      <img src="${ctx.logoUrl}" alt="Green Owl Labs" style="height:64px;width:auto;" />
    </td>
    <td style="border:1px solid ${GREEN};padding:8px 14px;text-align:center;vertical-align:middle;">
      <div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:${MUTED};font-weight:700;">${ctx.company} · Sistema de Gestión Ambiental · ISO 14001:2026</div>
      <div style="font-size:18px;font-weight:800;margin-top:4px;color:${INK};line-height:1.2;">${m.title}</div>
      <div style="font-size:10px;margin-top:4px;color:${GREEN};font-weight:700;letter-spacing:.06em;text-transform:uppercase;">${m.kind} · Cláusula ${m.clause}</div>
    </td>
    <td style="border:1px solid ${GREEN};padding:0;width:24%;vertical-align:top;">
      <table style="width:100%;border-collapse:collapse;font-size:10px;">
        <tr><td style="padding:5px 8px;border-bottom:1px solid ${LINE};background:${SOFT};font-weight:700;color:${GREEN};">CÓDIGO</td><td style="padding:5px 8px;border-bottom:1px solid ${LINE};font-weight:700;">${m.code}</td></tr>
        <tr><td style="padding:5px 8px;border-bottom:1px solid ${LINE};background:${SOFT};font-weight:700;color:${GREEN};">VERSIÓN</td><td style="padding:5px 8px;border-bottom:1px solid ${LINE};">01</td></tr>
        <tr><td style="padding:5px 8px;border-bottom:1px solid ${LINE};background:${SOFT};font-weight:700;color:${GREEN};">FECHA</td><td style="padding:5px 8px;border-bottom:1px solid ${LINE};">${ctx.date}</td></tr>
        <tr><td style="padding:5px 8px;background:${SOFT};font-weight:700;color:${GREEN};">PÁGINA</td><td style="padding:5px 8px;">1 de 1</td></tr>
      </table>
    </td>
  </tr>
</table>`;

  const approvals = `
<table style="width:100%;border-collapse:collapse;margin:16px 0 8px;">
  <thead><tr><th style="${head}width:16%;">Control</th><th style="${head}">Nombre</th><th style="${head}">Cargo</th><th style="${head}width:14%;">Fecha</th><th style="${head}width:20%;">Firma</th></tr></thead>
  <tbody>
    <tr><td style="${label}">Elaboró</td><td style="${cell}height:34px;">&nbsp;</td><td style="${cell}">${m.owner}</td><td style="${cell}">&nbsp;</td><td style="${cell}">&nbsp;</td></tr>
    <tr><td style="${label}">Revisó</td><td style="${cell}height:34px;">&nbsp;</td><td style="${cell}">${m.reviewer || 'Coordinador SGA / EHS'}</td><td style="${cell}">&nbsp;</td><td style="${cell}">&nbsp;</td></tr>
    <tr><td style="${label}">Aprobó</td><td style="${cell}height:34px;">&nbsp;</td><td style="${cell}">${m.approver || 'Alta Dirección'}</td><td style="${cell}">&nbsp;</td><td style="${cell}">&nbsp;</td></tr>
  </tbody>
</table>`;

  const history = sec(
    'Hist.',
    'Control de cambios',
    table(['Versión', 'Fecha', 'Descripción del cambio', 'Responsable'], [['01', ctx.date, 'Emisión inicial del documento.', m.owner]], 1, ['12%', '16%', '', '24%']),
  );

  const footer = `<div style="${baseFont}margin-top:10px;padding-top:8px;border-top:2px solid ${GREEN};font-size:9px;color:${MUTED};text-align:center;letter-spacing:.04em;">${m.code} · ${ctx.company} · Documento controlado. Toda copia impresa se considera no controlada salvo sello vigente. Conservar según el listado maestro de información documentada (7.5).</div>`;

  return `<div style="${baseFont}">${header}${body}${approvals}${history}${footer}</div>`;
}

const fmt = (
  id: string,
  group: (typeof formatGroups)[number],
  clause: string,
  code: string,
  title: string,
  kind: FormatKind,
  owner: string,
  summary: string,
  body: (ctx: FormatContext) => string,
  reviewer?: string,
  approver?: string,
): DocFormat => ({
  id,
  group,
  clause,
  code,
  title,
  kind,
  owner,
  summary,
  build: (ctx) => frame({ code, title, clause, kind, owner, reviewer, approver }, ctx, body(ctx)),
});

const G = formatGroups;

function procedureBody(o: {
  objetivo: string;
  alcance: string;
  refs: string[];
  defs: Array<[string, string]>;
  resp: Array<[string, string]>;
  steps: Array<[string, string, string, string]>;
  registros: string[];
  indicadores: Array<[string, string, string]>;
}): string {
  return (
    sec('1', 'Objetivo', p(o.objetivo)) +
    sec('2', 'Alcance', p(o.alcance)) +
    sec('3', 'Referencias normativas y documentos relacionados', ul(o.refs)) +
    sec('4', 'Definiciones', table(['Término', 'Definición'], o.defs.map(([a, b]) => [`<strong>${a}</strong>`, b]), 0, ['24%', ''])) +
    sec('5', 'Responsabilidades y autoridades', table(['Rol', 'Responsabilidad'], o.resp.map(([a, b]) => [`<strong>${a}</strong>`, b]), 0, ['26%', ''])) +
    sec('6', 'Desarrollo del procedimiento', table(['Paso', 'Actividad', 'Responsable', 'Registro / evidencia'], o.steps.map(([a, b, c, d]) => [a, b, c, d]), 0, ['7%', '', '20%', '22%'])) +
    sec('7', 'Registros asociados', ul(o.registros)) +
    sec('8', 'Indicadores de seguimiento', table(['Indicador', 'Fórmula / criterio', 'Meta'], o.indicadores.map(([a, b, c]) => [a, b, c]), 1, ['30%', '', '18%']))
  );
}

export const documentFormats: DocFormat[] = [
  // ---------------- Cl. 4-5 ----------------
  fmt('ctx-analysis', G[0], '4.1', 'SGA-F-401', 'Análisis del contexto de la organización (FODA / PESTEL)', 'Matriz', 'Coordinador SGA', 'Cuestiones internas y externas, incluido el cambio climático, que afectan los resultados previstos del SGA.', () =>
    sec('1', 'Datos del análisis', kv([['Periodo evaluado', ''], ['Facilitador', ''], ['Participantes', ''], ['Próxima revisión', '']])) +
    sec('2', 'Análisis FODA', table(['Tipo', 'Cuestión', 'Evidencia / dato', 'Relación con el SGA', 'Prioridad (A/M/B)'], [
      ['<strong>Fortaleza</strong>', 'Personal con experiencia en control operacional', 'Rotación &lt; 8 % anual', 'Facilita cumplimiento de 8.1', 'M'],
      ['<strong>Debilidad</strong>', 'Segregación de residuos incompleta', 'Auditoría previa: 3 hallazgos', 'Riesgo de incumplimiento legal', 'A'],
      ['<strong>Oportunidad</strong>', 'Incentivos por eficiencia energética', 'Programa estatal vigente', 'Reduce consumo y emisiones', 'M'],
      ['<strong>Amenaza</strong>', 'Endurecimiento de límites de vertido', 'Proyecto normativo en consulta', 'Exige inversión en tratamiento', 'A'],
    ], 4, ['12%', '', '', '', '10%'])) +
    sec('3', 'Análisis PESTEL', table(['Factor', 'Cuestión identificada', 'Efecto (+ / −)', 'Acción / dónde se aborda'], [
      ['Político', 'Cambios en política ambiental y fiscal', '−', 'Registro de cumplimiento 6.1.3'],
      ['Económico', 'Precio de energía y de disposición de residuos', '−', 'Objetivos 6.2'],
      ['Social', 'Expectativas de la comunidad vecina', '−', 'Comunicación 7.4'],
      ['Tecnológico', 'Tecnologías de monitoreo en línea', '+', 'Programa 6.2.2'],
      ['Ecológico', 'Estrés hídrico y eventos climáticos extremos', '−', 'Riesgos 6.1.1 / cambio climático'],
      ['Legal', 'Nuevas obligaciones de reporte de emisiones', '−', 'Matriz legal 6.1.3'],
    ], 2, ['14%', '', '12%', '26%'])) +
    sec('4', 'Determinación de la relevancia del cambio climático', table(['Pregunta', 'Respuesta (Sí/No)', 'Justificación'], [
      ['¿El cambio climático afecta la capacidad de lograr los resultados previstos del SGA?', '', ''],
      ['¿Hay emisiones de GEI (alcance 1, 2 o 3) significativas?', '', ''],
      ['¿Existen riesgos físicos (inundación, sequía, calor extremo) sobre los procesos?', '', ''],
    ], 0, ['46%', '14%', ''])) +
    sec('5', 'Conclusiones y decisiones', p('Resuma las cuestiones que se convierten en riesgos y oportunidades (6.1.1) y en insumos para objetivos (6.2).') + blankBox(4)),
  ),

  fmt('interested-parties', G[0], '4.2', 'SGA-F-402', 'Matriz de partes interesadas y sus requisitos', 'Matriz', 'Coordinador SGA', 'Identifica partes interesadas pertinentes, sus necesidades y cuáles pasan a ser obligaciones de cumplimiento.', () =>
    sec('1', 'Matriz', table(['Parte interesada', 'Necesidades y expectativas', '¿Obligación de cumplimiento?', 'Influencia (1-5)', 'Interés (1-5)', 'Estrategia / canal'], [
      ['Autoridad ambiental', 'Permisos vigentes, reportes y monitoreo', 'Sí (obligatoria)', '5', '5', 'Reportes oficiales'],
      ['Comunidad vecina', 'Menor ruido, olores y riesgo', 'Voluntaria', '3', '5', 'Mesa de diálogo trimestral'],
      ['Clientes', 'Huella ambiental del producto, certificación', 'Contractual', '4', '4', 'Declaraciones y auditorías'],
      ['Empleados', 'Entorno seguro y formación', 'Voluntaria', '3', '5', 'Capacitación / intranet'],
      ['Accionistas / inversionistas', 'Reducción de riesgo ESG', 'Voluntaria', '5', '3', 'Informe anual'],
      ['Proveedores y contratistas', 'Requisitos claros y pagos oportunos', 'Contractual', '2', '3', 'Cláusulas ambientales'],
    ], 4, ['18%', '', '14%', '9%', '9%', '18%'])) +
    sec('2', 'Priorización', p('Las partes con influencia ≥ 4 e interés ≥ 4 se gestionan de cerca. Las obligaciones de cumplimiento se trasladan a la matriz legal SGA-F-613.')),
  ),

  fmt('scope', G[0], '4.3', 'SGA-F-403', 'Alcance y límites del Sistema de Gestión Ambiental', 'Formato', 'Coordinador SGA', 'Declaración documentada del alcance: límites físicos, organizacionales, actividades, productos y servicios.', () =>
    sec('1', 'Declaración del alcance', blankBox(3, 'El SGA de la organización aplica a …')) +
    sec('2', 'Límites del sistema', table(['Elemento', 'Incluye', 'Excluye (justificación)'], [
      ['Sitios y ubicaciones', '', ''], ['Procesos y actividades', '', ''], ['Productos y servicios', '', ''], ['Unidades organizativas', '', ''], ['Actividades subcontratadas', '', ''],
    ], 0)) +
    sec('3', 'Consideraciones del alcance', ul(['Cuestiones internas y externas del análisis 4.1 (SGA-F-401).', 'Requisitos de las partes interesadas (SGA-F-402).', 'Obligaciones de cumplimiento (SGA-F-613).', 'Autoridad y capacidad para ejercer control e influencia.', 'Perspectiva de ciclo de vida de productos y servicios.'])) +
    sec('4', 'Disponibilidad', p('El alcance se mantiene como información documentada y está disponible para las partes interesadas que lo soliciten.')),
  ),

  fmt('process-map', G[0], '4.4', 'SGA-F-404', 'Mapa de procesos del SGA e interacciones', 'Matriz', 'Coordinador SGA', 'Procesos del SGA con entradas, salidas, responsables, riesgos asociados e indicadores.', () =>
    sec('1', 'Mapa de procesos', p('Estratégicos: planificación, liderazgo y revisión. Operativos: producción, logística, mantenimiento y tratamiento. De apoyo: compras, RR. HH., laboratorio y TI.')) +
    sec('2', 'Ficha de procesos', table(['Proceso', 'Entradas', 'Salidas', 'Responsable', 'Indicador', 'Documento asociado'], [
      ['Planificación ambiental', 'Contexto, requisitos legales', 'Objetivos y programas', 'Coordinador SGA', '% objetivos cumplidos', 'SGA-F-621'],
      ['Control operacional', 'Aspectos significativos', 'Operación controlada', 'Jefe de planta', 'Desvíos / mes', 'SGA-P-801'],
      ['Gestión de residuos', 'Residuos generados', 'Residuos dispuestos legalmente', 'Jefe de patio', '% valorización', 'SGA-R-804'],
      ['Auditoría y mejora', 'Registros y resultados', 'Acciones correctivas', 'Auditor líder', '% NC cerradas en plazo', 'SGA-F-1002'],
    ], 4, ['16%', '16%', '16%', '14%', '16%', '14%'])),
  ),

  fmt('policy', G[0], '5.2', 'SGA-P-502', 'Política ambiental', 'Política', 'Alta Dirección', 'Declaración pública de compromisos: protección del ambiente, cumplimiento, mejora continua y acción climática.', (c) =>
    sec('1', 'Declaración de la Dirección', p(`La alta dirección de <strong>${c.company}</strong> establece, implementa y mantiene esta política ambiental, apropiada al propósito y contexto de la organización, incluida la naturaleza, magnitud e impactos ambientales de sus actividades, productos y servicios.`)) +
    sec('2', 'Compromisos', ol([
      '<strong>Protección del medio ambiente:</strong> prevenir la contaminación, proteger la biodiversidad y los ecosistemas, y promover el uso sostenible de los recursos.',
      '<strong>Cumplimiento:</strong> cumplir los requisitos legales y otros requisitos que la organización suscriba.',
      '<strong>Acción climática:</strong> reducir las emisiones de gases de efecto invernadero y gestionar los riesgos físicos y de transición.',
      '<strong>Mejora continua:</strong> mejorar el SGA para incrementar el desempeño ambiental.',
      '<strong>Ciclo de vida:</strong> considerar los impactos ambientales desde el diseño y la compra hasta la disposición final.',
      '<strong>Participación:</strong> consultar y comunicar con trabajadores, comunidad y demás partes interesadas.',
    ])) +
    sec('3', 'Marco para los objetivos ambientales', p('Esta política es el marco para establecer y revisar los objetivos ambientales (6.2), que serán medibles, coherentes con la política y con seguimiento periódico.')) +
    sec('4', 'Comunicación y disponibilidad', ul(['Comunicada a todas las personas que trabajan bajo el control de la organización.', 'Disponible para las partes interesadas (sitio web y recepción).', 'Revisada al menos una vez al año en la revisión por la dirección.'])) +
    sec('5', 'Firma de la Alta Dirección', kv([['Nombre', ''], ['Cargo', 'Director General'], ['Fecha', ''], ['Firma', '']])),
  ),

  fmt('roles', G[0], '5.3', 'SGA-F-503', 'Roles, responsabilidades y autoridades (matriz RACI)', 'Matriz', 'Alta Dirección', 'Asigna y comunica responsabilidades y autoridades para el SGA. R: ejecuta · A: responde · C: consultado · I: informado.', () =>
    sec('1', 'Matriz RACI del SGA', table(['Actividad del SGA', 'Dirección', 'Coord. SGA', 'Jefe de planta', 'RR. HH.', 'Compras'], [
      ['Aprobar política y objetivos', 'A', 'R', 'C', 'I', 'I'],
      ['Identificar aspectos e impactos', 'I', 'A', 'R', 'C', 'C'],
      ['Mantener matriz legal', 'I', 'A/R', 'C', 'I', 'I'],
      ['Control operacional y mantenimiento', 'I', 'C', 'A/R', 'I', 'I'],
      ['Capacitación y competencias', 'I', 'C', 'C', 'A/R', 'I'],
      ['Evaluación de proveedores', 'I', 'C', 'C', 'I', 'A/R'],
      ['Respuesta ante emergencias', 'I', 'C', 'A/R', 'C', 'I'],
      ['Informar desempeño a la dirección', 'I', 'A/R', 'C', 'I', 'I'],
    ], 3, ['34%', '13%', '13%', '14%', '13%', '13%'])) +
    sec('2', 'Autoridades clave', table(['Rol', 'Persona designada', 'Autoridad específica'], [
      ['Representante de la dirección para el SGA', '', 'Reportar el desempeño y proponer mejoras'],
      ['Responsable de emergencias', '', 'Detener la operación ante riesgo ambiental grave'],
    ], 2, ['32%', '26%', ''])),
  ),

  // ---------------- Cl. 6 ----------------
  fmt('aspects', G[1], '6.1.2', 'SGA-F-612', 'Matriz de identificación de aspectos e impactos ambientales', 'Matriz', 'Coordinador SGA', 'Identifica aspectos en condiciones normales, anormales y de emergencia, evalúa su significancia y define controles.', () =>
    sec('1', 'Criterios de evaluación', kv([['Severidad (S)', '1 menor · 3 moderada · 5 crítica'], ['Probabilidad (P)', '1 remota · 3 posible · 5 frecuente'], ['Puntaje', 'S × P'], ['Significativo', 'Puntaje ≥ 12 o requisito legal asociado']])) +
    sec('2', 'Matriz de aspectos e impactos', table(['Proceso / área', 'Actividad', 'Aspecto', 'Condición (N/A/E)', 'Impacto ambiental', 'S', 'P', 'Puntaje', 'Signif.', 'Etapa de ciclo de vida', 'Control'], [
      ['Producción', 'Estampado', 'Consumo de energía eléctrica', 'N', 'Emisiones indirectas (alcance 2)', '4', '5', '20', 'SÍ', 'Uso', 'Motores IE3, monitoreo'],
      ['Almacén', 'Almacenamiento de solventes', 'Derrame', 'E', 'Contaminación de suelo y agua', '5', '3', '15', 'SÍ', 'Almacenamiento', 'Cubetos 110 %, kit antiderrame'],
      ['Mantenimiento', 'Cambio de aceite', 'Aceite usado', 'N', 'Contaminación de suelo', '5', '4', '20', 'SÍ', 'Uso / disposición', 'Gestor autorizado'],
      ['Oficinas', 'Uso de papel', 'Consumo de papel', 'N', 'Agotamiento de recursos', '2', '4', '8', 'NO', 'Compra', 'Política cero papel'],
    ], 6, ['9%', '9%', '11%', '7%', '12%', '4%', '4%', '6%', '6%', '10%', ''])) +
    sec('3', 'Notas', ul(['N: normal · A: anormal (arranque, parada, mantenimiento) · E: emergencia razonablemente previsible.', 'Considerar cambios planificados o nuevos desarrollos (6.3) y la perspectiva de ciclo de vida.', 'Los aspectos significativos alimentan los controles operacionales (8.1) y los objetivos (6.2).'])),
  ),

  fmt('legal', G[1], '6.1.3', 'SGA-F-613', 'Matriz de requisitos legales y otros requisitos', 'Matriz', 'Especialista legal EHS', 'Determina y da seguimiento a obligaciones de cumplimiento, su aplicación y estado de conformidad.', () =>
    sec('1', 'Matriz de obligaciones de cumplimiento', table(['N.º', 'Norma / permiso', 'Autoridad', 'Requisito aplicable', 'Proceso / área', 'Evidencia', 'Responsable', 'Vencimiento', 'Estado'], [
      ['L-01', 'Permiso de vertimiento industrial', 'Autoridad del agua', 'Cumplir límites de DBO5, SST, pH', 'Planta de tratamiento', 'Informe de laboratorio', 'Jefe de planta', 'Anual', 'Cumple'],
      ['L-02', 'Reglamento de sustancias peligrosas', 'Autoridad ambiental', 'Cubetos 110 %, rotulado y hojas de seguridad', 'Almacén', 'Inspección', 'Jefe de almacén', 'Semestral', 'Parcial'],
      ['L-03', 'Gestión de residuos peligrosos', 'Autoridad ambiental', 'Manifiesto y gestor autorizado', 'Patio de residuos', 'Manifiestos', 'Coord. SGA', 'Mensual', 'Cumple'],
      ['L-04', 'Límites de emisiones atmosféricas', 'Autoridad ambiental', 'Monitoreo de chimeneas', 'Calderas', 'Informe', 'Jefe de mantenimiento', 'Anual', 'No cumple'],
    ], 6, ['5%', '15%', '9%', '17%', '10%', '10%', '10%', '9%', '8%'])) +
    sec('2', 'Otros requisitos suscritos', table(['Requisito', 'Origen (cliente, compromiso voluntario, código)', 'Aplicación', 'Responsable'], [['', '', '', '']], 2)) +
    sec('3', 'Actualización', p('La matriz se revisa mensualmente y ante cualquier cambio normativo, nuevo proceso o modificación de permisos. Estado: Cumple · Parcial · No cumple · No aplica.')),
  ),

  fmt('risks', G[1], '6.1.1', 'SGA-F-611', 'Evaluación de riesgos y oportunidades del SGA', 'Matriz', 'Coordinador SGA', 'Riesgos y oportunidades vinculados a aspectos significativos, obligaciones de cumplimiento y contexto, con acciones planificadas.', () =>
    sec('1', 'Registro de riesgos y oportunidades', table(['ID', 'Tipo (R/O)', 'Origen (aspecto, legal, contexto)', 'Descripción', 'Probabilidad', 'Consecuencia', 'Nivel', 'Acción planificada', 'Responsable', 'Plazo'], [
      ['R-01', 'Riesgo', 'Obligación legal', 'Superación del límite de vertido', 'Media', 'Alta', 'Alto', 'Mejorar tratamiento y monitoreo', 'Jefe de planta', 'Trim. 2'],
      ['R-02', 'Riesgo', 'Contexto climático', 'Sequía que limita el suministro de agua', 'Media', 'Media', 'Medio', 'Recirculación de agua', 'Coord. SGA', 'Trim. 4'],
      ['O-01', 'Oportunidad', 'Contexto', 'Subsidio de eficiencia energética', 'Alta', 'Media', 'Medio', 'Postular proyecto', 'Finanzas', 'Trim. 1'],
    ], 5, ['5%', '8%', '12%', '16%', '8%', '8%', '6%', '15%', '12%', '8%'])) +
    sec('2', 'Planificación de las acciones', ul(['Integrar las acciones en los procesos del SGA y evaluar su eficacia.', 'Considerar opciones tecnológicas, financieras y operativas.', 'Mantener este registro como información documentada.'])),
  ),

  fmt('objectives', G[1], '6.2.1', 'SGA-F-621', 'Objetivos ambientales y planificación para lograrlos', 'Plan', 'Alta Dirección', 'Objetivos medibles y coherentes con la política, con indicador, línea base, meta, recursos y responsable.', () =>
    sec('1', 'Objetivos ambientales', table(['N.º', 'Objetivo (SMART)', 'Aspecto / riesgo asociado', 'Indicador', 'Línea base', 'Meta', 'Plazo', 'Responsable', 'ODS'], [
      ['OBJ-1', 'Reducir el consumo de energía eléctrica por unidad producida', 'Consumo de energía', 'kWh / unidad', '1,20', '−15 %', '31/12', 'Jefe de planta', '7, 13'],
      ['OBJ-2', 'Aumentar la valorización de residuos', 'Residuos sólidos', '% valorizado', '38 %', '60 %', '31/12', 'Jefe de patio', '12'],
      ['OBJ-3', 'Reducir el consumo de agua fresca', 'Consumo de agua', 'm³ / unidad', '0,80', '−25 %', '31/12', 'Planta de tratamiento', '6'],
    ], 4, ['6%', '22%', '14%', '10%', '8%', '8%', '7%', '13%', '6%'])) +
    sec('2', 'Planificación para lograr cada objetivo', table(['Objetivo', 'Qué se hará', 'Recursos', 'Quién', 'Cuándo', 'Cómo se evaluarán los resultados'], [
      ['OBJ-1', 'Sustituir motores e iluminación', 'USD 25 000', 'Jefe de mantenimiento', 'T2', 'Lectura mensual de medidores'],
    ], 3)),
  ),

  fmt('program', G[1], '6.2.2', 'SGA-F-622', 'Programa de gestión ambiental (plan de acción)', 'Plan', 'Coordinador SGA', 'Cronograma de acciones con presupuesto, responsables, hitos y seguimiento mensual.', () =>
    sec('1', 'Cronograma y seguimiento', table(['Acción', 'Objetivo', 'Responsable', 'Presupuesto', 'Inicio', 'Fin', 'Hito de verificación', '% avance', 'Estado'], [
      ['Instalar cubetos de contención', 'OBJ-5', 'Jefe de almacén', 'USD 9 500', 'Ene', 'Mar', 'Inspección aprobada', '', 'Pendiente'],
      ['Programa de logística inversa', 'OBJ-2', 'Compras', 'USD 8 000', 'Feb', 'Jun', 'Contrato firmado', '', 'En curso'],
    ], 6, ['18%', '8%', '12%', '10%', '6%', '6%', '16%', '8%', '10%'])) +
    sec('2', 'Resumen de recursos', kv([['Presupuesto total', ''], ['Presupuesto ejecutado', ''], ['Riesgos del programa', ''], ['Fecha de revisión', '']])),
  ),

  fmt('change', G[1], '6.3', 'SGA-F-630', 'Solicitud y evaluación de cambios planificados', 'Formato', 'Coordinador SGA', 'Evalúa el efecto ambiental de cambios en procesos, instalaciones, productos o proveedores antes de implementarlos.', () =>
    sec('1', 'Datos del cambio', kv([['N.º de solicitud', ''], ['Fecha', ''], ['Solicitante', ''], ['Área', ''], ['Tipo de cambio', `${checkbox} Proceso ${checkbox} Instalación ${checkbox} Producto ${checkbox} Proveedor ${checkbox} Normativo`], ['Fecha prevista', '']])) +
    sec('2', 'Descripción y justificación', blankBox(3)) +
    sec('3', 'Evaluación de efectos ambientales', table(['Pregunta', 'Sí / No', 'Detalle y acción'], [
      ['¿Genera nuevos aspectos ambientales?', '', ''], ['¿Modifica aspectos significativos existentes?', '', ''], ['¿Afecta obligaciones de cumplimiento o permisos?', '', ''], ['¿Requiere capacitación o nuevos controles?', '', ''], ['¿Cambia riesgos de emergencia?', '', ''],
    ], 0, ['46%', '10%', ''])) +
    sec('4', 'Decisión', kv([['Resultado', `${checkbox} Aprobado ${checkbox} Aprobado con condiciones ${checkbox} Rechazado`], ['Condiciones', ''], ['Seguimiento posterior', '']], false)),
  ),

  // ---------------- Cl. 7 ----------------
  fmt('competence', G[2], '7.2', 'SGA-F-702', 'Matriz de competencias y plan de capacitación', 'Matriz', 'Recursos Humanos', 'Define competencias necesarias, detecta brechas y planifica formación con evaluación de eficacia.', () =>
    sec('1', 'Matriz de competencias', table(['Cargo', 'Competencia requerida', 'Formación / experiencia', 'Nivel actual (1-4)', 'Brecha', 'Acción'], [
      ['Operador de planta de tratamiento', 'Manejo de efluentes y muestreo', 'Técnico + curso de 16 h', '2', 'Sí', 'Curso de muestreo'],
      ['Operario de almacén', 'Manejo de sustancias peligrosas', 'Curso HAZMAT', '3', 'No', 'Refuerzo anual'],
      ['Auditor interno', 'ISO 14001 y auditoría', 'Curso de auditor interno', '1', 'Sí', 'Formación externa'],
    ], 5, ['20%', '20%', '18%', '10%', '8%', '24%'])) +
    sec('2', 'Plan anual de capacitación', table(['Tema', 'Dirigido a', 'Horas', 'Mes', 'Proveedor', 'Evaluación de eficacia'], [
      ['Conciencia ambiental ISO 14001', 'Todo el personal', '2', 'Feb', 'Interno', 'Examen ≥ 80 %'],
    ], 4)),
  ),

  fmt('attendance', G[2], '7.2', 'SGA-R-703', 'Registro de asistencia y evaluación de capacitación', 'Registro', 'Recursos Humanos', 'Evidencia de capacitación: tema, instructor, asistentes, evaluación de aprendizaje y eficacia.', () =>
    sec('1', 'Datos de la actividad', kv([['Tema', ''], ['Fecha', ''], ['Duración (h)', ''], ['Instructor', ''], ['Lugar / modalidad', ''], ['Objetivo', '']])) +
    sec('2', 'Asistentes', table(['N.º', 'Nombre completo', 'Documento', 'Cargo / área', 'Nota (0-100)', 'Firma'], [], 12, ['6%', '28%', '14%', '22%', '12%', '18%'])) +
    sec('3', 'Evaluación de eficacia (30 días después)', kv([['Indicador observado', ''], ['Resultado', `${checkbox} Eficaz ${checkbox} Requiere refuerzo`], ['Responsable de la evaluación', '']], false)),
  ),

  fmt('communication', G[2], '7.4', 'SGA-F-704', 'Plan de comunicación interna y externa', 'Plan', 'Coordinador SGA', 'Qué, cuándo, a quién, cómo y quién comunica; incluye registro de comunicaciones recibidas.', () =>
    sec('1', 'Plan de comunicación', table(['Qué comunicar', 'Interna / externa', 'Audiencia', 'Cuándo', 'Medio', 'Responsable', 'Evidencia'], [
      ['Política ambiental', 'Ambas', 'Todo el personal y público', 'Anual', 'Intranet y web', 'Dirección', 'Acta'],
      ['Resultados de desempeño', 'Interna', 'Empleados', 'Trimestral', 'Reunión', 'Coord. SGA', 'Presentación'],
      ['Reporte a la autoridad', 'Externa', 'Autoridad ambiental', 'Según permiso', 'Plataforma oficial', 'Jefe de planta', 'Acuse'],
    ], 4)) +
    sec('2', 'Registro de comunicaciones recibidas', table(['Fecha', 'Origen', 'Asunto / queja', 'Responsable', 'Respuesta', 'Fecha de cierre'], [], 5)),
  ),

  fmt('master-list', G[2], '7.5', 'SGA-F-705', 'Listado maestro de información documentada', 'Registro', 'Coordinador SGA', 'Control de documentos y registros: código, versión, ubicación, retención, disposición y acceso.', () =>
    sec('1', 'Listado maestro', table(['Código', 'Título', 'Tipo (D/R)', 'Versión', 'Fecha de emisión', 'Responsable', 'Ubicación', 'Retención', 'Disposición final'], [
      ['SGA-P-502', 'Política ambiental', 'D', '01', '', 'Dirección', 'Intranet', 'Vigente', 'Archivo histórico'],
      ['SGA-F-612', 'Matriz de aspectos e impactos', 'D', '01', '', 'Coord. SGA', 'Intranet', 'Vigente', 'Archivo histórico'],
      ['SGA-R-703', 'Registro de capacitación', 'R', '01', '', 'RR. HH.', 'Archivo RR. HH.', '5 años', 'Destrucción'],
    ], 8, ['10%', '22%', '7%', '7%', '10%', '12%', '12%', '8%', '12%'])) +
    sec('2', 'Reglas de control', ul(['Codificación: SGA-[tipo]-[cláusula]. Tipos: P procedimiento, F formato, R registro.', 'Aprobación antes de su emisión y revisión al menos anual.', 'Control de acceso, distribución, versión y protección contra pérdida de confidencialidad o integridad.', 'Documentos de origen externo identificados y controlados.'])),
  ),

  // ---------------- Cl. 8 ----------------
  fmt('op-procedure', G[3], '8.1', 'SGA-P-801', 'Procedimiento de control operacional', 'Procedimiento', 'Jefe de planta', 'Establece criterios de operación y mantenimiento para aspectos significativos, con perspectiva de ciclo de vida.', () =>
    procedureBody({
      objetivo: 'Establecer los criterios operacionales para controlar los aspectos ambientales significativos y asegurar que los procesos se ejecuten según lo planificado.',
      alcance: 'Aplica a todas las actividades, productos y servicios incluidos en el alcance del SGA, incluido el personal contratista.',
      refs: ['ISO 14001:2026, cláusula 8.1', 'Matriz de aspectos e impactos SGA-F-612', 'Matriz legal SGA-F-613', 'Hojas de datos de seguridad (SDS) vigentes'],
      defs: [['Control operacional', 'Criterios, instrucciones y controles que evitan desviaciones de la política y objetivos.'], ['Ciclo de vida', 'Etapas consecutivas del sistema de producto, desde materias primas hasta disposición final.'], ['Desvío', 'Resultado fuera del criterio operacional definido.']],
      resp: [['Jefe de planta', 'Asegurar la aplicación de los controles y los recursos necesarios.'], ['Supervisores', 'Verificar el cumplimiento diario y reportar desvíos.'], ['Compras', 'Comunicar requisitos ambientales a proveedores y contratistas.'], ['Coordinador SGA', 'Mantener el procedimiento y auditar su aplicación.']],
      steps: [
        ['1', 'Identificar los aspectos significativos y los criterios de operación asociados (límites, frecuencias, equipos).', 'Coord. SGA', 'SGA-F-612'],
        ['2', 'Definir instrucciones de trabajo para cada control (segregación de residuos, manejo de químicos, mantenimiento preventivo).', 'Jefe de planta', 'Instrucciones de trabajo'],
        ['3', 'Inspeccionar el cumplimiento con la lista de verificación operacional.', 'Supervisores', 'SGA-F-802'],
        ['4', 'Controlar cambios planificados y evaluar su efecto ambiental antes de implementarlos.', 'Coord. SGA', 'SGA-F-630'],
        ['5', 'Comunicar requisitos ambientales a proveedores y contratistas y verificar su cumplimiento.', 'Compras', 'SGA-F-803'],
        ['6', 'Ante un desvío, detener la actividad, contener y abrir un reporte de no conformidad.', 'Supervisor', 'SGA-F-1002'],
      ],
      registros: ['SGA-F-802 Lista de verificación operacional', 'SGA-F-803 Evaluación de proveedores', 'SGA-R-804 Control de residuos'],
      indicadores: [['Desvíos operacionales por mes', 'N.º de desvíos detectados', '≤ 2'], ['Cumplimiento de inspecciones', 'Inspecciones realizadas / programadas', '≥ 95 %']],
    }),
  ),

  fmt('op-checklist', G[3], '8.1', 'SGA-F-802', 'Lista de verificación de inspección operacional', 'Formato', 'Supervisor de área', 'Inspección periódica de controles operacionales con resultado, evidencia y acción inmediata.', () =>
    sec('1', 'Datos de la inspección', kv([['Área', ''], ['Fecha y hora', ''], ['Inspector', ''], ['Turno', '']])) +
    sec('2', 'Puntos de verificación', table(['N.º', 'Punto de control', 'Cumple', 'No cumple', 'N/A', 'Observación / evidencia'], [
      ['1', 'Residuos segregados y contenedores rotulados', checkbox, checkbox, checkbox, ''],
      ['2', 'Cubetos de contención sin derrames ni acumulación de agua', checkbox, checkbox, checkbox, ''],
      ['3', 'Kit antiderrame completo y señalizado', checkbox, checkbox, checkbox, ''],
      ['4', 'Hojas de seguridad (SDS) disponibles en el punto de uso', checkbox, checkbox, checkbox, ''],
      ['5', 'Equipos con mantenimiento preventivo al día', checkbox, checkbox, checkbox, ''],
      ['6', 'Consumo de energía y agua dentro del rango esperado', checkbox, checkbox, checkbox, ''],
      ['7', 'Puntos de vertido y emisión sin anomalías', checkbox, checkbox, checkbox, ''],
    ], 3, ['6%', '40%', '9%', '10%', '7%', '28%'])) +
    sec('3', 'Hallazgos y acción inmediata', table(['Hallazgo', 'Acción inmediata', 'Responsable', 'Plazo', 'N.º de NC (si aplica)'], [], 3)),
  ),

  fmt('supplier-eval', G[3], '8.1', 'SGA-F-803', 'Evaluación ambiental de proveedores y contratistas', 'Formato', 'Compras', 'Evalúa criterios ambientales de proveedores y contratistas y define el control o seguimiento requerido.', () =>
    sec('1', 'Datos del proveedor', kv([['Razón social', ''], ['Tipo de bien o servicio', ''], ['Fecha de evaluación', ''], ['Evaluador', '']])) +
    sec('2', 'Criterios', table(['Criterio', 'Peso', 'Puntaje (0-5)', 'Evidencia'], [
      ['Certificación ISO 14001 o equivalente', '25 %', '', ''], ['Permisos y licencias ambientales vigentes', '25 %', '', ''], ['Gestión de residuos y emisiones', '20 %', '', ''], ['Desempeño en entregas anteriores', '15 %', '', ''], ['Compromiso de cumplir requisitos ambientales de la organización', '15 %', '', ''],
    ], 0, ['52%', '10%', '14%', ''])) +
    sec('3', 'Resultado', kv([['Puntaje total', ''], ['Clasificación', `${checkbox} Aprobado (≥ 80) ${checkbox} Condicionado (60-79) ${checkbox} No aprobado (< 60)`], ['Requisitos comunicados', ''], ['Próxima reevaluación', '']], false)),
  ),

  fmt('waste-log', G[3], '8.1', 'SGA-R-804', 'Registro de control y manifiesto de residuos', 'Registro', 'Jefe de patio de residuos', 'Trazabilidad de generación, almacenamiento temporal y disposición de residuos peligrosos y no peligrosos.', () =>
    sec('1', 'Registro de residuos', table(['Fecha', 'Residuo', 'Código / clasificación', 'Cantidad (kg)', 'Área generadora', 'Almacenamiento', 'Gestor autorizado', 'N.º de manifiesto', 'Disposición'], [
      ['', 'Aceite usado', 'Peligroso', '', 'Mantenimiento', 'Tambor en cubeto', '', '', 'Reciclaje'],
      ['', 'Chatarra metálica', 'No peligroso', '', 'Producción', 'Patio techado', '', '', 'Valorización'],
      ['', 'Trapos con hidrocarburos', 'Peligroso', '', 'Mantenimiento', 'Contenedor rojo', '', '', 'Incineración'],
    ], 8)) +
    sec('2', 'Resumen mensual', kv([['Total peligrosos (kg)', ''], ['Total no peligrosos (kg)', ''], ['% valorizado', ''], ['Responsable de la verificación', '']])),
  ),

  fmt('emergency-plan', G[3], '8.2', 'SGA-P-805', 'Plan de preparación y respuesta ante emergencias ambientales', 'Plan', 'Responsable de emergencias', 'Escenarios, roles, acciones, comunicación y recursos para responder a emergencias con efectos ambientales.', () =>
    sec('1', 'Escenarios de emergencia identificados', table(['Escenario', 'Ubicación', 'Impacto potencial', 'Nivel', 'Recursos disponibles'], [
      ['Derrame de sustancia química', 'Almacén', 'Contaminación de suelo y agua', 'Alto', 'Kit antiderrame, cubetos'],
      ['Incendio con liberación de humos', 'Planta', 'Emisión atmosférica y aguas de extinción', 'Alto', 'Extintores, hidrantes, dique'],
      ['Falla de la planta de tratamiento', 'PTAR', 'Vertido fuera de norma', 'Medio', 'Tanque de contingencia'],
    ], 3, ['22%', '12%', '28%', '8%', ''])) +
    sec('2', 'Organización de la respuesta', table(['Rol', 'Responsable / suplente', 'Función en la emergencia', 'Teléfono'], [
      ['Jefe de emergencia', '', 'Declara la emergencia y coordina', ''], ['Brigada de contención', '', 'Aplica kit y bloquea drenajes', ''], ['Comunicaciones', '', 'Avisa a autoridades y partes interesadas', ''],
    ], 2)) +
    sec('3', 'Protocolo de actuación', ol(['Detectar y dar alarma; proteger a las personas.', 'Eliminar la fuente si es seguro y contener con barreras absorbentes.', 'Bloquear drenajes y evitar que el vertido alcance cuerpos de agua.', 'Notificar a la autoridad en el plazo legal y registrar el evento.', 'Recoger y gestionar los residuos generados como peligrosos.', 'Investigar causas y abrir acción correctiva (SGA-F-1002).'])) +
    sec('4', 'Pruebas y revisión', p('Se realizan simulacros al menos una vez al año (SGA-F-806). El plan se revisa después de cada emergencia real o simulacro.')),
  ),

  fmt('drill', G[3], '8.2', 'SGA-F-806', 'Acta de simulacro de emergencia ambiental', 'Acta', 'Responsable de emergencias', 'Evidencia y evaluación de pruebas periódicas del plan de respuesta.', () =>
    sec('1', 'Datos del simulacro', kv([['Escenario', ''], ['Fecha y hora', ''], ['Lugar', ''], ['Coordinador', ''], ['Participantes (n.º)', ''], ['Observadores', '']])) +
    sec('2', 'Cronología', table(['Hora', 'Evento / acción', 'Responsable'], [], 6, ['12%', '', '24%'])) +
    sec('3', 'Evaluación', table(['Criterio', 'Satisfactorio', 'Mejorable', 'Observación'], [
      ['Tiempo de respuesta (meta ≤ 10 min)', checkbox, checkbox, ''], ['Uso correcto del kit antiderrame', checkbox, checkbox, ''], ['Comunicación interna y externa', checkbox, checkbox, ''], ['Contención efectiva', checkbox, checkbox, ''],
    ], 1, ['40%', '14%', '14%', ''])) +
    sec('4', 'Acciones de mejora', table(['Acción', 'Responsable', 'Plazo'], [], 3)),
  ),

  // ---------------- Cl. 9 ----------------
  fmt('monitoring', G[4], '9.1.1', 'SGA-F-901', 'Plan de seguimiento, medición y calibración', 'Plan', 'Coordinador SGA', 'Qué se mide, método, frecuencia, criterio de evaluación, equipo calibrado y registro de resultados.', () =>
    sec('1', 'Fichas de indicadores', table(['Indicador', 'Fórmula', 'Unidad', 'Método / equipo', 'Frecuencia', 'Responsable', 'Criterio (meta)', 'Registro'], [
      ['Intensidad energética', 'kWh / unidad producida', 'kWh/u', 'Medidor eléctrico', 'Mensual', 'Jefe de planta', '≤ 1,02', 'SGA-F-901'],
      ['Huella de carbono', 'tCO₂e alcances 1 + 2', 'tCO₂e', 'Factores de emisión', 'Trimestral', 'Coord. SGA', '−10 % anual', 'Informe GEI'],
      ['Calidad del efluente', 'DBO5, SST, pH', 'mg/L', 'Laboratorio acreditado', 'Mensual', 'Planta de tratamiento', 'Límites del permiso', 'Informe de laboratorio'],
      ['Residuos valorizados', 'kg valorizados / kg totales', '%', 'Balanza', 'Mensual', 'Patio de residuos', '≥ 60 %', 'SGA-R-804'],
    ], 4, ['13%', '15%', '7%', '14%', '9%', '13%', '13%', '16%'])) +
    sec('2', 'Control de equipos de medición', table(['Equipo', 'Código', 'Rango', 'Frecuencia de calibración', 'Última calibración', 'Próxima', 'Estado'], [], 4)),
  ),

  fmt('compliance-eval', G[4], '9.1.2', 'SGA-F-902', 'Evaluación periódica del cumplimiento legal', 'Formato', 'Especialista legal EHS', 'Evalúa el cumplimiento de cada obligación, define acciones y mantiene el conocimiento del estado de cumplimiento.', () =>
    sec('1', 'Datos de la evaluación', kv([['Periodo', ''], ['Evaluador', ''], ['Fecha', ''], ['Método', 'Revisión documental e inspección en sitio']])) +
    sec('2', 'Resultado por obligación', table(['N.º de matriz', 'Obligación', 'Evidencia revisada', 'Resultado', 'Acción requerida', 'Responsable', 'Plazo'], [
      ['L-01', 'Límites de vertido', 'Informe de laboratorio', 'Cumple', '—', '—', '—'],
      ['L-04', 'Emisiones atmosféricas', 'Monitoreo anual', 'No cumple', 'Mantenimiento y nuevo monitoreo', 'Jefe de mantenimiento', '30 días'],
    ], 6)) +
    sec('3', 'Conclusión', p('Porcentaje de cumplimiento = obligaciones que cumplen / obligaciones evaluadas.') + kv([['Obligaciones evaluadas', ''], ['Obligaciones que cumplen', ''], ['% de cumplimiento', '']])),
  ),

  fmt('audit-program', G[4], '9.2.2', 'SGA-F-903', 'Programa anual de auditoría interna', 'Plan', 'Auditor líder', 'Frecuencia, métodos, responsabilidades y criterios, considerando la importancia de los procesos y resultados previos.', () =>
    sec('1', 'Programa', table(['Proceso / área', 'Cláusulas', 'Criterio de priorización', 'Auditor', 'Fecha prevista', 'Fecha real', 'Estado'], [
      ['Producción', '6.1, 8.1', 'Aspectos significativos', '', 'Feb', '', 'Planificada'],
      ['Almacén y residuos', '6.1.3, 8.1, 8.2', 'Hallazgos previos', '', 'Mar', '', 'Planificada'],
      ['Dirección', '4, 5, 9.3', 'Liderazgo', '', 'Abr', '', 'Planificada'],
    ], 5)) +
    sec('2', 'Criterios de independencia', ul(['El auditor no audita su propio trabajo.', 'Los auditores cuentan con formación y competencia demostrada.', 'Los resultados se informan a la dirección responsable del área auditada.'])),
  ),

  fmt('audit-report', G[4], '9.2.2', 'SGA-F-904', 'Informe de auditoría interna con lista de verificación', 'Informe', 'Auditor líder', 'Plan, lista de verificación por cláusula, hallazgos y conclusión de auditoría.', () =>
    sec('1', 'Datos de la auditoría', kv([['Alcance', ''], ['Criterios', 'ISO 14001:2026, legislación aplicable, documentación del SGA'], ['Fecha', ''], ['Equipo auditor', ''], ['Áreas auditadas', ''], ['Auditado(s)', '']])) +
    sec('2', 'Lista de verificación', table(['Cláusula', 'Pregunta de auditoría', 'Evidencia observada', 'Conforme', 'Hallazgo'], [
      ['6.1.2', '¿Los aspectos significativos están determinados y actualizados?', '', checkbox, ''],
      ['6.1.3', '¿Se mantiene y evalúa el cumplimiento de la matriz legal?', '', checkbox, ''],
      ['7.2', '¿El personal demuestra competencia ambiental?', '', checkbox, ''],
      ['8.1', '¿Se aplican los controles operacionales?', '', checkbox, ''],
      ['8.2', '¿Se realizan simulacros y existen recursos de emergencia?', '', checkbox, ''],
      ['9.1', '¿Se miden y analizan los indicadores definidos?', '', checkbox, ''],
    ], 4, ['9%', '38%', '28%', '9%', ''])) +
    sec('3', 'Resumen de hallazgos', table(['N.º', 'Tipo (NC mayor / NC menor / OM / Fortaleza)', 'Cláusula', 'Descripción', 'Evidencia'], [], 4, ['6%', '22%', '10%', '', '22%'])) +
    sec('4', 'Conclusión', p('Conclusión sobre la conformidad, implementación y eficacia del SGA:') + blankBox(3)),
  ),

  fmt('management-review', G[4], '9.3', 'SGA-F-905', 'Acta de revisión por la dirección', 'Acta', 'Alta Dirección', 'Entradas y salidas obligatorias de la revisión por la dirección, con decisiones y responsables.', () =>
    sec('1', 'Datos de la reunión', kv([['Fecha', ''], ['Periodo revisado', ''], ['Asistentes', ''], ['Moderador', '']])) +
    sec('2', 'Entradas de la revisión', table(['Entrada requerida', 'Resumen / dato', 'Observaciones'], [
      ['Estado de las acciones de revisiones previas', '', ''], ['Cambios en cuestiones internas y externas, partes interesadas, aspectos, riesgos y oportunidades', '', ''], ['Grado de logro de los objetivos ambientales', '', ''],
      ['Información sobre el desempeño: no conformidades, seguimiento y medición, cumplimiento, resultados de auditoría', '', ''], ['Adecuación de los recursos', '', ''], ['Comunicaciones pertinentes de partes interesadas, incluidas quejas', '', ''], ['Oportunidades de mejora continua', '', ''],
    ], 0, ['46%', '30%', ''])) +
    sec('3', 'Salidas y decisiones', table(['Decisión / conclusión', 'Responsable', 'Plazo', 'Recursos'], [], 5, ['', '24%', '14%', '18%'])) +
    sec('4', 'Conclusión sobre la conveniencia, adecuación y eficacia del SGA', blankBox(3)),
  ),

  // ---------------- Cl. 10 ----------------
  fmt('nc-report', G[5], '10.2', 'SGA-F-1002', 'Reporte de no conformidad y acción correctiva', 'Formato', 'Coordinador SGA', 'Registro de la no conformidad, corrección, análisis de causa raíz, acción correctiva, verificación de eficacia y cierre.', () =>
    sec('1', 'Identificación', kv([['N.º de reporte', ''], ['Fecha de detección', ''], ['Detectado por', ''], ['Origen', `${checkbox} Auditoría ${checkbox} Inspección ${checkbox} Incidente ${checkbox} Queja ${checkbox} Monitoreo`], ['Proceso / área', ''], ['Cláusula / requisito', '']])) +
    sec('2', 'Descripción de la no conformidad', blankBox(3)) +
    sec('3', 'Corrección inmediata y control de consecuencias', table(['Acción de contención', 'Responsable', 'Fecha', 'Evidencia'], [], 2)) +
    sec('4', 'Análisis de causa raíz (5 porqués)', table(['Pregunta', 'Respuesta'], [['¿Por qué ocurrió?', ''], ['¿Por qué?', ''], ['¿Por qué?', ''], ['¿Por qué?', ''], ['<strong>Causa raíz</strong>', '']], 0, ['26%', ''])) +
    sec('5', 'Plan de acción correctiva', table(['Acción', 'Tipo', 'Responsable', 'Fecha compromiso', 'Recursos'], [], 3, ['', '12%', '20%', '16%', '14%'])) +
    sec('6', 'Revisión de riesgos y cambios al SGA', p(`¿Se requiere actualizar riesgos, oportunidades o el SGA? ${checkbox} Sí ${checkbox} No — Detalle:`)) +
    sec('7', 'Verificación de eficacia y cierre', kv([['Fecha de verificación', ''], ['Evidencia', ''], ['¿La causa fue eliminada?', `${checkbox} Sí ${checkbox} No (reabrir)`], ['Cerrado por', '']])),
  ),

  fmt('improvement', G[5], '10.3', 'SGA-F-1003', 'Registro de mejora continua', 'Registro', 'Coordinador SGA', 'Oportunidades de mejora, decisión, implementación y resultado para elevar el desempeño ambiental.', () =>
    sec('1', 'Registro de iniciativas', table(['N.º', 'Oportunidad de mejora', 'Origen', 'Beneficio esperado', 'Responsable', 'Decisión', 'Resultado'], [
      ['MC-01', 'Recircular agua de lavado', 'Auditoría', '−60 % agua fresca', 'Jefe de planta', 'Aprobada', ''],
    ], 5)) +
    sec('2', 'Indicadores de mejora', kv([['Iniciativas implementadas en el año', ''], ['Ahorro / reducción acumulada', ''], ['Lecciones aprendidas', '']], false)),
  ),
];

function blankBox(lines = 3, hint = ''): string {
  const rows = Array.from({ length: lines }, () => `<div style="border-bottom:1px solid ${LINE};height:24px;"></div>`).join('');
  return `<div style="border:1px solid ${LINE};padding:8px 10px;margin:6px 0 12px;">${hint ? `<div style="font-size:11px;color:${MUTED};margin-bottom:4px;">${hint}</div>` : ''}${rows}</div>`;
}

export function buildPrintableHtml(title: string, bodyHtml: string): string {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8" /><title>${title}</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; padding: 0; background: #ffffff; }
  table { page-break-inside: auto; }
  tr { page-break-inside: avoid; }
  h2 { page-break-after: avoid; }
</style></head><body>${bodyHtml}</body></html>`;
}
