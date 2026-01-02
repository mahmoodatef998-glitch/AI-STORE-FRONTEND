# 🔧 إصلاح مشكلة تسجيل الدخول (401 Unauthorized)

## ✅ تم التحقق:

1. ✅ **المستخدم موجود في Supabase**
   - User ID: `55c7deb7-8074-4e82-96f9-da80ded11e37`
   - Email: `admin@local`
   - Password: تم تحديثها

2. ✅ **Environment Variables موجودة**
   - `NEXT_PUBLIC_SUPABASE_URL` ✅
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅

---

## 🔍 الخطوات لحل المشكلة:

### 1️⃣ إعادة تشغيل Next.js Development Server:

```bash
# أوقف السيرفر (Ctrl+C)
# ثم أعد تشغيله:
cd FRONTEND
npm run dev
```

**⚠️ مهم:** Next.js يحتاج restart بعد تغيير Environment Variables!

---

### 2️⃣ التحقق من Environment Variables:

افتح Console في المتصفح (F12) واكتب:

```javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20));
```

**يجب أن تظهر القيم!** إذا كانت `undefined`، المشكلة في Environment Variables.

---

### 3️⃣ بيانات تسجيل الدخول الصحيحة:

#### ✅ الطريقة 1 (الأفضل):
```
Username: admin
Password: 00243540000
```

#### ✅ الطريقة 2:
```
Username: admin@local
Password: 00243540000
```

#### ❌ لا تستخدم:
```
Username: 00243540000  (قد لا يعمل إذا لم يتم إنشاء المستخدم بهذا الـ format)
Password: 00243540000
```

---

### 4️⃣ التحقق من Supabase Dashboard:

1. اذهب إلى: https://supabase.com/dashboard
2. اختر مشروعك
3. **Authentication** → **Users**
4. تحقق من وجود مستخدم:
   - **Email:** `admin@local`
   - **Email Confirmed:** ✅ (يجب أن يكون true)
   - **User Metadata:** `{username: "admin", role: "admin"}`

---

### 5️⃣ إذا استمرت المشكلة:

#### أ) تحقق من Network Tab (F12):
- ابحث عن `/auth/v1/token` request
- افتح Request payload
- تحقق من:
  ```json
  {
    "email": "admin@local",
    "password": "00243540000"
  }
  ```

#### ب) تحقق من Response:
- إذا كان 401، تحقق من:
  - Email صحيح؟
  - Password صحيح؟
  - User موجود في Supabase؟

#### ج) جرب إنشاء مستخدم جديد:
```bash
cd BACKEND
node check_and_create_admin.js
```

---

### 6️⃣ حل بديل: استخدام Email مباشرة:

إذا لم يعمل Username، جرب:

```
Username: admin@local
Password: 00243540000
```

---

## 📋 بيانات تسجيل الدخول النهائية:

```
Username: admin
Password: 00243540000
```

أو

```
Username: admin@local
Password: 00243540000
```

---

## ⚠️ ملاحظات مهمة:

1. **Next.js يحتاج restart** بعد تغيير Environment Variables
2. **تحقق من Console** للأخطاء
3. **تحقق من Network Tab** للـ requests
4. **تأكد من Supabase** أن المستخدم موجود و Email confirmed

---

**إذا استمرت المشكلة، أرسل لي:**
- Screenshot من Console
- Screenshot من Network Tab
- Screenshot من Supabase Dashboard → Users


