/**
 * visitors.js — 访客计数 + 地理位置记录
 *
 * 数据存储：localStorage（纯前端，跨设备需后端）
 *   site-visit-count  : number  — 总访问次数
 *   site-visitors     : JSON[]  — 访客地理坐标列表 [{lat,lng,city,country,ts}]
 *
 * 调用：页面加载后 initVisitors() 自动运行
 */
(function () {
  const STORAGE_COUNT = 'site-visit-count';
  const STORAGE_VISITS = 'site-visitors';
  const SESSION_KEY = 'site-session-counted'; // 同一标签页只计一次
  const GEO_API = 'https://ipapi.co/json/';

  // ── 读写 helpers ──────────────────────────────────────────
  function getCount() {
    return parseInt(localStorage.getItem(STORAGE_COUNT) || '0', 10);
  }
  function saveCount(n) {
    localStorage.setItem(STORAGE_COUNT, String(n));
  }
  function getVisits() {
    try { return JSON.parse(localStorage.getItem(STORAGE_VISITS) || '[]'); }
    catch { return []; }
  }
  function saveVisits(arr) {
    // 最多保留 200 条
    const trimmed = arr.slice(-200);
    localStorage.setItem(STORAGE_VISITS, JSON.stringify(trimmed));
  }

  // ── 记录访问 ─────────────────────────────────────────────
  function recordVisit() {
    if (sessionStorage.getItem(SESSION_KEY)) return; // 已记录
    sessionStorage.setItem(SESSION_KEY, '1');

    const newCount = getCount() + 1;
    saveCount(newCount);

    // 更新计数显示
    const countEl = document.getElementById('visitor-count');
    if (countEl) countEl.textContent = newCount.toLocaleString();

    // 显示正在定位提示
    const statusEl = document.getElementById('geo-status');
    if (statusEl) statusEl.textContent = '⌛ 正在获取位置…';

    // 异步获取 IP 地理位置
    fetch(GEO_API)
      .then(r => r.json())
      .then(data => {
        const { latitude, longitude, city, country_name } = data;
        if (statusEl) statusEl.textContent = '';
        if (!latitude || !longitude) return;

        const visits = getVisits();
        visits.push({
          lat: latitude,
          lng: longitude,
          city: city || '',
          country: country_name || '',
          ts: Date.now()
        });
        saveVisits(visits);

        // 若地图已初始化，添加标记
        if (window._visitorMap) {
          addMarker(window._visitorMap, visits[visits.length - 1], true);
        }

        // 通知 stats 页面重新渲染国家排行
        document.dispatchEvent(new CustomEvent('visitor:geo-resolved'));
      })
      .catch(() => {
        if (statusEl) statusEl.textContent = '（位置获取失败）';
      });
  }

  // ── 在地图上添加一个标记 ──────────────────────────────────
  function addMarker(map, v, isNew) {
    if (!window.L) return;
    const circleColor = isNew ? '#ffffff' : '#8b0000';
    L.circleMarker([v.lat, v.lng], {
      radius: isNew ? 7 : 5,
      fillColor: circleColor,
      color: '#8b0000',
      weight: 2,
      opacity: 1,
      fillOpacity: isNew ? 1 : 0.75
    })
    .bindTooltip(
      [v.city, v.country].filter(Boolean).join(', ') || 'Unknown',
      { direction: 'top', offset: [0, -6] }
    )
    .addTo(map);
  }

  // ── 初始化 Leaflet 地图 ───────────────────────────────────
  function initMap() {
    const el = document.getElementById('visitor-map');
    if (!el || !window.L) return;

    const map = L.map('visitor-map', {
      center: [20, 10],
      zoom: 1.5,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true
    });
    window._visitorMap = map;

    // 淡色 tile（与白色学术风格一致）
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }
    ).addTo(map);

    // 渲染已有访客
    getVisits().forEach(v => addMarker(map, v, false));
  }

  // ── 公开入口 ──────────────────────────────────────────────
  window.initVisitors = function () {
    // 先把当前计数渲染到 DOM
    const countEl = document.getElementById('visitor-count');
    if (countEl) countEl.textContent = getCount().toLocaleString();

    initMap();
    recordVisit(); // 异步记录，不阻塞渲染
  };
})();
