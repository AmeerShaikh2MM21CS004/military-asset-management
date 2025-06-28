# 🛡️ Military Asset Management System

A full-stack web application to manage and track military assets (vehicles, weapons, ammunition) across multiple bases with role-based access control.

---

## 🚀 Tech Stack

| Layer     | Technology         |
|-----------|--------------------|
| Frontend  | React + Next.js    |
| Backend   | Django + DRF       |
| Database  | MySQL              |
| Auth      | Token-based RBAC   |
| Deployment| Docker (optional)  |

---

## 📂 Project Structure

military-asset-management/
├── backend/                        # Django backend
│   ├── manage.py
│   ├── military_assets/
│   ├── assets/
│   ├── users/
│   └── requirements.txt
│
├── frontend/                       # Vite-based React frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── docker-compose.yml
├── .env
└── README.md
```

## 🖼️ Screenshots

> Replace with actual paths after capturing.

| Dashboard | Transfers Page |
|----------|----------------|
| ![dashboard](screenshots/dashboard.png) | ![transfers](screenshots/transfers.png) |

---

## 🧑‍💻 Setup Instructions

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/yourusername/military-asset-management.git
cd military-asset-management

cd backend
python -m venv venv
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\venv\Scripts\Activate.ps1  
pip install -r requirements.txt

# Update MySQL DB config in settings.py

python manage.py makemigrations
python manage.py migrate
python manage.py runserver

cd ../frontend
npm install
npm run dev

Visit: http://localhost:3000

🔐 Roles
| Role              | Access Description                      |
| ----------------- | --------------------------------------- |
| Admin             | Full access to all modules              |
| Base Commander    | Can view/manage their base's assets     |
| Logistics Officer | Can create/view purchases and transfers |

🧪 Test Accounts
| Role      | Username | Password |
| --------- | -------- | -------- |
| Admin     | admin    | admin123 |
| Commander | cmd1     | cmd123   |
| Officer   | logi1    | logi123  |

📦 Environment Variables
.env (backend)
DB_NAME=military_assets
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306

✍️ Author
@Ameer 
