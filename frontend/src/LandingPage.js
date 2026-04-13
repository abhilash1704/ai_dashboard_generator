import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── UI Components ── */

const PreviewCard = ({ title, children, className = "" }) => (
  <div className={`lp-preview-card animate-fade ${className}`}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>{title}</span>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e2e8f0' }}></div>
    </div>
    {children}
  </div>
);

const FeatureCard = ({ icon, title, desc, className = "" }) => (
  <div className={`lp-feature-card animate-fade ${className}`}>
    <div className="lp-feature-icon">{icon}</div>
    <h3 className="lp-feature-title">{title}</h3>
    <p className="lp-feature-desc">{desc}</p>
  </div>
);

/* ── Main Page ── */

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="lp-root">
      {/* ── Navbar ── */}
      <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="/" className="lp-nav-logo">
          <div className="lp-nav-logo-icon">📊</div>
          <span>InsightAI</span>
        </a>
        <div className="lp-nav-links">
          <a href="#product" className="lp-nav-link">Product</a>
          <a href="#features" className="lp-nav-link">Features</a>
          <a href="#demo" className="lp-nav-link">Demo</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="lp-nav-link">GitHub</a>
          <button className="lp-btn lp-btn-primary" onClick={() => navigate("/upload")}>
            Upload Dataset
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="lp-hero">
        <div className="lp-hero-content animate-fade">
          <h1 className="lp-hero-wording">
            Upload a CSV. Get a clean, interactive dashboard in seconds.
          </h1>
          <p className="lp-hero-subline">
            InsightAI automatically cleans your data, identifies patterns, and builds
            professional-grade visualizations. No complex setup, no manual cleaning.
          </p>
          <div className="lp-hero-actions">
            <button className="lp-btn lp-btn-primary" onClick={() => navigate("/upload")}>
              Upload Dataset
            </button>
            <button className="lp-btn lp-btn-secondary" onClick={() => navigate("/upload")}>
              Try Sample Data
            </button>
          </div>
          <span className="lp-microcopy">
            No signup needed • Takes less than 10 seconds
          </span>
        </div>

        {/* ── Product Preview ── */}
        <div className="lp-preview" id="product">
          <div className="lp-preview-header">
            <div className="lp-preview-dots">
              <div style={{ background: '#ff5f57' }}></div>
              <div style={{ background: '#febc2e' }}></div>
              <div style={{ background: '#28c840' }}></div>
            </div>
          </div>
          <div className="lp-preview-body">
            <div className="lp-preview-main">
              <div className="lp-preview-chart-row">
                <PreviewCard title="Sales Distribution">
                  <div className="chart-bar">
                    {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                      <div key={i} className="chart-bar-el" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </PreviewCard>
                <PreviewCard title="User Growth">
                  <div className="chart-line"></div>
                </PreviewCard>
              </div>
              <PreviewCard title="Correlation Matrix">
                <div className="chart-heatmap">
                  {[...Array(25)].map((_, i) => (
                    <div 
                      key={i} 
                      className="heatmap-cell" 
                      style={{ background: `rgba(37, 99, 235, ${Math.random()})` }}
                    ></div>
                  ))}
                </div>
              </PreviewCard>
            </div>
            <div className="lp-preview-side">
              <PreviewCard title="Summary Stats" className="height-full">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'Total Rows', val: '12,482' },
                    { label: 'Avg Revenue', val: '$420.50' },
                    { label: 'Missing Data', val: '0.2%' },
                    { label: 'Cleaning Time', val: '1.2s' }
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.label}</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{s.val}</div>
                    </div>
                  ))}
                </div>
              </PreviewCard>
            </div>
          </div>
        </div>
      </header>

      {/* ── Social Proof ── */}
      <section className="lp-social">
        <h2 className="lp-social-heading">Used by students and analysts at top teams</h2>
        <div className="lp-social-stats">
          <div className="lp-social-stat">
            <span className="lp-social-number">10,000+</span>
            <span className="lp-social-label">Datasets analyzed</span>
          </div>
          <div className="lp-social-stat">
            <span className="lp-social-number">100k+</span>
            <span className="lp-social-label">Charts generated</span>
          </div>
          <div className="lp-social-stat">
            <span className="lp-social-number">4.9/5</span>
            <span className="lp-social-label">User rating</span>
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="lp-how" id="demo">
        <h2 className="lp-section-title">See what you get</h2>
        <div className="lp-how-grid">
          <div className="lp-how-step">
            <div className="lp-how-num">1</div>
            <h3 className="lp-how-title">Upload CSV</h3>
            <p className="lp-how-desc">
              Drag and drop any CSV file. We handle formatting and schema detection automatically.
            </p>
          </div>
          <div className="lp-how-step">
            <div className="lp-how-num">2</div>
            <h3 className="lp-how-title">AI Cleaning</h3>
            <p className="lp-how-desc">
              Our AI detects missing values, outliers, and duplicates, cleaning your data in milliseconds.
            </p>
          </div>
          <div className="lp-how-step">
            <div className="lp-how-num">3</div>
            <h3 className="lp-how-title">Explore Dashboard</h3>
            <p className="lp-how-desc">
              Interact with auto-generated charts, heatmaps, and statistical summaries immediately.
            </p>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp-features" id="features">
        <h2 className="lp-section-title">Designed for clarity</h2>
        <div className="lp-features-grid">
          <FeatureCard 
            icon="🧹"
            title="Automatic Data Cleaning"
            desc="No more manual Python scripts. We handle nulls, duplicates, and type mismatches for you."
            className="col-6"
          />
          <FeatureCard 
            icon="📈"
            title="Smart Visualizations"
            desc="We choose the right chart for your data. Histogram, box plots, or heatmaps—insightfully selected."
            className="col-6"
          />
          <FeatureCard 
            icon="🔬"
            title="Statistical Insights"
            desc="Deep dive into correlation, variance, and skewness without needing a PhD in statistics."
            className="col-4"
          />
          <FeatureCard 
            icon="🧪"
            title="Hypothesis Testing"
            desc="Automatically detect significant trends and anomalies within your dataset."
            className="col-8"
          />
        </div>
      </section>

      <section style={{ padding: '8rem 2rem', textAlign: 'center', background: 'white' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>Ready to clean your data?</h2>
        <button className="lp-btn lp-btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.25rem' }} onClick={() => navigate("/upload")}>
          Upload Dataset Now
        </button>
        <div style={{ marginTop: '1.5rem', color: '#94a3b8' }}>Join 5,000+ happy users today</div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer-content">
          <div className="lp-footer-info">
            <div className="lp-footer-logo">📊 InsightAI</div>
            <p className="lp-footer-desc">
              The fastest way to turn raw CSV data into meaningful insights. Built for analysts, students, and human beings.
            </p>
          </div>
          <div className="lp-footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#product">Preview</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#demo">How it works</a></li>
            </ul>
          </div>
          <div className="lp-footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="https://github.com">GitHub</a></li>
              <li><a href="mailto:hello@insightai.com">Contact</a></li>
              <li><a href="/privacy">Privacy</a></li>
            </ul>
          </div>
          <div className="lp-footer-col">
            <h4>Social</h4>
            <ul>
              <li><a href="https://twitter.com">Twitter</a></li>
              <li><a href="https://linkedin.com">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '4rem auto 0', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '0.875rem' }}>
          © 2026 InsightAI. All rights reserved. Handcrafted by Humans.
        </div>
      </footer>
    </div>
  );
}
