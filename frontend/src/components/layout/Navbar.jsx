import { useState } from "react";

import "../../styles/navbar.css";

import { FaWhatsapp, FaMoon, FaSun } from "react-icons/fa";

export default function Navbar({
  open,
  setOpen,
  title,
  isLogin,
  setShowLogin,
  setShowRegister,
  setIsLogin,
  darkMode,
  setDarkMode,
}) {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className={open ? "top-navbar" : "top-navbar closed"}>
      {/* ====================================== */}
      {/* LEFT */}
      {/* ====================================== */}

      <div className="navbar-left">
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          ☰
        </button>

        <div className="navbar-badge">{title || "Dashboard Analytics"}</div>
      </div>

      {/* ====================================== */}
      {/* RIGHT */}
      {/* ====================================== */}

      <div className="navbar-right">
        {/* ===================================== */}
        {/* DARK MODE */}
        {/* ===================================== */}

        <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <p onClick={() => setShowTerms(true)}>Syarat dan Ketentuan</p>

        <p onClick={() => window.open("https://wa.me/6281216341853", "_blank")}>
          <FaWhatsapp />
          Hubungi Kami
        </p>

        {/* ===================================== */}
        {/* LOGIN / LOGOUT */}
        {/* ===================================== */}

        {!isLogin ? (
          <button className="auth-btn" onClick={() => setShowLogin(true)}>
            Masuk
          </button>
        ) : (
          <button
            className="auth-btn logout"
            onClick={() => {
              localStorage.removeItem("login");

              localStorage.removeItem("user");

              setIsLogin(false);

              window.location.reload();
            }}
          >
            Logout
          </button>
        )}
      </div>

      {/* ====================================== */}
      {/* TERMS MODAL */}
      {/* ====================================== */}

      {showTerms && (
        <div className="terms-overlay">
          <div className="terms-modal">
            <h2>Syarat dan Ketentuan</h2>

            <p>
              Smart Budget App membantu pengguna mengelola budget perjalanan
              secara AI-powered untuk kebutuhan edukasi dan personal travel
              planning.
            </p>

            <p>
              Semua estimasi budget bersifat prediksi dan dapat berubah sesuai
              kondisi nyata perjalanan.
            </p>

            <button onClick={() => setShowTerms(false)}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
