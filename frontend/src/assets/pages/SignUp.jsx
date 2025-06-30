// src/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css'; // dùng lại CSS từ login nếu bạn chưa tách riêng
import CheffImage from '../images/Home/Cheff1.png';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Đăng ký thành công!');
                navigate('/login'); // quay về trang đăng nhập
            } else {
                alert('Đăng ký thất bại: ' + (data.message || 'Thông tin không hợp lệ'));
            }
        } catch (error) {
            alert('Lỗi kết nối tới server.');
            console.error('Signup error:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-section">
                <div className="login-brand">📝 FoodieSignup</div>
                <h1 className="login-title">Create Account</h1>
                <form className="login-form" onSubmit={handleSignup}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Sign Up</button>
                </form>
                <p className="signup-link">
                    Already have an account? <a onClick={() => navigate('/login')} style={{textDecoration: 'underline', cursor: 'pointer'}}>Login</a>
                </p>
            </div>
            <div className="login-image-section">
                <img src={CheffImage} alt="Signup Illustration" className="login-image" />
            </div>
        </div>
    );
}

export default Signup;