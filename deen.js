/* DEEN — shared client.
   এখানে শুধু PUBLIC (publishable/anon) key থাকে। Secret key কখনো এখানে দেবেন না। */
(function () {
  /* নিরাপত্তা: অন্য কোনো সাইটের ভেতরে (iframe-এ) এই পেজ খুলতে দেবে না */
  if (window.top !== window.self) {
    try { window.top.location = window.self.location; }
    catch (e) { document.documentElement.style.display = 'none'; }
  }

  var SUPABASE_URL = 'https://wlczeivhwjxielbvjimj.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsY3plaXZod2p4aWVsYnZqaW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3MzMwNTYsImV4cCI6MjEwOTMwOTA1Nn0.4ocy5SfMFD68wR-G4Qs1IqbJISQPhY2oTMRYx4uTMRY';
  var WA_NUMBER = '8801332991478';

  var client = null;
  try {
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
    });
  } catch (e) { console.error('Supabase লোড হয়নি', e); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function bn(n) { return Number(n || 0).toLocaleString('en-US'); }
  function money(n, cur) { return (cur || '৳') + bn(n); }
  function wa(msg) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg); }
  function errMsg(e) {
    var m = (e && (e.message || e.error_description || e.msg)) || '';
    if (/Invalid login credentials/i.test(m)) return 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।';
    if (/already registered|already been registered/i.test(m)) return 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে। লগইন করুন।';
    if (/Password should be/i.test(m)) return 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।';
    if (/Failed to fetch|NetworkError/i.test(m)) return 'ইন্টারনেট সংযোগ বা সার্ভার সমস্যা। আবার চেষ্টা করুন।';
    return m || 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।';
  }
  function show(el, type, html) { if (!el) return; el.className = 'alert show ' + type; el.innerHTML = html; }
  function hide(el) { if (!el) return; el.className = 'alert'; el.innerHTML = ''; }

  var STATUS_LABEL = {
    pending_payment: 'পেমেন্ট বাকি',
    submitted: 'যাচাই চলছে',
    approved: 'অনুমোদিত',
    registered: 'সক্রিয়',
    rejected: 'বাতিল'
  };
  function statusBadge(s) {
    return '<span class="badge b-' + esc(s) + '">' + esc(STATUS_LABEL[s] || s) + '</span>';
  }
  var PAY_LABEL = { bkash: 'বিকাশ', nagad: 'নগদ', bank: 'ব্যাংক' };

  async function getSettings() {
    var r = await client.from('settings').select('*').eq('id', 1).single();
    if (r.error) throw r.error;
    return r.data;
  }
  async function getCourses() {
    var r = await client.from('courses').select('*').order('sort_order');
    if (r.error) throw r.error;
    return r.data || [];
  }
  async function getSession() {
    var r = await client.auth.getSession();
    return r.data ? r.data.session : null;
  }
  async function isAdmin() {
    var r = await client.rpc('is_admin');
    return !r.error && r.data === true;
  }

  function initSite() {
    document.documentElement.classList.add('js');

    var header = document.getElementById('siteHeader');
    if (header) {
      var onScroll = function () {
        header.style.boxShadow = window.scrollY > 10 ? '0 10px 30px rgba(0,0,0,.25)' : 'none';
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    var toggle = document.getElementById('menuToggle');
    var menu = document.getElementById('navMenu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('active');
        toggle.textContent = open ? '✕' : '☰';
        toggle.setAttribute('aria-expanded', String(open));
      });
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          menu.classList.remove('active');
          toggle.textContent = '☰';
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('in'); });
    }
  }

  window.DEEN = {
    client: client,
    esc: esc, bn: bn, money: money, wa: wa, errMsg: errMsg,
    show: show, hide: hide,
    statusBadge: statusBadge, STATUS_LABEL: STATUS_LABEL, PAY_LABEL: PAY_LABEL,
    getSettings: getSettings, getCourses: getCourses,
    getSession: getSession, isAdmin: isAdmin,
    initSite: initSite
  };

  document.documentElement.classList.add('js');
  document.addEventListener('DOMContentLoaded', initSite);
})();
