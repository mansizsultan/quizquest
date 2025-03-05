import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");

    const handleAuth = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const expiry_date = decoded.exp;
                const current_time = Date.now() / 1000;

                if (expiry_date > current_time) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    localStorage.removeItem(ACCESS_TOKEN);
                }
            } catch (error) {
                console.error("Token tidak valid:", error);
                setIsAuthenticated(false);
                localStorage.removeItem(ACCESS_TOKEN);
            }
        } else {
            setIsAuthenticated(false);
        }
    };

    const get_username = async () => {
        try {
            const res = await api.get("/api/get_username");
            console.log("Username didapat:", res.data.username);
            setUsername(res.data.username || "");
        } catch (err) {
            console.log("Gagal mendapatkan username:", err.message);
            setUsername("");
        }
    };

    useEffect(() => {
        handleAuth();
        if (localStorage.getItem(ACCESS_TOKEN)) {
            get_username();
        }
    }, []);

    useEffect(() => {
        console.log("AuthContext diperbarui! isAuthenticated:", isAuthenticated, "username:", username);
    }, [isAuthenticated, username]); // Log setiap kali state berubah

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, setIsAuthenticated, get_username }}>
            {children}
        </AuthContext.Provider>
    );
}
