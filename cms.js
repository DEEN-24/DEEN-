/* DEEN — কন্টেন্ট পেজের শেয়ার্ড শেল ও সহায়ক ফাংশন।
   এই ফাইল deen.js-এর আগে লোড হবে। হেডারের মেনু deen.js নিজে বসায়। */
(function () {
  function shellTop() {
    return '' +
      '<div class="topbar"><div class="container topbar-inner">' +
        '<span>Knowledge Changes Lives &nbsp;|&nbsp; Established August 2024</span>' +
        '<div class="top-links">' +
          '<a href="https://www.facebook.com/profile.php?id=61583726953306" target="_blank" rel="noopener">Facebook</a>' +
          '<a href="https://youtube.com/@dawaheducatione-learningnexus" target="_blank" rel="noopener">YouTube</a>' +
          '<a href="https://wa.me/8801332991478" target="_blank" rel="noopener">WhatsApp</a>' +
        '</div></div></div>' +
      '<header id="siteHeader"></header>';
  }

  function shellBottom() {
    return '' +
      '<footer><div class="container"><div class="footer-grid">' +
        '<div class="footer-col"><div class="footer-brand">DEEN</div>' +
          '<p>Dawah Education &amp; E-learning Nexus. বিশুদ্ধ ইসলামী জ্ঞান, আধুনিক শিক্ষা ও প্রযুক্তির সমন্বয়ে একটি বৈশ্বিক জ্ঞানকেন্দ্র।</p>' +
          '<p style="color:#e2c987;margin-top:12px">Knowledge Changes Lives.</p></div>' +
        '<div class="footer-col"><h3>গুরুত্বপূর্ণ লিংক</h3><ul>' +
          '<li><a href="index.html">হোম</a></li>' +
          '<li><a href="Courses.html">কোর্সসমূহ</a></li>' +
          '<li><a href="apply.html">ভর্তির আবেদন</a></li>' +
          '<li><a href="donate.html">সহযোগিতা</a></li>' +
          '<li><a href="privacy.html">গোপনীয়তা নীতি</a></li>' +
          '<li><a href="refund.html">ফেরত নীতি</a></li></ul></div>' +
        '<div class="footer-col"><h3>যোগাযোগ</h3><ul>' +
          '<li>📞 01332991478</li><li>📞 01769668093</li><li>🌐 Online / Everywhere</li></ul></div>' +
      '</div>' +
      '<div class="footer-bottom">© 2026 DEEN — Dawah Education &amp; E-learning Nexus. All Rights Reserved.</div>' +
      '</div></footer>' +
      '<a class="whatsapp" href="https://wa.me/8801332991478" target="_blank" rel="noopener" aria-label="WhatsApp-এ যোগাযোগ করুন">✆</a>';
  }

  var topEl = document.getElementById('shellTop');
  var bottomEl = document.getElementById('shellBottom');
  if (topEl) topEl.innerHTML = shellTop();
  if (bottomEl) bottomEl.innerHTML = shellBottom();

  /* ---------- সহায়ক ফাংশন ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function safeLink(u) {
    u = String(u || '').trim();
    if (/^https:\/\/[^\s]+$/i.test(u)) return u;
    if (/^[a-z0-9_\-]+\.html(#[a-z0-9_\-]*)?$/i.test(u)) return u;
    if (/^#[a-z0-9_\-]*$/i.test(u)) return u;
    return '';
  }
  function safeImg(u) {
    u = String(u || '').trim();
    return /^https:\/\/[^\s]+$/i.test(u) ? u : '';
  }
  function fmtDate(d) {
    try { return new Date(d).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch (e) { return ''; }
  }

  // পেজের শিরোনাম/পরিচিতি/অবস্থা (site_pages থেকে)
  async function getSite(slug) {
    var sb = window.DEEN && window.DEEN.client;
    if (!sb) return null;
    var r = await sb.from('site_pages').select('*').eq('slug', slug).maybeSingle();
    if (r.error || !r.data) return null;
    return r.data;
  }

  function fillHero(p) {
    if (!p) return;
    var t = document.getElementById('heroTitle'); if (t && p.title) t.textContent = p.title;
    var s = document.getElementById('heroSub'); if (s) s.textContent = p.subtitle || '';
    var i = document.getElementById('heroIntro'); if (i) i.textContent = p.intro || '';
    var h = document.getElementById('hero');
    var img = safeImg(p.hero_image);
    if (h && img) h.style.setProperty('--hero-img', "url('" + img + "')");
    if (p.title) document.title = p.title + ' | DEEN — Knowledge Changes Lives';
  }

  function comingSoon(containerId, p) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var msg = (p && p.coming_soon_text) ? p.coming_soon_text : 'এই পেজটি শীঘ্রই চালু হবে।';
    el.innerHTML = '<div class="empty-box" style="padding:60px 24px">' +
      '<div style="font-size:44px;margin-bottom:14px">🌙</div>' +
      '<h3 style="color:var(--green);font-family:Playfair Display,serif;font-size:26px;margin-bottom:10px">শীঘ্রই আসছে</h3>' +
      '<p style="max-width:560px;margin:0 auto;line-height:1.85">' + esc(msg) + '</p></div>';
  }

  window.CMS = {
    esc: esc, safeLink: safeLink, safeImg: safeImg, fmtDate: fmtDate,
    getSite: getSite, fillHero: fillHero, comingSoon: comingSoon
  };
})();
