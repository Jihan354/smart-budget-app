import { useState } from "react";

import { registerUser } from "../../services/api";

import "../../styles/auth.css";

export default function Register({
  setAuthPage,
  setShowRegister,
  setShowLogin,
}) {
  const [nama, setNama] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  // =====================================================
  // HANDLE REGISTER
  // =====================================================

  const handleRegister = async () => {
    try {
      await registerUser({
        nama,
        email,
        password,
      });

      // ===============================================
      // SAVE USER
      // ===============================================

      alert("Register berhasil!");

      // ===============================================
      // CLOSE REGISTER
      // ===============================================

      if (setShowRegister) {
        setShowRegister(false);
      }

      // ===============================================
      // OPEN LOGIN
      // ===============================================

      if (setShowLogin) {
        setShowLogin(true);
      }
    } catch (err) {
      alert("Register gagal");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Register</h2>

        <input placeholder="Nama" onChange={(e) => setNama(e.target.value)} />

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>Register</button>

        <p
          className="switch"
          onClick={() => {
            if (setShowRegister) {
              setShowRegister(false);
            }

            if (setShowLogin) {
              setShowLogin(true);
            }
          }}
        >
          Sudah punya akun? Login
        </p>
      </div>
    </div>
  );
}
