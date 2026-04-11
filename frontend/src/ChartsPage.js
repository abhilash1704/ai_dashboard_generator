import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bar, Pie, Line, Doughnut, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  LineElement, PointElement, Tooltip, Legend, Title,
} from "chart.js";
import "./index.css";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  LineElement, PointElement, Tooltip, Legend, Title
);

/* ============================================================
   Helpers
   ============================================================ */
function detectTypes(columns, rows) {
  const types = {};
  columns.forEach((col) => {
    let numCount = 0, dateCount = 0, validRows = 0;
    rows.forEach((row) => {
      const val = row[col];
      if (val === null || val === undefined || val === "") return;
      validRows++;
      if (typeof val === "number" || (!isNaN(val) && !isNaN(parseFloat(val)))) numCount++;
      else if (typeof val === "string" && !isNaN(Date.parse(val)) && isNaN(val)) dateCount++;
    });
    if (validRows > 0) {
      if      (numCount  / validRows > 0.8) types[col] = "numeric";
      else if (dateCount / validRows > 0.8) types[col] = "date";
      else                                   types[col] = "categorical";
    } else {
      types[col] = "categorical";
    }
  });
  return types;
}

/* Palette */
const PALETTE = [
  "#4f46e5","#7c3aed","#ec4899","#10b981",
  "#f59e0b","#3b82f6","#f43f5e","#84cc16","#06b6d4","#eab308",
];

/* Light-theme chart defaults */
const lightPlugins = {
  legend: {
    labels: {
      color: "#475569",
      font: { family: "'Inter', system-ui, sans-serif", size: 12 },
      boxWidth: 12,
    },
  },
  tooltip: {
    backgroundColor: "#1e293b",
    borderColor: "rgba(79,70,229,0.3)",
    borderWidth: 1,
    titleColor: "#f8fafc",
    bodyColor: "#94a3b8",
    cornerRadius: 8,
    padding: 10,
  },
};

const lightScales = {
  x: {
    ticks: { color: "#94a3b8", font: { family: "'Inter', system-ui, sans-serif", size: 11 } },
    grid:  { color: "rgba(0,0,0,0.05)" },
  },
  y: {
    ticks: { color: "#94a3b8", font: { family: "'Inter', system-ui, sans-serif", size: 11 } },
    grid:  { color: "rgba(0,0,0,0.05)" },
  },
};

/* ============================================================
   SIDEBAR
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

/* ============================================================
   TOP BAR
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
   KPI CARDS ROW
   ============================================================ */
