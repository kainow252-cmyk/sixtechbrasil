import { Hono } from 'hono'
import { cors } from 'hono/cors'

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Bindings = { AI: Ai }

type AgentSource = 'cloudflare' | 'internal' | 'hybrid'

interface AgentDef {
  id: string
  name: string
  emoji: string
  color: string
  desc: string
  source: AgentSource
  model: string
  internalUrl?: string
  system: string
  category: string
  capabilities: string[]
  basedOn?: string
}

interface RunResult {
  agentId: string
  name: string
  emoji: string
  color: string
  model: string
  source: AgentSource
  usedFallback: boolean
  response: string
  duration: number
  error?: string
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// ─── CF WORKERS AI MODELS ────────────────────────────────────────────────────
const CF_MODELS = {
  fast:      '@cf/meta/llama-3.2-3b-instruct',
  balanced:  '@cf/meta/llama-3.1-8b-instruct-fp8',
  powerful:  '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  coder:     '@cf/qwen/qwen2.5-coder-32b-instruct',
  reason:    '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
  kimi:      '@cf/moonshotai/kimi-k2.6',
  gpt:       '@cf/openai/gpt-oss-120b',
  gemma:     '@cf/google/gemma-3-12b-it',
}

// ─── INTERNAL ENDPOINTS (sixtech-workspace FastAPI + sixtechworkspace CF) ────
const INTERNAL_BASE    = 'https://api.sixtechbrasil.com.br'
const WORKSPACE_CF_URL = 'https://sixtechworkspace.kainow252-cmyk.workers.dev'

// ─── AGENTS REGISTRY ─────────────────────────────────────────────────────────
const AGENTS: AgentDef[] = [
  // ── ORQUESTRAÇÃO ──────────────────────────────────────────────────────────
  {
    id: 'orchestrator',
    name: 'Super Orquestrador',
    emoji: '🎯',
    color: '#22D3EE',
    category: 'Orquestração',
    source: 'cloudflare',
    model: CF_MODELS.kimi,
    basedOn: 'Kimi K2.6 (1T params)',
    capabilities: ['Roteamento inteligente', 'Síntese multi-agente', 'Planejamento', 'Delegação', 'Consolidação'],
    desc: 'CEO da equipe — analisa, delega e sintetiza resultados de todos os agentes',
    system: `Você é o Super Agente Orquestrador da SixTech Brasil, powered by Kimi K2.6.
Missão: ANALISAR → PLANEJAR → SINTETIZAR → DECIDIR. Seja o CEO da equipe.
Responda SEMPRE em português brasileiro com markdown rico.`
  },
  {
    id: 'analyst',
    name: 'Analista',
    emoji: '📊',
    color: '#8B5CF6',
    category: 'Orquestração',
    source: 'cloudflare',
    model: CF_MODELS.reason,
    basedOn: 'DeepSeek R1 32B',
    capabilities: ['SWOT', 'KPIs', 'Chain-of-thought', 'BI', 'Cenários'],
    desc: 'Raciocínio analítico avançado — DeepSeek R1 chain-of-thought, análise SWOT e KPIs',
    system: `Você é analista de elite da SixTech Brasil. Use chain-of-thought para analisar dados, KPIs, SWOT e cenários. Responda em português.`
  },
  {
    id: 'reviewer',
    name: 'Revisor QA',
    emoji: '🛡️',
    color: '#10B981',
    category: 'Orquestração',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    basedOn: 'Llama 3.1 8B',
    capabilities: ['Code review', 'QA', 'Security audit', 'Scoring 0-10', 'Melhorias'],
    desc: 'Revisor crítico — analisa qualidade com scoring rigoroso e sugestões concretas',
    system: `Você é QA Lead da SixTech. Analise com framework: Problemas, Positivos, Melhorias, Score 0-10. Seja direto e honesto. Responda em português.`
  },
  {
    id: 'chat-assistant',
    name: 'Assistente',
    emoji: '💬',
    color: '#06B6D4',
    category: 'Orquestração',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    basedOn: 'Llama 3.1 8B + SSE',
    capabilities: ['Chat geral', 'Streaming', 'Multi-idioma', 'Contexto', 'Rápido'],
    desc: 'Assistente conversacional com streaming SSE em tempo real',
    system: `Você é o assistente da SixTech Brasil. Seja útil, amigável e direto. Responda em português por padrão.`
  },
  // ── ADMINISTRATIVO ────────────────────────────────────────────────────────
  {
    id: 'admin-secretary',
    name: 'Secretária Executiva',
    emoji: '📅',
    color: '#6C63FF',
    category: 'Administrativo',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    capabilities: ['Agendamentos', 'E-mails', 'Atas de reunião', 'Organização', 'Follow-up'],
    desc: 'Organiza agenda, redige e-mails profissionais e gerencia comunicações executivas',
    system: `Você é secretária executiva sênior. Organize agendas, redija e-mails formais e atas de reunião com clareza e profissionalismo. Responda em português.`
  },
  {
    id: 'admin-processes',
    name: 'Gestor de Processos',
    emoji: '⚙️',
    color: '#6C63FF',
    category: 'Administrativo',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    capabilities: ['BPM', 'Fluxogramas', 'SOP', 'Automação', 'Indicadores'],
    desc: 'Mapeia, documenta e otimiza processos administrativos e operacionais',
    system: `Você é especialista em BPM e gestão de processos. Mapeie fluxos, crie SOPs e identifique gargalos. Responda em português.`
  },
  // ── FINANCEIRO ────────────────────────────────────────────────────────────
  {
    id: 'fin-controller',
    name: 'Controller',
    emoji: '💰',
    color: '#F59E0B',
    category: 'Financeiro',
    source: 'cloudflare',
    model: CF_MODELS.reason,
    capabilities: ['DRE', 'Fluxo de caixa', 'Budget', 'Variance', 'Relatórios'],
    desc: 'Controller financeiro — DRE, fluxo de caixa, orçamento e análise de variações',
    system: `Você é controller financeiro sênior. Analise demonstrativos, cash flow, budget vs realizado. Use raciocínio estruturado. Responda em português.`
  },
  {
    id: 'fin-invest',
    name: 'Analista de Investimentos',
    emoji: '📈',
    color: '#F59E0B',
    category: 'Financeiro',
    source: 'cloudflare',
    model: CF_MODELS.reason,
    capabilities: ['Valuation', 'ROI', 'VPL/TIR', 'Carteira', 'Risco'],
    desc: 'Análise de investimentos, valuation de empresas e gestão de portfólio',
    system: `Você é analista de investimentos. Calcule ROI, VPL, TIR, faça valuation e análise de risco. Responda em português com rigor quantitativo.`
  },
  // ── CRÉDITO ────────────────────────────────────────────────────────────────
  {
    id: 'credit-analyst',
    name: 'Analista de Crédito',
    emoji: '🏦',
    color: '#3B82F6',
    category: 'Crédito',
    source: 'cloudflare',
    model: CF_MODELS.reason,
    capabilities: ['Score', 'Rating', 'Risco PF/PJ', 'Política de crédito', 'Cobrança'],
    desc: 'Analisa perfil de crédito, score, rating e política de concessão PF e PJ',
    system: `Você é analista de crédito sênior. Avalie risco de crédito, score, rating e recomende política de concessão. Responda em português.`
  },
  {
    id: 'credit-recovery',
    name: 'Gestor de Cobrança',
    emoji: '🔔',
    color: '#3B82F6',
    category: 'Crédito',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    capabilities: ['Régua de cobrança', 'Negativação', 'Renegociação', 'Scripts', 'KPIs'],
    desc: 'Estratégias de cobrança, réguas, scripts de negociação e renegociação de dívidas',
    system: `Você é gestor de recuperação de crédito. Crie réguas de cobrança, scripts de negociação e estratégias de renegociação. Responda em português.`
  },
  // ── SEGUROS ───────────────────────────────────────────────────────────────
  {
    id: 'insurance-broker',
    name: 'Corretor de Seguros',
    emoji: '🛡️',
    color: '#0EA5E9',
    category: 'Seguros',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    capabilities: ['Cotação', 'Coberturas', 'Sinistro', 'Vida/Auto/Patrimonial', 'Comparativo'],
    desc: 'Especialista em seguros — cotações, coberturas, análise de apólices e sinistros',
    system: `Você é corretor de seguros especialista. Explique coberturas, compare apólices e oriente sobre sinistros. Responda em português.`
  },
  // ── JURÍDICO ──────────────────────────────────────────────────────────────
  {
    id: 'legal',
    name: 'Jurídico',
    emoji: '⚖️',
    color: '#D97706',
    category: 'Jurídico',
    source: 'hybrid',
    model: CF_MODELS.powerful,
    internalUrl: `${INTERNAL_BASE}/agents/legal`,
    basedOn: 'sixtech-workspace',
    capabilities: ['Contratos', 'LGPD', 'NDAs', 'Compliance', 'Due diligence'],
    desc: 'Especialista jurídico — contratos, LGPD, direito digital e compliance',
    system: `Você é especialista jurídico da SixTech. Analise contratos, LGPD, NDAs. DISCLAIMER: consulte advogado para casos reais. Responda em português.`
  },
  {
    id: 'legal-labor',
    name: 'Trabalhista',
    emoji: '👷',
    color: '#D97706',
    category: 'Jurídico',
    source: 'cloudflare',
    model: CF_MODELS.powerful,
    capabilities: ['CLT', 'eSocial', 'Rescisão', 'Folha', 'Convenção coletiva'],
    desc: 'Direito trabalhista — CLT, eSocial, rescisões, folha e convenções coletivas',
    system: `Você é especialista em direito trabalhista brasileiro. Oriente sobre CLT, eSocial, rescisões e folha. DISCLAIMER: consulte advogado. Responda em português.`
  },
  // ── AFILIADOS ─────────────────────────────────────────────────────────────
  {
    id: 'affiliate-manager',
    name: 'Gestor de Afiliados',
    emoji: '🤝',
    color: '#7C3AED',
    category: 'Afiliados',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    capabilities: ['Programa de afiliados', 'Comissões', 'Recrutamento', 'Métricas', 'Materiais'],
    desc: 'Gerencia programas de afiliados, estrutura comissões e recruta parceiros',
    system: `Você é gestor de programas de afiliados. Estruture comissões, estratégias de recrutamento e métricas de performance. Responda em português.`
  },
  // ── MARKETING ────────────────────────────────────────────────────────────
  {
    id: 'marketing-content',
    name: 'Criador de Conteúdo',
    emoji: '📢',
    color: '#EC4899',
    category: 'Marketing',
    source: 'hybrid',
    model: CF_MODELS.powerful,
    internalUrl: `${INTERNAL_BASE}/agents/marketing`,
    capabilities: ['Posts redes sociais', 'Blog SEO', 'Roteiros', 'E-mail marketing', 'Headlines'],
    desc: 'Cria conteúdo persuasivo para redes sociais, blog, e-mail e campanhas',
    system: `Você é criador de conteúdo de marketing. Crie posts virais, artigos SEO e e-mails persuasivos. Tom: engajante e autêntico. Responda em português.`
  },
  {
    id: 'marketing-growth',
    name: 'Growth Hacker',
    emoji: '🚀',
    color: '#EC4899',
    category: 'Marketing',
    source: 'cloudflare',
    model: CF_MODELS.powerful,
    capabilities: ['Funil', 'A/B Testing', 'CAC/LTV', 'Paid ads', 'Automação'],
    desc: 'Estratégias de crescimento acelerado — funil, paid ads, A/B test e automação',
    system: `Você é growth hacker sênior. Proponha experimentos de crescimento, otimize funil, CAC/LTV e estratégias paid. Responda em português.`
  },
  // ── COMERCIAL ────────────────────────────────────────────────────────────
  {
    id: 'sales-hunter',
    name: 'Vendedor Hunter',
    emoji: '📞',
    color: '#059669',
    category: 'Comercial',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    capabilities: ['Prospecção', 'Cold call', 'Pitch', 'Objeções', 'CRM'],
    desc: 'Especialista em prospecção ativa — scripts de vendas, pitch e gestão de objeções',
    system: `Você é vendedor hunter sênior. Crie scripts de prospecção, pitches matadores e respostas a objeções. Responda em português com energia.`
  },
  {
    id: 'sales-closer',
    name: 'Closer',
    emoji: '🏆',
    color: '#059669',
    category: 'Comercial',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    capabilities: ['Fechamento', 'Proposta comercial', 'Negociação', 'Up-sell', 'Contrato'],
    desc: 'Especialista em fechamento de vendas — propostas, negociação e contratos',
    system: `Você é closer de vendas. Ajude a fechar negócios com propostas irresistíveis, técnicas de negociação e contratos. Responda em português.`
  },
  // ── IMOBILIÁRIO ───────────────────────────────────────────────────────────
  {
    id: 'realestate-agent',
    name: 'Corretor Imobiliário',
    emoji: '🏠',
    color: '#0891B2',
    category: 'Imobiliário',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    capabilities: ['Avaliação', 'Captação', 'Financiamento', 'Documentação', 'Negociação'],
    desc: 'Corretor especializado — avaliação, captação, financiamento e documentação',
    system: `Você é corretor imobiliário experiente. Oriente sobre avaliação, financiamento e documentação de imóveis. Responda em português.`
  },
  // ── RH ────────────────────────────────────────────────────────────────────
  {
    id: 'hr-recruiter',
    name: 'Recrutador',
    emoji: '👥',
    color: '#7C3AED',
    category: 'RH',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    capabilities: ['Job description', 'Triagem', 'Entrevista', 'Assessment', 'Onboarding'],
    desc: 'Recrutamento e seleção — job descriptions, entrevistas e onboarding',
    system: `Você é recrutador sênior. Crie JDs atrativas, roteiros de entrevista e processos de onboarding. Responda em português.`
  },
  {
    id: 'hr-training',
    name: 'T&D',
    emoji: '🎓',
    color: '#7C3AED',
    category: 'RH',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    capabilities: ['LNT', 'Trilhas', 'Treinamentos', 'Avaliação de desempenho', 'PDI'],
    desc: 'Treinamento e Desenvolvimento — LNT, trilhas de aprendizado e PDI',
    system: `Você é especialista em T&D. Crie LNT, trilhas de aprendizado e PDI para desenvolvimento de pessoas. Responda em português.`
  },
  // ── SAÚDE ─────────────────────────────────────────────────────────────────
  {
    id: 'health-manager',
    name: 'Gestor de Saúde',
    emoji: '🏥',
    color: '#EF4444',
    category: 'Saúde',
    source: 'cloudflare',
    model: CF_MODELS.powerful,
    capabilities: ['Gestão hospitalar', 'Protocolos', 'ANVISA', 'Qualidade', 'Indicadores'],
    desc: 'Gestão de saúde — protocolos, indicadores, ANVISA e qualidade assistencial',
    system: `Você é gestor de saúde. Oriente sobre gestão hospitalar, protocolos e indicadores. DISCLAIMER: não substitui médico. Responda em português.`
  },
  // ── AUTOMOTIVO ────────────────────────────────────────────────────────────
  {
    id: 'auto-consultant',
    name: 'Consultor Automotivo',
    emoji: '🚗',
    color: '#6366F1',
    category: 'Automotivo',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    capabilities: ['Precificação', 'Financiamento', 'Estoque', 'Revisão', 'Consórcio'],
    desc: 'Especialista automotivo — precificação, financiamento, consórcio e estoque',
    system: `Você é consultor automotivo. Oriente sobre compra, venda, financiamento e manutenção de veículos. Responda em português.`
  },
  // ── LOGÍSTICA ─────────────────────────────────────────────────────────────
  {
    id: 'logistics-manager',
    name: 'Gestor Logístico',
    emoji: '🚚',
    color: '#78350F',
    category: 'Logística',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    capabilities: ['Supply chain', 'Rotas', 'Estoque', 'WMS', 'KPIs logísticos'],
    desc: 'Supply chain e logística — rotas, estoque, WMS e indicadores de performance',
    system: `Você é gestor logístico. Otimize rotas, supply chain, WMS e indicadores logísticos. Responda em português.`
  },
  // ── TURISMO ───────────────────────────────────────────────────────────────
  {
    id: 'tourism-agent',
    name: 'Agente de Viagens',
    emoji: '🌍',
    color: '#0284C7',
    category: 'Turismo',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    capabilities: ['Roteiros', 'Pacotes', 'Documentos', 'Passagens', 'Hospedagem'],
    desc: 'Especialista em viagens — roteiros, pacotes, documentação e hospedagem',
    system: `Você é agente de viagens experiente. Crie roteiros, recomende pacotes e oriente sobre documentação. Responda em português.`
  },
  // ── EDUCAÇÃO ──────────────────────────────────────────────────────────────
  {
    id: 'edu-planner',
    name: 'Planejador Educacional',
    emoji: '📚',
    color: '#16A34A',
    category: 'Educação',
    source: 'cloudflare',
    model: CF_MODELS.powerful,
    capabilities: ['Plano de aula', 'Currículo', 'EAD', 'Avaliação', 'BNCC'],
    desc: 'Planejamento educacional — planos de aula, currículo, EAD e alinhamento BNCC',
    system: `Você é especialista em educação. Crie planos de aula, currículos e materiais didáticos alinhados à BNCC. Responda em português.`
  },
  // ── TECNOLOGIA ────────────────────────────────────────────────────────────
  {
    id: 'developer',
    name: 'Developer',
    emoji: '💻',
    color: '#F87171',
    category: 'Tecnologia',
    source: 'hybrid',
    model: CF_MODELS.coder,
    internalUrl: `${INTERNAL_BASE}/agents/developer`,
    basedOn: 'OpenHands + Qwen2.5 Coder 32B',
    capabilities: ['Código', 'APIs', 'Docker', 'Banco de dados', 'DevOps'],
    desc: 'Arquiteto de software sênior — código production-ready com Qwen2.5 Coder 32B',
    system: `Você é arquiteto de software sênior da SixTech. Gere código limpo, documentado e testável. Responda em português com blocos de código.`
  },
  {
    id: 'designer',
    name: 'Designer',
    emoji: '🎨',
    color: '#EC4899',
    category: 'Tecnologia',
    source: 'hybrid',
    model: CF_MODELS.powerful,
    internalUrl: `${INTERNAL_BASE}/agents/designer`,
    basedOn: 'sixtech-workspace',
    capabilities: ['UI/UX', 'Branding', 'HTML/CSS', 'Figma', 'Acessibilidade'],
    desc: 'Designer sênior — UI/UX, branding, sistemas de design e HTML/CSS',
    system: `Você é designer criativo sênior. Proponha soluções visuais com paleta, tipografia e componentes. Responda em português.`
  },
  {
    id: 'tech-infra',
    name: 'Infraestrutura',
    emoji: '🖥️',
    color: '#475569',
    category: 'Tecnologia',
    source: 'cloudflare',
    model: CF_MODELS.coder,
    capabilities: ['Cloud AWS/GCP', 'Kubernetes', 'CI/CD', 'Segurança', 'Monitoramento'],
    desc: 'Especialista em infra — Cloud, Kubernetes, CI/CD e segurança de sistemas',
    system: `Você é especialista em infraestrutura cloud. Oriente sobre AWS/GCP, K8s, CI/CD e segurança. Responda em português com exemplos técnicos.`
  },
  // ── INDÚSTRIA ────────────────────────────────────────────────────────────
  {
    id: 'industry-engineer',
    name: 'Engenheiro Industrial',
    emoji: '🏭',
    color: '#92400E',
    category: 'Indústria',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    capabilities: ['Lean', 'Six Sigma', 'PCP', 'Manutenção', 'ISO'],
    desc: 'Engenharia industrial — Lean, Six Sigma, PCP e gestão de qualidade ISO',
    system: `Você é engenheiro industrial. Aplique Lean, Six Sigma e PCP para otimizar processos produtivos. Responda em português.`
  },
  // ── AGRONEGÓCIO ───────────────────────────────────────────────────────────
  {
    id: 'agro-consultant',
    name: 'Consultor Agro',
    emoji: '🌾',
    color: '#65A30D',
    category: 'Agronegócio',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    capabilities: ['Gestão rural', 'Crédito rural', 'Comercialização', 'Pragas', 'Rastreabilidade'],
    desc: 'Agronegócio — gestão rural, crédito, comercialização e rastreabilidade',
    system: `Você é consultor agronegócio. Oriente sobre gestão rural, crédito e comercialização de commodities. Responda em português.`
  },
  // ── GOVERNO ───────────────────────────────────────────────────────────────
  {
    id: 'gov-analyst',
    name: 'Analista de Governo',
    emoji: '🏛️',
    color: '#1D4ED8',
    category: 'Governo',
    source: 'cloudflare',
    model: CF_MODELS.powerful,
    capabilities: ['Licitações', 'Lei 8.666', 'Nova Lei Licitações', 'Editais', 'Pregão'],
    desc: 'Especialista em governo — licitações, editais, pregão e Lei 14.133/2021',
    system: `Você é analista de contratos públicos. Oriente sobre licitações, editais e Lei 14.133. DISCLAIMER: consulte advogado. Responda em português.`
  },
  // ── CRIATIVO ──────────────────────────────────────────────────────────────
  {
    id: 'creative-writer',
    name: 'Redator Criativo',
    emoji: '✍️',
    color: '#BE185D',
    category: 'Criativo',
    source: 'cloudflare',
    model: CF_MODELS.powerful,
    capabilities: ['Copywriting', 'Storytelling', 'Roteiros', 'Naming', 'Slogans'],
    desc: 'Redator criativo — copy, storytelling, roteiros, naming e slogans impactantes',
    system: `Você é redator criativo sênior. Crie copy persuasivo, histórias envolventes e slogans memoráveis. Responda em português com criatividade.`
  },
  {
    id: 'creative-video',
    name: 'Roteirista de Vídeo',
    emoji: '🎬',
    color: '#BE185D',
    category: 'Criativo',
    source: 'cloudflare',
    model: CF_MODELS.powerful,
    capabilities: ['Roteiro', 'Script', 'YouTube', 'Reels', 'Storytelling visual'],
    desc: 'Roteiros para YouTube, Reels, TikTok e vídeos corporativos',
    system: `Você é roteirista audiovisual. Crie roteiros para YouTube, Reels e vídeos corporativos com estrutura narrativa forte. Responda em português.`
  },
  // ── DIRETORIA ─────────────────────────────────────────────────────────────
  {
    id: 'ceo-advisor',
    name: 'Conselheiro CEO',
    emoji: '👑',
    color: '#92400E',
    category: 'Diretoria',
    source: 'cloudflare',
    model: CF_MODELS.kimi,
    basedOn: 'Kimi K2.6 (1T params)',
    capabilities: ['Estratégia', 'M&A', 'Board', 'Visão 10 anos', 'Liderança'],
    desc: 'Conselheiro estratégico de alto nível — decisões de CEO, M&A e visão de longo prazo',
    system: `Você é conselheiro sênior de CEO. Oriente sobre estratégia corporativa, M&A, liderança e visão de longo prazo. Responda em português com autoridade.`
  },
  {
    id: 'research',
    name: 'Pesquisador',
    emoji: '🔍',
    color: '#6C63FF',
    category: 'Diretoria',
    source: 'hybrid',
    model: CF_MODELS.powerful,
    internalUrl: `${INTERNAL_BASE}/agents/research`,
    basedOn: 'sixtech-workspace',
    capabilities: ['Pesquisa de mercado', 'Competitivo', 'Tendências', 'Inteligência', 'Relatórios'],
    desc: 'Inteligência de mercado — pesquisa profunda, análise competitiva e tendências',
    system: `Você é pesquisador de inteligência de mercado. Estruture: Resumo → Análise → Dados → Tendências → Conclusões. Responda em português.`
  },
  {
    id: 'documents',
    name: 'Documentos',
    emoji: '📄',
    color: '#14B8A6',
    category: 'Diretoria',
    source: 'hybrid',
    model: CF_MODELS.balanced,
    internalUrl: `${INTERNAL_BASE}/agents/documents`,
    basedOn: 'sixtech-workspace',
    capabilities: ['Relatórios executivos', 'Propostas', 'Specs', 'Apresentações', 'PRD'],
    desc: 'Documentação executiva — relatórios, PRD, propostas e apresentações',
    system: `Você é especialista em documentação executiva. Crie relatórios, PRDs e propostas com clareza e precisão. Responda em português.`
  }
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────
async function callInternal(url: string, task: string): Promise<string | null> {
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, message: task }),
      signal: ctrl.signal
    })
    clearTimeout(timer)
    if (!res.ok) return null
    const data: any = await res.json()
    return data.result || data.response || data.output || null
  } catch {
    return null
  }
}

