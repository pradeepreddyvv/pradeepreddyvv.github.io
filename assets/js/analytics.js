/* =============================================
   PORTFOLIO ANALYTICS - Visitor Tracking
   Uses ipapi.co for geolocation + Supabase for storage
   ============================================= */

(function () {
  'use strict';

  // ============ CONFIGURATION ============
  // Replace these with your Supabase project credentials
  const SUPABASE_URL = '__SUPABASE_URL__';
  const SUPABASE_ANON_KEY = '__SUPABASE_ANON_KEY__';
  const GEO_API = 'https://ipapi.co/json/';

  // Skip tracking if Supabase is not configured
  if (SUPABASE_URL.startsWith('__') || SUPABASE_ANON_KEY.startsWith('__')) {
    console.warn('[Analytics] Supabase not configured. Skipping tracking.');
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

  // ============ SUPABASE HELPERS ============
  function supabasePost(table, data) {
    return fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    });
  }

  function supabaseGet(table, query) {
    return fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    }).then(r => r.json());
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
        ip: geo.ip || null,
        page: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        screen_resolution: screen.width + 'x' + screen.height,
        visited_at: new Date().toISOString()
      };

      await supabasePost('visits', visitData);
    } catch (err) {
      // Silently fail - analytics should never break the site
      console.warn('[Analytics] Tracking failed:', err.message);
    }
  }

  // ============ PUBLIC API (for dashboard) ============
  window.PortfolioAnalytics = {
    supabaseGet: supabaseGet,

    async getStats() {
      const visits = await supabaseGet('visits', 'select=*&order=visited_at.desc');
      const uniqueFingerprints = new Set(visits.map(v => v.fingerprint));

      return {
        totalViews: visits.length,
        uniqueVisitors: uniqueFingerprints.size,
        visits: visits
      };
    },

    async getCityBreakdown() {
      const visits = await supabaseGet('visits', 'select=city,country,country_code,fingerprint');
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
      const visits = await supabaseGet('visits', `select=visited_at,fingerprint&visited_at=gte.${since.toISOString()}&order=visited_at.asc`);

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
      return supabaseGet('visits', `select=city,country,country_code,page,referrer,screen_resolution,visited_at&order=visited_at.desc&limit=${limit}`);
    }
  };

  // ============ INIT ============
  // Don't track if the visitor is on the analytics page itself
  if (!window.location.pathname.includes('analytics')) {
    trackVisit();
  }

})();
