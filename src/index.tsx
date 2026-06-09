import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  AI: Ai
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))

// ─── MODELS REGISTRY ───────────────────────────────────────────────────────
const MODELS = {
  fast:     '@cf/meta/llama-3.2-3b-instruct',
  balanced: '@cf/meta/llama-3.1-8b-instruct-fp8',
  powerful: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  coder:    '@cf/qwen/qwen2.5-coder-32b-instruct',
  reason:   '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
  kimi:     '@cf/moonshotai/kimi-k2.6',
}

// ─── HELPER: call Workers AI ───────────────────────────────────────────────
async function callAI(ai: Ai, model: string, systemPrompt: string, userMsg: string): Promise<string> {
  const result = await ai.run(model as any, {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userMsg }
    ],
    max_tokens: 1024,
  }) as { response?: string }
  return result.response ?? '(sem resposta)'
}

// ─── AGENT DEFINITIONS ─────────────────────────────────────────────────────
const AGENTS: Record<string, { name: string; emoji: string; color: string; model: string; system: string; desc: string }> = {
  researcher: {
    name: 'Pesquisador',
    emoji: '🔍',
    color: '#6C63FF',
    model: MODELS.balanced,
    desc: 'Pesquisa e estrutura informações relevantes sobre o tema',
    system: `Você é um agente pesquisador especialista. Sua função é analisar o tema fornecido e:
1. Identificar os pontos-chave mais relevantes
2. Estruturar as informações de forma clara
3. Listar fatos, dados e contexto importante
4. Preparar o material para os outros agentes

Responda em português brasileiro. Seja detalhado e preciso. Formate com markdown.`
  },
  writer: {
    name: 'Redator',
    emoji: '✍️',
    color: '#06B6D4',
    model: MODELS.powerful,
    desc: 'Cria conteúdo textual persuasivo e bem estruturado',
    system: `Você é um agente redator especialista em conteúdo de alta qualidade. Sua função é:
1. Criar texto persuasivo, claro e envolvente
2. Adaptar o tom ao contexto (profissional, criativo, técnico)
3. Estruturar o conteúdo com introdução, desenvolvimento e conclusão
4. Usar linguagem natural e fluente

Responda em português brasileiro. Use markdown para formatação. Seja criativo e preciso.`
  },
  analyst: {
    name: 'Analista',
    emoji: '📊',
    color: '#F59E0B',
    model: MODELS.reason,
    desc: 'Analisa dados, identifica padrões e gera insights',
    system: `Você é um agente analista de dados e negócios. Sua função é:
1. Analisar profundamente o problema ou dados fornecidos
2. Identificar padrões, tendências e anomalias
3. Gerar insights acionáveis e recomendações
4. Apresentar análise SWOT quando relevante
5. Propor métricas e KPIs

Responda em português brasileiro. Use estrutura analítica clara com bullet points e números.`
  },
  coder: {
    name: 'Desenvolvedor',
    emoji: '💻',
    color: '#EF4444',
    model: MODELS.coder,
    desc: 'Escreve código limpo e funcional em qualquer linguagem',
    system: `Você é um agente desenvolvedor sênior especialista. Sua função é:
1. Escrever código limpo, eficiente e bem comentado
2. Seguir boas práticas e padrões do mercado
3. Criar soluções escaláveis e maintíveis
4. Documentar o código adequadamente
5. Identificar possíveis bugs e sugerir melhorias

Responda em português brasileiro. Sempre inclua blocos de código formatados com a linguagem correta.`
  },
  reviewer: {
    name: 'Revisor',
    emoji: '🛡️',
    color: '#10B981',
    model: MODELS.balanced,
    desc: 'Revisa, critica e melhora o trabalho dos outros agentes',
    system: `Você é um agente revisor crítico e criterioso. Sua função é:
1. Revisar o conteúdo recebido com olhar crítico
2. Identificar erros, inconsistências e pontos de melhoria
3. Sugerir correções específicas e construtivas
4. Avaliar qualidade, clareza e precisão
5. Dar uma nota de 0-10 para o trabalho revisado

Responda em português brasileiro. Seja honesto, construtivo e específico nas sugestões.`
  },
  orchestrator: {
    name: 'Orquestrador',
    emoji: '🎯',
    color: '#8B5CF6',
    model: MODELS.kimi,
    desc: 'Coordena todos os agentes e entrega o resultado final consolidado',
    system: `Você é o agente orquestrador principal de um sistema multiagente. Sua função é:
1. Analisar as saídas de todos os agentes anteriores
2. Identificar os melhores pontos de cada contribuição
3. Eliminar redundâncias e conflitos
4. Criar uma síntese coesa, completa e de alta qualidade
5. Entregar o resultado final consolidado e polido

Responda em português brasileiro. O resultado deve ser o melhor possível, integrando todas as perspectivas. Use markdown rico.`
  }
}

// ─── API: LIST AGENTS ──────────────────────────────────────────────────────
app.get('/api/agents', (c) => {
  const list = Object.entries(AGENTS).map(([id, a]) => ({
    id, name: a.name, emoji: a.emoji, color: a.color, desc: a.desc, model: a.model
  }))
  return c.json({ agents: list })
})

// ─── API: RUN SINGLE AGENT ─────────────────────────────────────────────────
app.post('/api/agent/:id', async (c) => {
  const agentId = c.req.param('id')
  const agent = AGENTS[agentId]
  if (!agent) return c.json({ error: 'Agente não encontrado' }, 404)

  const { prompt, context } = await c.req.json<{ prompt: string; context?: string }>()
  if (!prompt) return c.json({ error: 'Prompt obrigatório' }, 400)

  const userMsg = context
    ? `CONTEXTO DOS AGENTES ANTERIORES:\n${context}\n\n---\nTAREFA ATUAL: ${prompt}`
    : prompt

  try {
    const response = await callAI(c.env.AI, agent.model, agent.system, userMsg)
    return c.json({
      agent: { id: agentId, name: agent.name, emoji: agent.emoji, color: agent.color },
      model: agent.model,
      response,
      timestamp: new Date().toISOString()
    })
  } catch (err: any) {
    return c.json({ error: err.message ?? 'Erro interno' }, 500)
  }
})

