"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type SkillGapNode = {
  id: string;
  name: string;
  gap_percentage: number;
  is_center: boolean;
  used_in_careers: string[] | null;
  skill_match_percentage: number | null;
  level_label: string | null;
  description: string | null;
};
type SkillSubcategory = { id: string; name: string };
type Course = { id: string; title: string; level: "Beginner"|"Intermediate"|"Advanced"; hours: number; rating: number; reviews: number };
type JobListing = { id: string; title: string; company: string; salary_min: number; salary_max: number; work_type: "On-site"|"Hybrid"|"Remote"; job_type: string };
type Institution = { id: string; name: string; institution_type: string; program: string; latitude: number; longitude: number; is_online: boolean; province: string };

const COMPETENCY_ID = "DC09";

const NODE_POS = [
  { x: 280, y: 195 },
  { x: 280, y: 52  },
  { x: 108, y: 112 },
  { x: 452, y: 112 },
  { x: 95,  y: 270 },
  { x: 462, y: 270 },
  { x: 280, y: 338 },
];

const NODE_ICONS: Record<string,string> = {
  "User Research":"🔍", Figma:"🎨", Prototyping:"📐",
  "Design System":"🧩", Wireframing:"📋",
  "Usability Testing":"✅", Communication:"💬", default:"⚡",
};

function nodeColors(pct: number, isCenter: boolean) {
  if (isCenter) return { bg:"#F5EFE8", border:"#C8A882", text:"#5A3A1E" };
  if (pct >= 80) return { bg:"#FDE8E8", border:"#EF9A9A", text:"#B71C1C" };
  if (pct >= 60) return { bg:"#FFF8E1", border:"#FFD54F", text:"#E65100" };
  if (pct >= 40) return { bg:"#FFF3E0", border:"#FFCC80", text:"#BF360C" };
  return            { bg:"#EDE7F6", border:"#CE93D8", text:"#4A148C" };
}

const S: Record<string, React.CSSProperties> = {
  // Layout helpers
  row:    { display:"flex", flexDirection:"row", alignItems:"center" },
  col:    { display:"flex", flexDirection:"column" },
  flex1:  { flex:1 },
  gap4:   { gap:4 },
  gap8:   { gap:8 },
  gap12:  { gap:12 },
  gap16:  { gap:16 },
  gap20:  { gap:20 },
  // Page
  page:   { minHeight:"100vh", background:"#F5F0EB", fontFamily:"'Noto Sans Thai','Sarabun',sans-serif" },
  // Cards
  card:   { background:"#fff", border:"1px solid #E8DDD4", borderRadius:16, padding:"20px" },
  // Text colours
  muted:  { color:"#9E8272" },
  dark:   { color:"#2C1A0E" },
  mid:    { color:"#4E342E" },
};

// ── NavBar ────────────────────────────────────────────────────────────────────
function NavBar() {
  return (
    <nav style={{ display:"flex", alignItems:"center", padding:"0 32px", height:44, gap:8, background:"#2C1A0E" }}>
      <span style={{ fontFamily:"Georgia,serif", fontWeight:900, color:"#fff", fontSize:18, letterSpacing:-0.5, marginRight:24 }}>
        CARIA<span style={{ color:"#D4A96A" }}>+</span>
      </span>
      {["หน้าหลัก","แบบทดสอบ","สรุปผล","โปรไฟล์"].map(t => (
        <button key={t} style={t==="สรุปผล"
          ? { background:"#F5F0EB", color:"#2C1A0E", fontWeight:700, padding:"4px 20px", borderRadius:999, border:"none", fontSize:14, cursor:"pointer" }
          : { background:"transparent", color:"#9E8272", padding:"4px 20px", border:"none", fontSize:14, cursor:"pointer" }}>
          {t}
        </button>
      ))}
    </nav>
  );
}

