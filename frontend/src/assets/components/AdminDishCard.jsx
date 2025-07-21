import React from 'react';
import forkKnife from '../images/RecipeDetail/ForkKnife.png';
import '../css/RecipeCard.css';
import { Link } from 'react-router-dom';

const AdminDishCard = ({
    id,
    image,
    title,
    diet,
    price,
    onEdit,
    onDelete
}) => {
    return (
        <div className="card h-100 border-0 shadow-sm recipe-card text-decoration-none text-dark py-3">
            <div className="position-relative">
                <img src={image} className="card-img-top" alt={title} />
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

                <div className="d-flex justify-content-between mt-3">
                    <button
                        className="btn btn-outline-secondary rounded-pill px-3 py-2 flex-grow-1 me-2"
                        onClick={() => onEdit(id)}
                    >
                        <i className="bi bi-pencil me-1"></i> Edit
                    </button>
                    <button
                        className="btn btn-outline-danger rounded-pill px-3 py-2"
                        onClick={() => onDelete(id)}
                    >
                        <i className="bi bi-trash me-1"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDishCard;
