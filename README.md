# Doomsday Mind V2 — Especificação completa do projeto

## 1. Visão geral

O **Doomsday Mind** será um PWA de treinamento mental voltado para cálculo rápido de dias da semana.

O produto não será uma calculadora comum. Ele funcionará como um treinador cognitivo, com foco em:

- Velocidade;
- Precisão;
- Memorização;
- Raciocínio mental;
- Repetição deliberada;
- Feedback pedagógico;
- Progressão pessoal;
- Consistência diária.

O método principal da V2 será o **Ímpar + 11**, utilizado para calcular o código do ano dentro do método Doomsday.

O método tradicional de Conway continuará podendo existir como:

- Método alternativo;
- Conteúdo complementar;
- Comparação;
- Ferramenta de conferência;
- Material de aprendizado avançado.

A experiência principal será:

```text
Escolher treino
       ↓
Receber desafio
       ↓
Calcular mentalmente
       ↓
Responder
       ↓
Receber correção
       ↓
Entender o raciocínio
       ↓
Ganhar XP
       ↓
Acompanhar evolução
       ↓
Treinar novamente
```

---

# 2. Objetivo do produto

O aplicativo deverá ajudar o usuário a:

- Aprender o método Ímpar + 11;
- Entender âncoras de século;
- Memorizar referências mensais;
- Calcular o código de qualquer ano;
- Resolver datas completas;
- Aumentar a velocidade;
- Melhorar a precisão;
- Identificar pontos fracos;
- Criar consistência diária;
- Acompanhar progressão;
- Subir de rank;
- Revisar erros;
- Praticar offline;
- Manter o histórico localmente.

O aplicativo deverá transmitir:

```text
Inteligência
Precisão
Calma
Performance
Disciplina
Evolução
```

---

# 3. Identidade do produto

O nome continuará sendo:

```text
Doomsday Mind
```

A marca não será alterada apenas porque o método pedagógico principal mudou.

O nome representa o universo de:

- Cálculo mental;
- Calendário;
- Método Doomsday;
- Memorização;
- Treinamento cognitivo;
- Performance mental.

O produto deverá parecer:

- Premium;
- Editorial;
- Técnico;
- Elegante;
- Minimalista;
- Profissional;
- Intencional.

Não deverá parecer:

- Sistema administrativo;
- CRUD;
- Formulário escolar;
- Template genérico;
- Dashboard corporativo;
- Aplicativo infantil;
- Interface com excesso de neon;
- Coleção aleatória de cards.

---

# 4. Estrutura principal da aplicação

A aplicação será organizada em três áreas principais.

## 4.1 Treinar

Área principal do produto.

Responsável por:

- Selecionar o tipo de treino;
- Selecionar o intervalo;
- Selecionar o tempo;
- Gerar perguntas;
- Registrar respostas;
- Mostrar correções;
- Conceder XP;
- Atualizar streak;
- Criar sessões;
- Registrar histórico.

## 4.2 Aprender

Área educacional.

Responsável por explicar:

- O método Doomsday;
- O Ímpar + 11;
- O cálculo do código do ano;
- Âncoras;
- Referências mensais;
- Anos bissextos;
- Datas completas;
- Atalhos;
- Estratégias de velocidade;
- Método alternativo tradicional.

## 4.3 Progresso

Área pessoal de evolução.

Responsável por mostrar:

- XP;
- Rank;
- Barra de progresso;
- Streak de exercícios;
- Streak diário;
- Melhor streak;
- Precisão;
- Tempo;
- Histórico;
- Desempenho por modo;
- Evolução do usuário.

---

# 5. Método principal: Ímpar + 11

O método Ímpar + 11 será a principal técnica ensinada na V2.

A sequência é:

```text
1. Pegue os dois últimos dígitos do ano
2. Se o número for ímpar, some 11
3. Divida por 2
4. Se o resultado for ímpar, some 11
5. Calcule o módulo 7
6. Transforme em deslocamento
7. Combine com a âncora do século
```

Exemplo conceitual para 1969:

