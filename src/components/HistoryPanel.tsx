import React from "react";
import { History, Trash2, Clock, FileText, ChevronRight, Sparkles } from "lucide-react";
import { SavedPrompt } from "../types";

interface HistoryPanelProps {
  savedPrompts: SavedPrompt[];
  onSelect: (prompt: SavedPrompt) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  activeId: string | null;
}

export default function HistoryPanel({
  savedPrompts,
  onSelect,
  onDelete,
  onClearAll,
  activeId
}: HistoryPanelProps) {
  return (
    <div id="history-panel-container" className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-full max-h-[600px] md:max-h-none">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-200 font-sans">Histórico de Projetos</h3>
        </div>
        {savedPrompts.length > 0 && (
          <button
            id="clear-all-history-btn"
            onClick={onClearAll}
            className="text-[10px] uppercase font-mono text-rose-400 hover:text-rose-300 transition"
          >
            Limpar Histórico
          </button>
        )}
      </div>

      {savedPrompts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 font-mono text-xs">
          <Clock className="w-8 h-8 text-slate-700 mb-2" />
          <p>Nenhum rascunho de prompt anterior carregado.</p>
          <p className="mt-1 text-[10px] text-slate-600">Os prompts que você gerar aparecerão aqui automaticamente.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {savedPrompts.map((saved) => {
            const isActive = activeId === saved.id;
            const formattedTime = new Date(saved.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            });
            const formattedDate = new Date(saved.timestamp).toLocaleDateString([], {
              month: "short",
              day: "numeric"
            });

            return (
              <div
                key={saved.id}
                id={`history-item-${saved.id}`}
                className={`group relative rounded-lg border p-3 cursor-pointer transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-950/20"
                    : "bg-slate-950/40 border-slate-850 hover:bg-slate-850 hover:border-slate-800"
                }`}
                onClick={() => onSelect(saved)}
              >
                <div className="flex justify-between items-start mb-1 text-[10px] font-mono text-slate-500">
                  <span className="bg-slate-800/80 text-slate-300 font-medium px-1.5 py-0.5 rounded uppercase tracking-wider text-[9px] border border-slate-700/40">
                    {saved.response.meta.categoryDetected || "Geral"}
                  </span>
                  <span>
                    {formattedDate} {formattedTime}
                  </span>
                </div>

                <div className="text-slate-200 text-xs font-semibold font-sans tracking-tight leading-snug line-clamp-2 pr-5">
                  {saved.title}
                </div>

                <div className="text-[10px] text-slate-400 font-mono truncate mt-1">
                  Original: {saved.originalInput}
                </div>

                {saved.response.meta.ethicalShiftApplied && (
                  <div className="mt-2 inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span className="text-[9px] text-amber-400 font-mono uppercase tracking-wider">
                      Reestruturado com Segurança
                    </span>
                  </div>
                )}

                {/* Inline Action Delete button */}
                <button
                  id={`delete-history-btn-${saved.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(saved.id);
                  }}
                  className="absolute right-2 top-11 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-500/10 rounded text-slate-500 hover:text-rose-400 transition"
                  title="Remover registro"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
