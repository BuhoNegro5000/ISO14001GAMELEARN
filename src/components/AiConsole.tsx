import React, { useState, useRef, useEffect } from 'react';
import { useGameStore, ChatMessage } from '@/store/gameStore';
import { getAiMockResponse } from '@/lib/aiMock';
import { Send, Sparkles, Key, AlertCircle, Bot, User, ShieldAlert, BadgeCheck, Landmark } from 'lucide-react';

export default function AiConsole() {
  const store = useGameStore();
  const { chatHistory, addChatMessage } = store;

  const [activeAgent, setActiveAgent] = useState<'auditor' | 'consultor' | 'inspector' | 'ceo'>('consultor');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('env_sim_openai_key') || '';
    }
    return '';
  });
  const [apiModel, setApiModel] = useState('gpt-4o-mini');
  const [useRealApi, setUseRealApi] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('env_sim_openai_key');
    }
    return false;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const saveApiSettings = () => {
    if (apiKey) {
      sessionStorage.setItem('env_sim_openai_key', apiKey);
      setUseRealApi(true);
      setShowApiSettings(false);
    } else {
      sessionStorage.removeItem('env_sim_openai_key');
      setUseRealApi(false);
      setShowApiSettings(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentAgentChatHistory = chatHistory[activeAgent];

  useEffect(() => {
    scrollToBottom();
  }, [currentAgentChatHistory, isTyping]);

  const activeMessages = chatHistory[activeAgent] || [];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'player',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user message to state
    addChatMessage(activeAgent, userMessage);
    const textToSend = inputText;
    setInputText('');
    setIsTyping(true);

    // Dynamic prompt preparation for real API call
    const gameStateContext = {
      week: store.week,
      budget: store.budget,
      legalCompliance: store.legalCompliance,
      environmentalScore: store.environmentalScore,
      reputation: store.reputation,
      operationalRisk: store.operationalRisk,
      certificationProbability: store.certificationProbability,
      carbonFootprint: store.carbonScope1 + store.carbonScope2 + store.carbonScope3,
      policyStatus: store.documents.find(d => d.type === 'policy')?.status,
      climateDetermined: store.climateRelevanceDetermined,
      openIncidentsCount: store.incidents.filter(i => i.status === 'open').length,
    };

    let replyText = '';

    if (useRealApi && apiKey) {
      try {
        const companyName = store.currentCompanyId === 'metal' ? 'EnviroPro' : 
                            store.currentCompanyId === 'chem' ? 'BioChem' : 
                            store.currentCompanyId === 'power' ? 'EcoPower' :
                            store.currentCompanyId === 'mine' ? 'MineGold' :
                            store.currentCompanyId === 'oil' ? 'PetroGlow' : 'SkyGate';
        const agentSystemPrompts = {
          auditor: `Eres el Auditor Líder de Certificación ISO 14001:2026. Eres riguroso, formal y te apegas estrictamente a las cláusulas de la cuarta edición de la norma (incluyendo Cláusula 6.3 de Gestión del Cambio y evaluación climática en 4.1). Evalúas la evidencia presentada por el Environmental Manager de ${companyName}. Contexto actual: Semana ${gameStateContext.week}, Presupuesto: $${gameStateContext.budget}, Cumplimiento Legal: ${gameStateContext.legalCompliance}%, Score Ambiental: ${gameStateContext.environmentalScore}%, Incendentes abiertos: ${gameStateContext.openIncidentsCount}, Clima determinado: ${gameStateContext.climateDetermined}. Respuestas cortas, profesionales y apegadas a la norma 2026.`,
          consultor: `Eres un Consultor Experto en Sistemas de Gestión Ambiental ISO 14001:2026. Eres amigable, pedagógico y orientas al usuario de ${companyName} explicándole qué controles implementar o qué documentos redactar para cumplir la norma 2026. Contexto actual: Semana ${gameStateContext.week}, Presupuesto: $${gameStateContext.budget}, Cumplimiento Legal: ${gameStateContext.legalCompliance}%, Score Ambiental: ${gameStateContext.environmentalScore}%. Guíale paso a paso.`,
          inspector: `Eres un Inspector de la Agencia de Fiscalización Ambiental (OEFA). Eres serio, demandante y buscas el cumplimiento legal. Adviertes sobre sanciones y multas a ${companyName} si los indicadores legales o los controles operativos fallan. Cumplimiento Legal: ${gameStateContext.legalCompliance}%, Riesgo Operativo: ${gameStateContext.operationalRisk}%. Exige controles operacionales adecuados.`,
          ceo: `Eres el Director General (CEO) de ${companyName}. Te importa la rentabilidad, la reputación de la empresa y la obtención de la certificación ISO 14001:2026 para exportar. Exiges justificación de costos y cuidar el presupuesto de $${gameStateContext.budget}. Mantén una actitud ejecutiva de liderazgo.`
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: apiModel,
            messages: [
              { role: 'system', content: agentSystemPrompts[activeAgent] },
              { role: 'user', content: textToSend }
            ],
            max_tokens: 350,
            temperature: 0.7
          })
        });

        if (response.ok) {
          const data = await response.json();
          replyText = data.choices[0].message.content;
        } else {
          // Fallback to mock if API returns error
          console.error("OpenAI API returned error. Routing to local simulator engine.");
          replyText = `[Error API - Usando Motor Local]: ` + getAiMockResponse(activeAgent, textToSend, store);
        }
      } catch (err) {
        console.error("Failed to connect to OpenAI", err);
        replyText = `[Error Conexión - Usando Motor Local]: ` + getAiMockResponse(activeAgent, textToSend, store);
      }
    } else {
      // Simulate think delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      replyText = getAiMockResponse(activeAgent, textToSend, store);
    }

    const aiMessage: ChatMessage = {
      id: `msg_${Date.now()}_reply`,
      sender: activeAgent,
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setIsTyping(false);
    addChatMessage(activeAgent, aiMessage);
  };

  const agentsInfo = {
    consultor: {
      name: 'Consultor Técnico IA',
      role: 'Asesoría y Guía ISO',
      desc: 'Te orienta en cada cláusula de la norma y recomienda qué implementar para avanzar en el juego.',
      icon: Bot,
      color: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
      avatar: '🟢'
    },
    auditor: {
      name: 'Auditor Líder IA',
      role: 'Certificación e Informes',
      desc: 'Evalúa la validez de tus matrices, políticas y evidencias. Registra no conformidades antes de certificar.',
      icon: BadgeCheck,
      color: 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900',
      avatar: '🔵'
    },
    inspector: {
      name: 'Inspector OEFA IA',
      role: 'Fiscalía y Cumplimiento',
      desc: 'Realiza inspecciones sorpresa en planta. Impone multas costosas ante faltas o pasivos ambientales.',
      icon: ShieldAlert,
      color: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900',
      avatar: '🟡'
    },
    ceo: {
      name: 'Director General IA',
      role: 'CEO & Control Financiero',
      desc: 'Autoriza el presupuesto de la empresa. Evalúa la reputación y exige resultados sin descuidar el margen.',
      icon: Landmark,
      color: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900',
      avatar: '💼'
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 shadow-sm">
      {/* Sidebar: Agents selector */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm tracking-wide uppercase">
              Asistentes de IA
            </h3>
            <button
              onClick={() => setShowApiSettings(!showApiSettings)}
              className={`p-1.5 rounded-lg border text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300 transition-all cursor-pointer ${
                useRealApi 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-600' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
              title="Configuración API OpenAI"
            >
              <Key className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {(Object.keys(agentsInfo) as Array<keyof typeof agentsInfo>).map((key) => {
              const info = agentsInfo[key];
              const isSelected = key === activeAgent;
              const Icon = info.icon;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveAgent(key);
                    setIsTyping(false);
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-slate-50 dark:bg-slate-800 border-emerald-500 shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className={`p-2 rounded-lg border flex-shrink-0 ${info.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-extrabold text-slate-800 dark:text-slate-100 text-xs">
                      {info.name}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">
                      {info.role}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-1.5 line-clamp-2">
                      {info.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-[10px] bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 rounded-lg p-2.5 border border-slate-200/60 dark:border-slate-800/60 leading-normal flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <span>Pregunta sobre requerimientos, solicita firmas o revisa el estado legal con el asistente correspondiente.</span>
        </div>
      </div>

      {/* Main chat interface */}
      <div className="lg:col-span-3 flex flex-col bg-white dark:bg-slate-900 justify-between h-full relative">
        {/* API Settings Modal overlay */}
        {showApiSettings && (
          <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 z-10 p-6 flex flex-col justify-center max-w-md mx-auto gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-emerald-500" />
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base">
                Conectar Inteligencia Real (OpenAI)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              De forma predeterminada, el juego utiliza un motor local inteligente basado en reglas para simular respuestas al instante. Si deseas conversaciones dinámicas y personalizadas que lean detalladamente tus documentos, ingresa tu API Key de OpenAI.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                OpenAI API Key (se guarda localmente en sesión)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                  Modelo GPT
                </label>
                <select
                  value={apiModel}
                  onChange={(e) => setApiModel(e.target.value)}
                  className="text-xs p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white"
                >
                  <option value="gpt-4o-mini">gpt-4o-mini (Recomendado)</option>
                  <option value="gpt-4o">gpt-4o (Completo)</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={saveApiSettings}
                  className="w-full text-xs font-bold py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Aplicar Configuración
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowApiSettings(false)}
              className="text-[11px] font-bold text-slate-400 dark:text-slate-500 text-center hover:underline mt-2 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Chat Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/40 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xl">{agentsInfo[activeAgent].avatar}</span>
            <div>
              <h2 className="font-extrabold text-slate-800 dark:text-white text-sm">
                {agentsInfo[activeAgent].name}
              </h2>
              <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold uppercase tracking-wider">
                {useRealApi ? '🔌 OpenAI API Activa (' + apiModel + ')' : '⚙️ Simulador Local Activo'}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[420px] bg-slate-50/50 dark:bg-slate-950/30">
          {activeMessages.map((msg) => {
            const isUser = msg.sender === 'player';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 shadow-sm border ${
                    isUser
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-emerald-500" />}
                </div>

                <div
                  className={`rounded-2xl p-3 shadow-xs text-xs leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none prose prose-slate dark:prose-invert max-w-none prose-p:my-1 prose-h3:text-xs prose-h3:font-bold prose-h3:mt-2'
                  }`}
                >
                  {!isUser ? (
                    // Simple text-to-HTML parser or markdown renderer support
                    <div dangerouslySetInnerHTML={{ 
                      __html: msg.text
                        .replace(/\n/g, '<br />')
                        .replace(/### (.*)/g, '<h3 class="font-extrabold text-slate-800 dark:text-white uppercase tracking-wider text-[11px] mb-1 mt-2">$1</h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/-\s(.*)/g, '<li class="ml-4 list-disc">$1</li>')
                    }} />
                  ) : (
                    msg.text
                  )}
                  <span
                    className={`block text-[9px] text-right mt-1.5 font-semibold ${
                      isUser ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 mr-auto max-w-[80%] items-center">
              <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs">
                <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="border-t border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 flex gap-2.5 items-center"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            placeholder={`Escribe tu consulta al ${agentsInfo[activeAgent].name}...`}
            className="flex-1 text-xs p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isTyping || !inputText.trim()}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-xl shadow-md shadow-emerald-600/10 transition-all cursor-pointer flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
