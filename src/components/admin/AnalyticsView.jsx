import React, { useContext } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { AdminContext } from './AdminLayout';

const AnalyticsView = () => {
    const { data } = useContext(AdminContext);

    // If data isn't loaded yet (though Layout handles loading state), return null
    if (!data) return null;

    const { stats, charts } = data;

    return (
        <div className="analytics-view">
            <header className="admin-header">
                <div>
                    <h1 className="admin-title">Dashboard Overview</h1>
                    <p style={{ color: '#888' }}>Real-time platform insights</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <span className="status-badge status-completed" style={{ fontSize: '0.9rem' }}>
                        ● Live Data
                    </span>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-label">Total Revenue</div>
                    <div className="kpi-value">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
                    <div className="kpi-trend trend-up">
                        <TrendingUp size={14} style={{ display: 'inline', marginRight: 4 }} />
                        +12.5% vs last week
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-label">Total Orders</div>
                    <div className="kpi-value">{stats.totalOrders}</div>
                    <div className="kpi-trend trend-up">
                        <ShoppingCart size={14} style={{ display: 'inline', marginRight: 4 }} />
                        +5 New today
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-label">Total Visitors</div>
                    <div className="kpi-value">{stats.totalVisitors}</div>
                    <div className="kpi-trend trend-down">
                        <Users size={14} style={{ display: 'inline', marginRight: 4 }} />
                        -2% vs last week
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-label">Conversion Rate</div>
                    <div className="kpi-value">{stats.conversionRate}%</div>
                    <div className="kpi-trend trend-up">
                        <TrendingUp size={14} style={{ display: 'inline', marginRight: 4 }} />
                        Above average
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                {/* Revenue Chart */}
                <div className="chart-container">
                    <h3 className="chart-title">Revenue Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={charts.revenue}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4caf50" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} />
                            <YAxis stroke="#888" tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#151515', borderColor: '#333', color: '#fff' }}
                                itemStyle={{ color: '#4caf50' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#4caf50" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Visitor Chart */}
                <div className="chart-container">
                    <h3 className="chart-title">Visitor Acquisition</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={charts.visitors}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} />
                            <YAxis stroke="#888" tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#151515', borderColor: '#333', color: '#fff' }}
                            />
                            <Bar dataKey="visitors" fill="#2196f3" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsView;
