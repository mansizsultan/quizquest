// src/pages/QuizList.jsx
import React from "react";
import QuizCard from "../components/QuizCard";
import { Link } from "react-router-dom";

const QuizList = () => {
  // Data kuis dummy dengan tambahan jumlah soal
  const quizzes = [
    {
      id: 1,
      title: "Kuis Matematika Dasar",
      description: "Kuis ini berisi soal-soal matematika dasar.",
      questionCount: 10
    },
    {
      id: 2,
      title: "Kuis Sejarah Indonesia",
      description: "Kuis ini berisi soal-soal sejarah Indonesia.",
      questionCount: 15
    },
    {
      id: 3,
      title: "Kuis IPA Kelas 6",
      description: "Kuis ini berisi soal-soal IPA untuk kelas 6 SD.",
      questionCount: 20
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-300 to-white">
      <div className="flex flex-col items-center justify-start flex-grow pt-8">
        <div className="w-full max-w-4xl px-4 flex items-center">
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
          <h1 className="text-4xl font-bold text-center text-blue-800">Daftar Kuis</h1>
        </div>
        <div className="w-full max-w-4xl mt-6 px-4">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizList;