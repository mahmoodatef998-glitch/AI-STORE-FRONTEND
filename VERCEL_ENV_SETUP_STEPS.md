# 🔧 خطوات إصلاح "Invalid API key" في Vercel

## ❌ المشكلة:
```
AuthApiError: Invalid API key
Error Code: 401
```

---

## ✅ الحل (خطوة بخطوة):

### 1️⃣ اذهب إلى Vercel Dashboard:
- افتح: https://vercel.com/dashboard
- اختر مشروعك: `AI-STORE-FRONTEND`

### 2️⃣ اذهب إلى Environment Variables:
- اضغط على **Settings** (في الأعلى)
- اضغط على **Environment Variables** (في القائمة الجانبية)

### 3️⃣ تحقق من المتغيرات الموجودة:

ابحث عن:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4️⃣ إذا كانت موجودة:

#### أ) تحقق من القيم:
- اضغط على **Edit** بجانب كل متغير
- تأكد من:
  - ✅ لا توجد مسافات إضافية في البداية أو النهاية
  - ✅ القيمة كاملة (لا توجد `...`)
  - ✅ لا توجد `"` أو `'` حول القيمة

#### ب) إذا كانت القيم صحيحة:
1. **احذف** المتغيرات الموجودة
2. **أعد إضافتها** من جديد
3. **Redeploy** (انظر الخطوة 6)

### 5️⃣ إذا لم تكن موجودة (أو أردت إعادة إضافتها):

#### أ) أضف `NEXT_PUBLIC_SUPABASE_URL`:
1. اضغط **Add New**
2. **Key:** `NEXT_PUBLIC_SUPABASE_URL`
3. **Value:** `https://nueufozblbymuvzlbywf.supabase.co`
4. **Environment:** اختر **Production**, **Preview**, **Development** (الكل)
5. اضغط **Save**

#### ب) أضف `NEXT_PUBLIC_SUPABASE_ANON_KEY`:
1. اضغط **Add New**
2. **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8`
4. **Environment:** اختر **Production**, **Preview**, **Development** (الكل)
5. اضغط **Save**

**⚠️ مهم جداً:**
- استخدم **anon public** key (ليس service_role)
- احصل عليه من: Supabase Dashboard → Settings → API → **anon/public** key

### 6️⃣ Redeploy:
1. اذهب إلى **Deployments** (في القائمة الجانبية)
2. اضغط على **⋮** (ثلاث نقاط) بجانب آخر deployment
3. اختر **Redeploy**
4. **⚠️ مهم:** تأكد من أن **Use existing Build Cache** = **No**
5. اضغط **Redeploy**

### 7️⃣ انتظر Deploy:
- عادة يستغرق 2-3 دقائق
- راقب الـ Build Log للتأكد من عدم وجود أخطاء

### 8️⃣ Clear Browser Cache:
- بعد اكتمال Deploy
- اضغط `Ctrl+Shift+R` (Hard Refresh)
- أو Clear Browser Cache من Settings

### 9️⃣ جرب تسجيل الدخول:
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
- [ ] تم اختيار جميع Environments (Production, Preview, Development)
- [ ] تم Redeploy بعد تحديث Environment Variables
- [ ] تم استخدام **anon public** key (ليس service_role)
- [ ] تم Clear Browser Cache بعد Redeploy
- [ ] تم فتح Console (F12) والتحقق من عدم وجود أخطاء

---

## 🐛 Debugging:

### افتح Console (F12) وتحقق من:

```
🔍 Environment Check:
  Supabase URL: ✅ https://nueufozblbymuvzlbywf.supabase.co
  Supabase Key: ✅ EXISTS (eyJhbGciOiJIUzI1NiIs...)
```

إذا رأيت:
- `❌ MISSING` → Environment Variables غير موجودة
- `⚠️ WARNING` → API key غير صحيح

---

## ⚠️ ملاحظات مهمة:

1. **`NEXT_PUBLIC_`** ضروري:
   - أي متغير يبدأ بـ `NEXT_PUBLIC_` يكون متاح في المتصفح
   - بدونها لن يعمل الكود

2. **Redeploy ضروري:**
   - بعد تحديث Environment Variables، يجب Redeploy
   - **Use existing Build Cache** = **No**

3. **anon public vs service_role:**
   - Frontend يستخدم **anon public** key فقط
   - Backend يستخدم **service_role** key
   - لا تخلط بينهما!

---

## ✅ بعد إصلاح المشكلة:

يجب أن ترى في Console:
```
🔍 Environment Check:
  Supabase URL: ✅ https://nueufozblbymuvzlbywf.supabase.co
  Supabase Key: ✅ EXISTS (eyJhbGciOiJIUzI1NiIs...)

🔐 Login Attempt:
  Username input: admin
  Email format: admin@example.com
  Password length: 11
```

وبعدها يجب أن يعمل تسجيل الدخول بنجاح! ✅

---

**بعد اتباع هذه الخطوات، يجب أن تعمل! 🚀**


