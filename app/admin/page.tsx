"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  PortfolioData, TroubleItem, StackReason, OtherProject, ExperienceGroup, ExperienceItem,
  ProjectCore, RoleHighlightItem, ContribGroupItem, SkillGroup, SkillItem, AboutBlock,
} from "@/lib/types";

// ─── empty-value helpers ─────────────────────────────────────────────────────

function emptyTrouble(): TroubleItem {
  return { title: "", situation: [""], cause: [""], solution: [""], learned: [""] };
}
function emptyStack(): StackReason {
  return { name: "", reason: "" };
}
function emptyProject(): OtherProject {
  return { name: "", emoji: "", period: "", description: "", stack: "", links: [] };
}
function emptyExpItem(): ExperienceItem {
  return { title: "", period: "", desc: "" };
}
function emptyExpGroup(): ExperienceGroup {
  return { category: "", color: "#6b7280", items: [] };
}
function emptyRoleHighlight(): RoleHighlightItem {
  return { title: "", desc: "" };
}
function emptyContribGroup(): ContribGroupItem {
  return { category: "", items: [""] };
}
function emptySkill(): SkillItem {
  return { name: "", comment: "", bullets: [""] };
}
function emptySkillGroup(): SkillGroup {
  return { category: "", skills: [] };
}
function emptyAboutBlock(): AboutBlock {
  return { heading: "", body: "" };
}

// ─── primitive field components ──────────────────────────────────────────────

function Field({ label, value, onChange, multiline, hint }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; hint?: string }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label className="adm-label">{label}</label>
      {multiline
        ? <textarea rows={4} className="adm-input" value={value} onChange={e => onChange(e.target.value)} />
        : <input className="adm-input" value={value} onChange={e => onChange(e.target.value)} />}
      {hint && <p className="adm-hint">{hint}</p>}
    </div>
  );
}

function ListField({ label, items, onChange, multiline }: { label: string; items: string[]; onChange: (v: string[]) => void; multiline?: boolean }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <label className="adm-label" style={{ marginBottom: 0 }}>{label}</label>
        <button onClick={() => onChange([...items, ""])} className="adm-link-btn">+ 항목 추가</button>
      </div>
      {items.map((val, i) => (
        <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "6px", alignItems: "flex-start" }}>
          {multiline
            ? <textarea rows={2} className="adm-input adm-input-sm" value={val} onChange={e => { const next = [...items]; next[i] = e.target.value; onChange(next); }} />
            : <input className="adm-input adm-input-sm" value={val} onChange={e => { const next = [...items]; next[i] = e.target.value; onChange(next); }} />}
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="adm-icon-btn adm-icon-btn-danger" title="삭제">✕</button>
        </div>
      ))}
      {items.length === 0 && <p className="adm-hint">항목이 없습니다.</p>}
    </div>
  );
}

