"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import TabNav from '../../components/TabNav'
import html2canvas from "html2canvas";




const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Types ─────────────────────────────────────────────────────────────────────
type SkillGapNode = {
  id: string;
  career_competency_id: string;
  name: string;
  gap_percentage: number;
  is_center: boolean;
  used_in_careers: string[] | null;
  skill_match_percentage: number | null;
  level_label: string | null;
  description: string | null;
};

type Course = {
  id: string;
  career_competency_id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  hours: number;
  rating: number;
  reviews: number;
  url?: string | null;
  platform?: string | null;
  price?: string | null;
};

type JobListing = {
  id: string;
  career_competency_id: string;
  title: string;
  company: string;
  salary_min: number;
  salary_max: number;
  work_type: "On-site" | "Hybrid" | "Remote";
  job_type: string;
  company_lat?: number | null;
  company_lng?: number | null;
};

type Institution = {
  id: string;
  career_competency_id: string;
  name: string;
  institution_type: string;
  program: string;
  latitude: number;
  longitude: number;
  is_online: boolean;
  province: string;
};

type CareerDetail = {
  id: string;
  career_competency_id: string;
  title: string;
};

// ─── Theme ─────────────────────────────────────────────────────────────────────
type Theme = {
  accent: string;
  accentLight: string;
  accentMid: string;
  accentText: string;
  badgeBg: string;
  badgeText: string;
  btnBg: string;
  btnColor: string;
  nodeCenterBg: string;
  nodeCenterBorder: string;
  nodeCenterText: string;
};

const THEMES: Record<string, Theme> = {
  DT: {
    accent: "#4a6fc4",
    accentLight: "#eef2ff",
    accentMid: "#d6e0f8",
    accentText: "#3a5db0",
    badgeBg: "#eef2ff",
    badgeText: "#3a5db0",
    btnBg: "#4a6fc4",
    btnColor: "#ffffff",
    nodeCenterBg: "#eef2ff",
    nodeCenterBorder: "#4a6fc4",
    nodeCenterText: "#3a5db0",
  },
  DC: {
    accent: "#e06080",
    accentLight: "#fff0f4",
    accentMid: "#fad6e0",
    accentText: "#c04060",
    badgeBg: "#fff0f4",
    badgeText: "#c04060",
    btnBg: "#e06080",
    btnColor: "#ffffff",
    nodeCenterBg: "#fff0f4",
    nodeCenterBorder: "#e06080",
    nodeCenterText: "#c04060",
  },
};

function nodeColors(pct: number, isCenter: boolean, theme: Theme) {
  if (isCenter) return { bg: theme.nodeCenterBg, border: theme.nodeCenterBorder, text: theme.nodeCenterText };
  if (pct >= 70) return { bg: "#E8F5E9", border: "#A5D6A7", text: "#1B5E20" };
  if (pct >= 40) return { bg: "#FFF8E1", border: "#FFD54F", text: "#E65100" };
  return { bg: "#FDE8E8", border: "#EF9A9A", text: "#B71C1C" };
}

const NODE_POS = [
  { x: 300, y: 220 },
  { x: 300, y: 85 },
  { x: 120, y: 150 },
  { x: 480, y: 150 },
  { x: 120, y: 300 },
  { x: 480, y: 300 },
  { x: 300, y: 368 },
];