async function callCFAI(
  ai: Ai,
  model: string,
  system: string,
  userMsg: string,
  maxTokens = 1200
): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'system', content: system },
    { role: 'user',   content: userMsg }
  ]
  const resp = await (ai as any).run(model, { messages, max_tokens: maxTokens })
  if (resp && typeof resp === 'object' && 'response' in resp) return (resp as any).response || ''
  return String(resp || '')
}

async function runAgent(agent: AgentDef, userMsg: string, ai: Ai): Promise<RunResult> {
  const start = Date.now()
  let response = ''
  let usedFallback = false
  let source: AgentSource = agent.source

  try {
    if (agent.source === 'hybrid' && agent.internalUrl) {
      const internal = await callInternal(agent.internalUrl, userMsg)
      if (internal) {
        response = internal
        source = 'internal'
        usedFallback = false
      } else {
        response = await callCFAI(ai, agent.model, agent.system, userMsg, 1500)
        source = 'cloudflare'
        usedFallback = true
      }
    } else {
      response = await callCFAI(ai, agent.model, agent.system, userMsg, 1500)
      source = 'cloudflare'
      usedFallback = false
    }
  } catch (err: any) {
    response = `❌ Erro: ${err?.message || 'falha inesperada'}`
  }

  return {
    agentId: agent.id,
    name: agent.name,
    emoji: agent.emoji,
    color: agent.color,
    model: agent.model,
    source,
    usedFallback,
    response,
    duration: Date.now() - start
  }
}

