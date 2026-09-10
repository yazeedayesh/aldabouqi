"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 12) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 16 || (/[a-z]/.test(pw) && /[A-Z]/.test(pw))) score++;
  return score;
}

export function AccountSection({ username, sessionCount }: { username: string; sessionCount: number }) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const strength = passwordStrength(newPassword);

  async function changePassword() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    const res = await fetch("/api/admin/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? body?.error?.formErrors?.[0] ?? "تعذر تحديث كلمة المرور");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess(true);
  }

  async function signOutEverywhere() {
    if (!confirm("بيتم تسجيل خروجك من كل الأجهزة، بما فيها هذا الجهاز. متأكد؟")) return;
    setSigningOut(true);
    await fetch("/api/admin/sessions", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="rounded-[22px] bg-white p-6.5">
      <h2 className="mb-4.5 font-heading text-lg font-extrabold text-foreground">الحساب</h2>
      <label className="mb-5.5 block">
        <span className="mb-2 block text-[13px] font-semibold text-admin-muted-2">اسم المستخدم</span>
        <div className="admin-input text-admin-muted-2">{username}</div>
      </label>

      <div className="mb-5.5 h-px bg-admin-divider" />

      <p className="mb-3.5 text-[14.5px] font-bold text-foreground">تغيير كلمة المرور</p>
      <label className="mb-3.5 block">
        <span className="mb-2 block text-[13px] font-semibold text-admin-muted-2">كلمة المرور الحالية</span>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="admin-input" autoComplete="current-password" />
      </label>
      <label className="mb-2 block">
        <span className="mb-2 block text-[13px] font-semibold text-admin-muted-2">كلمة المرور الجديدة</span>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="admin-input" autoComplete="new-password" />
      </label>
      <div className="mb-2 flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={cn("h-[5px] flex-1 rounded-full", i < strength ? "bg-primary" : "bg-admin-divider")} />
        ))}
      </div>
      <p className="mb-4 text-xs leading-[1.7] text-admin-muted">
        ١٢ حرف على الأقل، وتحتوي أرقام ورموز. تجنّب كلمة مرور بتستخدمها بمكان تاني.
      </p>
      <label className="mb-5 block">
        <span className="mb-2 block text-[13px] font-semibold text-admin-muted-2">تأكيد كلمة المرور</span>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="admin-input" autoComplete="new-password" />
      </label>
      {error && <p className="mb-3 text-xs text-admin-danger">{error}</p>}
      {success && <p className="mb-3 text-xs font-semibold text-primary">تم تحديث كلمة المرور بنجاح</p>}
      <button type="button" disabled={saving} onClick={changePassword} className="h-12 rounded-full bg-primary px-6 text-[14.5px] font-bold text-primary-foreground">
        {saving ? "جارٍ التحديث..." : "حدّث كلمة المرور"}
      </button>

      <div className="my-5.5 h-px bg-admin-divider" />

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="mb-0.5 text-sm font-semibold text-foreground">الجلسات النشطة</p>
          <p className="text-[12.5px] text-admin-muted">
            {sessionCount} {sessionCount === 1 ? "جهاز مسجّل" : "أجهزة مسجّلة"} دخول حاليًا
          </p>
        </div>
        <button type="button" disabled={signingOut} onClick={signOutEverywhere} className="h-12 shrink-0 rounded-full bg-admin-input px-5 text-[14.5px] font-bold text-admin-muted-2">
          تسجيل خروج من كل الأجهزة
        </button>
      </div>
    </div>
  );
}
