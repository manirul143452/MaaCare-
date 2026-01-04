
# MaaCare - Comprehensive Maternal & Child Health Companion

MaaCare is a world-class digital health platform designed to support mothers and parents through every milestone—from preconception planning to early childhood care. Built with advanced AI and clinical expertise.

## 🔗 Repository
[https://github.com/manirul143452/MaaCare-.git](https://github.com/manirul143452/MaaCare-.git)

## 🌟 Key Features

- **Multimodal AI Companion**: Vision-enabled AI (Gemini 3 Flash) for analyzing symptoms, nutrition labels, and ultrasound images.
- **AI Symptom Checker**: Rapid medical triage for parents and children.
- **Virtual Consultations**: Encrypted video calls with certified pediatricians, OB-GYNs, and lactation consultants.
- **Practitioner Hub**: Specialized views for Doctors to manage their clinical presence and profile photos.
- **Vaccination Tracker**: Interactive clinical immunization schedules for mother and baby.
- **Parents Park**: Social community for sharing milestones and advice.

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (@google/genai)
- **Icons**: Lucide React
- **Real-time**: Gemini Live API for low-latency voice consultations.

## 🚀 Local Setup

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/manirul143452/MaaCare-.git
    cd MaaCare-
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file:
    ```env
    API_KEY=your_gemini_api_key
    ```

4.  **Launch**:
    ```bash
    npm start
    ```

## � Deployment (GitHub Pages)

A GitHub Actions workflow is included to automatically build and deploy the site to GitHub Pages on push to `main`.

1. Ensure `GEMINI_API_KEY` is set in the repository Settings → Secrets (for production features).
2. Push to `main` and the workflow will build the project and publish the `dist/` folder to the `gh-pages` branch.

> If you prefer Vercel/Netlify or Docker-based deployment, let me know and I can add those configs.

---

## �📄 License
MIT License.
<!-- pages-trigger: trigger -->