# OG-OJ 
A lightweight **Online Judge** system built with the MERN stack, designed to let users create, solve, and manage coding problems.

🚀 [Live Site](https://og-oj-frontend.onrender.com/)

---

## 📌 Features

- 🔐 **Authentication** — Secure user sign-up and login using JWT
- 🧑‍💻 **Problem Management** — Logged-in users can:
  - Create, view, edit, and delete *their own* problems
  - See all public problems and try solving them
- 🧪 **Code Submission & Evaluation** — Users can:
  - Submit code in supported languages (Python, C++, Java)
  - Get real-time verdicts like ✅ Accepted, ❌ Wrong Answer, or ⏳ Time Limit Exceeded
- 🧾 **Submission History** — Users can view their past submissions in their profile
- ⚙️ **Dockerized Execution** — Each submission is run securely inside a container
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
- **Future Plan:** Contest support and global leaderboard

---

## ⚙️ Run Locally

```bash
# Clone the repo
git clone https://github.com/yourusername/og-oj.git
cd og-oj

# Install backend dependencies
cd backend
npm install
npm run dev

# Install frontend dependencies
cd ../frontend
npm install
npm start
```

> 🐳 You must have Docker installed and running for code evaluation to work locally.

---

## 🧪 API Overview (Core Endpoints)

- `POST /signup` – Register a new user  
- `POST /login` – Log in and receive JWT  
- `POST /problems` – Create a new problem (user-specific)  
- `POST /submissions` – Submit code for evaluation  
- `GET /submissions` – Get your submission history  

📎 See full [API reference in HLD.pdf](./HLD.pdf)

---

## 📸 Screenshots (add if available)

- Home page with problems  
- Code editor + Submit button  
- Profile page showing user submissions

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
