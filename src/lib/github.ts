import { fileExt, readBase64 } from "./fileUtils";
import { portfolioBase } from "../config/site";

export interface GHFile { name: string; path: string; sha: string; }

const GH_OWNER  = import.meta.env.VITE_GH_OWNER   as string;
const GH_REPO   = import.meta.env.VITE_GH_REPO    as string;
const GH_BRANCH = import.meta.env.VITE_GH_BRANCH  as string;

const BASE_URL = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}`;

export const rawUrl = (path: string) =>
  `https://raw.githubusercontent.com/${GH_OWNER}/${GH_REPO}/${GH_BRANCH}/${path}?t=${Date.now()}`;

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
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

async function makeCommit(entries: TreeEntry[], message: string, token: string): Promise<void> {
  const h = headers(token);

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
  if (!updateRes.ok) throw new Error("Failed to update branch ref");
}

export async function fetchImages(category: string, token: string): Promise<GHFile[]> {
  const res = await fetch(
    `${BASE_URL}/contents/${portfolioBase}/${category}?ref=${GH_BRANCH}`,
    { headers: headers(token) },
  );
  if (!res.ok) return [];
  const data = await res.json() as { name: string; path: string; sha: string; type: string }[];
  return data
    .filter(f => f.type === "file" && /\.(jpg|jpeg|png|webp)$/i.test(f.name))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

export async function uploadImages(
  files: File[],
  category: string,
  existingImages: GHFile[],
  token: string,
  onProgress: (label: string) => void,
): Promise<void> {
  const baseNum = Math.max(0, ...existingImages.map(f => parseInt(f.name) || 0));
  const named = files.map((file, i) => ({
    file,
    path: `${portfolioBase}/${category}/${baseNum + i + 1}-image.${fileExt(file.name)}`,
  }));

  onProgress(`Reading ${files.length} file${files.length > 1 ? "s" : ""}…`);
  const base64s = await Promise.all(named.map(e => readBase64(e.file)));

  onProgress("Creating blobs…");
  const blobShas = await Promise.all(base64s.map(b => createBlob(b, token)));

  onProgress("Committing to GitHub…");
  await makeCommit(
    named.map((e, i) => ({ path: e.path, mode: "100644", type: "blob", sha: blobShas[i] })),
    `upload: add ${files.length} image${files.length > 1 ? "s" : ""} to ${category}`,
    token,
  );
}

export async function deleteImage(img: GHFile, category: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/contents/${img.path}`, {
    method: "DELETE",
    headers: headers(token),
    body: JSON.stringify({
      message: `delete: remove ${img.name} from ${category}`,
      sha: img.sha,
      branch: GH_BRANCH,
    }),
  });
  if (!res.ok) throw new Error(`Delete failed (${res.status})`);
}

export async function renameImage(
  img: GHFile,
  newBase: string,
  category: string,
  token: string,
): Promise<GHFile> {
  const newName = `${newBase.trim()}.${fileExt(img.name)}`;
  const newPath = `${portfolioBase}/${category}/${newName}`;

  const rawRes = await fetch(rawUrl(img.path));
  if (!rawRes.ok) throw new Error("Could not download file for rename");
  const base64 = await readBase64(await rawRes.blob());
  const blobSha = await createBlob(base64, token);

  await makeCommit(
    [
      { path: newPath, mode: "100644", type: "blob", sha: blobSha },
      { path: img.path, mode: "100644", type: "blob", sha: null },
    ],
    `rename: ${img.name} → ${newName} in ${category}`,
    token,
  );

  return { name: newName, path: newPath, sha: blobSha };
}
