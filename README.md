# OG-OJ 
A lightweight **Online Judge** system built with the MERN stack, designed to let users create, solve, and manage coding problems.

🚀 [Live Site](https://og-oj-frontend.onrender.com/)

---

## 📌 Features

- 🔐 **Authentication** — Secure user sign-up and login using JWT
- 🧑‍💻 **Problem Management** — Logged-in users can:
  - Create, view, edit, and delete _their own_ problems
  - See all public problems and try solving them
- 🧪 **Code Submission & Evaluation** — Users can:
  - Submit code in supported languages (Python, C++, Java)
  - Get real-time verdicts like ✅ Accepted, ❌ Wrong Answer, or ⏳ Time Limit Exceeded
- 🧾 **Submission History** — Users can view their past submissions in their profile
- ⚙️ **Dockerized Execution** — Each submission is run securely inside a container
- ⏰ **Scheduled Cleanup** — A `node-cron` job periodically deletes temporary code files to free up server space
- 🗃️ **MongoDB-based Backend** — Robust schema for users, problems, test cases, and solutions
- 🌐 **Deployed via Render** — Live frontend and backend for easy access

---

## 🧱 Tech Stack

- **Frontend:** React.js + Tailwind CSS
- **State Management:** Redux Toolkit
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **Code Runner:** Docker containers (for sandboxed execution)
- **Deployment:** Render
- **Scheduler:** node-cron (for automated file cleanup)
- **Future Plan:** Contest support and global leaderboard

---

## ⚙️ Run Locally

> This project is divided into 3 main folders:
>
> - `frontend/` — React.js app (Render-hosted)
> - `backend/` — Node.js + Express API
> - `compiler-service/` — Code execution service (Dockerized)

---

### 🧱 Prerequisites

- Node.js
- Docker (for running compiler service)

---

### 🚀 Running the Full App

```bash
# Clone the repo
git clone https://github.com/Mooosiee/OJ-Projext.git
cd OJ-Projext
```

---

### 1️⃣ Start the Backend

```bash
cd backend
npm install
npm run dev
```

---

### 2️⃣ Start the Frontend

```bash
cd ../frontend
npm install
npm start
```

---

### 3️⃣ Start the Compiler Service (Docker)

```bash
cd ../compiler-service
docker build -t oj-compiler .
docker run -p 8000:8000 oj-compiler
```

> 🐳 The compiler service runs in a secure Docker container to safely execute submitted code.

---

### 📌 Notes

- Make sure MongoDB is running and the backend `.env` file is configured with your DB connection.
- All services run independently. Ensure correct ports are open and not conflicting.

---

## 🧪 API Overview (Core Endpoints)

- `POST /signup` – Register a new user  
- `POST /login` – Log in and receive JWT  
- `POST /problems` – Create a new problem (user-specific)  
- `POST /submissions` – Submit code for evaluation  
- `GET /submissions` – Get your submission history  

📎 See full [API reference in HLD.pdf](./HLD.pdf)

---

## Demo Video 
https://www.loom.com/share/folder/c20e05a15ef34d7e95fb8263757f12ef

---

## 🧑‍🎓 Author

**Musfiraa Arif**  
[GitHub](https://github.com/Mooosiee)

---

## 📌 Future Roadmap

- [ ] Add admin-only features (delete/update global problems)
- [ ] Add contest creation and participation support
- [ ] Improve UI/UX polish for better feedback and accessibility
- [ ] Add leaderboard functionality
- [ ] Support more languages (Go, JavaScript)

---

## 🛡️ Access Control Notes

- Users can only edit or delete **problems they have created**
- There are currently **no separate admin roles**
- No time or memory limits are enforced during code execution yet
- Each submission is still sandboxed using Docker for basic execution safety

---

## 💡 Inspiration

Inspired by platforms like **LeetCode**, **Codeforces**, and **HackerRank**, OG-OJ is my learning-focused take on building something powerful, from scratch.
