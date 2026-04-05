import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import api from "../services/api";
import "./Auth.css";

export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {
            // Backend endpoint: POST /auth/login
            // Request payload: { username, password }
            const response = await api.post("/auth/login", {
                username: email,
                password: password,
            });

            const data = response.data;

            // Backend success returns { access_token: "..." }
            if (data?.access_token) {
                localStorage.setItem("scada-token", data.access_token);
                // Optionally save user info if backend provided it, else use username
                localStorage.setItem("scada-user", JSON.stringify({ username: email }));
            }

            onLogin();           // Update App.jsx auth state
            navigate("/home");    // Redirect to Dashboard

        } catch (err) {
            console.error("Login error:", err);
            const message = err.response?.data?.message || "Invalid username or password.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Sidebar isAuth={true} />
            <main className="auth-main">
                <div className="auth-content">
                    <div className="auth-header">
                        <h1>Login</h1>
                        <p className="auth-subtitle">THE FOCUSED OBSERVER</p>
                    </div>

                    <div className="auth-card">
                        <form onSubmit={handleLogin} noValidate>
                            <div className="form-group">
                                <label>EMAIL ADDRESS</label>
                                <input
                                    type="email"
                                    placeholder="name@domain.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>

                            <div className="form-group">
                                <div className="label-row">
                                    <label>PASSWORD</label>
                                    <a href="#" className="forgot-link">Forgot Password?</a>
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
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

                        <p className="auth-switch">
                            New to the flow?{" "}
                            <span onClick={() => navigate("/register")}>Join the Observer</span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}