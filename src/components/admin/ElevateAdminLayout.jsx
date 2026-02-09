import React, { createContext, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, LogOut, Ticket, Users, Menu, X, Mail } from 'lucide-react';
import './Admin.css'; // Reusing Admin CSS for consistency

// Context to share data across views
const ElevateAdminContext = createContext();

const ElevateAdminLayout = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('admin_session_token');
        navigate('/admin/login');
    };

    return (
        <ElevateAdminContext.Provider value={{}}>
            <div className="admin-layout" style={{ background: 'radial-gradient(circle at top center, #1a1a1a 0%, #0a0a0a 100%)' }}>

                {/* Floating Navigation Bar */}
                <nav className="admin-floating-nav">
                    <div className="admin-floating-logo">
                        <img src="/Cannalogic-White.svg" alt="Cannalogic Admin" />
                    </div>

                    <div className="admin-floating-links">
                        <NavLink to="/elevate-admin" end className={({ isActive }) => `admin-floating-link ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard />
                            <span>Dashboard</span>
                        </NavLink>

                        <NavLink to="/elevate-admin/orders" className={({ isActive }) => `admin-floating-link ${isActive ? 'active' : ''}`}>
                            <ShoppingBag />
                            <span>Orders</span>
                        </NavLink>

                        <NavLink to="/elevate-admin/community" className={({ isActive }) => `admin-floating-link ${isActive ? 'active' : ''}`}>
                            <Users />
                            <span>Community</span>
                        </NavLink>

                        <NavLink to="/elevate-admin/coupons" className={({ isActive }) => `admin-floating-link ${isActive ? 'active' : ''}`}>
                            <Ticket />
                            <span>Coupons</span>
                        </NavLink>

                        <NavLink to="/elevate-admin/customers" className={({ isActive }) => `admin-floating-link ${isActive ? 'active' : ''}`}>
                            <Users />
                            <span>Customers</span>
                        </NavLink>

                        <NavLink to="/elevate-admin/email-logs" className={({ isActive }) => `admin-floating-link ${isActive ? 'active' : ''}`}>
                            <Mail />
                            <span>Email Logs</span>
                        </NavLink>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="admin-floating-link"
                        style={{ background: 'rgba(239, 83, 80, 0.1)', color: '#ef5350', border: '1px solid rgba(239, 83, 80, 0.2)' }}
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </nav>

                {/* Main Content */}
                <main className="admin-content floating-mode">
                    <Outlet />
                </main>
            </div>
        </ElevateAdminContext.Provider>
    );
};

export default ElevateAdminLayout;
