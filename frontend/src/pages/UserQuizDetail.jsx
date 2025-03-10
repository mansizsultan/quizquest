import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";
import QuestionCard from "../components/QuestionCard";

const UserQuizDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchQuizAndQuestions = async () => {
      try {
        setLoading(true);
        
        const quizResponse = await api.get(`api/quiz/${id}/`);
        setQuiz(quizResponse.data);
        
        const questionsResponse = await api.get(`api/quiz/${id}/questions/`);
        setQuestions(questionsResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setError("Gagal mengambil data. Silakan coba lagi nanti.");
        setLoading(false);
      }
    };

    fetchQuizAndQuestions();
  }, [id]);

  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    if (quiz) {
      setQuiz({
        ...quiz,
        question_count: (parseInt(quiz.question_count) - 1).toString()
      });
    }
  };

  const handleEditQuestion = (updatedQuestion) => {
    setQuestions(questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    ));
  };

  const handleAddQuestion = () => {
    navigate(`/create-question/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center text-red-500">
          <p className="text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center text-red-500">
          <p className="text-xl">Kuis tidak ditemukan!</p>
          <Link 
            to="/user-quizzes" 
            className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Kembali ke Daftar Kuis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-blue-300 to-white">
      <div className="flex flex-col items-center justify-start flex-grow pt-8 pb-12">
        <div className="w-full max-w-4xl px-4 flex items-center">
          <Link to="/user-quizzes" className="text-blue-800 mr-4">
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
              <p className="text-gray-600">Tanggal dibuat: {new Date(quiz.created_at).toLocaleDateString('id-ID')}</p>
            </div>
            <div className="md:text-right">
              <p className="text-gray-600">Jumlah soal: {quiz.question_count}</p>
              <p className="text-gray-600">
                Status: 
                <span className={`ml-2 font-semibold ${quiz.is_editable ? 'text-green-600' : 'text-red-600'}`}>
                  {quiz.is_editable ? 'Dapat diedit' : 'Tidak dapat diedit'}
                </span>
              </p>
            </div>
          </div>
          
          {quiz.is_editable && (
            <div className="mt-4 text-right">
              <button 
                onClick={handleAddQuestion}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center mx-auto md:mx-0 md:ml-auto"
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
                Tambah Pertanyaan
              </button>
            </div>
          )}
        </div>
        
        <div className="w-full max-w-4xl mt-6 px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Daftar Pertanyaan</h2>
          
          {questions.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="text-gray-700">Belum ada pertanyaan untuk kuis ini.</p>
              {quiz.is_editable && (
                <button 
                  onClick={handleAddQuestion}
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Tambah Pertanyaan Sekarang
                </button>
              )}
            </div>
          ) : (
            questions.map((question) => (
              <QuestionCard 
                key={question.id} 
                question={question} 
                onDelete={handleDeleteQuestion}
                onEdit={handleEditQuestion}
                quizId={quiz.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserQuizDetail;