# 💰 Expense-Wise  

## 📜 Overview  
**Expense-Wise** is a full-stack expense tracking app that helps you stay on top of your personal finances.  
With secure authentication, an intuitive dashboard, and easy transaction tracking, it makes money management simple and accessible.  

🎥 [**Click here to watch the demo**](https://drive.google.com/file/d/1QLF-s5c11voeF8njt_GoREwh0palPMvP/view?usp=sharing)  

---

## 🛠 Tech Stack  

**Frontend:**  
⚛️ React.js  
🗂 Context API (state management)  
🎨 HTML5, CSS3  
⚡ JavaScript (ES6)  

**Backend:**  
🟢 Node.js  
🚀 Express.js  
🍃 MongoDB + Mongoose ORM  
🔐 JWT Authentication  

---

## 📂 Project Structure  

```
Expense-Wise/
│
├── 📦 Backend/                # Server-side logic
│   ├── ⚙️ config/              # Database config
│   │   └── db.js
│   ├── 🎯 controllers/         # API controllers
│   │   ├── transactionController.js
│   │   └── userController.js
│   ├── 🛡 middleware/          # Auth middleware
│   │   └── auth.js
│   ├── 🗃 models/               # Database models
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── 🛣 routes/               # API routes
│   ├── server.js               # Entry point
│   ├── package.json
│   └── package-lock.json
│
├── 🎨 Frontend/                # Client-side code
│   ├── 🌐 public/              # Static assets
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── 💻 src/
│   │   ├── 🧩 components/      # Reusable components
│   │   ├── 🌍 context/         # Global state
│   │   ├── 📄 pages/           # App pages
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   ├── Profile.js
│   │   │   └── Register.js
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── package-lock.json
│
└── 📘 README.md
```

---

## ⚙️ Installation & Setup  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/VidweshK182/Expense-Wise.git
cd Expense-Wise
```

### 2️⃣ Backend Setup  
```bash
cd Backend
npm install
```
Create a `.env` file in `Backend`:
```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
```
Run backend:
```bash
npm start
```

### 3️⃣ Frontend Setup  
```bash
cd ../Frontend
npm install
npm start
```

📍 **Frontend:** http://localhost:3000  
📍 **Backend:** http://localhost:5000  
