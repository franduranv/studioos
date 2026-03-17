/**
 * lib/github.ts
 * GitHub API client for StudioOS
 * Reads repo status, commits, and open PRs for ZXY ventures
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORG = process.env.GITHUB_ORG || "franduranv";

function githubHeaders() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RepoStatus {
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  openIssues: number;
  openPRs: number;
  lastCommit: {
    message: string;
    author: string;
    date: string;
    sha: string;
  } | null;
  language: string;
  isPrivate: boolean;
}

export interface CommitActivity {
  week: number; // Unix timestamp
  total: number;
  days: number[];
}

// ─── Fetch single repo status ─────────────────────────────────────────────────

export async function getRepoStatus(repoFullName: string): Promise<RepoStatus | null> {
  const [repoRes, prsRes, commitsRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${repoFullName}`, {
      headers: githubHeaders(),
      next: { revalidate: 180 },
    }),
    fetch(`https://api.github.com/repos/${repoFullName}/pulls?state=open&per_page=1`, {
      headers: githubHeaders(),
      next: { revalidate: 180 },
    }),
    fetch(`https://api.github.com/repos/${repoFullName}/commits?per_page=1`, {
      headers: githubHeaders(),
      next: { revalidate: 180 },
    }),
  ]);

  if (!repoRes.ok) return null;

  const repo = await repoRes.json();
  const prs = prsRes.ok ? await prsRes.json() : [];
  const commits = commitsRes.ok ? await commitsRes.json() : [];

  const lastCommit = commits[0]
    ? {
        message: commits[0].commit.message.split("\n")[0],
        author: commits[0].commit.author.name,
        date: commits[0].commit.author.date,
        sha: commits[0].sha.slice(0, 7),
      }
    : null;

  return {
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description ?? "",
    url: repo.html_url,
    stars: repo.stargazers_count,
    openIssues: repo.open_issues_count - prs.length,
    openPRs: prs.length,
    lastCommit,
    language: repo.language ?? "—",
    isPrivate: repo.private,
  };
}

// ─── Fetch all repos for the org ──────────────────────────────────────────────

export async function getOrgRepos(limit = 20): Promise<RepoStatus[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_ORG}/repos?sort=pushed&per_page=${limit}`,
    {
      headers: githubHeaders(),
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) return [];
  const repos = await res.json();

  return repos.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (repo: any): RepoStatus => ({
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description ?? "",
      url: repo.html_url,
      stars: repo.stargazers_count,
      openIssues: repo.open_issues_count,
      openPRs: 0, // Would need separate calls
      lastCommit: null,
      language: repo.language ?? "—",
      isPrivate: repo.private,
    })
  );
}

// ─── Format helpers ───────────────────────────────────────────────────────────

export function relativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin}m`;
  if (diffHr < 24) return `hace ${diffHr}h`;
  if (diffDays < 7) return `hace ${diffDays}d`;
  return date.toLocaleDateString("es-MX", { month: "short", day: "numeric" });
}
