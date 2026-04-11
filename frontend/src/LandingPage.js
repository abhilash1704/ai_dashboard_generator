import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── tiny hook: count up animation ── */
function useCountUp(target, duration = 1800, trigger) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, trigger]);
  return val;
}

/* ── animated stat card ── */
function StatChip({ value, suffix = "", label, delay = 0, trigger }) {
  const count = useCountUp(value, 1600, trigger);
  return (
    <div className="lp-stat-chip" style={{ animationDelay: `${delay}ms` }}>
      <span className="lp-stat-number">
        {count}
        {suffix}
      </span>
      <span className="lp-stat-label">{label}</span>
    </div>
  );
}

/* ── feature card ── */
function FeatureCard({ icon, title, desc, accent, delay }) {
  return (
    <div className="lp-feature-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="lp-feature-icon" style={{ background: accent }}>
        {icon}
      </div>
      <h3 className="lp-feature-title">{title}</h3>
      <p className="lp-feature-desc">{desc}</p>
    </div>
  );
}

/* ── step row ── */
function StepItem({ num, title, desc, delay }) {
  return (
    <div className="lp-step" style={{ animationDelay: `${delay}ms` }}>
      <div className="lp-step-num">{num}</div>
      <div>
        <div className="lp-step-title">{title}</div>
        <div className="lp-step-desc">{desc}</div>
      </div>
    </div>
  );
}

/* ============================================================
   LANDING PAGE
   ============================================================ */
