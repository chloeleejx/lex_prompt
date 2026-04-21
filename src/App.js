import { useState } from "react";
import ReactMarkdown from 'react-markdown';

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

const NAV_ITEMS = ["Home", "AI Tutor", "Structuring a Good Prompt", "Reference Library", "Prompt Library"];

const REFERENCE_ITEMS = [
  {
    icon: "📜",
    title: "Relevant Legislation",
    desc: "Name specific Acts, sections, or regulations. If you are unsure of the specific Act, always tell the AI to use the most recent statutes on Singapore Statutes Online.",
    example: '"Referring to the Women’s Charter 1961..."',
  },
  {
    icon: "🔍",
    title: "Case Citations",
    desc: "Include key case names and citations to ground the AI in established precedent.",
    example: '"In light of Spandeck Engineering (S) Pte Ltd v Defence Science & Technology Agency [2007] SGCA 37..."',
  },
  {
    icon: "📜",
    title: "Practice Directions",
    desc: "text",
    example: '"text"',
  },
];

const LEGISLATION_DB = {
  "Probate & Succession": {
    icon: "🏛️",
    desc: "Laws governing the administration of deceased estates, wills, and inheritance in Singapore.",
    items: [
      { name: "Probate and Administration Act 1934", abbr: "PAA", desc: "The primary statute governing the grant of probate and letters of administration in Singapore. It sets out who may apply, the procedure for obtaining a grant, and the duties of executors and administrators in managing and distributing an estate." },
      { name: "Intestate Succession Act 1967", abbr: "ISA", desc: "Governs the distribution of property of an intestate (person who dies without a valid will) among surviving family members. It sets out the statutory shares for spouses, children, and other relatives, and provides rules on how property passes when there is no will." },
      { name: "Wills Act 1838", abbr: "WA", desc: "Sets out the formal requirements for a valid will in Singapore, including the requirement for the testator to be of sound mind and at least 21 years old, the will to be in writing, signed by the testator, and witnessed by two independent witnesses present at the same time." },
      { name: "Mental Capacity Act 2008", abbr: "MCA", desc: "Relevant to probate disputes involving testamentary capacity. Provides a legal framework for assessing whether a person has the mental capacity to make decisions, including executing a will. Establishes the Court of Protection's jurisdiction over persons lacking capacity." },
      { name: "Family Justice (Probate and Other Matters) Rules 2024", abbr: "FJR", desc: "Procedural rules governing probate proceedings in the Family Justice Courts. Sets out timelines, forms, and procedures for filing probate applications, caveats, citations, and contentious probate actions in Singapore." },
    ],
  },
  "Contract Law": {
    icon: "📝",
    desc: "Legislation governing formation, performance, breach, and remedies in contractual relationships.",
    items: [
      { name: "Contracts (Rights of Third Parties) Act 2001 (Cap. 53B)", abbr: "CRTPA", desc: "Allows a third party who is not a party to a contract to enforce a contractual term if the contract expressly provides for it or if the term purports to confer a benefit on the third party. Modifies the traditional privity of contract rule." },
      { name: "Misrepresentation Act 1967 (Cap. 390)", abbr: "MA", desc: "Governs remedies available to a contracting party who was induced to enter a contract by a misrepresentation. Provides for rescission and damages for both fraudulent and negligent misrepresentation, and limits the effectiveness of exclusion clauses in respect of misrepresentation." },
      { name: "Unfair Contract Terms Act 1977 (Cap. 396)", abbr: "UCTA", desc: "Controls the use of exemption clauses in contracts, particularly in standard form business contracts. A party cannot exclude liability for negligence causing death or personal injury, and other exclusion clauses are subject to a reasonableness test." },
      { name: "Sale of Goods Act 1979 (Cap. 393)", abbr: "SOGA", desc: "Governs contracts for the sale of goods in Singapore. Implies conditions as to title, correspondence with description, satisfactory quality, fitness for purpose, and correspondence with sample. Sets out rules on passing of property and risk." },
      { name: "Electronic Transactions Act 2010 (Cap. 88)", abbr: "ETA", desc: "Provides legal certainty for electronic contracts and signatures. Electronic records and signatures are given the same legal effect as paper documents and handwritten signatures, subject to certain exceptions." },
    ],
  },
  "Employment Law": {
    icon: "👔",
    desc: "Statutes regulating the employer-employee relationship, workplace rights, and dispute resolution.",
    items: [
      { name: "Employment Act 1968 (Cap. 91)", abbr: "EA", desc: "The principal employment statute in Singapore. Covers core employment terms including salary, working hours, rest days, leave entitlements, and termination. Applies to all employees except managers and executives earning above S$4,500/month (for Part IV provisions)." },
      { name: "Employment of Foreign Manpower Act 1990 (Cap. 91A)", abbr: "EFMA", desc: "Regulates the employment of foreign workers in Singapore. Governs the issuance of work passes (including Work Permits, S Passes, and Employment Passes), obligations of employers, and penalties for employing foreigners without valid passes." },
      { name: "Industrial Relations Act 1960 (Cap. 136)", abbr: "IRA", desc: "Governs collective bargaining between trade unions and employers. Sets out the process for recognition of trade unions, collective agreements, and the resolution of trade disputes through conciliation and arbitration by the Industrial Arbitration Court." },
      { name: "Work Injury Compensation Act 2019 (Cap. 354)", abbr: "WICA", desc: "Provides a no-fault compensation scheme for employees who suffer injuries or contract occupational diseases arising from work. Sets out the procedure for claims, compensation amounts, and the roles of insurers and the Commissioner for Labour." },
      { name: "Workplace Safety and Health Act 2006 (Cap. 354A)", abbr: "WSHA", desc: "Imposes duties on employers, occupiers, and suppliers to ensure the safety, health, and welfare of persons at workplaces. Establishes a framework for risk management, incident reporting, and regulatory enforcement by the Ministry of Manpower." },
    ],
  },
  "Tort Law": {
    icon: "⚖️",
    desc: "Common law and statutory principles governing civil wrongs, negligence, and liability.",
    items: [
      { name: "Civil Law Act 1909 (Cap. 43)", abbr: "CLA", desc: "Supplements common law tort principles in Singapore. Notably includes provisions on contributory negligence (apportionment of liability), damages for dependency claims following fatal accidents, and the survival of causes of action after death." },
      { name: "Limitation Act 1959 (Cap. 163)", abbr: "LA", desc: "Sets out the time limits within which civil claims, including tort actions, must be commenced. Generally, claims in tort must be brought within 6 years from the date the cause of action accrued, with special rules for personal injury, latent damage, and fraud." },
      { name: "Protection from Harassment Act 2014 (Cap. 256A)", abbr: "POHA", desc: "Creates civil and criminal remedies against harassment, stalking, and cyber-bullying. Provides for Protection Orders and Expedited Protection Orders, and allows victims to claim damages in the Protection from Harassment Court." },
      { name: "Defamation Act 1957 (Cap. 75)", abbr: "DA", desc: "Governs the law of defamation in Singapore. Sets out defences including justification (truth), fair comment, and qualified privilege. Also addresses defamation in broadcast media and provides for offers of amends." },
    ],
  },
  "Property Law": {
    icon: "🏠",
    desc: "Laws governing ownership, transfer, and interests in real and personal property.",
    items: [
      { name: "Land Titles Act 1993 (Cap. 157)", abbr: "LTA", desc: "Establishes the Torrens system of land registration in Singapore. Registered title is indefeasible, meaning that a registered owner's title is conclusive and cannot generally be challenged except in cases of fraud. Governs dealings such as transfers, mortgages, and easements." },
      { name: "Conveyancing and Law of Property Act 1886 (Cap. 61)", abbr: "CLPA", desc: "Governs the sale and conveyancing of property in Singapore, including implied covenants in conveyances, mortgages, leases, and conditions of sale. Still applicable to unregistered land and certain dealings not covered by the Land Titles Act." },
      { name: "Housing and Development Act 1959 (Cap. 129)", abbr: "HDA", desc: "Governs the purchase, sale, and eligibility requirements for HDB (public housing) flats in Singapore. Sets out restrictions on who may own HDB flats, minimum occupation periods, and the resale levy, as well as the powers and functions of the HDB." },
      { name: "Residential Property Act 1976 (Cap. 274)", abbr: "RPA", desc: "Restricts the purchase of landed residential properties by foreigners in Singapore. Foreign persons generally require approval from the Singapore Land Authority before acquiring restricted residential property. Sets out exemptions and penalties for contravention." },
      { name: "Strata Titles Act 1967 (Cap. 158)", abbr: "STA", desc: "Governs the subdivision of buildings into strata lots (e.g. condominiums and commercial strata units) and the management of common property. Establishes Management Corporations (MCSTs) and sets out their powers and duties under the Building Maintenance and Strata Management Act." },
    ],
  },
  "Family Law": {
    icon: "👨‍👩‍👧",
    desc: "Legislation governing marriage, divorce, maintenance, and child custody matters.",
    items: [
      { name: "Women's Charter 1961 (Cap. 353)", abbr: "WC", desc: "The principal statute governing civil marriages, divorce, and ancillary matters in Singapore. Sets out the grounds for divorce (irretrievable breakdown), financial relief including division of matrimonial assets and maintenance for spouses and children, and custody arrangements." },
      { name: "Guardianship of Infants Act 1934 (Cap. 122)", abbr: "GIA", desc: "Governs applications for guardianship and custody of children. The welfare of the child is the paramount consideration. Courts may appoint guardians and make orders regarding care, control, and access for children of unmarried parents or where no divorce proceedings are involved." },
      { name: "Maintenance of Parents Act 1995 (Cap. 167B)", abbr: "MPA", desc: "Allows elderly parents who are unable to maintain themselves adequately to apply to the Tribunal for the Maintenance of Parents for a maintenance order against their children. Promotes filial responsibility and provides an alternative to court litigation." },
      { name: "Family Justice Act 2014 (Cap. 27A)", abbr: "FJA", desc: "Establishes the Family Justice Courts in Singapore (comprising the Family Division of the High Court and the Family Courts). Sets out the jurisdiction of these courts over family-related matters including divorce, probate, adoption, and personal protection orders." },
      { name: "Administration of Muslim Law Act 1966 (Cap. 3)", abbr: "AMLA", desc: "Governs matters relating to Muslim personal and family law in Singapore, including Muslim marriages, divorces (administered by the Syariah Court), inheritance under Islamic law (faraid), and the administration of Muslim trusts (wakaf) and mosques." },
    ],
  },
  "Criminal Law": {
    icon: "🔒",
    desc: "Statutes defining offences, criminal procedure, and sentencing in Singapore.",
    items: [
      { name: "Penal Code 1871 (Cap. 224)", abbr: "PC", desc: "The principal criminal statute in Singapore, defining a wide range of offences including offences against the person (assault, hurt, homicide), property offences (theft, cheating, criminal breach of trust), and public order offences. Sets out the elements of each offence and applicable punishments." },
      { name: "Criminal Procedure Code 2010 (Cap. 68)", abbr: "CPC", desc: "Governs the procedure for criminal investigations, arrests, bail, trials, and appeals in Singapore. Sets out the powers of the police and prosecutors, rules of evidence in criminal proceedings, and the rights of accused persons at each stage of the criminal process." },
      { name: "Evidence Act 1893 (Cap. 97)", abbr: "EA", desc: "Governs the admissibility and weight of evidence in both civil and criminal proceedings in Singapore. Sets out rules on relevancy, oral evidence, documentary evidence, burden of proof, and privileges. Courts are bound by the Act in determining what evidence may be relied upon." },
      { name: "Misuse of Drugs Act 1973 (Cap. 185)", abbr: "MDA", desc: "Governs the possession, trafficking, manufacture, and import/export of controlled drugs in Singapore. Prescribes severe mandatory minimum sentences including the death penalty for drug trafficking above specified quantities. Includes presumptions of trafficking from quantities possessed." },
    ],
  },
};

