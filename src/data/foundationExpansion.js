// Aulas autorais: a teoria demonstra conceitos em problemas diferentes dos desafios.
const lines = (...parts) => parts.join('\n');
const mdn = (title, path, summary) => ({ source: 'MDN Web Docs', title, url: `https://developer.mozilla.org/en-US/docs/${path}`, summary });
const modules = {
  'mod-1': '1. Fundamentos da Linguagem',
  'mod-2': '2. Funções & Resolução de Problemas',
  'mod-3': '3. Loops, Arrays & Objetos',
  'mod-4': '4. DOM, Eventos & Projetos',
  'mod-5': '5. Web APIs & Persistência (localStorage)',
  'mod-6': '6. JavaScript Assíncrono & APIs REST',
  'mod-7': '7. POO & Tópicos Avançados',
};
const baseCss = lines(
  '* { box-sizing: border-box; }',
  'body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; color: #17251f; background: #f1f5f2; }',
  'main { max-width: 720px; margin: auto; background: white; padding: 24px; border: 1px solid #d5e2d9; border-radius: 16px; }',
  'h1 { font-size: 1.6rem; }',
  'label { display: block; margin-top: 12px; }',
  'button, input { font: inherit; padding: 10px; max-width: 100%; }',
  'button { cursor: pointer; }',
  'button:focus-visible, input:focus-visible, a:focus-visible { outline: 3px solid #197343; outline-offset: 3px; }',
  'li { margin-block: 8px; }'
);
const makeFiles = (title, body, script, css = '') => ({
  'index.html': lines('<!doctype html>', '<html lang="pt-BR">', '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">', `<title>${title}</title><link rel="stylesheet" href="style.css"></head>`, `<body><main><h1>${title}</h1>${body}</main><script src="script.js"></script></body></html>`),
  'style.css': lines(baseCss, css),
  'script.js': script,
});
const value = (helpers, win, name) => helpers?.getVar?.(name) ?? win?.[name];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const close = (a, b) => typeof a === 'number' && Math.abs(a - b) < 1e-8;
const task = (id, description, hint, check) => ({
  id, description, hint,
  async check(doc, win, helpers) {
    try {
      const pass = Boolean(await check(doc, win, helpers));
      return { pass, tip: pass ? 'Comportamento verificado.' : hint };
    } catch (error) {
      return { pass: false, tip: `${hint} ${error?.message || 'Revise a execução do código.'}` };
    }
  },
});
const makeStage = ({ id, moduleId, title, minutes, brief, objectives, lesson, quiz, examples, hints, practice, assignment, script, body = '<p>Implemente o desafio e execute os testes. Use o console para investigar cada resultado.</p>', css, activeFile = 'script.js', tasks, projectBrief, links }) => ({
  id, moduleId, moduleName: modules[moduleId], title,
  category: projectBrief ? 'Projeto de módulo' : 'Formação guiada',
  estimatedMinutes: minutes,
  instruction: {
    brief, learningObjective: objectives[0], learningObjectives: objectives,
    deepLesson: lesson,
    knowledgeCheck: { question: quiz[0], options: quiz[1], correctIndex: quiz[2], explanation: quiz[3] },
    challengeExamples: examples.map(([input, output]) => ({ input, output })),
    progressiveHints: hints, practicePrompt: practice, taskDescription: assignment,
    curatedLinks: links,
  },
  playground: { files: makeFiles(title, body, script, css), activeFile, tasks },
  ...(projectBrief ? { projectBrief } : {}),
});

const numberValidation = makeStage({
  id: 'js-foundation-number-validation', moduleId: 'mod-1', title: 'Conversão, operadores e números válidos', minutes: 35,
  brief: 'Transforme uma entrada textual em um número confiável antes de comparar ou calcular.',
  objectives: ['Distinguir conversão de tipo e validação de domínio.', 'Rejeitar texto vazio, NaN e valores infinitos.', 'Usar &&, || e ! para combinar condições.'],
  lesson: lines(
    '### Um valor pode parecer número e ainda ser texto',
    'Valores de campos HTML chegam como strings. O operador + também concatena texto: "4" + 2 produz "42". Number("4") + 2 produz 6. A conversão deve acontecer em um ponto conhecido, antes do cálculo; converter repetidamente em expressões espalhadas dificulta investigar erros.',
    '', '```javascript', 'const texto = " 18 ";', 'const idade = Number(texto);', 'console.log(typeof idade, idade + 1); // number 19', 'console.log(Number("")); // 0: vazio não é automaticamente inválido', '```',
    '', '### Conversão não define a regra do produto',
    'Number.isFinite(valor) aceita somente números finitos, rejeitando NaN e Infinity. Depois dessa verificação, a regra do domínio decide se negativos ou decimais fazem sentido. && exige que duas condições sejam verdadeiras; || aceita ao menos uma; ! inverte um boolean. Para uma string obrigatória, confira trim() antes de Number, pois uma string só de espaços seria convertida em zero.',
    '', '### Como usar a função fornecida',
    'O desafio já fornece function lerNumero(texto) { }. O nome texto representa a entrada de cada chamada; escreva a regra entre as chaves e use return para entregar o resultado. lerNumero("7") executa essa regra. Não precisa dominar funções ainda: no próximo módulo, você aprenderá a construir e combinar seus próprios contratos.',
    '', '### Casos que distinguem as regras',
    'Escreva previsões para espaço vazio, um decimal, uma palavra, zero e um negativo. Neste exercício, o contrato recebe strings com sintaxe numérica aceita por Number e devolve um número ou null. A vírgula decimal brasileira não é convertida automaticamente: "2,5" é inválido aqui. Não use parseInt para esconder um sufixo incorreto, como "12px".'
  ),
  quiz: ['Qual entrada exige uma verificação de vazio antes de Number?', ['"   "', '"12.5"', '"-3"'], 0, 'Number converte uma string só de espaços em zero; trim permite distinguir ausência de entrada de um zero digitado.'],
  examples: [['lerNumero(" 12.5 ")', '12.5'], ['lerNumero("   ")', 'null'], ['lerNumero("Infinity")', 'null'], ['lerNumero("-4")', '-4']],
  hints: ['Trate a string vazia depois de trim antes da conversão.', 'Guarde Number(texto) em uma variável local.', 'Retorne o número apenas quando Number.isFinite for true; nos demais casos, retorne null.'],
  practice: 'Adapte a função em um rascunho para aceitar somente inteiros não negativos. Documente por que zero continua válido.',
  assignment: 'Complete lerNumero(texto), que recebe uma string. Retorne null para vazio/espaços, conversão NaN ou infinito; caso contrário, retorne o número convertido, inclusive zero, negativos e decimais.',
  script: 'function lerNumero(texto) {\n  // Valide o texto, converta e retorne um número ou null.\n}\n\nconsole.log(lerNumero(" 12.5 "));',
  tasks: [
    task('foundation-number-values', 'Converte números sem confundir zero e ausência.', 'Teste zero, espaços ao redor, negativo e decimal.', (doc, win, helpers) => {
      const fn = value(helpers, win, 'lerNumero');
      return typeof fn === 'function' && fn(' 12.5 ') === 12.5 && fn('0') === 0 && fn('-4') === -4;
    }),
    task('foundation-number-invalid', 'Rejeita entradas vazias, não numéricas e infinitas.', 'Verifique trim e Number.isFinite; null sinaliza entrada inválida.', (doc, win, helpers) => {
      const fn = value(helpers, win, 'lerNumero');
      return typeof fn === 'function' && ['', '  ', 'abc', '12px', 'Infinity', '-Infinity', '2,5'].every(input => fn(input) === null);
    }),
  ],
  links: [mdn('Number.isFinite', 'Web/JavaScript/Reference/Global_Objects/Number/isFinite', 'Diferença entre converter um valor e verificar se ele é um número finito.')],
});

const debugging = makeStage({
  id: 'js-foundation-debugging', moduleId: 'mod-1', title: 'Depuração: hipótese, evidência e correção', minutes: 30,
  brief: 'Encontre o erro a partir da primeira divergência entre o valor esperado e o valor real.',
  objectives: ['Reproduzir um defeito com uma entrada pequena.', 'Inspecionar valores intermediários e seus tipos.', 'Verificar fronteiras depois de corrigir uma condição.'],
  lesson: lines(
    '### Um erro é uma diferença observável',
    'Antes de editar, escreva a entrada, o resultado esperado e o resultado observado. Uma descrição como "o cálculo falhou" é menos útil que "com 8 unidades de 3, obtive 83 em vez de 24". Uma reprodução pequena elimina distrações e permite provar a correção depois.',
    '', '```javascript', 'const unidades = "8";', 'const valorUnitario = 3;', 'console.log({ unidades, tipo: typeof unidades, valorUnitario });', '// Investigue a unidade e o operador antes de alterar outros trechos.', '```',
    '', '### Três famílias de defeito',
    'Um erro de sintaxe impede interpretar o programa, como uma chave ausente. Um erro durante execução interrompe uma operação, como acessar uma variável inexistente. Um erro de lógica pode executar sem qualquer mensagem, mas entregar um resultado errado. Neste desafio, o código é sintaticamente válido: o defeito está nas regras.',
    '', '### Um passo por vez',
    'Use console.log perto do cálculo ou pause no depurador do navegador e observe parâmetros e variáveis. Faça uma hipótese: "o limite deveria incluir o próprio valor?". Mude apenas a condição relacionada, execute novamente o caso que falhava e acrescente casos dos dois lados do limite. Evite trocar vários operadores por tentativa, pois isso perde a ligação entre causa e efeito.',
    '', '### Conserto com contrato explícito',
    'A assinatura pronta recebe dois números e usa return para entregar o custo. Não altere nomes ou o preço contratado para satisfazer um único exemplo. Preserve uma pequena tabela de verificações; ela é a memória do defeito e será útil quando a regra evoluir.'
  ),
  quiz: ['Depois de corrigir um limite em 5, quais casos dão melhor evidência?', ['Somente um valor muito alto.', '4, 5 e 6.', 'Executar a mesma entrada sem observar a saída.'], 1, 'Testar abaixo, exatamente no limite e acima verifica a inclusão correta da fronteira.'],
  examples: [['calcularFrete(5, false)', '10'], ['calcularFrete(6, false)', '18'], ['calcularFrete(20, true)', '0']],
  hints: ['Escreva as três regras antes de comparar com o código.', 'O peso exatamente igual a 5 pertence à faixa de custo 10.', 'A condição de retirada encerra a função com zero antes das faixas de peso.'],
  practice: 'Registre entrada, esperado, observado e causa de um defeito que você encontrou neste desafio.',
  assignment: 'Corrija calcularFrete(peso, retirada). peso é um número positivo. Retirada true custa 0; entrega com peso até 5 inclusive custa 10; acima de 5 custa 18. Corrija os erros de lógica no código inicial.',
  script: 'function calcularFrete(peso, retirada) {\n  if (retirada === true) return 10;\n  if (peso < 5) return 10;\n  return 10 + peso;\n}\n\nconsole.log(calcularFrete(5, false));',
  tasks: [
    task('foundation-debug-boundary', 'Corrige a fronteira e mantém preço fixo na segunda faixa.', 'Compare pesos 4, 5, 6 e 12; acima de 5 custa sempre 18.', (doc, win, helpers) => {
      const fn = value(helpers, win, 'calcularFrete');
      return typeof fn === 'function' && fn(4, false) === 10 && fn(5, false) === 10 && fn(6, false) === 18 && fn(12, false) === 18;
    }),
    task('foundation-debug-priority', 'Retirada tem prioridade sobre o peso.', 'A saída da retirada deve ser zero em qualquer faixa.', (doc, win, helpers) => {
      const fn = value(helpers, win, 'calcularFrete');
      return typeof fn === 'function' && fn(2, true) === 0 && fn(20, true) === 0;
    }),
  ],
  links: [{ source: 'Chrome for Developers', title: 'Depurar JavaScript', url: 'https://developer.chrome.com/docs/devtools/javascript', summary: 'Pausar a execução, observar valores e investigar uma falha com DevTools.' }],
});

const budget = makeStage({
  id: 'js-project-budget', moduleId: 'mod-1', title: 'Projeto: simulador de orçamento mensal', minutes: 60,
  brief: 'Combine variáveis, operações, validação e decisões em um relatório de orçamento previsível.',
  objectives: ['Traduzir um enunciado em entradas, cálculos e saídas.', 'Validar antes de calcular e distinguir zero de inválido.', 'Produzir um resultado com nomes claros.'],
  lesson: lines(
    '### Comece por uma tabela de decisões',
    'O programa representa um mês com renda, moradia e outras despesas. Escreva as unidades ao lado de cada variável: todos os valores usam a mesma moeda. Verifique entradas antes de qualquer cálculo. Uma renda negativa é inválida; um saldo negativo é um resultado permitido e informa déficit.',
    '', '### Um relatório agrupa resultados',
    'Um objeto junta valores pelo nome. Você já usou variáveis isoladas; agora pode devolver várias informações em uma única saída. No exemplo abaixo, as chaves identificam quantidades de um estoque, sem depender da ordem de uma lista.',
    '', '```javascript', 'const recebidas = 23;', 'const enviadas = 8;', 'const estoque = { disponiveis: recebidas - enviadas, movimentadas: recebidas + enviadas };', 'console.log(estoque.disponiveis); // 15', '```',
    '', '### Use o andaime de função',
    'A função pronta recebe renda, moradia e outros em seus parênteses. Use esses nomes dentro das chaves. return { saldo, status } entrega um objeto ao código que chamou a função; os nomes de todas as propriedades solicitadas fazem parte do contrato. A sintaxe abreviada { saldo } equivale a { saldo: saldo }. O próximo módulo aprofunda essas ideias.',
    '', '### Implemente em incrementos',
    'Primeiro valide números finitos e não negativos. Depois calcule despesas e saldo. Só então classifique o saldo em três caminhos: positivo, zero ou negativo. Exiba valores no console durante a construção e confira zero, despesas iguais à renda e despesas maiores. O projeto usa números sem arredondamento intermediário; uma interface futura poderá formatar a apresentação.',
    '', '### Critério de conclusão',
    'Um projeto concluído tem comportamento explicável para cada entrada do contrato. Guarde três exemplos no seu registro de estudos e explique a diferença entre despesa inválida e déficit válido. Adicionar aparência antes de estabilizar as regras não resolve uma conta incorreta.'
  ),
  quiz: ['Qual cenário é um resultado válido do orçamento?', ['Renda Infinity.', 'Moradia negativa.', 'Saldo negativo após despesas maiores que a renda.'], 2, 'Déficit é um resultado do cálculo. As entradas devem ser números finitos não negativos.'],
  examples: [['resumirOrcamento(1000, 400, 250)', '{ despesas: 650, saldo: 350, status: "positivo" }'], ['resumirOrcamento(100, 70, 50)', '{ despesas: 120, saldo: -20, status: "deficit" }'], ['resumirOrcamento(-1, 0, 0)', 'null']],
  hints: ['Retorne null se algum dos três valores não for finito ou for menor que zero.', 'Some moradia e outros; depois subtraia essa soma da renda.', 'Classifique saldo > 0 como positivo, saldo === 0 como equilibrado e o restante como deficit.'],
  practice: 'Descreva como você incluiria uma meta de reserva sem confundir saldo disponível com despesa obrigatória.',
  assignment: 'Complete resumirOrcamento(renda, moradia, outros). Aceite somente números finitos não negativos; entradas inválidas retornam null. Retorne { despesas, saldo, status }: despesas = moradia + outros; saldo = renda - despesas; status é "positivo", "equilibrado" ou "deficit". Não arredonde os cálculos.',
  script: 'function resumirOrcamento(renda, moradia, outros) {\n  // 1. Valide. 2. Calcule. 3. Classifique. 4. Retorne o relatório.\n}\n\nconsole.log(resumirOrcamento(1000, 400, 250));',
  tasks: [
    task('foundation-budget-report', 'Calcula o relatório para saldo positivo, zero e déficit.', 'Confira as três propriedades e todos os caminhos de status.', (doc, win, helpers) => {
      const fn = value(helpers, win, 'resumirOrcamento');
      if (typeof fn !== 'function') return false;
      const a = fn(1000, 400, 250), b = fn(100, 70, 50), c = fn(0, 0, 0), d = fn(40.5, 10.25, 5);
      return a?.despesas === 650 && a?.saldo === 350 && a?.status === 'positivo' && b?.saldo === -20 && b?.status === 'deficit' && c?.saldo === 0 && c?.status === 'equilibrado' && close(d?.saldo, 25.25);
    }),
    task('foundation-budget-invalid', 'Rejeita valores inválidos em qualquer entrada.', 'Use Number.isFinite e valide todos os parâmetros, preservando o zero.', (doc, win, helpers) => {
      const fn = value(helpers, win, 'resumirOrcamento');
      return typeof fn === 'function' && [[-1, 0, 0], [1, -1, 0], [1, 0, -1], ['100', 0, 0], [100, Infinity, 0], [100, 0, NaN]].every(args => fn(...args) === null);
    }),
  ],
  projectBrief: {
    summary: 'Uma ferramenta de planejamento que valida entradas e transforma renda e despesas em um relatório mensal.',
    deliverables: ['Função resumirOrcamento com validação das três entradas.', 'Relatório com despesas, saldo e classificação.', 'Registro de exemplos para superávit, equilíbrio, déficit e entrada inválida.'],
    milestones: [{ title: 'Definir o contrato', description: 'Liste entradas, unidades, campos do relatório e casos inválidos.' }, { title: 'Construir o cálculo', description: 'Calcule despesas e saldo sem arredondar antes da classificação.' }, { title: 'Verificar e explicar', description: 'Execute os testes e explique por que déficit é diferente de entrada inválida.' }],
    rubric: ['Cálculos e fronteiras corretos.', 'Zero é aceito e valores não finitos são rejeitados.', 'Nomes legíveis e nenhuma entrada de exemplo fixada na regra.'],
    stretchGoals: ['Acrescente uma meta de reserva e informe a distância até ela.', 'Escreva cinco novos casos de teste antes de acrescentar novas regras.'],
  },
  links: [mdn('Number.isFinite', 'Web/JavaScript/Reference/Global_Objects/Number/isFinite', 'Referência para a validação numérica do projeto.')],
});

