import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  {
    id: "differentiation",
    category: "Strategic Alignment",
    question: "How core is this ML capability to your product's differentiation?",
    context: "Consider whether this capability is what customers choose you for, or if it's table-stakes infrastructure.",
    options: [
      { label: "It IS our core product value", value: 5, icon: "◆" },
      { label: "Strong differentiator but not the only one", value: 4, icon: "◇" },
      { label: "Important but not a differentiator", value: 2, icon: "○" },
      { label: "Commodity / table-stakes", value: 1, icon: "·" },
    ],
    weights: { build: [5, 4, 1, 0], buy: [0, 1, 4, 5], partner: [1, 3, 3, 2] },
  },
  {
    id: "talent",
    category: "Team Capability",
    question: "What does your current ML/AI talent situation look like?",
    context: "Be honest — hiring plans don't count. Assess what you have today.",
    options: [
      { label: "Strong in-house ML team with relevant domain expertise", value: 5, icon: "◆" },
      { label: "Some ML talent, gaps in this specific area", value: 3, icon: "◇" },
      { label: "Engineering team could learn, but no ML specialists", value: 2, icon: "○" },
      { label: "No ML capability and hard to hire for it", value: 1, icon: "·" },
    ],
    weights: { build: [5, 3, 1, 0], buy: [1, 2, 4, 5], partner: [2, 4, 3, 2] },
  },
  {
    id: "timeline",
    category: "Time-to-Market",
    question: "How urgently do you need this capability in production?",
    context: "Think about competitive pressure, customer commitments, and market windows.",
    options: [
      { label: "No rush — we can invest 6-12+ months", value: 1, icon: "◆" },
      { label: "Moderate — 3-6 months would be ideal", value: 3, icon: "◇" },
      { label: "Urgent — need something in < 3 months", value: 4, icon: "○" },
      { label: "Critical — customers are waiting now", value: 5, icon: "·" },
    ],
    weights: { build: [5, 2, 0, 0], buy: [1, 3, 5, 5], partner: [2, 4, 3, 2] },
  },
  {
    id: "data",
    category: "Data Readiness",
    question: "How much proprietary training data do you have for this capability?",
    context: "Proprietary data is your moat. If you have unique datasets, building lets you exploit that advantage.",
    options: [
      { label: "Large, labeled, proprietary dataset — a real moat", value: 5, icon: "◆" },
      { label: "Decent data but needs significant curation", value: 3, icon: "◇" },
      { label: "Some data, but not enough to train from scratch", value: 2, icon: "○" },
      { label: "Little to no proprietary data", value: 1, icon: "·" },
    ],
    weights: { build: [5, 3, 1, 0], buy: [0, 2, 3, 5], partner: [2, 3, 4, 3] },
  },
  {
    id: "customization",
    category: "Product Requirements",
    question: "How much customization does this capability require?",
    context: "Off-the-shelf solutions work for generic problems. Unique workflows need custom solutions.",
    options: [
      { label: "Highly custom — our use case is unique", value: 5, icon: "◆" },
      { label: "Moderate customization on top of standard approaches", value: 3, icon: "◇" },
      { label: "Mostly standard with minor tweaks", value: 2, icon: "○" },
      { label: "Completely standard / well-solved problem", value: 1, icon: "·" },
    ],
    weights: { build: [5, 3, 1, 0], buy: [0, 2, 4, 5], partner: [2, 4, 3, 1] },
  },
  {
    id: "vendor_landscape",
    category: "Market Maturity",
    question: "How mature is the vendor landscape for this capability?",
    context: "A crowded vendor market means commoditization. A sparse one means you may need to build anyway.",
    options: [
      { label: "No viable vendors exist for our specific need", value: 1, icon: "◆" },
      { label: "A few emerging vendors, none proven at scale", value: 2, icon: "◇" },
      { label: "Several credible vendors with track records", value: 4, icon: "○" },
      { label: "Mature market — multiple proven solutions", value: 5, icon: "·" },
    ],
    weights: { build: [5, 3, 1, 0], buy: [0, 2, 4, 5], partner: [2, 4, 3, 2] },
  },
  {
    id: "budget",
    category: "Financial Context",
    question: "What's your budget reality for this initiative?",
    context: "Building requires sustained investment. Buying has predictable costs. Partnering splits the economics.",
    options: [
      { label: "Well-funded — can invest in long-term R&D", value: 5, icon: "◆" },
      { label: "Moderate budget — need to be strategic", value: 3, icon: "◇" },
      { label: "Lean — need to maximize ROI per dollar", value: 2, icon: "○" },
      { label: "Very constrained — minimal upfront investment", value: 1, icon: "·" },
    ],
    weights: { build: [5, 2, 0, 0], buy: [1, 3, 4, 4], partner: [2, 4, 5, 3] },
  },
  {
    id: "control",
    category: "Risk & Control",
    question: "How important is full control over this capability's roadmap?",
    context: "Vendors pivot. Partners have their own priorities. Only building gives you full control.",
    options: [
      { label: "Critical — we need to own the roadmap entirely", value: 5, icon: "◆" },
      { label: "Important — but some dependency is acceptable", value: 3, icon: "◇" },
      { label: "Nice to have — we can adapt to vendor changes", value: 2, icon: "○" },
      { label: "Not a concern — we just need it to work", value: 1, icon: "·" },
    ],
    weights: { build: [5, 3, 1, 0], buy: [0, 2, 4, 5], partner: [2, 4, 3, 2] },
  },
];

