"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { ContactNumber } from "@/db/schema";

type Draft = {
  label: string;
  phoneE164: string;
  supportsWhatsapp: boolean;
  supportsCall: boolean;
  isDefault: boolean;
};

const emptyDraft: Draft = { label: "", phoneE164: "", supportsWhatsapp: true, supportsCall: true, isDefault: false };

export function ContactNumbersSection({ numbers }: { numbers: ContactNumber[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(number: ContactNumber) {
    setEditingId(number.id);
    setDraft({
      label: number.label,
      phoneE164: number.phoneE164,
      supportsWhatsapp: number.supportsWhatsapp,
      supportsCall: number.supportsCall,
      isDefault: number.isDefault,
    });
    setError(null);
  }

  function startNew() {
    setEditingId("new");
    setDraft(emptyDraft);
    setError(null);
  }

  async function save() {
    setSaving(true);
    setError(null);
    const url = editingId === "new" ? "/api/admin/contact-numbers" : `/api/admin/contact-numbers/${editingId}`;
    const method = editingId === "new" ? "POST" : "PATCH";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, sortOrder: numbers.length }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error?.formErrors?.[0] ?? "تعذر الحفظ، تحقق من الحقول");
      setSaving(false);
      return;
    }
    setEditingId(null);
    setSaving(false);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("حذف هذا الرقم؟")) return;
    const res = await fetch(`/api/admin/contact-numbers/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      alert(body?.error ?? "تعذر حذف الرقم");
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-[22px] bg-white p-6.5">
      <h2 className="mb-1.5 font-heading text-lg font-extrabold text-foreground">أرقام التواصل</h2>
      <p className="mb-4 text-[12.5px] leading-[1.75] text-admin-muted">
        الأرقام المتاحة للاختيار بصفحة كل منتج. الرقم الافتراضي بينستخدم لأي منتج ما اخترتله رقم.
      </p>

      <div className="grid grid-cols-[minmax(0,1fr)_140px_170px_90px] gap-3.5 pb-2.5 text-[12.5px] font-semibold text-admin-muted">
        <div>الاسم</div>
        <div>الرقم</div>
        <div>مستخدم لـ</div>
        <div />
      </div>

      {numbers.map((number) =>
        editingId === number.id ? (
          <EditRow key={number.id} draft={draft} setDraft={setDraft} onSave={save} onCancel={() => setEditingId(null)} saving={saving} error={error} />
        ) : (
          <div key={number.id} className="grid grid-cols-[minmax(0,1fr)_140px_170px_90px] items-center gap-3.5 border-t border-admin-divider py-4">
            <div className="flex items-center gap-2.5">
              <span className="text-[14.5px] font-semibold text-foreground">{number.label}</span>
              {number.isDefault && (
                <span className="flex h-6 items-center rounded-full bg-accent px-2.5 text-[11.5px] font-bold text-primary">افتراضي</span>
              )}
            </div>
            <div dir="ltr" className="text-end font-mono text-[14.5px] text-admin-muted-2">{number.phoneE164}</div>
            <div className="flex gap-1.5">
              <span className={`flex h-[26px] items-center rounded-full px-2.5 text-xs font-semibold ${number.supportsWhatsapp ? "bg-accent text-primary" : "bg-admin-divider text-admin-faint"}`}>واتساب</span>
              <span className={`flex h-[26px] items-center rounded-full px-2.5 text-xs font-semibold ${number.supportsCall ? "bg-accent text-primary" : "bg-admin-divider text-admin-faint"}`}>اتصال</span>
            </div>
            <div className="flex justify-end gap-1.5">
              <button type="button" onClick={() => startEdit(number)} className="flex size-[34px] items-center justify-center rounded-[11px] bg-admin-input text-admin-muted-2">
                <Pencil className="size-[15px]" />
              </button>
              <button type="button" onClick={() => remove(number.id)} className="flex size-[34px] items-center justify-center rounded-[11px] bg-admin-danger-bg text-admin-danger">
                <Trash2 className="size-[15px]" />
              </button>
            </div>
          </div>
        )
      )}

      {editingId === "new" ? (
        <EditRow draft={draft} setDraft={setDraft} onSave={save} onCancel={() => setEditingId(null)} saving={saving} error={error} isNew />
      ) : (
        <button
          type="button"
          onClick={startNew}
          className="mt-3.5 flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-admin-border text-[13.5px] font-semibold text-primary"
        >
          <Plus className="size-4" />
          أضف رقم جديد
        </button>
      )}
    </div>
  );
}

function EditRow({
  draft,
  setDraft,
  onSave,
  onCancel,
  saving,
  error,
  isNew,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
  isNew?: boolean;
}) {
  return (
    <div className={isNew ? "mt-3.5 rounded-[16px] bg-admin-input p-4" : "border-t border-admin-divider bg-admin-input p-4"}>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={draft.label}
          onChange={(e) => setDraft({ ...draft, label: e.target.value })}
          placeholder="اسم وصفي (مثال: الرقم الرئيسي)"
          className="admin-input bg-white"
        />
        <input
          dir="ltr"
          value={draft.phoneE164}
          onChange={(e) => setDraft({ ...draft, phoneE164: e.target.value })}
          placeholder="+962791234567"
          className="admin-input bg-white font-mono"
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-admin-muted-2">
          <input type="checkbox" checked={draft.supportsWhatsapp} onChange={(e) => setDraft({ ...draft, supportsWhatsapp: e.target.checked })} />
          واتساب
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-admin-muted-2">
          <input type="checkbox" checked={draft.supportsCall} onChange={(e) => setDraft({ ...draft, supportsCall: e.target.checked })} />
          اتصال
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-admin-muted-2">
          <input type="checkbox" checked={draft.isDefault} onChange={(e) => setDraft({ ...draft, isDefault: e.target.checked })} />
          تعيين كافتراضي
        </label>
      </div>
      {error && <p className="mt-2 text-xs text-admin-danger">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button type="button" disabled={saving} onClick={onSave} className="h-10 rounded-full bg-primary px-5 text-[13.5px] font-bold text-primary-foreground">
          {saving ? "جارٍ الحفظ..." : "حفظ"}
        </button>
        <button type="button" onClick={onCancel} className="h-10 rounded-full bg-white px-5 text-[13.5px] font-semibold text-admin-muted-2">
          إلغاء
        </button>
      </div>
    </div>
  );
}
