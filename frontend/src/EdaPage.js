import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";

/* ============================================================
   SIDEBAR (shared component structure)
   ============================================================ */
function Sidebar({ activeNav, onNav, hasData }) {
  const navItems = [
    { id: "upload", icon: "⬆", label: "Upload Data" },
    { id: "cleaned", icon: "✨", label: "Data Cleaned", disabled: !hasData },
    { id: "eda", icon: "🔍", label: "Exploratory Data Analysis", disabled: !hasData },
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

export default function EdaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data;
  const eda = data?.eda;

  if (!data || !eda) {
    return (
      <div className="empty-state">
        <div className="empty-icon">❌</div>
        <div className="empty-title">No EDA Data Available</div>
        <div className="empty-desc">Please upload a dataset first.</div>
        <button className="btn btn-primary" onClick={() => navigate("/upload")}>Go to Upload</button>
      </div>
    );
  }

  const handleNav = (id) => {
    if (id === "upload") navigate("/upload");
    if (id === "cleaned") navigate("/cleaned", { state: { data } });
    if (id === "charts") navigate("/charts", { state: { data } });
  };

  return (
    <div className="app-shell">
      <Sidebar activeNav="eda" hasData={true} onNav={handleNav} />
      
      <div className="main-area">
        <TopBar
          title="Exploratory Data Analysis"
          right={
            <button className="btn btn-primary" onClick={() => navigate("/charts", { state: { data } })}>
              NEXT: VIEW CHARTS →
            </button>
          }
        />

        <div className="content">
          <div className="upload-page-header">
            <h1>Exploratory Data Analysis (EDA)</h1>
            <p>Comprehensive statistical breakdown of your cleaned dataset.</p>
          </div>

          {/* 1. Overview Section */}
          <div className="section-heading">Dataset Overview</div>
          <div className="kpi-row">
            <div className="kpi-card">
              <div className="kpi-label">Rows</div>
              <div className="kpi-value">{eda.overview.total_rows}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Columns</div>
              <div className="kpi-value">{eda.overview.total_columns}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Numeric Cols</div>
              <div className="kpi-value">{eda.overview.number_of_numeric_columns}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Categorical Cols</div>
              <div className="kpi-value">{eda.overview.number_of_categorical_columns}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
            
            {/* 2. Column Types Table */}
            <div className="table-card">
              <div className="table-card-header">
                <span className="table-card-title">Column Data Types</span>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Column</th>
                      <th>Type</th>
                      <th>Uniques</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(eda.column_types).map(([col, type]) => (
                      <tr key={col}>
                        <td style={{ fontWeight: 600 }}>{col}</td>
                        <td><span className="chart-type-pill">{type}</span></td>
                        <td>{eda.unique_values[col]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Missing Value Analysis */}
            <div className="table-card">
              <div className="table-card-header">
                <span className="table-card-title">Missing Values Analysis</span>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Column</th>
                      <th>Missing Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(eda.missing_values).map(([col, count]) => (
                      <tr key={col}>
                        <td style={{ fontWeight: 600 }}>{col}</td>
                        <td style={{ color: count > 0 ? "var(--red)" : "var(--green)" }}>{count}</td>
                        <td>{eda.missing_values_percentage[col]}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 4. Numerical Statistics */}
          {Object.keys(eda.numerical_statistics).length > 0 && (
            <div style={{ marginTop: "32px" }}>
              <div className="section-heading">Numerical Statistics</div>
              <div className="table-card">
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Metric Variable</th>
                        <th>Mean</th>
                        <th>Median</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Std Dev</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(eda.numerical_statistics).map(([col, stats]) => (
                        <tr key={col}>
                          <td style={{ fontWeight: 600 }}>{col}</td>
                          <td>{stats.mean?.toLocaleString()}</td>
                          <td>{stats.median?.toLocaleString()}</td>
                          <td>{stats.min?.toLocaleString()}</td>
                          <td>{stats.max?.toLocaleString()}</td>
                          <td>{stats.std?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. Top Categories */}
          {Object.keys(eda.top_categories).length > 0 && (
            <div style={{ marginTop: "32px" }}>
              <div className="section-heading">Top Categories (Frequency)</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {Object.entries(eda.top_categories).map(([col, items]) => (
                  <div className="table-card" key={col}>
                    <div className="table-card-header">
                      <span className="table-card-title">{col}</span>
                    </div>
                    <div className="table-wrapper">
                      <table>
                        <tbody>
                          {Object.entries(items).map(([val, count]) => (
                            <tr key={val}>
                              <td>{val}</td>
                              <td style={{ textAlign: "right", fontWeight: 600 }}>{count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="action-bar" style={{ marginTop: "32px" }}>
            <button className="btn btn-outline" onClick={() => navigate("/cleaned", { state: { data } })}>
              ← Back to Cleaning
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/charts", { state: { data } })}>
              Next: View Charts →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
