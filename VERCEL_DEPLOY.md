# 🚀 دليل نشر Frontend على Vercel

## 📋 الخطوات الكاملة:

### 1️⃣ إعداد GitHub Repository

✅ **تم بالفعل!** - Repo موجود على:
```
https://github.com/mahmoodatef998-glitch/AI-STORE-FRONTEND.git
```

---

### 2️⃣ ربط Vercel مع GitHub

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اضغط **"Add New Project"** أو **"Import Project"**
3. اختر **"Import Git Repository"**
4. اختر **GitHub** وافتح الـ Repo:
   ```
   mahmoodatef998-glitch/AI-STORE-FRONTEND
   ```

---

### 3️⃣ إعدادات المشروع في Vercel

#### Framework Preset:
- **Framework Preset:** `Next.js` (سيتم اكتشافه تلقائياً)

#### Root Directory:
- **Root Directory:** `./` (افتراضي - لا تغيره)

#### Build Settings:
- **Build Command:** `npm run build` (افتراضي)
- **Output Directory:** `.next` (افتراضي)
- **Install Command:** `npm install` (افتراضي)

---

### 4️⃣ Environment Variables (مهم جداً!)

**⚠️ قبل الضغط على Deploy، أضف المتغيرات التالية:**

#### في صفحة "Environment Variables":

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nueufozblbymuvzlbywf.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8` | Production, Preview, Development |
| `NEXT_PUBLIC_API_URL` | `https://your-backend.railway.app/api` | Production, Preview, Development |

**⚠️ ملاحظة مهمة:**
- `NEXT_PUBLIC_API_URL` يجب أن يكون URL الـ Backend بعد Deploy على Railway
- مثال: `https://ai-store-backend-production.up.railway.app/api`
- **لا تضع `http://localhost:3001` في Production!**

---

### 5️⃣ Deploy

1. بعد إضافة Environment Variables
2. اضغط **"Deploy"**
3. انتظر حتى ينتهي البناء (Build)
4. ستحصل على URL مثل: `https://ai-store-frontend.vercel.app`

---

### 6️⃣ التحقق من Deploy

#### ✅ فتح الموقع:
```
https://your-app.vercel.app
```

#### ✅ فتح Console (F12):
```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(process.env.NEXT_PUBLIC_API_URL);
```

يجب أن تظهر القيم.

#### ✅ اختبار Login:
- افتح صفحة Login
- جرب تسجيل الدخول
- يجب أن يعمل بدون أخطاء

---

## 🔧 تحديث Environment Variables بعد Deploy Backend

إذا قمت بـ Deploy Backend على Railway لاحقاً:

1. اذهب إلى **Vercel Dashboard** → **Project Settings** → **Environment Variables**
2. ابحث عن `NEXT_PUBLIC_API_URL`
3. حدث القيمة بـ Railway URL:
   ```
   https://your-backend.railway.app/api
   ```
4. اضغط **"Save"**
5. Vercel سيعيد Deploy تلقائياً

---

## 📝 Environment Variables كاملة:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://nueufozblbymuvzlbywf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8

# Backend API (بعد Deploy على Railway)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

---

## ⚠️ مشاكل شائعة وحلولها:

### 1. "Missing Supabase environment variables"
**الحل:** تأكد من إضافة `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. "API Error: Failed to fetch"
**الحل:** 
- تأكد من `NEXT_PUBLIC_API_URL` صحيح
- تأكد من Backend يعمل على Railway
- تأكد من CORS في Backend يسمح بـ Vercel domain

### 3. "401 Unauthorized"
**الحل:** 
- تأكد من Supabase Keys صحيحة
- تأكد من RLS Policies في Supabase

---

## ✅ Checklist قبل Deploy:

- [ ] GitHub Repo جاهز
- [ ] Environment Variables مضافة (3 متغيرات)
- [ ] `NEXT_PUBLIC_API_URL` يحتوي على Railway URL (بعد Deploy Backend)
- [ ] Build Command: `npm run build`
- [ ] Framework: Next.js

---

**جاهز للـ Deploy! 🚀**

