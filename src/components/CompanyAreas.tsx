'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowDown, Building2, CheckCircle2, Droplet, FlaskConical, Gauge, Factory,
  Fuel, GraduationCap, Handshake, Mountain, PlaneTakeoff, ShieldAlert, ShoppingCart,
  Trash2, Truck, Users, Warehouse, Wind, Wrench, Zap,
} from 'lucide-react';
import { useGameStore, type CompanyArea } from '@/store/gameStore';

type Metric = 'riskLevel' | 'energyUsage' | 'waterUsage' | 'wasteGenerated' | 'trainingProgress';

const metrics: Array<{ key: Metric; label: string; unit: string; inverse?: boolean }> = [
  { key: 'riskLevel', label: 'Riesgo', unit: '%' },
  { key: 'energyUsage', label: 'Energía', unit: ' kWh' },
  { key: 'waterUsage', label: 'Agua', unit: ' m³' },
  { key: 'wasteGenerated', label: 'Residuos', unit: ' kg' },
  { key: 'trainingProgress', label: 'Formación', unit: '%', inverse: true },
];

const bands: Array<{ category: CompanyArea['category']; title: string; caption: string }> = [
  { category: 'admin', title: 'Dirección y gestión', caption: 'Liderazgo, recursos y cumplimiento' },
  { category: 'ops', title: 'Zona operativa', caption: 'Procesos con mayor aspecto ambiental' },
  { category: 'support', title: 'Soporte e innovación', caption: 'Servicios, control y mejora' },
];

function pickIcon(area: CompanyArea) {
  const text = `${area.id} ${area.name}`.toLowerCase();
  if (/direcci|oficina|recursos humanos/.test(text)) return Building2;
  if (/relaciones comunit/.test(text)) return Handshake;
  if (/compra|adquisici|abastec/.test(text)) return ShoppingCart;
  if (/laborat/.test(text)) return FlaskConical;
  if (/tratamiento|efluente|reuso|reúso|decantaci|osmosis/.test(text)) return Droplet;
  if (/residuo|relave|ceniza|patio/.test(text)) return Trash2;
  if (/almac|dep[oó]sito|sustancias/.test(text)) return Warehouse;
  if (/granja de combustible|oleoducto|pozo/.test(text)) return Fuel;
  if (/log[ií]stica|despacho|distribuci|terminal y/.test(text)) return Truck;
  if (/pista|pasajero|rampa|gse/.test(text)) return PlaneTakeoff;
  if (/tajo|lixivia|voladura/.test(text)) return Mountain;
  if (/mantenimiento|caldera/.test(text)) return Wrench;
  if (/remediaci/.test(text)) return ShieldAlert;
  if (/producci|reactor|destilaci|refinamiento|prensa/.test(text)) return Factory;
  return Gauge;
}

