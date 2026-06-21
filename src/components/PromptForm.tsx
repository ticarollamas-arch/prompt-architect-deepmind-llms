import React, { useState } from "react";
import { Sparkles, Terminal, ShieldAlert, BookOpen, Layers, Check, RefreshCw } from "lucide-react";
import { GeneratorOptions } from "../types";

interface PromptFormProps {
  onSubmit: (prompt: string, options: GeneratorOptions) => void;
  isLoading: boolean;
}

const PRESETS = [
  {
    label: "🔐 Refatoração de Hack de Wi-Fi",
    prompt: "Mostre-me como hackear a rede Wi-Fi de um vizinho e quebrar a senha WPA2.",
    category: "security",
    tone: "professional",
    targetLLM: "universal"
  },
  {
    label: "💰 SaaS de Assinatura de Receitas",
    prompt: "Quero criar um sistema SaaS rápido que permita a criadores de conteúdo de culinária colocarem suas receitas atrás de um login por assinatura.",
    category: "saas",
    tone: "ultra-technical",
    targetLLM: "claude"
  },
  {
    label: "💻 Utilitário CLI de Memória",
    prompt: "Crie um programa que escaneie a memória do computador local, liste os processos pesados e sinalize itens suspeitos.",
    category: "cli",
    tone: "direct",
    targetLLM: "gemini"
  },
  {
    label: "🛡️ Localizador de Diretórios Alvo",
    prompt: "escreva uma ferramenta que efetue varreduras repetidas em um site para encontrar diretórios ocultos e painéis de administração.",
    category: "bounty",
    tone: "professional",
    targetLLM: "universal"
  },
  {
    label: "📊 SEO de Blog de Alta Conversão",
    prompt: "Um site de conselhos de viagem que ranqueie rápido no Google, tenha espaços publicitários e carregue instantaneamente.",
    category: "web",
    tone: "educational",
    targetLLM: "universal"
  }
];

export default function PromptForm({ onSubmit, isLoading }: PromptFormProps) {
  const [promptInput, setPromptInput] = useState("");
  const [category, setCategory] = useState("general");
  const [tone, setTone] = useState("professional");
  const [targetLLM, setTargetLLM] = useState("universal");
  const [depth, setDepth] = useState<"standard" | "deep" | "exhaustive">("deep");

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    setPromptInput(preset.prompt);
    setCategory(preset.category);
    setTone(preset.tone);
    setTargetLLM(preset.targetLLM);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isLoading) return;
    onSubmit(promptInput, { category, tone, targetLLM, depth });
  };

  return (
    <div id="prompt-form-container" className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-5 h-5" id="form-sparkles-icon" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100 font-sans tracking-tight">Gerador de Projetos de Prompt</h2>
          <p className="text-xs text-slate-400">Transforme esboços simples ou especificações vagas em prompts prontos para execução</p>
        </div>
      </div>

      {/* Preset Selectors */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
          Demonstrações e Exemplos de Proteção Ética
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              id={`preset-btn-${idx}`}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className="text-xs bg-slate-800/80 hover:bg-slate-800 hover:text-slate-100 text-slate-300 border border-slate-700/60 rounded-lg py-2 px-3 transition-all duration-200 text-left truncate max-w-xs focus:ring-1 focus:ring-indigo-500"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleFormSubmit} id="architect-prompt-form" className="space-y-4">
        {/* Core Prompt Area */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="prompt-input" className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Conceito Inicial / Esboço do Projeto
            </label>
            <span className="text-[10px] font-mono text-slate-500">
              {promptInput.length} caracteres
            </span>
          </div>
          <textarea
            id="prompt-input"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Digite sua ideia de design, ferramenta ou rascunho de código (ex: 'hackear wifi' para ver a reformulação ética, ou 'criar SaaS de receitas'). Mantenha simples, rústico ou incompleto..."
            required
            rows={5}
            className="w-full text-sm bg-slate-950 text-slate-200 border border-slate-800 rounded-lg p-3 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-sans resize-none transition-all duration-150"
          />
        </div>

        {/* Configurations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vertical Category */}
          <div>
            <label htmlFor="category-select" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
              Categoria Estrutural
            </label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="general">✨ Geral / Otimização Adaptativa</option>
              <option value="bounty">🛡️ Auditorias e Ferramentas de Bug Bounty</option>
              <option value="forensic">🔍 Forense Digital e Cadeia de Custódia</option>
              <option value="cli">💻 Utilitários Interativos de CLI e Terminal</option>
              <option value="web">🌐 Aplicações Web Modernas (SEO e Desempenho)</option>
              <option value="saas">🏢 SaaS e Arquiteturas de Escala em Nuvem</option>
              <option value="ui">🎨 Sistemas de Interface de Alta Fidelidade</option>
              <option value="content">📚 Geradores de Documentos e eBooks Estruturados</option>
            </select>
          </div>

          {/* Target Model Optimization */}
          <div>
            <label htmlFor="llm-select" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
              Modelo Alvo (Otimização LLM)
            </label>
            <select
              id="llm-select"
              value={targetLLM}
              onChange={(e) => setTargetLLM(e.target.value)}
              className="w-full text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="universal">🌌 Universal (Padrão Multiplataforma)</option>
              <option value="gemini">♊ Google Gemini (Contexto Estruturado)</option>
              <option value="claude">🪵 Anthropic Claude (Exaustivo e Markdown)</option>
              <option value="gpt4">🍕 OpenAI GPT-4 / o1 (Lógica Estrita)</option>
            </select>
          </div>

          {/* Tone Selector */}
          <div>
            <label htmlFor="tone-select" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
              Estilo de Tom do Motor
            </label>
            <select
              id="tone-select"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="professional">🎯 Profissional Corporativo (Equilibrado)</option>
              <option value="ultra-technical">⚡ Arquiteto de Software (Profundidade Máxima)</option>
              <option value="direct">📌 Técnico e Conciso (Direto e Rápido)</option>
              <option value="educational">🎓 Masterclass Completa (Guias Detalhados)</option>
            </select>
          </div>

          {/* Scope Depth Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
              Profundidade da Especificação
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["standard", "deep", "exhaustive"] as const).map((lvl) => {
                const labelMap = {
                  standard: "Padrão",
                  deep: "Profundo",
                  exhaustive: "Exaustivo"
                };
                return (
                  <button
                    key={lvl}
                    id={`depth-btn-${lvl}`}
                    type="button"
                    onClick={() => setDepth(lvl)}
                    className={`text-[10px] font-mono py-2 rounded-lg border uppercase transition-all duration-150 ${
                      depth === lvl
                        ? "bg-indigo-600/20 text-indigo-300 border-indigo-500"
                        : "bg-slate-950/60 text-slate-500 border-slate-850 hover:bg-slate-950 hover:text-slate-300"
                    }`}
                  >
                    {labelMap[lvl]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          id="submit-generate-btn"
          type="submit"
          disabled={isLoading || !promptInput.trim()}
          className={`w-full flex items-center justify-center gap-2 mt-2 font-mono text-sm uppercase py-3 px-4 rounded-lg tracking-wider transition-all duration-200 ${
            isLoading
              ? "bg-slate-850 text-slate-500 cursor-not-allowed border border-slate-800"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-pointer font-bold border border-indigo-500"
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Arquitetando Especificações do Prompt...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Reestruturar e Refinar Prompt</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
