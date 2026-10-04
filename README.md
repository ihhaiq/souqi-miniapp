# سوقي — تطبيق تيليجرام المصغر (Souqi Mini App)
## الواجهة الأمامية المعمارية (Branch: `webapp`)

هذا المستودع يحتوي على الواجهة الأمامية المعاد هيكلتها وتصميمها لتطبيق **سوقي** (منصة تداول الحسابات والقنوات الرقمية والوساطة الموثقة عبر Telegram Mini App).

---

## 1. المعمارية العامة ومبدأ العمل (Architecture)

يعتمد المشروع نمط **الموديولات المعيارية المستقلة (Modular Page Architecture)** ضمن إطار تطبيق صفحة واحدة (Single Page Application - SPA) ملائم لبيئة تيليجرام:

```text
front end/
├── index.html               # الحاوية الرئيسية للتطبيق (Master App Shell)
├── app.js                   # الموجه ومدير دورة حياة الصفحات (Master Router & Orchestrator)
├── README.md                # وثيقة المشروع وتوثيق الصفحات
├── باك اند.docx             # المرجع الفني الرسمي لعقود وتفاصيل الـ API
├── old V/                   # الأكواد والملفات والتصاميم السابقة كمرجع
└── splash/                  # شاشة التحميل والبدء (Module 1)
    ├── index.html           # قالب الشاشة
    ├── style.css            # تنسيقات الشاشة المعزولة
    └── script.js            # منطق التهيئة وفحص الجلسة
```

### كيف يعمل التحميل الديناميكي؟
1. يفتح تيليجرام ملف `index.html` الرئيسي المحتوي على SDK تيليجرام والتصميم الأساسي (`:root` tokens).
2. يقوم `app.js` بتهيئة تيليجرام (`expand()`, `setHeaderColor`, `BackButton`).
3. يستدعي `app.js` الصفحة المطلوبة (تبدأ تلقائياً بـ `splash`) عبر جلب `index.html` الخاص بها وربط `style.css` و `script.js` ديناميكياً وتشغيل الدالة `Module.init()`.

---