// Routing inteligente — baseado no SuperAgentOrchestrator do sixtech-workspace
function smartRoute(task: string): string[] {
  const t = task.toLowerCase()
  const agents: string[] = []

  if (/código|code|api|sistema|função|script|bug|deploy|docker|sql|banco|database|programar|desenvolver|criar.*app/.test(t))
    agents.push('developer')
  if (/contrato|nda|legal|jurídico|lgpd|compliance|cláusula|acordo|lei|direito|privacy/.test(t))
    agents.push('legal')
  if (/design|logo|ui|ux|interface|layout|cor|paleta|branding|wireframe|figma|css|visual/.test(t))
    agents.push('designer')
  if (/pesquis|research|mercado|concorrent|trend|análise|dados|market|investigar|buscar/.test(t))
    agents.push('research')
  if (/relatório|documento|report|proposta|spec|documentaç|apresent|manual|readme|word|pdf/.test(t))
    agents.push('documents')
  if (/analise|analisa|kpi|métrica|swot|negócio|estratégia|financeiro|projeção|cenário/.test(t))
    agents.push('analyst')
  if (/revisar|review|qualidade|verificar|corrigir|melhorar|audit|checar|validar/.test(t))
    agents.push('reviewer')

  if (agents.length === 0) agents.push('orchestrator')
  if (agents.length > 1) agents.push('orchestrator')
  return [...new Set(agents)]
}