export default function LandingPage() {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  /* intersect observer for stats count-up */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="lp-root">
      {/* ── NAV ── */}
      <nav className="lp-nav">
        <div className="lp-nav-logo">
          <div className="lp-nav-logo-icon">📈</div>
          <span>DataFlow <b>AI</b></span>
        </div>
        <div className="lp-nav-links">
          <a href="#features" className="lp-nav-link">Features</a>
          <a href="#how" className="lp-nav-link">How it works</a>
          <button id="lp-cta-nav" className="lp-btn-primary" onClick={() => navigate("/upload")}>
            upload.csv
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          {/* left copy */}
          <div className="lp-hero-copy">
            <div className="lp-badge">✦ Intelligent Data Automation</div>
            <h1 className="lp-headline">
              Turn raw data into<br />
              <span className="lp-headline-accent">instant dashboards</span>
            </h1>
            <p className="lp-subline">
              Upload any CSV. Our AI cleans, analyses, and auto-generates
              beautiful interactive dashboards with AI-written summaries — in seconds.
            </p>
            <div className="lp-hero-actions">
              <button
                id="lp-cta-primary"
                className="lp-btn-primary lp-btn-lg"
                onClick={() => navigate("/upload")}
              >
                Get Started — it's free
              </button>
              <a href="#features" className="lp-btn-ghost">
                See how it works ↓
              </a>
            </div>

            {/* mini trust bar */}
            <div className="lp-trust">
              <span>✔ No signup needed</span>
              <span>✔ Instant results</span>
              <span>✔ AI-powered insights</span>
            </div>
          </div>

          {/* right hero image */}
          <div className="lp-hero-visual">
            <div className="lp-hero-img-wrap">
              <img
                src="/hero-automation.png"
                alt="AI-powered data automation and dashboard creation"
                className="lp-hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="lp-stats-band" ref={statsRef}>
        <StatChip value={98}  suffix="%" label="Cleaning Accuracy" delay={0}   trigger={statsVisible} />
        <div className="lp-stats-div" />
        <StatChip value={3}   suffix="s"  label="Avg Dashboard Time" delay={120} trigger={statsVisible} />
        <div className="lp-stats-div" />
        <StatChip value={12}  suffix="+"  label="Chart Types Generated" delay={240} trigger={statsVisible} />
        <div className="lp-stats-div" />
        <StatChip value={100} suffix="%" label="No-Code Required" delay={360} trigger={statsVisible} />
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-features-section" id="features">
        <div className="lp-section-label">Core Features</div>
        <h2 className="lp-section-title">Everything automated for you</h2>
        <p className="lp-section-sub">
          From messy spreadsheets to polished analytics — without writing a single line of code.
        </p>

        <div className="lp-features-grid">
          <FeatureCard
            icon="🧹"
            title="Smart Data Cleaning"
            desc="Automatically detects and fixes nulls, duplicates, type mismatches, and format inconsistencies in your dataset before analysis begins."
            accent="rgba(15,23,42,0.04)"
            delay={0}
          />
          <FeatureCard
            icon="⚡"
            title="Auto Dashboard Creation"
            desc="AI selects the most meaningful chart types for each column — bar, pie, scatter, trend lines — and assembles them into a beautiful, interactive dashboard."
            accent="rgba(15,23,42,0.04)"
            delay={80}
          />
          <FeatureCard
            icon="📝"
            title="AI-Generated Summaries"
            desc="Get plain-language insights written by AI for every chart and dataset overview, so you understand your data at a glance — no analyst required."
            accent="rgba(15,23,42,0.04)"
            delay={160}
          />
          <FeatureCard
            icon="🔁"
            title="Seamless Integration"
            desc="Export dashboards as HTML, share via link, or integrate our API into your existing data pipelines. Your workflow, your way."
            accent="rgba(15,23,42,0.04)"
            delay={240}
          />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lp-how-section" id="how">
        <div className="lp-how-inner">
          <div className="lp-how-copy">
            <div className="lp-section-label">How It Works</div>
            <h2 className="lp-section-title lp-section-title--left">Three steps to clarity</h2>
            <p className="lp-section-sub lp-section-sub--left">
              No setup. No learning curve. Just data → insight.
            </p>

            <div className="lp-steps">
              <StepItem
                num="01"
                title="Upload your CSV"
                desc="Drag & drop or browse for any CSV file. We'll instantly parse the schema and detect data types."
                delay={0}
              />
              <StepItem
                num="02"
                title="AI cleans & analyses"
                desc="Our engine automatically normalises, fills gaps, removes duplicates, and selects the best visualisations."
                delay={80}
              />
              <StepItem
                num="03"
                title="Explore your dashboard"
                desc="Browse interactive charts, read AI summaries, and export the full dashboard with one click."
                delay={160}
              />
            </div>

            <button
              id="lp-cta-how"
              className="lp-btn-primary lp-btn-lg"
              onClick={() => navigate("/upload")}
              style={{ marginTop: 36 }}
            >
              Try it now →
            </button>
          </div>

          {/* decorative upload automation mockup */}
          <div className="lp-how-visual">
            <div className="lp-upload-mockup">
              <div className="lp-um-icon">📥</div>
              <div className="lp-um-title">Upload your dataset</div>
              <div className="lp-um-desc">Drag & drop your CSV file here</div>
              
              <div className="lp-um-file">📄 dataset_q3.csv</div>
              
              <div className="lp-um-progress">
                <div className="lp-um-progress-bar" />
              </div>
              <div className="lp-um-status">✨ Automation complete. Dashboard ready.</div>

              <div className="lp-um-dashboard-preview">
                <div className="lp-mockup-bar">
                  <span className="lp-mockup-dot lp-mockup-dot--r" />
                  <span className="lp-mockup-dot lp-mockup-dot--y" />
                  <span className="lp-mockup-dot lp-mockup-dot--g" />
                  <span className="lp-mockup-title">dashboard.html</span>
                </div>
                <div className="lp-mockup-body">
                  <div className="lp-mockup-kpi-row">
                    {["Revenue", "Users", "Churn"].map((k) => (
                      <div key={k} className="lp-mockup-kpi">
                        <div className="lp-mockup-kpi-val" />
                        <div className="lp-mockup-kpi-lbl">{k}</div>
                      </div>
                    ))}
                  </div>
                  <div className="lp-mockup-charts">
                    <div className="lp-mockup-chart lp-mockup-chart--bar">
                      {[60, 85, 45, 90, 55, 75].map((h, i) => (
                        <div key={i} className="lp-mockup-bar-col" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <div className="lp-mockup-chart lp-mockup-chart--pie">
                      <div className="lp-mockup-pie" />
                    </div>
                  </div>
                  <div className="lp-mockup-summary">
                    <div className="lp-mockup-summary-line" style={{ width: "90%" }} />
                    <div className="lp-mockup-summary-line" style={{ width: "75%" }} />
                    <div className="lp-mockup-summary-line" style={{ width: "60%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="lp-cta-band">
        <h2 className="lp-cta-title">Ready to automate your data workflow?</h2>
        <p className="lp-cta-sub">Drop in your CSV and get a full dashboard in under 10 seconds.</p>
        <button
          id="lp-cta-final"
          className="lp-btn-primary lp-btn-lg lp-btn-white"
          onClick={() => navigate("/upload")}
        >
          Upload your first dataset →
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-logo">
          <div className="lp-nav-logo-icon" style={{ width: 22, height: 22, fontSize: 11 }}>📈</div>
          <span>DataFlow AI</span>
        </div>
        <p className="lp-footer-copy">© 2026 DataFlow AI · AI-powered data automation</p>
      </footer>
    </div>
  );
}
