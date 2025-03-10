import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; 
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/navbar";
import CreateQuestion from "./pages/CreateQuestion";
import Footer from "./components/Footer";
import QuizList from "./pages/QuizList";
import QuizDetail from "./pages/QuizDetail";
import UserQuiz from "./pages/UserQuiz";
import CreateQuiz from "./pages/CreateQuiz"; 
import UserQuizDetail from "./pages/UserQuizDetail"; 
import DoQuiz from "./pages/DoQuiz";
import QuizResult from "./pages/QuizResult";
import QuizHistory from "./pages/QuizHistory";
import EditQuiz from "./pages/EditQuiz";

const App = () => {
  const { isAuthenticated, username } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-300 to-white pt-16">
        {/* NAVBAR */}
        <Navbar />

        {/* ROUTES */}
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex flex-col items-center justify-start flex-grow pt-8">
                <h1 className="text-4xl font-bold text-center">
                  <span className="text-black">Selamat datang di </span>
                  <span className="text-blue-800">QuizQuest</span>
                  {isAuthenticated && username ? `, ${username}!` : "!"}
                </h1>
                <p className="text-xl text-gray-800 mt-2 text-center">
                  Jelajahi, Ciptakan, dan Pelajari Kuis Seru Setiap Hari!
                </p>
                <h2 className="text-2xl font-semibold text-black mt-4">
                  Apa rencana hari ini?
                </h2>
                <div className="mt-6 flex flex-wrap justify-center gap-16">
                  <Link
                    to="/quizzes"
                    className="w-64 bg-white shadow-xl rounded-xl overflow-hidden transition duration-300 transform hover:shadow-[0_0_20px_#1E40AF]"
                  >
                    <img
                      src="images/pen.jpg"
                      alt="Belajar"
                      className="w-full h-40 object-cover mt-4"
                    />
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-semibold text-gray-900">Jelajahi Kuis</h3>
                      <p className="text-gray-600 text-sm">Kerjakan kuis dan tantang dirimu!</p>
                    </div>
                  </Link>
                  <Link
                    to="/user-quizzes"
                    className="w-64 bg-white shadow-xl rounded-xl overflow-hidden transition duration-300 transform hover:shadow-[0_0_20px_#1E40AF]"
                  >
                    <img
                      src="images/plus.jpg"
                      alt="Buat Kuis"
                      className="w-full h-40 object-cover mt-4"
                    />
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-semibold text-gray-900">Buat Kuis</h3>
                      <p className="text-gray-600 text-sm">Buat kuismu sendiri dan bagikan!</p>
                    </div>
                  </Link>
                </div>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />    
          <Route path="/register" element={<Register />} />     
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quiz/:id" element={<QuizDetail />} />
          <Route path="/user-quizzes" element={<ProtectedRoute element={<UserQuiz/>} />} />
          <Route path="/edit-quiz/:id" element={<ProtectedRoute element={<EditQuiz />} />} />
          <Route path="/create-quiz" element={<ProtectedRoute element={<CreateQuiz />} />} />
          <Route path="/create-question/:id" element={<ProtectedRoute element={<CreateQuestion />} />} />
          <Route path="/user/quiz/:id" element={<ProtectedRoute element={<UserQuizDetail />} />} />
          <Route path="/do-quiz/:id" element={<ProtectedRoute element={<DoQuiz />} />} />
          <Route path="/quiz-result/:id" element={<ProtectedRoute element={<QuizResult />} />} />
          <Route path="/quiz-history" element={<ProtectedRoute element={<QuizHistory />} />} />
        </Routes>

        {/* FOOTER */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;