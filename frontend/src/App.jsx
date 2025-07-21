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
import AdminDashboard from './assets/pages/AdminDashboard.jsx';
import Orders from './assets/pages/Orders.jsx';
import Cart from './assets/pages/Cart.jsx';
import recipesData from './assets/data/Recipes.json';
import ProtectedRoute from './assets/components/ProtectedRoute.jsx';
import AdminDishManagement from './assets/pages/AdminDishManagement.jsx';
import AdminAddNewDish from './assets/pages/AdminAddNewDish.jsx';

function NotFound() {
  return <h1 className="text-center font-bold my-5">404 - Not Found</h1>;
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
      const newId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const details = recipesData.find(r => r.title === newRecipe.name) || {};
      return [
        ...prev,
        {
          id: newId,
          name: newRecipe.name,
          status: 'Pending Confirmation',
          image: newRecipe.image || details.image || 'https://placehold.co/200x150',
          diet: newRecipe.diet || details.diet || [],
          dietClass: newRecipe.dietClass || details.dietClass || 'bg-secondary',
          quantity: newRecipe.quantity || 1,
          price: newRecipe.price ?? details.price ?? 0,
          orderDate: Date.now(),
        }
      ];
    });
  };

  const removeOrder = (orderIdToRemove, itemName = null) => {
    setOrders(prev => {
      if (itemName) {
        return prev.filter(order => !(order.id === orderIdToRemove && order.name === itemName));
      } else {
        return prev.filter(order => order.id !== orderIdToRemove);
      }
    });
  };

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('nutriplanner-cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('nutriplanner-cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (recipe) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.title === recipe.title);

      if (existingItem) {
        return prev.map(item =>
          item.title === recipe.title
            ? { ...item, quantity: item.quantity + (recipe.quantity || 1) }
            : item
        );
      }

      return [...prev, { ...recipe, quantity: recipe.quantity || 1 }];
    });
  };

  const removeFromCart = (recipeToRemove) => {
    setCartItems(prev => prev.filter(item => item.title !== recipeToRemove.title));
  };

  const handlePlaceOrderFromCart = (ordersToPlace) => {
    if (!Array.isArray(ordersToPlace)) return;

    const sharedOrderId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const newOrders = ordersToPlace.map(item => ({
      id: sharedOrderId,
      name: item.name,
      image: item.image,
      diet: item.diet,
      price: item.price,
      quantity: item.quantity,
      status: 'Pending Confirmation',
      orderDate: Date.now(),
    }));

    setOrders(prevOrders => [...newOrders, ...prevOrders]);

    ordersToPlace.forEach(item => {
      removeFromCart({ title: item.name });
    });
  };

  const [totalReturns, setTotalReturns] = useState(() => {
    const saved = localStorage.getItem('nutriplanner-totalReturns');
    return saved ? Number(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('nutriplanner-totalReturns', totalReturns);
  }, [totalReturns]);

  const [dishes, setDishes] = useState(() => {
    const savedDishes = localStorage.getItem('nutriplanner-admin-dishes');
    return savedDishes ? JSON.parse(savedDishes) : recipesData.map((dish, index) => ({
      id: index + 1,
      title: dish.title,
      image: dish.image,
      diet: dish.diet,
      price: dish.price,
      description: dish.description,
      ingredients: dish.ingredients,
    }));
  });

  useEffect(() => {
    localStorage.setItem('nutriplanner-admin-dishes', JSON.stringify(dishes));
  }, [dishes]);

  const handleSaveDish = (dishToSave) => {
    setDishes(prevDishes => {
      if (dishToSave.id) {
        return prevDishes.map(d => d.id === dishToSave.id ? dishToSave : d);
      } else {
        const newId = prevDishes.length > 0 ? Math.max(...prevDishes.map(d => d.id)) + 1 : 1;
        return [...prevDishes, { ...dishToSave, id: newId }];
      }
    });
  };

  const handleDeleteDish = (idToDelete) => {
    setDishes(prevDishes => prevDishes.filter(dish => dish.id !== idToDelete));
  };


  return (
    <div className="d-flex flex-column min-vh-100">
      <Header favourites={favourites} cartItemCount={cartItems.length} />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home favourites={favourites} addToFavourites={addToFavourites} removeFromFavourites={removeFromFavourites} addToOrders={addOrder} cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} />} />
          <Route path="/recipe/:title" element={<RecipeDetailComponent favourites={favourites} addToFavourites={addToFavourites} removeFromFavourites={removeFromFavourites} addToOrders={addOrder} cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} />} />
          <Route path="/contact" element={<Contact favourites={favourites} addToFavourites={addToFavourites} removeFromFavourites={removeFromFavourites} addToOrders={addOrder} cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories favourites={favourites} addToFavourites={addToFavourites} removeFromFavourites={removeFromFavourites} addToOrders={addOrder} cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} />} />
          <Route path="/favourite" element={<FavouritePage favourites={favourites} removeFromFavourites={removeFromFavourites} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard orders={orders} setOrders={setOrders} totalReturns={totalReturns} setTotalReturns={setTotalReturns} /></ProtectedRoute>} />
          <Route path="/orders" element={<Orders currentOrders={orders} removeOrder={removeOrder} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} onPlaceOrder={handlePlaceOrderFromCart} />} />
          <Route path="/admin/dishes" element={<ProtectedRoute allowedRoles={['admin']}><AdminDishManagement dishes={dishes} handleDelete={handleDeleteDish} /></ProtectedRoute>} />
          <Route path="/admin/dishes/add" element={<ProtectedRoute allowedRoles={['admin']}><AdminAddNewDish dishes={dishes} onSaveDish={handleSaveDish} /></ProtectedRoute>} />
          <Route path="/admin/dishes/edit/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminAddNewDish dishes={dishes} onSaveDish={handleSaveDish} /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
