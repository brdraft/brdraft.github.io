// BRD · comportamento do site: menu, cabeçalho, capa paramétrica e animações.
// Todas as animações respeitam "reduzir movimento" do sistema operacional.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  if (!reduce) root.classList.add('anim');

  // ── menu mobile ──────────────────────────────────────────────────────────
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  // ── cabeçalho: linha ao rolar; some ao descer e volta ao subir ───────────
  var head = document.querySelector('.site-head');
  if (head) {
    var lastY = window.scrollY;
    var onScroll = function () {
      var y = window.scrollY;
      head.classList.toggle('scrolled', y > 8);
      if (!reduce) {
        var menuOpen = nav && nav.classList.contains('open');
        head.classList.toggle('hide', y > 160 && y > lastY + 2 && !menuOpen);
        if (y < lastY - 2) head.classList.remove('hide');
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── ano no rodapé ────────────────────────────────────────────────────────
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // ── capa: superfície de dupla curvatura seccionada em costelas ───────────
  // Desenha as costelas ao abrir, ondula devagar e se deforma perto do cursor.
  var svg = document.getElementById('ribs');
  if (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    var W = 600, H = 480, N = 26, SAMPLES = 56;
    var x0 = 40, x1 = 420, dx = 6, dy = 11, base = 150;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

    var spine = document.createElementNS(NS, 'path');
    spine.setAttribute('class', 'spine');
    svg.appendChild(spine);
    var ribs = [];
    for (var k = 0; k < N; k++) {
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('class', k % 5 === 0 ? 'rib k' : 'rib');
      p.setAttribute('pathLength', '1');
      p.style.setProperty('--i', k);
      svg.appendChild(p);
      ribs.push(p);
    }

    // cursor em coordenadas do SVG, suavizado
    var target = { x: -999, y: -999, s: 0 }, cur = { x: -999, y: -999, s: 0 };
    var art = svg.closest('.hero') || svg;
    art.addEventListener('pointermove', function (e) {
      var r = svg.getBoundingClientRect();
      var sc = Math.min(r.width / W, r.height / H);
      var ox = (r.width - W * sc) / 2, oy = (r.height - H * sc) / 2;
      target.x = (e.clientX - r.left - ox) / sc;
      target.y = (e.clientY - r.top - oy) / sc;
      target.s = 1;
      if (cur.x < -900) { cur.x = target.x; cur.y = target.y; }
    });
    art.addEventListener('pointerleave', function () { target.s = 0; });

    // animação de entrada: cada costela se desenha em sequência
    var DRAW_END = 0.2 + (N - 1) * 0.045 + 1.4;   // segundos até a última costela terminar
    var drawn = reduce;
    function intro(t) {
      if (drawn) return;
      for (var k = 0; k < N; k++) {
        var p = Math.max(0, Math.min(1, (t - 0.2 - k * 0.045) / 1.4));
        p = 1 - Math.pow(1 - p, 3);
        ribs[k].style.strokeDashoffset = (1 - p).toFixed(3);
        ribs[k].style.fillOpacity = (p < 0.6 ? 0 : (p - 0.6) / 0.4 * 0.92).toFixed(3);
      }
      spine.style.opacity = Math.max(0, Math.min(1, t - 1.6));
      if (t > DRAW_END + 1) {
        drawn = true;
        svg.classList.remove('drawing');
        ribs.forEach(function (r) { r.style.strokeDashoffset = ''; r.style.fillOpacity = ''; });
        spine.style.opacity = '';
      }
    }

    function draw(t) {
      var tops = [];
      for (var k = 0; k < N; k++) {
        var q = k / (N - 1);
        var amp = 70 + 55 * Math.sin(Math.PI * q) + (reduce ? 0 : 9 * Math.sin(t * 0.7 + q * 4.2));
        var skew = 0.35 * Math.sin(2 * Math.PI * q + (reduce ? 0 : t * 0.25));
        var d = '';
        for (var i = 0; i <= SAMPLES; i++) {
          var u = i / SAMPLES;
          var shape = Math.pow(Math.sin(Math.PI * u), 1.4) * (1 + skew * (u - 0.5));
          var x = x0 + (x1 - x0) * u + k * dx;
          var y = base + k * dy - amp * shape;
          if (cur.s > 0.001) {                       // deformação em volta do cursor
            var ddx = x - cur.x, ddy = (base + k * dy) - cur.y;
            y -= 46 * cur.s * shape * Math.exp(-(ddx * ddx + ddy * ddy) / 5200);
          }
          d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
          if (i === SAMPLES >> 1) tops.push(x.toFixed(1) + ',' + y.toFixed(1));
        }
        d += 'L' + (x1 + k * dx) + ',' + (base + k * dy + 18) + 'L' + (x0 + k * dx) + ',' + (base + k * dy + 18) + 'Z';
        ribs[k].setAttribute('d', d);
      }
      spine.setAttribute('d', 'M' + tops.join('L'));
    }

    draw(0);
    if (!reduce) {
      svg.classList.add('drawing');
      intro(0);
      // garante o desenho completo mesmo se o navegador atrasar os quadros
      setTimeout(function () { intro(DRAW_END + 2); }, (DRAW_END + 3) * 1000);
      var visible = true, t0 = performance.now();
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(svg);
      }
      (function loop(now) {
        if (visible && !document.hidden) {
          cur.x += (target.x - cur.x) * 0.12;
          cur.y += (target.y - cur.y) * 0.12;
          cur.s += (target.s - cur.s) * 0.06;
          var el = (now - t0) / 1000;
          intro(el);
          draw(el);
        }
        requestAnimationFrame(loop);
      })(t0);
    }
  }

  if (reduce) return;

  // ── entradas ao rolar ────────────────────────────────────────────────────
  // Cada grupo recebe um atraso crescente para os itens entrarem em sequência.
  var groups = [
    '.hero .container > div:first-child > *',
    '.sec-head > *',
    '.hire > div', '.facts > div',
    '.svc-text > *',
    '.caps > .cap', '.others > .tile',
    '.about .text > *', '.tools > div', '.chips > span',
    '.contact .container > div > *', '.contact-list > a',
    '.p-hero > *', '.p-body'
  ];
  var els = [];
  groups.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.classList.contains('reveal')) return;
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.classList.add('reveal');
      el.style.setProperty('--d', Math.min(idx, 8) * 70 + 'ms');
      els.push(el);
    });
  });
  // imagens: revelação em cortina
  document.querySelectorAll('.svc-media, .gallery figure, .proj .thumb').forEach(function (el) {
    var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.classList.add('wipe');
    el.style.setProperty('--d', Math.min(idx, 5) * 90 + 'ms');
    els.push(el);
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // ── brilho que segue o mouse nos cartões ─────────────────────────────────
  document.querySelectorAll('.hire > div, .cap, .others .tile, .contact-list a').forEach(function (el) {
    el.classList.add('glow');
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();
