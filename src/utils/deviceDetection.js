// Device detection utility
export const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Device Type Detection
    const getDeviceType = () => {
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'tablet';
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'mobile';
        }
        return 'desktop';
    };

    // Operating System Detection
    const getOS = () => {
        if (/windows phone/i.test(ua)) return 'Windows Phone';
        if (/android/i.test(ua)) return 'Android';
        if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return 'iOS';
        if (/Win/i.test(ua)) return 'Windows';
        if (/Mac/i.test(ua)) return 'MacOS';
        if (/Linux/i.test(ua)) return 'Linux';
        if (/X11/i.test(ua)) return 'UNIX';
        return 'Unknown';
    };

    // Browser Detection
    const getBrowser = () => {
        if (ua.indexOf('Firefox') > -1) return 'Firefox';
        if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
        if (ua.indexOf('Trident') > -1) return 'IE';
        if (ua.indexOf('Edge') > -1) return 'Edge';
        if (ua.indexOf('Chrome') > -1) return 'Chrome';
        if (ua.indexOf('Safari') > -1) return 'Safari';
        return 'Unknown';
    };

    return {
        deviceType: getDeviceType(),
        os: getOS(),
        browser: getBrowser(),
        screenResolution: `${screenWidth}x${screenHeight}`,
        viewportSize: `${viewportWidth}x${viewportHeight}`,
        userAgent: ua
    };
};
