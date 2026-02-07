import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Plus, Trash2, Tag, Calendar, AlertCircle } from 'lucide-react';

const ElevateCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // New Coupon Form State
    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'FIXED',
        discount_value: '',
        expiry_date: '',
        usage_limit: ''
    });

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('elevate_coupons')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCoupons(data || []);
        } catch (err) {
            console.error('Error fetching coupons:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDelete = async (code) => {
        if (!window.confirm(`Are you sure you want to delete coupon "${code}"?`)) return;

        try {
            const { error } = await supabase
                .from('elevate_coupons')
                .delete()
                .eq('code', code);

            if (error) throw error;
            setCoupons(coupons.filter(c => c.code !== code));
        } catch (err) {
            console.error('Error deleting coupon:', err);
            alert('Failed to delete coupon');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                code: formData.code.toUpperCase(),
                discount_type: formData.discount_type,
                discount_value: parseFloat(formData.discount_value),
                expiry_date: formData.expiry_date || null,
                usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
                active: true
            };

            const { error } = await supabase
                .from('elevate_coupons')
                .insert([payload]);

            if (error) throw error;

            setShowForm(false);
            setFormData({ code: '', discount_type: 'FIXED', discount_value: '', expiry_date: '', usage_limit: '' });
            fetchCoupons(); // Refresh list
        } catch (err) {
            console.error('Error creating coupon:', err);
            alert('Failed to create coupon: ' + err.message);
        }
    };

    return (
        <div className="admin-page">
            <header className="admin-header">
                <div className="admin-title">
                    <h1>Coupons</h1>
                    <p className="admin-subtitle">Manage discount codes and promotions</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="admin-btn admin-btn-primary"
                >
                    <Plus size={18} /> Create Coupon
                </button>
            </header>

            {/* Create Coupon Modal/Panel */}
            {showForm && (
                <div className="admin-card" style={{ marginBottom: '2rem', padding: '2rem', background: 'rgba(30,30,30,0.6)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: '16px' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Tag size={20} color="#4caf50" />
                        Create New Coupon
                    </h3>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>Coupon Code</label>
                            <input
                                type="text"
                                placeholder="e.g. WELCOME10"
                                className="admin-input"
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>Discount Type</label>
                            <select
                                className="admin-input"
                                value={formData.discount_type}
                                onChange={e => setFormData({ ...formData, discount_type: e.target.value })}
                            >
                                <option value="FIXED">Fixed Amount (₹)</option>
                                <option value="PERCENTAGE">Percentage (%)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>Value</label>
                            <input
                                type="number"
                                placeholder="e.g. 500 or 10"
                                className="admin-input"
                                value={formData.discount_value}
                                onChange={e => setFormData({ ...formData, discount_value: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>Expiry Date (Optional)</label>
                            <input
                                type="date"
                                className="admin-input"
                                value={formData.expiry_date}
                                onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '0.8rem 2rem' }}>
                                Create Coupon
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="admin-btn admin-btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="loading-state">Loading coupons...</div>
            ) : (
                <div className="coupon-grid">
                    {coupons.length === 0 ? (
                        <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
                            No coupons active. Create one to get started.
                        </div>
                    ) : (
                        coupons.map(coupon => (
                            <div key={coupon.id} className="coupon-ticket">
                                <div className="ticket-left">
                                    <div className="ticket-value">
                                        {coupon.discount_type === 'PERCENTAGE' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                                        <span style={{ fontSize: '0.8rem', fontWeight: '400', display: 'block', marginTop: '0.2rem' }}>OFF</span>
                                    </div>
                                    <div className="ticket-holes"></div>
                                </div>
                                <div className="ticket-right">
                                    <div className="ticket-header">
                                        <span className="ticket-code">{coupon.code}</span>
                                        <button onClick={() => handleDelete(coupon.code)} className="delete-btn">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="ticket-details">
                                        <div className="detail-row">
                                            <Tag size={12} />
                                            <span>{coupon.discount_type}</span>
                                        </div>
                                        {coupon.expiry_date && (
                                            <div className="detail-row">
                                                <Calendar size={12} />
                                                <span>Expires: {new Date(coupon.expiry_date).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        {coupon.usage_limit && (
                                            <div className="detail-row">
                                                <AlertCircle size={12} />
                                                <span>Limit: {coupon.usage_limit} uses</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <style>{`
                .coupon-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }
                .coupon-ticket {
                    display: flex;
                    background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    overflow: hidden;
                    position: relative;
                    transition: transform 0.2s;
                }
                .coupon-ticket:hover {
                    transform: translateY(-5px);
                    border-color: rgba(76,175,80,0.3);
                }
                .ticket-left {
                    background: rgba(76, 175, 80, 0.15);
                    width: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-right: 2px dashed rgba(255,255,255,0.1);
                    position: relative;
                }
                .ticket-value {
                    color: #4caf50;
                    font-weight: 800;
                    font-size: 1.5rem;
                    text-align: center;
                    line-height: 1;
                }
                .ticket-right {
                    flex: 1;
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .ticket-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                }
                .ticket-code {
                    font-family: monospace;
                    font-size: 1.1rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    color: white;
                    background: rgba(0,0,0,0.3);
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .delete-btn {
                    background: transparent;
                    border: none;
                    color: #ef5350;
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                .delete-btn:hover { opacity: 1; }
                .ticket-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }
                .detail-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    color: rgba(255,255,255,0.5);
                }
            `}</style>
        </div>
    );
};

export default ElevateCoupons;
