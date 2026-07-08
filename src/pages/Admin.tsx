import { useState, useRef, useEffect, useCallback } from "react";
import {
  uploadImages, deleteImage, reorderImages, updateImageTags,
  fetchProjectsMeta, createProject, updateProject, deleteProject, rawUrl,
} from "@/lib/github";
import type { ImageMeta, ProjectMeta } from "@/lib/github";
import "./Admin.css";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string;
const GH_TOKEN = import.meta.env.VITE_GH_TOKEN as string;

const slugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const byOrder = (images: ImageMeta[]) => [...images].sort((a, b) => a.order - b.order);

export default function Admin() {
  const [authed,        setAuthed]        = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError,    setLoginError]    = useState("");

  const [projects,        setProjects]        = useState<ProjectMeta[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [category,        setCategory]        = useState("");

  const [orderedImages, setOrderedImages] = useState<ImageMeta[]>([]);
  const [uploading,     setUploading]     = useState(false);
  const [uploadLabel,   setUploadLabel]   = useState("");
  const [errors,        setErrors]        = useState<string[]>([]);
  const [busyFile,      setBusyFile]      = useState<string | null>(null);
  const [editingTagsFile, setEditingTagsFile] = useState<string | null>(null);
  const [tagsValue,       setTagsValue]       = useState("");

  const [dragIndex,   setDragIndex]   = useState<number | null>(null);
  const [orderDirty,  setOrderDirty]  = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [newTitle,   setNewTitle]   = useState("");
  const [newDir,     setNewDir]     = useState("");
  const [dirEdited,  setDirEdited]  = useState(false);
  const [newBody,    setNewBody]    = useState("");
  const [creating,   setCreating]   = useState(false);

  const [editingProject, setEditingProject] = useState(false);
  const [editTitle,      setEditTitle]      = useState("");
  const [editBody,       setEditBody]       = useState("");
  const [savingProject,  setSavingProject]  = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProjects = useCallback(async () => {
    setLoadingProjects(true);
    setErrors([]);
    try {
      const list = await fetchProjectsMeta(GH_TOKEN);
      setProjects(list);
      setCategory(prev => (prev && list.some(p => p.dir === prev)) ? prev : (list[0]?.dir ?? ""));
    } catch (err) {
      setErrors([(err as Error).message]);
    }
    setLoadingProjects(false);
  }, []);

  useEffect(() => { if (authed) loadProjects(); }, [authed, loadProjects]);

  const currentProject = projects.find(p => p.dir === category);

  useEffect(() => {
    setOrderedImages(currentProject ? byOrder(currentProject.images) : []);
    setOrderDirty(false);
  }, [category, projects]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setEditingProject(false);
    setShowCreate(false);
  }, [category]);

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
      const updated = await uploadImages(files, category, projects, GH_TOKEN, setUploadLabel);
      setProjects(updated);
    } catch (err) {
      setErrors([(err as Error).message]);
    }
    setUploading(false);
    setUploadLabel("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteImage = async (file: string) => {
    if (!window.confirm(`Delete "${file}" permanently?`)) return;
    setBusyFile(file);
    try {
      const updated = await deleteImage(category, file, projects, GH_TOKEN);
      setProjects(updated);
    } catch (err) {
      setErrors(prev => [...prev, (err as Error).message]);
    }
    setBusyFile(null);
  };

  const startEditTags = (img: ImageMeta) => {
    setEditingTagsFile(img.file);
    setTagsValue(img.tags.join(", "));
  };

  const handleSaveTags = async (file: string) => {
    const tags = tagsValue.split(",").map(t => t.trim()).filter(Boolean);
    setBusyFile(file);
    try {
      const updated = await updateImageTags(category, file, tags, projects, GH_TOKEN);
      setProjects(updated);
    } catch (err) {
      setErrors(prev => [...prev, (err as Error).message]);
    }
    setBusyFile(null);
    setEditingTagsFile(null);
  };

  const handleDragStart = (i: number) => setDragIndex(i);

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === i) return;
    setOrderedImages(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setDragIndex(i);
    setOrderDirty(true);
  };

  const handleDragEnd = () => setDragIndex(null);

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    setErrors([]);
    try {
      const updated = await reorderImages(category, orderedImages.map(img => img.file), projects, GH_TOKEN);
      setProjects(updated);
    } catch (err) {
      setErrors(prev => [...prev, (err as Error).message]);
    }
    setSavingOrder(false);
  };

  const handleResetOrder = () => {
    setOrderedImages(currentProject ? byOrder(currentProject.images) : []);
    setOrderDirty(false);
  };

  const handleTitleChange = (v: string) => {
    setNewTitle(v);
    if (!dirEdited) setNewDir(slugify(v));
  };

  const handleCreate = async () => {
    const dir = newDir.trim();
    const title = newTitle.trim();
    setErrors([]);
    if (!dir || !title) {
      setErrors(["Title and directory are required"]);
      return;
    }
    if (!/^[a-z0-9-]+$/.test(dir)) {
      setErrors(["Directory must be lowercase letters, numbers, and hyphens only"]);
      return;
    }
    setCreating(true);
    try {
      const updated = await createProject({ dir, title, body: newBody.trim() }, projects, GH_TOKEN);
      setProjects(updated);
      setCategory(dir);
      setShowCreate(false);
      setNewTitle(""); setNewDir(""); setNewBody(""); setDirEdited(false);
    } catch (err) {
      setErrors([(err as Error).message]);
    }
    setCreating(false);
  };

  const handleSaveProject = async () => {
    setErrors([]);
    setSavingProject(true);
    try {
      const updated = await updateProject(
        category, { title: editTitle.trim(), body: editBody.trim() }, projects, GH_TOKEN,
      );
      setProjects(updated);
      setEditingProject(false);
    } catch (err) {
      setErrors([(err as Error).message]);
    }
    setSavingProject(false);
  };

  const handleDeleteProject = async () => {
    if (!currentProject) return;
    if (!window.confirm(
      `Delete project "${currentProject.title}" and all ${currentProject.images.length} image(s)? This cannot be undone.`
    )) return;
    setErrors([]);
    setDeletingProject(true);
    try {
      const updated = await deleteProject(category, projects, GH_TOKEN);
      setProjects(updated);
      setCategory(updated[0]?.dir ?? "");
    } catch (err) {
      setErrors([(err as Error).message]);
    }
    setDeletingProject(false);
  };

  if (!authed) {
    return (
      <div className="admin-login">
        <form
          className="admin-login__box"
          onSubmit={e => { e.preventDefault(); handleLogin(); }}
        >
          <h1>Admin</h1>
          <input
            type="text"
            name="username"
            autoComplete="username"
            value="admin"
            readOnly
            hidden
          />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            value={passwordInput}
            onChange={e => { setPasswordInput(e.target.value); setLoginError(""); }}
            className={loginError ? "admin-login__input--error" : ""}
            autoFocus
          />
          {loginError && <p className="admin-login__error">{loginError}</p>}
          <button type="submit">Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin__header">
        <h1>Admin Panel</h1>
        <p>
          Changes are committed directly to the repo. The site rebuilds automatically
          — updates appear publicly in ~1–2 min.
        </p>
      </div>

      <div className="admin__form">
        <div className="admin__field">
          <label htmlFor="cat">Project</label>
          <div className="admin__project-row">
            <select
              id="cat"
              value={category}
              disabled={loadingProjects || projects.length === 0}
              onChange={e => { setCategory(e.target.value); setErrors([]); }}
            >
              {projects.length === 0 && <option value="">No projects</option>}
              {projects.map(p => <option key={p.dir} value={p.dir}>{p.title}</option>)}
            </select>
            <button
              type="button"
              className="admin__btn"
              onClick={() => { setShowCreate(v => !v); setEditingProject(false); }}
            >
              {showCreate ? "Cancel" : "+ New Project"}
            </button>
            {currentProject && !showCreate && (
              <>
                <button
                  type="button"
                  className="admin__btn"
                  onClick={() => {
                    setEditTitle(currentProject.title);
                    setEditBody(currentProject.body);
                    setEditingProject(v => !v);
                  }}
                >
                  {editingProject ? "Cancel" : "Edit"}
                </button>
                <button
                  type="button"
                  className="admin__btn admin__btn--danger"
                  onClick={handleDeleteProject}
                  disabled={deletingProject}
                >
                  {deletingProject ? "Deleting…" : "Delete Project"}
                </button>
              </>
            )}
          </div>
        </div>

        {showCreate && (
          <div className="admin__project-form">
            <div className="admin__field">
              <label htmlFor="newTitle">Title</label>
              <input
                id="newTitle" type="text" value={newTitle}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="e.g. Golden Hour"
              />
            </div>
            <div className="admin__field">
              <label htmlFor="newDir">Directory (URL slug)</label>
              <input
                id="newDir" type="text" value={newDir}
                onChange={e => { setNewDir(e.target.value); setDirEdited(true); }}
                placeholder="e.g. golden-hour"
              />
            </div>
            <div className="admin__field">
              <label htmlFor="newBody">Description</label>
              <textarea
                id="newBody" value={newBody} rows={3}
                onChange={e => setNewBody(e.target.value)}
                placeholder="Shown on the project page. Use a blank line to start a new paragraph."
              />
            </div>
            <button
              type="button" className="admin__btn admin__btn--primary"
              onClick={handleCreate} disabled={creating}
            >
              {creating ? "Creating…" : "Create Project"}
            </button>
          </div>
        )}

        {editingProject && currentProject && (
          <div className="admin__project-form">
            <div className="admin__field">
              <label htmlFor="editTitle">Title</label>
              <input
                id="editTitle" type="text" value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
              />
            </div>
            <div className="admin__field">
              <label htmlFor="editBody">Description</label>
              <textarea
                id="editBody" value={editBody} rows={3}
                onChange={e => setEditBody(e.target.value)}
              />
            </div>
            <button
              type="button" className="admin__btn admin__btn--primary"
              onClick={handleSaveProject} disabled={savingProject}
            >
              {savingProject ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )}

        <div className="admin__field">
          <label htmlFor="files">Upload Images</label>
          <input
            ref={fileInputRef} id="files" type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple onChange={handleUpload} disabled={uploading || !category}
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
          {currentProject?.title ?? category}
          {currentProject && (
            <span className="admin__count">
              {" "}— {orderedImages.length} image{orderedImages.length !== 1 ? "s" : ""}
            </span>
          )}
          {orderDirty && (
            <span className="admin__order-actions">
              <button
                type="button" className="admin__btn admin__btn--primary"
                onClick={handleSaveOrder} disabled={savingOrder}
              >
                {savingOrder ? "Saving order…" : "Save Order"}
              </button>
              <button type="button" className="admin__btn" onClick={handleResetOrder}>
                Reset
              </button>
            </span>
          )}
        </h2>

        {currentProject && orderedImages.length === 0 && (
          <p className="admin__status">No images yet for this category.</p>
        )}

        {orderedImages.length > 0 && (
          <div className="admin__grid">
            {orderedImages.map((img, i) => (
              <div
                key={img.file}
                className={`admin__thumb${dragIndex === i ? " admin__thumb--dragging" : ""}`}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={e => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
              >
                <img src={rawUrl(category, img.file)} alt={img.file} draggable={false} />

                {editingTagsFile === img.file ? (
                  <div className="admin__thumb-rename">
                    <input
                      type="text"
                      value={tagsValue}
                      onChange={e => setTagsValue(e.target.value)}
                      placeholder="tag1, tag2"
                      onKeyDown={e => {
                        if (e.key === "Enter")  handleSaveTags(img.file);
                        if (e.key === "Escape") setEditingTagsFile(null);
                      }}
                      autoFocus
                    />
                    <button className="admin__rename-save" onClick={() => handleSaveTags(img.file)}>✓</button>
                    <button className="admin__rename-cancel" onClick={() => setEditingTagsFile(null)}>✕</button>
                  </div>
                ) : (
                  <div className="admin__thumb-info">
                    <span className="admin__thumb-name">
                      {img.tags.length > 0 ? img.tags.join(", ") : "No tags"}
                    </span>
                    <div className="admin__thumb-actions">
                      <button
                        className="admin__rename-btn"
                        onClick={() => startEditTags(img)}
                        disabled={!!busyFile}
                        aria-label="Edit tags"
                      >🏷</button>
                      <button
                        className="admin__delete-btn"
                        onClick={() => handleDeleteImage(img.file)}
                        disabled={busyFile === img.file}
                        aria-label="Delete"
                      >
                        {busyFile === img.file
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
