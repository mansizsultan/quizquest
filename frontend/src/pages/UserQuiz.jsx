// src/pages/UserQuiz.jsx
import React from "react";
import UserQuizCard from "../components/UserQuizCard";
import { Link } from "react-router-dom";

const UserQuiz = () => {
  // Data kuis dummy yang dibuat oleh user dengan kategori
  const userQuizzes = [
    {
      id: 4,
      title: "Kuis Python Dasar",
      description: "Kuis ini berisi soal-soal pemrograman Python dasar.",
      questionCount: 8,
      category: "TE", // Teknologi
      created_at: "2025-02-15"
    },
    {
      id: 5,
      title: "Kuis Budaya Bali",
      description: "Kuis ini berisi soal-soal tentang budaya Bali.",
      questionCount: 12,
      category: "BU", // Budaya
      created_at: "2025-02-20"
    },
    {
      id: 6,
      title: "Kuis Bahasa Inggris Dasar",
      description: "Kuis ini berisi soal-soal bahasa Inggris untuk pemula.",
      questionCount: 15,
      category: "BA", // Bahasa
      created_at: "2025-02-28"
    },
  ];

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
                    <UserQuizCard key={quiz.id} quiz={quiz} />
                ))}
            </div>
        ) : (
            <div className="w-full max-w-4xl mt-16 px-4 text-center">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Kamu belum membuat kuis</h2>
                    <p className="text-gray-600 mb-6">Mulai buat kuis pertamamu sekarang dan bagikan pengetahuanmu!</p>
                    <Link 
                        to="/create-quiz" 
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold"
                    >
                        Buat Kuis Baru
                    </Link>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default UserQuiz;