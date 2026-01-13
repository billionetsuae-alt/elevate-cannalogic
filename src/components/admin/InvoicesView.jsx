import React, { useContext, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Download, FileText, Search, RefreshCw } from 'lucide-react';
import { AdminContext } from './AdminLayout';
import InvoiceTemplate from './InvoiceTemplate';
import DateFilter from './DateFilter';

const InvoicesView = () => {
    const { data, refreshData, dateFilter, setDateFilter, DATE_FILTERS } = useContext(AdminContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [generating, setGenerating] = useState(null);

    if (!data) return null;

    // Filter only completed orders
    const completedOrders = data.orders.filter(order => order.status === 'completed');

    // Apply search filter
    const filteredOrders = completedOrders.filter(order => {
        const search = searchTerm.toLowerCase();
        return (
            order.id?.toLowerCase().includes(search) ||
            order.customer?.toLowerCase().includes(search) ||
            order.paymentId?.toLowerCase().includes(search)
        );
    });

    // Generate and download PDF
    const handleDownloadInvoice = async (order) => {
        setGenerating(order.id);
        try {
            const blob = await pdf(<InvoiceTemplate order={order} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Invoice-${order.id || 'ELEVATE'}-${order.date || 'invoice'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            // Silent failure
        }
        setGenerating(null);
    };

    return (
        <div className="invoices-view">
            <header className="admin-header">
                <div>
                    <h1 className="admin-title">Invoices</h1>
                    <p style={{ color: '#888' }}>Generate and download invoices for completed orders</p>
                </div>
                <DateFilter
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    DATE_FILTERS={DATE_FILTERS}
                />
            </header>

            {/* Stats */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap'
            }}>
                <div className="kpi-card" style={{ flex: 1, minWidth: '150px' }}>
                    <div className="kpi-label">Total Invoices</div>
                    <div className="kpi-value">{completedOrders.length}</div>
                </div>
                <div className="kpi-card" style={{ flex: 1, minWidth: '150px' }}>
                    <div className="kpi-label">Total Revenue</div>
                    <div className="kpi-value">
                        ₹{completedOrders.reduce((sum, o) => sum + (o.amount || 0), 0).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <Search size={18} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#888'
                }} />
                <input
                    type="text"
                    placeholder="Search by Order ID, Customer, or Payment ID..."
                    className="admin-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Invoice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td style={{ fontFamily: 'monospace', color: '#888' }}>{order.id}</td>
                                    <td style={{ fontWeight: 500 }}>{order.customer}</td>
                                    <td style={{ color: '#888' }}>{order.date}</td>
                                    <td>₹{order.amount?.toLocaleString()}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDownloadInvoice(order)}
                                            disabled={generating === order.id}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid #4caf50',
                                                color: '#4caf50',
                                                padding: '0.4rem 0.75rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '0.8rem',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            {generating === order.id ? (
                                                'Generating...'
                                            ) : (
                                                <>
                                                    <Download size={14} />
                                                    Download
                                                </>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                                    <FileText size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                                    <p>No completed orders found.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoicesView;
