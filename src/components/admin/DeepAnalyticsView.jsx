import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { MousePointer, Clock, Video, HelpCircle, ChevronDown } from 'lucide-react';
import DateFilter from './DateFilter';

const DeepAnalyticsView = () => {
    // Top Level Tabs: Pages
    const [activePage, setActivePage] = useState('landing');
    // Second Level Tabs: Categories (Buttons, Video, etc.)
    const [activeCategory, setActiveCategory] = useState('overview');

    // Date Filter State
    const [dateFilter, setDateFilter] = useState('all');
    const DATE_FILTERS = ['today', 'week', 'month', 'year', 'all'];

    const [stats, setStats] = useState({
        totalClicks: 0,
        avgTimeOnPage: 0,
        videoStarts: 0,
        videoCompletions: 0,
        buttonClicks: [],
        videoStats: null
    });
    const [loading, setLoading] = useState(true);



    const getDateRange = (filter) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (filter) {
            case 'today': return today;
            case 'week': {
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                return weekAgo;
            }
            case 'month': {
                const monthAgo = new Date(today);
                monthAgo.setMonth(today.getMonth() - 1);
                return monthAgo;
            }
            case 'year': {
                const yearAgo = new Date(today);
                yearAgo.setFullYear(today.getFullYear() - 1);
                return yearAgo;
            }
            default: return new Date(0); // All time
        }
    };

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            const startDate = getDateRange(dateFilter);

            try {
                // Base query builder
                const baseQuery = (eventType) => {
                    let query = supabase
                        .from('analytics_events')
                        .select('*')
                        .eq('page_name', activePage)
                        .gte('created_at', startDate.toISOString());

                    if (eventType) {
                        query = query.eq('event_type', eventType);
                    }
                    return query;
                };

                // 1. Fetch Click Events
                const { data: clickEvents } = await baseQuery('click');

                // Group by element_id
                const clickCounts = {};
                clickEvents?.forEach(e => {
                    const key = e.element_id || 'unknown';
                    clickCounts[key] = (clickCounts[key] || 0) + 1;
                });
                const buttonClicks = Object.entries(clickCounts)
                    .map(([name, count]) => ({
                        name: formatButtonName(name),
                        rawName: name,
                        count,
                        percent: clickEvents.length > 0 ? Math.round((count / clickEvents.length) * 100) : 0
                    }))
                    .sort((a, b) => b.count - a.count);


                // 2. Fetch Time on Page Events
                const { data: timeEvents } = await baseQuery('time_on_page');

                let totalTime = 0;
                timeEvents?.forEach(e => totalTime += parseInt(e.value || 0));
                const avgTime = timeEvents?.length ? Math.round(totalTime / timeEvents.length) : 0;


                // 3. Video Stats
                const { data: videoEntries } = await baseQuery('video_start');
                const { data: videoCompletes } = await baseQuery('video_complete');

                const videoStarts = videoEntries?.length || 0;
                const videoCompletions = videoCompletes?.length || 0;


                setStats({
                    totalClicks: clickEvents?.length || 0,
                    avgTimeOnPage: avgTime,
                    videoStarts,
                    videoCompletions,
                    buttonClicks,
                    videoStats: {
                        starts: videoStarts,
                        completions: videoCompletions,
                        rate: videoStarts > 0 ? Math.round((videoCompletions / videoStarts) * 100) : 0
                    }
                });

            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [dateFilter, activePage]);

    const formatButtonName = (id) => {
        if (!id) return 'Unknown';

        const nameMap = {
            // Assessment buttons
            'start_assessment': 'Create Access (Start)',
            'personal_info_next': 'Continue (Step 1)',
            'personal_info_back': 'Back (Step 1)',
            'contact_info_back': 'Back (Step 2)',
            'submit_assessment': 'Claim Access & Ebook',
            'abandoned_without_starting': 'Assessment Abandoned (Intro)',
            'abandoned_step_1': 'Assessment Abandoned (Step 1)',
            'abandoned_step_2': 'Assessment Abandoned (Step 2 - Contact)',
            'abandoned_question_1': 'Assessment Abandoned (Q1)',
            'abandoned_question_2': 'Assessment Abandoned (Q2)',
            'abandoned_question_3': 'Assessment Abandoned (Q3)',
            'abandoned_question_4': 'Assessment Abandoned (Q4)',
            'abandoned_question_5': 'Assessment Abandoned (Q5)',
            'abandoned_question_6': 'Assessment Abandoned (Q6)',
            'abandoned_question_7': 'Assessment Abandoned (Q7)',
            'step_1_started': 'Assessment Step 1 Started',
            'step_2_started': 'Assessment Step 2 Started',
            'step_1_completed': 'Assessment Step 1 Completed',
            'back_from_step_2': 'Assessment Back from Step 2',
            'validation_error_email': 'Validation Error: Email',
            'validation_error_phone': 'Validation Error: Phone',
            'validation_error_age': 'Validation Error: Age',
            'validation_error_weight': 'Validation Error: Weight',
            'field_edited_age': 'Field Edited: Age',
            'field_edited_weight': 'Field Edited: Weight',
            'focus_name': 'Focus Name',
            'focus_age': 'Focus Age',
            'focus_weight': 'Focus Weight',
            'focus_email': 'Focus Email',
            'sex_selected_Male': 'Sex Selected: Male',
            'sex_selected_Female': 'Sex Selected: Female',
            'sex_selected_Other': 'Sex Selected: Other',
            // Landing page buttons
            'hero_cta': 'Hero - Get Free Access',
            'hero_buy_now': 'Hero - Start Stress Relief Now',
            'hero_video_btn': 'Hero - Watch Video',
            'sticky_footer_cta': 'Sticky Bar - Get Free Access',
            'discovery_cta': 'Discovery - Get Free Access',
            'energy_cta': 'Energy - Get Free Access',
            'ikigai_cta': 'Venn - Get Free Access',
            // Landing - Advanced Tracking
            'scroll_25_percent': 'Scroll 25%',
            'scroll_50_percent': 'Scroll 50%',
            'scroll_75_percent': 'Scroll 75%',
            'scroll_100_percent': 'Scroll 100%',
            'faq_1_opened': 'FAQ #1 Opened',
            'faq_2_opened': 'FAQ #2 Opened',
            'faq_3_opened': 'FAQ #3 Opened',
            'faq_4_opened': 'FAQ #4 Opened',
            'faq_5_opened': 'FAQ #5 Opened',
            'faq_6_opened': 'FAQ #6 Opened',
            'faq_7_opened': 'FAQ #7 Opened',
            'qualification_card_inner_clarity': 'Qualification: Inner Clarity',
            'qualification_card_unlocking_potential': 'Qualification: Unlocking Potential',
            'qualification_card_somatic_relief': 'Qualification: Somatic Relief',
            'qualification_card_relationship_harmony': 'Qualification: Relationship Harmony',
            'qualification_card_financial_peace': 'Qualification: Financial Peace',
            'qualification_card_emotional_lightness': 'Qualification: Emotional Lightness',
            'video_resumed': 'Video Resumed',
            'video_25_percent': 'Video 25% Watched',
            'video_50_percent': 'Video 50% Watched',
            'video_75_percent': 'Video 75% Watched',
            'viewed_hero_section': 'Hero Section Viewed',
            'viewed_video_section': 'Video Section Viewed',
            'viewed_problem_section': 'Problem Section Viewed',
            'viewed_benefits_section': 'Benefits Section Viewed',
            'viewed_partners_section': 'Partners Section Viewed',
            'viewed_qualification_section': 'Qualification Section Viewed',
            'viewed_faq_section': 'FAQ Section Viewed',
            // Product page buttons
            'select_1_pack': '1 Pack Selection',
            'select_2_pack': '2 Packs Selection',
            'select_3_pack': '3 Packs Selection',
            'pack_1_button': '1 Pack Button',
            'pack_2_button': '2 Packs Button',
            'pack_3_button': '3 Packs Button',
            'buy_now_main': 'Buy Now (Main)',
            'claim_now_floating': 'Claim Now (Floating)',
            // Product page - Advanced
            'carousel_prev': 'Carousel Previous',
            'carousel_next': 'Carousel Next',
            'carousel_dot_1': 'Carousel Dot 1',
            'carousel_dot_2': 'Carousel Dot 2',
            'carousel_dot_3': 'Carousel Dot 3',
            'dosage_single_clicked': 'Single Dose Card',
            'dosage_double_clicked': 'Double Dose Card',
            'ebook_selected': 'Ebook Selected',
            'ebook_deselected': 'Ebook Deselected',
            'viewed_with_active_timer': 'Viewed with Timer',
            'viewed_trust_badges_section': 'Trust Badges Viewed',
            'viewed_testimonials_section': 'Testimonials Viewed',
            // Checkout events
            'checkout_opened': 'Checkout Opened',
            'form_submitted_pay_now': 'Checkout Form Submitted',
            'checkout_abandoned': 'Checkout Abandoned',
            'pay_button_clicked': 'Pay Button Clicked',
            'focus_fullName': 'Focus Full Name',
            'focus_phone': 'Focus Phone',
            'focus_address': 'Focus Address',
            'focus_pincode': 'Focus Pincode',
            'focus_city': 'Focus City',
            'focus_state': 'Focus State',
            'focus_country': 'Focus Country',
            // Payment / Razorpay events
            'payment_modal_opened': 'Payment Modal Opened',
            'payment_modal_closed': 'Payment Modal Closed',
            'payment_success': 'Payment Success',
            'payment_completed': 'Payment Completed',
            'payment_failed': 'Payment Failed',
            'payment_abandoned': 'Payment Abandoned',
            'time_in_payment_modal': 'Time in Payment Modal (seconds)',
            'time_in_modal_before_abandon': 'Time Before Abandon (seconds)',
            'payment_error_BAD_REQUEST_ERROR': 'Error: Bad Request',
            'payment_error_GATEWAY_ERROR': 'Error: Gateway Error',
            'payment_error_SERVER_ERROR': 'Error: Server Error',
            'payment_error_NETWORK_ERROR': 'Error: Network Error'
        };

        return nameMap[id] || id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    // Sub-components for Tabs
    const LandingPageTabs = () => {
        const [dropdownOpen, setDropdownOpen] = useState(false);

        const priorityTabs = ['overview', 'buttons', 'video', 'engagement'];
        const advancedMetrics = [
            { id: 'scroll', label: 'Scroll Depth' },
            { id: 'faqs', label: 'FAQ Clicks' },
            { id: 'qualification', label: 'Qualification' },
            { id: 'video_advanced', label: 'Video Advanced' },
            { id: 'sections', label: 'Section Views' },
            { id: 'sticky', label: 'Sticky Footer' }
        ];

        return (
            <div className="sub-tabs" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {priorityTabs.map(tab => (
                    <button
                        key={tab}
                        className={`sub-tab-btn ${activeCategory === tab ? 'active' : ''}`}
                        onClick={() => setActiveCategory(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
                <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
                    <button
                        className={`sub-tab-btn ${advancedMetrics.some(m => m.id === activeCategory) ? 'active' : ''}`}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        Advanced
                        <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </button>
                    {dropdownOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: '0.5rem',
                            background: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            padding: '0.5rem',
                            minWidth: '180px',
                            zIndex: 1000,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}>
                            {advancedMetrics.map(metric => (
                                <button
                                    key={metric.id}
                                    className={`sub-tab-btn ${activeCategory === metric.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setActiveCategory(metric.id);
                                        setDropdownOpen(false);
                                    }}
                                    style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '4px' }}
                                >
                                    {metric.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const AssessmentPageTabs = () => (
        <div className="sub-tabs">
            {['overview', 'buttons', 'engagement'].map(tab => (
                <button
                    key={tab}
                    className={`sub-tab-btn ${activeCategory === tab ? 'active' : ''}`}
                    onClick={() => setActiveCategory(tab)}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
    );

    const ProductPageTabs = () => {
        const [dropdownOpen, setDropdownOpen] = useState(false);

        const priorityTabs = ['overview', 'buttons', 'packs', 'video', 'engagement'];
        const advancedMetrics = [
            { id: 'scroll', label: 'Scroll Depth' },
            { id: 'faqs', label: 'FAQ Clicks' },
            { id: 'carousel', label: 'Carousel' },
            { id: 'dosage', label: 'Dosage Cards' },
            { id: 'ebook', label: 'Ebook Toggle' },
            { id: 'timer', label: 'Timer Awareness' },
            { id: 'sections', label: 'Section Views' }
        ];

        return (
            <div className="sub-tabs" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {priorityTabs.map(tab => (
                    <button
                        key={tab}
                        className={`sub-tab-btn ${activeCategory === tab ? 'active' : ''}`}
                        onClick={() => setActiveCategory(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
                <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
                    <button
                        className={`sub-tab-btn ${advancedMetrics.some(m => m.id === activeCategory) ? 'active' : ''}`}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        Advanced
                        <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </button>
                    {dropdownOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: '0.5rem',
                            background: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            padding: '0.5rem',
                            minWidth: '180px',
                            zIndex: 1000,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}>
                            {advancedMetrics.map(metric => (
                                <button
                                    key={metric.id}
                                    className={`sub-tab-btn ${activeCategory === metric.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setActiveCategory(metric.id);
                                        setDropdownOpen(false);
                                    }}
                                    style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '4px' }}
                                >
                                    {metric.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const CheckoutPageTabs = () => (
        <div className="sub-tabs">
            {['overview', 'funnel', 'form'].map(tab => (
                <button
                    key={tab}
                    className={`sub-tab-btn ${activeCategory === tab ? 'active' : ''}`}
                    onClick={() => setActiveCategory(tab)}
                >
                    {tab === 'form' ? 'Form Fields' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
    );

    const PaymentPageTabs = () => (
        <div className="sub-tabs">
            {['overview', 'funnel', 'errors', 'methods'].map(tab => (
                <button
                    key={tab}
                    className={`sub-tab-btn ${activeCategory === tab ? 'active' : ''}`}
                    onClick={() => setActiveCategory(tab)}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
    );

    const DevicesPageTabs = () => (
        <div className="sub-tabs">
            {['overview', 'devices', 'os', 'browsers'].map(tab => (
                <button
                    key={tab}
                    className={`sub-tab-btn ${activeCategory === tab ? 'active' : ''}`}
                    onClick={() => setActiveCategory(tab)}
                >
                    {tab === 'os' ? 'Operating Systems' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
    );

    const ButtonList = () => (
        <div className="analytics-list">
            <h3 className="section-title">Button Clicks Breakdown</h3>
            <div className="table-header">
                <span>Button Name</span>
                <span className="text-right">Clicks</span>
                <span className="text-right">Share</span>
            </div>
            {stats.buttonClicks.map((btn, idx) => (
                <div key={idx} className="table-row">
                    <div className="row-name">
                        <MousePointer size={16} style={{ marginRight: '10px', color: '#2196f3' }} />
                        {btn.name}
                        <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '8px' }}>({btn.rawName})</span>
                    </div>
                    <div className="row-value">{btn.count}</div>
                    <div className="row-value">{btn.percent}%</div>
                </div>
            ))}
            {stats.buttonClicks.length === 0 && <div className="empty-state">No clicks recorded in this period</div>}
        </div>
    );

    const VideoStats = () => (
        <div className="analytics-list">
            <h3 className="section-title">Video Performance</h3>
            <div className="stats-grid">
                <div className="stat-box">
                    <span className="stat-label">Total Plays</span>
                    <span className="stat-number">{stats.videoStats.starts}</span>
                </div>
                <div className="stat-box">
                    <span className="stat-label">Completed</span>
                    <span className="stat-number">{stats.videoStats.completions}</span>
                </div>
                <div className="stat-box">
                    <span className="stat-label">Completion Rate</span>
                    <span className="stat-number" style={{ color: stats.videoStats.rate > 50 ? '#4caf50' : '#ef5350' }}>
                        {stats.videoStats.rate}%
                    </span>
                </div>
            </div>
        </div>
    );

    if (loading) return <div style={{ color: '#888', padding: '2rem' }}>Loading data...</div>;

    return (
        <div className="analytics-view deep-analytics">
            <header className="admin-header">
                <div>
                    <h1 className="admin-title">Deep Analytics</h1>
                    <p style={{ color: '#888' }}>Behavioral tracking & engagement</p>
                </div>
                <DateFilter
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    DATE_FILTERS={DATE_FILTERS}
                />
            </header>

            {/* Top Level Page Tabs */}
            <div className="page-tabs">
                {['landing', 'product', 'assessment', 'checkout', 'payment', 'devices'].map(page => (
                    <button
                        key={page}
                        className={`page-tab ${activePage === page ? 'active' : ''}`}
                        onClick={() => { setActivePage(page); setActiveCategory('overview'); }}
                    >
                        {page.charAt(0).toUpperCase() + page.slice(1)}
                    </button>
                ))}
            </div>

            {/* CONTENT AREA */}
            {activePage === 'landing' ? (
                <>
                    <LandingPageTabs />

                    <div className="tab-content animate-fade-in">
                        {activeCategory === 'overview' && (
                            <div className="kpi-grid">
                                <div className="kpi-card">
                                    <div className="kpi-label">Avg Time on Page</div>
                                    <div className="kpi-value">{formatTime(stats.avgTimeOnPage)}</div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-label">Total Clicks</div>
                                    <div className="kpi-value">{stats.totalClicks}</div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-label">Video Plays</div>
                                    <div className="kpi-value">{stats.videoStarts}</div>
                                </div>
                            </div>
                        )}

                        {activeCategory === 'buttons' && <ButtonList />}
                        {activeCategory === 'video' && <VideoStats />}

                        {activeCategory === 'engagement' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Engagement Metrics</h3>
                                <div className="table-row">
                                    <span>Average Time on Page</span>
                                    <span className="row-value">{formatTime(stats.avgTimeOnPage)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : activePage === 'assessment' ? (
                <>
                    <AssessmentPageTabs />

                    <div className="tab-content animate-fade-in">
                        {activeCategory === 'overview' && (
                            <div className="kpi-grid">
                                <div className="kpi-card">
                                    <div className="kpi-label">Starts</div>
                                    <div className="kpi-value">
                                        {stats.buttonClicks.find(b => b.rawName === 'start_assessment')?.count || 0}
                                    </div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-label">Total Submissions</div>
                                    <div className="kpi-value">
                                        {stats.buttonClicks.find(b => b.rawName === 'submit_assessment')?.count || 0}
                                    </div>
                                    <div className="kpi-trend" style={{ color: '#4caf50', fontSize: '0.8rem', marginTop: '5px' }}>
                                        From 'Claim Access'
                                    </div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-label">Completion Rate</div>
                                    <div className="kpi-value">
                                        {(() => {
                                            const starts = stats.buttonClicks.find(b => b.rawName === 'start_assessment')?.count || 0;
                                            const completes = stats.buttonClicks.find(b => b.rawName === 'submit_assessment')?.count || 0;
                                            return starts > 0 ? Math.round((completes / starts) * 100) + '%' : '0%';
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeCategory === 'buttons' && <ButtonList />}

                        {activeCategory === 'engagement' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Engagement Metrics</h3>
                                <div className="table-row">
                                    <span>Average Time in Assessment</span>
                                    <span className="row-value">{formatTime(stats.avgTimeOnPage)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : activePage === 'product' ? (
                <>
                    <ProductPageTabs />

                    <div className="tab-content animate-fade-in">
                        {activeCategory === 'overview' && (
                            <div className="kpi-grid">
                                <div className="kpi-card">
                                    <div className="kpi-label">Total Interactions</div>
                                    <div className="kpi-value">{stats.totalClicks}</div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-label">Avg Time on Page</div>
                                    <div className="kpi-value">{formatTime(stats.avgTimeOnPage)}</div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-label">Pack Selections</div>
                                    <div className="kpi-value">
                                        {(stats.buttonClicks.filter(b => b.rawName.includes('select_') || b.rawName.includes('pack_')).reduce((sum, b) => sum + b.count, 0))}
                                    </div>
                                    <div className="kpi-trend" style={{ color: '#4caf50', fontSize: '0.8rem', marginTop: '5px' }}>
                                        All pack interactions
                                    </div>
                                </div>
                            </div>

                        )}

                        {activeCategory === 'buttons' && <ButtonList />}

                        {activeCategory === 'video' && <VideoStats />}

                        {activeCategory === 'packs' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Pack Selection Breakdown</h3>
                                <div className="table-header">
                                    <span>Pack Type</span>
                                    <span className="text-right">Selections</span>
                                    <span className="text-right">Share</span>
                                </div>
                                {(() => {
                                    const packClicks = stats.buttonClicks.filter(b =>
                                        b.rawName.includes('select_') || b.rawName.includes('pack_')
                                    );
                                    const total = packClicks.reduce((sum, b) => sum + b.count, 0);
                                    return packClicks.map((btn, idx) => (
                                        <div key={idx} className="table-row">
                                            <div className="row-name">
                                                <MousePointer size={16} style={{ marginRight: '10px', color: '#4caf50' }} />
                                                {btn.name}
                                                <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '8px' }}>({btn.rawName})</span>
                                            </div>
                                            <div className="row-value">{btn.count}</div>
                                            <div className="row-value">{total > 0 ? Math.round((btn.count / total) * 100) : 0}%</div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        )}
                        {activeCategory === 'engagement' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Engagement Metrics</h3>
                                <div className="table-row">
                                    <span>Average Time on Page</span>
                                    <span className="row-value">{formatTime(stats.avgTimeOnPage)}</span>
                                </div>
                                <div className="table-row">
                                    <span>Buy Now (Main)</span>
                                    <span className="row-value">{stats.buttonClicks.find(b => b.rawName === 'buy_now_main')?.count || 0}</span>
                                </div>
                                <div className="table-row">
                                    <span>Bottom Sticky Bar Click</span>
                                    <span className="row-value">{stats.buttonClicks.find(b => b.rawName === 'claim_now_floating')?.count || 0}</span>
                                </div>
                            </div>
                        )}

                        {/* Advanced Metrics - Scroll Depth */}
                        {activeCategory === 'scroll' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Scroll Depth Distribution</h3>
                                {[25, 50, 75, 100].map(depth => {
                                    const count = stats.buttonClicks.find(b => b.rawName === `scroll_${depth}_percent`)?.count || 0;
                                    const maxCount = Math.max(...[25, 50, 75, 100].map(d =>
                                        stats.buttonClicks.find(b => b.rawName === `scroll_${d}_percent`)?.count || 0
                                    ));
                                    const percentage = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;

                                    return (
                                        <div key={depth} style={{ marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span>{depth}% Scroll</span>
                                                <span style={{ fontWeight: 'bold' }}>{count} users</span>
                                            </div>
                                            <div style={{ width: '100%', background: '#222', height: '30px', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${percentage}%`,
                                                    height: '100%',
                                                    background: depth === 100 ? '#4caf50' : '#2196f3',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    paddingLeft: '10px',
                                                    color: '#fff',
                                                    fontSize: '0.9rem',
                                                    transition: 'width 0.3s'
                                                }}>
                                                    {percentage}%
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* FAQ Clicks */}
                        {activeCategory === 'faqs' && (
                            <div className="analytics-list">
                                <h3 className="section-title">FAQ Interactions</h3>
                                <div className="table-header">
                                    <span>Question</span>
                                    <span className="text-right">Opens</span>
                                </div>
                                {(() => {
                                    const faqClicks = stats.buttonClicks.filter(b => b.rawName.startsWith('faq_'));
                                    return faqClicks.length > 0 ? faqClicks.map((faq, idx) => (
                                        <div key={idx} className="table-row">
                                            <div className="row-name">{faq.name}</div>
                                            <div className="row-value">{faq.count}</div>
                                        </div>
                                    )) : <div className="empty-state">No FAQ interactions yet</div>;
                                })()}
                            </div>
                        )}

                        {/* Carousel Engagement */}
                        {activeCategory === 'carousel' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Carousel Engagement</h3>
                                <div className="stats-grid">
                                    <div className="stat-box">
                                        <span className="stat-label">Carousel Previous</span>
                                        <span className="stat-number">{stats.buttonClicks.find(b => b.rawName === 'carousel_prev')?.count || 0}</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-label">Carousel Next</span>
                                        <span className="stat-number">{stats.buttonClicks.find(b => b.rawName === 'carousel_next')?.count || 0}</span>
                                    </div>
                                </div>
                                <div className="table-header" style={{ marginTop: '2rem' }}>
                                    <span>Dot Clicks</span>
                                    <span className="text-right">Count</span>
                                </div>
                                {(() => {
                                    const dotClicks = stats.buttonClicks.filter(b => b.rawName.startsWith('carousel_dot_'));
                                    return dotClicks.map((dot, idx) => (
                                        <div key={idx} className="table-row">
                                            <div className="row-name">{dot.name}</div>
                                            <div className="row-value">{dot.count}</div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        )}

                        {/* Dosage Cards */}
                        {activeCategory === 'dosage' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Dosage Interest</h3>
                                <div className="stats-grid">
                                    <div className="stat-box">
                                        <span className="stat-label">Single Dose</span>
                                        <span className="stat-number">{stats.buttonClicks.find(b => b.rawName === 'dosage_single_clicked')?.count || 0}</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-label">Double Dose</span>
                                        <span className="stat-number">{stats.buttonClicks.find(b => b.rawName === 'dosage_double_clicked')?.count || 0}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Ebook Toggle */}
                        {activeCategory === 'ebook' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Ebook Selection</h3>
                                <div className="stats-grid">
                                    <div className="stat-box">
                                        <span className="stat-label">Selected</span>
                                        <span className="stat-number" style={{ color: '#4caf50' }}>
                                            {stats.buttonClicks.find(b => b.rawName === 'ebook_selected')?.count || 0}
                                        </span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-label">Deselected</span>
                                        <span className="stat-number" style={{ color: '#ef5350' }}>
                                            {stats.buttonClicks.find(b => b.rawName === 'ebook_deselected')?.count || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Timer Awareness */}
                        {activeCategory === 'timer' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Timer Impact</h3>
                                <div className="stat-box" style={{ textAlign: 'center', padding: '2rem' }}>
                                    <span className="stat-label">Users who viewed with active timer</span>
                                    <span className="stat-number" style={{ fontSize: '3rem', color: '#ffc107' }}>
                                        {stats.buttonClicks.find(b => b.rawName === 'viewed_with_active_timer')?.count || 0}
                                    </span>
                                    <p style={{ marginTop: '1rem', color: '#888', fontSize: '0.9rem' }}>
                                        Users exposed to urgency messaging
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Section Visibility */}
                        {activeCategory === 'sections' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Section Views</h3>
                                <div className="table-header">
                                    <span>Section</span>
                                    <span className="text-right">Views</span>
                                </div>
                                {[
                                    { name: 'Trust Badges', raw: 'viewed_trust_badges_section' },
                                    { name: 'Benefits', raw: 'viewed_benefits_section' },
                                    { name: 'Testimonials', raw: 'viewed_testimonials_section' }
                                ].map((section, idx) => (
                                    <div key={idx} className="table-row">
                                        <div className="row-name">{section.name}</div>
                                        <div className="row-value">{stats.buttonClicks.find(b => b.rawName === section.raw)?.count || 0}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            ) : activePage === 'checkout' ? (
                <>
                    <CheckoutPageTabs />

                    <div className="tab-content animate-fade-in">
                        {activeCategory === 'overview' && (
                            <div className="kpi-grid">
                                <div className="kpi-card">
                                    <div className="kpi-label">Checkouts Started</div>
                                    <div className="kpi-value">
                                        {stats.buttonClicks.find(b => b.rawName === 'checkout_opened')?.count || 0}
                                    </div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-label">Pay Clicks</div>
                                    <div className="kpi-value">
                                        {stats.buttonClicks.find(b => b.rawName === 'pay_button_clicked')?.count || 0}
                                    </div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-label">Abandoned</div>
                                    <div className="kpi-value">
                                        {stats.buttonClicks.find(b => b.rawName === 'checkout_abandoned')?.count || 0}
                                    </div>
                                    <div className="kpi-trend" style={{ color: '#ef5350', fontSize: '0.8rem', marginTop: '5px' }}>
                                        Closed without paying
                                    </div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-label">Avg Time</div>
                                    <div className="kpi-value">{formatTime(stats.avgTimeOnPage)}</div>
                                    <div className="kpi-trend" style={{ color: '#888', fontSize: '0.8rem', marginTop: '5px' }}>
                                        In checkout modal
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeCategory === 'funnel' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Checkout Funnel</h3>
                                {(() => {
                                    const opened = stats.buttonClicks.find(b => b.rawName === 'checkout_opened')?.count || 0;
                                    const payClicked = stats.buttonClicks.find(b => b.rawName === 'pay_button_clicked')?.count || 0;
                                    const abandoned = stats.buttonClicks.find(b => b.rawName === 'checkout_abandoned')?.count || 0;

                                    const payRate = opened > 0 ? Math.round((payClicked / opened) * 100) : 0;
                                    const abandonRate = opened > 0 ? Math.round((abandoned / opened) * 100) : 0;

                                    return (
                                        <>
                                            <div className="funnel-step" style={{ marginBottom: '1rem' }}>
                                                <div className="funnel-bar" style={{
                                                    width: '100%',
                                                    background: '#2196f3',
                                                    height: '50px',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '0 1rem',
                                                    color: '#fff'
                                                }}>
                                                    <span style={{ fontWeight: 'bold' }}>Checkout Opened</span>
                                                    <span style={{ fontSize: '1.2rem' }}>{opened}</span>
                                                </div>
                                            </div>
                                            <div className="funnel-step" style={{ marginBottom: '1rem', width: `${payRate}%` }}>
                                                <div className="funnel-bar" style={{
                                                    width: '100%',
                                                    background: '#4caf50',
                                                    height: '50px',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '0 1rem',
                                                    color: '#fff',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    <span style={{ fontWeight: 'bold' }}>Pay Button Clicked</span>
                                                    <span style={{ fontSize: '1.2rem' }}>{payClicked} ({payRate}%)</span>
                                                </div>
                                            </div>
                                            {abandoned > 0 && (
                                                <div style={{ marginTop: '2rem', padding: '1rem', background: '#1a1a1a', borderRadius: '8px', borderLeft: '4px solid #ef5350' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ color: '#ef5350', fontWeight: 'bold' }}>❌ Abandoned Checkouts</span>
                                                        <span style={{ fontSize: '1.2rem', color: '#eee' }}>{abandoned} ({abandonRate}%)</span>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        )}

                        {activeCategory === 'form' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Form Field Focus Tracking</h3>
                                <div className="table-header">
                                    <span>Field Name</span>
                                    <span className="text-right">Focus Count</span>
                                    <span className="text-right">Engagement</span>
                                </div>
                                {(() => {
                                    const formFields = stats.buttonClicks.filter(b => b.rawName.startsWith('focus_'));
                                    const total = formFields.reduce((sum, b) => sum + b.count, 0);
                                    return formFields.length > 0 ? formFields.map((field, idx) => (
                                        <div key={idx} className="table-row">
                                            <div className="row-name">
                                                <MousePointer size={16} style={{ marginRight: '10px', color: '#ffc107' }} />
                                                {field.name.replace('Focus ', '')}
                                            </div>
                                            <div className="row-value">{field.count}</div>
                                            <div className="row-value">{total > 0 ? Math.round((field.count / total) * 100) : 0}%</div>
                                        </div>
                                    )) : (
                                        <div className="empty-state">No form interactions yet</div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </>
            ) : activePage === 'payment' ? (
                <>
                    <PaymentPageTabs />
                    <div className="content-section">
                        {activeCategory === 'overview' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Payment Analytics Overview</h3>
                                <div className="stats-grid">
                                    {(() => {
                                        const paymentOpened = stats.buttonClicks.find(b => b.rawName === 'payment_modal_opened')?.count || 0;
                                        const paymentSuccess = stats.buttonClicks.find(b => b.rawName === 'payment_success')?.count || 0;
                                        const paymentFailed = stats.buttonClicks.find(b => b.rawName === 'payment_failed')?.count || 0;
                                        const paymentAbandoned = stats.buttonClicks.find(b => b.rawName === 'payment_abandoned')?.count || 0;
                                        const successRate = paymentOpened > 0 ? Math.round((paymentSuccess / paymentOpened) * 100) : 0;

                                        return (
                                            <>
                                                <div className="stat-box">
                                                    <span className="stat-label">Payment Modals Opened</span>
                                                    <span className="stat-number">{paymentOpened}</span>
                                                </div>
                                                <div className="stat-box">
                                                    <span className="stat-label">Successful Payments</span>
                                                    <span className="stat-number" style={{ color: '#4caf50' }}>{paymentSuccess}</span>
                                                </div>
                                                <div className="stat-box">
                                                    <span className="stat-label">Failed Payments</span>
                                                    <span className="stat-number" style={{ color: '#ef5350' }}>{paymentFailed}</span>
                                                </div>
                                                <div className="stat-box">
                                                    <span className="stat-label">Abandoned</span>
                                                    <span className="stat-number" style={{ color: '#ff9800' }}>{paymentAbandoned}</span>
                                                </div>
                                                <div className="stat-box">
                                                    <span className="stat-label">Success Rate</span>
                                                    <span className="stat-number" style={{ color: successRate > 50 ? '#4caf50' : '#ef5350' }}>
                                                        {successRate}%
                                                    </span>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}

                        {activeCategory === 'funnel' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Payment Funnel</h3>
                                {(() => {
                                    const paymentOpened = stats.buttonClicks.find(b => b.rawName === 'payment_modal_opened')?.count || 0;
                                    const paymentSuccess = stats.buttonClicks.find(b => b.rawName === 'payment_success')?.count || 0;
                                    const paymentFailed = stats.buttonClicks.find(b => b.rawName === 'payment_failed')?.count || 0;
                                    const paymentAbandoned = stats.buttonClicks.find(b => b.rawName === 'payment_abandoned')?.count || 0;

                                    const successRate = paymentOpened > 0 ? Math.round((paymentSuccess / paymentOpened) * 100) : 0;
                                    const failureRate = paymentOpened > 0 ? Math.round((paymentFailed / paymentOpened) * 100) : 0;
                                    const abandonRate = paymentOpened > 0 ? Math.round((paymentAbandoned / paymentOpened) * 100) : 0;

                                    return paymentOpened > 0 ? (
                                        <>
                                            <div style={{ padding: '1.5rem', background: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                    <span style={{ fontWeight: 'bold' }}>💳 Payment Modal Opened</span>
                                                    <span style={{ fontSize: '1.2rem', color: '#eee' }}>{paymentOpened}</span>
                                                </div>
                                                <div style={{ background: '#0a0a0a', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: '100%', background: '#2196f3' }} />
                                                </div>
                                            </div>

                                            <div style={{ padding: '1.5rem', background: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                    <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✅ Payment Success</span>
                                                    <span style={{ fontSize: '1.2rem', color: '#eee' }}>{paymentSuccess} ({successRate}%)</span>
                                                </div>
                                                <div style={{ background: '#0a0a0a', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${successRate}%`, background: '#4caf50' }} />
                                                </div>
                                            </div>

                                            <div style={{ padding: '1.5rem', background: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                    <span style={{ color: '#ef5350', fontWeight: 'bold' }}>❌ Payment Failed</span>
                                                    <span style={{ fontSize: '1.2rem', color: '#eee' }}>{paymentFailed} ({failureRate}%)</span>
                                                </div>
                                                <div style={{ background: '#0a0a0a', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${failureRate}%`, background: '#ef5350' }} />
                                                </div>
                                            </div>

                                            <div style={{ padding: '1.5rem', background: '#1a1a1a', borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                    <span style={{ color: '#ff9800', fontWeight: 'bold' }}>🚪 Payment Abandoned</span>
                                                    <span style={{ fontSize: '1.2rem', color: '#eee' }}>{paymentAbandoned} ({abandonRate}%)</span>
                                                </div>
                                                <div style={{ background: '#0a0a0a', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${abandonRate}%`, background: '#ff9800' }} />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="empty-state">No payment data yet</div>
                                    );
                                })()}
                            </div>
                        )}

                        {activeCategory === 'errors' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Payment Errors Breakdown</h3>
                                <div className="table-header">
                                    <span>Error Type</span>
                                    <span className="text-right">Count</span>
                                    <span className="text-right">%</span>
                                </div>
                                {(() => {
                                    const errors = stats.buttonClicks.filter(b => b.rawName.startsWith('payment_error_'));
                                    const totalErrors = errors.reduce((sum, e) => sum + e.count, 0);

                                    return errors.length > 0 ? errors.map((error, idx) => (
                                        <div key={idx} className="table-row">
                                            <div className="row-name">
                                                <HelpCircle size={16} style={{ marginRight: '10px', color: '#ef5350' }} />
                                                {error.name.replace('Error: ', '')}
                                            </div>
                                            <div className="row-value">{error.count}</div>
                                            <div className="row-value">{totalErrors > 0 ? Math.round((error.count / totalErrors) * 100) : 0}%</div>
                                        </div>
                                    )) : (
                                        <div className="empty-state">No payment errors yet 🎉</div>
                                    );
                                })()}
                            </div>
                        )}

                        {activeCategory === 'methods' && (
                            <div className="analytics-list">
                                <h3 className="section-title">Payment Methods</h3>
                                <div className="empty-state">
                                    <HelpCircle size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <p>Payment method tracking requires server-side Razorpay API integration.</p>
                                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                                        Methods used (UPI, Card, Netbanking) are captured in webhooks.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="empty-state" style={{ marginTop: '2rem' }}>
                    <HelpCircle size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>Analytics for {activePage} page coming soon.</p>
                </div>
            )
            }

            <style>{`
                .deep-analytics .page-tabs {
                    display: flex;
                    gap: 1rem;
                    border-bottom: 1px solid #333;
                    margin-bottom: 1.5rem;
                }
                .deep-analytics .page-tab {
                    background: none;
                    border: none;
                    color: #888;
                    padding: 0.8rem 1.5rem;
                    cursor: pointer;
                    font-size: 1rem;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s;
                }
                .deep-analytics .page-tab.active {
                    color: #fff;
                    border-bottom-color: #4caf50;
                }
                .deep-analytics .sub-tabs {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 2rem;
                    background: #111;
                    padding: 0.5rem;
                    border-radius: 8px;
                    width: fit-content;
                }
                .deep-analytics .sub-tab-btn {
                    background: none;
                    border: none;
                    color: #888;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                .deep-analytics .sub-tab-btn.active {
                    background: #333;
                    color: #fff;
                }
                .analytics-list {
                    background: #111;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px solid #333;
                }
                .section-title {
                    margin-bottom: 1.5rem;
                    font-size: 1.1rem;
                    color: #ccc;
                }
                .table-header {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr;
                    padding: 0.8rem 1rem;
                    border-bottom: 1px solid #333;
                    color: #666;
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                .table-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr;
                    padding: 1rem;
                    border-bottom: 1px solid #222;
                    align-items: center;
                    color: #eee;
                }
                .table-row:last-child {
                    border-bottom: none;
                }
                .row-name {
                    display: flex;
                    align-items: center;
                }
                .text-right {
                    text-align: right;
                }
                .row-value {
                    text-align: right;
                    font-weight: 500;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }
                .stat-box {
                    background: #1a1a1a;
                    padding: 1.5rem;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .stat-label {
                    color: #888;
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                }
                .stat-number {
                    font-size: 2rem;
                    font-weight: 700;
                }
                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem;
                    color: #666;
                    background: #111;
                    border-radius: 8px;
                }
            `}</style>
        </div >
    );
};

export default DeepAnalyticsView;
