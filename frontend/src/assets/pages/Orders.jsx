import React, { useState } from 'react';
import recipesData from '../data/Recipes.json';
import placeholderImage from '../images/RecipeDetail/RecipeNotFound.svg';
import '../css/Orders.css'
import { Link } from 'react-router-dom';

const statusTabs = [
    'Pending Confirmation',
    'Preparing Food',
    'Out for Delivery',
    'Delivered',
];

const getStatusInfo = (status) => {
    switch (status) {
        case 'Pending Confirmation':
            return { color: '#ff9800', icon: '⏳' };
        case 'Preparing Food':
            return { color: '#4caf50', icon: '🍳' };
        case 'Out for Delivery':
            return { color: '#2196f3', icon: '🚚' };
        case 'Delivered':
            return { color: '#00bcd4', icon: '✅' };
        default:
            return { color: '#757575', icon: '' };
    }
};

const getDietBadgeStyles = (dietItem) => {
    if (typeof dietItem !== 'string') {
        return { backgroundColor: '#e6f4ea', color: '#2c7a4b' };
    }
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
    return { backgroundColor: bgColor, color: textColor };
};

const Orders = ({ currentOrders, removeOrder }) => {
    const [activeTab, setActiveTab] = useState('Pending Confirmation');

    const filteredOrders = Array.isArray(currentOrders)
        ? currentOrders.filter(order => order.status === activeTab)
        : [];

    const groupedOrders = {};
    filteredOrders.forEach(order => {
        if (!groupedOrders[order.id]) {
            groupedOrders[order.id] = {
                id: order.id,
                orderDate: order.orderDate,
                items: [],
            };
        }
        groupedOrders[order.id].items.push(order);
    });

    const handleRemoveRecipe = (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            removeOrder(orderId);
        }
    };

    const handleRemoveWholeOrder = (orderId) => {
        if (window.confirm('Do you want to remove the entire order?')) {
            removeOrder(orderId);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-5">Your Orders</h2>

            <ul className="nav nav-tabs justify-content-between mb-4 custom-modern-tabs">
                {statusTabs.map(status => (
                    <li className="nav-item" key={status}>
                        <button
                            className={`nav-link ${activeTab === status ? 'active' : ''} custom-tab-button-modern`}
                            onClick={() => setActiveTab(status)}
                        >
                            {status}
                        </button>
                    </li>
                ))}
            </ul>

            {filteredOrders.length > 0 ? (
                <div className="row g-4">
                    {Object.values(groupedOrders).map((group) => (
                        <div key={group.id} className="mb-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">
                                    Order #{group.id} – {group.orderDate ? new Date(group.orderDate).toLocaleDateString() : 'Unknown date'}
                                </h5>
                            </div>

                            {group.items.map(order => {
                                const recipe = recipesData.find(r => r.title === order.name);
                                const displayImage = order.image || (recipe ? recipe.image : placeholderImage);
                                const displayDiet = order.diet && Array.isArray(order.diet) && order.diet.length > 0
                                    ? order.diet
                                    : (recipe ? recipe.diet : []);
                                const statusInfo = getStatusInfo(order.status);
                                const price = parseFloat(recipe?.price || 0);
                                const quantity = order.quantity || 1;
                                const totalPrice = price * quantity;

                                return (
                                    <div className="d-flex flex-column flex-md-row p-4 align-items-center bg-white rounded-3 shadow-sm hover-scale-effect mb-3" key={order.name}>
                                        <img
                                            src={displayImage}
                                            alt={order.name}
                                            className="rounded-3 me-md-4 mb-3 mb-md-0"
                                            style={{
                                                width: '150px',
                                                height: '150px',
                                                objectFit: 'cover',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <div className="flex-grow-1 text-md-start">
                                            <h5 className="fw-bold mb-2 fs-5">{order.name}</h5>
                                            <p className="text-muted mb-2">
                                                Quantity: {quantity}{' '}
                                                <span className="ms-3">
                                                    Total Price: <span className="text-danger">${totalPrice.toFixed(2)}</span>
                                                </span>
                                            </p>
                                            {displayDiet.length > 0 && (
                                                <div className="d-flex flex-wrap gap-1 mb-2">
                                                    {displayDiet.map((dietItem, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="badge rounded-pill px-3 py-1"
                                                            style={getDietBadgeStyles(dietItem)}
                                                        >
                                                            {dietItem}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="mb-2 text-muted">
                                                <span className="me-1" style={{ color: statusInfo.color }}>{statusInfo.icon}</span>
                                                <span style={{ color: statusInfo.color }}>{order.status}</span>
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column flex-md-row gap-2 mt-3 mt-md-0">
                                            <button
                                                className="btn btn-danger rounded-pill px-4 py-2 d-flex align-items-center justify-content-center gap-1"
                                                onClick={() => handleRemoveRecipe(order.id)}
                                            >
                                                <i className="bi bi-x-circle"></i> Remove
                                            </button>
                                            <Link
                                                to={`/recipe/${encodeURIComponent(order.name)}`}
                                                className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center justify-content-center gap-1"
                                            >
                                                <i className="bi bi-eye"></i> View Recipe
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className='d-flex justify-content-between align-items-center'>
                                <p className="text-muted mb-0">
                                    <span className='fw-bold fs-6'>Total Order Price</span>:{' '}
                                    <span className="fw-bold fs-5 text-danger">
                                        ${group.items.reduce((sum, item) => {
                                            const recipe = recipesData.find(r => r.title === item.name);
                                            const price = parseFloat(recipe?.price || 0);
                                            const quantity = item.quantity || 1;
                                            return sum + price * quantity;
                                        }, 0).toFixed(2)}
                                    </span>
                                </p>

                                <button
                                    className="btn btn-outline-danger btn-md rounded-pill mt-3"
                                    onClick={() => handleRemoveWholeOrder(group.id)}
                                >
                                    <i className="bi bi-trash me-1"></i> Remove Order
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            ) : (
                <div className="text-center fs-6 text-muted mt-5">
                    No orders in this category.
                    {activeTab === 'Pending Confirmation' && (
                        <>
                            {' '}
                            <Link
                                to="/categories"
                                style={{
                                    textDecoration: 'underline',
                                    color: '#36B0C2',
                                    transition: 'color 0.3s ease-in-out',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(43 137 151)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#36B0C2'}
                            >
                                Go to Categories
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Orders;
