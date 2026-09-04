import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { JsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { BUSINESS, SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

const content = {
  ar: {
    metaTitle: "سياسة الخصوصية | شركة الدابوقي لشراء الأثاث المستعمل في عمان",
    metaDescription:
      "سياسة الخصوصية لموقع شركة الدابوقي: كيف نجمع بياناتك ونستخدمها ونحميها عند تواصلك معنا عبر النموذج أو واتساب أو الهاتف، وسياسة ملفات تعريف الارتباط (Cookies) وأدوات التحليل.",
    pageTitle: "سياسة الخصوصية",
    lastUpdated: "آخر تحديث: 21 أغسطس 2026",
    intro:
      "نحن في شركة الدابوقي لشراء الأثاث المستعمل نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه الصفحة نوع البيانات التي نجمعها من زوار موقعنا aldabouqi.com، وكيفية استخدامها وحمايتها، وما هي حقوقك تجاهها.",
    sections: [
      { title: "1. البيانات التي نجمعها", body: ["نجمع بيانات شخصية فقط عندما تزودنا بها طوعًا، وذلك عبر:", "نموذج التواصل على الموقع: الاسم الكامل، البريد الإلكتروني، رقم الهاتف، ونص الرسالة التي ترسلها لنا لطلب تقييم أو شراء الأثاث.", "التواصل عبر واتساب أو الاتصال الهاتفي المباشر: عند الضغط على أزرار الاتصال أو واتساب، تنتقل مباشرة إلى تطبيق واتساب أو الهاتف الخاص بك، ولا يقوم موقعنا بتخزين أي بيانات من هذا التفاعل.", "بيانات تصفح تلقائية: مثل نوع الجهاز والمتصفح والصفحات التي تزورها، وذلك عبر أدوات التحليل الموضحة أدناه."] },
      { title: "2. كيف نستخدم بياناتك", body: ["نستخدم البيانات التي تزودنا بها للأغراض التالية فقط:", "الرد على استفسارك وترتيب موعد لمعاينة وشراء الأثاث المستعمل.", "التواصل معك بخصوص عرض السعر أو تفاصيل الخدمة.", "تحسين خدماتنا وموقعنا الإلكتروني بناءً على تحليل استخدام الزوار.", "نحن لا نبيع ولا نؤجر ولا نشارك بياناتك الشخصية مع أي جهة تسويقية خارجية."] },
      { title: "3. نموذج التواصل وطرف ثالث لمعالجة النماذج", body: ["يعتمد نموذج \"اتصل بنا\" في موقعنا على خدمة خارجية موثوقة لإرسال الرسائل (Formspree) تقوم بتوصيل رسالتك إلى بريدنا الإلكتروني مباشرة. تخضع هذه الخدمة لسياسة الخصوصية الخاصة بها، ولا نحتفظ نحن بنسخة من بياناتك على خوادم منفصلة سوى ما يصلنا عبر البريد الإلكتروني للرد عليك."] },
      { title: "4. ملفات تعريف الارتباط (Cookies) وأدوات التحليل", body: ["يستخدم موقعنا خدمة Google Analytics (عبر Google تاغ / gtag.js) لفهم كيفية استخدام الزوار للموقع، مثل عدد الزيارات والصفحات الأكثر مشاهدة ومصدر الزيارة. تعتمد هذه الأداة على ملفات تعريف ارتباط (Cookies) قد تجمع بيانات غير شخصية مثل نوع الجهاز والموقع الجغرافي التقريبي ومدة التصفح.", "يمكنك في أي وقت تعطيل ملفات تعريف الارتباط أو حذفها من خلال إعدادات المتصفح الذي تستخدمه، دون أن يؤثر ذلك على قدرتك على تصفح محتوى الموقع الأساسي."] },
      { title: "5. مشاركة البيانات مع أطراف ثالثة", body: ["لا نشارك بياناتك الشخصية مع أي جهة خارجية باستثناء:", "مزودي الخدمات التقنية الضروريين لتشغيل الموقع (مثل استضافة الموقع، وخدمة إرسال نماذج التواصل، وGoogle Analytics).", "عند إلزامنا بذلك بموجب القانون الأردني أو أمر من جهة رسمية مختصة."] },
      { title: "6. أمان البيانات", body: ["نتخذ إجراءات معقولة لحماية بياناتك من الوصول غير المصرح به أو الفقدان أو سوء الاستخدام، بما في ذلك استخدام اتصال مشفر (HTTPS) في جميع صفحات الموقع."] },
      { title: "7. حقوقك", body: ["يحق لك في أي وقت أن تطلب منا الاطلاع على البيانات التي تخصك، أو تصحيحها، أو حذفها من سجلاتنا، وذلك بالتواصل معنا عبر بيانات التواصل أدناه."] },
      { title: "8. خصوصية الأطفال", body: ["موقعنا موجه للبالغين الراغبين في بيع أثاثهم المستعمل، ولا نجمع عمدًا أي بيانات من الأطفال دون سن 18 عامًا."] },
      { title: "9. روابط لمواقع خارجية", body: ["قد يحتوي موقعنا على روابط لمواقع خارجية مثل واتساب وخرائط جوجل ومنصات التواصل الاجتماعي (فيسبوك، إنستغرام، إكس). لسنا مسؤولين عن سياسات الخصوصية أو محتوى تلك المواقع الخارجية."] },
      { title: "10. تعديلات على سياسة الخصوصية", body: ["قد نقوم بتحديث هذه السياسة من وقت لآخر لتعكس أي تغييرات في ممارساتنا أو لأسباب تشغيلية أو قانونية. سيتم نشر أي تحديث على هذه الصفحة مع تاريخ آخر تحديث."] },
      { title: "11. تواصل معنا", body: ["لأي استفسار يتعلق بسياسة الخصوصية أو بياناتك الشخصية، يمكنك التواصل معنا عبر:", `الهاتف / واتساب: ${BUSINESS.phoneDisplay}`, `البريد الإلكتروني: ${BUSINESS.email}`, "العنوان: جميع مناطق عمان، الأردن"] },
    ],
  },
  en: {
    metaTitle: "Privacy Policy | Aldabouqi - Buying Used Furniture in Amman",
    metaDescription:
      "Aldabouqi's privacy policy: how we collect, use and protect your data when you contact us through our form, WhatsApp or phone, and our cookie and analytics policy.",
    pageTitle: "Privacy Policy",
    lastUpdated: "Last updated: August 21, 2026",
    intro:
      "At Aldabouqi Used Furniture Buying Company, we respect your privacy and are committed to protecting your personal data. This page explains what information we collect from visitors to aldabouqi.com, how we use and protect it, and what rights you have over it.",
    sections: [
      { title: "1. Information We Collect", body: ["We only collect personal data when you voluntarily provide it to us, through:", "The contact form on our website: your full name, email address, phone number, and the message you send us to request a valuation or sale of your furniture.", "WhatsApp or direct phone contact: clicking our WhatsApp or call buttons takes you directly to the WhatsApp app or your phone dialer; our website does not store any data from that interaction.", "Automatic browsing data: such as device and browser type and the pages you visit, collected through the analytics tools described below."] },
      { title: "2. How We Use Your Data", body: ["We use the data you provide us solely to:", "Respond to your inquiry and arrange a viewing and purchase of your used furniture.", "Communicate with you about a price offer or service details.", "Improve our services and website based on aggregate visitor analytics.", "We do not sell, rent, or share your personal data with any third-party marketer."] },
      { title: "3. Contact Form and Third-Party Form Processing", body: ["Our \"Contact Us\" form relies on a trusted external service (Formspree) to deliver your message directly to our email inbox. This service is subject to its own privacy policy, and we do not keep a separate copy of your data other than what reaches us by email so we can respond to you."] },
      { title: "4. Cookies and Analytics", body: ["Our website uses Google Analytics (via the Google tag / gtag.js) to understand how visitors use the site, such as visit counts, most-viewed pages, and traffic sources. This tool relies on cookies that may collect non-personal data such as device type, approximate location, and browsing duration.", "You can disable or delete cookies at any time through your browser settings, without affecting your ability to browse the site's core content."] },
      { title: "5. Sharing Data with Third Parties", body: ["We do not share your personal data with any external party except:", "Technical service providers necessary to operate the site (such as web hosting, our contact-form delivery service, and Google Analytics).", "When required to do so under Jordanian law or by order of a competent official authority."] },
      { title: "6. Data Security", body: ["We take reasonable steps to protect your data from unauthorized access, loss, or misuse, including using an encrypted connection (HTTPS) across all pages of the site."] },
      { title: "7. Your Rights", body: ["You may at any time ask us to let you review, correct, or delete the data we hold about you by contacting us using the details below."] },
      { title: "8. Children's Privacy", body: ["Our website is directed at adults who wish to sell their used furniture, and we do not knowingly collect any data from children under 18 years of age."] },
      { title: "9. Links to External Websites", body: ["Our website may contain links to external sites such as WhatsApp, Google Maps, and social media platforms (Facebook, Instagram, X). We are not responsible for the privacy policies or content of those external websites."] },
      { title: "10. Changes to This Privacy Policy", body: ["We may update this policy from time to time to reflect changes in our practices or for operational or legal reasons. Any update will be posted on this page along with the last-updated date."] },
      { title: "11. Contact Us", body: ["For any questions about this privacy policy or your personal data, you can reach us at:", `Phone / WhatsApp: ${BUSINESS.phoneDisplay}`, `Email: ${BUSINESS.email}`, "Address: All areas of Amman, Jordan"] },
    ],
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy-policy">) {
  const { locale } = await params;
  const c = content[locale as Locale];
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/privacy-policy",
    locale: locale as Locale,
  });
}

export default async function PrivacyPolicyPage({ params }: PageProps<"/[locale]/privacy-policy">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = content[locale as Locale];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${c.pageTitle} - ${BUSINESS.nameAr}`,
          description: c.metaDescription,
          url: `${SITE_URL}${locale === "en" ? "/en" : ""}/privacy-policy`,
        }}
      />
      <BreadcrumbJsonLd items={[{ name: c.pageTitle, path: "/privacy-policy" }]} />

      <PageHero title={c.pageTitle} crumbs={[{ href: "/privacy-policy", label: c.pageTitle }]} />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">{c.lastUpdated}</p>
        <p className="mt-4 leading-relaxed text-foreground">{c.intro}</p>

        <div className="mt-10 space-y-8">
          {c.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-heading text-lg font-bold text-foreground">{section.title}</h2>
              <div className="mt-2 space-y-2">
                {section.body.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
