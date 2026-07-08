import { utf8ToBase64, base64ToUtf8 } from "./fileUtils";

export interface ImageMeta { url: string; publicId?: string; order: number; tags: string[]; }
export interface ProjectMeta { dir: string; title: string; body: string; images: ImageMeta[]; }

const GH_OWNER  = import.meta.env.VITE_GH_OWNER   as string;
const GH_REPO   = import.meta.env.VITE_GH_REPO    as string;
const GH_BRANCH = import.meta.env.VITE_GH_BRANCH  as string;

const BASE_URL = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}`;
const PROJECTS_JSON_PATH = "src/config/projects.json";

function headers(token?: string): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function createBlob(base64: string, token: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/git/blobs`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ content: base64, encoding: "base64" }),
  });
  if (!res.ok) throw new Error(`Blob creation failed (${res.status})`);
  return (await res.json()).sha as string;
}

type TreeEntry = { path: string; mode: string; type: string; sha: string | null };

const MAX_COMMIT_ATTEMPTS = 6;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function makeCommit(entries: TreeEntry[], message: string, token: string): Promise<void> {
  const h = headers(token);

  for (let attempt = 1; attempt <= MAX_COMMIT_ATTEMPTS; attempt++) {
    const refRes = await fetch(`${BASE_URL}/git/ref/heads/${GH_BRANCH}`, { headers: h });
    if (!refRes.ok) throw new Error("Failed to read branch ref");
    const latestCommitSha = (await refRes.json()).object.sha as string;

    const commitRes = await fetch(`${BASE_URL}/git/commits/${latestCommitSha}`, { headers: h });
    if (!commitRes.ok) throw new Error("Failed to read commit");
    const treeSha = (await commitRes.json()).tree.sha as string;

    const treeRes = await fetch(`${BASE_URL}/git/trees`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ base_tree: treeSha, tree: entries }),
    });
    if (!treeRes.ok) throw new Error("Failed to create tree");
    const newTreeSha = (await treeRes.json()).sha as string;

    const newCommitRes = await fetch(`${BASE_URL}/git/commits`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ message, tree: newTreeSha, parents: [latestCommitSha] }),
    });
    if (!newCommitRes.ok) throw new Error("Failed to create commit");
    const newCommitSha = (await newCommitRes.json()).sha as string;

    const updateRes = await fetch(`${BASE_URL}/git/refs/heads/${GH_BRANCH}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ sha: newCommitSha }),
    });
    if (updateRes.ok) return;

    const isConflict = updateRes.status === 422 || updateRes.status === 409;
    if (!isConflict || attempt === MAX_COMMIT_ATTEMPTS) {
      throw new Error("Failed to update branch ref");
    }
    // Someone else (e.g. the deploy workflow) committed to the branch in the
    // meantime — back off briefly, then re-read the new HEAD and retry the
    // whole sequence on top of it.
    await sleep(400 * attempt + Math.random() * 300);
  }
}

export async function fetchProjectsMeta(token?: string): Promise<ProjectMeta[]> {
  const res = await fetch(
    `${BASE_URL}/contents/${PROJECTS_JSON_PATH}?ref=${GH_BRANCH}`,
    { headers: headers(token) },
  );
  if (!res.ok) throw new Error(`Failed to load projects.json (${res.status})`);
  const data = await res.json() as { content: string };
  return JSON.parse(base64ToUtf8(data.content)) as ProjectMeta[];
}

async function commitProjectsMeta(
  projects: ProjectMeta[],
  message: string,
  token: string,
): Promise<void> {
  const json = JSON.stringify(projects, null, 2) + "\n";
  const blobSha = await createBlob(utf8ToBase64(json), token);

  await makeCommit(
    [{ path: PROJECTS_JSON_PATH, mode: "100644", type: "blob", sha: blobSha }],
    message,
    token,
  );
}

export async function createProject(
  project: { dir: string; title: string; body: string },
  existing: ProjectMeta[],
  token: string,
): Promise<ProjectMeta[]> {
  if (existing.some(p => p.dir === project.dir)) {
    throw new Error(`A project with dir "${project.dir}" already exists`);
  }
  const updated = [...existing, { ...project, images: [] }];
  await commitProjectsMeta(updated, `admin: add project "${project.title}"`, token);
  return updated;
}

export async function updateProject(
  dir: string,
  patch: { title: string; body: string },
  existing: ProjectMeta[],
  token: string,
): Promise<ProjectMeta[]> {
  const updated = existing.map(p => (p.dir === dir ? { ...p, ...patch } : p));
  await commitProjectsMeta(updated, `admin: update project "${dir}"`, token);
  return updated;
}

export async function deleteProject(
  dir: string,
  existing: ProjectMeta[],
  token: string,
): Promise<ProjectMeta[]> {
  const updated = existing.filter(p => p.dir !== dir);
  await commitProjectsMeta(updated, `admin: delete project "${dir}"`, token);
  return updated;
}

export const imgKey = (img: ImageMeta): string => img.publicId ?? img.url;

export async function addImages(
  dir: string,
  uploaded: { url: string; publicId: string }[],
  existing: ProjectMeta[],
  token: string,
): Promise<ProjectMeta[]> {
  const project = existing.find(p => p.dir === dir);
  if (!project) throw new Error(`Unknown project "${dir}"`);

  const baseOrder = Math.max(0, ...project.images.map(img => img.order));
  const newImages: ImageMeta[] = uploaded.map((u, i) => ({
    url: u.url, publicId: u.publicId, order: baseOrder + i + 1, tags: [],
  }));

  const updatedProject: ProjectMeta = { ...project, images: [...project.images, ...newImages] };
  const updated = existing.map(p => (p.dir === dir ? updatedProject : p));

  await commitProjectsMeta(
    updated,
    `upload: add ${uploaded.length} image${uploaded.length > 1 ? "s" : ""} to ${dir}`,
    token,
  );

  return updated;
}

export async function deleteImage(
  dir: string,
  key: string,
  existing: ProjectMeta[],
  token: string,
): Promise<ProjectMeta[]> {
  const project = existing.find(p => p.dir === dir);
  if (!project) throw new Error(`Unknown project "${dir}"`);

  const updatedProject: ProjectMeta = {
    ...project,
    images: project.images.filter(img => imgKey(img) !== key),
  };
  const updated = existing.map(p => (p.dir === dir ? updatedProject : p));

  await commitProjectsMeta(updated, `delete: remove image from ${dir}`, token);

  return updated;
}

export async function reorderImages(
  dir: string,
  orderedKeys: string[],
  existing: ProjectMeta[],
  token: string,
): Promise<ProjectMeta[]> {
  const project = existing.find(p => p.dir === dir);
  if (!project) throw new Error(`Unknown project "${dir}"`);

  const byKey = new Map(project.images.map(img => [imgKey(img), img]));
  const reordered: ImageMeta[] = orderedKeys.map((key, i) => ({
    ...byKey.get(key)!,
    order: i + 1,
  }));

  const updatedProject: ProjectMeta = { ...project, images: reordered };
  const updated = existing.map(p => (p.dir === dir ? updatedProject : p));

  await commitProjectsMeta(updated, `reorder: images in ${dir}`, token);
  return updated;
}

export async function updateImageTags(
  dir: string,
  key: string,
  tags: string[],
  existing: ProjectMeta[],
  token: string,
): Promise<ProjectMeta[]> {
  const project = existing.find(p => p.dir === dir);
  if (!project) throw new Error(`Unknown project "${dir}"`);

  const updatedProject: ProjectMeta = {
    ...project,
    images: project.images.map(img => (imgKey(img) === key ? { ...img, tags } : img)),
  };
  const updated = existing.map(p => (p.dir === dir ? updatedProject : p));

  await commitProjectsMeta(updated, `tags: update image in ${dir}`, token);
  return updated;
}