const scope = makeStage({
  id: 'js-foundation-function-scope', moduleId: 'mod-2', title: 'Parâmetros, escopo e funções previsíveis', minutes: 35,
  brief: 'Deixe cada chamada trabalhar com suas próprias entradas e combinar retornos sem estado escondido.',
  objectives: ['Diferenciar parâmetro, argumento e variável local.', 'Compor funções usando seus retornos.', 'Evitar que uma chamada altere o resultado da próxima.'],
  lesson: lines(
    '### A chamada cria um contexto de trabalho',
    'Um parâmetro é o nome declarado na função; o argumento é o valor enviado na chamada. Variáveis declaradas com const ou let dentro do corpo ficam naquele escopo. Isso permite reutilizar nomes em funções diferentes sem compartilhar acidentalmente resultados parciais.',
    '', '```javascript', 'function converterHoras(horas) {', '  const minutos = horas * 60;', '  return minutos;', '}', 'function duracaoTotal(aulas, horasPorAula) {', '  return converterHoras(aulas * horasPorAula);', '}', 'console.log(duracaoTotal(3, 2)); // 360', '```',
    '', '### Retornar é permitir composição',
    'Uma função que somente imprime não fornece o resultado ao próximo cálculo. Quando cada etapa retorna um valor, a próxima pode recebê-lo. Teste a função menor sozinha antes de usá-la na maior: isso limita o lugar onde investigar um defeito.',
    '', '### Estado compartilhado aparece entre chamadas',
    'Se um acumulador ficar fora da função e for incrementado em cada chamada, executar duas vezes poderá mudar o resultado. Para um cálculo de preço, isso seria surpreendente. Defina o resultado parcial dentro da chamada e use apenas os parâmetros. Uma função previsível facilita testar e reutilizar a regra.',
    '', '### Padrões de argumento',
    'O parâmetro padrão só entra quando o argumento é undefined ou foi omitido. Zero é um valor explícito e não deve ser substituído. No desafio, taxa usa fração: 0.2 significa vinte por cento. Faça chamadas alternadas com taxas e quantidades diferentes para descobrir dependências escondidas.'
  ),
  quiz: ['Qual variável de um cálculo deve normalmente ser criada dentro da função?', ['Um total parcial que deve começar do zero em cada chamada.', 'Um resultado que deve ser compartilhado por todas as chamadas.', 'O nome de uma função só pode ser global.'], 0, 'Um total local nasce para aquela chamada e impede que resultados anteriores contaminem o cálculo.'],
  examples: [['subtotalCompra(15, 3)', '45'], ['totalCompra(15, 3, 0.2)', '54'], ['totalCompra(15, 3)', '45']],
  hints: ['A função subtotalCompra recebe preço e quantidade e devolve a multiplicação.', 'totalCompra deve usar o subtotal retornado e aplicar o acréscimo proporcional.', 'Defina taxa = 0 no parâmetro e evite acumuladores externos.'],
  practice: 'Crie uma função de conversão de distância e use seu retorno em uma segunda função que estima tempo de viagem.',
  assignment: 'Implemente subtotalCompra(preco, quantidade) e totalCompra(preco, quantidade, taxa = 0). totalCompra usa subtotalCompra e aplica taxa como acréscimo fracionário. Receba números não negativos, retorne números sem arredondamento e preserve resultados entre chamadas independentes.',
  script: 'function subtotalCompra(preco, quantidade) {\n  // Retorne o subtotal.\n}\n\nfunction totalCompra(preco, quantidade, taxa = 0) {\n  // Combine o retorno da primeira função com a taxa.\n}',
  tasks: [
    task('foundation-scope-subtotal', 'Calcula subtotais reutilizáveis.', 'Retorne a multiplicação, inclusive quando a quantidade for zero.', (doc, win, helpers) => {
      const fn = value(helpers, win, 'subtotalCompra');
      return typeof fn === 'function' && fn(15, 3) === 45 && fn(8, 0) === 0 && close(fn(2.5, 3), 7.5);
    }),
    task('foundation-scope-independent', 'Aplica a taxa padrão sem misturar chamadas.', 'Faça chamadas alternadas, confira taxa zero e evite estado externo.', (doc, win, helpers) => {
      const fn = value(helpers, win, 'totalCompra');
      return typeof fn === 'function' && close(fn(15, 3, 0.2), 54) && fn(10, 2) === 20 && close(fn(15, 3, 0.2), 54) && fn(20, 2, 0) === 40;
    }),
  ],
  links: [mdn('Guia de funções', 'Web/JavaScript/Guide/Functions', 'Parâmetros, retorno, escopo e composição de funções.')],
});

const loops = makeStage({
  id: 'js-foundation-loops', moduleId: 'mod-3', title: 'Loops: contar, acumular e encerrar', minutes: 35,
  brief: 'Descreva uma repetição por início, condição de continuação e avanço antes de trabalhar com listas.',
  objectives: ['Definir início, condição e atualização de um loop.', 'Acumular valores sem retornar antes do fim.', 'Reconhecer o caso vazio e evitar uma iteração extra.'],
  lesson: lines(
    '### Repetição tem três decisões',
    'Um for reúne início, condição e atualização. A condição é verificada antes do corpo, então um loop pode executar zero vezes. Escreva primeiro quais valores devem ser visitados. Isso ajuda a decidir entre < e <=, sem escolher um operador por hábito.',
    '', '```javascript', 'let letras = "";', 'for (let passo = 0; passo < 3; passo += 1) {', '  letras += "A";', '}', 'console.log(letras); // AAA', '```',
    '', '### Acompanhe o acumulador',
    'Um acumulador guarda o trabalho parcial: soma começa em zero, produto costuma começar em um, texto vazio começa em "". Antes de executar, monte uma tabela com contador e acumulador após cada volta. No exemplo, passo visita 0, 1 e 2; quando chega a 3, a condição falha.',
    '', '### Não encerre cedo demais',
    'return termina a função inteira. Para agregar todos os valores, devolva o acumulador depois do loop. break encerra somente o loop; continue pula o restante da volta atual. Use cada um quando o fluxo pedir, sem esconder uma condição de parada mal definida.',
    '', '### Enquanto e para cada',
    'while repete enquanto uma condição for verdadeira; é útil quando a quantidade de voltas não está definida previamente. Garanta que algo avance em direção ao término. Depois, for...of permitirá percorrer valores de arrays diretamente. Aqui o desafio trabalha com uma sequência numérica, que pode ser construída sem criar um array intermediário.'
  ),
  quiz: ['Quantas voltas faz for (let i = 1; i <= 3; i += 1)?', ['2', '3', '4'], 1, 'O corpo recebe i igual a 1, 2 e 3; em 4 a condição passa a ser falsa.'],
  examples: [['somarPares(6)', '12'], ['somarPares(7)', '12'], ['somarPares(0)', '0']],
  hints: ['Comece com soma igual a zero.', 'Percorra de 1 até limite inclusive e use numero % 2 === 0 para selecionar pares.', 'Atualize a soma dentro do loop e retorne somente depois de terminar.'],
  practice: 'Escreva uma segunda versão com while e compare a condição de parada para limite 0, 1 e 2.',
  assignment: 'Implemente somarPares(limite), para inteiro não negativo. Retorne a soma dos números pares entre 1 e limite, inclusive. Para zero ou um, retorne zero. Pratique um loop for ou while.',
  script: 'function somarPares(limite) {\n  // Acumule os pares do intervalo e retorne após o loop.\n}',
  tasks: [
    task('foundation-loops-boundaries', 'Trata intervalo vazio, primeiro par e limite ímpar.', 'Confira limite 0, 1, 2, 6 e 7 antes de testar números maiores.', (doc, win, helpers) => {
      const fn = value(helpers, win, 'somarPares');
      return typeof fn === 'function' && fn(0) === 0 && fn(1) === 0 && fn(2) === 2 && fn(6) === 12 && fn(7) === 12;
    }),
    task('foundation-loops-reset', 'Acumula todo o intervalo e reinicia a cada chamada.', 'Retorne depois do loop e mantenha a soma dentro da função.', (doc, win, helpers) => {
      const fn = value(helpers, win, 'somarPares');
      return typeof fn === 'function' && fn(20) === 110 && fn(4) === 6 && fn(20) === 110;
    }),
  ],
  links: [mdn('Loops e iteração', 'Web/JavaScript/Guide/Loops_and_iteration', 'Formas de repetição, break, continue e condições de término.')],
});