const SAMPLE_PROMPTS = [
  {
    id: 1,
    title: "Employment Dismissal — Procedural Fairness",
    category: "Employment Law",
    author: "A. Okonkwo",
    likes: 58,
    tags: ["Employment", "Dismissal", "HR"],
    prompt:
      "Under Singapore's Employment Act and the Industrial Relations Act, assess whether the dismissal of [EMPLOYEE ROLE] was procedurally fair. The employer's internal disciplinary policy states: [INSERT POLICY]. The sequence of events was: [INSERT TIMELINE]. Provide a plain-language summary suitable for a non-legal HR audience, followed by a legal risk rating (Low/Medium/High) with justification.",
  },
];

const CTFR = [
  {
    letter: "C",
    label: "Context",
    color: "#4A6741",
    tagline: "Tell your story.",
    desc: "It is a good idea to include the following:",
    bullets: ["Who are you? Who is involved?", "What happened?", "When did it happen?", "Where did it happen?"],
    example: "I am starting an action in Singapore Court to challenge the validity of my father's Will against the Executor named in the Will. My father passed away recently leaving a Will dated 1 January 2026.\n\nAt the time of execution, my father was suffering from dementia and hence lacked the necessary testamentary capacity. The Executor maintained the Will is valid and that my father was of sound mind when executing the Will.",
    warning: {
      title: "MANDATORY REDACTION",
      body: "Before inputting data into AI, you MUST remove personal data and sensitive information including: NRIC / Passport Numbers, Residential Addresses, Bank Account & Financial Details.",
    },
    tip: "Anonymisation Tip: Use placeholders like '[Deceased Name]' or '[Property Address]' to keep the context without risking your data privacy.",
  },
  {
    letter: "T",
    label: "Task",
    color: "#8B3A2A",
    tagline: "Specify what you want from the AI.",
    desc: "Use action verbs such as 'Explain', 'Summarise', 'Draft' for better results.",
    bullets: [],
    example: "Draft the court documents to be filed with the Singapore Court and highlight any missing information that I need to provide.",
    warning: null,
    tip: null,
  },
  {
    letter: "F",
    label: "Format",
    color: "#C9A84C",
    tagline: "Set your expectations.",
    desc: "How should the AI respond to best meet your needs? A well-defined format ensures the output is immediately useful.",
    bullets: [],
    example: "Please use language suitable for addressing the Court.",
    formatGrid: [
      { items: ["Language & Tone: Specify 'Plain English' for better understanding of the laws", "Visual Aids: Request 'a table' or 'a step-by-step timeline'", "Word Limit: Avoid long, rambling AI responses"] },
      { items: ["Level of Depth: Ask for a 'high-level overview' for initial research or a 'comprehensive clause-by-clause analysis'", "Target Audience: Tell the AI to write 'for the Court'"] },
    ],
    warning: null,
    tip: null,
  },
  {
    letter: "R",
    label: "Reference",
    color: "#1A1A2E",
    tagline: "Refer to trusted primary sources.",
    desc: "This improves the accuracy and reliability of the AI output. However, you MUST verify it against trusted primary sources before relying on or including the information in your court document.",
    bullets: [],
    example: "Base your drafts on the forms uploaded. [Upload relevant court forms]",
    warning: null,
    tip: "Please refer to 'Reference Library' to learn more about trusted primary sources.",
  },
];