const COMPANY_COORDS: Record<string, [number, number]> = {
  "SCB 10X": [13.7485, 100.5363], Agoda: [13.7251, 100.5292],
  "LINE MAN Wongnai": [13.74, 100.55], "Grab Thailand": [13.7445, 100.5347],
  "Lazada Thailand": [13.7563, 100.555], "Shopee Thailand": [13.749, 100.53],
  "Kasikorn Bank": [13.72, 100.536], KBank: [13.72, 100.536],
  Bitkub: [13.73, 100.524], "Garena Thailand": [13.76, 100.569],
  Ookbee: [13.753, 100.545], "ByteDance Thailand": [13.751, 100.559],
  "Central Group": [13.7469, 100.5393], "GMM Grammy": [13.802, 100.563],
  TrueVisions: [13.75, 100.56], "AIS Play": [13.806, 100.554],
  "Bangkok Post": [13.749, 100.553], MCOT: [13.793, 100.559],
  "The Matter": [13.732, 100.528], "Ascend Money": [13.753, 100.549],
  Wongnai: [13.74, 100.526], NECTEC: [14.0794, 100.6102],
  "AWS Thailand": [13.74, 100.56], "LINE Thailand": [13.74, 100.55],
  "PTT Digital": [13.83, 100.56], "BBDO Bangkok": [13.73, 100.54],
  "IPG Mediabrands": [13.735, 100.538], "Dentsu Thailand": [13.74, 100.555],
  "Central Tech": [13.7469, 100.5393], "Kantana Group": [13.87, 100.595],
  "Workpoint Entertainment": [13.855, 100.582], "Rabbit Digital Group": [13.74, 100.55],
  "Wongnai Media": [13.74, 100.526],
};

const COMP_BG: Record<string, string> = {
  SCB: "#4A148C", Agoda: "#E31837", Grab: "#00B14F", Lazada: "#F57224",
  Shopee: "#EE4D2D", Bitkub: "#F0A500", LINE: "#00B900", AWS: "#FF9900",
  KBank: "#138808", Kasikorn: "#138808",
};

function getCompBg(name: string) {
  for (const [k, v] of Object.entries(COMP_BG)) if (name.includes(k)) return v;
  return "#5A3E2B";
}

async function geocodeCompany(company: string): Promise<[number, number] | null> {
  for (const [key, coords] of Object.entries(COMPANY_COORDS))
    if (company.toLowerCase().includes(key.toLowerCase())) return coords;
  return null;
}

async function enrichJobsWithCoords(jobs: JobListing[]): Promise<JobListing[]> {
  return Promise.all(jobs.map(async (job) => {
    if (job.company_lat && job.company_lng) return job;
    const c = await geocodeCompany(job.company);
    return c ? { ...job, company_lat: c[0], company_lng: c[1] } : job;
  }));
}