const cart = makeStage({
  id: 'js-project-cart', moduleId: 'mod-3', title: 'Projeto: motor de carrinho de compras', minutes: 75,
  brief: 'Modele itens como objetos e produza um resumo de compra preservando os dados originais.',
  objectives: ['Agregar uma lista de objetos em um relatório.', 'Validar propriedades antes de utilizá-las.', 'Preservar entradas e definir o comportamento da lista vazia.'],
  lesson: lines(
    '### Um item tem mais de uma dimensão',
    'Preço unitário e quantidade não são a mesma coisa. Antes de somar, identifique qual campo representa unidades e qual representa moeda. O carrinho será um array de objetos; cada objeto descreve um item e cada chamada deve produzir um relatório novo.',
    '', '```javascript', 'const sessoes = [{ minutos: 25, repeticoes: 2 }, { minutos: 10, repeticoes: 3 }];', 'const duracao = sessoes.reduce((total, sessao) => total + sessao.minutos * sessao.repeticoes, 0);', 'console.log(duracao); // 80', '```',
    '', '### Valide o conjunto antes do relatório',
    'Neste projeto, um item malformado torna o pedido inteiro inválido. Essa regra evita que um item desapareça silenciosamente do cálculo. Array.isArray distingue uma lista; Number.isFinite verifica o preço; Number.isInteger permite exigir quantidades inteiras. null e propriedades ausentes também precisam ser tratados antes de acessar seus valores.',
    '', '### Duas agregações, dois significados',
    'Quantidade total soma unidades, enquanto subtotal soma preço vezes quantidade. Desconto é um percentual aplicado ao subtotal; total é o resultado após o desconto. Dê um nome a cada grandeza e deixe o arredondamento fora do motor neste exercício.',
    '', '### Não transforme o carrinho de quem chamou',
    'O relatório não precisa alterar objetos recebidos. Se você modificar preco ou quantidade para calcular, outra parte do aplicativo pode observar um estado inesperado. Faça cálculos em variáveis locais. Teste uma lista vazia, um item de preço zero, desconto de cem por cento e duas chamadas com o mesmo array.',
    '', '### Entrega demonstrável',
    'Apresente uma compra de dois itens, explique os quatro campos do relatório e demonstre uma entrada inválida. Use os testes como evidência do contrato; novos recursos como frete devem ganhar uma regra explícita antes de entrar no cálculo.'
  ),
  quiz: ['Dois itens com quantidades 2 e 3 representam quantas unidades no resumo?', ['2', '5', 'O número de propriedades dos objetos.'], 1, 'Quantidade total soma as unidades, não apenas o número de linhas do carrinho.'],
  examples: [['resumirCarrinho([{ preco: 20, quantidade: 2 }, { preco: 10, quantidade: 1 }], 10)', '{ quantidade: 3, subtotal: 50, desconto: 5, total: 45 }'], ['resumirCarrinho([], 0)', '{ quantidade: 0, subtotal: 0, desconto: 0, total: 0 }'], ['resumirCarrinho([{ preco: -2, quantidade: 1 }])', 'null']],
  hints: ['Valide array, percentual de 0 a 100 e cada item antes de calcular.', 'Acumule quantidade e preco * quantidade com um loop ou reduce.', 'Calcule desconto = subtotal * percentual / 100 e monte um objeto novo sem mudar os itens.'],
  practice: 'Descreva três testes necessários para introduzir frete grátis a partir de um subtotal mínimo.',
  assignment: 'Implemente resumirCarrinho(itens, percentual = 0). itens deve ser array; cada item precisa de preco finito >= 0 e quantidade inteira > 0. percentual deve ser número finito entre 0 e 100. Qualquer entrada inválida retorna null. Retorne { quantidade, subtotal, desconto, total }, sem arredondar e sem alterar itens. Lista vazia retorna todos os campos zero.',
  script: 'function resumirCarrinho(itens, percentual = 0) {\n  // Valide o contrato, agregue os itens e retorne um relatório independente.\n}',
  tasks: [
    task('foundation-cart-totals', 'Agrega unidades, subtotal e desconto corretamente.', 'Não confunda quantidade de linhas com unidades nem percentual com fração.', (doc, win, helpers) => {
      const fn = value(helpers, win, 'resumirCarrinho');
      if (typeof fn !== 'function') return false;
      const a = fn([{ preco: 20, quantidade: 2 }, { preco: 10, quantidade: 1 }], 10);
      const b = fn([{ preco: 2.5, quantidade: 3 }], 100);
      return a?.quantidade === 3 && a?.subtotal === 50 && a?.desconto === 5 && a?.total === 45 && b?.total === 0 && b?.desconto === 7.5;
    }),
    task('foundation-cart-empty-immutable', 'Preserva a lista e representa um carrinho vazio.', 'Não altere preços ou quantidades; cada resumo deve ser um novo objeto.', (doc, win, helpers) => {
      const fn = value(helpers, win, 'resumirCarrinho');
      if (typeof fn !== 'function') return false;
      const input = [{ preco: 10, quantidade: 2 }], original = JSON.stringify(input);
      const a = fn(input), b = fn(input), empty = fn([]);
      return a !== b && a?.total === 20 && JSON.stringify(input) === original && empty?.quantidade === 0 && empty?.subtotal === 0 && empty?.desconto === 0 && empty?.total === 0;
    }),
    task('foundation-cart-invalid', 'Rejeita itens e descontos inválidos.', 'Verifique tipos, finitude, inteiros positivos e os limites do desconto.', (doc, win, helpers) => {
      const fn = value(helpers, win, 'resumirCarrinho');
      return typeof fn === 'function' && [null, {}, [null], [{ preco: -1, quantidade: 1 }], [{ preco: 2, quantidade: 0 }], [{ preco: 2, quantidade: 1.5 }], [{ preco: '2', quantidade: 1 }]].every(input => fn(input) === null) && [-1, 101, Infinity, '10'].every(discount => fn([], discount) === null);
    }),
  ],
  projectBrief: {
    summary: 'O núcleo de um carrinho que calcula relatórios a partir de produtos, quantidades e desconto.',
    deliverables: ['Validação completa de itens e percentual.', 'Resumo com unidades, subtotal, desconto e total.', 'Dados originais preservados e demonstração da lista vazia.'],
    milestones: [{ title: 'Modelar uma compra', description: 'Defina campos, unidades e exemplos válidos e inválidos.' }, { title: 'Construir a agregação', description: 'Calcule o resumo com loop ou reduce e aplique o desconto ao subtotal.' }, { title: 'Revisar o contrato', description: 'Teste vazios, fronteiras, dados incorretos e duas chamadas sem mutação.' }],
    rubric: ['Totais corretos e calculados a partir das entradas.', 'Um item inválido não é descartado silenciosamente.', 'Lista vazia e desconto de 100% têm resultado definido.', 'O motor preserva arrays e objetos recebidos.'],
    stretchGoals: ['Acrescente um cupom com data de validade usando uma regra separada.', 'Monte uma tabela de casos para uma futura interface de checkout.'],
  },
  links: [mdn('Array.reduce', 'Web/JavaScript/Reference/Global_Objects/Array/reduce', 'Agregação com acumulador e valor inicial definido.')],
});

