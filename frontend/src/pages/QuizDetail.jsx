// src/pages/QuizDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";

const QuizDetail = () => {
  const { id } = useParams(); // Ambil ID kuis dari URL

  // Data kuis dummy dengan tambahan jumlah soal
  const quizzes = [
    {
      id: 1,
      title: "Kuis Matematika Dasar",
      description: "Kuis ini berisi soal-soal matematika dasar.",
      author: "John Doe",
      created_at: "2023-10-01",
      questionCount: 10
    },
    {
      id: 2,
      title: "Kuis Sejarah Indonesia",
      description: "Kuis ini berisi soal-soal sejarah Indonesia.",
      author: "Jane Doe",
      created_at: "2023-10-02",
      questionCount: 15
    },
    {
      id: 3,
      title: "Kuis IPA Kelas 6",
      description: "Kuis ini berisi soal-soal IPA untuk kelas 6 SD.",
      author: "Alice",
      created_at: "2023-10-03",
      questionCount: 20
    },
  ];

  // Cari kuis berdasarkan ID
  const quiz = quizzes.find((q) => q.id === parseInt(id));

  if (!quiz) {
    return <div className="text-center text-red-500">Kuis tidak ditemukan!</div>;
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-blue-300 to-white">
      <div className="flex flex-col items-center justify-start flex-grow pt-8">
        <div className="w-full max-w-4xl px-4 flex items-center">
          <Link to="/quizzes" className="text-blue-800 mr-4">
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
          <h1 className="text-4xl font-bold text-center text-blue-800">Detail Kuis</h1>
        </div>
        <div className="w-full max-w-4xl mt-6 px-4 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{quiz.title}</h2>
          <p className="text-gray-700">{quiz.description}</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Dibuat oleh: {quiz.author}</p>
              <p className="text-gray-600">Tanggal dibuat: {quiz.created_at}</p>
            </div>
            <div>
              <p className="text-gray-600">Jumlah soal: {quiz.questionCount}</p>
              <p className="text-gray-600">Estimasi waktu: {quiz.questionCount * 2} menit</p>
            </div>
          </div>
          <div className="mt-6">
            <Link
            //   to={`/quiz/${quiz.id}/start`}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold"
            >
              Kerjakan Kuis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;