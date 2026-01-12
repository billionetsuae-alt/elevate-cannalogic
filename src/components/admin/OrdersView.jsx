import React, { useContext, useState } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { AdminContext } from './AdminLayout';

const OrdersView = () => {
    const { data, refreshData } = useContext(AdminContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    if (!data) return null;

    // Filter Logic
    const filteredOrders = data.orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="orders-view">
            <header className="admin-header">
                <div>
                    <h1 className="admin-title">Orders Management</h1>
                    <p style={{ color: '#888' }}>Track and manage customer orders</p>
                </div>
                <button onClick={refreshData} className="refresh-btn">
                    <RefreshCw size={16} /> Refresh
                </button>
            </header>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                    <input
                        type="text"
                        placeholder="Search Order ID or Customer..."
                        className="admin-input"
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={{ position: 'relative', minWidth: '150px' }}>
                    <Filter size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                    <select
                        className="admin-input"
                        style={{ paddingLeft: '2.5rem', appearance: 'none' }}
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td style={{ fontFamily: 'monospace', color: '#888' }}>{order.id}</td>
                                    <td style={{ fontWeight: 500 }}>{order.customer}</td>
                                    <td>{order.items}</td>
                                    <td style={{ color: '#888' }}>{order.date}</td>
                                    <td>₹{order.amount.toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge status-${order.status}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                                    No orders found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersView;
