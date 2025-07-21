import React, { useState, useEffect } from 'react';
import Chef from '../images/Contact/Chef.svg';
import SaladBg from '../images/Contact/SaladBg.png';
import recipesData from '../data/Dishes.json';
import RecipeCard from '../components/RecipeCard.jsx';

export default function ContactPage({ favourites, addToFavourites, removeFromFavourites, addToOrders, cartItems, addToCart, removeFromCart }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [enquiryType, setEnquiryType] = useState('Advertising');
    const [message, setMessage] = useState('');

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [subjectError, setSubjectError] = useState('');
    const [messageError, setMessageError] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');

    const [subscribeEmail, setSubscribeEmail] = useState('');
    const [subscribeEmailError, setSubscribeEmailError] = useState('');
    const [subscribeMessage, setSubscribeMessage] = useState('');

    const [similarRecipes, setSimilarRecipes] = useState([]);

    useEffect(() => {
        const randomRecipes = recipesData.sort(() => 0.5 - Math.random()).slice(0, 4);
        setSimilarRecipes(randomRecipes);
    }, []);

    const validateContactForm = () => {
        let isValid = true;

        if (!name.trim()) {
            setNameError('Name is required.');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!email.trim()) {
            setEmailError('Email address is required.');
            isValid = false;
        } else if (!email.includes('@')) {
            setEmailError('Email address is invalid.');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Email address is invalid.');
            isValid = false;
        }
        else {
            setEmailError('');
        }

        if (!subject.trim()) {
            setSubjectError('Subject is required.');
            isValid = false;
        } else {
            setSubjectError('');
        }

        if (!message.trim()) {
            setMessageError('Message is required.');
            isValid = false;
        } else {
            setMessageError('');
        }

        return isValid;
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setSubmitMessage('');

        if (validateContactForm()) {
            console.log('Form submitted successfully:', { name, email, subject, enquiryType, message });
            setSubmitMessage('Your message has been sent successfully!');
            setName('');
            setEmail('');
            setSubject('');
            setEnquiryType('Advertising');
            setMessage('');
        }
    };

    const handleSubscribeSubmit = (e) => {
        e.preventDefault();
        setSubscribeMessage('');
        let isValid = true;

        if (!subscribeEmail.trim()) {
            setSubscribeEmailError('Email address is required.');
            isValid = false;
        } else if (!subscribeEmail.includes('@')) {
            setSubscribeEmailError('Email address is invalid.');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(subscribeEmail)) {
            setSubscribeEmailError('Email address is invalid.');
            isValid = false;
        } else {
            setSubscribeEmailError('');
        }

        if (isValid) {
            console.log('Subscription email submitted:', subscribeEmail);
            setSubscribeMessage('Thank you for subscribing!');
            setSubscribeEmail('');
        }
    };

    return (
        <div className="container py-5">
            <h1 className="text-center fw-bold mb-5 fs-1">Contact us</h1>
            <div className="row align-items-center mb-5 pb-5">
                <div className="col-md-4 text-center mb-4 mb-md-0">
                    <img
                        src={Chef}
                        alt="Chef"
                        className="img-fluid rounded"
                        style={{ maxHeight: '400px' }}
                    />
                </div>

                <div className="col-md-8">
                    <form onSubmit={handleContactSubmit} noValidate>
                        <div className="row g-3">
                            <div className="col-6">
                                <label htmlFor="name" className="form-label text-uppercase ">Name</label>
                                <input
                                    type="text"
                                    className={`form-control rounded-4 ${nameError ? 'is-invalid' : ''}`}
                                    style={{ height: "50px" }}
                                    placeholder="Enter your name..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {nameError && <div className="invalid-feedback">{nameError}</div>}
                            </div>
                            <div className="col-6">
                                <label htmlFor="email" className="form-label text-uppercase ">Email Address</label>
                                <input
                                    type="text"
                                    className={`form-control rounded-4 ${emailError ? 'is-invalid' : ''}`}
                                    style={{ height: "50px" }}
                                    placeholder="Your email address..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {emailError && <div className="invalid-feedback">{emailError}</div>}
                            </div>
                            <div className="col-6">
                                <label htmlFor="subject" className="form-label text-uppercase ">Subject</label>
                                <input
                                    type="text"
                                    className={`form-control rounded-4 ${subjectError ? 'is-invalid' : ''}`}
                                    style={{ height: "50px" }}
                                    placeholder="Enter subject..."
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                                {subjectError && <div className="invalid-feedback">{subjectError}</div>}
                            </div>
                            <div className="col-6">
                                <label htmlFor="type" className="form-label text-uppercase ">Enquiry Type</label>
                                <select
                                    className="form-select rounded-4"
                                    style={{ height: "50px" }}
                                    value={enquiryType}
                                    onChange={(e) => setEnquiryType(e.target.value)}
                                >
                                    <option>Advertising</option>
                                    <option>Partnership</option>
                                    <option>Support</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label htmlFor="message" className="form-label text-uppercase ">Messages</label>
                                <textarea
                                    className={`form-control rounded-4 ${messageError ? 'is-invalid' : ''}`}
                                    style={{ height: "230px" }}
                                    placeholder="Enter your messages..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                                {messageError && <div className="invalid-feedback">{messageError}</div>}
                            </div>
                            <div className="">
                                <button type="submit" className="btn btn-dark px-5 rounded-4 fw-semibold fs-6" style={{ height: "70px" }}>Submit</button>
                            </div>
                            {submitMessage && (
                                <div className={`mt-3 ${submitMessage.includes('successfully') ? 'text-success' : 'text-danger'}`}>
                                    {submitMessage}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            <div
                className="text-center text-white px-4 py-5 mt-5 mb-5"
                style={{
                    backgroundImage: `url(${SaladBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '250px',
                    borderRadius: '60px',
                }}
            >
                <h2 className="fw-bold mb-3 text-dark fs-1" style={{ paddingTop: "20px" }}>Deliciousness to your inbox</h2>
                <p className="text-black mb-4 text-center" style={{ marginLeft: "250px", marginRight: "250px", paddingBottom: "30px" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <form className="d-flex justify-content-center align-items-center gap-2 flex-wrap" style={{ maxWidth: "500px", margin: "0 auto", paddingBottom: "20px" }} onSubmit={handleSubscribeSubmit} noValidate>
                    <input
                        type="email"
                        className={`form-control rounded-4 px-4 py-3 ${subscribeEmailError ? 'is-invalid' : ''}`}
                        placeholder="Your email address..."
                        style={{ flex: 1, minWidth: "220px", background: "#fff", border: "none", height: "70px", boxShadow: "0 2px 8px #0001" }}
                        value={subscribeEmail}
                        onChange={(e) => setSubscribeEmail(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn btn-dark rounded-4 px-4 py-3 fw-semibold"
                        style={{ minWidth: "140px", boxShadow: "0 2px 8px #0001" }}
                    >
                        Subscribe
                    </button>
                    {subscribeEmailError && <div className="invalid-feedback d-block text-start" style={{ width: '100%' }}>{subscribeEmailError}</div>}
                    {subscribeMessage && (
                        <div className={`mt-3 ${subscribeMessage.includes('Thank you') ? 'text-success' : 'text-danger'} text-start`} style={{ width: '100%' }}>
                            {subscribeMessage}
                        </div>
                    )}
                </form>
            </div>

            <section className='container mt-7 mb-5'>
                <div className='d-flex justify-content-center mb-3'>
                    <h3 className="fw-bold mt-5">Check out the delicious dish</h3>
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
        </div>
    );
}
