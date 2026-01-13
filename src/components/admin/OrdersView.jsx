import React, { useContext, useState } from 'react';
import { Search, Filter, RefreshCw, Download } from 'lucide-react';
import { AdminContext } from './AdminLayout';
import DateFilter from './DateFilter';

const OrdersView = () => {
    const { data, refreshData, dateFilter, setDateFilter, DATE_FILTERS } = useContext(AdminContext);
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

    // CSV Export Function
    const exportToCSV = () => {
        const headers = ['Order ID', 'Customer', 'Email', 'Phone', 'Items', 'Date', 'Amount', 'Status', 'City', 'State'];
        const rows = filteredOrders.map(order => [
            order.id,
            order.customer,
            order.email,
            order.phone,
            order.items,
            order.date,
            order.amount,
            order.status,
            order.city,
            order.state
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `orders-${dateFilter}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="orders-view">
            <header className="admin-header">
                <div>
                    <h1 className="admin-title">Orders Management</h1>
                    <p style={{ color: '#888' }}>Track and manage customer orders</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button onClick={exportToCSV} className="export-btn" title="Export to CSV">
                        <Download size={16} /> Export
                    </button>
                    <DateFilter
                        dateFilter={dateFilter}
                        setDateFilter={setDateFilter}
                        DATE_FILTERS={DATE_FILTERS}
                    />
                </div>
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