const RECOMMENDATIONS = {
  build: {
    title: "Build In-House",
    tagline: "Own your moat",
    color: "#2dd4bf",
    darkColor: "#0d9488",
    icon: "⚒",
    summary: "The signals point toward building this capability internally. You have the combination of strategic importance, team capability, and data assets that make in-house development the highest-ROI path.",
    pros: [
      "Full control over roadmap and iteration speed",
      "Proprietary IP becomes a compounding competitive advantage",
      "Deep integration with your product architecture",
      "No vendor lock-in or dependency risk",
    ],
    cons: [
      "Highest upfront investment in time and talent",
      "Opportunity cost — your ML team can't work on other things",
      "You own all the maintenance and infrastructure burden",
      "Risk of underestimating complexity",
    ],
    actions: [
      "Staff a dedicated ML pod with clear ownership",
      "Define v1 scope ruthlessly — ship a thin slice first",
      "Set a 90-day checkpoint: if you're not seeing signal, reconsider",
      "Build evaluation frameworks early — you'll need them to know if it's working",
    ],
  },
  buy: {
    title: "Buy a Vendor Solution",
    tagline: "Speed over ownership",
    color: "#a78bfa",
    darkColor: "#7c3aed",
    icon: "🛒",
    summary: "The analysis suggests buying is your best path. The capability you need is well-served by existing vendors, and your resources are better spent on your core differentiation rather than rebuilding solved problems.",
    pros: [
      "Fastest time to production — often days or weeks",
      "Predictable costs with clear vendor SLAs",
      "Benefit from vendor's R&D and continuous improvement",
      "Free your engineering team to focus on core product",
    ],
    cons: [
      "Vendor lock-in and switching costs over time",
      "Limited customization and control",
      "Pricing may not scale favorably",
      "Dependency on vendor's roadmap priorities",
    ],
    actions: [
      "Run a structured vendor evaluation with weighted criteria",
      "Negotiate contract terms that protect optionality (data portability, exit clauses)",
      "Build an abstraction layer so you can swap vendors if needed",
      "Define clear integration success metrics before committing",
    ],
  },
  partner: {
    title: "Strategic Partnership",
    tagline: "Shared risk, combined strengths",
    color: "#fb923c",
    darkColor: "#ea580c",
    icon: "🤝",
    summary: "A partnership model fits your situation best. You need meaningful customization and some control, but don't have all the pieces to build alone. The right partner can accelerate delivery while sharing risk and cost.",
    pros: [
      "Faster than building, more flexible than buying",
      "Shared investment reduces your financial risk",
      "Access to specialized expertise you don't have",
      "Can evolve into a build or buy over time",
    ],
    cons: [
      "Alignment and communication overhead",
      "IP ownership can be complex to negotiate",
      "Partner's priorities may shift over time",
      "Quality depends heavily on partner selection",
    ],
    actions: [
      "Define IP ownership and data rights explicitly upfront",
      "Structure the partnership with clear milestones and exit ramps",
      "Assign an internal PM to own the partnership — don't delegate this",
      "Plan the transition: will you eventually bring this in-house or not?",
    ],
  },
};

