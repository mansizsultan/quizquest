import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 

function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    setIsAuthenticated(false);
    navigate("/");
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

        <ul className="hidden md:flex space-x-4 items-center">
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
          {isAuthenticated ? (
            <li>
              <Link
                to="/"
                onClick={handleLogout}
                className="
                  bg-red-500 text-white px-6 py-2 font-bold rounded-lg
                  transition-all duration-300 ease-in-out
                  hover:bg-red-600 hover:scale-105
                "
              >
                Logout
              </Link>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className="
                  bg-blue-500 text-white px-6 py-2 font-bold rounded-lg
                  transition-all duration-300 ease-in-out
                  hover:bg-blue-600 hover:scale-105
                "
              >
                Login
              </Link>
            </li>
          )}
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
          {isAuthenticated ? (
            <li className="py-4">
              <button
                onClick={handleLogout}
                className="
                  bg-red-500 text-white px-6 py-2 font-bold rounded-lg
                  transition-all duration-300 ease-in-out
                  hover:bg-red-600 hover:scale-105
                "
              >
                Logout
              </button>
            </li>
          ) : (
            <li className="py-4">
              <Link
                to="/login"
                className="
                  bg-blue-500 text-white px-6 py-2 font-bold rounded-lg
                  transition-all duration-300 ease-in-out
                  hover:bg-blue-600 hover:scale-105
                "
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      ) : null}
    </nav>
  );
}

export default Navbar;