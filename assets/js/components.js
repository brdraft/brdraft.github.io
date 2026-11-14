// BRD · componentes reutilizáveis
// Cada componente é uma tag própria (Custom Element). O conteúdo fica só aqui;
// as páginas apenas usam a tag, por exemplo:
//   <brd-engagement lang="pt"></brd-engagement>
//   <brd-engagement lang="en" compact></brd-engagement>   (compact = menos espaço acima)
// Funciona também abrindo os arquivos direto do disco (file://).

(function () {
  // ── Contratação / Engagement ────────────────────────────────────────────
  var ENGAGEMENT = {
    pt: {
      id: 'contratar',
      eyebrow: 'Contratação',
      title: 'Três formas de trabalhar com a BRD.',
      intro: 'Do parecer pontual ao acompanhamento contínuo junto da sua equipe.',
      cards: [
        { tag: 'Pontual', h: 'Diagnóstico', p: 'Um tema analisado sobre o projeto que você já tem, com parecer objetivo. Bom para saber se vale otimizar, racionalizar ou automatizar.' },
        { tag: 'Por escopo', h: 'Projeto fechado', green: true, p: 'Um ou mais serviços com entregáveis definidos: arquivos de fabricação, estudo de otimização ou ferramenta pronta para uso.' },
        { tag: 'Plano mensal', h: 'Acompanhamento', p: 'Design computacional junto da sua equipe durante todo o desenvolvimento, do primeiro estudo à obra.', main: true }
      ]
    },
    en: {
      id: 'engagement',
      eyebrow: 'Engagement',
      title: 'Three ways to work with BRD.',
      intro: 'From a one-off review to ongoing support alongside your team.',
      cards: [
        { tag: 'One-off', h: 'Assessment', p: 'One topic analysed on the design you already have, with a clear recommendation. A good way to find out whether it is worth optimizing, rationalizing or automating.' },
        { tag: 'Fixed scope', h: 'Project', green: true, p: 'One or more services with defined deliverables: fabrication files, an optimization study or a ready-to-use tool.' },
        { tag: 'Monthly plan', h: 'Embedded support', p: 'Computational design alongside your team throughout development, from first study to construction.', main: true }
      ]
    }
  };

  // ── Equipe / Team ───────────────────────────────────────────────────────
  // Fotos em assets/img/equipe/. Membros da equipe sem foto viram placeholder;
  // para preencher, troque name/role e informe img.
  var IMG = new URL('../img/equipe/', document.currentScript.src).href;
  var TEAM = {
    pt: {
      id: 'equipe', eyebrow: 'Fundadores', title: 'Quem está por trás da BRD.', team: 'Equipe',
      founders: [
        { name: 'Pitanga Vigand', role: 'Arquiteta · Co-fundadora', cau: 'CAU A292912-0', img: 'pitanga-vigand.jpg' },
        { name: 'Thiers Nobrega', role: 'Arquiteto · Co-fundador', cau: 'CAU A334933-0', img: 'thiers-nobrega.jpg' }
      ],
      members: [{ name: 'Em breve' }, { name: 'Em breve' }, { name: 'Em breve' }]
    },
    en: {
      id: 'team', eyebrow: 'Founders', title: 'The people behind BRD.', team: 'Team',
      founders: [
        { name: 'Pitanga Vigand', role: 'Architect · Co-founder', cau: 'CAU A292912-0', img: 'pitanga-vigand.jpg' },
        { name: 'Thiers Nobrega', role: 'Architect · Co-founder', cau: 'CAU A334933-0', img: 'thiers-nobrega.jpg' }
      ],
      members: [{ name: 'Coming soon' }, { name: 'Coming soon' }, { name: 'Coming soon' }]
    }
  };

  function person(p, big) {
    var pic = p.img
      ? '<img src="' + IMG + esc(p.img) + '" alt="' + esc(p.name) + '" width="720" height="720" loading="lazy">'
      : '<span aria-hidden="true"></span>';
    return '<figure class="person' + (big ? ' big' : '') + '">' +
      '<div class="avatar' + (p.img ? '' : ' media-ph') + '">' + pic + '</div>' +
      '<figcaption><strong>' + esc(p.name) + '</strong>' +
        (p.role ? '<span>' + esc(p.role) + '</span>' : '') +
        (p.cau ? '<span class="lbl">' + esc(p.cau) + '</span>' : '') +
      '</figcaption></figure>';
  }

  customElements.define('brd-team', class extends HTMLElement {
    connectedCallback() {
      var d = TEAM[this.getAttribute('lang') === 'en' ? 'en' : 'pt'];
      // founders-only: sem a faixa "Equipe"; first: primeira seção da página
      var members = this.hasAttribute('founders-only') ? '' :
        '<span class="lbl team-lbl">' + esc(d.team) + '</span>' +
        '<div class="team">' + d.members.map(function (p) { return person(p, false); }).join('') + '</div>';
      this.innerHTML =
        '<section class="block' + (this.hasAttribute('first') ? ' page-first' : '') + '" id="' + d.id + '">' +
          '<div class="container">' +
            '<div class="sec-head"><div><span class="eyebrow">' + esc(d.eyebrow) + '</span><h2>' + esc(d.title) + '</h2></div></div>' +
            '<div class="founders">' + d.founders.map(function (p) { return person(p, true); }).join('') + '</div>' +
            members +
          '</div>' +
        '</section>';
    }
  });

  // Versão compacta dos fundadores, para a seção de contato:
  //   <brd-founders-mini lang="pt"></brd-founders-mini>
  var MINI = { pt: 'Quem vai responder', en: 'Who will reply' };
  customElements.define('brd-founders-mini', class extends HTMLElement {
    connectedCallback() {
      var lang = this.getAttribute('lang') === 'en' ? 'en' : 'pt';
      this.innerHTML =
        '<div class="mini-founders"><span class="lbl">' + esc(MINI[lang]) + '</span><ul>' +
          TEAM[lang].founders.map(function (p) {
            return '<li><img src="' + IMG + esc(p.img) + '" alt="" width="96" height="96" loading="lazy">' +
              '<span><strong>' + esc(p.name) + '</strong><small>' + esc(p.role) + '</small>' +
              (p.cau ? '<small class="cau">' + esc(p.cau) + '</small>' : '') + '</span></li>';
          }).join('') +
        '</ul></div>';
    }
  });

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  customElements.define('brd-engagement', class extends HTMLElement {
    connectedCallback() {
      var d = ENGAGEMENT[this.getAttribute('lang') === 'en' ? 'en' : 'pt'];
      var cards = d.cards.map(function (c) {
        return '<div' + (c.main ? ' class="main"' : c.green ? ' class="green"' : '') + '><span class="tag">' + esc(c.tag) + '</span><h3>' + esc(c.h) + '</h3><p>' + esc(c.p) + '</p></div>';
      }).join('');
      this.innerHTML =
        '<section class="block' + (this.hasAttribute('compact') ? ' tight' : '') + '" id="' + d.id + '">' +
          '<div class="container">' +
            '<div class="sec-head"><div><span class="eyebrow">' + esc(d.eyebrow) + '</span><h2>' + esc(d.title) + '</h2></div><p>' + esc(d.intro) + '</p></div>' +
            '<div class="hire">' + cards + '</div>' +
          '</div>' +
        '</section>';
    }
  });
})();
