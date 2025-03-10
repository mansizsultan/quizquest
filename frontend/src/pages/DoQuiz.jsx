import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

const DoQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        
        const quizResponse = await api.get(`api/quiz/${id}/`);
        setQuiz(quizResponse.data);
        
        const questionsResponse = await api.get(`api/quiz/${id}/questions/`);
        
        if (questionsResponse.data.length === 0) {
          setError('Kuis ini belum memiliki pertanyaan');
          setLoading(false);
          return;
        }
        
        setQuestions(questionsResponse.data);
        
        const initialAnswers = {};
        questionsResponse.data.forEach(question => {
          initialAnswers[question.id] = question.question_type === 'SA' ? '' : null;
        });
        
        setUserAnswers(initialAnswers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        setError('Gagal memuat kuis. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };
    
    fetchQuizData();
  }, [id]);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const validateAnswers = () => {
    const unansweredQuestions = [];
    
    questions.forEach((question, index) => {
      const answer = userAnswers[question.id];
      if (answer === null || answer === '') {
        unansweredQuestions.push(index + 1);
      }
    });
    
    if (unansweredQuestions.length > 0) {
      return `Pertanyaan nomor ${unansweredQuestions.join(', ')} belum dijawab. Yakin ingin melanjutkan?`;
    }
    
    return null;
  };

  const submitQuiz = async () => {
    try {
      setLoading(true);
      
      const submissionData = {
        quiz: parseInt(id),
        answers: Object.keys(userAnswers).map(questionId => ({
          question: parseInt(questionId),
          answer_text: userAnswers[questionId]
        }))
      };
      
      const response = await api.post('api/submissions/', submissionData);
      
      navigate(`/quiz-result/${response.data.id}`, { 
        state: { 
          results: response.data,
          quiz: quiz,
          questions: questions,
          userAnswers: userAnswers
        } 
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Gagal mengirim jawaban. Silakan coba lagi.');
      setLoading(false);
    }
  };

  const handleSubmitClick = () => {
    const validationMessage = validateAnswers();
    
    if (validationMessage) {
      if (window.confirm(validationMessage)) {
        submitQuiz();
      }
    } else {
      if (window.confirm('Apakah Anda yakin ingin menyelesaikan kuis ini?')) {
        submitQuiz();
      }
    }
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
          <Link 
            to="/quizzes" 
            className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Kembali ke Daftar Kuis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 py-16">
      {/* Header */}
      <div className="bg-white shadow-md py-4 px-6 mb-6 fixed top-16 w-full z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">{quiz?.title}</h1>
          <button
            onClick={handleSubmitClick}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Selesaikan Kuis
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-16">
        <div className="max-w-3xl mx-auto">
          {questions.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
                </h2>
                <div className="text-sm text-gray-500">
                  {questions[currentQuestionIndex].question_type === 'MC' && 'Pilihan Ganda'}
                  {questions[currentQuestionIndex].question_type === 'TF' && 'Benar/Salah'}
                  {questions[currentQuestionIndex].question_type === 'SA' && 'Isian Singkat'}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-lg">{questions[currentQuestionIndex].title}</p>
              </div>

              <div className="mb-6">
                {questions[currentQuestionIndex].question_type === 'MC' && (
                  <MultipleChoiceAnswer
                    question={questions[currentQuestionIndex]}
                    selectedAnswer={userAnswers[questions[currentQuestionIndex].id]}
                    onAnswerChange={(answer) => handleAnswerChange(questions[currentQuestionIndex].id, answer)}
                  />
                )}

                {questions[currentQuestionIndex].question_type === 'TF' && (
                  <TrueFalseAnswer
                    question={questions[currentQuestionIndex]}
                    selectedAnswer={userAnswers[questions[currentQuestionIndex].id]}
                    onAnswerChange={(answer) => handleAnswerChange(questions[currentQuestionIndex].id, answer)}
                  />
                )}

                {questions[currentQuestionIndex].question_type === 'SA' && (
                  <ShortAnswerInput
                    question={questions[currentQuestionIndex]}
                    userAnswer={userAnswers[questions[currentQuestionIndex].id]}
                    onAnswerChange={(answer) => handleAnswerChange(questions[currentQuestionIndex].id, answer)}
                  />
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={goToPrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`px-4 py-2 rounded-md ${
                    currentQuestionIndex === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  ← Sebelumnya
                </button>
                
                <button
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className={`px-4 py-2 rounded-md ${
                    currentQuestionIndex === questions.length - 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Berikutnya →
                </button>
              </div>
            </div>
          )}      
        </div>
      </div>
    </div>
  );
};

const MultipleChoiceAnswer = ({ question, selectedAnswer, onAnswerChange }) => {
  return (
    <div className="space-y-3">
      {question.answers.map((answer) => (
        <div 
          key={answer.id} 
          className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
            selectedAnswer === answer.answer_text ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onClick={() => onAnswerChange(answer.answer_text)}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
              selectedAnswer === answer.answer_text ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
            }`}>
              {selectedAnswer === answer.answer_text && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            <span>{answer.answer_text}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const TrueFalseAnswer = ({ question, selectedAnswer, onAnswerChange }) => {
  return (
    <div className="space-y-3">
      {question.answers.map((answer) => (
        <div 
          key={answer.id} 
          className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
            selectedAnswer === answer.answer_text ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onClick={() => onAnswerChange(answer.answer_text)}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
              selectedAnswer === answer.answer_text ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
            }`}>
              {selectedAnswer === answer.answer_text && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            <span>{answer.answer_text}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const ShortAnswerInput = ({ question, userAnswer, onAnswerChange }) => {
  return (
    <div>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ketik jawaban Anda di sini..."
        rows="4"
        value={userAnswer || ''}
        onChange={(e) => onAnswerChange(e.target.value)}
      ></textarea>
    </div>
  );
};

export default DoQuiz;