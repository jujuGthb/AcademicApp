# Academic Staff Application System
A comprehensive web application for managing academic job postings, applications, and evaluation processes in higher education institutions. This system streamlines the entire workflow from job posting creation to applicant evaluation and final decision-making.
## Table Of Content
1. Features
2. Technology Stack
3. System Architecture
4. Installation
5. Environment Variables
6. Usage
7. User Roles
8. Project Structure
   
### Features
* Multi-role user system * (Admin, Manager, Jury, Applicant)
* Comprehensive job posting management 
   Application submission and tracking 
* Document upload and management 
* Customizable evaluation criteria 
* Jury assignment and evaluation process 
* Secure authentication and authorization 
* Responsive design for all devices 
* Real-time notifications 
* Detailed reporting and statistics 

### Technology Stack

#### Frontend
   **React.js** - UI library  
   **React Router** - Navigation and routing  
   **Context API** - State management  
   **Axios** - HTTP client  
   **CSS3** - Styling


#### Backend
   **Node.js** - Runtime environment  
   **Express.js** - Web framework  
   **MongoDB** - Database  
   **Mongoose** - ODM for MongoDB  
   **JWT** - Authentication  
   **Bcrypt** - Password hashing  
   **Multer** - File uploads  

### System Architecture
![image alt](https://github.com/jujuGthb/AcademicApp/blob/f481897f643a6309760958a1b82f74c47e8e35bd/applicationOverview.png)

### Installation

#### Prerequisites
- Node.js
- MongoDB
- npm or yarn
#### Setup Instructions
##### 1. Clone the repository
git clone https://github.com/jujuGthb/academicApp  
cd frontend/backend
##### 2. Install dependencies
###### Install backend dependencies
cd backend
npm install

###### Install frontend dependencies
cd ../frontend
npm install

##### 3. Start the development servers
###### Start backend server (from backend directory)
npm run dev

###### Start frontend server (from frontend directory)
npm start

### Environment Variables
To configure the backend application, create a `.env` file in the backend director
**Server Configuration:**

* `PORT`: Specifies the port on which the server will listen for incoming requests (e.g., `5000`).
* `NODE_ENV`: Sets the environment for the application, typically `development` during development and `production` in a production deployment.

**MongoDB Connection:**

* `MONGO_URI`: The connection string used to connect to your MongoDB database. Replace `mongodb://localhost:27017/academic-app` with your actual MongoDB connection URI (e.g., `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`).

**JWT Configuration:**

* `JWT_SECRET`: A secret key used to sign and verify JSON Web Tokens (JWTs) for authentication. Choose a strong, unique secret key (e.g., a randomly generated string).
* `JWT_EXPIRE`: Defines the expiration time for generated JWTs. This value is typically expressed in units like hours (`h`), minutes (`m`), or seconds (`s`) (e.g., `24h` for 24 hours).

**File Upload Configuration:**

* `MAX_FILE_SIZE`: The maximum allowed size for uploaded files, specified in bytes (e.g., `5000000` for 5MB).
* `FILE_UPLOAD_PATH`: The directory where uploaded files will be stored on the server (e.g., `./public/uploads`). Ensure this directory exists and the application has write permissions to it.

### Usage
**Access the application**
- Development: [http://localhost:3000](http://localhost:3000)

### User Roles
he system supports four user roles, each with specific permissions and capabilities:

**Applicant (Default)**

* **Registration and Authentication:** Applicants can register and securely authenticate using their Turkish National Identity Number (TC Kimlik No).
* **Application Submission:** Enables applicants to fill out and submit the application form.
* **Document Upload:** Allows applicants to upload necessary supporting documents.
* **Application Tracking:** Provides applicants with the ability to monitor the real-time status of their submitted applications.

**Jury Member**

* **Assigned Announcement Review:** Jury members can view the announcements they have been assigned to evaluate.
* **Applicant Document Review:** Permits jury members to access and review the documents submitted by applicants.
* **Evaluation Submission:** Allows jury members to submit scores and provide comments on the applications they review.

**Manager**

* **Announcement Management:** Managers can create new announcements and edit existing ones.
* **Rule Definition:** Enables managers to define category weights and establish minimum score requirements for applications.
* **Jury Assignment:** Allows managers to assign specific jury members to evaluate particular announcements.
* **Evaluation Oversight:** Provides managers with the ability to review the evaluations submitted by jury members.

**Administrator**

* **Full System Access:** Administrators have unrestricted access to all modules and functionalities within the system.
* **User and Role Management:** Permits administrators to manage user accounts, assign roles, and control system access levels.
* **Submission Override and Auditing:** Grants administrators the capability to override submissions if necessary and audit system activities.

### API Documentation
#### API Endpoints

This section provides a comprehensive overview of the available API endpoints, organized by their respective route files:

## 1. `/api/users` (User Management)

* `GET /api/users`: Retrieves a list of all users.
* `GET /api/users/role/:role`: Retrieves users filtered by their specific role.
* `GET /api/users/:id`: Retrieves details for a specific user based on their ID.
* `PATCH /api/users/:id/role`: Updates the role of a specific user.
* `GET /api/users/stats`: Retrieves statistical information about users.

## 2. `/api/job-postings` (Job Posting Management)

* `POST /api/job-postings`: Creates a new job posting.
* `GET /api/job-postings`: Retrieves a list of all job postings.
* `GET /api/job-postings/:id`: Retrieves details for a specific job posting based on its ID.
* `PUT /api/job-postings/:id`: Updates the details of a specific job posting.
* `DELETE /api/job-postings/:id`: Deletes a specific job posting.
* `PATCH /api/job-postings/:id/status`: Updates the status of a specific job posting.
* `GET /api/job-postings/:id/stats`: Retrieves statistical information for a specific job posting.
* `GET /api/job-postings/stats`: Retrieves overall statistics for all job postings.

## 3. `/api/activities` (Activity Tracking)

* `GET /api/activities`: Retrieves a list of all activities.
* `POST /api/activities`: Creates a new activity record.
* `GET /api/activities/:id`: Retrieves details for a specific activity based on its ID.
* `PUT /api/activities/:id`: Updates the details of a specific activity.
* `DELETE /api/activities/:id`: Deletes a specific activity.
* `GET /api/activities/user/:userId`: Retrieves activities associated with a specific user ID.
* `GET /api/activities/types`: Retrieves a list of available activity types.

## 4. `/api/reports` (Reporting)

* `GET /api/reports/applications`: Retrieves reports related to applications.
* `GET /api/reports/evaluations`: Retrieves reports related to evaluations.
* `GET /api/reports/users`: Retrieves reports related to users.
* `POST /api/reports/generate/pdf`: Generates a PDF report based on the request.
* `GET /api/reports/statistics`: Retrieves various system statistics.

## 5. `/api/criteria` (Evaluation Criteria Management)

* `POST /api/criteria`: Creates new evaluation criteria.
* `GET /api/criteria`: Retrieves a list of all evaluation criteria.
* `GET /api/criteria/:id`: Retrieves details for specific evaluation criteria based on its ID.
* `PUT /api/criteria/:id`: Updates the details of specific evaluation criteria.
* `DELETE /api/criteria/:id`: Deletes specific evaluation criteria.
* `POST /api/criteria/calculate-score`: Calculates a score based on provided criteria.
* `POST /api/criteria/generate-table`: Generates a table representation of the criteria.

## 6. `/api/uploads` (File Upload Management)

* `POST /api/uploads`: Handles generic file uploads.
* `GET /api/uploads/:id`: Retrieves information about a specific uploaded file based on its ID.
* `DELETE /api/uploads/:id`: Deletes a specific uploaded file.
* `POST /api/uploads/document`: Handles the upload of document files.
* `POST /api/uploads/publication`: Handles the upload of publication files.
* `POST /api/uploads/profile`: Handles the upload of profile-related files.

## 7. `/api/applications` (Application Management)

* `POST /api/applications`: Creates a new application.
* `GET /api/applications`: Retrieves a list of all applications.
* `GET /api/applications/:id`: Retrieves details for a specific application based on its ID.
* `PUT /api/applications/:id`: Updates the details of a specific application.
* `POST /api/applications/:id/submit`: Submits a specific application.
* `POST /api/applications/:id/documents`: Handles the upload of documents for a specific application.
* `POST /api/applications/:id/publications`: Handles the upload of publications for a specific application.
* `GET /api/applications/job/:jobId`: Retrieves applications associated with a specific job posting ID.
* `GET /api/applications/stats`: Retrieves statistical information about applications.

## 8. `/api/evaluations` (Evaluation Management)

* `GET /api/evaluations/assignments`: Retrieves evaluation assignments for the current user (e.g., jury member).
* `GET /api/evaluations/application/:id`: Retrieves evaluations for a specific application ID.
* `POST /api/evaluations/submit/:assignmentId`: Submits an evaluation for a specific assignment.

### Project Structure

academic-application-system/
├── backend/                 # Backend server code
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── server.js            # Server entry point
│   └── package.json         # Backend dependencies
│
├── frontend/                # Frontend React code
│   ├── public/              # Static files
│   ├── src/                 # Source files
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Context providers
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── manager/     # Manager pages
│   │   │   ├── jury/        # Jury pages
│   │   │   ├── public/      # Public pages
│   │   │   └── ...          # Other pages
│   │   ├── utils/           # Utility functions
│   │   ├── hooks/           # Custom Utilities
│   │   ├── layouts/         # Page Templates
│   │   ├── App.js           # Main component
│   │   └── index.js         # Entry point
│   └── package.json         # Frontend dependencies
│
├── .gitignore               # Git ignore file
├── package.json             # Root package.json
└── README.md                # Project documentation
