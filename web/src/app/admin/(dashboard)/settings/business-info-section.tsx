"use client";

import { useState } from "react";
import type { BusinessSettings } from "@/db/schema";

export function BusinessInfoSection({ settings }: { settings: BusinessSettings }) {
  const [form, setForm] = useState({
    nameAr: settings.nameAr,
    nameEn: settings.nameEn,
    email: settings.email,
    experienceYears: settings.experienceYears,
    addressAr: settings.addressAr,
    hoursAr: settings.hoursAr,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setSaved(false);
    setError(null);
    const res = await fetch("/api/admin/business-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      setError("تعذر الحفظ، تحقق من الحقول");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="rounded-[22px] bg-white p-6.5">
      <h2 className="mb-1.5 font-heading text-lg font-extrabold text-foreground">معلومات النشاط</h2>
      <p className="mb-4.5 text-[12.5px] leading-[1.75] text-admin-muted">
        تظهر بالفوتر وبـschema الموقع. أي تعديل هون بينعكس على كل الصفحات.
      </p>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <F label="اسم النشاط (عربي)" value={form.nameAr} onChange={(v) => setForm({ ...form, nameAr: v })} />
        <F label="اسم النشاط (إنجليزي)" value={form.nameEn} onChange={(v) => setForm({ ...form, nameEn: v })} />
        <F label="البريد الإلكتروني" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <F label="سنوات الخبرة" value={form.experienceYears} onChange={(v) => setForm({ ...form, experienceYears: v })} />
        <F label="العنوان" value={form.addressAr} onChange={(v) => setForm({ ...form, addressAr: v })} />
        <F label="ساعات العمل" value={form.hoursAr} onChange={(v) => setForm({ ...form, hoursAr: v })} />
      </div>
      {error && <p className="mt-3 text-xs text-admin-danger">{error}</p>}
      <div className="mt-4 flex items-center gap-3">
        <button type="button" disabled={saving} onClick={save} className="h-11 rounded-full bg-primary px-5.5 text-[13.5px] font-bold text-primary-foreground">
          {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </button>
        {saved && <span className="text-[13px] font-semibold text-primary">تم الحفظ</span>}
      </div>
    </div>
  );
}

function F({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-semibold text-admin-muted-2">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="admin-input" />
    </label>
  );
}
