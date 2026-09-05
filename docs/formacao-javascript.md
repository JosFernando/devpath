# Formação especializada em JavaScript

A formação organiza o estudo em **10 módulos e 4 fases**, do primeiro contato com programação à integração de uma aplicação no navegador. Cada aula tem explicação, exemplos e um desafio. Cada módulo termina com um projeto obrigatório que reúne os conceitos praticados nas etapas anteriores.

“Master” é o nome da fase de integração: o objetivo é construir, testar e explicar uma solução com mais autonomia. A conclusão da trilha registra os desafios realizados; não representa certificação, garantia de domínio profissional ou promessa de emprego.

## Escopo e ponto de partida

O ponto de partida é saber usar um navegador e editar texto. A sequência apresenta variáveis, condições, funções, loops e dados antes de avançar para interfaces e arquitetura. HTML e CSS entram como base para os projetos de DOM; o foco da formação é JavaScript no navegador.

O ambiente usa `index.html`, `style.css` e `script.js`, com prévia, console e validação dos desafios. O código de `script.js` é executado como script clássico. A aula de módulos explica `import` e `export`, mas a prática no editor usa fábricas e dependências explícitas; experimentar ES Modules em arquivos separados faz parte de uma extensão em um projeto próprio com servidor local.

Backend, bancos de dados, autenticação, frameworks como React e implantação em produção não são requisitos desta trilha. As integrações de dados concentram-se em contratos, estados de carregamento, respostas HTTP e tratamento de falhas. Consulte a guia **Fontes** da aula para aprofundar os conceitos nas referências selecionadas.

## Quatro fases de progressão

| Fase | Módulos | Resultado que você pratica |
| :--- | :--- | :--- |
| **01 · Primeiros passos** | 1–3 | Converter e validar valores, dividir problemas em funções e calcular resultados a partir de listas de objetos. |
| **02 · Aplicações no navegador** | 4–6 | Conectar HTML, CSS, eventos, persistência e dados assíncronos a interfaces que respondem às ações do usuário. |
| **03 · Arquitetura e qualidade** | 7–9 | Encapsular estado, separar regras de efeitos, verificar contratos e escolher estruturas e estratégias de busca. |
| **04 · Master: integração prática** | 10 | Integrar fluxos assíncronos, acesso por teclado e recuperação de dados em um dashboard de estudos, explicando as decisões adotadas. |

O roadmap mostra o progresso real de cada fase e os projetos concluídos. Abra um módulo para consultar seus objetivos e pré-requisitos. A estimativa de duração serve para organizar sessões de estudo; revisar, errar e experimentar pode exigir mais tempo.

## Módulos e projetos de fechamento

| Módulo | Conteúdos e habilidades | Projeto obrigatório ao final |
| :--- | :--- | :--- |
| **1. Fundamentos da Linguagem** | Variáveis, tipos, conversão numérica, operadores, condições e investigação de erros. | **Simulador de orçamento mensal:** validar renda e despesas, calcular saldo e distinguir déficit de entrada inválida. |
| **2. Funções & Resolução de Problemas** | Parâmetros, retornos, escopo, funções previsíveis, decomposição e pseudocódigo. | **Pedra, Papel e Tesoura no console:** separar o sorteio da regra da rodada e verificar as combinações de escolhas. |
| **3. Loops, Arrays & Objetos** | Repetição, propriedades, referências, transformação, filtragem e agregação. | **Motor de carrinho de compras:** validar itens, agregar quantidades e valores e aplicar desconto sem modificar a entrada. |
| **4. DOM, Eventos & Projetos** | Estrutura HTML, CSS, seleção e criação de elementos, formulários, eventos e estado visual. | **Calculadora no navegador:** integrar operações matemáticas, composição da entrada, limpeza e tratamento da divisão por zero. |
| **5. Web APIs & Persistência** | JSON, localStorage, temporizadores e recuperação de dados armazenados. | **Diário de estudo persistente:** registrar sessões de estudo e recuperar dados válidos após recarregar. |
| **6. JavaScript Assíncrono & APIs REST** | Promises, async/await, fetch, respostas HTTP e estados de carregamento, sucesso e erro. | **Painel de dados de uma API:** carregar dados e apresentar os estados da operação de forma consistente. |
| **7. POO & Tópicos Avançados** | Classes, encapsulamento, closures e integração entre estado, interface e armazenamento. | **Gerenciador de tarefas:** incluir, concluir e excluir tarefas, atualizar estatísticas e persistir alterações. |
| **8. Arquitetura de Aplicações** | Funções puras, composição, reducers imutáveis, fronteiras e injeção de dependências. | **Biblioteca de estado observável:** implementar leitura, envio de ações, inscrições independentes e cancelamento. |
| **9. Qualidade e Desempenho** | Contratos e testes de comportamento, estruturas Map/Set, busca e debounce. | **Motor de busca de catálogo:** combinar busca e filtros com resultados seguros e controle das atualizações. |
| **10. Integração Profissional e Master** | Concorrência, acessibilidade, persistência resiliente e revisão de uma aplicação completa. | **Dashboard de estudos:** integrar os fluxos da aplicação e verificar comportamento com teclado, respostas fora de ordem e dados inválidos. |

