import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const CreateQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [questionData, setQuestionData] = useState({
    title: '',
    question_type: 'TF',
    answers: [
      { answer_text: 'True', is_right: false }, 
      { answer_text: 'False', is_right: true }
    ],
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const goBack = () => {
    navigate(`/user/quiz/${id}`);
  };

  const handleTitleChange = (e) => {
    setQuestionData({
      ...questionData,
      title: e.target.value
    });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    let newAnswers;
    
    if (newType === 'TF') {
      newAnswers = [
        { answer_text: 'True', is_right: false },
        { answer_text: 'False', is_right: true }
      ];
    } else if (newType === 'MC') {
      newAnswers = [
        { answer_text: '', is_right: true },
        { answer_text: '', is_right: false }
      ];
    } else { 
      newAnswers = [{ answer_text: '', is_right: true }];
    }
    
    setQuestionData({
      ...questionData,
      question_type: newType,
      answers: newAnswers
    });
  };

  const handleAnswerTextChange = (index, newText) => {
    const updatedAnswers = [...questionData.answers];
    updatedAnswers[index].answer_text = newText;
    
    setQuestionData({
      ...questionData,
      answers: updatedAnswers
    });
  };

  const handleCorrectAnswerChange = (index) => {
    const updatedAnswers = questionData.answers.map((answer, i) => ({
      ...answer,
      is_right: i === index 
    }));
    
    setQuestionData({
      ...questionData,
      answers: updatedAnswers
    });
  };

  const addAnswer = () => {
    setQuestionData({
      ...questionData,
      answers: [
        ...questionData.answers,
        { answer_text: '', is_right: false }
      ]
    });
  };

  const removeAnswer = (index) => {
    if (questionData.answers.length <= 2) {
      setError('Minimal harus ada 2 jawaban!');
      return;
    }
    
    const isRemovingCorrectAnswer = questionData.answers[index].is_right;
    
    const newAnswers = questionData.answers.filter((_, i) => i !== index);
    
    if (isRemovingCorrectAnswer && newAnswers.length > 0) {
      newAnswers[0].is_right = true;
    }
    
    setQuestionData({
      ...questionData,
      answers: newAnswers
    });
    
    setError(null); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!questionData.title.trim()) {
      setError('Judul pertanyaan tidak boleh kosong!');
      setIsSubmitting(false);
      return;
    }

    if (questionData.question_type === 'MC') {
      const hasEmptyAnswer = questionData.answers.some(answer => !answer.answer_text.trim());
      if (hasEmptyAnswer) {
        setError('Semua jawaban harus diisi!');
        setIsSubmitting(false);
        return;
      }
      
      const hasCorrectAnswer = questionData.answers.some(answer => answer.is_right);
      if (!hasCorrectAnswer) {
        setError('Pilih salah satu jawaban sebagai jawaban yang benar!');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await api.post(`/api/create/quiz/${id}/questions/`, {
        quiz: id,
        title: questionData.title,
        question_type: questionData.question_type,
        answers: questionData.answers,
      });
      
      alert("Pertanyaan berhasil dibuat!");
      
      setQuestionData({
        title: '',
        question_type: 'TF',
        answers: [
          { answer_text: 'True', is_right: false }, 
          { answer_text: 'False', is_right: true }
        ],
      });
    } catch (err) {
      console.error('Error creating question:', err);
      setError('Terjadi kesalahan saat membuat pertanyaan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-300 to-white">
      <div className="flex flex-col items-center justify-start flex-grow pt-8">
        {/* Header */}
        <div className="w-full max-w-4xl px-4 flex items-center">
          <button onClick={goBack} className="text-blue-800 mr-4">
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
          </button>
          <h1 className="text-4xl font-bold text-center text-blue-800">Buat Pertanyaan</h1>
        </div>
        
        {/* Form */}
        <div className="w-full max-w-4xl mt-6 px-4 bg-white p-6 rounded-lg shadow-lg">
          {/* Pesan Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Judul Pertanyaan */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                Judul Pertanyaan
              </label>
              <input
                type="text"
                id="title"
                value={questionData.title}
                onChange={handleTitleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan judul pertanyaan"
                required
              />
            </div>

            {/* Jenis Pertanyaan */}
            <div className="mb-4">
              <label htmlFor="question_type" className="block text-gray-700 font-bold mb-2">
                Jenis Pertanyaan
              </label>
              <select
                id="question_type"
                value={questionData.question_type}
                onChange={handleTypeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TF">True/False</option>
                <option value="MC">Multiple Choice</option>
                <option value="SA">Short Answer</option>
              </select>
            </div>

            {/* Jawaban */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 font-bold">Jawaban</label>
                
                {/* Tombol Tambah Jawaban (hanya untuk Multiple Choice) */}
                {questionData.question_type === 'MC' && (
                  <button
                    type="button"
                    onClick={addAnswer}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                  >
                    + Tambah Jawaban
                  </button>
                )}
              </div>
              
              {/* Daftar Jawaban */}
              {questionData.answers.map((answer, index) => (
                <div key={index} className="mb-2">
                  {/* True/False */}
                  {questionData.question_type === 'TF' ? (
                    <div className="flex items-center border border-gray-300 rounded-lg p-3 hover:bg-gray-50">
                      <span className="flex-grow">{answer.answer_text}</span>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Jawaban Benar</label>
                        <input
                          type="radio"
                          name="correct_answer"
                          checked={answer.is_right}
                          onChange={() => handleCorrectAnswerChange(index)}
                          className="h-5 w-5"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Multiple Choice atau Short Answer */
                    <div className="flex items-center space-x-2">
                      {/* Input Jawaban */}
                      <input
                        type="text"
                        value={answer.answer_text}
                        onChange={(e) => handleAnswerTextChange(index, e.target.value)}
                        placeholder={`Jawaban ${index + 1}`}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      
                      {/* Jawaban Benar (hanya untuk Multiple Choice) */}
                      {questionData.question_type === 'MC' && (
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">Benar</label>
                          <input
                            type="radio"
                            name="correct_answer"
                            checked={answer.is_right}
                            onChange={() => handleCorrectAnswerChange(index)}
                            className="h-5 w-5"
                          />
                        </div>
                      )}
                      
                      {/* Tombol Hapus (hanya untuk Multiple Choice) */}
                      {questionData.question_type === 'MC' && (
                        <button
                          type="button"
                          onClick={() => removeAnswer(index)}
                          className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tombol Submit dan Kembali */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={goBack}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Memproses..." : "Buat Pertanyaan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;