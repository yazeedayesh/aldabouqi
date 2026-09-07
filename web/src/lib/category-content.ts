/**
 * Hand-written SEO content per store category — intro paragraph and FAQ only.
 * Keyed by the category's stable slug rather than its id, since slugs are
 * what the 8 launch categories are identified by; a category an admin adds
 * later simply won't have an entry here and the page falls back to its thin
 * default (title + grid only) rather than breaking.
 *
 * Category photos are NOT hardcoded here — every category image comes from
 * `categories.image` (admin-managed, uploaded per category in the dashboard)
 * with an icon placeholder fallback when unset. Earlier this file also held
 * a `heroImage` reusing the 7 generic service photos (public/img/service)
 * per category; those photos are generic showroom/staff shots with no
 * category-specific subject (e.g. "appliances" pointed at a photo of a sofa),
 * so they were removed outright rather than kept as a fallback (site owner's
 * own rule, 2026-09-07: "الصورة الغلط أسوأ من لا صورة").
 */

type Faq = { question: string; answer: string };

export type CategoryContent = {
  introAr: string;
  introEn: string;
  faqAr: Faq[];
  faqEn: Faq[];
};

export const categoryContent: Record<string, CategoryContent> = {
  bedrooms: {
    introAr: "نبيع غرف نوم مستعملة بجميع أنواعها في عمان: خشب طبيعي، MDF، تركي وصيني. كل قطعة معروضة هون تم فحصها وتصنيف حالتها بدقة قبل النشر، وبتقدر تتواصل معنا مباشرة عبر واتساب لأي استفسار أو لترتيب المعاينة والتوصيل.",
    introEn: "We sell used bedrooms of every kind in Amman: solid wood, MDF, Turkish, and Chinese. Every piece listed here has been inspected and honestly graded before it went live — message us on WhatsApp for any question or to arrange delivery.",
    faqAr: [
      { question: "هل الأسعار قابلة للتفاوض؟", answer: "نعم، تقدر تتواصل معنا عبر واتساب على أي قطعة وتتفاوض على السعر مباشرة." },
      { question: "هل توصلون غرفة النوم للمنزل؟", answer: "نعم، نوفر توصيل لجميع مناطق عمان — التكلفة والتفاصيل بتنعرف عند التواصل حسب حجم القطعة والمنطقة." },
      { question: "شو الفرق بين تصنيفات الحالة (ممتازة، جيدة جداً، جيدة)؟", answer: "كل قطعة مصنّفة حسب أثر الاستخدام الفعلي عليها — التفاصيل الدقيقة موجودة بصفحة كل منتج." },
    ],
    faqEn: [
      { question: "Are the prices negotiable?", answer: "Yes — message us on WhatsApp about any piece and negotiate the price directly." },
      { question: "Do you deliver bedrooms to the buyer's home?", answer: "Yes, we deliver across every area of Amman — cost and timing depend on the piece's size and your location, confirmed when you reach out." },
      { question: "What's the difference between the condition grades?", answer: "Each piece is graded by its actual wear from real use — see the specific product page for exact details." },
    ],
  },
  salons: {
    introAr: "تشكيلة من الكنب والصالونات المستعملة بحالات مختلفة: أمريكي، تركي، ومحلي. كل قطعة موصوفة بصدق مع صور حقيقية، والسعر يظهر مباشرة أو عند التواصل حسب توفره.",
    introEn: "A selection of used sofas and living-room sets in various conditions: American, Turkish, and local. Every piece is honestly described with real photos, and priced either directly or on request.",
    faqAr: [
      { question: "هل الكنب مفحوص قبل النشر؟", answer: "نعم، كل قطعة نعاينها ونوثق حالتها الحقيقية بالصور قبل ما ننشرها." },
      { question: "بتشترون كنب مستعمل كمان؟", answer: "أكيد — هذا نشاطنا الأساسي. تواصل معنا عبر واتساب وأرسل صور القطعة للتقييم الفوري." },
      { question: "في إمكانية معاينة الكنبة قبل الشراء؟", answer: "نعم، بنرتب معاينة بالمكان يلي يناسبك قبل إتمام الشراء." },
    ],
    faqEn: [
      { question: "Are the sofas inspected before listing?", answer: "Yes, every piece is inspected and its real condition documented with photos before it's published." },
      { question: "Do you also buy used sofas?", answer: "Absolutely — that's our core business. Message us on WhatsApp with photos for an instant valuation." },
      { question: "Can I inspect a sofa before buying?", answer: "Yes, we can arrange an inspection at a convenient location before you commit." },
    ],
  },
  offices: {
    introAr: "أثاث مكتبي وكراسي مستعملة لتجهيز مكتبك أو شركتك بميزانية أقل: مكاتب إدارية، كراسي، وخزائن ملفات. مناسب للشركات الناشئة وأي جهة بتدور على تجهيز سريع وموثوق.",
    introEn: "Used office furniture and chairs to set up your office or company on a smaller budget: executive desks, chairs, and filing cabinets. Well suited to startups or anyone who needs a fast, reliable setup.",
    faqAr: [
      { question: "هل تبيعون بالقطعة أو طقم كامل بس؟", answer: "الاثنين متوفرين — تقدر تشتري قطعة وحدة أو تجهيز مكتب كامل حسب احتياجك." },
      { question: "هل تشترون أثاث مكتبي من شركات بتسكر أو بتنقل؟", answer: "نعم، من أهم خدماتنا شراء تجهيزات المكاتب كاملة عند الإغلاق أو النقل — تواصل معنا لتفاصيل الأسعار." },
      { question: "هل في ضمان على القطع؟", answer: "كل قطعة توصف بحالتها الفعلية بصدق، وتقدر تعاينها بنفسك قبل الشراء." },
    ],
    faqEn: [
      { question: "Do you sell single pieces or only full sets?", answer: "Both — buy a single piece or fit out an entire office, depending on what you need." },
      { question: "Do you buy office furniture from companies closing or relocating?", answer: "Yes, that's one of our core services — buying a full office setup during closure or relocation. Message us for pricing." },
      { question: "Is there a warranty on pieces?", answer: "Every piece is honestly described by its real condition, and you're welcome to inspect it yourself before buying." },
    ],
  },
  appliances: {
    introAr: "أجهزة كهربائية منزلية مستعملة ومفحوصة كهربائياً: ثلاجات، غسالات، مكيفات، وتلفزيونات. كل جهاز بنتأكد من شغله قبل ما نعرضه.",
    introEn: "Used home appliances, electrically checked before listing: refrigerators, washing machines, air conditioners, and TVs. We confirm every unit actually works before it goes up.",
    faqAr: [
      { question: "هل الأجهزة مضمونة الشغل؟", answer: "نتأكد من فحص كل جهاز كهربائياً قبل النشر، ونذكر أي ملاحظة على حالته بصدق." },
      { question: "بتشترون أجهزة كهربائية مستعملة؟", answer: "نعم، أرسل صور الجهاز ورقم الموديل إن أمكن عبر واتساب وبنقيّمه فوراً." },
      { question: "هل التوصيل والتركيب متوفر؟", answer: "التوصيل متوفر لجميع مناطق عمان، والتركيب (مثل المكيفات) بيتفق عليه بشكل منفصل حسب الجهاز." },
    ],
    faqEn: [
      { question: "Are the appliances guaranteed to work?", answer: "Every appliance is electrically tested before listing, and any issue is disclosed honestly." },
      { question: "Do you buy used appliances?", answer: "Yes — send photos and the model number if you have it via WhatsApp for an instant valuation." },
      { question: "Is delivery and installation available?", answer: "Delivery covers all of Amman; installation (e.g. for AC units) is arranged separately depending on the appliance." },
    ],
  },
  other: {
    introAr: "قطع ديكور ونثريات متنوعة ما بتندرج تحت قسم محدد: مرايا، سجاد، تحف، وإكسسوارات منزلية. أضف قسم منها لبيتك بسعر أقل من الجديد.",
    introEn: "A mix of decor and miscellaneous pieces that don't fit a specific category: mirrors, carpets, ornaments, and home accessories. Add a touch to your home for less than buying new.",
    faqAr: [
      { question: "شو أنواع القطع الموجودة بهاد القسم؟", answer: "أي قطعة منزلية حقيقية ما بتندرج تحت غرف النوم أو الكنب أو المكاتب أو الأجهزة — مثل المرايا والسجاد والتحف." },
      { question: "بتشترون قطع ديكور وأنتيكات؟", answer: "نعم، أرسل صور القطعة عبر واتساب وبنقيّمها حسب حالتها وندرتها." },
      { question: "هل الأسعار ثابتة؟", answer: "بعض القطع سعرها معروض مباشرة، وبعضها الآخر يظهر عند التواصل حسب طبيعة القطعة." },
    ],
    faqEn: [
      { question: "What kind of items are in this category?", answer: "Any real home item that doesn't fit bedrooms, sofas, offices, or appliances — mirrors, carpets, and ornaments, for example." },
      { question: "Do you buy decor pieces and antiques?", answer: "Yes, send photos via WhatsApp and we'll value the piece based on its condition and rarity." },
      { question: "Are prices fixed?", answer: "Some pieces are priced directly; others show as price-on-request depending on the item." },
    ],
  },
  "bedrooms-no-wardrobe": {
    introAr: "غرف نوم مستعملة بدون خزانة — مناسبة إذا عندك خزائن حائط جاهزة أو دولاب منفصل وما بدك تدفع زيادة على خزانة ضمن الطقم. توفير حقيقي وشائع بسوق الأثاث المستعمل.",
    introEn: "Used bedroom sets without a wardrobe — ideal if you already have built-in wall closets or a separate wardrobe and don't want to pay extra for one bundled in. A real, common saving in the used-furniture market.",
    faqAr: [
      { question: "شو يعني \"بدون خزانة\"؟", answer: "الطقم بيشمل السرير والكومودينو (وأحياناً التسريحة) بدون دولاب — مناسب لو عندك تخزين بديل بالغرفة." },
      { question: "هل ممكن أضيف خزانة لاحقاً؟", answer: "أكيد، تقدر تشتري دولاب منفصل من قسم غرف النوم العادي أو من مكان تاني وقت ما بدك." },
      { question: "هل الأسعار أقل من الطقم الكامل؟", answer: "عادة نعم، لأنه ما في تكلفة دولاب ضمن السعر — بس هذا بيعتمد على حالة كل قطعة بالتحديد." },
    ],
    faqEn: [
      { question: "What does \"without wardrobe\" mean?", answer: "The set includes the bed and nightstand (sometimes a dresser) without a wardrobe — good if you already have storage in the room." },
      { question: "Can I add a wardrobe later?", answer: "Sure, you can buy a separate wardrobe from the regular bedrooms category or elsewhere whenever you need one." },
      { question: "Are prices lower than a full set?", answer: "Usually yes, since there's no wardrobe cost built in — though it depends on each specific piece's condition." },
    ],
  },
  "dining-tables": {
    introAr: "طاولات سفرة مستعملة بمقاسات مختلفة (4، 6، وأكثر مقاعد)، مناسبة لأي حجم عائلة. كل طاولة موصوفة بعدد المقاعد وحالة الخشب أو السطح بدقة.",
    introEn: "Used dining tables in different sizes (4, 6, and more seats), suited to any family size. Every table is described by its seat count and the condition of the wood or surface.",
    faqAr: [
      { question: "هل الطاولة بتيجي مع الكراسي؟", answer: "أغلب الأطقم المعروضة تشمل الكراسي، وهذا مذكور بوضوح بوصف كل منتج." },
      { question: "بتشترون طاولات سفرة مستعملة؟", answer: "نعم، أرسل صور الطاولة وعدد الكراسي عبر واتساب للتقييم." },
      { question: "هل ممكن أشتري طاولة بدون كراسي؟", answer: "إذا كانت متوفرة بشكل منفصل، نعم — تواصل معنا للتأكد من توفر هذا الخيار للقطعة يلي بتهمك." },
    ],
    faqEn: [
      { question: "Does the table come with chairs?", answer: "Most listed sets include the chairs, and that's stated clearly in each product's description." },
      { question: "Do you buy used dining tables?", answer: "Yes, send photos of the table and the chair count via WhatsApp for a valuation." },
      { question: "Can I buy a table without chairs?", answer: "If it's available separately, yes — message us to check for the specific piece you're interested in." },
    ],
  },
  electronics: {
    introAr: "إلكترونيات مستعملة مفحوصة قبل النشر: تلفزيونات ومكيفات بشكل أساسي، بحالة عمل مؤكدة وسعر أقل من الجديد.",
    introEn: "Used electronics checked before listing — mainly TVs and air conditioners — confirmed working, at a price below new.",
    faqAr: [
      { question: "هل الجهاز مضمون الشغل؟", answer: "نتأكد من تشغيل كل جهاز إلكتروني قبل نشره، ونذكر أي ملاحظة على حالته بصدق." },
      { question: "بتشترون إلكترونيات مستعملة؟", answer: "نعم، أرسل صور الجهاز ورقم الموديل إن وجد عبر واتساب للتقييم الفوري." },
      { question: "هل التركيب متوفر (مثل المكيف)؟", answer: "التركيب بيتفق عليه بشكل منفصل حسب نوع الجهاز والمنطقة." },
    ],
    faqEn: [
      { question: "Is the device guaranteed to work?", answer: "We confirm every electronic item actually powers on and works before listing it, and disclose any issue honestly." },
      { question: "Do you buy used electronics?", answer: "Yes — send photos and the model number if available via WhatsApp for an instant valuation." },
      { question: "Is installation available (e.g. for an AC unit)?", answer: "Installation is arranged separately depending on the device and your area." },
    ],
  },
};
