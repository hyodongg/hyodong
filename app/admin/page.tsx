"use client";

import { useState, useEffect, useCallback } from "react";
import type { PortfolioData, TroubleItem, StackReason, OtherProject, ExperienceGroup, ExperienceItem } from "@/lib/types";

// ─── helpers ────────────────────────────────────────────────────────────────

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

// ─── tiny field components ───────────────────────────────────────────────────

function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  const style: React.CSSProperties = { width: "100%", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", fontFamily: "inherit", resize: multiline ? "vertical" : undefined };
  return (
    <div style={{ marginBottom: "8px" }}>
      <label style={{ fontSize: "11px", color: "#6b7280", display: "block", marginBottom: "3px" }}>{label}</label>
      {multiline
        ? <textarea rows={3} style={style} value={value} onChange={e => onChange(e.target.value)} />
        : <input style={style} value={value} onChange={e => onChange(e.target.value)} />}
    </div>
  );
}

function ListField({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div style={{ marginBottom: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <label style={{ fontSize: "11px", color: "#6b7280" }}>{label}</label>
        <button onClick={() => onChange([...items, ""])} style={{ fontSize: "11px", color: "#3b82f6", background: "none", border: "none", cursor: "pointer" }}>+ 추가</button>
      </div>
      {items.map((val, i) => (
        <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
          <input
            style={{ flex: 1, padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "12px" }}
            value={val}
            onChange={e => { const next = [...items]; next[i] = e.target.value; onChange(next); }}
          />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ fontSize: "13px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>✕</button>
        </div>
      ))}
    </div>
  );
}

// ─── section editors ─────────────────────────────────────────────────────────

function TroubleEditor({ projectKey, items, onChange }: { projectKey: string; items: TroubleItem[]; onChange: (v: TroubleItem[]) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const update = (i: number, patch: Partial<TroubleItem>) => {
    const next = items.map((t, j) => j === i ? { ...t, ...patch } : t);
    onChange(next);
  };
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", marginBottom: "8px" }}>
          <div onClick={() => setExpanded(expanded === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", cursor: "pointer", background: expanded === i ? "#f9fafb" : "#fff", borderRadius: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: 500 }}>{item.title || "(제목 없음)"}</span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button onClick={e => { e.stopPropagation(); onChange(items.filter((_, j) => j !== i)); }} style={{ fontSize: "12px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>삭제</button>
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>{expanded === i ? "▲" : "▼"}</span>
            </div>
          </div>
          {expanded === i && (
            <div style={{ padding: "12px 14px", borderTop: "1px solid #f3f4f6" }}>
              <Field label="제목" value={item.title} onChange={v => update(i, { title: v })} />
              <ListField label="문제 상황" items={item.situation} onChange={v => update(i, { situation: v })} />
              <ListField label="원인 분석" items={item.cause} onChange={v => update(i, { cause: v })} />
              <ListField label="해결 방법" items={item.solution} onChange={v => update(i, { solution: v })} />
              <ListField label="배운 점" items={item.learned} onChange={v => update(i, { learned: v })} />
            </div>
          )}
        </div>
      ))}
      <button onClick={() => { onChange([...items, emptyTrouble()]); setExpanded(items.length); }} style={{ fontSize: "13px", color: "#3b82f6", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", padding: "6px 14px", cursor: "pointer", marginTop: "4px" }}>+ 트러블슈팅 추가</button>
    </div>
  );
}

function StackEditor({ items, onChange }: { items: StackReason[]; onChange: (v: StackReason[]) => void }) {
  const update = (i: number, patch: Partial<StackReason>) => onChange(items.map((s, j) => j === i ? { ...s, ...patch } : s));
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px 14px", marginBottom: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 500 }}>{item.name || `스택 ${i + 1}`}</span>
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ fontSize: "12px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>삭제</button>
          </div>
          <Field label="이름" value={item.name} onChange={v => update(i, { name: v })} />
          <Field label="선택 이유" value={item.reason} onChange={v => update(i, { reason: v })} multiline />
        </div>
      ))}
      <button onClick={() => onChange([...items, emptyStack()])} style={{ fontSize: "13px", color: "#3b82f6", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", padding: "6px 14px", cursor: "pointer", marginTop: "4px" }}>+ 스택 추가</button>
    </div>
  );
}

function ProjectsEditor({ items, onChange }: { items: OtherProject[]; onChange: (v: OtherProject[]) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const update = (i: number, patch: Partial<OtherProject>) => onChange(items.map((p, j) => j === i ? { ...p, ...patch } : p));
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", marginBottom: "8px" }}>
          <div onClick={() => setExpanded(expanded === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", cursor: "pointer", background: expanded === i ? "#f9fafb" : "#fff", borderRadius: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: 500 }}>{item.emoji} {item.name || "(이름 없음)"}</span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button onClick={e => { e.stopPropagation(); onChange(items.filter((_, j) => j !== i)); }} style={{ fontSize: "12px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>삭제</button>
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>{expanded === i ? "▲" : "▼"}</span>
            </div>
          </div>
          {expanded === i && (
            <div style={{ padding: "12px 14px", borderTop: "1px solid #f3f4f6" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 2fr", gap: "8px" }}>
                <Field label="이모지" value={item.emoji} onChange={v => update(i, { emoji: v })} />
                <Field label="이름" value={item.name} onChange={v => update(i, { name: v })} />
                <Field label="기간" value={item.period} onChange={v => update(i, { period: v })} />
              </div>
              <Field label="설명" value={item.description} onChange={v => update(i, { description: v })} multiline />
              <Field label="스택" value={item.stack} onChange={v => update(i, { stack: v })} />
              <div style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label style={{ fontSize: "11px", color: "#6b7280" }}>링크</label>
                  <button onClick={() => update(i, { links: [...item.links, { label: "", href: "" }] })} style={{ fontSize: "11px", color: "#3b82f6", background: "none", border: "none", cursor: "pointer" }}>+ 추가</button>
                </div>
                {item.links.map((link, li) => (
                  <div key={li} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "6px", marginBottom: "4px" }}>
                    <input placeholder="라벨" style={{ padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "12px" }} value={link.label} onChange={e => { const ls = [...item.links]; ls[li] = { ...ls[li], label: e.target.value }; update(i, { links: ls }); }} />
                    <input placeholder="URL" style={{ padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "12px" }} value={link.href} onChange={e => { const ls = [...item.links]; ls[li] = { ...ls[li], href: e.target.value }; update(i, { links: ls }); }} />
                    <button onClick={() => update(i, { links: item.links.filter((_, lj) => lj !== li) })} style={{ fontSize: "13px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      <button onClick={() => { onChange([...items, emptyProject()]); setExpanded(items.length); }} style={{ fontSize: "13px", color: "#3b82f6", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", padding: "6px 14px", cursor: "pointer", marginTop: "4px" }}>+ 프로젝트 추가</button>
    </div>
  );
}

function ExperiencesEditor({ groups, onChange }: { groups: ExperienceGroup[]; onChange: (v: ExperienceGroup[]) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const updateGroup = (i: number, patch: Partial<ExperienceGroup>) => onChange(groups.map((g, j) => j === i ? { ...g, ...patch } : g));
  return (
    <div>
      {groups.map((group, gi) => (
        <div key={gi} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", marginBottom: "8px" }}>
          <div onClick={() => setExpanded(expanded === group.category ? null : group.category)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", cursor: "pointer", background: expanded === group.category ? "#f9fafb" : "#fff", borderRadius: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: group.color }}>{group.category}</span>
            <span style={{ color: "#9ca3af", fontSize: "12px" }}>{expanded === group.category ? "▲" : "▼"}</span>
          </div>
          {expanded === group.category && (
            <div style={{ padding: "12px 14px", borderTop: "1px solid #f3f4f6" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                <Field label="카테고리명" value={group.category} onChange={v => updateGroup(gi, { category: v })} />
                <Field label="색상 (hex)" value={group.color} onChange={v => updateGroup(gi, { color: v })} />
              </div>
              {group.items.map((item, ii) => (
                <div key={ii} style={{ border: "1px solid #f3f4f6", borderRadius: "6px", padding: "10px 12px", marginBottom: "6px", background: "#fafafa" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "4px" }}>
                    <button onClick={() => updateGroup(gi, { items: group.items.filter((_, j) => j !== ii) })} style={{ fontSize: "12px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>삭제</button>
                  </div>
                  <Field label="제목" value={item.title} onChange={v => { const its = [...group.items]; its[ii] = { ...its[ii], title: v }; updateGroup(gi, { items: its }); }} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <Field label="기간" value={item.period} onChange={v => { const its = [...group.items]; its[ii] = { ...its[ii], period: v }; updateGroup(gi, { items: its }); }} />
                    <Field label="설명" value={item.desc} onChange={v => { const its = [...group.items]; its[ii] = { ...its[ii], desc: v }; updateGroup(gi, { items: its }); }} />
                  </div>
                </div>
              ))}
              <button onClick={() => updateGroup(gi, { items: [...group.items, emptyExpItem()] })} style={{ fontSize: "12px", color: "#3b82f6", background: "none", border: "none", cursor: "pointer" }}>+ 항목 추가</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── main admin component ────────────────────────────────────────────────────

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [tab, setTab] = useState<"troubles" | "stacks" | "projects" | "experiences" | "images">("troubles");
  const [projectTab, setProjectTab] = useState<"CLUSTAR" | "NUNCHI">("CLUSTAR");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/data");
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth-check").then(r => {
      if (r.ok) { setLoggedIn(true); fetchData(); }
    });
  }, [fetchData]);

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
      if (res.ok) setSaveMsg("저장됐어요 ✓");
      else setSaveMsg("저장 실패. 다시 시도해 주세요.");
    } catch {
      setSaveMsg("저장 실패. 네트워크를 확인해 주세요.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setUploadMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", projectTab);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        setData(prev => prev && { ...prev, projectImages: { ...prev.projectImages, [projectTab]: url } });
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

  async function handleImageDelete() {
    setUploading(true);
    setUploadMsg("");
    try {
      const res = await fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: projectTab }) });
      if (res.ok) {
        setData(prev => {
          if (!prev) return prev;
          const { [projectTab]: _removed, ...rest } = prev.projectImages;
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
      <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "48px 40px", width: "100%", maxWidth: "360px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "6px" }}>Admin</h1>
          <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "28px" }}>포트폴리오 관리 페이지</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" }}
            />
            {loginError && <p style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>{loginError}</p>}
            <button type="submit" style={{ width: "100%", padding: "10px", background: "#111827", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>로그인</button>
          </form>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>불러오는 중...</div>;
  }

  const TABS = [
    { key: "troubles", label: "트러블슈팅" },
    { key: "stacks", label: "기술 스택 이유" },
    { key: "images", label: "대표 이미지" },
    { key: "projects", label: "Other Projects" },
    { key: "experiences", label: "Experiences" },
  ] as const;

  // ─── editor screen ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      {/* top bar */}
      <div style={{ background: "#111827", color: "#fff", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontWeight: 700 }}>Admin</span>
          <a href="/" target="_blank" style={{ fontSize: "12px", color: "#9ca3af", textDecoration: "none" }}>포트폴리오 보기 →</a>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {saveMsg && <span style={{ fontSize: "13px", color: saveMsg.includes("✓") ? "#34d399" : "#f87171" }}>{saveMsg}</span>}
          <button onClick={handleSave} disabled={saving} style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 18px", fontSize: "13px", fontWeight: 600, cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "저장 중..." : "저장"}
          </button>
          <button onClick={handleLogout} style={{ background: "none", border: "1px solid #374151", color: "#9ca3af", borderRadius: "6px", padding: "6px 14px", fontSize: "13px", cursor: "pointer" }}>로그아웃</button>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
        {/* tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "28px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "4px" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, padding: "8px 12px", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: tab === t.key ? 700 : 400, background: tab === t.key ? "#111827" : "transparent", color: tab === t.key ? "#fff" : "#6b7280", cursor: "pointer", transition: "all 0.15s" }}>{t.label}</button>
          ))}
        </div>

        {/* troubles tab */}
        {tab === "troubles" && (
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {(["CLUSTAR", "NUNCHI"] as const).map(pk => (
                <button key={pk} onClick={() => setProjectTab(pk)} style={{ padding: "6px 16px", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "13px", fontWeight: projectTab === pk ? 700 : 400, background: projectTab === pk ? "#111827" : "#fff", color: projectTab === pk ? "#fff" : "#374151", cursor: "pointer" }}>{pk}</button>
              ))}
            </div>
            <TroubleEditor
              projectKey={projectTab}
              items={data.troubles[projectTab] ?? []}
              onChange={v => setData({ ...data, troubles: { ...data.troubles, [projectTab]: v } })}
            />
          </div>
        )}

        {/* stacks tab */}
        {tab === "stacks" && (
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {(["CLUSTAR", "NUNCHI"] as const).map(pk => (
                <button key={pk} onClick={() => setProjectTab(pk)} style={{ padding: "6px 16px", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "13px", fontWeight: projectTab === pk ? 700 : 400, background: projectTab === pk ? "#111827" : "#fff", color: projectTab === pk ? "#fff" : "#374151", cursor: "pointer" }}>{pk}</button>
              ))}
            </div>
            <StackEditor
              items={data.stackReasons[projectTab] ?? []}
              onChange={v => setData({ ...data, stackReasons: { ...data.stackReasons, [projectTab]: v } })}
            />
          </div>
        )}

        {/* images tab */}
        {tab === "images" && (
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {(["CLUSTAR", "NUNCHI"] as const).map(pk => (
                <button key={pk} onClick={() => setProjectTab(pk)} style={{ padding: "6px 16px", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "13px", fontWeight: projectTab === pk ? 700 : 400, background: projectTab === pk ? "#111827" : "#fff", color: projectTab === pk ? "#fff" : "#374151", cursor: "pointer" }}>{pk}</button>
              ))}
            </div>
            {data.projectImages[projectTab] && (
              <img src={`/api/image/${projectTab}?v=${encodeURIComponent(data.projectImages[projectTab])}`} alt={`${projectTab} 대표 이미지`} style={{ width: "100%", maxHeight: "280px", objectFit: "cover", borderRadius: "10px", marginBottom: "16px", border: "1px solid #e5e7eb" }} />
            )}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={e => { const file = e.target.files?.[0]; if (file) handleImageUpload(file); }}
                style={{ fontSize: "13px" }}
              />
              {data.projectImages[projectTab] && (
                <button onClick={handleImageDelete} disabled={uploading} style={{ background: "none", border: "1px solid #ef4444", color: "#ef4444", borderRadius: "6px", padding: "6px 14px", fontSize: "12px", cursor: uploading ? "default" : "pointer", opacity: uploading ? 0.6 : 1 }}>
                  이미지 삭제
                </button>
              )}
            </div>
            {uploading && <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>업로드 중...</p>}
            {uploadMsg && <p style={{ fontSize: "12px", color: uploadMsg.includes("✓") ? "#059669" : "#ef4444", marginTop: "8px" }}>{uploadMsg}</p>}
          </div>
        )}

        {/* projects tab */}
        {tab === "projects" && (
          <ProjectsEditor items={data.otherProjects} onChange={v => setData({ ...data, otherProjects: v })} />
        )}

        {/* experiences tab */}
        {tab === "experiences" && (
          <ExperiencesEditor groups={data.experiences} onChange={v => setData({ ...data, experiences: v })} />
        )}
      </div>

      <style>{`* { box-sizing: border-box; } p, h1, h2, label { margin: 0; padding: 0; }`}</style>
    </div>
  );
}
