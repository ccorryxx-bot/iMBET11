# iMBET11 — Premium Gaming Affiliate Platform

Premium Gaming Affiliate Platform with 3D animations and real-time stats.

> Project Status: UI Preview Only (Frontend-in-Progress)
> ဒီ repo က လက်ရှိအချိန်မှာ Frontend UI Preview အဆင့်ဘဲရှိသေးပါတယ်။ Backend logic၊ API integration နဲ့ database setup တွေ မစတင်ရသေးပါ။ Design/UI components တွေကို Build လုပ်နေဆဲအဆင့်ဖြစ်လို့ Production အတွက် အသင့်မဖြစ်သေးပါဘူး။

---

## Current Status

| Layer | Status |
|---|---|
| Frontend UI | In Progress (Preview stage) |
| Backend Logic | Not Started |
| Database / API Integration | Not Started |
| Authentication | Not Started |
| Deployment Config | Vercel preview available |

Live Preview: [i-mbet-11.vercel.app](https://i-mbet-11.vercel.app)

---

## Tech Stack (Frontend)

- React + TypeScript
- Vite — build tool
- TailwindCSS — styling
- ESLint — code quality

(Backend stack — TBD, ဆုံးဖြတ်ချက် မချရသေးပါ)

---

## Project Structure

```
iMBET11/
├── src/                  # Frontend source code (components, pages, assets)
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── eslint.config.js
└── package.json
```

Backend folder (`server/`, `api/`, `db/` စသည်) မရှိသေးပါ။ Backend architecture ကို ဆုံးဖြတ်ပြီး ပေါင်းထည့်မှသာ project ကို full-stack လို့ ခေါ်နိုင်မှာဖြစ်ပါတယ်။

---

## What's Missing (Roadmap)

- [ ] Backend server setup (Node.js / Go / etc. — ဆုံးဖြတ်ရန်)
- [ ] Database schema & connection (Supabase integration စီစဉ်ထားသည်)
- [ ] Authentication & session management
- [ ] Real API endpoints (currently UI uses static/mock data)
- [ ] Real-time stats logic (WebSocket / polling)
- [ ] Environment variable setup (.env)
- [ ] CI/CD pipeline

---

## Getting Started (Frontend Only)

```bash
git clone https://github.com/ccorryxx-bot/iMBET11.git
cd iMBET11
npm install
npm run dev
```

Browser မှာ `http://localhost:5173` ကို ဖွင့်ကြည့်ပါ — UI preview ကိုတွေ့ရမှာဖြစ်ပါတယ်။ Backend မရှိသေးလို့ data တွေက static/mock ဖြစ်နေမှာပါ။

---

## Contributing / Notes

ဒီ project ကို active development လုပ်နေဆဲဖြစ်လို့ frequent updates တွေရှိမှာဖြစ်ပါတယ်။ Backend architecture ချမှတ်ပြီးမှသာ README ကို ထပ်ပြီး update လုပ်ပေးမှာပါ။

---

Maintained by ccorryxx-bot
