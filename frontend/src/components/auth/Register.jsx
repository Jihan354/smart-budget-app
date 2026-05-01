import { useState } from "react";
import { registerUser } from "../../services/api";

export default function Register({ setAuthPage }) {

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser({ nama, email, password });

      alert("Register berhasil!");
      setAuthPage("login"); // balik ke login
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
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <button onClick={handleRegister}>Register</button>

        <p className="switch" onClick={() => setAuthPage("login")}>
          Sudah punya akun? Login
        </p>
      </div>
    </div>
  );
}