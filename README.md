gere um app pra mim praticar o método doomsday com base nisso: 

# 📖 Doomsday Mind — Documentação Completa do Projeto

> Documentação técnica gerada por análise direta do código-fonte real do repositório.
> Nada aqui foi presumido: tudo que está descrito existe no código; o que não pôde ser confirmado está marcado como **"não identificado no código"**.

---

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Estrutura de arquivos e pastas](#2-estrutura-de-arquivos-e-pastas)
3. [index.html — estrutura e componentes](#3-indexhtml--estrutura-e-componentes)
4. [styles.css — layout, tema e responsividade](#4-stylescss--layout-tema-e-responsividade)
5. [Paleta visual e tipografia](#5-paleta-visual-e-tipografia)
6. [app.js — lógica, estados e eventos](#6-appjs--lógica-estados-e-eventos)
7. [PWA — manifest, Service Worker e instalação](#7-pwa--manifest-service-worker-e-instalação)
8. [Dados, armazenamento e APIs](#8-dados-armazenamento-e-apis)
9. [Como HTML, CSS e JS se conectam — fluxos de execução](#9-como-html-css-e-js-se-conectam--fluxos-de-execução)
10. [Responsividade e acessibilidade](#10-responsividade-e-acessibilidade)
11. [Problemas, inconsistências e código não utilizado](#11-problemas-inconsistências-e-código-não-utilizado)
12. [Resumo geral](#12-resumo-geral)

---

## 1. Visão geral

**Doomsday Mind** é um Progressive Web App (PWA) de página única (SPA) para treinar o **método Doomsday de John H. Conway** — técnica de cálculo mental do dia da semana de qualquer data do calendário gregoriano.

- **Tecnologias:** HTML5, CSS3 e JavaScript puro (vanilla, ES2017+). **Zero dependências**, sem frameworks, sem bundler, sem build.
- **Idioma da interface:** português do Brasil (`lang="pt-BR"`).
- **Recursos externos:** apenas Google Fonts (Inter e JetBrains Mono), com fallback para fontes do sistema.
- **Persistência:** `localStorage` do navegador (sem backend, sem servidor de dados).
- **PWA:** instalável (com foco em iPhone/iOS), funciona 100% offline após a primeira visita.

---

## 2. Estrutura de arquivos e pastas


Doomsday-Mind/
├── index.html            (286 linhas) — estrutura da SPA: 3 painéis (Praticar/Aprender/Estatísticas)
├── styles.css            (341 linhas) — tema escuro completo, responsividade, animações
├── app.js                (666 linhas) — toda a lógica: método Doomsday, perguntas, correção, timer, stats, PWA
├── sw.js                 (111 linhas) — Service Worker: pré-cache, estratégias de cache, offline
├── manifest.webmanifest  (22 linhas)  — manifesto do PWA (nome, ícones, cores, display)
├── README.md             — contém apenas o título "# Doomsday-Mind"
└── icons/
    ├── icon-120.png   (120×120)  — apple-touch-icon (iPhone @2x legado)
    ├── icon-152.png   (152×152)  — apple-touch-icon (iPad)
    ├── icon-167.png   (167×167)  — apple-touch-icon (iPad Pro)
    ├── icon-180.png   (180×180)  — apple-touch-icon principal (iPhone @3x)
    ├── icon-192.png   (192×192)  — ícone padrão PWA/Android
    ├── icon-512.png   (512×512)  — ícone padrão PWA (splash/instalação)
    └── icon-1024.png  (1024×1024) — ícone grande, marcado como "any maskable" no manifest


Os ícones são PNGs com a arte do app: um calendário com um cérebro em estilo neon roxo sobre fundo azul-marinho escuro, preenchendo o quadrado de borda a borda (o iOS aplica a própria máscara arredondada).

**Dependências:** nenhuma (não há `package.json`, `node_modules` nem gerenciador de pacotes). Não há framework CSS nem biblioteca JS.

---

## 3. index.html — estrutura e componentes

Documento único com `<head>` configurado para PWA/iOS e um `<body>` composto por: container `.app` → header → 3 painéis `<main>` → footer → banner iOS → `<script src="app.js">`.

### 3.1 `<head>`

| Elemento | Função |
|---|---|
| `<meta viewport>` com `viewport-fit=cover` | Permite que o layout ocupe a área do notch/Dynamic Island no iPhone |
| `<meta name="description">` | Descrição para buscadores |
| `<link rel="manifest" href="manifest.webmanifest">` | Registro do manifesto PWA |
| `<meta name="theme-color" content="#0b0e14">` | Cor da UI do navegador |
| `apple-mobile-web-app-capable` + `mobile-web-app-capable` = `yes` | Modo tela cheia quando instalado |
| `apple-mobile-web-app-status-bar-style` = `black-translucent` | Barra de status translúcida no iOS |
| `apple-mobile-web-app-title` = `"Doomsday"` | Nome curto sob o ícone na tela de início |
| `format-detection` = `telephone=no` | Impede o iOS de transformar números em links de telefone |
| 5 `<link rel="apple-touch-icon">` (default/120/152/167/180) | Ícones da tela de início do iOS |
| `<link rel="icon" sizes="192x192">` | Favicon PNG |
| Google Fonts (preconnect + stylesheet) | Fontes Inter e JetBrains Mono |
| `<link rel="stylesheet" href="styles.css">` | Folha de estilo única |

### 3.2 Header (`.header`)

- **`.brand`** — logotipo `.logo` (emoji ☠️ em quadrado com gradiente roxo), título `<h1>` "Doomsday **Mind**" (a palavra "Mind" recebe cor de destaque via `<span>`) e tagline `.tagline`.
- **`.tabs`** — navegação com 3 botões `.tab`, cada um com `data-tab` (`practice`, `learn`, `stats`). O botão ativo recebe a classe `.active`. Controlam qual `<main class="panel">` fica visível.

### 3.3 Painel Praticar (`#panel-practice`)

É o coração do app. Contém 4 seções:

**a) Barra de configuração (`.config-bar`)** — três grupos `.config-group`, cada um com um rótulo `<label>` e um controle segmentado `.seg` de botões `.seg-btn`:

| Controle | ID | Atributo data | Opções |
|---|---|---|---|
| Modo de treino | `#mode-seg` | `data-mode` | `full` (Data completa), `century` (Âncora do século), `year` (Doomsday do ano), `month` (Referência do mês) |
| Intervalo de anos | `#range-seg` | `data-range` | `1900,1999` • `1900,2099` (ativo por padrão) • `2000,2099` • `1800,2199` • `1583,2500` |
| Cronômetro | `#timer-seg` | `data-timer` | `0` (Livre, padrão) • `120` • `60` • `30` • `15` (segundos) |

**b) Faixa de sessão (`.session-strip`)** — 6 "chips" com estatísticas da sessão atual: `#s-count` (perguntas), `#s-correct` (acertos, chip verde), `#s-wrong` (erros, chip vermelho), `#s-streak` (🔥 sequência, chip âmbar), `#s-acc` (precisão %), `#s-avg` (tempo médio).

**c) Cartão da pergunta (`#question-card`)** —
- `#q-mode-badge`: selo com o nome do modo atual;
- `#q-timer` / `#q-timer-value`: cronômetro (crescente no modo livre, regressivo com ⏳ nos modos com limite; ganha classe `.urgent` nos 5s finais);
- `#q-prompt`: enunciado ("Em que dia da semana caiu…", etc.);
- `#q-main`: o dado principal em fonte grande (a data, o ano, o século ou o mês);
- `#q-sub`: linha auxiliar (data por extenso, aviso de ano bissexto, etc.);
- **`#answers-week`**: 7 botões `.ans`, um por dia da semana, cada um com `data-dow` de 0 (Domingo) a 6 (Sábado) e um `<kbd>` mostrando o atalho de teclado (1–7);
- **`#answers-num`**: alternativa numérica usada só no modo "Referência do mês" — `<input type="number" id="num-input">` com `inputmode="numeric"` e `pattern="[0-9]*"` (abre o teclado numérico do iOS) + botão `#num-submit` "Responder ↵";
- `#btn-skip`: botão "Pular (Esc)".

**d) Cartão de feedback (`#feedback`)** — oculto até a resposta; mostra:
- `#fb-verdict`: veredito (✅ Acertou! / ❌ Errou! / ⏰ Tempo esgotado! / ⏭️ Pergunta pulada);
- `#fb-meta`: tempo gasto;
- `#fb-answer`: resposta correta (e a resposta errada dada, quando houver);
- `<details id="fb-steps" open>` com `#steps-container`: a **correção passo a passo**, gerada dinamicamente pelo JS;
- `#btn-next`: "Próxima pergunta ↵".

### 3.4 Painel Aprender (`#panel-learn`)

Grade `.learn-grid` com 6 cartões `.card` de conteúdo estático educativo:
1. O que é o método Doomsday (história e as 3 etapas);
2. Tabela das âncoras dos séculos (1700–2199) + fórmula em `<code>` + mnemônico;
3. Doomsday do ano — fórmula a/b/c em bloco `.formula`, exemplo de 1985 e o método alternativo "ímpar + 11";
4. Tabela das datas-referência dos 12 meses com mnemônicos (usa `rowspan` para agrupar os grupos "meses pares" e "9-às-5 no 7-Eleven");
5. Exemplo completo resolvido: 20/07/1969 (chegada à Lua) + dica `.tip` sobre anos bissextos;
6. Tabela de atalhos do teclado.

### 3.5 Painel Estatísticas (`#panel-stats`)

- `.stats-grid` com 6 `.stat-card`: `#g-total`, `#g-acc`, `#g-best-streak`, `#g-avg-time`, `#g-best-time`, `#g-today`;
- Cartão "Últimas 50 tentativas": `#history-dots` (quadradinhos coloridos) + `.legend` (verde=acerto, vermelho=erro, âmbar=tempo esgotado/pulada);
- Cartão "Desempenho por modo": tabela `#mode-table` com corpo `#mode-table-body` preenchido pelo JS;
- Cartão "Evolução da precisão": `<canvas id="progress-chart" width="900" height="220">`;
- `.danger-zone` com `#btn-reset-stats` ("🗑️ Apagar todo o histórico").

### 3.6 Elementos finais

- `.footer`: créditos do método e nota sobre o calendário gregoriano (a partir de 1583);
- **`#ios-banner`** (`.ios-install-banner`, inicia com `.hidden`): banner fixo de instalação para iOS com o ícone do app, texto ensinando a usar Compartilhar → "Adicionar à Tela de Início" (inclui um SVG inline do ícone de compartilhar do iOS) e botão de fechar `#ios-banner-close` com `aria-label="Fechar"`.

---

## 4. styles.css — layout, tema e responsividade

### 4.1 Fundações

- **Variáveis CSS** em `:root` (todas as cores do tema — ver seção 5) e `--mono` para a fonte monoespaçada.
- Reset universal `* { margin:0; padding:0; box-sizing:border-box }` e `color-scheme: dark`.
- **`body`**: fundo composto por dois `radial-gradient` (brilho roxo no canto superior direito, brilho verde suave à esquerda) sobre `--bg`; `min-height: 100vh` com fallback progressivo para `100dvh`; otimizações mobile: `-webkit-tap-highlight-color: transparent`, `-webkit-text-size-adjust: 100%`, `-webkit-touch-callout: none`, `overscroll-behavior-y: none` (remove o "bounce" de scroll do iOS).
- Botões e tabs recebem `user-select: none` e `touch-action: manipulation` (elimina o atraso/zoom de duplo toque); inputs mantêm seleção de texto.
- **`.app`**: container central com `max-width: 1060px` e padding somado a `env(safe-area-inset-*)` nos 4 lados — respeita notch, Dynamic Island e barra home do iPhone.

### 4.2 Componentes (resumo dos estilos)

| Componente | Destaques visuais |
|---|---|
| `.logo` | 52×52px, raio 14px, gradiente 135° `--accent`→`#4b34b8`, sombra roxa |
| `.tabs` / `.tab` | pílula com fundo `--card`; ativo = fundo `--accent`, texto branco, sombra |
| `.config-bar` | cartão flex com wrap, raio 16px |
| `.seg` / `.seg-btn` | controle segmentado; ativo = fundo `--card2` + anel interno `inset 0 0 0 1px --accent` |
| `.chip` | pílulas de estatística; variantes `.good`, `.bad`, `.streak` colorem o valor |
| `.question-card` | gradiente vertical `--card2`→`--card`, raio 20px, sombra profunda, texto centralizado |
| `.q-mode-badge` | pílula roxa translúcida com borda |
| `.q-timer` | pílula monoespaçada; `.urgent` = vermelho + animação `pulse` (0,8s, pisca em 55% de opacidade) |
| `.q-main` | fonte mono, `clamp(34px, 6vw, 56px)`, texto com gradiente branco→lilás via `background-clip: text` |
| `.ans` | botões de resposta; hover = borda roxa + `translateY(-2px)` + sombra; `.correct` = verde translúcido; `.wrong` = vermelho translúcido; desabilitados não marcados caem para 35% de opacidade |
| `.ans kbd` | mini-tecla monoespaçada com borda |
| `#num-input` | 26px mono centralizado (>16px evita o zoom automático do iOS ao focar), `appearance:none` e remoção dos spinners do WebKit; foco = borda roxa + anel de 3px |
| `.btn` | base; variantes `.primary` (roxo sólido), `.ghost` (transparente), `.big` (largura total), `.danger` (vermelho translúcido) |
| `.feedback` | cartão com variantes `.ok` (anel/sombra verdes) e `.no` (anel/sombra vermelhos) |
| `.step` | linha do passo a passo: número em quadrado roxo `.step-num`, corpo `.step-body` com título `.t`, cálculo `.calc` (mono, fundo roxo translúcido) e resultado `.res` (verde); variante `.final` fica toda esverdeada |
| `.card` | cartão genérico dos painéis Aprender/Estatísticas, com estilos próprios para `table`, `th/td`, `code`, `kbd`, `.tip` (aviso âmbar) e `.formula` (bloco mono roxo) |
| `.stat-card` / `.stat-value` | valor grande mono em lilás |
| `.hdot` | quadradinhos 16×16 do histórico (`.ok` verde, `.no` vermelho, `.to` âmbar) |
| `.ios-install-banner` | `position:fixed` na base + `env(safe-area-inset-bottom)`, fundo `rgba(26,32,48,.97)` com `backdrop-filter: blur(14px)`, borda roxa, animação `bannerUp` (sobe com leve overshoot `cubic-bezier(.2,.9,.3,1.1)`) |
| `.hidden` | `display: none !important` — classe utilitária usada pelo JS para mostrar/ocultar |

### 4.3 Animações e transições

- `@keyframes fadeUp` — painéis e feedback surgem subindo 8px com fade (0,25s);
- `@keyframes pulse` — cronômetro urgente piscando;
- `@keyframes bannerUp` — entrada do banner iOS;
- Transições de 0,13–0,15s em tabs, botões segmentados, respostas e botões gerais (cor, borda, transform, sombra).

### 4.4 Breakpoints e media queries

- **`@media (max-width: 640px)`** (celular): header empilha; tabs ocupam 100% da largura com botões flexíveis; `.q-main` reduz para 30px; **as respostas viram grade de 2 colunas** (`display:grid; grid-template-columns:1fr 1fr`) com o 7º botão (Sábado) ocupando a linha inteira (`grid-column: 1 / -1`); chips, config-bar, cartões e paddings compactados.
- **`@media (display-mode: standalone)`** (app instalado): desativa o efeito hover dos botões de resposta (que "gruda" em telas de toque) e o substitui por um estado `:active` roxo.
- `.learn-grid` e `.stats-grid` usam `repeat(auto-fit, minmax(...))` — respondem a qualquer largura sem media query.

---

## 5. Paleta visual e tipografia

### 5.1 Cores do tema (variáveis em `:root`)

| Variável | Valor | Uso |
|---|---|---|
| `--bg` | `#0b0e14` | Fundo da página, theme-color, contorno dos pontos do gráfico |
| `--bg2` | `#10141d` | Fundo de segmentados, botões de resposta, inputs, passos, blocos de código |
| `--card` | `#151a26` | Cartões, tabs, chips, feedback |
| `--card2` | `#1a2030` | Botão segmentado ativo, topo do gradiente do cartão de pergunta, botões |
| `--border` | `#232b3d` | Todas as bordas padrão |
| `--text` | `#e8ecf4` | Texto principal |
| `--muted` | `#8b94a7` | Textos secundários, labels, rodapé |
| `--accent` | `#7c5cff` | Cor primária: tab ativa, botões primários, logo, anéis de foco, pontos do gráfico |
| `--accent2` | `#9d7bff` | Variante clara: destaques de texto, valores de estatística, linha do gráfico, hover |
| `--good` | `#2dd4a0` | Verde de acerto: chip, botão correto, feedback ok, dots, resultados |
| `--bad` | `#ff5c7a` | Vermelho de erro: chip, botão errado, feedback no, timer urgente, zona de perigo |
| `--warn` | `#ffb020` | Âmbar: chip de sequência 🔥, dots de timeout/pulada, caixa `.tip` |

### 5.2 Cores literais (fora das variáveis)

| Valor | Onde aparece |
|---|---|
| `#4b34b8` | Ponta escura do gradiente do logo |
| `#b9a8ff` e `#fff` | Gradiente de texto do `.q-main`; texto de botões ativos/primários |
| `#c6cddb` | Parágrafos dos cartões Aprender e texto do banner iOS |
| `#2f9bff` | Azul do ícone "Compartilhar" no banner iOS (imita a cor do iOS) |
| `rgba(26,32,48,.97)` | Fundo do banner iOS |
| `rgba(124,92,255, .08–.4)` | Famílias de translúcidos roxos (badges, calc, sombras, anéis) |
| `rgba(45,212,160, .06–.5)` | Translúcidos verdes (acertos, passo final, feedback ok) |
| `rgba(255,92,122, .07–.5)` | Translúcidos vermelhos (erros, botão danger, feedback no) |
| `rgba(255,176,32, .07/.25)` | Translúcidos âmbar (caixa `.tip`) |
| `rgba(0,0,0, .35/.55)` | Sombras do cartão de pergunta e do banner |
| No canvas (JS): `rgba(255,255,255,.07)` grade; `rgba(139,148,167,.8/.9)` rótulos; `#9d7bff` linha; `#7c5cff` pontos; gradiente de área `rgba(124,92,255,.35)→0` | Gráfico de evolução |

### 5.3 Tipografia

| Fonte | Pesos carregados | Uso |
|---|---|---|
| **Inter** (Google Fonts) | 400, 500, 600, 700, 800 | Fonte padrão de toda a UI (fallback: `system-ui, sans-serif`) |
| **JetBrains Mono** (Google Fonts) | 500, 700 | Números e dados: pergunta principal, cronômetro, chips, cálculos, `<code>`, `<kbd>`, estatísticas, input numérico |

Hierarquia: `q-main` clamp 34–56px • h1 24px/800 • verdict 22px/800 • stat-value 26px • input 26px • h2 18px • corpo 14–15px • labels 11–12px maiúsculas com letter-spacing.

---

## 6. app.js — lógica, estados e eventos

Arquivo único em modo estrito (`"use strict"`), organizado em blocos comentados.

### 6.1 Constantes

- `WEEKDAYS` / `WEEKDAYS_SHORT` — nomes dos dias (índice 0 = Domingo, convenção usada no app inteiro);
- `MONTHS` — meses em minúsculas;
- `MODE_NAMES` — mapa `full/century/year/month` → rótulos em português;
- `STORAGE_KEY = "doomsday-mind-v1"` — chave do localStorage.

### 6.2 Matemática do calendário (o "motor" do app)

| Função | O que faz |
|---|---|
| `isLeap(y)` | Regra gregoriana completa: divisível por 4, exceto múltiplos de 100 que não sejam de 400 |
| `mod(n, m)` | Módulo sempre positivo (o `%` nativo falha com negativos) |
| `centuryAnchor(year)` | Âncora do século: `(5 × (século mod 4) + 2) mod 7` |
| `yearDoomsdayParts(year)` | Método clássico de Conway: `y` = 2 últimos dígitos, `a=⌊y/12⌋`, `b=y mod 12`, `c=⌊b/4⌋`, doomsday = `(âncora+a+b+c) mod 7`. Retorna todas as parcelas (usadas na correção passo a passo) |
| `odd11Parts(year)` | Método alternativo "ímpar+11"; retorna o deslocamento **e** a lista textual de passos em português para exibição |
| `monthDoomsdayDay(month, leap)` | Tabela das datas-referência: `[3/4, 28/29, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12]` (janeiro/fevereiro variam com bissexto) |
| `monthMnemonic(month, leap)` | Frase mnemônica de cada mês (ex.: "Dia do Pi", "Trabalho das 9 às 5 no 7-Eleven") |
| `weekdayOf(d, m, y)` | **Fonte da verdade** do app: `(doomsdayDoAno + (dia − referênciaDoMês)) mod 7` — o gabarito é calculado pelo próprio método Doomsday |
| `daysInMonth(m, y)` | Dias de cada mês, considerando bissexto |
| Utilitários | `pad2`, `fmtDate` (dd/mm/aaaa), `fmtTime` (segundos com 1 decimal em pt-BR), `randInt` (inteiro aleatório inclusivo) |

### 6.3 Estado

Objeto global `state`:


mode ("full")  range ([1900,2099])  timerLimit (0 = livre)
question (pergunta atual)  answered (bool)  startTime (performance.now)
timerInterval (id do setInterval)
session: { count, correct, wrong, streak, times[] }


E o objeto persistente `store` (ver seção 8). O estado da **sessão** zera ao recarregar a página; o `store` sobrevive.

### 6.4 Ciclo da pergunta

1. **`newQuestion()`** — gera a pergunta conforme o modo:
   - `full`: ano aleatório no intervalo + mês 1–12 + dia válido (`daysInMonth`); resposta = `weekdayOf(...)`; tipo `week`;
   - `century`: século aleatório entre `max(intervalo, 1500)/100` e `intervalo_max/100`; resposta = `centuryAnchor`; tipo `week`;
   - `year`: ano aleatório; resposta = `yearDoomsday`; subtítulo avisa "⚠️ ano bissexto" quando aplicável; tipo `week`;
   - `month`: mês aleatório + sorteio 50% de contexto bissexto; resposta = `monthDoomsdayDay`; tipo **`num`** (resposta numérica). Para março–dezembro o subtítulo diz "(vale para qualquer ano)".
   Depois chama `renderQuestion()` e `startTimer()`.
2. **`renderQuestion()`** — preenche badge, enunciado, dado principal e subtítulo; reabilita/limpa os 7 botões; alterna entre `#answers-week` e `#answers-num` conforme o tipo (com foco automático no input após 50ms); esconde o feedback.
3. **Timer** — `startTimer()` grava `performance.now()` e liga um `setInterval` de 100ms; `updateTimerDisplay()` mostra tempo crescente (livre) ou restante com "⏳" (limitado); nos 5s finais aplica `.urgent`; ao chegar a 0 dispara `handleTimeout()`.
4. **Resposta** — três desfechos, todos parando o timer e chamando `recordAttempt` + `showFeedback`:
   - `submitAnswer(given)` — clique/tecla; compara com `q.answer`;
   - `handleTimeout()` — tempo esgotado (conta como erro, `timedOut: true`);
   - `handleSkip()` — pulada (conta como erro; no feedback aparece "⏭️ Pergunta pulada", mas é gravada com `timedOut: true` — ver seção 11).
5. **`recordAttempt({correct, timedOut, elapsed})`** — atualiza a sessão (acerto incrementa streak e guarda o tempo; erro zera streak), atualiza `store.bestStreak` se a sequência atual superar o recorde, adiciona a tentativa ao `store.attempts` (`{ts, mode, correct, timedOut, ms}`), salva e re-renderiza a faixa de sessão.
6. **`showFeedback(...)`** — pinta o botão correto de verde e o errado de vermelho (desabilitando todos), aplica a classe `.ok`/`.no` no cartão, escreve veredito/tempo/resposta, injeta `buildSteps(q)` no `#steps-container` e move o foco para `#btn-next`.

### 6.5 Correção passo a passo (`buildSteps` + `stepHtml`)

Gera HTML dinâmico específico para **cada pergunta**:

- **Modo século (2 passos):** fórmula da âncora com os números substituídos + resultado com a lista de repetição de 400 anos;
- **Modo mês (2 passos):** mnemônico do mês (com contexto bissexto quando janeiro/fevereiro) + resultado;
- **Modos ano e data completa:** passo 1 = âncora do século com cálculo; passo 2 = doomsday do ano pelo método a+b+c **e**, em letra menor, a conferência pelo método "ímpar+11"; no modo `full` seguem: passo 3 = data-referência do mês (com verificação explícita "É/NÃO é bissexto" para jan/fev), passo 4 = ajuste de dias (`diferença mod 7`, com direção "antes/depois" e soma em dias abreviados) e passo 5 = resultado final.

O último passo sempre recebe a variante visual `.final` (verde).

### 6.6 Estatísticas e gráfico

- `renderSessionStrip()` — atualiza os 6 chips da sessão (precisão arredondada; tempo médio só dos acertos);
- `renderStats()` — chamada ao abrir a aba Estatísticas: totais, precisão geral, melhor sequência, tempo médio e recorde de velocidade (apenas acertos), tentativas de hoje (compara `ts` com a meia-noite local); desenha os dots das últimas 50 tentativas (cada um com `title` descritivo); monta a tabela por modo; chama o gráfico. Com histórico vazio, mostra "Nenhuma tentativa ainda — vá praticar! 🎯";
- `drawProgressChart()` — Canvas 2D puro: agrupa as tentativas em blocos de 10 (ignora blocos com menos de 3), desenha grade horizontal (0–100% de 25 em 25), área preenchida com gradiente roxo, linha de 2,5px e pontos com contorno da cor do fundo. Sem dados suficientes, exibe uma mensagem no próprio canvas.

### 6.7 Eventos (mapa completo)

| Evento | Alvo | Ação |
|---|---|---|
| `click` | cada `.tab` | Troca painel ativo; se for "stats", chama `renderStats()` |
| `click` | `.seg-btn` de `#mode-seg`/`#range-seg`/`#timer-seg` (via `bindSeg`) | Atualiza `state` e gera nova pergunta imediatamente |
| `click` | 7 botões `.ans` | `submitAnswer(data-dow)` |
| `click` | `#num-submit` | Envia o valor do input (se for número) |
| `keydown Enter` | `#num-input` | Idem |
| `click` | `#btn-skip` / `#btn-next` | Pular / próxima pergunta |
| `click` | `#btn-reset-stats` | `confirm()` nativo → zera o `store` e re-renderiza |
| `keydown` global | `document` | Só age com o painel Praticar ativo: **Enter** avança (após responder); **Esc** pula; **1–7** responde dia da semana (ignorado se o foco está no input numérico) |
| `click` | `#ios-banner-close` | Esconde o banner e grava a dispensa no localStorage |
| `load` | `window` | Registra o Service Worker |

### 6.8 Autoverificação (`selfTest`, IIFE)

Roda a cada carregamento: valida 6 datas históricas conhecidas (20/07/1969 = domingo, 07/09/1822 = sábado, 15/11/1889 = sexta, etc.) e compara o algoritmo com o `Date` UTC do JavaScript em **500 datas aleatórias** entre 1583 e 2500. Divergências são reportadas via `console.error` — não há efeito visível para o usuário.

### 6.9 Bloco PWA (`pwa`, IIFE)

- Registra `sw.js` no evento `load` (com `console.warn` em caso de falha);
- Detecta iOS por `userAgent` (`iphone|ipad|ipod`) **ou** iPadOS moderno (`MacIntel` + `maxTouchPoints > 1`);
- Detecta modo instalado por `display-mode: standalone` (matchMedia) **ou** `navigator.standalone` (Safari);
- Mostra `#ios-banner` após 1,5s **somente se**: é iOS + não está instalado + não foi dispensado antes (`dm-ios-banner-dismissed` no localStorage).

### 6.10 Inicialização

Última linha do arquivo: `renderSessionStrip()` + `newQuestion()` — o app abre com uma pergunta pronta no modo "Data completa", intervalo 1900–2099, timer livre.

---

## 7. PWA — manifest, Service Worker e instalação

### 7.1 manifest.webmanifest

| Campo | Valor |
|---|---|
| `name` / `short_name` | "Doomsday Mind" / "Doomsday" |
| `description` / `lang` | Descrição em português / `pt-BR` |
| `start_url` / `scope` | `./index.html` / `./` (caminhos relativos — funciona em subdiretórios, ex.: GitHub Pages) |
| `display` | `standalone` (tela cheia, sem UI do navegador) |
| `orientation` | `portrait` |
| `background_color` / `theme_color` | `#0b0e14` (ambos) |
| `categories` | education, games, productivity |
| `icons` | 7 entradas: 120/152/167/180 (sem purpose), 192 e 512 (`purpose: any`), 1024 (`purpose: any maskable`) |

### 7.2 sw.js — Service Worker

- **Versionamento:** constante `VERSION = "v1.0.0"` compõe os nomes dos caches `doomsday-static-v1.0.0` e `doomsday-runtime-v1.0.0`. Mudar a versão invalida os caches antigos.
- **`install`:** pré-cacheia o app shell completo (12 URLs: `./`, index, css, js, manifest e 6 ícones — o icon-1024 **não** é pré-cacheado) e chama `skipWaiting()`.
- **`activate`:** apaga qualquer cache cujo nome não seja um dos dois atuais e chama `clients.claim()`.
- **`fetch`** — três estratégias, apenas para requisições GET:
  1. **Navegações** (`request.mode === "navigate"`): *network-first* — tenta a rede, atualiza a cópia de `./index.html` no cache e, se offline, devolve o cache (fallback final para `./index.html`);
  2. **Google Fonts** (`fonts.googleapis.com` / `fonts.gstatic.com`): *stale-while-revalidate* no cache de runtime — serve o cache imediatamente e atualiza em segundo plano (aceita respostas `opaque` de CORS);
  3. **Demais assets do próprio domínio:** *cache-first* com atualização em background.
- **`message`:** ouve `"SKIP_WAITING"` para ativação manual de nova versão (hook disponível, porém nenhum código do app envia essa mensagem — ver seção 11).

### 7.3 Instalação e offline

- **iOS:** não há prompt automático; o caminho é Safari → Compartilhar → "Adicionar à Tela de Início" — exatamente o que o banner `#ios-banner` ensina. Instalado, o app abre em tela cheia com barra de status translúcida e o nome "Doomsday".
- **Offline:** após a primeira visita, todo o app funciona sem rede (o único recurso externo — fontes — tem fallback de sistema e cache de runtime).
- **Requisito:** Service Workers só funcionam em **HTTPS** (ou localhost). Nenhuma configuração de deploy/hospedagem foi **identificada no código**.

---

## 8. Dados, armazenamento e APIs

### 8.1 localStorage (único armazenamento)

| Chave | Conteúdo |
|---|---|
| `doomsday-mind-v1` | JSON: `{ attempts: [{ts, mode, correct, timedOut, ms}...], bestStreak }`. Limitado às **últimas 2000 tentativas** (corte em `saveStore`). Leitura e escrita protegidas por `try/catch` (modo privado/quota não quebram o app) |
| `dm-ios-banner-dismissed` | `"1"` quando o usuário fecha o banner de instalação iOS |

### 8.2 APIs do navegador utilizadas

`localStorage`, `serviceWorker` + Cache Storage API, Canvas 2D, `performance.now()`, `matchMedia`, `Intl` via `toLocaleString("pt-BR")`, `confirm()` nativo.

### 8.3 O que **não** existe

IndexedDB, cookies, backend, banco de dados, autenticação/login, chamadas a APIs externas (`fetch`/XHR de dados), analytics, senhas/tokens/chaves: **não identificados no código**. A única requisição externa é o CSS/arquivos do Google Fonts.

---

## 9. Como HTML, CSS e JS se conectam — fluxos de execução

### 9.1 O contrato entre as camadas

- O **HTML** define a estrutura estática e "ganchos": ~44 IDs (consumidos pelo JS via helper `$`) e atributos `data-*` (`data-tab`, `data-mode`, `data-range`, `data-timer`, `data-dow`) que carregam os valores de configuração;
- O **CSS** define aparência e **estados por classe**: o JS nunca escreve estilos inline (exceto textos internos dos passos) — ele apenas alterna classes (`.active`, `.hidden`, `.ok`, `.no`, `.correct`, `.wrong`, `.urgent`) e o CSS reage, inclusive com animações;
- O **JS** lê os `data-*`, calcula, gera HTML dinâmico (passos da correção, dots, tabela de modos) e alterna as classes.

### 9.2 Fluxo principal — responder uma pergunta


Carregamento → selfTest() → renderSessionStrip() → newQuestion()
   ↓
newQuestion(): sorteia pergunta conforme state.mode/state.range
   → calcula o gabarito com o próprio método Doomsday (weekdayOf etc.)
   → renderQuestion() monta o cartão → startTimer()
   ↓
Usuário responde (clique, teclas 1–7, Enter no input) / pula (Esc) / tempo esgota
   ↓
submitAnswer | handleSkip | handleTimeout
   → stopTimer() → recordAttempt() [sessão + localStorage]
   → showFeedback() → buildSteps() injeta a correção passo a passo
   ↓
Enter ou "Próxima pergunta" → newQuestion() (recomeça o ciclo)


### 9.3 Fluxos secundários

- **Trocar configuração:** clique em `.seg-btn` → `bindSeg` atualiza `state` → nova pergunta imediata (a atual é descartada sem registro);
- **Abrir Estatísticas:** clique na tab → troca de painel → `renderStats()` recalcula tudo a partir do `store` e redesenha o canvas;
- **Primeira visita no iPhone:** load → registra SW (pré-cache) → IIFE `pwa` detecta iOS/Safari → banner sobe após 1,5s → usuário instala ou dispensa;
- **Visita offline:** navegação → SW intercepta → falha de rede → serve `index.html` e assets do cache.

---

## 10. Responsividade e acessibilidade

### 10.1 Responsividade

- **Desktop (>640px):** container até 1060px; respostas em linha flexível; grades auto-ajustáveis nos painéis Aprender/Estatísticas;
- **Celular (≤640px):** header empilhado, tabs em largura total, respostas em grade 2×4 com alvos grandes, tipografia e espaçamentos reduzidos;
- **Tablet:** atendido pelas grades `auto-fit` e pelo layout fluido (não há breakpoint específico de tablet);
- **iPhone com notch:** `viewport-fit=cover` + `env(safe-area-inset-*)` no container e no banner;
- Unidades fluidas: `clamp()` no título da pergunta, `100dvh`, canvas com `width:100%` via CSS.

### 10.2 Acessibilidade — o que existe

- HTML semântico: `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`, `<section>`, `<table>` com `<thead>/<tbody>`, `<details>/<summary>`, `<label>`, `<kbd>`;
- **Teclado:** todo o fluxo de prática é operável sem mouse (1–7, Enter, Esc); foco é movido programaticamente para o input numérico e para "Próxima pergunta";
- `aria-label="Fechar"` no botão do banner iOS; `alt=""` no ícone decorativo do banner; `title` descritivo nos dots do histórico; anéis de foco visíveis no input;
- Contraste: texto claro `#e8ecf4` sobre fundos escuros tem contraste alto; acerto/erro não dependem só de cor (há ✅/❌, texto e posição).

### 10.3 Acessibilidade — lacunas (confirmadas no código)

- Tabs e painéis **sem ARIA** (`role="tablist/tab/tabpanel"`, `aria-selected`, `aria-controls` não existem);
- Feedback e cronômetro sem `aria-live` — leitores de tela não são notificados do resultado nem do tempo;
- O canvas do gráfico não tem texto alternativo/fallback acessível;
- Os dots do histórico dependem de `title` (inacessível por toque) e de cor + tooltip;
- `user-select: none` global em botões e `-webkit-touch-callout: none` limitam seleção/cópia;
- Textos em `--muted` (#8b94a7) sobre `--card` têm contraste menor que o texto principal (adequado para texto secundário, mas limítrofe para AA em tamanhos pequenos).

---

## 11. Problemas, inconsistências e código não utilizado

Levantamento honesto do estado atual:

1. **README.md vazio** — contém apenas `# Doomsday-Mind`; não documenta instalação, uso ou arquitetura (esta documentação supre isso).
2. **Hook `SKIP_WAITING` órfão** — `sw.js` ouve a mensagem `"SKIP_WAITING"`, mas nenhum código em `app.js` a envia; não há UI de "nova versão disponível". Atualizações dependem do ciclo natural do SW (skipWaiting no install + revisitas).
3. **Pulada gravada como timeout** — `handleSkip` registra `timedOut: true`; no histórico persistente é impossível distinguir "pulou" de "tempo esgotado" (a legenda das estatísticas já os trata como uma categoria única, mas o veredito do feedback os distingue — inconsistência de granularidade).
4. **Ícone 1024 "maskable" sem zona segura formal** — a arte preenche o quadrado (o que funciona), mas não foi desenhada com a zona segura de 40% exigida pela especificação maskable; em launchers Android com máscaras agressivas, bordas da arte podem ser cortadas. Também é o único ícone **fora** do pré-cache do SW.
5. **`apple-mobile-web-app-capable` é depreciado** — mantido junto do padrão `mobile-web-app-capable` (prática recomendada de compatibilidade; não é bug, mas gera aviso em auditorias).
6. **IDs sem uso no JS** — `#mode-table`, `#fb-header`, `#fb-steps` e `#question-card`… na verdade `#question-card` é usado (remove `.hidden`), mas **nunca recebe** `.hidden` de volta — a chamada é inócua no fluxo atual; os outros três IDs não são referenciados por script (apenas estrutura/estilo).
7. **Métricas enviesadas por design** — "tempo médio" (sessão e global) considera **apenas acertos**; a precisão conta pulos como erro. São decisões coerentes, mas não estão explicadas na UI.
8. **`selfTest` roda em produção** — 500 comparações + 6 datas a cada carregamento; custo desprezível, mas é código de verificação que poderia ser condicionado a um flag de debug.
9. **Canvas sem suporte a DPI alto** — o gráfico usa buffer fixo de 900×220 esticado via CSS; em telas Retina a linha fica levemente borrada (não há ajuste por `devicePixelRatio`).
10. **Timer de 100ms segue rodando com a aba oculta** — sem uso da Page Visibility API; em modo com limite, o tempo continua contando se o usuário trocar de aba (comportamento discutível, não necessariamente errado).
11. **Google Fonts na primeira carga** — sem rede na primeiríssima visita, os textos caem no fallback de sistema (funcional; apenas estética).
12. **Referências quebradas:** nenhuma encontrada — todos os arquivos referenciados (CSS, JS, SW, manifest, 7 ícones) existem e respondem; todos os IDs consumidos pelo JS existem no HTML.
13. **Deploy/HTTPS:** nenhuma configuração de hospedagem foi identificada no código; o SW exigirá HTTPS em produção.

---

## 12. Resumo geral

**Arquitetura.** SPA estática de 3 painéis controlada por troca de classes, escrita em HTML + CSS + JavaScript puros, sem dependências nem build. Separação limpa: HTML fornece estrutura e ganchos (`id`/`data-*`), CSS governa aparência e estados por classe, JS concentra toda a lógica em um arquivo com módulos conceituais (matemática do calendário → estado → ciclo da pergunta → correção → estatísticas → PWA). O gabarito das perguntas é calculado pelo próprio método Doomsday e validado automaticamente contra o `Date` do navegador a cada carga.

**Funcionalidades.** Quatro modos de treino (data completa, âncora do século, doomsday do ano, referência do mês — este com resposta numérica e sorteio de contexto bissexto); cinco intervalos de anos (até 1583–2500); cronômetro livre ou regressivo (15s–2min) com alerta visual e derrota por tempo; respostas por toque **ou** teclado (1–7, Enter, Esc); **correção passo a passo gerada dinamicamente para cada pergunta**, incluindo dois métodos de cálculo do doomsday do ano; estatísticas de sessão em tempo real e histórico persistente com precisão, sequências, tempos, dots das últimas 50 tentativas, tabela por modo e gráfico de evolução em canvas; aba educativa completa; reset de histórico com confirmação.

**Identidade visual.** Tema escuro azul-marinho (#0b0e14/#151a26) com acento roxo-violeta (#7c5cff/#9d7bff) e semântica de cores consistente (verde #2dd4a0 = acerto, vermelho #ff5c7a = erro, âmbar #ffb020 = tempo/sequência); tipografia Inter para UI e JetBrains Mono para dados; gradientes suaves, cantos arredondados generosos, sombras profundas e microanimações de 0,13–0,4s.

**Tecnologias.** HTML5 semântico, CSS3 (custom properties, grid/flex, `clamp`, `env(safe-area-inset)`, `backdrop-filter`, media queries incluindo `display-mode`), JS vanilla (Canvas 2D, `performance.now`, `localStorage`, `matchMedia`), Service Worker com Cache Storage, Web App Manifest. Única dependência externa: Google Fonts (com fallback).

**PWA.** Manifesto completo (standalone, portrait, 7 ícones), Service Worker com pré-cache do app shell e três estratégias de cache (network-first para navegação, stale-while-revalidate para fontes, cache-first para assets), funcionamento 100% offline após a primeira visita, meta tags iOS completas, ícones apple-touch em 4 tamanhos, safe areas do iPhone respeitadas e banner próprio de instalação exclusivo para Safari/iOS com memória de dispensa.

**Fluxos principais.** (1) gerar pergunta → cronometrar → responder/pular/estourar → registrar → corrigir passo a passo → próxima; (2) configurar modo/intervalo/timer → pergunta nova imediata; (3) abrir estatísticas → recalcular e redesenhar tudo do localStorage; (4) primeira visita iOS → registrar SW → banner de instalação → app na tela de início.

**Estado atual.** Funcional e completo para o propósito: sem referências quebradas, sem erros de sintaxe, matemática validada, offline operante. Pendências conhecidas: README mínimo, lacunas de ARIA/`aria-live`, hook de atualização do SW sem UI, distinção pulo×timeout perdida no histórico, gráfico sem ajuste de DPI e ausência de configuração de deploy HTTPS (necessária para o SW em produção).

---

*Documentação baseada exclusivamente nos arquivos: `index.html` (286 linhas), `styles.css` (341), `app.js` (666), `sw.js` (111), `manifest.webmanifest` (22), `README.md` e `icons/` (7 PNGs).*


