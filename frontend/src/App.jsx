import { useState } from "react";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container">
      <div className="card">
        <h2>{isLogin ? "Log In" : "Create Account"}</h2>

        {!isLogin && (
          <input type="text" placeholder="Full Name" />
        )}

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        {!isLogin && (
          <div className="checkbox">
            <input type="checkbox" />
            <span>I accept the terms of the agreement</span>
          </div>
        )}

        <button>
          {isLogin ? "Log In" : "Sign Up"}
        </button>

        <p className="switch" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don’t have an account? Sign Up"
            : "Already have an account? Log In"}
        </p>
      </div>
    </div>
  );
}

export default App;