import React from 'react';
import '../css/Post.css';
import Avatar1 from '../images/Post/Avatar1.svg';

const Post = ({ likes, date, index }) => {
    const imageNumber = (index % 4) + 1;
    const image = `/Dish${imageNumber}.svg`;

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="post-info">
                    <img src="/authorImage.svg" alt="NutriPlanner Profile" className="profile-pic" />
                    <div className="post-meta">
                        <span className="username">Foodieland.</span>
                        <span className="location">Tokyo, Japan</span>
                    </div>
                </div>
                <div className="post-options">
                    <i className="bi bi-three-dots"></i>
                </div>
            </div>

            <div className="post-image-container">
                <img src={image} alt={`Dish ${imageNumber}`} className="post-image" />
                <span className="image-counter">1/3</span>
            </div>

            <div className="post-actions">
                <div className="left-icons">
                    <i className="bi bi-heart"></i>
                    <i className="bi bi-chat"></i>
                    <i className="bi bi-send"></i>
                </div>
                <div className="right-icons">
                    <i className="bi bi-bookmark"></i>
                </div>
            </div>

            <div className="post-content">
                <p className="likes-count d-flex align-items-center">
                    <img src={Avatar1} alt="Profile" className="me-2" style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span className="text-separator">Liked by</span> <strong className="username-bold">craig_love</strong> <span className="text-separator">and</span> <strong>{likes}</strong>
                </p>
                <p className="post-description">
                    <span className="username">foodieland. </span>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <span className="post-date">{date}</span>
            </div>
        </div>
    );
};

export default Post;
