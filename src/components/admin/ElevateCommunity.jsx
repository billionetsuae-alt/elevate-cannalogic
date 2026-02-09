import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Search, Filter, RefreshCw, Mail, Calendar, Users, Download } from 'lucide-react';

const ElevateCommunity = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('elevate_community_joins')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLeads(data || []);
        } catch (err) {
            console.error('Error fetching leads:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const filteredLeads = leads.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Source', 'Joint Date'];
        const csvContent = [
            headers.join(','),
            ...filteredLeads.map(lead => [
                lead.name,
                lead.email,
                lead.source,
                new Date(lead.created_at).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'community_leads.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="admin-view">
            <div className="admin-header">
                <div className="admin-title">
                    <h1>Community</h1>
                    <p className="admin-subtitle">Manage your Inner Circle leads</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="admin-btn admin-btn-secondary" onClick={exportToCSV}>
                        <Download size={18} />
                        <span>Export CSV</span>
                    </button>
                    <button className="admin-btn admin-btn-primary" onClick={fetchLeads}>
                        <RefreshCw size={18} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Members</h3>
                        <div className="stat-value">{leads.length}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ color: '#ffc107', background: 'rgba(255, 193, 7, 0.1)' }}>
                        <Calendar size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>This Month</h3>
                        <div className="stat-value">
                            {leads.filter(l => new Date(l.created_at) > new Date(new Date().setDate(1))).length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-filters" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <div className="search-wrapper" style={{ flex: 1, position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
                    <input
                        type="text"
                        className="admin-input"
                        placeholder="Search by name or email..."
                        style={{ paddingLeft: '3rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Leads Table */}
            <div className="admin-table-container">
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                        Loading community data...
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                        No leads found.
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Source</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id}>
                                    <td style={{ fontWeight: '500', color: 'white' }}>{lead.name}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Mail size={14} color="#4caf50" />
                                            {lead.email}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="status-badge status-active" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                            {lead.source || 'Website'}
                                        </span>
                                    </td>
                                    <td>{new Date(lead.created_at).toLocaleDateString()} {new Date(lead.created_at).toLocaleTimeString()}</td>
                                    <td>
                                        <button
                                            className="admin-btn-secondary"
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                            onClick={() => window.location.href = `mailto:${lead.email}`}
                                        >
                                            Email
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ElevateCommunity;
