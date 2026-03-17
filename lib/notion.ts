/**
 * lib/notion.ts
 * Notion API client for StudioOS
 * Reads idea pipeline and project data from ZXY Notion workspace
 */

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const IDEAS_DB = process.env.NEXT_PUBLIC_IDEAS_DB_ID || "30f16937-3e72-819b-8717-e906e61e7dfb";
const PROJECTS_DB = process.env.NEXT_PUBLIC_PROJECTS_DB_ID || "30b16937-3e72-819c-8eaf-c0c8b3d5e000";

const NOTION_VERSION = "2022-06-28";

function notionHeaders() {
  return {
    Authorization: `Bearer ${NOTION_API_KEY}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type IdeaStage = "ACTIVA" | "CHISPA" | "VAULT";
export type IdeaType = "indie" | "vc" | "collab";

export interface Idea {
  id: string;
  name: string;
  stage: IdeaStage;
  type: IdeaType;
  category: string;
  scoreTotal: number;
  fdResonance: number;
  description: string;
  notionUrl: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  stage: string;
  description: string;
  sprintDay: number;
  sprintTotal: number;
  kpis: Record<string, string | number>;
  githubRepo: string;
  notionUrl: string;
  team: string[];
  updatedAt: string;
}

// ─── Helper: extract property value ──────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function prop(page: any, key: string): any {
  return page.properties?.[key];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getText(p: any): string {
  if (!p) return "";
  if (p.type === "title") return p.title?.[0]?.plain_text ?? "";
  if (p.type === "rich_text") return p.rich_text?.[0]?.plain_text ?? "";
  if (p.type === "select") return p.select?.name ?? "";
  if (p.type === "multi_select") return p.multi_select?.map((s: { name: string }) => s.name).join(", ") ?? "";
  if (p.type === "number") return String(p.number ?? "");
  if (p.type === "url") return p.url ?? "";
  if (p.type === "date") return p.date?.start ?? "";
  if (p.type === "people") return p.people?.map((u: { name: string }) => u.name).join(", ") ?? "";
  return "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNum(p: any): number {
  if (!p) return 0;
  if (p.type === "number") return p.number ?? 0;
  if (p.type === "formula") return p.formula?.number ?? 0;
  return 0;
}

// ─── Ideas Pipeline ───────────────────────────────────────────────────────────

export async function getIdeasByStage(stage: IdeaStage): Promise<Idea[]> {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${IDEAS_DB}/query`,
    {
      method: "POST",
      headers: notionHeaders(),
      body: JSON.stringify({
        filter: {
          property: "Stage",
          select: { equals: stage },
        },
        sorts: [{ property: "Score Total", direction: "descending" }],
      }),
      next: { revalidate: 300 }, // Cache 5 min (Next.js)
    }
  );

  if (!response.ok) {
    console.error(`Notion error (getIdeasByStage): ${response.status}`);
    return [];
  }

  const data = await response.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.results?.map((page: any): Idea => ({
    id: page.id,
    name: getText(prop(page, "Nombre")) || getText(prop(page, "Name")) || getText(prop(page, "Idea")),
    stage: (getText(prop(page, "Stage")) as IdeaStage) || stage,
    type: (getText(prop(page, "Tipo")) || getText(prop(page, "Type")) || "indie") as IdeaType,
    category: getText(prop(page, "Categoría")) || getText(prop(page, "Category")) || "—",
    scoreTotal: getNum(prop(page, "Score Total")),
    fdResonance: getNum(prop(page, "FD Resonance")),
    description: getText(prop(page, "Descripción")) || getText(prop(page, "Description")) || "",
    notionUrl: page.url ?? "",
    updatedAt: page.last_edited_time ?? "",
  })) ?? [];
}

export async function getAllIdeas(): Promise<{
  activa: Idea[];
  chispa: Idea[];
  vault: Idea[];
}> {
  const [activa, chispa, vault] = await Promise.all([
    getIdeasByStage("ACTIVA"),
    getIdeasByStage("CHISPA"),
    getIdeasByStage("VAULT"),
  ]);
  return { activa, chispa, vault };
}

// ─── Active Projects ──────────────────────────────────────────────────────────

export async function getActiveProjects(): Promise<Project[]> {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${PROJECTS_DB}/query`,
    {
      method: "POST",
      headers: notionHeaders(),
      body: JSON.stringify({
        filter: {
          property: "Estado",
          select: { equals: "Activo" },
        },
        sorts: [{ property: "Nombre", direction: "ascending" }],
        page_size: 10,
      }),
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    console.error(`Notion error (getActiveProjects): ${response.status}`);
    return [];
  }

  const data = await response.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.results?.map((page: any): Project => ({
    id: page.id,
    name: getText(prop(page, "Nombre")) || getText(prop(page, "Name")),
    stage: getText(prop(page, "Stage")) || "En curso",
    description: getText(prop(page, "Descripción")) || "",
    sprintDay: getNum(prop(page, "Sprint Day")) || getNum(prop(page, "Día Sprint")),
    sprintTotal: getNum(prop(page, "Sprint Total")) || 30,
    kpis: {
      mrr: getText(prop(page, "MRR")) || "—",
      users: getText(prop(page, "Usuarios")) || getText(prop(page, "Users")) || "—",
      runway: getText(prop(page, "Runway")) || "—",
    },
    githubRepo: getText(prop(page, "GitHub")) || getText(prop(page, "Repo")) || "",
    notionUrl: page.url ?? "",
    team: (prop(page, "Equipo")?.people ?? prop(page, "Team")?.people ?? []).map(
      (u: { name: string }) => u.name
    ),
    updatedAt: page.last_edited_time ?? "",
  })) ?? [];
}
