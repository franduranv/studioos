"use client";

import { type Project } from "@/lib/notion";

function SprintProgress({ day, total }: { day: number; total: number }) {
  const pct = total > 0 ? Math.min(100, (day / total) * 100) : 0;
  const isLate = pct > 80;
  const isMid = pct > 50;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[#8888AA] text-xs">Sprint Progress</span>
        <span className={`text-xs font-mono font-bold ${isLate ? "text-red-400" : isMid ? "text-yellow-400" : "text-emerald-400"}`}>
          día {day} / {total}
        </span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isLate ? "bg-red-400" : isMid ? "bg-yellow-400" : "bg-emerald-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface VentureCardProps {
  project: Project;
}

export function VentureCard({ project }: VentureCardProps) {
  const kpiEntries = Object.entries(project.kpis).filter(([, v]) => v && v !== "—");

  return (
    <div className="bg-[#12121A] border border-[#1E1E2E] rounded-xl p-5 hover:border-[#2E2E4E] transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[#E2E2F0] font-bold text-base leading-tight">{project.name}</h3>
          <span className="text-[#6C63FF] text-xs font-medium">{project.stage}</span>
        </div>
        <div className="flex items-center gap-2">
          {project.githubRepo && (
            <a
              href={project.githubRepo.startsWith("http") ? project.githubRepo : `https://github.com/${project.githubRepo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4A4A6A] hover:text-[#E2E2F0] transition-colors"
              title="GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
          {project.notionUrl && (
            <a
              href={project.notionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4A4A6A] hover:text-[#E2E2F0] transition-colors text-xs"
            >
              Notion ↗
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-[#8888AA] text-xs mb-4 line-clamp-2">{project.description}</p>
      )}

      {/* Sprint Progress */}
      {(project.sprintDay > 0 || project.sprintTotal > 0) && (
        <div className="mb-4">
          <SprintProgress day={project.sprintDay} total={project.sprintTotal || 30} />
        </div>
      )}

      {/* KPIs */}
      {kpiEntries.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {kpiEntries.map(([key, val]) => (
            <div key={key} className="bg-white/5 rounded-lg p-2 text-center">
              <div className="text-[#E2E2F0] text-sm font-bold font-mono">{val}</div>
              <div className="text-[#8888AA] text-[10px] uppercase tracking-wide mt-0.5">{key}</div>
            </div>
          ))}
        </div>
      )}

      {/* Team */}
      {project.team.length > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="text-[#4A4A6A] text-[10px]">EQUIPO</span>
          {project.team.map((member) => (
            <span
              key={member}
              className="text-[10px] bg-[#1E1E2E] text-[#8888AA] px-2 py-0.5 rounded-full"
            >
              {member}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