// ── Career Path ───────────────────────────────────────────────────────────────
function CareerPath() {
  const steps = [
    { stage:"ระดับเริ่มต้น", stageBg:"#EDE7F6", stageColor:"#5E35B1", title:"Junior\nUX/UI Designer", current:true  },
    { stage:"ระดับกลาง",    stageBg:"#E3F2FD", stageColor:"#1565C0", title:"UX/UI Designer",        current:false },
    { stage:"ระดับสูง",     stageBg:"#E8F5E9", stageColor:"#2E7D32", title:"Senior\nUX/UI Designer", current:false },
  ];
  return (
    <div style={S.card}>
      <p style={{ ...S.muted, fontSize:11, fontWeight:600, marginBottom:12 }}>เส้นทางอาชีพที่แนะนำสำหรับคุณ</p>
      <div style={{ display:"flex", alignItems:"center", gap:0 }}>
        {steps.map((s,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, flex:1 }}>
              <span style={{ background:s.stageBg, color:s.stageColor, fontSize:10, fontWeight:700, padding:"2px 12px", borderRadius:999 }}>
                {s.stage}
              </span>
              <div style={{
                width:"100%", borderRadius:12, padding:"10px 8px",
                background: s.current ? "#2C1A0E" : "#F5F0EB",
                border:`1.5px solid ${s.current ? "#2C1A0E" : "#DDD0C4"}`,
                display:"flex", flexDirection:"column", alignItems:"center", gap:6,
              }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background: s.current ? "#5A3E2B" : "#E0D4C8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                  {i===1 ? "🖥️" : "👤"}
                </div>
                <p style={{ fontSize:10, fontWeight:600, textAlign:"center", whiteSpace:"pre-line", lineHeight:1.3, color: s.current ? "#F5F0EB" : "#5A3E2B", margin:0 }}>
                  {s.title}
                </p>
              </div>
            </div>
            {i < 2 && <span style={{ color:"#aaa", fontSize:14, margin:"16px 4px 0", flexShrink:0 }}>→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Skill Gap Map ─────────────────────────────────────────────────────────────
function SkillGapMap({ nodes, selectedId, onSelect }: { nodes:SkillGapNode[]; selectedId:string|null; onSelect:(n:SkillGapNode)=>void }) {
  const center = NODE_POS[0];
  return (
    <svg viewBox="0 0 560 380" style={{ width:"100%", height:"100%", userSelect:"none" }}>
      {NODE_POS.slice(1).map((pos,i) => (
        <line key={i} x1={center.x} y1={center.y} x2={pos.x} y2={pos.y}
          stroke="#C8B8A8" strokeWidth="1.3" strokeDasharray="4 4" />
      ))}
      {nodes.map((node,i) => {
        const pos  = NODE_POS[i] ?? center;
        const col  = nodeColors(node.gap_percentage, node.is_center);
        const r    = node.is_center ? 50 : 40;
        const icon = NODE_ICONS[node.name] ?? NODE_ICONS.default;
        const sel  = selectedId === node.id;
        return (
          <g key={node.id} onClick={() => onSelect(node)} style={{ cursor:"pointer" }}>
            {sel && <circle cx={pos.x} cy={pos.y} r={r+8} fill="none" stroke="#2C1A0E" strokeWidth="2" opacity="0.3" />}
            <circle cx={pos.x+2} cy={pos.y+3} r={r} fill="rgba(0,0,0,0.06)" />
            <circle cx={pos.x} cy={pos.y} r={r} fill={col.bg} stroke={col.border} strokeWidth={node.is_center ? 2.5 : 1.8} />
            {node.name === "Figma" ? (
              <>
                <rect x={pos.x-11} y={pos.y-r+9} width={22} height={22} rx={5} fill="#9B51E0" />
                <text x={pos.x} y={pos.y-r+21} textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" dominantBaseline="middle">F</text>
              </>
            ) : (
              <text x={pos.x} y={pos.y-(node.is_center?14:11)} textAnchor="middle" fontSize={node.is_center?15:13} dominantBaseline="middle">{icon}</text>
            )}
            <text x={pos.x} y={pos.y+(node.is_center?5:4)} textAnchor="middle" fontSize={node.is_center?9.5:8.5} fontWeight="700" fill={col.text} style={{ fontFamily:"'Noto Sans Thai',sans-serif" }}>{node.name}</text>
            <text x={pos.x} y={pos.y+(node.is_center?19:17)} textAnchor="middle" fontSize={node.is_center?14:12} fontWeight="800" fill={col.text}>{node.gap_percentage}%</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────
function SkillDetailPanel({ centerNode, selectedNode, subcategories }: { centerNode:SkillGapNode; selectedNode:SkillGapNode; subcategories:SkillSubcategory[] }) {
  const dotColors = ["#E57373","#FFB74D","#66BB6A","#64B5F6","#CE93D8"];
  const careerIcons = ["🎨","🖥️","🔍","✏️"];
  return (
    <div style={{ ...S.card, display:"flex", flexDirection:"column", gap:16, height:"100%" }}>
      {/* top row */}
      <div style={{ display:"flex", gap:12 }}>
        {/* left */}
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ ...S.muted, fontSize:11, fontWeight:600, marginBottom:8 }}>รายละเอียดทักษะที่เลือก</p>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:8, borderRadius:12, background:"#F5F0EB", marginBottom:12 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"#D4A96A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
              {NODE_ICONS[selectedNode.name] ?? "⚡"}
            </div>
            <div>
              <p style={{ fontSize:14, fontWeight:700, ...S.dark, margin:0, lineHeight:1.2 }}>{selectedNode.name}</p>
              <p style={{ fontSize:10, ...S.muted, margin:0 }}>{selectedNode.level_label ?? "ระดับปัจจุบัน"}</p>
            </div>
          </div>
          <p style={{ fontSize:30, fontWeight:900, color:"#F97316", lineHeight:1, margin:0 }}>{selectedNode.gap_percentage}%</p>
          <p style={{ fontSize:10, ...S.muted, marginBottom:8 }}>ป้าเกาะ</p>
          {selectedNode.description && <p style={{ fontSize:10, lineHeight:1.6, color:"#6D5147" }}>{selectedNode.description}</p>}
        </div>
        {/* right */}
        <div style={{ flexShrink:0 }}>
          <p style={{ ...S.muted, fontSize:11, fontWeight:600, marginBottom:8 }}>ใช้ในอาชีพ</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {(centerNode.used_in_careers ?? []).map((c,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:"#EDE7F6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, flexShrink:0 }}>
                  {careerIcons[i] ?? "👤"}
                </div>
                <span style={{ fontSize:10, ...S.mid, whiteSpace:"nowrap" }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* sub-skills */}
      <div>
        <p style={{ fontSize:11, fontWeight:700, color:"#E65100", marginBottom:8 }}>ทักษะย่อยที่ควรพัฒนา</p>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {subcategories.map((s,i) => (
            <div key={s.id} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:dotColors[i%dotColors.length], flexShrink:0, display:"inline-block" }} />
              <span style={{ fontSize:11, ...S.mid }}>{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* skill match */}
      <div style={{ borderRadius:12, padding:16, marginTop:"auto", background:"#F5F0EB", border:"1px solid #E8DDD4" }}>
        <p style={{ fontSize:12, fontWeight:700, ...S.dark, marginBottom:4 }}>Skill Match กับเป้าหมายอาชีพ</p>
        <p style={{ fontSize:30, fontWeight:900, color:"#2563EB", margin:0 }}>{centerNode.skill_match_percentage ?? 0}%</p>
        <div style={{ width:"100%", height:8, borderRadius:4, background:"#DDD0C4", margin:"4px 0" }}>
          <div style={{ height:8, borderRadius:4, width:`${centerNode.skill_match_percentage ?? 0}%`, background:"linear-gradient(90deg,#2563EB,#7C3AED)" }} />
        </div>
        <p style={{ fontSize:10, ...S.muted, margin:0 }}>คุณมีทักษะตรงเป้าหมายอาชีพ {centerNode.skill_match_percentage ?? 0}%</p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SkillsPage() {
  const [nodes,         setNodes        ] = useState<SkillGapNode[]>([]);
  const [subcategories, setSubcategories] = useState<SkillSubcategory[]>([]);
  const [courses,       setCourses      ] = useState<Course[]>([]);
  const [jobs,          setJobs         ] = useState<JobListing[]>([]);
  const [institutions,  setInstitutions ] = useState<Institution[]>([]);
  const [loading,       setLoading      ] = useState(true);
  const [selectedNode,  setSelectedNode ] = useState<SkillGapNode|null>(null);
  const [province,      setProvince     ] = useState("ทั้งหมด");
  const [search,        setSearch       ] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [
        { data: nodesData },
        { data: subData   },
        { data: courseData},
        { data: jobData   },
        { data: instData  },
      ] = await Promise.all([
        supabase.from("skill_gap_nodes").select("*").eq("career_competency_id",COMPETENCY_ID).order("is_center",{ascending:false}),
        supabase.from("skill_subcategories").select("*").eq("career_competency_id",COMPETENCY_ID),
        supabase.from("courses").select("*").eq("career_competency_id",COMPETENCY_ID).limit(3),
        supabase.from("job_listings").select("*").eq("career_competency_id",COMPETENCY_ID).limit(3),
        supabase.from("institutions").select("*").eq("career_competency_id",COMPETENCY_ID),
      ]);
      const nodeList = (nodesData ?? []) as SkillGapNode[];
      setNodes(nodeList);
      setSubcategories((subData ?? []) as SkillSubcategory[]);
      setCourses((courseData ?? []) as Course[]);
      setJobs((jobData ?? []) as JobListing[]);
      setInstitutions((instData ?? []) as Institution[]);
      setSelectedNode(nodeList.find(n => n.is_center) ?? nodeList[0] ?? null);
      setLoading(false);
    }
    load();
  }, []);

  const centerNode = nodes.find(n => n.is_center) ?? null;
  const provinces  = ["ทั้งหมด", ...Array.from(new Set(institutions.map(i => i.province)))];
  const filteredInst = institutions.filter(inst => {
    const matchProv   = province === "ทั้งหมด" || inst.province === province;
    const matchSearch = search === "" || inst.name.toLowerCase().includes(search.toLowerCase()) || inst.program.toLowerCase().includes(search.toLowerCase());
    return matchProv && matchSearch;
  });

  const companyColor: Record<string,string> = { "SCB 10X":"#4A148C","LINE MAN":"#00B900",KBank:"#138808",Agoda:"#E31837",Grab:"#00B14F",Lazada:"#F57224",Shopee:"#EE4D2D",Bitkub:"#F0A500" };
  function logoColor(c:string) { for(const [k,v] of Object.entries(companyColor)) if(c.toLowerCase().includes(k.toLowerCase())) return v; return "#5A3E2B"; }

  const levelStyle: Record<string,{bg:string;color:string}> = {
    Beginner:{bg:"#E8F5E9",color:"#2E7D32"}, Intermediate:{bg:"#E3F2FD",color:"#1565C0"}, Advanced:{bg:"#F3E5F5",color:"#6A1B9A"},
  };
  const workStyle: Record<string,{bg:string;color:string}> = {
    "On-site":{bg:"#F1F5F9",color:"#334155"}, Hybrid:{bg:"#FFF3E0",color:"#E65100"}, Remote:{bg:"#E0F2FE",color:"#0369A1"},
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F5F0EB" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:40, height:40, border:"4px solid #D4C4B4", borderTop:"4px solid #5A3E2B", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 12px" }} />
        <p style={{ color:"#9E8272", fontSize:14 }}>กำลังโหลดข้อมูล...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <NavBar />

      <div style={{ maxWidth:1152, margin:"0 auto", padding:"24px 24px", display:"flex", flexDirection:"column", gap:20 }}>

        {/* ── Header ── */}
        <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
          <button style={{ width:32, height:32, borderRadius:"50%", background:"#E8DDD4", color:"#5A3E2B", border:"none", cursor:"pointer", flexShrink:0, fontSize:14, marginTop:2 }}>←</button>
          <div>
            <h1 style={{ fontSize:20, fontWeight:700, ...S.dark, margin:0 }}>ทักษะที่ขาดเพิ่มเติม</h1>
            <p style={{ fontSize:12, ...S.muted, margin:"2px 0 0" }}>สำรวจทักษะของคุณ วิเคราะห์ช่องว่าง และวางแผนพัฒนาทักษะให้ตรงกับเส้นทางของอาชีพ</p>
          </div>
        </div>

        {/* ── Row 1: Left col + Right panel ── */}
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20, alignItems:"start" }}>
          {/* Left */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <CareerPath />
            {/* Skill Gap Map */}
            <div style={S.card}>
              <p style={{ fontSize:14, fontWeight:700, ...S.dark, margin:"0 0 4px" }}>
                ทักษะที่ควรพัฒนา <span style={{ fontWeight:400, fontSize:12, ...S.muted }}>(Skill Gap Map)</span>
              </p>
              <div style={{ height:320 }}>
                {nodes.length > 0
                  ? <SkillGapMap nodes={nodes} selectedId={selectedNode?.id ?? null} onSelect={setSelectedNode} />
                  : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", fontSize:14, ...S.muted }}>ไม่พบข้อมูล Skill Gap</div>
                }
              </div>
            </div>
          </div>

          {/* Right */}
          {centerNode && selectedNode && (
            <SkillDetailPanel centerNode={centerNode} selectedNode={selectedNode} subcategories={subcategories} />
          )}
        </div>

        {/* ── Filter bar ── */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ position:"relative", flexShrink:0 }}>
            <select value={province} onChange={e => setProvince(e.target.value)} style={{ appearance:"none", padding:"10px 32px 10px 16px", borderRadius:12, border:"1px solid #DDD0C4", background:"#fff", color:"#2C1A0E", fontSize:14, fontWeight:500, cursor:"pointer", minWidth:130, fontFamily:"inherit" }}>
              {provinces.map(p => <option key={p}>{p}</option>)}
            </select>
            <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", color:"#9E8272", pointerEvents:"none", fontSize:11 }}>▼</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 16px", borderRadius:12, background:"#fff", border:"1px solid #DDD0C4", flex:1 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#9E8272" strokeWidth="1.3"/><path d="M9.5 9.5L13 13" stroke="#9E8272" strokeWidth="1.3" strokeLinecap="round"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาสถาบันหรือหลักสูตร" style={{ flex:1, background:"transparent", fontSize:14, outline:"none", border:"none", color:"#2C1A0E", fontFamily:"inherit" }} />
          </div>
        </div>

        {/* ── Map + Institutions ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          <div style={{ borderRadius:16, overflow:"hidden", height:380, border:"1px solid #E8DDD4" }}>
            <iframe title="map" width="100%" height="100%" style={{ border:0 }} loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d248282!2d100.523!3d13.736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sth!2sth!4v1" />
          </div>

          <div style={{ ...S.card, padding:0, overflow:"hidden", maxHeight:380, overflowY:"auto" }}>
            <div style={{ position:"sticky", top:0, padding:"20px 20px 8px", background:"#fff" }}>
              <p style={{ fontSize:14, fontWeight:700, ...S.dark, margin:0 }}>พบ {filteredInst.length} สถาบัน</p>
            </div>
            <div style={{ padding:"0 20px 20px", display:"flex", flexDirection:"column", gap:12 }}>
              {filteredInst.map(inst => (
                <div key={inst.id} style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
                  <div style={{ width:56, height:56, borderRadius:12, background:"#EEE8DD", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🏫</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:14, fontWeight:600, ...S.dark, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{inst.name}</p>
                    <p style={{ fontSize:12, ...S.muted, margin:"2px 0" }}>{inst.province}</p>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:999, background:"#F5F0EB", color:"#6D4C41" }}>{inst.institution_type}</span>
                      {inst.is_online && <span style={{ fontSize:10, padding:"2px 8px", borderRadius:999, background:"#DCFCE7", color:"#15803D", fontWeight:600 }}>Online</span>}
                    </div>
                  </div>
                </div>
              ))}
              {filteredInst.length === 0 && <p style={{ fontSize:14, textAlign:"center", padding:"32px 0", ...S.muted }}>ไม่พบสถาบันที่ตรงกัน</p>}
            </div>
          </div>
        </div>

        {/* ── Courses ── */}
        <div>
          <h2 style={{ fontSize:16, fontWeight:700, ...S.dark, marginBottom:16 }}>คอร์สเรียนแนะนำสำหรับคุณ</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
            {courses.map(c => {
              const ls = levelStyle[c.level] ?? levelStyle.Intermediate;
              return (
                <div key={c.id} style={{ ...S.card, display:"flex", flexDirection:"column", gap:12 }}>
                  <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                    <div style={{ width:56, height:56, borderRadius:12, background:"#F5F0EB", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>🧑‍💻</div>
                    <div style={{ flex:1 }}>
                      <span style={{ fontSize:10, fontWeight:600, padding:"2px 10px", borderRadius:999, background:ls.bg, color:ls.color }}>{c.level}</span>
                      <p style={{ fontSize:14, fontWeight:700, ...S.dark, margin:"4px 0 0", lineHeight:1.3 }}>{c.title}</p>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:12, fontSize:12, ...S.muted }}>
                    <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#9E8272" strokeWidth="1.2"/><path d="M6 3.5V6l2 1.5" stroke="#9E8272" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      {c.hours} ชั่วโมง
                    </span>
                    <span style={{ display:"flex", alignItems:"center", gap:2 }}>
                      <span style={{ color:"#F59E0B" }}>★</span>
                      <span style={{ fontWeight:600, color:"#D97706" }}>{c.rating.toFixed(1)}</span>
                    </span>
                    <span>({c.reviews.toLocaleString()})</span>
                  </div>
                  <button style={{ width:"100%", padding:"8px 0", borderRadius:12, border:"none", background:"#2C1A0E", color:"#F5F0EB", fontSize:14, fontWeight:600, cursor:"pointer" }}>เริ่มเรียน</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Jobs ── */}
        <div>
          <h2 style={{ fontSize:16, fontWeight:700, ...S.dark, marginBottom:16 }}>ตำแหน่งงานในพื้นที่ของคุณ</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
            {jobs.map(job => {
              const ws = workStyle[job.work_type] ?? workStyle["On-site"];
              const lc = logoColor(job.company);
              return (
                <div key={job.id} style={S.card}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:lc, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:900, flexShrink:0 }}>
                      {job.company.slice(0,3).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize:14, fontWeight:700, ...S.dark, margin:0 }}>{job.title}</p>
                      <p style={{ fontSize:12, ...S.muted, margin:0 }}>{job.company}</p>
                    </div>
                  </div>
                  <p style={{ fontSize:14, fontWeight:600, ...S.dark, marginBottom:10 }}>{job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} บาท</p>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <span style={{ fontSize:10, fontWeight:600, padding:"4px 10px", borderRadius:999, background:ws.bg, color:ws.color }}>{job.work_type}</span>
                    <span style={{ fontSize:10, fontWeight:600, padding:"4px 10px", borderRadius:999, background:"#F5F0EB", color:"#6D4C41" }}>{job.job_type}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Guide ── */}
        <div style={S.card}>
          <h2 style={{ fontSize:16, fontWeight:700, ...S.dark, marginBottom:16 }}>แนวทางการเลือกสถาบัน</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:16 }}>
            {[
              { icon:"🎯", title:"เลือกตามเป้าหมายอาชีพ",    desc:"พิจารณาหลักสูตรที่สอดคล้องกับเส้นทางอาชีพของคุณ",              bg:"#F5F0EB" },
              { icon:"📚", title:"พิจารณารูปแบบการเรียน",     desc:"เลือก Online หรือ Onsite ให้เหมาะกับตารางเวลา",                bg:"#EDE7F6" },
              { icon:"⏰", title:"เทียบค่าใช้จ่ายและเวลา",    desc:"เปรียบเทียบค่าใช้จ่าย ระยะเวลา และความคุ้มค่าแต่ละหลักสูตร", bg:"#FFF3E0" },
              { icon:"⭐", title:"ดูรีวิวและความน่าเชื่อถือ", desc:"ตรวจสอบรีวิว และการรับรองจากหน่วยงาน",                        bg:"#E8F5E9" },
            ].map((item,i) => (
              <div key={i} style={{ borderRadius:12, padding:16, background:item.bg, display:"flex", flexDirection:"column", gap:8 }}>
                <span style={{ fontSize:24 }}>{item.icon}</span>
                <p style={{ fontSize:12, fontWeight:700, ...S.dark, margin:0, lineHeight:1.3 }}>{item.title}</p>
                <p style={{ fontSize:10, lineHeight:1.6, color:"#6D5147", margin:0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Download ── */}
        <div style={{ display:"flex", justifyContent:"flex-end", paddingBottom:24 }}>
          <button style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 20px", borderRadius:12, border:"none", background:"#2C1A0E", color:"#F5F0EB", fontSize:14, fontWeight:600, cursor:"pointer" }}>
            ดาวน์โหลดรายงาน PDF
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 2v8M5 7.5l2.5 2.5 2.5-2.5M2 12v.5A1.5 1.5 0 003.5 14h8a1.5 1.5 0 001.5-1.5V12" stroke="#F5F0EB" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}