import React, { useContext, useState } from 'react';
import { Search, ExternalLink, Phone, Mail, User, RefreshCw, Download } from 'lucide-react';
import { AdminContext } from './AdminLayout';
import DateFilter from './DateFilter';

const LeadsView = () => {
    const { data, refreshData, dateFilter, setDateFilter, DATE_FILTERS } = useContext(AdminContext);
    const [searchTerm, setSearchTerm] = useState('');

    if (!data) return null;

    // Filter only leads (where status is 'Lead')
    const leads = data.leads || [];

    // Apply search filter
    const filteredLeads = leads.filter(lead => {
        const search = searchTerm.toLowerCase();
        return (
            lead.name?.toLowerCase().includes(search) ||
            lead.email?.toLowerCase().includes(search) ||
            lead.phone?.toLowerCase().includes(search)
        );
    });

    // CSV Export Function
    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Status', 'Date', 'Assessment Link'];
        const rows = filteredLeads.map(lead => [
            lead.name,
            lead.email,
            lead.phone,
            lead.status,
            lead.date,
            lead.permanentLink
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `leads-${dateFilter}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="leads-view">
            <header className="admin-header">
                <div>
                    <h1 className="admin-title">Leads</h1>
                    <p style={{ color: '#888' }}>People who started the assessment but haven't converted yet</p>
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

            {/* Stats */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div className="kpi-card" style={{ flex: 1, minWidth: '150px' }}>
                    <div className="kpi-label">Total Leads</div>
                    <div className="kpi-value">{leads.length}</div>
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
                    placeholder="Search by name, email, or phone..."
                    className="admin-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Leads Cards */}
            <div className="leads-grid">
                {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead, index) => (
                        <div key={index} className="lead-card">
                            <div className="lead-card-header">
                                <User size={18} />
                                <span className="lead-name">{lead.name || 'Unknown'}</span>
                                <span className={`lead-status status-${lead.status?.toLowerCase()}`}>
                                    {lead.status || 'Lead'}
                                </span>
                            </div>
                            <div className="lead-card-body">
                                {lead.phone && (
                                    <div className="lead-info">
                                        <Phone size={14} />
                                        <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                                    </div>
                                )}
                                {lead.email && (
                                    <div className="lead-info">
                                        <Mail size={14} />
                                        <a href={`mailto:${lead.email}`}>{lead.email}</a>
                                    </div>
                                )}
                                {lead.permanentLink && (
                                    <div className="lead-info">
                                        <ExternalLink size={14} />
                                        <a href={lead.permanentLink} target="_blank" rel="noopener noreferrer">
                                            View Assessment
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div className="lead-card-footer">
                                <span className="lead-date">{lead.date || ''}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '3rem',
                        color: '#888'
                    }}>
                        <User size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                        <p>No leads found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadsView;
