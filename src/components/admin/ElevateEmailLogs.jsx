import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { RefreshCw, Mail, Search, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import '../admin/Admin.css';

const ElevateEmailLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('email_logs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLogs(data || []);
        } catch (err) {
            console.error('Error fetching email logs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            (log.recipient?.toLowerCase() || '').includes(searchLower) ||
            (log.template_slug?.toLowerCase() || '').includes(searchLower);

        const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'sent':
                return <CheckCircle size={18} style={{ color: '#4caf50' }} />;
            case 'failed':
                return <XCircle size={18} style={{ color: '#ef5350' }} />;
            default:
                return <Clock size={18} style={{ color: '#ffca28' }} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'sent':
                return 'status-paid';
            case 'failed':
                return 'status-cancelled';
            default:
                return 'status-pending';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTemplateLabel = (slug) => {
        const labels = {
            'order_confirmation': 'Order Confirmation',
            'status_processing': 'Processing Update',
            'status_dispatched': 'Dispatch Notification',
            'status_delivered': 'Delivery Confirmation',
            'ebook_delivery': 'Ebook Delivery'
        };
        return labels[slug] || slug;
    };

    return (
        <div className="admin-page">
            <header className="admin-header">
                <div className="admin-title">
                    <h1>Email Logs</h1>
                    <p className="admin-subtitle">Track all sent emails and delivery status</p>
                </div>
                <button className="admin-btn admin-btn-secondary" onClick={fetchLogs}>
                    <RefreshCw size={16} className={loading ? 'spin' : ''} />
                    Refresh
                </button>
            </header>

            {/* Stats Cards */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-icon">
                        <Mail size={28} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Emails</h3>
                        <div className="stat-value">{logs.length}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
                        <CheckCircle size={28} style={{ color: '#4caf50' }} />
                    </div>
                    <div className="stat-info">
                        <h3>Sent Successfully</h3>
                        <div className="stat-value">{logs.filter(l => l.status === 'sent').length}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(239, 83, 80, 0.1)' }}>
                        <XCircle size={28} style={{ color: '#ef5350' }} />
                    </div>
                    <div className="stat-info">
                        <h3>Failed</h3>
                        <div className="stat-value">{logs.filter(l => l.status === 'failed').length}</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-card mobile-filters" style={{ marginBottom: '2rem', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
                <div className="search-wrapper" style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                    <input
                        type="text"
                        placeholder="Search recipient or template..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="admin-input"
                        style={{ paddingLeft: '40px', width: '100%' }}
                    />
                </div>
                <div className="filter-wrapper" style={{ minWidth: '150px' }}>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="admin-input"
                        style={{ width: '100%' }}
                    >
                        <option value="all">All Status</option>
                        <option value="sent">Sent</option>
                        <option value="failed">Failed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading email logs...</div>
            ) : filteredLogs.length === 0 ? (
                <div className="admin-card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <Mail size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {searchTerm || statusFilter !== 'all' ? 'No emails match your filters' : 'No emails sent yet'}
                    </p>
                </div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Recipient</th>
                                <th>Template</th>
                                <th>Status</th>
                                <th>Sent At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map((log) => (
                                <tr key={log.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Mail size={16} style={{ opacity: 0.6 }} />
                                            {log.recipient}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            background: 'rgba(76, 175, 80, 0.1)',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem'
                                        }}>
                                            {getTemplateLabel(log.template_slug)}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getStatusIcon(log.status)}
                                            <span className={`status-badge ${getStatusColor(log.status)}`}>
                                                {log.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                                            <Calendar size={14} />
                                            {formatDate(log.created_at)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ElevateEmailLogs;