export default function App() {
  const [activeNav, setActiveNav] = useState("Home");
  const [refView, setRefView] = useState("overview"); // "overview" | "legislation"
  const [refSearch, setRefSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState(null);
  const [legSearch, setLegSearch] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ area: "", reason: "", email: "" });
  const [requestSubmitted, setRequestSubmitted] = useState(false);
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

  // --- NEW AI CHAT STATE ---
  const [currentSources, setCurrentSources] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "ai", text: "Hello! I am the LexPrompt AI Tutor. How can I help you understand Singapore Probate Law today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // --- NEW AI FETCH FUNCTION ---
  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatHistory((prev) => [...prev, { role: "user", text: userMessage }]);
    setChatInput("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      
      setChatHistory((prev) => [...prev, { role: "ai", text: data.answer || "I'm sorry, I encountered an error." }]);
      setCurrentSources(data.sources || []);
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: "ai", text: "Connection error. Please ensure the backend is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

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
        .prose-chat h1, .prose-chat h2, .prose-chat h3 { font-family: 'Playfair Display', serif; margin-top: 16px; margin-bottom: 8px; color: ${COLORS.darkInk}; font-size: 1.1rem; border-bottom: 1px solid ${COLORS.goldLight}; }
        .prose-chat p { margin-bottom: 12px; }
        .prose-chat ul, .prose-chat ol { padding-left: 20px; margin-bottom: 12px; }
        .prose-chat li { margin-bottom: 6px; }
        .prose-chat strong { color: ${COLORS.rust}; font-weight: 600; }
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
        
        {/* ── NEW AI TUTOR SECTION ── */}
        {activeNav === "AI Tutor" && (
          <section style={{ padding: "60px 0" }}>
            <h2 className="section-title">AI Tutor</h2>
            <p className="section-sub" style={{ marginBottom: 32 }}>
              Ask questions about the Probate and Administration Act. Responses are grounded in the legislation found in our Reference Library.
            </p>

            <div style={{ display: "flex", gap: "24px", height: "650px", alignItems: "stretch" }}>
      
              {/* --- LEFT: CHAT INTERFACE (70%) --- */}
              <div style={{ flex: 7, display: "flex", flexDirection: "column", background: "white", border: `1px solid ${COLORS.goldLight}`, borderRadius: 8, overflow: "hidden" }}>
                <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", background: COLORS.parchment }}>
                  {chatHistory.map((msg, i) => (
                    <div key={i} className="prose-chat" style={{
                      alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                      maxWidth: "85%",
                      padding: "12px 16px",
                      borderRadius: msg.role === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0",
                      background: msg.role === "user" ? COLORS.darkInk : "white",
                      color: msg.role === "user" ? COLORS.cream : COLORS.darkInk,
                      fontSize: "14px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      border: msg.role === "ai" ? `1px solid ${COLORS.goldLight}` : "none"
                    }}>
                      {msg.role === "ai" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                    </div>
                  ))}
                  {isTyping && <div style={{ color: COLORS.gold, fontSize: "12px" }}>LexPrompt is verifying statutes...</div>}
                </div>
                <div style={{ padding: "20px", background: "white", borderTop: `1px solid ${COLORS.goldLight}`, display: "flex", gap: "12px" }}>
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()} placeholder="Ask a question..." style={{marginTop: 0}} />
                  <button className="btn-gold" onClick={handleChatSubmit} disabled={isTyping}>Send</button>
                </div>
              </div>
        
              {/* --- RIGHT: SOURCE SIDEBAR (30%) --- */}
              <div style={{ flex: 3, background: COLORS.cream, border: `1px solid ${COLORS.goldLight}`, borderRadius: 8, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: COLORS.darkInk, borderBottom: `2px solid ${COLORS.gold}`, paddingBottom: "8px" }}>
                  Statutory Sources
                </h3>
                {currentSources.length > 0 ? (
                  currentSources.map((src, i) => (
                    <div key={i} style={{ background: "white", padding: "12px", borderRadius: "4px", marginBottom: "12px", borderLeft: `4px solid ${COLORS.gold}`, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: COLORS.rust, marginBottom: "6px", textTransform: "uppercase" }}>
                        Probate Act • Page {src.page + 1}
                      </p>
                      <p style={{ fontSize: "12px", color: "#555", lineHeight: "1.5", fontStyle: "italic" }}>
                        "{src.content.substring(0, 200)}..."
                      </p>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", color: "#999", marginTop: "40px", fontSize: "13px" }}>
                    <p>No sources cited yet.</p>
                    <p style={{fontSize: "11px", marginTop: "8px"}}>References will appear here after the AI responds.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

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
                <button className="btn-gold" onClick={() => setActiveNav("Structuring a Good Prompt")}>Learn the Method →</button>
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
                  { icon: "✍️", title: "Prompt Crafting Guide", desc: "Step-by-step guidance on structuring legal prompts that produce reliable, jurisdiction-aware outputs.", nav: "Structuring a Good Prompt" },
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

        {/* ── Structuring a Good Prompt ── */}
        {activeNav === "Structuring a Good Prompt" && (
          <>
            <section style={{ padding: "60px 0 16px" }}>
              <h2 className="section-title">Structuring a Good Prompt</h2>
              <p className="section-sub" style={{ maxWidth: 680, marginBottom: 28 }}>
                A prompt is only as good as its structure. Follow the <strong>Context–Task–Format–Reference (CTFR)</strong> framework to craft prompts that get accurate, reliable AI responses.
              </p>
              {/* CTFR pill row */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 48 }}>
                {CTFR.map((c) => (
                  <div key={c.letter} style={{ display: "flex", alignItems: "center", gap: 8, background: c.color, color: "white", borderRadius: 4, padding: "8px 20px" }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900 }}>{c.letter}</span>
                    <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, opacity: 0.9 }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {CTFR.map((c) => (
              <section key={c.letter} style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "stretch", background: "white", border: `1px solid ${COLORS.goldLight}`, borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ background: c.color, color: "white", width: 72, minWidth: 72, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 0" }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, lineHeight: 1 }}>{c.letter}</span>
                    <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: 10, letterSpacing: "0.1em", marginTop: 6, opacity: 0.85 }}>{c.label.toUpperCase()}</span>
                  </div>
                  <div style={{ padding: "28px 32px", flex: 1 }}>
                    <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 16, fontWeight: 600, color: c.color, marginBottom: 6 }}>{c.tagline}</p>
                    <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "#444", lineHeight: 1.7 }}>{c.desc}</p>
                    {c.bullets.length > 0 && (
                      <ul style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "#444", lineHeight: 2, paddingLeft: 20, marginTop: 8 }}>
                        {c.bullets.map((b) => <li key={b}>{b}</li>)}
                      </ul>
                    )}
                    {c.formatGrid && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "14px 0 4px" }}>
                        {c.formatGrid.map((col, ci) => (
                          <ul key={ci} style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: "#444", lineHeight: 1.9, paddingLeft: 18 }}>
                            {col.items.map((item) => <li key={item}>{item}</li>)}
                          </ul>
                        ))}
                      </div>
                    )}
                    <div style={{ marginTop: 16 }}>
                      <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#999", marginBottom: 6 }}>EXAMPLE</p>
                      <div style={{ background: COLORS.parchment, borderLeft: `3px solid ${c.color}`, padding: "12px 16px", borderRadius: "0 4px 4px 0", fontFamily: "'Source Serif 4', serif", fontSize: 14, color: COLORS.ink, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{c.example}</div>
                    </div>
                    {c.warning && (
                      <div style={{ marginTop: 14, background: "#fff5f3", border: "1px solid #f4c5bb", borderRadius: 4, padding: "12px 16px" }}>
                        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 12, fontWeight: 700, color: COLORS.rust, marginBottom: 4 }}>⚠ {c.warning.title}</p>
                        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: "#555", lineHeight: 1.7 }}>{c.warning.body}</p>
                      </div>
                    )}
                    {c.tip && (
                      <div style={{ marginTop: 10, background: "#f0f7f0", border: "1px solid #b8d4b8", borderRadius: 4, padding: "10px 16px" }}>
                        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: COLORS.sage, lineHeight: 1.7 }}>✅ {c.tip}</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ))}

            {/* Combined example */}
            <section style={{ marginBottom: 60 }}>
              <div style={{ background: COLORS.darkInk, borderRadius: 6, padding: "36px 40px", color: COLORS.cream }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, letterSpacing: "0.12em", color: COLORS.gold, marginBottom: 20 }}>EXAMPLE</p>
                {[
                  { label: "Context", color: "#7FC8A9", text: "I am seeking a divorce." },
                  { label: "Task", color: "#F4A87E", text: "Explain the options available to me in Singpaore, including alternative dispute resolution." },
                  { label: "Format", color: COLORS.goldLight, text: "Please use plain English" },
                  { label: "Reference", color: "#A9C4E8", text: "Use information from the official government sources like Singapore Courts. Include links to the sources of the output." },
                ].map((part) => (
                  <div key={part.label} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
                    <span style={{ 
                      background: part.color, 
                      color: COLORS.darkInk, 
                      fontSize: 10, 
                      fontWeight: 700, 
                      padding: "3px 0",          // Vertical padding only
                      borderRadius: 3, 
                      width: "85px",             // FIXED WIDTH for alignment
                      textAlign: "center",       // Center the text within the tag
                      display: "inline-block",   // Necessary for fixed width to work
                      flexShrink: 0,             // Prevents the tag from squishing on mobile
                      marginTop: 3, 
                      fontFamily: "'Source Serif 4', serif", 
                      letterSpacing: "0.06em" 
                    }}>
                      {part.label.toUpperCase()}
                    </span>
                    <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, lineHeight: 1.8, color: "#ddd" }}>
                      {part.text}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ── REFERENCE LIBRARY ── */}
        {activeNav === "Reference Library" && (
          <>
            {/* ── OVERVIEW ── */}
            {refView === "overview" && (
              <section style={{ padding: "60px 0 40px" }}>
                <h2 className="section-title">Reference Library</h2>
                <p className="section-sub" style={{ maxWidth: 640, marginBottom: 48 }}>
                  Including the right references in your prompt is the single biggest factor in output quality. Select a reference type to explore, or dive straight into the Legislation Finder.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
                  {REFERENCE_ITEMS.map((ref) => (
                    <div
                      key={ref.title}
                      className="ref-card"
                      style={{ cursor: ref.title === "Relevant Legislation" ? "pointer" : "default", position: "relative" }}
                      onClick={() => ref.title === "Relevant Legislation" && (setRefView("legislation"), setSelectedArea(null), setLegSearch(""))}
                    >
                      {ref.title === "Relevant Legislation" && (
                        <span style={{ position: "absolute", top: 16, right: 16, background: COLORS.gold, color: "white", fontSize: 10, padding: "2px 8px", borderRadius: 10, fontFamily: "'Source Serif 4', serif", letterSpacing: "0.08em" }}>EXPLORE →</span>
                      )}
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
            )}

            {/* ── LEGISLATION FINDER ── */}
            {refView === "legislation" && (
              <section style={{ padding: "60px 0 60px" }}>
                {/* Breadcrumb */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontFamily: "'Source Serif 4', serif", fontSize: 13, color: "#888" }}>
                  <span style={{ cursor: "pointer", color: COLORS.gold }} onClick={() => { setRefView("overview"); setSelectedArea(null); }}>Reference Library</span>
                  <span>›</span>
                  <span style={{ color: selectedArea ? COLORS.gold : COLORS.darkInk, cursor: selectedArea ? "pointer" : "default" }} onClick={() => selectedArea && setSelectedArea(null)}>Legislation Finder</span>
                  {selectedArea && <><span>›</span><span style={{ color: COLORS.darkInk }}>{selectedArea}</span></>}
                </div>

                {!selectedArea ? (
                  <>
                    <h2 className="section-title">Legislation Finder</h2>
                    <p className="section-sub" style={{ maxWidth: 620, marginBottom: 32 }}>
                      Search by area of law to find the relevant Singapore legislation to include in your prompt.
                    </p>

                    {/* Search bar */}
                    <div style={{ position: "relative", maxWidth: 520, marginBottom: 40 }}>
                      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#aaa" }}>🔍</span>
                      <input
                        type="text"
                        placeholder="Search area of law… e.g. Probate, Employment, Contract"
                        value={refSearch}
                        onChange={(e) => setRefSearch(e.target.value)}
                        style={{ paddingLeft: 40, width: "100%", padding: "12px 16px 12px 40px", border: `1.5px solid ${COLORS.goldLight}`, borderRadius: 4, fontFamily: "'Source Serif 4', serif", fontSize: 14, background: "white", color: COLORS.darkInk }}
                      />
                      {refSearch && (
                        <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#aaa", fontSize: 18 }} onClick={() => setRefSearch("")}>×</span>
                      )}
                    </div>

                    {/* Area cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
                      {Object.entries(LEGISLATION_DB)
                        .filter(([area]) => area.toLowerCase().includes(refSearch.toLowerCase()))
                        .map(([area, data]) => (
                          <div
                            key={area}
                            className="ref-card"
                            style={{ cursor: "pointer" }}
                            onClick={() => { setSelectedArea(area); setLegSearch(""); }}
                          >
                            <div style={{ fontSize: 28, marginBottom: 10 }}>{data.icon}</div>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{area}</h3>
                            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 12 }}>{data.desc}</p>
                            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 12, color: COLORS.gold }}>
                              {data.items.length} Acts & Statutes →
                            </p>
                          </div>
                        ))}
                    </div>
                    {Object.keys(LEGISLATION_DB).filter(a => a.toLowerCase().includes(refSearch.toLowerCase())).length === 0 && (
                      <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa", fontFamily: "'Source Serif 4', serif" }}>
                        <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
                        <p>No areas found for "{refSearch}". Try a different search term.</p>
                      </div>
                    )}

                    {/* Request banner */}
                    <div style={{ marginTop: 40, background: COLORS.darkInk, borderRadius: 6, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                      <div>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: COLORS.cream, marginBottom: 4 }}>Don't see the area of law you need?</p>
                        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: COLORS.goldLight, lineHeight: 1.6 }}>Submit a request and our team will review it for inclusion in the library.</p>
                      </div>
                      <button className="btn-gold" onClick={() => setShowRequestModal(true)}>+ Request an Area</button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Area detail view */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                      <span style={{ fontSize: 36 }}>{LEGISLATION_DB[selectedArea].icon}</span>
                      <div>
                        <h2 className="section-title" style={{ marginBottom: 2 }}>{selectedArea}</h2>
                        <p className="section-sub">{LEGISLATION_DB[selectedArea].desc}</p>
                      </div>
                    </div>

                    {/* Legislation search */}
                    <div style={{ position: "relative", maxWidth: 480, margin: "28px 0 32px" }}>
                      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#aaa" }}>🔍</span>
                      <input
                        type="text"
                        placeholder="Search within this area…"
                        value={legSearch}
                        onChange={(e) => setLegSearch(e.target.value)}
                        style={{ paddingLeft: 40, width: "100%", padding: "10px 16px 10px 40px", border: `1.5px solid ${COLORS.goldLight}`, borderRadius: 4, fontFamily: "'Source Serif 4', serif", fontSize: 14, background: "white", color: COLORS.darkInk }}
                      />
                      {legSearch && (
                        <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#aaa", fontSize: 18 }} onClick={() => setLegSearch("")}>×</span>
                      )}
                    </div>

                    {/* Legislation list */}
                    {LEGISLATION_DB[selectedArea].items
                      .filter(item => item.name.toLowerCase().includes(legSearch.toLowerCase()) || item.desc.toLowerCase().includes(legSearch.toLowerCase()))
                      .map((item) => (
                        <div key={item.name} style={{ background: "white", border: `1px solid ${COLORS.goldLight}`, borderLeft: `4px solid ${COLORS.gold}`, borderRadius: "0 6px 6px 0", padding: "24px 28px", marginBottom: 16 }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                            <div style={{ flex: 1 }}>
                              <span style={{ display: "inline-block", background: COLORS.parchment, color: COLORS.ink, fontSize: 11, fontFamily: "'Source Serif 4', serif", padding: "2px 10px", borderRadius: 3, marginBottom: 8, letterSpacing: "0.06em" }}>{item.abbr}</span>
                              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: COLORS.darkInk, marginBottom: 10, lineHeight: 1.4 }}>{item.name}</h3>
                              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "#444", lineHeight: 1.8 }}>{item.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    {LEGISLATION_DB[selectedArea].items.filter(item => item.name.toLowerCase().includes(legSearch.toLowerCase()) || item.desc.toLowerCase().includes(legSearch.toLowerCase())).length === 0 && (
                      <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa", fontFamily: "'Source Serif 4', serif" }}>
                        No legislation matched "{legSearch}".
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
                      <button className="btn-outline" onClick={() => setSelectedArea(null)}>← Back to All Areas</button>
                      <button className="btn-outline" onClick={() => setShowRequestModal(true)}>+ Request an Area</button>
                    </div>
                  </>
                )}
              </section>
            )}
          </>
        )}

        {/* ── PROMPT LIBRARY ── */}
        {activeNav === "Prompt Library" && (
          <>
            <section style={{ padding: "60px 0 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h2 className="section-title">Prompt Library</h2>
                <p className="section-sub">Community-contributed prompts</p>
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

      {/* Request Area Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowRequestModal(false)}>
          <div className="modal">
            {requestSubmitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 8 }}>Request received!</h3>
                <p style={{ fontFamily: "'Source Serif 4', serif", color: "#666", lineHeight: 1.7 }}>Thank you — our team will review your request and add the area of law to the library if approved.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22 }}>Request an Area of Law</h3>
                  <span style={{ cursor: "pointer", fontSize: 20, color: "#aaa", lineHeight: 1 }} onClick={() => setShowRequestModal(false)}>×</span>
                </div>
                <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "#666", marginBottom: 28, lineHeight: 1.6 }}>
                  Can't find the area of law you need? Let us know and our team will review it for inclusion in the Reference Library.
                </p>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}>
                    Area of Law <span style={{ color: COLORS.rust }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Intellectual Property, Immigration Law, Tax Law"
                    value={requestForm.area}
                    onChange={(e) => setRequestForm(f => ({ ...f, area: e.target.value }))}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}>
                    Why is this area useful for legal research? <span style={{ color: "#aaa", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea
                    placeholder="e.g. Many practitioners deal with IP matters and need to reference the Trade Marks Act and Patents Act in their prompts…"
                    value={requestForm.reason}
                    onChange={(e) => setRequestForm(f => ({ ...f, reason: e.target.value }))}
                    style={{ minHeight: 100 }}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}>
                    Your email <span style={{ color: "#aaa", fontWeight: 400 }}>(optional — we'll notify you when it's added)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. name@lawfirm.com"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>

                {/* Popular requests hint */}
                <div style={{ background: COLORS.parchment, borderRadius: 4, padding: "12px 16px", marginBottom: 24 }}>
                  <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: "0.08em", marginBottom: 6 }}>FREQUENTLY REQUESTED</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {["Intellectual Property", "Immigration Law", "Tax Law", "Arbitration", "Data Protection", "Banking & Finance"].map(tag => (
                      <span
                        key={tag}
                        className="tag"
                        style={{ cursor: "pointer", transition: "background 0.15s" }}
                        onClick={() => setRequestForm(f => ({ ...f, area: tag }))}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 11, color: "#aaa", marginTop: 8 }}>Click a tag to pre-fill the area field.</p>
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button className="btn-outline" onClick={() => setShowRequestModal(false)}>Cancel</button>
                  <button
                    className="btn-gold"
                    disabled={!requestForm.area.trim()}
                    onClick={() => {
                      setRequestSubmitted(true);
                      setTimeout(() => {
                        setShowRequestModal(false);
                        setRequestSubmitted(false);
                        setRequestForm({ area: "", reason: "", email: "" });
                      }, 2800);
                    }}
                  >
                    Submit Request
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