const semanticHtml = makeStage({
  id: 'js-foundation-semantic-html', moduleId: 'mod-4', title: 'HTML semântico e formulários acessíveis', minutes: 40,
  brief: 'Construa uma estrutura com significado antes de conectar JavaScript à página.',
  objectives: ['Escolher elementos pelo papel do conteúdo.', 'Associar label e input com identificadores.', 'Usar botões e formulários que funcionam pelo teclado.'],
  lesson: lines(
    '### HTML descreve a estrutura',
    'O navegador interpreta HTML como uma árvore. Elementos não são apenas caixas visuais: main identifica o conteúdo principal, nav agrupa navegação, h1 introduz o assunto e section organiza um grupo temático. Uma hierarquia compreensível ajuda quem navega visualmente e quem usa tecnologias assistivas.',
    '', '```html', '<section aria-labelledby="contato-titulo">', '  <h2 id="contato-titulo">Contato</h2>', '  <label for="email-contato">Seu e-mail</label>', '  <input id="email-contato" name="email" type="email">', '</section>', '```',
    '', '### Nome visível e associação programática',
    'O atributo for do label corresponde ao id do controle. Clicar no rótulo também direciona o foco para o campo. Um placeholder pode dar um exemplo, mas desaparece quando a pessoa digita e não substitui o rótulo. IDs precisam ser únicos na página.',
    '', '### Elementos nativos já têm comportamento',
    'Use button para uma ação. Dentro de um form, type="submit" comunica a intenção de enviar. Links representam navegação e precisam de href real. Construir uma ação com div exige recriar teclado, foco e semântica que o botão já oferece. No próximo conteúdo, CSS cuidará da aparência; depois, os eventos conectarão o comportamento.',
    '', '### Verifique sem depender da aparência',
    'Leia a página como um documento: título, navegação, conteúdo e formulário. Use Tab para percorrer os controles e confira se cada campo tem um nome compreensível. Este desafio ainda não precisa enviar dados: a primeira entrega é a estrutura que servirá de base às aulas do DOM.'
  ),
  quiz: ['Qual é a associação correta entre um rótulo e um campo?', ['label for="apelido" e input id="apelido".', 'Um placeholder sem label.', 'Uma div com texto ao lado, sem associação.'], 0, 'for aponta para o id do controle, associando o nome visível ao campo.'],
  examples: [['Clicar em label[for="nome-aluno"]', 'O campo #nome-aluno recebe foco.'], ['Abrir a página e ler a estrutura', 'Um main, um h1, uma navegação e o formulário de inscrição.']],
  hints: ['Mantenha o main e o h1 existentes; adicione nav com um link para #inscricao.', 'Crie form id="inscricao", label for="nome-aluno" e input id="nome-aluno" name="nome".', 'O input deve ser type="text" e required; termine com button type="submit" de texto visível.'],
  practice: 'Percorra o formulário somente com Tab e explique por que o label continua útil depois de digitar.',
  assignment: 'Edite index.html. Preserve um único main e um h1 não vazio. Adicione nav com link de texto visível para #inscricao. Crie form#inscricao contendo label[for="nome-aluno"] de texto visível, input#nome-aluno com name="nome", type="text" e required, e um button type="submit" com texto. A lógica de envio virá nas aulas de eventos.',
  body: '<!-- Crie a navegação e o formulário semântico aqui. -->',
  script: '// A estrutura desta aula é construída no HTML. Eventos serão adicionados depois.',
  activeFile: 'index.html',
  tasks: [
    task('foundation-html-landmarks', 'Organiza conteúdo principal e navegação.', 'Use um único main, um h1 e nav com link para #inscricao, todos com texto visível.', doc => {
      const link = doc.querySelector('nav a[href="#inscricao"]');
      return doc.querySelectorAll('main').length === 1 && doc.querySelectorAll('h1').length === 1 && Boolean(doc.querySelector('main h1')?.textContent.trim()) && Boolean(link?.textContent.trim()) && Boolean(doc.querySelector('form#inscricao'));
    }),
    task('foundation-html-form', 'Relaciona rótulo, campo obrigatório e botão de envio.', 'Confira for/id, name, type, required e o texto do botão.', doc => {
      const form = doc.querySelector('form#inscricao'), input = form?.querySelector('input#nome-aluno'), label = form?.querySelector('label[for="nome-aluno"]'), button = form?.querySelector('button[type="submit"]');
      return input?.type === 'text' && input?.name === 'nome' && input?.required && Boolean(label?.textContent.trim()) && Boolean(button?.textContent.trim()) && doc.querySelectorAll('#nome-aluno').length === 1;
    }),
  ],
  links: [mdn('Estrutura de documentos', 'Learn_web_development/Core/Structuring_content/Structuring_documents', 'Elementos semânticos e organização do conteúdo de uma página.')],
});

const cssLayout = makeStage({
  id: 'js-foundation-css-layout', moduleId: 'mod-4', title: 'CSS: caixa, seletores e layout flexível', minutes: 40,
  brief: 'Separe conteúdo de apresentação e crie uma fileira de cartões que se adapta ao espaço disponível.',
  objectives: ['Identificar conteúdo, padding, borda e margem.', 'Aplicar seletores de classe sem misturar estilo e dados.', 'Usar Flexbox com quebra de linha e espaçamento.'],
  lesson: lines(
    '### Cada elemento ocupa uma caixa',
    'A caixa reúne conteúdo, padding, borda e margem. Com box-sizing: border-box, a largura declarada inclui padding e borda. Essa regra facilita prever dimensões, especialmente em telas pequenas. margin cria espaço externo; padding cria espaço entre o conteúdo e a borda.',
    '', '```css', '.barra-acoes {', '  display: flex;', '  align-items: center;', '  gap: 12px;', '}', '.barra-acoes button { padding: 8px 16px; }', '```',
    '', '### O contêiner organiza, os filhos participam',
    'display: flex cria um contexto de layout. gap separa os itens sem precisar dar margens diferentes ao primeiro e ao último. flex-wrap: wrap permite linhas adicionais quando os filhos não cabem. No desafio, flex-basis define uma largura inicial desejada, mas os cartões ainda podem crescer ou encolher.',
    '', '### A cascata resolve regras concorrentes',
    'O navegador combina regras por origem, importância, especificidade e ordem. Para este exercício, acrescente seletores de classe claros no fim de style.css. Evite !important: entenda qual regra está sendo aplicada usando o painel de estilos computados. Uma classe descreve o papel visual; o id continua útil para identificar um elemento único.',
    '', '### Experimente o espaço real',
    'Reduza a largura do preview. Três cartões não precisam permanecer numa única linha em uma tela estreita. Texto e botões devem continuar legíveis sem rolagem horizontal. A solução pede Flexbox para você praticar a distribuição; layouts posteriores poderão usar Grid quando linhas e colunas exigirem controle conjunto.'
  ),
  quiz: ['Qual regra permite que itens Flexbox ocupem uma nova linha?', ['overflow: hidden', 'flex-wrap: wrap', 'position: absolute'], 1, 'flex-wrap permite a quebra em linhas quando os itens não cabem no espaço disponível.'],
  examples: [['Largura disponível suficiente', 'Os três cartões compartilham a linha com gap de 16px.'], ['Preview mais estreito', 'Os cartões quebram linha e mantêm padding de 16px.']],
  hints: ['Em .trilha-cards, defina display: flex, flex-wrap: wrap e gap: 16px.', 'Em .trilha-card, use flex: 1 1 180px para permitir adaptação.', 'Adicione padding: 16px aos cartões e confira estilos computados.'],
  practice: 'Troque temporariamente gap por margin e observe como o espaçamento externo do contêiner muda.',
  assignment: 'Edite style.css. .trilha-cards precisa usar display:flex, flex-wrap:wrap e gap:16px. Cada .trilha-card deve ter padding:16px e flex:1 1 180px (ou as três propriedades longas equivalentes). Preserve o conteúdo dos três cartões e o box-sizing:border-box já fornecido.',
  body: '<section class="trilha-cards" aria-label="Plano de estudo"><article class="trilha-card"><h2>Explorar</h2><p>Leia o conceito e preveja o exemplo.</p></article><article class="trilha-card"><h2>Construir</h2><p>Transforme as regras em código.</p></article><article class="trilha-card"><h2>Revisar</h2><p>Explique o resultado e os limites.</p></article></section>',
  script: '// Nesta aula, resolva o layout no arquivo style.css.',
  css: '.trilha-cards { /* Defina o layout do contêiner. */ }\n.trilha-card { background: #e9f2ec; /* Defina flex e padding. */ }',
  activeFile: 'style.css',
  tasks: [
    task('foundation-css-container', 'Cria um contêiner flexível com quebra e espaçamento.', 'Confira display flex, flex-wrap wrap e gaps horizontal/vertical de 16px.', (doc, win) => {
      const el = doc.querySelector('.trilha-cards');
      if (!el) return false;
      const style = win.getComputedStyle(el);
      return style.display === 'flex' && style.flexWrap === 'wrap' && style.rowGap === '16px' && style.columnGap === '16px';
    }),
    task('foundation-css-cards', 'Mantém cartões legíveis e dimensões flexíveis.', 'Aplique padding 16px e flex 1 1 180px nos três cartões.', (doc, win) => {
      const cards = [...doc.querySelectorAll('.trilha-card')];
      return cards.length === 3 && cards.every(el => {
        const style = win.getComputedStyle(el);
        return style.paddingTop === '16px' && style.paddingRight === '16px' && style.paddingBottom === '16px' && style.paddingLeft === '16px' && style.flexGrow === '1' && style.flexShrink === '1' && style.flexBasis === '180px' && style.boxSizing === 'border-box' && Boolean(el.querySelector('h2')?.textContent.trim());
      });
    }),
  ],
  links: [mdn('Flexbox', 'Learn_web_development/Core/CSS_layout/Flexbox', 'Organização dos itens, quebra de linha e propriedades do contêiner e dos filhos.')],
});

