import { useState } from "react";
import { loginUser } from "../../services/api";

export default function Login({ setIsLogin, setAuthPage }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginUser({ email, password });

      setIsLogin(true); // masuk ke dashboard
    } catch (err) {
      alert("Login gagal");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Login</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p className="switch" onClick={() => setAuthPage("register")}>
          Belum punya akun? Register
        </p>
      </div>
    </div>
  );
}