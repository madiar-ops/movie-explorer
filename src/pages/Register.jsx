import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import s from "./AuthForm.module.css";

export default function Register() {
  const nav = useNavigate();
  const { signUp } = useAuth();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    setLoading(true);
    try {
      await signUp(username.trim(), pass, name.trim());
      setOk("Account created. You are signed in.");
      nav("/profile", { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.wrap}>
      <form className={s.form} onSubmit={onSubmit}>
        <h1 className={s.title}>Create account</h1>
        {err && <div className={s.error}>{err}</div>}
        {ok && <div className={s.success}>{ok}</div>}

        <label className={s.label}>
          <span>Username</span>
          <input className={s.input} value={username} onChange={(e)=>setUsername(e.target.value)} required />
        </label>

        <label className={s.label}>
          <span>Name (optional)</span>
          <input className={s.input} value={name} onChange={(e)=>setName(e.target.value)} />
        </label>

        <label className={s.label}>
          <span>Password</span>
          <input className={s.input} type="password" value={pass} onChange={(e)=>setPass(e.target.value)} required />
        </label>

        <button className={s.btn} type="submit" disabled={loading}>
          {loading ? "Creating..." : "Sign up"}
        </button>

        <div className={s.alt}>Already have an account? <Link to="/login">Log in</Link></div>
      </form>
    </div>
  );
}
