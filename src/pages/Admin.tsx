import { useState, useRef, useEffect, useCallback } from "react";
import projectsData from "@/config/projects.json";
import "./Admin.css";

const ADMIN_PASSWORD = "yara2024admin";
const GH_OWNER      = "yaraodeh";
const GH_REPO       = "yaraodeh.github.io";
const GH_BRANCH     = "main";
const PORTFOLIO_BASE = "src/assets/portfolio";

interface GHFile { name: string; path: string; sha: string; }

const rawUrl = (path: string) =>
  `https://raw.githubusercontent.com/${GH_OWNER}/${GH_REPO}/${GH_BRANCH}/${path}?t=${Date.now()}`;

const fileExt = (filename: string) =>
  filename.split(".").pop()?.toLowerCase() ?? "jpg";

const readBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload  = () => resolve((r.result as string).split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });

function ghHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

async function createBlob(base64: string, token: string): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/git/blobs`,
    { method: "POST", headers: ghHeaders(token), body: JSON.stringify({ content: base64, encoding: "base64" }) }
  );
  if (!res.ok) throw new Error(`Blob creation failed (${res.status})`);
  return (await res.json()).sha as string;
}

async function makeCommit(
  entries: { path: string; mode: string; type: string; sha: string | null }[],
  message: string,
  token: string,
) {
  const h = ghHeaders(token);

  const refRes = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/git/ref/heads/${GH_BRANCH}`,
    { headers: h }
  );
  if (!refRes.ok) throw new Error("Failed to read branch ref");
  const latestCommitSha = (await refRes.json()).object.sha as string;

  const commitRes = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/git/commits/${latestCommitSha}`,
    { headers: h }
  );
  if (!commitRes.ok) throw new Error("Failed to read commit");
  const treeSha = (await commitRes.json()).tree.sha as string;

  const treeRes = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/git/trees`,
    { method: "POST", headers: h, body: JSON.stringify({ base_tree: treeSha, tree: entries }) }
  );
  if (!treeRes.ok) throw new Error("Failed to create tree");
  const newTreeSha = (await treeRes.json()).sha as string;

  const newCommitRes = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/git/commits`,
    { method: "POST", headers: h, body: JSON.stringify({ message, tree: newTreeSha, parents: [latestCommitSha] }) }
  );
  if (!newCommitRes.ok) throw new Error("Failed to create commit");
  const newCommitSha = (await newCommitRes.json()).sha as string;

  const updateRes = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/git/refs/heads/${GH_BRANCH}`,
    { method: "PATCH", headers: h, body: JSON.stringify({ sha: newCommitSha }) }
  );
  if (!updateRes.ok) throw new Error("Failed to update branch ref");
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Admin() {
  const [authed,        setAuthed]        = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [tokenInput,    setTokenInput]    = useState("");
  const [loginError,    setLoginError]    = useState("");
  const [token,         setToken]         = useState("");

  const [category,      setCategory]      = useState(projectsData[0].dir);
  const [images,        setImages]        = useState<GHFile[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploading,     setUploading]     = useState(false);
  const [uploadLabel,   setUploadLabel]   = useState("");
  const [errors,        setErrors]        = useState<string[]>([]);
  const [deletingPath,  setDeletingPath]  = useState<string | null>(null);
  const [renamingPath,  setRenamingPath]  = useState<string | null>(null);
  const [renameValue,   setRenameValue]   = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImages = useCallback(async (cat: string, tok: string) => {
    setLoadingImages(true);
    setImages([]);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${PORTFOLIO_BASE}/${cat}?ref=${GH_BRANCH}`,
        { headers: ghHeaders(tok) }
      );
      if (!res.ok) { setImages([]); return; }
      const data = await res.json() as { name: string; path: string; sha: string; type: string }[];
      setImages(
        data
          .filter(f => f.type === "file" && /\.(jpg|jpeg|png|webp)$/i.test(f.name))
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
      );
    } catch { setImages([]); }
    setLoadingImages(false);
  }, []);

  useEffect(() => {
    if (authed) loadImages(category, token);
  }, [authed, category, token, loadImages]);

  // ── login ──
  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD && tokenInput.trim()) {
      setToken(tokenInput.trim());
      setAuthed(true);
    } else {
      setLoginError(!tokenInput.trim() ? "GitHub token is required" : "Incorrect password");
      setPasswordInput("");
    }
  };

  // ── upload (batch commit via Git Data API) ──
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    setErrors([]);

    const baseNum = Math.max(0, ...images.map(f => parseInt(f.name) || 0));
    const entries = files.map((file, i) => ({
      file,
      name: `${baseNum + i + 1}-image.${fileExt(file.name)}`,
    }));

    try {
      setUploadLabel(`Reading ${files.length} file${files.length > 1 ? "s" : ""}…`);
      const payload = await Promise.all(
        entries.map(async e => ({
          path: `${PORTFOLIO_BASE}/${category}/${e.name}`,
          base64: await readBase64(e.file),
        }))
      );

      setUploadLabel("Creating blobs…");
      const blobShas = await Promise.all(
        payload.map(p => createBlob(p.base64, token))
      );

      setUploadLabel("Committing to GitHub…");
      const count = files.length;
      await makeCommit(
        payload.map((p, i) => ({ path: p.path, mode: "100644", type: "blob", sha: blobShas[i] })),
        `upload: add ${count} image${count > 1 ? "s" : ""} to ${category}`,
        token,
      );

      await loadImages(category, token);
    } catch (err) {
      setErrors([(err as Error).message]);
    }

    setUploading(false);
    setUploadLabel("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── delete (Contents API — no content needed, sha suffices) ──
  const handleDelete = async (img: GHFile) => {
    if (!window.confirm(`Delete "${img.name}" permanently?`)) return;
    setDeletingPath(img.path);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${img.path}`,
        {
          method: "DELETE",
          headers: ghHeaders(token),
          body: JSON.stringify({
            message: `delete: remove ${img.name} from ${category}`,
            sha: img.sha,
            branch: GH_BRANCH,
          }),
        }
      );
      if (res.ok) {
        setImages(prev => prev.filter(i => i.path !== img.path));
      } else {
        setErrors(prev => [...prev, `Delete failed (${res.status})`]);
      }
    } catch {
      setErrors(prev => [...prev, "Delete failed — network error."]);
    }
    setDeletingPath(null);
  };

  // ── rename (Git Data API: create new blob + tree with old removed) ──
  const handleRename = async (img: GHFile, newBase: string) => {
    const trimmed = newBase.trim();
    if (!trimmed) { setRenamingPath(null); return; }
    const newName = `${trimmed}.${fileExt(img.name)}`;
    if (newName === img.name) { setRenamingPath(null); return; }
    const newPath = `${PORTFOLIO_BASE}/${category}/${newName}`;

    setDeletingPath(img.path);
    try {
      // Download raw file content (public repo, no auth needed)
      const rawRes = await fetch(rawUrl(img.path));
      if (!rawRes.ok) throw new Error("Could not download file for rename");
      const base64 = await readBase64(await rawRes.blob());

      const blobSha = await createBlob(base64, token);

      await makeCommit(
        [
          { path: newPath, mode: "100644", type: "blob", sha: blobSha },
          { path: img.path, mode: "100644", type: "blob", sha: null }, // delete old
        ],
        `rename: ${img.name} → ${newName} in ${category}`,
        token,
      );

      setImages(prev =>
        prev
          .map(i => i.path === img.path ? { name: newName, path: newPath, sha: blobSha } : i)
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
      );
    } catch (err) {
      setErrors(prev => [...prev, (err as Error).message]);
    }
    setDeletingPath(null);
    setRenamingPath(null);
  };

  // ── login screen ──
  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login__box">
          <h1>Admin</h1>
          <input
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={e => { setPasswordInput(e.target.value); setLoginError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            className={loginError ? "admin-login__input--error" : ""}
            autoFocus
          />
          <input
            type="password"
            placeholder="GitHub Token (fine-grained PAT)"
            value={tokenInput}
            onChange={e => { setTokenInput(e.target.value); setLoginError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            className={loginError ? "admin-login__input--error" : ""}
          />
          {loginError && <p className="admin-login__error">{loginError}</p>}
          <button onClick={handleLogin}>Enter</button>
        </div>
      </div>
    );
  }

  const categoryTitle = projectsData.find(p => p.dir === category)?.title ?? category;

  return (
    <div className="admin">
      <div className="admin__header">
        <h1>Admin Panel</h1>
        <p>
          Images are committed directly to the repo. The site rebuilds automatically
          — new images appear publicly in ~1–2 min after upload.
        </p>
      </div>

      {/* upload form */}
      <div className="admin__form">
        <div className="admin__field">
          <label htmlFor="cat">Category</label>
          <select
            id="cat"
            value={category}
            onChange={e => { setCategory(e.target.value); setErrors([]); }}
          >
            {projectsData.map(p => <option key={p.dir} value={p.dir}>{p.title}</option>)}
          </select>
        </div>

        <div className="admin__field">
          <label htmlFor="files">Upload Images</label>
          <input
            ref={fileInputRef} id="files" type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple onChange={handleUpload} disabled={uploading}
          />
        </div>

        {uploading && (
          <div className="admin__progress">
            <span className="admin__spinner" />
            <span>{uploadLabel || "Uploading…"}</span>
          </div>
        )}

        {errors.length > 0 && (
          <div className="admin__errors">
            {errors.map((err, i) => <p key={i}>{err}</p>)}
          </div>
        )}
      </div>

      {/* gallery */}
      <div className="admin__gallery">
        <h2>
          {categoryTitle}
          {!loadingImages && (
            <span className="admin__count">
              {" "}— {images.length} image{images.length !== 1 ? "s" : ""}
            </span>
          )}
        </h2>

        {loadingImages && <p className="admin__status">Loading…</p>}

        {!loadingImages && images.length === 0 && (
          <p className="admin__status">No images yet for this category.</p>
        )}

        {!loadingImages && images.length > 0 && (
          <div className="admin__grid">
            {images.map(img => (
              <div key={img.path} className="admin__thumb">
                <img src={rawUrl(img.path)} alt={img.name} />

                {renamingPath === img.path ? (
                  <div className="admin__thumb-rename">
                    <input
                      type="text"
                      value={renameValue}
                      onChange={e => setRenameValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter")  handleRename(img, renameValue);
                        if (e.key === "Escape") setRenamingPath(null);
                      }}
                      autoFocus
                    />
                    <button
                      className="admin__rename-save"
                      onClick={() => handleRename(img, renameValue)}
                    >✓</button>
                    <button
                      className="admin__rename-cancel"
                      onClick={() => setRenamingPath(null)}
                    >✕</button>
                  </div>
                ) : (
                  <div className="admin__thumb-info">
                    <span className="admin__thumb-name">{img.name}</span>
                    <div className="admin__thumb-actions">
                      <button
                        className="admin__rename-btn"
                        onClick={() => {
                          setRenamingPath(img.path);
                          setRenameValue(img.name.replace(/\.[^.]+$/, ""));
                        }}
                        disabled={!!deletingPath}
                        aria-label="Rename"
                      >✎</button>
                      <button
                        className="admin__delete-btn"
                        onClick={() => handleDelete(img)}
                        disabled={deletingPath === img.path}
                        aria-label="Delete"
                      >
                        {deletingPath === img.path
                          ? <span className="admin__spinner" />
                          : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4h6v2" />
                            </svg>
                          )
                        }
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
