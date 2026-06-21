import React, { useState } from "react";
import Markdown from "react-markdown";
import {
  Copy,
  Check,
  Download,
  Shield,
  FileCode,
  LayoutGrid,
  Info,
  Server,
  Fingerprint,
  Zap,
  Cpu,
  ListTodo,
  FolderTree
} from "lucide-react";
import { PromptArchitectResponse } from "../types";

interface PromptViewerProps {
  data: PromptArchitectResponse;
}

type TabType = "prompt" | "specs" | "security";

export default function PromptViewer({ data }: PromptViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("prompt");
  const [selectedSpecSection, setSelectedSpecSection] = useState<keyof Omit<PromptArchitectResponse, "meta" | "finalPrompt">>("objective");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `# Prompt Architect: ${data.meta.originalPrompt.substring(0, 40)}...\n
Date Generated: ${new Date().toLocaleDateString()}\n
Category Detected: ${data.meta.categoryDetected}\n
Complexity Target: ${data.meta.estimatedComplexity}\n
Target LLM: ${data.meta.targetLLM}\n
Ethical Shift Applied: ${data.meta.ethicalShiftApplied ? "YES (" + data.meta.shiftReasoning + ")" : "NO"}\n

---

## 🎯 1. Objective
${data.objective}

## 🏗️ 2. System Architecture
${data.architecture}

## 📝 3. Functional Requirements
${data.functionalRequirements}

## 📊 4. Non-Functional Requirements
${data.nonFunctionalRequirements}

## 🛡️ 5. Security Architecture
${data.security}

## 🎨 6. UX/UI Interface Approach
${data.uxUi}

## 📁 7. Recommended Directory Structure
${data.directoryStructure}

## ⚙️ 8. Technology Stack
${data.technologyStack}

## 📈 9. Scalability & Growth
${data.scalability}

---

## ⚡ FINAL ORCHESTRATOR PROMPT
\`\`\`
${data.finalPrompt}
\`\`\`
`;

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `architect-prompt-${data.meta.originalPrompt.substring(0, 20).replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const specSectionsList: { key: keyof Omit<PromptArchitectResponse, "meta" | "finalPrompt">; label: string; icon: React.ReactNode }[] = [
    { key: "objective", label: "Objetivo", icon: <Info className="w-4 h-4" /> },
    { key: "architecture", label: "Arquitetura", icon: <Server className="w-4 h-4" /> },
    { key: "functionalRequirements", label: "Specs Funcionais", icon: <ListTodo className="w-4 h-4" /> },
    { key: "nonFunctionalRequirements", label: "Specs Não-Funcionais", icon: <Zap className="w-4 h-4" /> },
    { key: "directoryStructure", label: "Árvore de Diretórios", icon: <FolderTree className="w-4 h-4" /> },
    { key: "technologyStack", label: "Stack de Tecnologia", icon: <Cpu className="w-4 h-4" /> },
    { key: "scalability", label: "Escalabilidade", icon: <Fingerprint className="w-4 h-4" /> }
  ];

  const complexityMap: Record<string, string> = {
    Low: "Baixa",
    Medium: "Média",
    High: "Alta",
    Enterprise: "Corporativa"
  };

  const displayComplexity = complexityMap[data.meta.estimatedComplexity] || data.meta.estimatedComplexity || "Média";

  return (
    <div id="prompt-viewer-wrapper" className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
      {/* Header and Telemetry */}
      <div className="bg-slate-950/60 p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-bold">
              Complexidade: {displayComplexity}
            </span>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
              Alvo: {data.meta.targetLLM || "Universal LLM"}
            </span>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
              Seta: {data.meta.categoryDetected || "Software Design"}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-200 truncate max-w-lg font-sans">
            Otimizado: <span className="text-indigo-400">"{data.meta.originalPrompt}"</span>
          </h3>
        </div>

        {/* Action controls */}
        <button
          id="download-md-btn"
          onClick={handleDownloadMarkdown}
          className="flex items-center justify-center gap-1.5 self-start sm:self-auto font-mono text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Salvar Documento (.MD)</span>
        </button>
      </div>

      {/* Ethical Focus-Shift Alert */}
      {data.meta.ethicalShiftApplied && (
        <div 
          id="ethical-security-alert-box" 
          className={`border-b p-4 flex gap-3 transition-colors ${
            data.meta.shiftReasoning?.includes("instabilidade") 
              ? "bg-indigo-950/20 border-indigo-900/30 text-indigo-300" 
              : "bg-amber-950/25 border-amber-900/40 text-amber-300"
          }`}
        >
          <Shield className={`w-5 h-5 shrink-0 mt-0.5 ${
            data.meta.shiftReasoning?.includes("instabilidade") ? "text-indigo-400" : "text-amber-400"
          }`} />
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-wider font-mono mb-1 ${
              data.meta.shiftReasoning?.includes("instabilidade") ? "text-indigo-400" : "text-amber-400"
            }`}>
              {data.meta.shiftReasoning?.includes("instabilidade") ? "Compilação de Contingência Offline" : "Ativação de Segurança e Ética de IA"}
            </h4>
            <p className="text-xs leading-relaxed font-sans opacity-90">
              {data.meta.shiftReasoning?.includes("instabilidade") 
                ? "Devido à alta utilização temporária nos servidores externos do Gemini, nosso motor redundante gerou e compilou as especificações de forma offline-first e totalmente otimizadas."
                : "O prompt original solicitava ações que envolvem riscos potenciais de segurança. Reestruturamos automaticamente a finalidade do projeto final de operações ofensivas para métodos profissionais, de auditoria autorizada e cibersegurança defensiva."}
            </p>
            {data.meta.shiftReasoning && (
              <p className={`text-[11px] font-mono mt-1.5 w-full italic ${
                data.meta.shiftReasoning?.includes("instabilidade") ? "text-indigo-400/80" : "text-amber-400/80"
              }`}>
                {data.meta.shiftReasoning?.includes("instabilidade") ? "Detalhes do Sistema:" : "Motivo:"} "{data.meta.shiftReasoning}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Primary Tabs */}
      <div className="bg-slate-950/20 px-4 border-b border-slate-850 flex gap-2">
        <button
          id="tab-final-prompt"
          onClick={() => setActiveTab("prompt")}
          className={`py-3 px-3 text-xs font-mono font-bold uppercase border-b-2 tracking-wider transition ${
            activeTab === "prompt"
              ? "text-indigo-400 border-indigo-500"
              : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
        >
          🚀 Prompt Compilado
        </button>
        <button
          id="tab-specs"
          onClick={() => setActiveTab("specs")}
          className={`py-3 px-3 text-xs font-mono font-bold uppercase border-b-2 tracking-wider transition ${
            activeTab === "specs"
              ? "text-indigo-400 border-indigo-500"
              : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
        >
          📐 Especificações do Projeto
        </button>
        <button
          id="tab-sec-profile"
          onClick={() => setActiveTab("security")}
          className={`py-3 px-3 text-xs font-mono font-bold uppercase border-b-2 tracking-wider transition ${
            activeTab === "security"
              ? "text-indigo-400 border-indigo-500"
              : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
        >
          🛡️ Diretrizes de Segurança
        </button>
      </div>

      {/* Pane Layout Contents */}
      <div className="p-6 flex-1 min-h-[400px]">
        {activeTab === "prompt" && (
          <div className="space-y-4 flex flex-col h-full">
            <div className="flex justify-between items-center bg-slate-950/45 p-3.5 border border-slate-850 rounded-lg">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-mono font-semibold text-slate-300">
                  O prompt pronto para execução foi compilado abaixo. Acesse, copie ou adote diretamente.
                </span>
              </div>
              <button
                id="copy-final-prompt-btn"
                onClick={() => handleCopy(data.finalPrompt, "finalPrompt")}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[11px] font-bold uppercase py-1.5 px-3 rounded text-xs transition duration-150"
              >
                {copiedSection === "finalPrompt" ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Prompt</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 bg-slate-950 text-slate-300 border border-slate-850 rounded-lg p-5 font-mono text-xs overflow-auto max-h-[500px] leading-relaxed select-all whitespace-pre-wrap">
              {data.finalPrompt}
            </div>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar select */}
            <div className="md:col-span-1 space-y-1 bg-slate-950/20 p-2 border border-slate-850 rounded-lg h-fit">
              {specSectionsList.map((item) => (
                <button
                  key={item.key}
                  id={`spec-sec-btn-${item.key}`}
                  onClick={() => setSelectedSpecSection(item.key)}
                  className={`w-full text-left font-mono text-xs py-2.5 px-3 rounded-md flex items-center gap-2 transition ${
                    selectedSpecSection === item.key
                      ? "bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 font-semibold"
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Markdown Display */}
            <div className="md:col-span-3 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-indigo-400" />
                  <span>Seção - {specSectionsList.find(s => s.key === selectedSpecSection)?.label || selectedSpecSection}</span>
                </h4>
                <button
                  id={`copy-${selectedSpecSection}-btn`}
                  onClick={() => handleCopy(data[selectedSpecSection], selectedSpecSection)}
                  className="flex items-center gap-1 text-[10px] uppercase font-mono text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 rounded py-1 px-2.5 transition"
                >
                  {copiedSection === selectedSpecSection ? (
                    <>
                      <Check className="w-3 h-3 text-teal-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar Bloco</span>
                    </>
                  )}
                </button>
              </div>

              <div id="specs-markdown-box" className="p-5 bg-slate-950 rounded-lg border border-slate-850 flex-1 overflow-auto max-h-[400px]">
                <div className="markdown-body text-xs text-slate-300 space-y-3 leading-relaxed font-sans">
                  <Markdown>{data[selectedSpecSection]}</Markdown>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  🔑 Auditoria de Ameaças, Validação e Conformidade
                </h4>
                <p className="text-[11px] text-slate-500">
                  Controles de segurança, padrões de validação de entradas digitais e mitigação de riscos operacionais
                </p>
              </div>
              <button
                id="copy-security-cfg-btn"
                onClick={() => handleCopy(data.security, "security")}
                className="flex items-center gap-1 text-[10px] uppercase font-mono text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 rounded py-1 px-2.5 transition"
              >
                {copiedSection === "security" ? (
                  <>
                    <Check className="w-3 h-3 text-teal-400" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar Segurança</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-5 bg-slate-950 rounded-lg border border-slate-850 max-h-[400px] overflow-auto">
              <div className="markdown-body text-xs text-slate-300 space-y-3 leading-relaxed font-sans">
                <Markdown>{data.security}</Markdown>
              </div>
            </div>

            <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-lg flex items-start gap-3">
              <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-semibold text-slate-200 font-mono uppercase tracking-wider mb-0.5">
                  Princípio de Verificação Universal
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  O código final gerado deve possuir validações robustas, proteger conexões externas e nunca imprimir ou trafegar segredos, chaves de acesso externas ou chaves privados sem blindagem.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Styled inline components css (Tailwind compatible) */}
      <style>{`
        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
          font-family: ui-sans-serif, system-ui, sans-serif;
          font-weight: 600;
          color: #f1f5f9;
          margin-top: 1.2rem;
          margin-bottom: 0.6rem;
          text-transform: capitalize;
        }
        .markdown-body h1 { font-size: 1.15rem; border-b: 1px solid #1e293b; padding-bottom: 0.3rem; }
        .markdown-body h2 { font-size: 1.05rem; }
        .markdown-body h3 { font-size: 0.95rem; }
        .markdown-body p {
          margin-bottom: 0.8rem;
          line-height: 1.55;
        }
        .markdown-body ul, .markdown-body ol {
          margin-left: 1.25rem;
          margin-bottom: 0.8rem;
          list-style-type: disc;
        }
        .markdown-body ol {
          list-style-type: decimal;
        }
        .markdown-body li {
          margin-bottom: 0.35rem;
        }
        .markdown-body code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          background-color: #020617;
          border: 1px solid #1e293b;
          color: #e2e8f0;
          padding: 0.15rem 0.35rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
        }
        .markdown-body pre {
          background-color: #020617;
          border: 1px solid #1e293b;
          padding: 0.75rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          margin-bottom: 0.8rem;
        }
        .markdown-body pre code {
          background-color: transparent;
          border: none;
          padding: 0;
          border-radius: 0;
          color: inherit;
        }
      `}</style>
    </div>
  );
}
