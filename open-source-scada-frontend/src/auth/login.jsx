import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import api from "../services/api";
import "./auth.css";

export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('dark');

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {
            // Backend endpoint: POST /auth/login
            const response = await api.post("/auth/login", {
                username: username,
                password: password,
            });

            const data = response.data;

            if (data?.access_token) {
                localStorage.setItem("scada-token", data.access_token);
                localStorage.setItem("scada-user", JSON.stringify({ username: username }));
            }

            onLogin();
            navigate("/home");

        } catch (err) {
            console.error("Login error:", err);
            const message = err.response?.data?.message || "Invalid username or password.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`auth-page ${theme}`} data-theme={theme}>
            <Sidebar isAuth={true} theme={theme} onThemeToggle={toggleTheme} />
            <main className="auth-main">
                <div className="auth-content">
                    <div className="auth-header">
                        <h1>Login</h1>

                    </div>

                    <div className="auth-card">
                        <form onSubmit={handleLogin} noValidate>
                            <div className="form-group">
                                <label>USERNAME</label>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"
                                />
                            </div>

                            <div className="form-group">
                                <div className="label-row">
                                    <label>PASSWORD</label>
                                    <a href="#" className="forgot-link">Forgot Password?</a>
                                </div>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {error && <p className="auth-error">{error}</p>}

                            <div className="checkbox-row">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                    />
                                    <span className="custom-checkbox"></span>
                                    Remember Me
                                </label>
                            </div>

                            <button type="submit" className="auth-btn" disabled={loading}>
                                {loading ? (
                                    <span className="btn-loading">
                                        <span className="spinner"></span> Signing in...
                                    </span>
                                ) : (
                                    <>Sign In &rarr;</>
                                )}
                            </button>
                        </form>


                    </div>
                </div>
            </main>
        </div>
    );
}