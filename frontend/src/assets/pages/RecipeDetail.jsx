import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import recipesData from '../data/Dishes.json';
import RecipeCard from '../components/RecipeCard.jsx';

import timer from '../images/RecipeDetail/Timer.png';
import forkKnife from '../images/RecipeDetail/ForkKnife.png';
import RecipeNotFound from "../images/RecipeDetail/RecipeNotFound.svg";
import CartIcon from '../images/Cart/Cart.svg';

const RecipeDetailComponent = ({ favourites, addToFavourites, removeFromFavourites, addToOrders, cartItems, addToCart, removeFromCart }) => {
  const { title: recipeTitle } = useParams();
  const navigate = useNavigate();

  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [isCartClicked, setIsCartClicked] = useState(false);


  useEffect(() => {
    const decodedRecipeTitle = decodeURIComponent(recipeTitle).toLowerCase();

    const foundRecipe = recipesData.find(
      (dish) => dish.title.toLowerCase() === decodedRecipeTitle
    );
    setCurrentRecipe(foundRecipe);

    if (foundRecipe) {
      const filteredSimilar = recipesData.filter(
        (dish) => dish.category === foundRecipe.category && dish.title !== foundRecipe.title
      ).slice(0, 4);
      setSimilarRecipes(filteredSimilar);
    } else {
      const randomRecipes = recipesData.sort(() => 0.5 - Math.random()).slice(0, 4);
      setSimilarRecipes(randomRecipes);
    }
  }, [recipeTitle, recipesData]);

  const recipeToDisplay = currentRecipe || {
    title: "Dish Not Found",
    calories: "N/A",
    diet: "N/A",
    image: RecipeNotFound,
    ingredients: [],
    time: "N/A",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    protein: "N/A",
    carb: "N/A",
    fats: "N/A",
    preparations: []
  };

  useEffect(() => {
    const isInCart = cartItems.some(item => item.title === recipeToDisplay?.title);
    setIsCartClicked(isInCart);
  }, [cartItems, recipeToDisplay]);

  const nutritionInfo = {
    calories: recipeToDisplay.calories,
    protein: recipeToDisplay.protein,
    carb: recipeToDisplay.carb,
    fats: recipeToDisplay.fats
  };

  const price = recipeToDisplay.price;

  const preparations = [
    { title: "Flavor Profile", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { title: "How It’s Made", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
    { title: "Serving Info", description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
  ];

  const handleEmailSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email address is required.');
      setEmailSuccess('');
    } else if (!emailRegex.test(email)) {
      setEmailError('Email address is invalid.');
      setEmailSuccess('');
    } else {
      setEmailError('');
      setEmailSuccess("Thanks! We'll get in touch with you soon.");
      setEmail('');
    }
  };

  const handleBuyNowClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (addToOrders && recipeToDisplay.title !== "Dish Not Found") {
      const orderDetails = {
        name: recipeToDisplay.title,
        image: recipeToDisplay.image,
        diet: recipeToDisplay.diet,
        price: parseFloat(recipeToDisplay.price) || 0,
        quantity: selectedQuantity,
      };
      addToOrders(orderDetails);
      alert(`Added "${recipeToDisplay.title}" to your orders!`);
    }
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!recipeToDisplay || recipeToDisplay.title === "Dish Not Found") return;

    const existingInCart = cartItems.some(item => item.title === recipeToDisplay.title);

    if (existingInCart) {
      removeFromCart({ title: recipeToDisplay.title });
      setSelectedQuantity(1);
      setIsCartClicked(false);
      alert(`Removed "${recipeToDisplay.title}" from your cart.`);
    } else {
      const recipeWithQuantity = {
        title: recipeToDisplay.title,
        image: recipeToDisplay.image,
        diet: recipeToDisplay.diet,
        price: parseFloat(recipeToDisplay.price) || 0,
        quantity: selectedQuantity,
      };

      addToCart(recipeWithQuantity);
      setIsCartClicked(true);
      alert(`Added ${selectedQuantity} "${recipeToDisplay.title}" to your cart!`);
    }
  };

  const cartButtonBackgroundColor = isCartClicked ? '#36b0c2' : '#f8f9fa';
  const cartIconFilter = isCartClicked ? 'brightness(0) invert(1)' : 'none';

  return (
    <>
      <header className="container-fluid">
        <div className='container'>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='row w-100'>
              <div className="col-12 d-flex justify-content-between align-items-center py-3">
                <h1>{recipeToDisplay.title}</h1>
                <button onClick={() => navigate(-1)} className="btn btn-secondary rounded-pill">
                  <i className="bi bi-arrow-left me-2"></i> Back
                </button>
              </div>
              <div className='col-12 d-flex align-items-center gap-4 py-3'>
                <div className='border-end border-end-2 d-flex gap-2 align-items-center'>
                  <img src={timer} alt="Preparation time icon" />
                  <div className='px-2'>
                    <p className='mb-0 fw-semibold'>Preparation Time</p>
                    <p className='text-secondary mb-0'>{recipeToDisplay.time}</p>
                  </div>
                </div>
                <div className='d-flex gap-2 align-items-center'>
                  <img src={forkKnife} alt="Diet icon" />
                  <div>
                    <p className='text-secondary mb-0'>
                      {Array.isArray(recipeToDisplay.diet) ? recipeToDisplay.diet.join(', ') : recipeToDisplay.diet}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="container py-4">
        <div className="d-flex flex-column flex-lg-row gap-4">
          <div className="col-12 col-lg-8 rounded-4 overflow-hidden">
            <img src={recipeToDisplay.image} alt={recipeToDisplay.title} className='object-fit-cover' style={{ width: '780px', height: '530px' }} />
          </div>

          <div className="col-12 col-lg-4 d-flex flex-column gap-4">
            <div className="bg-info-subtle container rounded-4 p-3" style={{ height: '400px', overflowY: 'auto' }}>
              <h4 className='py-3'>Nutrition Information </h4>
              <div className='d-flex justify-content-between align-items-center border-bottom border-secondary'>
                <p className='fw-semibold text-secondary'>Calories</p>
                <p className='fw-semibold'>{nutritionInfo.calories}kcal</p>
              </div>
              <div className='d-flex justify-content-between align-items-center border-bottom border-secondary my-3'>
                <p className='fw-semibold text-secondary'>Protein</p>
                <p className='fw-semibold'>{nutritionInfo.protein}g</p>
              </div>
              <div className='d-flex justify-content-between align-items-center border-bottom border-secondary '>
                <p className='fw-semibold text-secondary'>Carbs</p>
                <p className='fw-semibold'>{nutritionInfo.carb}g</p>
              </div>
              <div className='d-flex justify-content-between align-items-center border-bottom border-secondary my-3'>
                <p className='fw-semibold text-secondary'>Fats</p>
                <p className='fw-semibold'>{nutritionInfo.fats}g</p>
              </div>
            </div>

            {price && (
              <div className="d-flex justify-content-between align-items-center mb-2 gap-3">
                <div className="d-flex align-items-center gap-2">
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
                    style={{ maxWidth: '80px', fontWeight: 'bold', borderRadius: '8px' }}
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

                <div>
                  <span className="fw-semibold text-secondary me-1 fs-5">Total:</span>
                  <span className="text-danger fw-bold fs-4">
                    ${(parseFloat(price) * (parseInt(selectedQuantity || 0) || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center flex-shrink-0">
              <button
                className="btn btn-outline-secondary rounded-pill px-3 flex-grow-1 me-2"
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
        </div>
      </section>
      <div className='container py-5'>
        <div className='d-flex justify-content-center mb-3 '>
          <h1 className='border-bottom border-secondary'>About the Dish</h1>
        </div>
        <div className='border-bottom border-secondary pb-3'>
          <span className='text-secondary'>
            {recipeToDisplay.description}
          </span>
        </div>
      </div>

      <section className="container my-4">
        <div className="row">
          <div className="col-lg-7">
            <h3 className="fw-bold">Ingredients</h3>
            <h5 className="mt-4 fw-semibold">For the Main Course</h5>
            <ul className="list-unstyled border-top">
              {recipeToDisplay.ingredients && recipeToDisplay.ingredients.length > 0 ? (
                recipeToDisplay.ingredients.map((ingredient, index) => (
                  <li key={index} className="border-bottom py-3 d-flex align-items-center">
                    <input type="checkbox" className="form-check-input me-3 mt-0" />
                    {ingredient}
                  </li>
                ))
              ) : (
                <li className="py-3 text-secondary">No ingredients listed.</li>
              )}
            </ul>

            <div className='py-5'>
              <h3 className="fw-bold">Dish Information</h3>
              <ul className="list-unstyled border-top">
                {preparations && preparations.length > 0 ? (
                  preparations.map((step, index) => (
                    <li key={index} className="border-bottom py-3 d-flex align-items-center flex-wrap">
                      <p className='fw-semibold fs-3'>{index + 1}. {step.title}</p>
                      <p className='text-secondary'>
                        {step.description}
                      </p>
                    </li>
                  ))
                ) : (
                  <li className="py-3 text-secondary">No dish information listed.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="col-lg-5 ps-lg-5 mt-5 mt-lg-0" style={{ position: 'sticky', top: '90px', alignSelf: 'flex-start' }}>
            <h5 className="fw-bold">Other Dishes</h5>

            {similarRecipes.length > 0 ? (
              similarRecipes.map((dish, index) => (
                <div className="d-flex mb-3" key={index}>
                  <Link to={`/dish/${encodeURIComponent(dish.title)}`} className="me-3">
                    <img
                      src={dish.image}
                      className="rounded-3"
                      width="120"
                      height="80"
                      alt={dish.title}
                      style={{ objectFit: 'cover' }}
                    />
                  </Link>
                  <div>
                    <Link to={`/dish/${encodeURIComponent(dish.title)}`} className="mb-1 fw-semibold text-decoration-none text-black">
                      {dish.title}
                    </Link>
                    <p className="text-muted">{Array.isArray(dish.diet) ? dish.diet.join(', ') : dish.diet}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No similar dishes found.</p>
            )}

            <div className="text-center bg-success text-white p-4 rounded-4 mt-3">
              <p className="fw-semibold mb-1">Want your own special diet?</p>
              <p className="fw-semibold fs-2">Contact us!</p>

              <div className="d-flex flex-column flex-md-row gap-2 mb-2">
                <input
                  type="email"
                  className="form-control border-0 rounded-3 w-full flex-grow-1"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ height: '45px' }}
                />
                <button
                  className="btn btn-light fw-semibold text-success px-4 rounded-3 w-full md:w-32"
                  onClick={handleEmailSubmit}
                  style={{ height: '45px' }}
                >
                  Submit
                </button>
              </div>

              {emailError && <small className="text-warning d-block">{emailError}</small>}
              {emailSuccess && <small className="text-warning d-block">{emailSuccess}</small>}

              <small className="d-block mt-2">or</small>
              <p className="mb-0">
                <a href="#" className="small text-decoration-none text-white">www.foodieland.com</a>
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className='container my-5'>
        <div className='d-flex justify-content-center mb-3'>
          <h3 className="fw-bold">You might also like these dishes</h3>
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {similarRecipes.length > 0 ? (
            similarRecipes.map((dish, index) => (
              <div className="col" key={index}>
                <RecipeCard
                  image={dish.image}
                  title={dish.title}
                  description={dish.description}
                  time={dish.time}
                  diet={dish.diet}
                  calories={dish.calories}
                  price={dish.price}
                  favourites={favourites}
                  addToFavourites={addToFavourites}
                  removeFromFavourites={removeFromFavourites}
                  addToOrders={addToOrders}
                  cartItems={cartItems}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                />
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-muted">No dishes to display.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default RecipeDetailComponent;