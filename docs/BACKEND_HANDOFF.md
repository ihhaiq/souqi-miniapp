# Souqi Mini App — Backend Handoff

هذا الملف هو نقطة البداية لمطور الباك إند. الفرونت إند في `agent-branch` تطبيق واحد Mobile-first، بدون Build step أو Tailwind، ومقسّم حسب المسؤولية بدل تكرار منطق الشبكة داخل الصفحات.

## 1. البنية

```text
index.html
config.js
css/
  tokens.css
  core.css
  styles.css
  pages/
js/
  api.js
  app.js
  router.js
  services/
    telegram.js
    account.js
    catalog.js
    orders.js
    wallet.js
  pages/
    subpages.js
    wallet.js
Assets/
```

- `config.js`: عنوان الـAPI، Demo mode، أسماء الـendpoints.
- `js/api.js`: HTTP transport فقط: timeout، headers، JSON، errors، Telegram initData.
- `js/services/*`: عقدة الربط مع مجالات الباك إند. لا تضع `fetch()` داخل صفحات الواجهة.
- `js/app.js`: state/rendering للسوق وتهيئة الواجهة.
- `js/router.js`: التنقل بين شاشات الـSPA.
- `js/pages/*`: تفاعل خاص بصفحة واحدة.
- `css/tokens.css`: Design tokens المشتركة.
- `css/pages/*`: تنسيقات الصفحة فقط.

## 2. تشغيل Demo / Production

الوضع الافتراضي:

```js
demoMode: true
apiBaseUrl: ""
```

لربط Backend:

```js
demoMode: false
apiBaseUrl: "https://api.example.com"
```

لا تضع أي Secret أو Bot Token أو Database credential في الفرونت إند.

## 3. مصادقة Telegram

كل طلب عبر `SouqiAPI` يرسل، عند توفره:

```http
X-Telegram-Init-Data: <Telegram.WebApp.initData>
```

على الخادم التحقق من التوقيع و`auth_date` قبل اعتبار المستخدم موثوقًا. `initDataUnsafe` في المتصفح للعرض فقط وليس للمصادقة.

## 4. Service contract

استخدم هذه الواجهات من الـFrontend بدل `fetch` المباشر:

```js
SouqiServices.account.bootstrap()
SouqiServices.account.getProfile()

SouqiServices.catalog.list(category, query)
SouqiServices.catalog.get(id)

SouqiServices.orders.list(query)
SouqiServices.orders.create(payload)

SouqiServices.wallet.get()
SouqiServices.wallet.topUp(payload)
SouqiServices.wallet.activity(query)
SouqiServices.wallet.transfers(query)
```

## 5. Endpoints

المسارات معرفة مركزيًا في `config.js`:

| Method | Endpoint | الغرض |
|---|---|---|
| GET | `/api/bootstrap` | البيانات الأولية للمستخدم |
| GET | `/api/profile` | الملف الشخصي |
| GET | `/api/catalog?category=...` | عناصر السوق |
| GET | `/api/products/:id` | تفاصيل عنصر |
| GET | `/api/orders` | الطلبات |
| POST | `/api/orders` | إنشاء طلب شراء |
| GET | `/api/wallet` | المحفظة |
| POST | `/api/wallet/topup` | بدء تعبئة |
| GET | `/api/wallet/activity` | سجل المحفظة |
| GET | `/api/wallet/transfers` | طلبات التحويل |

ليست كل الواجهات تستدعي جميع المسارات بعد؛ وجودها في العقد يمنع خلط HTTP مع تصميم الصفحة عند إكمال الشاشات.

## 6. Bootstrap response الحالي

الحقول المستعملة حاليًا:

```json
{
  "balance": 2007,
  "wallet_balance": 0
}
```

يمكن إضافة حقول أخرى بدون كسر الفرونت إند.

## 7. Catalog

الشكل المفضل:

```json
{
  "items": [
    {
      "id": "#GIFT-1201",
      "name": "هدية كلاسيكية",
      "price": 3.76,
      "type": "gift",
      "created": "",
      "audience": ""
    }
  ]
}
```

الواجهة تقبل أيضًا Array مباشرة. يجب أن يكون `id` و`name` صالحين و`price` رقمًا.

## 8. إنشاء طلب

```http
POST /api/orders
```

```json
{
  "itemId": "#GIFT-1201",
  "category": "gifts"
}
```

السعر الظاهر في DOM غير موثوق. الخادم يسترجع السعر الحقيقي بواسطة `itemId` ويعيد التحقق من التوفر والملكية والصلاحيات.

## 9. تعبئة المحفظة

```http
POST /api/wallet/topup
```

مثال:

```json
{
  "amount": 5,
  "stars": 450,
  "source": "telegram-stars"
}
```

الخادم يتحقق من القيم المسموحة ولا يعتمد على قيمة أرسلها المتصفح كحقيقة.

## 10. أخطاء HTTP

`js/api.js` يرمي Error يحتوي:

```js
error.status
error.payload
```

شكل خطأ مقترح من الخادم:

```json
{
  "ok": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient balance"
  }
}
```

استخدم Status codes المناسبة مثل 400/401/403/404/409/422/429/500.

## 11. UI events

الواجهة تستخدم Custom Events حتى يبقى الربط قابلًا للتوسع:

- `souqi:purchase-request`
- `souqi:purchase-created`
- `souqi:purchase-error`
- `souqi:topup-request`
- `souqi:topup-created`
- `souqi:topup-error`
- `souqi:wallet-refresh`
- `souqi:social-platform-change`

## 12. حالات الصفحات

أي شاشة مرتبطة ببيانات Backend يجب أن تكون قابلة لتمثيل الحالات التالية بدون تغيير المعمارية:

```text
loading
success
empty
error
disabled
unauthorized
```

عند إضافة صفحة جديدة: CSS في `css/pages/`، تفاعل الصفحة في `js/pages/`، وطلبات الشبكة داخل Service مناسب فقط.

## 13. قواعد الأمان

- لا تثق بالـprice أو balance أو user id القادم من JavaScript.
- لا تضع Bot Token أو payment secret في الملفات الثابتة.
- تحقق من Telegram initData على السيرفر في كل سياق يتطلب هوية.
- طبّق rate limiting وidempotency على العمليات المالية/الشراء.
- لا تعتمد على Demo data كبيانات إنتاج.
