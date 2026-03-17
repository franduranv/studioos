import { AGENTS } from "@/lib/agents";
import { AgentCard } from "@/components/AgentCard";

export const revalidate = 60;

export default function AgentsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#E2E2F0]">
          Agent OS <span className="text-[#6C63FF]">Status</span>
        </h1>
        <p className="text-[#8888AA] text-sm mt-1">
          7 agentes activos · operando 24/7 · ~$15-30K MXN/mes en tokens
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENTS.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-[#1A1A2E] border border-[#2A2A4A]">
        <h2 className="text-[#E2E2F0] font-semibold mb-3">Agent OS vs Equipo Humano</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-[#8888AA]">
            <thead>
              <tr className="border-b border-[#2A2A4A]">
                <th className="text-left py-2 pr-4 text-[#6C63FF]">Dimensión</th>
                <th className="text-left py-2 pr-4">Equipo Humano</th>
                <th className="text-left py-2 text-green-400">Agent OS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E3A]">
              {[
                ["Costo mensual", "~$500K-$1M MXN", "~$15-30K MXN"],
                ["Disponibilidad", "40h/semana", "24/7 (168h/semana)"],
                ["Tiempo para onboarding", "1-3 meses", "Inmediato (Día 0)"],
                ["Aprende entre ventures", "No (experiencia individual)", "Sí (conocimiento compartido)"],
                ["Escala", "Lineal (+ personas = + costo)", "Exponencial (+ tokens = + output)"],
              ].map(([dim, human, agent]) => (
                <tr key={dim}>
                  <td className="py-2 pr-4 text-[#E2E2F0] font-medium">{dim}</td>
                  <td className="py-2 pr-4">{human}</td>
                  <td className="py-2 text-green-400">{agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
