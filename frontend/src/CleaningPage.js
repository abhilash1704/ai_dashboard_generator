import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";

/* ============================================================
   SIDEBAR (duplicated easily to match context)
   ============================================================ */
function Sidebar({ activeNav, onNav, hasData }) {
  const navItems = [
    { id: "upload", icon: "⬆", label: "Upload Data" },
    { id: "cleaned", icon: "✨", label: "Data Cleaned", disabled: !hasData },
    { id: "charts", icon: "📊", label: "Charts", disabled: !hasData },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">📈</div>
        <div className="sidebar-logo-name">
          Data Explorer
          <span>Analytics</span>
        </div>
      </div>
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
      <div className="sidebar-footer">
        <div className="sidebar-footer-label">v1.0 · Data Explorer</div>
      </div>
    </aside>
  );
}

function TopBar({ title, right }) {
  return (
    <div className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-right">{right}</div>
    </div>
  );
}

export default function CleaningPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data;

  if (!data) {
    return (
      <div className="empty-state">
        <div className="empty-icon">❌</div>
        <div className="empty-title">No Data Available</div>
        <div className="empty-desc">Please upload a dataset first.</div>
        <button className="btn btn-primary" onClick={() => navigate("/upload")}>Go to Upload</button>
      </div>
    );
  }

  const handleNav = (id) => {
    if (id === "upload") navigate("/upload");
    if (id === "charts") navigate("/charts", { state: { data } });
  };

  const { stats, report } = data;
  const missingCols = stats?.missing_columns || {};
  const hasMissing = Object.keys(missingCols).length > 0;

  return (
    <div className="app-shell">
      <Sidebar activeNav="cleaned" hasData={true} onNav={handleNav} />
      
      <div className="main-area">
        <TopBar
          title="Data Cleaned Report"
          right={
            <button className="btn btn-primary" onClick={() => navigate("/charts", { state: { data } })}>
              NEXT →
            </button>
          }
        />

        <div className="content">
          <div className="upload-page-header">
            <h1>Data Cleaning Report</h1>
            <p>Review the automated fixes applied to your raw dataset.</p>
          </div>

          <div className="kpi-row">
            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon kpi-icon-amber">⚠️</div>
              </div>
              <div className="kpi-value">{stats?.total_nulls || 0}</div>
              <div className="kpi-label">Initial Null Values Fixes</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon kpi-icon-green">✨</div>
              </div>
              <div className="kpi-value">{report?.length || 0}</div>
              <div className="kpi-label">Automated Cleaning Actions</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon kpi-icon-blue">📊</div>
              </div>
              <div className="kpi-value">{data?.rows?.length || 0}</div>
              <div className="kpi-label">Final Clean Rows</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon kpi-icon-indigo">📋</div>
              </div>
              <div className="kpi-value">{data?.columns?.length || 0}</div>
              <div className="kpi-label">Columns Analysed</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
            
            {/* Left Col: Actions Taken */}
            <div className="table-card" style={{ animationDelay: "0.1s" }}>
              <div className="table-card-header">
                <span className="table-card-title">Values Replaced & Removed (Short Log)</span>
              </div>
              <div style={{ padding: "16px 20px" }}>
                {report && report.length > 0 ? (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {report.map((msg, i) => (
                      <li key={i} style={{ display: "flex", gap: "10px", marginBottom: "12px", fontSize: "14px", color: "var(--text-primary)" }}>
                        <span style={{ color: "var(--green)", fontWeight: 700 }}>✓</span> {msg}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: "14px", color: "var(--text-muted)", fontStyle: "italic" }}>No cleaning actions required.</div>
                )}
              </div>
            </div>

            {/* Right Col: Missing Data Breakdown */}
            <div className="table-card" style={{ animationDelay: "0.2s" }}>
              <div className="table-card-header">
                <span className="table-card-title">Missing Data by Column (Before Cleaning)</span>
              </div>
              <div className="table-wrapper">
                {hasMissing ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Column Name</th>
                        <th style={{ textAlign: "right" }}>Null Values</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(missingCols).map(([col, count]) => (
                        <tr key={col}>
                          <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{col}</td>
                          <td style={{ textAlign: "right", color: "var(--amber)", fontWeight: 600 }}>{count} found</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: "24px", fontSize: "14px", color: "var(--text-muted)", fontStyle: "italic", textAlign: "center" }}>
                    No null values were present initially.
                  </div>
                )}
              </div>
            </div>

          </div>
          
          <div className="action-bar" style={{ marginTop: "24px" }}>
            <button
              className="btn btn-outline"
              onClick={() => navigate("/upload")}
            >
              ← Back
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/charts", { state: { data } })}
            >
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
