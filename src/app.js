import { useState } from "react";

const COLORS = {
  cream: "#F5F0E8",
  darkInk: "#1A1A2E",
  gold: "#C9A84C",
  goldLight: "#E8D5A3",
  rust: "#8B3A2A",
  sage: "#4A6741",
  parchment: "#EDE4D0",
  ink: "#2D2D44",
};

const NAV_ITEMS = ["Home", "How to Craft Prompts", "Reference Library", "Prompt Library"];

const REFERENCE_ITEMS = [
  {
    icon: "⚖️",
    title: "Jurisdiction & Court Level",
    desc: "Always specify the jurisdiction (e.g., Singapore High Court, US Federal) and court level to anchor the AI's legal context.",
    example: '"Under Singapore law, High Court jurisdiction..."',
  },
  {
    icon: "📜",
    title: "Relevant Legislation",
    desc: "Name specific Acts, sections, or regulations. Vague references lead to vague answers.",
    example: '"Referring to s.19 of the Employment Act 1968..."',
  },
  {
    icon: "🔍",
    title: "Case Citations",
    desc: "Include key case names and citations to ground the AI in established precedent.",
    example: '"In light of Spandeck Engineering v DSTA [2007]..."',
  },
  {
    icon: "🎯",
    title: "Define Your Role",
    desc: "Tell the AI who you are (solicitor, in-house counsel, student) so it calibrates the depth and tone.",
    example: '"Acting as litigation counsel for the claimant..."',
  },
  {
    icon: "📋",
    title: "Desired Output Format",
    desc: "Specify whether you want a memo, bullet points, a draft clause, or a risk analysis.",
    example: '"Provide a structured legal memo with headings..."',
  },
  {
    icon: "⚠️",
    title: "Scope & Limitations",
    desc: "Set boundaries — what should the AI focus on and what should it exclude.",
    example: '"Focus only on tortious liability, exclude contract claims."',
  },
];

const SAMPLE_PROMPTS = [
  {
    id: 1,
    title: "Negligence Analysis — Singapore Tort Law",
    category: "Tort Law",
    author: "L. Tan",
    likes: 47,
    tags: ["Negligence", "Singapore", "Duty of Care"],
    prompt:
      "You are a Singapore litigation solicitor. Under Singapore tort law, applying the Spandeck two-stage test from Spandeck Engineering v DSTA [2007] 4 SLR(R) 100, analyse whether a duty of care exists between [PARTY A] and [PARTY B] given the following facts: [INSERT FACTS]. Provide a structured legal memo with (1) applicable legal test, (2) application to facts, and (3) conclusion on likelihood of duty being established.",
  },
  {
    id: 2,
    title: "Contract Termination — Repudiatory Breach",
    category: "Contract Law",
    author: "R. Mehta",
    likes: 31,
    tags: ["Contract", "Breach", "Termination"],
    prompt:
      "Acting as in-house counsel, advise on whether [PARTY]'s conduct constitutes a repudiatory breach of contract under English law. Reference the test in Photo Production Ltd v Securicor Transport Ltd [1980] AC 827. The contract clause at issue is: [INSERT CLAUSE]. Facts: [INSERT FACTS]. Output a concise risk memo identifying: (1) breach type, (2) innocent party's options, (3) risks of affirmation vs acceptance.",
  },
  {
    id: 3,
    title: "Employment Dismissal — Procedural Fairness",
    category: "Employment Law",
    author: "A. Okonkwo",
    likes: 58,
    tags: ["Employment", "Dismissal", "HR"],
    prompt:
      "Under Singapore's Employment Act and the Industrial Relations Act, assess whether the dismissal of [EMPLOYEE ROLE] was procedurally fair. The employer's internal disciplinary policy states: [INSERT POLICY]. The sequence of events was: [INSERT TIMELINE]. Provide a plain-language summary suitable for a non-legal HR audience, followed by a legal risk rating (Low/Medium/High) with justification.",
  },
];

