const text = (...lines) => lines.join("\n");

const odin = (title, slug, summary) => ({
  source: "The Odin Project",
  title,
  url: "https://www.theodinproject.com/lessons/" + slug,
  summary
});

const files = (title, body, script, css = "") => ({
  "index.html": text(
    "<!DOCTYPE html>",
    '<html lang="pt-BR"><head><meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<link rel="stylesheet" href="style.css"></head><body>',
    '<main><p class="eyebrow">PROJETO GUIADO</p><h1>' + title + "</h1>" + body + "</main>",
    '<script src="script.js"></script></body></html>'
  ),
  "style.css": text(
    "body { font-family: system-ui, sans-serif; margin: 0; padding: 28px; background: #f7f7f5; color: #171717; }",
    "main { max-width: 620px; margin: auto; border: 1px solid #d4d4d4; background: white; padding: 28px; }",
    ".eyebrow { font-size: 10px; font-weight: 800; letter-spacing: .16em; color: #737373; }",
    "button, input { padding: 10px 12px; }",
    css
  ),
  "script.js": script
});

const problemSolving = {
  id: "odin-problem-solving-fizzbuzz",
  moduleId: "mod-2",
  moduleName: "2. Funções & Resolução de Problemas",
  title: "Resolução de problemas com FizzBuzz",
  category: "Fundamentos Odin",
  estimatedMinutes: 30,
  instruction: {
    brief: "Antes de programar, entenda entradas e saídas, escreva pseudocódigo e divida o problema em partes pequenas.",
    deepLesson: text(
      "### Entender → planejar → programar",
      "Reescreva o problema com suas palavras. Liste entradas, saída e casos-limite. Escreva os passos em linguagem comum e só então traduza cada passo para código.",
      "",
      "### A ordem importa",
      "Em FizzBuzz, o caso divisível por 3 e 5 é o mais específico. Teste-o primeiro ou o número 15 será classificado incorretamente.",
      "",
      "### Verifique sua previsão",
      "Antes de executar, preveja as saídas para 1, 3, 5 e 15. Um teste que falha mostra exatamente qual hipótese deve ser revista."
    ),
    learningObjective: "Aplicar decomposição, pseudocódigo e casos de teste a um algoritmo.",
    taskDescription: "Implemente fizzBuzz(limite), retornando um array de 1 ao limite com Fizz, Buzz e FizzBuzz.",
    progressiveHints: [
      "Crie um array resultado e percorra os números de 1 até limite.",
      "Use numero % divisor === 0 para testar divisibilidade.",
      "Teste a divisibilidade por 3 e 5 antes das condições isoladas."
    ],
    curatedLinks: [odin("Problem Solving", "foundations-problem-solving", "Método para entender, planejar e decompor problemas.")]
  },
  playground: {
    files: files("FizzBuzz", "<p>Implemente a função e confira o array no console.</p>", text(
      "function fizzBuzz(limite) {",
      "  // Crie o resultado, percorra os números e aplique as regras.",
      "}",
      "",
      "console.log(fizzBuzz(15));"
    )),
    activeFile: "script.js",
    tasks: [
      {
        id: "fizzbuzz-size",
        description: "fizzBuzz(limite) retorna um array com a quantidade correta.",
        hint: "A função precisa devolver o array com return.",
        check: (doc, win, helpers) => {
          const fn = helpers.getVar("fizzBuzz");
          const value = typeof fn === "function" ? fn(5) : null;
          return Array.isArray(value) && value.length === 5
            ? { pass: true }
            : { pass: false, tip: "fizzBuzz(5) deve retornar um array com 5 itens." };
        }
      },
      {
        id: "fizzbuzz-rules",
        description: "As quatro saídas possíveis aparecem nos lugares certos.",
        hint: "Confira especialmente o caso 15.",
        check: (doc, win, helpers) => {
          const fn = helpers.getVar("fizzBuzz");
          const value = typeof fn === "function" ? fn(15) : [];
          const pass = value[0] === 1 && value[2] === "Fizz" && value[4] === "Buzz" && value[14] === "FizzBuzz";
          return pass ? { pass: true } : { pass: false, tip: "Revise os resultados para 1, 3, 5 e 15." };
        }
      }
    ]
  }
};

