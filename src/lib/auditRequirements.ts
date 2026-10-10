import type { GameState } from '@/store/gameStore';

export type GameTab = 'dashboard' | 'map' | 'iso' | 'docs' | 'ai' | 'audit' | 'profile';

export type AuditStage = 'documental' | 'operational';

export interface AuditRequirement {
  id: string;
  clause: string;
  title: string;
  detail: string;
  met: boolean;
  progress: number;
  progressLabel: string;
  severity: 'major' | 'minor';
  stage: AuditStage;
  tab: GameTab;
  action: string;
  finding: string;
}

type AuditState = Pick<
  GameState,
  | 'documents'
  | 'legalMatrix'
  | 'awarenessScore'
  | 'climateRelevanceDetermined'
  | 'changeManagementCompleted'
  | 'incidents'
  | 'environmentalScore'
>;

export const AWARENESS_TARGET = 60;
export const ENVIRONMENTAL_TARGET = 65;

export function getAuditRequirements(state: AuditState): AuditRequirement[] {
  const policySigned = state.documents.find((d) => d.type === 'policy')?.status === 'approved_ceo';
  const aspectMatrixReady = state.documents.find((d) => d.type === 'aspect_matrix')?.status !== 'draft';
  const totalLegal = state.legalMatrix.length;
  const compliantLegal = state.legalMatrix.filter((l) => l.status === 'compliant').length;
  const legalMet = totalLegal > 0 && compliantLegal === totalLegal;
  const openIncidents = state.incidents.filter((i) => i.status !== 'closed').length;
  const totalIncidents = state.incidents.length;

  return [
    {
      id: 'climate',
      clause: '4.1',
      title: 'Contexto y cambio climático',
      detail: 'Determinar si el cambio climático es relevante para la organización y sus partes interesadas.',
      met: state.climateRelevanceDetermined,
      progress: state.climateRelevanceDetermined ? 100 : 0,
      progressLabel: state.climateRelevanceDetermined ? 'Determinado' : 'Sin determinar',
      severity: 'major',
      stage: 'documental',
      tab: 'iso',
      action: 'Abrir Cláusula 4',
      finding: 'No se evidencia la determinación de la relevancia del cambio climático en el contexto de la organización.',
    },
    {
      id: 'policy',
      clause: '5.2',
      title: 'Política ambiental firmada',
      detail: 'La política debe estar aprobada y firmada por la Alta Dirección.',
      met: policySigned,
      progress: policySigned ? 100 : 0,
      progressLabel: policySigned ? 'Firmada por el CEO' : 'Sin firma',
      severity: 'major',
      stage: 'documental',
      tab: 'docs',
      action: 'Ir a Documentos',
      finding: 'La política ambiental no cuenta con la aprobación y firma de la Dirección General.',
    },
    {
      id: 'aspects',
      clause: '6.1.2',
      title: 'Aspectos e impactos evaluados',
      detail: 'La matriz de aspectos debe estar emitida y revisada, no en borrador.',
      met: aspectMatrixReady,
      progress: aspectMatrixReady ? 100 : 0,
      progressLabel: aspectMatrixReady ? 'Matriz emitida' : 'En borrador',
      severity: 'major',
      stage: 'documental',
      tab: 'docs',
      action: 'Ir a Documentos',
      finding: 'La matriz de aspectos e impactos ambientales permanece en estado borrador.',
    },
    {
      id: 'change',
      clause: '6.3',
      title: 'Planificación de los cambios',
      detail: 'Los cambios del SGA deben planificarse de forma controlada y secuenciada.',
      met: state.changeManagementCompleted,
      progress: state.changeManagementCompleted ? 100 : 0,
      progressLabel: state.changeManagementCompleted ? 'Completada' : 'Pendiente',
      severity: 'major',
      stage: 'documental',
      tab: 'iso',
      action: 'Abrir Cláusula 6.3',
      finding: 'No se ha planificado ni controlado el cambio operacional exigido por la cláusula 6.3.',
    },
    {
      id: 'legal',
      clause: '6.1.3',
      title: 'Cumplimiento de requisitos legales',
      detail: 'Todos los requisitos legales aplicables deben estar en estado conforme.',
      met: legalMet,
      progress: totalLegal === 0 ? 0 : Math.round((compliantLegal / totalLegal) * 100),
      progressLabel: `${compliantLegal} de ${totalLegal} conformes`,
      severity: 'major',
      stage: 'operational',
      tab: 'iso',
      action: 'Abrir Cláusula 6',
      finding: `Existen ${totalLegal - compliantLegal} requisito(s) legal(es) aplicable(s) con incumplimiento activo.`,
    },
    {
      id: 'awareness',
      clause: '7.2',
      title: 'Competencia y toma de conciencia',
      detail: `El nivel de concientización del personal debe alcanzar al menos ${AWARENESS_TARGET}%.`,
      met: state.awarenessScore >= AWARENESS_TARGET,
      progress: Math.min(100, Math.round((state.awarenessScore / AWARENESS_TARGET) * 100)),
      progressLabel: `${state.awarenessScore}% de ${AWARENESS_TARGET}% mínimo`,
      severity: 'major',
      stage: 'operational',
      tab: 'iso',
      action: 'Abrir Cláusula 7',
      finding: 'El nivel de toma de conciencia del personal es insuficiente para sostener el SGA.',
    },
    {
      id: 'incidents',
      clause: '10.2',
      title: 'No conformidades cerradas',
      detail: 'Los incidentes deben investigarse y cerrarse con acciones correctivas.',
      met: openIncidents === 0,
      progress: totalIncidents === 0 ? 100 : Math.round(((totalIncidents - openIncidents) / totalIncidents) * 100),
      progressLabel: openIncidents === 0 ? 'Sin incidentes abiertos' : `${openIncidents} abierto(s)`,
      severity: 'minor',
      stage: 'operational',
      tab: 'iso',
      action: 'Abrir Cláusula 10',
      finding: `Hay ${openIncidents} incidente(s) sin acciones correctivas verificadas.`,
    },
    {
      id: 'performance',
      clause: '9.1',
      title: 'Desempeño ambiental',
      detail: `El score ambiental debe alcanzar al menos ${ENVIRONMENTAL_TARGET}%.`,
      met: state.environmentalScore >= ENVIRONMENTAL_TARGET,
      progress: Math.min(100, Math.round((state.environmentalScore / ENVIRONMENTAL_TARGET) * 100)),
      progressLabel: `${state.environmentalScore}% de ${ENVIRONMENTAL_TARGET}% mínimo`,
      severity: 'minor',
      stage: 'operational',
      tab: 'map',
      action: 'Ir al mapa de planta',
      finding: 'El seguimiento y la medición muestran un desempeño ambiental por debajo del mínimo esperado.',
    },
  ];
}

export function isAuditReady(requirements: AuditRequirement[]): boolean {
  return requirements.every((requirement) => requirement.met);
}

export function getReadinessScore(requirements: AuditRequirement[]): number {
  if (requirements.length === 0) return 0;
  const total = requirements.reduce((sum, requirement) => sum + requirement.progress, 0);
  return Math.round(total / requirements.length);
}
