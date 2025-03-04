import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // Sesuaikan dengan URL backend Anda

// Fungsi untuk membuat quiz baru
export const createQuiz = async (quizData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quizzes/`, quizData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Jika menggunakan autentikasi
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Gagal membuat quiz");
  }
};

// Fungsi untuk mengambil daftar quiz
export const getQuizzes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quizzes/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Jika menggunakan autentikasi
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Gagal mengambil quiz");
  }
};