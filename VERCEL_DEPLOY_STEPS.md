# 🚀 خطوات نشر Frontend على Vercel

## ✅ الخطوات:

### 1️⃣ اذهب إلى Vercel
- افتح: https://vercel.com/dashboard
- اضغط **"Add New Project"** أو **"Import Project"**

### 2️⃣ ربط GitHub
- اختر **GitHub**
- اختر Repo: `mahmoodatef998-glitch/AI-STORE-FRONTEND`

### 3️⃣ إعدادات المشروع
- **Framework Preset:** `Next.js` (تلقائي)
- **Root Directory:** `./` (افتراضي)
- **Build Command:** `npm run build` (افتراضي)
- **Output Directory:** `.next` (افتراضي)

### 4️⃣ Environment Variables (مهم جداً!)

**⚠️ قبل Deploy، أضف هذه المتغيرات:**

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nueufozblbymuvzlbywf.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8` |
| `NEXT_PUBLIC_API_URL` | `https://your-backend.railway.app/api` |

**⚠️ ملاحظة:**
- `NEXT_PUBLIC_API_URL` يجب أن يكون URL الـ Backend بعد Deploy على Railway
- مثال: `https://ai-store-backend-production.up.railway.app/api`
- **لا تضع `http://localhost:3001`!**

### 5️⃣ Deploy
- اضغط **"Deploy"**
- انتظر حتى ينتهي البناء

---

## 📋 Environment Variables كاملة:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://nueufozblbymuvzlbywf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

---

## ✅ التحقق بعد Deploy:

1. افتح: `https://your-app.vercel.app`
2. افتح Console (F12)
3. اكتب: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
4. يجب أن تظهر القيمة

---

**جاهز للـ Deploy! 🚀**