const rockPaperScissors = {
  id: "odin-rock-paper-scissors-console",
  moduleId: "mod-2",
  moduleName: "2. Funções & Resolução de Problemas",
  title: "Projeto: Pedra, Papel e Tesoura no console",
  category: "Projeto Odin",
  estimatedMinutes: 55,
  instruction: {
    brief: "Construa a lógica do jogo sem interface. Funções pequenas tornam as regras fáceis de testar.",
    deepLesson: text(
      "### Decomponha o jogo",
      "getComputerChoice cuida apenas do sorteio. playRound normaliza a entrada e decide uma rodada.",
      "",
      "### Controle o escopo",
      "Não crie botões ainda. Teste empates, vitórias e derrotas no console e faça commits pequenos.",
      "",
      "### Defina um contrato",
      "A rodada retorna human, computer ou draw. Uma interface futura poderá consumir esse resultado sem conhecer as regras internas."
    ),
    learningObjective: "Decompor regras de negócio em funções pequenas e testáveis.",
    taskDescription: "Implemente o sorteio do computador e a decisão de uma rodada, ignorando diferenças entre maiúsculas e minúsculas.",
    progressiveHints: [
      "Sorteie um índice de um array com as três escolhas.",
      "Normalize humanChoice com toLowerCase().",
      "Após o empate, liste as três combinações em que a pessoa vence."
    ],
    curatedLinks: [odin("Project: Rock Paper Scissors", "foundations-rock-paper-scissors", "Primeiro projeto JavaScript do Odin, jogado inicialmente no console.")]
  },
  playground: {
    files: files("Pedra, Papel e Tesoura", "<p>Esta versão roda apenas no console.</p>", text(
      "function getComputerChoice() {",
      '  // Retorne "rock", "paper" ou "scissors" aleatoriamente.',
      "}",
      "",
      "function playRound(humanChoice, computerChoice) {",
      '  // Retorne "human", "computer" ou "draw".',
      "}"
    )),
    activeFile: "script.js",
    tasks: [
      {
        id: "rps-choice",
        description: "getComputerChoice sempre devolve uma escolha válida.",
        hint: "Use um array com os três valores aceitos.",
        check: (doc, win, helpers) => {
          const fn = helpers.getVar("getComputerChoice");
          const valid = new Set(["rock", "paper", "scissors"]);
          const choices = typeof fn === "function" ? Array.from({ length: 20 }, () => fn()) : [];
          return choices.length === 20 && choices.every((choice) => valid.has(choice))
            ? { pass: true }
            : { pass: false, tip: "Retorne somente rock, paper ou scissors." };
        }
      },
      {
        id: "rps-rules",
        description: "playRound resolve empates, vitórias e derrotas.",
        hint: "Teste as três combinações vencedoras depois do empate.",
        check: (doc, win, helpers) => {
          const fn = helpers.getVar("playRound");
          const pass = typeof fn === "function"
            && fn("rock", "scissors") === "human"
            && fn("paper", "rock") === "human"
            && fn("scissors", "paper") === "human"
            && fn("rock", "paper") === "computer"
            && fn("paper", "paper") === "draw"
            && fn("ROCK", "scissors") === "human";
          return pass ? { pass: true } : { pass: false, tip: "Revise empate, combinações vencedoras e normalização da entrada." };
        }
      }
    ]
  }
};

