import { Hono } from 'hono'
import { cors } from 'hono/cors'

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Bindings = { AI: Ai; DB: D1Database }

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
  const resp = await (ai as any).run(model, { messages, max_tokens: maxTokens, stream: false })

  if (resp && typeof resp === 'object') {
    const r = resp as any

    // 1. ReadableStream (stream não desligado) — consumir SSE chunks
    if ('getReader' in r || 'pipeTo' in r) {
      const reader = (r as ReadableStream<Uint8Array>).getReader()
      const decoder = new TextDecoder()
      let full = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data:')) continue
          const data = line.slice(5).trim()
          if (data === '[DONE]') continue
          try {
            const obj = JSON.parse(data)
            full += obj?.response ?? obj?.choices?.[0]?.delta?.content ?? obj?.token ?? ''
          } catch { /* ignore */ }
        }
      }
      return full
    }

    // 2. Formato padrão CF Workers AI — { response: "..." }
    if ('response' in r && typeof r.response === 'string') return r.response || ''

    // 3. Formato OpenAI/Kimi K2.6 — { choices: [{ message: { content: "..." } }] }
    if (Array.isArray(r.choices) && r.choices.length > 0) {
      const choice = r.choices[0]
      // chat completion: choices[0].message.content
      if (choice?.message?.content) return String(choice.message.content)
      // streaming delta: choices[0].delta.content
      if (choice?.delta?.content) return String(choice.delta.content)
      // text completion: choices[0].text
      if (choice?.text) return String(choice.text)
    }

    // 4. { result: { response: "..." } }
    if (r.result && typeof r.result === 'object' && 'response' in r.result) {
      return String(r.result.response || '')
    }
  }

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

// ─── AUTH CONFIG ─────────────────────────────────────────────────────────────
const AUTH_USERS: Record<string, string> = {
  'sixtech':  'sixtech@2025',
  'admin':    'Admin@SixTech1',
}
const SESSION_COOKIE = 'st_sess'
const SESSION_TTL    = 60 * 60 * 8   // 8 horas em segundos
// Segredo para assinar tokens — fixo no código (sem KV necessário)
const TOKEN_SECRET   = 'SixTechMAS_JWT_S3cr3t_2025_x9kLmP'

// ── Assinatura HMAC-SHA256 (Web Crypto API — disponível no CF Workers) ────────
async function hmacSign(data: string): Promise<string> {
  const enc  = new TextEncoder()
  const key  = await crypto.subtle.importKey(
    'raw', enc.encode(TOKEN_SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig  = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'')
}

async function hmacVerify(data: string, sig: string): Promise<boolean> {
  const expected = await hmacSign(data)
  return expected === sig
}

// ── Gerar token stateless: base64(payload).HMAC ───────────────────────────────
async function createToken(user: string): Promise<string> {
  const payload = btoa(JSON.stringify({ u: user, exp: Math.floor(Date.now()/1000) + SESSION_TTL }))
    .replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'')
  const sig = await hmacSign(payload)
  return `${payload}.${sig}`
}

// ── Verificar e decodificar token ─────────────────────────────────────────────
async function verifyToken(token: string): Promise<{ user: string } | null> {
  try {
    const [payload, sig] = token.split('.')
    if (!payload || !sig) return null
    const valid = await hmacVerify(payload, sig)
    if (!valid) return null
    // Decodificar payload
    const padded = payload.replace(/-/g,'+').replace(/_/g,'/')
    const json   = JSON.parse(atob(padded + '==='.slice((padded.length % 4) || 4)))
    if (Math.floor(Date.now()/1000) > json.exp) return null
    return { user: json.u }
  } catch {
    return null
  }
}

// ── Extrair token do cookie ───────────────────────────────────────────────────
async function getSession(c: any): Promise<{ user: string } | null> {
  const cookieHeader = c.req.header('cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`))
  if (!match) return null
  return verifyToken(match[1])
}

// ─── HONO APP ─────────────────────────────────────────────────────────────────
const app = new Hono<{ Bindings: Bindings }>()
app.use('*', cors())

// ── GET /favicon.ico — evita 500 no browser
app.get('/favicon.ico', (c) => new Response(null, { status: 204 }))

// ── POST /api/login ───────────────────────────────────────────────────────────
app.post('/api/login', async (c) => {
  const { username, password } = await c.req.json() as { username: string; password: string }
  const expected = AUTH_USERS[username?.trim()]
  if (!expected || expected !== password) {
    return c.json({ ok: false, error: 'Usuário ou senha incorretos' }, 401)
  }
  const token = await createToken(username.trim())
  const cookieVal = `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL}`
  return new Response(JSON.stringify({ ok: true, user: username.trim() }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookieVal,
      'Access-Control-Allow-Origin': '*'
    }
  })
})

// ── POST /api/logout ──────────────────────────────────────────────────────────
app.post('/api/logout', (c) => {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `${SESSION_COOKIE}=; Path=/; Max-Age=0`
    }
  })
})

// ── GET /api/me — checa sessão ────────────────────────────────────────────────
app.get('/api/me', async (c) => {
  const sess = await getSession(c)
  if (!sess) return c.json({ ok: false }, 401)
  return c.json({ ok: true, user: sess.user })
})

