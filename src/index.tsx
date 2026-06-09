import { Hono } from 'hono'
import { cors } from 'hono/cors'

// ─── TYPES ──────────────────────────────────────────────────────────────────
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

// ─── CF WORKERS AI MODELS ───────────────────────────────────────────────────
const CF_MODELS = {
  fast:      '@cf/meta/llama-3.2-3b-instruct',
  balanced:  '@cf/meta/llama-3.1-8b-instruct-fp8',
  powerful:  '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  coder:     '@cf/qwen/qwen2.5-coder-32b-instruct',
  reason:    '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
  kimi:      '@cf/moonshotai/kimi-k2.6',
  gpt:       '@cf/openai/gpt-oss-120b',
  gemma:     '@cf/google/gemma-2b-it-lora',
}

// ─── INTERNAL ENDPOINTS (from sixtech-workspace backend) ────────────────────
const INTERNAL_BASE = 'https://api.sixtechbrasil.com.br'

// ─── AGENTS REGISTRY ────────────────────────────────────────────────────────
// Integra agentes do sixtech-workspace/backend/agents/ com fallback para CF AI
const AGENTS: AgentDef[] = [
  // ── AGENTES INTERNOS DO SIXTECH-WORKSPACE ──
  {
    id: 'developer',
    name: 'Developer',
    emoji: '💻',
    color: '#F87171',
    category: 'sixtech-workspace',
    source: 'hybrid',
    model: CF_MODELS.coder,
    internalUrl: `${INTERNAL_BASE}/agents/developer`,
    desc: 'Arquiteto de software sênior — código production-ready em qualquer linguagem',
    system: `Você é um arquiteto de software sênior da SixTech Brasil.
Seu objetivo é gerar código production-ready, limpo e documentado.
Sempre explique a solução, inclua exemplos e boas práticas.
Responda SEMPRE em português brasileiro. Use markdown com blocos de código.`
  },
  {
    id: 'research',
    name: 'Pesquisador',
    emoji: '🔍',
    color: '#6C63FF',
    category: 'sixtech-workspace',
    source: 'hybrid',
    model: CF_MODELS.balanced,
    internalUrl: `${INTERNAL_BASE}/agents/research`,
    desc: 'Pesquisa de mercado, análise competitiva e investigação técnica aprofundada',
    system: `Você é um agente especialista em pesquisa e inteligência de mercado da SixTech Brasil.
Identifique fatos, dados, tendências e contexto relevante.
Estruture as informações de forma clara e hierárquica.
Cite fontes e diferencie fatos de inferências.
Responda SEMPRE em português brasileiro. Use markdown com estrutura bem organizada.`
  },
  {
    id: 'legal',
    name: 'Jurídico',
    emoji: '⚖️',
    color: '#F59E0B',
    category: 'sixtech-workspace',
    source: 'hybrid',
    model: CF_MODELS.powerful,
    internalUrl: `${INTERNAL_BASE}/agents/legal`,
    desc: 'Contratos, NDAs, compliance, análise legal e pesquisa regulatória',
    system: `Você é um especialista jurídico da SixTech Brasil com foco em direito digital, contratos e compliance.
Analise contratos, NDAs, termos de uso e questões regulatórias.
Sempre inclua disclaimer: "Esta análise é informativa e não substitui consultoria jurídica profissional."
Responda SEMPRE em português brasileiro com linguagem técnica mas acessível.`
  },
  {
    id: 'designer',
    name: 'Designer',
    emoji: '🎨',
    color: '#EC4899',
    category: 'sixtech-workspace',
    source: 'hybrid',
    model: CF_MODELS.powerful,
    internalUrl: `${INTERNAL_BASE}/agents/designer`,
    desc: 'UI/UX design, branding, logos e materiais de marketing',
    system: `Você é um designer criativo sênior da SixTech Brasil especializado em UI/UX e branding.
Crie conceitos de design, paletas de cores, diretrizes de marca e especificações visuais.
Descreva layouts em HTML/CSS quando solicitado.
Forneça guias de estilo e decisões de design justificadas.
Responda SEMPRE em português brasileiro com linguagem criativa e técnica.`
  },
  {
    id: 'documents',
    name: 'Documentos',
    emoji: '📄',
    color: '#14B8A6',
    category: 'sixtech-workspace',
    source: 'hybrid',
    model: CF_MODELS.balanced,
    internalUrl: `${INTERNAL_BASE}/agents/documents`,
    desc: 'Relatórios, documentação técnica, PDFs e planilhas',
    system: `Você é um especialista em documentação técnica e criação de documentos da SixTech Brasil.
Crie relatórios estruturados, documentação técnica, planos de projeto e especificações.
Use formatação clara com sumário executivo, seções bem definidas e conclusões.
Responda SEMPRE em português brasileiro com linguagem formal e precisa.`
  },
  // ── AGENTES NATIVOS CLOUDFLARE AI ──
  {
    id: 'analyst',
    name: 'Analista',
    emoji: '📊',
    color: '#8B5CF6',
    category: 'cloudflare',
    source: 'cloudflare',
    model: CF_MODELS.reason,
    desc: 'Análise profunda com raciocínio avançado — DeepSeek R1 32B',
    system: `Você é um analista de dados e negócios de elite, powered by DeepSeek R1 (raciocínio avançado).
Analise profundamente o problema, identifique padrões e gere insights acionáveis.
Apresente análise SWOT, métricas, KPIs e recomendações estratégicas.
Use raciocínio passo a passo antes de concluir.
Responda SEMPRE em português brasileiro com estrutura analítica clara.`
  },
  {
    id: 'reviewer',
    name: 'Revisor',
    emoji: '🛡️',
    color: '#10B981',
    category: 'cloudflare',
    source: 'cloudflare',
    model: CF_MODELS.balanced,
    desc: 'Revisão crítica, controle de qualidade e scoring do trabalho',
    system: `Você é um revisor crítico e criterioso da SixTech Brasil.
Revise o conteúdo recebido, identifique erros, inconsistências e pontos de melhoria.
Dê uma nota de 0-10 com justificativa.
Forneça correções específicas e construtivas.
Responda SEMPRE em português brasileiro. Seja honesto e objetivo.`
  },
  {
    id: 'orchestrator',
    name: 'Orquestrador',
    emoji: '🎯',
    color: '#22D3EE',
    category: 'cloudflare',
    source: 'cloudflare',
    model: CF_MODELS.kimi,
    desc: 'Super agente orquestrador — Kimi K2.6 (1 trilhão de parâmetros)',
    system: `Você é o Super Agente Orquestrador da SixTech Brasil, powered by Kimi K2.6 (1T parâmetros).
Sua missão: analisar as saídas de todos os agentes especializados e criar a síntese definitiva.
Identifique os melhores pontos de cada contribuição.
Elimine redundâncias, resolva conflitos e construa resposta coesa e completa.
Aja como CEO de uma equipe de especialistas — tome decisões, priorize e entregue o resultado final.
Responda SEMPRE em português brasileiro. Use markdown rico e estruturado.`
  }
]

const AGENT_MAP = Object.fromEntries(AGENTS.map(a => [a.id, a]))

// ─── APP ─────────────────────────────────────────────────────────────────────
const app = new Hono<{ Bindings: Bindings }>()
app.use('/api/*', cors())

// ─── HELPER: call CF Workers AI ──────────────────────────────────────────────
async function callCFAI(
  ai: Ai,
  model: string,
  system: string,
  user: string,
  maxTokens = 1024
): Promise<string> {
  const result = await ai.run(model as any, {
    messages: [
      { role: 'system', content: system },
      { role: 'user',   content: user }
    ],
    max_tokens: maxTokens,
  }) as { response?: string }
  return result?.response?.trim() ?? '(sem resposta do modelo)'
}

// ─── HELPER: call internal backend (sixtech-workspace FastAPI) ───────────────
async function callInternal(url: string, task: string, timeoutMs = 8000): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),
      signal: controller.signal
    })

    clearTimeout(timer)

    if (!res.ok) return null

    const data = await res.json() as any
    return (data?.result || data?.response || data?.output || null) as string | null
  } catch {
    return null
  }
}

// ─── HELPER: run single agent with fallback logic ────────────────────────────
async function runAgent(
  agent: AgentDef,
  userMsg: string,
  ai: Ai
): Promise<RunResult> {
  const start = Date.now()
  let response = ''
  let usedFallback = false
  let error: string | undefined

  // 1. Try internal backend first (if hybrid source)
  if (agent.source === 'hybrid' && agent.internalUrl) {
    const internalResult = await callInternal(agent.internalUrl, userMsg)
    if (internalResult) {
      response = internalResult
      return {
        agentId: agent.id, name: agent.name,
        emoji: agent.emoji, color: agent.color,
        model: `internal → ${agent.internalUrl}`,
        source: 'internal', usedFallback: false,
        response, duration: Date.now() - start
      }
    }
    // Internal failed → fallback to CF AI
    usedFallback = true
  }

  // 2. Cloudflare Workers AI
  try {
    response = await callCFAI(ai, agent.model, agent.system, userMsg, 1200)
  } catch (err: any) {
    error = err?.message ?? 'Erro desconhecido'
    response = `❌ Erro: ${error}`
  }

  return {
    agentId: agent.id, name: agent.name,
    emoji: agent.emoji, color: agent.color,
    model: usedFallback ? `${agent.model} (fallback CF)` : agent.model,
    source: usedFallback ? 'cloudflare' : agent.source,
    usedFallback, response, duration: Date.now() - start, error
  }
}

// ─── API ROUTES ───────────────────────────────────────────────────────────────

// GET /api/agents — list all agents
app.get('/api/agents', (c) => {
  return c.json({
    agents: AGENTS.map(a => ({
      id: a.id, name: a.name, emoji: a.emoji,
      color: a.color, desc: a.desc, source: a.source,
      model: a.model, category: a.category
    })),
    total: AGENTS.length,
    categories: {
      'sixtech-workspace': AGENTS.filter(a => a.category === 'sixtech-workspace').length,
      'cloudflare': AGENTS.filter(a => a.category === 'cloudflare').length
    }
  })
})

// POST /api/agent/:id — run single agent
app.post('/api/agent/:id', async (c) => {
  const agentId = c.req.param('id')
  const agent = AGENT_MAP[agentId]
  if (!agent) return c.json({ error: 'Agente não encontrado' }, 404)

  const { prompt, context } = await c.req.json<{ prompt: string; context?: string }>()
  if (!prompt) return c.json({ error: 'Prompt obrigatório' }, 400)

  const userMsg = context
    ? `CONTEXTO:\n${context}\n\n---\nTAREFA: ${prompt}`
    : prompt

  const result = await runAgent(agent, userMsg, c.env.AI)

  return c.json({ ...result, timestamp: new Date().toISOString() })
})

// POST /api/orchestrate — smart routing (like sixtech-workspace /orchestrate)
app.post('/api/orchestrate', async (c) => {
  const { task } = await c.req.json<{ task: string }>()
  if (!task) return c.json({ error: 'task obrigatório' }, 400)

  // Smart routing based on task content
  const t = task.toLowerCase()
  let agentId = 'orchestrator'

  if (/(código|code|api|backend|frontend|dev|programar|função|classe|sql|python|javascript|typescript)/i.test(t))
    agentId = 'developer'
  else if (/(contrato|nda|legal|jurídico|compliance|cláusula|lei|regulat)/i.test(t))
    agentId = 'legal'
  else if (/(logo|design|ui|ux|layout|branding|marca|cor|paleta|visual)/i.test(t))
    agentId = 'designer'
  else if (/(relatório|documento|doc|pdf|planilha|documentação)/i.test(t))
    agentId = 'documents'
  else if (/(pesquisa|research|mercado|análise|dados|tendência|competi)/i.test(t))
    agentId = 'research'
  else if (/(analisa|insight|swot|kpi|metric|estratégia)/i.test(t))
    agentId = 'analyst'

  const agent = AGENT_MAP[agentId]
  const result = await runAgent(agent, task, c.env.AI)

  return c.json({
    routed_to: agentId,
    reasoning: `Tarefa roteada para ${agent.name} baseado no conteúdo`,
    ...result,
    timestamp: new Date().toISOString()
  })
})

// POST /api/pipeline — run full multi-agent pipeline
app.post('/api/pipeline', async (c) => {
  const { prompt, agents: selectedIds } = await c.req.json<{
    prompt: string; agents?: string[]
  }>()
  if (!prompt) return c.json({ error: 'Prompt obrigatório' }, 400)

  const agentList = (selectedIds && selectedIds.length > 0)
    ? selectedIds.filter(id => AGENT_MAP[id])
    : ['research', 'developer', 'analyst', 'reviewer', 'orchestrator']

  const results: RunResult[] = []
  let ctx = ''

  for (const agentId of agentList) {
    const agent = AGENT_MAP[agentId]
    if (!agent) continue

    const userMsg = ctx
      ? `CONTEXTO ACUMULADO DOS AGENTES ANTERIORES:\n${ctx}\n\n---\nTAREFA PRINCIPAL: ${prompt}`
      : prompt

    const result = await runAgent(agent, userMsg, c.env.AI)
    results.push(result)
    ctx += `\n\n=== ${agent.emoji} ${agent.name.toUpperCase()} ===\n${result.response}`
  }

  const totalMs = results.reduce((s, r) => s + r.duration, 0)
  const fallbackCount = results.filter(r => r.usedFallback).length

  return c.json({
    prompt,
    pipeline: agentList,
    results,
    stats: {
      totalAgents: results.length,
      totalDurationMs: totalMs,
      fallbackCount,
      internalCount: results.filter(r => r.source === 'internal').length,
      cloudflareCount: results.filter(r => r.source === 'cloudflare').length
    },
    timestamp: new Date().toISOString()
  })
})

// POST /api/chat — direct chat with model selection
app.post('/api/chat', async (c) => {
  const { message, model: modelKey, history } = await c.req.json<{
    message: string; model?: string; history?: Array<{role:string;content:string}>
  }>()
  if (!message) return c.json({ error: 'Mensagem obrigatória' }, 400)

  const model = CF_MODELS[(modelKey as keyof typeof CF_MODELS)] ?? CF_MODELS.balanced
  const msgs: any[] = [
    { role: 'system', content: 'Você é o assistente SixTech Brasil. Responda em português, seja útil e preciso.' },
    ...(history ?? []).slice(-10),
    { role: 'user', content: message }
  ]

  try {
    const result = await c.env.AI.run(model as any, {
      messages: msgs, max_tokens: 1024
    }) as { response?: string }
    return c.json({
      response: result?.response ?? '(sem resposta)',
      model, timestamp: new Date().toISOString()
    })
  } catch (err: any) {
    return c.json({ error: err?.message ?? 'Erro interno' }, 500)
  }
})

// GET /api/status — platform health
app.get('/api/status', async (c) => {
  // Quick CF AI health check
  let cfOk = false
  try {
    const r = await c.env.AI.run(CF_MODELS.fast as any, {
      messages: [{ role: 'user', content: 'hi' }], max_tokens: 5
    }) as any
    cfOk = !!r?.response
  } catch { cfOk = false }

  return c.json({
    platform: 'SixTech MAS',
    version: '2.0.0',
    status: 'online',
    agents: AGENTS.length,
    providers: {
      cloudflare_ai: cfOk ? 'healthy' : 'degraded',
      internal_backend: 'checking',
    },
    models_available: Object.keys(CF_MODELS).length,
    timestamp: new Date().toISOString()
  })
})

// ─── FRONTEND HTML ────────────────────────────────────────────────────────────
app.get('/', (c) => c.html(buildHTML()))
app.get('*', (c) => c.html(buildHTML()))

function buildHTML(): string { return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>SixTech MAS 2.0 — Plataforma Multiagente IA</title>
<meta name="description" content="Sistema de IA Multiagentes SixTech Brasil — Backend interno + Cloudflare Workers AI"/>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js"></script>
<style>
:root{
  --bg:#060912;--bg2:#0d1117;--bg3:#161b22;--bg4:#1c2333;--bg5:#21262d;
  --b:rgba(255,255,255,0.07);--b2:rgba(255,255,255,0.12);
  --txt:#e6edf3;--mut:#7d8590;--mut2:#6e7681;
  --p:#6C63FF;--p2:#4F46E5;--c:#22d3ee;--a:#f59e0b;--r:#f87171;--g:#34d399;--v:#a78bfa;
  --grad:linear-gradient(135deg,#6C63FF 0%,#22d3ee 100%);
  --grad2:linear-gradient(135deg,#f59e0b 0%,#ef4444 100%);
}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--txt);min-height:100vh;overflow-x:hidden;}

/* LAYOUT */
.app{display:grid;grid-template-columns:260px 1fr;grid-template-rows:60px 1fr;height:100vh;overflow:hidden;}
@media(max-width:860px){.app{grid-template-columns:1fr;}}

/* HEADER */
header{
  grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;
  padding:0 1.25rem;background:rgba(6,9,18,.96);backdrop-filter:blur(16px);
  border-bottom:1px solid var(--b);position:sticky;top:0;z-index:60;gap:.75rem;
}
.logo{
  font-family:'Space Grotesk',sans-serif;font-size:1.15rem;font-weight:800;
  background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  display:flex;align-items:center;gap:.45rem;white-space:nowrap;
}
.logo i{-webkit-text-fill-color:initial!important;color:var(--p);font-size:1rem;}
.hbadges{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;}
.hbadge{
  display:flex;align-items:center;gap:.35rem;
  padding:.25rem .65rem;border-radius:999px;font-size:.7rem;font-weight:700;letter-spacing:.03em;
  white-space:nowrap;
}
.hbadge-cf{background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.3);color:var(--a);}
.hbadge-int{background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.25);color:var(--g);}
.hbadge-live{background:rgba(108,99,255,.1);border:1px solid rgba(108,99,255,.3);color:var(--v);}
.sdot{width:6px;height:6px;border-radius:50%;background:currentColor;animation:blink 2s infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:.3;}}

/* SIDEBAR */
aside{
  background:var(--bg2);border-right:1px solid var(--b);
  overflow-y:auto;display:flex;flex-direction:column;
}
@media(max-width:860px){aside{display:none;}}
.sb-top{padding:1rem;border-bottom:1px solid var(--b);}
.sb-search{
  width:100%;background:var(--bg4);border:1px solid var(--b2);border-radius:8px;
  color:var(--txt);font-family:'Inter',sans-serif;font-size:.8rem;
  padding:.5rem .75rem;outline:none;transition:border-color .2s;
}
.sb-search:focus{border-color:var(--p);}
.sb-search::placeholder{color:var(--mut2);}
.sb-section{padding:.75rem 1rem .3rem;}
.sb-label{font-size:.62rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--mut);margin-bottom:.5rem;}
.nav-item{
  display:flex;align-items:center;gap:.55rem;padding:.55rem .75rem;border-radius:8px;
  cursor:pointer;font-size:.82rem;font-weight:500;color:var(--mut);border:1px solid transparent;
  transition:all .15s;margin-bottom:.15rem;
}
.nav-item:hover{background:var(--bg3);color:var(--txt);}
.nav-item.active{background:rgba(108,99,255,.12);color:var(--p);border-color:rgba(108,99,255,.22);}
.nav-item i{width:15px;text-align:center;font-size:.8rem;}
.agent-row{
  display:flex;align-items:center;gap:.5rem;padding:.4rem .75rem;border-radius:7px;
  font-size:.78rem;color:var(--mut);cursor:pointer;transition:all .15s;
  margin-bottom:.1rem;
}
.agent-row:hover{background:var(--bg3);color:var(--txt);}
.agent-row .dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.src-tag{
  margin-left:auto;font-size:.6rem;padding:.1rem .35rem;border-radius:4px;font-weight:700;
}
.src-cf{background:rgba(245,158,11,.15);color:var(--a);}
.src-int{background:rgba(52,211,153,.12);color:var(--g);}
.src-hyb{background:rgba(108,99,255,.15);color:var(--v);}

/* MAIN */
main{display:flex;flex-direction:column;overflow:hidden;}

/* TABS */
.tabs{
  display:flex;gap:.2rem;padding:.6rem 1.25rem .4rem;
  border-bottom:1px solid var(--b);background:var(--bg2);flex-shrink:0;overflow-x:auto;
}
.tab{
  display:flex;align-items:center;gap:.4rem;padding:.4rem .85rem;border-radius:7px;
  font-size:.78rem;font-weight:700;cursor:pointer;border:1px solid transparent;
  color:var(--mut);background:none;transition:all .15s;font-family:'Inter',sans-serif;
  white-space:nowrap;
}
.tab:hover{color:var(--txt);background:var(--bg3);}
.tab.active{background:rgba(108,99,255,.14);color:var(--p);border-color:rgba(108,99,255,.28);}

/* PANELS */
.panel{display:none;flex:1;overflow:hidden;flex-direction:column;}
.panel.active{display:flex;}

/* PIPELINE */
.pipeline-wrap{display:grid;grid-template-columns:320px 1fr;flex:1;overflow:hidden;}
@media(max-width:1000px){.pipeline-wrap{grid-template-columns:1fr;}}
.pl-left{
  padding:1.1rem;border-right:1px solid var(--b);overflow-y:auto;
  display:flex;flex-direction:column;gap:.85rem;
}
.pl-right{padding:1.1rem;overflow-y:auto;}

.card{background:var(--bg3);border:1px solid var(--b);border-radius:12px;padding:1.1rem;}
.card-title{font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--mut);margin-bottom:.6rem;display:flex;align-items:center;gap:.4rem;}
textarea,input[type=text]{
  width:100%;background:var(--bg4);border:1px solid var(--b2);border-radius:8px;
  color:var(--txt);font-family:'Inter',sans-serif;font-size:.85rem;
  padding:.65rem .85rem;outline:none;transition:border-color .2s;resize:vertical;
}
textarea:focus,input[type=text]:focus{border-color:var(--p);}
textarea::placeholder,input::placeholder{color:var(--mut2);}
textarea{min-height:110px;}

.agents-grid{display:grid;grid-template-columns:1fr 1fr;gap:.35rem;margin-top:.5rem;}
.ach{
  display:flex;align-items:center;gap:.4rem;padding:.4rem .55rem;border-radius:7px;
  cursor:pointer;font-size:.75rem;font-weight:600;color:var(--mut);
  border:1px solid transparent;transition:all .15s;
}
.ach:hover{background:var(--bg5);}
.ach.on{border-color:rgba(108,99,255,.3);background:rgba(108,99,255,.08);color:var(--txt);}
.ach input{accent-color:var(--p);width:12px;height:12px;}

.run-btn{
  width:100%;padding:.8rem;border-radius:9px;border:none;cursor:pointer;
  background:var(--grad);color:#fff;font-size:.9rem;font-weight:800;
  display:flex;align-items:center;justify-content:center;gap:.5rem;
  box-shadow:0 0 20px rgba(108,99,255,.3);transition:all .2s;font-family:'Inter',sans-serif;
}
.run-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 0 32px rgba(108,99,255,.5);}
.run-btn:disabled{opacity:.45;cursor:not-allowed;}

/* progress */
.prog-step{
  display:flex;align-items:center;gap:.55rem;padding:.4rem .5rem;border-radius:7px;
  font-size:.78rem;font-weight:500;color:var(--mut);transition:all .25s;
}
.prog-step.active{color:var(--p);background:rgba(108,99,255,.08);}
.prog-step.done{color:var(--g);}
.prog-step.err{color:var(--r);}
.prog-step .si{width:18px;text-align:center;font-size:.8rem;}
.spin{
  display:inline-block;width:13px;height:13px;border-radius:50%;
  border:2px solid rgba(108,99,255,.25);border-top-color:var(--p);
  animation:spin .6s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg);}}

/* result cards */
.empty-state{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  height:100%;gap:.9rem;color:var(--mut);text-align:center;padding:2rem;
}
.empty-state .ico{font-size:3rem;opacity:.2;}

.rcard{
  background:var(--bg3);border:1px solid var(--b);border-radius:12px;
  overflow:hidden;animation:fadeUp .35s ease;margin-bottom:.85rem;
}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.rcard-head{
  display:flex;align-items:center;justify-content:space-between;
  padding:.75rem 1rem;border-bottom:1px solid var(--b);
}
.ragent{display:flex;align-items:center;gap:.6rem;}
.ravar{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:.95rem;flex-shrink:0;}
.rname{font-weight:700;font-size:.85rem;}
.rmodel{font-size:.65rem;color:var(--mut);font-family:'JetBrains Mono',monospace;margin-top:.1rem;}
.rmeta{display:flex;align-items:center;gap:.4rem;}
.badge{
  padding:.18rem .45rem;border-radius:5px;font-size:.65rem;font-weight:700;
  background:var(--bg4);border:1px solid var(--b);color:var(--mut);
  font-family:'JetBrains Mono',monospace;
}
.badge-cf{background:rgba(245,158,11,.12);border-color:rgba(245,158,11,.25);color:var(--a);}
.badge-int{background:rgba(52,211,153,.1);border-color:rgba(52,211,153,.22);color:var(--g);}
.badge-fb{background:rgba(108,99,255,.1);border-color:rgba(108,99,255,.22);color:var(--v);}
.cbtn{background:none;border:1px solid var(--b);color:var(--mut);padding:.2rem .5rem;border-radius:5px;cursor:pointer;font-size:.7rem;transition:all .15s;}
.cbtn:hover{border-color:var(--p);color:var(--p);}
.rbody{padding:1rem;font-size:.85rem;line-height:1.7;}
.rbody.loading{color:var(--mut);font-style:italic;}
.lbar{height:3px;background:var(--grad);border-radius:99px;animation:lb 1s ease-in-out infinite alternate;margin-bottom:.5rem;}
@keyframes lb{from{width:25%;opacity:.4;}to{width:100%;opacity:1;}}

/* markdown */
.rbody h1,.rbody h2,.rbody h3{font-family:'Space Grotesk',sans-serif;margin:.85rem 0 .4rem;}
.rbody h1{font-size:1.1rem;}.rbody h2{font-size:1rem;}.rbody h3{font-size:.92rem;}
.rbody p{margin:.4rem 0;color:#c9d1d9;}
.rbody ul,.rbody ol{padding-left:1.2rem;margin:.4rem 0;}
.rbody li{margin:.18rem 0;color:#c9d1d9;}
.rbody code{background:var(--bg4);border:1px solid var(--b2);padding:.1rem .3rem;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:.78rem;color:var(--c);}
.rbody pre{background:var(--bg4);border:1px solid var(--b2);border-radius:8px;padding:.85rem;overflow-x:auto;margin:.6rem 0;}
.rbody pre code{background:none;border:none;color:#e6edf3;font-size:.78rem;}
.rbody strong{color:var(--txt);font-weight:700;}
.rbody blockquote{border-left:3px solid var(--p);padding-left:.65rem;margin:.4rem 0;color:var(--mut);font-style:italic;}
.rbody hr{border:none;border-top:1px solid var(--b);margin:.75rem 0;}
.rbody table{width:100%;border-collapse:collapse;font-size:.78rem;margin:.6rem 0;}
.rbody th{background:var(--bg4);padding:.4rem .65rem;border:1px solid var(--b2);text-align:left;}
.rbody td{padding:.4rem .65rem;border:1px solid var(--b);}

/* CHAT */
.chat-wrap{display:flex;flex-direction:column;flex:1;overflow:hidden;}
.chat-toolbar{
  padding:.5rem 1.25rem;border-bottom:1px solid var(--b);background:var(--bg2);
  display:flex;align-items:center;gap:.6rem;flex-shrink:0;flex-wrap:wrap;
}
.msel{background:var(--bg3);border:1px solid var(--b2);color:var(--txt);padding:.35rem .65rem;border-radius:7px;font-size:.78rem;outline:none;cursor:pointer;}
.chat-msgs{flex:1;overflow-y:auto;padding:1.1rem;display:flex;flex-direction:column;gap:.85rem;}
.chat-foot{
  padding:.85rem 1.25rem;border-top:1px solid var(--b);background:var(--bg2);
  display:flex;gap:.6rem;align-items:flex-end;flex-shrink:0;
}
.cinput{
  flex:1;background:var(--bg3);border:1px solid var(--b2);border-radius:10px;
  color:var(--txt);font-family:'Inter',sans-serif;font-size:.875rem;
  padding:.65rem .9rem;resize:none;outline:none;min-height:42px;max-height:130px;transition:border-color .2s;
}
.cinput:focus{border-color:var(--p);}
.csend{
  background:var(--grad);border:none;color:#fff;padding:.6rem 1rem;
  border-radius:10px;cursor:pointer;font-size:.95rem;flex-shrink:0;
  transition:all .2s;box-shadow:0 0 14px rgba(108,99,255,.25);
}
.csend:hover:not(:disabled){transform:translateY(-1px);}
.csend:disabled{opacity:.45;cursor:not-allowed;}
.msg{display:flex;gap:.65rem;max-width:820px;}
.msg.u{flex-direction:row-reverse;align-self:flex-end;}
.mav{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0;}
.mcont{background:var(--bg3);border:1px solid var(--b);border-radius:10px;padding:.65rem .9rem;font-size:.85rem;line-height:1.65;max-width:580px;}
.msg.u .mcont{background:rgba(108,99,255,.1);border-color:rgba(108,99,255,.22);}
.mmod{font-size:.65rem;color:var(--mut);margin-top:.25rem;font-family:'JetBrains Mono',monospace;}

/* AGENTS PANEL */
.ap{padding:1.1rem;overflow-y:auto;flex:1;}
.ap-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:1rem;}
.acard{background:var(--bg3);border:1px solid var(--b);border-radius:12px;padding:1.3rem;transition:all .2s;}
.acard:hover{border-color:var(--b2);transform:translateY(-2px);}
.actop{display:flex;gap:.75rem;margin-bottom:.85rem;}
.acico{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;}
.acinfo h3{font-family:'Space Grotesk',sans-serif;font-size:.95rem;font-weight:700;margin-bottom:.2rem;}
.acinfo p{color:var(--mut);font-size:.78rem;line-height:1.5;}
.acmeta{display:flex;align-items:center;gap:.4rem;flex-wrap:wrap;margin-top:.7rem;}
.acmodel{background:var(--bg4);border:1px solid var(--b2);padding:.2rem .55rem;border-radius:5px;font-family:'JetBrains Mono',monospace;font-size:.64rem;color:var(--c);}
.actest{width:100%;margin-top:.75rem;padding:.5rem;border-radius:7px;border:1px solid var(--b2);background:var(--bg4);color:var(--txt);cursor:pointer;font-size:.78rem;font-weight:700;transition:all .2s;font-family:'Inter',sans-serif;}
.actest:hover{border-color:var(--p);color:var(--p);}

/* STATUS PANEL */
.sp{padding:1.1rem;overflow-y:auto;flex:1;}
.sp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;margin-bottom:1.5rem;}
.scard{background:var(--bg3);border:1px solid var(--b);border-radius:12px;padding:1.2rem;}
.scard h4{font-family:'Space Grotesk',sans-serif;font-size:.85rem;font-weight:700;margin-bottom:.6rem;display:flex;align-items:center;gap:.4rem;}
.sval{font-family:'JetBrains Mono',monospace;font-size:1.6rem;font-weight:700;}
.sval.ok{color:var(--g);}
.sval.warn{color:var(--a);}
.sval.err{color:var(--r);}
.slabel{font-size:.72rem;color:var(--mut);margin-top:.2rem;}

/* scrollbar */
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--bg5);border-radius:99px;}

/* toast */
.toast{position:fixed;bottom:1.25rem;right:1.25rem;background:var(--bg3);border:1px solid var(--b2);color:var(--txt);padding:.65rem 1.1rem;border-radius:9px;font-size:.82rem;font-weight:600;z-index:999;animation:fadeUp .25s ease;box-shadow:0 8px 24px rgba(0,0,0,.5);}
</style>
</head>
<body>
<div class="app">

<!-- HEADER -->
<header>
  <div class="logo"><i class="fas fa-robot"></i> SixTech MAS</div>
  <div class="hbadges">
    <div class="hbadge hbadge-cf"><i class="fas fa-cloud" style="font-size:.65rem;"></i> Cloudflare Workers AI</div>
    <div class="hbadge hbadge-int"><i class="fas fa-server" style="font-size:.65rem;"></i> sixtech-workspace</div>
    <div class="hbadge hbadge-live"><span class="sdot"></span> 8 Agentes Online</div>
  </div>
</header>

<!-- SIDEBAR -->
<aside>
  <div class="sb-top">
    <input class="sb-search" type="text" placeholder="🔍  Buscar agentes..." id="sb-search" oninput="filterAgents(this.value)"/>
  </div>

  <div class="sb-section">
    <div class="sb-label">Navegação</div>
    <div class="nav-item active" onclick="showTab('pipeline')"><i class="fas fa-project-diagram"></i> Pipeline</div>
    <div class="nav-item" onclick="showTab('chat')"><i class="fas fa-comments"></i> Chat</div>
    <div class="nav-item" onclick="showTab('agents')"><i class="fas fa-users-cog"></i> Agentes</div>
    <div class="nav-item" onclick="showTab('status')"><i class="fas fa-heartbeat"></i> Status</div>
  </div>

  <div class="sb-section">
    <div class="sb-label">sixtech-workspace</div>
    <div id="sb-agents-workspace"></div>
  </div>
  <div class="sb-section">
    <div class="sb-label">Cloudflare AI</div>
    <div id="sb-agents-cf"></div>
  </div>
</aside>

<!-- MAIN -->
<main>
<div class="tabs">
  <button class="tab active" id="tab-pipeline" onclick="showTab('pipeline')"><i class="fas fa-project-diagram"></i> Pipeline</button>
  <button class="tab" id="tab-chat" onclick="showTab('chat')"><i class="fas fa-comments"></i> Chat</button>
  <button class="tab" id="tab-agents" onclick="showTab('agents')"><i class="fas fa-users-cog"></i> Agentes</button>
  <button class="tab" id="tab-status" onclick="showTab('status')"><i class="fas fa-heartbeat"></i> Status</button>
</div>

<!-- PIPELINE -->
<div class="panel active" id="panel-pipeline">
  <div class="pipeline-wrap">
    <div class="pl-left">
      <div class="card">
        <div class="card-title"><i class="fas fa-pen" style="color:var(--p);"></i> Tarefa</div>
        <textarea id="pp-prompt" placeholder="Descreva a tarefa para os agentes colaborarem...

Ex: Crie uma API REST completa em Node.js para gerenciamento de usuários com autenticação JWT, incluindo análise de segurança e documentação."></textarea>
      </div>

      <div class="card">
        <div class="card-title" style="justify-content:space-between;">
          <span><i class="fas fa-users" style="color:var(--p);"></i> Agentes</span>
          <span id="sel-cnt" style="color:var(--p);font-size:.68rem;"></span>
        </div>
        <div class="agents-grid" id="ach-grid"></div>
      </div>

      <div class="card" id="prog-card" style="display:none;">
        <div class="card-title"><i class="fas fa-cogs" style="color:var(--c);"></i> Progresso</div>
        <div id="prog-steps" style="display:flex;flex-direction:column;gap:.3rem;"></div>
      </div>

      <button class="run-btn" id="run-btn" onclick="runPipeline()">
        <i class="fas fa-play-circle"></i> Executar Pipeline
      </button>
    </div>

    <div class="pl-right" id="pl-right">
      <div class="empty-state" id="pl-empty">
        <div class="ico">🤖</div>
        <div style="font-size:.95rem;font-weight:700;color:var(--txt);">Pipeline pronto</div>
        <div style="font-size:.82rem;max-width:340px;">Configure a tarefa, selecione os agentes e execute.<br/>Agentes internos são tentados primeiro, Cloudflare AI como fallback.</div>
        <div style="display:flex;gap:.5rem;margin-top:.5rem;flex-wrap:wrap;justify-content:center;">
          <span class="badge badge-int">🏠 Interno</span>
          <span style="color:var(--mut);font-size:.78rem;align-self:center;">→ fallback →</span>
          <span class="badge badge-cf">☁️ Cloudflare AI</span>
        </div>
      </div>
      <div id="pl-stream" style="display:none;"></div>
    </div>
  </div>
</div>

<!-- CHAT -->
<div class="panel" id="panel-chat">
  <div class="chat-wrap">
    <div class="chat-toolbar">
      <label style="font-size:.72rem;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.06em;">Modelo:</label>
      <select class="msel" id="chat-model">
        <option value="fast">⚡ Llama 3.2 3B — Rápido</option>
        <option value="balanced" selected>⚖️ Llama 3.1 8B — Balanceado</option>
        <option value="powerful">💪 Llama 3.3 70B — Poderoso</option>
        <option value="coder">💻 Qwen 2.5 Coder 32B</option>
        <option value="reason">🧠 DeepSeek R1 32B</option>
        <option value="kimi">🌙 Kimi K2.6 (1T params)</option>
        <option value="gpt">🔷 GPT-OSS 120B</option>
      </select>
      <button onclick="clearChat()" style="margin-left:auto;background:none;border:1px solid var(--b);color:var(--mut);padding:.3rem .65rem;border-radius:6px;cursor:pointer;font-size:.75rem;font-family:'Inter',sans-serif;transition:all .15s;" onmouseover="this.style.borderColor='var(--r)';this.style.color='var(--r)'" onmouseout="this.style.borderColor='var(--b)';this.style.color='var(--mut)'">
        <i class="fas fa-trash"></i> Limpar
      </button>
    </div>
    <div class="chat-msgs" id="chat-msgs">
      <div class="msg">
        <div class="mav" style="background:rgba(108,99,255,.15);border:1px solid rgba(108,99,255,.3);">🤖</div>
        <div>
          <div class="mcont rbody">
            Olá! Sou o assistente <strong>SixTech MAS 2.0</strong>.<br/><br/>
            Tenho acesso a <strong>8 agentes especializados</strong>:<br/>
            <ul style="margin:.4rem 0;">
              <li>💻 Developer, 🔍 Pesquisador, ⚖️ Jurídico, 🎨 Designer, 📄 Documentos <em>(sixtech-workspace)</em></li>
              <li>📊 Analista, 🛡️ Revisor, 🎯 Orquestrador <em>(Cloudflare AI)</em></li>
            </ul>
            Para tarefas complexas, use a aba <strong>Pipeline</strong>. 🚀
          </div>
        </div>
      </div>
    </div>
    <div class="chat-foot">
      <textarea class="cinput" id="cinput" rows="1" placeholder="Digite sua mensagem... (Enter para enviar)"></textarea>
      <button class="csend" id="csend" onclick="sendChat()"><i class="fas fa-paper-plane"></i></button>
    </div>
  </div>
</div>

<!-- AGENTS -->
<div class="panel" id="panel-agents">
  <div class="ap">
    <div style="margin-bottom:1.2rem;">
      <h2 style="font-family:'Space Grotesk',sans-serif;font-size:1.3rem;font-weight:800;margin-bottom:.3rem;">Agentes Disponíveis</h2>
      <p style="color:var(--mut);font-size:.82rem;">8 agentes especializados — backend interno (sixtech-workspace) com fallback automático para Cloudflare Workers AI.</p>
    </div>
    <div class="ap-grid" id="ap-grid"></div>
  </div>
</div>

<!-- STATUS -->
<div class="panel" id="panel-status">
  <div class="sp">
    <div style="margin-bottom:1.2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;">
      <div>
        <h2 style="font-family:'Space Grotesk',sans-serif;font-size:1.3rem;font-weight:800;margin-bottom:.3rem;">Status da Plataforma</h2>
        <p style="color:var(--mut);font-size:.82rem;">Monitoramento em tempo real dos provedores de IA.</p>
      </div>
      <button onclick="loadStatus()" style="background:var(--grad);border:none;color:#fff;padding:.5rem 1rem;border-radius:8px;cursor:pointer;font-size:.8rem;font-weight:700;font-family:'Inter',sans-serif;">
        <i class="fas fa-sync-alt"></i> Atualizar
      </button>
    </div>
    <div class="sp-grid" id="sp-grid">
      <div class="scard"><h4><i class="fas fa-circle-notch fa-spin" style="color:var(--p);"></i> Carregando...</h4></div>
    </div>
    <div id="sp-detail"></div>
  </div>
</div>

</main>
</div>

<script>
// ── STATE ──────────────────────────────────────────────────────────────────
let AGENTS = []
let selected = new Set(['research','developer','analyst','reviewer','orchestrator'])
let running = false

// ── INIT ───────────────────────────────────────────────────────────────────
async function init() {
  try {
    const r = await fetch('/api/agents')
    const d = await r.json()
    AGENTS = d.agents
    renderAll()
    updateSelCnt()
  } catch(e) { toast('⚠️ Erro ao carregar agentes: ' + e.message) }
}

function renderAll() {
  renderSidebar()
  renderCheckboxes()
  renderAgentsPanel()
}

function renderSidebar() {
  const ws = document.getElementById('sb-agents-workspace')
  const cf = document.getElementById('sb-agents-cf')
  const src = tag => ({ 'cloudflare':'src-cf', 'internal':'src-int', 'hybrid':'src-hyb' }[tag] || 'src-cf')
  const lbl = tag => ({ 'cloudflare':'CF', 'internal':'INT', 'hybrid':'HYB' }[tag] || 'CF')
  
  const grouped = { workspace: [], cf: [] }
  AGENTS.forEach(a => {
    if (a.category === 'sixtech-workspace') grouped.workspace.push(a)
    else grouped.cf.push(a)
  })
  
  ws.innerHTML = grouped.workspace.map(a => \`
    <div class="agent-row" onclick="showTab('agents')">
      <span class="dot" style="background:\${a.color}"></span>
      <span>\${a.emoji} \${a.name}</span>
      <span class="src-tag \${src(a.source)}">\${lbl(a.source)}</span>
    </div>
  \`).join('')
  
  cf.innerHTML = grouped.cf.map(a => \`
    <div class="agent-row" onclick="showTab('agents')">
      <span class="dot" style="background:\${a.color}"></span>
      <span>\${a.emoji} \${a.name}</span>
      <span class="src-tag src-cf">CF</span>
    </div>
  \`).join('')
}

function renderCheckboxes() {
  const el = document.getElementById('ach-grid')
  el.innerHTML = AGENTS.map(a => \`
    <label class="ach \${selected.has(a.id)?'on':''}" onclick="toggleSel('\${a.id}')">
      <input type="checkbox" \${selected.has(a.id)?'checked':''} onclick="event.stopPropagation()"/>
      <span>\${a.emoji} \${a.name}</span>
    </label>
  \`).join('')
}

function renderAgentsPanel() {
  const srcBadge = s => ({
    cloudflare: '<span class="badge badge-cf">☁️ Cloudflare AI</span>',
    internal:   '<span class="badge badge-int">🏠 Interno</span>',
    hybrid:     '<span class="badge badge-int">🏠 + </span><span class="badge badge-cf">☁️ Fallback</span>'
  }[s] || '')
  
  document.getElementById('ap-grid').innerHTML = AGENTS.map(a => \`
    <div class="acard">
      <div class="actop">
        <div class="acico" style="background:\${a.color}18;border:1px solid \${a.color}40;">\${a.emoji}</div>
        <div class="acinfo">
          <h3>\${a.name}</h3>
          <p>\${a.desc}</p>
        </div>
      </div>
      <div class="acmeta">
        \${srcBadge(a.source)}
        <span class="acmodel">\${a.model.split('/').slice(-1)[0]}</span>
      </div>
      <button class="actest" onclick="testAgent('\${a.id}')">
        <i class="fas fa-flask"></i> Testar Agente
      </button>
    </div>
  \`).join('')
}

function updateSelCnt() {
  document.getElementById('sel-cnt').textContent = selected.size + ' selecionados'
}

function toggleSel(id) {
  selected.has(id) ? selected.delete(id) : selected.add(id)
  renderCheckboxes()
  updateSelCnt()
}

function filterAgents(q) {
  const rows = document.querySelectorAll('.agent-row')
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none'
  })
}

// ── TABS ───────────────────────────────────────────────────────────────────
function showTab(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'))
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'))
  document.getElementById('panel-' + name).classList.add('active')
  document.getElementById('tab-' + name).classList.add('active')
  if (name === 'status') loadStatus()
}

// ── PIPELINE ───────────────────────────────────────────────────────────────
async function runPipeline() {
  const prompt = document.getElementById('pp-prompt').value.trim()
  if (!prompt) { toast('⚠️ Digite uma tarefa!'); return }
  if (selected.size === 0) { toast('⚠️ Selecione ao menos 1 agente!'); return }
  if (running) return

  running = true
  const btn = document.getElementById('run-btn')
  btn.disabled = true
  btn.innerHTML = '<span class="spin"></span> Executando...'

  const empty = document.getElementById('pl-empty')
  const stream = document.getElementById('pl-stream')
  empty.style.display = 'none'
  stream.style.display = 'block'
  stream.innerHTML = ''

  const progCard = document.getElementById('prog-card')
  const progSteps = document.getElementById('prog-steps')
  progCard.style.display = 'block'

  const agentList = [...selected]
  const amap = Object.fromEntries(AGENTS.map(a => [a.id, a]))

  // init progress
  progSteps.innerHTML = agentList.map(id => {
    const a = amap[id]
    return a ? \`<div class="prog-step" id="ps-\${id}"><span class="si">\${a.emoji}</span><span>\${a.name}</span></div>\` : ''
  }).join('')

  // skeleton cards
  agentList.forEach(id => {
    const a = amap[id]
    if (!a) return
    stream.innerHTML += \`
      <div class="rcard" id="rc-\${id}">
        <div class="rcard-head">
          <div class="ragent">
            <div class="ravar" style="background:\${a.color}18;border:1px solid \${a.color}40;">\${a.emoji}</div>
            <div><div class="rname">\${a.name}</div><div class="rmodel">aguardando...</div></div>
          </div>
          <div class="rmeta"><span class="badge" id="bd-src-\${id}">—</span><span class="badge" id="bd-dur-\${id}">—</span></div>
        </div>
        <div class="rbody loading" id="rb-\${id}"><div class="lbar"></div>Processando...</div>
      </div>
    \`
  })

  setPS(agentList[0], 'active')

  try {
    const res = await fetch('/api/pipeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, agents: agentList })
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = await res.json()

    data.results.forEach((r, i) => {
      const rb = document.getElementById('rb-' + r.agentId)
      const bdSrc = document.getElementById('bd-src-' + r.agentId)
      const bdDur = document.getElementById('bd-dur-' + r.agentId)
      const rcard = document.getElementById('rc-' + r.agentId)
      const modelEl = rcard?.querySelector('.rmodel')

      if (rb) {
        rb.classList.remove('loading')
        rb.innerHTML = typeof marked !== 'undefined' ? marked.parse(r.response) : r.response.replace(/\\n/g,'<br/>')
      }
      if (bdDur) bdDur.textContent = (r.duration/1000).toFixed(1) + 's'
      if (bdSrc) {
        if (r.usedFallback) { bdSrc.textContent = '☁️ CF Fallback'; bdSrc.classList.add('badge-fb') }
        else if (r.source === 'internal') { bdSrc.textContent = '🏠 Interno'; bdSrc.classList.add('badge-int') }
        else { bdSrc.textContent = '☁️ CF AI'; bdSrc.classList.add('badge-cf') }
      }
      if (modelEl) modelEl.textContent = r.model.length > 40 ? r.model.slice(-38) : r.model
      if (rcard) {
        // add copy btn
        const meta = rcard.querySelector('.rmeta')
        if (meta) meta.innerHTML = (bdSrc?.outerHTML || '') + \`<span class="badge" style="font-family:'JetBrains Mono';">\${(r.duration/1000).toFixed(1)}s</span><button class="cbtn" onclick="copyTxt('rb-\${r.agentId}')"><i class="fas fa-copy"></i></button>\`
        if (r.agentId === 'orchestrator') rcard.style.borderColor = 'rgba(34,211,238,.3)'
      }

      setPS(r.agentId, r.response.startsWith('❌') ? 'err' : 'done')
      if (i + 1 < agentList.length) setPS(agentList[i+1], 'active')
    })

    // stats banner
    const s = data.stats
    stream.innerHTML += \`
      <div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.2);border-radius:10px;padding:.85rem 1rem;display:flex;gap:1.5rem;flex-wrap:wrap;font-size:.78rem;color:var(--mut);">
        <span>✅ <strong style="color:var(--g)">\${s.totalAgents}</strong> agentes</span>
        <span>⏱️ <strong style="color:var(--txt)">\${(s.totalDurationMs/1000).toFixed(1)}s</strong> total</span>
        <span>🏠 <strong style="color:var(--g)">\${s.internalCount}</strong> internos</span>
        <span>☁️ <strong style="color:var(--a)">\${s.cloudflareCount}</strong> cloudflare</span>
        \${s.fallbackCount > 0 ? '<span>🔄 <strong style="color:var(--v)">' + s.fallbackCount + '</strong> fallbacks</span>' : ''}
      </div>
    \`
    toast('✅ Pipeline concluído!')
  } catch(e) {
    toast('❌ Erro: ' + e.message)
    agentList.forEach(id => {
      const rb = document.getElementById('rb-' + id)
      if (rb?.classList.contains('loading')) {
        rb.innerHTML = '❌ Erro ao executar agente'
        rb.classList.remove('loading')
        setPS(id, 'err')
      }
    })
  }

  running = false
  btn.disabled = false
  btn.innerHTML = '<i class="fas fa-play-circle"></i> Executar Pipeline'
}

function setPS(id, state) {
  const el = document.getElementById('ps-' + id)
  if (!el) return
  el.className = 'prog-step ' + state
  const si = el.querySelector('.si')
  if (state === 'active' && si) si.innerHTML = '<span class="spin"></span>'
  if (state === 'done' && si) { const a = AGENTS.find(x=>x.id===id); if(a) si.textContent = a.emoji }
  if (state === 'err' && si) si.textContent = '❌'
}

// ── CHAT ───────────────────────────────────────────────────────────────────
let chatHist = []
async function sendChat() {
  const ci = document.getElementById('cinput')
  const msg = ci.value.trim()
  if (!msg || document.getElementById('csend').disabled) return
  ci.value = ''
  autoH(ci)

  const model = document.getElementById('chat-model').value
  chatHist.push({ role: 'user', content: msg })
  addMsg('user', msg, null)

  document.getElementById('csend').disabled = true
  const lid = 'l' + Date.now()
  const cm = document.getElementById('chat-msgs')
  cm.innerHTML += \`<div class="msg" id="\${lid}"><div class="mav" style="background:rgba(108,99,255,.15);border:1px solid rgba(108,99,255,.3);">🤖</div><div><div class="mcont"><div class="lbar" style="width:100px;"></div></div></div></div>\`
  cm.scrollTop = cm.scrollHeight

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ message: msg, model, history: chatHist.slice(-8) })
    })
    const d = await res.json()
    document.getElementById(lid)?.remove()
    const resp = d.response || d.error || 'Sem resposta'
    chatHist.push({ role: 'assistant', content: resp })
    addMsg('ai', resp, d.model)
  } catch(e) {
    document.getElementById(lid)?.remove()
    addMsg('ai', '❌ Erro: ' + e.message, null)
  }
  document.getElementById('csend').disabled = false
}

function addMsg(role, txt, model) {
  const cm = document.getElementById('chat-msgs')
  const isU = role === 'user'
  const html = !isU && typeof marked !== 'undefined' ? marked.parse(txt) : txt.replace(/\\n/g,'<br/>')
  cm.innerHTML += \`
    <div class="msg \${isU?'u':''}">
      <div class="mav" style="\${isU?'background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.25);':'background:rgba(108,99,255,.15);border:1px solid rgba(108,99,255,.3);'}">\${isU?'👤':'🤖'}</div>
      <div>
        <div class="mcont rbody">\${html}</div>
        \${model ? \`<div class="mmod">\${model}</div>\` : ''}
      </div>
    </div>
  \`
  cm.scrollTop = cm.scrollHeight
}

function clearChat() {
  chatHist = []
  document.getElementById('chat-msgs').innerHTML = \`<div class="msg"><div class="mav" style="background:rgba(108,99,255,.15);border:1px solid rgba(108,99,255,.3);">🤖</div><div><div class="mcont">Chat limpo. Como posso ajudar? 🚀</div></div></div>\`
}

// ── STATUS ─────────────────────────────────────────────────────────────────
async function loadStatus() {
  const grid = document.getElementById('sp-grid')
  grid.innerHTML = '<div class="scard"><h4><i class="fas fa-circle-notch fa-spin" style="color:var(--p);"></i> Verificando...</h4></div>'
  
  try {
    const r = await fetch('/api/status')
    const d = await r.json()
    
    const cfOk = d.providers?.cloudflare_ai === 'healthy'
    
    grid.innerHTML = \`
      <div class="scard">
        <h4><i class="fas fa-globe" style="color:var(--p);"></i> Plataforma</h4>
        <div class="sval ok">\${d.status?.toUpperCase()}</div>
        <div class="slabel">v\${d.version} · \${d.agents} agentes</div>
      </div>
      <div class="scard">
        <h4><i class="fas fa-cloud" style="color:var(--a);"></i> Cloudflare Workers AI</h4>
        <div class="sval \${cfOk?'ok':'err'}">\${cfOk?'HEALTHY':'DEGRADED'}</div>
        <div class="slabel">\${d.models_available} modelos disponíveis</div>
      </div>
      <div class="scard">
        <h4><i class="fas fa-server" style="color:var(--g);"></i> Backend Interno</h4>
        <div class="sval warn">STANDBY</div>
        <div class="slabel">sixtech-workspace · fallback automático</div>
      </div>
      <div class="scard">
        <h4><i class="fas fa-users-cog" style="color:var(--v);"></i> Agentes</h4>
        <div class="sval ok">\${d.agents}</div>
        <div class="slabel">5 workspace · 3 cloudflare</div>
      </div>
    \`
    
    document.getElementById('sp-detail').innerHTML = \`
      <div class="card" style="margin-top:1rem;">
        <div class="card-title"><i class="fas fa-robot" style="color:var(--c);"></i> Modelos Cloudflare Workers AI</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.5rem;margin-top:.5rem;">
          \${[
            ['⚡','Llama 3.2 3B','Rápido (fast)'],
            ['⚖️','Llama 3.1 8B FP8','Balanceado'],
            ['💪','Llama 3.3 70B FP8','Poderoso'],
            ['💻','Qwen 2.5 Coder 32B','Código'],
            ['🧠','DeepSeek R1 32B','Raciocínio'],
            ['🌙','Kimi K2.6 1T','Orquestrador'],
            ['🔷','GPT-OSS 120B','Premium'],
            ['💎','Gemma 2B LoRA','Leve'],
          ].map(([e,n,r]) => \`<div style="background:var(--bg4);border:1px solid var(--b);border-radius:8px;padding:.6rem .8rem;font-size:.78rem;"><span style="margin-right:.4rem;">\${e}</span><strong>\${n}</strong><br/><span style="color:var(--mut);font-size:.7rem;">\${r}</span></div>\`).join('')}
        </div>
      </div>
    \`
    
    toast('✅ Status atualizado!')
  } catch(e) {
    grid.innerHTML = '<div class="scard"><h4 style="color:var(--r);">❌ Erro ao carregar status</h4><p style="font-size:.78rem;color:var(--mut);">' + e.message + '</p></div>'
  }
}

// ── TEST AGENT ─────────────────────────────────────────────────────────────
async function testAgent(id) {
  const demos = {
    developer: 'Crie uma função TypeScript para validar CPF brasileiro com testes unitários.',
    research: 'Pesquise as 5 principais tendências de IA generativa para empresas em 2025.',
    legal: 'Elabore uma cláusula de confidencialidade (NDA) para contratos de software.',
    designer: 'Crie um guia de identidade visual para uma startup de IA: cores, tipografia e tom.',
    documents: 'Crie um modelo de relatório mensal de performance de equipe de TI.',
    analyst: 'Faça uma análise SWOT do mercado de ferramentas de IA generativa para PMEs.',
    reviewer: 'Revise: "Nossa IA é muito boa. Ela faz tudo. Os clientes adoram muito. É top demais."',
    orchestrator: 'Monte um plano estratégico de 90 dias para adoção de IA em uma empresa de 50 pessoas.'
  }
  showTab('pipeline')
  document.getElementById('pp-prompt').value = demos[id] || 'Olá! Apresente-se.'
  selected = new Set([id])
  renderCheckboxes()
  updateSelCnt()
  await runPipeline()
}

// ── UTILS ──────────────────────────────────────────────────────────────────
function copyTxt(id) {
  const el = document.getElementById(id)
  if (el) { navigator.clipboard.writeText(el.innerText); toast('📋 Copiado!') }
}

function toast(msg) {
  const t = document.createElement('div')
  t.className = 'toast'; t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.remove(), 3000)
}

function autoH(el) {
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 130) + 'px'
}

document.addEventListener('DOMContentLoaded', () => {
  const ci = document.getElementById('cinput')
  if (ci) {
    ci.addEventListener('keydown', e => { if (e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat()} })
    ci.addEventListener('input', () => autoH(ci))
  }
  init()
})
</script>
</body>
</html>`
}

export default app
