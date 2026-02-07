import React, { useContext, useState } from 'react';
import { Search, AlertCircle, Download, Clock, XCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { AdminContext } from './AdminLayout';
import DateFilter from './DateFilter';

const PaymentAttemptsView = () => {
    const { data, rawRecords, dateFilter, setDateFilter, DATE_FILTERS } = useContext(AdminContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [filterReason, setFilterReason] = useState('all');

    if (!data) return null;

    // Get all records where Payment_Attempted is true but Payment_ID is null (failed/abandoned)
    const paymentAttempts = rawRecords ? rawRecords.filter(record =>
        record.Payment_Attempted === true && !record.Payment_ID
    ).sort((a, b) => {
        // Sort by most recent attempt first
        const dateA = new Date(a.Payment_Attempt_Time || a.Submitted_At);
        const dateB = new Date(b.Payment_Attempt_Time || b.Submitted_At);
        return dateB - dateA;
    }) : [];

    // Filter by search and reason
    const filteredAttempts = paymentAttempts.filter(attempt => {
        const matchesSearch =
            (attempt.Name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (attempt.Phone?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (attempt.Email?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesReason = filterReason === 'all' ||
            (filterReason === 'cancelled' && attempt.Payment_Failure_Reason?.includes('cancel')) ||
            (filterReason === 'pending' && !attempt.Payment_Failure_Reason);

        return matchesSearch && matchesReason;
    });

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
            .join('\n');

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
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFailureIcon = (reason) => {
        if (!reason) return <Clock size={16} color="#FFA500" />;
        if (reason.includes('cancel')) return <XCircle size={16} color="#ef5350" />;
        return <AlertCircle size={16} color="#ef5350" />;
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
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
                            color: '#fff',
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

            {/* Controls */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                    <input
                        type="text"
                        placeholder="Search by name, phone, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="admin-input"
                        style={{ paddingLeft: '2.75rem' }}
                    />
                </div>
                <div style={{ position: 'relative', minWidth: '150px' }}>
                    <select
                        className="admin-input"
                        value={filterReason}
                        onChange={(e) => setFilterReason(e.target.value)}
                    >
                        <option value="all">All Reasons</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredAttempts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                        <CheckCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>No abandoned payment attempts found!</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>All payment clicks resulted in successful conversions 🎉</p>
                    </div>
                ) : (
                    filteredAttempts.map((attempt, index) => {
                        const isExpanded = expandedId === (attempt.id || index);
                        return (
                            <div
                                key={attempt.id || index}
                                onClick={() => toggleExpand(attempt.id || index)}
                                style={{
                                    background: 'var(--admin-card-bg)',
                                    border: '1px solid var(--admin-border)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {/* Compact View */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>
                                            {attempt.Name || 'Unknown'}
                                        </div>
                                        <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                            {attempt.Phone || '—'}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#888' }}>
                                            <Clock size={14} />
                                            {formatDate(attempt.Payment_Attempt_Time || attempt.Submitted_At)}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#4caf50', marginBottom: '0.25rem' }}>
                                            ₹{attempt.Payment_Amount_Attempted?.toLocaleString('en-IN') || '—'}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded View */}
                                {isExpanded && (
                                    <div style={{
                                        marginTop: '1rem',
                                        paddingTop: '1rem',
                                        borderTop: '1px solid var(--admin-border)',
                                        display: 'grid',
                                        gap: '0.75rem'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Email</div>
                                            <div style={{ fontSize: '0.9rem' }}>{attempt.Email || '—'}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Address</div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                {attempt.Address ? (
                                                    <>
                                                        {attempt.Address}<br />
                                                        {attempt.City}, {attempt.State} - {attempt.Pincode}
                                                    </>
                                                ) : '—'}
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Pack</div>
                                                <div style={{
                                                    padding: '0.25rem 0.75rem',
                                                    background: 'rgba(76, 175, 80, 0.1)',
                                                    border: '1px solid rgba(76, 175, 80, 0.3)',
                                                    borderRadius: '8px',
                                                    fontSize: '0.85rem',
                                                    display: 'inline-block'
                                                }}>
                                                    {attempt.Pack_Selected || '—'}
                                                </div>
                                            </div>
                                            {attempt.Razorpay_Order_ID && (
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Order ID</div>
                                                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#888' }}>
                                                        {attempt.Razorpay_Order_ID}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Failure Reason</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getFailureIcon(attempt.Payment_Failure_Reason)}
                                                <span style={{ fontSize: '0.9rem', color: '#ef5350' }}>
                                                    {attempt.Payment_Failure_Reason || 'Payment pending/abandoned'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default PaymentAttemptsView;
