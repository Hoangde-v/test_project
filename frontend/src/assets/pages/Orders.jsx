import React, { useState, useMemo, useCallback } from 'react';
import recipesData from '../data/Dishes.json';
import placeholderImage from '../images/RecipeDetail/RecipeNotFound.svg';
import '../css/Orders.css';
import { Link } from 'react-router-dom';

const STATUS_TABS = [
    'Pending Confirmation',
    'Preparing Food',
    'Out for Delivery',
    'Delivered',
];

const STATUS_INFO = {
    'Pending Confirmation': { color: '#ff9800', icon: '⏳' },
    'Preparing Food': { color: '#4caf50', icon: '🍳' },
    'Out for Delivery': { color: '#2196f3', icon: '🚚' },
    'Delivered': { color: '#00bcd4', icon: '✅' },
};

const DIET_COLOR_MAP = {
    vegan: ['#e6f4ea', '#2c7a4b'],
    keto: ['#f3e8fd', '#7e57c2'],
    'gluten-free': ['#fff4e5', '#ef6c00'],
    paleo: ['#e1f5fe', '#0277bd'],
    'low-carb': ['#fdeaea', '#c62828'],
    vegetarian: ['#e7fbe9', '#388e3c'],
    'dairy-free': ['#f1f8e9', '#689f38'],
    whole30: ['#e3f2fd', '#1565c0'],
};

const getStatusInfo = (status) => STATUS_INFO[status] || { color: '#757575', icon: '' };

const getDietBadgeStyles = (dietItem) => {
    if (typeof dietItem !== 'string') {
        return { backgroundColor: '#e6f4ea', color: '#2c7a4b' };
    }
    const normalized = dietItem.toLowerCase().replace(/\s+/g, '-');
    const [bgColor, textColor] = DIET_COLOR_MAP[normalized] || ['#e0f7fa', '#00796b'];
    return { backgroundColor: bgColor, color: textColor };
};

const Orders = ({ currentOrders, removeOrder, setTotalReturns }) => {
    const [activeTab, setActiveTab] = useState('Pending Confirmation');

    const groupedOrders = useMemo(() => {
        if (!Array.isArray(currentOrders)) {
            return {};
        }

        const filtered = currentOrders.filter(order => order.status === activeTab);

        return filtered.reduce((acc, order) => {
            if (!acc[order.id]) {
                acc[order.id] = {
                    id: order.id,
                    orderDate: order.orderDate,
                    items: [],
                };
            }
            acc[order.id].items.push(order);
            return acc;
        }, {});
    }, [currentOrders, activeTab]);

    const hasOrdersInActiveTab = useMemo(() => {
        return Object.keys(groupedOrders).length > 0;
    }, [groupedOrders]);

    const handleRemoveRecipe = useCallback((orderId, orderName, orderStatus) => {
        if (window.confirm('Are you sure you want to cancel this item from the order?')) {
            removeOrder(orderId, orderName);
            if (orderStatus === 'Preparing Food' && typeof setTotalReturns === 'function') {
                setTotalReturns(prev => prev + 1);
            }
        }
    }, [removeOrder, setTotalReturns]);

    const handleRemoveWholeOrder = useCallback((orderId) => {
        if (window.confirm('Are you sure you want to cancel the entire order?')) {
            removeOrder(orderId);
        }
    }, [removeOrder]);

    const renderOrderItem = useCallback((order) => {
        const dish = recipesData.find(r => r.title === order.name);
        const displayImage = order.image || (dish ? dish.image : placeholderImage);
        const displayDiet = Array.isArray(order.diet) && order.diet.length > 0
            ? order.diet
            : (dish ? dish.diet : []);
        const statusInfo = getStatusInfo(order.status);
        const price = parseFloat(dish?.price || 0);
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
                        onClick={() => handleRemoveRecipe(order.id, order.name, order.status)}
                    >
                        <i className="bi bi-x-circle"></i> Remove Item
                    </button>
                    <Link
                        to={`/dish/${encodeURIComponent(order.name)}`}
                        className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center justify-content-center gap-1"
                    >
                        <i className="bi bi-eye"></i> View Dish
                    </Link>
                </div>
            </div>
        );
    }, [handleRemoveRecipe]);

    const calculateGroupTotalPrice = useCallback((items) => {
        return items.reduce((sum, item) => {
            const dish = recipesData.find(r => r.title === item.name);
            const price = parseFloat(dish?.price || 0);
            const quantity = item.quantity || 1;
            return sum + price * quantity;
        }, 0).toFixed(2);
    }, []);

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-5">Your Orders</h2>

            <ul className="nav nav-tabs justify-content-between mb-4 custom-modern-tabs">
                {STATUS_TABS.map(status => (
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

            {hasOrdersInActiveTab ? (
                <div className="row g-4">
                    {Object.values(groupedOrders).map((group) => (
                        <div key={group.id} className="mb-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">
                                    Order #{group.id} – {group.orderDate ? new Date(group.orderDate).toLocaleDateString() : 'Unknown date'}
                                </h5>
                            </div>

                            {group.items.map(renderOrderItem)}

                            <div className='d-flex justify-content-between align-items-center mt-4 pt-3 border-top'>
                                <p className="text-muted mb-0">
                                    <span className='fw-bold fs-6'>Total Order Price</span>:{' '}
                                    <span className="fw-bold fs-5 text-danger">
                                        ${calculateGroupTotalPrice(group.items)}
                                    </span>
                                </p>

                                <button
                                    className="btn btn-outline-danger btn-md rounded-pill"
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
