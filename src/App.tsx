import React, { useState, useEffect } from "react";
import { Sparkles, Terminal, FileCode, History, Shield, Info, Compass, HelpCircle } from "lucide-react";
import PromptForm from "./components/PromptForm";
import PromptViewer from "./components/PromptViewer";
import HistoryPanel from "./components/HistoryPanel";
import { GeneratorOptions, PromptArchitectResponse, SavedPrompt } from "./types";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePrompt, setActivePrompt] = useState<PromptArchitectResponse | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);

  // Load drafts on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("prompt_architect_registry");
      if (stored) {
        setSavedPrompts(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved prompt drafts", e);
    }
  }, []);

  const handleGenerate = async (prompt: string, options: GeneratorOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt, options })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Generation request failed");
      }

      const data: PromptArchitectResponse = await response.json();
      setActivePrompt(data);

      // Create new draft record
      const id = Date.now().toString();
      const title = data.objective.substring(0, 50) + "...";
      const newSaved: SavedPrompt = {
        id,
        timestamp: new Date().toISOString(),
        title: title.startsWith("Objective") ? title : `Specs: ${title}`,
        originalInput: prompt,
        options,
        response: data
      };

      const updatedReg = [newSaved, ...savedPrompts];
      setSavedPrompts(updatedReg);
      setActiveId(id);
      localStorage.setItem("prompt_architect_registry", JSON.stringify(updatedReg));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while connecting to the prompt engineering engine.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSaved = (saved: SavedPrompt) => {
    setActivePrompt(saved.response);
    setActiveId(saved.id);
    setError(null);
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedPrompts.filter((item) => item.id !== id);
    setSavedPrompts(updated);
    localStorage.setItem("prompt_architect_registry", JSON.stringify(updated));
    if (activeId === id) {
      setActivePrompt(null);
      setActiveId(null);
    }
  };

  const handleClearAllSaved = () => {
    if (confirm("Tem certeza de que deseja excluir todos os projetos salvos deste navegador?")) {
      setSavedPrompts([]);
      localStorage.removeItem("prompt_architect_registry");
      setActivePrompt(null);
      setActiveId(null);
    }
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 flex flex-col antialiased">
      {/* Upper Navigation / Bar */}
      <nav id="app-navbar" className="bg-slate-900 border-b border-slate-800 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg text-white font-mono shadow-md shadow-indigo-950/20">
              <Terminal className="w-5 h-5" id="nav-terminal-logo" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 flex items-center gap-1.5 font-sans tracking-tight">
                ARQUITETO DE PROMPT
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">COMPILADOR GERATIVO @CYBERHUNTLAB</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-500 hidden sm:inline">Versão 1.2.0</span>
            <span className="h-4 w-px bg-slate-800 hidden sm:inline"></span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-500/10 border border-teal-500/20 rounded font-bold text-teal-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              <span>Motor Gemini 3.5 Ativo</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <main id="app-main-grid" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left panel column (Option settings form & History logs) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col">
            {/* Direct Form */}
            <PromptForm onSubmit={handleGenerate} isLoading={isLoading} />
            
            {/* History Panels logs */}
            <div className="flex-1 min-h-[300px] lg:min-h-0">
              <HistoryPanel
                savedPrompts={savedPrompts}
                onSelect={handleSelectSaved}
                onDelete={handleDeleteSaved}
                onClearAll={handleClearAllSaved}
                activeId={activeId}
              />
            </div>
          </div>

          {/* Right panel column (Results or informational cards fallback) */}
          <div className="lg:col-span-8 flex flex-col">
            {error && (
              <div id="error-output-alert" className="mb-6 p-4 bg-red-950/30 border border-red-900/60 rounded-xl flex gap-3 text-red-200">
                <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
                    Erro de Processamento do Motor
                  </h4>
                  <p className="text-xs text-red-300/90 leading-relaxed font-sans mt-0.5">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {activePrompt ? (
              <PromptViewer data={activePrompt} />
            ) : (
              <div id="empty-state-intro" className="flex-1 flex flex-col justify-center items-center p-8 bg-slate-900/50 border border-slate-800 rounded-xl border-dashed min-y-[450px]">
                <div className="max-w-md w-full text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 shadow-inner">
                      <Compass className="w-10 h-10" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 font-sans tracking-tight">
                      Aguardando Rascunho do Projeto Técnico
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Forneça uma descrição básica, ideias gerais de desenvolvimento ou rascunhos de código no painel esquerdo.
                      O compilador Prompt Architect irá reestruturar tudo instantaneamente em uma folha de especificações detalhada e um mega-prompt de orquestração pronto para execução.
                    </p>
                  </div>

                  {/* Operational Capabilities Highlight Cards */}
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-lg">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Expansão Inteligente</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug">
                        Preenche automaticamente profundidade técnica, estruturas de diretório recomendadas, seleção de tecnologias e metas de desempenho do projeto.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-lg">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider mb-1">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Filtro de Segurança Ética</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug">
                        Reformula instantaneamente solicitações de segurança perigosas ou ofensivas em escopos profissionais e educativos de auditoria defensiva autorizada.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-lg col-span-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Orquestração Pronta para Execução</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug">
                        Gera prompts megaestruturados perfeitos e otimizados para entrada em LLMs avançados (Claude, Gemini, GPT-4) para construção de código em um clique.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer id="app-footer" className="bg-slate-950 border-t border-slate-900 py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>© 2026 Arquiteto de Prompt - Cyberhuntlab</span>
            <span className="w-1 h-3 bg-slate-800"></span>
            <span>Todos os sistemas online</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] bg-slate-905 p-1 border border-slate-850 rounded text-slate-400">
              Porta de Entrada: 3000
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