// ── Middleware: protege rotas /api/* que precisam de auth ─────────────────────
// Rotas PÚBLICAS (sem login): login, me, logout, status, models
const PUBLIC_API = ['/api/login', '/api/me', '/api/logout', '/api/status', '/api/models']
app.use('/api/*', async (c, next) => {
  const path = new URL(c.req.url).pathname
  if (PUBLIC_API.includes(path)) return next()
  const sess = await getSession(c)
  if (!sess) return c.json({ error: 'Não autorizado', code: 401 }, 401)
  return next()
})

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
// Cache-first: verifica D1 antes de chamar IA (economiza tokens)
app.post('/api/agent/:id', async (c) => {
  const agent = AGENTS.find(a => a.id === c.req.param('id'))
  if (!agent) return c.json({ error: 'Agente não encontrado' }, 404)

  const { message, task, use_cache } = await c.req.json() as {
    message?: string; task?: string; use_cache?: boolean
  }
  const userMsg = message || task || ''

  // Cache-first (ativo por padrão, desligar com use_cache=false)
  const db = c.env.DB
  if (db && use_cache !== false && userMsg.length > 10) {
    const hash = await sha256(`${agent.id}:${userMsg}`)
    const now  = new Date().toISOString()
    const cached = await db.prepare(
      `SELECT * FROM query_cache WHERE query_hash=? AND (expires_at IS NULL OR expires_at > ?)`
    ).bind(hash, now).first() as any

    if (cached) {
      // Atualiza hit_count
      await db.prepare(`UPDATE query_cache SET hit_count=hit_count+1 WHERE id=?`)
               .bind(cached.id).run()
      // Retorna no mesmo formato de RunResult
      return c.json({
        agentId:     agent.id,
        name:        agent.name,
        emoji:       agent.emoji,
        color:       agent.color,
        model:       agent.model,
        source:      agent.source,
        response:    cached.response,
        duration:    0,
        fromCache:   true,
        cacheHits:   (cached.hit_count ?? 0) + 1,
        tokensSaved: cached.tokens_saved ?? 0
      })
    }

    // Cache miss — chamar IA normalmente
    const result = await runAgent(agent, userMsg, c.env.AI)

    // Salvar no cache (TTL 24h por padrão)
    const tokensEst = Math.ceil(userMsg.length / 4) + Math.ceil(result.response.length / 4)
    const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString()
    await db.prepare(
      `INSERT OR REPLACE INTO query_cache (query_hash,query_text,response,source,agent_id,tokens_saved,expires_at)
       VALUES (?,?,?,?,?,?,?)`
    ).bind(hash, userMsg, result.response, 'cloudflare-ai', agent.id, tokensEst, expiresAt).run()

    return c.json({ ...result, fromCache: false })
  }

  // Sem DB ou cache desabilitado — comportamento original
  const result = await runAgent(agent, userMsg, c.env.AI)
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

// ── POST /api/document/generate ───────────────────────────────────────────
// Gera um documento completo via IA (contrato, NDA, relatório, etc.)
app.post('/api/document/generate', async (c) => {
  const sess = await getSession(c)
  if (!sess) return c.json({ error: 'Não autorizado' }, 401)

  const { agentId, docType, instructions, context } = await c.req.json() as {
    agentId: string; docType: string; instructions: string; context?: string
  }

  const agent = AGENTS.find(a => a.id === agentId)
  if (!agent) return c.json({ error: 'Agente não encontrado' }, 404)

  const systemPrompt = `${agent.system}

MODO: GERADOR DE DOCUMENTOS PROFISSIONAIS
Você irá gerar um documento completo e profissional do tipo: ${docType}
Instruções específicas: ${instructions}
${context ? `Contexto adicional: ${context}` : ''}

REGRAS OBRIGATÓRIAS:
1. Gere o documento COMPLETO, não resumido
2. Use formatação Markdown rica (## títulos, **negrito**, tabelas, listas)
3. Inclua TODAS as seções necessárias para um documento profissional
4. No início, coloque o título do documento em # TÍTULO
5. Separe seções com --- quando necessário
6. Para contratos/NDAs: inclua cláusulas numeradas, partes, objeto, vigência, assinaturas
7. Responda APENAS com o documento, sem explicações antes ou depois`

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Gere agora o documento: ${docType}\n\nInstruções: ${instructions}` }
  ]

  const stream = await (c.env.AI as any).run(agent.model, {
    messages, max_tokens: 4096, stream: true
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

// ── POST /api/document/analyze ────────────────────────────────────────────
// Analisa texto de documento enviado pelo usuário (conteúdo extraído no frontend)
app.post('/api/document/analyze', async (c) => {
  const sess = await getSession(c)
  if (!sess) return c.json({ error: 'Não autorizado' }, 401)

  const { agentId, fileContent, fileName, instruction } = await c.req.json() as {
    agentId: string; fileContent: string; fileName: string; instruction?: string
  }

  const agent = AGENTS.find(a => a.id === agentId)
  if (!agent) return c.json({ error: 'Agente não encontrado' }, 404)

  const systemPrompt = `${agent.system}

MODO: ANÁLISE DE DOCUMENTO
Analise criticamente o documento fornecido pelo usuário.
${instruction ? `Instrução específica: ${instruction}` : ''}

ESTRUTURA DA ANÁLISE (use Markdown):
## 📋 Resumo Executivo
## ✅ Pontos Positivos
## ⚠️ Pontos de Atenção / Riscos
## 🔧 Sugestões de Melhoria
## 📝 Versão Corrigida (se aplicável — reescreva trechos problemáticos)
## ✔️ Conclusão e Score (0-10)`

  const userMsg = `Arquivo: ${fileName}\n\n--- CONTEÚDO DO DOCUMENTO ---\n${fileContent.slice(0, 12000)}\n--- FIM DO DOCUMENTO ---\n\n${instruction || 'Analise este documento e aponte melhorias, erros e ajustes necessários.'}`

  const stream = await (c.env.AI as any).run(agent.model, {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMsg }
    ],
    max_tokens: 4096, stream: true
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

// ═══════════════════════════════════════════════════════════════════════════
// KNOWLEDGE BASE — APIs públicas · Cache de queries · Conhecimento acumulado
// ═══════════════════════════════════════════════════════════════════════════

// helper: SHA-256 hex de uma string (Web Crypto API — sem fs/node)
async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text.toLowerCase().trim()))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// ── GET /api/public-apis ─────────────────────────────────────────────────
// Lista APIs públicas gratuitas do banco. Suporta ?category=&q=&limit=
app.get('/api/public-apis', async (c) => {
  const db = c.env.DB
  if (!db) return c.json({ error: 'DB não disponível' }, 503)

  const category = c.req.query('category') || ''
  const q        = c.req.query('q')        || ''
  const limit    = Math.min(parseInt(c.req.query('limit') || '50'), 200)

  let sql  = 'SELECT * FROM public_apis WHERE 1=1'
  const params: (string | number)[] = []

  if (category) { sql += ' AND category = ?';            params.push(category) }
  if (q)        { sql += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)';
                  params.push(`%${q}%`, `%${q}%`, `%${q}%`) }

  sql += ' ORDER BY quality DESC, name ASC LIMIT ?'
  params.push(limit)

  const rows = await db.prepare(sql).bind(...params).all()

  // categorias disponíveis (para filtros)
  const cats = await db.prepare('SELECT DISTINCT category FROM public_apis ORDER BY category').all()

  return c.json({
    total: rows.results?.length ?? 0,
    categories: cats.results?.map((r: any) => r.category) ?? [],
    apis: rows.results ?? []
  })
})

// ── POST /api/public-apis ─────────────────────────────────────────────────
// Adiciona nova API ao catálogo
app.post('/api/public-apis', async (c) => {
  const db = c.env.DB
  if (!db) return c.json({ error: 'DB não disponível' }, 503)

  const { name, category, description, base_url, docs_url, auth_type, example, tags, quality } =
    await c.req.json() as {
      name: string; category: string; description?: string; base_url?: string
      docs_url?: string; auth_type?: string; example?: string; tags?: string; quality?: number
    }

  if (!name || !category) return c.json({ error: 'name e category são obrigatórios' }, 400)

  const result = await db.prepare(
    `INSERT INTO public_apis (name,category,description,base_url,docs_url,auth_type,example,tags,quality)
     VALUES (?,?,?,?,?,?,?,?,?)`
  ).bind(
    name, category,
    description ?? '',
    base_url    ?? '',
    docs_url    ?? '',
    auth_type   ?? 'none',
    example     ?? '',
    tags        ?? '',
    quality     ?? 8
  ).run()

  return c.json({ success: true, id: result.meta?.last_row_id })
})

// ── POST /api/cache-query ─────────────────────────────────────────────────
// Cache-first: hash da query → busca D1 → IA → salva resultado
app.post('/api/cache-query', async (c) => {
  const db = c.env.DB
  if (!db) return c.json({ error: 'DB não disponível' }, 503)

  const { query, agent_id, model, ttl_hours } = await c.req.json() as {
    query: string; agent_id?: string; model?: string; ttl_hours?: number
  }
  if (!query) return c.json({ error: 'query é obrigatória' }, 400)

  const hash = await sha256(query)
  const now  = new Date().toISOString()

  // 1. Verificar cache
  const cached = await db.prepare(
    `SELECT * FROM query_cache WHERE query_hash=? AND (expires_at IS NULL OR expires_at > ?)`
  ).bind(hash, now).first() as any

  if (cached) {
    // Incrementar hit_count
    await db.prepare(`UPDATE query_cache SET hit_count=hit_count+1 WHERE id=?`)
                .bind(cached.id).run()
    return c.json({
      source: 'cache',
      hit_count: (cached.hit_count ?? 0) + 1,
      tokens_saved: cached.tokens_saved ?? 0,
      agent_id: cached.agent_id ?? null,
      response: cached.response,
      cached_at: cached.created_at
    })
  }

  // 2. Cache miss — chamar IA
  const agentObj = agent_id ? AGENTS.find(a => a.id === agent_id) : null
  const aiModel  = model ?? agentObj?.model ?? CF_MODELS.llama
  const system   = agentObj?.system ?? 'Você é um assistente útil e preciso.'

  let response = ''
  try {
    response = await callCFAI(c.env.AI, aiModel, system, query, 1500)
  } catch (e: any) {
    return c.json({ error: `Erro ao chamar IA: ${e?.message ?? e}` }, 500)
  }

  // 3. Estimar tokens economizados (aprox: chars/4)
  const tokensEst = Math.ceil(query.length / 4) + Math.ceil(response.length / 4)
  const expiresAt = ttl_hours
    ? new Date(Date.now() + ttl_hours * 3600 * 1000).toISOString()
    : null

  await db.prepare(
    `INSERT INTO query_cache (query_hash,query_text,response,source,agent_id,tokens_saved,expires_at)
     VALUES (?,?,?,?,?,?,?)`
  ).bind(hash, query, response, 'cloudflare-ai', agent_id ?? null, tokensEst, expiresAt).run()

  return c.json({
    source: 'ai',
    hit_count: 0,
    tokens_saved: 0,
    agent_id: agent_id ?? null,
    response,
    model: aiModel
  })
})

// ── GET /api/cache/stats ──────────────────────────────────────────────────
app.get('/api/cache/stats', async (c) => {
  const db = c.env.DB
  if (!db) return c.json({ error: 'DB não disponível' }, 503)

  const total     = await db.prepare('SELECT COUNT(*) as n FROM query_cache').first() as any
  const hits      = await db.prepare('SELECT SUM(hit_count) as n FROM query_cache').first() as any
  const saved     = await db.prepare('SELECT SUM(tokens_saved) as n FROM query_cache').first() as any
  const byAgent   = await db.prepare(
    `SELECT agent_id, COUNT(*) as entries, SUM(hit_count) as hits
     FROM query_cache WHERE agent_id IS NOT NULL GROUP BY agent_id ORDER BY hits DESC`
  ).all()

  return c.json({
    total_entries:  total?.n  ?? 0,
    total_hits:     hits?.n   ?? 0,
    tokens_saved:   saved?.n  ?? 0,
    by_agent: byAgent.results ?? []
  })
})

// ── DELETE /api/cache ─────────────────────────────────────────────────────
// Limpa entradas expiradas (ou todas se ?all=1)
app.delete('/api/cache', async (c) => {
  const db  = c.env.DB
  if (!db) return c.json({ error: 'DB não disponível' }, 503)
  const all = c.req.query('all') === '1'

  if (all) {
    const r = await db.prepare('DELETE FROM query_cache').run()
    return c.json({ deleted: r.meta?.changes ?? 0, scope: 'all' })
  }

  const now = new Date().toISOString()
  const r   = await db.prepare('DELETE FROM query_cache WHERE expires_at IS NOT NULL AND expires_at < ?')
                      .bind(now).run()
  return c.json({ deleted: r.meta?.changes ?? 0, scope: 'expired' })
})

// ── GET /api/knowledge ────────────────────────────────────────────────────
// Lista conhecimento acumulado. Suporta ?agent_id=&category=&q=&limit=
app.get('/api/knowledge', async (c) => {
  const db = c.env.DB
  if (!db) return c.json({ error: 'DB não disponível' }, 503)

  const agent_id = c.req.query('agent_id') || ''
  const category = c.req.query('category') || ''
  const q        = c.req.query('q')        || ''
  const limit    = Math.min(parseInt(c.req.query('limit') || '50'), 500)

  let sql  = 'SELECT * FROM knowledge WHERE 1=1'
  const params: (string | number)[] = []

  if (agent_id) { sql += ' AND agent_id = ?';              params.push(agent_id) }
  if (category) { sql += ' AND category = ?';              params.push(category) }
  if (q)        { sql += ' AND (topic LIKE ? OR content LIKE ? OR keywords LIKE ?)';
                  params.push(`%${q}%`, `%${q}%`, `%${q}%`) }

  sql += ' ORDER BY confidence DESC, used_count DESC, created_at DESC LIMIT ?'
  params.push(limit)

  const rows = await db.prepare(sql).bind(...params).all()
  const total = await db.prepare('SELECT COUNT(*) as n FROM knowledge').first() as any

  return c.json({
    total: total?.n ?? 0,
    returned: rows.results?.length ?? 0,
    knowledge: rows.results ?? []
  })
})

// ── POST /api/knowledge/add ───────────────────────────────────────────────
// Agente aprende novo conhecimento (manual ou via IA)
app.post('/api/knowledge/add', async (c) => {
  const db = c.env.DB
  if (!db) return c.json({ error: 'DB não disponível' }, 503)

  const { agent_id, topic, category, content, source_url, source_type, confidence, keywords } =
    await c.req.json() as {
      agent_id: string; topic: string; category: string; content: string
      source_url?: string; source_type?: string; confidence?: number; keywords?: string
    }

  if (!agent_id || !topic || !category || !content)
    return c.json({ error: 'agent_id, topic, category e content são obrigatórios' }, 400)

  // Verificar se agente existe
  const agent = AGENTS.find(a => a.id === agent_id)
  if (!agent) return c.json({ error: 'Agente não encontrado' }, 404)

  const result = await db.prepare(
    `INSERT INTO knowledge (agent_id,topic,category,content,source_url,source_type,confidence,keywords)
     VALUES (?,?,?,?,?,?,?,?)`
  ).bind(
    agent_id, topic, category, content,
    source_url  ?? '',
    source_type ?? 'manual',
    confidence  ?? 0.9,
    keywords    ?? ''
  ).run()

  return c.json({ success: true, id: result.meta?.last_row_id, agent_id, topic })
})

// ── POST /api/knowledge/learn ─────────────────────────────────────────────
// Agente aprende automaticamente via IA sobre um tópico
app.post('/api/knowledge/learn', async (c) => {
  const db = c.env.DB
  if (!db) return c.json({ error: 'DB não disponível' }, 503)

  const { agent_id, topic, category } = await c.req.json() as {
    agent_id: string; topic: string; category?: string
  }
  if (!agent_id || !topic) return c.json({ error: 'agent_id e topic são obrigatórios' }, 400)

  const agent = AGENTS.find(a => a.id === agent_id)
  if (!agent) return c.json({ error: 'Agente não encontrado' }, 404)

  const prompt = `Você é ${agent.emoji} ${agent.name}. Aprenda sobre o tópico "${topic}" e explique de forma clara e objetiva em português, com foco prático. Máximo 300 palavras.`

  let content = ''
  try {
    content = await callCFAI(c.env.AI, agent.model, agent.system, prompt, 800)
  } catch (e: any) {
    return c.json({ error: `Erro ao chamar IA: ${e?.message ?? e}` }, 500)
  }

  // Extrair keywords simples (palavras com >4 chars, deduplicadas)
  const words = content.match(/\b\w{5,}\b/g) ?? []
  const freq: Record<string,number> = {}
  for (const w of words) { const k = w.toLowerCase(); freq[k] = (freq[k]||0)+1 }
  const keywords = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,10).map(e=>e[0]).join(',')

  const result = await db.prepare(
    `INSERT INTO knowledge (agent_id,topic,category,content,source_type,confidence,keywords)
     VALUES (?,?,?,?,?,?,?)`
  ).bind(
    agent_id, topic, category ?? agent.category, content,
    'ai', 0.85, keywords
  ).run()

  return c.json({
    success: true,
    id: result.meta?.last_row_id,
    agent_id,
    topic,
    content,
    keywords
  })
})

