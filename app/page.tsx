import Link from "next/link";
import { getAllIdeas, getActiveProjects } from "@/lib/notion";
import { AGENTS, SEED_TASKS } from "@/lib/agents";

export const revalidate = 300; // ISR: refresh every 5 minutes

async function getDashboardData() {
  try {
    const [{ activa, chispa, vault }, projects] = await Promise.all([
      getAllIdeas(),
      getActiveProjects(),
    ]);
    return { activa, chispa, vault, projects, error: null };
  } catch (err) {
    console.error("Dashboard data error:", err);
    return { activa: [], chispa: [], vault: [], projects: [], error: "API unavailable" };
  }
}

export default async function DashboardPage() {
  const { activa, chispa, vault, projects, error } = await getDashboardData();
  const now = new Date();
  const onlineAgents = AGENTS.length; // All agents considered online for MVP

  // Stats
  const totalIdeas = activa.length + chispa.length + vault.length;
  const avgScore = activa.length > 0
    ? (activa.reduce((s, i) => s + i.scoreTotal, 0) / activa.length).toFixed(1)
    : "—";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#4A4A6A] text-xs font-mono">
            {now.toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#E2E2F0]">
          ZXY Ventures <span className="text-[#6C63FF]">Studio OS</span>
        </h1>
        <p className="text-[#8888AA] text-sm mt-1">
          El sistema operativo del studio — todo en un lugar.
        </p>
      </div>

      {/* API error banner */}
      {error && (
        <div className="mb-6 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-3">
          <p className="text-yellow-400 text-xs">
            ⚠️ Notion API no disponible. Configura <code className="font-mono">NOTION_API_KEY</code> en <code className="font-mono">.env.local</code>
          </p>
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <KpiCard
          label="Ideas Totales"
          value={totalIdeas || "—"}
          sub={`${activa.length} activas`}
          color="text-[#6C63FF]"
          href="/pipeline"
        />
        <KpiCard
          label="Score Promedio"
          value={avgScore}
          sub="ideas activas"
          color="text-emerald-400"
          href="/pipeline"
        />
        <KpiCard
          label="Ventures Activos"
          value={projects.length || "—"}
          sub="en sprint"
          color="text-[#FF6B6B]"
          href="/ventures"
        />
        <KpiCard
          label="Agentes Online"
          value={onlineAgents}
          sub="de 7 en el OS"
          color="text-[#43D9A2]"
          href="/agents"
        />
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Idea Pipeline preview */}
        <SectionCard title="⚡ Idea Pipeline" href="/pipeline" count={totalIdeas}>
          <div className="space-y-2">
            {[...activa, ...chispa].slice(0, 4).map((idea) => (
              <div key={idea.id} className="flex items-center gap-2 py-1.5 border-b border-[#1E1E2E] last:border-0">
                <span className={`text-[10px] font-bold w-12 shrink-0 ${
                  idea.stage === "ACTIVA" ? "text-emerald-400" : "text-yellow-400"
                }`}>{idea.stage}</span>
                <span className="text-[#E2E2F0] text-xs flex-1 truncate">{idea.name || "—"}</span>
                <span className="text-[#8888AA] text-[10px] font-mono">{idea.scoreTotal.toFixed(1)}</span>
              </div>
            ))}
            {totalIdeas === 0 && (
              <p className="text-[#4A4A6A] text-xs text-center py-4">No hay ideas cargadas</p>
            )}
          </div>
        </SectionCard>

        {/* Active Ventures preview */}
        <SectionCard title="🚀 Ventures Activos" href="/ventures" count={projects.length}>
          <div className="space-y-3">
            {projects.slice(0, 3).map((p) => {
              const pct = p.sprintTotal > 0 ? Math.min(100, (p.sprintDay / p.sprintTotal) * 100) : 0;
              return (
                <div key={p.id} className="py-1.5 border-b border-[#1E1E2E] last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#E2E2F0] text-xs font-semibold">{p.name}</span>
                    <span className="text-[#8888AA] text-[10px] font-mono">día {p.sprintDay}/{p.sprintTotal || 30}</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct > 80 ? "bg-red-400" : pct > 50 ? "bg-yellow-400" : "bg-emerald-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {projects.length === 0 && (
              <p className="text-[#4A4A6A] text-xs text-center py-4">No hay ventures activos</p>
            )}
          </div>
        </SectionCard>

        {/* Agent OS preview */}
        <SectionCard title="🤖 Agent OS" href="/agents" count={onlineAgents}>
          <div className="space-y-2">
            {AGENTS.map((agent) => {
              const lastTask = SEED_TASKS[agent.id]?.[0];
              return (
                <div key={agent.id} className="flex items-start gap-2 py-1.5 border-b border-[#1E1E2E] last:border-0">
                  <span className="text-base shrink-0">{agent.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[#E2E2F0] text-xs font-semibold">{agent.name}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    {lastTask && (
                      <p className="text-[#8888AA] text-[10px] truncate">{lastTask.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-[#1E1E2E] flex items-center justify-between">
        <span className="text-[#4A4A6A] text-[10px] font-mono">StudioOS v0.1 — ZXY Ventures</span>
        <span className="text-[#4A4A6A] text-[10px] font-mono">
          Built by Andrés · {now.toLocaleDateString("es-MX")}
        </span>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  color,
  href,
}: {
  label: string;
  value: string | number;
  sub: string;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-[#12121A] border border-[#1E1E2E] rounded-xl p-4 hover:border-[#2E2E4E] transition-all group"
    >
      <div className={`text-2xl font-bold font-mono ${color} mb-1`}>{value}</div>
      <div className="text-[#E2E2F0] text-xs font-medium">{label}</div>
      <div className="text-[#4A4A6A] text-[10px] mt-0.5">{sub}</div>
    </Link>
  );
}

function SectionCard({
  title,
  href,
  count,
  children,
}: {
  title: string;
  href: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#12121A] border border-[#1E1E2E] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E2E]">
        <h2 className="text-[#E2E2F0] text-sm font-bold">{title}</h2>
        <Link
          href={href}
          className="text-[#6C63FF] text-[10px] hover:text-[#8880FF] transition-colors font-medium"
        >
          Ver todo ({count}) →
        </Link>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
