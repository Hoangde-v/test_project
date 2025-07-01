import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './assets/pages/Home.jsx';
import Header from './assets/components/Header.jsx';
import Footer from './assets/components/Footer.jsx';
import Contact from './assets/pages/Contact.jsx';
import About from './assets/pages/AboutUs.jsx';
import RecipeDetailComponent from './assets/pages/RecipeDetail.jsx';
import Categories from './assets/pages/Categories.jsx';
import FavouritePage from './assets/pages/Favourite.jsx';
import Login from './assets/pages/Login.jsx';
import Signup from './assets/pages/SignUp.jsx';
import AdminDB from './assets/pages/AdminDB.jsx';
import Orders from './assets/pages/Orders.jsx';
import recipesData from './assets/data/Recipes.json';

function NotFound() {
  return <h1 className="text-center font-bold my-5">404 - NotFound</h1>;
}

function App() {
  const location = useLocation();

  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem('nutriplanner-favourites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nutriplanner-favourites', JSON.stringify(favourites));
  }, [favourites]);

  const addToFavourites = (recipe) => {
    setFavourites(prev =>
      prev.some(r => r.title === recipe.title) ? prev : [...prev, recipe]
    );
  };

  const removeFromFavourites = (recipe) => {
    setFavourites(prev => prev.filter(r => r.title !== recipe.title));
  };

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('nutriplanner-orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nutriplanner-orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (newRecipe) => {
    setOrders(prev => {
      const today = new Date().toISOString().split('T')[0];
      const newId = prev.length ? Math.max(...prev.map(o => o.id)) + 1 : 1;
      const details = recipesData.find(r => r.title === newRecipe.name);

      return [
        ...prev,
        {
          id: newId,
          name: newRecipe.name,
          status: 'Pending Confirmation',
          image: newRecipe.image || details?.image || 'https://placehold.co/200x150',
          diet: newRecipe.diet || details?.diet || [],
          dietClass: newRecipe.dietClass || details?.dietClass || 'bg-secondary',
          quantity: newRecipe.quantity || 1,
          orderDate: today,
        }
      ];
    });
  };

  const removeOrder = (orderIdToRemove) => {
    setOrders(prev => prev.filter(order => order.id !== orderIdToRemove));
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header favourites={favourites} />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home favourites={favourites} addToFavourites={addToFavourites} removeFromFavourites={removeFromFavourites} addToOrders={addOrder} />} />
          <Route path="/recipe/:title" element={<RecipeDetailComponent favourites={favourites} addToFavourites={addToFavourites} removeFromFavourites={removeFromFavourites} addToOrders={addOrder} />} />
          <Route path="/contact" element={<Contact favourites={favourites} addToFavourites={addToFavourites} removeFromFavourites={removeFromFavourites} addToOrders={addOrder} />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories favourites={favourites} addToFavourites={addToFavourites} removeFromFavourites={removeFromFavourites} addToOrders={addOrder} />} />
          <Route path="/favourite" element={<FavouritePage favourites={favourites} removeFromFavourites={removeFromFavourites} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminDB />} />
          <Route path="/orders" element={<Orders currentOrders={orders} removeOrder={removeOrder} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
