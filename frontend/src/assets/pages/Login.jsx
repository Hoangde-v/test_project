import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import CheffImage from '../images/Home/Cheff1.png';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Đăng nhập thành công!");

        if (data.token) {
          localStorage.setItem('token', data.token);         // lưu token
          localStorage.setItem('role', data.user.role);      // lưu role
          localStorage.setItem('userName', data.user.name);
        }

        // Phân luồng theo role
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/categories');
        }

      } else {
        alert("Đăng nhập thất bại: " + (data.message || "Thông tin không chính xác"));
      }
    } catch (error) {
      alert("Lỗi kết nối tới server.");
      console.error("Login error:", error);
    }

  };

  return (
    <div className="login-container">
      {/* Left Panel */}
      <div className="login-form-section">
        <div className="login-brand">🔒 FoodieLogin</div>
        <h1 className="login-title">Holla,<br />Welcome to Foodieland</h1>
        <p className="login-subtext">Hey, welcome back to your special place</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="stanley@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="●●●●●●●●●●●"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="login-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit">Sign In</button>
        </form>
        <p className="signup-link">
          Don't have an account? <a onClick={() => navigate('/signup')} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Sign Up</a>
        </p>
      </div>

      {/* Right Image Section */}
      <div className="login-image-section">
        <img src={CheffImage} alt="Chef Illustration" className="login-image" />
      </div>
    </div >
  );
}

export default Login;