# MaaCare — Comprehensive Maternal & Child Health Companion 🌸

**MaaCare** is a maternal and child health platform that helps parents through pregnancy, postnatal care, and early childhood with AI-powered features, telemedicine, and practical resources.

---

## 🚀 Quick Links
- Repository: https://github.com/manirul143452/MaaCare-.git
- Demo: (add demo URL here)

## 🌟 Key Features
- Multimodal AI Companion (vision + text) for symptom analysis and guidance
- AI Symptom Checker and triage
- Secure video consultations with certified clinicians
- Vaccination and Pregnancy trackers
- Practitioner hub for doctors' profiles and scheduling
- Community space (Parents Park) for milestones and advice

## 🧭 Tech Stack
- React 19 + TypeScript
- Vite (dev server & build)
- Tailwind CSS for styling
- Google Gemini APIs (`@google/genai`) for AI features
- Lucide React for icons

## ⚙️ Project Structure
```
/maacare
  ├─ App.tsx
  ├─ index.tsx
  ├─ components/         # UI components (AICompanion, SymptomChecker, etc.)
  ├─ geminiService.ts    # AI integration helpers
  ├─ index.html
  ├─ vite.config.ts
  └─ package.json
```

## 📦 Requirements
- Node.js 18+ / npm 9+
- A Gemini API key for AI features (optional for local dev)

## 🛠️ Local Setup
1. Clone the repo
```bash
git clone https://github.com/manirul143452/MaaCare-.git
cd MaaCare-
```
2. Install dependencies
```bash
npm install
```
3. Create environment variables
- Copy `.env.example` to `.env.local` and add your keys (e.g., GEMINI_API_KEY)

4. Run the dev server
```bash
npm start
# or
npm run dev
```

5. Build for production
```bash
npm run build
npm run preview
```

## 🔒 Environment & Secrets
- Add any API keys (Gemini) to `.env.local`. Do NOT commit secrets.

## 🧪 Testing & CI
- GitHub Actions workflows (in `.github/`) are configured for build and deployment (edit as required).

## 🤝 Contributing
1. Fork the repo
2. Create a branch: `git checkout -b feat/awesome-feature`
3. Commit changes: `git commit -m "feat: add awesome feature"`
4. Push and open a PR

Please follow the code style and include prop-type/TypeScript checks in PR descriptions.

## 📜 License
MIT License — see the `LICENSE` file for details.

## ✉️ Contact
Maintainer: manirul143452 — raise issues or PRs on GitHub.

---

> Tip: If you want, I can add a CI workflow to auto-deploy to Vercel/Netlify, or expand the README with developer notes and API docs. Let me know what you'd like next!
