# 🔧 حل مشاكل تسجيل الدخول

## ❌ المشكلة: 401 Unauthorized

### الأسباب المحتملة:

1. **المستخدم غير موجود في Supabase**
2. **كلمة المرور خاطئة**
3. **Supabase Keys غير صحيحة في Frontend**
4. **Email format غير متطابق**

---

## ✅ الحلول:

### 1️⃣ إنشاء/تحديث حساب Admin:

```bash
cd BACKEND
node check_and_create_admin.js
```

هذا سينشئ أو يحدث حساب admin بالبيانات:
- **Username:** `admin`
- **Password:** `00243540000`
- **Email:** `admin@local`

---

### 2️⃣ التحقق من Environment Variables في Frontend:

تأكد من إضافة هذه المتغيرات في `.env.local` (Development) أو Vercel (Production):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://nueufozblbymuvzlbywf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8
```

---

### 3️⃣ بيانات تسجيل الدخول الصحيحة:

#### الطريقة 1: Username
```
Username: admin
Password: 00243540000
```

#### الطريقة 2: Phone Number
```
Username: 00243540000
Password: 00243540000
```

#### الطريقة 3: Email Format
```
Username: admin@local
Password: 00243540000
```

---

### 4️⃣ كيف يعمل التحويل:

- `admin` → `admin@local`
- `00243540000` → `00243540000@phone.local`
- `admin@local` → `admin@local` (كما هو)

---

### 5️⃣ التحقق من Supabase Dashboard:

1. اذهب إلى: https://supabase.com/dashboard
2. اختر مشروعك
3. Authentication → Users
4. تحقق من وجود مستخدم بـ email: `admin@local`

---

### 6️⃣ إذا لم يعمل:

#### أ) تحقق من Console (F12):
- ابحث عن أخطاء JavaScript
- تحقق من Network tab للأخطاء

#### ب) تحقق من Supabase Logs:
- Supabase Dashboard → Logs → Auth Logs
- ابحث عن محاولات تسجيل الدخول الفاشلة

#### ج) جرب إنشاء مستخدم جديد:
```bash
cd BACKEND
node check_and_create_admin.js
```

---

## 🔍 Debug Steps:

1. **افتح Console (F12)**
2. **تحقق من Environment Variables:**
   ```javascript
   console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
   console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20));
   ```

3. **تحقق من Network Tab:**
   - ابحث عن `/auth/v1/token` requests
   - تحقق من Request payload
   - تحقق من Response

4. **تحقق من Supabase:**
   - تأكد من أن المستخدم موجود
   - تأكد من أن Email confirmed = true
   - تأكد من أن Password صحيح

---

## ✅ بيانات تسجيل الدخول النهائية:

```
Username: admin
Password: 00243540000
```

أو

```
Username: 00243540000
Password: 00243540000
```

---

**إذا استمرت المشكلة، تحقق من Supabase Dashboard → Authentication → Users**

