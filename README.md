# Souqi Mini App

واجهة Telegram Mini App لسوق رقمي مخصص للهدايا والمقتنيات والحسابات والمنتجات الرقمية. هذا الفرع `main` يمثل نسخة الـFrontend الجاهزة للتسليم والدمج مع الـBackend الحالي.

الواجهة Mobile-first وRTL، ومبنية بـHTML/CSS/JavaScript بدون Node.js أو framework frontend. تشغيلها النهائي يتم من FastAPI على نفس السيرفر والدومين خلف Nginx وHTTPS.

## نطاق هذا الفرع

هذا الفرع مسؤول عن:

- تصميم وتجربة المستخدم.
- صفحات السوق، الطلبات، إضافة المنتج، الوساطة، الحساب، والمحفظة.
- التنقل المحلي بين الصفحات.
- التفاعلات البصرية المحلية.
- تجهيز نقاط الربط الواضحة لمطور الـBackend.
- الحفاظ على Assets الأصلية داخل `Assets/`.

هذا الفرع لا يضيف من عنده:

- API endpoints.
- Backend schemas.
- JWT أو Session implementation.
- منطق دفع حقيقي.
- منطق صلاحيات الخادم.
- قواعد بيانات أو migrations.
- `api.js` أو `services/` خاصة بالفرونت.

أي قرار يحتاج معرفة بعقد الـBackend يتم الاتفاق عليه قبل تنفيذه.

## هيكل المشروع الحالي

```text
souqi-miniapp/
├── index.html
├── README.md
├── Assets/
├── css/
│   ├── styles.css
│   ├── tokens.css
│   ├── core.css
│   └── pages/
│       ├── market.css
│       ├── orders.css
│       ├── account.css
│       ├── wallet.css
│       └── subpages.css
└── js/
    ├── app.js
    ├── router.js
    └── pages/
        ├── orders.js
        ├── subpages.js
        └── wallet.js
```

## الصفحات الموجودة

التنقل الرئيسي الحالي:

- السوق
- طلباتي
- أضف منتج
- الوساطة
- المخزن

والصفحات الإضافية الموجودة داخل الواجهة:

- حسابي
- المحفظة

### السوق

يحتوي حاليًا على:

- عرض الهدايا والمنتجات.
- البحث.
- الفلاتر.
- الترتيب.
- تصنيفات Telegram والمنصات الاجتماعية.
- بطاقات المنتجات.
- البانر الإعلاني.
- شريط تنقل سفلي بنمط Liquid Glass.

بطاقات الهدايا تستعمل نفس اللغة الزجاجية العامة للواجهة.

### طلباتي

واجهة جاهزة لعرض المشتريات والمبيعات وحالات الصفقات. البيانات الموجودة حاليًا تجريبية ويمكن استبدالها ببيانات الـBackend.

### أضف منتج

واجهة تمهيدية لبدء إنشاء إعلان وإدارة المنتجات. نموذج الربط الفعلي مع الـBackend يبقى من مسؤولية المطور.

### الوساطة

تشمل:

- شرح خطوات الوساطة.
- الرسوم والمهل.
- طرق الدفع والتوثيق.
- سجل العمليات.
- البحث والفلاتر والصفحات.
- عرض حالة الصفقة.

### حسابي

تشمل:

- صورة واسم المستخدم.
- ID المستخدم.
- عدد الصفقات المكتملة.
- التقييم.
- عدد المنتجات.
- روابط المحفظة والمنتجات والمفضلة والخدمات.

### المحفظة

تشمل:

- بطاقة رصيد Liquid Glass ملوّنة.
- شحن عبر Telegram Stars.
- كود شحن.
- التحويل اليدوي.
- آخر حركات المحفظة.
- طلبات التحويل.
- تحديث سجل المحفظة.

## النظام البصري

الاتجاه الحالي للواجهة:

- Dark UI.
- Mobile-first.
- RTL.
- Liquid Glass شفاف وخفيف.
- الأسطح الزجاجية لا تعتمد على طبقات داكنة ثقيلة.
- النصوص والأيقونات في شريط التنقل تطفو داخل الزجاج بدون زر مستقل حول كل عنصر.
- رؤوس صفحات أضف منتج والوساطة والحساب والمحفظة تستعمل نفس مادة الزجاج الخاصة بالشريط السفلي.
- بطاقة المحفظة تستخدم سطح زجاج محايد مع طبقة لون خلف الزجاج بدل Gradient مسطح فوق السطح.

## نقاط الربط مع الـBackend

العناصر التي تحتاج فعلًا من الخادم تحمل:

```html
data-action="..."
```

والأماكن التي ستستقبل بيانات حقيقية تحمل:

```html
data-slot="..."
```

هذه الأسماء تصف وظيفة العنصر فقط، ولا تمثل endpoint أو schema.

أمثلة:

```html
<button data-action="create-listing">...</button>
<button data-action="start-mediation">...</button>
<button data-action="wallet-stars-topup" data-amount="5" data-stars="450">...</button>

<span data-slot="wallet-balance">0.00</span>
<section data-slot="market-listings"></section>
<section data-slot="mediation-history"></section>
```

