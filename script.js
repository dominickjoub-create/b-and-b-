/* ===== B&B Driving Academy — script ===== */
(function () {
  'use strict';

  // WhatsApp number in international format (SA 083 749 1860 -> 2783...)
  var WA_NUMBER = '27837491860';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Mobile nav ---- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  function closeMenu() {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---- Nav shadow on scroll ---- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll('.stat strong[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        if (reduceMotion) { el.textContent = target + suffix; co.unobserve(el); return; }
        var start = performance.now(), dur = 1400;
        (function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(start);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---- Hero card parallax (pointer) ---- */
  var cardWrap = document.getElementById('heroCards');
  if (cardWrap && !reduceMotion && window.matchMedia('(min-width: 901px)').matches) {
    var cards = cardWrap.querySelectorAll('.hcard');
    var raf = null, tx = 0, ty = 0;
    cardWrap.addEventListener('mousemove', function (ev) {
      var r = cardWrap.getBoundingClientRect();
      tx = (ev.clientX - r.left) / r.width - 0.5;
      ty = (ev.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    cardWrap.addEventListener('mouseleave', function () {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    function apply() {
      raf = null;
      cards.forEach(function (c) {
        var d = parseFloat(c.getAttribute('data-depth')) || 0.06;
        var mx = tx * d * 260;
        var my = ty * d * 200;
        var rot = tx * d * 40;
        c.style.transform = 'translate3d(' + mx.toFixed(1) + 'px,' + my.toFixed(1) + 'px,0) rotateY(' + rot.toFixed(1) + 'deg)';
      });
    }
    // subtle hover pop per-card
    cards.forEach(function (c) {
      c.addEventListener('mouseenter', function () { c.style.zIndex = 20; });
      c.addEventListener('mouseleave', function () { c.style.zIndex = ''; });
    });
  }

  /* ---- WhatsApp booking form ---- */
  var form = document.getElementById('bookForm');
  var note = document.getElementById('bfNote');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = form.name.value.trim();
      var area = form.area.value.trim();
      var service = form.service.value;
      var when = form.when.value.trim();

      // validate required fields
      var ok = true;
      [['name', name], ['area', area], ['service', service]].forEach(function (pair) {
        var field = form[pair[0]];
        if (!pair[1]) { field.classList.add('invalid'); ok = false; }
        else field.classList.remove('invalid');
      });
      if (!ok) {
        if (note) { note.textContent = 'Please fill in your name, area and service.'; note.style.color = '#E11B22'; }
        return;
      }

      var msg =
        'Hi B&B Driving Academy! 👋\n\n' +
        'I\'d like to book an appointment:\n' +
        '• Name: ' + name + '\n' +
        '• Area: ' + area + '\n' +
        '• Service: ' + service + '\n' +
        (when ? '• Preferred time: ' + when + '\n' : '') +
        '\nPlease let me know the next available slot. Thank you!';

      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
      if (note) { note.textContent = 'Opening WhatsApp…'; note.style.color = ''; }
      window.open(url, '_blank', 'noopener');
    });

    // clear invalid state on input
    form.querySelectorAll('input,select').forEach(function (el) {
      el.addEventListener('input', function () { el.classList.remove('invalid'); });
    });
  }
})();
