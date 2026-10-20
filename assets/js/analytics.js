/* =============================================
   PORTFOLIO ANALYTICS - Visitor Tracking
   Uses ipapi.co for geolocation + an AWS Lambda/DynamoDB API for storage
   (aws/portfolio-analytics; replaced Supabase in Oct 2026)
   ============================================= */

(function () {
  'use strict';

  // ============ CONFIGURATION ============
  // Public Lambda Function URL (not a secret: it only accepts visits; reading them needs the dashboard password).
  const API_URL = 'https://rlqjcy5xg46rnouu7f3t75zmua0hfypc.lambda-url.us-west-2.on.aws/';
  const GEO_API = 'https://ipapi.co/json/';

  if (API_URL.startsWith('__')) {
    console.warn('[Analytics] API not configured. Skipping tracking.');
    return;
  }

  // ============ FINGERPRINT ============
  // Generate a simple browser fingerprint (no cookies, no PII)
  function generateFingerprint() {
    const raw = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      new Date().getTimezoneOffset()
    ].join('|');

    // Simple hash (djb2)
    let hash = 5381;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) + hash) + raw.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit int
    }
    return 'fp_' + Math.abs(hash).toString(36);
  }

  // ============ API HELPERS ============
  const base = API_URL.replace(/\/+$/, '');
  function postVisit(data) {
    return fetch(`${base}/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true
    });
  }

  // Dashboard: one request per page load; every view below is computed from it.
  let visitsPromise = null;
  function getVisits(password) {
    if (!visitsPromise) {
      visitsPromise = fetch(`${base}/visits`, { headers: { 'x-dashboard-password': password || sessionStorage.getItem('analytics_pw') || '' } })
        .then(async r => {
          if (r.status === 401) throw Object.assign(new Error('Wrong password'), { unauthorized: true });
          if (!r.ok) throw new Error(`Analytics API HTTP ${r.status}`);
          return (await r.json()).visits;
        })
        .catch(e => { visitsPromise = null; throw e; });
    }
    return visitsPromise;
  }

  // ============ TRACK VISIT ============
  async function trackVisit() {
    try {
      const fingerprint = generateFingerprint();

      // Get geolocation from IP
      const geo = await fetch(GEO_API).then(r => r.json());

      const visitData = {
        fingerprint: fingerprint,
        city: geo.city || 'Unknown',
        region: geo.region || 'Unknown',
        country: geo.country_name || 'Unknown',
        country_code: geo.country_code || '--',
        latitude: geo.latitude || null,
        longitude: geo.longitude || null,
        timezone: geo.timezone || null,
        page: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        screen_resolution: screen.width + 'x' + screen.height
      };

      await postVisit(visitData);
    } catch (err) {
      // Silently fail - analytics should never break the site
      console.warn('[Analytics] Tracking failed:', err.message);
    }
  }

  // ============ PUBLIC API (for dashboard) ============
  window.PortfolioAnalytics = {
    /** Checks the password on the server (throws {unauthorized} if wrong) and keeps it for this browser tab. */
    async login(password) {
      visitsPromise = null;
      await getVisits(password);
      sessionStorage.setItem('analytics_pw', password);
    },

    async getStats() {
      const visits = await getVisits();
      const uniqueFingerprints = new Set(visits.map(v => v.fingerprint));

      return {
        totalViews: visits.length,
        uniqueVisitors: uniqueFingerprints.size,
        visits: visits
      };
    },

    async getCityBreakdown() {
      const visits = await getVisits();
      const cityMap = {};
      visits.forEach(v => {
        const key = `${v.city}, ${v.country}`;
        if (!cityMap[key]) {
          cityMap[key] = { city: v.city, country: v.country, country_code: v.country_code, views: 0, unique: new Set() };
        }
        cityMap[key].views++;
        cityMap[key].unique.add(v.fingerprint);
      });

      return Object.values(cityMap)
        .map(c => ({ ...c, uniqueVisitors: c.unique.size, unique: undefined }))
        .sort((a, b) => b.views - a.views);
    },

    async getDailyViews(days = 30) {
      const since = new Date();
      since.setDate(since.getDate() - days);
      const visits = (await getVisits())
        .filter(v => v.visited_at && new Date(v.visited_at) >= since)
        .sort((a, b) => a.visited_at.localeCompare(b.visited_at));

      const dailyMap = {};
      visits.forEach(v => {
        const day = v.visited_at.split('T')[0];
        if (!dailyMap[day]) dailyMap[day] = { views: 0, unique: new Set() };
        dailyMap[day].views++;
        dailyMap[day].unique.add(v.fingerprint);
      });

      return Object.entries(dailyMap).map(([date, data]) => ({
        date,
        views: data.views,
        uniqueVisitors: data.unique.size
      }));
    },

    async getRecentVisitors(limit = 50) {
      return (await getVisits()).slice(0, limit);
    }
  };

  // ============ INIT ============
  // Don't track if the visitor is on the analytics page itself
  if (!window.location.pathname.includes('analytics')) {
    trackVisit();
  }

})();
