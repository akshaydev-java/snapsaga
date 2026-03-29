# Snapsaga - AI-Powered Video Research Platform 🚀

**Snapsaga** is a premium full-stack research platform designed to transform customer review videos into actionable business intelligence. With a focus on modern aesthetics (Tech Noir) and powerful data visualization, it provides a seamless experience for both researchers and stakeholders.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Custom Design System)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: React Hooks & Context API
- **Reporting**: [jsPDF](https://github.com/parallax/jsPDF)

### Backend
- **Framework**: [Spring Boot 3.2.4](https://spring.io/projects/spring-boot)
- **Language**: Java 17
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Security**: Spring Security with JWT (JSON Web Tokens)
- **Utilities**: Lombok, Apache POI (Excel generation)

---

## ✨ Key Features

- **Dual-Theme Support**: Robust Dark (Tech Noir) and Light modes with persistent user preference.
- **Analytics Dashboard**: Dynamic data visualization showing sentiment trends, category distribution, and growth momentum.
- **Professional Reporting**: One-click PDF report generation for business-level sharing.
- **Admin Command Center**: Complete oversight of all user-submitted reviews and data seeding capabilities.
- **AI Sentiment Analysis**: Automated processing of review videos to extract meaningful client insights.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java 17 / Maven 3.x
- MongoDB instance (Local or Atlas)

### 1. Backend Setup
```bash
cd backend
# Configure application.properties with your MongoDB URI
mvn spring-boot:run
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure

```text
snapsaga/
├── backend/            # Spring Boot Application
│   ├── src/            # Java Source Code
│   └── pom.xml         # Maven Dependencies
├── frontend/           # React Application
│   ├── src/            # Components, Pages, Assets
│   └── package.json    # NPM Dependencies
└── README.md           # Project Documentation
```

---

## 📝 License
This project is part of a research initiative. All rights reserved.

---

*Generated with ❤️ by Snapsaga Engineering.*