function SectionCard({ title, desc, children, defaultOpen = true }: { title: string; desc?: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="adm-card" style={{ marginBottom: "16px" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: 0 }}>{title}</h3>
          {desc && <p style={{ fontSize: "12px", color: "#9ca3af", margin: "4px 0 0" }}>{desc}</p>}
        </div>
        <span style={{ color: "#9ca3af", fontSize: "12px", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▼</span>
      </div>
      {open && <div style={{ marginTop: "16px" }}>{children}</div>}
    </div>
  );
}

function CollapsibleRow({
  title, onDelete, deleteLabel = "삭제", children, forceOpen, onToggle,
}: { title: string; onDelete: () => void; deleteLabel?: string; children: React.ReactNode; forceOpen?: boolean; onToggle?: (open: boolean) => void }) {
  const [openState, setOpenState] = useState(false);
  const open = forceOpen ?? openState;
  const setOpen = (v: boolean) => { setOpenState(v); onToggle?.(v); };
  return (
    <div className="adm-subcard">
      <div onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{title || "(제목 없음)"}</span>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="adm-link-btn adm-link-btn-danger">{deleteLabel}</button>
          <span style={{ color: "#9ca3af", fontSize: "11px" }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #f1f2f4" }}>{children}</div>}
    </div>
  );
}

// ─── section editors ─────────────────────────────────────────────────────────

function TroubleEditor({ items, onChange }: { items: TroubleItem[]; onChange: (v: TroubleItem[]) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const update = (i: number, patch: Partial<TroubleItem>) => onChange(items.map((t, j) => j === i ? { ...t, ...patch } : t));
  return (
    <div>
      {items.map((item, i) => (
        <CollapsibleRow key={i} title={item.title} onDelete={() => onChange(items.filter((_, j) => j !== i))} forceOpen={expanded === i} onToggle={o => setExpanded(o ? i : null)}>
          <Field label="제목" value={item.title} onChange={v => update(i, { title: v })} />
          <ListField label="문제 상황" items={item.situation} onChange={v => update(i, { situation: v })} multiline />
          <ListField label="원인 분석" items={item.cause} onChange={v => update(i, { cause: v })} multiline />
          <ListField label="해결 방법" items={item.solution} onChange={v => update(i, { solution: v })} multiline />
          <ListField label="배운 점" items={item.learned} onChange={v => update(i, { learned: v })} multiline />
        </CollapsibleRow>
      ))}
      <button onClick={() => { onChange([...items, emptyTrouble()]); setExpanded(items.length); }} className="adm-btn adm-btn-add">+ 트러블슈팅 추가</button>
    </div>
  );
}

function StackEditor({ items, onChange }: { items: StackReason[]; onChange: (v: StackReason[]) => void }) {
  const update = (i: number, patch: Partial<StackReason>) => onChange(items.map((s, j) => j === i ? { ...s, ...patch } : s));
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="adm-subcard">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>{item.name || `스택 ${i + 1}`}</span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button onClick={() => move(i, -1)} disabled={i === 0} className="adm-icon-btn">▲</button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="adm-icon-btn">▼</button>
              <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="adm-link-btn adm-link-btn-danger">삭제</button>
            </div>
          </div>
          <Field label="스택명 (칩에 그대로 표시됩니다)" value={item.name} onChange={v => update(i, { name: v })} />
          <Field label="선택 이유" value={item.reason} onChange={v => update(i, { reason: v })} multiline />
        </div>
      ))}
      <button onClick={() => onChange([...items, emptyStack()])} className="adm-btn adm-btn-add">+ 스택 추가</button>
    </div>
  );
}

function RoleHighlightsEditor({ items, onChange }: { items: RoleHighlightItem[]; onChange: (v: RoleHighlightItem[]) => void }) {
  const update = (i: number, patch: Partial<RoleHighlightItem>) => onChange(items.map((r, j) => j === i ? { ...r, ...patch } : r));
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="adm-subcard">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 700 }}>{i + 1}</span>
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="adm-link-btn adm-link-btn-danger">삭제</button>
          </div>
          <Field label="제목" value={item.title} onChange={v => update(i, { title: v })} />
          <Field label="본문" value={item.desc} onChange={v => update(i, { desc: v })} multiline />
        </div>
      ))}
      <button onClick={() => onChange([...items, emptyRoleHighlight()])} className="adm-btn adm-btn-add">+ 역할 하이라이트 추가</button>
    </div>
  );
}

function ContribGroupsEditor({ items, onChange }: { items: ContribGroupItem[]; onChange: (v: ContribGroupItem[]) => void }) {
  const update = (i: number, patch: Partial<ContribGroupItem>) => onChange(items.map((c, j) => j === i ? { ...c, ...patch } : c));
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="adm-subcard">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "4px" }}>
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="adm-link-btn adm-link-btn-danger">카테고리 삭제</button>
          </div>
          <Field label="카테고리명" value={item.category} onChange={v => update(i, { category: v })} />
          <ListField label="세부 항목" items={item.items} onChange={v => update(i, { items: v })} multiline />
        </div>
      ))}
      <button onClick={() => onChange([...items, emptyContribGroup()])} className="adm-btn adm-btn-add">+ 기여 내용 카테고리 추가</button>
    </div>
  );
}