// ─── HONO APP ─────────────────────────────────────────────────────────────────
const app = new Hono<{ Bindings: Bindings }>()
app.use('*', cors())

// ── GET /favicon.ico — evita 500 no browser
app.get('/favicon.ico', (c) => new Response(null, { status: 204 }))

// ── GET /api/agents ────────────────────────────────────────────────────────
app.get('/api/agents', (c) => {
  return c.json({
    total: AGENTS.length,
    models: Object.keys(CF_MODELS).length,
    repos: ['sixtech-workspace', 'sixtechworkspace', 'kndev-IA', 'sixtechbrasil'],
    agents: AGENTS.map(a => ({
      id: a.id, name: a.name, emoji: a.emoji, color: a.color,
      desc: a.desc, source: a.source, model: a.model,
      category: a.category, capabilities: a.capabilities,
      basedOn: a.basedOn, internalUrl: a.internalUrl
    }))
  })
})

// ── POST /api/agent/:id ────────────────────────────────────────────────────
app.post('/api/agent/:id', async (c) => {
  const agent = AGENTS.find(a => a.id === c.req.param('id'))
  if (!agent) return c.json({ error: 'Agente não encontrado' }, 404)
  const { message, task } = await c.req.json()
  const result = await runAgent(agent, message || task || '', c.env.AI)
  return c.json(result)
})

// ── POST /api/orchestrate ─────────────────────────────────────────────────
app.post('/api/orchestrate', async (c) => {
  const { task, message } = await c.req.json()
  const input = task || message || ''
  if (!input) return c.json({ error: 'task obrigatório' }, 400)

  const agentIds = smartRoute(input)
  const agents = agentIds.map(id => AGENTS.find(a => a.id === id)!).filter(Boolean)

  const results: RunResult[] = []
  for (const agent of agents) {
    const taskForAgent = agent.id === 'orchestrator' && results.length > 0
      ? `Tarefa original: "${input}"\n\nResultados dos agentes especializados:\n${results.map(r => `## ${r.emoji} ${r.name}\n${r.response}`).join('\n\n')}\n\nSintetize e entregue o resultado final consolidado.`
      : input
    results.push(await runAgent(agent, taskForAgent, c.env.AI))
  }

  return c.json({
    task: input,
    agentsUsed: agentIds,
    results,
    summary: results[results.length - 1]?.response || ''
  })
})

// ── POST /api/pipeline ────────────────────────────────────────────────────
app.post('/api/pipeline', async (c) => {
  const { task, agentIds } = await c.req.json()
  if (!task || !agentIds?.length) return c.json({ error: 'task e agentIds obrigatórios' }, 400)

  const agents = (agentIds as string[]).map(id => AGENTS.find(a => a.id === id)!).filter(Boolean)
  const results: RunResult[] = []
  let ctx = task

  for (const agent of agents) {
    const isLast = agent === agents[agents.length - 1]
    const input = results.length === 0 ? task
      : agent.id === 'orchestrator' && results.length > 0
        ? `Tarefa original: "${task}"\n\n${results.map(r => `## ${r.emoji} ${r.name}\n${r.response}`).join('\n\n')}\n\nSintetize o resultado final.`
        : `${task}\n\n[Contexto do ${results[results.length-1].name}]:\n${results[results.length-1].response.slice(0, 800)}`
    const result = await runAgent(agent, input, c.env.AI)
    results.push(result)
    ctx = result.response
  }

  const cfCount  = results.filter(r => r.source === 'cloudflare').length
  const intCount = results.filter(r => r.source === 'internal').length
  return c.json({
    task,
    steps: results.length,
    cloudflareSteps: cfCount,
    internalSteps: intCount,
    results,
    final: ctx
  })
})

