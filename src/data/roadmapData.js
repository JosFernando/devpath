// ============================================================
// DEVPATH: SUPER CURRÍCULO 100% JAVASCRIPT — DO ZERO AO AVANÇADO
// Conteúdo Pedagógico Aprofundado, Exemplos Reais e Desafios
// ============================================================

import { odinFoundationStageInsertions } from './odinFoundationStages.js';
import { curriculumLessons } from './curriculumLessons.js';
import { curriculumChecks } from './curriculumChecks.js';
import { foundationInsertions, foundationModuleProjects } from './foundationExpansion.js';
import { advancedModules, advancedStages } from './advancedExpansion.js';
import { trainingPhases, foundationModuleDetails, existingProjectBriefs } from './trainingStructure.js';

export const jsRoadmapCourse = {
  id: "javascript-mastery",
  title: "JavaScript: Do Zero ao Avançado (Mão na Massa)",
  slug: "javascript",
  description: "Uma trilha prática de JavaScript inspirada na progressão do The Odin Project: fundamentos, resolução de problemas, projetos no navegador e conceitos avançados. Cada etapa combina estudo dirigido, código inicial e critérios automáticos de conclusão.",
  source: {
    name: "The Odin Project",
    url: "https://www.theodinproject.com/",
    note: "Referências selecionadas do currículo aberto do The Odin Project, adaptadas a uma experiência prática em português."
  },
  modules: [
    { id: "mod-1", name: "1. Fundamentos da Linguagem", icon: "🌱", desc: "Variáveis, tipos primitivos, operadores lógicos e condicionais" },
    { id: "mod-2", name: "2. Funções & Resolução de Problemas", icon: "⚡", desc: "Funções, escopo, pseudocódigo, decomposição e o primeiro projeto de lógica" },
    { id: "mod-3", name: "3. Loops, Arrays & Objetos", icon: "📦", desc: "Repetição, métodos funcionais, objetos e exercícios orientados por testes" },
    { id: "mod-4", name: "4. DOM, Eventos & Projetos", icon: "🌐", desc: "Manipulação do DOM consolidada em interfaces e projetos progressivos" },
    { id: "mod-5", name: "5. Web APIs & Persistência (localStorage)", icon: "💾", desc: "Armazenamento persistente com JSON e temporizadores (setInterval)" },
    { id: "mod-6", name: "6. JavaScript Assíncrono & APIs REST", icon: "🚀", desc: "Promises, async/await, tratamento de erros e requisições com fetch()" },
    { id: "mod-7", name: "7. POO & Tópicos Avançados", icon: "🏆", desc: "Classes ES6, construtores, herança, closures e Projeto Capstone" }
  ],
  stages: [
    // ===================================================================
    // MÓDULO 1: FUNDAMENTOS DA LINGUAGEM
    // ===================================================================
    {
      id: "js-1-variables-and-types",
      stepNumber: 1,
      moduleId: "mod-1",
      moduleName: "1. Fundamentos da Linguagem",
      title: "Variáveis Modernas (const & let) e Tipos Primitivos",
      category: "Fundamentos",
      estimatedMinutes: 15,
      dependencies: [],
      instruction: {
        brief: "No JavaScript moderno (ES6+), variáveis são declaradas com 'const' ou 'let'. A regra de ouro é: use sempre 'const' por padrão. Use 'let' apenas quando o valor precisar ser reatribuído no futuro. A palavra-chave antiga 'var' deve ser evitada por ter problemas de escopo.",
        deepLesson: `
### 📖 Teoria Detalhada:
O JavaScript possui tipos primitivos fundamentais:
1. **String (Texto):** Delimitado por aspas simples, duplas ou crases: \`'Olá'\`, \`"Mundo"\`, \`\\\`Template\\\`\`.
2. **Number (Números):** Inteiros ou decimais: \`42\`, \`3.14\`, \`-10\`.
3. **Boolean (Lógico):** Apenas dois valores possíveis: \`true\` ou \`false\`.
4. **Undefined:** Uma variável declarada mas sem valor atribuído.
5. **Null:** Ausência intencional de valor.

### 💻 Exemplo de Código:
\`\`\`javascript
const nome = "Maria";      // String (não muda)
let idade = 25;            // Number (pode mudar)
let estaLogado = true;     // Boolean

idade = 26;                // Válido! 'let' permite reatribuição
// nome = "João";          // ERRO! 'const' não permite reatribuição
\`\`\`

### ⚠️ Armadilha Comum:
Tentar reatribuir uma constante gera um erro do tipo \`TypeError: Assignment to constant variable\`. Lembre-se: se o dado não for mudar, use sempre \`const\`!
        `,
        learningObjective: "Aprender a declarar constantes e variáveis com os tipos corretos e entender a imutabilidade do const.",
        taskDescription: "No arquivo script.js, declare uma constante chamada 'nomeInstrutor' com o texto 'JavaScript' e uma variável 'anosExperiencia' com o número 5. Imprima ambos no console usando console.log.",
        progressiveHints: [
          "💡 Dica 1: Use const para nomeInstrutor: const nomeInstrutor = 'JavaScript';",
          "💡 Dica 2: Use let para anosExperiencia: let anosExperiencia = 5;",
          "💡 Dica 3: Exiba no console com: console.log(nomeInstrutor, anosExperiencia);"
        ],
        curatedLinks: [
          {
            source: "JavaScript.info",
            title: "Variáveis: let e const",
            url: "https://javascript.info/variables",
            summary: "Por que usamos const e let no JavaScript moderno e como funciona a memória."
          },
          {
            source: "MDN Web Docs",
            title: "Tipos de dados no JavaScript",
            url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Data_structures",
            summary: "Lista completa dos tipos primitivos e do operador typeof."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>1. Variáveis & Tipos</h2>
    <p>Abra o Console abaixo para ver o resultado do seu script!</p>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 20px; background: #090d16; color: white; }
.card { background: #111827; padding: 20px; border-radius: 12px; border: 1px solid #1f2937; }`,
          "script.js": `// 👇 DECLARE SUAS VARIÁVEIS AQUI:
// 1. const nomeInstrutor = 'JavaScript';
// 2. let anosExperiencia = 5;
// 3. console.log(nomeInstrutor, anosExperiencia);
`
        },
        activeFile: "script.js",
        tasks: [
          {
            id: "task-1-const",
            description: "Declare uma constante chamada `nomeInstrutor` com o valor `'JavaScript'` usando `const`.",
            hint: "const nomeInstrutor = 'JavaScript';",
            check: (doc, win, helpers) => {
              const src = helpers.source || '';
              if (!src.includes('nomeInstrutor')) {
                return { pass: false, tip: "Não encontramos a declaração de `nomeInstrutor`. Escreva: `const nomeInstrutor = 'JavaScript';`" };
              }
              const val = helpers.getVar('nomeInstrutor');
              if (typeof val !== 'string') {
                return { pass: false, tip: "Esperávamos que `nomeInstrutor` fosse um texto ('JavaScript'), mas recebemos " + typeof val + "." };
              }
              return { pass: true };
            }
          },
          {
            id: "task-2-let",
            description: "Declare uma variável chamada `anosExperiencia` com o número `5` usando `let`.",
            hint: "let anosExperiencia = 5;",
            check: (doc, win, helpers) => {
              const src = helpers.source || '';
              if (!src.includes('anosExperiencia')) {
                return { pass: false, tip: "Não encontramos a declaração de `anosExperiencia`. Escreva: `let anosExperiencia = 5;`" };
              }
              const val = helpers.getVar('anosExperiencia');
              if (typeof val !== 'number') {
                return { pass: false, tip: "Esperávamos que `anosExperiencia` fosse um número (5), mas recebemos " + typeof val + "." };
              }
              return { pass: true };
            }
          },
          {
            id: "task-3-log",
            description: "Imprima ambas as variáveis no terminal utilizando `console.log(nomeInstrutor, anosExperiencia)`.",
            hint: "console.log(nomeInstrutor, anosExperiencia);",
            check: (doc, win, helpers) => {
              const src = helpers.source || '';
              const hasLog = src.includes('console.log');
              if (!hasLog) {
                return { pass: false, tip: "Chame a função `console.log(nomeInstrutor, anosExperiencia);` para imprimir os valores." };
              }
              return { pass: true };
            }
          }
        ],
        tests: [
          {
            id: "test-var-types",
            description: "nomeInstrutor é string e anosExperiencia é number",
            check: (doc, win) => {
              if (typeof win.nomeInstrutor !== 'string') {
                return { pass: false, tip: "Declare a constante nomeInstrutor com um texto (ex: const nomeInstrutor = 'JavaScript';)." };
              }
              if (typeof win.anosExperiencia !== 'number') {
                return { pass: false, tip: "Declare a variável anosExperiencia com um número (ex: let anosExperiencia = 5;)." };
              }
              return { pass: true };
            }
          }
        ]
      }
    },
    {
      id: "js-2-template-literals",
      stepNumber: 2,
      moduleId: "mod-1",
      moduleName: "1. Fundamentos da Linguagem",
      title: "Template Literals & Interpolação de Strings",
      category: "Fundamentos",
      estimatedMinutes: 15,
      dependencies: ["js-1-variables-and-types"],
      instruction: {
        brief: "Antigamente, concatenar textos em JavaScript exigia o operador '+' repetidamente ('Olá ' + nome + ', você tem ' + idade + ' anos'). Com Template Literals (usando crases \`\`), você pode interpolar variáveis diretamente com \${variavel} de forma muito mais legível.",
        deepLesson: `
### 📖 Teoria Detalhada:
Template Literals utilizam o caractere de **crase (\`)** em vez de aspas:
- Permitem **interpolar expressões** dentro de \`\${expressao}\`.
- Suportam **quebras de linha automáticas** no texto sem precisar de \`\\n\`.
- Permitem fazer operações matemáticas diretamente no texto: \`\\\`Total: R$ \${preco * quantidade}\\\`\`.

### 💻 Exemplo de Código:
\`\`\`javascript
const produto = "Notebook";
const preco = 3500;

// Jeito antigo (ruim):
const msgAntiga = "O " + produto + " custa R$ " + preco + "!";

// Jeito moderno com Template Literals (elegante):
const msgModerna = \`O \${produto} custa R$ \${preco}!\`;
\`\`\`

### ⚠️ Armadilha Comum:
Usar aspas simples (\`'...\`) ou duplas (\`"...\`) por engano em vez de crases (\`\`...\`\`). A sintaxe \`\${variavel}\` só funciona dentro de **crases**!
        `,
        learningObjective: "Dominar a interpolação de strings com crases e criar mensagens dinâmicas.",
        taskDescription: "Crie uma função chamada 'formatarBoasVindas(nome, curso)'. Ela deve retornar a string: 'Olá, [nome]! Bem-vindo ao curso de [curso]!' usando Template Literals.",
        progressiveHints: [
          "💡 Dica 1: Use crases para envolver o texto: \`Olá, ...\`",
          "💡 Dica 2: Interpole os parâmetros: \`Olá, \${nome}! Bem-vindo ao curso de \${curso}!\`",
          "💡 Dica 3: Retorne o resultado com return."
        ],
        curatedLinks: [
          {
            source: "MDN Web Docs",
            title: "Template Literals",
            url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Template_literals",
            summary: "Sintaxe de strings com crase e expressões interpoladas."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>2. Template Literals</h2>
    <p>Teste formatarBoasVindas('Lucas', 'JavaScript') no console!</p>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 20px; background: #090d16; color: white; }
.card { background: #111827; padding: 20px; border-radius: 12px; border: 1px solid #1f2937; }`,
          "script.js": `// 👇 CRIE A FUNÇÃO formatarBoasVindas(nome, curso) AQUI:
function formatarBoasVindas(nome, curso) {
  return \`Olá, \${nome}! Bem-vindo ao curso de \${curso}!\`;
}

console.log(formatarBoasVindas('Ana', 'JavaScript'));
`
        },
        activeFile: "script.js",
        tasks: [
          {
            id: "task-formatar-func",
            description: "Crie uma função chamada `formatarBoasVindas(nome, curso)`.",
            hint: "function formatarBoasVindas(nome, curso) { ... }",
            check: (doc, win, helpers) => {
              if (typeof win.formatarBoasVindas !== 'function') {
                return { pass: false, tip: "Declare a função `formatarBoasVindas(nome, curso)`." };
              }
              return { pass: true };
            }
          },
          {
            id: "task-template-return",
            description: "A função deve retornar a string interpolada com crases: `Olá, ${nome}! Bem-vindo ao curso de ${curso}!`.",
            hint: "return `Olá, ${nome}! Bem-vindo ao curso de ${curso}!`;",
            check: (doc, win, helpers) => {
              if (typeof win.formatarBoasVindas !== 'function') {
                return { pass: false, tip: "Primeiro crie a função `formatarBoasVindas`." };
              }
              const res = win.formatarBoasVindas('Carlos', 'React');
              if (res !== 'Olá, Carlos! Bem-vindo ao curso de React!') {
                return { pass: false, tip: "Resultado incorreto. Esperado: 'Olá, Carlos! Bem-vindo ao curso de React!', mas recebemos: '" + res + "'." };
              }
              return { pass: true };
            }
          }
        ],
        tests: [
          {
            id: "test-template-literals",
            description: "formatarBoasVindas retorna a mensagem interpolada correta",
            check: (doc, win) => {
              if (typeof win.formatarBoasVindas !== 'function') {
                return { pass: false, tip: "Crie a função formatarBoasVindas(nome, curso)." };
              }
              const resultado = win.formatarBoasVindas('Carlos', 'React');
              if (resultado !== 'Olá, Carlos! Bem-vindo ao curso de React!') {
                return { pass: false, tip: "A mensagem deve ser exatamente 'Olá, [nome]! Bem-vindo ao curso de [curso]!'." };
              }
              return { pass: true };
            }
          }
        ]
      }
    },
    {
      id: "js-3-conditionals-and-strict-equality",
      stepNumber: 3,
      moduleId: "mod-1",
      moduleName: "1. Fundamentos da Linguagem",
      title: "Comparações Estritas (===) e Condicionais",
      category: "Fundamentos",
      estimatedMinutes: 20,
      dependencies: ["js-2-template-literals"],
      instruction: {
        brief: "No JavaScript existe uma diferença crucial entre '==' (igualdade solta com coerção de tipo perigosa) e '===' (igualdade estrita de valor e tipo). Programadores profissionais NUNCA usam '=='. Sempre use '===' e '!=='.",
        deepLesson: `
### 📖 Teoria Detalhada:
O operador \`==\` tenta converter os tipos antes de comparar, gerando bizarrices:
- \`0 == false\` ➔ \`true\` (perigo!)
- \`"" == 0\` ➔ \`true\` (perigo!)
- \`"5" == 5\` ➔ \`true\` (perigo!)

Já o operador estrito \`===\` verifica o **valor** E o **tipo**:
- \`"5" === 5\` ➔ \`false\` (uma string não é igual a um número!)
- \`5 === 5\` ➔ \`true\`.

### 💻 Exemplo de Condicional com Operador Ternário:
\`\`\`javascript
const nota = 8;

// Com if/else tradicional:
let resultado;
if (nota >= 7) {
  resultado = "Aprovado";
} else {
  resultado = "Reprovado";
}

// Com Operador Ternário (curto e direto):
const statusFinal = nota >= 7 ? "Aprovado" : "Reprovado";
\`\`\`
        `,
        learningObjective: "Compreender a igualdade estrita (===) e utilizar o operador ternário para decisões rápidas.",
        taskDescription: "Crie uma função chamada 'classificarNota(nota)'. Se a nota for maior ou igual a 90, retorne 'Excelente'. Se for entre 70 e 89, retorne 'Bom'. Caso contrário, retorne 'Precisa Melhorar'.",
        progressiveHints: [
          "💡 Dica 1: if (nota >= 90) { return 'Excelente'; }",
          "💡 Dica 2: else if (nota >= 70) { return 'Bom'; }",
          "💡 Dica 3: else { return 'Precisa Melhorar'; }"
        ],
        curatedLinks: [
          {
            source: "MDN Web Docs",
            title: "Operadores de Igualdade Estrita",
            url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Strict_equality",
            summary: "Por que você deve sempre usar === em vez de ==."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>3. Condicionais & Comparações</h2>
    <p>Abra o console para ver os testes da função classificarNota!</p>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 20px; background: #090d16; color: white; }
.card { background: #111827; padding: 20px; border-radius: 12px; border: 1px solid #1f2937; }`,
          "script.js": `// 👇 CRIE A FUNÇÃO classificarNota(nota) AQUI:
function classificarNota(nota) {
  if (nota >= 90) return 'Excelente';
  if (nota >= 70) return 'Bom';
  return 'Precisa Melhorar';
}

console.log("Nota 95:", classificarNota(95));
console.log("Nota 75:", classificarNota(75));
console.log("Nota 50:", classificarNota(50));
`
        },
        activeFile: "script.js",
        tasks: [
          {
            id: "task-classificar-func",
            description: "Crie a função `classificarNota(nota)`.",
            hint: "function classificarNota(nota) { ... }",
            check: (doc, win, helpers) => {
              if (typeof win.classificarNota !== 'function') {
                return { pass: false, tip: "Declare a função `classificarNota(nota)`." };
              }
              return { pass: true };
            }
          },
          {
            id: "task-nota-alta",
            description: "Para notas maiores ou iguais a 90, retorne `'Excelente'`.",
            hint: "if (nota >= 90) return 'Excelente';",
            check: (doc, win, helpers) => {
              if (typeof win.classificarNota !== 'function') {
                return { pass: false, tip: "Primeiro crie a função `classificarNota`." };
              }
              if (win.classificarNota(95) !== 'Excelente' || win.classificarNota(90) !== 'Excelente') {
                return { pass: false, tip: "Para notas >= 90, deve retornar exatamente 'Excelente'." };
              }
              return { pass: true };
            }
          },
          {
            id: "task-nota-media-baixa",
            description: "Para notas entre 70 e 89 retorne `'Bom'`, e para menores de 70 retorne `'Precisa Melhorar'`.",
            hint: "if (nota >= 70) return 'Bom'; return 'Precisa Melhorar';",
            check: (doc, win, helpers) => {
              if (typeof win.classificarNota !== 'function') {
                return { pass: false, tip: "Primeiro crie a função `classificarNota`." };
              }
              if (win.classificarNota(75) !== 'Bom') {
                return { pass: false, tip: "Para nota 75 (entre 70 e 89) esperávamos 'Bom', mas recebemos '" + win.classificarNota(75) + "'." };
              }
              if (win.classificarNota(55) !== 'Precisa Melhorar') {
                return { pass: false, tip: "Para nota 55 (< 70) esperávamos 'Precisa Melhorar', mas recebemos '" + win.classificarNota(55) + "'." };
              }
              return { pass: true };
            }
          }
        ],
        tests: [
          {
            id: "test-nota-class",
            description: "classificarNota retorna as strings corretas para notas altas, médias e baixas",
            check: (doc, win) => {
              if (typeof win.classificarNota !== 'function') {
                return { pass: false, tip: "Crie a função classificarNota(nota)." };
              }
              if (win.classificarNota(92) !== 'Excelente') {
                return { pass: false, tip: "Para nota >= 90 deve retornar 'Excelente'." };
              }
              if (win.classificarNota(75) !== 'Bom') {
                return { pass: false, tip: "Para nota entre 70 e 89 deve retornar 'Bom'." };
              }
              if (win.classificarNota(55) !== 'Precisa Melhorar') {
                return { pass: false, tip: "Para nota < 70 deve retornar 'Precisa Melhorar'." };
              }
              return { pass: true };
            }
          }
        ]
      }
    },

    // ===================================================================
    // MÓDULO 2: FUNÇÕES & ESCOPO
    // ===================================================================
    {
      id: "js-4-arrow-functions-defaults",
      stepNumber: 4,
      moduleId: "mod-2",
      moduleName: "2. Funções & Escopo",
      title: "Arrow Functions e Parâmetros com Valor Padrão",
      category: "Funções",
      estimatedMinutes: 20,
      dependencies: ["js-3-conditionals-and-strict-equality"],
      instruction: {
        brief: "Arrow Functions (=>) são a maneira moderna e enxuta de criar funções em JavaScript. Além disso, podemos definir parâmetros padrão caso o usuário não passe algum argumento.",
        deepLesson: `
### 📖 Teoria Detalhada:
1. **Sintaxe de Arrow Function:**
\`\`\`javascript
// Função tradicional:
function somar(a, b) {
  return a + b;
}

// Arrow Function equivalente:
const somar = (a, b) => a + b; // Retorno implícito quando em 1 linha!
\`\`\`

2. **Parâmetros com Valor Padrão (Default Parameters):**
Se uma função precisa de uma taxa ou de uma saudação, podemos definir um valor padrão direto na lista de argumentos:
\`\`\`javascript
const saudar = (nome = "Visitante") => \`Olá, \${nome}!\`;

saudar("Lucas"); // "Olá, Lucas!"
saudar();        // "Olá, Visitante!" (usou o valor padrão!)
\`\`\`
        `,
        learningObjective: "Construir arrow functions com retorno implícito e parâmetros pré-definidos.",
        taskDescription: "Crie uma arrow function chamada 'calcularPrecoFinal' que receba (preco, taxa = 0.1). Ela deve retornar o preço acrescido da taxa: preco + (preco * taxa).",
        progressiveHints: [
          "💡 Dica 1: Defina o parâmetro padrão na lista: (preco, taxa = 0.1) => ...",
          "💡 Dica 2: A fórmula é: preco + (preco * taxa)",
          "💡 Dica 3: Exemplo: calcularPrecoFinal(100) deve usar a taxa 0.1 e retornar 110."
        ],
        curatedLinks: [
          {
            source: "JavaScript.info",
            title: "Arrow functions basics",
            url: "https://javascript.info/arrow-functions-basics",
            summary: "Sintaxe curta, ausência de 'this' próprio e retorno implícito."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>4. Arrow Functions & Parâmetros Padrão</h2>
    <p>Veja o cálculo com taxa padrão e taxa customizada no console!</p>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 20px; background: #090d16; color: white; }
.card { background: #111827; padding: 20px; border-radius: 12px; border: 1px solid #1f2937; }`,
          "script.js": `// 👇 CRIE A ARROW FUNCTION calcularPrecoFinal AQUI:
const calcularPrecoFinal = (preco, taxa = 0.1) => {
  return preco + (preco * taxa);
};

console.log("Preço 100 com taxa padrão (10%):", calcularPrecoFinal(100));
console.log("Preço 100 com taxa de 20%:", calcularPrecoFinal(100, 0.2));
`
        },
        activeFile: "script.js",
        tasks: [
          {
            id: "task-arrow-func",
            description: "Declare a arrow function `calcularPrecoFinal(preco, taxa = 0.1)`.",
            hint: "const calcularPrecoFinal = (preco, taxa = 0.1) => { ... };",
            check: (doc, win, helpers) => {
              if (typeof win.calcularPrecoFinal !== 'function') {
                return { pass: false, tip: "Declare a arrow function `calcularPrecoFinal`." };
              }
              const src = helpers.source || '';
              if (!src.includes('=>')) {
                return { pass: false, tip: "Certifique-se de usar a sintaxe de arrow function `=>`." };
              }
              return { pass: true };
            }
          },
          {
            id: "task-taxa-padrao",
            description: "Quando chamada com apenas `(100)`, deve usar a taxa padrão `0.1` e retornar `110`.",
            hint: "return preco + (preco * taxa);",
            check: (doc, win, helpers) => {
              if (typeof win.calcularPrecoFinal !== 'function') {
                return { pass: false, tip: "Primeiro declare a função `calcularPrecoFinal`." };
              }
              const res = win.calcularPrecoFinal(100);
              if (res !== 110) {
                return { pass: false, tip: "Para `calcularPrecoFinal(100)` esperávamos `110`, mas recebemos `" + res + "`." };
              }
              return { pass: true };
            }
          },
          {
            id: "task-taxa-customizada",
            description: "Quando chamada com `(100, 0.25)`, deve aplicar a taxa customizada de 25% e retornar `125`.",
            hint: "calcularPrecoFinal(100, 0.25) -> 125",
            check: (doc, win, helpers) => {
              if (typeof win.calcularPrecoFinal !== 'function') {
                return { pass: false, tip: "Primeiro declare a função `calcularPrecoFinal`." };
              }
              const res = win.calcularPrecoFinal(100, 0.25);
              if (res !== 125) {
                return { pass: false, tip: "Para `calcularPrecoFinal(100, 0.25)` esperávamos `125`, mas recebemos `" + res + "`." };
              }
              return { pass: true };
            }
          }
        ],
        tests: [
          {
            id: "test-arrow-defaults",
            description: "calcularPrecoFinal funciona com taxa padrão e taxa customizada",
            check: (doc, win) => {
              if (typeof win.calcularPrecoFinal !== 'function') {
                return { pass: false, tip: "Crie a arrow function calcularPrecoFinal." };
              }
              if (win.calcularPrecoFinal(100) !== 110) {
                return { pass: false, tip: "calcularPrecoFinal(100) deve usar a taxa padrão 0.1 e retornar 110." };
              }
              if (win.calcularPrecoFinal(100, 0.25) !== 125) {
                return { pass: false, tip: "calcularPrecoFinal(100, 0.25) deve retornar 125." };
              }
              return { pass: true };
            }
          }
        ]
      }
    },
    {
      id: "js-5-mini-project-calculator",
      stepNumber: 5,
      moduleId: "mod-2",
      moduleName: "2. Funções & Escopo",
      title: "🛠️ Mini-Projeto: Calculadora de Gorjetas & Divisão de Conta",
      category: "Mini-Projeto",
      estimatedMinutes: 25,
      dependencies: ["js-4-arrow-functions-defaults"],
      instruction: {
        brief: "Hora de aplicar o que aprendemos em um projeto real! Você criará uma função que calcula a gorjeta de uma conta de restaurante e a divisão exata entre amigos.",
        deepLesson: `
### 🎯 O Desafio:
Você foi contratado para criar a lógica de um app de divisão de contas de restaurante.

A função \`dividirConta(valorTotal, porcentagemGorjeta, numPessoas)\` deve:
1. Calcular o valor da gorjeta: \`valorTotal * (porcentagemGorjeta / 100)\`.
2. Somar o total com gorjeta.
3. Dividir o valor total igualmente pelo número de pessoas.
4. Retornar um objeto com:
\`\`\`javascript
{
  totalComGorjeta: 115,
  valorPorPessoa: 23
}
\`\`\`
        `,
        learningObjective: "Construir um mini-projeto funcional unindo operadores, parâmetros e retorno de objetos estruturados.",
        taskDescription: "Crie a função 'dividirConta(valorTotal, porcentagemGorjeta, numPessoas)' e faça-a retornar um objeto com { totalComGorjeta, valorPorPessoa }.",
        progressiveHints: [
          "💡 Dica 1: const gorjeta = valorTotal * (porcentagemGorjeta / 100);",
          "💡 Dica 2: const totalComGorjeta = valorTotal + gorjeta;",
          "💡 Dica 3: const valorPorPessoa = totalComGorjeta / numPessoas; return { totalComGorjeta, valorPorPessoa };"
        ],
        curatedLinks: [
          {
            source: "The Odin Project",
            title: "Problem Solving",
            url: "https://www.theodinproject.com/lessons/foundations-problem-solving",
            summary: "Como quebrar um problema grande em passos lógicos pequenos."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>🛠️ Mini-Projeto: Calculadora de Gorjetas</h2>
    <div id="demo">Veja a simulação no console!</div>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 20px; background: #090d16; color: white; }
.card { background: #111827; padding: 20px; border-radius: 12px; border: 1px solid #1f2937; }
#demo { color: #10b981; font-weight: bold; margin-top: 10px; }`,
          "script.js": `// 👇 IMPLEMENTE A FUNÇÃO dividirConta AQUI:
function dividirConta(valorTotal, porcentagemGorjeta, numPessoas) {
  const gorjeta = valorTotal * (porcentagemGorjeta / 100);
  const totalComGorjeta = valorTotal + gorjeta;
  const valorPorPessoa = totalComGorjeta / numPessoas;

  return {
    totalComGorjeta,
    valorPorPessoa
  };
}

console.log("R$ 100 com 15% para 2 pessoas:", dividirConta(100, 15, 2));
`
        },
        activeFile: "script.js",
        tasks: [
          {
            id: "task-dividir-func",
            description: "Crie a função `dividirConta(valorTotal, porcentagemGorjeta, numPessoas)`.",
            hint: "function dividirConta(valorTotal, porcentagemGorjeta, numPessoas) { ... }",
            check: (doc, win, helpers) => {
              if (typeof win.dividirConta !== 'function') {
                return { pass: false, tip: "Declare a função `dividirConta(valorTotal, porcentagemGorjeta, numPessoas)`." };
              }
              return { pass: true };
            }
          },
          {
            id: "task-total-gorjeta",
            description: "Calcule a gorjeta e faça a função retornar `totalComGorjeta` no objeto resultante.",
            hint: "const gorjeta = valorTotal * (porcentagemGorjeta / 100); const totalComGorjeta = valorTotal + gorjeta;",
            check: (doc, win, helpers) => {
              if (typeof win.dividirConta !== 'function') {
                return { pass: false, tip: "Primeiro declare a função `dividirConta`." };
              }
              const res = win.dividirConta(100, 20, 2);
              if (!res || res.totalComGorjeta !== 120) {
                return { pass: false, tip: "Para conta de R$ 100 com 20% de gorjeta, `totalComGorjeta` deve ser 120." };
              }
              return { pass: true };
            }
          },
          {
            id: "task-valor-pessoa",
            description: "Divida o totalComGorjeta por `numPessoas` e retorne `valorPorPessoa` no objeto.",
            hint: "const valorPorPessoa = totalComGorjeta / numPessoas; return { totalComGorjeta, valorPorPessoa };",
            check: (doc, win, helpers) => {
              if (typeof win.dividirConta !== 'function') {
                return { pass: false, tip: "Primeiro declare a função `dividirConta`." };
              }
              const res = win.dividirConta(100, 20, 2);
              if (!res || res.valorPorPessoa !== 60) {
                return { pass: false, tip: "Para 2 pessoas com total de 120, `valorPorPessoa` deve ser 60." };
              }
              return { pass: true };
            }
          }
        ],
        tests: [
          {
            id: "test-dividir-conta",
            description: "dividirConta calcula total com gorjeta e valor por pessoa com exatidão",
            check: (doc, win) => {
              if (typeof win.dividirConta !== 'function') {
                return { pass: false, tip: "Crie a função dividirConta(valorTotal, porcentagemGorjeta, numPessoas)." };
              }
              const res = win.dividirConta(100, 20, 2);
              if (!res || res.totalComGorjeta !== 120 || res.valorPorPessoa !== 60) {
                return { pass: false, tip: "Para conta de 100 com 20% de gorjeta para 2 pessoas: total deve ser 120 e por pessoa 60." };
              }
              return { pass: true };
            }
          }
        ]
      }
    },

    // ===================================================================
    // MÓDULO 3: ARRAYS & ESTRUTURAS DE DADOS
    // ===================================================================
    {
      id: "js-6-arrays-iteration-methods",
      stepNumber: 6,
      moduleId: "mod-3",
      moduleName: "3. Arrays & Estruturas de Dados",
      title: "Dominando Arrays: .push, .pop, .slice e .forEach",
      category: "Arrays",
      estimatedMinutes: 20,
      dependencies: ["js-5-mini-project-calculator"],
      instruction: {
        brief: "Arrays são a estrutura de dados mais comum no front-end para guardar listas de produtos, usuários e tarefas. Vamos aprender como mutar e iterar por arrays.",
        deepLesson: `
### 📖 Métodos Essenciais de Array:
- \`.push(item)\`: Adiciona no **final** do array.
- \`.pop()\`: Remove do **final** do array e retorna o item removido.
- \`.unshift(item)\`: Adiciona no **início** do array.
- \`.shift()\`: Remove do **início** do array.
- \`.forEach(fn)\`: Executa uma função para cada item da lista.

### 💻 Exemplo:
\`\`\`javascript
const linguagens = ["HTML", "CSS"];
linguagens.push("JavaScript"); // ["HTML", "CSS", "JavaScript"]

linguagens.forEach((ling, index) => {
  console.log(\`\${index + 1}: \${ling}\`);
});
\`\`\`
        `,
        learningObjective: "Adicionar e iterar por listas utilizando métodos modernos de array.",
        taskDescription: "Crie um array 'tarefas' com ['Aprender JS', 'Praticar no IDE']. Use .push() para adicionar 'Dominar o DOM'. Em seguida, crie uma variável 'total' que receba tarefas.length.",
        progressiveHints: [
          "💡 Dica 1: let tarefas = ['Aprender JS', 'Praticar no IDE'];",
          "💡 Dica 2: tarefas.push('Dominar o DOM');",
          "💡 Dica 3: const total = tarefas.length;"
        ],
        curatedLinks: [
          {
            source: "MDN Web Docs",
            title: "Array.prototype.forEach()",
            url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach",
            summary: "Como percorrer itens de um array."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>6. Arrays & Iteração</h2>
    <p>Abra o console para inspecionar a lista de tarefas!</p>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 20px; background: #090d16; color: white; }
.card { background: #111827; padding: 20px; border-radius: 12px; border: 1px solid #1f2937; }`,
          "script.js": `// 👇 CRIE O ARRAY E ADICIONE O NOVO ITEM:
let tarefas = ['Aprender JS', 'Praticar no IDE'];
tarefas.push('Dominar o DOM');
const total = tarefas.length;

console.log("Tarefas:", tarefas);
console.log("Total:", total);
`
        },
        activeFile: "script.js",
        tests: [
          {
            id: "test-array-len",
            description: "O array tarefas tem 3 itens e inclui 'Dominar o DOM'",
            check: (doc, win) => {
              if (!Array.isArray(win.tarefas) || win.tarefas.length !== 3) {
                return { pass: false, tip: "O array tarefas deve ter 3 itens após o push." };
              }
              if (!win.tarefas.includes('Dominar o DOM')) {
                return { pass: false, tip: "O item 'Dominar o DOM' precisa estar no array." };
              }
              return { pass: true };
            }
          }
        ]
      }
    },
    {
      id: "js-7-arrays-functional-map-filter",
      stepNumber: 7,
      moduleId: "mod-3",
      moduleName: "3. Arrays & Estruturas de Dados",
      title: "Programação Funcional com .map() e .filter()",
      category: "Arrays Funcionais",
      estimatedMinutes: 25,
      dependencies: ["js-6-arrays-iteration-methods"],
      instruction: {
        brief: "No desenvolvimento com React e JavaScript moderno, nunca alteramos arrays diretamente. Usamos .map() para transformar itens e .filter() para selecionar itens sem tocar no array original (imutabilidade).",
        deepLesson: `
### 📖 .map() vs .filter():
- **\`.map(fn)\`:** Pega um array de N itens e devolve um novo array com os mesmos N itens transformados.
- **\`.filter(fn)\`:** Pega um array de N itens e devolve um novo array contendo apenas os itens que retornarem \`true\` para a condição.

### 💻 Exemplo Prático:
\`\`\`javascript
const produtos = [
  { nome: "Mouse", preco: 50 },
  { nome: "Teclado", preco: 150 },
  { nome: "Monitor", preco: 900 }
];

// Filtrar produtos com preço maior que 100:
const caros = produtos.filter(p => p.preco > 100);

// Mapear apenas os nomes dos produtos em letras maiúsculas:
const nomes = produtos.map(p => p.nome.toUpperCase());
\`\`\`
        `,
        learningObjective: "Aplicar .map() e .filter() para transformar e filtrar dados sem mutações colaterais.",
        taskDescription: "Dado o array 'precos = [10, 25, 60, 80, 120]', crie 'precosComDesconto' com 10% de desconto em todos (p * 0.9 usando .map), e crie 'apenasCaros' contendo apenas os precos > 50 (usando .filter).",
        progressiveHints: [
          "💡 Dica 1: const precosComDesconto = precos.map(p => p * 0.9);",
          "💡 Dica 2: const apenasCaros = precos.filter(p => p > 50);",
          "💡 Dica 3: Inspecione com console.log(precosComDesconto, apenasCaros);"
        ],
        curatedLinks: [
          {
            source: "JavaScript.info",
            title: "Array methods",
            url: "https://javascript.info/array-methods",
            summary: "Guia completo de map, filter, find e reduce."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>7. .map() e .filter()</h2>
    <p>Veja os novos arrays transformados no console!</p>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 20px; background: #090d16; color: white; }
.card { background: #111827; padding: 20px; border-radius: 12px; border: 1px solid #1f2937; }`,
          "script.js": `const precos = [10, 25, 60, 80, 120];

// 👇 CRIE precosComDesconto E apenasCaros AQUI:
const precosComDesconto = precos.map(p => p * 0.9);
const apenasCaros = precos.filter(p => p > 50);

console.log("Com Desconto:", precosComDesconto);
console.log("Apenas Caros (> 50):", apenasCaros);
`
        },
        activeFile: "script.js",
        tests: [
          {
            id: "test-map-filter",
            description: "precosComDesconto e apenasCaros foram gerados corretamente",
            check: (doc, win) => {
              if (!Array.isArray(win.precosComDesconto) || win.precosComDesconto.length !== 5) {
                return { pass: false, tip: "precosComDesconto deve conter todos os 5 preços com 10% de desconto." };
              }
              if (!Array.isArray(win.apenasCaros) || win.apenasCaros.length !== 3) {
                return { pass: false, tip: "apenasCaros deve conter os 3 preços maiores que 50 ([60, 80, 120])." };
              }
              return { pass: true };
            }
          }
        ]
      }
    },
    {
      id: "js-8-array-reduce-superpower",
      stepNumber: 8,
      moduleId: "mod-3",
      moduleName: "3. Arrays & Estruturas de Dados",
      title: "O Superpoder do .reduce()",
      category: "Arrays Avançados",
      estimatedMinutes: 25,
      dependencies: ["js-7-arrays-functional-map-filter"],
      instruction: {
        brief: "O método .reduce() é o mais poderoso e temido dos métodos de Array. Ele reduz toda uma lista a um único valor final: como a soma de um carrinho de compras, a média de notas ou uma contagem de categorias.",
        deepLesson: `
### 📖 Como o .reduce() Funciona:
Ele recebe dois argumentos principais: uma função redutora e um **valor inicial do acumulador**:
\`\`\`javascript
array.reduce((acumulador, itemAtual) => {
  return acumulador + itemAtual;
}, 0); // <-- 0 é o valor inicial do acumulador!
\`\`\`

### 💻 Exemplo: Somando um Carrinho de Compras:
\`\`\`javascript
const carrinho = [
  { item: "Camiseta", preco: 40 },
  { item: "Calça", preco: 120 },
  { item: "Meias", preco: 15 }
];

const totalPagar = carrinho.reduce((total, produto) => {
  return total + produto.preco;
}, 0);

console.log("Total: R$", totalPagar); // 175
\`\`\`
        `,
        learningObjective: "Compreender acumuladores e usar .reduce() para agregar dados.",
        taskDescription: "Dado o array 'valores = [10, 20, 30, 40]', use valores.reduce(...) para calcular a soma total e salve na constante 'somaTotal'.",
        progressiveHints: [
          "💡 Dica 1: const somaTotal = valores.reduce((acc, curr) => acc + curr, 0);",
          "💡 Dica 2: O valor inicial deve ser 0.",
          "💡 Dica 3: Exiba com console.log('Soma:', somaTotal);"
        ],
        curatedLinks: [
          {
            source: "MDN Web Docs",
            title: "Array.prototype.reduce()",
            url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce",
            summary: "Como funciona a acumulação de valores passo a passo."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>8. O Método .reduce()</h2>
    <p>Veja o resultado da soma agregada no console!</p>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 20px; background: #090d16; color: white; }
.card { background: #111827; padding: 20px; border-radius: 12px; border: 1px solid #1f2937; }`,
          "script.js": `const valores = [10, 20, 30, 40];

// 👇 CALCULE A SOMA USANDO .reduce() AQUI:
const somaTotal = valores.reduce((acc, curr) => acc + curr, 0);

console.log("Soma total acumulada:", somaTotal);
`
        },
        activeFile: "script.js",
        tests: [
          {
            id: "test-reduce-sum",
            description: "somaTotal é igual a 100",
            check: (doc, win) => {
              if (win.somaTotal !== 100) {
                return { pass: false, tip: "A soma total dos valores [10, 20, 30, 40] deve ser 100." };
              }
              return { pass: true };
            }
          }
        ]
      }
    },

    // ===================================================================
    // MÓDULO 4: O DOM & EVENTOS NO NAVEGADOR
    // ===================================================================
    {
      id: "js-9-dom-selection-manipulation",
      stepNumber: 9,
      moduleId: "mod-4",
      moduleName: "4. O DOM & Eventos no Navegador",
      title: "O DOM: Selecionar & Alterar Textos e Classes",
      category: "DOM",
      estimatedMinutes: 20,
      dependencies: ["js-8-array-reduce-superpower"],
      instruction: {
        brief: "O DOM (Document Object Model) é a árvore em memória criada pelo navegador. Com document.querySelector capturamos qualquer elemento, e com .textContent ou .classList alteramos sua aparência em tempo real.",
        deepLesson: `
### 📖 Como o DOM Funciona:
1. **Selecionar:** \`document.querySelector('#meu-id')\` busca por ID, classe ou tag.
2. **Alterar Texto:** \`elemento.textContent = "Novo texto"\`.
3. **Alterar Classes CSS:**
   - \`elemento.classList.add('ativa')\` (adiciona classe)
   - \`elemento.classList.remove('ativa')\` (remove classe)
   - \`elemento.classList.toggle('ativa')\` (se tiver tira, se não tiver coloca!)
        `,
        learningObjective: "Conectar o script ao HTML e alterar o conteúdo de tags dinamicamente.",
        taskDescription: "No script.js, selecione o elemento '#status' e mude seu textContent para 'Conectado com Sucesso!'. Em seguida, adicione a classe CSS 'online' usando classList.add('online').",
        progressiveHints: [
          "💡 Dica 1: const el = document.querySelector('#status');",
          "💡 Dica 2: el.textContent = 'Conectado com Sucesso!';",
          "💡 Dica 3: el.classList.add('online');"
        ],
        curatedLinks: [
          {
            source: "MDN Web Docs",
            title: "Element.classList",
            url: "https://developer.mozilla.org/pt-BR/docs/Web/API/Element/classList",
            summary: "Como manipular classes CSS no DOM."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>Status do Servidor:</h2>
    <div id="status" class="badge">Desconectado</div>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 30px; background: #090d16; color: white; display: flex; justify-content: center; }
.card { background: #111827; padding: 24px; border-radius: 16px; border: 1px solid #1f2937; text-align: center; }
.badge { display: inline-block; padding: 6px 14px; border-radius: 99px; background: #374151; color: #9ca3af; font-weight: bold; margin-top: 10px; transition: all 0.3s; }
.badge.online { background: #059669; color: white; transform: scale(1.05); }`,
          "script.js": `// 👇 SELECIONE E ATUALIZE O #status AQUI:
const el = document.querySelector('#status');
el.textContent = 'Conectado com Sucesso!';
el.classList.add('online');
`
        },
        activeFile: "script.js",
        tests: [
          {
            id: "test-dom-status",
            description: "#status tem o texto 'Conectado com Sucesso!' e possui a classe 'online'",
            check: (doc) => {
              const el = doc.querySelector('#status');
              if (!el) return { pass: false, tip: "#status não encontrado." };
              if (!el.textContent.includes('Conectado com Sucesso!')) {
                return { pass: false, tip: "O texto de #status deve ser 'Conectado com Sucesso!'." };
              }
              if (!el.classList.contains('online')) {
                return { pass: false, tip: "Faltou adicionar a classe 'online' usando el.classList.add('online')." };
              }
              return { pass: true };
            }
          }
        ]
      }
    },
    {
      id: "js-10-dom-events-and-forms",
      stepNumber: 10,
      moduleId: "mod-4",
      moduleName: "4. O DOM & Eventos no Navegador",
      title: "Eventos de Formulário: submit e preventDefault()",
      category: "Eventos",
      estimatedMinutes: 25,
      dependencies: ["js-9-dom-selection-manipulation"],
      instruction: {
        brief: "Ao submeter formulários na web tradicional, a página recarrega inteira. Em Single Page Applications (SPAs), cancelamos esse comportamento com event.preventDefault() para processar os dados instantaneamente com JavaScript.",
        deepLesson: `
### 📖 Por que usar event.preventDefault()?
Quando o usuário clica num botão \`<button type="submit">\` ou aperta Enter dentro de um \`<input>\`, o formulário dispara o evento \`submit\`.
O comportamento padrão do navegador é tentar enviar uma requisição HTTP e recarregar a tela, apagando todas as variáveis da memória!

Chamando \`e.preventDefault()\`, impedimos o recarregamento:
\`\`\`javascript
form.addEventListener('submit', (event) => {
  event.preventDefault(); // <-- Magia! A página não recarrega!
  const texto = input.value.trim();
  console.log("Digitado:", texto);
});
\`\`\`
        `,
        learningObjective: "Interceptar submissão de formulários, evitar recarregamento e ler valores de inputs.",
        taskDescription: "No script.js, escute o evento 'submit' no '#meu-form'. Use event.preventDefault(), leia o valor digitado no '#meu-input' e coloque esse texto dentro do elemento '#mensagem'. Em seguida, limpe o input.",
        progressiveHints: [
          "💡 Dica 1: form.addEventListener('submit', (e) => { e.preventDefault(); ... });",
          "💡 Dica 2: const texto = input.value; mensagem.textContent = texto;",
          "💡 Dica 3: Limpe o campo: input.value = '';"
        ],
        curatedLinks: [
          {
            source: "MDN Web Docs",
            title: "Event: preventDefault() method",
            url: "https://developer.mozilla.org/pt-BR/docs/Web/API/Event/preventDefault",
            summary: "Como cancelar a ação padrão de um evento."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>Envio sem Recarregar</h2>
    <form id="meu-form">
      <input type="text" id="meu-input" placeholder="Digite uma mensagem..." required>
      <button type="submit">Enviar</button>
    </form>
    <div id="mensagem" class="resultado">Aguardando envio...</div>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 30px; background: #090d16; color: white; display: flex; justify-content: center; }
.card { background: #111827; padding: 24px; border-radius: 16px; border: 1px solid #1f2937; max-width: 360px; width: 100%; }
form { display: flex; gap: 8px; margin-bottom: 12px; }
input { flex: 1; padding: 8px 12px; background: #1f2937; border: 1px solid #374151; color: white; border-radius: 8px; }
button { background: #10b981; color: white; border: none; padding: 8px 14px; border-radius: 8px; font-weight: bold; cursor: pointer; }
.resultado { padding: 12px; background: #1f2937; border-radius: 8px; font-size: 0.9rem; color: #10b981; text-align: center; }`,
          "script.js": `const form = document.querySelector('#meu-form');
const input = document.querySelector('#meu-input');
const mensagem = document.querySelector('#mensagem');

// 👇 ESCUTE O SUBMIT E EVITE O RELOAD AQUI:
form.addEventListener('submit', (e) => {
  e.preventDefault();
  mensagem.textContent = input.value;
  input.value = '';
});
`
        },
        activeFile: "script.js",
        tests: [
          {
            id: "test-form-submit",
            description: "Enviar o form atualiza o texto de #mensagem sem recarregar",
            check: (doc) => {
              const form = doc.querySelector('#meu-form');
              const input = doc.querySelector('#meu-input');
              const mensagem = doc.querySelector('#mensagem');
              if (!form || !input || !mensagem) return { pass: false, tip: "Elementos não encontrados." };

              input.value = 'Texto Teste de Sucesso';
              if (typeof form.dispatchEvent === 'function') {
                form.dispatchEvent(new Event('submit', { cancelable: true }));
              }

              if (mensagem.textContent !== 'Texto Teste de Sucesso') {
                return { pass: false, tip: "Ao enviar o form, #mensagem deve receber o valor do input." };
              }
              return { pass: true };
            }
          }
        ]
      }
    },
    {
      id: "js-11-dom-dynamic-creation-list",
      stepNumber: 11,
      moduleId: "mod-4",
      moduleName: "4. O DOM & Eventos no Navegador",
      title: "Renderização Dinâmica: createElement e appendChild",
      category: "DOM Dinâmico",
      estimatedMinutes: 25,
      dependencies: ["js-10-dom-events-and-forms"],
      instruction: {
        brief: "Toda lista dinâmica (feed do Instagram, mensagens do WhatsApp, tarefas) é gerada pelo JavaScript pegando um array na memória e criando tags no HTML dinamicamente.",
        deepLesson: `
### 📖 O Ciclo de Vida da Criação de Elementos:
1. \`const li = document.createElement('li')\` (Cria a tag na memória RAM, ainda invisível na tela).
2. \`li.textContent = "Meu Item"\` (Adiciona texto ou conteúdo).
3. \`li.classList.add('item-estilizado')\` (Aplica estilos CSS).
4. \`listaUl.appendChild(li)\` (Anexa na página e o usuário finalmente enxerga!).
        `,
        learningObjective: "Transformar arrays em elementos HTML e anexar na tela dinamicamente.",
        taskDescription: "Crie a função 'renderizarFrutas(listaDeFrutas)'. Para cada fruta do array, crie um <li> com o nome da fruta e anexe dentro de '#lista-frutas'. Lembre-se de limpar com lista.innerHTML = '' antes de iterar.",
        progressiveHints: [
          "💡 Dica 1: const lista = document.querySelector('#lista-frutas'); lista.innerHTML = '';",
          "💡 Dica 2: listaDeFrutas.forEach(fruta => { const li = document.createElement('li'); li.textContent = fruta; lista.appendChild(li); });",
          "💡 Dica 3: Chame renderizarFrutas(['Abacaxi', 'Manga', 'Uva']);"
        ],
        curatedLinks: [
          {
            source: "The Odin Project",
            title: "DOM Manipulation and Events",
            url: "https://www.theodinproject.com/lessons/foundations-dom-manipulation-and-events",
            summary: "Como criar e manipular elementos HTML com JavaScript."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>Lista de Frutas</h2>
    <ul id="lista-frutas"></ul>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 20px; background: #090d16; color: white; display: flex; justify-content: center; }
.card { background: #111827; padding: 20px; border-radius: 12px; border: 1px solid #1f2937; width: 100%; max-width: 320px; }
ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
li { background: #1f2937; padding: 8px 12px; border-radius: 6px; font-weight: 500; border-left: 3px solid #10b981; }`,
          "script.js": `// 👇 IMPLEMENTE A FUNÇÃO renderizarFrutas(listaDeFrutas) AQUI:
function renderizarFrutas(listaDeFrutas) {
  const lista = document.querySelector('#lista-frutas');
  lista.innerHTML = '';

  listaDeFrutas.forEach(fruta => {
    const li = document.createElement('li');
    li.textContent = fruta;
    lista.appendChild(li);
  });
}

renderizarFrutas(['Abacaxi', 'Manga', 'Morango']);
`
        },
        activeFile: "script.js",
        tests: [
          {
            id: "test-render-frutas",
            description: "renderizarFrutas cria elementos <li> para cada item do array",
            check: (doc, win) => {
              if (typeof win.renderizarFrutas !== 'function') {
                return { pass: false, tip: "Crie a função renderizarFrutas(listaDeFrutas)." };
              }
              win.renderizarFrutas(['Kiwi', 'Melão']);
              const itens = doc.querySelectorAll('#lista-frutas li');
              if (itens.length !== 2 || !itens[0].textContent.includes('Kiwi')) {
                return { pass: false, tip: "A função deve gerar um <li> para cada item do array." };
              }
              return { pass: true };
            }
          }
        ]
      }
    },

    // ===================================================================
    // MÓDULO 5: WEB APIS & PERSISTÊNCIA
    // ===================================================================
    {
      id: "js-12-localstorage-json",
      stepNumber: 12,
      moduleId: "mod-5",
      moduleName: "5. Web APIs & Persistência (localStorage)",
      title: "Persistência no Navegador com localStorage e JSON",
      category: "Web APIs",
      estimatedMinutes: 20,
      dependencies: ["js-11-dom-dynamic-creation-list"],
      instruction: {
        brief: "O localStorage permite guardar dados no computador do usuário que sobrevivem mesmo se a página for fechada ou atualizada com F5. Como o localStorage só entende strings de texto, usamos o JSON como ponte!",
        deepLesson: `
### 📖 A Dupla Imbatível: JSON.stringify e JSON.parse
- **Salvar Objetos/Arrays:** O navegador não aceita \`localStorage.setItem('dados', [1, 2])\`. Precisamos transformar em texto com \`JSON.stringify(meuArray)\`.
- **Recuperar Objetos/Arrays:** Ao ler com \`localStorage.getItem('dados')\`, recebemos um texto puro. Usamos \`JSON.parse(textoSalvo)\` para transformá-lo de volta em um Array de verdade com métodos JS!

### 💻 Exemplo Prático:
\`\`\`javascript
const carrinho = [{ id: 1, nome: "Livro" }];

// 1. Salvar no localStorage:
localStorage.setItem('carrinho', JSON.stringify(carrinho));

// 2. Recuperar do localStorage:
const salvo = localStorage.getItem('carrinho');
const carrinhoCarregado = salvo ? JSON.parse(salvo) : [];
\`\`\`
        `,
        learningObjective: "Serializar dados em JSON e persistir no armazenamento local do navegador.",
        taskDescription: "Crie a função 'salvarPerfil(nome, nivel)'. Ela deve gravar no localStorage a chave 'perfil_usuario' com o valor serializado via JSON.stringify({ nome, nivel }).",
        progressiveHints: [
          "💡 Dica 1: const perfil = { nome, nivel };",
          "💡 Dica 2: localStorage.setItem('perfil_usuario', JSON.stringify(perfil));",
          "💡 Dica 3: Teste chamando salvarPerfil('DevHero', 'Pro');"
        ],
        curatedLinks: [
          {
            source: "MDN Web Docs",
            title: "Web Storage API",
            url: "https://developer.mozilla.org/pt-BR/docs/Web/API/Web_Storage_API",
            summary: "Como usar localStorage e sessionStorage no navegador."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>12. localStorage & JSON</h2>
    <p>Os dados salvos persistem no navegador mesmo ao recarregar!</p>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 20px; background: #090d16; color: white; }
.card { background: #111827; padding: 20px; border-radius: 12px; border: 1px solid #1f2937; }`,
          "script.js": `// 👇 CRIE A FUNÇÃO salvarPerfil(nome, nivel) AQUI:
function salvarPerfil(nome, nivel) {
  const dados = { nome, nivel };
  localStorage.setItem('perfil_usuario', JSON.stringify(dados));
}

salvarPerfil('DevJunior', 'Iniciante');
console.log("Perfil no localStorage:", localStorage.getItem('perfil_usuario'));
`
        },
        activeFile: "script.js",
        tests: [
          {
            id: "test-profile-storage",
            description: "salvarPerfil grava um objeto JSON válido na chave 'perfil_usuario'",
            check: (doc, win) => {
              if (typeof win.salvarPerfil !== 'function') {
                return { pass: false, tip: "Crie a função salvarPerfil(nome, nivel)." };
              }
              win.salvarPerfil('MestreJS', 'Avançado');
              const raw = win.localStorage.getItem('perfil_usuario');
              if (!raw) return { pass: false, tip: "Nada foi salvo na chave 'perfil_usuario'." };
              try {
                const parsed = JSON.parse(raw);
                if (parsed.nome !== 'MestreJS' || parsed.nivel !== 'Avançado') {
                  return { pass: false, tip: "Os dados no JSON não batem com os argumentos passados." };
                }
              } catch (e) {
                return { pass: false, tip: "O valor salvo precisa ser uma string JSON válida." };
              }
              return { pass: true };
            }
          }
        ]
      }
    },
    {
      id: "js-13-timers-interval",
      stepNumber: 13,
      moduleId: "mod-5",
      moduleName: "5. Web APIs & Persistência (localStorage)",
      title: "Temporizadores: setInterval e clearInterval",
      category: "Web APIs",
      estimatedMinutes: 20,
      dependencies: ["js-12-localstorage-json"],
      instruction: {
        brief: "Quer criar um cronômetro ou verificar atualizações de tempo em tempo? O método setInterval(funcao, milissegundos) executa código repetidamente a cada intervalo de tempo até você chamar clearInterval.",
        deepLesson: `
### 📖 setInterval vs setTimeout:
- \`setTimeout(fn, 1000)\`: Executa a função **uma única vez** após 1 segundo (1000ms).
- \`setInterval(fn, 1000)\`: Executa a função **repetidamente a cada 1 segundo** indefinidamente.
- \`clearInterval(idTemporizador)\`: Cancela a execução do intervalo para economizar memória e bateria.
        `,
        learningObjective: "Controlar execuções periódicas e criar timers dinâmicos.",
        taskDescription: "Crie um cronômetro: selecione o '#segundos', inicie uma variável 'contador = 0' e use setInterval a cada 1000ms para incrementar contador e atualizar segundos.textContent.",
        progressiveHints: [
          "💡 Dica 1: const el = document.querySelector('#segundos'); let contador = 0;",
          "💡 Dica 2: setInterval(() => { contador++; el.textContent = contador; }, 1000);",
          "💡 Dica 3: Veja os números subindo sozinhos no preview!"
        ],
        curatedLinks: [
          {
            source: "JavaScript.info",
            title: "Scheduling: setTimeout and setInterval",
            url: "https://javascript.info/settimeout-setinterval",
            summary: "Como agendar tarefas e controlar a execução no tempo."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>Cronômetro Digital</h2>
    <div class="display"><span id="segundos">0</span>s</div>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 30px; background: #090d16; color: white; display: flex; justify-content: center; }
.card { background: #111827; padding: 24px; border-radius: 16px; border: 1px solid #1f2937; text-align: center; }
.display { font-size: 2.5rem; font-weight: 800; color: #10b981; font-family: monospace; margin-top: 10px; }`,
          "script.js": `const display = document.querySelector('#segundos');
let contador = 0;

// 👇 IMPLEMENTE O setInterval AQUI:
setInterval(() => {
  contador++;
  display.textContent = contador;
}, 1000);
`
        },
        activeFile: "script.js",
        tests: [
          {
            id: "test-timer-interval",
            description: "O elemento #segundos é atualizado no DOM",
            check: (doc) => {
              const el = doc.querySelector('#segundos');
              if (!el) return { pass: false, tip: "Elemento #segundos não encontrado." };
              return { pass: true };
            }
          }
        ]
      }
    },

    // ===================================================================
    // MÓDULO 6: JAVASCRIPT ASSÍNCRONO & APIS (FETCH)
    // ===================================================================
    {
      id: "js-14-async-await-promises",
      stepNumber: 14,
      moduleId: "mod-6",
      moduleName: "6. JavaScript Assíncrono & APIs REST",
      title: "Desmistificando Promises com async e await",
      category: "Assíncrono",
      estimatedMinutes: 25,
      dependencies: ["js-13-timers-interval"],
      instruction: {
        brief: "Operações como consultar um banco de dados ou baixar um arquivo da internet levam tempo. Em vez de travar o navegador, o JavaScript usa Promises para rodar essas tarefas em segundo plano.",
        deepLesson: `
### 📖 A Evolução do JavaScript Assíncrono:
1. **Callbacks (anos 2000):** Causavam o infame 'Callback Hell' (código em formato de pirâmide).
2. **Promises com .then() e .catch() (ES6):** Melhorou o encadeamento, mas ainda era verboso.
3. **async / await (ES8):** A sintaxe definitiva! Escreva código assíncrono exatamente como se fosse síncrono:

\`\`\`javascript
async function carregarDados() {
  try {
    const resposta = await minhaPromise(); // Pausa apenas esta função sem travar o navegador
    console.log(resposta);
  } catch (erro) {
    console.error("Ops! Algo deu errado:", erro);
  }
}
\`\`\`
        `,
        learningObjective: "Escrever funções assíncronas com async, await e tratamento de erros com try/catch.",
        taskDescription: "Crie a função 'async function simularLogin(usuario, senha)'. Se a senha for '1234', retorne { autenticado: true, usuario }. Se for errada, retorne { autenticado: false }.",
        progressiveHints: [
          "💡 Dica 1: Declare: async function simularLogin(usuario, senha) { ... }",
          "💡 Dica 2: if (senha === '1234') { return { autenticado: true, usuario }; }",
          "💡 Dica 3: else { return { autenticado: false }; }"
        ],
        curatedLinks: [
          {
            source: "JavaScript.info",
            title: "Async/await",
            url: "https://javascript.info/async-await",
            summary: "Como funciona a máquina por trás de async e await."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>14. async / await</h2>
    <p>Inspecione o retorno da Promise simulada no console!</p>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 20px; background: #090d16; color: white; }
.card { background: #111827; padding: 20px; border-radius: 12px; border: 1px solid #1f2937; }`,
          "script.js": `// 👇 CRIE A FUNÇÃO simularLogin AQUI:
async function simularLogin(usuario, senha) {
  if (senha === '1234') {
    return { autenticado: true, usuario };
  }
  return { autenticado: false };
}

simularLogin('admin', '1234').then(res => console.log("Login sucesso:", res));
simularLogin('admin', 'errada').then(res => console.log("Login falha:", res));
`
        },
        activeFile: "script.js",
        tests: [
          {
            id: "test-login-async",
            description: "simularLogin é async e valida a senha corretamente",
            check: (doc, win) => {
              if (typeof win.simularLogin !== 'function') {
                return { pass: false, tip: "Crie a função async simularLogin(usuario, senha)." };
              }
              const p = win.simularLogin('teste', '1234');
              if (!p || typeof p.then !== 'function') {
                return { pass: false, tip: "A função precisa ser declarada com a palavra-chave async." };
              }
              return { pass: true };
            }
          }
        ]
      }
    },
    {
      id: "js-15-fetch-api-live",
      stepNumber: 15,
      moduleId: "mod-6",
      moduleName: "6. JavaScript Assíncrono & APIs REST",
      title: "Consumo de APIs REST no Mundo Real com fetch()",
      category: "APIs & fetch",
      estimatedMinutes: 30,
      dependencies: ["js-14-async-await-promises"],
      instruction: {
        brief: "A Fetch API permite que sua aplicação converse com servidores remotos na internet para buscar dados climáticos, cotações de moedas, produtos de e-commerce e dados de usuários.",
        deepLesson: `
### 📖 O Fluxo Padrão de um fetch():
1. Chamar \`fetch(url)\` que retorna uma Promise de resposta HTTP.
2. Aguardar a conversão dos dados brutos para JSON com \`await resposta.json()\`.
3. Usar os dados no DOM ou em variáveis.

\`\`\`javascript
async function buscarPrevisaoClima(cidade) {
  try {
    const resposta = await fetch(\`https://api.exemplo.com/clima?cidade=\${cidade}\`);
    if (!resposta.ok) throw new Error("Erro na requisição");
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Falha de conexão:", erro.message);
  }
}
\`\`\`
        `,
        learningObjective: "Fazer requisições assíncronas reais com fetch(), converter com .json() e renderizar na tela.",
        taskDescription: "Crie a função 'async function buscarPerfilGitHub(username)'. Ela deve fazer um fetch para 'https://api.github.com/users/' + username, converter com await resposta.json() e retornar o objeto de dados.",
        progressiveHints: [
          "💡 Dica 1: const resposta = await fetch('https://api.github.com/users/' + username);",
          "💡 Dica 2: const dados = await resposta.json();",
          "💡 Dica 3: return dados;"
        ],
        curatedLinks: [
          {
            source: "MDN Web Docs",
            title: "Usando a Fetch API",
            url: "https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Using_Fetch",
            summary: "Guia oficial da Mozilla sobre requisições com fetch."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>Consulta à API do GitHub</h2>
    <div id="resultado" class="status">Consultando servidor...</div>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 20px; background: #090d16; color: white; display: flex; justify-content: center; }
.card { background: #111827; padding: 24px; border-radius: 14px; border: 1px solid #1f2937; max-width: 380px; width: 100%; text-align: center; }
.status { color: #10b981; font-weight: bold; margin-top: 12px; }`,
          "script.js": `// 👇 CRIE A FUNÇÃO buscarPerfilGitHub(username) AQUI:
async function buscarPerfilGitHub(username) {
  const resposta = await fetch('https://api.github.com/users/' + username);
  const dados = await resposta.json();
  return dados;
}

buscarPerfilGitHub('octocat').then(perfil => {
  document.querySelector('#resultado').textContent = 'Login: ' + perfil.login;
  console.log("Perfil carregado:", perfil);
});
`
        },
        activeFile: "script.js",
        tests: [
          {
            id: "test-fetch-fn",
            description: "buscarPerfilGitHub é async e retorna uma Promise",
            check: (doc, win) => {
              if (typeof win.buscarPerfilGitHub !== 'function') {
                return { pass: false, tip: "Crie a função async buscarPerfilGitHub(username)." };
              }
              return { pass: true };
            }
          }
        ]
      }
    },

    // ===================================================================
    // MÓDULO 7: POO & PROJETO CAPSTONE
    // ===================================================================
    {
      id: "js-16-classes-oop-inheritance",
      stepNumber: 16,
      moduleId: "mod-7",
      moduleName: "7. POO & Tópicos Avançados",
      title: "Orientação a Objetos com Classes & Herança (ES6)",
      category: "POO",
      estimatedMinutes: 25,
      dependencies: ["js-15-fetch-api-live"],
      instruction: {
        brief: "Classes são moldes estruturados para criar objetos. Com a sintaxe 'class' e herança via 'extends', podemos reaproveitar código e criar arquiteturas limpas.",
        deepLesson: `
### 📖 Anatomia de uma Classe em JavaScript:
\`\`\`javascript
class Dispositivo {
  constructor(marca, modelo) {
    this.marca = marca;
    this.modelo = modelo;
    this.ligado = false;
  }

  ligar() {
    this.ligado = true;
    return \`\${this.modelo} está ligado!\`;
  }
}

// Herança:
class Celular extends Dispositivo {
  constructor(marca, modelo, memoria) {
    super(marca, modelo); // Chama o construtor da classe pai
    this.memoria = memoria;
  }
}

const meuCelular = new Celular("Apple", "iPhone 15", "256GB");
meuCelular.ligar(); // Herdado do pai!
\`\`\`
        `,
        learningObjective: "Criar classes com métodos, atributos no constructor e instanciar com new.",
        taskDescription: "Crie uma classe 'Produto' com constructor(nome, preco). Adicione o método 'calcularImposto(taxa = 0.1)' que retorne preco * taxa.",
        progressiveHints: [
          "💡 Dica 1: class Produto { constructor(nome, preco) { this.nome = nome; this.preco = preco; } }",
          "💡 Dica 2: Adicione: calcularImposto(taxa = 0.1) { return this.preco * taxa; }",
          "💡 Dica 3: Instancie com: const p = new Produto('Livro', 50); p.calcularImposto();"
        ],
        curatedLinks: [
          {
            source: "JavaScript.info",
            title: "Classes em JavaScript",
            url: "https://javascript.info/class",
            summary: "Classes, herança de protótipos e sintaxe moderna."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head><body>
  <div class="card">
    <h2>16. Classes & POO</h2>
    <p>Inspecione as instâncias de Produto no console!</p>
  </div>
  <script src="script.js"></script>
</body></html>`,
          "style.css": `body { font-family: system-ui; padding: 20px; background: #090d16; color: white; }
.card { background: #111827; padding: 20px; border-radius: 12px; border: 1px solid #1f2937; }`,
          "script.js": `// 👇 CRIE A CLASSE Produto AQUI:
class Produto {
  constructor(nome, preco) {
    this.nome = nome;
    this.preco = preco;
  }

  calcularImposto(taxa = 0.1) {
    return this.preco * taxa;
  }
}

const item = new Produto('Monitor', 1000);
console.log("Produto criado:", item);
console.log("Imposto (10%):", item.calcularImposto());
`
        },
        activeFile: "script.js",
        tests: [
          {
            id: "test-product-class",
            description: "A classe Produto calcula o imposto com taxa padrão e customizada",
            check: (doc, win) => {
              if (typeof win.Produto !== 'function') {
                return { pass: false, tip: "A classe Produto não foi encontrada." };
              }
              const p = new win.Produto('Mouse', 100);
              if (p.nome !== 'Mouse' || p.preco !== 100) {
                return { pass: false, tip: "O constructor deve salvar this.nome e this.preco." };
              }
              if (typeof p.calcularImposto !== 'function') {
                return { pass: false, tip: "Faltou definir o método calcularImposto(taxa)." };
              }
              if (p.calcularImposto() !== 10) {
                return { pass: false, tip: "Para preco 100 e taxa padrão 0.1, calcularImposto() deve retornar 10." };
              }
              return { pass: true };
            }
          }
        ]
      }
    },
    {
      id: "js-17-grand-capstone-app",
      stepNumber: 17,
      moduleId: "mod-7",
      moduleName: "7. POO & Tópicos Avançados",
      title: "🏆 Projeto Capstone: App Completo com Arrays, DOM & Persistência",
      category: "Projeto Capstone",
      estimatedMinutes: 60,
      dependencies: ["js-16-classes-oop-inheritance"],
      isCapstone: true,
      instruction: {
        brief: "Parabéns por chegar ao grande projeto de encerramento! Você vai construir uma aplicação completa unindo todos os pilares do JavaScript: manipulação do DOM, eventos de formulário, lógica de arrays na memória e persistência durável no localStorage.",
        deepLesson: `
### 🎯 O Desafio Capstone:
Construa um Gerenciador de Metas & Tarefas com:
1. **Array de Estado:** \`let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []\`.
2. **Formulário com Validação:** Não permitir tarefas vazias e usar \`e.preventDefault()\`.
3. **Renderização Dinâmica:** Cada tarefa recebe um botão para marcar como feita e um botão para excluir.
4. **Persistência Total:** Salvar no localStorage a cada adição, conclusão ou exclusão.
5. **Estatísticas:** Exibir o total de tarefas e quantas estão concluídas.
        `,
        learningObjective: "Arquitetar uma Single Page Application completa e profissional em JavaScript Vanilla.",
        taskDescription: "Construa o fluxo completo: carregar e salvar tarefas, adicionar com validação, renderizar a lista, concluir, excluir e atualizar as estatísticas. O projeto só termina quando todos os testes passarem.",
        progressiveHints: [
          "Comece o estado com: let tarefas = JSON.parse(localStorage.getItem('devpath-tarefas')) || [];",
          "No submit, use preventDefault(), valide input.value.trim() e adicione um objeto com id, texto e feita.",
          "Em render(), crie o <li>, um botão data-action='toggle' e outro data-action='delete' para cada tarefa.",
          "Crie uma função salvar() com localStorage.setItem e chame-a após adicionar, concluir ou excluir."
        ],
        curatedLinks: [
          {
            source: "The Odin Project",
            title: "Project: Todo List",
            url: "https://www.theodinproject.com/lessons/node-path-javascript-todo-list",
            summary: "Como arquitetar aplicações JavaScript completas com separação de dados."
          }
        ]
      },
      playground: {
        files: {
          "index.html": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="capstone-app">
    <header>
      <p class="eyebrow">PROJETO FINAL</p>
      <h1>Minhas tarefas</h1>
      <div id="stats">Total: 0 | Concluídas: 0</div>
    </header>

    <form id="todo-form">
      <input type="text" id="todo-input" placeholder="Nova meta em JavaScript..." required>
      <button type="submit" id="add-btn">Adicionar</button>
    </form>

    <div class="filters" aria-label="Filtrar tarefas">
      <button type="button" data-filter="todas" class="active">Todas</button>
      <button type="button" data-filter="pendentes">Pendentes</button>
      <button type="button" data-filter="concluidas">Concluídas</button>
    </div>

    <ul id="todo-list"></ul>
    <p id="empty-state">Nenhuma tarefa por aqui.</p>
  </div>

  <script src="script.js"></script>
</body>
</html>`,
          "style.css": `body {
  font-family: system-ui, sans-serif;
  padding: 24px;
  background: #f2f2ef;
  color: #111;
  display: flex;
  justify-content: center;
}
.capstone-app {
  background: #fff;
  padding: 24px;
  border: 1px solid #111;
  max-width: 440px;
  width: 100%;
}
header {
  margin-bottom: 16px;
}
h1 {
  font-size: 1.6rem;
  margin: 4px 0;
  letter-spacing: -0.04em;
}
.eyebrow {
  margin: 0;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}
#stats {
  font-size: 0.8rem;
  color: #737373;
}
form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
input {
  flex: 1;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #bbb;
  color: #111;
}
button {
  background: #111;
  color: white;
  border: 1px solid #111;
  padding: 10px 16px;
  font-weight: bold;
  cursor: pointer;
}
.filters {
  display: flex;
  gap: 6px;
  padding-bottom: 14px;
  border-bottom: 1px solid #ddd;
}
.filters button {
  background: white;
  color: #666;
  border-color: #ccc;
  padding: 6px 9px;
  font-size: 0.7rem;
}
.filters button.active {
  background: #111;
  color: white;
  border-color: #111;
}
ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
li {
  background: #f7f7f5;
  padding: 10px 14px;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
}
li.feita .task-text {
  color: #888;
  text-decoration: line-through;
}
li .actions {
  display: flex;
  gap: 5px;
}
li button {
  padding: 5px 7px;
  font-size: 0.65rem;
}
#empty-state {
  color: #888;
  font-size: 0.8rem;
  text-align: center;
  padding: 16px 0;
}`,
          "script.js": `// PROJETO CAPSTONE — complete os TODOs abaixo
let tarefas = JSON.parse(localStorage.getItem('devpath-tarefas')) || [];
let filtroAtual = 'todas';

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const stats = document.querySelector('#stats');
const emptyState = document.querySelector('#empty-state');

function salvar() {
  // TODO 1: salve o array tarefas no localStorage usando JSON.stringify
}

function render() {
  // TODO 2: filtre as tarefas de acordo com filtroAtual
  list.innerHTML = '';

  tarefas.forEach((tarefa) => {
    // TODO 3: crie um <li> com o texto e dois botões:
    // data-action="toggle" e data-action="delete"
    const li = document.createElement('li');
    li.textContent = tarefa.texto;
    list.appendChild(li);
  });

  // TODO 4: atualize #stats e mostre/oculte #empty-state
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  // TODO 5: valide o texto, adicione a tarefa, salve e renderize
});

list.addEventListener('click', (event) => {
  // TODO 6: use event.target.dataset para concluir ou excluir uma tarefa
});

document.querySelector('.filters').addEventListener('click', (event) => {
  // TODO 7 (extra): atualize filtroAtual e renderize a lista filtrada
});

render();
`
        },
        activeFile: "script.js",
        tasks: [
          {
            id: "capstone-state",
            description: "Carregue o estado inicial do `localStorage` com fallback para um array vazio.",
            hint: "Use JSON.parse(localStorage.getItem('devpath-tarefas')) || [].",
            check: (doc, win, helpers) => {
              const source = helpers.source || '';
              const valid = source.includes('localStorage.getItem') && source.includes('JSON.parse');
              return valid ? { pass: true } : { pass: false, tip: "O estado deve tentar carregar as tarefas já salvas no localStorage." };
            }
          },
          {
            id: "capstone-add",
            description: "Adicione uma tarefa válida, renderize um `<li>` e atualize o total.",
            hint: "No submit: tarefas.push({ id: Date.now(), texto, feita: false }); depois chame salvar() e render().",
            check: (doc, win) => {
              const form = doc.querySelector('#todo-form');
              const input = doc.querySelector('#todo-input');
              const list = doc.querySelector('#todo-list');
              const stats = doc.querySelector('#stats');
              if (!form || !input || !list || !stats) return { pass: false, tip: "A estrutura base do projeto não foi encontrada." };

              input.value = 'Publicar projeto';
              form.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));

              const items = list.querySelectorAll('li');
              if (items.length === 0) return { pass: false, tip: "O submit ainda não criou um item visível na lista." };
              if (!stats.textContent.includes('Total: 1')) return { pass: false, tip: "Atualize #stats para exibir Total: 1 após a inclusão." };
              return { pass: true };
            }
          },
          {
            id: "capstone-actions",
            description: "Inclua ações para concluir e excluir cada tarefa, mantendo interface e estado sincronizados.",
            hint: "Crie botões com data-action e data-id. Use um único listener na lista para tratar os cliques.",
            check: (doc) => {
              const item = doc.querySelector('#todo-list li');
              if (!item) return { pass: false, tip: "Adicione a tarefa antes de validar as ações." };
              const toggle = item.querySelector('[data-action="toggle"]');
              const remove = item.querySelector('[data-action="delete"]');
              if (!toggle || !remove) return { pass: false, tip: "Cada item precisa de botões data-action='toggle' e data-action='delete'." };
              toggle.click();
              const updatedItem = doc.querySelector('#todo-list li');
              if (updatedItem && !updatedItem.classList.contains('feita') && !doc.querySelector('#stats')?.textContent.includes('Concluídas: 1')) {
                return { pass: false, tip: "A ação toggle deve marcar a tarefa como feita e atualizar a interface." };
              }
              doc.querySelector('[data-action="delete"]')?.click();
              if (doc.querySelectorAll('#todo-list li').length !== 0) return { pass: false, tip: "A ação delete deve remover a tarefa da lista." };
              return { pass: true };
            }
          },
          {
            id: "capstone-persistence",
            description: "Persista cada alteração com `localStorage.setItem()` e `JSON.stringify()`.",
            hint: "Dentro de salvar(): localStorage.setItem('devpath-tarefas', JSON.stringify(tarefas));",
            check: (doc, win, helpers) => {
              const source = helpers.source || '';
              const valid = source.includes('localStorage.setItem') && source.includes('JSON.stringify');
              return valid ? { pass: true } : { pass: false, tip: "Implemente salvar() com localStorage.setItem e JSON.stringify." };
            }
          }
        ]
      }
    }
  ]
};

// Códigos iniciais dos desafios. Eles são mantidos separados dos exemplos da
// aula para que abrir ou restaurar um exercício nunca entregue a solução.
const starterCodeByStage = {
  "js-1-variables-and-types": `// Declare nomeInstrutor e anosExperiencia abaixo.
// Depois, mostre os dois valores com console.log().

`,
  "js-2-template-literals": `// Crie formatarBoasVindas(nome, curso) usando template literals.
function formatarBoasVindas(nome, curso) {
  // Seu código aqui
}
`,
  "js-3-conditionals-and-strict-equality": `// Classifique a nota conforme as regras do desafio.
function classificarNota(nota) {
  // Seu código aqui
}
`,
  "js-4-arrow-functions-defaults": `// Crie a arrow function calcularPrecoFinal.
// Lembre-se de definir o valor padrão da taxa.

`,
  "js-5-mini-project-calculator": `function dividirConta(valorTotal, porcentagemGorjeta, numPessoas) {
  // Calcule e retorne totalComGorjeta e valorPorPessoa.
}
`,
  "js-6-arrays-iteration-methods": `let tarefas = ['Aprender JS', 'Praticar no IDE'];

// Adicione a nova tarefa e guarde o tamanho do array em total.
`,
  "js-7-arrays-functional-map-filter": `const precos = [10, 25, 60, 80, 120];

// Crie precosComDesconto e apenasCaros sem alterar precos.
`,
  "js-8-array-reduce-superpower": `const valores = [10, 20, 30, 40];

// Use reduce() para criar somaTotal.
`,
  "js-9-dom-selection-manipulation": `// Selecione #status, altere seu texto e adicione a classe pedida.
`,
  "js-10-dom-events-and-forms": `const form = document.querySelector('#meu-form');
const input = document.querySelector('#meu-input');
const mensagem = document.querySelector('#mensagem');

// Trate o evento submit aqui.
`,
  "js-11-dom-dynamic-creation-list": `function renderizarFrutas(listaDeFrutas) {
  // Limpe a lista e crie um <li> para cada fruta.
}

renderizarFrutas(['Abacaxi', 'Manga', 'Morango']);
`,
  "js-12-localstorage-json": `function salvarPerfil(nome, nivel) {
  // Monte o objeto e salve-o como JSON.
}
`,
  "js-13-timers-interval": `const display = document.querySelector('#segundos');
let contador = 0;

// Atualize contador e display a cada segundo.
`,
  "js-14-async-await-promises": `async function simularLogin(usuario, senha) {
  // Retorne o resultado de autenticação conforme a senha.
}
`,
  "js-15-fetch-api-live": `async function buscarPerfilGitHub(username) {
  // Busque o perfil, converta a resposta em JSON e retorne os dados.
}
`,
  "js-16-classes-oop-inheritance": `class Produto {
  // Implemente o constructor e calcularImposto().
}
`
};

jsRoadmapCourse.stages.forEach((stage) => {
  const starterCode = starterCodeByStage[stage.id];
  if (starterCode !== undefined) {
    stage.playground.files = {
      ...stage.playground.files,
      "script.js": starterCode
    };
  }
});

// Leituras oficiais do The Odin Project alinhadas a cada etapa da trilha.
// Mantemos apenas resumos próprios no DevPath e enviamos o aluno ao material
// original para o estudo completo e para a atribuição da fonte.
const odinResourcesByStage = {
  "js-1-variables-and-types": [
    {
      source: "The Odin Project",
      title: "Variables and Operators",
      url: "https://www.theodinproject.com/lessons/foundations-variables-and-operators",
      summary: "Introdução a let, const, operações e execução de JavaScript no navegador."
    }
  ],
  "js-2-template-literals": [
    {
      source: "The Odin Project",
      title: "Data Types and Conditionals",
      url: "https://www.theodinproject.com/lessons/foundations-fundamentals-part-2",
      summary: "Tipos de dados, strings com crases e interpolação de expressões."
    }
  ],
  "js-3-conditionals-and-strict-equality": [
    {
      source: "The Odin Project",
      title: "Data Types and Conditionals",
      url: "https://www.theodinproject.com/lessons/foundations-fundamentals-part-2",
      summary: "Comparações, operadores lógicos, valores truthy e falsy e decisões com condicionais."
    }
  ],
  "js-4-arrow-functions-defaults": [
    {
      source: "The Odin Project",
      title: "Function Basics",
      url: "https://www.theodinproject.com/lessons/foundations-function-basics",
      summary: "Definição, chamada, retorno, escopo e uma introdução às arrow functions."
    }
  ],
  "js-5-mini-project-calculator": [
    {
      source: "The Odin Project",
      title: "Problem Solving",
      url: "https://www.theodinproject.com/lessons/foundations-problem-solving",
      summary: "Uma abordagem estruturada para dividir problemas em passos menores antes de programar."
    }
  ],
  "js-6-arrays-iteration-methods": [
    {
      source: "The Odin Project",
      title: "Loops and Arrays",
      url: "https://www.theodinproject.com/lessons/foundations-loops-and-arrays",
      summary: "Arrays, repetição, métodos essenciais e prática orientada por testes."
    }
  ],
  "js-7-arrays-functional-map-filter": [
    {
      source: "The Odin Project",
      title: "Loops and Arrays",
      url: "https://www.theodinproject.com/lessons/foundations-loops-and-arrays",
      summary: "Exemplos práticos de transformação e seleção de dados com map e filter."
    }
  ],
  "js-8-array-reduce-superpower": [
    {
      source: "The Odin Project",
      title: "Loops and Arrays",
      url: "https://www.theodinproject.com/lessons/foundations-loops-and-arrays",
      summary: "Uso combinado de filter, map e reduce para resolver problemas com arrays."
    }
  ],
  "js-9-dom-selection-manipulation": [
    {
      source: "The Odin Project",
      title: "DOM Manipulation and Events",
      url: "https://www.theodinproject.com/lessons/foundations-dom-manipulation-and-events",
      summary: "A árvore do DOM, seletores e alteração de texto, atributos e classes."
    }
  ],
  "js-10-dom-events-and-forms": [
    {
      source: "The Odin Project",
      title: "DOM Manipulation and Events",
      url: "https://www.theodinproject.com/lessons/foundations-dom-manipulation-and-events",
      summary: "Event listeners, propagação de eventos e interação do JavaScript com a interface."
    }
  ],
  "js-11-dom-dynamic-creation-list": [
    {
      source: "The Odin Project",
      title: "DOM Manipulation and Events",
      url: "https://www.theodinproject.com/lessons/foundations-dom-manipulation-and-events",
      summary: "Criação e inserção de elementos no DOM com createElement e appendChild."
    }
  ],
  "js-12-localstorage-json": [
    {
      source: "The Odin Project",
      title: "JSON",
      url: "https://www.theodinproject.com/lessons/javascript-json",
      summary: "Como estruturar dados e convertê-los com JSON.parse e JSON.stringify."
    },
    {
      source: "The Odin Project",
      title: "Project: Todo List",
      url: "https://www.theodinproject.com/lessons/node-path-javascript-todo-list",
      summary: "Aplicação prática de JSON e localStorage para manter os dados entre sessões."
    }
  ],
  "js-13-timers-interval": [
    {
      source: "The Odin Project",
      title: "Asynchronous Code",
      url: "https://www.theodinproject.com/lessons/node-path-javascript-asynchronous-code",
      summary: "O modelo assíncrono do JavaScript e tarefas que continuam sem bloquear a aplicação."
    }
  ],
  "js-14-async-await-promises": [
    {
      source: "The Odin Project",
      title: "Async and Await",
      url: "https://www.theodinproject.com/lessons/javascript-async-and-await",
      summary: "Promises com uma sintaxe mais legível, valores de retorno e tratamento de erros."
    }
  ],
  "js-15-fetch-api-live": [
    {
      source: "The Odin Project",
      title: "Working with APIs",
      url: "https://www.theodinproject.com/lessons/javascript-working-with-apis",
      summary: "Conceitos de API, requisições com fetch e extração dos dados recebidos."
    }
  ],
  "js-16-classes-oop-inheritance": [
    {
      source: "The Odin Project",
      title: "Classes",
      url: "https://www.theodinproject.com/lessons/javascript-classes",
      summary: "Sintaxe de classes, herança, campos privados e relação com protótipos."
    }
  ],
  "js-17-grand-capstone-app": [
    {
      source: "The Odin Project",
      title: "Project: Todo List",
      url: "https://www.theodinproject.com/lessons/node-path-javascript-todo-list",
      summary: "Referência de arquitetura para organizar dados, interface e persistência em um app completo."
    }
  ]
};

jsRoadmapCourse.stages.forEach((stage) => {
  const odinResources = odinResourcesByStage[stage.id] || [];
  const odinUrls = new Set(odinResources.map((resource) => resource.url));
  stage.instruction.curatedLinks = [
    ...odinResources,
    ...(stage.instruction.curatedLinks || []).filter((resource) => !odinUrls.has(resource.url))
  ];
});

// Uma única sequência alimenta a trilha, o editor e o progresso. Os IDs antigos
// são preservados para manter os rascunhos e as conquistas de quem já estudava.
for (const { after, stage } of [...odinFoundationStageInsertions, ...foundationInsertions]) {
  const index = jsRoadmapCourse.stages.findIndex((item) => item.id === after);
  if (index < 0) throw new Error(`Pré-requisito não encontrado: ${after}`);
  jsRoadmapCourse.stages.splice(index + 1, 0, stage);
}

// FizzBuzz exige repetição: a introdução a loops deve vir antes do problema.
const fizzBuzzIndex = jsRoadmapCourse.stages.findIndex((stage) => stage.id === 'odin-problem-solving-fizzbuzz');
const [fizzBuzzStage] = jsRoadmapCourse.stages.splice(fizzBuzzIndex, 1);
fizzBuzzStage.moduleId = 'mod-3';
const loopsIndex = jsRoadmapCourse.stages.findIndex((stage) => stage.id === 'js-foundation-loops');
jsRoadmapCourse.stages.splice(loopsIndex + 1, 0, fizzBuzzStage);

jsRoadmapCourse.modules = [...jsRoadmapCourse.modules, ...advancedModules].map((module) => ({
  ...module,
  ...foundationModuleDetails[module.id],
  projectStageId: foundationModuleProjects[module.id]
    || advancedStages.filter((stage) => stage.moduleId === module.id).at(-1)?.id,
}));
jsRoadmapCourse.stages = [...jsRoadmapCourse.stages, ...advancedStages].map((stage, index, stages) => ({
  ...stage,
  stepNumber: index + 1,
  moduleName: jsRoadmapCourse.modules.find((module) => module.id === stage.moduleId).name,
  dependencies: index ? [stages[index - 1].id] : [],
  isCapstone: index === stages.length - 1,
  instruction: {
    ...stage.instruction,
    ...curriculumLessons[stage.id],
    ...(curriculumLessons[stage.id] ? { learningObjective: curriculumLessons[stage.id].learningObjectives[0] } : {}),
    ...(stage.id === 'js-17-grand-capstone-app' ? { brief: existingProjectBriefs[stage.id].summary } : {}),
  },
  playground: { ...stage.playground, ...(curriculumChecks[stage.id] ? { tasks: curriculumChecks[stage.id] } : {}) },
  ...(existingProjectBriefs[stage.id] ? { projectBrief: existingProjectBriefs[stage.id] } : {}),
  ...(stage.id === 'js-17-grand-capstone-app' ? { title: 'Projeto do módulo: Gerenciador de tarefas', category: 'Projeto de módulo', estimatedMinutes: 120 } : {}),
}));
jsRoadmapCourse.phases = trainingPhases;
jsRoadmapCourse.title = 'Formação especializada em JavaScript: do zero ao Master';
jsRoadmapCourse.description = 'Uma sequência de fundamentos, aplicações no navegador, arquitetura e qualidade, com desafios verificáveis e um projeto ao final de cada módulo.';

// Aliases para compatibilidade
export const roadmapCourse = jsRoadmapCourse;
