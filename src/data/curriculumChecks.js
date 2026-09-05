// Os critérios executam contratos observáveis. Nenhum depende de palavras em comentários.
const ok = { pass: true };
const fail = (tip) => ({ pass: false, tip });
const valueOf = (win, helpers, name) => helpers?.getVar?.(name) ?? win?.[name];
const same = (actual, expected) => {
  if (Object.is(actual, expected)) return true;
  if (!actual || !expected || typeof actual !== 'object' || typeof expected !== 'object') return false;
  if (Array.isArray(actual) !== Array.isArray(expected)) return false;
  const keys = Object.keys(expected);
  return Object.keys(actual).length === keys.length && keys.every((key) => Object.hasOwn(actual, key) && same(actual[key], expected[key]));
};
const close = (actual, expected) => typeof actual === 'number' && Number.isFinite(actual)
  && Math.abs(actual - expected) <= Math.max(1, Math.abs(expected)) * 1e-9;
const show = (value) => JSON.stringify(value) ?? String(value);
const requirement = (id, description, hint, check) => ({ id, description, hint, check });

function cases(win, helpers, name, examples, compare = same) {
  const fn = valueOf(win, helpers, name);
  if (typeof fn !== 'function') return fail(`Crie a função ${name} com os parâmetros do enunciado.`);
  for (const [args, expected] of examples) {
    let actual;
    try { actual = fn(...args); } catch (error) {
      return fail(`${name}(${args.map(show).join(', ')}) lançou um erro: ${error.message}`);
    }
    if (!compare(actual, expected)) {
      return fail(`${name}(${args.map(show).join(', ')}) deveria retornar ${show(expected)}; recebemos ${show(actual)}.`);
    }
  }
  return ok;
}

function withRandom(win, random, run) {
  const original = win.Math.random;
  win.Math.random = random;
  try { return run(); } finally { win.Math.random = original; }
}

function checkRoundRules(win, helpers) {
  const choices = ['rock', 'paper', 'scissors'];
  const beats = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
  const examples = choices.flatMap(human => choices.map(computer => [
    [human, computer], human === computer ? 'draw' : beats[human] === computer ? 'human' : 'computer',
  ]));
  examples.push([['ROCK', 'scissors'], 'human'], [['paper', 'SCISSORS'], 'computer'], [['PAPER', 'paper'], 'draw']);
  return cases(win, helpers, 'playRound', examples);
}

function checkComputerChoice(win, helpers) {
  const fn = valueOf(win, helpers, 'getComputerChoice');
  if (typeof fn !== 'function') return fail('Crie getComputerChoice().');
  const randomValues = [0, 0.17, 0.34, 0.5, 0.67, 0.83, 0.999999];
  const outputs = randomValues.map(random => withRandom(win, () => random, () => fn()));
  return outputs.every(choice => ['rock', 'paper', 'scissors'].includes(choice)) && new Set(outputs).size === 3
    ? ok : fail('O sorteio deve produzir as três escolhas válidas, inclusive quando Math.random retorna 0 ou um valor próximo de 1.');
}

const submit = (doc, win, formSelector, inputSelector, text) => {
  const form = doc.querySelector(formSelector);
  const input = doc.querySelector(inputSelector);
  if (!form || !input) return null;
  input.value = text;
  const event = new win.Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(event);
  return event;
};

const getStoredTodos = (win) => {
  try {
    const data = JSON.parse(win.localStorage.getItem('devpath-tarefas'));
    return Array.isArray(data) ? data : null;
  } catch { return null; }
};
const addTodo = (doc, win, text) => submit(doc, win, '#todo-form', '#todo-input', text);
const todoItems = (doc) => Array.from(doc.querySelectorAll('#todo-list li'));
const statsAre = (doc, total, done) => doc.querySelector('#stats')?.textContent.trim() === `Total: ${total} | Concluídas: ${done}`;
function clearTodos(doc) {
  doc.querySelector('[data-filter="todas"]')?.click();
  let attempts = 0;
  while (todoItems(doc).length && attempts++ < 100) {
    const before = todoItems(doc).length;
    doc.querySelector('#todo-list [data-action="delete"]')?.click();
    if (todoItems(doc).length >= before) return false;
  }
  return todoItems(doc).length === 0;
}