// ── POST /api/chat (streaming SSE — baseado no sixtechworkspace) ──────────
app.post('/api/chat', async (c) => {
  const { messages, model } = await c.req.json() as { messages: ChatMessage[], model?: string }
  const modelId = model || CF_MODELS.balanced

  if (!messages.some(m => m.role === 'system')) {
    messages.unshift({
      role: 'system',
      content: `Você é o assistente inteligente da SixTech Brasil — plataforma multiagente de IA.
Seja útil, preciso e responda em português brasileiro por padrão.
Se o usuário falar inglês, responda em inglês.`
    })
  }

  const stream = await (c.env.AI as any).run(modelId, {
    messages,
    max_tokens: 2048,
    stream: true
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    }
  })
})

// ── GET /api/models ────────────────────────────────────────────────────────
app.get('/api/models', (c) => {
  return c.json({
    models: Object.entries(CF_MODELS).map(([key, id]) => ({
      key, id,
      label: {
        fast:     '⚡ Llama 3.2 3B — Rápido',
        balanced: '⚖️ Llama 3.1 8B — Balanceado',
        powerful: '💪 Llama 3.3 70B — Poderoso',
        coder:    '💻 Qwen2.5 Coder 32B — Código',
        reason:   '🧠 DeepSeek R1 32B — Raciocínio',
        kimi:     '🎯 Kimi K2.6 1T — Orquestrador',
        gpt:      '🤖 GPT-OSS 120B — Avançado',
        gemma:    '💎 Gemma 3 12B — Google'
      }[key] || key
    }))
  })
})

// ── GET /api/status ────────────────────────────────────────────────────────
app.get('/api/status', (c) => {
  return c.json({
    status: 'online',
    version: '3.0.0',
    platform: 'SixTech MAS — Multi-Agent System',
    repos: {
      'sixtech-workspace': { agents: 5, type: 'Python FastAPI + Ollama', url: INTERNAL_BASE },
      'sixtechworkspace':  { type: 'Cloudflare Workers AI + SSE', url: WORKSPACE_CF_URL },
      'kndev-IA':          { type: 'OpenHands + opencode (RAR)', note: 'Integrado ao developer agent' },
      'sixtechbrasil':     { type: 'CF Pages — plataforma principal', url: 'https://sixtechbrasil.pages.dev' }
    },
    agents: AGENTS.length,
    models: Object.keys(CF_MODELS).length,
    features: ['hybrid routing', 'SSE streaming', 'smart orchestration', 'pipeline mode', 'fallback chain'],
    timestamp: new Date().toISOString()
  })
})

// ── GET / — Frontend SPA ──────────────────────────────────────────────────
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SixTech MAS v3.0</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
<style>
/* ── Reset & Vars ─────────────────────────────────────────── */
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --primary:#6C63FF;--secondary:#22D3EE;--accent:#EC4899;
  --bg:#0B0D17;--surface:#111320;--card:#1B1E2E;
  --border:#2A2D40;--text:#E8E9F3;--muted:#6B7280;
  --sidebar-w:220px;--header-h:54px;
}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);color:var(--text);font-family:'Inter',system-ui,sans-serif;display:flex;flex-direction:column}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