// ── POST /api/knowledge/clone ─────────────────────────────────────────────
// Clona conhecimento de um agente para outro (expansão de bots)
app.post('/api/knowledge/clone', async (c) => {
  const db = c.env.DB
  if (!db) return c.json({ error: 'DB não disponível' }, 503)

  const { from_agent_id, to_agent_id, category, limit } = await c.req.json() as {
    from_agent_id: string; to_agent_id: string; category?: string; limit?: number
  }
  if (!from_agent_id || !to_agent_id)
    return c.json({ error: 'from_agent_id e to_agent_id são obrigatórios' }, 400)

  const toAgent = AGENTS.find(a => a.id === to_agent_id)
  if (!toAgent) return c.json({ error: 'Agente destino não encontrado' }, 404)

  // Buscar conhecimento do agente origem
  let sql = `SELECT * FROM knowledge WHERE agent_id=?`
  const params: (string | number)[] = [from_agent_id]
  if (category) { sql += ' AND category=?'; params.push(category) }
  sql += ` ORDER BY confidence DESC, used_count DESC LIMIT ?`
  params.push(Math.min(limit ?? 20, 100))

  const rows = await db.prepare(sql).bind(...params).all()
  const items = (rows.results ?? []) as any[]

  if (items.length === 0) return c.json({ cloned: 0, message: 'Nenhum conhecimento encontrado para clonar' })

  // Inserir cópias para o agente destino (ignora duplicatas por topic+agent)
  let cloned = 0
  for (const item of items) {
    try {
      await db.prepare(
        `INSERT OR IGNORE INTO knowledge (agent_id,topic,category,content,source_url,source_type,confidence,keywords)
         SELECT ?,topic,category,content,source_url,'cloned',confidence*0.95,keywords FROM knowledge WHERE id=?`
      ).bind(to_agent_id, item.id).run()
      cloned++
    } catch { /* ignora conflitos */ }
  }

  return c.json({
    success: true,
    from_agent_id,
    to_agent_id,
    cloned,
    total_available: items.length
  })
})

