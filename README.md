# 🗂️ Kanban Board (Full-Stack with Supabase)

A full-stack Kanban board web application that allows users to manage tasks efficiently with real-time backend storage using Supabase.

🔗 **Live Demo:**  
https://kanban-board-limd01.netlify.app

---

## 🚀 Features

- ✅ Create, update, move, and delete tasks
- 📌 Task status tracking:
  - To Do → In Progress → In Review → Done
- ⚡ Real-time backend with Supabase
- 🔐 Per-user data isolation (Row Level Security)
- 🔎 Search tasks instantly
- 🏷️ Labels (e.g., Bug, Design, Feature)
- ⏰ Due dates with overdue detection
- 🔥 Priority system (Low, Normal, High)
- 📊 Dashboard summary:
  - Total tasks
  - Completed tasks
  - Overdue tasks
- 🎯 Sorting (by priority, date, etc.)

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla JS)
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Deployment:** Netlify
- **Version Control:** Git & GitHub

---

## 🧠 What I Learned

- Designing a full-stack application from scratch
- Using Supabase for authentication and database
- Implementing Row Level Security (RLS)
- Managing async operations with JavaScript
- Building interactive UI without frameworks
- Deploying production-ready apps with Netlify

---

## ⚙️ How It Works

1. User signs in anonymously via Supabase
2. Tasks are stored in a PostgreSQL database
3. Each user only sees their own tasks (RLS policy)
4. UI updates dynamically based on database changes

---

## 📦 Project Structure

```
kanban-board/
├── index.html   # UI structure
├── style.css    # Styling
├── app.js       # Application logic + Supabase integration
```

## 🔐 Setup (for developers)

1. Create a Supabase project
2. Create a `tasks` table with:
   - `id` (uuid, primary key)
   - `title` (text)
   - `status` (text)
   - `user_id` (uuid)
   - `priority` (text)
   - `due_date` (date)
   - `created_at` (timestamp)

3. Enable Row Level Security (RLS)
4. Add policies for:
   - SELECT
   - INSERT
   - UPDATE
   - DELETE

---

## 🚧 Future Improvements

- Drag-and-drop task movement
- Task comments system
- Multi-user collaboration
- Dark mode UI
- Notifications and reminders

---

## 👤 Author

Donggeon Lim  
Computer Science Student – Purdue University Fort Wayne

---

## ⭐ Acknowledgment

If you found this project useful, feel free to star ⭐ the repository.