function ScoreBar({ label, score, maxScore, color, delay }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const pct = (score / maxScore) * 100;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#94a3b8", letterSpacing: "0.02em" }}>{label}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: color, fontWeight: 600 }}>
          {score.toFixed(1)}
        </span>
      </div>
      <div style={{ height: 6, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: animated ? `${pct}%` : "0%",
            background: `linear-gradient(90deg, ${color}44, ${color})`,
            borderRadius: 3,
            transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  );
}

function RadarChart({ scores, winner }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 85;
  const categories = QUESTIONS.map((q) => q.category);
  const n = categories.length;
  const colors = { build: "#2dd4bf", buy: "#a78bfa", partner: "#fb923c" };

  function getPoint(i, r) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  function polygon(values, max) {
    return values.map((v, i) => getPoint(i, (v / max) * maxR).join(",")).join(" ");
  }

  const maxVal = Math.max(...Object.values(scores).flatMap((s) => Object.values(s)));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          points={Array.from({ length: n }, (_, i) => getPoint(i, maxR * f).join(",")).join(" ")}
          fill="none"
          stroke="#334155"
          strokeWidth={0.5}
        />
      ))}
      {categories.map((_, i) => {
        const [x, y] = getPoint(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#334155" strokeWidth={0.5} />;
      })}
      {Object.entries(scores).map(([key, vals]) => {
        const values = QUESTIONS.map((q) => vals[q.id] || 0);
        return (
          <polygon
            key={key}
            points={polygon(values, maxVal || 1)}
            fill={colors[key] + "18"}
            stroke={colors[key]}
            strokeWidth={key === winner ? 2 : 1}
            opacity={key === winner ? 1 : 0.4}
          />
        );
      })}
      {categories.map((cat, i) => {
        const [x, y] = getPoint(i, maxR + 18);
        const short = cat.split(" ")[0];
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize={8} fontFamily="'DM Sans', sans-serif">
            {short}
          </text>
        );
      })}
    </svg>
  );
}