// ─── API: RUN MULTI-AGENT PIPELINE ─────────────────────────────────────────
app.post('/api/pipeline', async (c) => {
  const { prompt, agents: selectedAgents } = await c.req.json<{
    prompt: string
    agents: string[]
  }>()

  if (!prompt) return c.json({ error: 'Prompt obrigatório' }, 400)

  const agentList = (selectedAgents && selectedAgents.length > 0)
    ? selectedAgents
    : ['researcher', 'writer', 'analyst', 'reviewer', 'orchestrator']

  const results: Array<{
    agentId: string; name: string; emoji: string; color: string; model: string; response: string; duration: number
  }> = []
  let accumulatedContext = ''

  for (const agentId of agentList) {
    const agent = AGENTS[agentId]
    if (!agent) continue

    const start = Date.now()
    const userMsg = accumulatedContext
      ? `CONTEXTO ACUMULADO:\n${accumulatedContext}\n\n---\nTAREFA: ${prompt}`
      : prompt

    try {
      const response = await callAI(c.env.AI, agent.model, agent.system, userMsg)
      const duration = Date.now() - start

      results.push({
        agentId, name: agent.name, emoji: agent.emoji,
        color: agent.color, model: agent.model, response, duration
      })

      accumulatedContext += `\n\n=== ${agent.emoji} ${agent.name.toUpperCase()} ===\n${response}`
    } catch (err: any) {
      results.push({
        agentId, name: agent.name, emoji: agent.emoji,
        color: agent.color, model: agent.model,
        response: `❌ Erro: ${err.message ?? 'falha desconhecida'}`,
        duration: Date.now() - start
      })
    }
  }

  return c.json({
    prompt,
    pipeline: agentList,
    results,
    totalAgents: results.length,
    timestamp: new Date().toISOString()
  })
})

// ─── API: QUICK CHAT (direct AI call) ──────────────────────────────────────
app.post('/api/chat', async (c) => {
  const { message, model: modelKey } = await c.req.json<{ message: string; model?: string }>()
  if (!message) return c.json({ error: 'Mensagem obrigatória' }, 400)

  const model = MODELS[(modelKey as keyof typeof MODELS) ?? 'balanced'] ?? MODELS.balanced

  try {
    const response = await callAI(c.env.AI, model, 
      'Você é um assistente de IA útil e amigável. Responda em português brasileiro de forma clara e útil.',
      message
    )
    return c.json({ response, model, timestamp: new Date().toISOString() })
  } catch (err: any) {
    return c.json({ error: err.message ?? 'Erro interno' }, 500)
  }
})

// ─── SERVE FRONTEND ────────────────────────────────────────────────────────
app.get('/', (c) => c.html(getHTML()))
app.get('*', (c) => c.html(getHTML()))

// ─── HTML FRONTEND ─────────────────────────────────────────────────────────
function getHTML(): string {
  return /* html */`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>SixTech MAS — Sistema Multiagente IA</title>
  <meta name="description" content="Plataforma de IA Multiagentes powered by Cloudflare Workers AI"/>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
  <script src="https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js"></script>
  <style>
    :root{
      --bg:#060912;--bg2:#0d1117;--bg3:#161b22;--bg4:#1c2333;
      --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
      --text:#e6edf3;--muted:#7d8590;--muted2:#6e7681;
      --primary:#6C63FF;--primary2:#4F46E5;
      --cyan:#22d3ee;--amber:#f59e0b;--red:#f87171;--green:#34d399;--purple:#a78bfa;
      --grad:linear-gradient(135deg,#6C63FF 0%,#22d3ee 100%);
    }
    *{margin:0;padding:0;box-sizing:border-box;}
    html{scroll-behavior:smooth;}
    body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;}

    /* ── LAYOUT ── */
    .app{display:grid;grid-template-columns:280px 1fr;grid-template-rows:64px 1fr;min-height:100vh;}
    @media(max-width:900px){.app{grid-template-columns:1fr;}}

    /* ── TOPBAR ── */
    header{
      grid-column:1/-1;
      display:flex;align-items:center;justify-content:space-between;
      padding:0 1.5rem;
      background:rgba(6,9,18,0.95);
      backdrop-filter:blur(12px);
      border-bottom:1px solid var(--border);
      position:sticky;top:0;z-index:50;
    }
    .logo{
      font-family:'Space Grotesk',sans-serif;font-size:1.3rem;font-weight:800;
      background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      display:flex;align-items:center;gap:.5rem;
    }
    .logo i{-webkit-text-fill-color:initial!important;background:none!important;color:var(--primary);}
    .header-right{display:flex;align-items:center;gap:.75rem;}
    .badge-cf{
      display:flex;align-items:center;gap:.4rem;
      background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);
      color:var(--amber);padding:.3rem .75rem;border-radius:999px;font-size:.75rem;font-weight:600;
    }
    .status-dot{width:7px;height:7px;border-radius:50%;background:var(--green);animation:pulse 2s infinite;}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(.8);}}

    /* ── SIDEBAR ── */
    aside{
      background:var(--bg2);border-right:1px solid var(--border);
      padding:1.5rem 1rem;overflow-y:auto;
    }
    @media(max-width:900px){aside{display:none;}}

    .sidebar-section{margin-bottom:1.5rem;}
    .sidebar-label{
      font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
      color:var(--muted);margin-bottom:.6rem;padding:0 .5rem;
    }

    /* Nav items */
    .nav-item{
      display:flex;align-items:center;gap:.6rem;
      padding:.6rem .75rem;border-radius:8px;
      cursor:pointer;transition:all .2s;
      font-size:.875rem;font-weight:500;color:var(--muted);
      border:1px solid transparent;
    }
    .nav-item:hover{background:var(--bg3);color:var(--text);}
    .nav-item.active{background:rgba(108,99,255,.12);color:var(--primary);border-color:rgba(108,99,255,.25);}
    .nav-item i{width:16px;text-align:center;}

    /* Agent list in sidebar */
    .agent-pill{
      display:flex;align-items:center;gap:.6rem;
      padding:.5rem .75rem;border-radius:8px;
      font-size:.8rem;font-weight:500;color:var(--muted);
      cursor:pointer;transition:all .2s;
      border:1px solid transparent;
    }
    .agent-pill:hover{background:var(--bg3);color:var(--text);}
    .agent-pill .dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
    .agent-pill.selected{border-color:var(--border2);background:var(--bg3);}
    .agent-pill input[type=checkbox]{accent-color:var(--primary);}

    /* ── MAIN ── */
    main{display:flex;flex-direction:column;overflow:hidden;height:calc(100vh - 64px);}

    /* Tabs */
    .tabs{
      display:flex;gap:.25rem;padding:.75rem 1.5rem .5rem;
      border-bottom:1px solid var(--border);background:var(--bg2);flex-shrink:0;
    }
    .tab-btn{
      display:flex;align-items:center;gap:.4rem;
      padding:.45rem 1rem;border-radius:8px;
      font-size:.8rem;font-weight:600;cursor:pointer;
      border:1px solid transparent;color:var(--muted);background:none;
      transition:all .2s;
    }
    .tab-btn:hover{color:var(--text);background:var(--bg3);}
    .tab-btn.active{background:rgba(108,99,255,.15);color:var(--primary);border-color:rgba(108,99,255,.3);}

    /* Content panels */
    .panel{display:none;flex:1;overflow:hidden;flex-direction:column;}
    .panel.active{display:flex;}

    /* ── PIPELINE PANEL ── */
    .pipeline-layout{display:grid;grid-template-columns:1fr 1.4fr;gap:0;flex:1;overflow:hidden;}
    @media(max-width:1100px){.pipeline-layout{grid-template-columns:1fr;}}

    .pipeline-left{
      padding:1.5rem;border-right:1px solid var(--border);
      overflow-y:auto;display:flex;flex-direction:column;gap:1rem;
    }
    .pipeline-right{padding:1.5rem;overflow-y:auto;}

    /* Input area */
    .input-card{
      background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:1.25rem;
    }
    .input-card label{display:block;font-size:.75rem;font-weight:700;color:var(--muted);margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.06em;}
    textarea{
      width:100%;background:var(--bg4);border:1px solid var(--border2);
      border-radius:10px;color:var(--text);font-family:'Inter',sans-serif;font-size:.9rem;
      padding:.75rem 1rem;resize:vertical;min-height:120px;outline:none;transition:border-color .2s;
    }
    textarea:focus{border-color:var(--primary);}
    textarea::placeholder{color:var(--muted2);}

    .run-btn{
      width:100%;padding:.85rem;border-radius:10px;border:none;cursor:pointer;
      background:var(--grad);color:white;font-size:.95rem;font-weight:700;
      display:flex;align-items:center;justify-content:center;gap:.5rem;
      transition:opacity .2s,transform .2s;box-shadow:0 0 24px rgba(108,99,255,.35);
      font-family:'Inter',sans-serif;
    }
    .run-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 0 36px rgba(108,99,255,.5);}
    .run-btn:disabled{opacity:.5;cursor:not-allowed;}

    /* Agent checkboxes */
    .agents-select{background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:1rem;}
    .agents-select-title{font-size:.75rem;font-weight:700;color:var(--muted);margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.06em;display:flex;justify-content:space-between;align-items:center;}
    .agents-grid{display:grid;grid-template-columns:1fr 1fr;gap:.4rem;}
    .agent-check{
      display:flex;align-items:center;gap:.5rem;
      padding:.45rem .6rem;border-radius:8px;cursor:pointer;
      font-size:.78rem;font-weight:500;color:var(--muted);border:1px solid transparent;transition:all .2s;
    }
    .agent-check:hover{background:var(--bg4);}
    .agent-check.checked{border-color:rgba(108,99,255,.3);background:rgba(108,99,255,.08);color:var(--text);}
    .agent-check input{accent-color:var(--primary);width:13px;height:13px;}
    .agent-emoji{font-size:1rem;}

    /* Results */
    .results-empty{
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      height:100%;gap:1rem;color:var(--muted);text-align:center;
    }
    .results-empty .icon{font-size:3rem;opacity:.3;}

    .result-stream{display:flex;flex-direction:column;gap:1rem;}

    .result-card{
      background:var(--bg3);border:1px solid var(--border);border-radius:14px;overflow:hidden;
      animation:slideIn .4s ease;
    }
    @keyframes slideIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}

    .result-header{
      display:flex;align-items:center;justify-content:space-between;
      padding:.85rem 1.1rem;border-bottom:1px solid var(--border);
    }
    .result-agent{display:flex;align-items:center;gap:.6rem;}
    .agent-avatar{
      width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;
      font-size:1rem;flex-shrink:0;
    }
    .result-agent-name{font-weight:700;font-size:.9rem;}
    .result-model{font-size:.7rem;color:var(--muted);font-family:'JetBrains Mono',monospace;}
    .result-meta{display:flex;align-items:center;gap:.5rem;}
    .duration-badge{
      background:var(--bg4);border:1px solid var(--border);
      color:var(--muted);padding:.2rem .5rem;border-radius:6px;font-size:.7rem;font-family:'JetBrains Mono',monospace;
    }
    .copy-btn{
      background:none;border:1px solid var(--border);color:var(--muted);
      padding:.25rem .55rem;border-radius:6px;cursor:pointer;font-size:.75rem;transition:all .2s;
    }
    .copy-btn:hover{border-color:var(--primary);color:var(--primary);}

    .result-body{padding:1.1rem;font-size:.875rem;line-height:1.7;}
    .result-body.loading{color:var(--muted);font-style:italic;display:flex;align-items:center;gap:.5rem;}

    /* Markdown styles */
    .result-body h1,.result-body h2,.result-body h3{font-family:'Space Grotesk',sans-serif;margin:1rem 0 .5rem;color:var(--text);}
    .result-body h1{font-size:1.2rem;}
    .result-body h2{font-size:1.05rem;}
    .result-body h3{font-size:.95rem;}
    .result-body p{margin:.5rem 0;color:#c9d1d9;}
    .result-body ul,.result-body ol{padding-left:1.25rem;margin:.5rem 0;}
    .result-body li{margin:.2rem 0;color:#c9d1d9;}
    .result-body code{
      background:var(--bg4);border:1px solid var(--border2);
      padding:.1rem .35rem;border-radius:4px;font-family:'JetBrains Mono',monospace;
      font-size:.8rem;color:var(--cyan);
    }
    .result-body pre{
      background:var(--bg4);border:1px solid var(--border2);
      border-radius:10px;padding:1rem;overflow-x:auto;margin:.75rem 0;
    }
    .result-body pre code{background:none;border:none;padding:0;color:#e6edf3;font-size:.82rem;}
    .result-body strong{color:var(--text);font-weight:700;}
    .result-body em{color:#a8b4c3;}
    .result-body blockquote{
      border-left:3px solid var(--primary);padding-left:.75rem;margin:.5rem 0;color:var(--muted);font-style:italic;
    }
    .result-body hr{border:none;border-top:1px solid var(--border);margin:1rem 0;}
    .result-body table{width:100%;border-collapse:collapse;margin:.75rem 0;font-size:.82rem;}
    .result-body th{background:var(--bg4);padding:.5rem .75rem;text-align:left;border:1px solid var(--border2);}
    .result-body td{padding:.5rem .75rem;border:1px solid var(--border);}

    /* Pipeline progress */
    .pipeline-progress{
      background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:1rem;
    }
    .progress-title{font-size:.75rem;font-weight:700;color:var(--muted);margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.06em;}
    .progress-steps{display:flex;flex-direction:column;gap:.4rem;}
    .progress-step{
      display:flex;align-items:center;gap:.6rem;
      padding:.4rem .5rem;border-radius:8px;font-size:.8rem;font-weight:500;
      color:var(--muted);transition:all .3s;
    }
    .progress-step.active{color:var(--primary);background:rgba(108,99,255,.08);}
    .progress-step.done{color:var(--green);}
    .progress-step.error{color:var(--red);}
    .step-icon{width:20px;text-align:center;font-size:.85rem;}
    .spinner{width:14px;height:14px;border:2px solid rgba(108,99,255,.3);border-top-color:var(--primary);border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0;}
    @keyframes spin{to{transform:rotate(360deg);}}

    /* ── CHAT PANEL ── */
    .chat-layout{display:flex;flex-direction:column;flex:1;overflow:hidden;}
    .chat-messages{flex:1;overflow-y:auto;padding:1.5rem;display:flex;flex-direction:column;gap:1rem;}
    .chat-input-area{
      padding:1rem 1.5rem;border-top:1px solid var(--border);background:var(--bg2);
      display:flex;gap:.75rem;align-items:flex-end;flex-shrink:0;
    }
    .chat-input-wrap{flex:1;}
    .chat-input{
      width:100%;background:var(--bg3);border:1px solid var(--border2);
      border-radius:12px;color:var(--text);font-family:'Inter',sans-serif;font-size:.9rem;
      padding:.75rem 1rem;resize:none;outline:none;min-height:44px;max-height:140px;
      transition:border-color .2s;
    }
    .chat-input:focus{border-color:var(--primary);}
    .chat-send{
      background:var(--grad);border:none;color:white;padding:.65rem 1.1rem;
      border-radius:12px;cursor:pointer;font-size:1rem;transition:all .2s;flex-shrink:0;
      box-shadow:0 0 16px rgba(108,99,255,.3);
    }
    .chat-send:hover{transform:translateY(-1px);box-shadow:0 0 24px rgba(108,99,255,.5);}
    .chat-send:disabled{opacity:.5;cursor:not-allowed;}

    .msg{display:flex;gap:.75rem;max-width:780px;}
    .msg.user{flex-direction:row-reverse;align-self:flex-end;}
    .msg-avatar{
      width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;
      font-size:1rem;flex-shrink:0;font-weight:700;font-size:.85rem;
    }
    .msg-content{
      background:var(--bg3);border:1px solid var(--border);border-radius:12px;
      padding:.75rem 1rem;font-size:.875rem;line-height:1.65;max-width:600px;
    }
    .msg.user .msg-content{
      background:rgba(108,99,255,.12);border-color:rgba(108,99,255,.25);
    }
    .msg-model{font-size:.7rem;color:var(--muted);margin-top:.3rem;font-family:'JetBrains Mono',monospace;}
    .model-select{
      background:var(--bg3);border:1px solid var(--border2);color:var(--text);
      padding:.4rem .75rem;border-radius:8px;font-size:.8rem;outline:none;cursor:pointer;
    }

    /* ── AGENTS PANEL ── */
    .agents-panel{padding:1.5rem;overflow-y:auto;flex:1;}
    .agents-panel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.25rem;}
    .agent-detail-card{
      background:var(--bg3);border:1px solid var(--border);border-radius:16px;
      padding:1.5rem;transition:all .3s;
    }
    .agent-detail-card:hover{border-color:var(--border2);transform:translateY(-2px);}
    .agent-card-top{display:flex;align-items:flex-start;gap:.9rem;margin-bottom:1rem;}
    .agent-card-icon{
      width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;
      font-size:1.5rem;flex-shrink:0;
    }
    .agent-card-info h3{font-family:'Space Grotesk',sans-serif;font-size:1.05rem;font-weight:700;margin-bottom:.2rem;}
    .agent-card-info p{color:var(--muted);font-size:.82rem;line-height:1.5;}
    .agent-model-tag{
      display:inline-flex;align-items:center;gap:.3rem;
      background:var(--bg4);border:1px solid var(--border2);
      padding:.25rem .6rem;border-radius:6px;font-family:'JetBrains Mono',monospace;
      font-size:.68rem;color:var(--cyan);margin-top:.75rem;
    }
    .test-agent-btn{
      width:100%;margin-top:.85rem;padding:.55rem;border-radius:8px;border:1px solid var(--border2);
      background:var(--bg4);color:var(--text);cursor:pointer;font-size:.82rem;font-weight:600;
      transition:all .2s;font-family:'Inter',sans-serif;
    }
    .test-agent-btn:hover{border-color:var(--primary);color:var(--primary);}

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar{width:5px;height:5px;}
    ::-webkit-scrollbar-track{background:var(--bg);}
    ::-webkit-scrollbar-thumb{background:var(--bg4);border-radius:99px;}

    /* ── TOAST ── */
    .toast{
      position:fixed;bottom:1.5rem;right:1.5rem;
      background:var(--bg3);border:1px solid var(--border2);
      color:var(--text);padding:.75rem 1.25rem;border-radius:10px;
      font-size:.85rem;font-weight:500;z-index:999;
      animation:toastIn .3s ease;box-shadow:0 8px 32px rgba(0,0,0,.4);
    }
    @keyframes toastIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}

    /* Loading bar */
    .loading-bar{
      height:3px;background:var(--grad);border-radius:99px;
      animation:loadBar 1.2s ease-in-out infinite alternate;
    }
    @keyframes loadBar{from{opacity:.4;width:30%;}to{opacity:1;width:100%;}}
  </style>
</head>
<body>
<div class="app">

  <!-- TOPBAR -->
  <header>
    <div class="logo">
      <i class="fas fa-robot"></i> SixTech MAS
    </div>
    <div class="header-right">
      <div class="badge-cf">
        <i class="fas fa-cloud" style="font-size:.7rem;"></i>
        Cloudflare Workers AI
      </div>
      <div class="badge-cf" style="background:rgba(52,211,153,.08);border-color:rgba(52,211,153,.25);color:var(--green);">
        <span class="status-dot"></span> Online
      </div>
    </div>
  </header>

  <!-- SIDEBAR -->
  <aside>
    <div class="sidebar-section">
      <div class="sidebar-label">Navegação</div>
      <div class="nav-item active" onclick="showTab('pipeline')">
        <i class="fas fa-project-diagram"></i> Pipeline Multiagente
      </div>
      <div class="nav-item" onclick="showTab('chat')">
        <i class="fas fa-comments"></i> Chat Direto
      </div>
      <div class="nav-item" onclick="showTab('agents')">
        <i class="fas fa-users-cog"></i> Gerenciar Agentes
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-label">Agentes Disponíveis</div>
      <div id="sidebar-agents"></div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-label">Modelos CF Workers AI</div>
      <div style="font-size:.72rem;color:var(--muted);display:flex;flex-direction:column;gap:.3rem;padding:0 .25rem;">
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--cyan)">Llama 3.3 70B</span><span>Powerful</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--cyan)">Llama 3.1 8B</span><span>Balanced</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--cyan)">Qwen 2.5 Coder</span><span>Code</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--cyan)">DeepSeek R1</span><span>Reasoning</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--cyan)">Kimi K2.6</span><span>Orchestrator</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--cyan)">Llama 3.2 3B</span><span>Fast</span></div>
      </div>
    </div>
  </aside>

  <!-- MAIN CONTENT -->
  <main>
    <!-- TABS -->
    <div class="tabs">
      <button class="tab-btn active" id="tab-pipeline" onclick="showTab('pipeline')">
        <i class="fas fa-project-diagram"></i> Pipeline
      </button>
      <button class="tab-btn" id="tab-chat" onclick="showTab('chat')">
        <i class="fas fa-comments"></i> Chat
      </button>
      <button class="tab-btn" id="tab-agents" onclick="showTab('agents')">
        <i class="fas fa-users-cog"></i> Agentes
      </button>
    </div>

    <!-- ═══ PIPELINE PANEL ═══ -->
    <div class="panel active" id="panel-pipeline">
      <div class="pipeline-layout">
        <!-- Left: input + config -->
        <div class="pipeline-left">
          <div class="input-card">
            <label><i class="fas fa-pen" style="margin-right:.4rem;color:var(--primary);"></i>Tarefa para os Agentes</label>
            <textarea id="pipeline-prompt" placeholder="Ex: Crie uma estratégia completa de marketing digital para uma startup de IA em 2025, incluindo análise de mercado, conteúdo e código de landing page..."></textarea>
          </div>

          <div class="agents-select">
            <div class="agents-select-title">
              <span><i class="fas fa-users" style="margin-right:.4rem;color:var(--primary);"></i>Selecionar Agentes</span>
              <span id="sel-count" style="font-size:.7rem;color:var(--primary);">5 selecionados</span>
            </div>
            <div class="agents-grid" id="agents-checkboxes"></div>
          </div>

          <div class="pipeline-progress" id="pipeline-progress" style="display:none;">
            <div class="progress-title"><i class="fas fa-cogs" style="margin-right:.4rem;"></i>Progresso</div>
            <div class="progress-steps" id="progress-steps"></div>
          </div>

          <button class="run-btn" id="run-btn" onclick="runPipeline()">
            <i class="fas fa-play-circle"></i> Executar Pipeline
          </button>
        </div>

        <!-- Right: results -->
        <div class="pipeline-right" id="pipeline-right">
          <div class="results-empty" id="results-empty">
            <div class="icon">🤖</div>
            <div style="font-size:1rem;font-weight:600;color:var(--text);">Pronto para executar</div>
            <div style="font-size:.85rem;">Configure a tarefa e selecione os agentes.<br/>O pipeline executará cada agente em sequência.</div>
          </div>
          <div class="result-stream" id="result-stream" style="display:none;"></div>
        </div>
      </div>
    </div>

    <!-- ═══ CHAT PANEL ═══ -->
    <div class="panel" id="panel-chat">
      <div class="chat-layout">
        <div style="padding:.75rem 1.5rem;border-bottom:1px solid var(--border);background:var(--bg2);display:flex;align-items:center;gap:.75rem;flex-shrink:0;">
          <label style="font-size:.78rem;font-weight:700;color:var(--muted);">MODELO:</label>
          <select class="model-select" id="chat-model">
            <option value="fast">⚡ Llama 3.2 3B — Rápido</option>
            <option value="balanced" selected>⚖️ Llama 3.1 8B — Balanceado</option>
            <option value="powerful">💪 Llama 3.3 70B — Poderoso</option>
            <option value="coder">💻 Qwen 2.5 Coder — Código</option>
            <option value="reason">🧠 DeepSeek R1 — Raciocínio</option>
            <option value="kimi">🌙 Kimi K2.6 — Frontier</option>
          </select>
          <button onclick="clearChat()" style="margin-left:auto;background:none;border:1px solid var(--border);color:var(--muted);padding:.3rem .75rem;border-radius:7px;cursor:pointer;font-size:.78rem;font-family:'Inter',sans-serif;">
            <i class="fas fa-trash-alt"></i> Limpar
          </button>
        </div>
        <div class="chat-messages" id="chat-messages">
          <div class="msg">
            <div class="msg-avatar" style="background:rgba(108,99,255,.15);border:1px solid rgba(108,99,255,.3);">🤖</div>
            <div>
              <div class="msg-content">
                Olá! Sou o assistente SixTech MAS. Posso responder perguntas, escrever código, analisar dados e muito mais.<br/><br/>
                Para tarefas complexas, use a aba <strong>Pipeline</strong> onde múltiplos agentes especializados colaboram automaticamente. 🚀
              </div>
            </div>
          </div>
        </div>
        <div class="chat-input-area">
          <div class="chat-input-wrap">
            <textarea class="chat-input" id="chat-input" rows="1" placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"></textarea>
          </div>
          <button class="chat-send" id="chat-send" onclick="sendChat()">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══ AGENTS PANEL ═══ -->
    <div class="panel" id="panel-agents">
      <div class="agents-panel">
        <div style="margin-bottom:1.5rem;">
          <h2 style="font-family:'Space Grotesk',sans-serif;font-size:1.4rem;font-weight:700;margin-bottom:.4rem;">
            Agentes Disponíveis
          </h2>
          <p style="color:var(--muted);font-size:.875rem;">
            Cada agente é um especialista autônomo rodando em Cloudflare Workers AI.
            Clique em "Testar" para ver o agente em ação.
          </p>
        </div>
        <div class="agents-panel-grid" id="agents-panel-grid"></div>
      </div>
    </div>

  </main>
</div>

<script>
// ──────────────────────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────────────────────
let agents = []
let selectedAgents = new Set(['researcher','writer','analyst','reviewer','orchestrator'])
let chatHistory = []
let isRunning = false

// ──────────────────────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────────────────────
async function init() {
  try {
    const r = await fetch('/api/agents')
    const d = await r.json()
    agents = d.agents
    renderSidebarAgents()
    renderAgentCheckboxes()
    renderAgentsPanel()
    updateSelCount()
  } catch(e) {
    showToast('⚠️ Erro ao carregar agentes')
  }
}

// ──────────────────────────────────────────────────────────────
// RENDER HELPERS
// ──────────────────────────────────────────────────────────────
function renderSidebarAgents() {
  const el = document.getElementById('sidebar-agents')
  el.innerHTML = agents.map(a => \`
    <div class="agent-pill">
      <span class="dot" style="background:\${a.color}"></span>
      <span>\${a.emoji} \${a.name}</span>
    </div>
  \`).join('')
}

function renderAgentCheckboxes() {
  const el = document.getElementById('agents-checkboxes')
  el.innerHTML = agents.map(a => \`
    <label class="agent-check \${selectedAgents.has(a.id) ? 'checked' : ''}" id="check-\${a.id}" onclick="toggleAgent('\${a.id}')">
      <input type="checkbox" \${selectedAgents.has(a.id) ? 'checked' : ''} onclick="event.stopPropagation()"/>
      <span class="agent-emoji">\${a.emoji}</span>
      <span>\${a.name}</span>
    </label>
  \`).join('')
}

function renderAgentsPanel() {
  const el = document.getElementById('agents-panel-grid')
  el.innerHTML = agents.map(a => \`
    <div class="agent-detail-card">
      <div class="agent-card-top">
        <div class="agent-card-icon" style="background:\${a.color}18;border:1px solid \${a.color}44;">
          \${a.emoji}
        </div>
        <div class="agent-card-info">
          <h3>\${a.name}</h3>
          <p>\${a.desc}</p>
        </div>
      </div>
      <div class="agent-model-tag">
        <i class="fas fa-microchip" style="font-size:.65rem;"></i>
        \${a.model}
      </div>
      <button class="test-agent-btn" onclick="testAgent('\${a.id}')">
        <i class="fas fa-flask"></i> Testar Agente
      </button>
    </div>
  \`).join('')
}

function updateSelCount() {
  document.getElementById('sel-count').textContent = selectedAgents.size + ' selecionados'
}

// ──────────────────────────────────────────────────────────────
// TABS
// ──────────────────────────────────────────────────────────────
function showTab(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'))
  document.getElementById('panel-' + name).classList.add('active')
  document.getElementById('tab-' + name).classList.add('active')
}

// ──────────────────────────────────────────────────────────────
// AGENT SELECTION
// ──────────────────────────────────────────────────────────────
function toggleAgent(id) {
  if (selectedAgents.has(id)) selectedAgents.delete(id)
  else selectedAgents.add(id)
  renderAgentCheckboxes()
  updateSelCount()
}

// ──────────────────────────────────────────────────────────────
// PIPELINE
// ──────────────────────────────────────────────────────────────
async function runPipeline() {
  const prompt = document.getElementById('pipeline-prompt').value.trim()
  if (!prompt) { showToast('⚠️ Digite uma tarefa primeiro!'); return }
  if (selectedAgents.size === 0) { showToast('⚠️ Selecione pelo menos um agente!'); return }
  if (isRunning) return

  isRunning = true
  const runBtn = document.getElementById('run-btn')
  runBtn.disabled = true
  runBtn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-color:rgba(255,255,255,.3);border-top-color:white;"></span> Executando...'

  // Clear results
  const empty = document.getElementById('results-empty')
  const stream = document.getElementById('result-stream')
  empty.style.display = 'none'
  stream.style.display = 'flex'
  stream.innerHTML = ''

  // Show progress
  const progressBox = document.getElementById('pipeline-progress')
  const progressSteps = document.getElementById('progress-steps')
  progressBox.style.display = 'block'

  const agentList = [...selectedAgents]
  const agentMap = Object.fromEntries(agents.map(a => [a.id, a]))

  // Init progress steps
  progressSteps.innerHTML = agentList.map(id => {
    const a = agentMap[id]
    if (!a) return ''
    return \`<div class="progress-step" id="step-\${id}">
      <span class="step-icon">\${a.emoji}</span>
      <span>\${a.name}</span>
      <span style="margin-left:auto;font-size:.7rem;opacity:.6;">\${a.model.split('/').pop()}</span>
    </div>\`
  }).join('')

  // Show loading cards
  agentList.forEach(id => {
    const a = agentMap[id]
    if (!a) return
    stream.innerHTML += \`
      <div class="result-card" id="card-\${id}">
        <div class="result-header">
          <div class="result-agent">
            <div class="agent-avatar" style="background:\${a.color}18;border:1px solid \${a.color}44;">\${a.emoji}</div>
            <div>
              <div class="result-agent-name">\${a.name}</div>
              <div class="result-model">\${a.model}</div>
            </div>
          </div>
          <div class="result-meta">
            <div class="duration-badge" id="dur-\${id}">—</div>
          </div>
        </div>
        <div class="result-body loading" id="body-\${id}">
          <div class="loading-bar" style="width:100%;"></div>
          Aguardando...
        </div>
      </div>
    \`
  })

  // Call API (full pipeline at once - server handles sequencing)
  try {
    // Mark first as active
    setStepStatus(agentList[0], 'active')
    document.getElementById('body-' + agentList[0]).innerHTML = '<div class="loading-bar" style="width:100%;"></div> Processando...'

    const res = await fetch('/api/pipeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, agents: agentList })
    })

    if (!res.ok) throw new Error('Erro HTTP ' + res.status)
    const data = await res.json()

    // Update each card with results
    data.results.forEach((r, i) => {
      const card = document.getElementById('card-' + r.agentId)
      const body = document.getElementById('body-' + r.agentId)
      const dur  = document.getElementById('dur-' + r.agentId)

      if (body) {
        body.classList.remove('loading')
        body.innerHTML = typeof marked !== 'undefined'
          ? marked.parse(r.response)
          : r.response.replace(/\\n/g, '<br/>')
      }
      if (dur) dur.textContent = (r.duration / 1000).toFixed(1) + 's'
      if (card) {
        // Add copy button
        const meta = card.querySelector('.result-meta')
        if (meta) {
          meta.innerHTML = \`
            <div class="duration-badge">\${(r.duration/1000).toFixed(1)}s</div>
            <button class="copy-btn" onclick="copyResult('\${r.agentId}')"><i class="fas fa-copy"></i></button>
          \`
        }
        // Color border on done
        card.style.borderColor = r.agentId === 'orchestrator' ? 'rgba(167,139,250,.35)' : ''
      }

      setStepStatus(r.agentId, r.response.startsWith('❌') ? 'error' : 'done')
      if (i + 1 < agentList.length) setStepStatus(agentList[i+1], 'active')
    })

    showToast('✅ Pipeline concluído com sucesso!')
  } catch(e) {
    showToast('❌ Erro: ' + e.message)
    agentList.forEach(id => {
      const body = document.getElementById('body-' + id)
      if (body && body.classList.contains('loading')) {
        body.innerHTML = '❌ Erro ao executar'
        body.classList.remove('loading')
        setStepStatus(id, 'error')
      }
    })
  }

  isRunning = false
  runBtn.disabled = false
  runBtn.innerHTML = '<i class="fas fa-play-circle"></i> Executar Pipeline'
}

function setStepStatus(id, status) {
  const step = document.getElementById('step-' + id)
  if (!step) return
  step.className = 'progress-step ' + status
  const icon = step.querySelector('.step-icon')
  if (status === 'active' && icon) {
    icon.innerHTML = '<span class="spinner"></span>'
  }
  if (status === 'done' && icon) {
    const a = agents.find(x => x.id === id)
    if (a) icon.textContent = a.emoji
    step.querySelector('.step-icon').style.color = 'var(--green)'
  }
  if (status === 'error' && icon) icon.textContent = '❌'
}

// ──────────────────────────────────────────────────────────────
// COPY
// ──────────────────────────────────────────────────────────────
function copyResult(agentId) {
  const body = document.getElementById('body-' + agentId)
  if (!body) return
  navigator.clipboard.writeText(body.innerText)
  showToast('📋 Copiado!')
}

// ──────────────────────────────────────────────────────────────
// CHAT
// ──────────────────────────────────────────────────────────────
async function sendChat() {
  const input = document.getElementById('chat-input')
  const msg = input.value.trim()
  if (!msg || document.getElementById('chat-send').disabled) return

  const model = document.getElementById('chat-model').value
  input.value = ''
  autoResize(input)

  // Add user msg
  addChatMsg('user', msg, null)

  // Disable send
  document.getElementById('chat-send').disabled = true

  // Add AI loading msg
  const loadId = 'msg-' + Date.now()
  const msgs = document.getElementById('chat-messages')
  msgs.innerHTML += \`
    <div class="msg" id="\${loadId}">
      <div class="msg-avatar" style="background:rgba(108,99,255,.15);border:1px solid rgba(108,99,255,.3);">🤖</div>
      <div>
        <div class="msg-content"><div class="loading-bar" style="width:120px;"></div></div>
      </div>
    </div>
  \`
  msgs.scrollTop = msgs.scrollHeight

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ message: msg, model })
    })
    const data = await res.json()

    const loadEl = document.getElementById(loadId)
    if (loadEl) loadEl.remove()

    addChatMsg('ai', data.response || data.error || 'Sem resposta', data.model)
  } catch(e) {
    const loadEl = document.getElementById(loadId)
    if (loadEl) loadEl.remove()
    addChatMsg('ai', '❌ Erro de conexão: ' + e.message, null)
  }

  document.getElementById('chat-send').disabled = false
}

function addChatMsg(role, text, model) {
  const msgs = document.getElementById('chat-messages')
  const isUser = role === 'user'
  const parsed = typeof marked !== 'undefined' && !isUser ? marked.parse(text) : text.replace(/\\n/g,'<br/>')
  msgs.innerHTML += \`
    <div class="msg \${isUser ? 'user' : ''}">
      <div class="msg-avatar" style="\${isUser 
        ? 'background:rgba(34,211,238,.15);border:1px solid rgba(34,211,238,.3);color:var(--cyan);' 
        : 'background:rgba(108,99,255,.15);border:1px solid rgba(108,99,255,.3);'}">\${isUser ? '👤' : '🤖'}</div>
      <div>
        <div class="msg-content result-body">\${parsed}</div>
        \${model ? \`<div class="msg-model">\${model}</div>\` : ''}
      </div>
    </div>
  \`
  msgs.scrollTop = msgs.scrollHeight
}

function clearChat() {
  document.getElementById('chat-messages').innerHTML = \`
    <div class="msg">
      <div class="msg-avatar" style="background:rgba(108,99,255,.15);border:1px solid rgba(108,99,255,.3);">🤖</div>
      <div><div class="msg-content">Chat limpo. Como posso ajudar? 🚀</div></div>
    </div>
  \`
}

// ──────────────────────────────────────────────────────────────
// TEST AGENT (from agents panel)
// ──────────────────────────────────────────────────────────────
async function testAgent(agentId) {
  const a = agents.find(x => x.id === agentId)
  if (!a) return
  const prompt = prompt_default_for(agentId)
  showTab('pipeline')
  document.getElementById('pipeline-prompt').value = prompt
  selectedAgents = new Set([agentId])
  renderAgentCheckboxes()
  updateSelCount()
  await runPipeline()
}

function prompt_default_for(id) {
  const map = {
    researcher: 'Pesquise sobre as tendências de IA generativa para 2025 e liste os principais modelos e frameworks.',
    writer: 'Escreva um artigo introdutório sobre Sistemas de IA Multiagentes para um blog de tecnologia.',
    analyst: 'Analise o mercado de ferramentas de IA para empresas em 2025 e identifique as principais oportunidades.',
    coder: 'Crie uma função JavaScript que faz chamadas a uma API REST com retry automático e tratamento de erros.',
    reviewer: 'Revise e melhore este texto: "IA é muito bom para empresas. Pode ajudar muito. Todo mundo devia usar mais IA nas suas coisas."',
    orchestrator: 'Crie um plano estratégico completo para implementar IA multiagente em uma empresa de médio porte.'
  }
  return map[id] || 'Olá! Apresente-se e explique sua especialidade.'
}

// ──────────────────────────────────────────────────────────────
// UTILS
// ──────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.createElement('div')
  t.className = 'toast'
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.remove(), 3000)
}

function autoResize(el) {
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 140) + 'px'
}

// Enter to send in chat
document.addEventListener('DOMContentLoaded', () => {
  const ci = document.getElementById('chat-input')
  if (ci) {
    ci.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() }
    })
    ci.addEventListener('input', () => autoResize(ci))
  }
  init()
})
</script>
</body>
</html>`
}

export default app
