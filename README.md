# BRD · site portfólio

Site estático (HTML + CSS + JS puro) para GitHub Pages. Sem build, sem dependências.

## Estrutura

```
index.html              home em português (one-page)
en/index.html           home em inglês
sobre.html              página Sobre (PT) · en/about.html (EN)
servicos/*.html         páginas dos 5 serviços (PT)
en/services/*.html      páginas dos 5 serviços (EN)
projetos/_modelo.html   modelo de página de projeto (PT)
en/projects/_template.html  modelo de página de projeto (EN)
assets/css/style.css    estilos (identidade BRD: Outfit + verde-sálvia)
assets/js/main.js       menu, cabeçalho, capa paramétrica interativa e animações
assets/js/components.js componentes reutilizáveis (ex.: <brd-engagement>), texto num lugar só
assets/img/             favicon e imagens
.nojekyll               evita processamento Jekyll no Pages
```

`brd-portfolio-otimizacao.html` é o catálogo de serviços original, usado como referência visual. Ele não faz parte do site. Tire-o do repositório ou mantenha-o como anexo da proposta.

## Publicar no GitHub Pages

O deploy é automático via GitHub Actions (`.github/workflows/pages.yml`): todo push/merge na `main` publica o site. Em Settings → Pages, a fonte deve estar em *GitHub Actions*.

O workflow publica só os arquivos do site: `backlog/`, `BACKLOG.md`, `README.md` e `brd-portfolio-otimizacao.html` ficam no repositório mas fora do Pages.
## Pendências (placeholders)

| O quê | Onde |
|---|---|
| LinkedIn | bloco comentado na seção contato (PT e EN) |

## Ativar a seção de projetos

1. Em `index.html`, remova o atributo `hidden` de `<section id="projetos">` e descomente o link "Projetos" no menu. Faça o mesmo em `en/index.html` (`#projects`).
2. Copie `projetos/_modelo.html` para `projetos/<slug>.html` (e o modelo EN para `en/projects/<slug>.html`), preencha e remova a linha `noindex`.
3. Coloque as imagens em `assets/img/projetos/<slug>/` e aponte os cards da home para as novas páginas.

## Componentes

Blocos que aparecem em mais de uma página ficam em `assets/js/components.js` e entram nas páginas como uma tag:

| Tag | O que é | Onde aparece |
|---|---|---|
| `<brd-engagement lang="pt">` / `lang="en"` | "Três formas de trabalhar com a BRD" | home e página Sobre |

Para mudar o texto, edite só o `components.js`. O atributo `compact` diminui o espaço acima da seção (é usado na home). A página precisa carregar `components.js` antes de `main.js`.

## Animações

Ficam em `assets/js/main.js` (comportamento) e no fim de `assets/css/style.css` (bloco "animações"):

- **Capa:** as costelas se desenham ao abrir, ondulam devagar e se deformam perto do cursor.
- **Entradas ao rolar:** títulos, cartões e etiquetas aparecem em sequência.
- **Imagens:** revelação em cortina ao entrar na tela.
- **Cartões:** brilho que segue o mouse.
- **Cabeçalho:** some ao rolar para baixo e volta ao subir.
- **Placeholders:** listras em movimento lento.

Tudo é desligado automaticamente quando o sistema do visitante pede "reduzir movimento", e na impressão todo o conteúdo aparece.
