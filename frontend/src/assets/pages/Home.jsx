import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swiper from 'swiper';
import 'swiper/css/bundle';
import { Autoplay, Pagination } from 'swiper/modules';
import '../css/Home.css';
import RecipesData from '../data/Recipes.json';
import Slide from '../components/Slide.jsx';
import RecipeCard from '../components/RecipeCard.jsx'
import Post from '../components/Post.jsx';

import Pancake from '../images/Home/Breakfast.png';
import Salad from '../images/Home/Lunch.png';
import Spaghetti from '../images/Home/Dinner.png';
import Cookie from '../images/Home/Snacks.png';
import Smoothie from '../images/Home/Smoothies.png';
import Ads from '../images/Home/Ads.png'
import Cheff1 from '../images/Home/Cheff1.png'
import Cheff2 from '../images/Home/Cheff2.png'

export default function Home({ favourites, addToFavourites, removeFromFavourites }) {
    const [categories, setCategories] = useState([])
    const allCategories = ['breakfast', 'lunch', 'dinner', 'snacks', 'smoothies'];

    const categoryDisplayNames = {
        'breakfast': 'Breakfast Delights',
        'lunch': 'Lunch Specials',
        'dinner': 'Dinner Inspirations',
        'snacks': 'Healthy Snacks',
        'smoothies': 'Refreshing Smoothies',
    };

    const heroSlidesData = RecipesData;

    useEffect(() => {
        const fetchData = () => {
            fetch('http://127.0.0.1:8000/categories/list').then(res => {
                return res.json()
            }).then((res) => {
                console.log(res);
                setCategories(res.data.categories)

            }).catch((err) => {
                console.log(`failed on get data from api ${err}`);
            })
        }
        fetchData()
    }, [])

    Swiper.use([Pagination, Autoplay]);

    useEffect(() => {
        const swiper = new Swiper('.mySwiper', {
            slidesPerView: 3,
            spaceBetween: 30,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            breakpoints: {
                768: {
                    slidesPerView: 1,
                },
            },
        });

        return () => {
            if (swiper) {
                swiper.destroy(true, true);
            }
        };
    }, []);

    const instagramPostsData = [
        {
            likes: "44,686",
            date: "September 19",
        },
        {
            likes: "32,123",
            date: "October 01",
        },
        {
            likes: "50,000",
            date: "October 10",
        },
        {
            likes: "60,500",
            date: "November 05",
        },
    ];

    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackError, setFeedbackError] = useState('');

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        setFeedbackError('');
    };

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        setFeedbackMessage('');
        setFeedbackError('');

        if (rating === 0) {
            setFeedbackError('Please select a rating before submitting.');
            return;
        }

        console.log('Rating:', rating, 'Feedback:', feedbackText);
        setRating(0);
        setFeedbackText('');
        setFeedbackMessage('Thank you for your feedback!');
    };


    return (
        <div className="home-page">
            <section className="mt-4 container hero-section mb-custom-spacing">
                <div className="swiper mySwiper">
                    <div className="swiper-wrapper">
                        {heroSlidesData
                            .filter(slide => slide.tagBadge === "Hot Recipe")
                            .map((slide, index) => (
                                <Slide key={index} {...slide} />
                            ))}
                    </div>
                </div>
            </section>

            <section className="container mb-custom-spacing">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="mb-0">Categories</h3>
                    <Link to="/categories" className="btn btn-outline-secondary rounded-pill px-3 py-2">
                        View All Categories
                    </Link>
                </div>
                <div className="row text-center g-4">
                    {categories.map((cate) => <h1 className="text-danger" key={cate.id}>{cate.name}</h1>)}
                    {allCategories.map(category => (
                        <div className="col" key={category}>
                            <div className="category-wrapper">
                                <Link to={`/categories?category=${category}#${category}-title`} className="category-clickable-area">
                                    <img
                                        src={{
                                            'breakfast': Pancake,
                                            'lunch': Salad,
                                            'dinner': Spaghetti,
                                            'snacks': Cookie,
                                            'smoothies': Smoothie,
                                        }[category]}
                                        alt={categoryDisplayNames[category]}
                                        className="category-icon mb-2"
                                    />
                                    <div>{categoryDisplayNames[category]}</div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container mb-custom-spacing">
                <section className="container text-center mb-4">
                    <h2 className="fw-bold mb-3">Simple and tasty recipes</h2>
                    <p className="text-muted mb-5">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquat enim ad minim
                    </p>
                </section>
                <div className="row g-4">
                    {heroSlidesData
                        .filter(recipe => recipe.tagBadge === "Hot Recipe")
                        .slice(0, 9)
                        .map((recipe, index) => (
                            <div className="col-md-4" key={index}>
                                {index === 5 ? (
                                    <div className="card h-100 border-0 shadow-sm">
                                        <img
                                            src={Ads}
                                            alt="Advertisement"
                                            className="img-fluid rounded"
                                            style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                        />
                                    </div>
                                ) : (
                                    <RecipeCard {...recipe} favourites={favourites} addToFavourites={addToFavourites} removeFromFavourites={removeFromFavourites} />
                                )}
                            </div>
                        ))}
                </div>
            </section>

            <section
                className="container mb-custom-spacing"
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                }}
            >
                <div className="row align-items-center">
                    <div className="col-md-6 px-5 py-5">
                        <h2 className="fw-bold mb-3 display-5">
                            Everyone can be a <br /> chef in their own kitchen
                        </h2>
                        <p className="text-muted mb-4 fs-5">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                        </p>
                        <Link to="/about" className="btn btn-dark px-4 py-2 rounded-pill">Learn More</Link>
                    </div>

                    <div className="col-md-6 p-0">
                        <img
                            src={Cheff1}
                            alt="Chef"
                            className="img-fluid w-100"
                            style={{
                                objectFit: 'cover',
                                height: '100%',
                            }}
                        />
                    </div>
                </div>
            </section>

            <section className="container mb-custom-spacing">
                <div className="text-center mb-4">
                    <h2 className="fw-bold mb-3 display-5">
                        Check out @foodieland on Instagram
                    </h2>
                    <p className="text-muted mb-4 fs-5 mx-auto" style={{ maxWidth: '700px' }}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                    </p>
                </div>
                <div className="row g-4 justify-content-center">
                    {instagramPostsData.map((post, index) => (
                        <div className="col-lg-3 col-md-6 col-sm-10" key={index}>
                            <Post {...post} index={index} />
                        </div>
                    ))}
                </div>
                <div className="text-center mt-5">
                    <a href="#" className="btn btn-dark px-4 py-2 rounded-pill d-inline-flex align-items-center">
                        Visit Our Instagram <i className="bi bi-instagram ms-2"></i>
                    </a>
                </div>
            </section>

            <section
                className="container mb-custom-spacing"
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                }}
            >
                <div className="row align-items-stretch">
                    <div className="col-md-7 px-5 py-5 d-flex flex-column justify-content-center">
                        <div className="feedback-content-wrapper w-100">
                            <h2 className="fw-bold mb-3 display-5 text-dark-blue">Submit Your Feedback</h2>
                            <p className="text-muted mb-4 fs-5">
                                We'd love to hear your thoughts to improve our website!
                            </p>
                            <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                                <div className="mb-4">
                                    <label className="form-label d-block mb-3 text-dark-blue">
                                        Rate our website interface:
                                    </label>
                                    <div className="star-rating d-flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <i
                                                key={star}
                                                className={`bi ${star <= rating ? 'bi-star-fill' : 'bi-star'}`}
                                                onClick={() => handleRatingChange(star)}
                                                style={{
                                                    cursor: 'pointer',
                                                    fontSize: '2.5rem',
                                                    color: star <= rating ? '#ffc107' : '#dee2e6',
                                                    transition: 'transform 0.2s ease-in-out'
                                                }}
                                            ></i>
                                        ))}
                                    </div>
                                    {feedbackError && (
                                        <div className="text-danger mt-2">{feedbackError}</div>
                                    )}
                                </div>

                                {rating > 0 && (
                                    <div className="mb-4">
                                        <label htmlFor="feedbackText" className="form-label text-dark-blue">Your Feedback:</label>
                                        <textarea
                                            className="form-control"
                                            id="feedbackText"
                                            rows="5"
                                            placeholder="Write your feedback here (optional)..."
                                            value={feedbackText}
                                            onChange={(e) => setFeedbackText(e.target.value)}
                                        ></textarea>
                                    </div>
                                )}

                                <button type="submit" className="btn btn-outline-secondary rounded-pill px-4 py-2">
                                    Submit Feedback
                                </button>
                                {feedbackMessage && (
                                    <div className="text-success mt-3">{feedbackMessage}</div>
                                )}
                            </form>
                        </div>
                    </div>
                    <div className="col-md-5 p-0 d-flex align-items-end justify-content-center">
                        <img
                            src={Cheff2}
                            alt="Cheff2"
                            className="img-fluid"
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'contain',
                                marginBottom: '0',
                            }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
