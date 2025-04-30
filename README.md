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
8. API Documentation
9. Project Structure
10. Contributing
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

### Installation

#### Prerequisites
- Node.js
- MongoDB
- npm or yarn
#### Setup Instructions
##### 1. Clone the repository
git clone https://github.com/jujuGthb/academicApp
cd academic-application-system
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