```text
Últimos dois dígitos: 69

69 é ímpar
69 + 11 = 80

80 ÷ 2 = 40

40 é par
Não soma 11 novamente

40 mod 7 = 5

Código do ano:
7 − 5 = 2
```

Depois o código do ano será combinado com a âncora do século.

O aplicativo deverá mostrar dinamicamente:

- Valor inicial;
- Se era ímpar ou par;
- Soma realizada;
- Divisão;
- Segunda verificação;
- Módulo;
- Resultado final;
- Âncora;
- Resultado do Doomsday;
- Referência mensal;
- Ajuste da data.

Os valores não poderão ser textos estáticos.

---

# 6. Fonte independente da verdade

O método mental não deverá validar a si mesmo.

A arquitetura terá duas camadas.

## 6.1 Calendar Engine

Será a fonte independente do resultado correto.

Responsável por:

- Calcular o dia real da semana;
- Validar datas;
- Tratar anos bissextos;
- Testar séculos;
- Validar os limites;
- Confirmar perguntas geradas.

## 6.2 Odd + 11 Engine

Será a técnica treinada pelo usuário.

Responsável por:

- Executar o Ímpar + 11;
- Gerar etapas;
- Produzir explicações;
- Mostrar valores intermediários;
- Comparar o resultado com o Calendar Engine.

Fluxo:

```text
Calendar Engine
       ↓
Resposta correta verdadeira

Odd + 11 Engine
       ↓
Processo mental explicado
```

Isso evita que um erro na implementação do método passe despercebido.

---

# 7. Calendário e anos bissextos

A regra de ano bissexto será centralizada.

Um ano será bissexto quando:

```text
É divisível por 4
E não é divisível por 100
A menos que seja divisível por 400
```

Exemplos:

```text
2000 → bissexto
1900 → não bissexto
2024 → bissexto
2100 → não bissexto
```

## Referências mensais em anos comuns

| Mês | Referência |
|---|---:|
| Janeiro | 3 |
| Fevereiro | 28 |
| Março | 14 |
| Abril | 4 |
| Maio | 9 |
| Junho | 6 |
| Julho | 11 |
| Agosto | 8 |
| Setembro | 5 |
| Outubro | 10 |
| Novembro | 7 |
| Dezembro | 12 |

## Referências em anos bissextos

```text
Janeiro → 4
Fevereiro → 29
```

Essa lógica deverá ser usada de maneira idêntica em:

- Geração;
- Validação;
- Explicação;
- Aprendizado;
- Testes;
- Estatísticas;
- Revisão de erros.

---

# 8. Modos de treinamento

## 8.1 Data completa

Exibe uma data, por exemplo:

```text
20 de julho de 1969
```

O usuário deverá encontrar o dia da semana utilizando:

```text
Ímpar + 11
      ↓
Âncora do século
      ↓
Doomsday do ano
      ↓
Referência mensal
      ↓
Ajuste da data
      ↓
Resultado final
```

Esse será o modo principal.

---

## 8.2 Código do ano

Exibe somente o ano:

```text
1969
```

O usuário deverá calcular o código do ano pelo Ímpar + 11.

A correção mostrará:

```text
69
69 + 11 = 80
80 ÷ 2 = 40
40 é par
40 mod 7 = 5
7 − 5 = 2
```

---

## 8.3 Âncora do século

Exibe um século ou um ano e solicita a âncora.

Âncoras principais:

| Século | Dia |
|---|---|
| 1800 | Sexta-feira |
| 1900 | Quarta-feira |
| 2000 | Terça-feira |
| 2100 | Domingo |

O ciclo se repete a cada 400 anos.

---

## 8.4 Referência mensal

Exibe o mês e solicita a data correspondente.

Exemplo:

```text
Julho
```

Resposta:

```text
11
```

Também poderá incluir exercícios específicos de ano bissexto.

---

## 8.5 Sprint de velocidade

Modo voltado para rapidez:

- Perguntas rápidas;
- Cronômetro;
- Pontuação;
- Bônus por velocidade;
- Sequência de acertos;
- Sessões com tempo definido.

