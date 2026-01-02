# ⚡ إصلاح سريع: Invalid API key

## 🔴 المشكلة:
```
AuthApiError: Invalid API key
Error Code: 401
```

## ✅ الحل السريع (3 خطوات):

### 1️⃣ اذهب إلى Vercel:
- Dashboard → مشروعك → **Settings** → **Environment Variables**

### 2️⃣ أضف/تحقق من:

**المتغير 1:**
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://nueufozblbymuvzlbywf.supabase.co
```

**المتغير 2:**
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXVmbG9zYmxieW11dnpsYnl3ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2OTk1NjEzLCJleHAiOjIwODI1NzE2MTN9.mhM0f4dV2cl7tjznIYzFbgXmmhdUWYDGGT5AXlCPCd8
```

**⚠️ مهم:** اختر **Production**, **Preview**, **Development** (الكل)

### 3️⃣ Redeploy:
- **Deployments** → **⋮** → **Redeploy**
- **Use existing Build Cache** = **No**
- اضغط **Redeploy**

---

## 🔍 التحقق من القيم الصحيحة:

من **Supabase Dashboard**:
1. Settings → **API**
2. **Project URL** = `NEXT_PUBLIC_SUPABASE_URL`
3. **anon public** key = `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## ✅ بعد Redeploy:

1. انتظر 2-3 دقائق
2. Clear Browser Cache (Ctrl+Shift+R)
3. جرب تسجيل الدخول

---

**هذا كل شيء! 🚀**


