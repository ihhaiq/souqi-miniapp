# Souqi Mini App — Frontend handoff

هذه النسخة مرتبة لتسليم **الواجهة فقط** إلى مطور الباك إند، مع الحفاظ على تصميم المتجر الحالي.

## الملفات

- `index.html` — نقطة الدخول القياسية.
- `index.htm` — تحويل توافق إلى `index.html` حتى لا تنكسر الروابط القديمة.
- `css/styles.css` — تصميم الواجهة فقط.
- `js/app.js` — منطق الواجهة والتفاعل.
- `js/api.js` — طبقة الربط مع الباك إند.
- `config.js` — إعدادات رابط الـ API ووضع المعاينة.
- `Assets/` — صور وأصول الواجهة.

## تشغيل الواجهة بدون Backend

الوضع الافتراضي:

```js
demoMode: true
```

بهذا الشكل تستخدم الصفحة بيانات المعاينة الموجودة حاليًا ولا تحتاج أي خادم.

## ربط Backend

عدّل `config.js`:

```js
apiBaseUrl: "https://api.example.com",
demoMode: false
```

لا تضع Bot Token أو مفاتيح سرية أو بيانات قاعدة بيانات في ملفات الفرونت إند.

### API contract

#### GET /api/bootstrap

مثال استجابة:

```json
{
  "balance": 2007
}
```

#### GET /api/catalog?category=gifts

القيم المستخدمة حاليًا:

- `gifts`
- `avatars`
- `collectibles`
- `channels`

الاستجابة يمكن أن تكون مصفوفة مباشرة أو:

```json
{
  "items": [
    {
      "id": "#GIFT-1201",
      "name": "هدية كلاسيكية",
      "price": 3.76,
      "type": "gift"
    }
  ]
}
```

#### POST /api/orders

Body:

```json
{
  "itemId": "#GIFT-1201",
  "category": "gifts"
}
```

#### POST /api/wallet/topup

Body:

```json
{
  "amount": 50
}
```

## Telegram Mini App authentication

الفرونت إند يرسل قيمة `Telegram.WebApp.initData` إلى الخادم داخل الهيدر:

```http
X-Telegram-Init-Data: <initData>
```

على الباك إند يجب **التحقق من توقيع initData حسب Telegram** قبل الاعتماد على هوية المستخدم أو تنفيذ شراء/تعبئة.

`initDataUnsafe` في الواجهة يستخدم فقط لأشياء بصرية مثل صورة المستخدم واسم المستخدم، وليس للمصادقة على الخادم.

## Frontend events

بالإضافة إلى الـ API، الواجهة تطلق أحداثًا يمكن للباك إند/التكامل التقاطها:

- `souqi:purchase-request`
- `souqi:purchase-created`
- `souqi:topup-request`
- `souqi:topup-created`

مثال:

```js
window.addEventListener("souqi:purchase-created", function (event) {
  console.log(event.detail);
});
```

## ملاحظات التسليم

الطرف الذي يستلم الفرونت إند يحتاج هذا المستودع كاملًا، وليس `index.html` وحده، لأن الصفحة تعتمد على CSS وJavaScript وملفات داخل `Assets/`.
