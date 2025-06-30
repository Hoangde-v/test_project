import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { useLocation } from 'react-router-dom';


function NotFound() {
  return <h1 className='text-center font-bold my-5'> 404 - NotFound </h1>;
}

function App() {
  const location = useLocation();
  const [favourites, setFavourites] = useState(() => {
    const savedFavourites = localStorage.getItem('nutriplanner-favourites');
    return savedFavourites ? JSON.parse(savedFavourites) : [];
  });

  useEffect(() => {
    localStorage.setItem('nutriplanner-favourites', JSON.stringify(favourites));
  }, [favourites]);

  const addToFavourites = (recipeToAdd) => {
    setFavourites((prevFavourites) => {
      const isAlreadyAdded = prevFavourites.some(
        (favRecipe) => favRecipe.title === recipeToAdd.title
      );
      if (!isAlreadyAdded) {
        return [...prevFavourites, recipeToAdd];
      }
      return prevFavourites;
    });
  };

  const removeFromFavourites = (recipeToRemove) => {
    setFavourites((prevFavourites) =>
      prevFavourites.filter((favRecipe) => favRecipe.title !== recipeToRemove.title)
    );
  };

  return (
    <div className="App">
      <Header favourites={favourites} />
      <Routes>
        <Route path="/" element={<Home favourites={favourites} addToFavourites={addToFavourites} removeFromFavourites={removeFromFavourites} />} />
        <Route
          path="/recipe/:title"
          element={
            <RecipeDetailComponent
              favourites={favourites}
              addToFavourites={addToFavourites}
              removeFromFavourites={removeFromFavourites}
            />}
        />
        <Route path="/contact" element={<Contact favourites={favourites} addToFavourites={addToFavourites} removeFromFavourites={removeFromFavourites} />} />
        <Route path="/about" element={<About />} />
        <Route path="/categories" element={<Categories favourites={favourites} addToFavourites={addToFavourites} removeFromFavourites={removeFromFavourites} />} />
        <Route path="/favourite" element={<FavouritePage favourites={favourites} removeFromFavourites={removeFromFavourites} />} />
        <Route path="/login" element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