// ─── Helper: เปิด Google Maps ──────────────────────────────────────────────────
function openGoogleMaps(lat: number, lng: number, label?: string) {
  const query = label
    ? `${encodeURIComponent(label)}`
    : `${lat},${lng}`;
  const url = `https://www.google.com/maps/search/?api=1&query=${query}&query_place=${lat},${lng}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// ─── Leaflet Map ───────────────────────────────────────────────────────────────
function LeafletMap({
  markers,
  onMapReady,
}: {
  markers: { lat: number; lng: number; popupHtml: string; iconHtml: string; id: string }[];
  onMapReady?: (flyTo: (lat: number, lng: number) => void) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);
  const markerRefsRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css"; link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const initMap = () => {
      const L = (window as any).L;
      if (!mapRef.current || instanceRef.current) return;
      const map = L.map(mapRef.current).setView([13.7563, 100.5018], 11);
      instanceRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap", maxZoom: 18,
      }).addTo(map);
      markers.forEach((m) => {
        const icon = L.divIcon({ html: m.iconHtml, className: "", iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -38] });
        const marker = L.marker([m.lat, m.lng], { icon }).addTo(map).bindPopup(m.popupHtml);
        markerRefsRef.current.set(m.id, marker);
      });
      if (onMapReady) {
        onMapReady((lat, lng) => {
          map.flyTo([lat, lng], 14, { duration: 1.2 });
        });
      }
    };
    if ((window as any).L) { initMap(); return; }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = initMap;
    document.head.appendChild(script);
    return () => {
      if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
    };
  }, [markers]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}

// ─── Skill Gap Map ──────────────────────────────────────────────────────────────
function SkillGapMap({ nodes, selectedId, onSelect, theme }: {
  nodes: SkillGapNode[];
  selectedId: string | null;
  onSelect: (n: SkillGapNode) => void;
  theme: Theme;
}) {
  const sorted = [
    ...nodes.filter((n) => n.is_center),
    ...nodes.filter((n) => !n.is_center),
  ];
  return (
    <svg viewBox="0 0 600 460" style={{ width: "100%", height: "100%", userSelect: "none" }}>
      {NODE_POS.slice(1, sorted.length).map((pos, i) => (
        <line key={i}
          x1={NODE_POS[0].x} y1={NODE_POS[0].y} x2={pos.x} y2={pos.y}
          stroke="#C8B8A8" strokeWidth="1.2" strokeDasharray="5 4" />
      ))}
      {sorted.map((node, i) => {
        const pos = NODE_POS[i] ?? NODE_POS[NODE_POS.length - 1];
        const col = nodeColors(node.gap_percentage, node.is_center, theme);
        const r = node.is_center ? 52 : 42;
        const sel = selectedId === node.id;
        return (
          <g key={node.id} onClick={() => onSelect(node)} style={{ cursor: "pointer" }}>
            {sel && <circle cx={pos.x} cy={pos.y} r={r + 9} fill="none" stroke={theme.accent} strokeWidth="2" opacity="0.4" />}
            <circle cx={pos.x + 2} cy={pos.y + 3} r={r} fill="rgba(0,0,0,0.05)" />
            <circle cx={pos.x} cy={pos.y} r={r} fill={col.bg} stroke={col.border} strokeWidth={node.is_center ? 2.5 : 1.8} />
            <text x={pos.x} y={pos.y + (node.is_center ? 8 : 6)} textAnchor="middle"
              fontSize={node.is_center ? 18 : 15} fontWeight="800" fill={col.text}
              dominantBaseline="middle" style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}>
              {node.gap_percentage}%
            </text>
            <text x={pos.x} y={pos.y - (node.is_center ? 16 : 12)} textAnchor="middle"
              fontSize={node.is_center ? 10 : 9} fontWeight="700" fill={col.text}
              dominantBaseline="middle" style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}>
              {node.name}
            </text>
          </g>
        );
      })}
      {[
        { color: "#66BB6A", label: "ดี (70% ขึ้นไป)" },
        { color: "#FFB74D", label: "ปานกลาง (40–69%)" },
        { color: "#EF9A9A", label: "ต้องพัฒนา (ต่ำกว่า 40%)" },
      ].map((item, i) => (
        <g key={i} transform={`translate(${10 + i * 155}, 444)`}>
          <circle cx={5} cy={0} r={5} fill={item.color} />
          <text x={14} y={4} fontSize="9.5" fill="#6D5147" style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}>
            {item.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── Current Level Panel ────────────────────────────────────────────────────────
function CurrentLevelPanel({ centerNode, theme }: { centerNode: SkillGapNode; theme: Theme }) {
  const pct = centerNode.gap_percentage;
  const label = pct >= 70 ? "สูง" : pct >= 40 ? "ปานกลาง" : "ต่ำ";
  return (
    <div style={{ background: "white", border: "1px solid #ede8e2", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <p style={{ fontSize: 12, color: "#9a8f87", fontWeight: 600, margin: "0 0 8px", fontFamily: "'Noto Sans Thai', sans-serif" }}>
          ระดับปัจจุบันของคุณ
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 52, fontWeight: 900, color: theme.accent, lineHeight: 1 }}>{pct}%</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: theme.accent }}>{label}</span>
        </div>
        <div style={{ margin: "12px 0 4px" }}>
          <div style={{ width: "100%", height: 10, borderRadius: 5, background: "#f0ebe6", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 5, width: `${pct}%`, background: theme.accent, transition: "width 0.8s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 10, color: "#9a8f87" }}>0%</span>
            <span style={{ fontSize: 10, color: "#9a8f87" }}>100%</span>
          </div>
        </div>
      </div>
      <div style={{ background: theme.accentLight, border: `1px solid ${theme.accentMid}`, borderRadius: 12, padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: theme.accentText, margin: "0 0 4px", fontFamily: "'Noto Sans Thai', sans-serif" }}>
            หมายความว่าอะไร?
          </p>
          <p style={{ fontSize: 12, color: theme.accentText, lineHeight: 1.6, margin: 0, fontFamily: "'Noto Sans Thai', sans-serif" }}>
            {centerNode.description ?? "คุณมีพื้นฐานความเข้าใจในสาขานี้ระดับหนึ่ง แต่ยังขาดทักษะเฉพาะด้านบางส่วน หากพัฒนาเพิ่มเติมจะแข็งแกร่งมากขึ้นมาก!"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── PDF ────────────────────────────────────────────────────────────────────────
async function generatePDF(element: HTMLElement) {
  const { jsPDF } = await import("jspdf");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = 210;
  const pdfHeight = 297;

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;

    pdf.addPage();
    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pdfHeight;
  }

  pdf.save("CARIA_Report.pdf");
}

// ─── Inner Page ─────────────────────────────────────────────────────────────────
function SkillsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
const pdfRef = useRef<HTMLDivElement>(null);
  const [competencyId, setCompetencyId] = useState<string>("");
  const [careerName, setCareerName] = useState<string>("");
  const [sector, setSector] = useState<string>("DT");

  const [nodes, setNodes] = useState<SkillGapNode[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [careerDetails, setCareerDetails] = useState<CareerDetail[]>([]);

  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SkillGapNode | null>(null);

  const instFlyToRef = useRef<((lat: number, lng: number) => void) | null>(null);
  const jobFlyToRef = useRef<((lat: number, lng: number) => void) | null>(null);

  useEffect(() => {
    const sectorParam = searchParams.get("sector") ?? "DT";
    setSector(sectorParam);
    const raw = sessionStorage.getItem("caria_result");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const top = parsed.recommendations?.[0];
        if (top?.careerId) {
          setCompetencyId(top.careerId);
          setCareerName(top.name ?? "");
          setSector(parsed.sector ?? sectorParam);
          return;
        }
      } catch {}
    }
    setCompetencyId(sectorParam === "DC" ? "DC09" : "DT01");
  }, []);

  useEffect(() => {
    if (!competencyId) return;
    async function load() {
      setLoading(true);
      const [
        { data: nodesData },
        { data: courseData },
        { data: jobData },
        { data: instData },
        { data: detailData },
      ] = await Promise.all([
        supabase.from("skill_gap_nodes").select("*").eq("career_competency_id", competencyId).order("is_center", { ascending: false }),
        supabase.from("courses").select("*").eq("career_competency_id", competencyId).limit(3),
        supabase.from("job_listings").select("*").eq("career_competency_id", competencyId).limit(3),
        supabase.from("institutions").select("*").eq("career_competency_id", competencyId),
        supabase.from("career_details").select("*").eq("career_competency_id", competencyId),
      ]);
      const nodeList = (nodesData ?? []) as SkillGapNode[];
      const jobList = (jobData ?? []) as JobListing[];
      setNodes(nodeList);
      setCourses((courseData ?? []) as Course[]);
      setInstitutions((instData ?? []) as Institution[]);
      setCareerDetails((detailData ?? []) as CareerDetail[]);
      setSelectedNode(nodeList.find((n) => n.is_center) ?? nodeList[0] ?? null);
      setLoading(false);
      enrichJobsWithCoords(jobList).then(setJobs);
    }
    load();
  }, [competencyId]);

  const theme = THEMES[sector] ?? THEMES.DT;
  const centerNode = nodes.find((n) => n.is_center) ?? null;

  const instMarkers = institutions
    .filter((i) => i.latitude && i.longitude)
    .map((inst) => ({
      id: inst.id,
      lat: inst.latitude,
      lng: inst.longitude,
      iconHtml: `<div style="width:32px;height:32px;border-radius:50%;background:${inst.is_online ? "#0f6e56" : theme.accent};display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid #fff">${inst.is_online ? "💻" : "📍"}</div>`,
      popupHtml: `<div style="font-family:'Noto Sans Thai',sans-serif;min-width:180px">
        <b style="font-size:13px">${inst.name}</b><br/>
        <span style="font-size:11px;color:#666">${inst.program}</span><br/>
        <span style="font-size:10px;background:#f0ebe6;padding:2px 8px;border-radius:999px">${inst.institution_type}</span>
        ${inst.is_online ? '<span style="font-size:10px;background:#DCFCE7;color:#15803D;padding:2px 8px;border-radius:999px;margin-left:4px">Online</span>' : ""}
        <br/><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(inst.name)}&query_place=${inst.latitude},${inst.longitude}" target="_blank" rel="noopener noreferrer" style="font-size:11px;color:#4a6fc4;margin-top:6px;display:inline-block">🗺 เปิดใน Google Maps</a>
      </div>`,
    }));

  const jobMarkers = jobs
    .filter((j) => j.company_lat && j.company_lng)
    .map((job) => {
      const bg = getCompBg(job.company);
      const abbr = job.company.replace(/\s*(Thailand|Co\..*|Ltd\..*)/gi, "").slice(0, 3).toUpperCase();
      return {
        id: job.id,
        lat: job.company_lat!,
        lng: job.company_lng!,
        iconHtml: `<div style="width:36px;height:36px;border-radius:8px;background:${bg};display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:900;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid #fff">${abbr}</div>`,
        popupHtml: `<div style="font-family:'Noto Sans Thai',sans-serif;min-width:190px">
          <b style="font-size:13px">${job.title}</b><br/>
          <span style="font-size:11px;color:#666">${job.company}</span><br/>
          <b>฿${job.salary_min.toLocaleString()} – ฿${job.salary_max.toLocaleString()}</b>
          <br/><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.company)}&query_place=${job.company_lat},${job.company_lng}" target="_blank" rel="noopener noreferrer" style="font-size:11px;color:#4a6fc4;margin-top:6px;display:inline-block">🗺 เปิดใน Google Maps</a>
        </div>`,
      };
    });

  const levelStyle: Record<string, { bg: string; color: string }> = {
    Beginner: { bg: "#E8F5E9", color: "#2E7D32" },
    Intermediate: { bg: "#E3F2FD", color: "#1565C0" },
    Advanced: { bg: "#F3E5F5", color: "#6A1B9A" },
  };
  const workBg: Record<string, string> = { Remote: "#E0F2FE", Hybrid: "#F0FDF4", "On-site": "#F1F5F9" };
  const workFg: Record<string, string> = { Remote: "#0369A1", Hybrid: "#15803D", "On-site": "#334155" };
  const card = { background: "white", border: "1px solid #ede8e2", borderRadius: 14 } as const;

  if (loading || !competencyId) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#ececec" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 36, height: 36, border: `3px solid #d0d5e8`, borderTopColor: theme.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ color: "#5a6480", fontSize: 14, fontFamily: "'Noto Sans Thai', sans-serif" }}>กำลังโหลดข้อมูล...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
