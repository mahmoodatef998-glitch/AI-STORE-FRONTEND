# 🔧 إصلاح مشكلة Environment Variables في Vercel

## ❌ المشكلة:
- الموقع يعمل على Vercel لكن يظهر خطأ "invalid API key"
- تسجيل الدخول لا يعمل

## ✅ الحل:

### 1️⃣ التحقق من Environment Variables في Vercel:

1. اذهب إلى: https://vercel.com/dashboard
2. اختر مشروعك (AI-STORE-FRONTEND)
3. اضغط على **Settings** → **Environment Variables**

---

### 2️⃣ Environment Variables المطلوبة:

يجب إضافة هذه المتغيرات **بالضبط**:

#### ✅ `NEXT_PUBLIC_SUPABASE_URL`
```
https://nueufozblbymuvzlbywf.supabase.co
```

#### ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8
```

#### ✅ `NEXT_PUBLIC_API_URL` (Backend URL من Railway)
```
https://your-backend.railway.app/api
```
**⚠️ مهم:** استبدل `your-backend.railway.app` بـ URL الفعلي لـ Backend على Railway!

---

### 3️⃣ خطوات إضافة Environment Variables:

#### أ) إضافة متغير واحد:

1. في صفحة **Environment Variables**
2. اضغط **Add New**
3. أدخل:
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://nueufozblbymuvzlbywf.supabase.co`
   - **Environment:** اختر **Production, Preview, Development** (كلهم)
4. اضغط **Save**

#### ب) كرر نفس الخطوات للمتغيرات الأخرى:

**المتغير الثاني:**
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8`
- **Environment:** Production, Preview, Development

**المتغير الثالث:**
- **Name:** `NEXT_PUBLIC_API_URL`
- **Value:** `https://your-backend.railway.app/api` (استبدل بـ URL الفعلي)
- **Environment:** Production, Preview, Development

---

### 4️⃣ إعادة Deploy بعد إضافة Environment Variables:

**⚠️ مهم جداً:** بعد إضافة Environment Variables، يجب إعادة Deploy!

#### الطريقة 1: Redeploy من Dashboard
1. اذهب إلى **Deployments**
2. اضغط على **⋮** (ثلاث نقاط) بجانب آخر deployment
3. اختر **Redeploy**
4. تأكد من اختيار **Use existing Build Cache** = **No** (لإعادة build كامل)

#### الطريقة 2: Push جديد إلى GitHub
```bash
cd FRONTEND
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

---

### 5️⃣ التحقق من Environment Variables:

بعد Redeploy، افتح الموقع على Vercel وافتح Console (F12):

```javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20));
```

**يجب أن تظهر القيم!** إذا كانت `undefined`، المشكلة في Environment Variables.

---

### 6️⃣ ملاحظات مهمة:

1. **Environment Variables يجب أن تبدأ بـ `NEXT_PUBLIC_`** لتكون متاحة في Client-side
2. **لا تضع مسافات** قبل أو بعد القيم
3. **تأكد من نسخ القيم بالكامل** بدون أخطاء
4. **بعد إضافة Environment Variables، يجب Redeploy!**

---

### 7️⃣ إذا استمرت المشكلة:

#### أ) تحقق من Build Logs:
1. اذهب إلى **Deployments**
2. اضغط على آخر deployment
3. افتح **Build Logs**
4. ابحث عن أخطاء متعلقة بـ Environment Variables

#### ب) تحقق من Runtime Logs:
1. في صفحة Deployment
2. افتح **Functions** tab
3. تحقق من Runtime Logs

#### ج) تحقق من Network Tab:
1. افتح الموقع على Vercel
2. افتح Console (F12)
3. اذهب إلى **Network** tab
4. ابحث عن `/auth/v1/token` request
5. تحقق من Request Headers - يجب أن يحتوي على `apikey` header

---

## 📋 قائمة سريعة للنسخ:

```
NEXT_PUBLIC_SUPABASE_URL=https://nueufozblbymuvzlbywf.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8

NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

---

**بعد إضافة Environment Variables وإعادة Deploy، يجب أن يعمل تسجيل الدخول! ✅**


