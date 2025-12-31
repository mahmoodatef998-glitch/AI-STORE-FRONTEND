# 🔐 جميع Environment Variables للـ Frontend على Vercel

## 📋 المتغيرات المطلوبة (3 متغيرات):

### 1️⃣ `NEXT_PUBLIC_SUPABASE_URL` ⭐ **مطلوب**

**الوصف:** URL مشروع Supabase

**القيمة:**
```
https://nueufozblbymuvzlbywf.supabase.co
```

**من أين:**
- Supabase Dashboard → Settings → API → Project URL

**أين يُستخدم:**
- `src/lib/supabase.ts` - لإنشاء Supabase client
- `next.config.js` - للتكوين

**Environment:** Production, Preview, Development

---

### 2️⃣ `NEXT_PUBLIC_SUPABASE_ANON_KEY` ⭐ **مطلوب**

**الوصف:** Anon/Public Key من Supabase (للعمليات العامة)

**القيمة:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8
```

**من أين:**
- Supabase Dashboard → Settings → API → anon/public key

**أين يُستخدم:**
- `src/lib/supabase.ts` - لإنشاء Supabase client
- `next.config.js` - للتكوين

**Environment:** Production, Preview, Development

**⚠️ ملاحظة:** هذا المفتاح آمن للاستخدام في Frontend (مكشوف في المتصفح)

---

### 3️⃣ `NEXT_PUBLIC_API_URL` ⭐ **مطلوب**

**الوصف:** URL الـ Backend API (بعد Deploy على Railway)

**القيمة (بعد Deploy Backend):**
```
https://your-backend-app.railway.app/api
```

**مثال:**
```
https://ai-store-backend-production.up.railway.app/api
```

**من أين:**
- بعد Deploy Backend على Railway، ستحصل على URL مثل:
  - `https://your-app-name.railway.app`
  - أضف `/api` في النهاية

**أين يُستخدم:**
- `src/lib/api.ts` - لجميع API calls
- `src/app/(dashboard)/create-order/page.tsx` - لرفع الملفات
- `src/components/orders/ReceiptUpload.tsx` - لرفع وعرض الملفات
- `src/components/orders/OrdersTable.tsx` - لعرض الملفات

**Environment:** Production, Preview, Development

**⚠️ ملاحظة مهمة:**
- **لا تضع `http://localhost:3001` في Production!**
- يجب أن يكون URL الـ Backend بعد Deploy على Railway
- يجب أن ينتهي بـ `/api`

---

## 📝 قائمة كاملة للنسخ واللصق:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://nueufozblbymuvzlbywf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8

# Backend API URL (بعد Deploy على Railway)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

---

## 📊 جدول سريع:

| Name | Value | Required | Environment |
|------|-------|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nueufozblbymuvzlbywf.supabase.co` | ✅ Yes | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | ✅ Yes | All |
| `NEXT_PUBLIC_API_URL` | `https://your-backend.railway.app/api` | ✅ Yes | All |

---

## ⚠️ ملاحظات مهمة:

### 1. **`NEXT_PUBLIC_` Prefix:**
- **ضروري جداً!** أي متغير يبدأ بـ `NEXT_PUBLIC_` يكون متاح في المتصفح
- بدون هذا الـ Prefix، المتغير لن يكون متاح في Frontend

### 2. **`NEXT_PUBLIC_API_URL`:**
- ⚠️ **لا تضع `http://localhost:3001` في Production!**
- يجب أن يكون URL الـ Backend بعد Deploy على Railway
- يجب أن ينتهي بـ `/api`

### 3. **بعد Deploy Backend:**
- احصل على Railway URL
- عد إلى Vercel → Environment Variables
- حدث `NEXT_PUBLIC_API_URL` بالـ URL الجديد
- Vercel سيعيد Deploy تلقائياً

---

## 🚀 خطوات إضافة في Vercel:

1. **Vercel Dashboard** → **Project Settings** → **Environment Variables**

2. **أضف المتغيرات الثلاثة:**
   - اضغط **"Add New"**
   - أدخل Name و Value
   - اختر Environment: **Production, Preview, Development** (كلهم)
   - اضغط **"Save"**

3. **Redeploy:**
   - بعد إضافة/تحديث المتغيرات
   - Vercel سيعيد Deploy تلقائياً
   - أو اضغط **"Redeploy"** يدوياً

---

## ✅ التحقق بعد Deploy:

### 1. فتح الموقع:
```
https://your-app.vercel.app
```

### 2. فتح Console (F12):
```javascript
// تحقق من Supabase
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

// تحقق من API URL
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

### 3. اختبار Login:
- افتح صفحة Login
- جرب تسجيل الدخول
- يجب أن يعمل بدون أخطاء

---

## 🔍 متغيرات إضافية (اختيارية):

### `NODE_ENV` (تلقائي)
- Vercel يضيفه تلقائياً
- القيمة: `production` في Production

### `VERCEL_URL` (تلقائي)
- Vercel يضيفه تلقائياً
- URL الـ Deployment الحالي

### `VERCEL_ENV` (تلقائي)
- Vercel يضيفه تلقائياً
- القيمة: `production`, `preview`, أو `development`

---

## ❌ متغيرات غير مطلوبة:

- ❌ `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` - **لا تستخدمه في Frontend!** (آمن فقط في Backend)
- ❌ `DATABASE_URL` - غير مستخدم في Frontend
- ❌ `PORT` - غير مستخدم في Frontend

---

## 📞 الدعم:

إذا واجهت مشاكل:
1. تأكد من إضافة `NEXT_PUBLIC_` prefix
2. تأكد من Railway Backend يعمل
3. تأكد من CORS في Backend يسمح بـ Vercel domain
4. تحقق من Console في المتصفح للأخطاء

---

**جاهز للـ Deploy! 🚀**

