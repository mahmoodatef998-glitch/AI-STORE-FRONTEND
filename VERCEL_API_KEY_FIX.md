# 🔧 إصلاح مشكلة "Invalid API key" في Vercel

## ❌ المشكلة:
```
AuthApiError: Invalid API key
Error Code: 401
```

## ✅ الحل:

### 1️⃣ تحقق من Environment Variables في Vercel:

1. اذهب إلى **Vercel Dashboard**
2. اختر مشروعك: `AI-STORE-FRONTEND`
3. اذهب إلى **Settings** → **Environment Variables**
4. تحقق من وجود هذه المتغيرات:

```
NEXT_PUBLIC_SUPABASE_URL=https://nueufozblbymuvzlbywf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8
```

### 2️⃣ إذا كانت موجودة لكن لا تزال المشكلة:

#### أ) تحقق من القيم:
- تأكد من عدم وجود مسافات إضافية
- تأكد من عدم وجود `"` أو `'` في القيم
- تأكد من أن القيم كاملة (لا توجد نقاط `...`)

#### ب) Redeploy:
1. بعد تحديث Environment Variables
2. اذهب إلى **Deployments**
3. اضغط على **⋮** بجانب آخر deployment
4. اختر **Redeploy**
5. تأكد من **Use existing Build Cache** = **No**
6. اضغط **Redeploy**

### 3️⃣ إذا لم تكن موجودة:

#### أ) أضف Environment Variables:

1. **Settings** → **Environment Variables**
2. اضغط **Add New**
3. أضف:

**Variable 1:**
- Key: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://nueufozblbymuvzlbywf.supabase.co`
- Environment: `Production`, `Preview`, `Development` (اختر الكل)
- اضغط **Save**

**Variable 2:**
- Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8`
- Environment: `Production`, `Preview`, `Development` (اختر الكل)
- اضغط **Save**

#### ب) Redeploy:
1. بعد إضافة Environment Variables
2. اذهب إلى **Deployments**
3. اضغط على **⋮** بجانب آخر deployment
4. اختر **Redeploy**
5. تأكد من **Use existing Build Cache** = **No**
6. اضغط **Redeploy**

---

## 🔍 التحقق من القيم الصحيحة:

### من Supabase Dashboard:

1. اذهب إلى **Supabase Dashboard**
2. اختر مشروعك
3. اذهب إلى **Settings** → **API**
4. ستجد:
   - **Project URL**: `https://nueufozblbymuvzlbywf.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### تأكد من:
- ✅ **Project URL** = `NEXT_PUBLIC_SUPABASE_URL`
- ✅ **anon public key** = `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ❌ **لا تستخدم** `service_role` key (هذا للـ Backend فقط)

---

## 📋 قائمة التحقق:

- [ ] Environment Variables موجودة في Vercel
- [ ] القيم صحيحة (بدون مسافات إضافية)
- [ ] تم اختيار جميع Environments (Production, Preview, Development)
- [ ] تم Redeploy بعد تحديث Environment Variables
- [ ] تم استخدام **anon public key** (ليس service_role)
- [ ] تم Clear Browser Cache بعد Redeploy

---

## 🚀 بعد إصلاح المشكلة:

1. انتظر حتى يكتمل Deploy (2-3 دقائق)
2. Clear Browser Cache (Ctrl+Shift+R)
3. جرب تسجيل الدخول مرة أخرى
4. افتح Console (F12) وتحقق من:
   ```
   🔍 Environment Check:
     Supabase URL: ✅ https://nueufozblbymuvzlbywf.supabase.co
     Supabase Key: ✅ EXISTS (...)
   ```

---

## ⚠️ ملاحظات مهمة:

1. **لا تشارك** `service_role` key في Frontend
2. **استخدم فقط** `anon public` key في Frontend
3. **تأكد من** Redeploy بعد تحديث Environment Variables
4. **Clear Browser Cache** بعد Redeploy

---

**بعد اتباع هذه الخطوات، يجب أن تعمل! ✅**

