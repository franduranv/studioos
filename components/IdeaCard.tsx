"use client";

import { type Idea, type IdeaStage } from "@/lib/notion";

const STAGE_CONFIG: Record<IdeaStage, { label: string; color: string; bg: string }> = {
  ACTIVA: { label: "ACTIVA", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30" },
  CHISPA: { label: "CHISPA", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  VAULT: { label: "VAULT", color: "text-slate-400", bg: "bg-slate-400/10 border-slate-400/30" },
};

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  indie: { label: "INDIE", color: "text-violet-400" },
  vc: { label: "VC", color: "text-blue-400" },
  collab: { label: "COLLAB", color: "text-pink-400" },
};

function ScoreBar({ value, max = 10, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

interface IdeaCardProps {
  idea: Idea;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const stage = STAGE_CONFIG[idea.stage] ?? STAGE_CONFIG.CHISPA;
  const type = TYPE_CONFIG[idea.type] ?? TYPE_CONFIG.indie;
  const scoreColor = idea.scoreTotal >= 7 ? "bg-emerald-400" : idea.scoreTotal >= 4 ? "bg-yellow-400" : "bg-red-400";
  const resonanceColor = idea.fdResonance >= 7 ? "bg-violet-400" : idea.fdResonance >= 4 ? "bg-blue-400" : "bg-slate-400";

  return (
    <div className="group relative bg-[#12121A] border border-[#1E1E2E] rounded-xl p-4 hover:border-[#2E2E4E] transition-all duration-200 cursor-pointer">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-[#E2E2F0] font-semibold text-sm leading-tight line-clamp-2 flex-1">
          {idea.name || "Sin nombre"}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${stage.bg} ${stage.color}`}>
            {stage.label}
          </span>
        </div>
      </div>

      {/* Description */}
      {idea.description && (
        <p className="text-[#8888AA] text-xs line-clamp-2 mb-3">{idea.description}</p>
      )}

      {/* Scores */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[#8888AA] text-[10px] w-24 shrink-0">Score Total</span>
          <div className="flex-1">
            <ScoreBar value={idea.scoreTotal} max={10} color={scoreColor} />
          </div>
          <span className="text-[#E2E2F0] text-xs font-mono w-8 text-right">
            {idea.scoreTotal.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#8888AA] text-[10px] w-24 shrink-0">FD Resonance</span>
          <div className="flex-1">
            <ScoreBar value={idea.fdResonance} max={10} color={resonanceColor} />
          </div>
          <span className="text-[#E2E2F0] text-xs font-mono w-8 text-right">
            {idea.fdResonance.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold ${type.color}`}>{type.label}</span>
          {idea.category && idea.category !== "—" && (
            <>
              <span className="text-[#4A4A6A]">·</span>
              <span className="text-[#8888AA] text-[10px]">{idea.category}</span>
            </>
          )}
        </div>
        {idea.notionUrl && (
          <a
            href={idea.notionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4A4A6A] hover:text-[#6C63FF] text-[10px] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Notion ↗
          </a>
        )}
      </div>
    </div>
  );
}
