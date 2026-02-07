import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Search, Filter, RefreshCw, Mail, Phone, MapPin, ChevronDown, ChevronUp, Check, X, Users, ShoppingBag, Package } from 'lucide-react';

const ElevateOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [updatingId, setUpdatingId] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('elevate_orders')
                .select(`
                    *,
                    elevate_customers (
                        name,
                        email,
                        phone,
                        address,
                        city,
                        state,
                        pincode
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const { error } = await supabase
                .from('elevate_orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

            // Trigger Email Notification Logic (call n8n webhook)
            try {
                // General Email Webhook
                const EMAIL_WEBHOOK_URL = 'https://n8n-642200223.kloudbeansite.com/webhook/general-email';

                if (EMAIL_WEBHOOK_URL) {
                    // Determine template type based on status
                    let emailType = '';
                    if (newStatus === 'processing') emailType = 'status_processing';
                    if (newStatus === 'dispatched') emailType = 'status_dispatched';
                    if (newStatus === 'delivered') emailType = 'status_delivered';

                    if (emailType) {
                        const order = orders.find(o => o.id === orderId);
                        await fetch(EMAIL_WEBHOOK_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                type: emailType,
                                recipient: order?.customer_info?.email || '',
                                data: {
                                    name: order?.customer_info?.name?.split(' ')[0] || 'Customer',
                                    order_id: orderId,
                                    courier_name: 'Delhivery', // Placeholder
                                    tracking_id: 'TRACK123'    // Placeholder
                                }
                            })
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to trigger status email:', error);
            }

        } catch (err) {
            console.error('Error updating status:', err);
            console.error('Error details:', JSON.stringify(err, null, 2));
            alert(`Failed to update status: ${err.message || 'Unknown error'}`);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredOrders = orders.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            (order.order_id?.toLowerCase() || '').includes(searchLower) ||
            (order.elevate_customers?.name?.toLowerCase() || '').includes(searchLower) ||
            (order.elevate_customers?.phone?.toLowerCase() || '').includes(searchLower);

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'status-paid';
            case 'completed': return 'status-paid';
            case 'dispatched': return 'status-active';
            case 'processing': return 'status-pending';
            case 'pending': return 'status-pending';
            case 'cancelled': return 'status-cancelled';
            default: return 'status-pending';
        }
    };

    return (
        <div className="admin-page">
            <header className="admin-header">
                <div className="admin-title">
                    <h1>Orders</h1>
                    <p className="admin-subtitle">Manage customer orders and status updates</p>
                </div>
                <button className="admin-btn admin-btn-secondary" onClick={fetchOrders}>
                    <RefreshCw size={16} className={loading ? 'spin' : ''} />
                    Refresh
                </button>
            </header>


            {/* Filters */}
            <div className="admin-card mobile-filters" style={{ marginBottom: '2rem', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
                <div className="search-wrapper" style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                    <input
                        type="text"
                        placeholder="Search Order ID, Name, Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="admin-input"
                        style={{ paddingLeft: '40px', width: '100%' }}
                    />
                </div>
                <div className="filter-wrapper" style={{ minWidth: '150px' }}>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="admin-input"
                        style={{ width: '100%' }}
                    >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="processing">Processing</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading orders...</div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-state">No orders found</td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <React.Fragment key={order.id}>
                                        <tr
                                            onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td className="mono" style={{ fontSize: '0.85rem' }}>
                                                {expandedOrderId === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                {' '}{order.id?.slice(0, 8)}...
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div style={{ fontWeight: '500' }}>
                                                        {order.elevate_customers?.name || order.customer_info?.name || 'Unknown'}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                                        <Phone size={12} />
                                                        {order.elevate_customers?.phone || order.customer_info?.phone || 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {(() => {
                                                    const i = order.items;
                                                    if (!i) return 'Elevate Bundle';
                                                    if (typeof i === 'string') return i;
                                                    if (typeof i.pack === 'object' && i.pack?.label) return i.pack.label;
                                                    if (typeof i.pack === 'string') return i.pack;
                                                    if (i.label) return i.label;
                                                    return 'Elevate Bundle';
                                                })()}
                                            </td>
                                            <td style={{ fontWeight: 'bold' }}>₹{Number(order.amount).toLocaleString()}</td>
                                            <td style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                                                {new Date(order.created_at).toLocaleDateString()}
                                                <br />
                                                <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>
                                                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <select
                                                    className="admin-input"
                                                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    disabled={updatingId === order.id}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="dispatched">Dispatched</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                        {expandedOrderId === order.id && (
                                            <tr style={{ background: 'rgba(76, 175, 80, 0.05)', borderLeft: '3px solid #4caf50' }}>
                                                <td colSpan="7" style={{ padding: '1.5rem' }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                                        {/* Customer Details */}
                                                        <div>
                                                            <h4 style={{ margin: '0 0 1rem 0', color: '#4caf50', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <Users size={18} /> Customer Details
                                                            </h4>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                    <Users size={14} style={{ opacity: 0.6 }} />
                                                                    <span style={{ opacity: 0.7 }}>Name:</span>
                                                                    <strong>{order.elevate_customers?.name || order.customer_info?.name || 'N/A'}</strong>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                    <Mail size={14} style={{ opacity: 0.6 }} />
                                                                    <span style={{ opacity: 0.7 }}>Email:</span>
                                                                    <strong>{order.elevate_customers?.email || order.customer_info?.email || 'N/A'}</strong>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                    <Phone size={14} style={{ opacity: 0.6 }} />
                                                                    <span style={{ opacity: 0.7 }}>Phone:</span>
                                                                    <strong>{order.elevate_customers?.phone || order.customer_info?.phone || 'N/A'}</strong>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Shipping Address */}
                                                        <div>
                                                            <h4 style={{ margin: '0 0 1rem 0', color: '#4caf50', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <MapPin size={18} /> Shipping Address
                                                            </h4>
                                                            <div style={{ lineHeight: '1.6', opacity: 0.9 }}>
                                                                {order.elevate_customers?.address || order.customer_info?.address || 'N/A'}<br />
                                                                {order.elevate_customers?.city || order.customer_info?.city || 'N/A'}, {order.elevate_customers?.state || order.customer_info?.state || 'N/A'}<br />
                                                                PIN: {order.elevate_customers?.pincode || order.customer_info?.pincode || 'N/A'}
                                                            </div>
                                                        </div>

                                                        {/* Order Details */}
                                                        <div>
                                                            <h4 style={{ margin: '0 0 1rem 0', color: '#4caf50', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <Package size={18} /> Order Details
                                                            </h4>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                                <div>
                                                                    <span style={{ opacity: 0.7 }}>Order ID:</span>
                                                                    <strong style={{ marginLeft: '0.5rem', fontFamily: 'monospace' }}>{order.id}</strong>
                                                                </div>
                                                                <div>
                                                                    <span style={{ opacity: 0.7 }}>Payment ID:</span>
                                                                    <strong style={{ marginLeft: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                                                        {order.payment_id || 'N/A'}
                                                                    </strong>
                                                                </div>
                                                                {order.coupon_code && (
                                                                    <div>
                                                                        <span style={{ opacity: 0.7 }}>Coupon:</span>
                                                                        <strong style={{ marginLeft: '0.5rem', color: '#4caf50' }}>{order.coupon_code}</strong>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .mono { font-family: monospace; opacity: 0.7; }
                .empty-state { text-align: center; padding: 3rem; opacity: 0.5; }
            `}</style>
        </div>
    );
};

export default ElevateOrders;
