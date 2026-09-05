export const trainingPhases = [
  { id: 'zero', title: '01 · Primeiros passos', description: 'Entenda os valores, transforme problemas em funções e organize dados. Comece sem experiência prévia em programação.', moduleIds: ['mod-1', 'mod-2', 'mod-3'] },
  { id: 'builder', title: '02 · Aplicações no navegador', description: 'Construa interfaces com HTML, CSS e JavaScript. Trabalhe com eventos, dados persistidos e APIs.', moduleIds: ['mod-4', 'mod-5', 'mod-6'] },
  { id: 'advanced', title: '03 · Arquitetura e qualidade', description: 'Escolha como organizar o código, proteja o estado e verifique comportamento, erros e desempenho.', moduleIds: ['mod-7', 'mod-8', 'mod-9'] },
  { id: 'master', title: '04 · Master: integração prática', description: 'Reúna os conhecimentos em uma aplicação com fluxos assíncronos, acessibilidade e recuperação de dados. Explique e revise suas decisões.', moduleIds: ['mod-10'] },
];

export const foundationModuleDetails = {
  'mod-1': { level: 'Iniciante', prerequisites: ['Um navegador com teclado e vontade de experimentar.'], outcomes: ['Distinguir tipos, converter entradas e validar valores.', 'Tomar decisões com condições e investigar erros observando os dados.'] },
  'mod-2': { level: 'Iniciante', prerequisites: ['Variáveis, tipos, operadores e condicionais do módulo 1.'], outcomes: ['Dividir um problema em funções com entradas e saídas claras.', 'Entender escopo e combinar regras em um jogo no console.'] },
  'mod-3': { level: 'Fundamentos aplicados', prerequisites: ['Funções, retorno e decomposição de problemas.'], outcomes: ['Percorrer, transformar e resumir arrays de objetos.', 'Calcular um carrinho sem modificar os dados recebidos.'] },
  'mod-4': { level: 'Intermediário', prerequisites: ['Funções, loops, arrays e objetos.'], outcomes: ['Estruturar HTML, organizar o layout com CSS e conectar eventos.', 'Controlar estado e interface em jogos e uma calculadora.'] },
  'mod-5': { level: 'Intermediário', prerequisites: ['Seleção do DOM, renderização e eventos de formulário.'], outcomes: ['Salvar e recuperar dados válidos com JSON e localStorage.', 'Criar interações temporizadas e um diário que sobrevive ao recarregamento.'] },
  'mod-6': { level: 'Intermediário', prerequisites: ['Objetos, funções, eventos e tratamento de dados persistidos.'], outcomes: ['Coordenar Promises e verificar respostas HTTP.', 'Apresentar carregamento, sucesso e erro de forma consistente.'] },
  'mod-7': { level: 'Avançado', prerequisites: ['DOM, estado, persistência e funções assíncronas.'], outcomes: ['Modelar comportamento com classes e closures.', 'Integrar inclusão, conclusão e exclusão em um gerenciador de tarefas.'] },
};

const project = (summary, deliverables, milestones, rubric, stretchGoals) => ({
  summary, deliverables, milestones: milestones.map(([title, description]) => ({ title, description })), rubric, stretchGoals,
});

export const existingProjectBriefs = {
  'odin-rock-paper-scissors-console': project(
    'Crie o motor de Pedra, Papel e Tesoura. Separe o sorteio da regra da rodada para poder testar todas as combinações antes de construir a interface.',
    ['getComputerChoice() que pode retornar rock, paper e scissors.', 'playRound(human, computer) com resultado human, computer ou draw.', 'Uma tabela manual das nove combinações e seus resultados.'],
    [['Desenhar as regras', 'Liste as três escolhas, empates e quem vence cada confronto.'], ['Implementar funções', 'Crie o sorteio e a comparação separadamente; normalize maiúsculas e minúsculas.'], ['Conferir os confrontos', 'Teste as nove combinações e explique por que o resultado não depende de uma única jogada.']],
    ['Todas as combinações retornam o vencedor correto.', 'Entradas em maiúsculas também funcionam.', 'O sorteio consegue produzir as três escolhas.'],
    ['Adicione uma função que recebe cinco pares de escolhas e retorna o placar final.', 'Defina e documente o comportamento para uma escolha inválida.'],
  ),
  'odin-calculator': project(
    'Construa uma calculadora com funções matemáticas separadas dos botões. O estado deve representar a entrada atual, a operação escolhida e o primeiro operando.',
    ['Operações add, subtract, multiply, divide e operate.', 'Botões para compor números, calcular e limpar.', 'Mensagem legível para divisão por zero e recuperação com C.'],
    [['Testar a matemática', 'Confira cada função isoladamente, incluindo valores negativos e divisão por zero.'], ['Conectar a entrada', 'Monte números com vários dígitos e guarde o operador sem perder o primeiro valor.'], ['Fechar o fluxo', 'Mostre o resultado ao pressionar igual e restaure todo o estado com C.']],
    ['As quatro operações funcionam com diferentes operandos.', '12 + 3 mostra 15; limpar permite começar um novo cálculo.', 'A divisão por zero mostra um erro, sem Infinity ou NaN.'],
    ['Adicione teclado e casas decimais.', 'Documente o comportamento ao pressionar operadores consecutivos.'],
  ),
  'js-17-grand-capstone-app': project(
    'Entregue um gerenciador de tarefas que mantém dados, interface e armazenamento sincronizados. Este projeto consolida os módulos de fundamentos e aplicações no navegador.',
    ['Tarefas com id único, texto e estado feita.', 'Formulário, lista, botões de concluir/excluir e estatísticas.', 'Persistência em devpath-tarefas e recuperação de dados inválidos.'],
    [['Modelar e incluir', 'Defina o objeto tarefa, normalize o texto e crie uma primeira inclusão funcional.'], ['Concluir e excluir', 'Localize tarefas por id e atualize o estado antes de renderizar a tela.'], ['Persistir e recuperar', 'Salve cada alteração e valide o JSON ao carregar a aplicação.'], ['Revisar a experiência', 'Confira lista vazia, múltiplas inclusões, texto com marcação e contagens após cada ação.']],
    ['Texto vazio não cria uma tarefa e marcação aparece literalmente.', 'Concluir e excluir atualizam a lista, as estatísticas e o JSON.', 'Duas inclusões rápidas têm ids diferentes.', 'Após recarregar, as tarefas válidas são recuperadas.'],
    ['Implemente filtros sem remover tarefas do estado original.', 'Prepare um README com instalação, decisões de arquitetura e casos testados.'],
  ),
};