const TIP_STEPS = [
  { num: "01", title: "Start with context", body: "Who are you? What jurisdiction? What role does the AI play?" },
  { num: "02", title: "Anchor with references", body: "Name the Act, section, or case. Specificity drives accuracy." },
  { num: "03", title: "Define the facts", body: "Use placeholders like [INSERT FACTS] for reusable prompt templates." },
  { num: "04", title: "Specify the output", body: "Memo? Risk rating? Draft clause? Tell the AI exactly what you need." },
];

export default function App() {
  const [activeNav, setActiveNav] = useState("Home");
  const [likedPrompts, setLikedPrompts] = useState({});
  const [promptLikes, setPromptLikes] = useState(
    Object.fromEntries(SAMPLE_PROMPTS.map((p) => [p.id, p.likes]))
  );
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitForm, setSubmitForm] = useState({ title: "", category: "", prompt: "", author: "" });
  const [submitted, setSubmitted] = useState(false);
  const [filterCat, setFilterCat] = useState("All");

  const handleLike = (id) => {
    setLikedPrompts((prev) => {
      const isLiked = prev[id];
      setPromptLikes((pl) => ({ ...pl, [id]: pl[id] + (isLiked ? -1 : 1) }));
      return { ...prev, [id]: !isLiked };
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setShowSubmitModal(false);
      setSubmitted(false);
      setSubmitForm({ title: "", category: "", prompt: "", author: "" });
    }, 2500);
  };

  const categories = ["All", ...new Set(SAMPLE_PROMPTS.map((p) => p.category))];
  const filtered = filterCat === "All" ? SAMPLE_PROMPTS : SAMPLE_PROMPTS.filter((p) => p.category === filterCat);

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: COLORS.cream, minHeight: "100vh", color: COLORS.darkInk }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Serif+4:wght@300;400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.cream}; }
        .nav-link { cursor: pointer; padding: 8px 16px; font-family: 'Source Serif 4', serif; font-size: 14px; letter-spacing: 0.05em; border-bottom: 2px solid transparent; transition: all 0.2s; }
        .nav-link:hover { color: ${COLORS.gold}; }
        .nav-link.active { color: ${COLORS.gold}; border-bottom: 2px solid ${COLORS.gold}; }
        .ref-card { background: white; border: 1px solid ${COLORS.goldLight}; border-radius: 4px; padding: 24px; transition: transform 0.2s, box-shadow 0.2s; }
        .ref-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(26,26,46,0.1); }
        .prompt-card { background: white; border-left: 4px solid ${COLORS.gold}; border-radius: 0 4px 4px 0; padding: 24px; margin-bottom: 20px; transition: box-shadow 0.2s; }
        .prompt-card:hover { box-shadow: 4px 4px 20px rgba(26,26,46,0.08); }
        .tag { display: inline-block; background: ${COLORS.parchment}; color: ${COLORS.ink}; font-size: 11px; padding: 3px 10px; border-radius: 20px; margin: 3px; font-family: 'Source Serif 4', serif; letter-spacing: 0.03em; }
        .btn-gold { background: ${COLORS.gold}; color: white; border: none; padding: 10px 24px; font-family: 'Source Serif 4', serif; font-size: 14px; letter-spacing: 0.08em; cursor: pointer; border-radius: 3px; transition: background 0.2s; }
        .btn-gold:hover { background: #b8923e; }
        .btn-outline { background: transparent; color: ${COLORS.gold}; border: 1.5px solid ${COLORS.gold}; padding: 8px 20px; font-family: 'Source Serif 4', serif; font-size: 13px; cursor: pointer; border-radius: 3px; transition: all 0.2s; }
        .btn-outline:hover { background: ${COLORS.gold}; color: white; }
        .like-btn { background: none; border: 1.5px solid #ddd; border-radius: 20px; padding: 5px 14px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 6px; transition: all 0.2s; font-family: 'Source Serif 4', serif; }
        .like-btn.liked { border-color: ${COLORS.rust}; color: ${COLORS.rust}; background: #fff5f3; }
        .like-btn:hover { border-color: ${COLORS.rust}; color: ${COLORS.rust}; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(26,26,46,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal { background: ${COLORS.cream}; border: 1px solid ${COLORS.goldLight}; border-radius: 6px; padding: 40px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; }
        input, textarea, select { width: 100%; padding: 10px 14px; border: 1px solid ${COLORS.goldLight}; border-radius: 3px; font-family: 'Source Serif 4', serif; font-size: 14px; background: white; color: ${COLORS.darkInk}; margin-top: 6px; }
        textarea { resize: vertical; min-height: 140px; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: ${COLORS.gold}; }
        .divider { border: none; border-top: 1px solid ${COLORS.goldLight}; margin: 40px 0; }
        .hero-badge { display: inline-block; border: 1px solid ${COLORS.gold}; color: ${COLORS.gold}; font-size: 11px; letter-spacing: 0.15em; padding: 4px 14px; margin-bottom: 20px; font-family: 'Source Serif 4', serif; }
        .step-num { font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 900; color: ${COLORS.goldLight}; line-height: 1; }
        .prompt-text-box { background: ${COLORS.parchment}; border-left: 3px solid ${COLORS.gold}; padding: 16px 20px; border-radius: 0 4px 4px 0; font-size: 13px; line-height: 1.7; color: ${COLORS.ink}; font-family: 'Source Serif 4', serif; white-space: pre-wrap; margin-top: 12px; }
        .section-title { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: ${COLORS.darkInk}; margin-bottom: 8px; }
        .section-sub { font-family: 'Source Serif 4', serif; color: #666; font-size: 15px; line-height: 1.6; }
        .filter-btn { background: none; border: 1px solid ${COLORS.goldLight}; padding: 6px 16px; font-family: 'Source Serif 4', serif; font-size: 13px; cursor: pointer; border-radius: 20px; transition: all 0.2s; color: ${COLORS.ink}; }
        .filter-btn.active { background: ${COLORS.gold}; border-color: ${COLORS.gold}; color: white; }
        .filter-btn:hover { border-color: ${COLORS.gold}; color: ${COLORS.gold}; }
      `}</style>

      {/* Header */}
      <header style={{ background: COLORS.darkInk, color: COLORS.cream, padding: "0 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22, color: COLORS.gold }}>⚖</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, letterSpacing: "0.05em" }}>LexPrompt</span>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            {NAV_ITEMS.map((item) => (
              <span
                key={item}
                className={`nav-link ${activeNav === item ? "active" : ""}`}
                style={{ color: activeNav === item ? COLORS.gold : COLORS.goldLight }}
                onClick={() => setActiveNav(item)}
              >
                {item}
              </span>
            ))}
          </nav>
        </div>
      </header>

      {/* Gold rule */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${COLORS.rust}, ${COLORS.gold}, ${COLORS.sage})` }} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 80px" }}>

        {/* ── HOME ── */}
        {activeNav === "Home" && (
          <>
            {/* Hero */}
            <section style={{ padding: "80px 0 60px", maxWidth: 700 }}>
              <div className="hero-badge">LEGAL AI RESEARCH TOOLKIT</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.1, color: COLORS.darkInk, marginBottom: 24 }}>
                Better Prompts.<br />
                <span style={{ color: COLORS.gold, fontStyle: "italic" }}>Better Legal Research.</span>
              </h1>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 18, lineHeight: 1.8, color: "#444", marginBottom: 36 }}>
                A community-driven guide to crafting precise, well-referenced prompts for AI-assisted legal research. Learn the craft, explore real examples, and contribute your own.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="btn-gold" onClick={() => setActiveNav("How to Craft Prompts")}>Learn the Method →</button>
                <button className="btn-outline" onClick={() => setActiveNav("Prompt Library")}>Browse Prompt Library</button>
              </div>
            </section>

            <hr className="divider" />

            {/* 3 pillars */}
            <section>
              <h2 className="section-title">What's Inside</h2>
              <p className="section-sub" style={{ marginBottom: 36 }}>Everything you need to get better answers from AI in your legal workflow.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                {[
                  { icon: "✍️", title: "Prompt Crafting Guide", desc: "Step-by-step guidance on structuring legal prompts that produce reliable, jurisdiction-aware outputs.", nav: "How to Craft Prompts" },
                  { icon: "📚", title: "Reference Library", desc: "Learn which legal references to include — statutes, cases, roles — and why they dramatically improve AI responses.", nav: "Reference Library" },
                  { icon: "🗂️", title: "Community Prompt Library", desc: "Browse, like, and contribute prompts vetted by the team. A living resource that grows with the community.", nav: "Prompt Library" },
                ].map((card) => (
                  <div key={card.title} className="ref-card" style={{ cursor: "pointer" }} onClick={() => setActiveNav(card.nav)}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>{card.icon}</div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{card.title}</h3>
                    <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "#555", lineHeight: 1.7 }}>{card.desc}</p>
                    <p style={{ color: COLORS.gold, fontSize: 13, marginTop: 12, fontFamily: "'Source Serif 4', serif" }}>Explore →</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ── HOW TO CRAFT PROMPTS ── */}
        {activeNav === "How to Craft Prompts" && (
          <>
            <section style={{ padding: "60px 0 40px" }}>
              <h2 className="section-title">How to Craft a Legal Prompt</h2>
              <p className="section-sub" style={{ maxWidth: 620, marginBottom: 48 }}>
                A well-crafted legal prompt follows a clear anatomy. Follow these four steps every time to get outputs that are accurate, jurisdiction-specific, and usable.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, marginBottom: 56 }}>
                {TIP_STEPS.map((s) => (
                  <div key={s.num} style={{ background: "white", border: `1px solid ${COLORS.goldLight}`, borderRadius: 4, padding: 28 }}>
                    <div className="step-num">{s.num}</div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, margin: "8px 0 8px", color: COLORS.darkInk }}>{s.title}</h3>
                    <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "#555", lineHeight: 1.7 }}>{s.body}</p>
                  </div>
                ))}
              </div>

              {/* Anatomy example */}
              <div style={{ background: COLORS.darkInk, borderRadius: 6, padding: "36px 40px", color: COLORS.cream }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, letterSpacing: "0.12em", color: COLORS.gold, marginBottom: 16 }}>ANATOMY OF A STRONG LEGAL PROMPT</p>
                {[
                  { label: "Role", color: "#7FC8A9", text: "You are a Singapore litigation solicitor." },
                  { label: "Jurisdiction + Reference", color: COLORS.gold, text: "Under Singapore tort law, applying the Spandeck two-stage test [2007] 4 SLR(R) 100," },
                  { label: "Facts", color: "#A9C4E8", text: "analyse whether a duty of care exists given: [INSERT FACTS]." },
                  { label: "Output format", color: "#F4A87E", text: "Provide a structured memo: (1) legal test, (2) application, (3) conclusion." },
                ].map((part) => (
                  <div key={part.label} style={{ display: "flex", gap: 16, marginBottom: 12, alignItems: "flex-start" }}>
                    <span style={{ background: part.color, color: COLORS.darkInk, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 3, whiteSpace: "nowrap", marginTop: 2, fontFamily: "'Source Serif 4', serif", letterSpacing: "0.06em" }}>{part.label.toUpperCase()}</span>
                    <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, lineHeight: 1.7, color: "#ddd" }}>{part.text}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ── REFERENCE LIBRARY ── */}
        {activeNav === "Reference Library" && (
          <>
            <section style={{ padding: "60px 0 40px" }}>
              <h2 className="section-title">Reference Library</h2>
              <p className="section-sub" style={{ maxWidth: 620, marginBottom: 48 }}>
                Including the right references in your prompt is the single biggest factor in output quality. Here's what to include and why.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
                {REFERENCE_ITEMS.map((ref) => (
                  <div key={ref.title} className="ref-card">
                    <div style={{ fontSize: 28, marginBottom: 12 }}>{ref.icon}</div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{ref.title}</h3>
                    <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: 12 }}>{ref.desc}</p>
                    <div style={{ background: COLORS.parchment, borderLeft: `3px solid ${COLORS.gold}`, padding: "8px 14px", fontSize: 12, fontFamily: "'Source Serif 4', serif", color: COLORS.ink, fontStyle: "italic", borderRadius: "0 3px 3px 0" }}>
                      e.g. {ref.example}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ── PROMPT LIBRARY ── */}
        {activeNav === "Prompt Library" && (
          <>
            <section style={{ padding: "60px 0 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h2 className="section-title">Prompt Library</h2>
                <p className="section-sub">Community-contributed prompts, reviewed and approved by our team.</p>
              </div>
              <button className="btn-gold" onClick={() => setShowSubmitModal(true)}>+ Submit a Prompt</button>
            </section>

            {/* Filter */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
              {categories.map((cat) => (
                <button key={cat} className={`filter-btn ${filterCat === cat ? "active" : ""}`} onClick={() => setFilterCat(cat)}>{cat}</button>
              ))}
            </div>

            {/* Prompts */}
            {filtered.map((p) => (
              <div key={p.id} className="prompt-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 11, fontFamily: "'Source Serif 4', serif", letterSpacing: "0.1em", color: COLORS.gold, textTransform: "uppercase" }}>{p.category}</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, margin: "4px 0 8px" }}>{p.title}</h3>
                    <div>{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                    <button
                      className={`like-btn ${likedPrompts[p.id] ? "liked" : ""}`}
                      onClick={() => handleLike(p.id)}
                    >
                      {likedPrompts[p.id] ? "♥" : "♡"} {promptLikes[p.id]}
                    </button>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <button className="btn-outline" style={{ fontSize: 12, padding: "5px 14px" }} onClick={() => setExpandedPrompt(expandedPrompt === p.id ? null : p.id)}>
                    {expandedPrompt === p.id ? "Hide Prompt ▲" : "View Prompt ▼"}
                  </button>
                  {expandedPrompt === p.id && (
                    <div className="prompt-text-box">{p.prompt}</div>
                  )}
                </div>
                <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 12, color: "#999", marginTop: 12 }}>Contributed by {p.author}</p>
              </div>
            ))}
          </>
        )}
      </main>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowSubmitModal(false)}>
          <div className="modal">
            {submitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 8 }}>Thank you!</h3>
                <p style={{ fontFamily: "'Source Serif 4', serif", color: "#666" }}>Your prompt has been submitted for review. We'll publish it if approved.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>Submit a Prompt</h3>
                <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "#666", marginBottom: 24 }}>Submissions are reviewed by the team before being published.</p>
                {[
                  { label: "Prompt Title", key: "title", type: "input", placeholder: "e.g. Negligence Analysis — Singapore Tort Law" },
                  { label: "Category", key: "category", type: "input", placeholder: "e.g. Tort Law, Contract Law, Employment Law" },
                  { label: "Your Name (optional)", key: "author", type: "input", placeholder: "e.g. J. Smith" },
                  { label: "Your Prompt", key: "prompt", type: "textarea", placeholder: "Paste your full prompt here. Use [PLACEHOLDERS] for variable parts..." },
                ].map((field) => (
                  <div key={field.key} style={{ marginBottom: 18 }}>
                    <label style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, fontWeight: 600, color: COLORS.ink }}>{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        placeholder={field.placeholder}
                        value={submitForm[field.key]}
                        onChange={(e) => setSubmitForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={submitForm[field.key]}
                        onChange={(e) => setSubmitForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                  <button className="btn-outline" onClick={() => setShowSubmitModal(false)}>Cancel</button>
                  <button className="btn-gold" onClick={handleSubmit} disabled={!submitForm.title || !submitForm.prompt}>Submit for Review</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
