# ⚽ SportZone - E-Commerce API & Client System 

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue.svg)](https://github.com/DatNguyenSE/SportZone)
[![Live Demo](https://img.shields.io/badge/Live-Demo-success.svg)](https://nbhaeggp4n.ap-southeast-2.awsapprunner.com/)

**SportZone** is a full-stack e-commerce research project dedicated to sports gear. Built as a comprehensive self-study into **Clean Architecture**, this project focuses on decoupling dependencies, securing distributed systems, and implementing modern DevOps workflows.

---

## 🏗 Architectural Vision

The core of SportZone is structured on **Clean Architecture** principles, ensuring that the business logic remains entirely independent of frameworks, UI, and databases.
* **Layer Separation:** Domain, Application, Infrastructure, and API layers.
* **Dependency Decoupling:** Heavy use of Interfaces and Dependency Injection.
* **Database:** PostgreSQL for robust relational data management.

## 🚀 Key Features & Technical Highlights

### 💻 Frontend (Client)
* **Framework:** Built with **Angular** for a dynamic, Single Page Application (SPA) experience.
* **UI/UX:** Designed for a seamless sports shopping experience with modular components.

### 🔐 Backend & Security
* **Core:** RESTful API developed using **ASP.NET Core**.
* **Authentication:** Robust **JWT-based** system alongside **Email OTP verification** for secure user registration and login.
* **Background Tasks:** Integrated **Hangfire** to automatically monitor, process, and cancel overdue payments, ensuring database consistency without blocking the main thread.

### 💳 Integrations & Storage
* **Payment:** Fully integrated **VNPay** gateway for secure, real-world checkout processes.
* **Media:** **Cloudinary** integration for optimized cloud image storage and management.
* **Asynchronous Operations:** Focused on handling third-party API stability and async tasks efficiently.

### 🐳 DevOps & Deployment
* **Containerization:** The backend application is fully containerized using **Docker**.
* **Cloud Deployment:** Environment deployed to **AWS**, demonstrating practical experience with production-grade container workflows.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | Angular, TypeScript |
| **Backend** | ASP.NET Core 8.0+, C#, Clean Architecture |
| **Database** | PostgreSQL |
| **Security** | JWT, Email OTP (SMTP) |
| **Background Jobs** | Hangfire |
| **Cloud/DevOps** | Docker, AWS (App Runner) |
| **Integrations** | VNPay (Payment), Cloudinary (Media) |

---

## 📋 Getting Started

### Prerequisites
* [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
* [Node.js & npm](https://nodejs.org/) (for Angular Client)
* Docker Desktop (Optional but recommended for database/backend)
* PostgreSQL instance

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/DatNguyenSE/SportZone.git](https://github.com/DatNguyenSE/SportZone.git)
   cd SportZone


2. **Setup Environment Variables:**

* Create an appsettings.Development.json in the API project.

* Add your configuration for PostgreSQL connection, JWT Secret, SMTP credentials (for OTP), VNPay keys, and Cloudinary keys. (Never commit these secrets to GitHub)

3. **Run the Backend (API):**
```bash

cd SportZone.API

dotnet restore

dotnet ef database update

dotnet run

___________________________________

4. **Run the Frontend (Angular):**

cd SportZone.Client

npm install

ng serve