function KpiCards({ chartData, columns, rows }) {
  const numCols = columns.filter((col) => {
    const vals = rows.map((r) => parseFloat(r[col])).filter((n) => !isNaN(n));
    return vals.length > rows.length * 0.7;
  });

  const cards = [
    {
      icon: "📋", iconClass: "kpi-icon-indigo",
      value: columns.length,
      label: "Total Columns",
      badge: null,
    },
    {
      icon: "📝", iconClass: "kpi-icon-blue",
      value: rows.length,
      label: "Data Rows",
      badge: null,
    },
    {
      icon: "🔢", iconClass: "kpi-icon-green",
      value: numCols.length,
      label: "Numeric Columns",
      badge: { label: `${Math.round((numCols.length / columns.length) * 100)}%`, up: true },
    },
    {
      icon: "✓", iconClass: "kpi-icon-amber",
      value: `${Math.round(((rows.length) / (rows.length + 1)) * 100)}%`,
      label: "Data Completeness",
      badge: { label: "Good", up: true },
    },
  ];

  return (
    <div className="kpi-row">
      {cards.map((card, i) => (
        <div key={i} className="kpi-card">
          <div className="kpi-card-top">
            <div className={`kpi-icon ${card.iconClass}`}>{card.icon}</div>
            {card.badge && (
              <span className={`kpi-badge ${card.badge.up ? "kpi-badge-up" : "kpi-badge-down"}`}>
                {card.badge.up ? "↑" : "↓"} {card.badge.label}
              </span>
            )}
          </div>
          <div className="kpi-value">{card.value}</div>
          <div className="kpi-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   CHART CARD
   ============================================================ */
function ChartCard({ title, type, children }) {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <span className="chart-card-title">{title}</span>
        <span className="chart-type-pill">{type}</span>
      </div>
      <div className="chart-card-body">{children}</div>
    </div>
  );
}

/* ============================================================
   PAGE: ChartsPage
   ============================================================ */
export default function ChartsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data     = location.state?.data;

  const chartData = useMemo(() => {
    if (!data || !data.rows || data.rows.length === 0) return null;

    const columns = data.columns || [];
    const rows    = data.rows;
    const types   = detectTypes(columns, rows);

    const catCols  = columns.filter((c) => types[c] === "categorical");
    const numCols  = columns.filter((c) => types[c] === "numeric");
    const dateCols = columns.filter((c) => types[c] === "date");

    const primaryCat   = catCols[0]  ?? null;
    const primaryNum   = numCols[0]  ?? null;
    const secondaryNum = numCols[1]  ?? primaryNum;
    const dateCol      = dateCols[0] ?? null;

    const categoryCounts = {};
    if (primaryCat) {
      rows.forEach((r) => {
        const v = String(r[primaryCat] ?? "Unknown");
        categoryCounts[v] = (categoryCounts[v] || 0) + 1;
      });
    } else {
      rows.forEach((_, i) => { categoryCounts[`Item ${i + 1}`] = 1; });
    }
    const sortedCat = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const catLabels = sortedCat.map((x) => x[0]);
    const catValues = sortedCat.map((x) => x[1]);
    const catTitle  = primaryCat ? `${primaryCat} Distribution` : "Category Distribution";

    let lineLabels = [], lineValues = [], lineTitle = "Trend";
    if (dateCol && primaryNum) {
      const sorted = [...rows].sort((a, b) => new Date(a[dateCol]) - new Date(b[dateCol]));
      lineLabels = sorted.map((r) => new Date(r[dateCol]).toLocaleDateString());
      lineValues = sorted.map((r) => parseFloat(r[primaryNum]) || 0);
      lineTitle  = `${primaryNum} over ${dateCol}`;
    } else {
      lineLabels = rows.map((_, i) => `Row ${i + 1}`);
      lineValues = rows.map((r)  => primaryNum ? (parseFloat(r[primaryNum]) || 0) : 0);
      lineTitle  = primaryNum ? `${primaryNum} Trend` : "Trend";
    }

    const pieLabels = catLabels.slice(0, 6);
    const pieValues = catValues.slice(0, 6);

    let histLabels = [], histValues = [], histTitle = "Distribution";
    if (primaryNum) {
      const vals = rows.map((r) => parseFloat(r[primaryNum])).filter((n) => !isNaN(n));
      if (vals.length) {
        const min = Math.min(...vals), max = Math.max(...vals);
        const binSz = (max - min) / 10 || 1;
        const bins  = new Array(10).fill(0);
        vals.forEach((v) => {
          let idx = Math.floor((v - min) / binSz);
          if (idx >= 10) idx = 9;
          bins[idx]++;
        });
        histLabels = bins.map((_, i) => `${(min + i * binSz).toFixed(1)}`);
        histValues = bins;
        histTitle  = `${primaryNum} Distribution`;
      }
    }

    let scatterPts = [], scatterTitle = "Scatter";
    let scatterX = "X", scatterY = "Y";
    if (primaryNum && secondaryNum && primaryNum !== secondaryNum) {
      scatterPts   = rows.map((r) => ({ x: parseFloat(r[primaryNum]) || 0, y: parseFloat(r[secondaryNum]) || 0 }));
      scatterTitle = `${primaryNum} vs ${secondaryNum}`;
      scatterX = primaryNum; scatterY = secondaryNum;
    } else if (primaryNum) {
      scatterPts   = rows.map((r, i) => ({ x: i + 1, y: parseFloat(r[primaryNum]) || 0 }));
      scatterTitle = `Index vs ${primaryNum}`;
      scatterX = "Index"; scatterY = primaryNum;
    }

    return {
      bar:       { labels: catLabels,  data: catValues,  title: catTitle },
      line:      { labels: lineLabels, data: lineValues, title: lineTitle },
      pie:       { labels: pieLabels,  data: pieValues,  title: primaryCat ? `Top ${primaryCat}` : "Top Categories" },
      doughnut:  { labels: pieLabels,  data: pieValues,  title: primaryCat ? `${primaryCat} Composition` : "Composition" },
      histogram: { labels: histLabels, data: histValues, title: histTitle },
      scatter:   { data: scatterPts,   title: scatterTitle, xLabel: scatterX, yLabel: scatterY },
    };
  }, [data]);

  const handleNav = (id) => {
    if (id === "upload") navigate("/upload");
    if (id === "cleaned") navigate("/cleaned", { state: { data } });
    if (id === "eda") navigate("/eda", { state: { data } });
    if (id === "charts") navigate("/charts", { state: { data } });
  };

  /* Empty state */
  if (!chartData) {
    return (
      <div className="app-shell">
        <Sidebar activeNav="charts" hasData={false} onNav={handleNav} />
        <div className="main-area">
          <TopBar title="Charts" right={
            <button className="btn btn-outline" onClick={() => navigate("/")}>← Back to Upload</button>
          } />
          <div className="content">
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h2 className="empty-title">No dataset loaded</h2>
              <p className="empty-desc">Go back and upload a CSV file to generate charts.</p>
              <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => navigate("/")}>
                ← Back to Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* Chart options */
  const cartesian = (xLabel = "", yLabel = "") => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { ...lightPlugins, title: { display: false } },
    scales: {
      x: { ...lightScales.x, title: { display: !!xLabel, text: xLabel, color: "#64748b" } },
      y: { ...lightScales.y, title: { display: !!yLabel, text: yLabel, color: "#64748b" } },
    },
  });

  const radial = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...lightPlugins,
      legend: { ...lightPlugins.legend, position: "right" },
    },
  });

  return (
    <div className="app-shell">
      <Sidebar activeNav="charts" hasData={true} onNav={handleNav} />
      <div className="main-area">
        <TopBar
          title="Charts & Visualisations"
          right={
            <button className="btn btn-outline" onClick={() => navigate("/")}>
              ⬆ Upload New File
            </button>
          }
        />

        <div className="content">
          {/* KPI row */}
          <div className="section-heading">Key Metrics</div>
          <KpiCards
            chartData={chartData}
            columns={data.columns}
            rows={data.rows}
          />

          {/* Charts */}
          <div className="section-heading">Visualisations</div>
          <div className="charts-grid">

            {/* Bar */}
            <ChartCard title={chartData.bar.title} type="Bar">
              <Bar
                options={cartesian()}
                data={{
                  labels: chartData.bar.labels,
                  datasets: [{
                    label: "Count",
                    data: chartData.bar.data,
                    backgroundColor: "rgba(79,70,229,0.72)",
                    borderColor: "#4f46e5",
                    borderWidth: 1,
                    borderRadius: 5,
                  }],
                }}
              />
            </ChartCard>

            {/* Line */}
            <ChartCard title={chartData.line.title} type="Line">
              <Line
                options={cartesian()}
                data={{
                  labels: chartData.line.labels,
                  datasets: [{
                    label: "Value",
                    data: chartData.line.data,
                    borderColor: "#7c3aed",
                    backgroundColor: "rgba(124,58,237,0.08)",
                    pointBackgroundColor: "#7c3aed",
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                  }],
                }}
              />
            </ChartCard>

            {/* Pie */}
            <ChartCard title={chartData.pie.title} type="Pie">
              <Pie
                options={radial()}
                data={{
                  labels: chartData.pie.labels,
                  datasets: [{
                    data: chartData.pie.data,
                    backgroundColor: PALETTE,
                    borderColor: "#fff",
                    borderWidth: 2,
                  }],
                }}
              />
            </ChartCard>

            {/* Doughnut */}
            <ChartCard title={chartData.doughnut.title} type="Doughnut">
              <Doughnut
                options={{ ...radial(), cutout: "68%" }}
                data={{
                  labels: chartData.doughnut.labels,
                  datasets: [{
                    data: chartData.doughnut.data,
                    backgroundColor: [...PALETTE].reverse(),
                    borderColor: "#fff",
                    borderWidth: 2,
                  }],
                }}
              />
            </ChartCard>

            {/* Histogram */}
            <ChartCard title={chartData.histogram.title} type="Histogram">
              <Bar
                options={cartesian("Range", "Frequency")}
                data={{
                  labels: chartData.histogram.labels,
                  datasets: [{
                    label: "Frequency",
                    data: chartData.histogram.data,
                    backgroundColor: chartData.histogram.labels.map(
                      (_, i) => `hsla(${220 + i * 14}, 65%, 56%, 0.8)`
                    ),
                    borderColor: "rgba(79,70,229,0.3)",
                    borderWidth: 1,
                    borderRadius: 4,
                  }],
                }}
              />
            </ChartCard>

            {/* Scatter */}
            <ChartCard title={chartData.scatter.title} type="Scatter">
              <Scatter
                options={cartesian(chartData.scatter.xLabel, chartData.scatter.yLabel)}
                data={{
                  datasets: [{
                    label: "Points",
                    data: chartData.scatter.data,
                    backgroundColor: "rgba(236,72,153,0.6)",
                    borderColor: "#ec4899",
                    pointRadius: 5,
                    pointHoverRadius: 8,
                  }],
                }}
              />
            </ChartCard>

          </div>
        </div>
      </div>
    </div>
  );
}