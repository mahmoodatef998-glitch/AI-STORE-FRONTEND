# 🔧 Environment Variables لـ Vercel Deployment

## 📋 المتغيرات المطلوبة (3 متغيرات):

### 1️⃣ `NEXT_PUBLIC_SUPABASE_URL`
**القيمة:**
```
https://nueufozblbymuvzlbywf.supabase.co
```

**من أين:**
- Supabase Dashboard → Settings → API → Project URL

---

### 2️⃣ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
**القيمة:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8
```

**من أين:**
- Supabase Dashboard → Settings → API → anon/public key

---

### 3️⃣ `NEXT_PUBLIC_API_URL`
**القيمة (بعد Deploy Backend على Railway):**
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

---

## 🚀 خطوات إضافة المتغيرات في Vercel:

### 1. بعد Import Project:
- Vercel Dashboard → Project Settings → Environment Variables

### 2. أضف المتغيرات الثلاثة:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nueufozblbymuvzlbywf.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_API_URL` | `https://your-backend.railway.app/api` |

### 3. Environment:
- اختر **Production, Preview, Development** (كلهم)

### 4. Save

---

## ⚠️ ملاحظات مهمة:

1. **`NEXT_PUBLIC_`** ضروري:
   - أي متغير يبدأ بـ `NEXT_PUBLIC_` يكون متاح في المتصفح
   - بدونها لن يعمل الكود

2. **`NEXT_PUBLIC_API_URL`:**
   - ⚠️ لا تضع `http://localhost:3001` في Production!
   - استخدم Railway URL بعد Deploy Backend

3. **بعد Deploy Backend:**
   - احصل على Railway URL
   - عد إلى Vercel → Environment Variables
   - حدث `NEXT_PUBLIC_API_URL` بالـ URL الجديد

---

## 📝 مثال كامل:

```
NEXT_PUBLIC_SUPABASE_URL=https://nueufozblbymuvzlbywf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8
NEXT_PUBLIC_API_URL=https://ai-store-backend-production.up.railway.app/api
```

---

## ✅ التحقق:

بعد Deploy، افتح:
- `https://your-app.vercel.app`
- افتح Console (F12)
- اكتب: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
- يجب أن تظهر القيمة

---

**جاهز للـ Deploy! 🚀**

