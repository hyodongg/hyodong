"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { PortfolioData, TroubleItem } from "@/lib/types";

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

function TroubleModal({ projectName, item, onClose }: { projectName: string; item: TroubleItem; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "680px", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" }}>
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
                  {item[sec.key].map((line, i) => (
                    <li key={i} style={{ fontSize: "13px", color: "#374151", lineHeight: 1.75, display: "flex", gap: "8px", alignItems: "flex-start" }}>
                      <span style={{ color: "#d1d5db", flexShrink: 0, marginTop: "1px", fontSize: "10px" }}>▸</span>
                      <span>{line}</span>
                    </li>
                  ))}
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

export default function PortfolioClient({ data }: { data: PortfolioData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { troubles, otherProjects, experiences, projectImages } = data;

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
          <p style={{ fontSize: "20px", fontWeight: 700 }}>조효동</p>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Backend Developer</p>
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
        <div style={{ marginTop: "auto", fontSize: "11px", color: "#6b7280" }}>© 2026 조효동</div>
      </aside>

      {/* 모바일 헤더 */}
      <div style={{ display: "none", position: "fixed", top: 0, left: 0, right: 0, background: "#111827", color: "#fff", padding: "16px 20px", zIndex: 200, justifyContent: "space-between", alignItems: "center" }} className="mobile-header">
        <span style={{ fontWeight: 700 }}>조효동</span>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer" }}>☰</button>
      </div>

      <main style={{ marginLeft: "220px", flex: 1 }} className="main-content">

        {/* HERO */}
        <section id="home" style={{ minHeight: "100vh", background: "#111827", color: "#fff", display: "flex", alignItems: "center", padding: "60px 60px" }}>
          <div>
            <h1 style={{ fontSize: "42px", fontWeight: 700, lineHeight: 1.4, marginBottom: "24px" }}>
              안녕하세요,<br />
              저는 <span style={{ color: "#60a5fa" }}>백엔드 개발자</span>를<br />
              꿈꾸고 있는 <span style={{ color: "#fff" }}>조효동</span>입니다.
            </h1>
            <p style={{ color: "#9ca3af", fontSize: "16px", lineHeight: 2 }}>
              <span style={{ color: "#60a5fa", fontWeight: 600 }}>끊임없이</span> 배우고 성장하는 것을 즐깁니다.<br />
              오늘도 더 나은 백엔드 개발자가 되기 위해 배움을 이어가고 있습니다.
            </p>
            <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
              <a href="#projects" style={{ background: "#3b82f6", color: "#fff", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>Projects →</a>
              <a href="https://github.com/hyodongg" target="_blank" style={{ border: "1px solid #374151", color: "#d1d5db", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontSize: "14px" }}>GitHub</a>
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
              <a href="https://github.com/hyodongg" target="_blank" style={{ color: "#3b82f6", fontSize: "14px" }}>github.com/hyodongg</a>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Blog</p>
              <a href="https://velog.io/@hyodongg/posts" target="_blank" style={{ color: "#3b82f6", fontSize: "14px" }}>velog.io/@hyodongg</a>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Notion</p>
              <a href="https://app.notion.com/p/Who-is-26a0011f8b8a804eaa02d3df1d2fd2a1" target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", fontSize: "14px" }}>Who is 조효동?</a>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Email</p>
              <a href="mailto:whgyehdjhd@naver.com" style={{ color: "#3b82f6", fontSize: "14px" }}>whgyehdjhd@naver.com</a>
            </div>
          </div>
          <p style={{ fontSize: "16px", fontWeight: 600, color: "#111827", marginBottom: "32px" }}>안녕하세요, 백엔드 개발자 조효동입니다.</p>
          <div style={{ marginBottom: "28px" }}>
            <p style={{ color: "#3b82f6", fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>자신에 몰입하고, 배움을 공유하며, 함께 성장하는 것을 좋아합니다.</p>
            <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: 1.9 }}>
              개인 블로그를 운영하며 컴퓨터과학 기초 지식을 스스로 정리하고 공유하고 있습니다.
              프로젝트 진행 시에는 노션을 통해 새로 알게 된 기술들을 팀원과 공유하고,
              트러블슈팅 과정을 함께 기록하며 서로의 생각을 나누는 것을 즐깁니다.<br />
              현재까지 <strong>노션에 30+개의 문서</strong>로 개발 지식과 트러블슈팅을 작성해두었으며, 이를 블로그로 옮기는 과정 중에 있습니다.
            </p>
          </div>
          <div>
            <p style={{ color: "#3b82f6", fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>이유있는 개발을 지향합니다.</p>
            <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: 1.9 }}>
              기술을 선택할 때 항상 <strong>“왜 이 기술인가”</strong>를 먼저 고민합니다.
              단순히 데이터베이스 하나를 선택할 때에도 RDBMS와 NoSQL의 차이는 무엇인지,
              각각의 장단점은 무엇인지, 현재 서비스에 어떤 선택이 적합한지를 따져보고 결정합니다.<br />
              동작하는 코드보다 <strong>설명할 수 있는 코드</strong>를 지향합니다.
            </p>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" style={{ padding: "80px 60px", background: "#fff" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Projects</h2>
          <div style={{ width: "40px", height: "3px", background: "#3b82f6", marginBottom: "32px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

            {/* CLUSTAR */}
            <div style={{ border: "1px solid #e5e7eb", borderRadius: "14px", padding: "32px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {projectImages.CLUSTAR && <ProjectThumbnail src={`/api/image/CLUSTAR?v=${encodeURIComponent(projectImages.CLUSTAR)}`} alt="CLUSTAR 대표 이미지" />}
                  <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>CLUSTAR</h3>
                  <span style={{ fontSize: "11px", fontWeight: 700, background: "#fef3c7", color: "#d97706", padding: "2px 8px", borderRadius: "20px" }}>SOPT</span>
                </div>
                <span style={{ fontSize: "12px", color: "#9ca3af", flexShrink: 0, marginLeft: "16px", paddingTop: "3px" }}>2026.01 ~ 진행중</span>
              </div>
              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px", marginTop: "6px" }}>
                흩어진 메모를 빛나는 결과물로.<br />
                AI가 메모를 구조화, 요약해주고, 검색과 유사 메모 추천까지 도와주는 Spring AI + RAG 기반 메모 정리 서비스입니다.
              </p>
              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                <a href="https://github.com/TEAM-CLUSTAR/CLUSTAR-SERVER" target="_blank" style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>GitHub →</a>
                <a href="https://www.clustar.cloud/landing" target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>서비스 바로가기 →</a>
              </div>
              {/* 내 역할 */}
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>내 역할</p>
              <p style={{ fontSize: "13px", color: "#4b5563", lineHeight: 1.7, marginBottom: "18px" }}>
                Spring AI를 활용해 RAG 검색 파이프라인을 설계하고, 배포·장애 대응·성능 테스트까지 서버 전반을 담당했습니다.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "18px" }}>
                <RoleHighlight num={1} title="RAG 검색 파이프라인 직접 구축">
                  문서 청킹 → 임베딩 → 벡터 검색으로 이어지는 ETL을 설계하고, 청킹 전략을 비교해 문서마다 다르게 적용함으로써 효율적인 임베딩이 이뤄지도록 했습니다. RAG 평가 지표를 통해 응답이 검색 문맥과 얼마나 맞물리는지 검증했습니다.
                </RoleHighlight>
                <RoleHighlight num={2} title="AI 호출 장애 대응 체계 구축">
                  AI 채팅 호출 실패 시 재시도 로직을 구현하고, 실패 시 그 이력을 남겨 추후 추적 및 재처리가 가능하게 만들었습니다.
                </RoleHighlight>
                <RoleHighlight num={3} title="무중단 배포 파이프라인 구성">
                  GitHub Actions로 PR merge → Jib 이미지 빌드 → ECR 푸시 → EC2 Blue-Green 컨테이너 교체 → 헬스체크 통과 시 트래픽 전환 흐름을 구성했고, 헬스체크 실패 시 자동 롤백되도록 했습니다.
                </RoleHighlight>
              </div>
              <Collapsible label="기여 내용 전체 보기">
                <div style={{ background: "#fff", border: "1px solid #eef0f2", borderRadius: "10px", padding: "16px 18px" }}>
                  <ContribGroup category="테스트 & 안정성" items={["Repository · Service · Controller 계층별 단위 테스트 작성", "nGrinder 전용 프로파일로 부하 테스트 환경을 구성하고, Prometheus로 p95 응답시간·에러율 측정 및 향상", "메모 삭제 시 DB-S3 데이터 불일치를 이벤트 기반 처리로 해결"]} />
                  <ContribGroup category="파일 · 이미지 처리" items={["스토리지 비용을 고려해 파일·이미지 용량 및 개수 제한 로직 구현", "임베딩 실패 시 해당 파일만 건너뛰도록 처리해 임베딩 파이프라인 중단 방지 및 안정성 향상", "File · Image · Text Document 간 메타데이터 및 구조 통일"]} />
                  <ContribGroup category="API" items={["메모 CRUD / AI 메모 생성·조회 RESTful API 구현", "마크다운 문법 제거 등 메모 가공 유틸 개발", "시스템 프롬프트 반복 고도화로 생성 품질 개선"]} />
                </div>
              </Collapsible>

              {/* 기술 스택 */}
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", margin: "22px 0 10px" }}>기술 스택</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {["Spring Boot", "Spring AI", "QueryDSL", "PostgreSQL (pgvector)", "Redis", "AWS S3", "GitHub Actions", "GCP"].map((s) => <Chip key={s} label={s} />)}
              </div>
              <div style={{ marginTop: "6px" }}>
                <Collapsible label="기술 스택 선정 이유">
                  <div style={{ background: "#fff", border: "1px solid #eef0f2", borderRadius: "10px", padding: "18px 20px 4px" }}>
                    <StackReasonRow name="Spring Boot">빠른 서버 구성과 검증된 생태계(JPA, Security)를 갖췄고, AI 기능 연동 시 Spring AI 모듈을 같은 애플리케이션에 그대로 얹을 수 있어 선택했습니다.</StackReasonRow>
                    <StackReasonRow name="Spring AI">FastAPI로 AI 서버를 따로 분리하는 방법도 있었지만, Spring 진영 공식 AI 통합 라이브러리라 Spring Boot와 AutoConfiguration이 자연스럽게 맞물립니다. 팀 전원이 Spring에 익숙해 유지보수 부담이 적다는 점에서 선택했습니다.</StackReasonRow>
                    <StackReasonRow name="QueryDSL">메모 검색 조건이 태그, 날짜, 키워드 등 다양한 필터의 조합이라, JPQL 문자열로 동적 쿼리를 짜면 타입 안전성이 없고 유지보수가 어렵습니다. QueryDSL로 자바 코드에서 타입 세이프하게 동적 쿼리를 작성하기 위해 선택했습니다.</StackReasonRow>
                    <StackReasonRow name="PostgreSQL (pgvector)">Pinecone, Chroma 같은 별도 벡터 DB를 두는 방법도 있지만, 이 경우 외부 서비스 의존성과 비용, 인프라 복잡도가 커집니다. pgvector는 PostgreSQL 확장 기능이라 관계형 데이터와 임베딩 벡터를 하나의 DB, 같은 트랜잭션 안에서 다룰 수 있어 선택했습니다. 규모가 커지면 전용 벡터 DB로 확장할 여지도 남겨 두었습니다.</StackReasonRow>
                    <StackReasonRow name="Redis">RefreshToken을 RDB에 저장하면 인증 요청마다 디스크 I/O가 발생합니다. Redis는 인메모리라 조회가 빠르고 TTL로 토큰 만료를 자동 처리할 수 있어, 리프레시 토큰 저장과 로그아웃 블랙리스트 용도로 선택했습니다.</StackReasonRow>
                    <StackReasonRow name="AWS S3">서버와 독립적인 객체 스토리지라 첨부 파일을 안정적으로 영구 보관할 수 있어 선택했습니다.</StackReasonRow>
                    <StackReasonRow name="GitHub Actions">Jenkins 같은 별도 CI 서버 없이 저장소와 통합돼, PR 머지 → 빌드 → 배포까지 한 흐름으로 자동화할 수 있어 선택했습니다. Jib으로 Docker 데몬 없이 이미지를 빌드해 CI 시간도 줄였습니다.</StackReasonRow>
                    <StackReasonRow name="GCP">모니터링 서버를 애플리케이션과 같은 EC2에 두면, EC2에 장애가 나면 모니터링도 함께 죽어 정작 장애를 확인할 수 없습니다. Prometheus와 Grafana를 GCP에 분리 구성해 EC2와 무관하게 서버 상태를 관측하도록 했고, 비용 절감을 위한 크레딧 활용 차원에서도 GCP가 효율적이었습니다.</StackReasonRow>
                  </div>
                </Collapsible>
              </div>

              {/* Trouble Shooting */}
              <div style={{ background: "#f3f4f6", borderRadius: "10px", padding: "16px 20px", marginTop: "22px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#dc2626", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Trouble Shooting</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {(troubles.CLUSTAR ?? []).map((t) => <TroubleRow key={t.title} item={t} projectName="CLUSTAR" />)}
                </div>
              </div>
            </div>

            {/* NUNCHI */}
            <div style={{ border: "1px solid #e5e7eb", borderRadius: "14px", padding: "32px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {projectImages.NUNCHI && <ProjectThumbnail src={`/api/image/NUNCHI?v=${encodeURIComponent(projectImages.NUNCHI)}`} alt="NUNCHI 대표 이미지" />}
                  <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>NUNCHI</h3>
                  <span style={{ fontSize: "11px", fontWeight: 700, background: "#ede9fe", color: "#7c3aed", padding: "2px 8px", borderRadius: "20px" }}>캡스톤디자인</span>
                </div>
                <span style={{ fontSize: "12px", color: "#9ca3af", flexShrink: 0, marginLeft: "16px", paddingTop: "3px" }}>2026.03 ~ 2026.06</span>
              </div>
              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px", marginTop: "6px" }}>
                말 한마디로 주문 완료.<br />
                MCP 기반 LLM Agentic AI가 음성 대화만으로 메뉴 선택부터 결제까지 처리하는 배리어프리 자율주문 키오스크 서비스입니다.
              </p>
              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                <a href="https://github.com/CapstoneDgu/NUNCHI-AI" target="_blank" style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>AI Server GitHub →</a>
                <a href="https://github.com/CapstoneDgu/NUNCHI" target="_blank" style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>Backend GitHub →</a>
              </div>
              {/* 내 역할 */}
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>내 역할</p>
              <p style={{ fontSize: "13px", color: "#4b5563", lineHeight: 1.7, marginBottom: "18px" }}>
                LLM이 음성 대화만으로 주문과 결제를 수행하는 AI 에이전트 서버를 설계했습니다. Spring Boot로 키오스크 백엔드를 구축하고, FastAPI 기반 AI 서버에 FastMCP로 키오스크 전용 MCP 서버를 붙여 연결했으며, LangGraph로 대화 맥락을 유지하는 agentic AI 흐름을 설계했습니다.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "18px" }}>
                <RoleHighlight num={1} title="LangGraph 기반 주문 에이전트 아키텍처 설계">
                  FastAPI AI 서버 전체를 설계하고, 대화 맥락을 유지하는 상태 전이 구조로 주문 플로우를 구현했습니다.
                </RoleHighlight>
                <RoleHighlight num={2} title="LLM 환각 위험 최소화 및 응답 속도 개선">
                  환각이 생길 수 있는 지점을 코드 레벨에서 차단했습니다. SSE 스트리밍을 도입해 첫 응답 체감 지연이 3.1초였던 것을 0.7초(TTFB 690ms)로 78% 단축했고, 직전 발화 컨텍스트를 주입해 짧은 응답(‘네/응/아니요’)의 의도 오분류율을 65%에서 0%로 개선했습니다.
                </RoleHighlight>
                <RoleHighlight num={3} title="MCP로 AI가 키오스크를 직접 조작하는 구조 구현">
                  FastMCP로 키오스크 도메인 전용 MCP 서버를 만들고 LangChain MCP 어댑터로 에이전트에 바인딩해, AI가 메뉴 조회부터 장바구니 조작·주문 확정·결제까지 직접 수행하도록 했습니다.
                </RoleHighlight>
              </div>
              <Collapsible label="기여 내용 전체 보기">
                <div style={{ background: "#fff", border: "1px solid #eef0f2", borderRadius: "10px", padding: "16px 18px" }}>
                  <ContribGroup category="응답 품질 & 안정성" items={["장바구니 락 충돌 시 짧은 대기 후 자동 재시도로 동시 요청 안정성 확보", "의도 분류기에 직전 AI 발화 컨텍스트를 주입해 짧은 응답('네/응/아니요') 의도 오분류 감소", "각 노드에 노드별 권한을 부여해 불필요한 Tool 호출 위험 감소", "SSE 스트리밍 도입으로 AI 첫 응답 체감 속도 개선"]} />
                  <ContribGroup category="AI 아키텍처 · 인프라" items={["일반 모드/아바타 모드 행동 지침 블록을 분리해 하나의 에이전트가 두 UX를 모두 처리하도록 프롬프트 구조 리팩토링", "FastAPI AI 서버 · MCP 서버 · Spring 서버를 별도 컨테이너로 분리"]} />
                  <ContribGroup category="백엔드 (Spring Boot)" items={["키오스크 주문, 결제 등 핵심 기능 API 전반 구현", "Redis 분산락을 도입하여 장바구니 동시성 제어", "JPA Specification 기반 동적 필터링 구현"]} />
                </div>
              </Collapsible>

              {/* 기술 스택 */}
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", margin: "22px 0 10px" }}>기술 스택</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {["FastAPI", "LangGraph", "FastMCP", "Spring Boot", "PostgreSQL", "Redis", "Docker", "Nginx", "AWS EC2"].map((s) => <Chip key={s} label={s} />)}
              </div>
              <div style={{ marginTop: "6px" }}>
                <Collapsible label="기술 스택 선정 이유">
                  <div style={{ background: "#fff", border: "1px solid #eef0f2", borderRadius: "10px", padding: "18px 20px 4px" }}>
                    <StackReasonRow name="FastAPI">LangGraph 에이전트가 async/await 기반이라 동일하게 asyncio 기반 프레임워크가 필요했습니다. 동기 중심의 Django 대신, 비동기 네이티브 지원과 Pydantic 기반 자동 스키마 검증과 문서화를 제공하는 FastAPI를 선택했습니다.</StackReasonRow>
                    <StackReasonRow name="LangGraph">주문은 “메뉴 선택 → 옵션 → 확인 → 결제”로 상태가 이어지는 다단계 흐름입니다. 단순 LangChain 체인으로는 분기 처리와 상태 유지가 어려워, 각 단계를 노드로 정의하고 조건 분기를 명시적으로 그리는 LangGraph의 상태 그래프 구조를 택했습니다. create_react_agent로 각 노드에 Tool 실행 능력을 부여하고, 대화 맥락(state)을 노드 간에 전이시켜 여러 턴에 걸친 주문을 이어가도록 설계했습니다.</StackReasonRow>
                    <StackReasonRow name="FastMCP">키오스크 전용 Tool(메뉴 조회, 장바구니 추가 등)을 LLM에 제공해야 했습니다. FastMCP는 Python 함수에 데코레이터만 붙이면 MCP 서버로 노출돼, Function Calling 스키마를 일일이 정의하지 않아도 에이전트가 바로 인식할 수 있고 표준 프로토콜이라 LLM 공급자를 바꿔도 Tool 정의를 재사용할 수 있어 선택했습니다.</StackReasonRow>
                    <StackReasonRow name="Spring Boot">메뉴, 주문, 결제 같은 핵심 비즈니스 로직은 트랜잭션과 관계형 데이터 관리가 중요해 JPA와 함께 Spring Boot가 가장 적합했습니다. AI 서버(Python)와 역할을 명확히 분리해 각 서버가 자기 책임에만 집중하도록 구성했습니다.</StackReasonRow>
                    <StackReasonRow name="PostgreSQL">메뉴와 옵션이 카테고리 → 메뉴 → 옵션 그룹 → 옵션의 계층 구조라 관계형 DB가 적합했습니다. MySQL 대신 PostgreSQL은 표준 SQL과 제약조건 지원이 강하고, 추후 판매 통계나 집계 확장 시 윈도우 함수와 CTE를 활용할 수 있어 선택했습니다.</StackReasonRow>
                    <StackReasonRow name="Redis">장바구니는 주문으로 이어지지 않으면 버려지는 임시 데이터라 RDB 영속화가 불필요하고 빠른 조회와 삭제가 중요했습니다. 또 AI 서버와 Spring 서버가 함께 참조할 공유 저장소가 필요했고, Redis의 원자적 연산으로 장바구니 동시 접근 충돌(분산 락)도 함께 막았습니다.</StackReasonRow>
                    <StackReasonRow name="Docker">AI 서버(Python)와 백엔드(Java)의 언어와 런타임이 달라 로컬마다 실행 환경이 갈릴 수 있습니다. 컨테이너화로 환경 차이를 원천 차단하고 docker-compose로 두 서버를 함께 관리하기 위해 선택했습니다.</StackReasonRow>
                    <StackReasonRow name="Nginx">AI 서버(8000)와 Spring 서버(8080)를 단일 도메인으로 묶는 리버스 프록시로 사용했습니다. 경로 기반 라우팅(/ai → FastAPI, /api → Spring)으로 클라이언트가 서버 분리 구조를 몰라도 되게 하고, SSL 종단 처리도 Nginx에서 일괄 담당하도록 했습니다.</StackReasonRow>
                    <StackReasonRow name="AWS EC2">캡스톤 특성상 비용 효율이 중요해, AI 서버와 백엔드 서버를 단일 인스턴스에서 docker-compose로 함께 운영하며 서버 간 통신 지연을 최소화했습니다.</StackReasonRow>
                  </div>
                </Collapsible>
              </div>

              {/* Trouble Shooting */}
              <div style={{ background: "#f3f4f6", borderRadius: "10px", padding: "16px 20px", marginTop: "22px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#dc2626", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Trouble Shooting</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {(troubles.NUNCHI ?? []).map((t) => <TroubleRow key={t.title} item={t} projectName="NUNCHI" />)}
                </div>
              </div>
            </div>
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
            동국대학교 멋쟁이사자처럼을 시작으로 <strong>Python, Django</strong>를 활용해 개발에 처음 입문했습니다.<br />
            이후 Spring 프레임워크에 관심이 생겨 <strong>Java와 Spring Boot</strong>를 온라인 강의로 독학했고, SOPT 연합동아리를 통해 실전 경험을 쌓으며 이해를 높였습니다.<br />
            현재는 AI의 발전에 따라 <strong>Spring 기반 백엔드 서버에 AI 서비스를 결합한 개발</strong>을 해오고 있으며, RAG, LangGraph, MCP 등 AI 기술을 백엔드와 연계하는 방법에 관심이 많습니다.
          </p>
          {[
            { category: "Language", skills: [
              { name: "Python", comment: "개발 입문 언어. FastAPI, Django 및 AI 라이브러리 활용", bullets: ["Django·FastAPI의 동기/비동기 처리 차이를 이해하고, LangChain 등 AI 라이브러리를 연동한 서버를 구축한 경험이 있습니다."] },
              { name: "Java", comment: "Spring Boot 기반 서버 개발 주력 언어 / 객체지향 설계 및 이해", bullets: ["예외 처리, JVM 메모리/GC 구조, 객체지향 4대 원칙과 SOLID를 이해하고 제네릭·스트림·람다 등 문법을 활용해 설계합니다."] },
            ]},
            { category: "Framework", skills: [
              { name: "Spring Boot", comment: "JPA, DI 등 Spring 프레임워크에 대한 이해 및 경험", bullets: ["DI 기반 레이어드 아키텍처 설계부터 JPA 성능 최적화(N+1, QueryDSL), 인증/인가, 예외 처리, 테스트까지 실무 전반을 경험했습니다."] },
              { name: "FastAPI", comment: "Python 생태계(LangChain, RAG 등)와 연동한 AI 백엔드 서버 구축 경험", bullets: ["asyncio 기반 비동기 이벤트 루프를 이해하고, LangGraph 연동 AI 추론 서버와 Pydantic 기반 스키마 설계 경험이 있습니다."] },
            ]},
            { category: "Database", skills: [
              { name: "MySQL", comment: "스키마 설계 / 인덱스 최적화 및 쿼리 튜닝 경험", bullets: ["트랜잭션 격리 수준과 락 전략을 이해하고, 정규화·인덱스 설계 및 EXPLAIN 기반 쿼리 튜닝 경험이 있습니다."] },
              { name: "PostgreSQL", comment: "AI 프로젝트에서 주로 활용 / 벡터 DB 활용", bullets: ["JSONB 기반 반정형 데이터 저장과 pgvector를 활용한 벡터 검색으로 RAG 임베딩 저장소를 구축한 경험이 있습니다."] },
            ]},
            { category: "Infra / DevOps", skills: [
              { name: "AWS", comment: "EC2, RDS, S3 등 활용한 전반적인 서비스 배포 경험", bullets: ["VPC 네트워크 구성부터 ECR·S3·ALB를 활용한 서비스 배포까지 AWS 인프라 전반을 다룬 경험이 있습니다."] },
              { name: "Docker", comment: "컨테이너화를 통한 환경 일관성 확보 및 서비스 배포 자동화 경험", bullets: ["멀티 스테이지 빌드로 이미지를 경량화하고, Docker Compose로 멀티 컨테이너 환경을 구성한 경험이 있습니다."] },
              { name: "GitHub Actions", comment: "CI/CD 파이프라인 구성 / PR 자동 빌드 및 배포 경험", bullets: ["Docker 빌드·배포 자동화와 Blue-Green 무중단 배포·롤백, 배포 알림까지 CI/CD 파이프라인을 구축한 경험이 있습니다."] },
            ]},
            { category: "Collaboration", skills: [
              { name: "Git", comment: "코드리뷰 기반 협업 및 전반적인 Git Flow 이해", bullets: ["다양한 머지 전략을 이해하고, 코드 리뷰와 팀 컨벤션 기반의 협업 경험이 있습니다."] },
            ]},
            { category: "AI", skills: [
              { name: "RAG", comment: "문서 기반 검색 증강 생성 파이프라인 구축 경험", bullets: ["문서 청킹부터 임베딩, 벡터 검색까지 RAG 파이프라인을 직접 구축하고 검색 품질을 개선한 경험이 있습니다."] },
              { name: "LangGraph", comment: "상태 기반 AI 워크플로우 설계 및 구현", bullets: ["상태 기반 워크플로우(State Graph)와 조건 분기 노드를 활용해 AI 에이전트 흐름을 설계한 경험이 있습니다."] },
              { name: "MCP", comment: "백엔드 서버와 AI 모델 간 컨텍스트 프로토콜 연동 및 Smithery AI 배포 경험", bullets: ["Tool 스키마를 설계해 백엔드와 AI 모델 간 MCP 연동을 구현하고 Smithery로 배포한 경험이 있습니다."] },
            ]},
          ].map((group) => (
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
