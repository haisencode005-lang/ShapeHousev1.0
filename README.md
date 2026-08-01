# ShapeHouse

Site pronto para uso. As imagens de produto da loja já estão incluídas em
`images/produtos/`. Falta apenas a foto do hero da Home — até lá, o site
usa um fundo em gradiente como reserva visual.

## Imagens

Já incluídas (usadas automaticamente pela `loja.html`):

- `images/produtos/barra-porta.png`
- `images/produtos/barra-parede.png`
- `images/produtos/paralela-media.png`
- `images/produtos/paralela-baixa-madeira.png`
- `images/produtos/paralela-baixa-flexao.png`
- `images/produtos/superband.png`
- `images/produtos/kit-musculacao.png`
- `images/produtos/estacao-musculacao.png`

Ainda a adicionar:

- `images/banner/hero.jpg` — foto grande do hero da Home
- `images/logo/` — se quiser trocar o texto "ShapeHouse" do header por uma logo em imagem

## Loja — categorias

A loja está organizada em 4 categorias (`loja.html`), todas com produtos
ativos e link de compra:

- **Barras Fixas** — Barra de Porta, Barra de Parede
- **Paralelas** — Paralelas Média, Paralela Baixa de Chão (madeira), Paralela Baixa para Flexão
- **Elásticos** — Kit Super Band
- **Equipamentos** — Kit de Musculação, Estação de Musculação

Catálogo substituído por completo nesta rodada, conforme solicitado.

## Estrutura

```
ShapeHouse/
  index.html      → Home
  dieta.html      → Formulário + gerador de dieta
  treino.html     → Treino Personalizado (PPL/Full Body) + Treino TAF
  loja.html       → Loja com categorias e links de afiliado
  style.css       → Design system completo
  script.js       → Funções compartilhadas (menu, scroll reveal, header)
  dieta.js        → Cálculo de TMB/GET/macros e geração de refeições realistas
  treino.js       → Geração do treino (5-8 exercícios/dia) e do plano TAF progressivo
  loja.js         → Destaque de categoria ativa na loja conforme o scroll
  images/
    produtos/     → fotos reais dos produtos
    banner/       → hero da Home (a adicionar)
```