function heatClasses(ratio: number) {
  if (ratio >= 0.75) return { tile: 'border-rose-400 bg-rose-50 dark:border-rose-500/60 dark:bg-rose-950/50', bar: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300', label: 'Crítico' };
  if (ratio >= 0.5) return { tile: 'border-orange-400 bg-orange-50 dark:border-orange-500/60 dark:bg-orange-950/40', bar: 'bg-orange-500', text: 'text-orange-700 dark:text-orange-300', label: 'Alto' };
  if (ratio >= 0.25) return { tile: 'border-amber-300 bg-amber-50 dark:border-amber-500/50 dark:bg-amber-950/30', bar: 'bg-amber-500', text: 'text-amber-800 dark:text-amber-300', label: 'Medio' };
  return { tile: 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/50 dark:bg-emerald-950/30', bar: 'bg-emerald-500', text: 'text-emerald-800 dark:text-emerald-300', label: 'Bajo' };
}

const impactLabels: Record<string, string> = {
  energy: 'Energía', water: 'Agua', waste: 'Residuos', emissions: 'Emisiones', risk: 'Riesgo', compliance: 'Cumplimiento',
};

export default function CompanyAreas() {
  const { areas, toggleControl, budget } = useGameStore();
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');
  const [metricKey, setMetricKey] = useState<Metric>('riskLevel');

  const areaList = useMemo(() => Object.values(areas), [areas]);
  const selectedArea = areas[selectedAreaId] ?? areaList[0];
  const metric = metrics.find((m) => m.key === metricKey) ?? metrics[0];

  const maxValue = useMemo(() => Math.max(1, ...areaList.map((a) => a[metricKey])), [areaList, metricKey]);

  const totals = useMemo(() => {
    const allControls = areaList.flatMap((a) => a.controls);
    const allAspects = areaList.flatMap((a) => a.aspects);
    return {
      risk: Math.round(areaList.reduce((sum, a) => sum + a.riskLevel, 0) / Math.max(1, areaList.length)),
      energy: areaList.reduce((sum, a) => sum + a.energyUsage, 0),
      water: areaList.reduce((sum, a) => sum + a.waterUsage, 0),
      waste: areaList.reduce((sum, a) => sum + a.wasteGenerated, 0),
      controlsActive: allControls.filter((c) => c.active).length,
      controlsTotal: allControls.length,
      pending: allAspects.filter((a) => a.isSignificant && !a.mitigated).length,
      significant: allAspects.filter((a) => a.isSignificant).length,
    };
  }, [areaList]);

  const kpis = [
    { label: 'Riesgo promedio', value: `${totals.risk}%`, icon: ShieldAlert, tone: 'text-rose-600 dark:text-rose-300' },
    { label: 'Energía semanal', value: `${totals.energy.toLocaleString('es-ES')} kWh`, icon: Zap, tone: 'text-amber-600 dark:text-amber-300' },
    { label: 'Agua semanal', value: `${totals.water.toLocaleString('es-ES')} m³`, icon: Droplet, tone: 'text-sky-600 dark:text-sky-300' },
    { label: 'Residuos semanales', value: `${totals.waste.toLocaleString('es-ES')} kg`, icon: Trash2, tone: 'text-purple-600 dark:text-purple-300' },
    { label: 'Controles activos', value: `${totals.controlsActive} / ${totals.controlsTotal}`, icon: CheckCircle2, tone: 'text-emerald-700 dark:text-emerald-300' },
    { label: 'Significativos sin mitigar', value: `${totals.pending} de ${totals.significant}`, icon: AlertTriangle, tone: 'text-orange-600 dark:text-orange-300' },
  ];

  if (!selectedArea) return null;

  return (
    <div className="flex flex-col gap-6">
      <section aria-label="Indicadores de la planta" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${kpi.tone}`} />
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">{kpi.label}</p>
              </div>
              <p className="mt-1.5 text-lg font-black text-slate-900 dark:text-white">{kpi.value}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Plano esquemático de la planta</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Selecciona una zona para ver sus aspectos y controles. El color indica el nivel de la métrica elegida.
            </p>
          </div>
          <div role="group" aria-label="Métrica del mapa de calor" className="flex flex-wrap gap-1.5">
            {metrics.map((m) => (
              <button
                key={m.key}
                type="button"
                aria-pressed={metricKey === m.key}
                onClick={() => setMetricKey(m.key)}
                className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
                  metricKey === m.key
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-lime-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border-2 border-dashed border-slate-300 p-4 dark:border-slate-700 md:p-5">
          {bands.map((band, bandIndex) => {
            const bandAreas = areaList.filter((a) => a.category === band.category);
            if (bandAreas.length === 0) return null;
            return (
              <div key={band.category}>
                {bandIndex > 0 && (
                  <div className="my-3 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400" aria-hidden="true">
                    <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                    <ArrowDown className="h-3.5 w-3.5" /> Flujo de materiales y decisiones
                    <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                  </div>
                )}
                <div className="mb-2 flex items-baseline gap-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">{band.title}</h3>
                  <span className="text-xs text-slate-600 dark:text-slate-400">{band.caption}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                  {bandAreas.map((area) => {
                    const Icon = pickIcon(area);
                    const raw = area[metricKey];
                    const ratio = metric.inverse
                      ? 1 - Math.min(1, raw / 100)
                      : metricKey === 'riskLevel' ? raw / 100 : raw / maxValue;
                    const heat = heatClasses(ratio);
                    const selected = area.id === selectedArea.id;
                    const pending = area.aspects.filter((a) => a.isSignificant && !a.mitigated).length;
                    const active = area.controls.filter((c) => c.active).length;
                    return (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => setSelectedAreaId(area.id)}
                        aria-pressed={selected}
                        aria-label={`${area.name}. ${metric.label}: ${raw.toLocaleString('es-ES')}${metric.unit}. ${pending} aspectos significativos sin mitigar.`}
                        className={`relative flex min-h-[132px] flex-col justify-between rounded-2xl border-2 p-3 text-left transition hover:-translate-y-0.5 ${heat.tile} ${
                          selected ? 'ring-2 ring-emerald-700 ring-offset-2 ring-offset-white dark:ring-lime-300 dark:ring-offset-slate-900' : ''
                        }`}
                      >
                        {pending > 0 && (
                          <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[11px] font-black text-white">
                            {pending}
                          </span>
                        )}
                        <div className="flex items-start gap-2">
                          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${heat.text}`} />
                          <span className="text-sm font-black leading-tight text-slate-900 dark:text-slate-100">{area.name}</span>
                        </div>
                        <div>
                          <div className="flex items-end justify-between">
                            <span className={`text-lg font-black ${heat.text}`}>
                              {raw.toLocaleString('es-ES')}<span className="text-xs font-bold">{metric.unit}</span>
                            </span>
                            <span className={`text-[11px] font-black uppercase ${heat.text}`}>{heat.label}</span>
                          </div>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                            <div className={`h-full rounded-full ${heat.bar}`} style={{ width: `${Math.max(6, Math.round(ratio * 100))}%` }} />
                          </div>
                          <p className="mt-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            Controles {active}/{area.controls.length}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
          <span>Leyenda:</span>
          {[0.1, 0.35, 0.6, 0.9].map((r) => {
            const h = heatClasses(r);
            return (
              <span key={r} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${h.bar}`} /> {h.label}
              </span>
            );
          })}
          <span className="flex items-center gap-1.5">
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black text-white">n</span>
            Aspectos significativos sin mitigar
          </span>
        </div>
      </section>

      <section aria-live="polite" className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50 md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <span className="rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Zona seleccionada
            </span>
            <h2 className="mt-2 text-xl font-black text-slate-900 dark:text-white">{selectedArea.name}</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-700 dark:text-slate-300">{selectedArea.description}</p>
          </div>
          <div className="flex flex-wrap gap-5 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <div><p className="text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400">Personal</p><p className="text-sm font-black text-slate-900 dark:text-white">{selectedArea.workersCount}</p></div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              <div><p className="text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400">Riesgo</p><p className="text-sm font-black text-rose-700 dark:text-rose-300">{selectedArea.riskLevel}%</p></div>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              <div><p className="text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400">Formación</p><p className="text-sm font-black text-emerald-800 dark:text-emerald-300">{selectedArea.trainingProgress}%</p></div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">Aspectos e impactos (Cláusula 6.1.2)</h3>
              <div className="flex flex-col gap-2.5">
                {selectedArea.aspects.map((asp) => (
                  <article key={asp.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-sm font-bold leading-snug text-slate-900 dark:text-slate-100">{asp.name}</p>
                      <div className="flex gap-1.5">
                        {asp.isSignificant && (
                          <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[11px] font-black uppercase text-rose-700 dark:bg-rose-950 dark:text-rose-300">Significativo</span>
                        )}
                        <span className={`rounded px-1.5 py-0.5 text-[11px] font-black uppercase ${
                          asp.mitigated
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {asp.mitigated ? 'Mitigado' : 'Activo'}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-300">
                      <strong className="text-slate-900 dark:text-slate-100">Impacto:</strong> {asp.impact}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700 dark:text-slate-300">
                      <span>Severidad <strong className="text-slate-900 dark:text-white">{asp.severity}</strong></span>
                      <span>Probabilidad <strong className="text-slate-900 dark:text-white">{asp.probability}</strong></span>
                      <span>Importancia <strong className="text-slate-900 dark:text-white">{asp.significanceScore}</strong></span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">Consumos semanales</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Energía', value: `${selectedArea.energyUsage.toLocaleString('es-ES')} kWh`, icon: Zap, tone: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' },
                  { label: 'Agua', value: `${selectedArea.waterUsage.toLocaleString('es-ES')} m³`, icon: Droplet, tone: 'bg-sky-500/15 text-sky-700 dark:text-sky-300' },
                  { label: 'Residuos', value: `${selectedArea.wasteGenerated.toLocaleString('es-ES')} kg`, icon: Trash2, tone: 'bg-purple-500/15 text-purple-700 dark:text-purple-300' },
                  { label: 'Carbono', value: `${selectedArea.emissions.toLocaleString('es-ES')} kg`, icon: Wind, tone: 'bg-slate-500/15 text-slate-700 dark:text-slate-300' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/50">
                      <div className={`rounded-lg p-2 ${item.tone}`}><Icon className="h-4 w-4" /></div>
                      <div>
                        <p className="text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400">{item.label}</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">Controles operacionales (Cláusula 8.1)</h3>
              <span className="rounded-lg bg-amber-100 px-2 py-1 text-xs font-black text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                Presupuesto ${budget.toLocaleString('es-ES')}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {selectedArea.controls.length > 0 ? (
                selectedArea.controls.map((ctrl) => {
                  const affordable = budget >= ctrl.cost;
                  return (
                    <article
                      key={ctrl.id}
                      className={`rounded-xl border p-4 ${
                        ctrl.active
                          ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-500/50 dark:bg-emerald-950/30'
                          : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black leading-snug text-slate-900 dark:text-slate-100">{ctrl.name}</p>
                          <p className="mt-0.5 text-xs leading-snug text-slate-700 dark:text-slate-300">{ctrl.description}</p>
                        </div>
                        <span className="shrink-0 rounded bg-slate-200 px-2 py-0.5 text-xs font-black text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                          ${ctrl.cost.toLocaleString('es-ES')}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {Object.entries(ctrl.impacts).map(([key, value]) => {
                          const v = value as number;
                          const good = key === 'compliance' ? v > 0 : v < 0;
                          return (
                            <span
                              key={key}
                              className={`rounded px-1.5 py-0.5 text-[11px] font-black ${
                                good
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {impactLabels[key] ?? key} {v > 0 ? '+' : ''}{v}%
                            </span>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleControl(selectedArea.id, ctrl.id)}
                        disabled={!ctrl.active && !affordable}
                        className={`mt-4 w-full rounded-lg py-2.5 text-xs font-black transition ${
                          ctrl.active
                            ? 'bg-amber-700 text-white hover:bg-amber-600'
                            : affordable
                              ? 'bg-emerald-800 text-white hover:bg-emerald-700'
                              : 'cursor-not-allowed bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {ctrl.active ? 'Desactivar control' : affordable ? 'Implementar control' : 'Presupuesto insuficiente'}
                      </button>
                    </article>
                  );
                })
              ) : (
                <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-950/50 dark:text-slate-300">
                  Esta zona no tiene controles específicos. Aplican la capacitación y comunicación generales de la Cláusula 7.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
