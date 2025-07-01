import React, { useState, useEffect } from 'react';
import recipesData from '../data/Recipes.json';
import RecipeCard from '../components/RecipeCard.jsx';

const recentOrdersTest = [
    {
        id: 1,
        customer: "Nguyễn Văn A",
        time: "2025-07-01 09:30",
        status: "Processing",
    },
    {
        id: 2,
        customer: "Trần Thị B",
        time: "2025-07-01 08:45",
        status: "Giao hàng",
    },
    {
        id: 3,
        customer: "Lê Văn C",
        time: "2025-06-30 17:20",
        status: "Completed",
    },
    {
        id: 4,
        customer: "Phạm Thị D",
        time: "2025-06-30 16:10",
        status: "Cancelled",
    },
];

const statusColor = {
    "Processing": "warning",
    "Giao hàng": "info",
    "Completed": "success",
    "Cancelled": "danger",
};



export default function AdminDashBoard({ favourites, addToFavourites, removeFromFavourites }) {
    return (
        <div className="container py-4" style={{ maxWidth: 1300 }}>
            <div className="mb-4">
                <h2 className="fw-bold" style={{ color: '#2c3e50' }}>Dashboard</h2>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="p-3 rounded-3  bg-white border d-flex flex-column">
                        <span className="text-muted" style={{ fontSize: 15 }}>Total customers</span>
                        <span className="fw-bold" style={{ fontSize: 24, color: '#36b0c2' }}>567,899</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="p-3 rounded-3  bg-white border d-flex flex-column">
                        <span className="text-muted" style={{ fontSize: 15 }}>Total revenue</span>
                        <span className="fw-bold" style={{ fontSize: 24, color: '#36b0c2' }}>$3,465 M</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="p-3 rounded-3  bg-white border d-flex flex-column">
                        <span className="text-muted" style={{ fontSize: 15 }}>Total orders</span>
                        <span className="fw-bold" style={{ fontSize: 24, color: '#36b0c2' }}>1,136 M</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="p-3 rounded-3  bg-white border d-flex flex-column">
                        <span className="text-muted" style={{ fontSize: 15 }}>Total returns</span>
                        <span className="fw-bold" style={{ fontSize: 24, color: '#36b0c2' }}>1,789</span>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="p-4 rounded-3  bg-white border">
                    <h5 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>Product sales</h5>
                    <div className="text-muted mt-3" style={{ fontSize: 16 }}>
                        
                    </div>
                </div>
            </div>

            <div className="row g-3 mt-4">
                <div className="col-12">
                    <div className="p-4 rounded-3 bg-white border">
                        <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Recent Orders</h5>
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Customer Name</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrdersTest.map(order => (
                                        <tr key={order.id}>
                                            <td>{order.customer}</td>
                                            <td>{order.time}</td>
                                            <td>
                                                <span className={`badge bg-${statusColor[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-outline-success me-2" disabled={order.status !== "Processing"}>
                                                    Confirm Order
                                                </button>
                                                <button className="btn btn-sm btn-outline-primary me-2">
                                                    Print Invoice
                                                </button>
                                                <button className="btn btn-sm btn-outline-info">
                                                    Track Shipment
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
