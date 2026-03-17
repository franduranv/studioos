"use client";

import { useState, useEffect } from "react";
import { type Idea, type IdeaStage, type IdeaType } from "@/lib/notion";
import { IdeaCard } from "@/components/IdeaCard";

const STAGE_TABS: { id: IdeaStage | "ALL"; label: string; emoji: string }[] = [
  { id: "ALL", label: "Todas", emoji: "◈" },
  { id: "ACTIVA", label: "ACTIVA", emoji: "🟢" },
  { id: "CHISPA", label: "CHISPA", emoji: "⚡" },
  { id: "VAULT", label: "VAULT", emoji: "🗄️" },
];

const TYPE_FILTERS: { id: IdeaType | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "indie", label: "Indie" },
  { id: "vc", label: "VC" },
  { id: "collab", label: "Collab" },
];

// Seed data for when Notion API is unavailable
const SEED_IDEAS: Idea[] = [
  {
    id: "seed-1", name: "StudioOS", stage: "ACTIVA", type: "indie",
    category: "Infra", scoreTotal: 9.2, fdResonance: 9.8,
    description: "El sistema operativo del studio — lo que estás mirando ahora.",
    notionUrl: "", updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-2", name: "BaW AI Concierge", stage: "ACTIVA", type: "indie",
    category: "PropTech", scoreTotal: 8.7, fdResonance: 9.0,
    description: "IA conversacional para gestión de propiedades vacacionales.",
    notionUrl: "", updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-3", name: "ZXY Deal Flow Engine", stage: "CHISPA", type: "vc",
    category: "FinTech", scoreTotal: 7.5, fdResonance: 8.2,
    description: "Pipeline inteligente de deal flow para micro-VCs en LatAm.",
    notionUrl: "", updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-4", name: "TableByMar", stage: "CHISPA", type: "indie",
    category: "FoodTech", scoreTotal: 6.8, fdResonance: 7.5,
    description: "Experiencias gastronómicas pop-up curadas.",
    notionUrl: "", updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-5", name: "Agent Factory SDK", stage: "VAULT", type: "collab",
    category: "DevTools", scoreTotal: 8.0, fdResonance: 6.5,
    description: "SDK para crear y desplegar agentes IA especializados.",
    notionUrl: "", updatedAt: new Date().toISOString(),
  },
];

export default function PipelinePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeStage, setActiveStage] = useState<IdeaStage | "ALL">("ALL");
  const [activeType, setActiveType] = useState<IdeaType | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/ideas");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setIdeas(data.length > 0 ? data : SEED_IDEAS);
      } catch {
        setError(true);
        setIdeas(SEED_IDEAS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = ideas.filter((idea) => {
    if (activeStage !== "ALL" && idea.stage !== activeStage) return false;
    if (activeType !== "all" && idea.type !== activeType) return false;
    if (search && !idea.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const byStage = (stage: IdeaStage) => filtered.filter((i) => i.stage === stage);
  const counts = {
    activa: ideas.filter((i) => i.stage === "ACTIVA").length,
    chispa: ideas.filter((i) => i.stage === "CHISPA").length,
    vault: ideas.filter((i) => i.stage === "VAULT").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#E2E2F0]">⚡ Idea Pipeline</h1>
        <p className="text-[#8888AA] text-sm mt-1">
          {ideas.length} ideas · {counts.activa} activas · {counts.chispa} chispas · {counts.vault} en vault
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-3">
          <p className="text-yellow-400 text-xs">
            ⚠️ Usando datos de ejemplo — configura <code>NOTION_API_KEY</code> para datos reales
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Stage tabs */}
        <div className="flex items-center gap-1 bg-[#12121A] border border-[#1E1E2E] rounded-xl p-1">
          {STAGE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStage(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeStage === tab.id
                  ? "bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/30"
                  : "text-[#8888AA] hover:text-[#E2E2F0]"
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              {tab.id !== "ALL" && (
                <span className="text-[10px] text-[#4A4A6A]">
                  ({counts[tab.id.toLowerCase() as keyof typeof counts] ?? 0})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveType(f.id)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                activeType === f.id
                  ? "bg-[#1E1E2E] text-[#E2E2F0]"
                  : "text-[#4A4A6A] hover:text-[#8888AA]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px] max-w-xs">
          <input
            type="text"
            placeholder="Buscar idea..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#12121A] border border-[#1E1E2E] rounded-xl px-3 py-1.5 text-xs text-[#E2E2F0] placeholder:text-[#4A4A6A] focus:outline-none focus:border-[#6C63FF]/50"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-[#12121A] border border-[#1E1E2E] rounded-xl p-4 h-40 animate-pulse" />
          ))}
        </div>
      )}

      {/* Ideas grid — flat or grouped */}
      {!loading && (
        <>
          {activeStage === "ALL" ? (
            <div className="space-y-8">
              {(["ACTIVA", "CHISPA", "VAULT"] as IdeaStage[]).map((stage) => {
                const stageIdeas = byStage(stage);
                if (stageIdeas.length === 0) return null;
                return (
                  <div key={stage}>
                    <div className="flex items-center gap-2 mb-3">
                      <h2 className={`text-sm font-bold ${
                        stage === "ACTIVA" ? "text-emerald-400" : stage === "CHISPA" ? "text-yellow-400" : "text-slate-400"
                      }`}>{stage}</h2>
                      <span className="text-[#4A4A6A] text-xs">({stageIdeas.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {stageIdeas.map((idea) => (
                        <IdeaCard key={idea.id} idea={idea} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((idea) => <IdeaCard key={idea.id} idea={idea} />)}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#4A4A6A]">No hay ideas que coincidan con los filtros.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
