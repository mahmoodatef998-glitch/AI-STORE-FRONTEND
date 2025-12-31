# 🔍 كيفية التحقق من Environment Variables في Vercel

## ❌ خطأ شائع:

```
Uncaught ReferenceError: process is not defined
```

**السبب:** `process.env` غير متاح مباشرة في المتصفح في Next.js.

---

## ✅ الطريقة الصحيحة للتحقق:

### 1️⃣ في Next.js، فقط `NEXT_PUBLIC_*` متاحة في المتصفح:

في Console (F12)، استخدم:
```javascript
// ✅ صحيح
console.log(window.__NEXT_DATA__?.env?.NEXT_PUBLIC_SUPABASE_URL);

// ❌ خطأ (لا يعمل)
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
```

---

### 2️⃣ طريقة أفضل: إضافة Debug في الكود:

#### في `FRONTEND/src/app/(auth)/login/page.tsx`:

أضف في بداية `handleLogin`:

```typescript
// Debug: Check environment variables
if (typeof window !== 'undefined') {
  console.log('🔍 Environment Check:');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ MISSING');
  console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ EXISTS' : '❌ MISSING');
}
```

---

### 3️⃣ الطريقة الأسهل: فحص Network Tab:

1. افتح الموقع على Vercel
2. افتح Console (F12) → **Network** tab
3. جرب تسجيل الدخول
4. ابحث عن `/auth/v1/token` request
5. افتح Request Headers
6. تحقق من وجود `apikey` header

**إذا لم يكن موجوداً:** Environment Variables غير صحيحة في Vercel

---

## 🔧 إصلاح Environment Variables في Vercel:

### 1️⃣ اذهب إلى Vercel Dashboard:
- https://vercel.com/dashboard
- اختر مشروع: **AI-STORE-FRONTEND**
- **Settings** → **Environment Variables**

### 2️⃣ أضف/تحقق من هذه المتغيرات:

#### ✅ `NEXT_PUBLIC_SUPABASE_URL`
```
https://nueufozblbymuvzlbywf.supabase.co
```

#### ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8
```

#### ✅ `NEXT_PUBLIC_API_URL`
```
https://ai-store-backend-production.up.railway.app/api
```

### 3️⃣ Environment:
- اختر **Production, Preview, Development** (كلهم)

### 4️⃣ Save

### 5️⃣ Redeploy (مهم جداً!):
- **Deployments** → **⋮** → **Redeploy**
- **Use existing Build Cache** = **No**

---

## 🔍 التحقق بعد Redeploy:

### 1️⃣ فحص Network Tab:
- افتح Network tab
- جرب تسجيل الدخول
- ابحث عن `/auth/v1/token` request
- تحقق من Request Headers → `apikey` header موجود ✅

### 2️⃣ فحص Console:
- افتح Console
- ابحث عن أي أخطاء
- إذا ظهر `❌ Missing Supabase environment variables` → Environment Variables غير صحيحة

---

## ✅ إذا استمرت المشكلة:

### 1️⃣ تحقق من Build Logs:
- Vercel Dashboard → **Deployments**
- اضغط على آخر deployment
- افتح **Build Logs**
- ابحث عن أخطاء متعلقة بـ Environment Variables

### 2️⃣ تحقق من Runtime Logs:
- في صفحة Deployment
- افتح **Functions** tab
- تحقق من Runtime Logs

---

## 📋 ملخص:

1. ✅ `process.env` غير متاح في المتصفح مباشرة
2. ✅ استخدم Network Tab للتحقق
3. ✅ تأكد من Environment Variables في Vercel
4. ✅ Redeploy بعد إضافة/تعديل Environment Variables

---

**بعد Redeploy، يجب أن يعمل تسجيل الدخول! ✅**