const safeStorage = makeStage({
  id: 'js-foundation-safe-storage', moduleId: 'mod-5', title: 'Persistência defensiva e recuperação de dados', minutes: 40,
  brief: 'Trate ausência, JSON inválido e dados de formato inesperado como estados previstos da aplicação.',
  objectives: ['Separar JSON válido de dados válidos para o aplicativo.', 'Tratar falhas de leitura e escrita sem travar o fluxo.', 'Receber o armazenamento como dependência testável.'],
  lesson: lines(
    '### Persistir atravessa uma fronteira',
    'Dados em memória têm o formato criado pelo seu código. Dados recuperados podem vir de outra versão, de uma edição manual ou de uma escrita incompleta. JSON.parse confirma apenas se o texto obedece à sintaxe JSON: "42" é JSON válido, mas não representa necessariamente as preferências esperadas pelo aplicativo.',
    '', '```javascript', 'function lerIdioma(storage) {', '  try {', '    const valor = JSON.parse(storage.getItem("idioma"));', '    return typeof valor === "string" ? valor : "pt-BR";', '  } catch {', '    return "pt-BR";', '  }', '}', '```',
    '', '### Recupere com uma regra clara',
    'getItem retorna null quando a chave não existe. JSON.parse pode lançar erro com texto corrompido; o próprio acesso ao armazenamento também pode falhar. Use try/catch ao redor da fronteira e um valor padrão previsível. Neste exercício, a leitura não deve apagar ou sobrescrever dados antigos: quem decide salvar é outra operação.',
    '', '### Um objeto fornecido pode substituir o navegador',
    'Receber storage por parâmetro permite usar localStorage no app e um objeto com getItem/setItem nos testes. A regra de transformação permanece igual. Isso é injeção de dependência em uma forma simples: a função recebe a ferramenta de que precisa, tornando falhas reproduzíveis sem alterar dados reais.',
    '', '### Escrita pode falhar também',
    'Converter o objeto com JSON.stringify não garante que setItem funcione. A função de salvar deve indicar sucesso ou falha, para a interface poder informar a pessoa. Não esconda uma falha retornando sucesso. Evite armazenar senhas ou segredos nessa estrutura de preferências.'
  ),
  quiz: ['JSON.parse("42") é suficiente para validar um objeto de preferências?', ['Sim, todo JSON representa o formato esperado.', 'Não, ainda é necessário conferir tipo e propriedades.', 'Sim, pois JSON.parse cria as propriedades ausentes.'], 1, 'A sintaxe JSON pode estar correta e o valor ainda ter o formato errado para a aplicação.'],
  examples: [['lerPreferencias(storage) com {"tema":"escuro","metaMinutos":45}', '{ tema: "escuro", metaMinutos: 45 }'], ['Chave ausente, texto quebrado ou meta negativa', '{ tema: "claro", metaMinutos: 25 }'], ['salvarPreferencias(storage, { tema: "claro", metaMinutos: 30 }) com escrita bloqueada', 'false']],
  hints: ['Leia a chave devpath-preferencias dentro de try/catch.', 'Aceite apenas tema claro/escuro e metaMinutos inteiro de 5 a 180; devolva o padrão completo se algo falhar.', 'Na escrita, valide o mesmo contrato, serialize e retorne true somente após setItem completar.'],
  practice: 'Desenhe um plano de migração caso a próxima versão renomeie metaMinutos para duracaoSessao.',
  assignment: 'Implemente lerPreferencias(storage) e salvarPreferencias(storage, preferencias) usando a chave "devpath-preferencias". O contrato é { tema: "claro" ou "escuro", metaMinutos: inteiro de 5 a 180 }. Leitura ausente, inválida ou com erro retorna um novo { tema: "claro", metaMinutos: 25 }, sem escrever. Salvar dados inválidos ou falhar retorna false; escrita bem-sucedida retorna true. Salve somente os dois campos do contrato.',
  script: 'function lerPreferencias(storage) {\n  // Leia, interprete e valide, recuperando com o padrão quando necessário.\n}\n\nfunction salvarPreferencias(storage, preferencias) {\n  // Valide, serialize e informe se a escrita terminou.\n}',
  tasks: [
    task('foundation-storage-read', 'Distingue dado válido de ausência, corrupção e formato errado.', 'Use o padrão completo em qualquer falha e não faça escrita durante a leitura.', (doc, win, helpers) => {
      const fn = value(helpers, win, 'lerPreferencias');
      if (typeof fn !== 'function') return false;
      let writes = 0;
      const read = raw => fn({ getItem: key => key === 'devpath-preferencias' ? raw : null, setItem: () => { writes += 1; } });
      const valid = read('{"tema":"escuro","metaMinutos":45}');
      const fallback = { tema: 'claro', metaMinutos: 25 };
      const allFallback = [null, '{', 'null', '[]', '42', '{"tema":"azul","metaMinutos":25}', '{"tema":"claro","metaMinutos":0}'].every(raw => same(read(raw), fallback));
      return valid?.tema === 'escuro' && valid?.metaMinutos === 45 && allFallback && same(fn({ getItem() { throw new Error('Leitura bloqueada'); } }), fallback) && writes === 0;
    }),
    task('foundation-storage-write', 'Salva somente dados válidos e comunica falhas de escrita.', 'Retorne false sem gravar dados inválidos; capture exceções de setItem.', (doc, win, helpers) => {
      const fn = value(helpers, win, 'salvarPreferencias');
      if (typeof fn !== 'function') return false;
      const saved = {};
      const storage = { setItem(key, raw) { saved[key] = raw; } };
      const success = fn(storage, { tema: 'escuro', metaMinutos: 60, extra: 'ignorar' });
      const before = JSON.stringify(saved);
      const rejected = fn(storage, { tema: 'claro', metaMinutos: 4 });
      return success === true && same(JSON.parse(saved['devpath-preferencias']), { tema: 'escuro', metaMinutos: 60 }) && rejected === false && JSON.stringify(saved) === before && fn({ setItem() { throw new Error('Sem espaço'); } }, { tema: 'claro', metaMinutos: 25 }) === false;
    }),
  ],
  links: [mdn('Interface Storage', 'Web/API/Storage', 'Leitura e escrita de valores no armazenamento do navegador.')],
});

