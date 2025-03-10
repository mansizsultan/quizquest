import React, { useState, useEffect, useContext } from "react";
import UserQuizCard from "../components/UserQuizCard";
import { Link } from "react-router-dom";
import api from "../api"; 
import { AuthContext } from "../context/AuthContext";  

const UserQuiz = () => {
  const [userQuizzes, setUserQuizzes] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserQuizzes = async () => {
        try {
          const response = await api.get("api/quizzes/user/");
          setUserQuizzes(response.data);  
        } catch (error) {
          console.error("Gagal memuat kuis:", error);
        }
      };
      fetchUserQuizzes();
    }
  }, [isAuthenticated]);

  const handleDelete = (quizId) => {
    setUserQuizzes(userQuizzes.filter((quiz) => quiz.id !== quizId));  
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-300 to-white">
      <div className="flex flex-col items-center justify-start flex-grow pt-8">
        <div className="w-full max-w-4xl px-4 flex items-center justify-between">
            <div className="flex items-center">
                <Link to="/" className="text-blue-800 mr-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-4xl font-bold text-center text-blue-800">Kuis Kamu</h1>
            </div>
            <Link 
                to="/create-quiz" 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Buat Kuis Baru
            </Link>
        </div>

        {userQuizzes.length > 0 ? (
            <div className="w-full max-w-4xl mt-6 px-4">
                {userQuizzes.map((quiz) => (
                    <UserQuizCard key={quiz.id} quiz={quiz} onDelete={handleDelete} />
                ))}
            </div>
        ) : (
            <div className="w-full max-w-4xl mt-8 px-4 text-center">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <p className="text-gray-500 font-bold">Kamu belum membuat kuis apapun</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default UserQuiz;
