"use client";

import { type Agent, type AgentStatus } from "@/lib/agents";
import { relativeTime } from "@/lib/github";

const STATUS_CONFIG: Record<AgentStatus, { label: string; color: string; dot: string }> = {
  online: { label: "Online", color: "text-emerald-400", dot: "bg-emerald-400" },
  busy: { label: "En tarea", color: "text-yellow-400", dot: "bg-yellow-400 animate-pulse" },
  idle: { label: "Disponible", color: "text-blue-400", dot: "bg-blue-400" },
  offline: { label: "Offline", color: "text-slate-500", dot: "bg-slate-500" },
};

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const status = STATUS_CONFIG[agent.status] ?? STATUS_CONFIG.idle;

  return (
    <div className="bg-[#12121A] border border-[#1E1E2E] rounded-xl p-4 hover:border-[#2E2E4E] transition-all duration-200">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ backgroundColor: `${agent.color}20`, border: `1px solid ${agent.color}40` }}
        >
          {agent.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-[#E2E2F0] font-bold text-sm">{agent.name}</h3>
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              <span className={`text-[10px] font-medium ${status.color}`}>{status.label}</span>
            </div>
          </div>
          <p className="text-[#8888AA] text-xs truncate">{agent.role}</p>
        </div>
      </div>

      {/* Domain */}
      <p className="text-[#4A4A6A] text-[11px] mb-3 leading-relaxed">{agent.domain}</p>

      {/* Status message */}
      {agent.statusMessage && (
        <div className="bg-white/5 rounded-lg px-3 py-1.5 mb-3">
          <p className="text-[#8888AA] text-[11px] italic">&ldquo;{agent.statusMessage}&rdquo;</p>
        </div>
      )}

      {/* Recent tasks */}
      {agent.recentTasks.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[#4A4A6A] text-[10px] uppercase tracking-wider font-semibold">
            Últimas tareas
          </p>
          {agent.recentTasks.slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-start gap-2">
              <span className="text-[#4A4A6A] text-[10px] mt-0.5">✓</span>
              <div className="flex-1 min-w-0">
                <p className="text-[#8888AA] text-[11px] line-clamp-1">{task.description}</p>
                <p className="text-[#4A4A6A] text-[10px]">{relativeTime(task.completedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Discord link */}
      {agent.discordChannel && (
        <div className="mt-3 pt-3 border-t border-[#1E1E2E]">
          <span className="text-[#4A4A6A] text-[10px]">
            #{agent.discordChannel}
          </span>
        </div>
      )}
    </div>
  );
}
