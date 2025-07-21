import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard.jsx';
import recipesData from '../data/Dishes.json';
import '../css/Categories.css';

export default function Categories({ favourites, addToFavourites, removeFromFavourites, addToOrders, cartItems, addToCart, removeFromCart }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [ingredientSearch, setIngredientSearch] = useState('');
    const [selectedDiet, setSelectedDiet] = useState('all');
    const [minCalories, setMinCalories] = useState('');
    const [maxCalories, setMaxCalories] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedAllergy, setSelectedAllergy] = useState('all');

    const [filteredRecipes, setFilteredRecipes] = useState(recipesData);

    const [showMoreFilters, setShowMoreFilters] = useState(false);

    const allCategories = ['breakfast', 'lunch', 'dinner', 'snacks', 'smoothies'];

    const categoryDisplayNames = {
        'breakfast': 'Breakfast Delights',
        'lunch': 'Lunch Specials',
        'dinner': 'Dinner Inspirations',
        'snacks': 'Healthy Snacks',
        'smoothies': 'Refreshing Smoothies',
    };

    const allAllergies = ['Gluten-Free', 'Dairy-Free', 'Nut-Free'];

    const location = useLocation();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [location.hash]);

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const lowercasedIngredientSearch = ingredientSearch.toLowerCase();

        const newFilteredRecipes = recipesData.filter(dish => {
            const matchesSearchTerm = lowercasedSearchTerm === '' ||
                dish.title.toLowerCase().includes(lowercasedSearchTerm);

            const matchesIngredient = lowercasedIngredientSearch === '' ||
                (dish.ingredients && dish.ingredients.some(ingredient =>
                    ingredient.toLowerCase().includes(lowercasedIngredientSearch)
                ));

            const matchesDiet = selectedDiet === 'all' ||
                (Array.isArray(dish.diet) && dish.diet.some(d => d.toLowerCase() === selectedDiet.toLowerCase()));

            const matchesCalories = (minCalories === '' || dish.calories >= parseInt(minCalories)) &&
                (maxCalories === '' || dish.calories <= parseInt(maxCalories));

            const matchesCategory = selectedCategory === 'all' ||
                dish.category.toLowerCase() === selectedCategory.toLowerCase();

            const matchesAllergy = selectedAllergy === 'all' ||
                (Array.isArray(dish.diet) && dish.diet.some(d => d.toLowerCase().includes(selectedAllergy.toLowerCase())));

            return matchesSearchTerm && matchesIngredient && matchesDiet && matchesCalories && matchesCategory && matchesAllergy;
        });
        setFilteredRecipes(newFilteredRecipes);

    }, [searchTerm, ingredientSearch, selectedDiet, minCalories, maxCalories, selectedCategory, selectedAllergy]);

    const handleSearchTermChange = (e) => setSearchTerm(e.target.value);
    const handleIngredientSearchChange = (e) => setIngredientSearch(e.target.value);
    const handleDietChange = (e) => setSelectedDiet(e.target.value);
    const handleMinCaloriesChange = (e) => setMinCalories(e.target.value);
    const handleMaxCaloriesChange = (e) => setMaxCalories(e.target.value);
    const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
    const handleAllergyChange = (e) => setSelectedAllergy(e.target.value);

    const getRecipesByCategory = (category) => {
        return filteredRecipes.filter(dish => dish.category === category);
    };

    const uniqueDiets = [...new Set(recipesData.flatMap(dish => dish.diet || []).filter(Boolean))];

    const toggleShowMoreFilters = () => {
        setShowMoreFilters(prev => !prev);
    };

    return (
        <div className="categories-page">
            <section className="container mb-5 mt-5 p-4 bg-light rounded-3 shadow-sm filter-section">
                <h3 className="mb-4">Search and Filter Dishes</h3>

                <div className="row g-4 align-items-end mb-4">
                    <div className="col-md-4">
                        <label htmlFor="keywordSearch" className="form-label">By Keyword</label>
                        <input
                            type="text"
                            className="form-control rounded-5 px-4 py-2"
                            id="keywordSearch"
                            placeholder="e.g. chicken, salad"
                            value={searchTerm}
                            onChange={handleSearchTermChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="ingredientSearch" className="form-label">By Ingredient</label>
                        <input
                            type="text"
                            className="form-control rounded-5 px-4 py-2"
                            id="ingredientSearch"
                            placeholder="e.g. rice, avocado, tomato"
                            value={ingredientSearch}
                            onChange={handleIngredientSearchChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="dietType" className="form-label">By Diet Type</label>
                        <select
                            className="form-select rounded-5 px-4 py-2"
                            id="dietType"
                            value={selectedDiet}
                            onChange={handleDietChange}
                        >
                            <option value="all">All</option>
                            {uniqueDiets.map((dietItem, index) => (
                                <option key={index} value={dietItem.toLowerCase()}>{dietItem}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={`filter-collapse-content ${showMoreFilters ? 'expanded' : 'collapsed'}`}>
                    <div className="row g-4 align-items-end">
                        <div className="col-md-6">
                            <label htmlFor="minCalories" className="form-label">Calories (Min)</label>
                            <input
                                type="number"
                                className="form-control rounded-5 px-4 py-2"
                                id="minCalories"
                                placeholder="From"
                                value={minCalories}
                                onChange={handleMinCaloriesChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="maxCalories" className="form-label">Calories (Max)</label>
                            <input
                                type="number"
                                className="form-control rounded-5 px-4 py-2"
                                id="maxCalories"
                                placeholder="To"
                                value={maxCalories}
                                onChange={handleMaxCaloriesChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="mealType" className="form-label">By Meal Type</label>
                            <select
                                className="form-select rounded-5 px-4 py-2"
                                id="mealType"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                            >
                                <option value="all">All</option>
                                {allCategories.map((category, index) => (
                                    <option key={index} value={category.toLowerCase()}>{categoryDisplayNames[category]}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="allergyType" className="form-label">By Allergy</label>
                            <select
                                className="form-select rounded-5 px-4 py-2"
                                id="allergyType"
                                value={selectedAllergy}
                                onChange={handleAllergyChange}
                            >
                                <option value="all">None</option>
                                {allAllergies.map((allergy, index) => (
                                    <option key={index} value={allergy.toLowerCase()}>{allergy}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button
                        className="btn btn-link text-decoration-none p-0 filter-toggle-button"
                        onClick={toggleShowMoreFilters}
                        aria-expanded={showMoreFilters}
                        aria-controls="filterCollapseContent"
                    >
                        <i className={`bi bi-chevron-down me-2 ${showMoreFilters ? 'rotate-up' : ''}`}></i>
                        {showMoreFilters ? 'Hide Filters' : 'Show More Filters'}
                    </button>
                </div>
            </section>

            <div className="container">
                {filteredRecipes.length > 0 ? (
                    <>
                        {allCategories.map(category => {
                            const recipesForCategory = getRecipesByCategory(category);
                            if (recipesForCategory.length > 0) {
                                const displayCategory = categoryDisplayNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
                                return (
                                    <section className="container mb-5" key={category}>
                                        <h3 className="mb-4" id={`${category}-title`}>{displayCategory}</h3>
                                        <div className="row g-4">
                                            {recipesForCategory.map((dish, index) => (
                                                <div className="col-md-3" key={index}>
                                                    <RecipeCard
                                                        {...dish}
                                                        favourites={favourites}
                                                        addToFavourites={addToFavourites}
                                                        removeFromFavourites={removeFromFavourites}
                                                        addToOrders={addToOrders}
                                                        cartItems={cartItems}
                                                        addToCart={addToCart}
                                                        removeFromCart={removeFromCart}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                );
                            }
                            return null;
                        })}
                    </>
                ) : (
                    <section className="container mb-5 text-center">
                        <p className="lead">No dishes found matching your search criteria.</p>
                    </section>
                )}
            </div>
        </div>
    );
}