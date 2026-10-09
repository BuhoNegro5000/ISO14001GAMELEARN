import React, { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Award, ShieldAlert, BadgeCheck, RefreshCw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FinalAudit() {
  const store = useGameStore();
  const { 
    currentCompanyId, changeManagementCompleted,
    certificationStatus, runFinalAudit, resetGame, legalCompliance, 
    environmentalScore, reputation, awarenessScore, incidents, 
    climateRelevanceDetermined, documents
  } = store;

  const certCode = `${currentCompanyId.toUpperCase()}-${String(currentCompanyId.length * 137 + 2401).padStart(6, '0')}`;

  const policyDoc = documents.find(d => d.type === 'policy');
  const policySigned = policyDoc?.status === 'approved_ceo';
  const allCompliant = legalCompliance === 100;
  const aspectMatrixValid = documents.find(d => d.type === 'aspect_matrix')?.status !== 'draft';
  const openIncidents = incidents.filter(i => i.status === 'open');
  const trainingComplete = awarenessScore >= 60;

  const isReady = policySigned && allCompliant && aspectMatrixValid && trainingComplete && climateRelevanceDetermined && changeManagementCompleted && openIncidents.length === 0 && environmentalScore >= 65;

  useEffect(() => {
    if (certificationStatus === 'certified') {
      // Trigger confetti explosion on successful certification!
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, animate a bit higher than they would
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [certificationStatus]);

  const handleStartAudit = () => {
    runFinalAudit();
  };

  const getMaturityLevel = () => {
    const score = (environmentalScore + legalCompliance + reputation) / 3;
    if (score >= 90) return { level: 'Nivel 5: Sostenibilidad Optimizada', desc: 'El SGA está plenamente integrado en la estrategia de negocio y la descarbonización es proactiva.' };
    if (score >= 75) return { level: 'Nivel 4: Gestión Avanzada y Cuantificada', desc: 'Control operacional maduro y reducción medible del impacto ambiental.' };
    if (score >= 60) return { level: 'Nivel 3: Sistema Conforme y Documentado', desc: 'Cumplimiento legal garantizado y SGA conforme a la norma ISO 14001.' };
    return { level: 'Nivel 2: Inicial/Reactivo', desc: 'Reacciones ante incidentes y multas legales frecuentes.' };
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto h-full min-h-[500px]">
      {certificationStatus === 'preparing' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Award className="w-8 h-8 text-emerald-500 animate-bounce" />
            <div>
              <h2 className="font-extrabold text-slate-800 dark:text-white text-base">
                Preparación para la Auditoría de Certificación
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Para solicitar la auditoría de certificación ISO 14001:2026 (4ª Edición), debes cumplir rigurosamente todos los requisitos normativos aplicables.
              </p>
            </div>
          </div>

          {/* Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                Estructura y Liderazgo
              </h3>
              
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cláusula 5.2: Política firmada por CEO</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${policySigned ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'}`}>
                  {policySigned ? 'Listo' : 'Pendiente'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cláusula 4.1: Determinación Cambio Climático</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${climateRelevanceDetermined ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'}`}>
                  {climateRelevanceDetermined ? 'Listo' : 'Pendiente'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cláusula 6.1.2: Aspectos evaluados</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${aspectMatrixValid ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'}`}>
                  {aspectMatrixValid ? 'Listo' : 'Pendiente'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cláusula 6.3: Planificación de Cambios</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${changeManagementCompleted ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'}`}>
                  {changeManagementCompleted ? 'Listo' : 'Pendiente'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                Operación y Desempeño
              </h3>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cláusula 6.1.3: Cumplimiento legal (100%)</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${allCompliant ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'}`}>
                  {legalCompliance}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cláusula 7.2: Concientización del personal</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${trainingComplete ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'}`}>
                  {awarenessScore}% (Mín. 60%)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cláusula 10.2: Incidentes/Desvíos cerrados</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${openIncidents.length === 0 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'}`}>
                  {openIncidents.length} abiertos
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs bg-amber-50 dark:bg-slate-950 text-amber-600 dark:text-amber-400 rounded-xl p-4 border border-amber-200/50 dark:border-slate-800 leading-normal flex gap-3 mt-4">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <p>
              <strong>Recomendación del Auditor:</strong> Si inicias la auditoría sin cumplir los criterios, el sistema registrará una **No Conformidad Mayor** y suspenderá el proceso de certificación. Puedes interactuar con el Consultor Técnico en la consola de IA si necesitas ayuda.
            </p>
          </div>

          <button
            onClick={handleStartAudit}
            className={`w-full text-xs font-bold py-3.5 rounded-xl mt-6 cursor-pointer shadow-md transition-all ${
              isReady 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10' 
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-650 cursor-not-allowed shadow-none'
            }`}
            disabled={!isReady}
          >
            {isReady ? 'Iniciar Auditoría Final de Certificación' : 'Requisitos Incompletos para Auditoría'}
          </button>
        </div>
      )}

      {certificationStatus === 'failed' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800 pb-4">
            <ShieldAlert className="w-8 h-8 text-rose-500 animate-pulse" />
            <div>
              <h2 className="font-extrabold text-slate-800 dark:text-white text-base">
                Auditoría Desaprobada - Certificación Rechazada
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                El organismo certificador detectó no conformidades insalvables en tu Sistema de Gestión Ambiental.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
              Gaps y No Conformidades Registradas:
            </h3>
            
            <div className="flex flex-col gap-2.5">
              {!policySigned && (
                <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-150/40 dark:border-rose-900/30">
                  🔴 <strong>No Conformidad Mayor (Cláusula 5.2)</strong>: La Política Ambiental no cuenta con firma legal de la Dirección General.
                </p>
              )}
              {!climateRelevanceDetermined && (
                <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-150/40 dark:border-rose-900/30">
                  🔴 <strong>No Conformidad Mayor (Cláusula 4.1)</strong>: Falta evaluar y justificar la relevancia de las amenazas del Cambio Climático sobre la planta (Enmienda 2024).
                </p>
              )}
              {legalCompliance < 100 && (
                <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-150/40 dark:border-rose-900/30">
                  🔴 <strong>No Conformidad Mayor (Cláusula 6.1.3)</strong>: Existen brechas de cumplimiento con legislaciones nacionales de vertimientos o residuos peligrosos.
                </p>
              )}
              {!changeManagementCompleted && (
                <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-150/40 dark:border-rose-900/30">
                  🔴 <strong>No Conformidad Mayor (Cláusula 6.3)</strong>: No se ha planificado ni estructurado el control del cambio operacional de la planta (requisito clave en ISO 14001:2026).
                </p>
              )}
              {awarenessScore < 60 && (
                <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-150/40 dark:border-rose-900/30">
                  🔴 <strong>No Conformidad Mayor (Cláusula 7.2)</strong>: Nivel de conciencia del personal insatisfactorio para sostener el SGA.
                </p>
              )}
              {openIncidents.length > 0 && (
                <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-150/40 dark:border-rose-900/30">
                  🔴 <strong>No Conformidad Menor (Cláusula 10.2)</strong>: Existen incidentes y fallas operativas activas no resueltas.
                </p>
              )}
              {environmentalScore < 65 && (
                <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-150/40 dark:border-rose-900/30">
                  🔴 <strong>No Conformidad Menor (Cláusula 9.1)</strong>: El desempeño y monitoreo de los aspectos ambientales muestra alta vulnerabilidad operativa.
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => useGameStore.setState({ certificationStatus: 'preparing' })}
            className="w-full text-xs font-bold py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Volver a Intentar
          </button>
        </div>
      )}

      {certificationStatus === 'certified' && (
        <div className="flex flex-col gap-6">
          {/* Certificate */}
          <div className="bg-white dark:bg-slate-900 border-4 border-double border-emerald-500 rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col items-center text-center gap-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full translate-x-10 -translate-y-10" />
            
            <div className="flex justify-between w-full border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex flex-col text-left">
                <span className="text-xl font-black text-slate-800 dark:text-white tracking-tighter">
                  {currentCompanyId === 'metal' ? 'ENVIRO' : 
                   currentCompanyId === 'chem' ? 'BIO' : 
                   currentCompanyId === 'power' ? 'ECO' : 
                   currentCompanyId === 'mine' ? 'MINE' :
                   currentCompanyId === 'oil' ? 'PETRO' : 'SKY'}<span className="text-emerald-500">{
                     currentCompanyId === 'metal' ? 'PRO' : 
                     currentCompanyId === 'chem' ? 'CHEM' : 
                     currentCompanyId === 'power' ? 'POWER' : 
                     currentCompanyId === 'mine' ? 'GOLD' :
                     currentCompanyId === 'oil' ? 'GLOW' : 'GATE'
                   }</span>
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Sistemas Ambientales</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950 rounded px-2.5 py-1 flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" /> CERTIFICADO OFICIAL
              </span>
            </div>

            <Award className="w-16 h-16 text-emerald-500 mt-4 animate-spin [animation-duration:10s]" />

            <h1 className="font-serif font-black text-slate-800 dark:text-white text-2xl tracking-wide uppercase mt-2">
              Certificado de Conformidad
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold -mt-2">
              Se otorga con orgullo el presente reconocimiento a:
            </p>
            <p className="font-extrabold text-slate-800 dark:text-white text-xl border-b-2 border-emerald-500/30 px-6 pb-1">
              {currentCompanyId === 'metal' ? 'ENVIROPRO METALMECÁNICA S.A.' : 
               currentCompanyId === 'chem' ? 'BIOCHEM AGROQUÍMICA S.A.' : 
               currentCompanyId === 'power' ? 'ECOPOWER REFINERÍA S.A.' :
               currentCompanyId === 'mine' ? 'MINEGOLD AURUM VALLEY S.A.' :
               currentCompanyId === 'oil' ? 'PETROGLOW OIL & GAS S.A.' : 'SKYGATE AIRPORT S.A.'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              Por haber implementado, mantenido y mejorado con éxito su Sistema de Gestión Ambiental bajo la norma internacional:
            </p>
            
            <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900 rounded-2xl px-5 py-2">
              ISO 14001:2026 (4ª Edición)
            </p>
            
            <p className="text-[10px] text-slate-400 max-w-sm mt-2">
              Especialidad: {currentCompanyId === 'metal' 
                ? 'Manufactura metalmecánica de piezas de alta precisión y montaje de componentes de distribución.' 
                : currentCompanyId === 'chem'
                  ? 'Formulación y envasado de soluciones de agroquímicos y plaguicidas de alto desempeño.'
                  : currentCompanyId === 'power'
                    ? 'Refinación de biodiésel y biocombustibles a granel con criterios de descarbonización.'
                    : currentCompanyId === 'mine'
                      ? 'Exploración y explotación de oro a tajo abierto con gestión de cianuro y estabilidad de relaveras.'
                      : currentCompanyId === 'oil'
                        ? 'Extracción onshore y refinamiento de crudo con control SCADA y biorremediación de suelos.'
                        : 'Operación aeroportuaria internacional con control de ruido y descarbonización de rampa (GSE).'}
            </p>

            <div className="grid grid-cols-2 gap-12 w-full mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
              <div className="flex flex-col items-center">
                <div className="w-32 border-b border-slate-300 dark:border-slate-700 h-10 flex items-end justify-center font-serif italic text-xs text-slate-600 dark:text-slate-400">
                  Lead Auditor IA
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Lead Auditor</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-32 border-b border-slate-300 dark:border-slate-700 h-10 flex items-end justify-center font-serif italic text-xs text-slate-600 dark:text-slate-400">
                  ✍️ CEO
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Alta Dirección</span>
              </div>
            </div>

            <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-4">
              Fecha de emisión: {new Date().toISOString().split('T')[0]} | Código: CERT-ISO-14001-{certCode}
            </div>
          </div>

          {/* Performance Report */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Reporte de Logros y Desempeño
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Maturity Score</p>
                <p className="font-black text-slate-800 dark:text-white text-base mt-0.5">{getMaturityLevel().level}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{getMaturityLevel().desc}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Resumen de Parámetros Finales</p>
                <div className="flex flex-col gap-1.5 mt-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reputación Corporativa:</span>
                    <span className="font-bold text-emerald-500">{reputation}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cumplimiento Regulatorio:</span>
                    <span className="font-bold text-emerald-500">{legalCompliance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Capacitación y Conciencia:</span>
                    <span className="font-bold text-emerald-500">{awarenessScore}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={resetGame}
                className="text-xs font-bold px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Jugar de nuevo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
