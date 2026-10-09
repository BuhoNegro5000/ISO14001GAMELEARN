'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { 
  FileText, Edit3, Download, Eye, CheckCircle, Save, FileSpreadsheet,
  Folder, FolderOpen, Search, Clock, Award
} from 'lucide-react';

interface DocMetadata {
  clause: string;
  sdgs: string[];
  owner: string;
  desc: string;
}

const documentMetadataMap: Record<string, DocMetadata> = {
  policy_doc: {
    clause: '§5.2 / §4.1 (Política y Clima)',
    sdgs: ['ODS 13: Acción por el Clima', 'ODS 12: Producción Responsable'],
    owner: 'Dirección General / ESG Manager',
    desc: 'Declaración pública de compromisos ambientales de la organización, integrando prevención de contaminación y acción climática.'
  },
  matrix_doc: {
    clause: '§6.1.2 (Aspectos Ambientales)',
    sdgs: ['ODS 12: Producción Responsable', 'ODS 15: Vida Terrestre'],
    owner: 'EHS Coordinator',
    desc: 'Mapeo detallado de actividades operativas, aspectos asociados (vertidos, ruidos) e impactos calificados por severidad y probabilidad.'
  },
  legal_doc: {
    clause: '§6.1.3 (Requisitos Legales)',
    sdgs: ['ODS 16: Paz, Justicia e Inst. Sólidas'],
    owner: 'EHS Legal Specialist',
    desc: 'Matriz de identificación y estado de conformidad de licencias, permisos de vertidos, ECAs y regulaciones nacionales.'
  },
  objectives_doc: {
    clause: '§6.2 (Objetivos Ambientales)',
    sdgs: ['ODS 13: Acción por el Clima', 'ODS 6: Agua Limpia', 'ODS 12'],
    owner: 'Dirección ESG',
    desc: 'Establecimiento de metas cuantitativas alineadas con ODS (por ejemplo, reducción de carbono y recirculación hídrica).'
  },
  procedures_doc: {
    clause: '§8.1 (Control Operacional)',
    sdgs: ['ODS 12: Consumo Responsable'],
    owner: 'Ops Supervisor',
    desc: 'Instrucciones técnicas de segregación de chatarra, lodos, lubricantes y mantenimiento preventivo de equipos.'
  },
  emergency_doc: {
    clause: '§8.2 (Respuesta ante Emergencias)',
    sdgs: ['ODS 15: Vida de Ecosistemas Terrestres'],
    owner: 'Comité HAZMAT / Emergencias',
    desc: 'Protocolo de actuación rápida ante fugas críticas, uso de kits absorbentes, y neutralización de vertidos de ácidos y cianuro.'
  },
  audit_doc: {
    clause: '§9.2 (Auditoría Interna)',
    sdgs: ['ODS 16: Gobernanza Corporativa'],
    owner: 'Comité de Auditoría Interna',
    desc: 'Informe técnico de conformidad de la planta que recopila no conformidades legales y brechas de control operativo.'
  },
  action_doc: {
    clause: '§10.2 (No Conformidad y Acción Correctiva)',
    sdgs: ['ODS 12: Mejora Continua'],
    owner: 'EHS Manager',
    desc: 'Plan de acción estructurado con causa raíz y responsables para subsanar los hallazgos de la auditoría interna.'
  }
};

const folderStructure = [
  {
    name: 'Contexto y Liderazgo (Cl. 4-5)',
    docIds: ['policy_doc']
  },
  {
    name: 'Planificación (Cl. 6)',
    docIds: ['matrix_doc', 'legal_doc', 'objectives_doc']
  },
  {
    name: 'Operación y Soporte (Cl. 7-8)',
    docIds: ['procedures_doc', 'emergency_doc']
  },
  {
    name: 'Evaluación y Mejora (Cl. 9-10)',
    docIds: ['audit_doc', 'action_doc']
  }
];

