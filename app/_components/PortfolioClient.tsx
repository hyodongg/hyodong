"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { PortfolioData, TroubleItem, ProjectCore, StackReason } from "@/lib/types";

const NAV_ITEMS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#experiences", label: "Experiences" },
];

const SECTIONS = [
  { key: "situation", label: "문제 상황", color: "#ef4444", dot: "#ef4444" },
  { key: "cause",     label: "원인 분석", color: "#d97706", dot: "#d97706" },
  { key: "solution",  label: "해결 방법", color: "#059669", dot: "#059669" },
  { key: "learned",   label: "배운 점",   color: "#2563eb", dot: "#2563eb" },
] as const;

// 텍스트 내 "\n"은 줄바꿈으로, "**강조**"는 굵게(옵션: 색상 강조)로 렌더링
function RichText({ text, highlightColor }: { text: string; highlightColor?: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, li) => (
        <span key={li}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={i} style={{ color: highlightColor, fontWeight: 700 }}>{part.slice(2, -2)}</strong>
              : <span key={i}>{part}</span>
          )}
          {li < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

// "개선 결과 — <조건>[:] <지표> <이전> → <이후>(약 <n>% 개선) ..." 형태의 줄을 지표 카드로 파싱.
// 콜론·쉼표 유무에 관계없이 동작하도록 구두점에 최대한 관대하게 파싱하고, 패턴에 안 맞으면 null(평범한 텍스트로 표시)
type Improvement = { condition: string; metrics: { label: string; before: string; after: string; pct: string }[] };

function splitConditionFromLabel(rawLabel: string): { condition: string; label: string } {
  const colonIdx = [...rawLabel].findIndex((c) => c === ":" || c === "：");
  if (colonIdx !== -1) {
    return { condition: rawLabel.slice(0, colonIdx).trim(), label: rawLabel.slice(colonIdx + 1).trim() };
  }
  const idx = rawLabel.indexOf("기준");
  if (idx !== -1) {
    return { condition: rawLabel.slice(0, idx + 2).trim(), label: rawLabel.slice(idx + 2).trim() };
  }
  return { condition: "", label: rawLabel.trim() };
}

function parseImprovementLine(line: string): Improvement | null {
  const prefix = line.match(/^개선\s*결과\s*[—-]\s*/);
  if (!prefix) return null;
  const rest = line.slice(prefix[0].length);
  const metricRegex = /([^,→]+?)\s+(\S+)\s*→\s*([^\s(]+)\(약\s*([\d.]+)%\s*개선\)/g;
  const metrics: Improvement["metrics"] = [];
  let m: RegExpExecArray | null;
  while ((m = metricRegex.exec(rest)) !== null) {
    metrics.push({ label: m[1].trim(), before: m[2], after: m[3], pct: m[4] });
  }
  if (metrics.length === 0) return null;

  const { condition, label } = splitConditionFromLabel(metrics[0].label);
  metrics[0] = { ...metrics[0], label: label || metrics[0].label };
  return { condition, metrics };
}

function ImprovementCard({ condition, metrics }: Improvement) {
  return (
    <div style={{ background: "#fafafa", border: "1px solid #eef0f2", borderRadius: "8px", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
      {condition && <p style={{ fontSize: "10.5px", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.2px", margin: 0 }}>{condition}</p>}
      {metrics.map((m, i) => (
        <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap", fontSize: "13px", lineHeight: 1.6 }}>
          <span style={{ color: "#6b7280", flexShrink: 0 }}>{m.label}</span>
          <span style={{ color: "#9ca3af" }}>{m.before}</span>
          <span style={{ color: "#d1d5db" }}>→</span>
          <span style={{ color: "#111827", fontWeight: 600 }}>{m.after}</span>
          <span style={{ color: "#059669", fontSize: "12px" }}>({m.pct}% 개선)</span>
        </div>
      ))}
    </div>
  );
}

function TroubleModal({ projectName, item, onClose }: { projectName: string; item: TroubleItem; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "760px", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "28px 32px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: "#9ca3af", textTransform: "uppercase", marginBottom: "8px" }}>{projectName} · Trouble Shooting</p>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", lineHeight: 1.5 }}>{item.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: "8px", width: "32px", height: "32px", fontSize: "14px", cursor: "pointer", color: "#9ca3af", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ padding: "28px 32px 36px" }}>
          <div style={{ position: "relative", paddingLeft: "28px" }}>
            <div style={{ position: "absolute", left: "7px", top: "6px", bottom: "6px", width: "2px", background: "#e5e7eb" }} />
            {SECTIONS.map((sec, idx) => (
              <div key={sec.key} style={{ position: "relative", marginBottom: idx < SECTIONS.length - 1 ? "28px" : 0 }}>
                <div style={{ position: "absolute", left: "-28px", top: "2px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", border: `2.5px solid ${sec.dot}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: sec.dot }} />
                </div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: sec.color, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "10px" }}>{sec.label}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "7px" }}>
                  {item[sec.key].map((line, i) => {
                    const improvement = sec.key === "solution" ? parseImprovementLine(line) : null;
                    if (improvement) {
                      return (
                        <li key={i} style={{ marginTop: "2px" }}>
                          <ImprovementCard {...improvement} />
                        </li>
                      );
                    }
                    return (
                      <li key={i} style={{ fontSize: "13px", color: "#374151", lineHeight: 1.75, display: "flex", gap: "8px", alignItems: "flex-start", wordBreak: "keep-all" }}>
                        <span style={{ color: "#d1d5db", flexShrink: 0, marginTop: "1px", fontSize: "10px" }}>▸</span>
                        <span>{line}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 프로젝트 "내 역할" 핵심 기여 (번호 + 제목 + 본문)
function RoleHighlight({ num, title, children }: { num: number; title: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <div style={{ fontSize: "15px", fontWeight: 700, color: "#3b82f6", lineHeight: 1.4, flexShrink: 0 }}>{num}</div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>{title}</p>
        <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.75, margin: 0 }}>{children}</p>
      </div>
    </div>
  );
}

// 인라인 펼치기 (▸ 기여 내용 전체 보기 / ▸ 왜 이 스택인가?)
function Collapsible({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "13px", fontWeight: 600, color: hovered || open ? "#2563eb" : "#3b82f6", background: "none", border: "none", padding: "6px 0", cursor: "pointer", transition: "color 0.15s" }}
      >
        <span style={{ fontSize: "10px", transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s", display: "inline-block" }}>▶</span>
        {label}
      </button>
      {open && <div style={{ marginTop: "8px" }}>{children}</div>}
    </div>
  );
}

// 기술 스택 칩
function Chip({ label }: { label: string }) {
  return (
    <span style={{ fontSize: "12px", fontWeight: 500, color: "#374151", background: "#eef2ff", border: "1px solid #e0e7ff", borderRadius: "6px", padding: "4px 10px" }}>{label}</span>
  );
}

// 기술 스택 선정 이유 한 항목: 스택명 + 서술형 이유
function StackReasonRow({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>{name}</p>
      <p style={{ fontSize: "12.5px", color: "#4b5563", lineHeight: 1.75, margin: 0 }}>{children}</p>
    </div>
  );
}

// 카테고리별 상세 불릿 (기여 내용 전체 보기 내부)
function ContribGroup({ category, items }: { category: string; items: string[] }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <p style={{ fontSize: "12px", fontWeight: 700, color: "#6b7280", marginBottom: "5px" }}>{category}</p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#4b5563", fontSize: "12.5px", lineHeight: 1.8 }}>
        {items.map((item) => <li key={item} style={{ paddingLeft: "12px" }}>· {item}</li>)}
      </ul>
    </div>
  );
}

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <img src={src} alt={alt} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "12px", boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }} />
    </div>
  );
}

function ProjectThumbnail({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <img
        src={src}
        alt={alt}
        onClick={() => setOpen(true)}
        style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "8px", cursor: "pointer", flexShrink: 0 }}
      />
      {open && <ImageLightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}

function TroubleRow({ item, projectName }: { item: TroubleItem; projectName: string }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <>
      <div onClick={() => setOpen(true)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "8px", cursor: "pointer", background: hovered ? "#e5e7eb" : "transparent", transition: "background 0.15s", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px" }}>📄</span>
          <p style={{ fontSize: "13px", fontWeight: 500, color: "#111827" }}>{item.title}</p>
        </div>
        <span style={{ fontSize: "11px", color: "#9ca3af", flexShrink: 0 }}>클릭해서 보기 →</span>
      </div>
      {open && <TroubleModal projectName={projectName} item={item} onClose={() => setOpen(false)} />}
    </>
  );
}

// 프로젝트 카드 하나(CLUSTAR / NUNCHI) — core 데이터 + 기술스택(이유) + 트러블슈팅 + 대표이미지를 조합해 렌더링
function ProjectSection({
  projectKey,
  core,
  techStack,
  troubles,
  imageUrl,
}: {
  projectKey: string;
  core: ProjectCore;
  techStack: StackReason[];
  troubles: TroubleItem[];
  imageUrl?: string;
}) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: "14px", padding: "32px", background: "#fafafa" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {imageUrl && <ProjectThumbnail src={`/api/image/${projectKey}?v=${encodeURIComponent(imageUrl)}`} alt={`${core.name} 대표 이미지`} />}
          <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>{core.name}</h3>
          <span style={{ fontSize: "11px", fontWeight: 700, background: core.badgeBg, color: core.badgeColor, padding: "2px 8px", borderRadius: "20px" }}>{core.badgeLabel}</span>
        </div>
        <span style={{ fontSize: "12px", color: "#9ca3af", flexShrink: 0, marginLeft: "16px", paddingTop: "3px" }}>{core.period}</span>
      </div>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px", marginTop: "6px" }}>
        <RichText text={core.tagline} />
      </p>
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        {core.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>{l.label} →</a>)}
      </div>
      {/* 내 역할 */}
      <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>내 역할</p>
      <p style={{ fontSize: "13px", color: "#4b5563", lineHeight: 1.7, marginBottom: "18px" }}>{core.roleSummary}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "18px" }}>
        {core.roleHighlights.map((rh, i) => (
          <RoleHighlight key={i} num={i + 1} title={rh.title}>{rh.desc}</RoleHighlight>
        ))}
      </div>
      <Collapsible label="기여 내용 전체 보기">
        <div style={{ background: "#fff", border: "1px solid #eef0f2", borderRadius: "10px", padding: "16px 18px" }}>
          {core.contribGroups.map((g) => <ContribGroup key={g.category} category={g.category} items={g.items} />)}
        </div>
      </Collapsible>

      {/* 기술 스택 */}
      <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", margin: "22px 0 10px" }}>기술 스택</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {techStack.map((s) => <Chip key={s.name} label={s.name} />)}
      </div>
      <div style={{ marginTop: "6px" }}>
        <Collapsible label="기술 스택 선정 이유">
          <div style={{ background: "#fff", border: "1px solid #eef0f2", borderRadius: "10px", padding: "18px 20px 4px" }}>
            {techStack.map((s) => <StackReasonRow key={s.name} name={s.name}>{s.reason}</StackReasonRow>)}
          </div>
        </Collapsible>
      </div>

      {/* Trouble Shooting */}
      <div style={{ background: "#f3f4f6", borderRadius: "10px", padding: "16px 20px", marginTop: "22px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#dc2626", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Trouble Shooting</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {troubles.map((t) => <TroubleRow key={t.title} item={t} projectName={core.name} />)}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioClient({ data }: { data: PortfolioData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { profile, hero, about, projects, skills, troubles, stackReasons, otherProjects, experiences, projectImages } = data;

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* 사이드바 */}
      <aside style={{ width: "220px", minHeight: "100vh", background: "#111827", color: "#fff", position: "fixed", top: 0, left: 0, bottom: 0, padding: "40px 28px", display: "flex", flexDirection: "column", zIndex: 100 }}>
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "20px", fontWeight: 700 }}>{profile.name}</p>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>{profile.title}</p>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  color: isActive ? "#fff" : "#d1d5db",
                  fontWeight: isActive ? 700 : 400,
                  textDecoration: "none",
                  fontSize: "14px",
                  borderLeft: isActive ? "2px solid #3b82f6" : "2px solid transparent",
                  paddingLeft: "10px",
                  marginLeft: "-10px",
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "#d1d5db"; }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", fontSize: "11px", color: "#6b7280" }}>© {profile.footerYear} {profile.name}</div>
      </aside>

      {/* 모바일 헤더 */}
      <div style={{ display: "none", position: "fixed", top: 0, left: 0, right: 0, background: "#111827", color: "#fff", padding: "16px 20px", zIndex: 200, justifyContent: "space-between", alignItems: "center" }} className="mobile-header">
        <span style={{ fontWeight: 700 }}>{profile.name}</span>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer" }}>☰</button>
      </div>

      <main style={{ marginLeft: "220px", flex: 1 }} className="main-content">

        {/* HERO */}
        <section id="home" style={{ minHeight: "100vh", background: "#111827", color: "#fff", display: "flex", alignItems: "center", padding: "60px 60px" }}>
          <div>
            <h1 style={{ fontSize: "42px", fontWeight: 700, lineHeight: 1.4, marginBottom: "24px" }}>
              안녕하세요,<br />
              저는 <span style={{ color: "#60a5fa" }}>{hero.roleTitle}</span>를<br />
              꿈꾸고 있는 <span style={{ color: "#fff" }}>{profile.name}</span>입니다.
            </h1>
            <p style={{ color: "#9ca3af", fontSize: "16px", lineHeight: 2 }}>
              <RichText text={hero.description} highlightColor="#60a5fa" />
            </p>
            <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
              <a href="#projects" style={{ background: "#3b82f6", color: "#fff", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>Projects →</a>
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" style={{ border: "1px solid #374151", color: "#d1d5db", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontSize: "14px" }}>GitHub</a>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ padding: "80px 60px", background: "#fff" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>About Me</h2>
          <div style={{ width: "40px", height: "3px", background: "#3b82f6", marginBottom: "32px" }} />
          <div style={{ display: "flex", gap: "48px", marginBottom: "40px", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>GitHub</p>
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", fontSize: "14px" }}>{profile.githubUrl.replace(/^https?:\/\//, "")}</a>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Blog</p>
              <a href={profile.blogUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", fontSize: "14px" }}>{profile.blogUrl.replace(/^https?:\/\//, "")}</a>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Notion</p>
              <a href={profile.notionUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", fontSize: "14px" }}>{profile.notionLabel}</a>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Email</p>
              <a href={`mailto:${profile.email}`} style={{ color: "#3b82f6", fontSize: "14px" }}>{profile.email}</a>
            </div>
          </div>
          <p style={{ fontSize: "16px", fontWeight: 600, color: "#111827", marginBottom: "32px" }}>안녕하세요, 백엔드 개발자 {profile.name}입니다.</p>
          {about.blocks.map((block, i) => (
            <div key={i} style={{ marginBottom: i < about.blocks.length - 1 ? "28px" : 0 }}>
              <p style={{ color: "#3b82f6", fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>{block.heading}</p>
              <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: 1.9 }}>
                <RichText text={block.body} />
              </p>
            </div>
          ))}
        </section>

        {/* PROJECTS */}
        <section id="projects" style={{ padding: "80px 60px", background: "#fff" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Projects</h2>
          <div style={{ width: "40px", height: "3px", background: "#3b82f6", marginBottom: "32px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            <ProjectSection projectKey="CLUSTAR" core={projects.CLUSTAR} techStack={stackReasons.CLUSTAR ?? []} troubles={troubles.CLUSTAR ?? []} imageUrl={projectImages.CLUSTAR} />
            <ProjectSection projectKey="NUNCHI" core={projects.NUNCHI} techStack={stackReasons.NUNCHI ?? []} troubles={troubles.NUNCHI ?? []} imageUrl={projectImages.NUNCHI} />
          </div>

          {/* Other Projects */}
          <div style={{ marginTop: "48px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color: "#9ca3af", textTransform: "uppercase", marginBottom: "16px" }}>Other Projects</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
              {otherProjects.map((p) => (
                <div key={p.name} style={{ display: "flex", flexDirection: "column", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px 22px", background: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>{p.emoji} {p.name}</h4>
                    <span style={{ fontSize: "11px", color: "#9ca3af", flexShrink: 0, paddingTop: "2px" }}>{p.period}</span>
                  </div>
                  <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.6, margin: "8px 0 10px" }}>{p.description}</p>
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: "4px 0 12px", lineHeight: 1.6 }}>{p.stack}</p>
                  <div style={{ display: "flex", gap: "12px", marginTop: "auto" }}>
                    {p.links.map((l) => <a key={l.href} href={l.href} target="_blank" style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>{l.label} →</a>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" style={{ padding: "80px 60px", background: "#f9fafb" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Skills</h2>
          <div style={{ width: "40px", height: "3px", background: "#3b82f6", marginBottom: "32px" }} />
          <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: 1.9, marginBottom: "48px" }}>
            <RichText text={skills.intro} />
          </p>
          {skills.groups.map((group) => (
            <div key={group.category} style={{ marginBottom: "36px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color: "#9ca3af", textTransform: "uppercase", marginBottom: "14px" }}>{group.category}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "12px" }}>
                {group.skills.map((skill) => (
                  <div key={skill.name} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px 20px" }}>
                    <p style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{skill.name}</p>
                    <p style={{ color: "#9ca3af", fontSize: "11px", marginBottom: "10px", lineHeight: 1.5 }}>{skill.comment}</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                      {skill.bullets.map((b, i) => (
                        <li key={i} style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.7, display: "flex", gap: "6px" }}>
                          <span style={{ color: "#3b82f6", flexShrink: 0, marginTop: "1px" }}>·</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* EXPERIENCES */}
        <section id="experiences" style={{ padding: "80px 60px", background: "#f9fafb" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Experiences</h2>
          <div style={{ width: "40px", height: "3px", background: "#3b82f6", marginBottom: "32px" }} />
          {experiences.map((group) => (
            <div key={group.category} style={{ marginBottom: "36px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color: group.color, textTransform: "uppercase", marginBottom: "12px" }}>{group.category}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {group.items.map((item) => (
                  <div key={item.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                      <h3 style={{ fontWeight: 600, fontSize: "14px", color: "#111827", margin: 0, lineHeight: 1.5, flex: 1 }}>{item.title}</h3>
                      {item.period && <span style={{ fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap", flexShrink: 0, paddingTop: "1px" }}>{item.period}</span>}
                    </div>
                    {item.desc && <p style={{ color: "#9ca3af", fontSize: "11px", lineHeight: 1.7, marginTop: "6px", marginBottom: 0 }}>{item.desc}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

      </main>

      <style>{`
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        p, h1, h2, h3, ul { margin: 0; padding: 0; }
        @media (max-width: 768px) {
          aside { display: none !important; }
          .mobile-header { display: flex !important; }
          .main-content { margin-left: 0 !important; padding-top: 56px; }
          section { padding-left: 24px !important; padding-right: 24px !important; }
          h1 { font-size: 28px !important; }
        }
      `}</style>
    </div>
  );
}
