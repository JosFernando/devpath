// ============================================================
// DEVPATH: SCHEMA & CURADORIA DE CONTEÚDO
// Filosofia The Odin Project: Open Curriculum, Project-Based
// ============================================================

export const curriculum = [
  {
    id: "foundations",
    slug: "fundamentos",
    title: "Fundamentos do Desenvolvimento Web",
    badge: "Início Obrigatório",
    description: "Aprenda como a web funciona por baixo dos panos, domine a linha de comando, Git/GitHub, HTML semântico, CSS moderno e lógica essencial de JavaScript construindo projetos reais.",
    level: "Iniciante",
    estimatedHours: 40,
    icon: "🧭",
    color: "from-emerald-500 to-teal-600",
    modules: [
      {
        id: "mod-web-and-git",
        title: "1. Como Funciona a Web & Git Essencial",
        overview: "Antes de escrever código, você precisa entender o ambiente onde ele roda: servidores, clientes, pacotes HTTP e a ferramenta que todo desenvolvedor usa todos os dias para salvar seu trabalho (Git).",
        lessons: [
          {
            id: "lesson-how-the-web-works",
            title: "Como a Web Funciona",
            readingTimeMinutes: 20,
            summary: "Entenda o modelo cliente-servidor, requisições HTTP, endereços IP, DNS e o ciclo de renderização no navegador.",
            learningObjectives: [
              "Compreender a diferença entre Cliente (front-end) e Servidor (back-end)",
              "Entender como o DNS traduz nomes de domínio em endereços IP",
              "Saber o que acontece quando você digita uma URL no navegador e aperta Enter",
              "Inspecionar requisições e respostas reais usando o DevTools (Network tab)"
            ],
            externalResources: [
              {
                source: "MDN Web Docs",
                title: "Como a Web Funciona: Uma Visão Geral",
                url: "https://developer.mozilla.org/pt-BR/docs/Learn/Getting_started_with_the_web/How_the_Web_works",
                type: "reading",
                summary: "Artigo introdutório clássico e oficial da Mozilla sobre o fluxo de pacotes."
              },
              {
                source: "The Odin Project",
                title: "How Does the Web Work?",
                url: "https://www.theodinproject.com/lessons/foundations-how-does-the-web-work",
                type: "reading",
                summary: "Curadoria sobre roteadores, clientes e servidores com analogias simples."
              },
              {
                source: "MDN Web Docs",
                title: "O que é um servidor web?",
                url: "https://developer.mozilla.org/pt-BR/docs/Learn/Common_questions/Web_mechanics/What_is_a_web_server",
                type: "reading",
                summary: "Diferença entre hardware de servidor e software de servidor (Apache, Nginx, Node)."
              }
            ],
            assignment: {
              title: "Mão na Massa: Inspecione a Web ao Vivo",
              instructions: "Nenhum conceito deve ficar apenas na teoria. Abra qualquer site (ex: google.com ou wikipedia.org), pressione F12 para abrir o DevTools e clique na aba 'Network' (Rede). Recarregue a página.",
              checklist: [
                "Abri a aba 'Network' (Rede) no DevTools do navegador",
                "Observei o primeiro documento HTML sendo baixado com status 200 OK",
                "Identifiquei as requisições subsequentes de CSS, imagens e scripts JS",
                "Entendi a diferença entre requisições GET e respostas do servidor"
              ]
            }
          },
          {
            id: "lesson-git-and-github",
            title: "Controle de Versão com Git & GitHub",
            readingTimeMinutes: 30,
            summary: "O Git é a máquina do tempo do programador. Aprenda a salvar versões do seu projeto, criar branches e sincronizar tudo no GitHub.",
            learningObjectives: [
              "Entender o que é um sistema de controle de versão distribuído",
              "Dominar o ciclo básico: git init, git status, git add e git commit",
              "Configurar chaves SSH e conectar seu repositório local ao GitHub",
              "Aprender a escrever mensagens de commit claras e semânticas"
            ],
            externalResources: [
              {
                source: "The Odin Project",
                title: "Git Basics",
                url: "https://www.theodinproject.com/lessons/foundations-git-basics",
                type: "reading",
                summary: "Tutorial prático para configurar o Git no terminal e subir o primeiro commit."
              },
              {
                source: "freeCodeCamp",
                title: "Guia de Git e GitHub para Iniciantes",
                url: "https://www.freecodecamp.org/portuguese/news/o-guia-para-iniciantes-do-git-e-do-github/",
                type: "reading",
                summary: "Explicação visual dos estados de um arquivo: working directory, staging area e repository."
              }
            ],
            assignment: {
              title: "Mão na Massa: Seu Primeiro Repositório Público",
              instructions: "Crie um repositório no GitHub chamado 'meu-aprendizado-devpath', clone na sua máquina, crie um arquivo README.md com suas metas e envie de volta com git push.",
              checklist: [
                "Instalei o Git e configurei meu 'user.name' e 'user.email'",
                "Criei uma conta no GitHub",
                "Inicializei um repositório local com git init e criei o README.md",
                "Fiz o primeiro commit e dei git push para o GitHub com sucesso"
              ]
            }
          },
          {
            id: "lesson-javascript-dom-events",
            title: "JavaScript: A Árvore do DOM & Manipulação de Eventos",
            readingTimeMinutes: 35,
            summary: "O JavaScript dá vida às páginas estáticas através da manipulação do Document Object Model (DOM) e escuta ativa de eventos do usuário.",
            learningObjectives: [
              "Entender como o navegador transforma tags HTML em objetos na memória (DOM)",
              "Selecionar elementos com querySelector e querySelectorAll",
              "Escutar interações do usuário com addEventListener ('click', 'submit', 'input')",
              "Impedir comportamentos nativos indesejados usando event.preventDefault()",
              "Compreender a regra de ouro: guardar dados em Arrays na memória, não apenas no HTML"
            ],
            externalResources: [
              {
                source: "MDN Web Docs",
                title: "Manipulando Documentos (DOM)",
                url: "https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents",
                type: "reading",
                summary: "Guia canônico da Mozilla sobre criação e alteração de nós no documento."
              },
              {
                source: "JavaScript.info",
                title: "Introduction to Browser Events",
                url: "https://javascript.info/introduction-browser-events",
                type: "reading",
                summary: "Didática impecável sobre como escutar eventos, o objeto Event e manipulação de formulários."
              },
              {
                source: "The Odin Project",
                title: "DOM Manipulation and Events",
                url: "https://www.theodinproject.com/lessons/foundations-dom-manipulation-and-events",
                type: "reading",
                summary: "Exercícios práticos com seletores, nós e eventos."
              }
            ],
            assignment: {
              title: "Mão na Massa: Conecte o JS ao HTML",
              instructions: "Crie um arquivo index.html simples com um botão e uma tag <h1>. No JavaScript, faça com que clicar no botão altere o texto do h1 para 'Você dominou o DOM!'.",
              checklist: [
                "Selecionei o botão com document.querySelector",
                "Adicionei o evento 'click' com addEventListener",
                "Modifiquei o textContent do elemento dinamicamente",
                "Testei no navegador e verifiquei o console sem erros"
              ]
            }
          }
        ],
        projects: [
          {
            id: "project-interactive-todo",
            title: "Projeto Final: Aplicação To-Do Mão na Massa",
            difficulty: "Desafiador mas Recompensador",
            overview: "Chegou o momento de juntar todas as peças! Você vai construir do zero uma aplicação completa de Lista de Tarefas (To-Do List) usando apenas HTML, CSS e JavaScript puro (Vanilla). Nada de copiar código pronto: este projeto testará sua capacidade de pensar como desenvolvedor.",
            estimatedTimeHours: 6,
            learningGoals: [
              "Separar claramente os Dados (Array na memória) da Interface Visual (DOM)",
              "Manipular eventos de formulário com preventDefault()",
              "Renderizar listas dinâmicas com .forEach() e document.createElement()",
              "Filtrar e excluir itens utilizando o método funcional Array.filter()",
              "Persistir os dados no navegador do usuário com localStorage e JSON"
            ],
            requirements: [
              "Campo de entrada (input) com botão para adicionar novas tarefas",
              "Não permitir a criação de tarefas vazias (com validação via JS)",
              "Listagem dinâmica de tarefas injetadas no elemento <ul>",
              "Checkbox ou botão para marcar/desmarcar tarefa como concluída (com estilo visual riscado)",
              "Botão de exclusão individual para cada tarefa",
              "Persistência no localStorage para que os dados sobrevivam ao recarregar a página (F5)"
            ],
            bonusTasks: [
              "Adicionar filtros visuais: 'Todas', 'Pendentes' e 'Concluídas'",
              "Adicionar um botão de ação rápida: 'Limpar Concluídas'",
              "Exibir contadores informativos (Total de tarefas vs Concluídas)"
            ],
            progressiveHints: [
              {
                step: 1,
                title: "💡 Dica 1: Como estruturar os dados na memória?",
                hint: "Evite ler ou contar elementos diretamente das tags <li>. Crie um array no topo do seu script: let tarefas = []. Cada tarefa deve ser um objeto com id (ex: Date.now()), texto e concluida (booleano). A tela deve ser apenas o espelho desse array!"
              },
              {
                step: 2,
                title: "💡 Dica 2: O formulário recarrega a página ao clicar no botão?",
                hint: "Por padrão histórico, a tag <form> recarrega a página no evento 'submit'. Para evitar isso em SPAs, chame event.preventDefault() logo na primeira linha da função do seu addEventListener('submit')."
              },
              {
                step: 3,
                title: "💡 Dica 3: Como remover um item usando Array.filter?",
                hint: "Ao clicar no botão de excluir, pegue o ID da tarefa clicada e faça: tarefas = tarefas.filter(t => t.id !== idClicado). Depois, chame sua função de renderizarTarefas() para atualizar a tela."
              },
              {
                step: 4,
                title: "💡 Dica 4: O localStorage dá erro com objetos?",
                hint: "O localStorage aceita apenas strings de texto. Converta seu array com JSON.stringify(tarefas) antes de salvar com setItem, e faça JSON.parse(localStorage.getItem('tarefas')) ao carregar a página."
              }
            ],
            submission: {
              requiresRepoUrl: true,
              requiresLiveUrl: false,
              instructions: "Quando concluir, suba o projeto para um repositório no seu GitHub (e opcionalmente publique no GitHub Pages ou Vercel). Cole o link aqui para marcar o projeto como entregue e desbloquear seu selo de conclusão!"
            }
          }
        ]
      }
    ]
  },
  {
    id: "javascript-deep-dive",
    slug: "javascript-avancado",
    title: "JavaScript Moderno & APIs",
    badge: "Próximo Passo",
    description: "Vá além do básico: domine ES6+, programação assíncrona, Promises, Async/Await, consumo de APIs REST, módulos e arquitetura limpa.",
    level: "Intermédio",
    estimatedHours: 50,
    icon: "⚡",
    color: "from-amber-500 to-orange-600",
    modules: []
  },
  {
    id: "react-framework",
    slug: "react",
    title: "Desenvolvimento Front-end com React",
    badge: "Especialização",
    description: "Construa interfaces modernas orientadas a componentes, hooks (useState, useEffect, custom hooks), gerenciamento de estado global e roteamento.",
    level: "Avançado",
    estimatedHours: 60,
    icon: "⚛️",
    color: "from-cyan-500 to-blue-600",
    modules: []
  }
];