function ProjectLinksEditor({ links, onChange }: { links: { label: string; href: string }[]; onChange: (v: { label: string; href: string }[]) => void }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <label className="adm-label" style={{ marginBottom: 0 }}>링크</label>
        <button onClick={() => onChange([...links, { label: "", href: "" }])} className="adm-link-btn">+ 추가</button>
      </div>
      {links.map((link, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "6px", marginBottom: "6px" }}>
          <input placeholder="라벨" className="adm-input adm-input-sm" value={link.label} onChange={e => { const ls = [...links]; ls[i] = { ...ls[i], label: e.target.value }; onChange(ls); }} />
          <input placeholder="URL" className="adm-input adm-input-sm" value={link.href} onChange={e => { const ls = [...links]; ls[i] = { ...ls[i], href: e.target.value }; onChange(ls); }} />
          <button onClick={() => onChange(links.filter((_, j) => j !== i))} className="adm-icon-btn adm-icon-btn-danger">✕</button>
        </div>
      ))}
    </div>
  );
}

function ProjectsEditor({ items, onChange }: { items: OtherProject[]; onChange: (v: OtherProject[]) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const update = (i: number, patch: Partial<OtherProject>) => onChange(items.map((p, j) => j === i ? { ...p, ...patch } : p));
  return (
    <div>
      {items.map((item, i) => (
        <CollapsibleRow key={i} title={`${item.emoji} ${item.name || "(이름 없음)"}`} onDelete={() => onChange(items.filter((_, j) => j !== i))} forceOpen={expanded === i} onToggle={o => setExpanded(o ? i : null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 2fr", gap: "10px" }}>
            <Field label="이모지" value={item.emoji} onChange={v => update(i, { emoji: v })} />
            <Field label="이름" value={item.name} onChange={v => update(i, { name: v })} />
            <Field label="기간" value={item.period} onChange={v => update(i, { period: v })} />
          </div>
          <Field label="설명" value={item.description} onChange={v => update(i, { description: v })} multiline />
          <Field label="스택" value={item.stack} onChange={v => update(i, { stack: v })} />
          <ProjectLinksEditor links={item.links} onChange={v => update(i, { links: v })} />
        </CollapsibleRow>
      ))}
      <button onClick={() => { onChange([...items, emptyProject()]); setExpanded(items.length); }} className="adm-btn adm-btn-add">+ 프로젝트 추가</button>
    </div>
  );
}

function ExperiencesEditor({ groups, onChange }: { groups: ExperienceGroup[]; onChange: (v: ExperienceGroup[]) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const updateGroup = (i: number, patch: Partial<ExperienceGroup>) => onChange(groups.map((g, j) => j === i ? { ...g, ...patch } : g));

  function moveGroup(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= groups.length) return;
    const next = [...groups];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setExpanded(expanded === i ? j : expanded === j ? i : expanded);
  }

  return (
    <div>
      {groups.map((group, gi) => (
        <div key={gi} className="adm-subcard">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span onClick={() => setExpanded(expanded === gi ? null : gi)} style={{ cursor: "pointer", fontSize: "13px", fontWeight: 700, color: group.color, flex: 1 }}>{group.category || "(이름 없는 카테고리)"}</span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button onClick={() => moveGroup(gi, -1)} disabled={gi === 0} className="adm-icon-btn">▲</button>
              <button onClick={() => moveGroup(gi, 1)} disabled={gi === groups.length - 1} className="adm-icon-btn">▼</button>
              <button onClick={() => { onChange(groups.filter((_, j) => j !== gi)); setExpanded(null); }} className="adm-link-btn adm-link-btn-danger">카테고리 삭제</button>
              <span onClick={() => setExpanded(expanded === gi ? null : gi)} style={{ cursor: "pointer", color: "#9ca3af", fontSize: "11px" }}>{expanded === gi ? "▲" : "▼"}</span>
            </div>
          </div>
          {expanded === gi && (
            <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #f1f2f4" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <Field label="카테고리명" value={group.category} onChange={v => updateGroup(gi, { category: v })} />
                <Field label="색상 (hex)" value={group.color} onChange={v => updateGroup(gi, { color: v })} />
              </div>
              {group.items.map((item, ii) => (
                <div key={ii} className="adm-subcard adm-subcard-nested">
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "4px" }}>
                    <button onClick={() => updateGroup(gi, { items: group.items.filter((_, j) => j !== ii) })} className="adm-link-btn adm-link-btn-danger">삭제</button>
                  </div>
                  <Field label="제목" value={item.title} onChange={v => { const its = [...group.items]; its[ii] = { ...its[ii], title: v }; updateGroup(gi, { items: its }); }} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <Field label="기간" value={item.period} onChange={v => { const its = [...group.items]; its[ii] = { ...its[ii], period: v }; updateGroup(gi, { items: its }); }} />
                    <Field label="설명" value={item.desc} onChange={v => { const its = [...group.items]; its[ii] = { ...its[ii], desc: v }; updateGroup(gi, { items: its }); }} />
                  </div>
                </div>
              ))}
              <button onClick={() => updateGroup(gi, { items: [...group.items, emptyExpItem()] })} className="adm-link-btn">+ 항목 추가</button>
            </div>
          )}
        </div>
      ))}
      <button onClick={() => onChange([...groups, emptyExpGroup()])} className="adm-btn adm-btn-add-outline">+ 카테고리 추가</button>
    </div>
  );
}

function SkillsEditor({ data, onChange }: { data: PortfolioData["skills"]; onChange: (v: PortfolioData["skills"]) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const updateGroup = (gi: number, patch: Partial<SkillGroup>) => onChange({ ...data, groups: data.groups.map((g, j) => j === gi ? { ...g, ...patch } : g) });
  const updateSkill = (gi: number, si: number, patch: Partial<SkillItem>) => {
    const group = data.groups[gi];
    const skills = group.skills.map((s, j) => j === si ? { ...s, ...patch } : s);
    updateGroup(gi, { skills });
  };
  return (
    <div>
      <Field label="Skills 섹션 소개글" value={data.intro} onChange={v => onChange({ ...data, intro: v })} multiline hint="줄바꿈은 그대로 적용되고, **텍스트** 로 감싸면 강조 표시됩니다." />
      {data.groups.map((group, gi) => (
        <div key={gi} className="adm-subcard">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <Field label="카테고리명" value={group.category} onChange={v => updateGroup(gi, { category: v })} />
            <button onClick={() => onChange({ ...data, groups: data.groups.filter((_, j) => j !== gi) })} className="adm-link-btn adm-link-btn-danger" style={{ marginLeft: "12px" }}>카테고리 삭제</button>
          </div>
          {group.skills.map((skill, si) => {
            const key = `${gi}-${si}`;
            return (
              <CollapsibleRow key={key} title={skill.name} onDelete={() => updateGroup(gi, { skills: group.skills.filter((_, j) => j !== si) })} forceOpen={expanded === key} onToggle={o => setExpanded(o ? key : null)}>
                <Field label="이름" value={skill.name} onChange={v => updateSkill(gi, si, { name: v })} />
                <Field label="한줄 코멘트" value={skill.comment} onChange={v => updateSkill(gi, si, { comment: v })} />
                <ListField label="세부 경험" items={skill.bullets} onChange={v => updateSkill(gi, si, { bullets: v })} multiline />
              </CollapsibleRow>
            );
          })}
          <button onClick={() => updateGroup(gi, { skills: [...group.skills, emptySkill()] })} className="adm-link-btn">+ 스킬 추가</button>
        </div>
      ))}
      <button onClick={() => onChange({ ...data, groups: [...data.groups, emptySkillGroup()] })} className="adm-btn adm-btn-add-outline">+ 카테고리 추가</button>
    </div>
  );
}

function ProjectCoreEditor({ core, onChange }: { core: ProjectCore; onChange: (v: ProjectCore) => void }) {
  const update = (patch: Partial<ProjectCore>) => onChange({ ...core, ...patch });
  return (
    <>
      <SectionCard title="기본 정보">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "10px" }}>
          <Field label="프로젝트명" value={core.name} onChange={v => update({ name: v })} />
          <Field label="배지 텍스트" value={core.badgeLabel} onChange={v => update({ badgeLabel: v })} />
          <Field label="기간" value={core.period} onChange={v => update({ period: v })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <Field label="배지 글자색 (hex)" value={core.badgeColor} onChange={v => update({ badgeColor: v })} />
          <Field label="배지 배경색 (hex)" value={core.badgeBg} onChange={v => update({ badgeBg: v })} />
        </div>
        <Field label="한 줄 소개 (태그라인)" value={core.tagline} onChange={v => update({ tagline: v })} multiline hint="줄바꿈이 그대로 적용됩니다." />
        <ProjectLinksEditor links={core.links} onChange={v => update({ links: v })} />
      </SectionCard>

      <SectionCard title="내 역할">
        <Field label="역할 요약" value={core.roleSummary} onChange={v => update({ roleSummary: v })} multiline />
        <label className="adm-label" style={{ marginTop: "8px", display: "block" }}>역할 하이라이트 (번호 매겨 표시됩니다)</label>
        <RoleHighlightsEditor items={core.roleHighlights} onChange={v => update({ roleHighlights: v })} />
      </SectionCard>

      <SectionCard title="기여 내용 전체 보기" desc="'기여 내용 전체 보기'를 펼쳤을 때 나오는 카테고리별 상세 목록입니다." defaultOpen={false}>
        <ContribGroupsEditor items={core.contribGroups} onChange={v => update({ contribGroups: v })} />
      </SectionCard>
    </>
  );
}

// ─── main admin component ────────────────────────────────────────────────────

const NAV_GROUPS = [
  { key: "profile", label: "프로필 & 소개", icon: "👤" },
  { key: "CLUSTAR", label: "CLUSTAR", icon: "🗂️" },
  { key: "NUNCHI", label: "NUNCHI", icon: "🎙️" },
  { key: "skills", label: "Skills", icon: "🛠️" },
  { key: "projects", label: "Other Projects", icon: "🧩" },
  { key: "experiences", label: "Experiences", icon: "🎓" },
] as const;
type NavKey = typeof NAV_GROUPS[number]["key"];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<string>("");
  const [tab, setTab] = useState<NavKey>("profile");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/data");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setSavedSnapshot(JSON.stringify(json));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth-check").then(r => {
      if (r.ok) { setLoggedIn(true); fetchData(); }
    });
  }, [fetchData]);

  const dirty = data !== null && JSON.stringify(data) !== savedSnapshot;

  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (dirty) { e.preventDefault(); }
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (res.ok) { setLoggedIn(true); fetchData(); }
    else setLoginError("비밀번호가 틀렸어요");
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    setLoggedIn(false);
    setData(null);
  }

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/data", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) {
        setSaveMsg("저장됐어요 ✓");
        setSavedSnapshot(JSON.stringify(data));
      } else {
        setSaveMsg("저장 실패. 다시 시도해 주세요.");
      }
    } catch {
      setSaveMsg("저장 실패. 네트워크를 확인해 주세요.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  }

  async function handleImageUpload(projectKey: string, file: File) {
    setUploading(true);
    setUploadMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", projectKey);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        setData(prev => prev && { ...prev, projectImages: { ...prev.projectImages, [projectKey]: url } });
        setUploadMsg("업로드됐어요 ✓");
      } else {
        setUploadMsg("업로드 실패. 다시 시도해 주세요.");
      }
    } catch {
      setUploadMsg("업로드 실패. 네트워크를 확인해 주세요.");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadMsg(""), 3000);
    }
  }

  async function handleImageDelete(projectKey: string) {
    setUploading(true);
    setUploadMsg("");
    try {
      const res = await fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: projectKey }) });
      if (res.ok) {
        setData(prev => {
          if (!prev) return prev;
          const { [projectKey]: _removed, ...rest } = prev.projectImages;
          return { ...prev, projectImages: rest };
        });
        setUploadMsg("삭제됐어요 ✓");
      } else {
        setUploadMsg("삭제 실패. 다시 시도해 주세요.");
      }
    } catch {
      setUploadMsg("삭제 실패. 네트워크를 확인해 주세요.");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadMsg(""), 3000);
    }
  }

  // ─── login screen ──────────────────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #111827, #1f2937)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: "20px", padding: "48px 40px", width: "100%", maxWidth: "360px", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#111827", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "18px", marginBottom: "20px" }}>✎</div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "6px" }}>Admin</h1>
          <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "28px" }}>포트폴리오 관리 페이지</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="adm-input"
              style={{ marginBottom: "12px" }}
              autoFocus
            />
            {loginError && <p style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>{loginError}</p>}
            <button type="submit" className="adm-btn adm-btn-primary" style={{ width: "100%", padding: "11px", fontSize: "14px" }}>로그인</button>
          </form>
        </div>
        <style>{globalStyle}</style>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", background: "#f4f5f7" }}>
        불러오는 중...
        <style>{globalStyle}</style>
      </div>
    );
  }

  // ─── editor screen ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", display: "flex" }}>

      {/* 좌측 네비게이션 */}
      <aside style={{ width: "232px", minHeight: "100vh", background: "#111827", color: "#fff", position: "fixed", top: 0, left: 0, bottom: 0, padding: "28px 18px", display: "flex", flexDirection: "column", zIndex: 100 }}>
        <div style={{ padding: "0 10px", marginBottom: "28px" }}>
          <p style={{ fontWeight: 700, fontSize: "16px" }}>포트폴리오 Admin</p>
          <a href="/" target="_blank" style={{ fontSize: "11px", color: "#9ca3af", textDecoration: "none" }}>사이트 보기 →</a>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
          {NAV_GROUPS.map(g => (
            <button
              key={g.key}
              onClick={() => setTab(g.key)}
              style={{
                display: "flex", alignItems: "center", gap: "10px", textAlign: "left",
                padding: "10px 12px", borderRadius: "8px", border: "none", cursor: "pointer",
                background: tab === g.key ? "#1f2937" : "transparent",
                color: tab === g.key ? "#fff" : "#9ca3af",
                fontWeight: tab === g.key ? 700 : 500, fontSize: "13px",
              }}
            >
              <span>{g.icon}</span>{g.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} style={{ background: "none", border: "1px solid #374151", color: "#9ca3af", borderRadius: "8px", padding: "9px 14px", fontSize: "12px", cursor: "pointer" }}>로그아웃</button>
      </aside>

      <div style={{ marginLeft: "232px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* 상단 저장 바 */}
        <div style={{ position: "sticky", top: 0, zIndex: 90, background: "rgba(244,245,247,0.9)", backdropFilter: "blur(6px)", borderBottom: "1px solid #e5e7eb", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0 }}>{NAV_GROUPS.find(g => g.key === tab)?.label}</h2>
            {dirty && <span style={{ fontSize: "11px", color: "#d97706", background: "#fef3c7", padding: "2px 8px", borderRadius: "20px", fontWeight: 600 }}>저장되지 않은 변경사항</span>}
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {saveMsg && <span style={{ fontSize: "13px", color: saveMsg.includes("✓") ? "#059669" : "#ef4444" }}>{saveMsg}</span>}
            <button onClick={handleSave} disabled={saving} className="adm-btn adm-btn-primary">
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>

        <div style={{ maxWidth: "820px", width: "100%", margin: "0 auto", padding: "28px 32px 80px" }}>

          {tab === "profile" && (
            <>
              <SectionCard title="프로필" desc="사이드바, 하단 저작권, About 섹션 연락처에 사용됩니다.">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <Field label="이름" value={data.profile.name} onChange={v => setData({ ...data, profile: { ...data.profile, name: v } })} />
                  <Field label="타이틀 (사이드바)" value={data.profile.title} onChange={v => setData({ ...data, profile: { ...data.profile, title: v } })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" , gap: "10px" }}>
                  <Field label="GitHub URL" value={data.profile.githubUrl} onChange={v => setData({ ...data, profile: { ...data.profile, githubUrl: v } })} />
                  <Field label="Blog URL" value={data.profile.blogUrl} onChange={v => setData({ ...data, profile: { ...data.profile, blogUrl: v } })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <Field label="Notion URL" value={data.profile.notionUrl} onChange={v => setData({ ...data, profile: { ...data.profile, notionUrl: v } })} />
                  <Field label="Notion 표시 라벨" value={data.profile.notionLabel} onChange={v => setData({ ...data, profile: { ...data.profile, notionLabel: v } })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <Field label="이메일" value={data.profile.email} onChange={v => setData({ ...data, profile: { ...data.profile, email: v } })} />
                  <Field label="하단 저작권 연도" value={data.profile.footerYear} onChange={v => setData({ ...data, profile: { ...data.profile, footerYear: v } })} />
                </div>
              </SectionCard>

              <SectionCard title="Hero (첫 화면)" desc="사이트에 처음 들어왔을 때 보이는 문구입니다.">
                <Field label="직무 (헤드라인의 강조 색 부분)" value={data.hero.roleTitle} onChange={v => setData({ ...data, hero: { ...data.hero, roleTitle: v } })} />
                <Field label="소개 문구" value={data.hero.description} onChange={v => setData({ ...data, hero: { ...data.hero, description: v } })} multiline hint="줄바꿈은 그대로 적용되고, **텍스트** 로 감싸면 파란색으로 강조됩니다." />
              </SectionCard>

              <SectionCard title="About Me">
                <p className="adm-hint" style={{ marginBottom: "10px" }}>본문은 두 개의 단락으로 구성됩니다. 각 단락은 제목(강조 문구)과 본문을 가집니다.</p>
                {data.about.blocks.map((block, i) => (
                  <div key={i} className="adm-subcard">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 700 }}>단락 {i + 1}</span>
                      <button onClick={() => setData({ ...data, about: { blocks: data.about.blocks.filter((_, j) => j !== i) } })} className="adm-link-btn adm-link-btn-danger">삭제</button>
                    </div>
                    <Field label="강조 제목" value={block.heading} onChange={v => { const bs = [...data.about.blocks]; bs[i] = { ...bs[i], heading: v }; setData({ ...data, about: { blocks: bs } }); }} />
                    <Field label="본문" value={block.body} onChange={v => { const bs = [...data.about.blocks]; bs[i] = { ...bs[i], body: v }; setData({ ...data, about: { blocks: bs } }); }} multiline hint="줄바꿈은 그대로 적용되고, **텍스트** 로 감싸면 굵게 표시됩니다." />
                  </div>
                ))}
                <button onClick={() => setData({ ...data, about: { blocks: [...data.about.blocks, emptyAboutBlock()] } })} className="adm-btn adm-btn-add">+ 단락 추가</button>
              </SectionCard>
            </>
          )}

          {(tab === "CLUSTAR" || tab === "NUNCHI") && (
            <>
              <ProjectCoreEditor core={data.projects[tab]} onChange={v => setData({ ...data, projects: { ...data.projects, [tab]: v } })} />

              <SectionCard title="기술 스택" desc="여기 등록한 이름이 그대로 칩(chip)으로 표시되고, 이유는 '기술 스택 선정 이유' 펼치기에 노출됩니다.">
                <StackEditor items={data.stackReasons[tab] ?? []} onChange={v => setData({ ...data, stackReasons: { ...data.stackReasons, [tab]: v } })} />
              </SectionCard>

              <SectionCard title="트러블슈팅">
                <TroubleEditor items={data.troubles[tab] ?? []} onChange={v => setData({ ...data, troubles: { ...data.troubles, [tab]: v } })} />
              </SectionCard>

              <SectionCard title="대표 이미지">
                {data.projectImages[tab] && (
                  <img src={`/api/image/${tab}?v=${encodeURIComponent(data.projectImages[tab])}`} alt={`${tab} 대표 이미지`} style={{ width: "100%", maxHeight: "260px", objectFit: "cover", borderRadius: "10px", marginBottom: "14px", border: "1px solid #e5e7eb" }} />
                )}
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    ref={el => { fileInputRefs.current[tab] = el; }}
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={e => { const file = e.target.files?.[0]; if (file) handleImageUpload(tab, file); }}
                    style={{ fontSize: "13px" }}
                  />
                  {data.projectImages[tab] && (
                    <button onClick={() => handleImageDelete(tab)} disabled={uploading} className="adm-btn adm-btn-danger-outline">이미지 삭제</button>
                  )}
                </div>
                {uploading && <p className="adm-hint">업로드 중...</p>}
                {uploadMsg && <p style={{ fontSize: "12px", color: uploadMsg.includes("✓") ? "#059669" : "#ef4444", marginTop: "8px" }}>{uploadMsg}</p>}
              </SectionCard>
            </>
          )}

          {tab === "skills" && (
            <SectionCard title="Skills 섹션">
              <SkillsEditor data={data.skills} onChange={v => setData({ ...data, skills: v })} />
            </SectionCard>
          )}

          {tab === "projects" && (
            <SectionCard title="Other Projects">
              <ProjectsEditor items={data.otherProjects} onChange={v => setData({ ...data, otherProjects: v })} />
            </SectionCard>
          )}

          {tab === "experiences" && (
            <SectionCard title="Experiences">
              <ExperiencesEditor groups={data.experiences} onChange={v => setData({ ...data, experiences: v })} />
            </SectionCard>
          )}
        </div>
      </div>

      <style>{globalStyle}</style>
    </div>
  );
}

const globalStyle = `
  * { box-sizing: border-box; }
  p, h1, h2, h3, label { margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Pretendard, sans-serif; }

  .adm-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 20px 22px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
  .adm-subcard { background: #fafafa; border: 1px solid #eef0f2; border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; }
  .adm-subcard-nested { background: #fff; }

  .adm-label { font-size: 11px; font-weight: 600; color: #6b7280; display: block; margin-bottom: 5px; letter-spacing: 0.2px; }
  .adm-hint { font-size: 11px; color: #9ca3af; margin-top: 4px; }

  .adm-input { width: 100%; padding: 9px 11px; border: 1px solid #d9dbe0; border-radius: 8px; font-size: 13px; font-family: inherit; background: #fff; color: #111827; transition: border-color 0.15s, box-shadow 0.15s; resize: vertical; }
  .adm-input:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.12); }
  .adm-input-sm { padding: 7px 9px; font-size: 12px; }

  .adm-btn { border: none; border-radius: 8px; padding: 9px 16px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.15s, background 0.15s; }
  .adm-btn:disabled { opacity: 0.6; cursor: default; }
  .adm-btn-primary { background: #4f46e5; color: #fff; }
  .adm-btn-primary:hover:not(:disabled) { background: #4338ca; }
  .adm-btn-add { background: #eef2ff; color: #4f46e5; border: 1px solid #e0e7ff; margin-top: 4px; }
  .adm-btn-add:hover { background: #e0e7ff; }
  .adm-btn-add-outline { background: none; color: #4f46e5; border: 1px dashed #a5b4fc; width: 100%; padding: 10px; }
  .adm-btn-add-outline:hover { background: #eef2ff; }
  .adm-btn-danger-outline { background: none; border: 1px solid #ef4444; color: #ef4444; }
  .adm-btn-danger-outline:hover:not(:disabled) { background: #fef2f2; }

  .adm-link-btn { font-size: 12px; color: #4f46e5; background: none; border: none; cursor: pointer; font-weight: 500; padding: 2px 0; }
  .adm-link-btn:hover { text-decoration: underline; }
  .adm-link-btn-danger { color: #ef4444; }

  .adm-icon-btn { font-size: 12px; color: #6b7280; background: none; border: 1px solid #e5e7eb; border-radius: 6px; width: 26px; height: 26px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
  .adm-icon-btn:hover:not(:disabled) { background: #f3f4f6; }
  .adm-icon-btn:disabled { opacity: 0.35; cursor: default; }
  .adm-icon-btn-danger { color: #ef4444; border-color: #fecaca; }
  .adm-icon-btn-danger:hover:not(:disabled) { background: #fef2f2; }
`;
