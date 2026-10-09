import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { 
  Building2, Gauge, Zap, Droplet, Trash2, Wind, ShieldAlert, Users, 
  HelpCircle, Settings, CheckCircle2, ChevronRight, Lock 
} from 'lucide-react';

export default function CompanyAreas() {
  const { areas, toggleControl, budget } = useGameStore();
  const [selectedAreaId, setSelectedAreaId] = useState<string>('dg');

  // Fallback to the first available area if the selected ID doesn't exist in the current company
  const selectedArea = areas[selectedAreaId] || Object.values(areas)[0];

  // Helper to categorize areas dynamically for cleaner layout
  const categories = {
    admin: { name: 'Dirección', ids: Object.values(areas).filter(a => a.category === 'admin').map(a => a.id) },
    ops: { name: 'Operaciones', ids: Object.values(areas).filter(a => a.category === 'ops').map(a => a.id) },
    support: { name: 'Soporte e Innovación', ids: Object.values(areas).filter(a => a.category === 'support').map(a => a.id) }
  };

  const getAreaIcon = (id: string) => {
    if (id.includes('dg') || id.includes('off')) return Building2;
    if (id.includes('prod') || id.includes('react') || id.includes('ref')) return Settings;
    if (id.includes('alm')) return Lock;
    if (id.includes('log')) return ChevronRight;
    if (id.includes('pt')) return Droplet;
    if (id.includes('patio')) return Trash2;
    if (id.includes('lab')) return HelpCircle;
    return Gauge;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full min-h-[500px]">
      {/* Sidebar: Explore areas */}
      <div className="xl:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm tracking-wide uppercase px-1">
          Mapa de la Empresa
        </h3>

        <div className="flex flex-col gap-4 overflow-y-auto max-h-[550px]">
          {Object.entries(categories).map(([catKey, cat]) => {
            if (cat.ids.length === 0) return null;
            return (
              <div key={catKey} className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                  {cat.name}
                </span>
                <div className="flex flex-col gap-1">
                  {cat.ids.map((id) => {
                    const area = areas[id];
                    if (!area) return null;
                    const isSelected = area.id === selectedArea?.id;
                    const Icon = getAreaIcon(id);
                    
                    // Color codes for risk levels
                    let riskColor = 'bg-emerald-500';
                    if (area.riskLevel > 70) riskColor = 'bg-rose-500';
                    else if (area.riskLevel > 40) riskColor = 'bg-amber-500';

                    return (
                      <button
                        key={id}
                        onClick={() => setSelectedAreaId(id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all border ${
                          isSelected
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 shadow-xs'
                            : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${
                            isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold truncate max-w-[120px]">{area.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-semibold text-slate-400">R: {area.riskLevel}%</span>
                          <span className={`w-2 h-2 rounded-full ${riskColor}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Panel: Selected Area Details */}
      <div className="xl:col-span-3 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {selectedArea ? (
          <div className="flex flex-col h-full">
            {/* Area Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[9px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-md px-2 py-1 font-bold uppercase tracking-wider">
                  Área física
                </span>
                <h2 className="font-black text-slate-800 dark:text-white text-xl mt-1.5">
                  {selectedArea.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                  {selectedArea.description}
                </p>
              </div>

              {/* General area indicators */}
              <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Personal</span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{selectedArea.workersCount}</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Riesgo Op.</span>
                    <span className="text-xs font-extrabold text-rose-500">{selectedArea.riskLevel}%</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Formación</span>
                    <span className="text-xs font-extrabold text-emerald-500">{selectedArea.trainingProgress}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto max-h-[460px]">
              {/* Left Column: Environmental Aspects & Risks */}
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs tracking-wider uppercase mb-3">
                    Aspectos e Impactos Ambientales (Cláusula 6.1.2)
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {selectedArea.aspects.map((asp) => (
                      <div 
                        key={asp.id} 
                        className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col gap-1.5"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-bold text-xs text-slate-800 dark:text-slate-200 leading-snug">
                            {asp.name}
                          </p>
                          <div className="flex gap-1.5 flex-shrink-0">
                            {asp.isSignificant && (
                              <span className="text-[8px] bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-extrabold rounded px-1.5 py-0.5 uppercase tracking-wide">
                                Significativo
                              </span>
                            )}
                            <span className={`text-[8px] font-extrabold rounded px-1.5 py-0.5 uppercase tracking-wide ${
                              asp.mitigated 
                                ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                                : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                            }`}>
                              {asp.mitigated ? 'Mitigado' : 'Activo'}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                          <strong>Impacto:</strong> {asp.impact}
                        </p>
                        <div className="flex gap-3 text-[10px] text-slate-400 font-semibold mt-1">
                          <span>Severidad: <strong className="text-slate-600 dark:text-slate-300">{asp.severity}</strong></span>
                          <span>Probabilidad: <strong className="text-slate-600 dark:text-slate-300">{asp.probability}</strong></span>
                          <span>Importancia: <strong className="text-slate-800 dark:text-white font-bold">{asp.significanceScore}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Operational Controls & Energy Metrics */}
              <div className="flex flex-col gap-6">
                {/* Consumibles / Inputs */}
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs tracking-wider uppercase mb-3">
                    Consumos e Indicadores Semanales
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Energía</span>
                        <span className="text-xs font-black text-slate-800 dark:text-white">
                          {selectedArea.energyUsage.toLocaleString('es-ES')} kWh
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <Droplet className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Agua</span>
                        <span className="text-xs font-black text-slate-800 dark:text-white">
                          {selectedArea.waterUsage.toLocaleString('es-ES')} m³
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Residuos</span>
                        <span className="text-xs font-black text-slate-800 dark:text-white">
                          {selectedArea.wasteGenerated.toLocaleString('es-ES')} kg
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-500/10 text-slate-450">
                        <Wind className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Carbono</span>
                        <span className="text-xs font-black text-slate-800 dark:text-white">
                          {selectedArea.emissions.toLocaleString('es-ES')} kg
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controles Operacionales */}
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs tracking-wider uppercase mb-3">
                    Controles Operacionales (Cláusula 8.1)
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {selectedArea.controls.length > 0 ? (
                      selectedArea.controls.map((ctrl) => {
                        const isAffordable = budget >= ctrl.cost;
                        return (
                          <div 
                            key={ctrl.id} 
                            className={`border rounded-xl p-4 transition-all ${
                              ctrl.active 
                                ? 'bg-emerald-50/20 border-emerald-500/30' 
                                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <p className="font-extrabold text-xs text-slate-800 dark:text-slate-100 leading-snug">
                                  {ctrl.name}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                  {ctrl.description}
                                </p>
                              </div>
                              <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded px-2 py-0.5 whitespace-nowrap">
                                Costo: ${ctrl.cost.toLocaleString('es-ES')}
                              </span>
                            </div>

                            {/* Impacts modifiers */}
                            <div className="flex flex-wrap gap-2 mt-3 text-[9px] font-bold">
                              {Object.entries(ctrl.impacts).map(([key, val]) => {
                                const sign = (val as number) > 0 ? '+' : '';
                                let color = 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400';
                                if (key === 'compliance' && (val as number) > 0) color = 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400';
                                else if (key !== 'compliance' && (val as number) < 0) color = 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400';
                                
                                return (
                                  <span key={key} className={`rounded px-1.5 py-0.5 capitalize ${color}`}>
                                    {key}: {sign}{val}%
                                  </span>
                                );
                              })}
                            </div>

                            <button
                              onClick={() => toggleControl(selectedArea.id, ctrl.id)}
                              disabled={!ctrl.active && !isAffordable}
                              className={`w-full text-xs font-bold py-2 rounded-lg mt-4 cursor-pointer transition-all ${
                                ctrl.active 
                                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs' 
                                  : isAffordable 
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                              }`}
                            >
                              {ctrl.active ? 'Desactivar Control' : 'Implementar Control'}
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 dark:text-slate-500 italic p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        No hay controles específicos diseñados para esta área. La capacitación y comunicación general aplican aquí.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 dark:text-slate-500 gap-3">
            <Building2 className="w-12 h-12 stroke-[1.5]" />
            <p className="text-sm font-semibold">Seleccione un área del mapa para explorar sus procesos</p>
          </div>
        )}
      </div>
    </div>
  );
}
