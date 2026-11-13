// BRD · comportamento mínimo do site (menu, cabeçalho, desenho da capa)
(function () {
  // menu mobile
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

  // linha sob o cabeçalho ao rolar
  var head = document.querySelector('.site-head');
  if (head) {
    var onScroll = function () { head.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ano no rodapé
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // capa: superfície de dupla curvatura seccionada em costelas (como a forma CNC)
  var svg = document.getElementById('ribs');
  if (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    var W = 600, H = 480, N = 26, SAMPLES = 60;
    var x0 = 40, x1 = 420, dx = 6, dy = 11, base = 150;
    var tops = [];
    for (var k = 0; k < N; k++) {
      var t = k / (N - 1);
      var amp = 70 + 55 * Math.sin(Math.PI * t);          // altura varia ao longo do vão
      var skew = 0.35 * Math.sin(2 * Math.PI * t);         // a crista se desloca
      var d = '';
      for (var i = 0; i <= SAMPLES; i++) {
        var u = i / SAMPLES;
        var shape = Math.pow(Math.sin(Math.PI * u), 1.4) * (1 + skew * (u - 0.5));
        var x = x0 + (x1 - x0) * u + k * dx;
        var y = base + k * dy - amp * shape;
        d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
        if (i === Math.round(SAMPLES * 0.5)) tops.push([x, y]);
      }
      // fecha a costela até a base (perfil da peça)
      d += 'L' + (x1 + k * dx).toFixed(1) + ',' + (base + k * dy + 18).toFixed(1) +
           'L' + (x0 + k * dx).toFixed(1) + ',' + (base + k * dy + 18).toFixed(1) + 'Z';
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('class', k % 5 === 0 ? 'rib k' : 'rib');
      svg.appendChild(p);
    }
    // longarina ligando as cristas
    var s = document.createElementNS(NS, 'path');
    s.setAttribute('d', tops.map(function (pt, i) { return (i ? 'L' : 'M') + pt[0].toFixed(1) + ',' + pt[1].toFixed(1); }).join(''));
    s.setAttribute('class', 'spine');
    svg.insertBefore(s, svg.firstChild);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  }
})();