export const curriculumChecks = {
  'js-1-variables-and-types': [
    requirement('task-1-const', 'nomeInstrutor contém exatamente o texto "JavaScript".', 'Use const para guardar o texto solicitado.', (doc, win, helpers) => valueOf(win, helpers, 'nomeInstrutor') === 'JavaScript' ? ok : fail('nomeInstrutor precisa ser a string "JavaScript", respeitando as maiúsculas.')),
    requirement('task-2-let', 'anosExperiencia contém o número 5.', 'Use let e escreva o número sem aspas.', (doc, win, helpers) => valueOf(win, helpers, 'anosExperiencia') === 5 ? ok : fail('anosExperiencia deve conter o número 5, não a string "5".')),
    requirement('task-3-log', 'O console exibe os dois valores declarados.', 'Passe as duas variáveis para console.log.', (doc, win, helpers) => {
      const messages = (helpers.logs || []).map(entry => typeof entry === 'string' ? entry : entry.msg ?? entry.message ?? '').join(' ');
      return /\bJavaScript\b/.test(messages) && /(?:^|\s)5(?:\s|$)/.test(messages) ? ok : fail('Execute console.log com nomeInstrutor e anosExperiencia para observar JavaScript e 5.');
    }),
  ],
  'js-2-template-literals': [
    requirement('task-formatar-func', 'formatarBoasVindas retorna a mensagem para diferentes nomes e cursos.', 'Use os dois parâmetros dentro da mensagem retornada.', (doc, win, helpers) => cases(win, helpers, 'formatarBoasVindas', [
      [['Ana', 'JavaScript'], 'Olá, Ana! Bem-vindo ao curso de JavaScript!'],
      [['João Silva', 'CSS'], 'Olá, João Silva! Bem-vindo ao curso de CSS!'],
      [['Bia', 'React'], 'Olá, Bia! Bem-vindo ao curso de React!'],
    ])),
  ],
  'js-3-conditionals-and-strict-equality': [
    requirement('task-classificar-boundaries', 'As três faixas incluem corretamente limites e decimais.', 'Teste valores imediatamente abaixo e acima de 70 e 90.', (doc, win, helpers) => cases(win, helpers, 'classificarNota', [
      [[0], 'Precisa Melhorar'], [[69.9], 'Precisa Melhorar'], [[70], 'Bom'], [[75], 'Bom'], [[89.9], 'Bom'], [[90], 'Excelente'], [[100], 'Excelente'],
    ])),
  ],
  'js-4-arrow-functions-defaults': [
    requirement('task-preco-default', 'A taxa padrão funciona com argumento ausente ou undefined.', 'Declare o valor padrão no parâmetro taxa.', (doc, win, helpers) => cases(win, helpers, 'calcularPrecoFinal', [[[100], 110], [[80], 88], [[0], 0], [[120, undefined], 132]], close)),
    requirement('task-preco-custom', 'Taxas customizadas e taxa zero são preservadas.', 'Zero é um argumento válido e não deve acionar o padrão.', (doc, win, helpers) => cases(win, helpers, 'calcularPrecoFinal', [[[100, 0.25], 125], [[80, 0.5], 120], [[199.9, 0], 199.9]], close)),
  ],
  'js-5-mini-project-calculator': [
    requirement('task-conta-results', 'A conta retorna total e parcela corretos para várias entradas.', 'Converta o percentual dividindo por 100 antes do cálculo.', (doc, win, helpers) => cases(win, helpers, 'dividirConta', [
      [[100, 10, 2], { totalComGorjeta: 110, valorPorPessoa: 55 }],
      [[90, 0, 3], { totalComGorjeta: 90, valorPorPessoa: 30 }],
      [[60, 5, 4], { totalComGorjeta: 63, valorPorPessoa: 15.75 }],
      [[0, 15, 2], { totalComGorjeta: 0, valorPorPessoa: 0 }],
    ], (a, b) => a && close(a.totalComGorjeta, b.totalComGorjeta) && close(a.valorPorPessoa, b.valorPorPessoa))),
  ],
  'odin-problem-solving-fizzbuzz': [
    requirement('fizzbuzz-size', 'A saída tem o tamanho correto, incluindo limite zero, e cada chamada cria um array.', 'Retorne o resultado depois do loop.', (doc, win, helpers) => {
      const fn = valueOf(win, helpers, 'fizzBuzz');
      if (typeof fn !== 'function') return fail('Crie fizzBuzz(limite).');
      const first = fn(5);
      return Array.isArray(first) && first.length === 5 && Array.isArray(fn(0)) && fn(0).length === 0 && first !== fn(5)
        ? ok : fail('Retorne um novo array a cada chamada; limite 0 deve retornar [].');
    }),
    requirement('fizzbuzz-rules', 'As regras funcionam em todos os números até 30.', 'Confira o caso combinado e preserve números nos demais casos.', (doc, win, helpers) => cases(win, helpers, 'fizzBuzz', [
      [[1], [1]], [[5], [1, 2, 'Fizz', 4, 'Buzz']],
      [[30], Array.from({ length: 30 }, (_, index) => { const n = index + 1; return n % 15 === 0 ? 'FizzBuzz' : n % 3 === 0 ? 'Fizz' : n % 5 === 0 ? 'Buzz' : n; })],
    ])),
  ],
  'odin-rock-paper-scissors-console': [
    requirement('rps-choice', 'O sorteio alcança as três escolhas e nunca sai dos valores aceitos.', 'Use índices inteiros entre 0 e 2.', (doc, win, helpers) => checkComputerChoice(win, helpers)),
    requirement('rps-rules', 'Todas as nove combinações funcionam, com maiúsculas em ambas as entradas.', 'Normalize as duas jogadas antes de decidir a rodada.', (doc, win, helpers) => checkRoundRules(win, helpers)),
  ],
  'js-6-arrays-iteration-methods': [
    requirement('array-items', 'tarefas preserva os dois itens iniciais e adiciona a terceira tarefa ao final.', 'push modifica o array e retorna o tamanho.', (doc, win, helpers) => same(valueOf(win, helpers, 'tarefas'), ['Aprender JS', 'Praticar no IDE', 'Dominar o DOM']) ? ok : fail('Confira os três textos e sua ordem no array tarefas.')),
    requirement('array-length', 'total representa a quantidade final de tarefas.', 'Leia length depois de incluir o novo item.', (doc, win, helpers) => valueOf(win, helpers, 'total') === 3 ? ok : fail('total deve conter o número 3 depois da inclusão.')),
  ],
  'js-7-arrays-functional-map-filter': [
    requirement('map-filter-results', 'As saídas estão corretas e precos permanece intacto.', 'Crie ambos os resultados a partir dos preços originais.', (doc, win, helpers) => {
      const discounted = valueOf(win, helpers, 'precosComDesconto');
      return same(valueOf(win, helpers, 'precos'), [10, 25, 60, 80, 120])
        && Array.isArray(discounted) && discounted.length === 5 && discounted.every((price, i) => close(price, [9, 22.5, 54, 72, 108][i]))
        && same(valueOf(win, helpers, 'apenasCaros'), [60, 80, 120]) ? ok : fail('Confira todos os preços com desconto, o filtro > 50 e se precos não foi alterado.');
    }),
    requirement('map-filter-general', 'As funções aceitam outras listas, incluindo lista vazia e preço exatamente 50.', 'map transforma; filter testa uma condição sem alterar a entrada.', (doc, win, helpers) => {
      for (const [name, input, expected] of [
        ['aplicarDesconto', [0, 50, 100], [0, 45, 90]], ['aplicarDesconto', [], []],
        ['filtrarCaros', [50, 51, 0, 120], [51, 120]], ['filtrarCaros', [], []],
      ]) {
        const original = [...input];
        const result = cases(win, helpers, name, [[ [input], expected ]]);
        if (!result.pass) return result;
        if (!same(input, original)) return fail(`${name} não deve modificar o array recebido.`);
      }
      return ok;
    }),
  ],
  'js-8-array-reduce-superpower': [
    requirement('reduce-result', 'somaTotal contém 100 e valores permanece intacto.', 'Use o resultado de somarValores(valores).', (doc, win, helpers) => valueOf(win, helpers, 'somaTotal') === 100 && same(valueOf(win, helpers, 'valores'), [10, 20, 30, 40]) ? ok : fail('Guarde a soma numérica em somaTotal sem alterar valores.')),
    requirement('reduce-cases', 'somarValores soma outras listas, negativos e lista vazia.', 'Forneça o valor inicial 0 ao reduce.', (doc, win, helpers) => cases(win, helpers, 'somarValores', [[[[2, 5, 1]], 8], [[[]], 0], [[[10, -3, 2]], 9], [[[1.5, 2.5]], 4]], close)),
  ],
  'odin-object-basics': [
    requirement('object-data', 'Cada livro preserva as quatro propriedades recebidas.', 'Inclua titulo, autor, paginas e lido no objeto.', (doc, win, helpers) => {
      const fn = valueOf(win, helpers, 'criarLivro');
      if (typeof fn !== 'function') return fail('Crie criarLivro(titulo, autor, paginas, lido).');
      for (const data of [['Duna', 'Frank Herbert', 544, false], ['Outro livro', 'Autora', 20, true]]) {
        const book = fn(...data);
        if (!book || !same([book.titulo, book.autor, book.paginas, book.lido], data)) return fail('Preserve os argumentos em suas propriedades, inclusive lido igual a false.');
      }
      return ok;
    }),
    requirement('object-method', 'info lê as propriedades atuais e os livros são independentes.', 'Leia this dentro do método, não apenas os parâmetros originais.', (doc, win, helpers) => {
      const fn = valueOf(win, helpers, 'criarLivro');
      if (typeof fn !== 'function') return fail('Crie criarLivro().');
      const first = fn('Duna', 'Frank Herbert', 544, false);
      const second = fn('Segundo', 'Autora', 20, true);
      if (!first || first === second || typeof first.info !== 'function') return fail('Crie um novo objeto com método info() a cada chamada.');
      first.titulo = 'Título atualizado'; first.autor = 'Nova autora'; first.paginas = 777;
      const result = first.info();
      return typeof result === 'string' && ['Título atualizado', 'Nova autora', '777'].every(text => result.includes(text)) && second.titulo === 'Segundo'
        ? ok : fail('info() deve refletir alterações do próprio livro sem modificar o segundo livro.');
    }),
  ],
  'js-9-dom-selection-manipulation': [
    requirement('dom-status', 'O status mostra a mensagem pedida e possui a classe online.', 'Selecione #status e atualize textContent e classList.', doc => {
      const element = doc.querySelector('#status');
      return element?.textContent === 'Conectado com Sucesso!' && element.classList.contains('online') ? ok : fail('Atualize o texto de #status para "Conectado com Sucesso!" e adicione online.');
    }),
  ],
  'js-10-dom-events-and-forms': [
    requirement('form-submit', 'Dois envios atualizam a mensagem, limpam o input e cancelam o envio padrão.', 'Use submit, preventDefault e leia o texto antes de limpar.', (doc, win) => {
      for (const text of ['Estudar eventos', '<b>Olá</b>']) {
        const event = submit(doc, win, '#meu-form', '#meu-input', text);
        if (!event?.defaultPrevented) return fail('O listener de submit deve chamar event.preventDefault().');
        const message = doc.querySelector('#mensagem');
        if (message?.textContent !== text || message.children.length > 0) return fail('Mostre o valor recebido como texto com textContent, sem interpretá-lo como HTML.');
        if (doc.querySelector('#meu-input')?.value !== '') return fail('Limpe o input depois de mostrar a mensagem.');
      }
      return ok;
    }),
  ],
  'js-11-dom-dynamic-creation-list': [
    requirement('dom-list-rerender', 'Renderizar substitui os itens, preserva a ordem e aceita uma lista vazia.', 'Limpe a lista antes de criar os novos li.', (doc, win, helpers) => {
      const fn = valueOf(win, helpers, 'renderizarFrutas');
      if (typeof fn !== 'function') return fail('Crie renderizarFrutas(listaDeFrutas).');
      for (const names of [['Uva', 'Pera'], ['<b>Maçã</b>', 'Uva', 'Uva'], []]) {
        const original = [...names];
        fn(names);
        const items = Array.from(doc.querySelectorAll('#lista-frutas li'));
        if (!same(items.map(item => item.textContent), original) || items.some(item => item.children.length) || !same(names, original)) {
          return fail('A lista deve conter exatamente um li por fruta, na ordem recebida, sem interpretar HTML nem alterar a entrada.');
        }
      }
      return ok;
    }),
  ],
  'odin-rock-paper-scissors-ui': [
    requirement('rps-ui-rules', 'A interface mantém todas as regras do jogo no console.', 'Reutilize as funções já testadas.', (doc, win, helpers) => {
      const choices = checkComputerChoice(win, helpers);
      return choices.pass ? checkRoundRules(win, helpers) : choices;
    }),
    requirement('rps-ui-state', 'Botões, empates e placares funcionam até o fim da partida, que bloqueia novas jogadas.', 'Um empate não soma pontos e a partida termina ao atingir cinco.', (doc, win, helpers) => {
      const getChoice = valueOf(win, helpers, 'getComputerChoice');
      if (typeof getChoice !== 'function') return fail('Crie getComputerChoice antes de conectar os botões.');
      const score = () => [Number(doc.querySelector('#human-score')?.textContent), Number(doc.querySelector('#computer-score')?.textContent)];
      return withRandom(win, () => 0.1, () => {
        const computer = getChoice();
        if (!['rock', 'paper', 'scissors'].includes(computer)) return fail('O sorteio precisa retornar uma jogada válida.');
        const before = score();
        if (!same(before, [0, 0])) return fail('Inicie a partida com os dois placares em zero. Execute novamente para restaurar o estado.');
        doc.querySelector(`[data-choice="${computer}"]`)?.click();
        if (!same(score(), before)) return fail('Um empate deve preservar os dois placares.');
        const losesTo = { rock: 'paper', paper: 'scissors', scissors: 'rock' };
        const beats = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
        doc.querySelector(`[data-choice="${beats[computer]}"]`)?.click();
        if (!same(score(), [0, 1])) return fail('Uma derrota da pessoa deve aumentar somente o placar do computador.');
        for (let i = 1; i <= 5; i += 1) {
          doc.querySelector(`[data-choice="${losesTo[computer]}"]`)?.click();
          if (!same(score(), [i, 1])) return fail(`Após ${i} vitórias da pessoa, o placar esperado é ${i} × 1.`);
        }
        const round = doc.querySelector('#round-result')?.textContent.trim();
        const final = doc.querySelector('#game-result')?.textContent.trim();
        if (!round || round === 'Escolha sua jogada.' || !final) return fail('Mostre uma mensagem de rodada e anuncie o vencedor em #game-result.');
        for (const button of doc.querySelectorAll('[data-choice]')) button.click();
        return same(score(), [5, 1]) ? ok : fail('Depois de atingir 5 pontos, novos cliques não podem alterar o placar.');
      });
    }),
  ],
  'odin-etch-a-sketch': [
    requirement('etch-grid', 'A grade inicial contém 256 células.', 'Chame criarGrade(16) ao carregar.', doc => doc.querySelectorAll('#grid .cell').length === 256 ? ok : fail('Crie uma grade 16 × 16 ao iniciar.')),
    requirement('etch-behaviour', 'Recriar pelo botão substitui a grade e novas células respondem ao mouseover.', 'Conecte #rebuild e adicione o evento às células novas.', (doc, win) => {
      const input = doc.querySelector('#size');
      if (!input) return fail('Mantenha o campo #size.');
      for (const [size, count] of [[8, 64], [1, 1]]) {
        input.value = String(size); doc.querySelector('#rebuild')?.click();
        const cells = doc.querySelectorAll('#grid .cell');
        if (cells.length !== count) return fail(`O botão Recriar deve produzir ${count} células para tamanho ${size}.`);
        cells[0].dispatchEvent(new win.MouseEvent('mouseover', { bubbles: true }));
        if (!cells[0].classList.contains('painted')) return fail('A célula deve receber painted no evento mouseover.');
      }
      return ok;
    }),
    requirement('etch-validation', 'Tamanhos fora de 1 a 64 e números fracionários preservam a grade atual.', 'Valide antes de limpar o contêiner.', (doc, win, helpers) => {
      const fn = valueOf(win, helpers, 'criarGrade');
      if (typeof fn !== 'function') return fail('Crie criarGrade(tamanho).');
      fn(8);
      const original = doc.querySelector('#grid .cell');
      for (const invalid of [0, -1, 65, 2.5, NaN]) {
        fn(invalid);
        if (doc.querySelectorAll('#grid .cell').length !== 64 || doc.querySelector('#grid .cell') !== original) return fail('Para uma entrada inválida, retorne sem alterar os elementos existentes.');
      }
      return ok;
    }),
  ],
  'odin-calculator': [
    requirement('calc-logic', 'As operações lidam com números positivos, negativos, zero e todos os operadores.', 'Teste a lógica isolada antes de mexer no DOM.', (doc, win, helpers) => {
      for (const [name, examples] of [
        ['add', [[[2, 3], 5], [[-2, 3], 1], [[0, 0], 0]]], ['subtract', [[[9, 4], 5], [[2, 5], -3]]],
        ['multiply', [[[6, 7], 42], [[0, 4], 0], [[-2, 3], -6]]], ['divide', [[[8, 2], 4], [[5, 2], 2.5]]],
        ['operate', [[['+', 12, 7], 19], [['-', 3, 8], -5], [['*', 4, 3], 12], [['/', 8, 2], 4]]],
      ]) {
        const result = cases(win, helpers, name, examples, close);
        if (!result.pass) return result;
      }
      return ok;
    }),
    requirement('calc-safety-ui', 'A interface calcula vários dígitos, todas as operações, erro de divisão por zero e limpeza.', 'C deve limpar também o estado interno.', (doc, win, helpers) => {
      const operate = valueOf(win, helpers, 'operate');
      if (typeof operate !== 'function') return fail('Crie operate().');
      const zero = operate('/', 10, 0);
      if (typeof zero !== 'string' || !zero.trim()) return fail('Divisão por zero deve retornar uma mensagem de erro não vazia.');
      const click = selector => doc.querySelector(selector)?.click();
      const display = () => doc.querySelector('#display')?.textContent.trim();
      for (const [left, operator, right, expected] of [['12', '+', '3', '15'], ['8', '-', '3', '5'], ['7', '*', '3', '21'], ['8', '/', '2', '4'], ['8', '/', '0', zero]]) {
        click('[data-action="clear"]');
        for (const digit of left) click(`[data-value="${digit}"]`);
        click(`[data-operator="${operator}"]`);
        for (const digit of right) click(`[data-value="${digit}"]`);
        click('[data-action="equals"]');
        if (display() !== expected) return fail(`Ao digitar ${left} ${operator} ${right} =, o display deve mostrar ${expected}.`);
      }
      click('[data-action="clear"]');
      return display() === '0' ? ok : fail('C deve restaurar o display para 0.');
    }),
  ],
  'js-12-localstorage-json': [
    requirement('storage-profile', 'salvarPerfil grava JSON correto e substitui o perfil a cada chamada.', 'Use a chave perfil_usuario e preserve o tipo de nivel.', (doc, win, helpers) => {
      const fn = valueOf(win, helpers, 'salvarPerfil');
      if (typeof fn !== 'function') return fail('Crie salvarPerfil(nome, nivel).');
      const before = win.localStorage.getItem('perfil_usuario');
      try {
        for (const [nome, nivel] of [['Ana', 2], ['Bia', 0], ['João "JS"', 3]]) {
          fn(nome, nivel);
          let stored;
          try { stored = JSON.parse(win.localStorage.getItem('perfil_usuario')); } catch { return fail('O conteúdo salvo precisa ser JSON válido.'); }
          if (stored?.nome !== nome || stored?.nivel !== nivel) return fail(`O perfil salvo deve conter nome ${show(nome)} e nivel numérico ${nivel}.`);
        }
        return ok;
      } finally {
        if (before === null) win.localStorage.removeItem('perfil_usuario'); else win.localStorage.setItem('perfil_usuario', before);
      }
    }),
  ],
  'js-13-timers-interval': [
    requirement('timer-progress', 'O contador avança em duas observações consecutivas, aproximadamente uma vez por segundo.', 'Incremente o estado e atualize #segundos dentro de setInterval.', async doc => {
      const element = doc.querySelector('#segundos');
      if (!element) return fail('Mantenha o elemento #segundos.');
      let previous = Number(element.textContent);
      if (!Number.isInteger(previous) || previous < 0) return fail('O contador deve mostrar um inteiro não negativo.');
      for (let sample = 0; sample < 2; sample += 1) {
        await new Promise(resolve => setTimeout(resolve, 1150));
        const current = Number(element.textContent);
        if (!Number.isInteger(current) || current <= previous || current - previous > 2) return fail('O display deve continuar aumentando em passos de 1 a cada 1000 ms. Mantenha a aba ativa durante a verificação.');
        previous = current;
      }
      return ok;
    }),
  ],
  'js-14-async-await-promises': [
    requirement('login-resolved', 'A Promise resolve os dados corretos para senha válida, inválida e tipo incorreto.', 'Teste o objeto obtido com await, não somente a existência da Promise.', async (doc, win, helpers) => {
      const fn = valueOf(win, helpers, 'simularLogin');
      if (typeof fn !== 'function') return fail('Crie simularLogin(usuario, senha).');
      for (const [args, expected] of [[['Ana', '1234'], { autenticado: true, usuario: 'Ana' }], [['Bia', '1234'], { autenticado: true, usuario: 'Bia' }], [['Ana', 'errada'], { autenticado: false }], [['Ana', 1234], { autenticado: false }]]) {
        const pending = fn(...args);
        if (!pending || typeof pending.then !== 'function') return fail('simularLogin deve retornar uma Promise; declare a função com async.');
        const actual = await pending;
        if (!actual || actual.autenticado !== expected.autenticado || (expected.autenticado && actual.usuario !== expected.usuario)) return fail(`Para usuario ${show(args[0])} e senha ${show(args[1])}, resolva ${show(expected)}.`);
      }
      return ok;
    }),
  ],
  'js-15-fetch-api-live': [
    requirement('fetch-contract', 'Busca usa o username, verifica HTTP, retorna JSON e propaga falha de rede.', 'Confira resposta.ok e retorne o JSON; não absorva erros em um catch vazio.', async (doc, win, helpers) => {
      const fn = valueOf(win, helpers, 'buscarPerfilGitHub');
      if (typeof fn !== 'function') return fail('Crie buscarPerfilGitHub(username).');
      const original = win.fetch;
      try {
        for (const username of ['octocat', 'devpath-student']) {
          const expected = { login: username, id: 42, public_repos: 7 };
          let url; let calls = 0; let readBody = false;
          win.fetch = async requested => { url = String(requested); calls += 1; return { ok: true, status: 200, json: async () => { readBody = true; return expected; } }; };
          const pending = fn(username);
          if (!pending || typeof pending.then !== 'function') return fail('A busca deve retornar uma Promise.');
          const actual = await pending;
          if (calls !== 1 || url !== `https://api.github.com/users/${username}` || !readBody || !same(actual, expected)) return fail('Chame a URL com o username recebido e retorne o objeto completo lido por resposta.json().');
        }
        for (const mode of ['http', 'network']) {
          win.fetch = mode === 'http'
            ? async () => ({ ok: false, status: 404, json: async () => ({ message: 'Not Found' }) })
            : async () => { throw new Error('Sem conexão'); };
          let rejected = false;
          try { await fn('missing'); } catch { rejected = true; }
          if (!rejected) return fail(mode === 'http' ? 'HTTP 404 deve rejeitar a Promise: verifique resposta.ok e lance um erro.' : 'A falha de rede deve chegar ao chamador como rejeição.');
        }
        return ok;
      } finally { win.fetch = original; }
    }),
  ],
  'js-16-classes-oop-inheritance': [
    requirement('product-instances', 'Produto preserva dados de instâncias independentes.', 'Guarde nome e preco em this dentro do constructor.', (doc, win, helpers) => {
      const Product = valueOf(win, helpers, 'Produto');
      if (typeof Product !== 'function') return fail('Crie a classe Produto.');
      const first = new Product('Mouse', 100); const second = new Product('Livro', 50);
      return first.nome === 'Mouse' && first.preco === 100 && second.nome === 'Livro' && second.preco === 50 && first !== second
        ? ok : fail('Cada instância deve guardar seu próprio nome e preco.');
    }),
    requirement('product-tax', 'O imposto usa o preço atual, taxa padrão, customizada e zero.', 'Retorne this.preco multiplicado pela taxa recebida.', (doc, win, helpers) => {
      const Product = valueOf(win, helpers, 'Produto');
      if (typeof Product !== 'function') return fail('Crie Produto antes de testar o método.');
      const item = new Product('Mouse', 100);
      if (typeof item.calcularImposto !== 'function') return fail('Implemente calcularImposto(taxa = 0.1).');
      if (!close(item.calcularImposto(), 10) || !close(item.calcularImposto(0.25), 25) || !close(item.calcularImposto(0), 0)) return fail('Para preço 100, os impostos com taxa padrão, 0.25 e 0 são 10, 25 e 0.');
      item.preco = 250;
      return close(item.calcularImposto(), 25) ? ok : fail('O método deve usar o preço atual da instância, inclusive depois de uma alteração.');
    }),
  ],
  'js-17-grand-capstone-app': [
    requirement('capstone-state', 'carregarTarefas recupera dados válidos e retorna [] para ausência ou JSON inválido.', 'Trate erros de parse e valide o array e suas tarefas.', (doc, win, helpers) => {
      const load = valueOf(win, helpers, 'carregarTarefas');
      if (typeof load !== 'function') return fail('Implemente carregarTarefas() e use seu retorno para iniciar tarefas.');
      const original = win.localStorage.getItem('devpath-tarefas');
      const sample = [{ id: 'sample', texto: 'Meta salva', feita: true }];
      try {
        for (const [raw, expected] of [[JSON.stringify(sample), sample], [null, []], ['JSON quebrado', []], ['{}', []], ['[null]', []]]) {
          if (raw === null) win.localStorage.removeItem('devpath-tarefas'); else win.localStorage.setItem('devpath-tarefas', raw);
          let actual;
          try { actual = load(); } catch { return fail('carregarTarefas precisa retornar [] quando os dados não puderem ser lidos.'); }
          if (!same(actual, expected)) return fail('Recupere o array válido; para ausência, JSON inválido ou tarefas malformadas, retorne [].');
        }
        return Array.isArray(valueOf(win, helpers, 'tarefas')) ? ok : fail('Inicialize tarefas com o array retornado por carregarTarefas().');
      } finally {
        if (original === null) win.localStorage.removeItem('devpath-tarefas'); else win.localStorage.setItem('devpath-tarefas', original);
      }
    }),
    requirement('capstone-add', 'Inclusões normalizam o texto, geram ids distintos, limpam o input e atualizam as estatísticas.', 'Use trim e crie ids que não colidam em inclusões rápidas.', (doc, win, helpers) => {
      if (!clearTodos(doc)) return fail('A exclusão deve permitir limpar a lista antes de testar novas inclusões.');
      const event = addTodo(doc, win, '  Primeira meta  ');
      addTodo(doc, win, 'Segunda meta');
      const state = valueOf(win, helpers, 'tarefas');
      if (!event?.defaultPrevented) return fail('Cancele a navegação no submit com preventDefault.');
      if (!Array.isArray(state) || state.length !== 2 || state[0].texto !== 'Primeira meta' || state[1].texto !== 'Segunda meta' || state.some(t => t.feita !== false)) return fail('Adicione duas tarefas com texto normalizado e feita: false ao estado.');
      if (state.some(t => t.id === undefined || t.id === null) || new Set(state.map(t => t.id)).size !== 2) return fail('Use ids diferentes mesmo quando duas tarefas são adicionadas rapidamente.');
      return todoItems(doc).length === 2 && statsAre(doc, 2, 0) && doc.querySelector('#todo-input')?.value === ''
        ? ok : fail('Renderize as duas tarefas, mostre Total: 2 | Concluídas: 0 e limpe o input.');
    }),
    requirement('capstone-validation', 'Texto vazio é ignorado e texto com marcação é exibido literalmente.', 'Use trim antes de incluir e textContent ao renderizar.', (doc, win, helpers) => {
      if (!clearTodos(doc)) return fail('Implemente a exclusão para preparar a verificação.');
      addTodo(doc, win, '   ');
      if (todoItems(doc).length || valueOf(win, helpers, 'tarefas')?.length) return fail('Não adicione tarefas formadas somente por espaços.');
      addTodo(doc, win, '<b>Estudar DOM</b>');
      const item = todoItems(doc)[0];
      return item && item.textContent.includes('<b>Estudar DOM</b>') && !item.querySelector('b')
        ? ok : fail('O texto da tarefa deve aparecer literalmente; use textContent.');
    }),
    requirement('capstone-actions', 'Concluir e excluir sincronizam estado, lista, estatísticas e estado vazio.', 'Atualize o array antes de renderizar cada mudança.', (doc, win, helpers) => {
      if (!clearTodos(doc)) return fail('Cada tarefa precisa de um botão delete funcional.');
      addTodo(doc, win, 'Meta de verificação');
      const item = todoItems(doc)[0];
      if (!item?.querySelector('[data-action="toggle"]') || !item.querySelector('[data-action="delete"]')) return fail('Crie botões data-action="toggle" e data-action="delete" em cada item.');
      item.querySelector('[data-action="toggle"]').click();
      if (valueOf(win, helpers, 'tarefas')?.[0]?.feita !== true || !todoItems(doc)[0]?.classList.contains('feita') || !statsAre(doc, 1, 1)) return fail('Concluir precisa atualizar feita no estado, a classe feita e Concluídas: 1.');
      doc.querySelector('#todo-list [data-action="delete"]')?.click();
      const empty = doc.querySelector('#empty-state');
      const emptyVisible = empty && !empty.hidden && win.getComputedStyle(empty).display !== 'none' && win.getComputedStyle(empty).visibility !== 'hidden';
      return todoItems(doc).length === 0 && valueOf(win, helpers, 'tarefas')?.length === 0 && statsAre(doc, 0, 0) && emptyVisible
        ? ok : fail('Ao excluir, remova a tarefa do estado e da tela, zere os totais e mostre #empty-state.');
    }),
    requirement('capstone-persistence', 'O JSON salvo acompanha inclusão, conclusão e exclusão.', 'Chame salvar depois de cada alteração do array.', (doc, win) => {
      if (!clearTodos(doc)) return fail('A exclusão deve funcionar antes de verificar persistência.');
      addTodo(doc, win, 'Persistir meu aprendizado');
      let stored = getStoredTodos(win);
      if (stored?.length !== 1 || stored[0].texto !== 'Persistir meu aprendizado' || stored[0].feita !== false) return fail('Salve a tarefa nova em devpath-tarefas usando JSON.stringify.');
      doc.querySelector('#todo-list [data-action="toggle"]')?.click();
      stored = getStoredTodos(win);
      if (stored?.[0]?.feita !== true) return fail('Salve novamente depois de concluir uma tarefa.');
      doc.querySelector('#todo-list [data-action="delete"]')?.click();
      return same(getStoredTodos(win), []) ? ok : fail('A exclusão também precisa atualizar o JSON salvo para [].');
    }),
  ],
};
