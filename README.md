[["SHΞN zero GIT - Mobile-First GitHub Agent with AI"]](https://github.com/aishervin/Zirogit)

یک ویرایشگر و ایجنت هوشمند کامل برای مدیریت مخازن گیت‌هاب با قابلیت‌های:

- ✅ اتصال به گیت‌هاب با توکن Full Access
- ✅ پشتیبانی از سه مدل هوش مصنوعی (Gemini، DeepSeek، OpenAI)
- ✅ جستجوی وب از طریق Serper API
- ✅ ویرایشگر کد حرفه‌ای (CodeMirror)
- ✅ مدیریت فایل‌ها به‌صورت درختی
- ✅ ترمینال داخلی برای نمایش لاگ عملیات
- ✅ طراحی کاملاً ریسپانسیو برای موبایل و دسکتاپ
- ✅ امنیت بالا با استفاده از Cloudflare Pages Functions

## 🚀 دیپلوی روی Cloudflare Pages

1. وارد [Cloudflare Dashboard](https://dash.cloudflare.com/) شوید
2. به بخش **Workers & Pages** بروید
3. روی **Create Application** کلیک کنید
4. **Pages** را انتخاب کنید
5. **Connect to Git** را بزنید
6. مخزن `aishervin/Zirogit` را انتخاب کنید
7. تنظیمات زیر را اعمال کنید:
   - **Production branch**: `main`
   - **Build command**: خالی بگذارید
   - **Build output directory**: `/`
8. قبل از دیپلوی، متغیرهای محیطی زیر را در بخش **Settings > Environment Variables** اضافه کنید:
   - `GITHUB_TOKEN`: توکن گیت‌هاب شما
   - `GEMINI_API_KEY`: کلید API جمینای
   - `DEEPSEEK_API_KEY`: کلید API دیپ‌سیک
   - `OPENAI_API_KEY`: کلید API اوپن‌ای‌آی
   - `SERPER_API_KEY`: کلید API سرپر
9. روی **Save and Deploy** کلیک کنید

## 📱 استفاده در موبایل

پس از دیپلوی، می‌توانید از طریق مرورگر موبایل خود به آدرس دیپلوی‌شده متصل شوید و:
- ریپوزیتوری جدید بسازید
- فایل‌ها را ویرایش و کامیت کنید
- با هوش مصنوعی چت کنید و تغییرات کد را اعمال نمایید
- پروژه‌ها را کلون کنید

## 🔒 امنیت

تمام کلیدهای API در سمت سرور (Cloudflare Functions) نگهداری می‌شوند و هرگز در کد سمت کلاینت نمایش داده نمی‌شوند.

--- 
