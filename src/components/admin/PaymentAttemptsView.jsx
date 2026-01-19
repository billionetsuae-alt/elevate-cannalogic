import React, { useContext, useState } from 'react';
import { Search, AlertCircle, Download, Clock, XCircle, CheckCircle } from 'lucide-react';
import { AdminContext } from './AdminLayout';
import DateFilter from './DateFilter';

const PaymentAttemptsView = () => {
    const { data, refreshData, dateFilter, setDateFilter, DATE_FILTERS } = useContext(AdminContext);
    const [searchTerm, setSearchTerm] = useState('');

    if (!data) return null;

    // Get all records where Payment_Attempted is true but Payment_ID is null (failed/abandoned)
    const paymentAttempts = data.rawRecords ? data.rawRecords.filter(record =>
        record.Payment_Attempted === true && !record.Payment_ID
    ).sort((a, b) => {
        // Sort by most recent attempt first
        const dateA = new Date(a.Payment_Attempt_Time || a.Submitted_At);
        const dateB = new Date(b.Payment_Attempt_Time || b.Submitted_At);
        return dateB - dateA;
    }) : [];

    // Filter by search
    const filteredAttempts = paymentAttempts.filter(attempt =>
        (attempt.Name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (attempt.Phone?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (attempt.Email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // CSV Export
    const exportToCSV = () => {
        const headers = ['Name', 'Phone', 'Email', 'Address', 'City', 'State', 'Pincode', 'Pack Selected', 'Amount Attempted', 'Attempt Time', 'Failure Reason', 'Razorpay Order ID'];
        const rows = filteredAttempts.map(attempt => [
            attempt.Name || '—',
            attempt.Phone || '—',
            attempt.Email || '—',
            attempt.Address || '—',
            attempt.City || '—',
            attempt.State || '—',
            attempt.Pincode || '—',
            attempt.Pack_Selected || '—',
            attempt.Payment_Amount_Attempted || '—',
            attempt.Payment_Attempt_Time || '—',
            attempt.Payment_Failure_Reason || 'Not completed',
            attempt.Razorpay_Order_ID || '—'
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
            .join('\\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `payment-attempts-${dateFilter}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFailureIcon = (reason) => {
        if (!reason) return <Clock size={16} color="#FFA500" />;
        if (reason.includes('cancel')) return <XCircle size={16} color="#ef5350" />;
        return <AlertCircle size={16} color="#ef5350" />;
    };

    return (
        <div className="orders-view">
            <header className="admin-header">
                <div>
                    <h1 className="admin-title">Payment Attempts</h1>
                    <p style={{ color: '#888' }}>
                        Users who clicked "Pay" but didn't complete payment
                        <span style={{
                            marginLeft: '1rem',
                            padding: '0.25rem 0.75rem',
                            background: '#ef5350',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                        }}>
                            {filteredAttempts.length} Abandoned
                        </span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button onClick={exportToCSV} className="export-btn" title="Export to CSV">
                        <Download size={16} /> Export
                    </button>
                    <DateFilter
                        dateFilter={dateFilter}
                        setDateFilter={setDateFilter}
                        DATE_FILTERS={DATE_FILTERS}
                    />
                </div>
            </header>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                <input
                    type="text"
                    placeholder="Search by name, phone, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.75rem',
                        background: 'var(--admin-card-bg)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '8px',
                        color: 'white'
                    }}
                />
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Customer</th>
                            <th>Contact</th>
                            <th>Address</th>
                            <th>Pack</th>
                            <th>Amount</th>
                            <th>Status / Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAttempts.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                                    <CheckCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                    <p>No abandoned payment attempts found!</p>
                                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>All payment clicks resulted in successful conversions 🎉</p>
                                </td>
                            </tr>
                        ) : (
                            filteredAttempts.map((attempt, index) => (
                                <tr key={attempt.id || index}>
                                    <td style={{ fontSize: '0.85rem', color: '#888' }}>
                                        {formatDate(attempt.Payment_Attempt_Time || attempt.Submitted_At)}
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{attempt.Name || '—'}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#888' }}>{attempt.Email || '—'}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: '500' }}>{attempt.Phone || '—'}</div>
                                    </td>
                                    <td style={{ maxWidth: '250px', fontSize: '0.9rem' }}>
                                        {attempt.Address ? (
                                            <>
                                                <div>{attempt.Address}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#888' }}>
                                                    {attempt.City}, {attempt.State} - {attempt.Pincode}
                                                </div>
                                            </>
                                        ) : '—'}
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            background: 'rgba(76, 175, 80, 0.1)',
                                            border: '1px solid rgba(76, 175, 80, 0.3)',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            display: 'inline-block'
                                        }}>
                                            {attempt.Pack_Selected || '—'}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: '600', color: '#4caf50' }}>
                                        ₹{attempt.Payment_Amount_Attempted?.toLocaleString('en-IN') || '—'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getFailureIcon(attempt.Payment_Failure_Reason)}
                                            <span style={{ fontSize: '0.9rem', color: '#ef5350' }}>
                                                {attempt.Payment_Failure_Reason || 'Payment pending/abandoned'}
                                            </span>
                                        </div>
                                        {attempt.Razorpay_Order_ID && (
                                            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                                                Order: {attempt.Razorpay_Order_ID}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentAttemptsView;
