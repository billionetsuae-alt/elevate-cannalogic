
import { supabase } from './supabase';
import { getDeviceInfo } from './deviceDetection';

// Helper to get or create a session ID
const getSessionId = () => {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
};

// Helper to detect device type (basic - kept for backward compatibility)
const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile';
    }
    return 'desktop';
};

export const trackEvent = async (eventType, pageName, elementId = null, value = null, metadata = {}) => {
    const sessionId = getSessionId();
    const device = getDeviceType();
    const deviceInfo = getDeviceInfo(); // Get comprehensive device info

    try {
        const { error } = await supabase
            .from('analytics_events')
            .insert({
                event_type: eventType,
                page_name: pageName,
                element_id: elementId,
                value: value ? String(value) : null,
                session_id: sessionId,
                device: device,
                metadata: {
                    ...metadata,
                    device_type: deviceInfo.deviceType,
                    os: deviceInfo.os,
                    browser: deviceInfo.browser,
                    screen_resolution: deviceInfo.screenResolution,
                    viewport_size: deviceInfo.viewportSize
                }
            });

        if (error) {
            console.warn('Analytics Error:', error);
        } else {
            // console.log(`📡 Tracked: ${eventType} - ${elementId || ''}`);
        }
    } catch (err) {
        console.warn('Analytics Exception:', err);
    }
};

export const EVENTS = {
    CLICK: 'click',
    PAGEVIEW: 'pageview',
    TIME_ON_PAGE: 'time_on_page',
    VIDEO_START: 'video_start',
    VIDEO_PAUSE: 'video_pause',
    VIDEO_COMPLETE: 'video_complete',
    VIDEO_PROGRESS: 'video_progress',
    SCROLL: 'scroll'
};