export default function DocumentCenter() {
  const { documents, updateDocument, week, currentCompanyId } = useGameStore();
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'Contexto y Liderazgo (Cl. 4-5)': true,
    'Planificación (Cl. 6)': true,
    'Operación y Soporte (Cl. 7-8)': true,
    'Evaluación y Mejora (Cl. 9-10)': true
  });

  const selectedDoc = documents.find((d) => d.id === selectedDocId);
  const docMetadata = selectedDoc ? (documentMetadataMap[selectedDoc.id] || {
    clause: '§7.5',
    sdgs: ['ODS 12'],
    owner: 'EHS Manager',
    desc: 'Documentación del Sistema de Gestión Ambiental.'
  }) : null;

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const startEdit = () => {
    if (selectedDoc) {
      setEditContent(selectedDoc.content);
      setIsEditing(true);
    }
  };

  const saveEdit = () => {
    if (selectedDoc) {
      updateDocument(selectedDoc.id, editContent);
      setIsEditing(false);
    }
  };

  const changeStatus = (newStatus: 'draft' | 'under_review' | 'approved_ceo') => {
    if (selectedDoc) {
      updateDocument(selectedDoc.id, selectedDoc.content, newStatus);
    }
  };

  const handleExportPDF = () => {
    if (!selectedDoc) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${selectedDoc.title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #334155;
              line-height: 1.6;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 { color: #0f172a; font-size: 22px; border-bottom: 3px solid #10b981; padding-bottom: 8px; font-weight: 800; }
            h2 { color: #1e293b; font-size: 18px; margin-top: 24px; font-weight: 700; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px; font-size: 12px; }
            th { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; font-weight: 600; }
            td { border: 1px solid #e2e8f0; padding: 8px 10px; }
            hr { border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0; }
            ol, ul { padding-left: 20px; }
            li { margin-bottom: 6px; }
            .footer { margin-top: 50px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 15px; font-weight: bold; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div>${selectedDoc.content}</div>
          <div class="footer">
            Documento Certificado del SGA - ISO 14001:2026<br>
            Exportado en la Semana ${week} de Simulación.
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportExcel = () => {
    if (!selectedDoc) return;
    let csvContent = "";
    
    if (selectedDoc.type === 'aspect_matrix') {
      csvContent += "Area,Aspecto Ambiental,Impacto Asociado,Severidad,Probabilidad,Total,Significativo,Estado\r\n";
      csvContent += "Produccion,Consumo de energia electrica,Emision indirecta de gases Scope 2,4,5,20,SI,Mitigado\r\n";
      csvContent += "Almacen,Riesgo de derrame de disolventes,Contaminacion de suelos,5,3,15,SI,Mitigado\r\n";
      csvContent += "Logistica,Consumo de diesel,Emisiones directas de GEI Scope 1,4,5,20,SI,Mitigado\r\n";
    } else if (selectedDoc.type === 'legal_matrix') {
      csvContent += "ID Reg,Nombre de la Regulacion,Exigencia Legal,Estado\r\n";
      csvContent += "R-01,Permiso de vertimiento industrial de efluentes,Concentraciones DBO5 < LMP,En Evaluacion\r\n";
      csvContent += "R-02,Reglamento de sustancias peligrosas,Diques de contencion del 110% obligatorios,Implementado\r\n";
    } else {
      csvContent += "Titulo,Tipo de Documento,Estado de Aprobacion,Semana Actual\r\n";
      csvContent += `"${selectedDoc.title}","${selectedDoc.type}","${selectedDoc.status}",${week}\r\n`;
    }

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedDoc.type}_s_${week}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter documents by search query
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-lime-300">Sistema de información documentada</p>
          <h2 className="mt-2 text-xl font-black text-slate-900 dark:text-white">Document Center</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Construye evidencia auditable: identifica el responsable, demuestra el requisito y mueve cada documento hasta su aprobación.</p>
        </div>
        <div className="flex gap-2 text-center">
          <div className="rounded-2xl bg-white px-3 py-2 shadow-sm dark:bg-slate-900"><div className="text-lg font-black text-emerald-600">{documents.length}</div><div className="text-[9px] font-black uppercase tracking-wider text-slate-400">documentos</div></div>
          <div className="rounded-2xl bg-white px-3 py-2 shadow-sm dark:bg-slate-900"><div className="text-lg font-black text-amber-500">{documents.filter((doc) => doc.status === 'approved_ceo').length}</div><div className="text-[9px] font-black uppercase tracking-wider text-slate-400">aprobados</div></div>
        </div>
      </div>
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-4 min-h-[620px]">
      
      {/* 1. Left Sidebar: Folders & Search */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-col gap-4 shadow-3xs">
        <div>
          <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs tracking-wider uppercase px-2 mb-3">
            Explorador SGA (DMS)
          </h3>
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Buscar documento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
        </div>

        {/* Tree List */}
        <div className="flex-1 overflow-y-auto max-h-[350px] lg:max-h-[600px] flex flex-col gap-2 px-1">
          {searchQuery ? (
            /* Flattened search result */
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Resultados</span>
              {filteredDocuments.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => { setSelectedDocId(doc.id); setIsEditing(false); }}
                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left text-xs transition-all ${
                    doc.id === selectedDocId
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="font-semibold truncate">{doc.title}</span>
                </button>
              ))}
              {filteredDocuments.length === 0 && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 italic px-1">Cero coincidencias.</span>
              )}
            </div>
          ) : (
            /* Folder list */
            folderStructure.map(folder => {
              const isExpanded = expandedFolders[folder.name];
              const folderDocs = documents.filter(d => folder.docIds.includes(d.id));
              
              if (folderDocs.length === 0) return null;

              return (
                <div key={folder.name} className="flex flex-col gap-0.5">
                  <button
                    onClick={() => toggleFolder(folder.name)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 text-xs font-black text-left cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {isExpanded ? <FolderOpen className="w-4 h-4 text-amber-500" /> : <Folder className="w-4 h-4 text-amber-500" />}
                      <span className="truncate max-w-[150px]">{folder.name}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{folderDocs.length}</span>
                  </button>

                  {isExpanded && (
                    <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 dark:border-slate-850 ml-3.5 mt-0.5">
                      {folderDocs.map(doc => {
                        const isSelected = doc.id === selectedDocId;
                        return (
                          <button
                            key={doc.id}
                            onClick={() => { setSelectedDocId(doc.id); setIsEditing(false); }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-[11px] transition-all border border-transparent ${
                              isSelected
                                ? 'bg-slate-100 dark:bg-slate-850 border-slate-200/60 dark:border-slate-750 text-slate-850 dark:text-white font-extrabold shadow-3xs'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/40'
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <FileText className="w-3.5 h-3.5 shrink-0 opacity-70" />
                              <span className="truncate">{doc.title.replace('Política Ambiental de ', 'Política ').replace('Matriz de Aspectos e Impactos Ambientales', 'Matriz de Aspectos')}</span>
                            </span>
                            {doc.status === 'approved_ceo' && (
                              <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Middle Block: Split Screen Editor / Preview */}
      <div className="lg:col-span-2 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-3xs">
        {selectedDoc ? (
          <div className="flex flex-col h-full">
            {/* Header Panel Toolbar */}
            <div className="border-b border-slate-150 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950 flex justify-between items-center gap-2">
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-slate-800 dark:text-white text-xs truncate">
                  {selectedDoc.title}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>Última firma: {selectedDoc.lastUpdated}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isEditing ? (
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" /> Guardar
                  </button>
                ) : (
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Editar
                  </button>
                )}

                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-655 dark:text-slate-350 text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                  title="Imprimir / Exportar a PDF"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>

                {(selectedDoc.type === 'aspect_matrix' || selectedDoc.type === 'legal_matrix') && (
                  <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-655 dark:text-slate-350 text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                    title="Exportar Matriz a CSV/Excel"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
                  </button>
                )}
              </div>
            </div>

            {/* Split view content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[400px]">
              
              {/* Left pane: Text Input (HTML editor) */}
              <div className={`w-full md:w-1/2 p-4 border-r border-slate-100 dark:border-slate-850 flex flex-col gap-2 bg-slate-50 dark:bg-slate-950 ${isEditing ? 'block' : 'hidden md:flex bg-slate-50/50'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {isEditing ? 'Editor de Contenido' : 'Editor en Reposo'}
                  </span>
                  {!isEditing && (
                    <button 
                      onClick={startEdit} 
                      className="text-[10px] text-emerald-500 hover:underline font-extrabold cursor-pointer"
                    >
                      Activar Editor
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 w-full p-3 font-mono text-[11px] leading-relaxed border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none min-h-[300px]"
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500 gap-2">
                    <Edit3 className="w-8 h-8 stroke-[1.5] opacity-50" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">El editor está inactivo</p>
                    <p className="text-[10px] max-w-[150px] leading-normal mt-0.5">Haz clic en &quot;Editar&quot; arriba para modificar el código HTML de tu documento.</p>
                  </div>
                )}
              </div>

              {/* Right pane: Visual sheet simulator */}
              <div className={`w-full ${isEditing ? 'hidden md:block' : 'w-full'} p-4 overflow-y-auto max-h-[480px] bg-slate-100 dark:bg-slate-950 flex justify-center items-start`}>
                <div 
                  className="paper-sheet w-full max-w-[420px] min-h-[500px] p-6 text-xs shadow-md border-t-4 transition-all duration-300 select-none animate-fade-in-up"
                  style={{ 
                    borderTopColor: currentCompanyId === 'metal' ? '#10b981' : 
                                    currentCompanyId === 'chem' ? '#8b5cf6' : 
                                    currentCompanyId === 'power' ? '#0ea5e9' : 
                                    currentCompanyId === 'mine' ? '#d97706' : 
                                    currentCompanyId === 'oil' ? '#f97316' : '#4f46e5'
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: isEditing ? editContent : selectedDoc.content }} />
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 dark:text-slate-500 gap-3">
            <Eye className="w-12 h-12 stroke-[1.5]" />
            <p className="text-sm font-semibold">Seleccione un documento para visualizarlo</p>
          </div>
        )}
      </div>

      {/* 3. Right Sidebar: Document Metadata Inspector */}
      {selectedDoc && docMetadata && (
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-3xs animate-fade-in-up">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs tracking-wider uppercase mb-1">
                Inspector EHS
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal">
                Verificación de conformidad de información documentada según Cláusula 7.5.
              </p>
            </div>

            {/* General Info */}
            <div className="flex flex-col gap-2.5 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-850">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">Cláusula ISO</span>
                <span className="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  {docMetadata.clause}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">Responsable</span>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                  {docMetadata.owner}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">Descripción</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  {docMetadata.desc}
                </p>
              </div>
            </div>

            {/* ODS Badges */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide px-1">Alineación con ODS (ONU)</span>
              <div className="flex flex-wrap gap-1.5">
                {docMetadata.sdgs.map(sdg => (
                  <span 
                    key={sdg} 
                    className="text-[9px] font-black px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-xl"
                  >
                    {sdg}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Approval Timeline */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide px-1">Línea de Aprobación</span>
              
              <div className="flex flex-col gap-1.5 pl-1.5">
                {/* Step 1: Borrador */}
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    selectedDoc.status === 'draft' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {selectedDoc.status === 'draft' ? '1' : '✓'}
                  </div>
                  <span className={`font-bold ${selectedDoc.status === 'draft' ? 'text-amber-500' : 'text-slate-500'}`}>
                    Borrador Inicial
                  </span>
                </div>

                {/* Step 2: Under Review */}
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    selectedDoc.status === 'under_review' ? 'bg-indigo-500 text-white' :
                    selectedDoc.status === 'approved_ceo' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {selectedDoc.status === 'under_review' ? '2' : 
                     selectedDoc.status === 'approved_ceo' ? '✓' : '2'}
                  </div>
                  <span className={`font-bold ${
                    selectedDoc.status === 'under_review' ? 'text-indigo-500' :
                    selectedDoc.status === 'approved_ceo' ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Revisión de Gestión
                  </span>
                </div>

                {/* Step 3: Approved */}
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    selectedDoc.status === 'approved_ceo' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {selectedDoc.status === 'approved_ceo' ? '✓' : '3'}
                  </div>
                  <span className={`font-bold ${selectedDoc.status === 'approved_ceo' ? 'text-emerald-500' : 'text-slate-400'}`}>
                    Firmado por CEO
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow actions button */}
          <div className="border-t border-slate-100 dark:border-slate-850 pt-4 mt-4">
            {selectedDoc.status === 'draft' && (
              <button
                onClick={() => changeStatus('under_review')}
                className="w-full flex items-center justify-center gap-1.5 text-[11px] font-extrabold py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                Someter a Revisión EHS
              </button>
            )}
            {selectedDoc.status === 'under_review' && (
              <button
                onClick={() => changeStatus('approved_ceo')}
                className="w-full flex items-center justify-center gap-1.5 text-[11px] font-extrabold py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer transition-colors animate-pulse"
              >
                Firmar y Aprobar como CEO
              </button>
            )}
            {selectedDoc.status === 'approved_ceo' && (
              <div className="flex items-center justify-center gap-1.5 p-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-wider text-center">
                <CheckCircle className="w-4 h-4" /> Aprobado y Vigente para Auditoría
              </div>
            )}
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