---

# 9. Arquitetura preparada para novos modos

A estrutura deverá aceitar novos modos sem reescrever o núcleo.

Futuros modos possíveis:

```text
Desafio diário
Modo reverso
Sequência infinita
Revisão de erros
Modo sem erros
Contra o relógio
Sessão personalizada
Treino de anos bissextos
Treino por século
Treino por mês
Modo relâmpago
Modo sobrevivência
```

Cada modo terá um identificador:

```javascript
full-date
year-code
century-anchor
month-reference
speed-sprint
daily-challenge
error-review
reverse-mode
```

---

# 10. Configurações

O usuário poderá configurar:

## Intervalos

```text
1583–2500
1800–2199
1900–1999
1900–2099
2000–2099
```

## Tempo

```text
Livre
2 minutos
60 segundos
30 segundos
15 segundos
```

## Futuras configurações

- Dificuldade;
- Quantidade de perguntas;
- Tamanho da sessão;
- Mostrar ou esconder dicas;
- Permitir repetição;
- Incluir ou excluir anos bissextos;
- Treinar somente datas históricas;
- Treinar somente um século;
- Responder digitando;
- Responder por opções.

---

# 11. Ciclo de uma pergunta

```text
Configuração selecionada
        ↓
Gerar pergunta aleatória
        ↓
Calcular resposta verdadeira
        ↓
Preparar resolução Ímpar + 11
        ↓
Exibir pergunta
        ↓
Iniciar cronômetro
        ↓
Usuário responde
        ↓
Validar resposta
        ↓
Classificar status
        ↓
Atualizar sessão
        ↓
Atualizar XP
        ↓
Atualizar streak
        ↓
Atualizar streak diário
        ↓
Salvar histórico
        ↓
Mostrar correção
        ↓
Mostrar resolução
        ↓
Oferecer próxima pergunta
```

---

# 12. Estados de uma tentativa

A V2 deverá diferenciar claramente:

```text
correct
wrong
skipped
timedOut
```

## Correct

O usuário respondeu corretamente.

Efeitos:

- Ganha XP;
- Aumenta streak;
- Conta como prática;
- Pode gerar bônus;
- Pode gerar recorde.

## Wrong

O usuário respondeu, mas errou.

Efeitos:

- Não ganha XP;
- Streak de exercícios volta a zero;
- Conta no histórico;
- Continua contando como prática do dia.

## Skipped

O usuário pulou a pergunta.

Efeitos:

- Não ganha XP;
- Streak volta a zero;
- Registro diferenciado;
- Não deve ser confundido com timeout.

## TimedOut

O tempo terminou antes da resposta.

Efeitos:

- Não ganha XP;
- Streak volta a zero;
- Mostra feedback de tempo esgotado;
- Registro diferenciado no histórico.

---

# 13. Correção passo a passo

O feedback deverá funcionar como um professor particular.

## Em caso de acerto

Mostrar:

```text
Correto

Sua resposta: sexta-feira
Resposta correta: sexta-feira
Tempo: 8,4 segundos
+12 XP
Streak 4
```

Depois mostrar a resolução:

```text
Últimos dígitos: 69
69 é ímpar → 69 + 11 = 80
80 ÷ 2 = 40
40 é par → mantém 40
40 mod 7 = 5
7 − 5 = 2

Âncora de 1900:
quarta-feira

Doomsday do ano:
sexta-feira
```

## Em caso de erro

Mostrar:

```text
Não foi desta vez

Sua resposta: domingo
Resposta correta: sexta-feira
Tempo: 12,8 segundos
XP recebido: 0
```

Depois explicar:

```text
A sequência correta era:

69
69 + 11 = 80
80 ÷ 2 = 40
40 é par
40 mod 7 = 5
```

Quando possível, o sistema deverá identificar a etapa provável de divergência:

```text
Você parece ter se confundido na segunda verificação de paridade.
```

## Em caso de timeout

Mostrar:

```text
Tempo esgotado

A resposta não foi enviada dentro do limite.
Resposta correta: sexta-feira.
```

