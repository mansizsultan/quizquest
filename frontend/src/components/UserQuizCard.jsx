// src/components/UserQuizCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const UserQuizCard = ({ quiz }) => {
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
        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-500">Jumlah soal: {quiz.questionCount}</p>
          <p className="text-gray-500">Dibuat: {quiz.created_at}</p>
        </div>
        <div className="mt-4 flex space-x-2">
          <Link
            to={`/quiz/${quiz.id}/edit`}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Edit Kuis
          </Link>
          <Link
            to={`/quiz/${quiz.id}`}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Lihat Detail
          </Link>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={() => window.confirm("Apakah Anda yakin ingin menghapus kuis ini?")}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserQuizCard;