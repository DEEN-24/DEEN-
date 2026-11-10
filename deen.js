/* DEEN — শেয়ার্ড স্ক্রিপ্ট
   • ওয়েবসাইটের প্রধান মেনু (গ্রুপ/সাব মেনুসহ) নিজে থেকে বসায়
   • অ্যাডমিন পেজে অ্যাডমিন মেনু বসায়
   • শুধু PUBLIC (publishable/anon) key থাকে। Secret key কখনো এখানে দেবেন না। */
(function () {
  /* নিরাপত্তা: অন্য কোনো সাইটের ভেতরে (iframe-এ) এই পেজ খুলতে দেবে না */
  if (window.top !== window.self) {
    try { window.top.location = window.self.location; }
    catch (e) { document.documentElement.style.display = 'none'; }
  }

  /* ================= মেনু কাঠামো ================= */
  // items: [ফাইল, লেবেল, শীঘ্রই(1)]  — 'soon' মানে পেজটি এখনো আসেনি, মেনুতে "শীঘ্রই" দেখাবে
  var PUBLIC_MENU = [
    { label: 'হোম', href: 'index.html' },
    { label: 'প্রতিষ্ঠান', items: [
      ['about.html', 'আমাদের সম্পর্কে'],
      ['departments.html', 'বিভাগসমূহ'],
      ['careers.html', 'ক্যারিয়ার ও যোগদান', 1]
    ]},
    { label: 'একাডেমিক', items: [
      ['Courses.html', 'একাডেমিক ও কোর্সসমূহ'],
      ['quran.html', 'আল-কুরআন'],
      ['hadith.html', 'হাদীস']
    ]},
    { label: 'ইভেন্ট ও জ্ঞান', items: [
      ['events.html', 'ইভেন্ট ও নোটিশ'],
      ['blog.html', 'ব্লগ ও প্রকাশনা'],
      ['gallery.html', 'গ্যালারি'],
      ['testimonials.html', 'শিক্ষার্থীদের মতামত', 1]
    ]},
    { label: 'ভর্তি ও সহযোগিতা', items: [
      ['apply.html', 'ভর্তির আবেদন'],
      ['donate.html', 'সহযোগিতা'],
      ['faq.html', 'সচরাচর জিজ্ঞাসা', 1]
    ]},
    { label: 'যোগাযোগ', href: 'contact.html' },
    { label: 'পোর্টাল', items: [
      ['login.html', 'শিক্ষার্থী লগইন'],
      ['teachers.html', 'শিক্ষক ও স্টাফ পোর্টাল'],
      ['certificate.html', 'সনদ যাচাই ও সংগ্রহ']
    ]}
  ];

  var ADMIN_MENU = [
    { label: 'শিক্ষার্থী ও আবেদন', href: 'admin.html' },
    { label: 'শিক্ষক ও স্টাফ', href: 'admin-teachers.html' },
    { label: 'কন্টেন্ট', items: [
      ['admin-pages.html', 'পেজ ব্যবস্থাপনা'],
      ['admin-events.html', 'ইভেন্ট ও নোটিশ'],
      ['admin-learning.html', 'শিক্ষা ও পরীক্ষা'],
      ['grading.html', 'লিখিত খাতা ও নম্বর']
    ]},
    { label: 'ওয়েবসাইট দেখুন', href: 'index.html' },
    { label: 'লগআউট', href: '#', id: 'logoutBtn', cls: 'nav-cta' }
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function classes(list) {
    var c = list.filter(Boolean).join(' ');
    return c ? ' class="' + c + '"' : '';
  }

  function menuHtml(menu, cur) {
    var here = cur.toLowerCase();
    return '<ul class="nav-menu" id="navMenu">' + menu.map(function (m) {
      if (m.items) {
        var isActive = m.items.some(function (it) { return it[0].toLowerCase() === here; });
        return '<li class="dd"><button type="button" class="dd-btn' + (isActive ? ' active' : '') +
          '" aria-expanded="false">' + esc(m.label) + ' <span class="chev">▾</span></button>' +
          '<ul class="dd-menu">' + m.items.map(function (it) {
            var on = it[0].toLowerCase() === here;
            return '<li><a href="' + esc(it[0]) + '"' + classes([on ? 'active' : '', it[2] ? 'soon' : '']) + '>' +
              esc(it[1]) + '</a></li>';
          }).join('') + '</ul></li>';
      }
      var act = !!m.href && m.href.toLowerCase() === here;
      return '<li><a href="' + esc(m.href || '#') + '"' + classes([m.cls, act ? 'active' : '']) +
        (m.id ? ' id="' + m.id + '"' : '') + '>' + esc(m.label) + '</a></li>';
    }).join('') + '</ul>';
  }

  // হেডার বসানো (অ্যাডমিন পেজে অ্যাডমিন মেনু, বাকিতে ওয়েবসাইটের মেনু)
  function buildHeader() {
    var header = document.getElementById('siteHeader');
    if (!header) return;
    var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var isAdmin = /^admin/.test(file);
    var home = isAdmin ? 'admin.html' : 'index.html';
    header.innerHTML =
      '<div class="container navbar">' +
        '<a href="' + home + '" class="brand" aria-label="DEEN হোম">' +
          '<img src="images/logo.jpg" alt="DEEN Logo" onerror="this.style.display=\'none\'">' +
          '<div><div class="brand-name">DEEN</div><div class="brand-sub">' +
            (isAdmin ? 'ADMIN CONSOLE' : 'DAWAH EDUCATION &amp; E-LEARNING NEXUS') + '</div></div>' +
        '</a>' +
        '<button class="menu-toggle" id="menuToggle" aria-label="মেনু খুলুন" aria-expanded="false" aria-controls="navMenu">☰</button>' +
        menuHtml(isAdmin ? ADMIN_MENU : PUBLIC_MENU, file) +
      '</div>';
  }
  buildHeader(); // স্ক্রিপ্ট লোড হওয়ার সময়ই, যাতে পরের সব বাটন ঠিকভাবে যুক্ত হয়

  /* ================= Supabase ================= */
  var SUPABASE_URL = 'https://wlczeivhwjxielbvjimj.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsY3plaXZod2p4aWVsYnZqaW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3MzMwNTYsImV4cCI6MjEwOTMwOTA1Nn0.4ocy5SfMFD68wR-G4Qs1IqbJISQPhY2oTMRYx4uTMRY';
  var WA_NUMBER = '8801332991478';

  var client = null;
  try {
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
    });
  } catch (e) { console.error('Supabase লোড হয়নি', e); }

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
    pending_payment: 'পেমেন্ট বাকি', submitted: 'যাচাই চলছে',
    approved: 'অনুমোদিত', registered: 'সক্রিয়', rejected: 'বাতিল'
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

  /* ================= পেজের আচরণ ================= */
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

    // সাব মেনু (ড্রপডাউন)
    document.querySelectorAll('.dd-btn').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var li = b.parentElement;
        var open = !li.classList.contains('open');
        document.querySelectorAll('.dd.open').forEach(function (x) {
          x.classList.remove('open');
          x.querySelector('.dd-btn').setAttribute('aria-expanded', 'false');
        });
        if (open) li.classList.add('open');
        b.setAttribute('aria-expanded', String(open));
      });
    });
    document.addEventListener('click', function () {
      document.querySelectorAll('.dd.open').forEach(function (x) {
        x.classList.remove('open');
        x.querySelector('.dd-btn').setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') document.querySelectorAll('.dd.open').forEach(function (x) { x.classList.remove('open'); });
    });

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

  /* ================= অ্যাপ হিসেবে ইনস্টল (PWA) ================= */
  (function setupApp() {
    var head = document.head;
    if (head && !document.querySelector('link[rel="manifest"]')) {
      var m = document.createElement('link');
      m.rel = 'manifest'; m.href = 'manifest.json';
      head.appendChild(m);
    }
    if (head && !document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
      [['apple-mobile-web-app-capable', 'yes'],
       ['apple-mobile-web-app-title', 'DEEN'],
       ['apple-mobile-web-app-status-bar-style', 'black-translucent']].forEach(function (p) {
        var t = document.createElement('meta'); t.name = p[0]; t.content = p[1]; head.appendChild(t);
      });
    }
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () { /* অফলাইন সুবিধা ছাড়াই সাইট চলবে */ });
      });
    }
  })();

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
