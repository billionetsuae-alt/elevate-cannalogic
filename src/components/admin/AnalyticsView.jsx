import React, { useContext } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie } from 'recharts';
import { TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { AdminContext } from './AdminLayout';
import DateFilter from './DateFilter';

const AnalyticsView = () => {
    const { data, dateFilter, setDateFilter, DATE_FILTERS } = useContext(AdminContext);

    // If data isn't loaded yet (though Layout handles loading state), return null
    if (!data) return null;

    const { stats, charts, comparisons, topProducts, funnel, deviceStats, geoStats } = data;

    // Helper to format change with sign
    const formatChange = (value) => {
        if (value > 0) return `+${value}%`;
        if (value < 0) return `${value}%`;
        return '0%';
    };

    return (
        <div className="analytics-view">
            <header className="admin-header">
                <div>
                    <h1 className="admin-title">Dashboard Overview</h1>
                    <p style={{ color: '#888' }}>Real-time platform insights</p>
                </div>
                <DateFilter
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    DATE_FILTERS={DATE_FILTERS}
                />
            </header>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-label">Total Revenue</div>
                    <div className="kpi-value">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
                    <div className="kpi-trend" style={{ color: comparisons.revenueChange === null ? '#888' : comparisons.revenueChange >= 0 ? '#4caf50' : '#ef5350' }}>
                        <TrendingUp size={14} style={{ display: 'inline', marginRight: 4, transform: comparisons.revenueChange < 0 ? 'rotate(180deg)' : 'none' }} />
                        {comparisons.revenueChange === null ? 'All time total' : `${formatChange(comparisons.revenueChange)} ${comparisons.comparisonLabel}`}
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-label">Total Orders</div>
                    <div className="kpi-value">{stats.totalOrders}</div>
                    <div className="kpi-trend" style={{ color: comparisons.ordersChange === null ? '#888' : comparisons.ordersChange >= 0 ? '#4caf50' : '#ef5350' }}>
                        <ShoppingCart size={14} style={{ display: 'inline', marginRight: 4 }} />
                        {comparisons.ordersChange === null ? `${comparisons.ordersNew} total` : `${formatChange(comparisons.ordersChange)} ${comparisons.comparisonLabel}`}
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-label">Total Visitors</div>
                    <div className="kpi-value">{stats.totalVisitors}</div>
                    <div className="kpi-trend" style={{ color: comparisons.visitorsChange === null ? '#888' : comparisons.visitorsChange >= 0 ? '#4caf50' : '#ef5350' }}>
                        <Users size={14} style={{ display: 'inline', marginRight: 4 }} />
                        {comparisons.visitorsChange === null ? `${comparisons.visitorsNew} total` : `${formatChange(comparisons.visitorsChange)} ${comparisons.comparisonLabel}`}
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-label">Conversion Rate</div>
                    <div className="kpi-value">{stats.conversionRate}%</div>
                    <div className="kpi-trend" style={{ color: comparisons.conversionRateGood ? '#4caf50' : '#888' }}>
                        <TrendingUp size={14} style={{ display: 'inline', marginRight: 4 }} />
                        {comparisons.conversionRateGood ? 'Above average' : 'Needs improvement'}
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

            {/* Funnel Visualization */}
            <div className="funnel-container">
                <h3 className="chart-title">Conversion Funnel</h3>
                <div className="funnel-chart">
                    <div className="funnel-stage">
                        <div className="funnel-bar" style={{ height: `${Math.min(200, Math.max(50, funnel.visitors * 2))}px`, background: 'linear-gradient(180deg, #2196f3, #1565c0)' }} />
                        <div className="funnel-label">Visitors</div>
                        <div className="funnel-value">{funnel.visitors}</div>
                        <div className="funnel-percent">100%</div>
                    </div>
                    <div className="funnel-stage">
                        <div className="funnel-bar" style={{ height: `${Math.min(200, Math.max(30, funnel.leads * 2))}px`, background: 'linear-gradient(180deg, #ff9800, #ef6c00)' }} />
                        <div className="funnel-label">Leads</div>
                        <div className="funnel-value">{funnel.leads}</div>
                        <div className="funnel-percent">{funnel.visitors > 0 ? ((funnel.leads / funnel.visitors) * 100).toFixed(1) : 0}%</div>
                    </div>
                    <div className="funnel-stage">
                        <div className="funnel-bar" style={{ height: `${Math.min(200, Math.max(20, funnel.paid * 5))}px`, background: 'linear-gradient(180deg, #4caf50, #2e7d32)' }} />
                        <div className="funnel-label">Paid</div>
                        <div className="funnel-value">{funnel.paid}</div>
                        <div className="funnel-percent">{funnel.visitors > 0 ? ((funnel.paid / funnel.visitors) * 100).toFixed(1) : 0}%</div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Top Products, Device Stats, Geo Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Top Products */}
                <div className="top-products">
                    <h3 className="chart-title">Top Products by Revenue</h3>
                    {topProducts.length > 0 ? (
                        topProducts.map((product, idx) => (
                            <div key={idx} className="product-row">
                                <div className="product-name">{product.name}</div>
                                <div className="product-bar-container">
                                    <div className="product-bar" style={{ width: `${product.percent}%` }} />
                                </div>
                                <div className="product-amount">₹{product.revenue.toLocaleString()}</div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>No product data available</p>
                    )}
                </div>

                {/* Device Breakdown */}
                <div className="chart-container">
                    <h3 className="chart-title">Device Breakdown</h3>
                    <div className="device-chart-container">
                        <ResponsiveContainer width={150} height={150}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Mobile', value: deviceStats.mobile, fill: '#4caf50' },
                                        { name: 'Desktop', value: deviceStats.desktop, fill: '#2196f3' },
                                        { name: 'Unknown', value: deviceStats.unknown, fill: '#666' }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={60}
                                    dataKey="value"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="device-legend">
                            <div className="device-legend-item">
                                <div className="device-legend-color" style={{ background: '#4caf50' }} />
                                <span>Mobile: {deviceStats.mobilePercent}%</span>
                            </div>
                            <div className="device-legend-item">
                                <div className="device-legend-color" style={{ background: '#2196f3' }} />
                                <span>Desktop: {deviceStats.desktopPercent}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Geographic Stats */}
                <div className="chart-container">
                    <h3 className="chart-title">Top States by Orders</h3>
                    {geoStats.length > 0 ? (
                        <div style={{ maxHeight: '250px', overflow: 'auto' }}>
                            {geoStats.map((geo, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #333' }}>
                                    <span>{idx + 1}. {geo.state}</span>
                                    <span style={{ fontWeight: 600 }}>{geo.count} orders</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>No geographic data available</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AnalyticsView;
