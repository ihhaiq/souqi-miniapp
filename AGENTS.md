# Souqi Mini App — Agent UI Instructions

هذا الملف هو مرجع إلزامي لأي Agent يعمل على واجهة **Souqi Mini App**.

الهدف: أي صفحة جديدة أو تعديل بصري يجب أن يبدو كأنه جزء أصلي من الصفحة الرئيسية الحالية، خصوصًا في:
- الشريط السفلي.
- رأس الصفحة.
- الألوان والأسطح.
- الـLiquid Glass.
- المسافات.
- RTL.
- ترتيب الطبقات.
- نقاط الربط مع الـBackend.

> القاعدة الأساسية: لا تخترع Style جديد للصفحة. انسخ لغة الصفحة الرئيسية الحالية ووسّعها فقط.

## 1. قواعد عامة

- الواجهة **Mobile-first**.
- الاتجاه الأساسي `RTL`.
- الخلفية الأساسية داكنة ومحايدة، وليست زرقاء أو بنفسجية.
- لا تستخدم gradients قوية كهوية عامة للصفحات.
- لا تضف ألوانًا ذهبية أو زرقاء في رؤوس الصفحات من نفسك.
- لا تجعل كل عنصر داخل صندوق Glass منفصل.
- الزجاج يستخدم للأسطح الكبيرة والمهمة، وليس حول كل أيقونة أو نص.
- حافظ على Assets الموجودة في `Assets/`.
- لا تستبدل أيقونات المشروع بأيقونات عشوائية إذا كان الأصل موجودًا.
- لا تغيّر أسماء أو ترتيب التبويبات بدون طلب صريح.
- لا تضف API أو `fetch()` أو endpoints أو schemas بالتخمين.
- إذا كانت هناك نقطة غير محسومة وظيفيًا: **اسأل قبل التنفيذ**.

## 2. ألوان وهوية الصفحة الرئيسية

الخلفية الأساسية:

```css
background: #141414;
```

الأسطح الثانوية:

```css
background: #202020;
background: #222;
```

الحدود المحايدة:

```css
border: 1px solid #303030;
```

ألوان النص:

```css
color: #fff;
color: #eee;
color: #aaa;
color: #888;
color: #777;
```

لون التفاعل الأزرق يستخدم فقط كـaccent محدود:

```css
#2ea8f5
#63c2fa
```

لا تحول الصفحة كلها إلى Theme أزرق.

## 3. الخطوط

المشروع يعتمد:

```css
--font-arabic: "Times New Roman", Times, serif;
--font-numeric: "Times New Roman", Times, serif;
```

وللأسعار/الأرقام التي تحتاج طابعًا أوضح:

```css
font-family: "Bodoni MT", "Times New Roman", serif;
```

لا تضف Google Font أو مكتبة خطوط جديدة بدون طلب.

## 4. الحد الأقصى للواجهة

```css
--app-max-width: 960px;
```

أي Surface ثابت يجب أن يحترم عرض التطبيق:

```css
width: min(calc(100% - 24px), calc(var(--app-max-width) - 24px));
```

## 5. الشريط السفلي — Bottom Navigation

الشريط السفلي الحالي هو المرجع الأساسي للـLiquid Glass.

الترتيب الحالي:
1. السوق
2. طلباتي
3. أضف منتج
4. الوساطة
5. حسابي

لا تضف تبويبًا سادسًا بدون طلب صريح.

```css
:root {
  --nav-bar-height: 72px;
  --nav-inactive-color: rgba(255,255,255,.74);
  --nav-active-color: #fff;
}

.bottom {
  position: fixed;
  left: 50%;
  bottom: calc(12px + var(--nav-safe-bottom));
  transform: translateX(-50%);
  width: min(calc(100% - 24px), calc(var(--app-max-width) - 24px));
  height: var(--nav-bar-height);
  padding: 7px 6px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0,1fr));
  gap: 2px;
  overflow: hidden;
  isolation: isolate;
  border-radius: 999px;
  background: rgba(255,255,255,.014);
  border: 1px solid rgba(255,255,255,.03);
  box-shadow:
    0 10px 24px rgba(0,0,0,.10),
    inset 0 1px 0 rgba(255,255,255,.04);
  -webkit-backdrop-filter: blur(6px) saturate(110%);
  backdrop-filter: blur(6px) saturate(110%);
  z-index: 100;
}
```

## 6. عناصر الشريط السفلي

الأيقونة والنص يطفوان داخل الشريط مباشرة.

ممنوع:
- دائرة Glass لكل عنصر.
- زر Glass إضافي حول كل أيقونة.
- Capsule زجاجية حول العنصر النشط.