Há também projetos intermediários, como Pedra, Papel e Tesoura com interface e Etch-a-Sketch, que preparam o fechamento do módulo de DOM. O projeto do módulo 7 consolida a primeira aplicação completa; o projeto Master do módulo 10 acrescenta a integração dos conteúdos de arquitetura e qualidade.

## Como estudar uma aula

1. **Confira o objetivo.** Explique com suas palavras o que a aula pretende ensinar e observe como isso será usado no projeto do módulo.
2. **Preveja e execute.** Leia o exemplo, anote o resultado esperado e execute pequenas variações. Mude uma entrada ou condição por vez.
3. **Descreva o contrato.** Identifique entradas, saídas, casos inválidos e efeitos esperados. Esboce a solução em passos antes de escrever código.
4. **Implemente por partes.** Use o código inicial, acompanhe o console e execute o desafio após mudanças pequenas. Consulte as dicas progressivamente quando precisar.
5. **Investigue a falha.** Compare resultado esperado e observado, formule uma hipótese e confirme a correção com um caso que falhava e outro que já funcionava.
6. **Revise e avance.** Responda à pergunta de compreensão quando disponível e teste ao menos uma variação dos exemplos. Depois da validação, prossiga para a próxima etapa.

As etapas seguem uma sequência de dependências. O projeto é o fechamento do módulo, e sua aprovação faz parte do caminho até as etapas seguintes. O plano do projeto pode ser consultado durante as aulas para orientar o estudo; a execução do projeto é liberada após os pré-requisitos.

## Como realizar um projeto

Comece pelo **resumo**, confira os **entregáveis** e divida o trabalho pelos **marcos de implementação** do projeto. Faça uma versão pequena de cada fluxo funcionar antes de reunir todas as partes. A cada marco, preserve exemplos que demonstrem o comportamento e anotem decisões relevantes.

Use a **rubrica de revisão** para avaliar a solução além do resultado de uma execução. Por exemplo, um carrinho pode calcular o total correto de uma compra e ainda alterar os objetos recebidos; uma interface pode funcionar com clique e continuar inacessível por teclado. A revisão deve considerar os requisitos efetivos do projeto em questão.

### Definição de pronto

- Os arquivos atuais passam em todos os testes automáticos exigidos para a etapa.
- Cada entregável do briefing pode ser demonstrado com uma entrada ou ação reproduzível.
- Você revisou os itens da rubrica, incluindo as fronteiras e falhas previstas no contrato.
- Os exemplos adicionais pertinentes funcionam: lista vazia, zero, entradas incorretas, chamadas repetidas, recarregamento ou falha de requisição, conforme o projeto.
- Você consegue explicar o caminho dos dados, as responsabilidades das funções e uma decisão que tomou para resolver o problema.

Os testes automáticos liberam o avanço. A rubrica e os exemplos adicionais orientam a revisão do aluno; a plataforma não atribui uma nota automática a todos esses aspectos. Os testes cobrem comportamentos determinados e não provam que uma aplicação esteja pronta para qualquer cenário de produção.

### Extensões opcionais

Depois de fechar o contrato principal, escolha uma extensão do briefing e escreva seus próprios critérios antes de implementá-la. Exemplos são acrescentar teclado à calculadora, filtros ao gerenciador de tarefas, histórico à biblioteca de estado ou uma interface para uma regra inicialmente demonstrada no console.

Essas extensões aprofundam a prática e não bloqueiam a progressão da trilha. Se você levar o projeto a um repositório próprio, registre como executar, decisões, limitações e casos testados em um README. Preserve o contrato original quando voltar a executar a validação da plataforma.

## Progresso, rascunhos e expansão do currículo

O progresso e os arquivos editados ficam no `localStorage` do navegador. Use as ferramentas de **exportar** e **importar** progresso para guardar um backup ou mover seu trabalho para outro navegador. A persistência local depende do navegador e da origem em que a plataforma foi aberta; ela não implica sincronização entre dispositivos.

A expansão preserva os identificadores das etapas existentes. Os números visíveis podem mudar quando novas aulas são inseridas, mas as conclusões e os rascunhos continuam associados ao mesmo ID. Abrir a formação atualizada não substitui seu código salvo pelo novo código inicial.

Etapas que já estavam concluídas permanecem acessíveis. As novas etapas começam pendentes e seguem os pré-requisitos da sequência atual. Por isso, a porcentagem total pode diminuir com a adição de conteúdo, mesmo que nenhuma conquista anterior tenha sido removida. Retome as novas etapas para completar a formação ampliada e use a revisão dos projetos para consolidar o percurso.

## Organização do conteúdo no repositório

As fases, os objetivos dos módulos iniciais e os briefings de projetos existentes ficam em [`trainingStructure.js`](../src/data/trainingStructure.js). As expansões de fundamentos e especialização ficam em [`foundationExpansion.js`](../src/data/foundationExpansion.js) e [`advancedExpansion.js`](../src/data/advancedExpansion.js). [`roadmapData.js`](../src/data/roadmapData.js) reúne as etapas, preserva seus IDs e calcula a sequência apresentada no roadmap e no editor.

Ao contribuir com uma aula, mantenha o contrato consistente entre teoria, código inicial, exemplos, testes e projeto. Uma atualização deve aceitar implementações diferentes que cumpram o comportamento solicitado, sem depender de detalhes de código não exigidos pelo enunciado.
