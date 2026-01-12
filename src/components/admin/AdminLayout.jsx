import React, { useState, useEffect, createContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, LogOut, BarChart3, Settings } from 'lucide-react';
import './Admin.css';

// Context to share data across views
export const AdminContext = createContext();

const AdminLayout = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 1. Auth Check
        const token = localStorage.getItem('admin_session_token');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        // 2. Fetch Data (Real Webhook)
        const fetchData = async () => {
            const webhookUrl = import.meta.env.ADMIN_DATA_WEBHOOK;
            let success = false;

            // Try fetching real data first
            if (webhookUrl) {
                try {
                    const response = await fetch(webhookUrl);

                    if (response.ok) {
                        const text = await response.text();
                        if (text && text.trim().length > 0) {
                            try {
                                const jsonData = JSON.parse(text);
                                setData(jsonData);
                                setLoading(false);
                                success = true;
                                return;
                            } catch (e) {
                                // Silent failure on parse error
                            }
                        }
                    }
                } catch (err) {
                    // Silent failure on network error
                }
            }

            if (!success) {
                setError('Failed to load dashboard data. Please check Webhook URL.');
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('admin_session_token');
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div className="admin-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="admin-spinner" style={{
                        width: '40px', height: '40px',
                        border: '3px solid rgba(255,255,255,0.1)',
                        borderTop: '3px solid #4caf50',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }} />
                    <p style={{ color: '#888' }}>Loading Real Dashboard Data...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                    <h3 style={{ marginBottom: '1rem' }}>Connection Failed</h3>
                    <p style={{ color: '#ef5350', marginBottom: '1.5rem' }}>{error}</p>
                    <button onClick={() => window.location.reload()} className="admin-btn">Retry Connection</button>
                </div>
            </div>
        );
    }

    return (
        <AdminContext.Provider value={{ data, refreshData: () => window.location.reload() }}>
            <div className="admin-container">
                {/* Sidebar */}
                <aside className="admin-sidebar">
                    <img src="/Cannalogic-White.svg" alt="Admin" className="sidebar-logo" />

                    <nav className="admin-nav">
                        <NavLink to="/admin" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard size={20} />
                            <span>Analytics</span>
                        </NavLink>

                        <NavLink to="/admin/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <ShoppingBag size={20} />
                            <span>Orders</span>
                        </NavLink>

                        <div className="nav-item" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                            <Settings size={20} />
                            <span>Settings</span>
                        </div>
                    </nav>

                    <button onClick={handleLogout} className="nav-item nav-logout" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', font: 'inherit' }}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </aside>

                {/* Main Content */}
                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </AdminContext.Provider>
    );
};

export default AdminLayout;
