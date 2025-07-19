// src/Signup.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import CheffImage from '../images/Home/Cheff1.png';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [userCaptcha, setUserCaptcha] = useState('');
    const navigate = useNavigate();

    // 👉 Hàm tạo captcha ngẫu nhiên
    const generateCaptcha = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptcha(code);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (userCaptcha !== captcha) {
            alert('Captcha không khớp. Vui lòng thử lại.');
            generateCaptcha();
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    dob
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Đăng ký thành công!');
                navigate('/login');
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
            <div className="login-image-section">
                <img src={CheffImage} alt="Signup Illustration" className="login-image" />
            </div>

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
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        placeholder="Date of Birth"
                    />

                    {/* Captcha */}
                    <div className="captcha-row">
                        <span className="captcha-code">{captcha}</span>
                        <button type="button" className="refresh-captcha" onClick={generateCaptcha}>🔁</button>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter captcha"
                        value={userCaptcha}
                        onChange={(e) => setUserCaptcha(e.target.value.toUpperCase())}
                        required
                    />

                    <button type="submit">Sign Up</button>
                </form>
                <p className="signup-link">
                    Already have an account?{' '}
                    <a
                        onClick={() => navigate('/login')}
                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Signup;
