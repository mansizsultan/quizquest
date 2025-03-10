
# QuizQuest

QuizQuest is a web application that allows users to take quizzes and track their progress. This repository contains both the backend and frontend code.

## Table of Contents
1. [Installation](#installation)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Environment Variables](#environment-variables)
5. [Running the Application](#running-the-application)
6. [License](#license)

## Installation

### Prerequisites
Before setting up the application, make sure you have the following installed:
- Node.js (v14 or later) for frontend setup
- Python 3.x or later (for backend)
- Docker (optional, for containerized setup)

### Backend Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/mansizsultan/quizquest.git
   cd quizquest
   ```

2. **Navigate to the Backend Folder:**
   ```bash
   cd backend
   ```

3. **Install Dependencies:**
   Create a virtual environment and install required Python packages.
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Setup Database:**
   - Make sure you have your database set up (e.g., PostgreSQL, MySQL).
   - Run migrations if necessary.
   ```bash
   python manage.py migrate
   ```

5. **Create the `.env` file:**
   - Copy the contents from `.env.example` and update the environment variables as necessary.
   ```bash
   cp .env.example .env
   ```

6. **Run the Backend Server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to the Frontend Folder:**
   ```bash
   cd frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Frontend Development Server:**
   ```bash
   npm start
   ```

4. The frontend should now be available at `http://localhost:3000`.

## Environment Variables

The project uses a `.env` file to store sensitive and configuration-related data. Here's an example of the environment variables you may need to configure:

```
# .env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
DEBUG=True
```

Make sure to replace the placeholder values with your actual credentials or configuration.

## Running the Application

Once both the backend and frontend are set up:

1. Start the backend server by running `python manage.py runserver` in the `backend` folder.
2. Start the frontend development server by running `npm start` in the `frontend` folder.

Visit the web application at `http://localhost:3000` in your browser.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.