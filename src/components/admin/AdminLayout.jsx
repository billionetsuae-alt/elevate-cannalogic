import React, { useState, useEffect, createContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, LogOut, BarChart3, FileText, Users, AlertCircle } from 'lucide-react';
import './Admin.css';

// Context to share data across views
export const AdminContext = createContext();

// Process raw Airtable records into dashboard data
const processRawRecords = (records, filter = 'all') => {
    const stats = {
        totalRevenue: 0,
        totalOrders: 0,
        totalVisitors: 0,
        conversionRate: 0
    };

    const chartData = { revenue: {}, visitors: {} };
    const orders = [];
    const leads = [];

    // Get date cutoff based on filter
    const filterDate = getDateRange(filter);

    // Process each record
    records.forEach(row => {
        const submittedAt = row.Submitted_At ? new Date(row.Submitted_At) : null;
        const createdDate = submittedAt ? submittedAt.toISOString().split('T')[0] : null;

        // Apply date filter
        if (submittedAt && submittedAt < filterDate) {
            return; // Skip records outside date range
        }

        // Everyone is a visitor
        stats.totalVisitors++;

        // Check if this is a paid order
        if (row.Order_Status === 'Paid' || row.Status === 'Converted' || (row.Amount_Paid > 0)) {
            stats.totalOrders++;
            const amount = parseFloat(row.Amount_Paid || 0);
            stats.totalRevenue += amount;

            orders.push({
                id: row.Payment_ID || row.id || 'N/A',
                customer: row.Name || 'Unknown',
                email: row.Email || '',
                phone: row.Phone || '',
                address: row.Address || '',
                city: row.City || '',
                state: row.State || '',
                pincode: row.Pincode || '',
                amount: amount,
                status: 'completed',
                date: createdDate || 'Recent',
                items: row.Pack_Selected || 'Elevate Bundle',
                paymentId: row.Payment_ID || ''
            });

            if (createdDate) {
                chartData.revenue[createdDate] = (chartData.revenue[createdDate] || 0) + amount;
            }
        } else if (row.Status === 'Lead') {
            // Leads
            leads.push({
                name: row.Name || 'Unknown',
                email: row.Email || '',
                phone: row.Phone || '',
                permanentLink: row.Permanent_Link || '',
                status: row.Status || 'Lead',
                date: createdDate || ''
            });
        } else {
            // Pending/Other
            orders.push({
                id: row.id || 'N/A',
                customer: row.Name || 'Unknown',
                email: row.Email || '',
                phone: row.Phone || '',
                address: row.Address || '',
                city: row.City || '',
                state: row.State || '',
                pincode: row.Pincode || '',
                amount: 3899,
                status: 'pending',
                date: createdDate || 'Recent',
                items: 'Elevate Bundle (Pending)',
                paymentId: ''
            });
        }

        // Visitors chart
        if (createdDate) {
            chartData.visitors[createdDate] = (chartData.visitors[createdDate] || 0) + 1;
        }
    });

    // Calculate conversion rate
    stats.conversionRate = stats.totalVisitors > 0
        ? ((stats.totalOrders / stats.totalVisitors) * 100).toFixed(2)
        : 0;

    // Calculate comparison stats DYNAMICALLY based on filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Define period ranges based on filter
    let currentPeriodStart, previousPeriodStart, previousPeriodEnd, comparisonLabel;

    switch (filter) {
        case 'today':
            currentPeriodStart = today;
            previousPeriodStart = new Date(today);
            previousPeriodStart.setDate(today.getDate() - 1);
            previousPeriodEnd = today;
            comparisonLabel = 'vs yesterday';
            break;
        case 'week':
            currentPeriodStart = new Date(today);
            currentPeriodStart.setDate(today.getDate() - 7);
            previousPeriodStart = new Date(today);
            previousPeriodStart.setDate(today.getDate() - 14);
            previousPeriodEnd = currentPeriodStart;
            comparisonLabel = 'vs last week';
            break;
        case 'month':
            currentPeriodStart = new Date(today);
            currentPeriodStart.setMonth(today.getMonth() - 1);
            previousPeriodStart = new Date(today);
            previousPeriodStart.setMonth(today.getMonth() - 2);
            previousPeriodEnd = currentPeriodStart;
            comparisonLabel = 'vs last month';
            break;
        case 'year':
            currentPeriodStart = new Date(today);
            currentPeriodStart.setFullYear(today.getFullYear() - 1);
            previousPeriodStart = new Date(today);
            previousPeriodStart.setFullYear(today.getFullYear() - 2);
            previousPeriodEnd = currentPeriodStart;
            comparisonLabel = 'vs last year';
            break;
        default: // 'all'
            currentPeriodStart = new Date(0);
            previousPeriodStart = null;
            previousPeriodEnd = null;
            comparisonLabel = 'all time';
    }

    let currentRevenue = 0, previousRevenue = 0;
    let currentVisitors = 0, previousVisitors = 0;
    let currentOrders = 0, previousOrders = 0;

    records.forEach(row => {
        const submittedAt = row.Submitted_At ? new Date(row.Submitted_At) : null;
        if (!submittedAt) return;

        const isPaid = row.Order_Status === 'Paid' || row.Status === 'Converted' || (row.Amount_Paid > 0);
        const amount = parseFloat(row.Amount_Paid || 0);

        // Current period
        if (submittedAt >= currentPeriodStart) {
            currentVisitors++;
            if (isPaid) {
                currentOrders++;
                currentRevenue += amount;
            }
        }

        // Previous period (only if not 'all')
        if (previousPeriodStart && submittedAt >= previousPeriodStart && submittedAt < previousPeriodEnd) {
            previousVisitors++;
            if (isPaid) {
                previousOrders++;
                previousRevenue += amount;
            }
        }
    });

    // Calculate percentage changes
    const calcChange = (current, previous) => {
        if (previous > 0) {
            return parseFloat((((current - previous) / previous) * 100).toFixed(1));
        }
        return current > 0 ? 100 : 0;
    };

    const comparisons = {
        revenueChange: filter === 'all' ? null : calcChange(currentRevenue, previousRevenue),
        ordersChange: filter === 'all' ? null : calcChange(currentOrders, previousOrders),
        visitorsChange: filter === 'all' ? null : calcChange(currentVisitors, previousVisitors),
        ordersNew: currentOrders,
        visitorsNew: currentVisitors,
        comparisonLabel: comparisonLabel,
        conversionRateGood: parseFloat(stats.conversionRate) > 20
    };

    // Generate chart dates based on filter
    const getChartDates = () => {
        const dates = [];
        const numDays = filter === 'today' ? 1 : filter === 'week' ? 7 : filter === 'month' ? 30 : 7;
        for (let i = numDays - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    };

    const chartDates = getChartDates();

    const charts = {
        revenue: chartDates.map(date => ({
            name: date.slice(5),
            value: chartData.revenue[date] || 0
        })),
        visitors: chartDates.map(date => ({
            name: date.slice(5),
            visitors: chartData.visitors[date] || 0
        }))
    };

    // Calculate Top Products (Pack_Selected by revenue)
    const productRevenue = {};
    orders.filter(o => o.status === 'completed').forEach(order => {
        const pack = order.items || 'Unknown';
        productRevenue[pack] = (productRevenue[pack] || 0) + (order.amount || 0);
    });
    const topProducts = Object.entries(productRevenue)
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    const maxProductRevenue = topProducts.length > 0 ? topProducts[0].revenue : 0;
    topProducts.forEach(p => p.percent = maxProductRevenue > 0 ? (p.revenue / maxProductRevenue) * 100 : 0);

    // Funnel Stats (Visitors → Leads → Paid)
    const funnel = {
        visitors: stats.totalVisitors,
        leads: leads.length,
        paid: stats.totalOrders
    };

    // Device Stats (parse User_Agent if available)
    let mobileCount = 0, desktopCount = 0, unknownDevice = 0;
    records.forEach(row => {
        const submittedAt = row.Submitted_At ? new Date(row.Submitted_At) : null;
        if (submittedAt && submittedAt < filterDate) return;

        const ua = (row.User_Agent || '').toLowerCase();
        if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
            mobileCount++;
        } else if (ua.includes('windows') || ua.includes('macintosh') || ua.includes('linux')) {
            desktopCount++;
        } else {
            unknownDevice++;
        }
    });
    const totalDevices = mobileCount + desktopCount + unknownDevice;
    const deviceStats = {
        mobile: mobileCount,
        desktop: desktopCount,
        unknown: unknownDevice,
        mobilePercent: totalDevices > 0 ? ((mobileCount / totalDevices) * 100).toFixed(1) : 0,
        desktopPercent: totalDevices > 0 ? ((desktopCount / totalDevices) * 100).toFixed(1) : 0
    };

    // Geographic Stats (by State)
    const geoData = {};
    orders.filter(o => o.status === 'completed').forEach(order => {
        const state = order.state || 'Unknown';
        geoData[state] = (geoData[state] || 0) + 1;
    });
    const geoStats = Object.entries(geoData)
        .map(([state, count]) => ({ state, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return {
        stats,
        comparisons,
        charts,
        topProducts,
        funnel,
        deviceStats,
        geoStats,
        orders: orders.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 100),
        leads: leads.sort((a, b) => new Date(b.date) - new Date(a.date))
    };
};

// Date filter options
const DATE_FILTERS = ['today', 'week', 'month', 'year', 'all'];

// Get start date based on filter
const getDateRange = (filter) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filter) {
        case 'today':
            return today;
        case 'week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - 7);
            return weekStart;
        case 'month':
            const monthStart = new Date(today);
            monthStart.setMonth(today.getMonth() - 1);
            return monthStart;
        case 'year':
            const yearStart = new Date(today);
            yearStart.setFullYear(today.getFullYear() - 1);
            return yearStart;
        case 'all':
        default:
            return new Date(0); // Beginning of time
    }
};

