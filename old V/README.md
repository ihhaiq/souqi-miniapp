# Souqi Mini App — Frontend Template

هذا المستودع مخصص للواجهة الأمامية فقط، ليتم تسليم التصميم والتفاعلات الجاهزة إلى المطور ودمجها داخل التطبيق المصغر الموجود لديه.

لا يحتوي هذا الفرع على Backend contract، API client، services layer، endpoints مفترضة، قواعد بيانات، أو منطق دفع/مصادقة من عندنا.

## الهدف

- توفير واجهة Mobile-first جاهزة بصريًا.
- الحفاظ على RTL والتخطيط والتفاعلات المحلية.
- تنظيم CSS وJavaScript حسب الصفحات.
- إبقاء نقاط الربط محايدة حتى يربطها المطور بمنطقه الحالي.
- عدم فرض هيكل Backend أو أسماء endpoints أو schemas.

## الهيكل

```text
souqi-miniapp/
├── index.html
├── Assets/
├── css/
│   ├── styles.css
│   ├── tokens.css
│   ├── core.css
│   └── pages/
│       ├── market.css
│       ├── account.css
│       ├── wallet.css
│       └── subpages.css
└── js/
    ├── app.js
    ├── router.js
    └── pages/
        ├── subpages.js
        └── wallet.js
```

## مسؤولية الملفات

- `index.html`: هيكل الشاشات وعناصر الواجهة.
- `css/tokens.css`: القيم المشتركة للتصميم مثل الألوان والمسافات والـradius والطباعة.
- `css/core.css`: القواعد والمكونات المشتركة.
- `css/pages/*`: تنسيق كل صفحة.
- `js/app.js`: تفاعلات السوق، العرض التجريبي، Telegram UI data عند توفرها، والـrendering المحلي.
- `js/router.js`: التنقل المحلي بين صفحات الواجهة عبر hash.
- `js/pages/*`: سلوك خاص بصفحة معينة.

## نقاط الربط

الواجهة لا تنفذ Backend calls. بعض الأفعال تطلق أحداثًا محايدة يستطيع التطبيق المستلم الاستماع لها وربطها بمنطقه الموجود:

```text
souqi:purchase-request
souqi:topup-request
souqi:wallet-refresh
souqi:social-platform-change
```

مثال:

```js
window.addEventListener("souqi:purchase-request", function (event) {
  // اربط هنا تدفق الشراء الموجود أصلًا في تطبيقك.
  console.log(event.detail);
});
```

هذه الأحداث ليست API contract ولا تفرض طريقة تنفيذ محددة.

## Telegram

يتم تحميل Telegram WebApp SDK فقط لخدمة العرض داخل الواجهة، مثل:

- تهيئة Mini App عند المعاينة.
- عرض صورة واسم/ID المستخدم عند توفرها.
- استخدام تنبيه Telegram في بعض تفاعلات المعاينة.

لا تعتمد الواجهة على هذه البيانات كمصادقة، ولا تحتوي على منطق خادم.

## بيانات المعاينة

بيانات المنتجات والأسعار والقنوات الموجودة داخل JavaScript هي بيانات Frontend تجريبية لعرض التصميم فقط. المطور يستبدل مصدرها بالطريقة المناسبة لتطبيقه الحالي.

## قواعد التطوير

- لا تضف `fetch()` أو endpoints أو schemas افتراضية بدون اتفاق مع المطور.
- لا تضف أسرارًا أو Bot Token أو مفاتيح Backend.
- أي صفحة جديدة توضع CSS الخاص بها داخل `css/pages/`.
- أي تفاعل خاص بصفحة يوضع داخل `js/pages/` عندما يكون منفصلًا عن منطق السوق المشترك.
- حافظ على التطبيق Static وMobile-first ما لم يطلب المطور غير ذلك.
