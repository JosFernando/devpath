// Especialização em JavaScript no navegador: arquitetura, qualidade e integração.
// Os exemplos ensinam o conceito; os desafios exigem uma implementação própria.
const same = (actual, expected) => {
  if (Object.is(actual, expected)) return true;
  if (!actual || !expected || typeof actual !== 'object' || typeof expected !== 'object') return false;
  if (Array.isArray(actual) !== Array.isArray(expected)) return false;
  const left = Object.keys(actual).sort(); const right = Object.keys(expected).sort();
  return left.length === right.length && left.every((key, index) => key === right[index] && same(actual[key], expected[key]));
};
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const fnOf = (helpers, win, name) => {
  const fn = helpers?.getVar?.(name) ?? win?.[name];
  assert(typeof fn === 'function', `Implemente a função ${name} com o contrato descrito no desafio.`);
  return fn;
};
const requirement = (id, description, hint, evaluate) => ({
  id, description, hint,
  async check(doc, win, helpers) {
    try { await evaluate(doc, win, helpers); return { pass: true }; }
    catch (error) { return { pass: false, tip: error?.message || hint }; }
  },
});
const mdn = (title, path, summary) => ({ source: 'MDN Web Docs', title, url: `https://developer.mozilla.org/en-US/${path}`, summary });
const styles = `body{font-family:system-ui,sans-serif;background:#0b1220;color:#e5e7eb;padding:24px;line-height:1.6}main{max-width:760px;margin:auto}input,select,button{font:inherit;padding:10px;border-radius:8px;margin:4px}button{cursor:pointer;background:#8b5cf6;color:white;border:0}button:disabled{opacity:.6}label{display:block}li{margin:12px 0}pre{white-space:pre-wrap}*:focus-visible{outline:3px solid #fbbf24;outline-offset:3px}[hidden]{display:none!important}`;
function stage({ id, moduleId, title, category = 'Especialização', minutes = 35, brief, lesson, objectives, question, examples, hints, practice, task, links, script, markup = '', tasks, projectBrief, isCapstone }) {
  return {
    id, moduleId, title, category, estimatedMinutes: minutes,
    instruction: {
      brief, deepLesson: lesson, learningObjective: objectives[0], learningObjectives: objectives,
      knowledgeCheck: { question: question[0], options: question[1], correctIndex: question[2], explanation: question[3] },
      challengeExamples: examples.map(([input, output]) => ({ input, output })),
      progressiveHints: hints, practicePrompt: practice, taskDescription: task, curatedLinks: links,
    },
    playground: {
      files: {
        'index.html': `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link rel="stylesheet" href="style.css"></head><body><main><h1>${title}</h1>${markup || '<p>Implemente o contrato em script.js e use o console para explorar outros casos.</p><pre id="saida"></pre>'}</main><script src="script.js"></script></body></html>`,
        'style.css': styles, 'script.js': script,
      }, activeFile: 'script.js', tasks,
    },
    ...(projectBrief ? { projectBrief } : {}), ...(isCapstone ? { isCapstone: true } : {}),
  };
}

export const advancedModules = [
  { id: 'mod-8', name: '8. Arquitetura de Aplicações', icon: '🧩', desc: 'Funções puras, estado imutável, fronteiras e uma biblioteca de estado.', level: 'Avançado', prerequisites: ['Funções, arrays e objetos', 'Closures, eventos e projeto do módulo 7'], outcomes: ['Separar regras de negócio de efeitos externos', 'Modelar transições previsíveis de estado', 'Entregar uma loja de estado reutilizável e verificável'] },
  { id: 'mod-9', name: '9. Qualidade e Desempenho', icon: '🔬', desc: 'Contratos, testes de comportamento, estruturas de dados e busca eficiente.', level: 'Especialista', prerequisites: ['Arquitetura e projeto do módulo 8'], outcomes: ['Definir e testar limites de entrada', 'Escolher Map e Set com critérios de custo', 'Construir uma busca com filtros, resultados seguros e debounce'] },
  { id: 'mod-10', name: '10. Integração Profissional e Master', icon: '🎓', desc: 'Concorrência, acessibilidade, persistência resiliente e projeto de portfólio.', level: 'Master', prerequisites: ['Async/await e tratamento de erros', 'Projetos dos módulos 8 e 9'], outcomes: ['Impedir respostas antigas de sobrescrever a interface', 'Manter uma interface utilizável com teclado e falhas de armazenamento', 'Entregar e revisar um dashboard completo de estudos'] },
];