## Em caso de pulo

Mostrar:

```text
Pergunta pulada

Esta tentativa não recebeu XP.
```

---

# 14. Sistema de respostas

Para respostas de dia da semana:

```text
1 → Domingo
2 → Segunda-feira
3 → Terça-feira
4 → Quarta-feira
5 → Quinta-feira
6 → Sexta-feira
7 → Sábado
```

Atalhos:

```text
Enter → próxima pergunta após a correção
Esc → pular
1–7 → responder
```

Para referências mensais:

- Campo numérico;
- Teclado numérico no mobile;
- Validação entre 1 e 31;
- Mensagem para entrada inválida.

---

# 15. XP

O XP será centralizado no módulo de progressão.

Regras principais:

- Acerto concede XP;
- Erro concede 0 XP;
- Pulo concede 0 XP;
- Timeout concede 0 XP;
- Streak aumenta o ganho;
- Milestones podem conceder bônus;
- XP acumulado nunca diminui.

Exemplo de fórmula:

```text
XP base = 10
Bônus de streak = função da sequência
Bônus especial = função dos milestones

XP final =
XP base
+
bônus de streak
+
bônus especial
```

Milestones planejados:

```text
10 acertos
25 acertos
50 acertos
100 acertos
```

A regra ficará em um único módulo, evitando valores espalhados pelo código.

---

# 16. Streak de exercícios

Representa a sequência consecutiva de acertos.

Exemplo:

```text
Acerto → 1
Acerto → 2
Acerto → 3
Erro → 0
```

Deverá existir:

- Streak atual;
- Melhor streak;
- Streak da sessão;
- Streak salvo.

---

# 17. Streak diário

Representa dias consecutivos em que o usuário praticou.

Regras:

```text
Praticou hoje → registra hoje
Praticou ontem e hoje → aumenta
Ficou um dia sem praticar → reinicia
Errou exercícios → não destrói o streak diário
```

Dados salvos:

```javascript
lastPracticeDate
currentDailyStreak
bestDailyStreak
```

Exemplo:

```text
Segunda ✅
Terça ✅
Quarta ✅
Quinta sem prática
Sexta ✅
```

Resultado:

```text
Streak atual: 1
Maior streak: 3
```

---

# 18. Ranks

Os ranks serão derivados do XP.

O rank não será armazenado como fonte independente.

Lista:

```text
Bronze I
Bronze II
Bronze III

Prata I
Prata II
Prata III

Ouro I
Ouro II
Ouro III

Diamante I
Diamante II
Diamante III

Elite
Lenda
Surreal
```

A lista possui 15 nomes, apesar de a descrição original mencionar 14 ranks.

## Curva planejada

| Rank | XP acumulado |
|---|---:|
| Bronze I | 0 |
| Bronze II | 100 |
| Bronze III | 250 |
| Prata I | 450 |
| Prata II | 700 |
| Prata III | 1.000 |
| Ouro I | 1.400 |
| Ouro II | 1.900 |
| Ouro III | 2.500 |
| Diamante I | 3.300 |
| Diamante II | 4.300 |
| Diamante III | 5.500 |
| Elite | 7.000 |
| Lenda | 9.000 |
| Surreal | 12.000 |

Ao atingir Surreal:

```text
Rank máximo alcançado
```

Não deverá aparecer uma barra tentando avançar para um nível inexistente.

---

# 19. Tela de progresso

A tela deverá mostrar:

```text
RANK ATUAL
OURO II

✦ 2.430 XP

██████████████░░░░░░

570 XP para Ouro III

🔥 Streak de exercícios
📅 Streak diário
🏆 Recorde diário
```

Também mostrará:

- XP total;
- XP para o próximo rank;
- Barra de progresso;
- Melhor streak;
- Precisão;
- Tempo médio;
- Tentativas.

---

# 20. Estatísticas

A área de progresso deverá apresentar:

- Total de tentativas;
- Total de acertos;
- Total de erros;
- Total de perguntas puladas;
- Total de timeouts;
- Precisão geral;
- Tempo médio;
- Melhor tempo;
- Melhor streak;
- Streak diário;
- Melhor streak diário;
- Prática no dia;
- XP total;
- XP ganho no dia;
- Desempenho por modo;
- Evolução da precisão;
- Evolução da velocidade;
- Desempenho em anos bissextos;
- Desempenho por século.

Estatísticas sem dados deverão apresentar estados vazios úteis:

```text
Ainda não há dados suficientes.
Complete algumas sessões para visualizar sua evolução.
```

Não serão utilizados gráficos fictícios ou dados simulados.

---

# 21. Histórico

Cada tentativa deverá conter, quando disponível:

```javascript
{
    id,
    timestamp,
    mode,
    question,
    expectedAnswer,
    userAnswer,
    status,
    timeMs,
    xpGained,
    streakBefore,
    streakAfter,
    isLeapYear,
    failedStage
}
```

Exemplo:

```javascript
{
    "id": "attempt-1726500000000",
    "timestamp": 1726500000000,
    "mode": "full-date",
    "question": {
        "year": 1969,
        "month": 6,
        "day": 20
    },
    "expectedAnswer": 5,
    "userAnswer": 0,
    "status": "wrong",
    "timeMs": 8400,
    "xpGained": 0,
    "streakBefore": 3,
    "streakAfter": 0,
    "isLeapYear": false,
    "failedStage": "final-weekday"
}
```

O histórico ficará limitado às últimas 2.000 tentativas.

---

# 22. Revisão inteligente

A arquitetura deverá registrar as etapas em que o usuário apresenta dificuldade.

Categorias possíveis:

```text
century-anchor
first-odd-check
first-division
second-odd-check
second-division
modulo-seven
month-reference
leap-year
date-adjustment
final-weekday
```

O sistema poderá detectar:

- Maior taxa de erro;
- Menor velocidade;
- Meses problemáticos;
- Séculos problemáticos;
- Anos bissextos difíceis;
- Tipos de exercício com baixo desempenho;
- Erros recorrentes.

Futuro modo:

```text
Praticar meus erros
```

Esse modo deverá reaproveitar o mesmo engine de perguntas, validação, XP e histórico.

---

# 23. Desafio diário

A arquitetura será preparada para o desafio diário.

Possível estrutura:

```text
Desafio Diário
5 perguntas
Conjunto fixo por data
Pontuação
Bônus de conclusão
Streak diário
```

As perguntas poderão ser geradas com uma seed baseada na data, permitindo que o desafio seja consistente durante o mesmo dia.

O desafio deverá reutilizar:

- Gerador de perguntas;
- Calendar Engine;
- Odd + 11 Engine;
- Validação;
- Explicação;
- Progressão;
- Histórico.

Não deverá existir uma segunda implementação paralela do sistema de XP.

---

# 24. Design visual

A identidade visual será baseada em:

```text
OFF-WHITE / SAND + NAVY BLUE
```

## Fundo principal

Inspirado em:

- Areia seca;
- Papel premium;
- Marfim;
- Limestone;
- Branco quente.

Sugestões:

```css
--paper: #fffdf8;
--sand-50: #faf7f1;
--sand-100: #f4efe7;
--sand-200: #e7ded1;
--sand-300: #d9cebf;
```

## Navy

Cor principal de contraste:

```css
--navy-900: #122033;
--navy-800: #17283f;
--navy-700: #263d58;
--navy-600: #38546f;
```

## Cinzas quentes

```css
--warm-gray-500: #9c958c;
--warm-gray-600: #7c7972;
--warm-gray-700: #5e625f;
```

## Sucesso

Verde discreto:

```css
--success: #4d795e;
--success-soft: #e8f0e8;
```

## Erro

Vermelho queimado ou terracota:

```css
--error: #a95145;
--error-soft: #f6e9e5;
```

## Conquista e XP

Dourado/âmbar:

```css
--amber: #aa7d39;
--amber-light: #d9b66b;
```

A paleta deverá evitar:

- Neon;
- Roxo intenso;
- Gradientes exagerados;
- Azul elétrico;
- Cores infantis;
- Mais de quatro cores fortes simultaneamente.

---

# 25. Tipografia

## Tipografia de interface

Pode utilizar:

```text
Manrope
Inter
IBM Plex Sans
system-ui
```

Fallback:

```css
font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
```

## Tipografia de números

Para:

- Anos;
- Cronômetro;
- XP;
- Fórmulas;
- Estatísticas;
- Códigos.

Pode utilizar:

```text
DM Mono
IBM Plex Mono
JetBrains Mono
ui-monospace
```

Fallback:

```css
font-family:
    "IBM Plex Mono",
    "DM Mono",
    ui-monospace,
    SFMono-Regular,
    Consolas,
    monospace;
```

A fonte deverá ter fallback para funcionamento offline.

Idealmente, a V2 não dependerá de Google Fonts para funcionar.

---

# 26. Animações

As animações devem ser rápidas, suaves e funcionais.

## Acerto

- Check visual;
- Mudança para verde;
- Pequena expansão;
- Entrada do feedback;
- XP aparecendo;
- Streak aumentando;
- Barra avançando.

## Erro

- Terracota;
- Indicação visual clara;
- Entrada suave da correção;
- Destaque da resposta correta;
- Sem punição visual exagerada.

## Timeout

- Cor âmbar ou terracota suave;
- Ícone de relógio;
- Mensagem própria;
- Indicação de que não houve resposta.

## Pulo

- Aparência diferente do erro;
- Mensagem neutra;
- Sem confundir com timeout.

## Ganho de XP

- Número `+XP`;
- Pequeno deslocamento vertical;
- Atualização do total;
- Atualização da barra.

## Streak

- Incremento animado;
- Destaque da chama;
- Pequeno pulso;
- Sem efeitos excessivos.

## Novo recorde

- Destaque dourado;
- Mensagem específica;
- Pequena animação de conquista.

## Mudança de rank

- Atualização da categoria;
- Animação da barra;
- Mensagem de promoção;
- Destaque temporário do novo rank.

## Mudança de modo

- Atualização suave do título;
- Transição da pergunta;
- Reorganização de controles;
- Feedback visual do modo selecionado.

## Redução de movimento

A aplicação deverá respeitar:

```css
@media (prefers-reduced-motion: reduce)
```

Nesse modo:

- Animações serão removidas ou reduzidas;
- Transições serão instantâneas;
- Não haverá movimentos decorativos;
- O feedback permanecerá totalmente disponível.

---

# 27. Responsividade

O mobile será prioridade.

A interface deverá funcionar em:

- iPhone;
- Android;
- Tablets;
- Desktop;
- Orientação retrato;
- Orientação paisagem.

## Mobile

- Botões com área de toque ampla;
- Números grandes;
- Cronômetro sempre visível;
- Layout de coluna;
- Navegação simplificada;
- Feedback expansível;
- Teclado virtual considerado;
- Safe areas;
- Notch;
- Dynamic Island;
- Uso com uma mão.

## Desktop

- Painel de configuração lateral;
- Área de pergunta ampla;
- Estatísticas distribuídas;
- Maior aproveitamento horizontal;
- Navegação centralizada.

Uso de:

```css
env(safe-area-inset-top)
env(safe-area-inset-right)
env(safe-area-inset-bottom)
env(safe-area-inset-left)
```

---

# 28. Acessibilidade

A aplicação deverá incluir:

- HTML semântico;
- Labels reais;
- Foco visível;
- Navegação por teclado;
- `aria-live`;
- `aria-selected`;
- `role="tablist"`;
- `role="tab"`;
- `role="tabpanel"`;
- `role="timer"`;
- Contraste adequado;
- Estados de erro acessíveis;
- Estados de sucesso acessíveis;
- Textos alternativos;
- Feedback anunciado para leitores de tela.

O cronômetro não deverá anunciar todos os segundos para não causar excesso de leitura.

Ele poderá anunciar:

- Início;
- Últimos 10 segundos;
- Timeout.