const AdminLayout = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [rawRecords, setRawRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState('today');

    useEffect(() => {
        // 1. Auth Check
        const token = localStorage.getItem('admin_session_token');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        // 2. Fetch Data (Raw records from n8n)
        const fetchData = async () => {
            const webhookUrl = import.meta.env.ADMIN_DATA_WEBHOOK;

            if (webhookUrl) {
                try {
                    const response = await fetch(webhookUrl);

                    if (response.ok) {
                        const text = await response.text();
                        if (text && text.trim().length > 0) {
                            const rawData = JSON.parse(text);

                            // Store raw records and process with default filter
                            if (rawData.records && Array.isArray(rawData.records)) {
                                setRawRecords(rawData.records);
                                const processedData = processRawRecords(rawData.records, 'today');
                                setData(processedData);
                                setLoading(false);
                                return;
                            }
                        }
                    }
                } catch (err) {
                    // Silent failure
                }
            }

            setError('Failed to load dashboard data. Please check Webhook URL.');
            setLoading(false);
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
                    <p style={{ color: '#888' }}>Loading...</p>
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

    // Handle date filter change
    const handleFilterChange = (newFilter) => {
        setDateFilter(newFilter);
        if (rawRecords.length > 0) {
            const processedData = processRawRecords(rawRecords, newFilter);
            setData(processedData);
        }
    };

    return (
        <AdminContext.Provider value={{
            data,
            rawRecords,
            dateFilter,
            setDateFilter: handleFilterChange,
            DATE_FILTERS,
            refreshData: () => window.location.reload()
        }}>
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

                        <NavLink to="/admin/invoices" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <FileText size={20} />
                            <span>Invoices</span>
                        </NavLink>

                        <NavLink to="/admin/leads" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Users size={20} />
                            <span>Leads</span>
                        </NavLink>

                        <NavLink to="/admin/payment-attempts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <AlertCircle size={20} />
                            <span>Payment Attempts</span>
                        </NavLink>
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
