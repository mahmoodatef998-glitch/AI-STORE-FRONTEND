# 🔍 كيفية التحقق من Environment Variables في Vercel

## ❌ المشكلة الحالية:
```
AuthApiError: Invalid API key
Error Code: 401
```

هذا يعني أن Environment Variables **غير موجودة** أو **خاطئة** في Vercel.

---

## ✅ خطوات التحقق والإصلاح:

### 1️⃣ اذهب إلى Vercel Dashboard:
- https://vercel.com/dashboard
- اختر مشروعك

### 2️⃣ تحقق من Environment Variables:

#### أ) اذهب إلى:
- **Settings** → **Environment Variables**

#### ب) ابحث عن:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3️⃣ إذا لم تكن موجودة:

#### أ) أضف `NEXT_PUBLIC_SUPABASE_URL`:
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://nueufozblbymuvzlbywf.supabase.co
Environment: Production, Preview, Development (الكل)
```

#### ب) أضف `NEXT_PUBLIC_SUPABASE_ANON_KEY`:
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8
Environment: Production, Preview, Development (الكل)
```

**⚠️ مهم جداً:**
- استخدم **anon public** key (ليس service_role)
- احصل عليه من: Supabase Dashboard → Settings → API → **anon/public** key

### 4️⃣ إذا كانت موجودة لكن لا تزال المشكلة:

#### أ) تحقق من القيم:
- اضغط **Edit** بجانب كل متغير
- تأكد من:
  - ✅ لا توجد مسافات إضافية
  - ✅ القيمة كاملة (لا توجد `...`)
  - ✅ لا توجد `"` أو `'` حول القيمة
  - ✅ API key يبدأ بـ `eyJ` (JWT token)

#### ب) احذف وأعد إضافة:
1. **احذف** المتغيرات الموجودة
2. **أعد إضافتها** من جديد
3. **Redeploy** (انظر الخطوة 5)

### 5️⃣ Redeploy (مهم جداً!):

#### أ) بعد إضافة/تحديث Environment Variables:
1. اذهب إلى **Deployments**
2. اضغط على **⋮** (ثلاث نقاط) بجانب آخر deployment
3. اختر **Redeploy**
4. **⚠️ مهم جداً:** تأكد من أن **Use existing Build Cache** = **No**
5. اضغط **Redeploy**

#### ب) انتظر Deploy:
- عادة يستغرق 2-3 دقائق
- راقب الـ Build Log

### 6️⃣ Clear Browser Cache:
- بعد اكتمال Deploy
- اضغط `Ctrl+Shift+R` (Hard Refresh)
- أو Clear Browser Cache من Settings

### 7️⃣ جرب تسجيل الدخول:
- افتح: `https://your-app.vercel.app/login`
- Username: `admin`
- Password: `00243540000`

---

## 🔍 التحقق من القيم الصحيحة:

### من Supabase Dashboard:

1. اذهب إلى: https://supabase.com/dashboard
2. اختر مشروعك
3. اذهب إلى **Settings** → **API**
4. ستجد:
   - **Project URL** → هذا هو `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → هذا هو `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**⚠️ لا تستخدم:**
- ❌ `service_role` key (هذا للـ Backend فقط)
- ❌ أي key آخر

---

## 📋 قائمة التحقق:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` موجود في Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` موجود في Vercel
- [ ] القيم صحيحة (بدون مسافات إضافية)
- [ ] API key يبدأ بـ `eyJ` (JWT token)
- [ ] تم اختيار جميع Environments (Production, Preview, Development)
- [ ] تم Redeploy بعد تحديث Environment Variables
- [ ] **Use existing Build Cache** = **No** عند Redeploy
- [ ] تم Clear Browser Cache بعد Redeploy

---

## 🐛 Debugging:

### افتح Console (F12) وتحقق من:

بعد محاولة تسجيل الدخول، يجب أن ترى:

```
🔍 Environment Check:
  Supabase URL: ✅ https://nueufozblbymuvzlbywf.supabase.co
  Supabase Key: ✅ EXISTS (eyJhbGciOiJIUzI1NiIs...) - Looks valid
```

إذا رأيت:
- `❌ MISSING` → Environment Variables غير موجودة
- `⚠️ EXISTS but may be invalid` → API key غير صحيح
- `✅ EXISTS - Looks valid` → يجب أن يعمل!

---

## ⚠️ ملاحظات مهمة:

1. **Redeploy ضروري:**
   - بعد تحديث Environment Variables، **يجب** Redeploy
   - **Use existing Build Cache** = **No** (مهم جداً!)

2. **anon public vs service_role:**
   - Frontend يستخدم **anon public** key فقط
   - Backend يستخدم **service_role** key
   - لا تخلط بينهما!

3. **API key format:**
   - يجب أن يبدأ بـ `eyJ` (JWT token)
   - إذا لم يبدأ بـ `eyJ`، فهو خاطئ

---

## ✅ بعد إصلاح المشكلة:

يجب أن ترى في Console:
```
🔍 Environment Check:
  Supabase URL: ✅ https://nueufozblbymuvzlbywf.supabase.co
  Supabase Key: ✅ EXISTS (eyJhbGciOiJIUzI1NiIs...) - Looks valid

🔐 Login Attempt:
  Username input: "admin"
  Email format: "admin@example.com"
  Password length: 11
```

وبعدها يجب أن يعمل تسجيل الدخول بنجاح! ✅

---

**بعد اتباع هذه الخطوات بدقة، يجب أن تعمل! 🚀**

