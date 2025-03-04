// src/components/QuizCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const QuizCard = ({ quiz }) => {
  // Function untuk mendapatkan label kategori dari kode
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

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden mb-4">
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{quiz.title}</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {getCategoryLabel(quiz.category)}
          </span>
        </div>
        <p className="text-gray-600 mt-2">{quiz.description}</p>
        <p className="text-gray-500 mt-2">Jumlah soal: {quiz.questionCount}</p>
        <div className="mt-4 flex space-x-2">
          <Link
            to={`/quiz/${quiz.id}`}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Lihat Detail
          </Link>
          <Link
            // to={`/quiz/${quiz.id}/start`}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Kerjakan Kuis
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;