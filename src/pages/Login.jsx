import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import s from "./AuthForm.module.css";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const { signIn } = useAuth();

  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const from = loc.state?.from?.pathname || "/profile";

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signIn(username.trim(), pass);
      nav(from, { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.wrap}>
      <form className={s.form} onSubmit={onSubmit}>
        <h1 className={s.title}>Log in</h1>
        {err && <div className={s.error}>{err}</div>}

        <label className={s.label}>
          <span>Username</span>
          <input
            className={s.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className={s.label}>
          <span>Password</span>
          <input
            className={s.input}
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button className={s.btn} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>

        <div className={s.alt}>
          No account? <Link to="/register">Create one</Link>
        </div>
      </form>
    </div>
  );
}
