/* ImageLab — visitor counter.
   Total via counterapi.dev (free, CORS, no signup) + localStorage cache.
   Today via localStorage (once per calendar day per browser). */
(function () {
  function fmt(n) {
    if (n == null || isNaN(n)) return '—';
    return Number(n).toLocaleString();
  }
  function setCount(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = fmt(val);
    el.classList.remove('loading');
  }

  // ── TODAY count ──────────────────────────────────────────────
  const todayStr  = new Date().toISOString().slice(0, 10);
  const seenToday = localStorage.getItem('il-seen-date') === todayStr;
  const seenSess  = sessionStorage.getItem('il-counted') === '1';

  if (!seenToday && !seenSess) {
    const prev = parseInt(localStorage.getItem('il-today-count') || '0');
    const next = prev + 1;
    localStorage.setItem('il-today-count', next);
    localStorage.setItem('il-seen-date', todayStr);
    sessionStorage.setItem('il-counted', '1');
    setCount('todayCount', next);
  } else {
    const current = parseInt(localStorage.getItem('il-today-count') || '1');
    setCount('todayCount', current);
  }

  const lastDate = localStorage.getItem('il-seen-date');
  if (lastDate && lastDate !== todayStr) {
    localStorage.removeItem('il-seen-date');
    localStorage.setItem('il-today-count', '0');
  }

  // ── TOTAL count — counterapi.dev (once per session) ──
  const API = 'https://api.counterapi.dev/v1/eknathalabs/imagelab-total/up';
  const hitAPI = sessionStorage.getItem('il-total-hit') !== '1';
  const endpoint = hitAPI ? API
    : 'https://api.counterapi.dev/v1/eknathalabs/imagelab-total';

  fetch(endpoint)
    .then(r => r.json())
    .then(d => {
      const val = d.count || d.value || d.hits;
      if (val != null) {
        if (hitAPI) sessionStorage.setItem('il-total-hit', '1');
        setCount('totalCount', val);
        localStorage.setItem('il-total-cache', val);
      } else throw new Error('no count field');
    })
    .catch(() => {
      const cached = localStorage.getItem('il-total-cache');
      setCount('totalCount', cached ? Number(cached).toLocaleString() : '—');
    });
})();
