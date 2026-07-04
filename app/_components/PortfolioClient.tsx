"use client";

import { useState } from "react";
import type { PortfolioData, TroubleItem, StackReason } from "@/lib/types";

const NAV_ITEMS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
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

function StackReasonModal({ projectName, stacks, onClose }: { projectName: string; stacks: StackReason[]; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "680px", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "28px 32px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color: "#9ca3af", textTransform: "uppercase", marginBottom: "6px" }}>{projectName} · Tech Stack</p>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", lineHeight: 1.4 }}>사용 스택과 선택 이유</h2>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "6px" }}>단순히 익숙해서가 아닌, 이유 있는 기술 선택을 지향합니다.</p>
          </div>
          <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: "8px", width: "32px", height: "32px", fontSize: "16px", cursor: "pointer", color: "#6b7280", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {stacks.map((stack, i) => (
            <div key={stack.name} style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px 20px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#3b82f6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0, marginTop: "1px" }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>{stack.name}</p>
                <p style={{ fontSize: "13px", color: "#4b5563", lineHeight: 1.8 }}>{stack.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
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

function StackReasonButton({ projectKey, projectName, stackReasons }: { projectKey: string; projectName: string; stackReasons: Record<string, StackReason[]> }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const stacks = stackReasons[projectKey] ?? [];
  return (
    <>
      <button onClick={() => setOpen(true)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 600, color: hovered ? "#fff" : "#3b82f6", background: hovered ? "#3b82f6" : "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}>
        💡 사용 스택 & 이유
      </button>
      {open && <StackReasonModal projectName={projectName} stacks={stacks} onClose={() => setOpen(false)} />}
    </>
  );
}

export default function PortfolioClient({ data }: { data: PortfolioData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { troubles, stackReasons, otherProjects, experiences, projectImages } = data;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* 사이드바 */}
      <aside style={{ width: "220px", minHeight: "100vh", background: "#111827", color: "#fff", position: "fixed", top: 0, left: 0, bottom: 0, padding: "40px 28px", display: "flex", flexDirection: "column", zIndex: 100 }}>
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "20px", fontWeight: 700 }}>조효동</p>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Backend Developer</p>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} style={{ color: "#d1d5db", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#d1d5db")}>
              {item.label}
            </a>
          ))}
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
              기술을 선택할 때 항상 <strong>"왜 이 기술인가"</strong>를 먼저 고민합니다.
              단순히 데이터베이스 하나를 선택할 때에도 RDBMS와 NoSQL의 차이는 무엇인지,
              각각의 장단점은 무엇인지, 현재 서비스에 어떤 선택이 적합한지를 따져보고 결정합니다.<br />
              동작하는 코드보다 <strong>설명할 수 있는 코드</strong>를 지향합니다.
            </p>
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
              { name: "Python", comment: "개발 입문 언어. FastAPI, Django 및 AI 라이브러리 활용", bullets: ["Django ORM과 FastAPI의 비동기 처리 방식 차이를 이해하고 활용합니다.", "AI 라이브러리(LangChain, OpenAI SDK 등)와 연동한 서버 구축 경험이 있습니다."] },
              { name: "Java", comment: "Spring Boot 기반 서버 개발 주력 언어 / 객체지향 설계 및 이해", bullets: ["Checked/Unchecked Exception 차이를 이해하고 꼼꼼한 예외 처리를 고민하고 설계할 수 있습니다.", "JVM 메모리 구조를 이해하며 JVM만의 차이를 압니다.", "GC 동작 방식을 이해하고 있습니다.", "인터페이스와 추상클래스의 차이를 이해하고 적절히 활용합니다.", "객체지향 4대 원칙과 SOLID 원칙을 이해하고 코드 설계에 적용합니다.", "제네릭, 스트림, 람다 등 Java 문법을 활용한 개발 경험이 있습니다."] },
            ]},
            { category: "Framework", skills: [
              { name: "Spring Boot", comment: "JPA, DI 등 Spring 프레임워크에 대한 이해 및 경험", bullets: ["POJO 기반 설계와 스프링 컨테이너 동작 원리, Bean 등록 방식과 DI를 이해하고 활용합니다.", "DTO/VO/Entity를 구분하여 레이어드 아키텍처 기반 설계 경험이 있습니다.", "SOLID 원칙을 적용한 객체지향적 코드 설계를 지향합니다.", "Spring Security + JWT 기반 인증/인가 및 OAuth2.0 소셜 로그인 연동 경험이 있습니다.", "JPA 엔티티 설계, 연관관계 매핑, N+1 해결(fetch join / batch size) 경험이 있습니다.", "QueryDSL을 활용한 동적 쿼리 작성 경험이 있습니다.", "@ControllerAdvice를 활용한 글로벌 예외 처리 설계 경험이 있습니다.", "JUnit5, Mockito를 활용한 단위 테스트 및 통합 테스트 작성 경험이 있습니다."] },
              { name: "FastAPI", comment: "Python 생태계(LangChain, RAG 등)와 연동한 AI 백엔드 서버 구축 경험", bullets: ["asyncio 기반 이벤트 루프 동작 방식을 이해합니다.", "LangChain / LangGraph와 연동한 AI 추론 엔드포인트 설계 경험이 있습니다.", "Pydantic을 활용한 요청/응답 스키마 정의 및 자동 문서화 경험이 있습니다.", "비동기(async/await) 기반 AI 추론 서버 구축 경험이 있습니다."] },
            ]},
            { category: "Database", skills: [
              { name: "MySQL", comment: "스키마 설계 / 인덱스 최적화 및 쿼리 튜닝 경험", bullets: ["트랜잭션 격리 수준의 차이를 이해하고 있습니다.", "낙관적 락 / 비관적 락 차이를 이해하고 동시성 제어에 적용합니다.", "정규화 기반의 스키마 설계 경험이 있습니다.", "인덱스 설계를 통한 쿼리 성능 최적화 경험이 있습니다.", "실행 계획(EXPLAIN)을 활용한 쿼리 튜닝 경험이 있습니다."] },
              { name: "PostgreSQL", comment: "AI 프로젝트에서 주로 활용 / 벡터 DB 활용", bullets: ["JSONB 타입을 활용한 반정형 데이터 저장 경험이 있습니다.", "pgvector를 활용한 벡터 유사도 검색 구현 경험이 있습니다.", "RAG 파이프라인에서 임베딩 저장소로 활용한 경험이 있습니다."] },
            ]},
            { category: "Infra / DevOps", skills: [
              { name: "AWS", comment: "EC2, RDS, S3 등 활용한 전반적인 서비스 배포 경험", bullets: ["VPC, 서브넷, 라우팅 테이블을 설정한 네트워크 구성을 할 수 있습니다.", "ECR을 활용한 Docker 이미지 관리 및 배포 경험이 있습니다.", "S3를 활용한 정적 파일 저장 및 관리가 가능합니다.", "ACM & ALB를 이용한 트래픽 분산 및 HTTPS 설정 경험이 있습니다."] },
              { name: "Docker", comment: "컨테이너화를 통한 환경 일관성 확보 및 서비스 배포 자동화 경험", bullets: ["멀티 스테이지 빌드를 활용한 이미지 경량화 경험이 있습니다.", "Docker Compose를 활용한 멀티 컨테이너 환경 구성 경험이 있습니다."] },
              { name: "GitHub Actions", comment: "CI/CD 파이프라인 구성 / PR 자동 빌드 및 배포 경험", bullets: ["Docker 이미지 빌드 및 ECR 푸시 자동화 경험이 있습니다.", "단일 EC2 환경에서 컨테이너 교체 기반 Blue-Green 무중단 배포 및 헬스체크 실패 시 자동 롤백 구조를 구현한 경험이 있습니다.", "무중단 배포 방식의 차이와 장단점에 대해 이해하고 있습니다.", "배포 결과 자동 알림(Discord)로 팀과 공유합니다."] },
            ]},
            { category: "Collaboration", skills: [
              { name: "Git", comment: "코드리뷰 기반 협업 및 전반적인 Git Flow 이해", bullets: ["Squash merge, Rebase 등 다양한 머지 전략의 차이를 인지하고 있습니다.", "코드 리뷰 기반 협업 경험이 있습니다.", "프로젝트 시작 전, 그라운드 룰 세팅을 통해 팀 내 컨벤션을 지킵니다."] },
            ]},
            { category: "AI", skills: [
              { name: "RAG", comment: "문서 기반 검색 증강 생성 파이프라인 구축 경험", bullets: ["문서 청킹, 임베딩, 벡터 검색 파이프라인을 직접 구축한 경험이 있습니다.", "청킹 전략(고정 크기, 문장 단위, 재귀적 분할)을 비교하고 적용한 경험이 있습니다.", "특히 ETL 파이프라인에서 유사도 검색을 최적화하기 위해 노력했습니다.", "검색 품질 향상을 위한 프롬프트 엔지니어링 경험이 있습니다."] },
              { name: "LangGraph", comment: "상태 기반 AI 워크플로우 설계 및 구현", bullets: ["상태 기반 워크플로우(State Graph)를 설계하고 구현한 경험이 있습니다.", "조건 분기 노드를 활용한 AI 에이전트 흐름 제어 경험이 있습니다."] },
              { name: "MCP", comment: "백엔드 서버와 AI 모델 간 컨텍스트 프로토콜 연동 및 Smithery AI 배포 경험", bullets: ["백엔드 서버와 AI 모델 간 컨텍스트 프로토콜 연동 경험이 있습니다.", "Tool 정의 및 스키마 설계를 통한 AI 모델과의 인터페이스 구현 경험이 있습니다.", "Smithery AI를 통한 MCP 서버 배포 경험이 있습니다."] },
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

        {/* PROJECTS */}
        <section id="projects" style={{ padding: "80px 60px", background: "#fff" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Projects</h2>
          <div style={{ width: "40px", height: "3px", background: "#3b82f6", marginBottom: "32px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

            {/* CLUSTAR */}
            <div style={{ border: "1px solid #e5e7eb", borderRadius: "14px", padding: "32px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {projectImages.CLUSTAR && <ProjectThumbnail src={projectImages.CLUSTAR} alt="CLUSTAR 대표 이미지" />}
                  <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>CLUSTAR</h3>
                  <span style={{ fontSize: "11px", fontWeight: 700, background: "#fef3c7", color: "#d97706", padding: "2px 8px", borderRadius: "20px" }}>SOPT</span>
                </div>
                <span style={{ fontSize: "12px", color: "#9ca3af", flexShrink: 0, marginLeft: "16px", paddingTop: "3px" }}>2026.01 ~ 진행중</span>
              </div>
              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px", marginTop: "6px" }}>흩어진 메모를 빛나는 결과물로 — Spring AI + RAG 기반 AI 메모 정리 및 구조화 서비스</p>
              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                <a href="https://github.com/TEAM-CLUSTAR/CLUSTAR-SERVER" target="_blank" style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>GitHub →</a>
              </div>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#3b82f6", marginBottom: "10px" }}>내가 기여한 일</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { category: "AI 핵심 기능 (RAG)", items: ["Spring AI + RAG 기반 AI 메모 생성 시스템 설계 및 구현", "검색 품질 향상을 위한, 문서 청킹 · 임베딩 · 벡터 검색으로 이어지는 ETL 파이프라인 설계 및 최적화", "AI 채팅 호출 실패 시 최대 3회 자동 재시도, 모두 실패하면 실패 기록을 남겨 장애 대응 체계 구축", "Resilience4j와 직접 구현 방식의 장단점을 비교 분석 후 retry 방식으로 결정", "시스템 프롬프트 반복 고도화로 생성 품질 개선"] },
                  { category: "테스트 & 안정성", items: ["Repository · Service · Controller 계층별 단위 테스트 작성", "nGrinder 성능 테스트를 위한 전용 프로파일 구성 — 로깅 등 운영 오버헤드를 줄이고 Prometheus로 응답시간·에러율 측정", "메모 삭제 시 DB-S3 간 데이터 불일치 문제를 이벤트 기반 처리로 해결"] },
                  { category: "CI/CD", items: ["GitHub Actions 기반 CI/CD 파이프라인 구축", "PR merge → Jib기반 이미지 빌드 & ECR 푸시 → EC2 SSH 접속 → Blue-Green 컨테이너 교체 → 헬스체크 통과 시 트래픽 전환 / 실패 시 자동 롤백"] },
                  { category: "파일 · 이미지 처리", items: ["첨부가 무제한이면 스토리지 비용을 예측하기 어려워질 수 있다는 생각에 파일·이미지 용량 및 개수 제한 로직 구현", "Apache Tika 파싱 실패(손상·암호화 파일 등) 시 해당 파일만 건너뛰도록 예외처리해 임베딩 파이프라인 안정성 확보", "File · Image · Text Document 간 메타데이터 키 구조 통일로 RAG 파이프라인 일관성 확보"] },
                  { category: "메모 관련 API", items: ["RESTful한 메모 CRUD API 구현", "RESTful한 AI 메모 생성, 조회 API 구현", "메모 가공용 유틸(마크다운 문법 제거 등) 개발로 정리된 메모의 가독성과 일관성 개선"] },
                ].map((group) => (
                  <div key={group.category}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>{group.category}</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#4b5563", fontSize: "13px", lineHeight: 1.9 }}>
                      {group.items.map((item) => <li key={item} style={{ paddingLeft: "12px" }}>· {item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <div style={{ background: "#f3f4f6", borderRadius: "10px", padding: "16px 20px", marginTop: "20px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#f60101", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Trouble Shooting</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {(troubles.CLUSTAR ?? []).map((t) => <TroubleRow key={t.title} item={t} projectName="CLUSTAR" />)}
                </div>
              </div>
              <div style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>Spring Boot · Spring AI · QueryDSL · PostgreSQL (pgvector) · Redis · AWS S3 · GitHub Actions · GCP</p>
                <StackReasonButton projectKey="CLUSTAR" projectName="CLUSTAR" stackReasons={stackReasons} />
              </div>
            </div>

            {/* NUNCHI */}
            <div style={{ border: "1px solid #e5e7eb", borderRadius: "14px", padding: "32px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {projectImages.NUNCHI && <ProjectThumbnail src={projectImages.NUNCHI} alt="NUNCHI 대표 이미지" />}
                  <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>NUNCHI</h3>
                  <span style={{ fontSize: "11px", fontWeight: 700, background: "#ede9fe", color: "#7c3aed", padding: "2px 8px", borderRadius: "20px" }}>캡스톤디자인</span>
                </div>
                <span style={{ fontSize: "12px", color: "#9ca3af", flexShrink: 0, marginLeft: "16px", paddingTop: "3px" }}>2026.03 ~ 2026.06</span>
              </div>
              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px", marginTop: "6px" }}>말 한마디로 주문 완료 — MCP 기반 LLM Agentic AI 음성 배리어프리 자율주문 키오스크</p>
              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                <a href="https://github.com/CapstoneDgu/NUNCHI-AI" target="_blank" style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>AI Server GitHub →</a>
                <a href="https://github.com/CapstoneDgu/NUNCHI" target="_blank" style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>Backend GitHub →</a>
              </div>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#3b82f6", marginBottom: "10px" }}>내가 기여한 일</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { category: "인프라", items: ["Docker - FastAPI AI 서버 · MCP 서버 · Spring 서버를 별도 컨테이너로 분리해 멀티 서비스 구성"] },
                  { category: "AI 응답 품질 & 안정성", items: ["장바구니 담기 락 충돌 발생 시 짧은 대기 후 자동 재시도 로직 구현으로 동시 요청 안정성 확보", "LLM이 실제로 담기지 않은 메뉴를 담았다고 보고하는 환각을 코드 레벨에서 검증·교정하는 가드 구현 — Tool 호출 결과와 최종 응답을 대조해 불일치 시 정정", "의도 분류기 개선 — 직전 AI 메시지 맥락을 분류 입력에 함께 전달해 \"네\", \"응\" 같은 짧은 응답의 오분류율 감소", "메뉴·가격 환각 방지 — LLM 응답을 Spring API 조회 결과로만 생성하도록 프롬프트·Tool 흐름 강제", "응답 latency 3초 이내 목표로 불필요한 Tool 호출 제거 및 처리 단계별 타이밍 로깅 추가"] },
                  { category: "AI 에이전트 아키텍처 설계 (Python · FastAPI)", items: ["FastAPI 기반 AI 서버 전체 설계 및 구현", "LangGraph 상태 기반 주문 에이전트 설계 — 대화 맥락을 유지하는 상태 전이 구조", "LLM 팩토리 설계로 OpenAI/Gemini 멀티 LLM 공급자 전환 지원", "일반 모드/아바타 모드별 행동 지침 블록을 분리해 동일 에이전트가 두 가지 UX(터치 보조 / 음성 대화 주도)를 모두 처리하도록 프롬프트 구조 리팩토링"] },
                  { category: "MCP 기반 시스템 제어", items: ["FastMCP로 키오스크 도메인 전용 MCP 서버 구현", "LangChain MCP 어댑터로 LangGraph 에이전트에 바인딩", "AI가 메뉴 조회, 장바구니 조작, 주문 확정, 결제처리까지 직접 수행하는 구조 설계"] },
                  { category: "백엔드 서버 (Java · Spring Boot)", items: ["키오스크 기능에 필요한 API 개발", "JPA Specification을 이용한 동적 필터링 구현 — QueryDSL 의존성 추가 없이 다중 선택 조건을 조합 처리"] },
                ].map((group) => (
                  <div key={group.category}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>{group.category}</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#4b5563", fontSize: "13px", lineHeight: 1.9 }}>
                      {group.items.map((item) => <li key={item} style={{ paddingLeft: "12px" }}>· {item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <div style={{ background: "#f3f4f6", borderRadius: "10px", padding: "16px 20px", marginTop: "20px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#f60101", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Trouble Shooting</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {(troubles.NUNCHI ?? []).map((t) => <TroubleRow key={t.title} item={t} projectName="NUNCHI" />)}
                </div>
              </div>
              <div style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>FastAPI · LangGraph · FastMCP · Spring Boot · PostgreSQL · Redis · Docker · Nginx · AWS EC2</p>
                <StackReasonButton projectKey="NUNCHI" projectName="NUNCHI" stackReasons={stackReasons} />
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
