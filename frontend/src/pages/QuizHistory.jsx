import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const QuizHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const [quizzes, setQuizzes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await api.get('api/submissions/');
        setSubmissions(response.data);
        
        const quizIds = [...new Set(response.data.map(sub => sub.quiz))];
        const quizDetails = {};
        
        for (const quizId of quizIds) {
          try {
            const quizResponse = await api.get(`api/quiz/${quizId}/`);
            quizDetails[quizId] = quizResponse.data;
          } catch (error) {
            console.error(`Error mengambil detail quiz ${quizId}:`, error);
            quizDetails[quizId] = { title: `Kuis #${quizId}`, category: 'Unknown' };
          }
        }
        
        setQuizzes(quizDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setError('Gagal memuat riwayat kuis. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

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

  const viewQuizResult = (submissionId) => {
    navigate(`/quiz-result/${submissionId}`);
  };

  const retakeQuiz = (quizId) => {
    navigate(`/do-quiz/${quizId}`);
  };

  if (loading) {
    return <div className="text-center text-xl p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
        <Link to="/quizzes" className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Kembali ke Daftar Kuis
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-300 to-white">
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
          <h1 className="text-4xl font-bold text-center text-blue-800">Riwayat Kuis</h1>
        </div>
        
        <div className="w-full max-w-4xl mt-6 px-4">
          {submissions.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="divide-y divide-gray-200">
                {submissions.map((submission) => {
                  const quiz = quizzes[submission.quiz] || {};
                  return (
                    <div key={submission.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">{quiz.title || `Kuis #${submission.quiz}`}</h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {quiz.category ? getCategoryLabel(quiz.category) : 'Tidak Terkategori'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-sm text-gray-500">Dikerjakan: {formatDate(submission.submitted_at)}</p>
                      </div>
                      
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => retakeQuiz(submission.quiz)}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                          Kerjakan Lagi
                        </button>
                        <button
                          onClick={() => viewQuizResult(submission.id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Lihat Hasil
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-lg shadow mt-4">
              <p className="text-gray-500 font-bold">Kamu belum mengerjakan kuis apapun</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizHistory;