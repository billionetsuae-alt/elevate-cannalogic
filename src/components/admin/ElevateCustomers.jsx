import React, { useState, useEffect } from 'react';
import { Search, Loader2, User, Phone, Mail, MapPin, Calendar, ShoppingBag } from 'lucide-react';
import { supabase } from '../../utils/supabase';

const ElevateCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'orders', 'leads'

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            // Fetch customers with their order count
            const { data, error } = await supabase
                .from('elevate_customers')
                .select(`
                    *,
                    elevate_orders (count)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform data to flatten order count
            const transformedData = data.map(c => ({
                ...c,
                order_count: c.elevate_orders ? c.elevate_orders[0]?.count || 0 : 0
            }));

            setCustomers(transformedData || []);
        } catch (err) {
            console.error('Error fetching customers:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c => {
        // Search Filter
        const matchesSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone?.includes(searchQuery) ||
            c.email?.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // Tab Filter
        if (activeTab === 'orders') return c.order_count > 0;
        if (activeTab === 'leads') return c.order_count === 0;
        return true;
    });

    return (
        <div className="admin-page">
            <header className="admin-header">
                <div className="admin-title">
                    <h1>Customers</h1>
                    <p className="admin-subtitle">Manage customer database</p>
                </div>
            </header>

            {/* Tabs & Filters */}
            <div className="admin-card" style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                    {['all', 'orders', 'leads'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeTab === tab ? '2px solid #4caf50' : '2px solid transparent',
                                color: activeTab === tab ? '#4caf50' : 'rgba(255,255,255,0.6)',
                                padding: '0.5rem 1rem',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                fontWeight: activeTab === tab ? '600' : '400',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="search-wrapper" style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                    <input
                        type="text"
                        placeholder="Search name, phone, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-input"
                        style={{ paddingLeft: '40px', width: '100%', maxWidth: '400px' }}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading customers...</div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Contact Info</th>
                                <th>Location</th>
                                <th>Joined</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-state" style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
                                        No customers found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '40px', height: '40px', borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'white', fontWeight: 'bold'
                                                }}>
                                                    {customer.name ? customer.name.charAt(0).toUpperCase() : <User size={18} />}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: '600', color: 'white' }}>{customer.name || 'Unknown'}</span>
                                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>ID: {customer.id.slice(0, 6)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                                                    <Phone size={14} color="#4caf50" /> {customer.phone}
                                                </div>
                                                {customer.email && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                                                        <Mail size={14} /> {customer.email}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                                                <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                                                <span>
                                                    {customer.city}{customer.state ? `, ${customer.state}` : ''}
                                                    <br />
                                                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{customer.pincode}</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                                            {new Date(customer.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                                                {customer.order_count > 0 ? (
                                                    <span className="status-badge status-paid">Customer ({customer.order_count})</span>
                                                ) : (
                                                    <span className="status-badge status-pending">Lead</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ElevateCustomers;
