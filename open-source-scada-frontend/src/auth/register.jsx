import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import api from "../services/api";
import "./auth.css";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        username: "",
        password: "",
        confirm: "",
        terms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('dark');

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!form.fullName || !form.username || !form.password || !form.confirm) {
            setError("Please fill in all fields.");
            return;
        }
        if (form.password !== form.confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (!form.terms) {
            setError("Please accept the Terms of Service.");
            return;
        }

        setLoading(true);

        try {
            // Backend endpoint: POST /auth/register
            const response = await api.post("/auth/register", {
                username: form.username,
                password: form.password,
                role: "operator", // Default role
            });

            if (response.status === 201) {
                setSuccess("Account created successfully! Redirecting to login...");
                navigate("/login");
            } else {
                setError(response.data?.message || "Registration failed. Please try again.");
            }

        } catch (err) {
            console.error("Registration error:", err);
            const message = err.response?.data?.message || "Registration failed. Please try again.";
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
                        <h1>Register</h1>

                    </div>

                    <div className="auth-card">
                        <form onSubmit={handleRegister} noValidate>
                            <div className="form-group">
                                <label>FULL NAME</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="e.g. Elias Vance"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    autoComplete="name"
                                />
                            </div>

                            <div className="form-group">
                                <label>USERNAME</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Choose a username"
                                    value={form.username}
                                    onChange={handleChange}
                                    autoComplete="username"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>PASSWORD</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="••••••••"
                                            value={form.password}
                                            onChange={handleChange}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>CONFIRM</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            name="confirm"
                                            placeholder="••••••••"
                                            value={form.confirm}
                                            onChange={handleChange}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                        >
                                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {error && <p className="auth-error">{error}</p>}
                            {success && <p className="auth-success">{success}</p>}

                            <div className="checkbox-row">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="terms"
                                        checked={form.terms}
                                        onChange={handleChange}
                                    />
                                    <span className="custom-checkbox"></span>
                                    I accept the{" "}
                                    <a href="#" className="terms-link">Terms of Service</a>
                                </label>
                            </div>

                            <button type="submit" className="auth-btn" disabled={loading}>
                                {loading ? (
                                    <span className="btn-loading">
                                        <span className="spinner"></span> Creating...
                                    </span>
                                ) : (
                                    "CREATE ACCOUNT"
                                )}
                            </button>
                        </form>

                        <p className="auth-switch">
                            <span onClick={() => navigate("/login")}>← Back to Login</span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}