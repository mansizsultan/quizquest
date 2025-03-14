// src/pages/CreateQuiz.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const CreateQuiz = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "PU",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Judul dan deskripsi tidak boleh kosong!");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post("/api/create/quizzes/user/", formData);
      console.log("Quiz berhasil dibuat:", response.data);
      const id = response.data.id;
      
      navigate(`/create-question/${id}`);
    } catch (err) {
      console.error("Error creating quiz:", err);
      setError(err.response?.data?.message || "Terjadi kesalahan saat membuat kuis");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-300 to-white">
      <div className="flex flex-col items-center justify-start flex-grow pt-8">
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
          <h1 className="text-4xl font-bold text-center text-blue-800">Buat Kuis Baru</h1>
        </div>

        <div className="w-full max-w-4xl mt-6 px-4 bg-white p-6 rounded-lg shadow-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                Judul Kuis
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan judul kuis"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                Deskripsi Kuis
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan deskripsi kuis"
                rows="4"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
                Kategori Kuis
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="PU">Pengetahuan Umum</option>
                <option value="ED">Edukasi</option>
                <option value="HI">Hiburan</option>
                <option value="BA">Bahasa</option>
                <option value="KE">Kesehatan</option>
                <option value="OL">Olahraga</option>
                <option value="BU">Budaya</option>
                <option value="TE">Teknologi</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Memproses..." : "Buat Kuis"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;