## 2. مراجع الباك إند والأكواد السابقة
- **ملف الباك إند:** تم الإبقاء على ملف [`باك اند.docx`](file:///c:/Users/PC/Desktop/front%20end/باك%20اند.docx) في جذر المشروع كمرجع إلزامي لكافة الـ Endpoints والمسميات ونماذج البيانات.
- **الأكواد السابقة:** جميع الملفات السابقة تم حفظها ونقلها إلى مجلد [`old V/`](file:///c:/Users/PC/Desktop/front%20end/old%20V/) للرجوع إلى أي منطق أو عناصر يحتاجها العميل.

---

## 3. توثيق الصفحات والشاشات (Pages Documentation)

### 1. شاشة التحميل والبدء (`splash/`)
- **المسار:** `splash/`
- **الملفات:**
  - `splash/index.html`: هيكل الشاشة الأيقوني باللون الأصفر الفاقع (شعار ثلاثي الأبعاد لـ "سوقي"، خط فاصل أسود، العنوان البارز THE BIGGEST MARKETPLACE، وشريط تقدم التحميل).
  - `splash/style.css`: تنسيقات الهوية المرجعية باللون الأصفر الكهربائي (`#FFD200`) مع مجسم الشعار ثلاثي الأبعاد المائل بظلال عميقة.
  - `splash/script.js`: إدارة دورة حياة التهيئة (مزامنة تيليجرام وتعديل لون الهيدر أثناء الشاشة الافتتاحية ثم إعادته للداكن).
- **التكامل مع Telegram WebApp:**
  - استدعاء `Telegram.WebApp.ready()` و `Telegram.WebApp.expand()`.
  - ضبط ترويسة تيليجرام المؤقتة باللون الأصفر (`#FFD200`) لاندماج كلي مع شاشة البداية، ثم إعادتها للون الداكن `#121214`.
- **التكامل مع الباك إند (Backend Integration):**
  - استخراج `Telegram.WebApp.initData` لإرسالها في ترويسة الطلبات `x-telegram-init-data` أو عبر استدعاء مزامنة الحساب (`POST /api/auth/telegram-sync`).
  - التحقق من وجود توكن صالح أو تسجيل مستخدم جديد تلقائياً في السيرفر.
- **الحالة:** مكتملة وجاهزة للمرحلة القادمة.

---

### 2. شاشة السوق الرئيسي (`market/`)
- **المسار:** [`market/`](file:///c:/Users/PC/Desktop/front%20end/market/)
- **الوثيقة التفصيلية:** [`market/README.md`](file:///c:/Users/PC/Desktop/front%20end/market/README.md)
- **الملفات:**
  - `market/index.html`: هيكل الشاشة الكامل (الشريط العلوي المزدوج، البانر الترويجي، شريط الكبسولة الموحدة، شريط البحث والفلترة، شبكة 16 بطاقة سوشيال ميديا وخدمات رقمية، وشريط التنقل السفلي الملتصق).
  - `market/style.css`: تنسيقات CSS Vanilla كاملة تدعم التكيف الشامل (Universal Responsiveness) بنسبة 100% على الهواتف مع تمركز في إطار `max-width: 480px` على الشاشات العريضة.
  - `market/script.js`: إدارة الفلترة الحية، السحب بالسحب والإفلات للشريط (Drag-to-Scroll)، نوافذ التصفية والفرز السفلية، وربط التنقل.
- **التزام صارم بنظام الأيقونات المتجهة (Zero Emojis):**
  - خلو الواجهة تماماً من الإيموجي؛ تم استبدالها بـ SVGs متجهة أحادية اللون تتغير بانسيابية عند التفعيل.
  - بطاقات حقيقية مطابقة للمرجع: `Telegram 25k`, `X Blue`, `YouTube 50k`, `Cursor Pro Plus + Grok`, `Lovable Pro`, `Kling AI`, `Manus AI`, `Quillbot`, `Netflix 4K`, `Spotify`, `Supabase Pro`, `Railway Cloud`, `Discord Nitro`, `NordVPN`, `Telegram Stars 500`, `Telegram Star Box`.
- **التكامل مع الباك إند (Backend Integration):**
  - مرتبط بـ `GET /api/listings` و `POST /api/listings/{id}/purchase` و `GET /api/app/wallet` و `GET /api/app/session` و `GET /api/mediation/history` بدون أي أزرار شكلية زائدة.
- **الحالة:** مكتمل وموثق ومختبر بنسبة 100%.

---

### جدول متابعة توثيق الشاشات القادمة:

| رقم الشاشة | اسم المجلد | الغرض الوظيفي | الربط مع الباك إند | الحالة |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `splash/` | التحميل ومزامنة الحساب | `POST /api/auth/telegram-sync` | جاهز وموثق |
| **04** | `market/` | تصفح العروض والفلترة والترتيب | `GET /api/products` | جاهز وموثق |
| **05** | `product-details/` | تفاصيل الإعلان وشراء الحساب | `GET /api/products/:id` & `POST /api/orders` | قيد الانتظار |
| **06** | `account/` | الملف الشخصي والمظهر | `GET /api/users/profile` & `PUT` | قيد الانتظار |
| **07** | `orders/` | متابعة الطلبات والمبيعات | `GET /api/orders` | قيد الانتظار |
| **08** | `sell/` | إضافة ونشر إعلان حساب جديد | `POST /api/products` (Multipart) | قيد الانتظار |
| **09** | `my-listings/` | إدارة وتعديل إعلانات المستخدم | `GET /api/products/my-listings` | قيد الانتظار |
| **10** | `mediation/` | خدمة الوساطة المخصصة (Escrow) | `GET /api/mediation` & `POST` | قيد الانتظار |
| **11** | `wallet/` | الرصيد وشحن نجوم تيليجرام | `GET /api/wallet/balance` & Stars | قيد الانتظار |
| **12** | `favorites/` | قائمة الإعلانات المحفوظة | `GET /api/favorites` | قيد الانتظار |
| **13** | `referral-earnings/` | رابط الإحالة وعمولة الـ 3% | `GET /api/referrals/stats` | قيد الانتظار |
| **14** | `vip-membership/` | اشتراكات كبار التجار | `GET /api/vip/plans` | قيد الانتظار |
| **15** | `support-complaints/`| تذاكر الدعم والشكاوى | `POST /api/support/tickets` | قيد الانتظار |
| **16** | `customer-reviews/` | تقييمات وتجارب العملاء | `GET /api/reviews` & `POST` | قيد الانتظار |
| **17** | `advertise/` | خدمات الترويج ونشر القنوات | `GET /api/ads/services` | قيد الانتظار |
| **18** | `usage-guide/` | دليل الاستخدام والأسئلة الشائعة | محتوى إرشادي ثابت | قيد الانتظار |
