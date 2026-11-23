/**
 * ARCO 3 — conteúdo do site
 * ------------------------------------------------------------------
 * Todo o texto, contato, projetos e equipe ficam neste arquivo.
 * Campos com `null` ou listas vazias simplesmente não são exibidos,
 * então nada inventado aparece no site: basta preencher com os dados
 * reais (bio do Instagram, telefone, e-mail, endereço, fotos).
 *
 * Fotos de projetos: coloque os arquivos em `public/projetos/` e
 * aponte `image: "/projetos/nome-do-arquivo.jpg"`. Enquanto não houver
 * foto, o card mostra um desenho técnico gerado em SVG.
 */

export type DrawingKind = "elevation" | "plan" | "section" | "axon" | "detail" | "facade"

export interface Project {
  id: string
  title: string
  category: string
  /** Opcional: ano, cidade, área — só aparecem se preenchidos */
  year?: string | null
  location?: string | null
  area?: string | null
  /** Caminho para foto em /public. Sem foto → desenho técnico SVG. */
  image?: string | null
  drawing: DrawingKind
}

export interface TeamMember {
  name: string
  role: string
  photo?: string | null
}

export const site = {
  name: "Arco 3",
  legalName: "Arco 3 Arquitetura",
  wordmark: ["A", "R", "C", "O", "3"],

  instagram: {
    handle: "@arco3.arq",
    url: "https://www.instagram.com/arco3.arq/",
    dm: "https://ig.me/m/arco3.arq",
  },

  /** Preencha com os dados reais. `null` = não exibido. */
  contact: {
    email: null as string | null,
    phone: null as string | null,
    whatsapp: null as string | null, // ex.: "5511999999999"
    address: null as string | null,
    city: null as string | null,
  },

  nav: [
    { id: "filosofia", label: "Filosofia" },
    { id: "projetos", label: "Projetos" },
    { id: "servicos", label: "Serviços" },
    { id: "processo", label: "Processo" },
    { id: "estudio", label: "Estúdio" },
    { id: "contato", label: "Contato" },
  ],

  preloader: {
    words: ["A arquitetura", "é compreendida", "em camadas"],
    loading: "Carregando",
  },

  hero: {
    taglineSmall: ["Presença firme.", "Execução silenciosa."],
    statement: ["Estúdio de arquitetura", "guiado por precisão,", "matéria e intenção."],
    scroll: "Role para descobrir",
  },

  manifesto: {
    stack: ["Arquitetura", "Molda", "Percepção"],
    floating: ["Forma", "Luz", "Matéria", "Espaço", "Ritmo", "Proporção", "Silêncio", "Arco"],
    senses: ["Ver", "Ouvir", "Tocar", "Sentir"],
    we: "Nós",
  },

  vision: {
    label: "Nossa visão",
    items: [
      {
        title: "Firme",
        text: "Uma posição visual clara, construída com força, precisão e gravidade — uma presença que permanece depois do primeiro olhar.",
      },
      {
        title: "Preciso",
        text: "Um sistema rigoroso de decisões, em que cada detalhe é resolvido para gerar clareza, confiança e desempenho duradouro.",
      },
      {
        title: "Sereno",
        text: "Uma presença silenciosa, formada por contenção e equilíbrio — arquitetura que não grita, mas continua a ressoar.",
      },
    ],
  },

  approach: {
    label: "Nossa abordagem",
    title: ["A inspiração define a direção —", "a técnica a garante."],
    lead: "Traduzimos visão em arquitetura por meio de um processo estruturado, do primeiro traço ao último detalhe.",
    items: [
      {
        key: "Direção",
        title: ["Intenção", "antes da imagem"],
        text: "Todo projeto começa por uma direção arquitetônica clara, definida por proporção, hierarquia e lógica espacial. A forma precisa se sustentar diante da avaliação técnica e construtiva.",
        drawing: "elevation" as DrawingKind,
        caption: "Elevação — estudo de arco",
      },
      {
        key: "Sistema",
        title: ["Técnica", "como fundamento"],
        text: "Estrutura, tolerâncias e compatibilização entre disciplinas são resolvidas cedo. A arquitetura precisa ser construível, racional e exata — não apenas expressiva.",
        drawing: "plan" as DrawingKind,
        caption: "Planta — malha estrutural",
      },
      {
        key: "Matéria",
        title: ["Inteligência", "material"],
        text: "Materiais escolhidos por desempenho, longevidade, tato e relação com a luz. Autenticidade é essencial: cada superfície precisa justificar sua presença.",
        drawing: "section" as DrawingKind,
        caption: "Corte — camadas e luz",
      },
      {
        key: "Resolução",
        title: ["Detalhe", "como disciplina"],
        text: "Encontros, transições, alinhamentos e acabamentos são refinados em várias etapas. A ambiguidade é eliminada antes de a obra começar.",
        drawing: "detail" as DrawingKind,
        caption: "Detalhe — encontro de materiais",
      },
    ],
  },

  works: {
    label: "Projetos em destaque",
    loadMore: "Carregar mais",
    // Substitua pelos projetos reais do Instagram (título, categoria, foto).
    items: [
      { id: "p01", title: "Projeto 01", category: "Residencial", drawing: "facade" },
      { id: "p02", title: "Projeto 02", category: "Interiores", drawing: "plan" },
      { id: "p03", title: "Projeto 03", category: "Comercial", drawing: "axon" },
      { id: "p04", title: "Projeto 04", category: "Reforma", drawing: "section" },
      { id: "p05", title: "Projeto 05", category: "Residencial", drawing: "elevation" },
      { id: "p06", title: "Projeto 06", category: "Interiores", drawing: "detail" },
    ] as Project[],
  },

  services: {
    we: "Nós",
    do: "fazemos",
    items: [
      {
        title: "Arquitetura",
        text: "Projetos residenciais e comerciais, do estudo de implantação ao projeto executivo.",
        drawing: "facade" as DrawingKind,
      },
      {
        title: "Interiores",
        text: "Identidade espacial traduzida em uma experiência coerente, funcional e memorável.",
        drawing: "plan" as DrawingKind,
      },
      {
        title: "Reforma",
        text: "Requalificação de espaços existentes com leitura cuidadosa da estrutura e da luz.",
        drawing: "section" as DrawingKind,
      },
      {
        title: "Consultoria",
        text: "Potencial do terreno, programa e estratégia esclarecidos antes do projeto começar.",
        drawing: "axon" as DrawingKind,
      },
      {
        title: "Obra",
        text: "Acompanhamento técnico para que o que foi desenhado seja exatamente o que é construído.",
        drawing: "detail" as DrawingKind,
      },
    ],
  },

  process: {
    label: "Processo",
    title: "Cada projeto é estruturado em uma sequência de etapas claramente definidas.",
    scopeLabel: "Escopo",
    steps: [
      {
        title: "Briefing & Diagnóstico",
        text: "Escutamos o cliente, lemos o terreno ou o espaço existente e organizamos programa, referências, prazos e orçamento. É aqui que a pergunta certa é formulada.",
        scope: ["Reunião de briefing", "Levantamento do local", "Programa de necessidades", "Análise de legislação", "Cronograma inicial"],
      },
      {
        title: "Estudo Preliminar",
        text: "Definimos a direção espacial e visual do projeto: implantação, fluxos, proporções, linguagem material e atmosfera, organizados em um conceito coerente.",
        scope: ["Opções de implantação ou layout", "Zoneamento funcional", "Conceito arquitetônico e de interiores", "Direção de materiais", "Volumetria e imagens conceituais"],
      },
      {
        title: "Anteprojeto",
        text: "O conceito aprovado ganha precisão: dimensões, sistemas construtivos, iluminação e mobiliário passam a dialogar com a técnica.",
        scope: ["Plantas, cortes e elevações", "Pré-dimensionamento", "Estudo de iluminação", "Seleção de acabamentos", "Imagens 3D"],
      },
      {
        title: "Projeto Executivo",
        text: "Cada encontro, tolerância e especificação é resolvido no papel, para que a obra aconteça sem improviso.",
        scope: ["Detalhamento construtivo", "Compatibilização de projetos", "Caderno de especificações", "Paginações e marcenaria", "Aprovações legais"],
      },
      {
        title: "Acompanhamento de Obra",
        text: "Presença técnica no canteiro para garantir que o desenho se transforme, com fidelidade, em espaço construído.",
        scope: ["Visitas técnicas", "Apoio a fornecedores", "Ajustes de projeto", "Vistoria final"],
      },
    ],
  },

  studio: {
    label: "Estúdio",
    statement:
      "O arco é a forma que transforma peso em equilíbrio. É assim que pensamos cada projeto: forças em diálogo, matéria em repouso e espaço que acolhe quem o habita.",
    principles: [
      { title: "Escuta", text: "Cada projeto nasce de uma conversa atenta com quem vai viver o espaço." },
      { title: "Rigor", text: "Decisões técnicas tomadas cedo, para que nada fique ao acaso." },
      { title: "Matéria", text: "Superfícies honestas, escolhidas pela luz, pelo tato e pelo tempo." },
    ],
    // Preencha com a equipe real. Vazio = bloco não aparece.
    team: [] as TeamMember[],
  },

  contact_section: {
    title: ["Vamos", "conversar"],
    lead: "Conte sobre o seu espaço. Respondemos pelo Instagram e marcamos uma primeira conversa.",
    cta: "Enviar mensagem",
  },

  footer: {
    backToTop: "Voltar ao topo",
    rights: "Todos os direitos reservados.",
    invert: "Inverter cor",
  },
} as const

export type Site = typeof site
