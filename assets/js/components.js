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
        { tag: 'Por escopo', h: 'Projeto fechado', p: 'Um ou mais serviços com entregáveis definidos: arquivos de fabricação, estudo de otimização ou ferramenta pronta para uso.' },
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
        { tag: 'Fixed scope', h: 'Project', p: 'One or more services with defined deliverables: fabrication files, an optimization study or a ready-to-use tool.' },
        { tag: 'Monthly plan', h: 'Embedded support', p: 'Computational design alongside your team throughout development, from first study to construction.', main: true }
      ]
    }
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  customElements.define('brd-engagement', class extends HTMLElement {
    connectedCallback() {
      var d = ENGAGEMENT[this.getAttribute('lang') === 'en' ? 'en' : 'pt'];
      var cards = d.cards.map(function (c) {
        return '<div' + (c.main ? ' class="main"' : '') + '><span class="tag">' + esc(c.tag) + '</span><h3>' + esc(c.h) + '</h3><p>' + esc(c.p) + '</p></div>';
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