// ── GET /api/knowledge/stats ──────────────────────────────────────────────
app.get('/api/knowledge/stats', async (c) => {
  const db = c.env.DB
  if (!db) return c.json({ error: 'DB não disponível' }, 503)

  const total    = await db.prepare('SELECT COUNT(*) as n FROM knowledge').first() as any
  const byAgent  = await db.prepare(
    `SELECT agent_id, COUNT(*) as entries, AVG(confidence) as avg_confidence, SUM(used_count) as total_uses
     FROM knowledge GROUP BY agent_id ORDER BY entries DESC`
  ).all()
  const bySource = await db.prepare(
    `SELECT source_type, COUNT(*) as n FROM knowledge GROUP BY source_type`
  ).all()

  return c.json({
    total: total?.n ?? 0,
    by_agent:  byAgent.results  ?? [],
    by_source: bySource.results ?? []
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

/* ── Login Overlay ────────────────────────────────────────── */
#login-overlay{
  position:fixed;inset:0;z-index:9999;
  background:var(--bg);
  display:flex;align-items:center;justify-content:center;
}
#login-overlay.hidden{display:none}
.login-box{
  width:100%;max-width:400px;
  background:var(--surface);border:1px solid var(--border);
  border-radius:20px;padding:36px 32px 32px;
  display:flex;flex-direction:column;align-items:center;gap:0;
  box-shadow:0 24px 60px rgba(0,0,0,.5);
}
.login-logo{
  width:56px;height:56px;border-radius:16px;
  background:linear-gradient(135deg,#6C63FF,#22D3EE);
  display:flex;align-items:center;justify-content:center;
  font-size:28px;margin-bottom:14px;
}
.login-title{font-size:22px;font-weight:800;color:#fff;text-align:center;margin-bottom:4px}
.login-sub{font-size:12px;color:var(--muted);text-align:center;margin-bottom:28px}
.login-field{width:100%;margin-bottom:14px}
.login-label{display:block;font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
.login-input{
  width:100%;background:var(--bg);border:1px solid var(--border);
  color:var(--text);border-radius:10px;padding:11px 14px;
  font-size:14px;font-family:inherit;
}
.login-input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(108,99,255,.18)}
.login-btn{
  width:100%;margin-top:8px;padding:13px;border-radius:12px;
  background:linear-gradient(135deg,var(--primary),#4f46e5);
  color:#fff;border:none;font-size:15px;font-weight:700;
  cursor:pointer;transition:opacity .15s;
}
.login-btn:hover{opacity:.88}
.login-btn:disabled{opacity:.45;cursor:not-allowed}
.login-error{
  width:100%;margin-top:12px;padding:10px 14px;border-radius:10px;
  background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);
  color:#F87171;font-size:13px;text-align:center;display:none;
}
.login-footer{margin-top:20px;font-size:11px;color:var(--muted);text-align:center}

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

/* ── Abas do agente (Chat / Documento / Analisar) ─────────── */
.fc-tabs{display:flex;gap:0;border-bottom:1px solid var(--border);flex-shrink:0;background:var(--surface)}
.fc-tab{
  padding:10px 18px;font-size:12px;font-weight:600;color:var(--muted);
  cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;
  display:flex;align-items:center;gap:7px;white-space:nowrap;
}
.fc-tab:hover{color:var(--text);background:rgba(108,99,255,.06)}
.fc-tab.active{color:#fff;border-bottom-color:var(--primary);background:rgba(108,99,255,.08)}
.fc-tab-panel{display:none;flex:1;flex-direction:column;overflow:hidden;min-height:0}
.fc-tab-panel.active{display:flex}

/* ── Painel Documento: gerar ──────────────────────────────── */
.doc-gen-wrap{display:flex;flex-direction:column;height:100%;overflow:hidden}
.doc-gen-form{
  padding:18px 22px;border-bottom:1px solid var(--border);flex-shrink:0;
  display:flex;flex-direction:column;gap:12px;background:var(--surface);
}
.doc-gen-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.doc-field label{display:block;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px}
.doc-field input,.doc-field textarea,.doc-field select{
  width:100%;background:var(--bg);border:1px solid var(--border);
  color:var(--text);border-radius:9px;padding:9px 12px;
  font-size:13px;font-family:inherit;resize:none;
}
.doc-field input:focus,.doc-field textarea:focus,.doc-field select:focus{
  outline:none;border-color:var(--primary);box-shadow:0 0 0 2px rgba(108,99,255,.18)
}
.doc-types-grid{display:flex;flex-wrap:wrap;gap:6px}
.doc-type-btn{
  font-size:11px;padding:5px 11px;border-radius:8px;
  background:var(--card);border:1px solid var(--border);
  color:var(--muted);cursor:pointer;transition:all .15s;
}
.doc-type-btn:hover,.doc-type-btn.sel{background:rgba(108,99,255,.18);color:#fff;border-color:var(--primary)}
.doc-gen-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.btn-gen-doc{
  display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:10px;
  background:linear-gradient(135deg,var(--primary),#4f46e5);color:#fff;
  border:none;font-size:13px;font-weight:700;cursor:pointer;transition:opacity .15s;
}
.btn-gen-doc:hover{opacity:.88}
.btn-gen-doc:disabled{opacity:.45;cursor:not-allowed}

/* ── Resultado do documento gerado ───────────────────────── */
.doc-result-wrap{flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0}
.doc-result-toolbar{
  display:flex;align-items:center;gap:8px;padding:10px 18px;
  border-bottom:1px solid var(--border);flex-shrink:0;
  background:var(--surface);flex-wrap:wrap;
}
.doc-result-title{font-size:13px;font-weight:700;color:#fff;flex:1}
.btn-dl{
  display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:9px;
  font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all .15s;
}
.btn-dl-pdf{background:rgba(239,68,68,.15);color:#F87171;border:1px solid rgba(239,68,68,.3)}
.btn-dl-pdf:hover{background:rgba(239,68,68,.28);color:#fff}
.btn-dl-word{background:rgba(59,130,246,.15);color:#60A5FA;border:1px solid rgba(59,130,246,.3)}
.btn-dl-word:hover{background:rgba(59,130,246,.28);color:#fff}
.btn-dl-txt{background:rgba(52,211,153,.12);color:#34D399;border:1px solid rgba(52,211,153,.25)}
.btn-dl-txt:hover{background:rgba(52,211,153,.22);color:#fff}
.btn-copy-doc{background:var(--card);color:var(--muted);border:1px solid var(--border)}
.btn-copy-doc:hover{color:#fff;background:var(--border)}
.doc-preview{
  flex:1;overflow-y:auto;padding:22px 28px;
  font-size:13px;line-height:1.75;color:var(--text);
}
.doc-preview h1{font-size:1.3rem;font-weight:800;color:#fff;margin:0 0 16px;text-align:center;border-bottom:2px solid var(--primary);padding-bottom:10px}
.doc-preview h2{font-size:1rem;font-weight:700;color:#a5b4fc;margin:18px 0 8px}
.doc-preview h3{font-size:.9rem;font-weight:600;color:#22D3EE;margin:14px 0 6px}
.doc-preview strong{color:#fff}
.doc-preview hr{border:none;border-top:1px solid var(--border);margin:18px 0}
.doc-preview pre{background:#0d0d1a;border:1px solid var(--border);border-radius:8px;padding:12px;overflow-x:auto;margin:8px 0}
.doc-preview code{color:#f472b6;font-family:monospace;font-size:12px}
.doc-preview blockquote{border-left:3px solid var(--primary);padding-left:12px;color:var(--muted);margin:8px 0}
.doc-preview table{width:100%;border-collapse:collapse;margin:10px 0}
.doc-preview th{background:var(--card);padding:8px 12px;text-align:left;font-size:12px;color:#a5b4fc;border:1px solid var(--border)}
.doc-preview td{padding:7px 12px;font-size:12px;border:1px solid var(--border)}
.doc-preview li{margin:3px 0;padding-left:4px}
.doc-empty{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  flex:1;gap:12px;color:var(--muted);padding:40px;text-align:center;
}
.doc-empty-icon{font-size:48px;opacity:.4}
.doc-streaming{padding:22px 28px;font-size:13px;line-height:1.75;color:var(--text);overflow-y:auto;flex:1}

/* ── Painel Analisar arquivo ──────────────────────────────── */
.analyze-wrap{display:flex;flex-direction:column;height:100%;overflow:hidden}
.upload-zone{
  margin:18px 22px 0;border:2px dashed var(--border);border-radius:14px;
  padding:28px;text-align:center;cursor:pointer;transition:all .2s;flex-shrink:0;
  background:var(--card);
}
.upload-zone:hover,.upload-zone.drag-over{border-color:var(--primary);background:rgba(108,99,255,.07)}
.upload-zone-icon{font-size:36px;margin-bottom:8px;opacity:.6}
.upload-zone-txt{font-size:13px;color:var(--muted)}
.upload-zone-sub{font-size:11px;color:var(--muted);margin-top:4px;opacity:.7}
.upload-file-name{
  margin:10px 22px 0;padding:10px 14px;background:rgba(108,99,255,.1);
  border:1px solid rgba(108,99,255,.25);border-radius:10px;
  display:none;align-items:center;gap:10px;font-size:13px;color:#a5b4fc;flex-shrink:0;
}
.upload-file-name i{font-size:18px}
.analyze-instruction{padding:12px 22px;flex-shrink:0}
.analyze-instruction textarea{height:56px;resize:none;font-size:12px}
.analyze-actions{padding:0 22px 14px;flex-shrink:0;display:flex;gap:8px}
.btn-analyze{
  display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:10px;
  background:linear-gradient(135deg,#059669,#10b981);color:#fff;
  border:none;font-size:13px;font-weight:700;cursor:pointer;transition:opacity .15s;
}
.btn-analyze:hover{opacity:.88}
.btn-analyze:disabled{opacity:.45;cursor:not-allowed}
.analyze-result{flex:1;overflow-y:auto;padding:18px 22px;min-height:0}
</style>
</head>
<body>

<!-- ══ LOGIN OVERLAY ════════════════════════════════════════ -->
<div id="login-overlay">
  <div class="login-box">
    <div class="login-logo">🤖</div>
    <div class="login-title">SixTech MAS</div>
    <div class="login-sub">Multi-Agent System v3.0 · Cloudflare Workers AI</div>

    <div class="login-field">
      <label class="login-label" for="l-user">Usuário</label>
      <input class="login-input" type="text" id="l-user" placeholder="Digite seu usuário"
        autocomplete="username" onkeydown="if(event.key==='Enter')document.getElementById('l-pass').focus()">
    </div>
    <div class="login-field">
      <label class="login-label" for="l-pass">Senha</label>
      <input class="login-input" type="password" id="l-pass" placeholder="••••••••••"
        autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin()">
    </div>

    <button class="login-btn" id="login-btn" onclick="doLogin()">
      <i class="fas fa-sign-in-alt" style="margin-right:8px"></i>Entrar
    </button>
    <div class="login-error" id="login-error"></div>

    <div class="login-footer">
      <i class="fas fa-lock" style="margin-right:4px"></i>
      Acesso restrito · SixTech Brasil
    </div>
  </div>
</div>

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
    <div id="hdr-user" style="display:none;align-items:center;gap:6px;font-size:12px;color:var(--muted);padding:5px 10px;background:var(--card);border:1px solid var(--border);border-radius:8px">
      <i class="fas fa-user-circle" style="color:var(--primary)"></i>
      <span id="hdr-username">—</span>
    </div>
    <a href="https://github.com/kainow252-cmyk/sixtechbrasil" target="_blank" class="btn-gh">
      <i class="fab fa-github"></i> GitHub
    </a>
    <button class="btn-gh" id="logout-btn" style="display:none" onclick="doLogout()" title="Sair">
      <i class="fas fa-sign-out-alt"></i> Sair
    </button>
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
      <div class="chat-box" style="height:calc(100vh - var(--header-h) - 40px)">
        <div class="chat-hdr">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:16px">💬</span>
            <span style="font-weight:600;font-size:14px;color:#fff">Chat Livre com IA</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <select id="chat-model" style="background:var(--card);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:4px 10px;font-size:11px;outline:none"></select>
            <button class="btn btn-ghost" style="padding:5px 10px;font-size:11px" onclick="clearChat()">
              <i class="fas fa-trash-alt"></i> Limpar
            </button>
          </div>
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
            <button class="fc-clear-btn" id="fc-clear-btn" onclick="fcClear()" title="Limpar">
              <i class="fas fa-trash-alt"></i> Limpar
            </button>
            <button class="fc-back-btn" onclick="showHome(null)" title="Voltar ao início">
              <i class="fas fa-arrow-left"></i> Voltar
            </button>
          </div>
        </div>

        <!-- Abas: Chat | Gerar Documento | Analisar Arquivo -->
        <div class="fc-tabs" id="fc-tabs">
          <div class="fc-tab active" data-tab="chat" onclick="switchFcTab('chat',this)">
            <i class="fas fa-comments"></i> Chat
          </div>
          <div class="fc-tab" data-tab="doc" onclick="switchFcTab('doc',this)">
            <i class="fas fa-file-alt"></i> Gerar Documento
          </div>
          <div class="fc-tab" data-tab="analyze" onclick="switchFcTab('analyze',this)">
            <i class="fas fa-search"></i> Analisar Arquivo
          </div>
        </div>

        <!-- ── ABA: CHAT ─────────────────────────────────────── -->
        <div id="fc-panel-chat" class="fc-tab-panel active">
          <div class="fc-body">
            <div id="fc-msgs" class="fc-msgs"></div>
            <div id="fc-typing" class="fc-typing">
              <span class="typing-dot"></span>
              <span>Agente digitando...</span>
            </div>
            <div id="fc-quick" class="fc-quick"></div>
            <div class="fc-input-row">
              <textarea id="fc-input"
                placeholder="Digite sua mensagem... (Enter para enviar)"
                onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();fcSend()}"></textarea>
              <button id="fc-send-btn" onclick="fcSend()" title="Enviar">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- ── ABA: GERAR DOCUMENTO ──────────────────────────── -->
        <div id="fc-panel-doc" class="fc-tab-panel">
          <div class="doc-gen-wrap">

            <!-- Formulário de geração -->
            <div class="doc-gen-form">
              <div>
                <div class="doc-field" style="margin-bottom:8px">
                  <label>Tipo de Documento</label>
                  <div class="doc-types-grid" id="doc-types-grid"></div>
                </div>
                <div class="doc-gen-row">
                  <div class="doc-field">
                    <label>Ou descreva o tipo</label>
                    <input type="text" id="doc-type-input" placeholder="Ex: Contrato de Prestação de Serviços">
                  </div>
                  <div class="doc-field">
                    <label>Partes envolvidas</label>
                    <input type="text" id="doc-parties" placeholder="Ex: Empresa A e Empresa B">
                  </div>
                </div>
                <div class="doc-field">
                  <label>Instruções específicas</label>
                  <textarea id="doc-instructions" rows="2"
                    placeholder="Descreva detalhes, cláusulas especiais, valores, prazos, condições..."></textarea>
                </div>
              </div>
              <div class="doc-gen-actions">
                <button class="btn-gen-doc" id="btn-gen-doc" onclick="generateDocument()">
                  <i class="fas fa-magic"></i> Gerar Documento com IA
                </button>
                <span id="doc-gen-status" style="font-size:12px;color:var(--muted)"></span>
              </div>
            </div>

            <!-- Resultado + toolbar de download -->
            <div class="doc-result-wrap" id="doc-result-wrap">
              <div class="doc-result-toolbar" id="doc-result-toolbar" style="display:none">
                <span class="doc-result-title" id="doc-result-title">Documento Gerado</span>
                <button class="btn-dl btn-copy-doc" onclick="copyDocument()" title="Copiar">
                  <i class="fas fa-copy"></i> Copiar
                </button>
                <button class="btn-dl btn-dl-txt" onclick="downloadDoc('txt')" title="Baixar TXT">
                  <i class="fas fa-file-alt"></i> TXT
                </button>
                <button class="btn-dl btn-dl-word" onclick="downloadDoc('word')" title="Baixar Word">
                  <i class="fas fa-file-word"></i> Word
                </button>
                <button class="btn-dl btn-dl-pdf" onclick="downloadDoc('pdf')" title="Baixar PDF">
                  <i class="fas fa-file-pdf"></i> PDF
                </button>
              </div>
              <div id="doc-preview-area" class="doc-preview doc-empty">
                <div class="doc-empty-icon">📄</div>
                <div style="font-size:14px;font-weight:600;color:var(--text)">Nenhum documento gerado</div>
                <div style="font-size:12px">Preencha o formulário acima e clique em <strong>Gerar Documento com IA</strong></div>
              </div>
            </div>

          </div>
        </div>

        <!-- ── ABA: ANALISAR ARQUIVO ─────────────────────────── -->
        <div id="fc-panel-analyze" class="fc-tab-panel">
          <div class="analyze-wrap">

            <!-- Upload zone -->
            <div class="upload-zone" id="upload-zone"
              onclick="document.getElementById('file-input').click()"
              ondragover="event.preventDefault();this.classList.add('drag-over')"
              ondragleave="this.classList.remove('drag-over')"
              ondrop="handleFileDrop(event)">
              <div class="upload-zone-icon">📎</div>
              <div class="upload-zone-txt">Clique ou arraste seu arquivo aqui</div>
              <div class="upload-zone-sub">PDF · DOCX · TXT · até 5 MB</div>
            </div>
            <input type="file" id="file-input" accept=".pdf,.doc,.docx,.txt,.md"
              style="display:none" onchange="handleFileSelect(this)">

            <!-- Nome do arquivo carregado -->
            <div class="upload-file-name" id="upload-file-name">
              <i class="fas fa-file-check"></i>
              <span id="upload-file-label">arquivo.pdf</span>
              <button onclick="clearUpload()" style="margin-left:auto;background:none;border:none;color:var(--muted);cursor:pointer;font-size:14px">✕</button>
            </div>

            <!-- Instrução para análise -->
            <div class="analyze-instruction">
              <div class="doc-field">
                <label>Instrução para análise (opcional)</label>
                <textarea id="analyze-instruction"
                  placeholder="Ex: Identifique cláusulas abusivas, verifique conformidade com a LGPD, sugira melhorias..."></textarea>
              </div>
            </div>

            <!-- Botão analisar -->
            <div class="analyze-actions">
              <button class="btn-analyze" id="btn-analyze" onclick="analyzeFile()">
                <i class="fas fa-microscope"></i> Analisar com IA
              </button>
              <div id="doc-result-toolbar-analyze" style="display:none;gap:8px;display:none;align-items:center">
                <button class="btn-dl btn-dl-txt" onclick="downloadAnalysis('txt')">
                  <i class="fas fa-file-alt"></i> TXT
                </button>
                <button class="btn-dl btn-dl-word" onclick="downloadAnalysis('word')">
                  <i class="fas fa-file-word"></i> Word
                </button>
                <button class="btn-dl btn-dl-pdf" onclick="downloadAnalysis('pdf')">
                  <i class="fas fa-file-pdf"></i> PDF
                </button>
              </div>
            </div>

            <!-- Resultado da análise -->
            <div id="analyze-result" class="analyze-result">
              <div class="doc-empty" style="padding:30px 0">
                <div class="doc-empty-icon">🔍</div>
                <div style="font-size:14px;font-weight:600;color:var(--text)">Nenhuma análise realizada</div>
                <div style="font-size:12px">Envie um arquivo acima e clique em <strong>Analisar com IA</strong></div>
              </div>
            </div>

          </div>
        </div>

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