const architectureStages = [
  stage({
    id: 'js-8-pure-composition', moduleId: 'mod-8', title: 'Funções puras e composição de regras',
    brief: 'Transforme dados em resultados sem modificar a entrada. Uma regra previsível pode ser testada no console, usada em uma interface e reaproveitada em relatórios.',
    lesson: `### Separe cálculo de efeito
Uma função pura depende apenas dos argumentos e não altera objetos externos. Ler o relógio, escrever no DOM e salvar no navegador são efeitos: deixe essas operações na borda da aplicação. A mesma lista de sessões deve produzir o mesmo resumo, independentemente da página aberta.

### Componha operações pequenas
Use nomes que expressem intenção. Em um estoque, separar seleção e cálculo permite revisar cada decisão:

\`\`\`javascript
const ativos = itens => itens.filter(item => item.ativo);
const unidades = itens => itens.reduce((total, item) => total + item.quantidade, 0);
const estoque = [{ ativo: true, quantidade: 3 }, { ativo: false, quantidade: 8 }];
console.log(unidades(ativos(estoque))); // 3
\`\`\`

O acumulador inicial define o resultado da lista vazia. Não guarde o total em uma variável global: a segunda chamada somaria dados da primeira. Criar um novo array não copia profundamente os objetos; alterar uma propriedade de seus itens ainda pode afetar a entrada.

### Evidência de domínio
Antes de programar, escreva os casos lista vazia, nenhuma concluída e mistura de sessões. Depois, guarde uma cópia serializada da entrada e compare após duas chamadas. O desafio considera minutos apenas de sessões concluídas e recebe dados já válidos; a validação será estudada no próximo módulo.`,
    objectives: ['Compor uma transformação sem modificar a entrada', 'Explicar identidade, efeitos e resultado da lista vazia'],
    question: ['Qual comportamento quebra a pureza de uma função de resumo?', ['Receber um array por parâmetro', 'Incrementar uma variável global em cada chamada', 'Retornar um objeto novo'], 1, 'A variável global passa a influenciar chamadas futuras. O resultado deixa de depender apenas dos argumentos.'],
    examples: [['[{minutos:20,concluida:true},{minutos:40,concluida:false}]', '{totalMinutos:20,totalConcluidas:1}'], ['[]', '{totalMinutos:0,totalConcluidas:0}']],
    hints: ['Selecione as sessões cujo campo concluida é true.', 'Some minutos e conte somente as sessões selecionadas.', 'Inicialize os totais dentro da função e retorne um novo objeto.'],
    practice: 'Adicione uma terceira função que calcule a média das sessões concluídas. Defina o resultado quando nenhuma sessão foi concluída.',
    task: 'Implemente resumirSessoes(sessoes). Cada sessão tem minutos numéricos e concluida booleano. Retorne {totalMinutos,totalConcluidas} considerando apenas concluida === true. Preserve a entrada, aceite [] e não acumule valores entre chamadas.',
    links: [mdn('reduce e acumulador inicial', 'docs/Web/JavaScript/Reference/Global_Objects/Array/reduce', 'Como reduzir uma lista a um resultado e tratar arrays vazios.')],
    script: `function resumirSessoes(sessoes) {
  // Selecione, some e conte sem modificar sessoes.
}
console.log(resumirSessoes([{ minutos: 20, concluida: true }]));`,
    tasks: [
      requirement('pure-results', 'O resumo considera somente sessões concluídas, incluindo lista vazia.', 'Defina os dois totais e selecione concluida === true.', (doc, win, h) => {
        const fn = fnOf(h, win, 'resumirSessoes');
        assert(same(fn([]), { totalMinutos: 0, totalConcluidas: 0 }), 'A lista vazia deve retornar dois totais iguais a zero.');
        assert(same(fn([{ minutos: 15, concluida: true }, { minutos: 90, concluida: false }, { minutos: 25, concluida: true }]), { totalMinutos: 40, totalConcluidas: 2 }), 'Some e conte apenas as duas sessões concluídas.');
      }),
      requirement('pure-no-mutation', 'Chamadas repetidas preservam os dados e produzem resultados independentes.', 'Evite acumuladores globais e mudanças nos itens.', (doc, win, h) => {
        const fn = fnOf(h, win, 'resumirSessoes');
        const input = Object.freeze([Object.freeze({ minutos: 7, concluida: true }), Object.freeze({ minutos: 2, concluida: false })]);
        const before = JSON.stringify(input); const first = fn(input); const second = fn(input);
        assert(same(first, { totalMinutos: 7, totalConcluidas: 1 }) && same(second, first) && first !== second && JSON.stringify(input) === before, 'Cada chamada precisa de um novo resumo, sem alterar a entrada nem acumular totais anteriores.');
      }),
    ],
  }),
  stage({
    id: 'js-8-immutable-reducer', moduleId: 'mod-8', title: 'Estado imutável e transições com reducer', minutes: 40,
    brief: 'Modele mudanças como ações explícitas. Um reducer recebe estado e ação, decide a transição e devolve o próximo estado sem tocar na interface.',
    lesson: `### Estado, ação, próximo estado
Um estado representa o que a aplicação sabe agora. Uma ação descreve um acontecimento: registrar tempo ou alterar uma meta. O reducer concentra essas regras em uma função testável. Eventos de clique apenas traduzem a intenção do usuário em ações.

### Preserve o passado
Veja uma transição em um placar, diferente do desafio:

\`\`\`javascript
function reduzirPlacar(estado, acao) {
  if (acao.tipo !== 'ponto') return estado;
  return { ...estado, pontos: estado.pontos + 1 };
}
const anterior = { pontos: 2, equipe: 'Azul' };
const seguinte = reduzirPlacar(anterior, { tipo: 'ponto' });
console.log(anterior.pontos, seguinte.pontos); // 2, 3
\`\`\`

O spread copia propriedades do primeiro nível. Para mudar um objeto aninhado, copie também aquele nível. Neste exercício, os campos são simples: preserve as propriedades extras, como o nome do aluno, ao atualizar minutos ou meta.

### Identidade tem significado
Uma ação desconhecida ou inválida deve devolver exatamente o mesmo objeto. Assim, quem observa o estado pode ignorar uma mudança que não ocorreu. Ações válidas devolvem um novo objeto. Não use JSON para clonar tudo: ele perde tipos e mascara quais partes realmente mudaram. Teste a sequência inteira e confirme que o estado inicial continua intacto.`,
    objectives: ['Representar transições com um reducer puro', 'Preservar identidade em ações desconhecidas e valores inválidos'],
    question: ['Uma ação desconhecida deve fazer o quê neste contrato?', ['Zerar o estado', 'Modificar o objeto e devolvê-lo', 'Retornar o mesmo objeto recebido'], 2, 'Preservar a referência comunica que nenhuma transição aconteceu e evita notificações desnecessárias.'],
    examples: [["reduzirEstudo({minutos:10,meta:60},{tipo:'registrar',minutos:15})", '{minutos:25,meta:60}'], ["reduzirEstudo(estado,{tipo:'registrar',minutos:-2})", 'O próprio estado, sem alteração']],
    hints: ['Use acao.tipo para escolher a regra.', 'Aceite somente números finitos maiores que zero.', 'Retorne {...estado, campo: novoValor} em transições válidas e estado nas demais.'],
    practice: 'Desenhe uma tabela de transições e proponha uma ação de reinício que preserve a meta. Implemente-a depois de concluir o contrato principal.',
    task: "Implemente reduzirEstudo(estado,acao). A ação {tipo:'registrar',minutos} soma minutos; {tipo:'definirMeta',meta} troca a meta. Aceite apenas números finitos > 0, inclusive decimais. Preserve campos extras. Para ações desconhecidas ou valores inválidos, retorne a mesma referência. Para ações válidas, retorne um objeto novo sem mutação.",
    links: [mdn('Spread e cópias superficiais', 'docs/Web/JavaScript/Reference/Operators/Spread_syntax', 'Entenda quais referências continuam compartilhadas após uma cópia.')],
    script: `function reduzirEstudo(estado, acao) {
  // Registre tempo, altere a meta e preserve o estado anterior.
}
const inicial = { minutos: 0, meta: 60, aluno: 'Você' };
console.log(reduzirEstudo(inicial, { tipo: 'registrar', minutos: 25 }));`,
    tasks: [
      requirement('reducer-transitions', 'As duas ações atualizam o campo correto e preservam o estado anterior.', 'Copie as propriedades antes de substituir o campo.', (doc, win, h) => {
        const fn = fnOf(h, win, 'reduzirEstudo'); const start = Object.freeze({ minutos: 5, meta: 30, aluno: 'Bia' });
        const next = fn(start, { tipo: 'registrar', minutos: 2.5 });
        assert(same(next, { minutos: 7.5, meta: 30, aluno: 'Bia' }) && next !== start, 'registrar deve somar minutos, preservar aluno e criar um objeto.');
        assert(same(fn(next, { tipo: 'definirMeta', meta: 90 }), { minutos: 7.5, meta: 90, aluno: 'Bia' }) && next.meta === 30, 'definirMeta troca apenas a meta sem alterar o estado anterior.');
      }),
      requirement('reducer-invalid', 'Ações desconhecidas, zero, negativos e valores não numéricos preservam a referência.', 'Use Number.isFinite e compare com zero.', (doc, win, h) => {
        const fn = fnOf(h, win, 'reduzirEstudo'); const initial = { minutos: 0, meta: 60 };
        for (const value of [0, -1, '20', NaN, Infinity, undefined]) {
          assert(fn(initial, { tipo: 'registrar', minutos: value }) === initial && fn(initial, { tipo: 'definirMeta', meta: value }) === initial, 'Valores inválidos devem devolver a referência original.');
        }
        assert(fn(initial, { tipo: 'desconhecida' }) === initial, 'Não crie um novo estado para ações desconhecidas.');
      }),
    ],
  }),
  stage({
    id: 'js-8-dependency-injection', moduleId: 'mod-8', title: 'Módulos, fronteiras e injeção de dependências', minutes: 40,
    brief: 'Organize responsabilidades e receba relógio e armazenamento por parâmetro. Assim, a mesma regra funciona com serviços reais e substitutos controlados nos testes.',
    lesson: `### Uma responsabilidade por fronteira
Em uma aplicação real, arquivos ES Modules publicam contratos com export e consomem contratos com import. O navegador carrega o ponto de entrada com script type="module". Os imports estáticos pertencem a módulos; colá-los dentro de um script clássico gera erro de sintaxe.

O editor desta trilha executa script.js como script clássico. Aqui praticaremos a mesma separação com uma função fábrica e um objeto de métodos. Depois, em um projeto com servidor e arquivos próprios, você poderá exportar essa fábrica sem mudar sua regra.

### Dependências explícitas
Uma função que chama Date.now e localStorage diretamente esconde suas dependências. Um serviço pode recebê-las:

\`\`\`javascript
function criarAuditoria({ relogio, emitir }) {
  return evento => emitir({ evento, instante: relogio() });
}
const eventos = [];
const auditar = criarAuditoria({ relogio: () => 123, emitir: item => eventos.push(item) });
auditar('abriu');
console.log(eventos[0].instante); // 123
\`\`\`

### Controle dos efeitos
Valide a entrada antes de consultar o relógio ou salvar. Isso evita efeitos para ações rejeitadas. Não copie dependências em variáveis globais: duas instâncias devem trabalhar com relógios e destinos independentes. Primeiro teste usando um array como armazenamento; só depois conecte um adaptador real. Essa decisão facilita diagnosticar se uma falha pertence à regra ou à infraestrutura.`,
    objectives: ['Explicitar dependências de relógio e persistência', 'Distinguir ES Modules de scripts clássicos e organizar fábricas testáveis'],
    question: ['Por que receber agora e salvar por parâmetro?', ['Para tornar os efeitos controláveis em testes', 'Para transformar qualquer função em uma Promise', 'Para permitir import estático em script clássico'], 0, 'O teste fornece um relógio previsível e um destino em memória, sem depender de horário real ou armazenamento global.'],
    examples: [["servico.registrar('  Revisão  ') com agora() = 42", "{texto:'Revisão',criadoEm:42}, salvo uma vez"], ["servico.registrar('   ')", 'null, sem consultar relógio ou salvar']],
    hints: ['A fábrica recebe {agora,salvar} e devolve {registrar}.', 'Faça trim e retorne null antes dos efeitos quando o texto ficar vazio.', 'Crie um registro, chame salvar(registro) uma vez e retorne esse mesmo registro.'],
    practice: 'Desenhe os arquivos registro.js, armazenamento.js e main.js de uma versão com ES Modules. Liste quais nomes cada arquivo exportaria.',
    task: 'Implemente criarServicoRegistro({agora,salvar}), que retorna um objeto com registrar(texto). O texto recebido é string. Normalize com trim; vazio retorna null sem efeitos. Caso válido, crie {texto,criadoEm:agora()}, salve uma vez e retorne o registro. Use somente as dependências recebidas e preserve a independência entre instâncias.',
    links: [mdn('Guia de JavaScript Modules', 'docs/Web/JavaScript/Guide/Modules', 'Sintaxe de import/export, escopo e configuração de scripts de módulo.')],
    script: `function criarServicoRegistro({ agora, salvar }) {
  // Retorne uma API pequena; mantenha dependências nesta closure.
}
// Experimente com agora: () => 100 e salvar: item => console.log(item).`,
    tasks: [
      requirement('injection-valid', 'O serviço normaliza, usa as dependências recebidas e salva uma única vez.', 'Use o relógio injetado para criadoEm.', (doc, win, h) => {
        const factory = fnOf(h, win, 'criarServicoRegistro'); const saved = []; let ticks = 0;
        const api = factory({ agora: () => { ticks += 1; return 701; }, salvar: item => saved.push(item) });
        const item = api.registrar('  Praticar DOM  ');
        assert(same(item, { texto: 'Praticar DOM', criadoEm: 701 }) && ticks === 1 && saved.length === 1 && saved[0] === item, 'Crie e retorne um registro normalizado usando o relógio injetado; salve esse registro uma vez.');
      }),
      requirement('injection-isolation', 'Entradas vazias não causam efeitos e instâncias usam dependências independentes.', 'Valide antes de chamar agora ou salvar.', (doc, win, h) => {
        const factory = fnOf(h, win, 'criarServicoRegistro'); const left = []; const right = []; let calls = 0;
        const a = factory({ agora: () => { calls += 1; return 1; }, salvar: item => left.push(item) });
        const b = factory({ agora: () => 2, salvar: item => right.push(item) });
        assert(a.registrar('  ') === null && calls === 0 && left.length === 0, 'Texto vazio deve retornar null sem consultar relógio nem salvar.');
        a.registrar('A'); b.registrar('B');
        assert(left.length === 1 && right.length === 1 && left[0].criadoEm === 1 && right[0].criadoEm === 2, 'As instâncias devem manter relógios e destinos separados.');
      }),
    ],
  }),
  stage({
    id: 'js-8-project-study-store', moduleId: 'mod-8', title: 'Projeto: biblioteca de estado observável', category: 'Projeto', minutes: 90,
    brief: 'Construa uma biblioteca pequena para conectar reducers à interface. Seu produto será uma API reutilizável com leitura, envio de ações, assinatura e cancelamento.',
    lesson: `### Briefing de arquitetura
Uma equipe precisa que contador, relatórios e persistência observem o mesmo estado. Se cada parte altera uma variável diretamente, torna-se difícil descobrir a origem de um valor. Sua biblioteca concentrará as transições em dispatch e notificará consumidores somente quando o reducer devolver outra referência.

### Encapsule o ciclo de vida
Uma closure guarda estado e ouvintes. getState apenas lê. dispatch calcula o próximo estado antes de avisar os consumidores. subscribe recebe um ouvinte e devolve uma função de cancelamento: essa função é essencial quando uma tela deixa de existir.

Veja o uso de uma API análoga de temperatura, sem sua implementação:

\`\`\`javascript
const parar = sensor.subscribe(graus => console.log('Temperatura', graus));
sensor.atualizar(22);
parar();
sensor.atualizar(23); // O consumidor cancelado não recebe esta leitura.
\`\`\`

### Decisões que você precisa documentar
Neste projeto, subscribe não emite o valor inicial: quem precisa dele chama getState. dispatch devolve o estado atual. Cada inscrição tem seu próprio cancelamento, mesmo que duas inscrições usem a mesma função. Cancelar duas vezes é seguro. O estado pertence ao reducer e deve ser tratado como somente leitura por consumidores.

Revise a sequência criar → assinar → despachar → cancelar → despachar. Faça outra instância e prove que não há estado global compartilhado. A interface de demonstração é uma extensão; a entrega central deste módulo é a biblioteca e sua demonstração no console.`,
    objectives: ['Integrar reducer, closure e publicação de mudanças', 'Projetar uma API com cancelamento e instâncias independentes'],
    question: ['Quando um ouvinte deve ser notificado?', ['Sempre que getState for chamado', 'Somente quando o reducer devolver outra referência de estado', 'Imediatamente depois de ser cancelado'], 1, 'A comparação de identidade sinaliza transição. Ler o estado ou despachar uma ação sem efeito não produz notificação.'],
    examples: [["dispatch({tipo:'somar'}) com reducer de contador", 'Atualiza o estado e avisa cada inscrição ativa uma vez'], ['parar(); parar(); dispatch(acao)', 'Cancelar é idempotente; o ouvinte cancelado não é chamado']],
    hints: ['Guarde estado e inscrições dentro de criarLoja.', 'Em dispatch, compare o novo estado com o anterior antes de notificar.', 'Use um identificador por inscrição; o cancelamento remove somente aquela inscrição.'],
    practice: 'Conecte um contador visual a uma inscrição e um log a outra. Remova o contador e cancele sua inscrição; confirme que o log continua funcionando.',
    task: 'Implemente criarLoja(reducer,estadoInicial), retornando {getState,dispatch,subscribe}. dispatch(acao) aplica reducer, notifica ouvintes ativos com o novo estado somente quando a referência muda e retorna o estado atual. subscribe(ouvinte) não notifica imediatamente; retorna cancelar(), seguro para chamadas repetidas. Duas inscrições da mesma função são independentes. Não compartilhe estado entre lojas.',
    links: [mdn('Funções e closures', 'docs/Web/JavaScript/Guide/Functions', 'Revise escopo e funções internas para encapsular o estado de cada instância.')],
    script: `function criarLoja(reducer, estadoInicial) {
  // Sua biblioteca: getState, dispatch e subscribe.
}
// Após implementar, demonstre duas inscrições e um cancelamento no console.`,
    projectBrief: {
      summary: 'Entregue uma biblioteca de estado em JavaScript puro, acompanhada de uma demonstração reproduzível de seu ciclo de vida.',
      deliverables: ['API criarLoja com getState, dispatch e subscribe', 'Reducer de demonstração e sequência de uso no console', 'Cancelamento idempotente e isolamento entre instâncias', 'Comentários curtos documentando as decisões do contrato'],
      milestones: [{ title: '1. Núcleo', description: 'Encapsule estado, conecte reducer e implemente leitura e dispatch.' }, { title: '2. Observadores', description: 'Adicione inscrições independentes e cancelamento.' }, { title: '3. Revisão', description: 'Demonstre ações sem efeito, duas lojas e inscrições duplicadas.' }],
      rubric: ['Transições preservam o contrato do reducer', 'Nenhuma notificação acontece sem mudança de referência', 'Cancelamento remove somente a inscrição correspondente', 'A demonstração explica entradas, saídas e limites da API'],
      stretchGoals: ['Conecte o reducer de estudo da etapa anterior a uma interface.', 'Adicione histórico de ações para depuração sem modificar o estado anterior.'],
    },
    tasks: [
      requirement('store-state', 'A loja aplica um reducer genérico e devolve o estado atual.', 'Não fixe regras de estudo dentro da biblioteca.', (doc, win, h) => {
        const create = fnOf(h, win, 'criarLoja'); const initial = { pontos: 2 };
        const store = create((s, a) => a.tipo === 'somar' ? { pontos: s.pontos + a.valor } : s, initial);
        assert(store.getState() === initial, 'getState deve começar com a referência recebida.');
        const next = store.dispatch({ tipo: 'somar', valor: 3 });
        assert(same(next, { pontos: 5 }) && store.getState() === next && initial.pontos === 2, 'dispatch deve aplicar o reducer e retornar o estado atual.');
      }),
      requirement('store-subscription', 'Notificações respeitam mudanças, inscrições duplicadas e cancelamento idempotente.', 'Identifique cada inscrição separadamente.', (doc, win, h) => {
        const create = fnOf(h, win, 'criarLoja'); const store = create((s, a) => a === 'inc' ? s + 1 : s, 0); const seen = [];
        const listener = state => seen.push(state); const off = store.subscribe(listener); const off2 = store.subscribe(listener);
        assert(seen.length === 0, 'subscribe não deve disparar imediatamente.');
        store.dispatch('ignorar'); assert(seen.length === 0, 'Não notifique quando o estado não muda.');
        store.dispatch('inc'); assert(same(seen, [1, 1]), 'Cada inscrição ativa deve receber a mudança uma vez.');
        off(); off(); store.dispatch('inc'); assert(same(seen, [1, 1, 2]), 'Cancelar uma inscrição repetidamente não pode remover a outra.');
        off2(); store.dispatch('inc'); assert(seen.length === 3, 'Inscrições canceladas não recebem mudanças.');
      }),
      requirement('store-isolation', 'Lojas diferentes preservam estados e ouvintes independentes.', 'Mantenha as variáveis dentro da fábrica.', (doc, win, h) => {
        const create = fnOf(h, win, 'criarLoja'); const reducer = (s, a) => s + a; const a = create(reducer, 0); const b = create(reducer, 100); const seen = [];
        b.subscribe(value => seen.push(value)); a.dispatch(2);
        assert(a.getState() === 2 && b.getState() === 100 && seen.length === 0, 'Alterar uma loja não pode afetar outra.');
      }),
    ],
  }),
];

