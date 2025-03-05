import { useState, useContext } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { AuthContext } from "../context/AuthContext";

function Form({ route, method }) {
    const { setIsAuthenticated, get_username } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
    
        try {
            console.log("Mengirim permintaan login..."); // Debugging
            const res = await api.post(route, { username, password });
    
            if (method === "login") {
                console.log("Login berhasil, menyimpan token...");
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                setIsAuthenticated(true);
    
                console.log("Memanggil get_username...");
                await get_username(); // Pastikan username diperbarui sebelum pindah halaman
    
                console.log("Navigasi ke home...");
                navigate("/");
                window.location.reload(); // Paksa refresh agar username langsung muncul
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.log("Login gagal:", error);
            alert(error);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-blue-300 to-white px-4">
            <div className="max-w-md w-full bg-white p-4 shadow-lg rounded-lg">
                <div className="text-center mb-2">
                    <h1 className="text-3xl font-bold text-blue-800">QuizQuest</h1>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">{name}</h2>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">Username</label>
                        <input
                            id="username"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Masukkan username"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                        <input
                            id="password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password"
                            required
                        />
                    </div>
                    
                    <button 
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : name}
                    </button>
                    
                    <div className="mt-6 text-center text-gray-600">
                        {method === "login" ? (
                            <p>Belum punya akun? <Link to="/register" className="text-blue-600 font-medium hover:underline">Daftar sekarang!</Link></p>
                        ) : (
                            <p>Sudah punya akun? <Link to="/login" className="text-blue-600 font-medium hover:underline">Masuk sekarang!</Link></p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Form;
