'use client';

import { useMemo, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import {
  documentFormats,
  formatGroups,
  buildPrintableHtml,
  type DocFormat,
} from '@/lib/documentFormats';
import { FileText, FileSpreadsheet, FileDown, Printer, Pencil, Save, RotateCcw, Search, Library } from 'lucide-react';

const kindStyles: Record<string, string> = {
  Política: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  Procedimiento: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200',
  Formato: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  Matriz: 'bg-lime-100 text-lime-800 dark:bg-lime-950 dark:text-lime-200',
  Plan: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200',
  Registro: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
  Informe: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200',
  Acta: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200',
};

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob(['\ufeff', content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function officeWrapper(title: string, body: string, app: 'word' | 'excel') {
  const ns =
    app === 'word'
      ? 'xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"'
      : 'xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"';
  return `<html ${ns} xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${title}</title></head><body>${body}</body></html>`;
}

export default function DocumentLibrary() {
  const { companies, currentCompanyId } = useGameStore();
  const company = companies[currentCompanyId];
  const [selectedId, setSelectedId] = useState(documentFormats[0].id);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<string>('Todos');
  const [editing, setEditing] = useState(false);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const paperRef = useRef<HTMLDivElement>(null);

  const date = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const ctx = useMemo(
    () => ({
      company: company?.name ?? 'Organización',
      sector: company?.sector ?? '',
      logoUrl: '/brand/green-owl-logo.png',
      date,
    }),
    [company?.name, company?.sector, date],
  );

  const selected: DocFormat = documentFormats.find((f) => f.id === selectedId) ?? documentFormats[0];
  const html = edits[selected.id] ?? selected.build(ctx);

  const visible = documentFormats.filter((f) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || `${f.title} ${f.code} ${f.clause} ${f.kind} ${f.summary}`.toLowerCase().includes(q);
    return matchesQuery && (group === 'Todos' || f.group === group);
  });

  const absoluteHtml = (source: string) =>
    source.split('src="/brand/').join(`src="${window.location.origin}/brand/`);

  const currentHtml = () => (editing && paperRef.current ? paperRef.current.innerHTML : html);

  const select = (id: string) => {
    if (editing && paperRef.current) setEdits((prev) => ({ ...prev, [selected.id]: paperRef.current!.innerHTML }));
    setEditing(false);
    setSelectedId(id);
  };

  const saveEdits = () => {
    if (paperRef.current) setEdits((prev) => ({ ...prev, [selected.id]: paperRef.current!.innerHTML }));
    setEditing(false);
  };

  const restore = () => {
    setEdits((prev) => {
      const next = { ...prev };
      delete next[selected.id];
      return next;
    });
    setEditing(false);
  };

  const exportPdf = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(buildPrintableHtml(`${selected.code} ${selected.title}`, absoluteHtml(currentHtml())));
    win.document.close();
    win.focus();
    window.setTimeout(() => win.print(), 700);
  };

  const exportWord = () =>
    downloadBlob(
      officeWrapper(selected.title, absoluteHtml(currentHtml()), 'word'),
      `${selected.code}-${selected.id}.doc`,
      'application/msword',
    );

  const exportExcel = () =>
    downloadBlob(
      officeWrapper(selected.title, absoluteHtml(currentHtml()), 'excel'),
      `${selected.code}-${selected.id}.xls`,
      'application/vnd.ms-excel',
    );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12" suppressHydrationWarning>
      <aside className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-4 xl:col-span-3 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h3 className="flex items-center gap-2 px-1 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <Library className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            Biblioteca de formatos ({documentFormats.length})
          </h3>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, código o cláusula"
              aria-label="Buscar formato"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por cláusula">
            {['Todos', ...formatGroups].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroup(g)}
                aria-pressed={group === g}
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors ${
                  group === g
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {g === 'Todos' ? 'Todos' : g.replace(/\s*\(.*\)/, '')}
              </button>
            ))}
          </div>
        </div>

        <ul className="flex max-h-[520px] flex-col gap-1 overflow-y-auto pr-1 lg:max-h-[640px]">
          {visible.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => select(f.id)}
                aria-current={f.id === selected.id}
                className={`flex w-full flex-col gap-1 rounded-xl border p-2.5 text-left transition-colors ${
                  f.id === selected.id
                    ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40'
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-black text-emerald-700 dark:text-lime-300">{f.code}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ${kindStyles[f.kind]}`}>{f.kind}</span>
                </span>
                <span className="text-xs font-bold leading-snug text-slate-800 dark:text-slate-100">{f.title}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Cl. {f.clause}{edits[f.id] ? ' · editado' : ''}</span>
              </button>
            </li>
          ))}
          {visible.length === 0 && <li className="px-2 py-4 text-xs italic text-slate-500 dark:text-slate-400">Sin coincidencias para esa búsqueda.</li>}
        </ul>
      </aside>

      <section className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm lg:col-span-8 xl:col-span-9 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700 dark:text-lime-300">
              {selected.code} · {selected.kind} · Cláusula {selected.clause}
            </p>
            <h3 className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">{selected.title}</h3>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-400">{selected.summary} Responsable típico: {selected.owner}.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {editing ? (
              <button type="button" onClick={saveEdits} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">
                <Save className="h-3.5 w-3.5" aria-hidden="true" /> Guardar cambios
              </button>
            ) : (
              <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 dark:text-lime-300 dark:hover:bg-emerald-950/40">
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Llenar / editar
              </button>
            )}
            {edits[selected.id] && (
              <button type="button" onClick={restore} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Restaurar formato
              </button>
            )}
            <button type="button" onClick={exportPdf} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              <Printer className="h-3.5 w-3.5" aria-hidden="true" /> PDF / Imprimir
            </button>
            <button type="button" onClick={exportWord} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              <FileDown className="h-3.5 w-3.5" aria-hidden="true" /> Word
            </button>
            <button type="button" onClick={exportExcel} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden="true" /> Excel
            </button>
          </div>
        </div>

        {editing && (
          <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            Modo llenado: haz clic en cualquier celda o párrafo y escribe. Pulsa &quot;Guardar cambios&quot; para conservar tu versión.
          </div>
        )}

        <div className="max-h-[780px] overflow-auto p-4 sm:p-6">
          <div
            key={`${selected.id}-${editing ? 'edit' : 'view'}-${edits[selected.id] ? 'custom' : 'base'}`}
            ref={paperRef}
            contentEditable={editing}
            suppressContentEditableWarning
            spellCheck={editing}
            className={`mx-auto min-w-[760px] max-w-[1100px] rounded-md p-8 shadow-lg ${editing ? 'ring-2 ring-emerald-500' : 'ring-1 ring-slate-200'}`}
            style={{ background: '#ffffff', color: '#0f2a1d' }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>
    </div>
  );
}
