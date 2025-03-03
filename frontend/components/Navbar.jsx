import React, { useState } from 'react'

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <nav className="bg-white p-4 shadow-md">
            <div className='flex items-center justify-between'>
                {/* LOGO */}
                <div className="text-blue-800 text-3xl font-bold px-6">QuizQuest</div>

                <div className="md:hidden">
                    <button className='text-blue-800' onClick={toggleMenu}>
                        <svg
                            fill='none'
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            viewBox='0 0 24 24'
                            className='w-6 h-6'
                        >
                            <path d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>

                <ul className="hidden md:flex space-x-4">
                    <li>
                        <a href="#" className="
                            text-blue-800 px-6 py-2 font-bold relative inline-block
                            transition-all duration-300 ease-in-out
                            hover:bg-blue-200 hover:rounded-lg hover:bg-opacity-50 hover:scale-105
                            "
                        >
                        Home
                        </a>
                    </li>
                    <li>
                        <a href="#" className="
                            text-blue-800 px-6 py-2 font-bold relative inline-block
                            transition-all duration-300 ease-in-out
                            hover:bg-blue-200 hover:rounded-lg hover:bg-opacity-50 hover:scale-105
                            "
                        >
                        Tryout List
                        </a>
                    </li>
                    <li>
                        <a href="#" className="
                            text-blue-800 px-6 py-2 font-bold relative inline-block
                            transition-all duration-300 ease-in-out
                            hover:bg-blue-200 hover:rounded-lg hover:bg-opacity-50 hover:scale-105
                            "
                        >
                        Your Tryout
                        </a>
                    </li>
                </ul>

            </div>
            {/* MOBILE VIEW */}
            {isMenuOpen ? (
                <ul className='flex-col md:hidden text-center'>
                    <li className='py-4'><a href='#' className='text-blue-800 px-6 font-bold'>Home</a></li>
                    <li className='py-4'><a href='#' className='text-blue-800 px-6 font-bold'>Tryout List</a></li>
                    <li className='py-4'><a href='#' className='text-blue-800 px-6 font-bold'>Your Tryout</a></li>
                </ul>
            ) : null}
        </nav>
    )
}

export default Navbar