const objectBasics = {
  id: "odin-object-basics",
  moduleId: "mod-3",
  moduleName: "3. Loops, Arrays & Objetos",
  title: "Objetos: propriedades, métodos e referências",
  category: "Estruturas de Dados",
  estimatedMinutes: 30,
  instruction: {
    brief: "Objetos agrupam dados e comportamentos relacionados, permitindo representar entidades sem variáveis soltas.",
    deepLesson: text(
      "### Modele uma entidade",
      "Use notação de ponto para chaves conhecidas e colchetes para chaves dinâmicas. Uma função guardada em uma propriedade é um método.",
      "",
      "### Valor e referência",
      "Primitivos são copiados por valor. Objetos são compartilhados por referência; uma mutação pode ser observada por todas as variáveis ligadas ao objeto.",
      "",
      "### Método contextual",
      "O método info deve usar this para descrever o próprio livro, sem depender de variáveis externas."
    ),
    learningObjective: "Criar objetos, acessar propriedades e compreender referências.",
    taskDescription: "Crie criarLivro(titulo, autor, paginas, lido), retornando um novo objeto com essas propriedades e um método info().",
    progressiveHints: [
      "Retorne um objeto literal criado dentro da função.",
      "Inclua info() ao lado das propriedades.",
      "Use this.titulo, this.autor e this.paginas."
    ],
    curatedLinks: [odin("Object Basics", "foundations-object-basics", "Objetos, propriedades, métodos e diferença entre valor e referência.")]
  },
  playground: {
    files: files("Catálogo de livros", '<p id="preview">Crie um livro para ver sua descrição.</p>', text(
      "function criarLivro(titulo, autor, paginas, lido) {",
      "  // Retorne um novo objeto com as propriedades e info().",
      "}",
      "",
      'const exemplo = criarLivro("O Hobbit", "J.R.R. Tolkien", 310, true);',
      'if (exemplo) document.querySelector("#preview").textContent = exemplo.info();'
    )),
    activeFile: "script.js",
    tasks: [
      {
        id: "object-data",
        description: "O objeto preserva título, autor, páginas e estado de leitura.",
        hint: "Use a forma abreviada de propriedades no objeto.",
        check: (doc, win, helpers) => {
          const fn = helpers.getVar("criarLivro");
          const book = typeof fn === "function" ? fn("Duna", "Frank Herbert", 544, false) : null;
          const pass = book?.titulo === "Duna" && book?.autor === "Frank Herbert" && book?.paginas === 544 && book?.lido === false;
          return pass ? { pass: true } : { pass: false, tip: "Preserve os quatro argumentos no objeto retornado." };
        }
      },
      {
        id: "object-method",
        description: "info() usa os dados do próprio livro e cada chamada cria um objeto.",
        hint: "Use this dentro do método e crie o objeto dentro da função.",
        check: (doc, win, helpers) => {
          const fn = helpers.getVar("criarLivro");
          if (typeof fn !== "function") return { pass: false, tip: "Declare criarLivro()." };
          const first = fn("Duna", "Frank Herbert", 544, false);
          const second = fn("B", "Autora", 20, true);
          const info = typeof first?.info === "function" ? String(first.info()) : "";
          const pass = first !== second && info.includes("Duna") && info.includes("Frank Herbert") && info.includes("544");
          return pass ? { pass: true } : { pass: false, tip: "info() deve usar this e cada chamada deve criar um objeto independente." };
        }
      }
    ]
  }
};

const rockPaperScissorsUi = {
  id: "odin-rock-paper-scissors-ui",
  moduleId: "mod-4",
  moduleName: "4. DOM, Eventos & Projetos",
  title: "Projeto: Pedra, Papel e Tesoura com interface",
  category: "Projeto Odin",
  estimatedMinutes: 60,
  instruction: {
    brief: "Revisite o jogo sem descartar sua lógica: botões fornecem a escolha e o DOM apresenta rodada, placar e vencedor.",
    deepLesson: text(
      "### Evolua o projeto",
      "Reutilize a lógica do console. O novo fluxo é clique → escolha → rodada → placar → renderização.",
      "",
      "### Separe responsabilidades",
      "As regras retornam dados; outra função altera a tela. Mantenha o placar fora do listener para preservar o estado entre cliques.",
      "",
      "### Encerre a partida",
      "Quando alguém alcançar 5 pontos, anuncie o vencedor em uma região com aria-live."
    ),
    learningObjective: "Conectar lógica existente ao DOM e manter estado entre eventos.",
    taskDescription: "Faça os três botões jogarem, atualize mensagem e placar, e anuncie o vencedor ao chegar a 5.",
    progressiveHints: [
      "Percorra os elementos com data-choice.",
      "Leia event.currentTarget.dataset.choice.",
      "Atualize os placares no DOM depois de cada rodada."
    ],
    curatedLinks: [odin("Revisiting Rock Paper Scissors", "foundations-revisiting-rock-paper-scissors", "Evolução oficial do jogo com interface e placar.")]
  },
  playground: {
    files: files("Pedra, Papel e Tesoura", text(
      '<div class="choices"><button data-choice="rock">Pedra</button><button data-choice="paper">Papel</button><button data-choice="scissors">Tesoura</button></div>',
      '<p id="round-result">Escolha sua jogada.</p>',
      '<p>Você <strong id="human-score">0</strong> × <strong id="computer-score">0</strong> Computador</p>',
      '<p id="game-result" aria-live="polite"></p>'
    ), text(
      "let humanScore = 0;",
      "let computerScore = 0;",
      "function getComputerChoice() {}",
      "function playRound(humanChoice, computerChoice) {}",
      "function renderRound(result) {}",
      "// Conecte os três botões com addEventListener."
    ), ".choices { display: flex; gap: 8px; margin: 22px 0; }"),
    activeFile: "script.js",
    tasks: [
      {
        id: "rps-ui-click",
        description: "Clicar em Pedra joga uma rodada e altera a mensagem.",
        hint: "Adicione um listener de click aos botões.",
        check: (doc) => {
          const message = doc.querySelector("#round-result");
          const before = message?.textContent;
          doc.querySelector('[data-choice="rock"]')?.click();
          return message && message.textContent !== before
            ? { pass: true }
            : { pass: false, tip: "O clique deve atualizar #round-result." };
        }
      },
      {
        id: "rps-ui-state",
        description: "O placar muda após uma rodada e a implementação verifica o limite 5.",
        hint: "Reflita o placar no DOM e compare-o com 5.",
        check: (doc, win, helpers) => {
          const score = Number(doc.querySelector("#human-score")?.textContent) + Number(doc.querySelector("#computer-score")?.textContent);
          const limit = /(?:===|>=)\s*5/.test(helpers.source || "");
          return score > 0 && limit
            ? { pass: true }
            : { pass: false, tip: "Atualize um placar após o clique e verifique quando ele chegar a 5." };
        }
      }
    ]
  }
};

