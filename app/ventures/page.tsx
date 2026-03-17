import { getActiveProjects } from "@/lib/notion";
import { getRepoStatus, relativeTime } from "@/lib/github";
import { VentureCard } from "@/components/VentureCard";
import type { Project } from "@/lib/notion";

export const revalidate = 300;

// Seed data for demo / no-API fallback
const SEED_PROJECTS: Project[] = [
  {
    id: "v1",
    name: "StudioOS",
    stage: "MVP Sprint",
    description: "El sistema operativo interno de ZXY. Dashboard unificado de ideas, ventures y agentes.",
    sprintDay: 1,
    sprintTotal: 30,
    kpis: { status: "🟢 Live", stack: "Next.js 14", deploy: "Vercel" },
    githubRepo: "https://github.com/franduranv/studioos",
    notionUrl: "",
    team: ["Andrés", "Hugo"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "v2",
    name: "BaW AI Concierge",
    stage: "Validación",
    description: "IA conversacional para huéspedes de propiedades BaW. Responde preguntas, gestiona incidencias.",
    sprintDay: 12,
    sprintTotal: 30,
    kpis: { propiedades: "3", reservas: "87%", nps: "4.9" },
    githubRepo: "",
    notionUrl: "",
    team: ["Andrés", "Emily", "Hugo"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "v3",
    name: "Agent Factory",
    stage: "Diseño",
    description: "Framework para crear y desplegar agentes especializados. El corazón del Agent OS.",
    sprintDay: 5,
    sprintTotal: 30,
    kpis: { agentes: "7", deploys: "15+", uptime: "99.9%" },
    githubRepo: "",
    notionUrl: "",
    team: ["Andrés", "Hugo"],
    updatedAt: new Date().toISOString(),
  },
];

export default async function VenturesPage() {
  let projects: Project[] = [];
  let error = false;

  try {
    const fetched = await getActiveProjects();
    projects = fetched.length > 0 ? fetched : SEED_PROJECTS;
  } catch {
    error = true;
    projects = SEED_PROJECTS;
  }

  // Enrich with GitHub data where available
  const enriched = await Promise.all(
    projects.map(async (p) => {
      if (!p.githubRepo) return { project: p, repo: null };
      const repoId = p.githubRepo.replace("https://github.com/", "");
      const repo = await getRepoStatus(repoId).catch(() => null);
      return { project: p, repo };
    })
  );

  const totalSprint = projects.reduce((s, p) => s + (p.sprintDay || 0), 0);
  const avgDay = projects.length > 0 ? Math.round(totalSprint / projects.length) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#E2E2F0]">🚀 Active Ventures</h1>
        <p className="text-[#8888AA] text-sm mt-1">
          {projects.length} ventures en sprint · día promedio {avgDay} de 30
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-3">
          <p className="text-yellow-400 text-xs">
            ⚠️ Usando datos de ejemplo — configura <code>NOTION_API_KEY</code> para datos reales
          </p>
        </div>
      )}

      {/* Ventures grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {enriched.map(({ project }) => (
          <VentureCard key={project.id} project={project} />
        ))}
        {projects.length === 0 && (
          <div className="col-span-3 text-center py-16">
            <p className="text-[#4A4A6A]">No hay ventures activos en este momento.</p>
          </div>
        )}
      </div>

      {/* GitHub activity section */}
      {enriched.some(({ repo }) => repo !== null) && (
        <div className="bg-[#12121A] border border-[#1E1E2E] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1E1E2E]">
            <h2 className="text-[#E2E2F0] text-sm font-bold">GitHub Activity</h2>
          </div>
          <div className="p-4 space-y-3">
            {enriched
              .filter(({ repo }) => repo !== null)
              .map(({ project, repo }) => (
                <div key={project.id} className="flex items-start gap-3 py-2 border-b border-[#1E1E2E] last:border-0">
                  <div className="w-8 h-8 bg-[#1E1E2E] rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#8888AA]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[#E2E2F0] text-xs font-semibold">{repo!.name}</span>
                      <span className="text-[#4A4A6A] text-[10px]">{repo!.language}</span>
                    </div>
                    {repo!.lastCommit && (
                      <p className="text-[#8888AA] text-[11px]">
                        {repo!.lastCommit.message}
                        <span className="text-[#4A4A6A] ml-1">· {relativeTime(repo!.lastCommit.date)}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[#4A4A6A] shrink-0">
                    <span>⭐ {repo!.stars}</span>
                    {repo!.openPRs > 0 && <span className="text-yellow-400">{repo!.openPRs} PRs</span>}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