const qualityStages = [
  stage({
    id: 'js-9-contract-tests', moduleId: 'mod-9', title: 'Contratos, limites e testes de comportamento', minutes: 45,
    brief: 'Escreva critérios antes da implementação. Valide o domínio, teste valores de fronteira e produza um relatório que continue mesmo quando um caso lança erro.',
    lesson: `### O contrato precede a ferramenta
Um contrato descreve entradas aceitas e resultados observáveis. Para uma sessão de estudo, "minutos deve ser válido" é vago. "Inteiro entre 1 e 240" permite testar 0, 1, 240 e 241. Também é preciso decidir se "30" será convertido ou rejeitado; neste contrato, strings numéricas são rejeitadas.

### Preparar, executar, verificar
Um teste pequeno prepara os dados, chama uma operação e compara seu resultado. Exemplo em outro domínio:

\`\`\`javascript
const frete = peso => peso <= 2 ? 8 : 12;
const casos = [
  { nome: 'limite incluso', executar: () => frete(2) === 8 },
  { nome: 'acima do limite', executar: () => frete(2.1) === 12 }
];
console.log(casos.map(caso => caso.executar()));
\`\`\`

Prefira verificar o resultado à aparência do código: um loop e um reduce podem cumprir a mesma regra. Casos independentes ajudam a localizar defeitos. Não use a própria função testada para calcular o valor esperado, pois o teste repetiria seu erro.

### Validação e diagnóstico
Retorne todos os problemas de uma sessão em ordem previsível: primeiro titulo, depois minutos. O executor de casos recebe funções síncronas e só considera aprovação quando o retorno é exatamente true. Uma exceção reprova aquele caso e não interrompe o restante. Essa convenção simples reproduz a responsabilidade central de um executor de testes sem instalar bibliotecas.`,
    objectives: ['Transformar regras de domínio em casos de fronteira', 'Criar validação previsível e um executor de testes que isola falhas'],
    question: ['Qual conjunto testa melhor uma faixa inclusiva de 1 a 240?', ['Somente 60 e 120', '0, 1, 240 e 241', 'Somente números aleatórios'], 1, 'Valores imediatamente fora e nos limites expõem erros de comparação que exemplos centrais não revelam.'],
    examples: [["validarSessao({titulo:'DOM',minutos:30})", '{ok:true,erros:[]}'], ["validarSessao({titulo:' ',minutos:0})", "{ok:false,erros:['titulo','minutos']}"], ['executarCasos([{nome:"A",executar:()=>true}])', '[{nome:"A",passou:true}]']],
    hints: ['Valide titulo com typeof e trim; valide minutos com Number.isInteger e limites inclusivos.', 'Guarde os nomes dos campos inválidos em ordem, depois derive ok de erros.length.', 'Execute cada caso dentro de seu próprio try/catch e compare o retorno com true.'],
    practice: 'Escreva seis casos próprios para validarSessao, incluindo título com espaços, minutos decimais e os dois limites. Explique que defeito cada caso detecta.',
    task: 'Implemente validarSessao(sessao), recebendo um objeto: titulo deve ser string não vazia após trim; minutos deve ser inteiro de 1 a 240. Retorne {ok,erros}, com erros contendo "titulo" e/ou "minutos" nesta ordem, sem modificar a entrada. Implemente executarCasos(casos): cada {nome,executar} vira {nome,passou}; passou é true apenas para retorno === true, e exceções viram false sem parar os próximos casos.',
    links: [mdn('Number.isInteger', 'docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger', 'Validação numérica sem converter strings implicitamente.')],
    script: `function validarSessao(sessao) {
  // Retorne { ok, erros } sem modificar sessao.
}
function executarCasos(casos) {
  // Um resultado por caso; uma exceção não interrompe a lista.
}
// Crie seus próprios casos antes de executar os critérios automáticos.`,
    tasks: [
      requirement('contracts-boundaries', 'A validação reconhece limites, tipos e todos os campos inválidos.', 'Os limites 1 e 240 são válidos; 0, 241, decimais e strings não são.', (doc, win, h) => {
        const validate = fnOf(h, win, 'validarSessao');
        for (const minutes of [1, 30, 240]) assert(same(validate({ titulo: '  Aula  ', minutos: minutes }), { ok: true, erros: [] }), 'Aceite título com conteúdo e minutos inteiros nos limites inclusivos.');
        for (const minutes of [0, 241, 2.5, '30', NaN, Infinity, undefined]) assert(same(validate({ titulo: '', minutos: minutes }), { ok: false, erros: ['titulo', 'minutos'] }), 'Reporte titulo e minutos nesta ordem quando ambos forem inválidos.');
        for (const title of ['   ', 123, undefined]) assert(same(validate({ titulo: title, minutos: 10 }), { ok: false, erros: ['titulo'] }), 'Título deve ser texto com conteúdo após trim.');
        const input = Object.freeze({ titulo: '  React  ', minutos: 40 }); validate(input); assert(input.titulo === '  React  ', 'Valide sem modificar a entrada.');
      }),
      requirement('contracts-runner', 'O executor isola exceções, rejeita truthy e preserva ordem e nomes.', 'Faça um try/catch para cada caso, não para a lista inteira.', (doc, win, h) => {
        const run = fnOf(h, win, 'executarCasos'); let last = false;
        const output = run([{ nome: 'passa', executar: () => true }, { nome: 'lança', executar: () => { throw new Error('esperado'); } }, { nome: 'truthy', executar: () => 1 }, { nome: 'continua', executar: () => { last = true; return false; } }]);
        assert(same(output, [{ nome: 'passa', passou: true }, { nome: 'lança', passou: false }, { nome: 'truthy', passou: false }, { nome: 'continua', passou: false }]) && last, 'Retorne um relatório por caso, continue após exceções e aprove apenas true.');
        assert(same(run([]), []), 'Uma suíte vazia retorna um relatório vazio.');
      }),
    ],
  }),
  stage({
    id: 'js-9-catalog-index', moduleId: 'mod-9', title: 'Map, Set e custo de consultas', minutes: 45,
    brief: 'Construa um índice de tags para evitar repetir a mesma organização dos dados. Entenda o custo de preparar uma estrutura e o benefício de consultá-la várias vezes.',
    lesson: `### Escolha a estrutura pela pergunta
Um array preserva uma sequência. Um Set representa valores únicos. Um Map associa chaves a valores e preserva a ordem de inserção. Um índice de tags combina os dois: cada tag aponta para um conjunto de identificadores de cursos.

### Exemplo: índice por cidade
\`\`\`javascript
const porCidade = new Map();
for (const pessoa of [{ id: 'a', cidade: 'Porto' }, { id: 'b', cidade: 'Porto' }]) {
  if (!porCidade.has(pessoa.cidade)) porCidade.set(pessoa.cidade, new Set());
  porCidade.get(pessoa.cidade).add(pessoa.id);
}
console.log([...porCidade.get('Porto')]); // ['a', 'b']
\`\`\`

### Meça o trabalho, não prometa velocidade
Construir um índice percorre as ocorrências de tags e consome memória adicional. Depois disso, localizar o grupo evita procurar a tag em todos os cursos a cada consulta. A especificação de Map exige acesso médio sublinear, mas não promete uma implementação universal em tempo constante. Comparar duas medições pequenas no relógio é frágil; comece contando itens visitados e pensando no volume de dados e consultas.

Normalize chaves uma vez: trim e letras minúsculas evitam grupos separados para " DOM " e "dom". Ignore tags vazias e elimine ids repetidos por tag com Set. Não remova acentos neste contrato: normalização de acentos é uma decisão de produto separada. Preserve os dados originais para apresentação.`,
    objectives: ['Construir um índice Map de conjuntos sem duplicatas', 'Explicar custo de preparação, consulta e memória de uma estrutura'],
    question: ['Qual estrutura representa melhor os ids únicos de uma tag?', ['Um Set', 'Uma string concatenada', 'Um contador numérico'], 0, 'Set expressa unicidade e permite verificar pertencimento sem gerenciar duplicatas manualmente.'],
    examples: [["[{id:'a',tags:[' JS ','js']},{id:'b',tags:['js']}]", "Map: 'js' → Set {'a','b'}"], ['[]', 'Map vazio']],
    hints: ['Crie um Map novo para cada chamada.', 'Normalize cada tag, ignore vazias e inicialize um Set se a chave ainda não existir.', 'Adicione o id ao Set da tag; duplicatas desaparecerão naturalmente.'],
    practice: 'Compare um filtro que percorre o catálogo a cada consulta com um índice construído uma vez. Descreva quando o índice custa mais do que economiza.',
    task: 'Implemente indexarCatalogo(cursos). Cada curso tem id string e tags array de strings. Retorne um Map com tags normalizadas por trim().toLowerCase() como chaves e Sets de ids como valores. Ignore tags vazias, elimine ids duplicados por tag, preserve a ordem da primeira ocorrência e não modifique cursos ou tags.',
    links: [mdn('Map: chaves, valores e custo de acesso', 'docs/Web/JavaScript/Reference/Global_Objects/Map', 'Garantias da estrutura e diferenças em relação a objetos.'), mdn('Set: valores únicos', 'docs/Web/JavaScript/Reference/Global_Objects/Set', 'Operações de pertencimento e ordem de inserção.')],
    script: `function indexarCatalogo(cursos) {
  // Map<tag, Set<id>>. Normalize as chaves sem alterar cursos.
}
console.log(indexarCatalogo([{ id: 'js', tags: ['Web', ' JS '] }]));`,
    tasks: [
      requirement('index-structure', 'O índice usa Map e Sets, normaliza tags e elimina duplicatas.', 'Uma tag aponta para um conjunto de ids.', (doc, win, h) => {
        const fn = fnOf(h, win, 'indexarCatalogo'); const input = [{ id: 'a', tags: [' JS ', 'js', ''] }, { id: 'b', tags: ['js', 'DOM'] }, { id: 'a', tags: ['JS'] }];
        const result = fn(input);
        assert(Object.prototype.toString.call(result) === '[object Map]', 'Retorne uma instância de Map.');
        assert(same([...result.keys()], ['js', 'dom']), 'Normalize as tags, ignore vazias e preserve a ordem da primeira ocorrência.');
        assert(Object.prototype.toString.call(result.get('js')) === '[object Set]' && same([...result.get('js')], ['a', 'b']) && same([...result.get('dom')], ['b']), 'Cada valor deve ser um Set de ids únicos na ordem de ocorrência.');
      }),
      requirement('index-purity', 'Lista vazia e dados congelados funcionam; cada chamada cria um índice independente.', 'Não escreva nos arrays e objetos recebidos.', (doc, win, h) => {
        const fn = fnOf(h, win, 'indexarCatalogo'); const input = Object.freeze([Object.freeze({ id: 'c', tags: Object.freeze(['  API  ']) })]);
        const first = fn(input); const second = fn(input);
        assert(first !== second && first.get('api') !== second.get('api') && same([...first.get('api')], ['c']) && input[0].tags[0] === '  API  ', 'Crie estruturas independentes sem alterar as tags originais.');
        const empty = fn([]); assert(Object.prototype.toString.call(empty) === '[object Map]' && empty.size === 0, 'Lista vazia deve produzir um Map vazio.');
      }),
    ],
  }),
  stage({
    id: 'js-9-debounce', moduleId: 'mod-9', title: 'Event loop, debounce e cancelamento', minutes: 45,
    brief: 'Agrupe eventos frequentes e execute somente depois de um período sem novas chamadas. Preserve argumentos e contexto, e cancele trabalho pendente quando a interface sair de cena.',
    lesson: `### O tempo define a intenção
Uma pessoa pode digitar cinco letras antes de desejar resultados. Debounce adia uma ação e reinicia a espera quando outra chamada chega. Na variante trailing deste exercício, só a última chamada executa, depois de um intervalo sem novos eventos. Throttle resolve outra necessidade: limitar a frequência de execuções durante atividade contínua.

### Temporizadores não interrompem código
setTimeout agenda uma tarefa para depois de um atraso mínimo; ele não garante execução naquele instante exato. O código síncrono atual termina antes. Microtarefas de Promises também influenciam a ordem. Nunca use um loop de espera: ele bloqueia a interface em vez de ajudar o temporizador.

### Exemplo de contexto preservado
\`\`\`javascript
const relatorio = {
  prefixo: 'Relatório',
  mostrar(titulo) { console.log(this.prefixo, titulo); }
};
relatorio.mostrar.call({ prefixo: 'Resumo' }, 'semanal');
// Resumo semanal
\`\`\`

Seu wrapper precisa lembrar tanto os argumentos quanto o this da chamada mais recente. Uma função comum captura o this de quem chama; uma arrow interna pode preservá-lo até o temporizador disparar. Use apply quando for encaminhar todos os argumentos à função original.

### Teste sem depender do relógio real
Receber setTimeout e clearTimeout por dependência permite simular o agendamento. Isso testa cancelamento e ordem sem aguardar segundos. Na aplicação real, as funções padrão do navegador continuam funcionando.`,
    objectives: ['Implementar debounce trailing com cancelamento', 'Preservar argumentos e this e testar tempo com dependências controladas'],
    question: ['Três chamadas ocorrem antes de terminar o intervalo do debounce trailing. O que executa?', ['As três imediatamente', 'Somente a primeira', 'A última, após um período sem novas chamadas'], 2, 'Cada nova chamada cancela o agendamento anterior e inicia outro com os argumentos mais recentes.'],
    examples: [["buscar('j'); buscar('js'); avançar o relógio", "Uma chamada com 'js'"], ['buscar("dom"); buscar.cancelar(); avançar o relógio', 'Nenhuma chamada pendente executa']],
    hints: ['Guarde o id do temporizador dentro da closure.', 'Ao chamar o wrapper, cancele o id anterior e agende a execução com this e argumentos atuais.', 'Adicione wrapper.cancelar = função que limpa o temporizador pendente.'],
    practice: 'Aplique debounce a um campo de busca com 250 ms. Explique por que uma ação de salvar explicitamente pelo botão pode precisar de outra estratégia.',
    task: 'Implemente criarDebounce(fn,espera,temporizadores), retornando uma função com método cancelar(). temporizadores é opcional e seu padrão deve usar {setTimeout,clearTimeout} do navegador. Use as dependências recebidas quando fornecidas. Execute somente a última chamada após espera, preserve todos os argumentos e this, permita novas chamadas depois de executar ou cancelar e nunca execute imediatamente.',
    links: [mdn('Debounce', 'docs/Glossary/Debounce', 'Diferença entre agrupar chamadas e limitar sua frequência.'), mdn('setTimeout', 'docs/Web/API/Window/setTimeout', 'Agendamento de tarefas e por que o atraso real pode ser maior.')],
    script: `function criarDebounce(fn, espera, temporizadores = { setTimeout, clearTimeout }) {
  // Retorne uma função que reinicia a espera e possui cancelar().
}
// Use a função com um input depois de validar seu comportamento.`,
    tasks: [
      requirement('debounce-latest', 'Chamadas próximas executam uma vez com argumentos e contexto da última.', 'Cancele o agendamento anterior e encaminhe this com apply.', (doc, win, h) => {
        const create = fnOf(h, win, 'criarDebounce'); let id = 0; const jobs = new Map(); const seen = [];
        const timers = { setTimeout: (fn, delay) => { assert(delay === 80, 'Encaminhe o intervalo recebido ao temporizador.'); jobs.set(++id, fn); return id; }, clearTimeout: key => jobs.delete(key) };
        const wrapped = create(function (a, b) { seen.push([this.nome, a, b]); }, 80, timers);
        wrapped.call({ nome: 'antes' }, 1, 2); wrapped.call({ nome: 'depois' }, 3, 4);
        assert(seen.length === 0 && jobs.size === 1, 'Não execute imediatamente; mantenha somente o agendamento mais recente.');
        const current = [...jobs.values()]; jobs.clear(); current.forEach(job => job());
        assert(same(seen, [['depois', 3, 4]]), 'Preserve this e todos os argumentos da última chamada.');
      }),
      requirement('debounce-cancel', 'Cancelar é seguro e o wrapper pode ser reutilizado depois.', 'cancelar remove o temporizador sem inutilizar a função.', (doc, win, h) => {
        const create = fnOf(h, win, 'criarDebounce'); const jobs = new Map(); let id = 0; let calls = 0;
        const wrapped = create(() => { calls += 1; }, 20, { setTimeout: fn => { jobs.set(++id, fn); return id; }, clearTimeout: key => jobs.delete(key) });
        wrapped(); wrapped.cancelar(); wrapped.cancelar(); assert(jobs.size === 0 && calls === 0, 'Cancelar repetidamente deve remover o trabalho pendente sem executar.');
        wrapped(); const pending = [...jobs.values()]; jobs.clear(); pending.forEach(job => job());
        assert(calls === 1, 'Uma nova chamada após cancelar precisa continuar funcionando.');
      }),
      requirement('debounce-native', 'O comportamento padrão usa os temporizadores do navegador.', 'O terceiro parâmetro é opcional.', async (doc, win, h) => {
        const create = fnOf(h, win, 'criarDebounce'); const calls = []; const wrapped = create(value => calls.push(value), 10);
        wrapped('antigo'); wrapped('atual');
        assert(calls.length === 0, 'O debounce não deve executar de forma síncrona.');
        await new Promise(resolve => setTimeout(resolve, 50));
        assert(same(calls, ['atual']), 'Sem dependências explícitas, execute a última chamada usando setTimeout do navegador.');
      }),
    ],
  }),
  stage({
    id: 'js-9-project-catalog-search', moduleId: 'mod-9', title: 'Projeto: motor de busca de catálogo', category: 'Projeto', minutes: 100,
    brief: 'Entregue uma busca local com filtro de título, tag, limite e renderização segura. Separe o mecanismo de consulta da interface para testar cada responsabilidade.',
    lesson: `### Do requisito ao motor de consulta
O catálogo é um array de cursos com id, titulo e tags. A consulta recebe termo, tag e limite. Defina a semântica antes de escolher o algoritmo: título contém o termo; tags exigem igualdade após normalização; filtros combinados usam E; a ordem original do catálogo é mantida.

### Composição em vez de regras escondidas
Uma loja de produtos poderia aplicar os mesmos passos em outro domínio:

\`\`\`javascript
const emEstoque = produtos.filter(item => item.quantidade > 0);
const primeiraPagina = emEstoque.slice(0, 5);
console.log(primeiraPagina.map(item => item.nome));
\`\`\`

Prepare um índice de tags na criação do buscador se isso simplificar consultas repetidas. Não invente cache antes de definir como o catálogo muda. Neste projeto, ele é somente leitura após a criação; os resultados são arrays novos e seus objetos devem ser tratados como somente leitura.

### Interface é outra fronteira
renderizarResultados recebe cursos já selecionados. Limpe a lista anterior, crie um li por curso com textContent e atualize o resumo. Um título pode conter caracteres de marcação; ele continua sendo texto. Repetir a renderização não pode duplicar resultados.

Finalize conectando formulário, mecanismo e renderizador. O debounce é uma extensão útil para busca a cada tecla; a entrega obrigatória usa submit, que também funciona pelo teclado. Revise busca vazia, tag inexistente, limite zero e combinação sem resultados.`,
    objectives: ['Entregar busca local com critérios combinados e limites', 'Conectar consulta pura a uma interface segura e operável por formulário'],
    question: ['Uma consulta combina termo e tag. Qual curso entra no resultado?', ['Qualquer um que atenda a pelo menos um filtro', 'Somente o que atende aos dois filtros', 'Sempre o primeiro do catálogo'], 1, 'O contrato usa E: o título deve corresponder ao termo e a lista de tags deve conter a tag solicitada.'],
    examples: [["buscar({termo:'dom',tag:'web',limite:2})", 'Até dois cursos com dom no título e tag web, na ordem original'], ['buscar({limite:0})', '[]']],
    hints: ['Normalize termo e tag com trim e toLowerCase; ausência de filtro aceita todos.', 'Aplique os filtros antes de slice e não ordene ou altere o catálogo recebido.', 'No submit, use preventDefault, consulte o buscador e passe a saída ao renderizador.'],
    practice: 'Aplique o debounce da lição anterior ao evento input. Compare com submit e documente a decisão para uma interface com muitos resultados.',
    task: 'Implemente criarBuscador(catalogo), que retorna {buscar}. buscar({termo="",tag="",limite=10}={}) retorna array novo com título contendo termo e tag exatamente correspondente, ambos normalizados por trim e lowercase; filtros vazios aceitam todos. limite é inteiro >=0; preserve a ordem e o catálogo. Implemente renderizarResultados(cursos): substitua #resultados por li com títulos literais e defina #resumo como "N resultados". Conecte submit de #form-busca aos inputs #termo e #tag usando o catalogo inicial; renderize todos ao iniciar.',
    links: [mdn('Map para consultas preparadas', 'docs/Web/JavaScript/Reference/Global_Objects/Map', 'Use um índice quando ele reduzir o trabalho de consultas repetidas.'), mdn('Node.textContent', 'docs/Web/API/Node/textContent', 'Apresentação de conteúdo como texto literal.')],
    markup: '<form id="form-busca"><label for="termo">Título</label><input id="termo" type="search"><label for="tag">Tag</label><input id="tag"><button type="submit">Buscar</button></form><p id="resumo" role="status"></p><ul id="resultados"></ul>',
    script: `const catalogo = [
  { id: 'dom', titulo: 'DOM na prática', tags: ['web', 'javascript'] },
  { id: 'logica', titulo: 'Lógica com JavaScript', tags: ['fundamentos'] },
  { id: 'api', titulo: 'APIs no navegador', tags: ['web', 'async'] }
];
function criarBuscador(catalogo) {
  // Retorne { buscar } com filtros combinados e limite.
}
function renderizarResultados(cursos) {
  // Crie elementos seguros e atualize o resumo.
}
// Conecte o formulário e renderize o catálogo ao iniciar.`,
    projectBrief: {
      summary: 'Construa um catálogo pesquisável com mecanismo independente da interface e comportamento definido para filtros vazios e combinados.',
      deliverables: ['Fábrica criarBuscador com consulta testável', 'Formulário funcional por botão ou Enter', 'Resultados sem duplicação e texto seguro', 'Resumo de quantidade e experiência clara para zero resultados'],
      milestones: [{ title: '1. Contrato', description: 'Implemente normalização, filtros combinados e limite.' }, { title: '2. Apresentação', description: 'Renderize cursos sem inserir títulos como HTML.' }, { title: '3. Integração', description: 'Conecte submit e revise consultas vazias e sem correspondência.' }],
      rubric: ['Busca corresponde aos filtros em todos os casos previstos', 'Entradas e ordem do catálogo são preservadas', 'Repetir buscas substitui os resultados anteriores', 'Interface tem labels, botão semântico e resumo atualizado'],
      stretchGoals: ['Reutilize criarDebounce para buscar enquanto a pessoa digita.', 'Adicione paginação e explique quando reconstruir o índice caso o catálogo mude.'],
    },
    tasks: [
      requirement('search-contract', 'O mecanismo normaliza, combina filtros e respeita ordem e limite.', 'Aplique todos os filtros antes de limitar.', (doc, win, h) => {
        const create = fnOf(h, win, 'criarBuscador'); const data = [{ id: 'a', titulo: 'DOM Avançado', tags: [' WEB '] }, { id: 'b', titulo: 'DOM Inicial', tags: ['básico'] }, { id: 'c', titulo: 'DOM Eventos', tags: ['web'] }];
        const before = JSON.stringify(data); const api = create(data);
        assert(same(api.buscar({ termo: ' DOM ', tag: ' WEB ', limite: 1 }).map(item => item.id), ['a']), 'Normalize ambos os filtros, combine com E e respeite limite.');
        assert(same(api.buscar({ tag: 'web' }).map(item => item.id), ['a', 'c']), 'Tag usa correspondência exata normalizada na ordem original.');
        assert(api.buscar({ termo: 'ausente' }).length === 0 && api.buscar({ limite: 0 }).length === 0, 'Sem correspondências ou com limite zero, retorne [].');
        const all = api.buscar(); assert(same(all, data) && all !== data && JSON.stringify(data) === before, 'Consulta vazia retorna array novo sem modificar o catálogo.');
      }),
      requirement('search-render', 'Renderizar substitui resultados, mostra títulos literalmente e atualiza o resumo.', 'Crie li e atribua textContent; não interpole títulos em innerHTML.', (doc, win, h) => {
        const render = fnOf(h, win, 'renderizarResultados'); const title = '<img src=x onerror="alert(1)">';
        render([{ id: 'x', titulo: title, tags: [] }]);
        const items = [...doc.querySelectorAll('#resultados > li')];
        assert(items.length === 1 && items[0].textContent === title && !items[0].querySelector('img') && doc.querySelector('#resumo')?.textContent === '1 resultados', 'Exiba cada título literalmente em li e atualize N resultados.');
        render([]); assert(doc.querySelector('#resultados')?.children.length === 0 && doc.querySelector('#resumo')?.textContent === '0 resultados', 'Lista vazia deve remover resultados anteriores e mostrar 0 resultados.');
      }),
      requirement('search-integration', 'O formulário executa buscas com os dois campos e pode restaurar todos os resultados.', 'Use preventDefault no submit e renderize a consulta atual.', (doc, win) => {
        const term = doc.querySelector('#termo'); const tag = doc.querySelector('#tag'); const form = doc.querySelector('#form-busca');
        assert(term && tag && form, 'Preserve os elementos do formulário inicial.');
        term.value = ' dom '; tag.value = 'WEB'; form.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
        assert(same([...doc.querySelectorAll('#resultados > li')].map(item => item.textContent), ['DOM na prática']), 'O submit deve combinar título e tag usando o catálogo inicial.');
        term.value = ''; tag.value = ''; form.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
        assert(doc.querySelectorAll('#resultados > li').length === 3, 'Limpar os filtros e enviar deve restaurar os três cursos.');
      }),
    ],
  }),
];