---

# 29. PWA

O aplicativo será um PWA completo.

## Manifest

Deverá conter:

- Nome;
- Nome curto;
- Descrição;
- Ícones;
- Ícones maskable;
- Cor de tema;
- Cor de fundo;
- `display: standalone`;
- `start_url`;
- `scope`;
- Idioma;
- Orientação.

## Service Worker

Responsável por:

- Cache inicial;
- Funcionamento offline;
- Cache versionado;
- Atualização;
- Remoção de cache antigo;
- Fallback;
- Recuperação após erro de rede.

Arquivos essenciais no cache:

```text
index.html
styles.css
app.js
manifest.json
icon.svg
ícones adicionais
```

## Atualização

O Service Worker deverá usar versões:

```javascript
doomsday-mind-v2.0.0
```

Ao existir uma atualização:

- O novo cache será criado;
- O cache antigo será removido;
- A aplicação poderá mostrar uma mensagem de atualização;
- O usuário poderá recarregar a versão nova.

---

# 30. Armazenamento

O projeto continuará usando `localStorage`.

As informações deverão ser separadas.

## Histórico

```text
doomsday-mind-history-v2
```

## Progresso

```text
doomsday-mind-progress-v2
```

## Preferências

```text
doomsday-mind-preferences-v2
```

## Configurações

```text
doomsday-mind-settings-v2
```

## Versão

```text
doomsday-mind-storage-version
```

O rank não será salvo de forma independente.

O XP será a fonte de verdade.

---

# 31. Migração do sistema antigo

A V2 deverá ler dados antigos quando possível.

Dados antigos possíveis:

```text
doomsday-history
doomsday-game
best-streak
```

O sistema deverá:

1. Detectar os dados antigos;
2. Interpretar o histórico;
3. Converter tentativas antigas;
4. Preservar timestamps;
5. Preservar modos;
6. Preservar resultados;
7. Preservar tempos;
8. Inicializar campos que não existiam;
9. Salvar a nova estrutura;
10. Não apagar o formato antigo antes da migração terminar.

Campos inexistentes deverão receber:

```javascript
null
```

Não deverão ser inventados valores.

Por exemplo, se uma tentativa antiga não tinha a pergunta original:

```javascript
question: null
```

---

# 32. Testes

A V2 deverá possuir autoverificação.

## Datas conhecidas

Testar datas como:

```text
20/07/1969
04/07/1776
01/01/2000
29/02/2024
31/12/1999
```

## Anos comuns

- 1901;
- 1955;
- 1969;
- 1985;
- 1999;
- 2023.

## Anos bissextos

- 2000;
- 2004;
- 2020;
- 2024;
- 1900 como não bissexto;
- 2100 como não bissexto.

## Séculos

- 1583;
- 1700;
- 1800;
- 1900;
- 2000;
- 2100;
- 2200;
- 2500.

## Ímpar + 11

Testar:

- Últimos dígitos pares;
- Últimos dígitos ímpares;
- Segunda etapa ímpar;
- Anos terminados em 00;
- Múltiplos de 28;
- Limites do intervalo.

## Interface

Testar:

- Respostas com clique;
- Teclas 1–7;
- Enter;
- Escape;
- Pular;
- Timeout;
- Alteração de modo;
- Alteração de intervalo;
- Alteração de tempo;
- Campo numérico;
- Dados vazios;
- Limpeza de histórico.

---

# 33. Arquitetura de arquivos

O projeto será mantido simples, sem dezenas de pastas.

Estrutura principal:

```text
index.html
styles.css
app.js
manifest.json
service-worker.js
icon.svg
```

O `app.js` terá seções internas organizadas:

```javascript
Calendar Engine
Odd + 11 Engine
Question Generator
Answer Validator
Explanation Engine
Training Engine
Progression
Statistics
Storage
UI
PWA Bootstrap
```

O CSS terá seções:

```css
Design Tokens
Reset
Base
Typography
Header
Navigation
Buttons
Forms
Practice
Challenge
Feedback
Learning
Progress
Statistics
History
Responsive
Accessibility
Reduced Motion
```

