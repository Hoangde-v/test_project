import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/RecipeCard.css';
import forkKnife from '../images/RecipeDetail/ForkKnife.png';
import CartIcon from '../images/Cart/Cart.svg';

const RecipeCard = ({
    image,
    title,
    description,
    time,
    diet,
    calories,
    price,
    favourites,
    addToFavourites,
    removeFromFavourites,
    addToOrders,
    cartItems,
    addToCart,
    removeFromCart
}) => {
    const recipeUrl = `/recipe/${encodeURIComponent(title)}`;
    const isFavorite =
        favourites &&
        Array.isArray(favourites) &&
        favourites.some((favRecipe) => favRecipe.title === title);

    const isCartClicked = Array.isArray(cartItems) && cartItems.some(item => item.title === title);
    const [showQuantityPopup, setShowQuantityPopup] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [showCartPopup, setShowCartPopup] = useState(false);
    const [pendingCartRecipe, setPendingCartRecipe] = useState(null);
    const [cartQuantity, setCartQuantity] = useState(1);


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
        setShowQuantityPopup(true);
    };

    const handleConfirmQuantity = () => {
        const currentRecipeDetails = {
            name: title,
            image,
            diet,
            price: parseFloat(price) || 0,
            quantity: selectedQuantity,
        };
        addToOrders(currentRecipeDetails);
        setShowQuantityPopup(false);
        alert(`Added ${selectedQuantity} "${title}" to your orders!`);
        setSelectedQuantity(1);
    };

    const handleAddToCartClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isCartClicked) {
            removeFromCart({ image, title, diet, price });
            alert(`Removed "${title}" from your cart.`);
        } else {
            setPendingCartRecipe({ image, title, diet, price });
            setCartQuantity(1);
            setShowCartPopup(true);
        }
    };

    const handleCartConfirmQuantity = () => {
        if (pendingCartRecipe) {
            const quantity = parseInt(cartQuantity) || 1;
            const recipeWithQuantity = { ...pendingCartRecipe, quantity };
            addToCart(recipeWithQuantity);
            setShowCartPopup(false);
            alert(`Added ${quantity} "${pendingCartRecipe.title}" to your cart!`);
            setPendingCartRecipe(null);
        }
    };

    const cartButtonBackgroundColor = isCartClicked ? '#36b0c2' : '#f8f9fa';
    const cartIconFilter = isCartClicked ? 'brightness(0) invert(1)' : 'none';

    return (
        <>
            <Link
                to={recipeUrl}
                className="card h-100 border-0 shadow-sm recipe-card text-decoration-none text-dark py-3"
            >
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
                    <h5 className="fw-semibold text-decoration-none text-black recipe-card-title">
                        {title}
                    </h5>

                    {diet && (
                        <div className="d-flex align-items-center flex-wrap gap-1 mb-2 mt-2">
                            <img
                                src={forkKnife}
                                alt="Diet icon"
                                className="me-1"
                                style={{ width: '14px', height: '14px' }}
                            />
                            <div className="d-flex flex-wrap gap-1">
                                {Array.isArray(diet) &&
                                    diet.map((dietItem, index) => {
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

                    {price && (
                        <span className="fw-semibold text-danger recipe-card-title">
                            ${parseFloat(price).toFixed(2)}
                        </span>
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
                                if (!isCartClicked) e.currentTarget.style.backgroundColor = '#e2e6ea';
                            }}
                            onMouseLeave={(e) => {
                                if (!isCartClicked) e.currentTarget.style.backgroundColor = '#f8f9fa';
                            }}
                        >
                            <img
                                src={CartIcon}
                                alt="Cart Icon"
                                style={{ width: '20px', height: '20px', filter: cartIconFilter }}
                            />
                        </button>
                    </div>
                </div>
            </Link>

            {showQuantityPopup && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
                >
                    <div className="bg-white p-4 rounded-4 shadow" style={{ width: '360px' }}>
                        <h5 className="fw-bold mb-3">
                            Select Quantity for
                            <p className='mt-1' style={{ color: "#36b0c2" }}>"{title}"</p>
                        </h5>

                        <label className="form-label fw-semibold">Quantity</label>
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <button
                                className="btn btn-outline-secondary px-3 py-1"
                                onClick={() => {
                                    const value = parseInt(selectedQuantity) || 1;
                                    setSelectedQuantity(Math.max(1, value - 1));
                                }}
                            >
                                −
                            </button>

                            <input
                                type="number"
                                className="form-control text-center"
                                style={{ maxWidth: '150px', fontWeight: 'bold', borderRadius: '8px' }}
                                value={selectedQuantity}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '') {
                                        setSelectedQuantity('');
                                    } else {
                                        const num = parseInt(value);
                                        if (!isNaN(num) && num > 0) {
                                            setSelectedQuantity(num);
                                        }
                                    }
                                }}
                            />

                            <button
                                className="btn btn-outline-secondary px-3 py-1"
                                onClick={() => {
                                    const value = parseInt(selectedQuantity) || 1;
                                    setSelectedQuantity(value + 1);
                                }}
                            >
                                +
                            </button>
                        </div>


                        <div className="mb-3">
                            <strong>Total Price: </strong>
                            <span className="text-danger fw-semibold">
                                ${(parseFloat(price) * selectedQuantity).toFixed(2)}
                            </span>
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setShowQuantityPopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleConfirmQuantity}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCartPopup && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
                >
                    <div className="bg-white p-4 rounded-4 shadow" style={{ width: '360px' }}>
                        <h5 className="fw-bold mb-3">
                            Select Quantity for
                            <p className='mt-1' style={{ color: "#36b0c2" }}>"{pendingCartRecipe?.title}"</p>
                        </h5>

                        <label className="form-label fw-semibold">Quantity</label>
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <button
                                className="btn btn-outline-secondary px-3 py-1"
                                onClick={() => setCartQuantity(Math.max(1, cartQuantity - 1))}
                            >
                                −
                            </button>

                            <input
                                type="number"
                                className="form-control text-center"
                                style={{ maxWidth: '150px', fontWeight: 'bold', borderRadius: '8px' }}
                                value={cartQuantity}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const num = parseInt(val);
                                    if (!isNaN(num) && num > 0) {
                                        setCartQuantity(num);
                                    } else if (val === '') {
                                        setCartQuantity('');
                                    }
                                }}
                            />

                            <button
                                className="btn btn-outline-secondary px-3 py-1"
                                onClick={() => setCartQuantity(cartQuantity + 1)}
                            >
                                +
                            </button>
                        </div>

                        <div className="mb-3">
                            <strong>Total Price: </strong>
                            <span className="text-danger fw-semibold">
                                ${(parseFloat(pendingCartRecipe?.price || 0) * cartQuantity).toFixed(2)}
                            </span>
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setShowCartPopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleCartConfirmQuantity}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default RecipeCard;
