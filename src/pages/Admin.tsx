import { useState, useRef } from "react";
import projectsData from "@/config/projects.json";
import "./Admin.css";

const ADMIN_PASSWORD = "yara2024admin";
const CLOUD_NAME = "dggvgblqg";
const UPLOAD_PRESET = "yara_portfolio";

interface UploadResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(projectsData[0].dir);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadResult[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  const uploadFile = (file: File): Promise<UploadResult> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", selectedCategory);
      formData.append("tags", selectedCategory);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress((prev) => ({
            ...prev,
            [file.name]: Math.round((e.loaded / e.total) * 100),
          }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed for ${file.name}`));
        }
      };

      xhr.onerror = () => reject(new Error(`Network error uploading ${file.name}`));
      xhr.send(formData);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setErrors([]);
    setProgress({});

    for (const file of files) {
      try {
        const result = await uploadFile(file);
        setUploadedFiles((prev) => [result, ...prev]);
      } catch (err) {
        setErrors((prev) => [...prev, (err as Error).message]);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
            onChange={(e) => {
              setPasswordInput(e.target.value);
              setPasswordError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className={passwordError ? "admin-login__input--error" : ""}
            autoFocus
          />
          {passwordError && <p className="admin-login__error">Incorrect password</p>}
          <button onClick={handleLogin}>Enter</button>
        </div>
      </div>
    );
  }

  const categoryTitle = projectsData.find((p) => p.dir === selectedCategory)?.title ?? selectedCategory;

  return (
    <div className="admin">
      <div className="admin__header">
        <h1>Upload Images</h1>
        <p>Images upload directly to Cloudinary and appear in the gallery immediately.</p>
      </div>

      <div className="admin__form">
        <div className="admin__field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setUploadedFiles([]);
              setErrors([]);
              setProgress({});
            }}
          >
            {projectsData.map((p) => (
              <option key={p.dir} value={p.dir}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="admin__field">
          <label htmlFor="files">Images</label>
          <input
            ref={fileInputRef}
            id="files"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleUpload}
            disabled={uploading}
          />
        </div>

        {uploading && Object.keys(progress).length > 0 && (
          <div className="admin__progress">
            {Object.entries(progress).map(([name, pct]) => (
              <div key={name} className="admin__progress-item">
                <span className="admin__progress-name">{name}</span>
                <div className="admin__progress-bar">
                  <div style={{ width: `${pct}%` }} />
                </div>
                <span className="admin__progress-pct">{pct}%</span>
              </div>
            ))}
          </div>
        )}

        {errors.length > 0 && (
          <div className="admin__errors">
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="admin__results">
          <h2>Uploaded to {categoryTitle}</h2>
          <div className="admin__grid">
            {uploadedFiles.map((f) => (
              <div key={f.public_id} className="admin__thumb">
                <img src={f.secure_url} alt={f.original_filename} />
                <p>{f.original_filename}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