---

# 34. Experiência de primeira abertura

Ao abrir pela primeira vez, o usuário verá:

- Identidade Doomsday Mind;
- Explicação curta do método;
- Modo recomendado;
- Uma pergunta simples;
- Tempo livre;
- Feedback completo;
- Ganho inicial de XP.

A primeira experiência não deverá exigir:

- Conta;
- Login;
- Configuração complexa;
- Permissão desnecessária;
- Cadastro;
- Internet contínua.

---

# 35. Estados vazios

A aplicação deverá tratar estados sem dados.

## Sem histórico

```text
Você ainda não completou nenhuma tentativa.
Comece um treino para construir seu histórico.
```

## Sem estatísticas

```text
Ainda não há dados suficientes para calcular sua evolução.
```

## Rank inicial

```text
Você está começando sua jornada.
Complete acertos para ganhar XP.
```

## Sem progresso diário

```text
Você ainda não praticou hoje.
```

## Histórico vazio após apagar dados

```text
Seu histórico foi limpo.
A próxima tentativa aparecerá aqui.
```

---

# 36. Estados de erro

A aplicação deverá lidar com:

- Entrada numérica inválida;
- Falha ao ler `localStorage`;
- Dados corrompidos;
- Service Worker indisponível;
- Falha de cache;
- Intervalo inválido;
- Ano inválido;
- Mês inválido;
- Tempo inválido;
- Falha de migração.

Quando possível, o sistema deverá:

- Recuperar dados válidos;
- Ignorar apenas registros inválidos;
- Não quebrar a aplicação inteira;
- Mostrar mensagem clara;
- Manter o usuário capaz de treinar.

---

# 37. Desempenho

O projeto não deverá utilizar framework pesado sem necessidade.

Prioridades:

- JavaScript vanilla;
- Poucas dependências;
- Carregamento rápido;
- Cache eficiente;
- Nenhuma API externa necessária;
- Renderização apenas do que mudou;
- Funções pequenas;
- Dados limitados;
- Histórico máximo de 2.000 itens.

---

# 38. Segurança e privacidade

O aplicativo não terá:

- Login;
- Conta;
- Backend;
- Analytics;
- API externa;
- Banco remoto;
- Rastreamento.

Os dados ficarão no dispositivo do usuário.

Será importante avisar:

```text
Se os dados do navegador forem apagados, o progresso local poderá ser perdido.
```

No futuro, poderá ser implementado:

- Exportação JSON;
- Importação JSON;
- Backup manual;
- Transferência entre dispositivos.

---

# 39. Futuras extensões

Possibilidades futuras:

- Conquistas;
- Badges;
- Desafio diário;
- Ranking local;
- Ranking online, caso solicitado;
- Perfil;
- Exportação;
- Importação;
- Gráficos de XP;
- Gráficos de precisão;
- Revisão inteligente;
- Dificuldade adaptativa;
- Missões semanais;
- Meta diária;
- Modo sobrevivência;
- Modo sem erros;
- Modo competitivo;
- Modo reverso;
- Treino de datas históricas;
- Treino por século;
- Treino por mês;
- Sons;
- Vibração;
- Instalação aprimorada;
- Ícones nativos para iOS e Android.

---

# 40. Resultado final esperado

O produto final deverá parecer:

```text
Um aplicativo premium de treinamento mental
para cálculo rápido de dias da semana,
baseado no método Ímpar + 11,
com aprendizado progressivo,
correção inteligente,
XP,
ranks,
streaks,
histórico,
estatísticas,
funcionamento offline
e experiência mobile refinada.
```

A aplicação não deverá parecer simplesmente:

```text
Uma calculadora com alguns cards.
```

Cada tela deverá ter:

- Propósito;
- Hierarquia;
- Estados;
- Feedback;
- Acessibilidade;
- Responsividade;
- Animações;
- Persistência;
- Coerência visual;
- Comportamento real.

Esse é o escopo completo da V2 do **Doomsday Mind**.
