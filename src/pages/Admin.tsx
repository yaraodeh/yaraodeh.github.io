import { useState, useRef, useEffect, useCallback } from "react";
import projectsData from "@/config/projects.json";
import "./Admin.css";

const ADMIN_PASSWORD = "yara2024admin";
const CLOUD_NAME    = "dggvgblqg";
const UPLOAD_PRESET = "yara_portfolio";
const API_KEY       = "148786746541926";
const API_SECRET    = "JH7edo0cinocJZTJr-S0zu2MSgE";

async function sha1(msg: string) {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

interface Img { public_id: string; format: string; url: string; }

export default function Admin() {
  const [authed,          setAuthed]          = useState(false);
  const [passwordInput,   setPasswordInput]   = useState("");
  const [passwordError,   setPasswordError]   = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(projectsData[0].dir);
  const [images,          setImages]          = useState<Img[]>([]);
  const [loadingImages,   setLoadingImages]   = useState(false);
  const [uploading,       setUploading]       = useState(false);
  const [progress,        setProgress]        = useState<Record<string, number>>({});
  const [errors,          setErrors]          = useState<string[]>([]);
  const [deletingId,      setDeletingId]      = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── fetch all images in selected category from Cloudinary ──
  const loadImages = useCallback(async (category: string) => {
    setLoadingImages(true);
    setImages([]);
    try {
      const res  = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${category}.json`);
      const data = res.ok ? await res.json() : { resources: [] };
      setImages(
        (data.resources as { public_id: string; format: string }[]).map(r => ({
          public_id: r.public_id,
          format:    r.format,
          url: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${r.public_id}.${r.format}`,
        }))
      );
    } catch {
      setImages([]);
    }
    setLoadingImages(false);
  }, []);

  useEffect(() => { if (authed) loadImages(selectedCategory); }, [authed, selectedCategory, loadImages]);

  // ── login ──
  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) { setAuthed(true); }
    else { setPasswordError(true); setPasswordInput(""); }
  };

  // ── upload ──
  const uploadOne = (file: File): Promise<Img> =>
    new Promise((resolve, reject) => {
      const fd = new FormData();
      fd.append("file",           file);
      fd.append("upload_preset",  UPLOAD_PRESET);
      fd.append("folder",         selectedCategory);
      fd.append("tags",           selectedCategory);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
      xhr.upload.onprogress = e => {
        if (e.lengthComputable)
          setProgress(p => ({ ...p, [file.name]: Math.round(e.loaded / e.total * 100) }));
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          const r = JSON.parse(xhr.responseText);
          resolve({ public_id: r.public_id, format: r.format, url: r.secure_url });
        } else {
          reject(new Error(`Upload failed: ${file.name}`));
        }
      };
      xhr.onerror = () => reject(new Error(`Network error: ${file.name}`));
      xhr.send(fd);
    });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true); setErrors([]); setProgress({});
    for (const file of files) {
      try {
        const img = await uploadOne(file);
        setImages(prev => [img, ...prev]);
      } catch (err) {
        setErrors(prev => [...prev, (err as Error).message]);
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── delete ──
  const handleDelete = async (img: Img) => {
    if (!window.confirm("Delete this image permanently?")) return;
    setDeletingId(img.public_id);
    try {
      const timestamp = String(Math.floor(Date.now() / 1000));
      const signature = await sha1(`public_id=${img.public_id}&timestamp=${timestamp}${API_SECRET}`);
      const fd = new FormData();
      fd.append("public_id", img.public_id);
      fd.append("timestamp",  timestamp);
      fd.append("api_key",    API_KEY);
      fd.append("signature",  signature);
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.result === "ok") {
        setImages(prev => prev.filter(i => i.public_id !== img.public_id));
      } else {
        setErrors(prev => [...prev, "Delete failed — check API credentials."]);
      }
    } catch {
      setErrors(prev => [...prev, "Delete failed — network error."]);
    }
    setDeletingId(null);
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
            onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            className={passwordError ? "admin-login__input--error" : ""}
            autoFocus
          />
          {passwordError && <p className="admin-login__error">Incorrect password</p>}
          <button onClick={handleLogin}>Enter</button>
        </div>
      </div>
    );
  }

  const categoryTitle = projectsData.find(p => p.dir === selectedCategory)?.title ?? selectedCategory;

  return (
    <div className="admin">
      <div className="admin__header">
        <h1>Admin Panel</h1>
        <p>Upload and manage images for each gallery category.</p>
      </div>

      {/* upload form */}
      <div className="admin__form">
        <div className="admin__field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={e => { setSelectedCategory(e.target.value); setErrors([]); setProgress({}); }}
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

        {uploading && Object.keys(progress).length > 0 && (
          <div className="admin__progress">
            {Object.entries(progress).map(([name, pct]) => (
              <div key={name} className="admin__progress-item">
                <span className="admin__progress-name">{name}</span>
                <div className="admin__progress-bar"><div style={{ width: `${pct}%` }} /></div>
                <span className="admin__progress-pct">{pct}%</span>
              </div>
            ))}
          </div>
        )}

        {errors.length > 0 && (
          <div className="admin__errors">{errors.map((err, i) => <p key={i}>{err}</p>)}</div>
        )}
      </div>

      {/* gallery with delete */}
      <div className="admin__gallery">
        <h2>
          {categoryTitle}
          {!loadingImages && <span className="admin__count"> — {images.length} image{images.length !== 1 ? "s" : ""}</span>}
        </h2>

        {loadingImages && <p className="admin__status">Loading…</p>}

        {!loadingImages && images.length === 0 && (
          <p className="admin__status">No images uploaded yet for this category.</p>
        )}

        {!loadingImages && images.length > 0 && (
          <div className="admin__grid">
            {images.map(img => (
              <div key={img.public_id} className="admin__thumb">
                <img src={img.url} alt={img.public_id} />
                <button
                  className="admin__delete-btn"
                  onClick={() => handleDelete(img)}
                  disabled={deletingId === img.public_id}
                  aria-label="Delete image"
                >
                  {deletingId === img.public_id
                    ? <span className="admin__spinner" />
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                  }
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
