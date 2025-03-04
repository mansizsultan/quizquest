import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white p-4 shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="text-blue-800 text-3xl font-bold px-6">
          QuizQuest
        </Link>

        <div className="md:hidden">
          <button className="text-blue-800" onClick={toggleMenu}>
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        <ul className="hidden md:flex space-x-4">
          <li>
            <Link
              to="/"
              className="
                                text-blue-800 px-6 py-2 font-bold relative inline-block
                                transition-all duration-300 ease-in-out
                                hover:bg-blue-200 hover:rounded-lg hover:bg-opacity-50 hover:scale-105
                            "
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/quizzes"
              className="
                                text-blue-800 px-6 py-2 font-bold relative inline-block
                                transition-all duration-300 ease-in-out
                                hover:bg-blue-200 hover:rounded-lg hover:bg-opacity-50 hover:scale-105
                            "
            >
              Daftar Kuis
            </Link>
          </li>
          <li>
            <Link
              to="/user-quizzes"
              className="
                                text-blue-800 px-6 py-2 font-bold relative inline-block
                                transition-all duration-300 ease-in-out
                                hover:bg-blue-200 hover:rounded-lg hover:bg-opacity-50 hover:scale-105
                            "
            >
              Kuis Kamu
            </Link>
          </li>
        </ul>
      </div>
      {/* MOBILE VIEW */}
      {isMenuOpen ? (
        <ul className="flex-col md:hidden text-center">
          <li className="py-4">
            <Link to="/" className="text-blue-800 px-6 font-bold">
              Home
            </Link>
          </li>
          <li className="py-4">
            <Link to="/quizzes" className="text-blue-800 px-6 font-bold">
              Daftar Kuis
            </Link>
          </li>
          <li className="py-4">
            <Link to="/user-quizzes" className="text-blue-800 px-6 font-bold">
              Kuis Kamu
            </Link>
          </li>
        </ul>
      ) : null}
    </nav>
  );
}

export default Navbar;