const studyJournal = makeStage({
  id: 'js-project-study-journal', moduleId: 'mod-5', title: 'Projeto: diário de estudo persistente', minutes: 100,
  brief: 'Construa um formulário que transforma sessões de estudo em uma lista persistente com resumo de minutos.',
  objectives: ['Sincronizar formulário, estado, renderização e armazenamento.', 'Restaurar dados sem depender de uma página previamente aberta.', 'Validar entradas e renderizar texto de forma segura.'],
  lesson: lines(
    '### Defina o estado antes de desenhar a lista',
    'Cada sessão usa { tema, minutos }. O array é a fonte de verdade; a lista HTML mostra o estado atual e o armazenamento conserva uma versão serializada. Se você guardar informações apenas no texto de cada li, recuperar os dados para somar ou salvar ficará mais difícil.',
    '', '```javascript', 'const leituras = [{ paginas: 12 }, { paginas: 8 }];', 'const totalPaginas = leituras.reduce((total, leitura) => total + leitura.paginas, 0);', 'const item = document.createElement("li");', 'item.textContent = `Hoje: ${totalPaginas} páginas`;', '```',
    '', '### Organize um fluxo por ação',
    'No submit: impeça o envio padrão, leia os campos, valide, acrescente ao array, salve e renderize. Use trim no tema e Number nos minutos, rejeitando vazio e valores fora de 1 a 240. Só limpe os campos depois de aceitar a sessão. Eventos devem ser registrados uma vez, fora da função que recria a lista.',
    '', '### Renderize a fotografia atual',
    'Limpe #sessoes, crie um li para cada sessão e use textContent para tema e minutos. Atualize #total-minutos a partir de uma soma do array inteiro. Repetir a renderização não pode duplicar elementos. Uma string como <b>DOM</b> deve aparecer literalmente como tema, sem criar uma tag.',
    '', '### Restaure na inicialização',
    'carregarSessoes precisa ler e validar o array, atualizar o estado e renderizar. Chame-a quando o script iniciar. Se o JSON ou qualquer registro for inválido, comece com uma lista vazia. A chave deste projeto é específica, evitando colidir com preferências ou outros exercícios.',
    '', '### Demonstre continuidade',
    'Cadastre duas sessões, recarregue o preview e observe a soma e a ordem. Depois simule conteúdo quebrado no armazenamento e confira a recuperação. A função de leitura também é chamada pelos testes para representar uma nova inicialização sem depender de rede ou dados externos.'
  ),
  quiz: ['Onde deve ficar a regra que calcula o total de minutos?', ['No array de sessões, somando os dados durante a renderização.', 'Contando os caracteres do HTML.', 'Em uma constante fixada após o primeiro envio.'], 0, 'A soma deriva do estado; o HTML apresenta esse resultado e pode ser recriado.'],
  examples: [['Enviar "Arrays" com 25 e "DOM" com 40', 'Dois li em #sessoes e #total-minutos mostra 65.'], ['Enviar tema somente com espaços', 'Estado e armazenamento não ganham uma sessão.'], ['Executar carregarSessoes() com dados salvos', 'Lista e total são restaurados na ordem armazenada.']],
  hints: ['Guarde sessoes em um array; defina carregarSessoes e renderizarSessoes.', 'No submit válido, acrescente { tema: texto.trim(), minutos: Number(valor) } e salve com JSON.stringify.', 'Na leitura, valide o array inteiro; na renderização, limpe os li e use textContent antes de somar os minutos.'],
  practice: 'Planeje a exclusão de uma sessão: qual identificador permanece estável depois de remover um item do meio?',
  assignment: 'Implemente o diário no HTML fornecido. form#sessao-form recebe #tema e #minutos; valide tema não vazio após trim e minutos inteiros entre 1 e 240. Armazene { tema, minutos } na chave "devpath-sessoes". Renderize um li por sessão em #sessoes, contendo tema e minutos, e apenas a soma numérica em #total-minutos. Crie carregarSessoes(), que lê, valida, substitui o estado e renderiza; chame-a ao iniciar. Chave ausente ou array com qualquer registro inválido resulta em lista vazia. Preserve strings como texto literal. Em submit válido, salve e limpe os campos; entrada inválida não modifica estado ou armazenamento.',
  body: '<form id="sessao-form"><label for="tema">Tema estudado</label><input id="tema" name="tema" required><label for="minutos">Minutos de estudo</label><input id="minutos" name="minutos" type="number" min="1" max="240" required><button type="submit">Registrar sessão</button></form><p>Total: <strong id="total-minutos">0</strong> minutos</p><ul id="sessoes"></ul>',
  script: 'let sessoes = [];\n\nfunction renderizarSessoes() {\n  // Atualize lista e total a partir do estado.\n}\n\nfunction carregarSessoes() {\n  // Leia, valide, atualize sessoes e renderize.\n}\n\n// Registre o submit do formulário e inicialize a aplicação.\n',
  tasks: [
    task('foundation-journal-submit', 'Cadastra, salva e renderiza duas sessões com soma correta.', 'Trate submit, use os campos atuais, salve o array e atualize lista e total.', (doc, win, helpers) => {
      const load = value(helpers, win, 'carregarSessoes');
      if (typeof load !== 'function') return false;
      win.localStorage.removeItem('devpath-sessoes'); load();
      const submit = (tema, minutos) => {
        doc.querySelector('#tema').value = tema; doc.querySelector('#minutos').value = minutos;
        return doc.querySelector('#sessao-form').dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
      };
      const prevented = submit('  Arrays  ', '25') === false;
      submit('<b>DOM</b>', '40');
      const saved = JSON.parse(win.localStorage.getItem('devpath-sessoes'));
      const items = [...doc.querySelectorAll('#sessoes li')];
      return prevented && same(saved, [{ tema: 'Arrays', minutos: 25 }, { tema: '<b>DOM</b>', minutos: 40 }]) && items.length === 2 && items[0].textContent.includes('Arrays') && items[0].textContent.includes('25') && items[1].textContent.includes('<b>DOM</b>') && !items[1].querySelector('b') && doc.querySelector('#total-minutos')?.textContent.trim() === '65' && doc.querySelector('#tema').value === '' && doc.querySelector('#minutos').value === '';
    }),
    task('foundation-journal-validation', 'Rejeita vazios e durações fora do contrato sem alterar dados.', 'Valide trim, inteiros e limites antes de modificar o array.', (doc, win, helpers) => {
      const load = value(helpers, win, 'carregarSessoes');
      if (typeof load !== 'function') return false;
      win.localStorage.setItem('devpath-sessoes', '[{"tema":"Teste","minutos":15}]'); load();
      const before = win.localStorage.getItem('devpath-sessoes');
      for (const [theme, duration] of [[' ', '25'], ['HTML', '0'], ['CSS', '241'], ['JS', '1.5']]) {
        doc.querySelector('#tema').value = theme; doc.querySelector('#minutos').value = duration;
        doc.querySelector('#sessao-form').dispatchEvent(new win.Event('submit', { cancelable: true, bubbles: true }));
      }
      return win.localStorage.getItem('devpath-sessoes') === before && doc.querySelectorAll('#sessoes li').length === 1 && doc.querySelector('#total-minutos').textContent.trim() === '15';
    }),
    task('foundation-journal-restore', 'Restaura registros e recupera dados corrompidos sem duplicação.', 'carregarSessoes deve substituir o estado, validar todos os registros e renderizar.', (doc, win, helpers) => {
      const load = value(helpers, win, 'carregarSessoes');
      if (typeof load !== 'function') return false;
      win.localStorage.setItem('devpath-sessoes', '[{"tema":"Eventos","minutos":35}]'); load(); load();
      const restored = doc.querySelectorAll('#sessoes li').length === 1 && doc.querySelector('#total-minutos').textContent.trim() === '35';
      win.localStorage.setItem('devpath-sessoes', '{'); load();
      const recovered = doc.querySelectorAll('#sessoes li').length === 0 && doc.querySelector('#total-minutos').textContent.trim() === '0';
      win.localStorage.setItem('devpath-sessoes', '[{"tema":"Inválido","minutos":-3}]'); load();
      return restored && recovered && doc.querySelectorAll('#sessoes li').length === 0 && doc.querySelector('#total-minutos').textContent.trim() === '0';
    }),
  ],
  projectBrief: {
    summary: 'Uma aplicação para registrar sessões de estudo, acompanhar minutos acumulados e continuar após recarregar.',
    deliverables: ['Formulário validado de tema e duração.', 'Lista sem duplicação e resumo de minutos.', 'Persistência em JSON com restauração e recuperação de corrupção.', 'Temas inseridos como texto literal, inclusive símbolos HTML.'],
    milestones: [{ title: 'Modelar e renderizar', description: 'Defina sessões em memória e crie lista e total a partir desse estado.' }, { title: 'Conectar o formulário', description: 'Valide, cadastre, renderize e limpe entradas aceitas.' }, { title: 'Persistir e recuperar', description: 'Salve a cada registro e restaure os dados na inicialização.' }, { title: 'Demonstrar continuidade', description: 'Cadastre, recarregue e teste dados inválidos sem duplicar a lista.' }],
    rubric: ['Estado, lista e total concordam após cada ação.', 'Entradas inválidas não alteram dados.', 'Dados persistidos são validados antes do uso.', 'A aplicação continua funcionando depois de múltiplos envios.'],
    stretchGoals: ['Inclua exclusão de sessão usando um identificador estável.', 'Ofereça filtros por tema mantendo o total geral explícito.', 'Mostre uma mensagem acessível se o armazenamento recusar a escrita.'],
  },
  links: [mdn('Interface Storage', 'Web/API/Storage', 'Persistência de pares chave/valor para o diário.')],
});