export default function BuildBuyPartner() {
  const [step, setStep] = useState(-1); // -1 = intro
  const [answers, setAnswers] = useState({});
  const [hoveredOption, setHoveredOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef(null);

  const progress = Object.keys(answers).length / QUESTIONS.length;

  function handleAnswer(questionId, optionIndex) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setTimeout(() => {
        setShowResults(true);
        if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }, 400);
    }
  }

  function calculateScores() {
    const totals = { build: 0, buy: 0, partner: 0 };
    const perQuestion = { build: {}, buy: {}, partner: {} };

    QUESTIONS.forEach((q) => {
      const idx = answers[q.id];
      if (idx !== undefined) {
        ["build", "buy", "partner"].forEach((strategy) => {
          const s = q.weights[strategy][idx];
          totals[strategy] += s;
          perQuestion[strategy][q.id] = s;
        });
      }
    });
    return { totals, perQuestion };
  }

  function getWinner(totals) {
    return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
  }

  const { totals, perQuestion } = calculateScores();
  const winner = getWinner(totals);
  const maxTotal = Math.max(...Object.values(totals));
  const rec = RECOMMENDATIONS[winner];
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  const allColors = { build: "#2dd4bf", buy: "#a78bfa", partner: "#fb923c" };
  const allLabels = { build: "Build", buy: "Buy", partner: "Partner" };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: "#0b1120",
        color: "#e2e8f0",
        fontFamily: "'DM Sans', sans-serif",
        overflowY: "auto",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: "32px 32px 0", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: showResults ? rec.color : "#2dd4bf",
            boxShadow: `0 0 12px ${showResults ? rec.color : "#2dd4bf"}66`,
          }} />
          <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#64748b", fontWeight: 600 }}>
            Product Decision Framework
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: 800,
          margin: "8px 0 6px",
          lineHeight: 1.1,
          background: "linear-gradient(135deg, #e2e8f0, #94a3b8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Build vs. Buy vs. Partner
        </h1>
        <p style={{ color: "#64748b", fontSize: 15, margin: 0, lineHeight: 1.5 }}>
          A structured assessment for AI product leaders making ML capability decisions.
        </p>

        {/* Progress */}
        {step >= 0 && !showResults && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
                {Object.keys(answers).length} / {QUESTIONS.length}
              </span>
              <span style={{ fontSize: 11, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
                {Math.round(progress * 100)}%
              </span>
            </div>
            <div style={{ height: 2, background: "#1e293b", borderRadius: 1 }}>
              <div style={{
                height: "100%",
                width: `${progress * 100}%`,
                background: "linear-gradient(90deg, #2dd4bf, #a78bfa)",
                borderRadius: 1,
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Intro */}
      {step === -1 && (
        <div style={{ padding: "48px 32px", maxWidth: 800, margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, #131c31, #1a2540)",
            border: "1px solid #1e3050",
            borderRadius: 16,
            padding: "40px 36px",
          }}>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#94a3b8", margin: "0 0 24px" }}>
              This framework evaluates <strong style={{ color: "#e2e8f0" }}>8 strategic dimensions</strong> to determine whether you should build an ML capability in-house, buy a vendor solution, or pursue a strategic partnership.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
              {Object.entries(RECOMMENDATIONS).map(([key, r]) => (
                <div key={key} style={{
                  background: "#0b1120",
                  border: `1px solid ${r.color}33`,
                  borderRadius: 10,
                  padding: "16px 18px",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{r.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: r.color, marginBottom: 2 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{r.tagline}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(0)}
              style={{
                background: "linear-gradient(135deg, #2dd4bf, #14b8a6)",
                color: "#0b1120",
                border: "none",
                borderRadius: 10,
                padding: "14px 32px",
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
                letterSpacing: "0.02em",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 20px #2dd4bf33",
              }}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 28px #2dd4bf55"; }}
              onMouseLeave={(e) => { e.target.style.transform = ""; e.target.style.boxShadow = "0 4px 20px #2dd4bf33"; }}
            >
              Start Assessment →
            </button>
            <p style={{ fontSize: 12, color: "#475569", marginTop: 14 }}>Takes about 3 minutes · 8 questions</p>
          </div>
        </div>
      )}

      {/* Questions */}
      {step >= 0 && !showResults && (
        <div style={{ padding: "36px 32px 64px", maxWidth: 800, margin: "0 auto" }}>
          {(() => {
            const q = QUESTIONS[step];
            return (
              <div key={q.id} style={{ animation: "fadeIn 0.4s ease" }}>
                <div style={{ marginBottom: 6 }}>
                  <span style={{
                    fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "#2dd4bf", fontWeight: 600,
                  }}>
                    {q.category}
                  </span>
                </div>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(20px, 4vw, 26px)",
                  fontWeight: 700,
                  margin: "0 0 8px",
                  lineHeight: 1.3,
                }}>
                  {q.question}
                </h2>
                <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 28px", lineHeight: 1.5 }}>
                  {q.context}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {q.options.map((opt, i) => {
                    const selected = answers[q.id] === i;
                    const hovered = hoveredOption === `${q.id}-${i}`;
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(q.id, i)}
                        onMouseEnter={() => setHoveredOption(`${q.id}-${i}`)}
                        onMouseLeave={() => setHoveredOption(null)}
                        style={{
                          background: selected ? "#1a2e44" : hovered ? "#131c31" : "#0f172a",
                          border: selected ? "1px solid #2dd4bf66" : "1px solid #1e293b",
                          borderRadius: 10,
                          padding: "16px 20px",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          transform: hovered && !selected ? "translateX(4px)" : "",
                        }}
                      >
                        <span style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: selected ? "#2dd4bf22" : "#1e293b",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, color: selected ? "#2dd4bf" : "#475569",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 600,
                          flexShrink: 0,
                          border: selected ? "1px solid #2dd4bf44" : "1px solid transparent",
                        }}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span style={{
                          fontSize: 14, color: selected ? "#e2e8f0" : "#94a3b8",
                          fontWeight: selected ? 600 : 400, lineHeight: 1.4,
                        }}>
                          {opt.label}
                        </span>
                        {selected && (
                          <span style={{ marginLeft: "auto", color: "#2dd4bf", fontSize: 16 }}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Nav */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
                  <button
                    onClick={() => step > 0 && setStep(step - 1)}
                    disabled={step === 0}
                    style={{
                      background: "none", border: "1px solid #1e293b", borderRadius: 8,
                      padding: "10px 18px", color: step > 0 ? "#94a3b8" : "#334155",
                      fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                      cursor: step > 0 ? "pointer" : "default",
                    }}
                  >
                    ← Back
                  </button>
                  {answers[q.id] !== undefined && step === QUESTIONS.length - 1 && (
                    <button
                      onClick={() => { setShowResults(true); if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: "smooth" }); }}
                      style={{
                        background: "linear-gradient(135deg, #2dd4bf, #14b8a6)",
                        color: "#0b1120", border: "none", borderRadius: 8,
                        padding: "10px 24px", fontSize: 13, fontWeight: 700,
                        fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                      }}
                    >
                      See Results →
                    </button>
                  )}
                  {answers[q.id] !== undefined && step < QUESTIONS.length - 1 && (
                    <button
                      onClick={() => setStep(step + 1)}
                      style={{
                        background: "#1e293b", color: "#e2e8f0", border: "none",
                        borderRadius: 8, padding: "10px 18px", fontSize: 13,
                        fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                      }}
                    >
                      Next →
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div style={{ padding: "36px 32px 64px", maxWidth: 800, margin: "0 auto", animation: "fadeIn 0.6s ease" }}>
          {/* Winner Card */}
          <div style={{
            background: `linear-gradient(135deg, ${rec.color}08, ${rec.color}15)`,
            border: `1px solid ${rec.color}33`,
            borderRadius: 16,
            padding: "36px 32px",
            marginBottom: 28,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#64748b", fontWeight: 600, marginBottom: 8 }}>
                  Recommendation
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <span style={{ fontSize: 32 }}>{rec.icon}</span>
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 32, fontWeight: 800, margin: 0, color: rec.color,
                  }}>
                    {rec.title}
                  </h2>
                </div>
                <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.7, margin: "12px 0 0" }}>
                  {rec.summary}
                </p>
              </div>
              <div style={{ flexShrink: 0 }}>
                <RadarChart scores={perQuestion} winner={winner} />
              </div>
            </div>
          </div>

          {/* Scores */}
          <div style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 14,
            padding: "28px 28px",
            marginBottom: 28,
          }}>
            <h3 style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b", margin: "0 0 20px", fontWeight: 600 }}>
              Composite Scores
            </h3>
            {sorted.map(([key, score], i) => (
              <ScoreBar
                key={key}
                label={`${RECOMMENDATIONS[key].icon}  ${allLabels[key]}`}
                score={score}
                maxScore={maxTotal}
                color={allColors[key]}
                delay={i * 200}
              />
            ))}
            <div style={{ fontSize: 12, color: "#475569", marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>
              Confidence gap: {((sorted[0][1] - sorted[1][1]) / sorted[0][1] * 100).toFixed(0)}% separation between top two options
            </div>
          </div>

          {/* Pros / Cons / Actions */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: "24px" }}>
              <h3 style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2dd4bf", margin: "0 0 16px", fontWeight: 600 }}>
                ✦ Advantages
              </h3>
              {rec.pros.map((p, i) => (
                <div key={i} style={{ fontSize: 13, color: "#94a3b8", marginBottom: 10, paddingLeft: 14, borderLeft: "2px solid #1e293b", lineHeight: 1.5 }}>
                  {p}
                </div>
              ))}
            </div>
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: "24px" }}>
              <h3 style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f87171", margin: "0 0 16px", fontWeight: 600 }}>
                ⚑ Watch Out For
              </h3>
              {rec.cons.map((c, i) => (
                <div key={i} style={{ fontSize: 13, color: "#94a3b8", marginBottom: 10, paddingLeft: 14, borderLeft: "2px solid #1e293b", lineHeight: 1.5 }}>
                  {c}
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div style={{
            background: "linear-gradient(135deg, #131c31, #1a2540)",
            border: "1px solid #1e3050",
            borderRadius: 14,
            padding: "28px",
            marginBottom: 28,
          }}>
            <h3 style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fb923c", margin: "0 0 18px", fontWeight: 600 }}>
              → Recommended Next Steps
            </h3>
            {rec.actions.map((a, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start",
              }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 6, background: "#1e293b",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600, flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.5 }}>{a}</span>
              </div>
            ))}
          </div>

          {/* Dimension Breakdown */}
          <div style={{
            background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: "28px", marginBottom: 28,
          }}>
            <h3 style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b", margin: "0 0 18px", fontWeight: 600 }}>
              Dimension Breakdown
            </h3>
            <div style={{ display: "grid", gap: 10 }}>
              {QUESTIONS.map((q) => {
                const idx = answers[q.id];
                const scores = { build: q.weights.build[idx], buy: q.weights.buy[idx], partner: q.weights.partner[idx] };
                const dimWinner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
                return (
                  <div key={q.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", background: "#0b1120", borderRadius: 8, gap: 12, flexWrap: "wrap",
                  }}>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{q.category}</div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                        You answered: {q.options[idx].label}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["build", "buy", "partner"].map((s) => (
                        <span key={s} style={{
                          padding: "4px 10px", borderRadius: 6, fontSize: 11,
                          fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                          background: dimWinner === s ? allColors[s] + "22" : "#1e293b",
                          color: dimWinner === s ? allColors[s] : "#475569",
                          border: dimWinner === s ? `1px solid ${allColors[s]}44` : "1px solid transparent",
                        }}>
                          {allLabels[s][0]}:{scores[s]}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Restart */}
          <div style={{ textAlign: "center", paddingTop: 8 }}>
            <button
              onClick={() => { setAnswers({}); setStep(-1); setShowResults(false); }}
              style={{
                background: "none", border: "1px solid #1e293b", borderRadius: 10,
                padding: "12px 28px", color: "#64748b", fontSize: 13,
                fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = "#334155"; e.target.style.color = "#94a3b8"; }}
              onMouseLeave={(e) => { e.target.style.borderColor = "#1e293b"; e.target.style.color = "#64748b"; }}
            >
              ↻ Retake Assessment
            </button>
            <p style={{ fontSize: 11, color: "#334155", marginTop: 12 }}>
              Built by a Product Leader · Framework for AI capability decisions
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        button:focus { outline: 2px solid #2dd4bf44; outline-offset: 2px; }
      `}</style>
    </div>
  );
}