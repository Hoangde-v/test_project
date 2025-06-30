import React from 'react';
import FacebookIcon from '../images/HeaderVsFooter/facebook.svg';
import TwitterIcon from '../images/HeaderVsFooter/twitter.svg';
import InstagramIcon from '../images/HeaderVsFooter/instagram.svg';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export default function Header() {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const userName = localStorage.getItem("userName");
    const isLoggedIn = !!userName;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header
            className="bg-white shadow-sm"
            style={{
                borderBottom: '1px solid #e0e0e0',
                height: '80px',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}
        >
            <div
                className="d-flex align-items-center justify-content-between container"
                style={{ height: '100%' }}
            >
                <Link
                    to="/"
                    className="fw-bold"
                    style={{
                        fontSize: '24px',
                        color: '#2c3e50',
                        textDecoration: 'none',
                        fontFamily: 'Georgia, serif',
                        letterSpacing: '1px'
                    }}
                >
                    <span style={{ color: '#36b0c2' }}>Foodie</span>land
                </Link>

                <nav className="d-flex gap-4">
                    {[
                        { to: '/', label: 'Home' },
                        { to: '/categories', label: 'Categories' },
                        { to: '/favourite', label: 'Favourite' },
                        { to: '/contact', label: 'Contact' },
                        { to: '/about', label: 'About us' }
                    ].map((item, idx) => (
                        <Link
                            key={idx}
                            to={item.to}
                            className="nav-link"
                            style={{
                                color: '#2c3e50',
                                textDecoration: 'none',
                                fontWeight: '500',
                                position: 'relative',
                                transition: 'color 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#36b0c2'}
                            onMouseLeave={(e) => e.target.style.color = '#2c3e50'}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div ref={dropdownRef} style={{ position: 'relative' }}>
                    <div
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        {isLoggedIn ? (
                            <>
                                <img
                                    src="/images/user-avatar.png"
                                    alt="User Avatar"
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid #ddd'
                                    }}
                                />
                                <span style={{ fontWeight: '500', color: '#2c3e50' }}>
                                    {userName}
                                </span>
                            </>
                        ) : (
                            <>
                                <i className="fa fa-user" style={{ fontSize: '20px', color: '#2c3e50' }}></i>
                                <span style={{ fontWeight: '500', color: '#2c3e50' }}>Guest</span>
                            </>
                        )}
                    </div>

                    {dropdownOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '40px',
                            right: 0,
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            borderRadius: '6px',
                            zIndex: 1001,
                            minWidth: '120px'
                        }}>
                            <Link
                                to="/login"
                                onClick={() => setDropdownOpen(false)}
                                style={{
                                    padding: '8px 12px',
                                    display: 'block',
                                    color: '#2c3e50',
                                    textDecoration: 'none',
                                    backgroundColor: 'white',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                            >
                                Login
                            </Link>
                            <button
                                onClick={() => {
                                    setDropdownOpen(false);
                                    console.log("Exit clicked");
                                }}
                                style={{
                                    padding: '8px 12px',
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'left',
                                    border: 'none',
                                    backgroundColor: 'white',
                                    color: '#2c3e50',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                            >
                                Exit
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
