import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/RecipeCard.css';
import timer from '../images/RecipeDetail/Timer.png';
import forkKnife from '../images/RecipeDetail/ForkKnife.png';
import CartIcon from '../images/Cart/Cart.svg';

const RecipeCard = ({ image, title, description, time, diet, calories, favourites, addToFavourites, removeFromFavourites }) => {
    const recipeUrl = `/recipe/${encodeURIComponent(title)}`;

    const isFavorite = favourites && Array.isArray(favourites) && favourites.some(favRecipe => favRecipe.title === title);

    const [isCartClicked, setIsCartClicked] = useState(false);

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const currentRecipe = { image, title, description, time, diet, calories };

        if (isFavorite) {
            removeFromFavourites(currentRecipe);
        } else {
            addToFavourites(currentRecipe);
        }
    };

    const handleBuyNowClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleAddToCartClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsCartClicked(!isCartClicked);
    };

    const cartButtonBackgroundColor = isCartClicked ? '#36b0c2' : '#f8f9fa';
    const cartIconFilter = isCartClicked ? 'brightness(0) invert(1)' : 'none';

    return (
        <Link to={recipeUrl} className="card h-100 border-0 shadow-sm recipe-card text-decoration-none text-dark">
            <div className="position-relative">
                <img src={image} className="card-img-top" alt={title} />
                <button
                    className="favorite-button position-absolute top-0 end-0 m-2 btn btn-light rounded-circle"
                    onClick={handleFavoriteClick}
                >
                    <i className={`bi ${isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                </button>
            </div>
            <div className="card-body">
                <h5 className="fw-semibold text-decoration-none text-black mb-2 recipe-card-title">{title}</h5>
                <p className="text-muted small-description">{description}</p>
                {/* {time && (
                    <div className="d-flex align-items-center text-muted">
                        <img
                            src={timer}
                            alt="Time icon"
                            className="me-1"
                            style={{ width: '16px', height: '16px' }}
                        />
                        <small>{time}</small>
                    </div>
                )} */}
                {diet && (
                    <div className="d-flex align-items-center flex-wrap gap-1 mt-2">
                        <img
                            src={forkKnife}
                            alt="Diet icon"
                            className="me-1"
                            style={{ width: '14px', height: '14px' }}
                        />
                        <div className="d-flex flex-wrap gap-1">
                            {Array.isArray(diet) && diet.map((dietItem, index) => {
                                const normalized = dietItem.toLowerCase().replace(/\s+/g, '-');
                                const colorMap = {
                                    vegan: ['#e6f4ea', '#2c7a4b'],
                                    keto: ['#f3e8fd', '#7e57c2'],
                                    'gluten-free': ['#fff4e5', '#ef6c00'],
                                    paleo: ['#e1f5fe', '#0277bd'],
                                    'low-carb': ['#fdeaea', '#c62828'],
                                    vegetarian: ['#e7fbe9', '#388e3c'],
                                    'dairy-free': ['#f1f8e9', '#689f38'],
                                    'whole30': ['#e3f2fd', '#1565c0'],
                                };

                                const [bgColor, textColor] = colorMap[normalized] || ['#e0f7fa', '#00796b'];

                                return (
                                    <span
                                        key={index}
                                        className="badge rounded-pill px-2 py-1"
                                        style={{
                                            fontSize: '0.75rem',
                                            backgroundColor: bgColor,
                                            color: textColor,
                                        }}
                                    >
                                        {dietItem}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mt-3">
                    <button
                        className="btn btn-outline-secondary rounded-pill px-3 py-2 flex-grow-1 me-2"
                        onClick={handleBuyNowClick}
                    >
                        Buy Now
                    </button>
                    <button
                        className="btn rounded-circle"
                        onClick={handleAddToCartClick}
                        style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.3s ease, filter 0.3s ease',
                            backgroundColor: cartButtonBackgroundColor,
                        }}
                        onMouseEnter={(e) => {
                            if (!isCartClicked) {
                                e.currentTarget.style.backgroundColor = '#e2e6ea';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isCartClicked) {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                            }
                        }}
                    >
                        <img src={CartIcon} alt="Cart Icon" style={{ width: '20px', height: '20px', filter: cartIconFilter }} />
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;