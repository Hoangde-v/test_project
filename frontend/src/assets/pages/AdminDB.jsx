import React, { useMemo } from 'react';
import recipesData from '../data/Recipes.json';
import RecipeCard from '../components/RecipeCard.jsx';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminDashBoard({ orders = [], setOrders, totalReturns = 0, setTotalReturns }) {
    const pendingOrders = orders.filter(order => order.status === "Pending Confirmation");

    const confirmedOrders = useMemo(
        () => orders.filter(order =>
            order.status === "Preparing Food" ||
            order.status === "Out for Delivery" ||
            order.status === "Delivered"
        ),
        [orders]
    );

    const totalConfirmedOrderIds = useMemo(() => {
        const ids = new Set();
        confirmedOrders.forEach(order => ids.add(order.id));
        return ids.size;
    }, [confirmedOrders]);

    const totalRevenue = useMemo(() => {
        return confirmedOrders.reduce((sum, order) => {
            const price = parseFloat(order.price || 0);
            const quantity = order.quantity || 1;
            return sum + price * quantity;
        }, 0);
    }, [confirmedOrders]);

    const handleConfirmOrder = (orderId) => {
        setOrders(prev =>
            prev.map(order =>
                order.id === orderId
                    ? { ...order, status: "Preparing Food" }
                    : order
            )
        );
    };

    // Tính doanh thu từng tháng trong năm hiện tại
    const monthlyRevenue = Array(12).fill(0);
    orders.forEach(order => {
        if (
            order.status === "Preparing Food" ||
            order.status === "Out for Delivery" ||
            order.status === "Delivered"
        ) {
            const date = new Date(order.orderDate);
            if (date.getFullYear() === new Date().getFullYear()) {
                const month = date.getMonth(); // 0-11
                monthlyRevenue[month] += (parseFloat(order.price || 0) * (order.quantity || 1));
            }
        }
    });

    const monthLabels = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const barData = {
        labels: monthLabels,
        datasets: [
            {
                label: 'Revenue',
                data: monthlyRevenue,
                backgroundColor: '#36b0c2',
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: value => '$' + value.toLocaleString(),
                },
            },
        },
    };

    // Tính doanh thu hôm nay và tuần này
    const now = new Date();
    const todayStr = now.toLocaleDateString();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Chủ nhật đầu tuần

    let revenueToday = 0;
    let revenueThisWeek = 0;

    orders.forEach(order => {
        if (
            order.status === "Preparing Food" ||
            order.status === "Out for Delivery" ||
            order.status === "Delivered"
        ) {
            const date = new Date(order.orderDate);
            const orderRevenue = parseFloat(order.price || 0) * (order.quantity || 1);

            // Doanh thu hôm nay
            if (date.toLocaleDateString() === todayStr) {
                revenueToday += orderRevenue;
            }
            // Doanh thu tuần này
            if (date >= startOfWeek && date <= now) {
                revenueThisWeek += orderRevenue;
            }
        }
    });

    // Tính doanh thu năm hiện tại
    let revenueThisYear = 0;
    orders.forEach(order => {
        if (
            order.status === "Preparing Food" ||
            order.status === "Out for Delivery" ||
            order.status === "Delivered"
        ) {
            const date = new Date(order.orderDate);
            if (date.getFullYear() === now.getFullYear()) {
                revenueThisYear += parseFloat(order.price || 0) * (order.quantity || 1);
            }
        }
    });

    return (
        <div className="container py-4" style={{ maxWidth: 1200 }}>
            <div className="mb-4">
                <h2 className="fw-bold" style={{ color: '#2c3e50' }}>Dashboard</h2>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="p-3 rounded-3 bg-white border d-flex flex-column">
                        <span className="text-muted" style={{ fontSize: 15 }}>Total customers</span>
                        <span className="fw-bold" style={{ fontSize: 24, color: '#36b0c2' }}>567,899</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="p-3 rounded-3 bg-white border d-flex flex-column">
                        <span className="text-muted" style={{ fontSize: 15 }}>Total revenue</span>
                        <span className="fw-bold" style={{ fontSize: 24, color: '#36b0c2' }}>
                            ${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="p-3 rounded-3 bg-white border d-flex flex-column">
                        <span className="text-muted" style={{ fontSize: 15 }}>Total orders</span>
                        <span className="fw-bold" style={{ fontSize: 24, color: '#36b0c2' }}>
                            {totalConfirmedOrderIds}
                        </span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="p-3 rounded-3 bg-white border d-flex flex-column">
                        <span className="text-muted" style={{ fontSize: 15 }}>Total returns</span>
                        <span className="fw-bold" style={{ fontSize: 24, color: '#36b0c2' }}>
                            {totalReturns.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="row g-3">
                    <div className="col-lg-8">
                        <div className="p-4 rounded-3 bg-white border h-100">
                            <h5 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>Income this month</h5>
                            <div className="mt-3 w-100" style={{ height: 300 }}>
                                <Line data={barData} options={barOptions} />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 d-flex flex-column gap-3">
                        <div className="p-4 rounded-3 bg-white border flex-fill">
                            <span className="text-muted" style={{ fontSize: 20 }}>Daily</span>
                            <div className="fw-bold" style={{ fontSize: 35, color: '#36b0c2' }}>
                                ${revenueToday.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div className="p-4 rounded-3 bg-white border flex-fill">
                            <span className="text-muted" style={{ fontSize: 20 }}>Weekly</span>
                            <div className="fw-bold" style={{ fontSize: 35, color: '#36b0c2' }}>
                                ${revenueThisWeek.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div className="p-4 rounded-3 bg-white border flex-fill">
                            <span className="text-muted" style={{ fontSize: 20 }}>Yearly</span>
                            <div className="fw-bold" style={{ fontSize: 35, color: '#36b0c2' }}>
                                ${revenueThisYear.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="p-4 rounded-3 bg-white border">
                    <h5 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>Most Ordered Items</h5>
                    <div className="row mt-3">
                        {
                            (() => {
                                const orderCountMap = {};
                                orders.forEach(order => {
                                    if (order.name) {
                                        orderCountMap[order.name] = (orderCountMap[order.name] || 0) + (order.quantity || 1);
                                    }
                                });
                                const itemsWithCount = recipesData
                                    .map(recipe => ({
                                        ...recipe,
                                        orderCount: orderCountMap[recipe.title] || 0
                                    }))
                                    .sort((a, b) => b.orderCount - a.orderCount)
                                    .slice(0, 3);

                                return itemsWithCount.map(recipe => (
                                    <div className="col-md-4 mb-3" key={recipe.id}>
                                        <div className="card rounded-3 h-100 shadow-sm">
                                            <img
                                                src={recipe.image}
                                                className="card-img-top"
                                                alt={recipe.title}
                                                style={{ height: 160, objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                                            />
                                            <div className="card-body d-flex flex-column">
                                                <h6 className="card-title fw-bold mb-2" style={{ color: '#36b0c2' }}>{recipe.title}</h6>
                                                <div className="mt-auto">
                                                    <span className="badge bg-primary text-light">
                                                        <i className="bi bi-bag-fill me-1"></i>
                                                        {recipe.orderCount} Orders
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ));
                            })()
                        }
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
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Order Date</th>
                                        <th>Status</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center text-muted py-4">
                                                No orders found.
                                            </td>
                                        </tr>
                                    )}
                                    {[...orders]
                                        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 10)
                                        .map(order => (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.customer || "Unknown"}</td>
                                                <td>{order.orderDate ? new Date(order.orderDate).toLocaleString() : "N/A"}</td>
                                                <td>
                                                    <span className={`badge bg-${order.status === "Pending Confirmation" ? "warning" : order.status === "Preparing Food" ? "info" : order.status === "Out for Delivery" ? "primary" : "success"}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="text-end" style={{ minWidth: 220 }}>
                                                    <button
                                                        className="btn btn-sm btn-outline-success me-2"
                                                        disabled={order.status !== "Pending Confirmation"}
                                                        style={{ visibility: order.status === "Pending Confirmation" ? "visible" : "hidden" }}
                                                        onClick={() => handleConfirmOrder(order.id)}
                                                    >
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
