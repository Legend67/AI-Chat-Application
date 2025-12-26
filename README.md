# AI Support Chat Application 🤖

A full-stack AI-powered customer support chat application built with **React, TypeScript, Express, PostgreSQL, Drizzle ORM, and OpenAI**.

## ✨ Features
- 💬 Live chat UI with auto-scroll and typing indicator
- 🧠 LLM-powered contextual responses
- 📚 FAQ-grounded answers (shipping, returns, support)
- 🗄️ Persistent chat sessions (PostgreSQL + Drizzle)
- 🔁 Session-based conversation history
- 🧹 Reset chat functionality
- 🛡️ Graceful error handling

---

## 🛠 Tech Stack
**Frontend**
- React + TypeScript
- Tailwind CSS
- Vite

**Backend**
- Node.js + TypeScript
- Express
- Drizzle ORM
- PostgreSQL
- OpenAI API

---

## 📂 Repo Structure

```
AI-Chat-Application/
├── backend/               # Backend (Node.js + Express + Drizzle)
│   ├── src/
│   │   ├── db/             # Database schema & seed scripts
│   │   │   ├── schema.ts   # Drizzle schema definitions
│   │   │   ├── seedFaqs.ts # FAQ seed script
│   │   │   └── index.ts    # DB connection
│   │   ├── routes/
│   │   │   └── chat.ts     # Chat API routes
│   │   ├── services/
│   │   │   └── llm.ts      # LLM integration (OpenAI + fallback)
│   │   └── index.ts        # App entry point
│   ├── drizzle.config.ts   # Drizzle configuration
│   ├── package.json        # Backend dependencies & scripts
│   ├── tsconfig.json
│   └── .env                # Environment variables (not committed)
│
├── frontend/               # Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── App.tsx         # Chat UI
│   │   ├── main.tsx        # React entry
│   │   └── index.css       # Tailwind styles
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json        # Frontend dependencies & scripts
│
├── README.md               # Project documentation
├── LICENSE
└── .gitignore
```

---

## First-Time Setup

### Clone Repository
```bash
git clone https://github.com/Legend67/AI-Chat-Application
cd AI-Support-Chat
```

---

## 🐘 PostgreSQL Installation and Setup
```
Download PostgreSQL from the official site:
👉 https://www.postgresql.org/download/

- Run the installer.
- During setup:
- Set a password for the postgres superuser
- Keep default port 5432
- Ensure pgAdmin and psql are selected
- After installation, restart your system (recommended).
```
Verify:
```bash
psql --version
```
Login as postgres:
```bash
psql -U postgres
```

Create user & database:
```sql
CREATE USER chatuser WITH PASSWORD 'chatpassword';
CREATE DATABASE chatdb OWNER chatuser;
GRANT ALL PRIVILEGES ON DATABASE chatdb TO chatuser;
```
Exit:
```sql
\q
```

---

## 🔐 Environment Variables

Replace `backend/.env` with your OPENAI_API_KEY:
```env
DATABASE_URL=postgresql://chatuser:chatpassword@localhost:5432/chatdb
OPENAI_API_KEY=your_openai_api_key_here
```

---

## 📦 Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

---

## 🧱 Drizzle ORM Setup

> Which will generate and create database tables.
Generate migrations:
```bash
cd backend
npx drizzle-kit generate
```

Apply migrations:
```bash
npx drizzle-kit migrate
```

---

## 📚 Seed FAQ Data

```bash
cd backend
npm run seed
```
> This inserts FAQ data such as run only once if working from local:
> Shipping policies
> Return/refund policies
> Support hours

---

## ▶️ Run Application

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3001

---

## 🔁 Chat Sessions
- Session stored in browser localStorage
- Reset button clears session and starts new chat
- New browser/incognito = new session

---

## 🤖 LLM Behavior
- Uses OpenAI API
- Includes conversation history
- FAQ-aware responses
- Graceful fallback on API failure

---
