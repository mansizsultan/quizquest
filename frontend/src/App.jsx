import React from "react";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-300 to-white">
      {/* NAVBAR */}
      <Navbar />

      {/* UCAPAN SELAMAT DATANG */}
      <div className="flex flex-col items-center justify-start flex-grow pt-8">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-black">Selamat datang di </span>
          <span className="text-blue-800">QuizQuest!</span>
        </h1>

        {/* SLOGAN */}
        <p className="text-xl text-gray-800 mt-2 text-center">
          Jelajahi, Ciptakan, dan Pelajari Kuis Seru Setiap Hari!
        </p>

        {/* APA RENCANA HARI INI? */}
        <h2 className="text-2xl font-semibold text-black mt-4">
          Apa rencana hari ini?
        </h2>

        {/* CONTAINER CARD */}
        <div className="mt-6 flex flex-wrap justify-center gap-16">
          {/* CARD 1 */}
          <div className="w-64 bg-white shadow-xl rounded-xl overflow-hidden 
                          transition duration-300 transform hover:shadow-[0_0_20px_#1E40AF]">
            <img
              src="images/pen.jpg"
              alt="Belajar"
              className="w-full h-40 object-cover mt-4"
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Jelajahi Kuis</h3>
              <p className="text-gray-600 text-sm">Kerjakan kuis dan tantang dirimu!</p>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="w-64 bg-white shadow-xl rounded-xl overflow-hidden 
                          transition duration-300 transform hover:shadow-[0_0_20px_#1E40AF]">
            <img
              src="images/plus.jpg"
              alt="Buat Kuis"
              className="w-full h-40 object-cover mt-4"
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Buat Kuis</h3>
              <p className="text-gray-600 text-sm">Buat kuismu sendiri dan bagikan!</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default App;
