import React, { useState, useRef } from "react";
import axios from "axios";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ChartsPage from "./ChartsPage";
import LandingPage from "./LandingPage";
import CleaningPage from "./CleaningPage";
import "./index.css";

import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

/* ============================================================
   SIDEBAR — shared across pages
   ============================================================ */
function Sidebar({ activeNav, onNav, hasData }) {
  const navItems = [
    { id: "upload", icon: "⬆", label: "Upload Data" },
    { id: "cleaned", icon: "✨", label: "Data Cleaned", disabled: !hasData },
    { id: "charts", icon: "📊", label: "Charts", disabled: !hasData },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">📈</div>
        <div className="sidebar-logo-name">
          Data Explorer
          <span>Analytics</span>
        </div>
      </div>

      {/* Nav */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">Navigation</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item${activeNav === item.id ? " active" : ""}`}
            onClick={() => !item.disabled && onNav(item.id)}
            disabled={item.disabled}
            style={item.disabled ? { opacity: 0.4, cursor: "default" } : {}}
            title={item.label}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-label">v1.0 · Data Explorer</div>
      </div>
    </aside>
  );
}

/* ============================================================
   TOP BAR — shared across pages
   ============================================================ */
function TopBar({ title, right }) {
  return (
    <div className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-right">{right}</div>
    </div>
  );
}

/* ============================================================
   UPLOAD ZONE
   ============================================================ */
function UploadZone({ file, onFile, drag, setDrag, inputRef }) {
  return (
    <div
      className={`upload-zone${drag ? " drag-active" : ""}`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f) onFile(f);
      }}
    >
      <div className="upload-icon-wrap">
        <span>{drag ? "📥" : "📂"}</span>
      </div>
      <p className="upload-heading">
        {drag ? "Release to drop" : "Drop your CSV file here or click to browse"}
      </p>
      <p className="upload-hint">
        Only <strong>.csv</strong> files are supported
      </p>
      {file && (
        <div className="file-chip">
          📄 {file.name}
          <span style={{ color: "#94a3b8" }}>· {(file.size / 1024).toFixed(1)} KB</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={(e) => onFile(e.target.files[0])}
      />
    </div>
  );
}

/* ============================================================
   STATS ROW (after upload)
   ============================================================ */
function StatsRow({ columns, rows, fileSize }) {
  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-value">{columns.length}</div>
        <div className="stat-label">Columns</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{rows.length}</div>
        <div className="stat-label">Rows Previewed</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">
          {(fileSize / 1024).toFixed(1)}
          <span className="stat-unit">KB</span>
        </div>
        <div className="stat-label">File Size</div>
      </div>
    </div>
  );
}

/* ============================================================
   CELL VALUE RENDERER
   ============================================================ */
function CellValue({ col, value }) {
  if (value === null || value === undefined || value === "")
    return <span className="null-cell">—</span>;
  if (col === "status")
    return <span className={`status-badge status-${value}`}>{value}</span>;
  if (typeof value === "string" && value.startsWith("http")) {
    const label = col.includes("resume") ? "📄 View" : col.includes("pdf") ? "📋 View" : "🔗 Link";
    return <a href={value} target="_blank" rel="noreferrer">{label}</a>;
  }
  if (col.includes("created_at") || col.includes("updated_at"))
    return <span>{new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>;
  return <span>{String(value)}</span>;
}

/* ============================================================
   DATA TABLE
   ============================================================ */
function DataTable({ columns, rows }) {
  return (
    <div className="table-card">
      <div className="table-card-header">
        <span className="table-card-title">Dataset Preview</span>
        <span className="table-row-count">{rows.length} rows</span>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((col, i) => <th key={i}>{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {columns.map((col, j) => (
                  <td key={j}>
                    <CellValue col={col} value={row[col]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE: Home (Upload)
   ============================================================ */
function Home() {
  const navigate  = useNavigate();
  const [file, setFile]       = useState(null);
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [drag, setDrag]       = useState(false);
  const inputRef              = useRef();

  const handleFile = (f) => {
    if (f && f.name.endsWith(".csv")) { setFile(f); setError(null); }
    else setError("Please select a valid .csv file.");
  };

  const handleUpload = async () => {
    if (!file) { setError("Choose a CSV file first."); return; }
    setLoading(true); setError(null); setData(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await axios.post("http://localhost:5000/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        activeNav="upload"
        hasData={!!data}
        onNav={(id) => {
          if (id === "charts" && data) navigate("/charts", { state: { data } });
          if (id === "upload") navigate("/upload");
          if (id === "cleaned" && data) navigate("/cleaned", { state: { data } });
        }}
      />
      <div className="main-area">
        <TopBar
          title="Upload Dataset"
          right={
            data && (
              <button
                className="btn btn-primary"
                onClick={() => navigate("/cleaned", { state: { data } })}
              >
                NEXT →
              </button>
            )
          }
        />

        <div className="content">
          {/* Page header */}
          <div className="upload-page-header">
            <h1>Import your dataset</h1>
            <p>Upload a CSV file to preview the data and generate visualisations.</p>
          </div>

          {/* Upload card */}
          <div className="upload-card">
            <UploadZone
              file={file}
              onFile={handleFile}
              drag={drag}
              setDrag={setDrag}
              inputRef={inputRef}
            />

            <button
              className="btn btn-primary btn-full"
              onClick={handleUpload}
              disabled={loading || !file}
            >
              {loading
                ? <><span className="spinner" /> Analysing…</>
                : <>Upload &amp; Preview →</>
              }
            </button>

            {error && (
              <div className="error-box">⚠ {error}</div>
            )}
          </div>

          {/* Results */}
          {data && data.columns && data.rows && (
            <>
              {/* Removed redundant log from here to put it in CleaningPage */}

              <div style={{ marginTop: 28 }}>
                <div className="section-heading">Summary after cleaning</div>
                <StatsRow
                  columns={data.columns}
                  rows={data.rows}
                  fileSize={file?.size ?? 0}
                />
              </div>

              <div>
                <div className="section-heading">Cleaned Dataset Preview</div>
                <DataTable columns={data.columns} rows={data.rows} />
              </div>

              <div className="action-bar">
                <button
                  className="btn btn-outline"
                  onClick={() => { setFile(null); setData(null); }}
                >
                  ✕ Clear
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/cleaned", { state: { data } })}
                >
                  NEXT →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   APP ROUTER
   ============================================================ */
export default function App() {
  return (
    <Routes>
      <Route path="/"        element={<LandingPage />} />
      <Route path="/upload"  element={<Home />} />
      <Route path="/cleaned" element={<CleaningPage />} />
      <Route path="/charts"  element={<ChartsPage />} />
    </Routes>
  );
}