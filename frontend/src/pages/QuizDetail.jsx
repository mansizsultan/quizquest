import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api"; // Pastikan api diimpor

const QuizDetail = () => {
  const getCategoryLabel = (categoryCode) => {
    const categories = {
      'PU': 'Pengetahuan Umum',
      'ED': 'Edukasi',
      'HI': 'Hiburan',
      'BA': 'Bahasa',
      'KE': 'Kesehatan',
      'OL': 'Olahraga',
      'BU': 'Budaya',
      'TE': 'Teknologi',
    };
    return categories[categoryCode] || 'Tidak Terkategori';
  };

  const { id } = useParams(); 
  const [quiz, setQuiz] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`api/quiz/${id}`);  
        setQuiz(response.data);  
        setLoading(false);  
      } catch (error) {
        console.error("Gagal mengambil detail kuis:", error);
        setLoading(false);  
      }
    };

    fetchQuiz();  
  }, [id]); 

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;  
  }

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
            <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full">
              {getCategoryLabel(quiz.category)}
            </span>
          </div>
          <p className="text-gray-700">{quiz.description}</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Dibuat oleh: <span className="font-semibold">{quiz.author_name}</span></p>
              <p className="text-gray-600">Tanggal dibuat: {quiz.created_at}</p>
            </div>
              <p className="text-gray-600">Jumlah soal: {quiz.question_count}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;
