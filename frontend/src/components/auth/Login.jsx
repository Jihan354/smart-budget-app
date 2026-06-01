import { useState } from "react";

import { loginUser } from "../../services/api";

import "../../styles/auth.css";

export default function Login({ setIsLogin, setShowLogin, setShowRegister }) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  // =====================================================
  // HANDLE LOGIN
  // =====================================================

  const handleLogin = async () => {
    try {
      await loginUser({
        email,
        password,
      });

      // ===============================================
      // SAVE CURRENT USER
      // ===============================================

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: email,
          name: email.split("@")[0],
        }),
      );

      // ===============================================
      // LOGIN STATUS
      // ===============================================

      localStorage.setItem("login", "true");

      setIsLogin(true);

      // ===============================================
      // CLOSE LOGIN MODAL
      // ===============================================

      if (setShowLogin) {
        setShowLogin(false);
      }

      window.location.reload();
    } catch (err) {
      alert("Login gagal");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Login</h2>

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p
          className="switch"
          onClick={() => {
            if (setShowLogin) {
              setShowLogin(false);
            }

            if (setShowRegister) {
              setShowRegister(true);
            }
          }}
        >
          Belum punya akun? Register
        </p>
      </div>
    </div>
  );
}
