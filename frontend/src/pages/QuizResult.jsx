import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api';

function QuizResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    if (location.state?.results) {
      setResults(location.state.results);
      setQuiz(location.state.quiz);
      setQuestions(location.state.questions);
      setUserAnswers(location.state.userAnswers);
      setLoading(false);
    } else {
      fetchResultData();
    }
  }, [id, location.state]);

  async function fetchResultData() {
    try {
      setLoading(true);
      
      const submissionResponse = await api.get(`api/submissions/${id}/`);
      setResults(submissionResponse.data);
      
      const quizResponse = await api.get(`api/quiz/${submissionResponse.data.quiz.id}/`);
      setQuiz(quizResponse.data);
      
      const questionsResponse = await api.get(`api/quiz/${submissionResponse.data.quiz.id}/questions/`);
      setQuestions(questionsResponse.data);
      
      const answersMap = {};
      submissionResponse.data.answers.forEach(answer => {
        answersMap[answer.question_id] = answer.user_answer;
      });
      setUserAnswers(answersMap);
      
      setLoading(false);
    } catch (error) {
      console.error('Error mengambil data:', error);
      setError('Gagal memuat hasil kuis. Silakan coba lagi nanti.');
      setLoading(false);
    }
  }

  function backToQuizzes() {
    navigate('/quizzes');
  }
  
  // Wrapper untuk konten loading
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <p>Memuat hasil kuis...</p>
        </div>
      </div>
    );
  }

  // Wrapper untuk konten error
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center flex-col">
          <p>{error}</p>
          <Link to="/quizzes" className="block mt-4 bg-blue-500 text-white p-2 rounded">
            Kembali ke Daftar Kuis
          </Link>
        </div>
      </div>
    );
  }

  // Wrapper untuk konten tidak ditemukan
  if (!results || !quiz) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center flex-col">
          <p>Hasil kuis tidak ditemukan</p>
          <Link to="/quizzes" className="block mt-4 bg-blue-500 text-white p-2 rounded">
            Kembali ke Daftar Kuis
          </Link>
        </div>
      </div>
    );
  }

  const correctAnswers = results.correct_answers || 0;
  const totalQuestions = questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <div className="shadow-lg rounded mt-8 p-4 max-w-2xl mx-auto mb-8" style={{backgroundColor: 'white'}}>
          <h1 className="text-xl font-bold text-center mb-4">Hasil Kuis</h1>
          
          <div className="mb-6 border-b pb-4">
            <h2 className="font-bold mb-2">{quiz.title}</h2>
            <p className="text-sm mb-4">{quiz.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="border p-2">
                <div className="font-bold text-lg">{score}%</div>
                <p className="text-sm">Skor</p>
              </div>
              
              <div className="border p-2">
                <div className="font-bold text-lg">{correctAnswers} dari {totalQuestions}</div>
                <p className="text-sm">Jawaban Benar</p>
              </div>
            </div>
          </div>
          
          <h3 className="font-bold mb-2">Detail Jawaban:</h3>
          
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              const isCorrect = results.answers?.find(a => a.question_id === question.id)?.is_correct;
              const correctAnswer = question.answers.find(a => a.is_right)?.answer_text;
              
              return (
                <div key={question.id} className="border p-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">
                      {index + 1}. {question.title}
                    </h4>
                    <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                      {isCorrect ? 'Benar' : 'Salah'}
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    {question.question_type === 'MC' && (
                      <div className="ml-4">
                        {question.answers.map((answer) => (
                          <div key={answer.id} className="mb-1">
                            <span 
                              className={
                                answer.is_right 
                                  ? "font-bold text-green-600" 
                                  : userAnswer === answer.answer_text && !answer.is_right
                                    ? "font-bold text-red-600"
                                    : ""
                              }
                            >
                              {answer.answer_text}
                              {answer.is_right && " ✓"}
                              {userAnswer === answer.answer_text && !answer.is_right && " ✗"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.question_type === 'TF' && (
                      <div className="ml-4">
                        {question.answers.map((answer) => (
                          <div key={answer.id} className="mb-1">
                            <span 
                              className={
                                answer.is_right 
                                  ? "font-bold text-green-600" 
                                  : userAnswer === answer.answer_text && !answer.is_right
                                    ? "font-bold text-red-600"
                                    : ""
                              }
                            >
                              {answer.answer_text}
                              {answer.is_right && " ✓"}
                              {userAnswer === answer.answer_text && !answer.is_right && " ✗"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.question_type === 'SA' && (
                      <div className="ml-4">
                        <p>
                          <span className="font-medium">Jawaban Anda: </span>
                          <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                            {userAnswer || "Tidak ada jawaban"}
                          </span>
                        </p>
                        
                        {!isCorrect && (
                          <p>
                            <span className="font-medium">Jawaban Benar: </span>
                            <span className="text-green-600">{correctAnswer}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={backToQuizzes}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Kembali ke Daftar Kuis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizResult;