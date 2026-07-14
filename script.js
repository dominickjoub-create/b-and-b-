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

  /* ---- Hero trust marquee ---- */
  var TRUST = [
    'Certified Instructors', 'Code 8 · 10 · 14', 'Learners Classes',
    'Test Booking Help', 'Pick-up & Drop-off', 'Open 7 Days a Week',
    'Affordable Packages'
  ];
  function buildMarquee(el) {
    if (!el) return;
    var html = '';
    // duplicated set for a seamless -50% loop
    for (var pass = 0; pass < 2; pass++) {
      TRUST.forEach(function (t, i) {
        var withB = t.replace('B&B', '<b>B&amp;B</b>');
        html += '<span class="m-item">' + withB + '</span>';
        html += '<span class="m-dot">◆</span>';
      });
    }
    el.innerHTML = html;
  }
  buildMarquee(document.getElementById('trustTrackD'));
  buildMarquee(document.getElementById('trustTrackM'));

  /* ---- Hero pixel-ripple canvas ---- */
  function initPixels() {
    var canvas = document.getElementById('pixelCanvas');
    if (!canvas) return;
    var wrap = canvas.parentElement;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var GAP = 7;
    var COLORS = ['#33436a', '#33436a', '#3d5486', '#c7d2e6', '#E11B22']; // muted navy + light + red accent
    var pixels = [];
    var animId = 0;
    var lastFrame = performance.now();
    var rand = function (min, max) { return Math.random() * (max - min) + min; };

    function build() {
      var rect = wrap.getBoundingClientRect();
      var w = Math.floor(rect.width);
      var h = Math.floor(rect.height);
      if (w === 0 || h === 0) return;
      // cap DPR-less pixel count on huge screens for perf
      canvas.width = w; canvas.height = h;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';

      pixels = [];
      var cx = w / 2, cy = h / 2;
      var speedBase = reduceMotion ? 0 : 0.03;
      for (var x = 0; x < w; x += GAP) {
        for (var y = 0; y < h; y += GAP) {
          var color = COLORS[(Math.random() * COLORS.length) | 0];
          var dx = x - cx, dy = y - cy;
          var delay = reduceMotion ? 0 : Math.sqrt(dx * dx + dy * dy) * 0.65;
          pixels.push({
            x: x, y: y, color: color,
            speed: rand(0.08, 0.4) * speedBase,
            size: 0, sizeStep: rand(0.12, 0.28),
            minSize: 0.5, maxSizeInt: 2, maxSize: rand(0.5, 2),
            delay: delay, counter: 0,
            counterStep: rand(1.8, 3.2) + (w + h) * 0.008,
            isIdle: false, isReverse: false, isShimmer: false
          });
        }
      }
    }

    function drawPixel(p) {
      var offset = p.maxSizeInt * 0.5 - p.size * 0.5;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + offset, p.y + offset, p.size, p.size);
    }
    function appear(p) {
      p.isIdle = false;
      if (p.counter <= p.delay) { p.counter += p.counterStep; return; }
      if (p.size >= p.maxSize) p.isShimmer = true;
      if (p.isShimmer) {
        if (p.size >= p.maxSize) p.isReverse = true;
        else if (p.size <= p.minSize) p.isReverse = false;
        p.size += p.isReverse ? -p.speed : p.speed;
      } else {
        p.size += p.sizeStep;
      }
      drawPixel(p);
    }

    var frameInterval = 1000 / 60;
    function loop() {
      animId = requestAnimationFrame(loop);
      var now = performance.now();
      var elapsed = now - lastFrame;
      if (elapsed < frameInterval) return;
      lastFrame = now - (elapsed % frameInterval);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < pixels.length; i++) appear(pixels[i]);
      if (reduceMotion) cancelAnimationFrame(animId);
    }

    build();
    if (reduceMotion) {
      // static field: draw each pixel once at full size, no animation
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var k = 0; k < pixels.length; k++) {
        pixels[k].size = pixels[k].maxSize;
        drawPixel(pixels[k]);
      }
      return;
    }
    loop();

    var rt;
    var ro = new ResizeObserver(function () {
      clearTimeout(rt);
      rt = setTimeout(function () { cancelAnimationFrame(animId); build(); lastFrame = performance.now(); loop(); }, 200);
    });
    ro.observe(wrap);

    // pause when hero off-screen to save battery
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { if (!animId) { lastFrame = performance.now(); loop(); } }
          else { cancelAnimationFrame(animId); animId = 0; }
        });
      }, { threshold: 0 }).observe(wrap);
    }
  }
  initPixels();

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