const dashboardMarkup = '<form id="form-sessao"><label for="titulo">Título da sessão</label><input id="titulo" required><label for="minutos">Minutos (1 a 240)</label><input id="minutos" type="number" min="1" max="240" value="25" required><button type="submit">Adicionar sessão</button></form><label for="filtro">Exibir</label><select id="filtro"><option value="todas">Todas</option><option value="pendentes">Pendentes</option><option value="concluidas">Concluídas</option></select><p id="aviso" role="status" aria-live="polite"></p><p id="estatisticas"></p><p id="vazio">Nenhuma sessão neste filtro.</p><ul id="sessoes"></ul>';
const memoryStorage = (initial = null) => {
  const data = new Map(initial === null ? [] : [['devpath-sessoes', initial]]);
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, String(value)) };
};
async function withDashboard(doc, win, h, storage, evaluate) {
  const create = fnOf(h, win, 'iniciarPainel'); const root = doc.createElement('section'); root.innerHTML = dashboardMarkup; doc.body.appendChild(root); let api;
  try { api = create({ raiz: root, armazenamento: storage }); await evaluate(root, api); }
  finally { api?.destruir?.(); root.remove(); }
}
const professionalStages = [
  stage({
    id: 'js-10-async-controller', moduleId: 'mod-10', title: 'Concorrência e estados de uma interface assíncrona', minutes: 50,
    brief: 'Modele carregamento, sucesso, vazio e erro. Quando duas buscas se sobrepõem, permita que somente a solicitação mais recente publique seu resultado.',
    lesson: `### Ordem de início não é ordem de chegada
Uma busca por "j" pode começar antes de "javascript" e terminar depois. Sem coordenação, o resultado antigo sobrescreve a intenção atual. async/await torna o fluxo legível, mas não resolve essa disputa automaticamente.

### Versões de trabalho
Numere cada busca ao iniciá-la e guarde esse número localmente. Antes de publicar o resultado, compare com a versão atual do controlador. Somente a versão mais recente pode alterar a interface. Faça a mesma comparação no caminho de erro: uma falha antiga também é obsoleta.

Veja a ideia em uma prévia de documento:

\`\`\`javascript
let versao = 0;
async function prepararPrevia(converter, texto) {
  const minhaVersao = ++versao;
  const previa = await converter(texto);
  if (minhaVersao === versao) console.log(previa);
}
\`\`\`

### Estados explícitos
Use um formato uniforme com status, dados e erro. Ao iniciar, publique carregando com array vazio. Uma resposta não vazia é sucesso; array vazio é vazio; rejeição é erro com mensagem estável. A função carregadora será injetada, então os testes podem controlar qual Promise termina primeiro sem rede real.

Descartar resultados antigos não interrompe a operação subjacente. APIs que aceitam AbortSignal permitem também economizar trabalho, mas são uma extensão. Primeiro garanta a correção observável: a interface nunca deve voltar ao resultado de uma intenção anterior.`,
    objectives: ['Coordenar solicitações concorrentes com versões', 'Publicar estados uniformes e tratar erros atuais e obsoletos'],
    question: ['Uma busca antiga termina depois da busca atual. O controlador deve:', ['Publicar a antiga porque terminou por último', 'Ignorar seu resultado por ter uma versão anterior', 'Limpar todos os resultados'], 1, 'A versão representa a intenção mais recente, independentemente da ordem de conclusão da rede.'],
    examples: [['buscar("a") e depois buscar("ab"); "ab" resolve primeiro', 'Somente o resultado de "ab" pode ser publicado'], ['carregar rejeita na busca atual', "{status:'erro',dados:[],erro:'Falha ao carregar'}"]],
    hints: ['A fábrica guarda um contador; cada buscar incrementa e captura seu valor.', 'Publique carregando antes de await carregar(termo).', 'Compare a versão tanto depois do await quanto no catch antes de publicar.'],
    practice: 'Desenhe uma linha do tempo de duas buscas e marque início, conclusão e publicação. Depois explore um adaptador com AbortController fora do contrato principal.',
    task: 'Implemente criarControlador(carregar,publicar), retornando {buscar}. buscar(termo) é assíncrona e chama carregar(termo). Publique imediatamente {status:"carregando",dados:[],erro:null}; se a resposta array for não vazia, publique sucesso; se vazia, publique vazio, ambos com dados da resposta e erro:null. Rejeição atual publica {status:"erro",dados:[],erro:"Falha ao carregar"} e não escapa. Resultados ou erros de buscas anteriores não publicam após outra busca começar.',
    links: [mdn('Promises e encadeamento', 'docs/Web/JavaScript/Reference/Global_Objects/Promise', 'Estados de Promises, resolução e tratamento de rejeições.'), mdn('AbortController', 'docs/Web/API/AbortController', 'Extensão: cancelamento cooperativo de operações que aceitam sinais.')],
    script: `function criarControlador(carregar, publicar) {
  // Retorne buscar e preserve a versão da solicitação mais recente.
}
// Experimente carregar: async termo => [{ titulo: termo }].
// O desafio não precisa de conexão com uma API externa.`,
    tasks: [
      requirement('async-states', 'O controlador publica carregando, sucesso e vazio com formato uniforme.', 'Publique antes do await e escolha o estado final pelo tamanho do array.', async (doc, win, h) => {
        const create = fnOf(h, win, 'criarControlador'); const states = []; const terms = [];
        const api = create(async term => { terms.push(term); return term ? [{ id: term }] : []; }, state => states.push(state));
        const pending = api.buscar('dom'); assert(same(states[0], { status: 'carregando', dados: [], erro: null }), 'Publique carregando imediatamente, com dados vazios e erro null.');
        await pending; assert(same(states[1], { status: 'sucesso', dados: [{ id: 'dom' }], erro: null }), 'Uma resposta não vazia deve publicar sucesso e seus dados.');
        await api.buscar(''); assert(same(states[3], { status: 'vazio', dados: [], erro: null }) && same(terms, ['dom', '']), 'Encaminhe o termo e represente a resposta vazia explicitamente.');
      }),
      requirement('async-race', 'Resultados antigos não sobrescrevem a busca mais recente.', 'Compare a versão capturada com a atual antes de publicar.', async (doc, win, h) => {
        const create = fnOf(h, win, 'criarControlador'); const states = []; const resolvers = new Map();
        const api = create(term => new Promise(resolve => resolvers.set(term, resolve)), state => states.push(state));
        const first = api.buscar('antiga'); const last = api.buscar('atual');
        resolvers.get('atual')([{ id: 'novo' }]); await last; resolvers.get('antiga')([{ id: 'velho' }]); await first;
        assert(states.length === 3 && same(states[2], { status: 'sucesso', dados: [{ id: 'novo' }], erro: null }), 'Depois da resposta atual, ignore a resposta antiga sem publicar outro estado.');
      }),
      requirement('async-errors', 'Erros atuais são tratados e erros antigos não alteram a interface.', 'A verificação de versão também pertence ao catch.', async (doc, win, h) => {
        const create = fnOf(h, win, 'criarControlador'); const states = []; const jobs = new Map();
        const api = create(term => new Promise((resolve, reject) => jobs.set(term, { resolve, reject })), state => states.push(state));
        const old = api.buscar('antiga'); const current = api.buscar('atual');
        jobs.get('atual').reject(new Error('segredo interno')); await current;
        jobs.get('antiga').reject(new Error('antigo')); await old;
        assert(states.length === 3 && same(states[2], { status: 'erro', dados: [], erro: 'Falha ao carregar' }), 'Trate a rejeição atual com mensagem estável e descarte a rejeição obsoleta.');
      }),
    ],
  }),
  stage({
    id: 'js-10-accessible-status', moduleId: 'mod-10', title: 'Acessibilidade nos estados dinâmicos', minutes: 35,
    brief: 'A interface precisa comunicar mudanças sem exigir que a pessoa as perceba visualmente. Atualize estado ocupado, mensagens e controles preservando o foco de quem navega por teclado.',
    lesson: `### A mudança também precisa ser percebida
Uma lista nova no DOM não informa, por si só, o que aconteceu. Use uma região de status presente desde o carregamento da página e atualize seu texto. role="status" tem anúncio educado implícito: é adequado para uma contagem que não deve interromper a atividade atual.

### Separe região ocupada e mensagem
aria-busy indica que uma região está em atualização; ele não bloqueia interações. O botão pode usar disabled durante o carregamento para impedir envios repetidos. Nesta página, a região de status fica fora do painel ocupado para que a mensagem de carregamento não dependa do término daquela atualização.

### Exemplo em outro fluxo
\`\`\`javascript
const aviso = document.querySelector('#aviso-upload');
aviso.textContent = 'Arquivo enviado';
// A região já existe com role="status"; não mova o foco para ela.
\`\`\`

### Foco faz parte do estado
Evite reconstruir o formulário inteiro depois de receber dados. Isso remove o campo que a pessoa está usando e pode perder o foco. Atualize apenas os nós necessários. Elementos nativos fornecem semântica e comportamento de teclado; um div clicável exigiria trabalho adicional.

Os critérios automáticos verificam atributos, mensagens e preservação de foco no campo. Eles não substituem uma revisão manual com teclado e leitor de tela. Faça esse percurso como parte da entrega, observando se a ordem de leitura e o anúncio das mudanças fazem sentido.`,
    objectives: ['Comunicar estados dinâmicos com status e aria-busy', 'Atualizar a interface sem remover o foco do campo de busca'],
    question: ['O que aria-busy="true" faz por si só?', ['Desabilita todos os controles', 'Indica que a região está sendo atualizada', 'Move o foco para a região'], 1, 'aria-busy comunica o estado às tecnologias assistivas. Bloqueio de controles e foco precisam de decisões separadas.'],
    examples: [["atualizarStatus({status:'carregando'})", 'Painel ocupado, botão desabilitado, mensagem Carregando…'], ["atualizarStatus({status:'sucesso',total:3})", 'Painel disponível, botão habilitado, mensagem 3 resultados']],
    hints: ['Obtenha os elementos existentes e altere propriedades em vez de recriar o formulário.', 'aria-busy recebe a string true ou false; disabled recebe booleano.', 'Escolha o texto pelo estado, mantenha role=status e não chame focus para anunciar.'],
    practice: 'Percorra a página com Tab, envie a busca e retorne ao campo. Use um leitor de tela disponível para revisar se as mudanças são anunciadas sem interromper a digitação.',
    task: 'Implemente atualizarStatus({status,total=0}). Em carregando: #painel aria-busy="true", #buscar.disabled=true e #aviso="Carregando…". Nos demais estados, aria-busy="false" e botão habilitado. sucesso mostra "N resultados"; vazio mostra "Nenhum resultado"; erro mostra "Falha ao carregar". Preserve #aviso com role="status", o formulário nativo e o foco no campo #consulta. Não substitua os controles.',
    links: [mdn('ARIA status', 'docs/Web/Accessibility/ARIA/Reference/Roles/status_role', 'Mensagens dinâmicas que não exigem mover o foco.'), mdn('aria-busy', 'docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy', 'Como comunicar que uma região está em atualização.')],
    markup: '<form id="form-status"><label for="consulta">Consulta</label><input id="consulta" type="search"><button id="buscar" type="submit">Buscar</button></form><p id="aviso" role="status" aria-live="polite"></p><section id="painel" aria-busy="false"><h2>Resultados</h2><ul id="lista"></ul></section>',
    script: `function atualizarStatus({ status, total = 0 }) {
  // Atualize mensagens, aria-busy e disabled sem recriar os controles.
}
document.querySelector('#form-status').addEventListener('submit', event => {
  event.preventDefault();
  atualizarStatus({ status: 'carregando' });
  setTimeout(() => atualizarStatus({ status: 'vazio' }), 500);
});`,
    tasks: [
      requirement('a11y-states', 'Os quatro estados atualizam mensagem, busy e disponibilidade do botão.', 'Trate cada estado e limpe o estado ocupado após a conclusão.', (doc, win, h) => {
        const update = fnOf(h, win, 'atualizarStatus');
        for (const [status, total, message] of [['carregando', 0, 'Carregando…'], ['sucesso', 3, '3 resultados'], ['vazio', 0, 'Nenhum resultado'], ['erro', 0, 'Falha ao carregar']]) {
          update({ status, total });
          assert(doc.querySelector('#aviso')?.textContent === message && doc.querySelector('#painel')?.getAttribute('aria-busy') === String(status === 'carregando') && doc.querySelector('#buscar')?.disabled === (status === 'carregando'), `Confira mensagem, aria-busy e disabled para o estado ${status}.`);
        }
      }),
      requirement('a11y-focus', 'A região de status, labels, controles nativos e foco são preservados.', 'Atualize nós existentes e mantenha a região de status fora do painel ocupado.', (doc, win, h) => {
        const update = fnOf(h, win, 'atualizarStatus'); const input = doc.querySelector('#consulta'); input?.focus();
        update({ status: 'carregando' }); update({ status: 'sucesso', total: 2 });
        assert(doc.querySelector('#consulta') === input && doc.activeElement === input, 'O campo e seu foco devem permanecer após atualizar a busca.');
        assert(doc.querySelector('label[for="consulta"]') && doc.querySelector('#buscar')?.tagName === 'BUTTON' && doc.querySelector('#aviso')?.getAttribute('role') === 'status' && !doc.querySelector('#painel')?.contains(doc.querySelector('#aviso')), 'Preserve label, botão nativo e região de status fora do painel ocupado.');
      }),
    ],
  }),
  stage({
    id: 'js-10-persistence-boundary', moduleId: 'mod-10', title: 'Persistência versionada e recuperação de falhas', minutes: 45,
    brief: 'Trate armazenamento como uma fronteira que pode falhar. Valide a estrutura do JSON, versione seu formato e permita que a aplicação continue funcionando quando ler ou salvar não for possível.',
    lesson: `### JSON válido não significa dado válido
JSON.parse pode devolver um número, null ou um objeto com campos inesperados. Depois do parse, valide o formato que sua aplicação aceita. Uma versão explícita evita interpretar silenciosamente dados escritos por um contrato diferente.

### Um envelope de dados
Em uma aplicação de preferências, o formato poderia ser:

\`\`\`javascript
const preferencia = { versao: 1, tema: 'escuro' };
const texto = JSON.stringify(preferencia);
const recuperada = JSON.parse(texto);
console.log(recuperada.versao === 1); // true
\`\`\`

Seu repositório de sessões usará outro envelope: versao e sessoes. Cada sessão tem id único, título com conteúdo, minutos inteiros na faixa e concluida booleano. Se qualquer item for inválido, rejeite o documento inteiro retornando []. Filtrar silenciosamente itens inválidos esconderia perda de dados.

### Falhas são parte do contrato
getItem e setItem podem lançar erros. O leitor retorna [] para ausência, JSON inválido, versão desconhecida, estrutura incorreta ou falha de leitura. O gravador retorna true quando consegue salvar e false quando a operação falha ou os dados são inválidos. Não sobrescreva dados existentes quando a validação falha.

Receba armazenamento por parâmetro para testar sem depender de localStorage real. Uma futura migração de versão deve ser deliberada: ler a versão antiga, converter, validar e só então gravar. A lição atual estabelece essa fronteira, sem inventar migrações ainda inexistentes.`,
    objectives: ['Validar um envelope persistido e suas sessões', 'Recuperar falhas de leitura e escrita com resultados explícitos'],
    question: ['JSON.parse retornou um objeto. Isso basta para usar seus dados?', ['Sim, JSON já garante os campos de negócio', 'Não; versão, coleção e campos ainda precisam ser validados', 'Sim, desde que seja um objeto grande'], 1, 'O parser valida a sintaxe JSON. O contrato da aplicação continua sendo responsabilidade do programa.'],
    examples: [["storage['devpath-sessoes'] = '{quebrado'", 'carregar() retorna [] sem lançar erro'], ['salvar(sessoesValidas)', 'Grava {versao:1,sessoes:[...]} e retorna true']],
    hints: ['Crie uma função de validação reutilizada na leitura e na escrita.', 'Valide array, tipos, faixa de minutos e ids únicos antes de aceitar o documento.', 'Envolva parse, getItem e setItem nos caminhos de tratamento de erro previstos.'],
    practice: 'Escreva uma proposta de versão 2 com data da sessão. Descreva o que faria com registros antigos sem data e como provaria que a migração não perde informações.',
    task: 'Implemente criarRepositorio(armazenamento), retornando {carregar,salvar}. Use a chave "devpath-sessoes" e o formato {versao:1,sessoes}. Sessão válida: id string não vazia após trim e único, titulo string não vazia após trim, minutos inteiro 1..240 e concluida booleano. carregar() retorna sessões válidas ou [] para ausência, JSON/estrutura/versão inválidos e falhas de leitura. salvar(sessoes) valida, grava o envelope e retorna true; dados inválidos ou falhas retornam false sem lançar. Não altere os dados recebidos.',
    links: [mdn('JSON.parse e erros de sintaxe', 'docs/Web/JavaScript/Reference/Global_Objects/JSON/parse', 'Converter texto não substitui a validação do contrato.'), mdn('Storage.setItem', 'docs/Web/API/Storage/setItem', 'Escrita de strings e exceções possíveis no armazenamento.')],
    script: `function criarRepositorio(armazenamento) {
  // API carregar/salvar com validação de envelope e tratamento de falhas.
}
// Experimente primeiro um armazenamento em memória com getItem e setItem.`,
    tasks: [
      requirement('repository-roundtrip', 'Dados válidos são gravados no envelope correto e recuperados sem mutação.', 'Use uma única chave e preserve todos os campos do contrato.', (doc, win, h) => {
        const create = fnOf(h, win, 'criarRepositorio'); const storage = memoryStorage(); const repo = create(storage);
        const sessions = Object.freeze([Object.freeze({ id: 'a', titulo: 'DOM', minutos: 25, concluida: false })]);
        assert(repo.salvar(sessions) === true && same(JSON.parse(storage.getItem('devpath-sessoes')), { versao: 1, sessoes: sessions }), 'salvar deve retornar true e gravar o envelope versao:1 com sessoes.');
        assert(same(repo.carregar(), sessions), 'Recupere todas as sessões válidas e seus campos.');
      }),
      requirement('repository-corruption', 'Ausência, JSON inválido, versões desconhecidas e sessões inválidas retornam [].', 'Valide o envelope e cada item; não aceite coleções parcialmente válidas.', (doc, win, h) => {
        const create = fnOf(h, win, 'criarRepositorio'); const valid = { id: 'a', titulo: 'DOM', minutos: 25, concluida: false };
        const invalids = [null, '{quebrado', 'null', '42', JSON.stringify({ versao: 2, sessoes: [valid] }), JSON.stringify({ versao: 1, sessoes: {} })];
        for (const patch of [{ id: '' }, { titulo: ' ' }, { minutos: '25' }, { minutos: 0 }, { minutos: 241 }, { concluida: 'false' }]) invalids.push(JSON.stringify({ versao: 1, sessoes: [valid, { ...valid, id: 'b', ...patch }] }));
        invalids.push(JSON.stringify({ versao: 1, sessoes: [valid, valid] }));
        for (const content of invalids) assert(same(create(memoryStorage(content)).carregar(), []), 'Dados inválidos, inclusive ids duplicados, precisam resultar em [].');
      }),
      requirement('repository-failure', 'Falhas de armazenamento e tentativas inválidas não escapam nem substituem dados válidos.', 'Retorne false quando salvar não for possível.', (doc, win, h) => {
        const create = fnOf(h, win, 'criarRepositorio'); const broken = create({ getItem: () => { throw new Error('leitura'); }, setItem: () => { throw new Error('escrita'); } });
        assert(same(broken.carregar(), []) && broken.salvar([]) === false, 'Trate tanto falhas de leitura quanto de escrita.');
        const storage = memoryStorage('preservar'); const repo = create(storage);
        assert(repo.salvar([{ id: 'a', titulo: '', minutos: 20, concluida: false }]) === false && storage.getItem('devpath-sessoes') === 'preservar', 'Valide antes de gravar e preserve dados anteriores quando a entrada for inválida.');
      }),
    ],
  }),
  stage({
    id: 'js-10-project-learning-dashboard', moduleId: 'mod-10', title: 'Projeto Master: dashboard de estudos', category: 'Projeto', minutes: 180, isCapstone: true,
    brief: 'Integre a formação em um produto de portfólio: registre sessões, acompanhe minutos concluídos, filtre o progresso e recupere seus dados com uma interface acessível e resiliente.',
    lesson: `### Uma entrega completa
O dashboard reúne regras, estado, eventos, apresentação e armazenamento. O objetivo é explicar como essas partes colaboram. Reutilize o que aprendeu sobre funções puras, validação e fronteiras: comece pelo modelo de sessão antes de conectar cliques.

### Contrato da sessão
Cada sessão tem id único, titulo normalizado, minutos inteiros de 1 a 240 e concluida booleano. Estatísticas são derivadas da coleção completa; filtros mudam apenas a lista visível. Os minutos contabilizados no painel pertencem somente às sessões concluídas.

### Organize o fluxo
Uma alteração percorre validar → atualizar estado → persistir → renderizar. Falha de escrita não deve apagar a mudança em memória: avise a pessoa e mantenha a interface utilizável. Na inicialização, recupere o envelope da lição anterior; dados inválidos iniciam uma lista vazia.

Como exemplo de separação, um painel de entregas poderia ter selecionarEntregas, calcularTotais e renderizarEntregas. Esses nomes expressam três responsabilidades diferentes. Use a mesma clareza para suas sessões, escolhendo funções pequenas e sem dependências escondidas.

### Revisão de portfólio
Conecte controles nativos e mostre títulos com textContent. Exponha iniciarPainel para permitir uma raiz e um armazenamento de teste; exponha destruir para remover os ouvintes ao sair da tela. Documente as decisões de ids, validação e persistência em comentários ou README exportado com o projeto. Conclua com uma demonstração: criar, concluir, filtrar, recarregar e simular uma falha de escrita.`,
    objectives: ['Entregar uma aplicação integrada com estado, persistência e filtros', 'Demonstrar resiliência, segurança de renderização e ciclo de vida da interface', 'Revisar e documentar decisões de um projeto de portfólio'],
    question: ['Ao filtrar somente pendentes, o total de sessões do painel deve:', ['Contar somente as pendentes visíveis', 'Continuar refletindo a coleção completa', 'Ser salvo como zero'], 1, 'O filtro modifica a visualização. As estatísticas representam o estado completo e devem ser derivadas dele.'],
    examples: [['Adicionar DOM/25, adicionar Testes/40 e concluir DOM', 'Total: 2 | Concluídas: 1 | Minutos concluídos: 25'], ['Aplicar filtro concluidas', 'Exibe apenas DOM; estatísticas continuam considerando as duas sessões']],
    hints: ['Modele o array de sessões e reutilize a validação e o envelope versao:1 da etapa anterior.', 'Centralize a renderização: filtre para a lista, mas calcule estatísticas usando o estado completo.', 'Use ids únicos e data-action nos botões; remova exatamente os ouvintes registrados em destruir.'],
    practice: 'Grave uma demonstração curta ou escreva um roteiro mostrando os casos principais, uma falha recuperável e três decisões técnicas. Execute também uma revisão manual com teclado.',
    task: 'Implemente iniciarPainel({raiz=document,armazenamento=localStorage}={}) e chame-a ao iniciar. Retorne {obterSessoes,destruir}; obterSessoes retorna uma cópia dos dados e destruir remove os ouvintes. Use os elementos fornecidos: submit de #form-sessao lê #titulo e #minutos, valida, cria id único, inicia concluida:false e limpa título. Em #sessoes, cada li tem data-id, título literal e botões data-action="concluir" (alterna) e "excluir". #filtro aceita todas/pendentes/concluidas. #estatisticas mostra exatamente "Total: N | Concluídas: N | Minutos concluídos: N" da coleção completa; #vazio aparece apenas sem itens visíveis. Leia/grave o envelope {versao:1,sessoes} em devpath-sessoes. Dados inválidos iniciam []; falha ao salvar mantém os dados em memória e anuncia "Não foi possível salvar." em #aviso.',
    links: [mdn('Eventos e addEventListener', 'docs/Web/API/EventTarget/addEventListener', 'Registre e remova ouvintes com referências estáveis.'), mdn('Storage.setItem', 'docs/Web/API/Storage/setItem', 'Persistência como dependência que pode falhar.'), mdn('ARIA status', 'docs/Web/Accessibility/ARIA/Reference/Roles/status_role', 'Comunique mudanças e falhas sem interromper o foco.')],
    markup: dashboardMarkup,
    script: `function iniciarPainel({ raiz = document, armazenamento = localStorage } = {}) {
  // 1. Recupere e valide sessoes.
  // 2. Implemente ações, filtros, estatísticas e persistência.
  // 3. Conecte eventos e retorne obterSessoes/destruir.
}
iniciarPainel();`,
    projectBrief: {
      summary: 'Entregue um dashboard de estudos completo e documente como suas decisões mantêm estado, interface e persistência coerentes.',
      deliverables: ['Cadastro validado com ids únicos, conclusão e exclusão', 'Filtros e estatísticas derivadas da coleção completa', 'Persistência versionada com recuperação de dados inválidos', 'Aviso de falha sem perder a sessão atual', 'Controles semânticos, títulos literais e cancelamento de ouvintes', 'Demonstração dos fluxos e explicação das decisões técnicas'],
      milestones: [{ title: '1. Domínio', description: 'Defina a sessão, valide entradas e derive estatísticas sem DOM.' }, { title: '2. Interação', description: 'Implemente cadastro, ações por id, filtros e estado vazio.' }, { title: '3. Persistência', description: 'Recupere e grave o envelope; simule JSON inválido e erro de escrita.' }, { title: '4. Entrega', description: 'Revise teclado, foco e texto seguro; documente o projeto e demonstre todos os fluxos.' }],
      rubric: ['Ações mantêm estado, lista e estatísticas sincronizados', 'Filtros nunca removem sessões do estado persistido', 'Falha de armazenamento é comunicada sem descartar mudanças em memória', 'Texto do usuário não vira HTML e os controles funcionam por teclado', 'Instâncias podem ser montadas e desmontadas sem ouvintes residuais', 'A demonstração explica escolhas e limites da implementação'],
      stretchGoals: ['Adicione catálogo de conteúdos usando o buscador do módulo 9.', 'Integre sugestões assíncronas com o controlador que ignora resultados obsoletos.', 'Exporte sessões como JSON e proponha testes de importação e migração de versão.'],
    },
    tasks: [
      requirement('dashboard-crud', 'Cadastro, conclusão, exclusão e estatísticas permanecem sincronizados.', 'Atualize estado antes de salvar e renderizar.', (doc, win, h) => withDashboard(doc, win, h, memoryStorage(), (root, api) => {
        const add = (title, minutes) => { root.querySelector('#titulo').value = title; root.querySelector('#minutos').value = minutes; root.querySelector('#form-sessao').dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true })); };
        add('  DOM  ', 25); add('Testes', 40); const sessions = api.obterSessoes();
        assert(sessions.length === 2 && sessions[0].titulo === 'DOM' && sessions.every(item => typeof item.id === 'string' && item.id.trim() && item.concluida === false) && sessions[0].id !== sessions[1].id && root.querySelector('#titulo').value === '', 'Normalize títulos, gere ids únicos, inicie pendentes e limpe o campo após adicionar.');
        root.querySelector('#sessoes [data-action="concluir"]').click();
        assert(api.obterSessoes()[0].concluida === true && root.querySelector('#estatisticas').textContent === 'Total: 2 | Concluídas: 1 | Minutos concluídos: 25', 'Concluir deve atualizar estado e estatísticas da coleção completa.');
        root.querySelector('#sessoes [data-action="concluir"]').click(); assert(api.obterSessoes()[0].concluida === false, 'Concluir deve alternar entre pendente e concluída.');
        root.querySelector('#sessoes [data-action="excluir"]').click(); root.querySelector('#sessoes [data-action="excluir"]').click();
        assert(api.obterSessoes().length === 0 && root.querySelector('#sessoes').children.length === 0 && !root.querySelector('#vazio').hidden && root.querySelector('#estatisticas').textContent === 'Total: 0 | Concluídas: 0 | Minutos concluídos: 0', 'Excluir todas as sessões deve atualizar lista, estatísticas e estado vazio.');
      })),
      requirement('dashboard-validation', 'Entradas inválidas são recusadas, títulos são literais e snapshots não alteram o estado.', 'Reutilize o contrato de validação e use textContent.', (doc, win, h) => withDashboard(doc, win, h, memoryStorage(), (root, api) => {
        const submit = () => root.querySelector('#form-sessao').dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
        for (const [title, minutes] of [['   ', '20'], ['DOM', '0'], ['DOM', '241'], ['DOM', '1.5']]) { root.querySelector('#titulo').value = title; root.querySelector('#minutos').value = minutes; submit(); }
        assert(api.obterSessoes().length === 0, 'Recuse título vazio, minutos fora da faixa e minutos decimais.');
        root.querySelector('#titulo').value = '<b>Estudar</b>'; root.querySelector('#minutos').value = '10'; submit();
        const item = root.querySelector('#sessoes > li'); assert(item?.textContent.includes('<b>Estudar</b>') && !item.querySelector('b') && item.dataset.id === api.obterSessoes()[0].id, 'Renderize o título como texto literal e associe data-id ao id real.');
        const snapshot = api.obterSessoes(); snapshot[0].titulo = 'alterado'; snapshot.push({}); assert(api.obterSessoes().length === 1 && api.obterSessoes()[0].titulo === '<b>Estudar</b>', 'obterSessoes deve retornar uma cópia, inclusive dos objetos de sessão.');
      })),
      requirement('dashboard-persistence-filters', 'Recuperação, filtros e gravação preservam a coleção completa.', 'Filtre apenas na apresentação e mantenha o envelope versao:1.', (doc, win, h) => {
        const sessions = [{ id: 'a', titulo: 'DOM', minutos: 25, concluida: true }, { id: 'b', titulo: 'Testes', minutos: 40, concluida: false }]; const storage = memoryStorage(JSON.stringify({ versao: 1, sessoes: sessions }));
        return withDashboard(doc, win, h, storage, (root, api) => {
          assert(same(api.obterSessoes(), sessions), 'Recupere as sessões do envelope válido ao iniciar.');
          const filter = root.querySelector('#filtro'); filter.value = 'concluidas'; filter.dispatchEvent(new win.Event('change', { bubbles: true }));
          assert(root.querySelectorAll('#sessoes > li').length === 1 && root.querySelector('#sessoes > li').dataset.id === 'a' && root.querySelector('#estatisticas').textContent === 'Total: 2 | Concluídas: 1 | Minutos concluídos: 25', 'Filtro concluídas deve mudar somente a lista visível.');
          filter.value = 'pendentes'; filter.dispatchEvent(new win.Event('change', { bubbles: true })); assert(root.querySelectorAll('#sessoes > li').length === 1 && root.querySelector('#sessoes > li').dataset.id === 'b', 'Filtro pendentes deve mostrar apenas sessões não concluídas.');
          root.querySelector('#sessoes [data-action="concluir"]').click();
          assert(root.querySelectorAll('#sessoes > li').length === 0 && !root.querySelector('#vazio').hidden, 'Uma lista filtrada vazia precisa mostrar o estado vazio.');
          const saved = JSON.parse(storage.getItem('devpath-sessoes')); assert(saved.versao === 1 && saved.sessoes.length === 2 && saved.sessoes.every(item => item.concluida), 'Salve todas as sessões após a ação, independentemente do filtro.');
        });
      }),
      requirement('dashboard-resilience', 'Dados corrompidos e falha de escrita são recuperáveis; destruir remove ouvintes.', 'Trate armazenamento na fronteira e mantenha o estado em memória.', (doc, win, h) => withDashboard(doc, win, h, { getItem: () => '{quebrado', setItem: () => { throw new Error('sem espaço'); } }, (root, api) => {
        assert(same(api.obterSessoes(), []), 'JSON corrompido deve iniciar uma coleção vazia.');
        const add = () => { root.querySelector('#titulo').value = 'Continuar'; root.querySelector('#minutos').value = '15'; root.querySelector('#form-sessao').dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true })); };
        add(); assert(api.obterSessoes().length === 1 && root.querySelector('#sessoes > li') && root.querySelector('#aviso').textContent === 'Não foi possível salvar.' && root.querySelector('#aviso').getAttribute('role') === 'status', 'Falha ao salvar deve anunciar a mensagem e manter a sessão em memória e na interface.');
        api.destruir(); add(); assert(api.obterSessoes().length === 1, 'destruir precisa remover ouvintes para impedir alterações após desmontagem.');
      })),
    ],
  }),
];

export const advancedStages = [...architectureStages, ...qualityStages, ...professionalStages];
