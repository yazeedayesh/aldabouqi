import { auth } from "@/auth";
import { BUSINESS } from "@/lib/constants";

export default async function AdminSettingsPage() {
  const session = await auth();

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">الإعدادات</h1>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-heading font-bold text-foreground">بروفايل الأدمن</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">اسم المستخدم</dt>
            <dd className="font-medium text-foreground">{session?.user?.name ?? "—"}</dd>
          </div>
        </dl>
        <p className="mt-4 rounded-lg bg-secondary/40 p-3 text-xs leading-relaxed text-muted-foreground">
          الدخول محمي بحساب واحد مخزّن كمتغيّرات بيئة (<code className="font-mono">ADMIN_USERNAME</code> /{" "}
          <code className="font-mono">ADMIN_PASSWORD_HASH</code>) — ما في قاعدة بيانات مستخدمين حاليًا، فتغيير كلمة
          المرور مش نموذج جوّا اللوحة، هو أمر تشغّله محليًا:
        </p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-ink p-3 text-xs text-ink-foreground">
          node scripts/hash-password.mjs &lt;كلمة المرور الجديدة&gt;
        </pre>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          وبعدها حدّث قيمة <code className="font-mono">ADMIN_PASSWORD_HASH</code> بمتغيّرات بيئة Vercel بالناتج، وأعد
          النشر.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-heading font-bold text-foreground">بيانات العمل المعروضة بالموقع</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          مصدرها الوحيد <code className="font-mono">src/lib/constants.ts</code> — تعديلها هون بالكود ينعكس تلقائيًا
          على كل صفحة والـschema.org.
        </p>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="الاسم" value={BUSINESS.nameAr} />
          <Row label="الهاتف / واتساب" value={BUSINESS.phoneDisplay} />
          <Row label="البريد الإلكتروني" value={BUSINESS.email} />
          <Row label="فيسبوك" value={BUSINESS.social.facebook} />
          <Row label="انستغرام" value={BUSINESS.social.instagram} />
          <Row label="X" value={BUSINESS.social.twitter} />
        </dl>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium text-foreground">{value}</dd>
    </div>
  );
}