حاليًا توجد عشرات نقاط الربط الدلالية داخل `index.html` لتسهيل عمل مطور الـBackend بدون تغيير تصميم الواجهة.

## أحداث Frontend الموجودة

بعض التفاعلات الحالية تطلق أحداثًا محايدة:

```text
souqi:purchase-request
souqi:topup-request
souqi:wallet-refresh
souqi:social-platform-change
```

مثال:

```js
window.addEventListener("souqi:topup-request", function (event) {
  console.log(event.detail);
});
```

هذه الأحداث ليست API contract، ويمكن للمطور ربطها أو استبدالها حسب البنية الموجودة عنده.

## معلومات الـBackend المتفق عليها

البنية الحالية عند المطور:

```text
app/web          HTML, CSS, JavaScript
app/api          FastAPI API
app/bot          Telegram bot
app/services     Business logic
app/database     Database models
migrations       Database migrations
```

التقنيات:

- Python 3.12
- FastAPI
- aiogram 3
- SQLAlchemy Async
- Alembic
- SQLite حاليًا في الإنتاج
- PostgreSQL قابل للإضافة لاحقًا
- Redis اختياري

الفرونت Static، وFastAPI يقدمه من نفس السيرفر والدومين.

## هوية مستخدم Telegram

الـBackend الحالي يعتمد على:

```text
Telegram.WebApp.initData
```

ويتم تمريره في:

```http
X-Telegram-Init-Data
```

السيرفر يتحقق من التوقيع ووقت الإصدار ويحدّث أو ينشئ المستخدم حسب الحاجة.

لا يوجد JWT أو Session Token خاص بالتطبيق حاليًا.

## السوق والـPagination

البحث والفلاتر والترتيب والـpagination مسؤولية السيرفر.

شكل الاستجابة المعروف يتضمن:

```text
items
total
page
page_size
```

وحجم الصفحة الافتراضي الحالي 12 عنصرًا.

## الصور

الوضع الحالي عند الـBackend:

- صور المنتج ترسل Base64 داخل JSON.
- البوت يرفع الصور إلى Telegram.
- قاعدة البيانات تحتفظ بـ`file_id`.
- صور المنتج العامة: من 1 إلى 5.
- إثباتات الملكية: حتى 5 صور إضافية.
- إثباتات الوساطة: JPEG / PNG / WebP.
- الصور الخاصة لا تعرض للمستخدمين غير المصرح لهم.

الانتقال مستقبلًا إلى multipart/S3 مجرد خيار تطويري وليس جزءًا من التنفيذ الحالي.

## المحفظة والدفع

طرق الشحن الموجودة:

- Telegram Stars
- تحويل يدوي
- كود شحن

### Telegram Stars

السيرفر ينشئ الفاتورة ويحدد السعر. إضافة الرصيد لا تعتمد على نجاح الواجهة، وإنما على تأكيد Telegram من جهة الخادم عبر الدفع الناجح.

### التحويل اليدوي

الحالات:

```text
PENDING
APPROVED
REJECTED
```

### كود الشحن

الكود الصالح يستخدم مرة واحدة، وتتم إضافة الرصيد كحركة في المحفظة.

شراء منتج أو فتح وساطة لا يخصم من المحفظة تلقائيًا في النظام الحالي.

## حالات المنتجات

```text
draft
pending_review
under_review
needs_changes
rejected
active
sold
suspended
```

## حالات الوساطة والصفقات

```text
pending_admin
waiting_mediator
mediator_assigned
in_progress
money_received_by_mediator
transferring_account
completed
cancelled
rejected
disputed
```

حالة الصفقة وحدها لا تكفي لتحديد كل الأزرار المتاحة؛ توجد موافقات وإثباتات وتأكيدات منفصلة يجب أن يحدد الـBackend الإجراءات المسموحة على أساسها.

## الأخطاء والتوثيق

الوضع الحالي في الـBackend يعتمد غالبًا على:

```json
{"detail": "رسالة الخطأ"}
```

لكن تم الاتفاق مبدئيًا أن التوحيد لاحقًا يكون باتجاه:

```json
{
  "code": "...",
  "message": "...",
  "fields": {},
  "request_id": "..."
}
```

يوجد `/openapi.json` في المشروع الأساسي، بينما Swagger وReDoc معطلان حاليًا.

## قواعد العمل على main

- لا تضف endpoint أو payload أو schema بالتخمين.
- لا تضف أسرارًا أو Bot Token.
- لا تجعل نجاح UI دليلًا على نجاح عملية مالية.
- لا تغيّر أسماء أو ترتيب التنقل بدون قرار واضح.
- استخدم Assets الموجودة بدل استبدالها بأيقونات عشوائية.
- حافظ على `data-action` و`data-slot`.
- أي نقطة غير محسومة وظيفيًا تُسأل قبل التنفيذ.