```css
.nav {
  background: transparent !important;
  border: 0;
  box-shadow: none !important;
}

.nav.active {
  color: #fff;
  opacity: 1;
  transform: translateY(-1px) scale(1.025);
}
```

## 7. رأس الصفحة — Page Header

أي صفحة فرعية جديدة يجب أن تستخدم نفس رأس الوساطة/المحفظة/حسابي/طلباتي/المخزون/المفضلة.

ممنوع:
- رأس ذهبي.
- رأس أزرق.
- gradient ملون قوي.

```css
.subpage-header {
  position: sticky;
  top: 0;
  z-index: 30;
  width: calc(100% - 20px);
  min-height: 64px;
  margin: 8px 10px 0;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.014) !important;
  border: 1px solid rgba(255,255,255,.03) !important;
  box-shadow:
    0 10px 24px rgba(0,0,0,.10),
    inset 0 1px 0 rgba(255,255,255,.04) !important;
  -webkit-backdrop-filter: blur(6px) saturate(110%) !important;
  backdrop-filter: blur(6px) saturate(110%) !important;
}
```

## 8. محتوى رأس الصفحة

التوزيع العام:

```text
[ رجوع ]   [ عنوان الصفحة + سوقي ]   [ الرصيد + المحفظة ] [ همبرغر ]
```

زر الرجوع والهمبرغر:
- بدون خلفية ثقيلة.
- بدون صندوق Glass إضافي.

## 9. الرصيد في كل رأس

كل صفحة فرعية يجب أن تعرض:
- أيقونة المحفظة.
- الرصيد.
- الضغط يفتح صفحة المحفظة.

Hooks:

```html
data-go-wallet
data-action="open-wallet"
data-slot="header-wallet-balance"
```

## 10. القوائم والـSheets

أي Sheet أو Modal يجب أن يظهر فوق الشريط السفلي.

```text
Page Content        < 100
Bottom Navigation   = 100
Sheet Backdrop      = 140
Sheet / Modal       = 150
More Menu Backdrop  = 180
More Menu           = 190
```

## 11. البطاقات والأسطح

```css
.info-card {
  background: #202020;
  border: 1px solid #303030;
}
```

وعند الحاجة Glass خفيف:

```css
background: rgba(255,255,255,.014);
border: 1px solid rgba(255,255,255,.035);
box-shadow:
  0 10px 24px rgba(0,0,0,.10),
  inset 0 1px 0 rgba(255,255,255,.04);
backdrop-filter: blur(6px) saturate(110%);
```

## 12. الـAccent

```css
#2ea8f5
#63c2fa
```

يستخدم فقط في active/status/selected states.

## 13. Backend boundary

ممنوع على الـAgent يضيف من نفسه:

```text
fetch()
api.js
services/
JWT
/api/v1
payload schema
payment confirmation
authentication logic
```

## 14. data-action / data-slot

أي زر يحتاج Backend:

```html
data-action="..."
```

أي مكان يستقبل بيانات:

```html
data-slot="..."
```

لا تخترع endpoint من هذه الأسماء.

## 15. قاعدة السؤال قبل القرار

إذا لم يكن واضحًا:
- أين يفتح الزر؟
- هل العنصر مستقل أو Modal؟
- هل نعيد استخدام صفحة موجودة؟
- هل اللون مطلوب؟
- هل التغيير يشمل كل الصفحات؟
- هل نغير Backend hook؟

**اسأل المستخدم قبل التنفيذ.**

لا تتخذ قرارًا وظيفيًا من نفسك.

## 16. Checklist

- [ ] Mobile-first.
- [ ] RTL صحيح.
- [ ] الخلفية `#141414`.
- [ ] Header نفس Liquid Glass الحالي.
- [ ] Header بدون ذهبي/أزرق.
- [ ] الرصيد ظاهر في الرأس.
- [ ] المحفظة تفتح بالضغط.
- [ ] الهمبرغر موجود.
- [ ] Bottom Nav لم يتغير.
- [ ] Sheet فوق Bottom Nav.
- [ ] لا IDs مكررة.
- [ ] `data-action` موجود حيث يلزم.
- [ ] `data-slot` موجود حيث يلزم.
- [ ] لا API مفترض.
- [ ] Cache version يتم تحديثه عند تعديل CSS/JS.
- [ ] لا overflow أفقي غير مقصود.

## النتيجة المطلوبة

أي صفحة جديدة يجب أن يشعر المستخدم أنها جزء من **Souqi** الحالي، وليست صفحة من Theme مختلف.

المرجع البصري الأول دائمًا:
1. الصفحة الرئيسية.
2. الشريط السفلي.
3. رأس صفحة الوساطة/المحفظة.
4. البطاقات المحايدة الحالية.
