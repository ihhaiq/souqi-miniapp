# Souqi Mini App — Frontend Handoff

هذا الفرع مخصص لتطوير واجهة الـMini App وتسليمها جاهزة للدمج مع الـBackend الحالي. الواجهة هنا لا تفترض endpoints أو schemas ولا تضيف منطق مصادقة أو دفع من طرفها.

## الهيكل النهائي المعروف للمشروع

المطور أوضح أن التطبيق النهائي يعمل داخل مستودع واحد، بالتقسيم التالي:

```text
app/web          HTML, CSS, JavaScript
app/api          FastAPI API
app/bot          Telegram bot / aiogram 3
app/services     Business logic
app/database     Database models
migrations       Alembic migrations
```

الفرونت Static، ويتم تقديمه من FastAPI على نفس السيرفر والدومين خلف Nginx وHTTPS. هذا الفرع يمثل مادة الواجهة التي يمكن دمجها لاحقًا داخل `app/web`.

## مسؤولية هذا الفرع

- التصميم والـRTL والـMobile-first.
- تفاعلات الواجهة المحلية والتنقل.
- حالات العرض التجريبية.
- تحديد نقاط الربط بوضوح للمطور.
- عدم فرض طريقة تنفيذ Backend.

لا نضيف هنا `api.js` أو `services/` أو `fetch()` أو JWT أو endpoints جديدة إلا بعد اتفاق صريح مع مطور الـBackend.

## نقاط الربط الدلالية

العناصر التي تحتاج ربطًا بالخادم تحمل `data-action`، والأماكن التي تستقبل بيانات حقيقية تحمل `data-slot`.

أمثلة:

```html
<button data-action="create-listing">إضافة منتج جديد</button>
<button data-action="wallet-stars-topup" data-amount="5" data-stars="450">...</button>
<button data-action="start-mediation">...</button>

<span data-slot="wallet-balance">0.00</span>
<section data-slot="market-listings"></section>
<section data-slot="mediation-history"></section>
```

هذه الأسماء تصف وظيفة العنصر فقط، وليست أسماء endpoints ولا API contract. مطور الـBackend يربطها بالمنطق والمسارات الموجودة لديه.

## الأحداث الموجودة حاليًا

بعض التفاعلات تطلق أحداث Frontend محايدة:

```text
souqi:purchase-request
souqi:topup-request
souqi:wallet-refresh
souqi:social-platform-change
```

وجود `data-action` لا يلغي هذه الأحداث ولا يغير السلوك الحالي.

## معلومات Backend المتفق عليها

- Backend: Python 3.12 + FastAPI.
- Bot: aiogram 3.
- Database access: SQLAlchemy Async + Alembic.
- قاعدة الإنتاج الحالية SQLite، مع قابلية انتقال لاحقة إلى PostgreSQL.
- التحقق من هوية مستخدم Telegram يتم حاليًا عبر `Telegram.WebApp.initData` في الهيدر `X-Telegram-Init-Data` للطلبات التي تحتاج هوية.
- البحث والفلاتر والترتيب والـpagination في السوق مسؤولية السيرفر.
- المحفظة والدفع والتأكيد تبقى مسؤولية الـBackend والبوت؛ نجاح واجهة الدفع في الفرونت وحده لا يضيف الرصيد.
- الوساطة تعتمد على الحالة وبيانات إضافية للموافقات والإثباتات، لذلك الفرونت لا يستنتج الأزرار المسموحة من `status` وحدها.

## حالات معروفة للعرض

المنتجات:

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

الوساطة / الصفقات:

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

هذه القيم موثقة للعرض والترجمة البصرية فقط. تحديد الإجراءات المسموحة يبقى من جهة الـBackend.

## قواعد التطوير

- لا تخترع endpoint أو schema أو payload من الفرونت.
- لا تضف أسرارًا أو Bot Token أو مفاتيح Backend.
- لا تجعل نجاح UI دليلًا على نجاح عملية مالية.
- حافظ على `data-action` و`data-slot` عند تعديل العناصر حتى تبقى نقاط الدمج واضحة.
- أي قرار يحتاج معرفة بعقد الـBackend يُتفق عليه مع المطور قبل تنفيذه.