const etchASketch = {
  id: "odin-etch-a-sketch",
  moduleId: "mod-4",
  moduleName: "4. DOM, Eventos & Projetos",
  title: "Projeto: Etch-a-Sketch",
  category: "Projeto Odin",
  estimatedMinutes: 75,
  instruction: {
    brief: "Gere uma grade com JavaScript e use eventos de ponteiro para transformá-la em uma área de desenho.",
    deepLesson: text(
      "### DOM gerado por código",
      "A grade nasce de um loop, não de elementos copiados no HTML. Use Flexbox nesta etapa.",
      "",
      "### Recriação previsível",
      "Ao mudar o tamanho, limpe o contêiner e gere tudo novamente. A área visual fica fixa e a largura de cada célula muda.",
      "",
      "### Interação",
      "Cada célula adiciona a classe painted no mouseover; o CSS controla sua aparência."
    ),
    learningObjective: "Combinar loops, criação de elementos, eventos e Flexbox.",
    taskDescription: "Implemente criarGrade(tamanho), gere 16×16 células e permita recriar a grade entre 1 e 64.",
    progressiveHints: [
      "Repita tamanho * tamanho vezes.",
      "Use 100 / tamanho como largura percentual.",
      "Limpe a grade antes de adicionar novas células."
    ],
    curatedLinks: [odin("Project: Etch-a-Sketch", "foundations-etch-a-sketch", "Projeto de DOM e Flexbox com grade dinâmica.")]
  },
  playground: {
    files: files("Etch-a-Sketch", '<input id="size" type="number" min="1" max="64" value="16"><button id="rebuild">Recriar</button><div id="grid"></div>', text(
      'const grid = document.querySelector("#grid");',
      "function criarGrade(tamanho) {",
      '  // Crie tamanho * tamanho elementos com classe "cell".',
      "}",
      'document.querySelector("#rebuild").addEventListener("click", () => {});',
      "criarGrade(16);"
    ), "#grid { display: flex; flex-wrap: wrap; width: 100%; aspect-ratio: 1; border: 1px solid; margin-top: 12px; } .cell { box-sizing: border-box; border: 1px solid #eee; } .cell.painted { background: #171717; }"),
    activeFile: "script.js",
    tasks: [
      {
        id: "etch-grid",
        description: "A grade inicial possui 256 células criadas pelo JavaScript.",
        hint: "16 × 16 = 256.",
        check: (doc) => doc.querySelectorAll("#grid .cell").length === 256
          ? { pass: true }
          : { pass: false, tip: "Crie 256 elementos .cell ao carregar." }
      },
      {
        id: "etch-behaviour",
        description: "criarGrade(8) substitui a grade e mouseover pinta uma célula.",
        hint: "Limpe o contêiner e adicione o listener ao criar cada célula.",
        check: (doc, win, helpers) => {
          const fn = helpers.getVar("criarGrade");
          if (typeof fn !== "function") return { pass: false, tip: "Declare criarGrade(tamanho)." };
          fn(8);
          const cell = doc.querySelector("#grid .cell");
          cell?.dispatchEvent(new win.MouseEvent("mouseover", { bubbles: true }));
          return doc.querySelectorAll("#grid .cell").length === 64 && cell?.classList.contains("painted")
            ? { pass: true }
            : { pass: false, tip: "Uma grade 8×8 deve ter 64 células e reagir ao mouseover." };
        }
      }
    ]
  }
};

