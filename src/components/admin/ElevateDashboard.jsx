import React, { useState, useEffect } from 'react';
import { ShoppingBag, Users, IndianRupee, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { Link } from 'react-router-dom';

const ElevateDashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // 1. Fetch Orders (for revenue and count)
            const { data: orders, error: ordersError } = await supabase
                .from('elevate_orders')
                .select(`
                    amount, 
                    status, 
                    created_at, 
                    id, 
                    customer_info,
                    elevate_customers (name)
                `)
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;

            // 2. Fetch Customer Count
            const { count: customerCount, error: customerError } = await supabase
                .from('elevate_customers')
                .select('*', { count: 'exact', head: true });

            if (customerError) throw customerError;

            // Calculate Stats
            const paidOrders = orders.filter(o => o.status === 'paid' || o.status === 'completed' || o.status === 'dispatched');
            const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

            setStats({
                totalRevenue,
                totalOrders: orders.length,
                totalCustomers: customerCount || 0,
                recentOrders: orders.slice(0, 5) // Top 5 recent
            });

        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'status-paid';
            case 'completed': return 'status-paid';
            case 'pending': return 'status-pending';
            case 'cancelled': return 'status-cancelled';
            default: return 'status-pending';
        }
    };

    return (
        <div className="admin-page">
            <header className="admin-header">
                <div className="admin-title">
                    <h1>Dashboard</h1>
                    <p className="admin-subtitle">Overview of Elevate performance</p>
                </div>
                <button className="admin-btn admin-btn-secondary" onClick={fetchStats}>
                    <Clock size={16} />
                    Refresh
                </button>
            </header>

            {loading ? (
                <div className="loading-state">Loading dashboard...</div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <IndianRupee size={28} />
                            </div>
                            <div className="stat-info">
                                <h3>Total Revenue</h3>
                                <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <ShoppingBag size={28} />
                            </div>
                            <div className="stat-info">
                                <h3>Total Orders</h3>
                                <div className="stat-value">{stats.totalOrders}</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <Users size={28} />
                            </div>
                            <div className="stat-info">
                                <h3>Total Customers</h3>
                                <div className="stat-value">{stats.totalCustomers}</div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="admin-table-container">
                        <div className="admin-table-header">
                            <span className="admin-table-title">Recent Orders</span>
                            <Link to="/elevate-admin/orders" className="admin-btn admin-btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                                View All
                            </Link>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                                    stats.recentOrders.map(order => (
                                        <tr key={order.id}>
                                            <td style={{ fontFamily: 'monospace', opacity: 0.7 }}>{order.id.slice(0, 8)}...</td>
                                            <td>{order.elevate_customers?.name || order.customer_info?.fullName || 'Unknown'}</td>
                                            <td style={{ fontWeight: 'bold' }}>₹{Number(order.amount).toLocaleString()}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.85rem', opacity: 0.6 }}>
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default ElevateDashboard;