/* ── Header ───────────────────────────────────────────────── */
header{
  height:var(--header-h);flex-shrink:0;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 16px;
  background:rgba(17,19,32,0.95);backdrop-filter:blur(10px);
  border-bottom:1px solid var(--border);
  position:relative;z-index:100;
}
.hdr-left{display:flex;align-items:center;gap:10px}
.hdr-logo{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#6C63FF,#22D3EE);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.hdr-title{font-weight:700;font-size:15px;color:#fff;line-height:1.2}
.hdr-sub{font-size:10px;color:var(--muted)}
.hdr-badge{font-size:10px;padding:1px 6px;border-radius:999px;background:#1e3a5f;color:#60A5FA;margin-left:6px;vertical-align:middle}
.hdr-right{display:flex;align-items:center;gap:10px}
.status-pill{display:flex;align-items:center;gap:5px;font-size:11px;color:#34D399}
.pulse{width:7px;height:7px;border-radius:50%;background:#34D399;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.btn-gh{display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:8px;background:var(--card);border:1px solid var(--border);color:var(--text);font-size:12px;text-decoration:none;cursor:pointer}
.btn-gh:hover{background:var(--border)}
.btn-sidebar-toggle{background:none;border:none;color:var(--text);cursor:pointer;font-size:16px;padding:6px;border-radius:6px;transition:background .15s}
.btn-sidebar-toggle:hover{background:var(--card)}

/* ── Layout Body ──────────────────────────────────────────── */
.app-body{flex:1;display:flex;overflow:hidden}

/* ── Sidebar ──────────────────────────────────────────────── */
aside{
  width:var(--sidebar-w);flex-shrink:0;overflow-y:auto;
  background:var(--surface);border-right:1px solid var(--border);
  display:flex;flex-direction:column;
  transition:width .22s ease, transform .22s ease;
}
aside.collapsed{width:0;overflow:hidden}

.sidebar-section{padding:12px 0 4px}
.sidebar-section-title{
  padding:4px 14px 6px;font-size:10px;font-weight:700;letter-spacing:.08em;
  color:var(--muted);text-transform:uppercase;
}
.nav-item{
  display:flex;align-items:center;gap:9px;
  padding:9px 14px;cursor:pointer;
  font-size:13px;color:var(--muted);
  border-left:3px solid transparent;
  transition:all .15s;white-space:nowrap;overflow:hidden;
}
.nav-item:hover{background:rgba(108,99,255,.08);color:var(--text)}
.nav-item.active{background:rgba(108,99,255,.12);color:#fff;border-left-color:var(--primary)}
.nav-item i{width:16px;text-align:center;font-size:13px;flex-shrink:0}
.nav-arrow{font-size:10px;color:var(--muted);padding-left:18px;margin-top:-4px}

.sidebar-stat{padding:12px 14px;border-top:1px solid var(--border);margin-top:auto}
.sidebar-stat-title{font-size:10px;color:var(--muted);font-weight:700;letter-spacing:.07em;text-transform:uppercase;margin-bottom:8px}
.sstat{display:flex;justify-content:space-between;align-items:center;padding:3px 0;font-size:11px;color:var(--muted)}
.sstat-val{color:var(--text);font-weight:600}

/* ── Main Content ─────────────────────────────────────────── */
main{flex:1;overflow-y:auto;display:flex;flex-direction:column}
.tab-panel{display:none;flex:1;padding:20px}
.tab-panel.active{display:flex;flex-direction:column;gap:16px}
/* Full-screen chat não usa scroll no main — gerencia internamente */
#tab-agent-chat{overflow:hidden}

/* ── Cards ────────────────────────────────────────────────── */
.card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px}
.card-title{font-size:13px;font-weight:600;color:#fff;margin-bottom:12px;display:flex;align-items:center;gap:7px}
.card-title i{font-size:12px}

/* ── Grid helpers ─────────────────────────────────────────── */
.grid-chat{display:grid;grid-template-columns:220px 1fr;gap:14px}
.col-left{display:flex;flex-direction:column;gap:12px}

/* ── Form elements ────────────────────────────────────────── */
textarea,input[type=text],select{
  width:100%;background:var(--bg);border:1px solid var(--border);
  color:var(--text);border-radius:10px;padding:9px 12px;
  font-size:13px;font-family:inherit;resize:none;
}
textarea:focus,input:focus,select:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 2px rgba(108,99,255,.18)}
select option{background:var(--card)}

/* ── Buttons ──────────────────────────────────────────────── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:9px 16px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:opacity .15s}
.btn:hover{opacity:.85}
.btn-primary{background:linear-gradient(135deg,var(--primary),#4f46e5);color:#fff}
.btn-success{background:linear-gradient(135deg,#059669,#10b981);color:#fff}
.btn-ghost{background:var(--surface);border:1px solid var(--border);color:var(--muted)}
.btn-icon{padding:9px 11px}
.btn-full{width:100%;margin-top:10px}

/* ── Badges ───────────────────────────────────────────────── */
.badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700}
.badge-cf{background:#1e3a5f;color:#60A5FA}
.badge-hybrid{background:#1e2d1e;color:#34D399}
.badge-int{background:#2d1e1e;color:#F87171}

/* ── Chat ─────────────────────────────────────────────────── */
.chat-box{display:flex;flex-direction:column;height:calc(100vh - var(--header-h) - 60px);background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden}
.chat-hdr{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.chat-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.msg{border-radius:10px;padding:12px 14px;font-size:13px;line-height:1.6}
.msg-ai{background:var(--surface);border-left:3px solid var(--secondary)}
.msg-user{background:rgba(108,99,255,.12);border-left:3px solid var(--primary)}
.msg-name{font-size:11px;font-weight:600;margin-bottom:5px}
.msg-name.ai{color:var(--secondary)}
.msg-name.user{color:var(--primary)}
.chat-input-row{padding:12px;border-top:1px solid var(--border);display:flex;gap:8px;flex-shrink:0}
#chat-input{resize:none;height:60px}
#typing-indicator{display:none;padding:4px 16px;font-size:11px;color:var(--muted)}
.typing-dot{width:6px;height:6px;border-radius:50%;background:var(--secondary);display:inline-block;animation:pulse 1.2s infinite;margin-right:3px}
.cursor-blink{display:inline-block;width:2px;height:1em;background:var(--secondary);animation:blink .7s infinite;vertical-align:text-bottom;margin-left:2px}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

/* ── Stats ────────────────────────────────────────────────── */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px}
.stat-val{font-size:28px;font-weight:800;line-height:1}
.stat-label{font-size:11px;color:var(--muted);margin-top:5px}
.gtext{background:linear-gradient(135deg,var(--primary),var(--secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* ── Responsive ───────────────────────────────────────────── */
@media(max-width:860px){
  .grid-chat{grid-template-columns:1fr}
  .stats-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:540px){
  .stats-grid{grid-template-columns:1fr}
  aside{position:fixed;top:var(--header-h);left:0;height:calc(100vh - var(--header-h));z-index:200;transform:translateX(0)}
  aside.collapsed{transform:translateX(-100%);width:var(--sidebar-w)}
  .sidebar-overlay{display:block}
}
.sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:190}
.spin{animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── Agents Screen ────────────────────────────────────────── */
.agents-screen-hdr{
  display:flex;align-items:center;gap:12px;
  padding:0 0 16px 0;border-bottom:1px solid var(--border);margin-bottom:18px;
}
.agents-screen-icon{
  width:44px;height:44px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;
}
.agents-screen-title{font-size:18px;font-weight:800;color:#fff}
.agents-screen-sub{font-size:12px;color:var(--muted);margin-top:2px}
.agents-back-btn{
  display:flex;align-items:center;gap:6px;padding:6px 12px;
  border-radius:8px;background:var(--card);border:1px solid var(--border);
  color:var(--muted);font-size:12px;cursor:pointer;transition:all .15s;
  margin-left:auto;
}
.agents-back-btn:hover{color:#fff;background:var(--border)}
.search-box{
  display:flex;align-items:center;gap:8px;
  background:var(--card);border:1px solid var(--border);border-radius:10px;
  padding:6px 12px;
}
.search-box input{background:none;border:none;color:var(--text);font-size:13px;outline:none;width:180px}
.search-box i{color:var(--muted);font-size:12px}

/* ── Agents Grid (nova versão) ────────────────────────────── */
.agents-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.agent-card{
  background:var(--card);border:1px solid var(--border);
  border-radius:14px;overflow:hidden;
  transition:box-shadow .18s;
}
.agent-card:hover{box-shadow:0 6px 24px rgba(108,99,255,.18)}
.agent-card-top{
  padding:16px;cursor:pointer;
  display:flex;flex-direction:column;gap:10px;
}
.agent-card-hdr{display:flex;align-items:flex-start;gap:10px}
.agent-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.agent-card-name{font-size:14px;font-weight:700;color:#fff;line-height:1.2}
.agent-card-cat{font-size:10px;color:var(--muted);margin-top:2px}
.agent-card-desc{font-size:12px;color:var(--muted);line-height:1.55}
.caps{display:flex;flex-wrap:wrap;gap:4px}
.cap-pill{font-size:10px;padding:2px 7px;border-radius:999px;background:rgba(108,99,255,.12);color:#a5b4fc;border:1px solid rgba(108,99,255,.25)}
.agent-card-btn{
  display:flex;align-items:center;justify-content:center;gap:7px;
  padding:9px 0;margin:0 16px 14px;
  border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;
  background:rgba(108,99,255,.15);border:1px solid rgba(108,99,255,.3);
  color:#a5b4fc;transition:all .15s;
}
.agent-card-btn:hover{background:rgba(108,99,255,.28);color:#fff;border-color:var(--primary)}
.agent-card-btn.active{background:linear-gradient(135deg,var(--primary),#4f46e5);color:#fff;border-color:transparent}

/* ── Inline Chat Panel ────────────────────────────────────── */
.inline-chat{
  display:none;border-top:1px solid var(--border);
  background:var(--surface);flex-direction:column;
  max-height:420px;
}
.inline-chat.open{display:flex}
.inline-chat-hdr{
  display:flex;align-items:center;justify-content:space-between;
  padding:10px 16px;border-bottom:1px solid var(--border);flex-shrink:0;
  font-size:12px;font-weight:600;color:var(--secondary);
}
.inline-chat-hdr button{background:none;border:none;color:var(--muted);cursor:pointer;font-size:14px;padding:2px 6px;border-radius:4px}
.inline-chat-hdr button:hover{color:#fff;background:var(--border)}
.inline-msgs{
  flex:1;overflow-y:auto;padding:12px 16px;
  display:flex;flex-direction:column;gap:8px;min-height:100px;
}
.inline-msg{border-radius:8px;padding:8px 12px;font-size:12px;line-height:1.55}
.inline-msg.ai{background:var(--card);border-left:3px solid var(--secondary)}
.inline-msg.user{background:rgba(108,99,255,.1);border-left:3px solid var(--primary)}
.inline-msg .mn{font-size:10px;font-weight:700;margin-bottom:3px}
.inline-msg .mn.ai{color:var(--secondary)}
.inline-msg .mn.user{color:var(--primary)}
.inline-typing{display:none;padding:3px 16px;font-size:10px;color:var(--muted);flex-shrink:0}
.inline-quick{display:flex;gap:5px;padding:0 16px 8px;flex-wrap:wrap;flex-shrink:0}
.inline-qbtn{font-size:10px;padding:3px 9px;border-radius:6px;background:var(--card);border:1px solid var(--border);color:var(--muted);cursor:pointer;transition:all .15s}
.inline-qbtn:hover{background:rgba(108,99,255,.15);color:#fff;border-color:var(--primary)}
.inline-input-row{
  display:flex;gap:8px;padding:10px 16px;
  border-top:1px solid var(--border);flex-shrink:0;
}
.inline-input-row textarea{flex:1;height:42px;resize:none;font-size:12px;border-radius:8px;padding:8px 10px}
.inline-send-btn{
  height:42px;width:42px;flex-shrink:0;border-radius:8px;
  background:linear-gradient(135deg,var(--primary),#4f46e5);
  color:#fff;border:none;cursor:pointer;font-size:14px;
  transition:opacity .15s;
}
.inline-send-btn:hover{opacity:.85}
.inline-send-btn:disabled{opacity:.4;cursor:not-allowed}

/* ── Home Screen (categorias) ─────────────────────────────── */
.home-hdr{margin-bottom:20px}
.home-hdr h2{font-size:20px;font-weight:800;color:#fff}
.home-hdr p{font-size:12px;color:var(--muted);margin-top:4px}
.cats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
.cat-card{
  background:var(--card);border:1px solid var(--border);border-radius:14px;
  padding:16px;cursor:pointer;transition:all .18s;
  display:flex;flex-direction:column;align-items:flex-start;gap:8px;
}
.cat-card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.3);border-color:var(--primary)}
.cat-card-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px}
.cat-card-name{font-size:13px;font-weight:700;color:#fff}
.cat-card-count{font-size:11px;color:var(--muted)}
@keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.anim-in{animation:slideIn .22s ease}

/* ── Sidebar Accordion (sb-cat-*) ─────────────────────────── */
.sb-cat-group{border-bottom:1px solid rgba(42,45,64,.5)}
.sb-cat-header{
  display:flex;align-items:center;gap:9px;
  padding:9px 14px;cursor:pointer;
  font-size:12px;font-weight:600;color:var(--text);
  border-left:3px solid transparent;
  transition:all .15s;user-select:none;
}
.sb-cat-header:hover{background:rgba(108,99,255,.08);color:#fff}
.sb-cat-header.open{color:#fff;background:rgba(108,99,255,.1);border-left-color:var(--primary)}
.sb-cat-icon{width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
.sb-cat-name{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-cat-count{font-size:9px;background:var(--surface);border:1px solid var(--border);border-radius:999px;padding:1px 5px;color:var(--muted);flex-shrink:0}
.sb-cat-arrow{font-size:12px;color:var(--muted);transition:transform .22s;flex-shrink:0;line-height:1}
.sb-cat-header.open .sb-cat-arrow{transform:rotate(90deg)}
.sb-cat-agents{overflow:hidden;max-height:0;transition:max-height .28s ease}
.sb-cat-agents.open{max-height:600px}
.sb-agent-item{
  display:flex;align-items:center;gap:8px;
  padding:7px 14px 7px 30px;cursor:pointer;
  border-left:3px solid transparent;
  transition:all .15s;font-size:12px;color:var(--muted);
}
.sb-agent-item:hover{background:rgba(108,99,255,.07);color:var(--text)}
.sb-agent-item.active{background:rgba(108,99,255,.14);color:#fff;border-left-color:var(--primary)}
.sb-ag-emoji{font-size:14px;flex-shrink:0;width:18px;text-align:center}
.sb-ag-name{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-ag-badge{font-size:9px;padding:1px 5px;border-radius:999px;flex-shrink:0}

/* ── Full-Screen Agent Chat (fc-*) ────────────────────────── */
#tab-agent-chat{padding:0!important;gap:0!important}
.fc-wrap{display:flex;flex-direction:column;height:100%;overflow:hidden}
.fc-hdr{
  display:flex;align-items:center;gap:12px;
  padding:14px 20px;border-bottom:1px solid var(--border);flex-shrink:0;
  background:var(--surface);
}
.fc-agent-icon-el{
  width:46px;height:46px;border-radius:14px;
  display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;
}
.fc-hdr-info{flex:1;min-width:0}
.fc-hdr-name{font-size:16px;font-weight:800;color:#fff;line-height:1.2}
.fc-hdr-sub{font-size:11px;color:var(--muted);margin-top:2px}
.fc-hdr-caps{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
.fc-hdr-actions{display:flex;gap:8px;flex-shrink:0}
.fc-back-btn{
  display:flex;align-items:center;gap:6px;padding:7px 14px;
  border-radius:9px;background:var(--card);border:1px solid var(--border);
  color:var(--muted);font-size:12px;cursor:pointer;transition:all .15s;
}
.fc-back-btn:hover{color:#fff;background:var(--border)}
.fc-clear-btn{
  display:flex;align-items:center;gap:6px;padding:7px 14px;
  border-radius:9px;background:var(--card);border:1px solid var(--border);
  color:var(--muted);font-size:12px;cursor:pointer;transition:all .15s;
}
.fc-clear-btn:hover{color:#F87171;border-color:#F87171}
.fc-body{flex:1;display:flex;flex-direction:column;overflow:hidden}
.fc-msgs{
  flex:1;overflow-y:auto;padding:20px 24px;
  display:flex;flex-direction:column;gap:12px;
}
.fc-msg{border-radius:12px;padding:12px 16px;font-size:13px;line-height:1.65;animation:slideIn .18s ease}
.fc-msg.ai{background:var(--surface);border-left:3px solid var(--secondary);max-width:85%}
.fc-msg.user{background:rgba(108,99,255,.12);border-left:3px solid var(--primary);max-width:85%;align-self:flex-end}
.fc-mn{font-size:11px;font-weight:700;margin-bottom:5px}
.fc-mn.ai{color:var(--secondary)}
.fc-mn.user{color:var(--primary)}
.fc-stream{display:inline}
.fc-typing{
  display:none;padding:6px 24px;font-size:11px;color:var(--muted);
  align-items:center;gap:6px;flex-shrink:0;
}
.fc-quick{
  display:flex;gap:6px;padding:10px 24px 4px;
  flex-wrap:wrap;flex-shrink:0;border-top:1px solid var(--border);
}
.fc-qbtn{
  font-size:11px;padding:5px 11px;border-radius:8px;
  background:var(--card);border:1px solid var(--border);
  color:var(--muted);cursor:pointer;transition:all .15s;
}
.fc-qbtn:hover{background:rgba(108,99,255,.15);color:#fff;border-color:var(--primary)}
.fc-input-row{
  display:flex;gap:10px;padding:12px 20px 14px;
  border-top:1px solid var(--border);flex-shrink:0;
  background:var(--surface);
}
#fc-input{flex:1;height:52px;resize:none;font-size:13px;border-radius:10px;padding:10px 14px}
#fc-send-btn{
  height:52px;width:52px;flex-shrink:0;border-radius:10px;
  background:linear-gradient(135deg,var(--primary),#4f46e5);
  color:#fff;border:none;cursor:pointer;font-size:16px;
  transition:opacity .15s;
}
#fc-send-btn:hover{opacity:.85}
#fc-send-btn:disabled{opacity:.4;cursor:not-allowed}
</style>
</head>
<body>

<!-- HEADER -->
<header>
  <div class="hdr-left">
    <button class="btn-sidebar-toggle" onclick="toggleSidebar()" title="Menu">
      <i class="fas fa-bars"></i>
    </button>
    <div class="hdr-logo">🤖</div>
    <div>
      <div class="hdr-title">SixTech MAS <span class="hdr-badge">v3.0</span></div>
      <div class="hdr-sub">Multi-Agent System · Cloudflare Workers AI</div>
    </div>
  </div>
  <div class="hdr-right">
    <div class="status-pill">
      <span class="pulse"></span>
      <span id="status-text">Online</span>
    </div>
    <a href="https://github.com/kainow252-cmyk/sixtechbrasil" target="_blank" class="btn-gh">
      <i class="fab fa-github"></i> GitHub
    </a>
  </div>
</header>

<!-- OVERLAY mobile -->
<div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleSidebar()"></div>

<!-- BODY -->
<div class="app-body">

  <!-- SIDEBAR -->
  <aside id="sidebar">

    <!-- Plataforma -->
    <div class="sidebar-section">
      <div class="sidebar-section-title">Plataforma</div>
      <div class="nav-item active" id="nav-home" onclick="showHome(this)">
        <i class="fas fa-home"></i> Início
      </div>
      <div class="nav-item" onclick="showTab('chat',this)">
        <i class="fas fa-comments"></i> Chat IA
      </div>
    </div>

    <!-- Categorias de Agentes -->
    <div class="sidebar-section">
      <div class="sidebar-section-title">Categorias</div>
      <div id="sidebar-categories"></div>
    </div>

    <!-- Sistema -->
    <div class="sidebar-section">
      <div class="sidebar-section-title">Sistema</div>
      <div class="nav-item" onclick="showTab('status',this)">
        <i class="fas fa-chart-line"></i> Status
      </div>
    </div>

    <!-- Dashboard -->
    <div class="sidebar-stat">
      <div class="sidebar-stat-title">Dashboard</div>
      <div class="sstat"><span>Agentes</span><span class="sstat-val" id="sb-agents">—</span></div>
      <div class="sstat"><span>Categorias</span><span class="sstat-val">22</span></div>
      <div class="sstat"><span>Uptime</span><span class="sstat-val" style="color:#34D399">99.9%</span></div>
    </div>
  </aside>

  <!-- MAIN -->
  <main>

    <!-- ══ TELA: HOME (categorias) ══════════════════════════ -->
    <div id="tab-home" class="tab-panel active">
      <div class="home-hdr">
        <h2>Selecione uma Categoria</h2>
        <p>Escolha um setor para visualizar e conversar com os agentes especializados</p>
      </div>
      <div id="cats-grid" class="cats-grid"></div>
    </div>

    <!-- ══ TELA: AGENTES (por categoria) ════════════════════ -->
    <div id="tab-agents" class="tab-panel">
      <div class="agents-screen-hdr">
        <div class="agents-screen-icon" id="agents-screen-icon"></div>
        <div>
          <div class="agents-screen-title" id="agents-screen-title">Agentes</div>
          <div class="agents-screen-sub" id="agents-screen-sub"></div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-left:auto">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Buscar agente..." id="agent-search" oninput="filterAgents(this.value)">
          </div>
          <button class="agents-back-btn" onclick="showHome(null)">
            <i class="fas fa-arrow-left"></i> Voltar
          </button>
        </div>
      </div>
      <div id="agents-grid" class="agents-grid"></div>
    </div>

    <!-- ══ TAB: CHAT ══════════════════════════════════════════ -->
    <div id="tab-chat" class="tab-panel">
      <div class="grid-chat">
        <div class="col-left">
          <div class="card">
            <div class="card-title"><i class="fas fa-microchip" style="color:var(--primary)"></i> Modelo</div>
            <select id="chat-model"></select>
            <div style="margin-top:10px">
              <div style="font-size:11px;color:var(--muted);margin-bottom:5px">Agente Especialista</div>
              <select id="chat-agent"><option value="">Nenhum (chat livre)</option></select>
            </div>
          </div>
          <div class="card">
            <div class="card-title" style="justify-content:space-between">
              <span><i class="fas fa-clock-rotate-left" style="color:var(--secondary)"></i> Histórico</span>
              <button class="btn btn-ghost" style="padding:3px 8px;font-size:11px" onclick="clearChat()">Limpar</button>
            </div>
            <div id="chat-history-list" style="font-size:11px;color:var(--muted);text-align:center;padding:12px 0">Nenhuma conversa</div>
          </div>
        </div>
        <div class="chat-box">
          <div class="chat-hdr">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:16px">💬</span>
              <span style="font-weight:600;font-size:14px;color:#fff">Chat com IA</span>
            </div>
            <span id="chat-model-badge" class="badge badge-cf">Llama 3.1 8B</span>
          </div>
          <div id="chat-messages" class="chat-msgs">
            <div class="msg msg-ai">
              <div class="msg-name ai">🤖 Assistente SixTech</div>
              <div>Olá! Sou o assistente da <strong>SixTech Brasil</strong>, powered by Cloudflare Workers AI. Como posso ajudar você hoje?</div>
            </div>
          </div>
          <div id="typing-indicator"><span class="typing-dot"></span>IA digitando...</div>
          <div class="chat-input-row">
            <textarea id="chat-input" placeholder="Digite sua mensagem... (Enter para enviar)"
              onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChat()}"></textarea>
            <button class="btn btn-primary btn-icon" onclick="sendChat()" id="chat-send-btn" style="height:60px;padding:0 16px">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ TAB: STATUS ═════════════════════════════════════════ -->
    <div id="tab-status" class="tab-panel">
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-val gtext" id="stat-agents">—</div><div class="stat-label">Agentes Ativos</div></div>
        <div class="stat-card"><div class="stat-val" style="color:#22D3EE" id="stat-models">8</div><div class="stat-label">Modelos de IA</div></div>
        <div class="stat-card"><div class="stat-val" style="color:#34D399">4</div><div class="stat-label">Repos Integrados</div></div>
        <div class="stat-card"><div class="stat-val" style="color:#F59E0B">v3.0</div><div class="stat-label">Versão</div></div>
      </div>
      <div id="status-details" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px"></div>
    </div>

    <!-- ══ TELA: AGENTE FULL-SCREEN CHAT ════════════════════════ -->
    <div id="tab-agent-chat" class="tab-panel">
      <div class="fc-wrap">

        <!-- Cabeçalho do agente -->
        <div class="fc-hdr">
          <div id="fc-agent-icon" class="fc-agent-icon-el">🤖</div>
          <div class="fc-hdr-info">
            <div id="fc-agent-name" class="fc-hdr-name">Agente</div>
            <div id="fc-agent-sub" class="fc-hdr-sub">Categoria · Modelo</div>
            <div id="fc-agent-caps" class="fc-hdr-caps"></div>
          </div>
          <div class="fc-hdr-actions">
            <button class="fc-clear-btn" onclick="fcClear()" title="Limpar conversa">
              <i class="fas fa-trash-alt"></i> Limpar
            </button>
            <button class="fc-back-btn" onclick="showHome(null)" title="Voltar ao início">
              <i class="fas fa-arrow-left"></i> Voltar
            </button>
          </div>
        </div>

        <!-- Corpo do chat -->
        <div class="fc-body">

          <!-- Mensagens -->
          <div id="fc-msgs" class="fc-msgs"></div>

          <!-- Indicador de digitação -->
          <div id="fc-typing" class="fc-typing">
            <span class="typing-dot"></span>
            <span>Agente digitando...</span>
          </div>

          <!-- Perguntas rápidas -->
          <div id="fc-quick" class="fc-quick"></div>

          <!-- Input row -->
          <div class="fc-input-row">
            <textarea id="fc-input"
              placeholder="Digite sua mensagem... (Enter para enviar)"
              onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();fcSend()}"></textarea>
            <button id="fc-send-btn" onclick="fcSend()" title="Enviar">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>

        </div><!-- /.fc-body -->
      </div><!-- /.fc-wrap -->
    </div><!-- /#tab-agent-chat -->

  </main>
</div>

<script src="/static/app.js"></script>
<script>
function toggleSidebar(){
  const s = document.getElementById('sidebar')
  const o = document.getElementById('sidebar-overlay')
  s.classList.toggle('collapsed')
  o.style.display = s.classList.contains('collapsed') ? 'none' : ''
}
</script>
</body>
</html>`)
})

export default app