const apiDashboard = makeStage({
  id: 'js-project-api-dashboard', moduleId: 'mod-6', title: 'Projeto: painel de dados de uma API', minutes: 90,
  brief: 'Conecte uma busca assíncrona aos estados de carregamento, sucesso e erro de uma interface.',
  objectives: ['Integrar fetch e renderização do DOM.', 'Restaurar a interface depois de erros HTTP ou de rede.'],
  lesson: lines(
    '### Modele os estados da operação',
    'Uma busca começa em carregamento e termina em sucesso ou erro. Antes de aguardar a rede, informe que há trabalho em andamento e limpe o resultado anterior. Assim, uma falha nunca deixa dados antigos parecendo atuais.',
    '', '### Separe resposta e corpo',
    'fetch resolve quando a resposta chega. Confira resposta.ok antes de aguardar resposta.json(). Um status HTTP de erro não rejeita automaticamente a Promise; lance um Error para encaminhá-lo ao catch. A leitura do JSON também pode falhar.',
    '', '### Finalize todos os caminhos',
    'Use try/catch/finally: try carrega os dados, catch apresenta a falha e finally libera o botão. Insira conteúdo recebido com textContent para apresentar marcação como texto. A função async deve terminar somente depois de atualizar a interface.',
    '', '### Verifique sem depender da rede',
    'Os testes substituem fetch por respostas controladas. Confira sucesso, erro HTTP, falha de rede e uma nova busca depois de um erro. O formulário cancela sua navegação padrão e chama a mesma função utilizada pelos testes.'
  ),
  quiz: ['Onde reabilitar o botão para cobrir sucesso e erro?', ['Somente após ler o JSON.', 'No bloco finally.', 'Antes de chamar fetch.'], 1, 'finally executa a limpeza tanto no sucesso quanto depois de uma falha.'],
  examples: [['carregarPerfil("octocat") com JSON { login: "octocat" }', '#resultado mostra octocat e #status mostra sucesso.'], ['Resposta HTTP 404 ou falha de rede', '#status mostra erro, resultado vazio e botão habilitado.']],
  hints: ['Atualize o estado de carregamento antes do primeiro await.', 'Verifique resposta.ok e leia o JSON dentro de try.', 'Use catch para mostrar erro e finally para liberar o botão.'],
  practice: 'Acrescente validação de entrada vazia e explique como impedir respostas antigas de substituir uma busca mais recente.',
  assignment: 'Implemente async carregarPerfil(username). Antes da busca, escreva carregando em #status, limpe #resultado e desabilite #buscar. Busque https://api.github.com/users/ seguido de encodeURIComponent(username). Confira resposta.ok e leia o JSON: no sucesso, mostre dados.login como texto em #resultado e sucesso em #status. Em erro HTTP, de rede ou de JSON, mostre erro e resultado vazio, sem rejeição não tratada. Sempre reabilite #buscar ao terminar. Conecte o submit de #perfil-form à função usando #username e preventDefault().',
  body: '<form id="perfil-form"><label for="username">Usuário do GitHub</label><input id="username" required><button id="buscar" type="submit">Buscar</button></form><p id="status" role="status"></p><p id="resultado"></p>',
  script: 'async function carregarPerfil(username) {\n  // Atualize a interface, busque o perfil e trate os estados.\n}\n\n// Conecte o submit do formulário.\n',
  tasks: [
    task('foundation-api-states', 'Apresenta carregamento e sucesso com dados como texto literal.', 'Atualize os estados antes e depois da busca e libere o botão ao terminar.', async (doc, win, helpers) => {
      const load = value(helpers, win, 'carregarPerfil');
      if (typeof load !== 'function') return false;
      const original = win.fetch;
      let requested;
      let release;
      try {
        win.fetch = url => { requested = url; return new Promise(resolve => { release = resolve; }); };
        const pending = load('dev path');
        const loading = doc.querySelector('#status').textContent === 'carregando' && doc.querySelector('#buscar').disabled && doc.querySelector('#resultado').textContent === '';
        release?.({ ok: true, json: async () => ({ login: '<b>devpath</b>' }) });
        await pending;
        return loading && requested === 'https://api.github.com/users/dev%20path' && doc.querySelector('#status').textContent === 'sucesso' && !doc.querySelector('#buscar').disabled && doc.querySelector('#resultado').textContent === '<b>devpath</b>' && !doc.querySelector('#resultado b');
      } finally { win.fetch = original; }
    }),
    task('foundation-api-errors', 'Recupera erros HTTP, de rede e de JSON e permite tentar novamente.', 'Trate falhas no catch e reabilite o botão no finally.', async (doc, win, helpers) => {
      const load = value(helpers, win, 'carregarPerfil');
      if (typeof load !== 'function') return false;
      const original = win.fetch;
      try {
        for (const mode of ['http', 'network', 'json']) {
          doc.querySelector('#resultado').textContent = 'resultado anterior';
          win.fetch = async () => {
            if (mode === 'network') throw new Error('Sem conexão');
            return { ok: mode !== 'http', status: 404, json: async () => { if (mode === 'json') throw new Error('JSON inválido'); return { login: 'incorreto' }; } };
          };
          await load('missing');
          if (doc.querySelector('#status').textContent !== 'erro' || doc.querySelector('#buscar').disabled || doc.querySelector('#resultado').textContent !== '') return false;
        }
        win.fetch = async () => ({ ok: true, json: async () => ({ login: 'recuperado' }) });
        await load('recuperado');
        return doc.querySelector('#status').textContent === 'sucesso' && doc.querySelector('#resultado').textContent === 'recuperado' && !doc.querySelector('#buscar').disabled;
      } finally { win.fetch = original; }
    }),
    task('foundation-api-submit', 'O formulário busca o usuário informado sem navegar.', 'Cancele o submit e encaminhe o valor atual do input para carregarPerfil.', async (doc, win) => {
      const original = win.fetch;
      let requested;
      try {
        win.fetch = async url => { requested = url; return { ok: true, json: async () => ({ login: 'aluno' }) }; };
        doc.querySelector('#username').value = 'aluno';
        const prevented = !doc.querySelector('#perfil-form').dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
        await new Promise(resolve => win.setTimeout(resolve, 0));
        return prevented && requested === 'https://api.github.com/users/aluno' && doc.querySelector('#resultado').textContent === 'aluno';
      } finally { win.fetch = original; }
    }),
  ],
  projectBrief: {
    summary: 'Um painel de consulta de perfis que comunica carregamento, sucesso e falha e permite novas tentativas.',
    deliverables: ['Formulário conectado à busca de perfil.', 'Estados de carregamento, sucesso e erro.', 'Tratamento de falhas HTTP, de rede e de JSON.'],
    milestones: [{ title: 'Preparar a interface', description: 'Conecte o formulário e represente os estados no DOM.' }, { title: 'Buscar e apresentar', description: 'Verifique HTTP, leia JSON e mostre o login como texto.' }, { title: 'Recuperar falhas', description: 'Limpe resultados antigos e permita uma nova tentativa.' }],
    rubric: ['O usuário informado determina a URL.', 'Conteúdo remoto é apresentado como texto.', 'Todos os caminhos liberam o botão e atualizam o estado.'],
    stretchGoals: ['Valide nomes vazios antes de acessar a rede.', 'Impeça respostas antigas de sobrescrever uma busca recente.'],
  },
  links: [mdn('Usando Fetch', 'Web/API/Fetch_API/Using_Fetch', 'Respostas HTTP, leitura de JSON e tratamento de erros.')],
});

export const foundationInsertions = [
  { after: 'js-2-template-literals', stage: numberValidation },
  { after: 'js-3-conditionals-and-strict-equality', stage: debugging },
  { after: debugging.id, stage: budget },
  { after: 'js-4-arrow-functions-defaults', stage: scope },
  { after: 'odin-rock-paper-scissors-console', stage: loops },
  { after: 'odin-object-basics', stage: cart },
  { after: cart.id, stage: semanticHtml },
  { after: semanticHtml.id, stage: cssLayout },
  { after: 'js-12-localstorage-json', stage: safeStorage },
  { after: 'js-13-timers-interval', stage: studyJournal },
  { after: 'js-15-fetch-api-live', stage: apiDashboard },
];

export const foundationModuleProjects = {
  'mod-1': budget.id,
  'mod-2': 'odin-rock-paper-scissors-console',
  'mod-3': cart.id,
  'mod-4': 'odin-calculator',
  'mod-5': studyJournal.id,
  'mod-6': apiDashboard.id,
  'mod-7': 'js-17-grand-capstone-app',
};
