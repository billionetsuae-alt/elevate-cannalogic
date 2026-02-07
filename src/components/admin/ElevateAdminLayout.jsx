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

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <ElevateAdminContext.Provider value={{}}>
            <div className="admin-layout">
                {/* Mobile Hamburger Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle menu"
                >
                    <Menu size={24} />
                </button>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="mobile-overlay"
                        onClick={closeSidebar}
                    />
                )}

                {/* Sidebar */}
                <aside className={`admin-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
                    {/* Mobile Close Button */}
                    <button
                        className="mobile-close-btn"
                        onClick={closeSidebar}
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>

                    <div>
                        <div className="admin-logo">
                            <img src="/Cannalogic-White.svg" alt="Cannalogic Admin" />
                        </div>

                        <nav className="admin-nav">
                            <NavLink
                                to="/elevate-admin"
                                end
                                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                                onClick={closeSidebar}
                            >
                                <LayoutDashboard />
                                <span>Dashboard</span>
                            </NavLink>

                            <NavLink
                                to="/elevate-admin/orders"
                                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                                onClick={closeSidebar}
                            >
                                <ShoppingBag />
                                <span>Orders</span>
                            </NavLink>

                            <NavLink
                                to="/elevate-admin/coupons"
                                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                                onClick={closeSidebar}
                            >
                                <Ticket />
                                <span>Coupons</span>
                            </NavLink>

                            <NavLink
                                to="/elevate-admin/customers"
                                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                                onClick={closeSidebar}
                            >
                                <Users />
                                <span>Customers</span>
                            </NavLink>

                            <NavLink
                                to="/elevate-admin/email-logs"
                                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                                onClick={closeSidebar}
                            >
                                <Mail />
                                <span>Email Logs</span>
                            </NavLink>
                        </nav>
                    </div>

                    <button
                        onClick={() => { handleLogout(); closeSidebar(); }}
                        className="admin-nav-item"
                        style={{ marginTop: 'auto', border: 'none', background: 'transparent', width: '100%', justifyContent: 'flex-start', cursor: 'pointer' }}
                    >
                        <LogOut />
                        <span>Logout</span>
                    </button>
                </aside>

                {/* Main Content */}
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </ElevateAdminContext.Provider>
    );
};

export default ElevateAdminLayout;