const calculator = {
  id: "odin-calculator",
  moduleId: "mod-4",
  moduleName: "4. DOM, Eventos & Projetos",
  title: "Projeto: Calculadora no navegador",
  category: "Projeto Odin",
  estimatedMinutes: 90,
  instruction: {
    brief: "Combine funções puras, estado e eventos numa calculadora completa. Não use eval nem new Function.",
    deepLesson: text(
      "### Lógica antes da interface",
      "Implemente add, subtract, multiply, divide e operate. Só depois conecte os botões.",
      "",
      "### Estado mínimo",
      "Guarde primeiro operando, operador e valor atual. O fluxo básico é dígito → operador → dígito → igual.",
      "",
      "### Casos-limite",
      "Trate divisão por zero, operadores consecutivos, limpeza e resultados longos sem recorrer a eval."
    ),
    learningObjective: "Coordenar lógica, estado e DOM em uma aplicação completa.",
    taskDescription: "Implemente as operações, operate(), entrada pelos botões, resultado com =, limpeza com C e divisão por zero.",
    progressiveHints: [
      "Valide primeiro as cinco funções puras.",
      "Use uma string para montar números com vários dígitos.",
      "No igual, converta operandos com Number e atualize o display."
    ],
    curatedLinks: [odin("Project: Calculator", "foundations-calculator", "Projeto final de Foundations com operações, interface e casos-limite.")]
  },
  playground: {
    files: files("Calculadora", text(
      '<output id="display" aria-live="polite">0</output><div class="keys">',
      '<button data-action="clear">C</button><button data-value="7">7</button><button data-value="8">8</button><button data-operator="/">÷</button>',
      '<button data-value="9">9</button><button data-value="4">4</button><button data-value="5">5</button><button data-value="6">6</button>',
      '<button data-value="1">1</button><button data-value="2">2</button><button data-value="3">3</button><button data-operator="*">×</button>',
      '<button data-value="0">0</button><button data-action="equals">=</button><button data-operator="-">−</button><button data-operator="+">+</button></div>'
    ), text(
      "function add(a, b) {}",
      "function subtract(a, b) {}",
      "function multiply(a, b) {}",
      "function divide(a, b) {}",
      "function operate(operator, a, b) {}",
      "let firstOperand = null;",
      "let currentOperator = null;",
      'let displayValue = "0";',
      'const display = document.querySelector("#display");',
      "// Conecte números, operadores, igual e limpar."
    ), "#display { display: block; padding: 14px; background: #171717; color: white; text-align: right; font: 700 28px monospace; } .keys { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 8px; }"),
    activeFile: "script.js",
    tasks: [
      {
        id: "calc-logic",
        description: "As quatro funções e operate retornam resultados corretos.",
        hint: "Implemente cada operação e direcione pelo operador.",
        check: (doc, win, helpers) => {
          const add = helpers.getVar("add");
          const subtract = helpers.getVar("subtract");
          const multiply = helpers.getVar("multiply");
          const divide = helpers.getVar("divide");
          const operate = helpers.getVar("operate");
          const pass = add?.(2, 3) === 5 && subtract?.(9, 4) === 5 && multiply?.(6, 7) === 42 && divide?.(8, 2) === 4
            && operate?.("+", 12, 7) === 19 && operate?.("/", 8, 2) === 4;
          return pass ? { pass: true } : { pass: false, tip: "Revise as quatro funções e o direcionamento de operate." };
        }
      },
      {
        id: "calc-safety-ui",
        description: "Divisão por zero é tratada; 7 + 8 = mostra 15 e C restaura 0.",
        hint: "Impeça Infinity e identifique os botões pelos atributos data.",
        check: (doc, win, helpers) => {
          const operate = helpers.getVar("operate");
          const zero = typeof operate === "function" ? operate("/", 10, 0) : Infinity;
          const click = (selector) => doc.querySelector(selector)?.click();
          click('[data-action="clear"]');
          click('[data-value="7"]');
          click('[data-operator="+"]');
          click('[data-value="8"]');
          click('[data-action="equals"]');
          const result = doc.querySelector("#display")?.textContent.trim();
          click('[data-action="clear"]');
          const cleared = doc.querySelector("#display")?.textContent.trim();
          const pass = zero !== Infinity && !Number.isNaN(zero) && result === "15" && cleared === "0";
          return pass ? { pass: true } : { pass: false, tip: "Trate divisão por zero; 7 + 8 = deve mostrar 15 e C deve mostrar 0." };
        }
      }
    ]
  }
};

export const odinFoundationStageInsertions = [
  { after: "js-4-arrow-functions-defaults", stage: problemSolving },
  { after: "js-5-mini-project-calculator", stage: rockPaperScissors },
  { after: "js-8-array-reduce-superpower", stage: objectBasics },
  { after: "js-10-dom-events-and-forms", stage: rockPaperScissorsUi },
  { after: "js-11-dom-dynamic-creation-list", stage: etchASketch },
  { after: "odin-etch-a-sketch", stage: calculator }
];