<div
  ref={pdfRef}
  style={{
    minHeight: "100vh",
    background: "#ececec",
    fontFamily: "'Noto Sans Thai', 'Sarabun', sans-serif",
  }}
>
      <TabNav />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 48px", display: "flex", flexDirection: "column", gap: 32 }}>

        {/* ══ HEADER ══ */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <button
            onClick={() => router.push("/result")}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "white", border: "1px solid #ede8e2",
              color: "#2c2927", cursor: "pointer", flexShrink: 0,
              fontSize: 14, marginTop: 2,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >←</button>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>ทักษะที่ควรพัฒนา</h1>
              {careerName && (
                <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 12px", borderRadius: 999, background: theme.badgeBg, color: theme.badgeText }}>
                  {careerName}
                </span>
              )}
            </div>
            <p style={{ fontSize: 12, color: "#9a8f87", margin: 0 }}>
              สำรวจทักษะ วิเคราะห์ช่องว่าง และวางแผนพัฒนาให้ตรงกับเส้นทางอาชีพของคุณ
            </p>
          </div>
        </div>

        {/* ══ SECTION 1: อาชีพในกลุ่มนี้ ══ */}
        {careerDetails.length > 0 && (
          <div style={{ ...card, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: theme.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                💼
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>อาชีพในกลุ่มนี้</p>
                <p style={{ fontSize: 11, color: "#9a8f87", margin: 0 }}>ตำแหน่งงานที่เกี่ยวข้องกับสมรรถนะ {competencyId}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {careerDetails.map((cd) => (
                <span key={cd.id} style={{
                  fontSize: 12, padding: "5px 14px", borderRadius: 999,
                  background: theme.accentLight, color: theme.accentText,
                  border: `1px solid ${theme.accentMid}`, fontWeight: 500,
                }}>
                  {cd.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ══ SECTION 2: Skill Gap Map ══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18, alignItems: "start" }}>
          <div style={{ ...card, padding: "16px 16px 8px" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px" }}>ทักษะที่ควรพัฒนา</p>
            <div style={{ height: 420 }}>
              {nodes.length > 0 ? (
                <SkillGapMap nodes={nodes} selectedId={selectedNode?.id ?? null} onSelect={setSelectedNode} theme={theme} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 14, color: "#9a8f87" }}>ไม่พบข้อมูล</div>
              )}
            </div>
          </div>
          {centerNode && <CurrentLevelPanel centerNode={centerNode} theme={theme} />}
        </div>

        {/* ══ SECTION 3: สถานที่เรียน ══ */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: "0 0 14px" }}>สถานที่เรียนและฝึกทักษะ</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div style={{ borderRadius: 14, overflow: "hidden", height: 380, border: "1px solid #ede8e2" }}>
              <LeafletMap
                markers={instMarkers}
                onMapReady={(flyTo) => { instFlyToRef.current = flyTo; }}
              />
            </div>
            <div style={{ ...card, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f5f0eb" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>สถาบันที่เปิดสอน</p>
              </div>
              <div style={{ overflowY: "auto", maxHeight: 332 }}>
                {institutions.map((inst) => {
                  const hasCoords = inst.latitude && inst.longitude;
                  return (
                    <div
                      key={inst.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 16px", borderBottom: "1px solid #f5f0eb",
                      }}
                    >
                      <div
                        onClick={() => {
                          if (hasCoords && instFlyToRef.current) {
                            instFlyToRef.current(inst.latitude, inst.longitude);
                          }
                        }}
                        style={{
                          width: 56, height: 56, borderRadius: 10, flexShrink: 0,
                          background: inst.is_online ? "#0f6e5622" : theme.accentLight,
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                          cursor: hasCoords ? "pointer" : "default",
                        }}
                      >
                        {inst.is_online ? "💻" : "🏫"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {inst.name}
                          </p>
                        </div>
                        <p style={{ fontSize: 11, color: "#9a8f87", margin: "2px 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {inst.program} · {inst.province}
                        </p>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "#f5f0eb", color: "#5a6480" }}>
                            {inst.institution_type}
                          </span>
                          {inst.is_online && (
                            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "#DCFCE7", color: "#15803D", fontWeight: 600 }}>
                              Online
                            </span>
                          )}
                          {hasCoords && (
                            <button
                              onClick={() => openGoogleMaps(inst.latitude, inst.longitude, inst.name)}
                              style={{
                                fontSize: 10, padding: "2px 10px", borderRadius: 999,
                                background: "#E8F0FE", color: "#1A73E8",
                                border: "1px solid #c5d8fd", cursor: "pointer",
                                fontWeight: 600, display: "flex", alignItems: "center", gap: 3,
                                fontFamily: "'Noto Sans Thai', sans-serif",
                              }}
                            >
                              🗺 Google Maps
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {institutions.length === 0 && (
                  <p style={{ fontSize: 13, textAlign: "center", padding: "24px 0", color: "#9a8f87" }}>ไม่พบสถาบัน</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══ SECTION 4: แนวทางการเลือกสถาบัน ══ */}
        <div style={{ ...card, padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", margin: "0 0 16px" }}>แนวทางการเลือกสถาบัน</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
            {[
              { icon: "🎯", iconBg: "#FEF3C7", title: "เลือกตามเป้าหมายอาชีพ", desc: "พิจารณาหลักสูตรที่สอดคล้องกับเส้นทางอาชีพของคุณ" },
              { icon: "📚", iconBg: "#EDE9FE", title: "พิจารณารูปแบบการเรียน", desc: "เลือก Online หรือ Onsite ให้เหมาะกับตารางเวลา" },
              { icon: "⏰", iconBg: "#FEE2E2", title: "เทียบค่าใช้จ่ายและเวลา", desc: "เปรียบเทียบค่าใช้จ่าย ระยะเวลา และความคุ้มค่า" },
              { icon: "⭐", iconBg: "#DCFCE7", title: "ดูรีวิวและความน่าเชื่อถือ", desc: "ตรวจสอบรีวิวและการรับรองจากหน่วยงาน" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: item.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px" }}>{item.title}</p>
                  <p style={{ fontSize: 11, color: "#9a8f87", lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ SECTION 5: คอร์ส ══ */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: "0 0 14px" }}>คอร์สที่แนะนำ</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {courses.map((c) => {
              const ls = levelStyle[c.level] ?? levelStyle.Intermediate;
              return (
                <div key={c.id} style={{ ...card, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 10, background: theme.accentLight, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                      🧑‍💻
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 999, background: ls.bg, color: ls.color, display: "inline-block", marginBottom: 5 }}>
                        {c.level}
                      </span>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", margin: 0, lineHeight: 1.3 }}>{c.title}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "#9a8f87" }}>
                    <span>⏱ {c.hours} ชั่วโมง</span>
                    <span style={{ color: "#D97706", fontWeight: 600 }}>★ {Number(c.rating).toFixed(1)}</span>
                    <span>({c.reviews.toLocaleString()})</span>
                  </div>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", padding: "9px 0", borderRadius: 10, background: theme.btnBg, color: theme.btnColor, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                      เริ่มเรียน
                    </a>
                  ) : (
                    <button style={{ padding: "9px 0", borderRadius: 10, border: "none", background: theme.btnBg, color: theme.btnColor, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      เริ่มเรียน
                    </button>
                  )}
                </div>
              );
            })}
            {courses.length === 0 && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "32px 0", color: "#9a8f87" }}>ไม่พบคอร์ส</div>
            )}
          </div>
        </div>

        {/* ══ SECTION 6: บริษัทที่เปิดรับ + Map ══ */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: "0 0 14px" }}>สถานที่ทำงานและบริษัทที่กำลังเปิดรับ</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div style={{ borderRadius: 14, overflow: "hidden", height: 380, border: "1px solid #ede8e2" }}>
              <LeafletMap
                markers={jobMarkers}
                onMapReady={(flyTo) => { jobFlyToRef.current = flyTo; }}
              />
            </div>
            <div style={{ ...card, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f5f0eb" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>บริษัทที่กำลังเปิดรับ</p>
              </div>
              <div style={{ overflowY: "auto", maxHeight: 332 }}>
                {jobs.map((job) => {
                  const bg = getCompBg(job.company);
                  const hasCoords = !!(job.company_lat && job.company_lng);
                  return (
                    <div
                      key={job.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 16px", borderBottom: "1px solid #f5f0eb",
                      }}
                    >
                      <div
                        onClick={() => {
                          if (hasCoords && jobFlyToRef.current) {
                            jobFlyToRef.current(job.company_lat!, job.company_lng!);
                          }
                        }}
                        style={{
                          width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                          background: bg, display: "flex", alignItems: "center",
                          justifyContent: "center", overflow: "hidden",
                          cursor: hasCoords ? "pointer" : "default",
                        }}
                      >
                        <img
                          src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s+/g, "").replace(/thailand|co\.|ltd\./gi, "")}.com`}
                          alt={job.company}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                            const abbr = job.company.slice(0, 3).toUpperCase();
                            (e.target as HTMLImageElement).parentElement!.innerHTML = `<span style="color:#fff;font-weight:900;font-size:11px">${abbr}</span>`;
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{job.company}</p>
                        </div>
                        <p style={{ fontSize: 11, color: "#9a8f87", margin: "2px 0 6px" }}>{job.title}</p>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: 10, padding: "2px 10px", borderRadius: 999, background: workBg[job.work_type] ?? "#F1F5F9", color: workFg[job.work_type] ?? "#334155", fontWeight: 600 }}>
                            {job.work_type}
                          </span>
                          <span style={{ fontSize: 10, padding: "2px 10px", borderRadius: 999, background: "#f5f0eb", color: "#5a6480" }}>
                            {job.job_type}
                          </span>
                          {hasCoords && (
                            <button
                              onClick={() => openGoogleMaps(job.company_lat!, job.company_lng!, job.company)}
                              style={{
                                fontSize: 10, padding: "2px 10px", borderRadius: 999,
                                background: "#E8F0FE", color: "#1A73E8",
                                border: "1px solid #c5d8fd", cursor: "pointer",
                                fontWeight: 600, display: "flex", alignItems: "center", gap: 3,
                                fontFamily: "'Noto Sans Thai', sans-serif",
                              }}
                            >
                              🗺 Google Maps
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {jobs.length === 0 && (
                  <p style={{ fontSize: 13, textAlign: "center", padding: "24px 0", color: "#9a8f87" }}>ไม่พบตำแหน่งงาน</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══ SECTION 7: ตำแหน่งงาน Cards ══ */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: "0 0 14px" }}>ตำแหน่งงาน</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {jobs.map((job) => {
              const bg = getCompBg(job.company);
              const ws = { bg: workBg[job.work_type] ?? "#F1F5F9", color: workFg[job.work_type] ?? "#334155" };
              const hasCoords = !!(job.company_lat && job.company_lng);
              return (
                <div key={`card-${job.id}`} style={{ ...card, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img
                        src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s+/g, "").replace(/thailand|co\.|ltd\./gi, "")}.com`}
                        alt={job.company}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          const abbr = job.company.slice(0, 3).toUpperCase();
                          (e.target as HTMLImageElement).parentElement!.innerHTML = `<span style="color:#fff;font-weight:900;font-size:11px">${abbr}</span>`;
                        }}
                      />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{job.title}</p>
                      <p style={{ fontSize: 11, color: "#9a8f87", margin: 0 }}>{job.company}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", margin: "0 0 8px" }}>
                    ฿{job.salary_min.toLocaleString()} – ฿{job.salary_max.toLocaleString()}
                  </p>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: ws.bg, color: ws.color }}>
                      {job.work_type}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: "#f5f0eb", color: "#5a6480" }}>
                      {job.job_type}
                    </span>
                    {hasCoords && (
                      <button
                        onClick={() => openGoogleMaps(job.company_lat!, job.company_lng!, job.company)}
                        style={{
                          fontSize: 10, padding: "3px 10px", borderRadius: 999,
                          background: "#E8F0FE", color: "#1A73E8",
                          border: "1px solid #c5d8fd", cursor: "pointer",
                          fontWeight: 600, display: "flex", alignItems: "center", gap: 3,
                          fontFamily: "'Noto Sans Thai', sans-serif",
                        }}
                      >
                        🗺 Google Maps
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {jobs.length === 0 && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "32px 0", color: "#9a8f87" }}>ไม่พบตำแหน่งงาน</div>
            )}
          </div>
        </div>

        {/* ── PDF Button ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: 8 }}>
          <button
           onClick={async () => {
  setPdfLoading(true);

  try {
    if (pdfRef.current) {
      await generatePDF(pdfRef.current);
    }
  } catch (e) {
    console.error(e);
    alert("ไม่สามารถสร้าง PDF ได้");
  } finally {
    setPdfLoading(false);
  }
}}
            disabled={pdfLoading}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 22px", borderRadius: 12, border: "none",
              background: pdfLoading ? "#b0a89e" : theme.btnBg,
              color: theme.btnColor, fontSize: 13, fontWeight: 600,
              cursor: pdfLoading ? "not-allowed" : "pointer",
              fontFamily: "'Noto Sans Thai', sans-serif",
            }}
          >
            {pdfLoading ? (
              <>
                <div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                กำลังสร้าง PDF...
              </>
            ) : (
              <>
                ดาวน์โหลดรายงาน PDF
                <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                  <path d="M7.5 2v8M5 7.5l2.5 2.5 2.5-2.5M2 12v.5A1.5 1.5 0 003.5 14h8a1.5 1.5 0 001.5-1.5V12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </div>

      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── Export ─────────────────────────────────────────────────────────────────────
export default function SkillsPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f0eb" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #d0d5e8", borderTopColor: "#4a6fc4", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <SkillsPageInner />
    </Suspense>
  );
}