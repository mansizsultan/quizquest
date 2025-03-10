import React, { useState } from "react";
import api from "../api";

const QuestionCard = ({ question, onDelete, onEdit, quizId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState({
    title: question.title,
    question_type: question.question_type,
    answers: question.answers.map((answer) => ({ ...answer })),
  });

  const handleDelete = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pertanyaan ini?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.delete(`api/questions/${question.id}/`);
      onDelete(question.id);
    } catch (error) {
      console.error("Gagal menghapus pertanyaan:", error);
      setError("Gagal menghapus pertanyaan. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditedQuestion({
      title: question.title,
      question_type: question.question_type,
      answers: question.answers.map((answer) => ({ ...answer })),
    });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = [...editedQuestion.answers];
    updatedAnswers[index] = {
      ...updatedAnswers[index],
      [field]: value,
    };
    setEditedQuestion({
      ...editedQuestion,
      answers: updatedAnswers,
    });
  };

  const setCorrectAnswer = (index) => {
    const updatedAnswers = editedQuestion.answers.map((answer, i) => ({
      ...answer,
      is_right: i === index,
    }));
    setEditedQuestion({
      ...editedQuestion,
      answers: updatedAnswers,
    });
  };

  const saveChanges = async () => {
    setLoading(true);
    setError(null);

    try {
      if (editedQuestion.title.trim() === "") {
        throw new Error("Pertanyaan tidak boleh kosong");
      }

      const data = {
        quiz: quizId,
        title: editedQuestion.title,
        question_type: editedQuestion.question_type,
        answers: editedQuestion.answers,
      };

      await api.patch(`api/questions/${question.id}/`, data);

      onEdit({
        ...question,
        title: editedQuestion.title,
        question_type: editedQuestion.question_type,
        answers: editedQuestion.answers,
      });

      setIsEditing(false);
    } catch (error) {
      setError(error.message || "Gagal mengubah pertanyaan.");
    } finally {
      setLoading(false);
    }
  };

  const getQuestionTypeLabel = (type) => {
    const types = {
      TF: "True/False",
      MC: "Multiple Choice",
      SA: "Short Answer",
    };
    return types[type] || type;
  };

  if (!isEditing) {
    return (
      <div className="shadow-lg rounded p-3 mb-3 bg-gray-50">
        <div className="flex justify-between mb-2">
          <div>
            <h3 className="font-bold">{question.title}</h3>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 rounded">
              {getQuestionTypeLabel(question.question_type)}
            </span>
          </div>
          <div>
            <button
              onClick={startEditing}
              className="text-blue-600 mr-2"
              title="Edit pertanyaan"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-red-600"
              title="Hapus pertanyaan"
            >
              Hapus
            </button>
          </div>
        </div>

        <div className="mt-2">
          {question.question_type === "TF" && (
            <div className="space-y-1">
              {question.answers.map((answer) => (
                <div
                  key={answer.id}
                  className={answer.is_right ? "font-bold text-green-700" : ""}
                >
                  {answer.answer_text}
                  {answer.is_right && " ✓"}
                </div>
              ))}
            </div>
          )}

          {question.question_type === "MC" && (
            <div className="space-y-1">
              {question.answers.map((answer) => (
                <div
                  key={answer.id}
                  className={answer.is_right ? "font-bold text-green-700" : ""}
                >
                  {answer.answer_text}
                  {answer.is_right && " ✓"}
                </div>
              ))}
            </div>
          )}

          {question.question_type === "SA" && (
            <div className="mt-1">
              <p className="font-bold">Jawaban:</p>
              <p className="text-green-700">
                {question.answers[0]?.answer_text}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded p-3 mb-3 bg-white">
      <div className="mb-3">
        <label className="block font-bold mb-1">Pertanyaan:</label>
        <input
          type="text"
          value={editedQuestion.title}
          onChange={(e) =>
            setEditedQuestion({ ...editedQuestion, title: e.target.value })
          }
          className="border w-full p-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block font-bold mb-1">Tipe Pertanyaan:</label>
        <div className="border p-2 bg-gray-100 rounded">
          {getQuestionTypeLabel(editedQuestion.question_type)}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Tipe pertanyaan tidak dapat diubah.
        </p>
      </div>

      {editedQuestion.question_type === "TF" && (
        <div className="mb-3">
          <label className="block font-bold mb-1">Jawaban:</label>
          {editedQuestion.answers.map((answer, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="radio"
                checked={answer.is_right}
                onChange={() => setCorrectAnswer(index)}
                className="mr-2"
              />
              <input
                type="text"
                value={answer.answer_text}
                onChange={(e) =>
                  handleAnswerChange(index, "answer_text", e.target.value)
                }
                className="border p-2 rounded w-full"
              />
            </div>
          ))}
        </div>
      )}

      {editedQuestion.question_type === "MC" && (
        <div className="mb-3">
          <label className="block font-bold mb-1">Jawaban:</label>
          {editedQuestion.answers.map((answer, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="radio"
                checked={answer.is_right}
                onChange={() => setCorrectAnswer(index)}
                className="mr-2"
              />
              <input
                type="text"
                value={answer.answer_text}
                onChange={(e) =>
                  handleAnswerChange(index, "answer_text", e.target.value)
                }
                className="border p-2 rounded w-full"
              />
            </div>
          ))}
        </div>
      )}

      {editedQuestion.question_type === "SA" && (
        <div className="mb-3">
          <label className="block font-bold mb-1">
            Jawaban yang Benar:
          </label>
          <input
            type="text"
            value={editedQuestion.answers[0]?.answer_text || ""}
            onChange={(e) =>
              handleAnswerChange(0, "answer_text", e.target.value)
            }
            className="border p-2 rounded w-full"
          />
        </div>
      )}

      {error && <div className="text-red-500 mb-3">{error}</div>}

      <div className="flex justify-end">
        <button
          onClick={cancelEditing}
          disabled={loading}
          className="bg-gray-300 px-3 py-1 rounded mr-2"
        >
          Batal
        </button>
        <button
          onClick={saveChanges}
          disabled={loading}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;