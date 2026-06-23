import { useState, useRef, useEffect, useCallback } from "react";
import projectsData from "@/config/projects.json";
import { fetchImages, uploadImages, deleteImage, renameImage, rawUrl } from "@/lib/github";
import type { GHFile } from "@/lib/github";
import "./Admin.css";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string;
const GH_TOKEN = import.meta.env.VITE_GH_TOKEN as string;

export default function Admin() {
  const [authed,        setAuthed]        = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError,    setLoginError]    = useState("");

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

  const loadImages = useCallback(async (cat: string) => {
    setLoadingImages(true);
    setImages([]);
    try {
      setImages(await fetchImages(cat, GH_TOKEN));
    } catch {
      setImages([]);
    }
    setLoadingImages(false);
  }, []);

  useEffect(() => {
    if (authed) loadImages(category);
  }, [authed, category, loadImages]);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setLoginError("Incorrect password");
      setPasswordInput("");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    setErrors([]);
    try {
      await uploadImages(files, category, images, GH_TOKEN, setUploadLabel);
      await loadImages(category);
    } catch (err) {
      setErrors([(err as Error).message]);
    }
    setUploading(false);
    setUploadLabel("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (img: GHFile) => {
    if (!window.confirm(`Delete "${img.name}" permanently?`)) return;
    setDeletingPath(img.path);
    try {
      await deleteImage(img, category, GH_TOKEN);
      setImages(prev => prev.filter(i => i.path !== img.path));
    } catch (err) {
      setErrors(prev => [...prev, (err as Error).message]);
    }
    setDeletingPath(null);
  };

  const handleRename = async (img: GHFile, newBase: string) => {
    const trimmed = newBase.trim();
    if (!trimmed || `${trimmed}.${img.name.split(".").pop()}` === img.name) {
      setRenamingPath(null);
      return;
    }
    setDeletingPath(img.path);
    try {
      const renamed = await renameImage(img, trimmed, category, GH_TOKEN);
      setImages(prev =>
        prev
          .map(i => i.path === img.path ? renamed : i)
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
      );
    } catch (err) {
      setErrors(prev => [...prev, (err as Error).message]);
    }
    setDeletingPath(null);
    setRenamingPath(null);
  };

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
                    <button className="admin__rename-save" onClick={() => handleRename(img, renameValue)}>✓</button>
                    <button className="admin__rename-cancel" onClick={() => setRenamingPath(null)}>✕</button>
                  </div>
                ) : (
                  <div className="admin__thumb-info">
                    <span className="admin__thumb-name">{img.name}</span>
                    <div className="admin__thumb-actions">
                      <button
                        className="admin__rename-btn"
                        onClick={() => { setRenamingPath(img.path); setRenameValue(img.name.replace(/\.[^.]+$/, "")); }}
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
