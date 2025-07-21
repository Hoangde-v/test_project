import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AdminAddNewDish = ({ dishes, onSaveDish }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [currentDish, setCurrentDish] = useState({
        id: null,
        title: '',
        image: '',
        diet: [],
        price: '',
        description: '',
        ingredients: [],
    });

    const [tempIngredientsString, setTempIngredientsString] = useState('');

    const isEditing = id !== undefined;

    useEffect(() => {
        if (isEditing) {
            const dishToEdit = dishes.find(d => d.id === parseInt(id));
            if (dishToEdit) {
                setCurrentDish(dishToEdit);
                setTempIngredientsString(dishToEdit.ingredients.join(', '));
            } else {
                alert('Dish not found for editing!');
                navigate('/admin/dishes');
            }
        } else {
            setCurrentDish({
                id: null,
                title: '',
                image: '',
                diet: [],
                price: '',
                description: '',
                ingredients: [],
            });
            setTempIngredientsString('');
        }
    }, [id, isEditing, dishes, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentDish(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTempIngredientsChange = (e) => {
        setTempIngredientsString(e.target.value);
    };

    const handleArrayChange = (e) => {
        const { name, value } = e.target;
        const arrayValue = value.split(',').map(item => item.trim()).filter(item => item !== '');
        setCurrentDish(prev => ({
            ...prev,
            [name]: arrayValue
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const parsedIngredients = tempIngredientsString.split(',').map(item => item.trim()).filter(item => item !== '');

        if (!currentDish.title) {
            alert('Dish title cannot be empty!');
            return;
        }

        const dishToSave = {
            ...currentDish,
            ingredients: parsedIngredients,
        };

        onSaveDish(dishToSave);
        navigate('/admin/dishes');
    };

    const handleCancel = () => {
        navigate('/admin/dishes');
    };

    return (
        <div className="container py-5" style={{ maxWidth: 1200 }}>
            <h2 className="fw-bold mb-5 fs-1 text-gray-800">{isEditing ? 'Edit Dish' : 'Add New Dish'}</h2>

            <section className="p-4 bg-white rounded-3 shadow-lg">
                <h3 className="text-2xl font-semibold mb-6 text-gray-700">Dish Details</h3>
                <form onSubmit={handleSubmit} className="row g-4">
                    <div className="col-md-6">
                        <label htmlFor="title" className="form-label text-uppercase fw-bold">Title:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={currentDish.title}
                            onChange={handleChange}
                            className="form-control rounded-pill px-4 py-2"
                            placeholder="Dish name"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="image" className="form-label text-uppercase fw-bold">Image URL:</label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            value={currentDish.image}
                            onChange={handleChange}
                            className="form-control rounded-pill px-4 py-2"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="diet" className="form-label text-uppercase fw-bold">Diet (comma-separated):</label>
                        <input
                            type="text"
                            id="diet"
                            name="diet"
                            value={currentDish.diet.join(', ')}
                            onChange={handleArrayChange}
                            className="form-control rounded-pill px-4 py-2"
                            placeholder="e.g., Vegan, Gluten-Free"
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="price" className="form-label text-uppercase fw-bold">Price:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={currentDish.price}
                            onChange={handleChange}
                            className="form-control rounded-pill px-4 py-2"
                            placeholder="e.g., 10.99"
                            step="0.01"
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="description" className="form-label text-uppercase fw-bold">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={currentDish.description}
                            onChange={handleChange}
                            rows="3"
                            className="form-control rounded-3 px-4 py-2"
                            placeholder="Brief description of the dish"
                        ></textarea>
                    </div>
                    <div className="col-12">
                        <label htmlFor="ingredients" className="form-label text-uppercase fw-bold">Ingredients (comma-separated):</label>
                        <textarea
                            id="ingredients"
                            name="ingredients"
                            value={tempIngredientsString}
                            onChange={handleTempIngredientsChange}
                            rows="3"
                            className="form-control rounded-3 px-4 py-2"
                            placeholder="e.g., Fresh Tomatoes, Organic Spinach, 1/2 cup Sugar"
                        ></textarea>
                    </div>
                    <div className="col-12 d-flex justify-content-end gap-3 mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            {isEditing ? 'Update Dish' : 'Add Dish'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn btn-outline-secondary rounded-pill px-5 py-3 fw-bold shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default AdminAddNewDish;
