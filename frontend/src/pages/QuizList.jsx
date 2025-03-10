import React, { useState, useEffect, useContext } from "react";
import QuizCard from "../components/QuizCard";
import { Link } from "react-router-dom";
import api from "../api";  
import { AuthContext } from "../context/AuthContext";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);  
  const [filteredQuizzes, setFilteredQuizzes] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const { isAuthenticated } = useContext(AuthContext); 

  const categories = [
    { value: '', label: 'Semua Kategori' },
    { value: 'PU', label: 'Pengetahuan Umum' },
    { value: 'ED', label: 'Edukasi' },
    { value: 'HI', label: 'Hiburan' },
    { value: 'BA', label: 'Bahasa' },
    { value: 'KE', label: 'Kesehatan' },
    { value: 'OL', label: 'Olahraga' },
    { value: 'BU', label: 'Budaya' },
    { value: 'TE', label: 'Teknologi' },
  ];

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get("api/quizzes/");
        setQuizzes(response.data);  
        setFilteredQuizzes(response.data); 
        setLoading(false);  
      } catch (error) {
        console.error("Gagal mengambil data kuis:", error);
        setLoading(false);  
      }
    };

    fetchQuizzes(); 
  }, []); 

  useEffect(() => {
    if (selectedCategory === '') {
      setFilteredQuizzes(quizzes);
    } else {
      const filtered = quizzes.filter(quiz => quiz.category === selectedCategory);
      setFilteredQuizzes(filtered);
    }
  }, [selectedCategory, quizzes]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;  
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-300 to-white">
      <div className="flex flex-col items-center justify-start flex-grow pt-8">
        <div className="w-full max-w-4xl px-4 flex items-center justify-between">
          <div className="flex items-center">
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
          
     
            <Link 
              to="/quiz-history" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Riwayat Kuis
            </Link>
        
        </div>
        
        <div className="w-full max-w-4xl mt-4 px-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="w-full max-w-4xl mt-4 px-4">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />  
            ))
          ) : (
            <div className="text-center p-8 bg-white rounded-lg shadow mt-4">
              <p className="text-gray-500">Tidak ada kuis dalam kategori ini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizList;