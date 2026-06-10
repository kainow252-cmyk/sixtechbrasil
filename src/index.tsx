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
  --sidebar-w:240px;--header-h:54px;
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

/* ── Cards ────────────────────────────────────────────────── */
.card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px}
.card-title{font-size:13px;font-weight:600;color:#fff;margin-bottom:12px;display:flex;align-items:center;gap:7px}
.card-title i{font-size:12px}

/* ── Grid helpers ─────────────────────────────────────────── */
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
.grid-2{display:grid;grid-template-columns:1fr 2fr;gap:14px}
.grid-chat{display:grid;grid-template-columns:220px 1fr;gap:14px}
.col-span-2{grid-column:span 2}
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

/* ── Pipeline ─────────────────────────────────────────────── */
.agent-check-item{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;cursor:pointer;transition:background .12s}
.agent-check-item:hover{background:rgba(255,255,255,.04)}
.agent-check-item input{accent-color:var(--primary);flex-shrink:0}
.checklist-scroll{max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:2px}
.mode-label{display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:6px 0}
.mode-label input{margin-top:3px;accent-color:var(--primary)}
.mode-title{font-size:13px;font-weight:500;color:#fff}
.mode-sub{font-size:11px;color:var(--muted)}
#progress-bar{display:none}
.progress-steps{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.progress-step{padding:4px 10px;border-radius:6px;font-size:11px;background:var(--surface);border:1px solid var(--border);color:var(--muted);transition:all .3s}
.progress-step.done{background:rgba(52,211,153,.1);border-color:#34D399;color:#34D399}
.progress-step.active-step{background:rgba(108,99,255,.15);border-color:var(--primary);color:#fff}
#results-container{display:flex;flex-direction:column;gap:12px}
.result-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px;animation:slideIn .28s ease}
@keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.result-header{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.result-emoji{font-size:20px}
.result-name{font-size:13px;font-weight:600;color:#fff}
.result-model{font-size:10px;color:var(--muted)}
.result-body{font-size:13px;color:var(--text);line-height:1.6}
.result-footer{display:flex;align-items:center;gap:10px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;color:var(--muted)}
#results-placeholder{text-align:center;padding:60px 20px}
#results-placeholder .ph-emoji{font-size:48px;margin-bottom:12px}
#results-placeholder .ph-title{font-size:14px;font-weight:600;color:#fff;margin-bottom:6px}
#results-placeholder .ph-sub{font-size:12px;color:var(--muted)}

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

/* ── Agents grid ──────────────────────────────────────────── */
.agents-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.agent-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;transition:transform .18s,box-shadow .18s;cursor:default}
.agent-card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(108,99,255,.18)}
.agent-card-hdr{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.agent-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.agent-card-name{font-size:13px;font-weight:600;color:#fff}
.agent-card-model{font-size:10px;color:var(--muted);margin-top:1px}
.agent-card-desc{font-size:12px;color:var(--muted);line-height:1.5;margin-bottom:10px}
.caps{display:flex;flex-wrap:wrap;gap:4px}
.cap-pill{font-size:10px;padding:2px 7px;border-radius:999px;background:rgba(108,99,255,.12);color:#a5b4fc;border:1px solid rgba(108,99,255,.25)}

/* ── Stats ────────────────────────────────────────────────── */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px}
.stat-val{font-size:28px;font-weight:800;line-height:1}
.stat-label{font-size:11px;color:var(--muted);margin-top:5px}
.gtext{background:linear-gradient(135deg,var(--primary),var(--secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* ── Filters ──────────────────────────────────────────────── */
.filter-bar{display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap}
.filter-btn{padding:5px 12px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;border:none;background:var(--card);color:var(--muted);transition:all .15s}
.filter-btn.active{background:var(--primary);color:#fff}
.filter-btn:hover:not(.active){background:var(--border);color:var(--text)}

/* ── Responsive ───────────────────────────────────────────── */
@media(max-width:860px){
  .grid-2,.grid-chat{grid-template-columns:1fr}
  .stats-grid{grid-template-columns:1fr 1fr}
  .grid-3{grid-template-columns:1fr}
  .col-span-2{grid-column:span 1}
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
    <div class="sidebar-section">
      <div class="sidebar-section-title">Plataforma</div>
      <div class="nav-item active" onclick="showTab('pipeline',this)">
        <i class="fas fa-project-diagram"></i> Pipeline
      </div>
      <div class="nav-item" onclick="showTab('chat',this)">
        <i class="fas fa-comments"></i> Chat IA
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-title">Agentes</div>
      <div class="nav-item" onclick="showTab('pipeline',this);setTimeout(()=>autoRoute(),100)" style="opacity:.7">
        <i class="fas fa-sitemap"></i> Orquestrador
      </div>
      <div class="nav-arrow">↓</div>
      <div class="nav-item" onclick="showTab('agents',this)">
        <i class="fas fa-search"></i> Pesquisador
      </div>
      <div class="nav-item" onclick="showTab('agents',this)">
        <i class="fas fa-chart-bar"></i> Analista
      </div>
      <div class="nav-item" onclick="showTab('agents',this)">
        <i class="fas fa-code"></i> Dev
      </div>
      <div class="nav-item" onclick="showTab('agents',this)">
        <i class="fas fa-balance-scale"></i> Jurídico
      </div>
      <div class="nav-item" onclick="showTab('agents',this)">
        <i class="fas fa-calendar-alt"></i> Secretária
      </div>
      <div class="nav-item" onclick="showTab('agents',this)">
        <i class="fas fa-coins"></i> Financeiro
      </div>
      <div class="nav-item" onclick="showTab('agents',this)">
        <i class="fas fa-bullhorn"></i> Marketing
      </div>
      <div class="nav-item" onclick="showTab('agents',this)">
        <i class="fas fa-users"></i> RH
      </div>
    </div>

    <div class="sidebar-section" style="margin-top:auto">
      <div class="sidebar-section-title">Sistema</div>
      <div class="nav-item" onclick="showTab('status',this)">
        <i class="fas fa-chart-line"></i> Status
      </div>
    </div>

    <div class="sidebar-stat">
      <div class="sidebar-stat-title">Dashboard</div>
      <div class="sstat"><span>Agentes Online</span><span class="sstat-val" id="sb-agents">9</span></div>
      <div class="sstat"><span>Modelos IA</span><span class="sstat-val" id="sb-models">8</span></div>
      <div class="sstat"><span>Repos</span><span class="sstat-val">4</span></div>
      <div class="sstat"><span>Uptime</span><span class="sstat-val" style="color:#34D399">99.9%</span></div>
    </div>
  </aside>

  <!-- MAIN -->
  <main>

    <!-- ══ TAB: PIPELINE ══════════════════════════════════════ -->
    <div id="tab-pipeline" class="tab-panel active">
      <div class="grid-2">

        <!-- Coluna Esquerda -->
        <div class="col-left">
          <div class="card">
            <div class="card-title"><i class="fas fa-pen-to-square" style="color:var(--primary)"></i> Tarefa</div>
            <textarea id="pipeline-task" rows="5" placeholder="Descreva o que você precisa...

Ex: Crie uma API REST em Python com FastAPI para gerenciar usuários com autenticação JWT"></textarea>
            <div style="display:flex;gap:8px;margin-top:10px">
              <button class="btn btn-primary" style="flex:1" onclick="autoRoute()">
                <i class="fas fa-wand-magic-sparkles"></i> Auto Roteamento
              </button>
              <button class="btn btn-ghost btn-icon" onclick="clearAll()"><i class="fas fa-trash"></i></button>
            </div>
          </div>

          <div class="card">
            <div class="card-title" style="justify-content:space-between">
              <span><i class="fas fa-robot" style="color:var(--secondary)"></i> Agentes</span>
              <span id="agent-count" style="font-size:11px;color:var(--muted);font-weight:400">0 selecionados</span>
            </div>
            <div id="agent-checklist" class="checklist-scroll"></div>
            <button class="btn btn-success btn-full" onclick="runPipeline()" id="run-btn">
              <i class="fas fa-play"></i> Executar Pipeline
            </button>
          </div>

          <div class="card">
            <div class="card-title"><i class="fas fa-sliders" style="color:var(--accent)"></i> Modo</div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <label class="mode-label">
                <input type="radio" name="mode" value="pipeline" checked>
                <div><div class="mode-title">Pipeline Sequencial</div><div class="mode-sub">Agentes passam contexto entre si</div></div>
              </label>
              <label class="mode-label">
                <input type="radio" name="mode" value="orchestrate">
                <div><div class="mode-title">Roteamento Inteligente</div><div class="mode-sub">Auto-seleção por análise de contexto</div></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Coluna Direita -->
        <div>
          <div id="progress-bar" class="card" style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:13px;font-weight:600;color:#fff"><i class="fas fa-spin fa-circle-notch spin" style="color:var(--primary);margin-right:6px"></i>Executando...</span>
              <span id="progress-info" style="font-size:11px;color:var(--muted)"></span>
            </div>
            <div id="progress-steps" class="progress-steps"></div>
          </div>

          <div id="results-container">
            <div id="results-placeholder">
              <div class="ph-emoji">🤖</div>
              <div class="ph-title">Pronto para executar</div>
              <div class="ph-sub">Configure a tarefa, selecione agentes e clique em Executar</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ══ TAB: CHAT ══════════════════════════════════════════ -->
    <div id="tab-chat" class="tab-panel">
      <div class="grid-chat">

        <!-- Sidebar Chat -->
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

        <!-- Chat Box -->
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

    <!-- ══ TAB: AGENTES ════════════════════════════════════════ -->
    <div id="tab-agents" class="tab-panel">
      <div class="filter-bar">
        <input type="text" id="agent-search" placeholder="Buscar agente..." style="width:200px" oninput="filterAgents(this.value)">
        <button class="filter-btn active" onclick="filterBySource('all',this)">Todos</button>
        <button class="filter-btn" onclick="filterBySource('hybrid',this)">Hybrid</button>
        <button class="filter-btn" onclick="filterBySource('cloudflare',this)">Cloudflare</button>
      </div>
      <div id="agents-grid" class="agents-grid"></div>
    </div>

    <!-- ══ TAB: STATUS ═════════════════════════════════════════ -->
    <div id="tab-status" class="tab-panel">
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-val gtext" id="stat-agents">9</div><div class="stat-label">Agentes Ativos</div></div>
        <div class="stat-card"><div class="stat-val" style="color:#22D3EE" id="stat-models">8</div><div class="stat-label">Modelos de IA</div></div>
        <div class="stat-card"><div class="stat-val" style="color:#34D399" id="stat-repos">4</div><div class="stat-label">Repos Integrados</div></div>
        <div class="stat-card"><div class="stat-val" style="color:#F59E0B">v3.0</div><div class="stat-label">Versão</div></div>
      </div>
      <div id="status-details" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px"></div>
    </div>

  </main>
</div>

<script src="/static/app.js"></script>
<script>
const _v = '3.0'
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
