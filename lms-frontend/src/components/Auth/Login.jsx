import { useState, useEffect } from "react";
import { Link, useNavigate }    from "react-router-dom";
import api                      from "../../api/axios";
import { saveTokens, getUserRole } from "../../utils/auth";

import styles                   from "./Login.module.css";
import logo                     from "../../assets/log.png";
import { FiEye, FiEyeOff }      from "react-icons/fi";
import { FcGoogle }             from "react-icons/fc";
import { toast }                from "../../utils/toast";   // ✅ NEW

const LS_KEY = "savedCreds";

export default function Login() {
  /* ───────────────────────── bootstrap ───────────────────────── */
  let boot = { username: "", password: "" };
  try { boot = JSON.parse(localStorage.getItem(LS_KEY)) || boot; } catch (err) {
    console.error("Error parsing localStorage data:", err);
  }

  const [form, setForm] = useState({
    username: boot.username,
    password: boot.password,
    remember: !!boot.username,
  });
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState("");

  const navigate = useNavigate();

  /* remember-me persistence */
  useEffect(() => {
    if (form.remember) {
      localStorage.setItem(LS_KEY, JSON.stringify({
        username: form.username,
        password: form.password,
      }));
    } else {
      localStorage.removeItem(LS_KEY);
    }
  }, [form]);

  /* ───────────────────────── handlers ────────────────────────── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      /* skipToast ➜ don't show the generic 401 toast here */
      const { data } = await api.post(
        "/auth/login",
        { username: form.username, password: form.password },
        { skipToast: true }
      );

      saveTokens(data.accessToken, data.refreshToken, form.remember);
      localStorage.setItem("username", form.username);

      toast("Login successful", "success");           // ✅ NEW

      navigate(getUserRole() === "ROLE_ADMIN" ? "/admin" : "/dashboard");

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ??
        err.response?.data?.errorMessage ??
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────── UI ────────────────────────────── */
  return (
    <main className={styles.app}>
      <form className={styles.card} onSubmit={handleSubmit}>

        <div className={styles.header}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>

        <h1 className={styles.title}>Sign in</h1>

        {/* Username */}
        <label className={styles.label}>
          Username
          <input
            className={styles.input}
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </label>

        {/* Password */}
        <label className={styles.label}>
          Password
          <div className={styles.passwordWrapper}>
            <input
              className={styles.input}
              type={showPwd ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowPwd(p => !p)}
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </label>

        {error && <p className={styles.error}>{error}</p>}

        {/* Remember / Forgot */}
        <div className={styles.row}>
          <label className={styles.rememberRow}>
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
            />{" "}
            Remember me
          </label>

          <Link to="/forgot-password" className={styles.forgot}>
            Forgot Password?
          </Link>
        </div>

        {/* Sign-in */}
        <button
          type="submit"
          className={styles.primaryBtn}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        {/* Divider & Google */}
        <div className={styles.divider}><span>or</span></div>
        <button
          type="button"
          className={styles.socialBtn}
          onClick={() => alert("Google OAuth coming soon!")}
        >
          <FcGoogle size={18} /> Sign in with Google
        </button>
      </form>
    </main>
  );
}
