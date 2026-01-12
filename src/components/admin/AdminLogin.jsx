import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import './Admin.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        const envUsername = import.meta.env.ADMIN_USERNAME;
        const envPassword = import.meta.env.ADMIN_PASSWORD;

        // If env vars are not set, allow access with default (safe failover for mock)
        // OR simpler: just strict check

        if (!envUsername || !envPassword) {
            setError('Admin credentials not configured in environment.');
            setLoading(false);
            return;
        }

        if (credentials.username === envUsername && credentials.password === envPassword) {
            // Success
            localStorage.setItem('admin_session_token', 'valid_token_' + Date.now());
            setTimeout(() => {
                navigate('/admin');
            }, 500);
        } else {
            setError('Invalid credentials');
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-wrapper">
            <div className="admin-login-card">
                <img src="/Cannalogic-White.svg" alt="Admin" className="admin-login-logo" />
                <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Admin Access</h2>

                <form onSubmit={handleLogin}>
                    <div className="admin-input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            className="admin-input"
                            value={credentials.username}
                            onChange={handleChange}
                            autoFocus
                        />
                    </div>

                    <div className="admin-input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="admin-input"
                            value={credentials.password}
                            onChange={handleChange}
                        />
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <button className="admin-btn" disabled={loading}>
                        {loading ? 'Verifying...' : 'Login to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
