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
// Fonte: sixtech-workspace/backend/agents/ + sixtechworkspace + agentes nativos CF AI
const AGENTS: AgentDef[] = [
  // ── AGENTES SIXTECH-WORKSPACE (hybrid: internal FastAPI → CF AI fallback) ──
  {
    id: 'developer',
    name: 'Developer',
    emoji: '💻',
    color: '#F87171',
    category: 'SixTech Workspace',
    source: 'hybrid',
    model: CF_MODELS.coder,
    internalUrl: `${INTERNAL_BASE}/agents/developer`,
    basedOn: 'sixtech-workspace + OpenHands',
    capabilities: ['Código production-ready', 'APIs REST/GraphQL', 'Docker & DevOps', 'Banco de dados', 'Integrações'],
    desc: 'Arquiteto de software sênior — Qwen2.5 Coder 32B + backend interno OpenHands',
    system: `Você é um arquiteto de software sênior da SixTech Brasil (baseado em OpenHands).
Seu objetivo: gerar código production-ready, limpo, documentado e testável.
Para cada solução:
1. Explique a arquitetura escolhida
2. Forneça o código completo com comentários
3. Inclua exemplos de uso
4. Liste dependências e requisitos
5. Adicione casos de teste básicos
Tecnologias dominadas: Python, TypeScript, Go, Rust, React, Next.js, FastAPI, Docker, Kubernetes, PostgreSQL, Redis.
Responda SEMPRE em português brasileiro. Use markdown com blocos de código bem formatados.`
  },
  {
    id: 'research',
    name: 'Pesquisador',
    emoji: '🔍',
    color: '#6C63FF',
    category: 'SixTech Workspace',
    source: 'hybrid',
    model: CF_MODELS.powerful,
    internalUrl: `${INTERNAL_BASE}/agents/research`,
    basedOn: 'sixtech-workspace',
    capabilities: ['Pesquisa de mercado', 'Análise competitiva', 'Inteligência técnica', 'Verificação de fatos', 'Tendências'],
    desc: 'Pesquisa profunda — Llama 3.3 70B + backend interno de inteligência',
    system: `Você é um agente especialista em pesquisa e inteligência de mercado da SixTech Brasil.
Processo de pesquisa:
1. Identifique o tema central e subtemas relevantes
2. Apresente dados e fatos verificáveis
3. Analise tendências e padrões
4. Compare players e soluções do mercado
5. Conclua com insights acionáveis
Estruture sempre: Resumo Executivo → Análise Detalhada → Dados & Métricas → Tendências → Conclusões.
Cite quando possível: "Segundo [fonte], ..." — diferencie fatos de inferências.
Responda SEMPRE em português brasileiro.`
  },
  {
    id: 'legal',
    name: 'Jurídico',
    emoji: '⚖️',
    color: '#F59E0B',
    category: 'SixTech Workspace',
    source: 'hybrid',
    model: CF_MODELS.powerful,
    internalUrl: `${INTERNAL_BASE}/agents/legal`,
    basedOn: 'sixtech-workspace',
    capabilities: ['Contratos & NDAs', 'LGPD & Compliance', 'Propriedade intelectual', 'Termos de uso', 'Due diligence'],
    desc: 'Especialista jurídico — direito digital, contratos e compliance brasileiro',
    system: `Você é um especialista jurídico da SixTech Brasil focado em direito digital e tech.
Áreas de atuação:
- Contratos de software, SaaS e licenças
- NDAs e acordos de confidencialidade
- LGPD, GDPR e compliance de dados
- Propriedade intelectual e direitos autorais
- Termos de uso e políticas de privacidade
Sempre inclua: ⚠️ DISCLAIMER: Esta análise é informativa e educacional. Para situações reais, consulte um advogado habilitado.
Responda SEMPRE em português brasileiro com linguagem técnica-jurídica acessível.`
  },
  {
    id: 'designer',
    name: 'Designer',
    emoji: '🎨',
    color: '#EC4899',
    category: 'SixTech Workspace',
    source: 'hybrid',
    model: CF_MODELS.powerful,
    internalUrl: `${INTERNAL_BASE}/agents/designer`,
    basedOn: 'sixtech-workspace',
    capabilities: ['UI/UX Design', 'Branding & identidade', 'Sistemas de design', 'HTML/CSS', 'Acessibilidade'],
    desc: 'Designer criativo sênior — UI/UX, branding e especificações visuais',
    system: `Você é um designer criativo sênior da SixTech Brasil especializado em UI/UX e branding digital.
Processo criativo:
1. Entenda o contexto, público-alvo e objetivos
2. Proponha direção visual com justificativa
3. Defina paleta de cores (hex), tipografia e espaçamentos
4. Descreva componentes e layouts em detalhes
5. Forneça HTML/CSS quando solicitado
6. Inclua considerações de acessibilidade (WCAG)
Estilos dominados: Minimalista, Material Design, Glassmorphism, Neumorphism, Dark mode.
Responda SEMPRE em português brasileiro com linguagem criativa e técnica.`
  },
  {
    id: 'documents',
    name: 'Documentos',
    emoji: '📄',
    color: '#14B8A6',
    category: 'SixTech Workspace',
    source: 'hybrid',
    model: CF_MODELS.balanced,
    internalUrl: `${INTERNAL_BASE}/agents/documents`,
    basedOn: 'sixtech-workspace',
    capabilities: ['Relatórios técnicos', 'Propostas comerciais', 'Documentação de API', 'Apresentações', 'Specs técnicas'],
    desc: 'Especialista em documentação — relatórios, specs técnicas e propostas',
    system: `Você é um especialista em documentação técnica e criação de documentos da SixTech Brasil.
Tipos de documentos que cria:
- Relatórios técnicos e executivos
- Especificações de produto (PRD)
- Documentação de API (OpenAPI/Swagger style)
- Propostas comerciais e pitches
- Planos de projeto e roadmaps
- Manuais e guias de usuário
Estrutura padrão: Sumário Executivo → Contexto → Desenvolvimento → Resultados/Especificações → Conclusão → Próximos Passos.
Responda SEMPRE em português brasileiro com linguagem formal, clara e precisa.`
  },
  // ── AGENTES NATIVOS CLOUDFLARE AI ──────────────────────────────────────────
  {
    id: 'analyst',
    name: 'Analista',
    emoji: '📊',
    color: '#8B5CF6',
    category: 'Cloudflare AI',
    source: 'cloudflare',
    model: CF_MODELS.reason,
    basedOn: 'DeepSeek R1 Distill Qwen 32B',
    capabilities: ['Análise SWOT', 'KPIs & métricas', 'Modelagem financeira', 'Raciocínio lógico', 'Business intelligence'],
    desc: 'Analista de elite com raciocínio avançado — DeepSeek R1 32B chain-of-thought',
    system: `Você é um analista de dados e negócios de elite da SixTech Brasil, powered by DeepSeek R1 (raciocínio chain-of-thought).
Metodologia analítica:
<think>
- Decompor o problema em componentes
- Identificar variáveis-chave e relações causais
- Testar hipóteses alternativas
- Validar com dados quando disponíveis
</think>
Entregáveis: Análise SWOT, KPIs sugeridos, modelos de decisão, cenários (otimista/realista/pessimista), recomendações priorizadas.
Seja rigoroso, baseado em evidências. Mostre seu raciocínio passo a passo.
Responda SEMPRE em português brasileiro com estrutura analítica densa e precisa.`
  },
  {
    id: 'reviewer',
    name: 'Revisor QA',
    emoji: '🛡️',
    color: '#10B981',
    category: 'Cloudflare AI',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    basedOn: 'Llama 3.1 8B',
    capabilities: ['Code review', 'Quality assurance', 'Security audit', 'Scoring 0-10', 'Melhorias específicas'],
    desc: 'Revisor crítico de qualidade — análise rigorosa com scoring e melhorias',
    system: `Você é o revisor de qualidade (QA Lead) da SixTech Brasil. Analise criticamente qualquer conteúdo recebido.
Framework de revisão:
📋 ANÁLISE GERAL: Objetivo, completude, clareza
⚠️ PROBLEMAS ENCONTRADOS: Liste todos com severidade (crítico/alto/médio/baixo)
✅ PONTOS POSITIVOS: O que está bem feito
🔧 MELHORIAS ESPECÍFICAS: Sugestões concretas com exemplos
🔒 SEGURANÇA (se código): Vulnerabilidades, boas práticas
📊 SCORE FINAL: X/10 com justificativa clara
Seja honesto, direto e construtivo. Não suavize problemas sérios.
Responda SEMPRE em português brasileiro.`
  },
  {
    id: 'chat-assistant',
    name: 'Assistente',
    emoji: '💬',
    color: '#06B6D4',
    category: 'Cloudflare AI',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    basedOn: 'Llama 3.1 8B + SSE Streaming',
    capabilities: ['Chat geral', 'Streaming em tempo real', 'Contexto de conversa', 'Múltiplos idiomas', 'Respostas rápidas'],
    desc: 'Assistente conversacional com streaming em tempo real — baseado no sixtechworkspace',
    system: `Você é o assistente inteligente da SixTech Brasil, empresa líder em soluções de IA no Brasil.
Seja útil, amigável e direto. Responda em português brasileiro por padrão.
Se o usuário falar em inglês, responda em inglês.
Para perguntas técnicas: seja preciso e detalhado.
Para perguntas gerais: seja conciso e claro.
Você representa os valores da SixTech: inovação, excelência técnica e foco no cliente.`
  },
  {
    id: 'orchestrator',
    name: 'Super Orquestrador',
    emoji: '🎯',
    color: '#22D3EE',
    category: 'Cloudflare AI',
    source: 'cloudflare',
    model: CF_MODELS.kimi,
    basedOn: 'Kimi K2.6 (1T parâmetros) + SuperAgentOrchestrator',
    capabilities: ['Roteamento inteligente', 'Síntese de múltiplos agentes', 'Planejamento complexo', 'Delegação de tarefas', 'Consolidação final'],
    desc: 'Super Agente Orquestrador — Kimi K2.6 1T params, CEO da equipe de agentes',
    system: `Você é o Super Agente Orquestrador da SixTech Brasil, powered by Kimi K2.6 (1 trilhão de parâmetros).
Baseado no SuperAgentOrchestrator do sixtech-workspace com capacidades expandidas.

Missão de orquestração:
1. ANALISAR a solicitação e identificar domínios necessários
2. PLANEJAR quais agentes devem atuar e em qual ordem
3. SINTETIZAR as saídas dos agentes em resposta coesa
4. DECIDIR como CEO: prioridades, trade-offs e recomendação final

Roteamento inteligente:
- "código/api/sistema" → Developer Agent
- "contrato/nda/legal" → Jurídico Agent  
- "logo/design/ui/ux" → Designer Agent
- "pesquisa/mercado/análise" → Pesquisador + Analista
- "relatório/documento" → Documentos Agent
- "revisar/qualidade" → Revisor QA

Ao sintetizar: elimine redundâncias, resolva conflitos, construa narrativa coesa.
Responda SEMPRE em português brasileiro. Use markdown rico e estruturado.`
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
<title>SixTech MAS — Multi-Agent System v3.0</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
<style>
  :root {
    --primary: #6C63FF; --secondary: #22D3EE; --accent: #EC4899;
    --bg: #0B0D17; --surface: #141622; --card: #1B1E2E;
    --border: #2A2D40; --text: #E8E9F3; --muted: #6B7280;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; min-height: 100vh; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  .gradient-text { background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .glass { background: rgba(27,30,46,0.8); backdrop-filter: blur(12px); border: 1px solid var(--border); }
  .agent-card { transition: all .2s; }
  .agent-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(108,99,255,.2); }
  .tab-btn { transition: all .2s; border-bottom: 2px solid transparent; }
  .tab-btn.active { border-bottom-color: var(--primary); color: white; }
  .tab-panel { display: none; } .tab-panel.active { display: block; }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
  .badge-cf { background: #1e3a5f; color: #60A5FA; }
  .badge-hybrid { background: #1e2d1e; color: #34D399; }
  .badge-int { background: #2d1e1e; color: #F87171; }
  .progress-step { transition: all .3s; }
  .progress-step.done { opacity: 1; } .progress-step.pending { opacity: .4; }
  .msg-user { background: linear-gradient(135deg, #1e1b4b, #312e81); border-left: 3px solid var(--primary); }
  .msg-ai { background: var(--card); border-left: 3px solid var(--secondary); }
  .result-card { animation: slideIn .3s ease; }
  @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .pulse-dot { animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  pre code { font-family: 'Fira Code', monospace; font-size: 13px; }
  .cap-pill { background: rgba(108,99,255,.15); color: #a5b4fc; border: 1px solid rgba(108,99,255,.3); border-radius: 999px; padding: 2px 8px; font-size: 11px; }
  textarea:focus, input:focus, select:focus { outline: none; border-color: var(--primary) !important; box-shadow: 0 0 0 2px rgba(108,99,255,.2); }
  .model-opt { padding: 6px 10px; background: var(--card); color: var(--text); border: none; }
  .typing-cursor { display: inline-block; width: 2px; height: 1em; background: var(--secondary); animation: blink .7s infinite; vertical-align: text-bottom; margin-left: 2px; }
  @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
</style>
</head>
<body>

<!-- HEADER -->
<header class="glass sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
  <div class="flex items-center gap-3">
    <div class="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style="background:linear-gradient(135deg,#6C63FF,#22D3EE)">🤖</div>
    <div>
      <div class="font-bold text-white">SixTech MAS <span class="text-xs px-1.5 py-0.5 rounded-full ml-1" style="background:#1e3a5f;color:#60A5FA">v3.0</span></div>
      <div class="text-xs" style="color:var(--muted)">Multi-Agent System — Cloudflare Workers AI</div>
    </div>
  </div>
  <div class="flex items-center gap-3">
    <div id="status-dot" class="flex items-center gap-2 text-xs" style="color:#34D399">
      <span class="pulse-dot w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
      <span id="status-text">Online</span>
    </div>
    <a href="https://github.com/kainow252-cmyk/sixtechbrasil" target="_blank"
       class="text-sm px-3 py-1.5 rounded-lg flex items-center gap-2"
       style="background:var(--card);border:1px solid var(--border);color:var(--text)">
      <i class="fab fa-github"></i> GitHub
    </a>
  </div>
</header>

<!-- MAIN -->
<div class="max-w-7xl mx-auto px-4 py-6">

  <!-- TABS -->
  <nav class="flex gap-1 mb-6 p-1 rounded-xl" style="background:var(--surface);border:1px solid var(--border);width:fit-content">
    <button class="tab-btn active px-5 py-2.5 rounded-lg text-sm font-medium" onclick="showTab('pipeline')" style="background:var(--card)">
      <i class="fas fa-project-diagram mr-2"></i>Pipeline
    </button>
    <button class="tab-btn px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400" onclick="showTab('chat')">
      <i class="fas fa-comments mr-2"></i>Chat IA
    </button>
    <button class="tab-btn px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400" onclick="showTab('agents')">
      <i class="fas fa-robot mr-2"></i>Agentes
    </button>
    <button class="tab-btn px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400" onclick="showTab('status')">
      <i class="fas fa-chart-line mr-2"></i>Status
    </button>
  </nav>

  <!-- ═══ TAB: PIPELINE ═══════════════════════════════════════════════════ -->
  <div id="tab-pipeline" class="tab-panel active">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Coluna Esquerda: Configuração -->
      <div class="space-y-4">
        <!-- Tarefa -->
        <div class="glass rounded-2xl p-5">
          <h3 class="font-semibold text-white mb-3"><i class="fas fa-pen-to-square mr-2" style="color:var(--primary)"></i>Tarefa</h3>
          <textarea id="pipeline-task" rows="5" placeholder="Descreva o que você precisa...&#10;&#10;Ex: Crie uma API REST em Python com FastAPI para gerenciar usuários com autenticação JWT"
            class="w-full text-sm rounded-xl p-3 resize-none"
            style="background:var(--bg);border:1px solid var(--border);color:var(--text)"></textarea>
          <div class="flex gap-2 mt-3">
            <button onclick="autoRoute()" class="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style="background:linear-gradient(135deg,var(--primary),#4f46e5);color:white">
              <i class="fas fa-wand-magic-sparkles mr-2"></i>Auto Roteamento
            </button>
            <button onclick="clearAll()" class="px-3 py-2.5 rounded-xl text-sm"
              style="background:var(--card);border:1px solid var(--border);color:var(--muted)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <!-- Seleção de Agentes -->
        <div class="glass rounded-2xl p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-white"><i class="fas fa-robot mr-2" style="color:var(--secondary)"></i>Agentes</h3>
            <span id="agent-count" class="text-xs" style="color:var(--muted)">0 selecionados</span>
          </div>
          <div id="agent-checklist" class="space-y-2 max-h-64 overflow-y-auto pr-1"></div>
          <button onclick="runPipeline()" id="run-btn"
            class="w-full mt-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            style="background:linear-gradient(135deg,#059669,#10b981);color:white">
            <i class="fas fa-play"></i>Executar Pipeline
          </button>
        </div>

        <!-- Modo de Execução -->
        <div class="glass rounded-2xl p-5">
          <h3 class="font-semibold text-white mb-3"><i class="fas fa-sliders mr-2" style="color:var(--accent)"></i>Modo</h3>
          <div class="space-y-2">
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="mode" value="pipeline" checked class="accent-purple-500">
              <div>
                <div class="text-sm font-medium text-white">Pipeline Sequencial</div>
                <div class="text-xs" style="color:var(--muted)">Agentes passam contexto entre si</div>
              </div>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="mode" value="orchestrate" class="accent-purple-500">
              <div>
                <div class="text-sm font-medium text-white">Roteamento Inteligente</div>
                <div class="text-xs" style="color:var(--muted)">Auto-seleção por análise de contexto</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Coluna Direita: Resultados -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Progress Bar -->
        <div id="progress-bar" class="glass rounded-2xl p-4 hidden">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-white">Executando Pipeline</span>
            <span id="progress-info" class="text-xs" style="color:var(--muted)"></span>
          </div>
          <div id="progress-steps" class="flex gap-2 flex-wrap"></div>
        </div>

        <!-- Resultados -->
        <div id="results-container" class="space-y-4">
          <!-- placeholder -->
          <div id="results-placeholder" class="glass rounded-2xl p-12 text-center">
            <div class="text-5xl mb-4">🤖</div>
            <div class="text-white font-medium mb-2">Pronto para executar</div>
            <div class="text-sm" style="color:var(--muted)">Configure a tarefa, selecione os agentes e clique em Executar</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ TAB: CHAT ════════════════════════════════════════════════════════ -->
  <div id="tab-chat" class="tab-panel">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-5">

      <!-- Sidebar Chat -->
      <div class="space-y-4">
        <div class="glass rounded-2xl p-4">
          <h3 class="font-semibold text-white mb-3"><i class="fas fa-microchip mr-2" style="color:var(--primary)"></i>Modelo</h3>
          <select id="chat-model" class="w-full text-sm rounded-xl p-2.5"
            style="background:var(--bg);border:1px solid var(--border);color:var(--text)">
          </select>
          <div class="mt-3">
            <div class="text-xs font-medium mb-2" style="color:var(--muted)">Agente Especialista</div>
            <select id="chat-agent" class="w-full text-sm rounded-xl p-2.5"
              style="background:var(--bg);border:1px solid var(--border);color:var(--text)">
              <option value="">Nenhum (chat livre)</option>
            </select>
          </div>
        </div>
        <div class="glass rounded-2xl p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-white text-sm"><i class="fas fa-clock-rotate-left mr-2" style="color:var(--secondary)"></i>Histórico</h3>
            <button onclick="clearChat()" class="text-xs px-2 py-1 rounded-lg"
              style="background:var(--card);color:var(--muted)">Limpar</button>
          </div>
          <div id="chat-history-list" class="space-y-1 text-xs" style="color:var(--muted)">
            <div class="text-center py-4">Nenhuma conversa</div>
          </div>
        </div>
      </div>

      <!-- Chat Principal -->
      <div class="lg:col-span-3 glass rounded-2xl flex flex-col" style="height:600px">
        <div class="p-4 border-b flex items-center justify-between" style="border-color:var(--border)">
          <div class="flex items-center gap-2">
            <span class="text-lg">💬</span>
            <span class="font-medium text-white">Chat com IA</span>
          </div>
          <span id="chat-model-badge" class="badge badge-cf">Llama 3.1 8B</span>
        </div>
        <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
          <div class="msg-ai rounded-xl p-4 text-sm">
            <div class="font-medium text-cyan-400 mb-1">🤖 Assistente SixTech</div>
            <div>Olá! Sou o assistente da <strong>SixTech Brasil</strong>, powered by Cloudflare Workers AI. Como posso ajudar você hoje?</div>
          </div>
        </div>
        <div id="typing-indicator" class="px-4 py-2 text-xs hidden" style="color:var(--muted)">
          <span class="pulse-dot w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block mr-2"></span>IA digitando...
        </div>
        <div class="p-4 border-t" style="border-color:var(--border)">
          <div class="flex gap-2">
            <textarea id="chat-input" rows="2" placeholder="Digite sua mensagem... (Enter para enviar)"
              class="flex-1 text-sm rounded-xl p-3 resize-none"
              style="background:var(--bg);border:1px solid var(--border);color:var(--text)"
              onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChat()}"></textarea>
            <button onclick="sendChat()" id="chat-send-btn"
              class="px-4 rounded-xl font-semibold self-end py-3"
              style="background:linear-gradient(135deg,var(--primary),#4f46e5);color:white">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ TAB: AGENTES ═════════════════════════════════════════════════════ -->
  <div id="tab-agents" class="tab-panel">
    <div class="mb-4 flex items-center gap-3">
      <input id="agent-search" type="text" placeholder="Buscar agente..."
        class="text-sm rounded-xl px-4 py-2.5 w-64"
        style="background:var(--surface);border:1px solid var(--border);color:var(--text)"
        oninput="filterAgents(this.value)">
      <div class="flex gap-2">
        <button onclick="filterBySource('all')" class="filter-btn active px-3 py-2 rounded-lg text-xs font-medium" style="background:var(--primary);color:white">Todos</button>
        <button onclick="filterBySource('hybrid')" class="filter-btn px-3 py-2 rounded-lg text-xs font-medium" style="background:var(--card);color:var(--muted)">Hybrid</button>
        <button onclick="filterBySource('cloudflare')" class="filter-btn px-3 py-2 rounded-lg text-xs font-medium" style="background:var(--card);color:var(--muted)">Cloudflare</button>
      </div>
    </div>
    <div id="agents-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"></div>
  </div>

  <!-- ═══ TAB: STATUS ══════════════════════════════════════════════════════ -->
  <div id="tab-status" class="tab-panel">
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div class="glass rounded-2xl p-5">
        <div class="text-3xl font-bold gradient-text" id="stat-agents">9</div>
        <div class="text-sm mt-1" style="color:var(--muted)">Agentes Ativos</div>
      </div>
      <div class="glass rounded-2xl p-5">
        <div class="text-3xl font-bold" style="color:#22D3EE" id="stat-models">8</div>
        <div class="text-sm mt-1" style="color:var(--muted)">Modelos de IA</div>
      </div>
      <div class="glass rounded-2xl p-5">
        <div class="text-3xl font-bold" style="color:#34D399" id="stat-repos">4</div>
        <div class="text-sm mt-1" style="color:var(--muted)">Repos Integrados</div>
      </div>
      <div class="glass rounded-2xl p-5">
        <div class="text-3xl font-bold" style="color:#F59E0B" id="stat-ver">v3.0</div>
        <div class="text-sm mt-1" style="color:var(--muted)">Versão</div>
      </div>
    </div>
    <div id="status-details" class="grid grid-cols-1 lg:grid-cols-2 gap-4"></div>
  </div>

</div>

<script>
// ── Estado global
let agents = [], models = {}, chatHistory = [], allAgents = []

// ── Inicialização
async function init() {
  try {
    const [agentsRes, modelsRes] = await Promise.all([
      fetch('/api/agents'), fetch('/api/models')
    ])
    const agentsData = await agentsRes.json()
    const modelsData = await modelsRes.json()
    agents = agentsData.agents
    allAgents = [...agents]
    models = modelsData.models

    renderAgentChecklist()
    renderAgentsGrid()
    renderChatModels()
    loadStatus()
  } catch(e) {
    console.error('Init error:', e)
  }
}

// ── Tabs
function showTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active')
    b.style.background = 'transparent'
    b.style.color = '#6B7280'
  })
  document.getElementById('tab-' + name).classList.add('active')
  const btn = event.currentTarget
  btn.classList.add('active')
  btn.style.background = 'var(--card)'
  btn.style.color = 'white'
}

// ── Agent Checklist
function renderAgentChecklist() {
  const container = document.getElementById('agent-checklist')
  container.innerHTML = agents.map(a => \`
    <label class="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-white/5 transition-colors agent-check-item" data-source="\${a.source}">
      <input type="checkbox" value="\${a.id}" class="accent-purple-500 agent-checkbox"
        onchange="updateAgentCount()">
      <span class="text-lg">\${a.emoji}</span>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-white truncate">\${a.name}</div>
        <div class="text-xs truncate" style="color:#6B7280">\${a.category}</div>
      </div>
      <span class="badge \${a.source === 'hybrid' ? 'badge-hybrid' : 'badge-cf'} shrink-0">
        \${a.source === 'hybrid' ? 'hybrid' : 'cf'}
      </span>
    </label>
  \`).join('')
  updateAgentCount()
}

function updateAgentCount() {
  const count = document.querySelectorAll('.agent-checkbox:checked').length
  document.getElementById('agent-count').textContent = count + ' selecionados'
}

// ── Auto Routing
async function autoRoute() {
  const task = document.getElementById('pipeline-task').value.trim()
  if (!task) return

  document.querySelectorAll('.agent-checkbox').forEach(cb => cb.checked = false)
  const res = await fetch('/api/orchestrate', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({task})
  })
  if (!res.ok) return
  const data = await res.json()
  data.agentsUsed.forEach(id => {
    const cb = document.querySelector(\`.agent-checkbox[value="\${id}"]\`)
    if (cb) cb.checked = true
  })
  updateAgentCount()
  document.querySelector('input[name="mode"][value="orchestrate"]').checked = true
}

// ── Run Pipeline
async function runPipeline() {
  const task = document.getElementById('pipeline-task').value.trim()
  if (!task) return alert('Digite uma tarefa!')

  const selectedIds = [...document.querySelectorAll('.agent-checkbox:checked')].map(cb => cb.value)
  if (!selectedIds.length) return alert('Selecione ao menos um agente!')

  const mode = document.querySelector('input[name="mode"]:checked').value
  const btn = document.getElementById('run-btn')
  btn.disabled = true
  btn.innerHTML = '<i class="fas fa-spinner spin mr-2"></i>Executando...'

  // Progress bar
  const pb = document.getElementById('progress-bar')
  pb.classList.remove('hidden')
  const steps = document.getElementById('progress-steps')
  steps.innerHTML = selectedIds.map((id, i) => {
    const a = agents.find(x => x.id === id)
    return \`<div class="progress-step pending flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" id="step-\${id}"
      style="background:var(--card);border:1px solid var(--border)">
      <span>\${a?.emoji || '🤖'}</span><span>\${a?.name || id}</span>
    </div>\`
  }).join('')

  // Clear results
  const container = document.getElementById('results-container')
  document.getElementById('results-placeholder')?.remove()
  container.innerHTML = ''

  try {
    if (mode === 'orchestrate') {
      document.getElementById('progress-info').textContent = 'Roteamento inteligente...'
      selectedIds.forEach(id => document.getElementById('step-' + id)?.classList.add('done'))

      const res = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({task})
      })
      const data = await res.json()
      data.results.forEach(r => renderResult(r, container))
    } else {
      for (let i = 0; i < selectedIds.length; i++) {
        const id = selectedIds[i]
        const stepEl = document.getElementById('step-' + id)
        if (stepEl) {
          stepEl.style.background = 'rgba(108,99,255,.2)'
          stepEl.style.borderColor = '#6C63FF'
          stepEl.innerHTML = stepEl.innerHTML.replace('</div>', '') + ' <i class="fas fa-spinner spin"></i></div>'
        }
        document.getElementById('progress-info').textContent = \`\${i+1}/\${selectedIds.length}\`

        const res = await fetch('/api/agent/' + id, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({task, message: task})
        })
        const result = await res.json()
        renderResult(result, container)

        if (stepEl) {
          stepEl.style.background = 'rgba(52,211,153,.1)'
          stepEl.style.borderColor = '#34D399'
          stepEl.classList.remove('pending')
          stepEl.classList.add('done')
          stepEl.innerHTML = stepEl.innerHTML.replace(/<i class.*<\/i>/, '✓')
        }
      }
    }
  } catch(e) {
    container.innerHTML += \`<div class="glass rounded-2xl p-5 border border-red-800/50">
      <div class="text-red-400">❌ Erro: \${e.message}</div></div>\`
  }

  btn.disabled = false
  btn.innerHTML = '<i class="fas fa-play mr-2"></i>Executar Pipeline'
}

function renderResult(r, container) {
  const sourceLabel = r.usedFallback ? '☁️ CF Fallback' : r.source === 'internal' ? '🖥️ Interno' : '☁️ Cloudflare'
  const sourceBadge = r.usedFallback ? 'badge-hybrid' : r.source === 'internal' ? 'badge-int' : 'badge-cf'
  const formatted = mdToHtml(r.response || r.error || 'Sem resposta')

  const el = document.createElement('div')
  el.className = 'result-card glass rounded-2xl overflow-hidden'
  el.innerHTML = \`
    <div class="flex items-center gap-3 p-4" style="border-bottom:1px solid var(--border);background:linear-gradient(90deg,\${r.color}15,transparent)">
      <span class="text-2xl">\${r.emoji}</span>
      <div class="flex-1">
        <div class="font-semibold text-white">\${r.name}</div>
        <div class="text-xs" style="color:#6B7280">\${r.model?.split('/').pop()}</div>
      </div>
      <span class="badge \${sourceBadge}">\${sourceLabel}</span>
      <span class="text-xs" style="color:#6B7280">\${(r.duration/1000).toFixed(1)}s</span>
    </div>
    <div class="p-5 text-sm leading-relaxed prose-sm" style="color:#D1D5DB">\${formatted}</div>
  \`
  container.appendChild(el)
  el.scrollIntoView({behavior:'smooth', block:'nearest'})
}

// ── Chat
function renderChatModels() {
  const sel = document.getElementById('chat-model')
  sel.innerHTML = models.map(m => \`<option class="model-opt" value="\${m.id}">\${m.label}</option>\`).join('')
  sel.addEventListener('change', () => {
    document.getElementById('chat-model-badge').textContent = models.find(m => m.id === sel.value)?.label || sel.value
  })

  const agentSel = document.getElementById('chat-agent')
  agentSel.innerHTML = '<option value="">Nenhum (chat livre)</option>' +
    agents.map(a => \`<option value="\${a.id}">\${a.emoji} \${a.name}</option>\`).join('')
}

async function sendChat() {
  const input = document.getElementById('chat-input')
  const msg = input.value.trim()
  if (!msg) return

  const agentId = document.getElementById('chat-agent').value
  input.value = ''
  input.style.height = 'auto'

  // Se agente selecionado, usa /api/agent/:id
  if (agentId) {
    appendChatMsg('user', msg)
    document.getElementById('typing-indicator').classList.remove('hidden')
    try {
      const res = await fetch('/api/agent/' + agentId, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({message: msg})
      })
      const data = await res.json()
      document.getElementById('typing-indicator').classList.add('hidden')
      const agent = agents.find(a => a.id === agentId)
      appendChatMsg('assistant', data.response || 'Sem resposta', agent?.name, agent?.emoji)
    } catch(e) {
      document.getElementById('typing-indicator').classList.add('hidden')
      appendChatMsg('assistant', '❌ Erro: ' + e.message)
    }
    return
  }

  // Chat livre com streaming SSE
  const model = document.getElementById('chat-model').value
  chatHistory.push({role: 'user', content: msg})
  appendChatMsg('user', msg)
  document.getElementById('typing-indicator').classList.remove('hidden')
  document.getElementById('chat-send-btn').disabled = true

  // Container para resposta streaming
  const aiEl = document.createElement('div')
  aiEl.className = 'msg-ai rounded-xl p-4 text-sm'
  aiEl.innerHTML = '<div class="font-medium mb-1" style="color:#22D3EE">🤖 Assistente</div><div class="streaming-text"></div>'
  document.getElementById('chat-messages').appendChild(aiEl)
  const textEl = aiEl.querySelector('.streaming-text')
  document.getElementById('chat-messages').scrollTop = 9999

  let fullText = ''
  try {
    const res = await fetch('/api/chat', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({messages: [...chatHistory], model})
    })
    if (!res.body) throw new Error('Stream não disponível')
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const {done, value} = await reader.read()
      if (done) break
      buffer += decoder.decode(value, {stream: true})
      const parts = buffer.split('\\n\\n')
      buffer = parts.pop() || ''
      for (const part of parts) {
        for (const line of part.split('\\n')) {
          if (!line.startsWith('data:')) continue
          const data = line.slice(5).trim()
          if (data === '[DONE]') continue
          try {
            const json = JSON.parse(data)
            const chunk = json.response || json.choices?.[0]?.delta?.content || ''
            if (chunk) {
              fullText += chunk
              textEl.innerHTML = mdToHtml(fullText) + '<span class="typing-cursor"></span>'
              document.getElementById('chat-messages').scrollTop = 9999
            }
          } catch {}
        }
      }
    }
    textEl.innerHTML = mdToHtml(fullText)
    chatHistory.push({role: 'assistant', content: fullText})
    updateChatHistory()
  } catch(e) {
    textEl.textContent = '❌ Erro: ' + e.message
  }

  document.getElementById('typing-indicator').classList.add('hidden')
  document.getElementById('chat-send-btn').disabled = false
}

function appendChatMsg(role, text, name='Assistente', emoji='🤖') {
  const el = document.createElement('div')
  el.className = role === 'user' ? 'msg-user rounded-xl p-4 text-sm ml-8' : 'msg-ai rounded-xl p-4 text-sm'
  if (role === 'user') {
    el.innerHTML = \`<div class="font-medium mb-1" style="color:#a5b4fc">👤 Você</div><div>\${escHtml(text)}</div>\`
  } else {
    el.innerHTML = \`<div class="font-medium mb-1" style="color:#22D3EE">\${emoji} \${name}</div><div>\${mdToHtml(text)}</div>\`
  }
  document.getElementById('chat-messages').appendChild(el)
  document.getElementById('chat-messages').scrollTop = 9999
}

function updateChatHistory() {
  const list = document.getElementById('chat-history-list')
  const userMsgs = chatHistory.filter(m => m.role === 'user')
  if (!userMsgs.length) return
  list.innerHTML = userMsgs.slice(-5).reverse().map(m =>
    \`<div class="px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer truncate">\${m.content.slice(0,35)}...</div>\`
  ).join('')
}

function clearChat() {
  chatHistory = []
  document.getElementById('chat-messages').innerHTML = \`
    <div class="msg-ai rounded-xl p-4 text-sm">
      <div class="font-medium text-cyan-400 mb-1">🤖 Assistente SixTech</div>
      <div>Olá! Como posso ajudar?</div>
    </div>\`
  document.getElementById('chat-history-list').innerHTML = '<div class="text-center py-4">Nenhuma conversa</div>'
}

// ── Agents Grid
function renderAgentsGrid(filtered = null) {
  const list = filtered || allAgents
  document.getElementById('agents-grid').innerHTML = list.map(a => \`
    <div class="agent-card glass rounded-2xl overflow-hidden">
      <div class="p-5" style="border-bottom:1px solid var(--border);background:linear-gradient(135deg,\${a.color}20,transparent)">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <span class="text-3xl">\${a.emoji}</span>
            <div>
              <div class="font-bold text-white">\${a.name}</div>
              <div class="text-xs" style="color:#6B7280">\${a.category}</div>
            </div>
          </div>
          <span class="badge \${a.source === 'hybrid' ? 'badge-hybrid' : 'badge-cf'}">\${a.source}</span>
        </div>
        <p class="text-xs leading-relaxed" style="color:#9CA3AF">\${a.desc}</p>
      </div>
      <div class="p-4">
        <div class="mb-3">
          <div class="text-xs font-medium mb-2" style="color:#6B7280">CAPACIDADES</div>
          <div class="flex flex-wrap gap-1">
            \${(a.capabilities||[]).map(c => \`<span class="cap-pill">\${c}</span>\`).join('')}
          </div>
        </div>
        \${a.basedOn ? \`<div class="text-xs mb-3" style="color:#6B7280">📦 Baseado em: <span style="color:#a5b4fc">\${a.basedOn}</span></div>\` : ''}
        <div class="text-xs mb-3" style="color:#6B7280">🤖 Modelo: <span style="color:#22D3EE">\${a.model?.split('/').pop()}</span></div>
        <button onclick="testAgent('\${a.id}')"
          class="w-full py-2 rounded-xl text-xs font-semibold"
          style="background:rgba(108,99,255,.2);border:1px solid rgba(108,99,255,.4);color:#a5b4fc">
          <i class="fas fa-flask mr-1"></i>Testar Agente
        </button>
      </div>
    </div>
  \`).join('')
}

function filterAgents(q) {
  const filtered = allAgents.filter(a =>
    a.name.toLowerCase().includes(q.toLowerCase()) ||
    a.desc.toLowerCase().includes(q.toLowerCase()) ||
    a.category.toLowerCase().includes(q.toLowerCase())
  )
  renderAgentsGrid(filtered)
}

function filterBySource(src) {
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.style.background = 'var(--card)'; b.style.color = 'var(--muted)'
  })
  event.currentTarget.style.background = 'var(--primary)'
  event.currentTarget.style.color = 'white'
  renderAgentsGrid(src === 'all' ? allAgents : allAgents.filter(a => a.source === src))
}

async function testAgent(id) {
  const task = prompt('Teste o agente — digite uma tarefa:')
  if (!task) return
  showTab('pipeline')
  setTimeout(() => {
    document.getElementById('pipeline-task').value = task
    document.querySelectorAll('.agent-checkbox').forEach(cb => cb.checked = cb.value === id)
    updateAgentCount()
    runPipeline()
  }, 100)
}

// ── Status
async function loadStatus() {
  try {
    const res = await fetch('/api/status')
    const data = await res.json()
    const container = document.getElementById('status-details')
    container.innerHTML = \`
      <div class="glass rounded-2xl p-5">
        <h3 class="font-semibold text-white mb-4"><i class="fas fa-code-branch mr-2" style="color:var(--primary)"></i>Repositórios Integrados</h3>
        <div class="space-y-3">
          \${Object.entries(data.repos).map(([name, info]) => \`
            <div class="flex items-start gap-3 p-3 rounded-xl" style="background:var(--bg);border:1px solid var(--border)">
              <span class="text-green-400 mt-0.5">●</span>
              <div>
                <div class="font-medium text-white text-sm">\${name}</div>
                <div class="text-xs mt-1" style="color:#6B7280">\${info.type}</div>
                \${info.url ? \`<a href="\${info.url}" target="_blank" class="text-xs" style="color:#6C63FF">\${info.url}</a>\` : ''}
                \${info.note ? \`<div class="text-xs mt-1" style="color:#F59E0B">\${info.note}</div>\` : ''}
              </div>
            </div>
          \`).join('')}
        </div>
      </div>
      <div class="glass rounded-2xl p-5">
        <h3 class="font-semibold text-white mb-4"><i class="fas fa-server mr-2" style="color:var(--secondary)"></i>Funcionalidades</h3>
        <div class="space-y-2">
          \${data.features.map(f => \`
            <div class="flex items-center gap-3 p-2.5 rounded-xl" style="background:var(--bg)">
              <i class="fas fa-check-circle text-emerald-400"></i>
              <span class="text-sm text-white">\${f}</span>
            </div>
          \`).join('')}
        </div>
        <div class="mt-4 p-3 rounded-xl text-xs" style="background:rgba(108,99,255,.1);border:1px solid rgba(108,99,255,.3);color:#a5b4fc">
          <i class="fas fa-info-circle mr-2"></i>
          Plataforma hospedada no Cloudflare Pages Edge — latência global < 50ms
        </div>
      </div>
    \`
    document.getElementById('stat-agents').textContent = data.agents
    document.getElementById('stat-models').textContent = data.models
  } catch(e) {
    document.getElementById('status-text').textContent = 'Verificando...'
  }
}

// ── Utils
function clearAll() {
  document.getElementById('pipeline-task').value = ''
  document.querySelectorAll('.agent-checkbox').forEach(cb => cb.checked = false)
  updateAgentCount()
  document.getElementById('results-container').innerHTML = \`
    <div id="results-placeholder" class="glass rounded-2xl p-12 text-center">
      <div class="text-5xl mb-4">🤖</div>
      <div class="text-white font-medium mb-2">Pronto para executar</div>
      <div class="text-sm" style="color:var(--muted)">Configure a tarefa, selecione os agentes e clique em Executar</div>
    </div>\`
  document.getElementById('progress-bar').classList.add('hidden')
}

function escHtml(t) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

function mdToHtml(md) {
  if (!md) return ''
  return md
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\`\`\`(\\w*)?\\n?([\\s\\S]*?)\`\`\`/g, (_,lang,code) =>
      \`<pre style="background:#0d0d1a;border:1px solid #2A2D40;border-radius:8px;padding:12px;overflow-x:auto;margin:8px 0"><code class="language-\${lang||'text'}" style="color:#e2e8f0;font-family:monospace">\${code.trim()}</code></pre>\`)
    .replace(/\`([^\`]+)\`/g, '<code style="background:#1e2030;padding:2px 6px;border-radius:4px;color:#f472b6;font-family:monospace">$1</code>')
    .replace(/\\*\\*([^*]+)\\*\\*/g, '<strong style="color:white">$1</strong>')
    .replace(/\\*([^*]+)\\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3 style="color:#22D3EE;font-size:1rem;font-weight:600;margin:12px 0 6px">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:#a5b4fc;font-size:1.1rem;font-weight:700;margin:16px 0 8px">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="color:white;font-size:1.25rem;font-weight:800;margin:16px 0 8px">$1</h1>')
    .replace(/^[-*] (.+)$/gm, '<li style="margin:3px 0;padding-left:4px">• $1</li>')
    .replace(/^(\\d+)\\. (.+)$/gm, '<li style="margin:3px 0;padding-left:4px">$1. $2</li>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #6C63FF;padding-left:12px;color:#9CA3AF;margin:8px 0">$1</blockquote>')
    .replace(/\\n/g, '<br>')
}

// Inicializar
init()
</script>
</body>
</html>`)
})

export default app
