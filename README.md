# 🎓 Academic Staff Application System

A comprehensive web application for managing academic job postings, applications, and evaluation processes in higher education institutions. This system streamlines the entire workflow from job posting creation to applicant evaluation and final decision-making.

## 📑 Table Of Content
1. ✨ Features
2. 🛠️ Technology Stack
3. 🏗️ System Architecture
4. ⚙️ Installation
5. 🔧 Environment Variables
6. 💻 Usage
7. 👥 User Roles
8. 📂 Project Structure

### ✨ Features
* 👨‍💼 Multi-role user system (Admin, Manager, Jury, Applicant)
* 📢 Comprehensive job posting management
* 📝 Application submission and tracking 
* 📂 Document upload and management 
* ⚖️ Customizable evaluation criteria 
* 👥 Jury assignment and evaluation process 
* 🔒 Secure authentication and authorization 
* 📱 Responsive design for all devices 
* 🔔 Real-time notifications 
* 📊 Detailed reporting and statistics 

### 🛠️ Technology Stack

#### Frontend
   ![React](https://img.shields.io/badge/-React.js-61DAFB?logo=react&logoColor=white) - UI library  
   ![React Router](https://img.shields.io/badge/-React_Router-CA4245?logo=react-router&logoColor=white) - Navigation and routing  
   ![Context API](https://img.shields.io/badge/-Context_API-000000?logo=react&logoColor=white) - State management  
   ![Axios](https://img.shields.io/badge/-Axios-5A29E4?logo=axios&logoColor=white) - HTTP client  
   ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white) - Styling

#### Backend
   ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) - Runtime environment  
   ![Express](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white) - Web framework  
   ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white) - Database  
   ![Mongoose](https://img.shields.io/badge/-Mongoose-880000?logo=mongoose&logoColor=white) - ODM for MongoDB  
   ![JWT](https://img.shields.io/badge/-JWT-000000?logo=json-web-tokens&logoColor=white) - Authentication  
   ![Bcrypt](https://img.shields.io/badge/-Bcrypt-000000?logo=bcrypt&logoColor=white) - Password hashing  
   ![Multer](https://img.shields.io/badge/-Multer-000000?logo=multer&logoColor=white) - File uploads  

### 🏗️ System Architecture
![System Architecture](https://github.com/jujuGthb/AcademicApp/blob/f481897f643a6309760958a1b82f74c47e8e35bd/applicationOverview.png)

### ⚙️ Installation

#### Prerequisites
- ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)
- ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white)
- ![npm](https://img.shields.io/badge/-npm-CB3837?logo=npm&logoColor=white) or ![Yarn](https://img.shields.io/badge/-Yarn-2C8EBB?logo=yarn&logoColor=white)

#### 🛠️ Setup Instructions
##### 1. Clone the repository
```bash
git clone https://github.com/jujuGthb/academicApp  
```

## ⚙️ Installation & Setup

### 📦 Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```
#### Frontend Dependencies
```bash
cd ../frontend
npm install
```
##### 3. Start the development servers
###### Start backend server (from backend directory)
npm run dev

###### Start frontend server (from frontend directory)
npm start

# 📚 Academic App Backend  

## 🔧 Environment Variables  

Create a `.env` file in the `backend` directory with the following variables:  

### 🖥 **Server Configuration**  
- `PORT` ➡ Port for the server (e.g., `5000`).  
- `NODE_ENV` ➡ Environment mode (`development` or `production`).  

### 🗃 **MongoDB Connection**  
- `MONGO_URI` ➡ MongoDB connection string (e.g., `mongodb://localhost:27017/academic-app`).  

### 🔐 **JWT Configuration**  
- `JWT_SECRET` ➡ Secret key for JWT signing (e.g., `your_strong_secret`).  
- `JWT_EXPIRE` ➡ JWT expiration time (e.g., `24h`).  

### 📂 **File Upload Configuration**  
- `MAX_FILE_SIZE` ➡ Max file size in bytes (e.g., `5000000` for 5MB).  
- `FILE_UPLOAD_PATH` ➡ Upload directory (e.g., `./public/uploads`).  

---

## 🚀 **Usage**  
- **Development:** 🌐 [http://localhost:3000](http://localhost:3000)  

---

## 👥 **User Roles**  

### 👤 **Applicant (Default)**  
- ✅ Register & authenticate with **TC Kimlik No**.  
- 📝 Submit applications.  
- 📤 Upload documents.  
- 🔍 Track application status.  

### 🎓 **Jury Member**  
- 📢 View assigned announcements.  
- 📑 Review applicant documents.  
- ⭐ Submit scores & comments.  

### 👔 **Manager**  
- 📢 Create/edit announcements.  
- ⚖ Define rules & weights.  
- 👥 Assign jury members.  
- 🔍 Oversee evaluations.  

### 👑 **Administrator**  
- 🔓 Full system access.  
- 👥 Manage users & roles.  
- ⚡ Override submissions.  
- 📊 Audit system activities.  

---

## 🔄 API Endpoints

### 1️⃣ **User Management** `/api/users`
👥 Manage system users and roles  

| Method | Endpoint | Description | Emoji |
|--------|----------|-------------|-------|
| `GET` | `/api/users` | Get all users | 📜 |
| `GET` | `/api/users/role/:role` | Get users by role | 🎯 |
| `GET` | `/api/users/:id` | Get user details by ID | ℹ️ |
| `PATCH` | `/api/users/:id/role` | Update user role | 🔄 |
| `GET` | `/api/users/stats` | Get user statistics | 📊 |

---

### 2️⃣ **Job Posting Management** `/api/job-postings`
💼 Manage academic job postings  

| Method | Endpoint | Description | Emoji |
|--------|----------|-------------|-------|
| `POST` | `/api/job-postings` | Create new job posting | ➕ |
| `GET` | `/api/job-postings` | Get all job postings | 📋 |
| `GET` | `/api/job-postings/:id` | Get posting by ID | ℹ️ |
| `PUT` | `/api/job-postings/:id` | Update job posting | ✏️ |
| `DELETE` | `/api/job-postings/:id` | Delete job posting | ❌ |
| `PATCH` | `/api/job-postings/:id/status` | Update posting status | 🔄 |
| `GET` | `/api/job-postings/:id/stats` | Get posting statistics | 📊 |
| `GET` | `/api/job-postings/stats` | Get all postings stats | 📈 |

---

### 3️⃣ **Activity Tracking** `/api/activities`
📈 Track system activities  

| Method | Endpoint | Description | Emoji |
|--------|----------|-------------|-------|
| `GET` | `/api/activities` | Get all activities | 📜 |
| `POST` | `/api/activities` | Create new activity | ➕ |
| `GET` | `/api/activities/:id` | Get activity by ID | ℹ️ |
| `PUT` | `/api/activities/:id` | Update activity | ✏️ |
| `DELETE` | `/api/activities/:id` | Delete activity | ❌ |
| `GET` | `/api/activities/user/:userId` | Get user activities | 👤 |
| `GET` | `/api/activities/types` | Get activity types | 🏷️ |

---

### 4️⃣ **Reporting** `/api/reports`
📊 Generate system reports  

| Method | Endpoint | Description | Emoji |
|--------|----------|-------------|-------|
| `GET` | `/api/reports/applications` | Get application reports | 📑 |
| `GET` | `/api/reports/evaluations` | Get evaluation reports | 📝 |
| `GET` | `/api/reports/users` | Get user reports | 👥 |
| `POST` | `/api/reports/generate/pdf` | Generate PDF report | 🖨️ |
| `GET` | `/api/reports/statistics` | Get system statistics | 📈 |

---

### 5️⃣ **Evaluation Criteria** `/api/criteria`
📝 Manage evaluation criteria  

| Method | Endpoint | Description | Emoji |
|--------|----------|-------------|-------|
| `POST` | `/api/criteria` | Create new criteria | ➕ |
| `GET` | `/api/criteria` | Get all criteria | 📜 |
| `GET` | `/api/criteria/:id` | Get criteria by ID | ℹ️ |
| `PUT` | `/api/criteria/:id` | Update criteria | ✏️ |
| `DELETE` | `/api/criteria/:id` | Delete criteria | ❌ |
| `POST` | `/api/criteria/calculate-score` | Calculate score | 🧮 |
| `POST` | `/api/criteria/generate-table` | Generate criteria table | 📋 |

---

### 6️⃣ **File Uploads** `/api/uploads`
📁 Manage file uploads  

| Method | Endpoint | Description | Emoji |
|--------|----------|-------------|-------|
| `POST` | `/api/uploads` | Generic file upload | ⬆️ |
| `GET` | `/api/uploads/:id` | Get upload by ID | ℹ️ |
| `DELETE` | `/api/uploads/:id` | Delete upload | ❌ |
| `POST` | `/api/uploads/document` | Upload document | 📄 |
| `POST` | `/api/uploads/publication` | Upload publication | 📚 |
| `POST` | `/api/uploads/profile` | Upload profile file | 👤 |

---

### 7️⃣ **Application Management** `/api/applications`
📑 Manage applications  

| Method | Endpoint | Description | Emoji |
|--------|----------|-------------|-------|
| `POST` | `/api/applications` | Create application | ➕ |
| `GET` | `/api/applications` | Get all applications | 📜 |
| `GET` | `/api/applications/:id` | Get application by ID | ℹ️ |
| `PUT` | `/api/applications/:id` | Update application | ✏️ |
| `POST` | `/api/applications/:id/submit` | Submit application | 📤 |
| `POST` | `/api/applications/:id/documents` | Upload documents | 📄 |
| `POST` | `/api/applications/:id/publications` | Upload publications | 📚 |
| `GET` | `/api/applications/job/:jobId` | Get applications by job | 🔗 |
| `GET` | `/api/applications/stats` | Get application stats | 📊 |

---

### 8️⃣ **Evaluation Management** `/api/evaluations`
⭐ Manage evaluations  

| Method | Endpoint | Description | Emoji |
|--------|----------|-------------|-------|
| `GET` | `/api/evaluations/assignments` | Get user assignments | 📋 |
| `GET` | `/api/evaluations/application/:id` | Get app evaluations | 📝 |
| `POST` | `/api/evaluations/submit/:assignmentId` | Submit evaluation | ✅ |

---

## 🏗️ Project Structure
<img src="[https://github.com/username/repo/blob/main/images/logo.png](https://github.com/jujuGthb/AcademicApp/blob/9f55de7fea2d893d75078093fed0f0d1531b53ba/folderStructure.png)" 
     alt="Project Logo" 
     width="300"/>

## 🗂 **Project Structure**  
![Folder Structure](https://github.com/jujuGthb/AcademicApp/blob/9f55de7fea2d893d75078093fed0f0d1531b53ba/folderStructure.png){: style="width:40%"}

