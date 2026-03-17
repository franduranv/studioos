/**
 * lib/agents.ts
 * Static + dynamic data for the ZXY Agent OS
 * Agent metadata is static (defined here); last tasks come from Discord/Notion
 */

export type AgentStatus = "online" | "busy" | "idle" | "offline";

export interface AgentTask {
  id: string;
  description: string;
  completedAt: string;
  channel?: string;
}

export interface Agent {
  id: string;
  name: string;
  emoji: string;
  role: string;
  domain: string;
  color: string;
  discordChannel?: string;
  status: AgentStatus;
  statusMessage?: string;
  recentTasks: AgentTask[];
}

// ─── Static Agent Registry ────────────────────────────────────────────────────
// These are the 7 agents of ZXY Ventures Agent OS

export const AGENTS: Omit<Agent, "status" | "recentTasks" | "statusMessage">[] = [
  {
    id: "hugo",
    name: "Hugo",
    emoji: "🫡",
    role: "Chief of Staff",
    domain: "Ops, calendar, memory, routing",
    color: "#6C63FF",
    discordChannel: "fd-hugochief",
  },
  {
    id: "andres",
    name: "Andrés",
    emoji: "🔨",
    role: "Agente Build",
    domain: "Code, stack, repos, infra",
    color: "#43D9A2",
    discordChannel: "fd-andycode",
  },
  {
    id: "luis",
    name: "Luis",
    emoji: "📣",
    role: "Agente Growth",
    domain: "Marketing, branding, redes",
    color: "#FF6B6B",
    discordChannel: "fd-luisgrowth",
  },
  {
    id: "rafa",
    name: "Rafa",
    emoji: "🔬",
    role: "Agente Research",
    domain: "Research, validación, pipeline",
    color: "#FFC857",
    discordChannel: "fd-rafaresearch",
  },
  {
    id: "emily",
    name: "Emily",
    emoji: "🏠",
    role: "Agente BaW",
    domain: "Propiedades, huéspedes, Lodgify",
    color: "#A8DADC",
    discordChannel: "fd-emimar",
  },
  {
    id: "beto",
    name: "Beto",
    emoji: "📊",
    role: "Agente ContaBeto",
    domain: "Contabilidad, impuestos, finanzas",
    color: "#457B9D",
    discordChannel: "fd-contabeto",
  },
  {
    id: "maribel",
    name: "Maribel",
    emoji: "⚖️",
    role: "Agente Legal",
    domain: "Legal, contratos, IMPI, compliance",
    color: "#E63946",
    discordChannel: undefined,
  },
];

// Seed tasks for demo / fallback when Discord API is unavailable
export const SEED_TASKS: Record<string, AgentTask[]> = {
  hugo: [
    { id: "h1", description: "Coordinated StudioOS build mission with Andrés", completedAt: new Date().toISOString(), channel: "fd-hugochief" },
    { id: "h2", description: "Updated MEMORY.md with venture pipeline context", completedAt: new Date(Date.now() - 3600000).toISOString() },
    { id: "h3", description: "Scheduled weekly ZXY sync on Fran's calendar", completedAt: new Date(Date.now() - 7200000).toISOString() },
  ],
  andres: [
    { id: "a1", description: "Built StudioOS v0.1 — full Next.js app + GitHub push", completedAt: new Date().toISOString(), channel: "fd-andycode" },
    { id: "a2", description: "Set up Notion API integration for idea pipeline", completedAt: new Date(Date.now() - 900000).toISOString() },
    { id: "a3", description: "Configured Vercel deployment pipeline", completedAt: new Date(Date.now() - 1800000).toISOString() },
  ],
  luis: [
    { id: "l1", description: "Drafted ZXY social content calendar for March", completedAt: new Date(Date.now() - 86400000).toISOString() },
    { id: "l2", description: "Created StudioOS launch post (Twitter/LinkedIn)", completedAt: new Date(Date.now() - 43200000).toISOString() },
    { id: "l3", description: "Reviewed BaW brand refresh proposal", completedAt: new Date(Date.now() - 172800000).toISOString() },
  ],
  rafa: [
    { id: "r1", description: "Validated 3 new ideas in CHISPA stage", completedAt: new Date(Date.now() - 86400000).toISOString() },
    { id: "r2", description: "Competitive analysis: AI-powered property management", completedAt: new Date(Date.now() - 172800000).toISOString() },
    { id: "r3", description: "Updated idea scoring rubric in Notion", completedAt: new Date(Date.now() - 259200000).toISOString() },
  ],
  emily: [
    { id: "e1", description: "Resolved guest issue at Mateos 809 (checkout delay)", completedAt: new Date(Date.now() - 21600000).toISOString() },
    { id: "e2", description: "Synced Lodgify availability calendar", completedAt: new Date(Date.now() - 43200000).toISOString() },
    { id: "e3", description: "Coordinated maintenance visit — water heater", completedAt: new Date(Date.now() - 86400000).toISOString() },
  ],
  beto: [
    { id: "b1", description: "Filed March SAT declaration (ZXY Ventures)", completedAt: new Date(Date.now() - 172800000).toISOString() },
    { id: "b2", description: "Reconciled BaW revenue Q1 2026", completedAt: new Date(Date.now() - 259200000).toISOString() },
    { id: "b3", description: "Sent CFDI to 3 BaW clients", completedAt: new Date(Date.now() - 345600000).toISOString() },
  ],
  maribel: [
    { id: "m1", description: "Reviewed vendor contract for Mateos property", completedAt: new Date(Date.now() - 259200000).toISOString() },
    { id: "m2", description: "Filed IMPI trademark extension for ZXY", completedAt: new Date(Date.now() - 432000000).toISOString() },
    { id: "m3", description: "Updated standard NDA template", completedAt: new Date(Date.now() - 518400000).toISOString() },
  ],
};
