import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

// ─── TYPES ─────────────────────────────────────────────────────────────────
type Bindings = { AI: Ai; DB: D1Database }

interface CacheResult {
  id: number; query_text: string; response: string
  source: string; hit_count: number; created_at: string
}
interface ApiRow {
  id: number; name: string; category: string; subcategory: string
  description: string; base_url: string; docs_url: string
  auth_type: string; is_free: number; rate_limit: string
  tags: string; example_endpoint: string; quality_score: number
}
interface BotRow {
  id: string; name: string; emoji: string; description: string
  category: string; system_prompt: string; model: string
  parent_id: string; clone_depth: number; queries_answered: number
  knowledge_items: number; apis_linked: string; knowledge_topics: string
}
interface KnowledgeRow {
  id: number; bot_id: string; topic: string; category: string
  content: string; source_type: string; confidence: number
  keywords: string; used_count: number; created_at: string
}

// ─── MODELOS ───────────────────────────────────────────────────────────────
const MODELS: Record<string, string> = {
  fast:     '@cf/meta/llama-3.2-3b-instruct',
  balanced: '@cf/meta/llama-3.1-8b-instruct-fp8',
  powerful: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  coder:    '@cf/qwen/qwen2.5-coder-32b-instruct',
  reason:   '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
  kimi:     '@cf/moonshotai/kimi-k2.6',
}

// ─── HELPERS ───────────────────────────────────────────────────────────────
function normalizeQuery(q: string): string {
  return q.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ').trim()
    .slice(0, 200)
}

async function hashQuery(q: string): Promise<string> {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(normalizeQuery(q)))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32)
}

async function callAI(ai: Ai, modelKey: string, system: string, user: string, maxTokens = 1200): Promise<string> {
  const modelId = MODELS[modelKey] || MODELS.balanced
  const resp = await (ai as any).run(modelId, {
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    max_tokens: maxTokens, stream: false
  })
  if (!resp) return ''
  const r = resp as any
  if (typeof r.response === 'string') return r.response
  if (Array.isArray(r.choices) && r.choices[0]) {
    return r.choices[0]?.message?.content || r.choices[0]?.text || ''
  }
  return String(r)
}

// ─── APP ───────────────────────────────────────────────────────────────────
const app = new Hono<{ Bindings: Bindings }>()
app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))

// ─── STATUS ────────────────────────────────────────────────────────────────
app.get('/api/status', async (c) => {
  const db = c.env.DB
  const [apis, bots, cache, knowledge] = await Promise.all([
    db.prepare('SELECT COUNT(*) as n FROM apis WHERE is_free=1').first<{n:number}>(),
    db.prepare('SELECT COUNT(*) as n FROM bots WHERE is_active=1').first<{n:number}>(),
    db.prepare('SELECT COUNT(*) as n, COALESCE(SUM(hit_count),0) as hits, COALESCE(SUM(tokens_saved),0) as tokens FROM cache_queries').first<{n:number,hits:number,tokens:number}>(),
    db.prepare('SELECT COUNT(*) as n FROM knowledge_base').first<{n:number}>(),
  ])
  return c.json({
    status: 'online', version: '1.0.0',
    platform: 'SixTech KnowledgeBot — API Cache + LLM Próprio',
    stats: {
      free_apis: apis?.n || 0,
      active_bots: bots?.n || 0,
      cache_entries: cache?.n || 0,
      cache_hits: cache?.hits || 0,
      tokens_saved: cache?.tokens || 0,
      knowledge_items: knowledge?.n || 0,
    }
  })
})

// ─── LISTAR APIs ───────────────────────────────────────────────────────────
app.get('/api/apis', async (c) => {
  const db = c.env.DB
  const category = c.req.query('category')
  const search   = c.req.query('q')
  const authType = c.req.query('auth')
  const limit    = Math.min(parseInt(c.req.query('limit') || '50'), 200)

  let sql = 'SELECT id,name,category,subcategory,description,base_url,docs_url,auth_type,is_free,rate_limit,tags,example_endpoint,quality_score FROM apis WHERE is_free=1'
  const params: any[] = []

  if (category) { sql += ' AND category=?'; params.push(category) }
  if (authType)  { sql += ' AND auth_type=?'; params.push(authType) }
  if (search)    { sql += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)'; params.push(...[`%${search}%`,`%${search}%`,`%${search}%`]) }
  sql += ' ORDER BY quality_score DESC LIMIT ?'
  params.push(limit)

  const { results } = await db.prepare(sql).bind(...params).all<ApiRow>()

  // Categorias disponíveis
  const { results: cats } = await db.prepare('SELECT DISTINCT category, COUNT(*) as total FROM apis WHERE is_free=1 GROUP BY category ORDER BY total DESC').all<{category:string,total:number}>()

  return c.json({
    total: results.length,
    categories: cats,
    apis: results.map(a => ({
      ...a,
      tags: (() => { try { return JSON.parse(a.tags||'[]') } catch { return [] } })()
    }))
  })
})

// ─── DETALHES DE UMA API ───────────────────────────────────────────────────
app.get('/api/apis/:id', async (c) => {
  const api = await c.env.DB.prepare('SELECT * FROM apis WHERE id=?').bind(c.req.param('id')).first<ApiRow>()
  if (!api) return c.json({ error: 'API não encontrada' }, 404)
  return c.json(api)
})

// ─── BUSCA INTELIGENTE (cache-first) ──────────────────────────────────────
// 1. Normaliza query → hash
// 2. Busca no cache local
// 3. Se não encontrar: busca na knowledge_base
// 4. Se não encontrar: chama IA + salva resultado
app.post('/api/search', async (c) => {
  const { query, bot_id = 'master-bot', save = true } = await c.req.json() as {
    query: string; bot_id?: string; save?: boolean
  }
  if (!query?.trim()) return c.json({ error: 'Query obrigatória' }, 400)

  const db   = c.env.DB
  const hash = await hashQuery(query)
  const t0   = Date.now()

  // ── PASSO 1: Cache exato ────────────────────────────────────
  const cached = await db.prepare('SELECT * FROM cache_queries WHERE query_hash=?').bind(hash).first<CacheResult>()
  if (cached) {
    await db.prepare('UPDATE cache_queries SET hit_count=hit_count+1 WHERE id=?').bind(cached.id).run()
    await db.prepare("INSERT INTO learning_log (bot_id,action,query,result,cache_hit,duration_ms) VALUES (?,?,?,?,1,?)").bind(bot_id,'query',query,'cache_hit',Date.now()-t0).run()
    return c.json({ source: 'cache', query, response: cached.response, cache_hit: true, hit_count: cached.hit_count + 1, hash, duration_ms: Date.now()-t0 })
  }

  // ── PASSO 2: Knowledge Base (busca por keywords) ────────────
  const qNorm = normalizeQuery(query).split(' ').filter(w => w.length > 3)
  if (qNorm.length > 0) {
    const kbSearch = `%${qNorm.slice(0, 2).join('%')}%`
    const kb = await db.prepare(
      'SELECT * FROM knowledge_base WHERE content LIKE ? OR keywords LIKE ? OR topic LIKE ? ORDER BY confidence DESC, used_count DESC LIMIT 3'
    ).bind(kbSearch, kbSearch, `%${query.slice(0,30)}%`).first<KnowledgeRow>()

    if (kb && kb.confidence > 0.7) {
      await db.prepare('UPDATE knowledge_base SET used_count=used_count+1 WHERE id=?').bind(kb.id).run()
      const response = `**${kb.topic}** (${kb.category})\n\n${kb.content}`
      if (save) {
        await db.prepare('INSERT OR IGNORE INTO cache_queries (query_hash,query_text,source,response,response_type,tokens_saved) VALUES (?,?,?,?,?,?)').bind(hash,query,`kb:${kb.bot_id}`,response,'markdown',200).run()
      }
      await db.prepare("INSERT INTO learning_log (bot_id,action,query,result,cache_hit,duration_ms) VALUES (?,?,?,?,1,?)").bind(bot_id,'query',query,'knowledge_base',Date.now()-t0).run()
      return c.json({ source: 'knowledge_base', query, response, cache_hit: true, knowledge_id: kb.id, hash, duration_ms: Date.now()-t0 })
    }
  }

  // ── PASSO 3: Buscar APIs relevantes para a query ────────────
  const apiSearch = `%${query.slice(0, 40)}%`
  const { results: relatedApis } = await db.prepare(
    'SELECT name,description,base_url,example_endpoint,auth_type,tags FROM apis WHERE tags LIKE ? OR description LIKE ? OR name LIKE ? ORDER BY quality_score DESC LIMIT 5'
  ).bind(apiSearch, apiSearch, apiSearch).all<Partial<ApiRow>>()

  // Buscar contexto do bot
  const bot = await db.prepare('SELECT * FROM bots WHERE id=?').bind(bot_id).first<BotRow>()

  // ── PASSO 4: IA com contexto enriquecido ────────────────────
  const apisContext = relatedApis.length > 0
    ? `\n\nAPIs gratuitas relevantes para esta query:\n${relatedApis.map(a => `- ${a.name}: ${a.description} | ${a.base_url}${a.example_endpoint}`).join('\n')}`
    : ''

  const systemPrompt = bot?.system_prompt || 'Você é o KnowledgeBot da SixTech. Responda em português de forma concisa e útil.'
  const userPrompt   = `${query}${apisContext}\n\nSe APIs gratuitas foram fornecidas acima, mencione como usá-las na resposta.`

  const aiResponse = await callAI(c.env.AI, bot?.model || 'balanced', systemPrompt, userPrompt, 1500)

  // ── PASSO 5: Salvar no cache + knowledge ────────────────────
  if (save && aiResponse) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias
    await db.prepare('INSERT OR IGNORE INTO cache_queries (query_hash,query_text,source,response,response_type,tokens_saved,expires_at) VALUES (?,?,?,?,?,?,?)').bind(hash,query,`ai:${bot_id}`,aiResponse,'markdown',400,expiresAt).run()
    // Atualizar contador do bot
    await db.prepare('UPDATE bots SET queries_answered=queries_answered+1 WHERE id=?').bind(bot_id).run()
    await db.prepare("INSERT INTO learning_log (bot_id,action,query,result,cache_hit,tokens_used,duration_ms) VALUES (?,?,?,?,0,?,?)").bind(bot_id,'query',query,aiResponse.slice(0,100),400,Date.now()-t0).run()
  }

  return c.json({ source: 'ai', query, response: aiResponse, cache_hit: false, related_apis: relatedApis, hash, duration_ms: Date.now()-t0 })
})

// ─── LISTAR BOTS ───────────────────────────────────────────────────────────
app.get('/api/bots', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT id,name,emoji,description,category,model,parent_id,clone_depth,queries_answered,knowledge_items,apis_linked,knowledge_topics,created_at FROM bots WHERE is_active=1 ORDER BY clone_depth,created_at').all<BotRow>()

  // Árvore de clonagem
  const tree: Record<string, any> = {}
  for (const bot of results) {
    const node = { ...bot, children: [] as any[], apis_linked: (() => { try { return JSON.parse(bot.apis_linked||'[]') } catch { return [] } })(), knowledge_topics: (() => { try { return JSON.parse(bot.knowledge_topics||'[]') } catch { return [] } })() }
    tree[bot.id] = node
  }
  const roots: any[] = []
  for (const bot of results) {
    if (bot.parent_id && tree[bot.parent_id]) tree[bot.parent_id].children.push(tree[bot.id])
    else roots.push(tree[bot.id])
  }
  return c.json({ total: results.length, bots: roots })
})

// ─── CLONAR BOT ────────────────────────────────────────────────────────────
app.post('/api/bots/clone', async (c) => {
  const { parent_id, new_name, specialization, extra_apis } = await c.req.json() as {
    parent_id: string; new_name: string; specialization?: string; extra_apis?: number[]
  }
  const db = c.env.DB

  const parent = await db.prepare('SELECT * FROM bots WHERE id=?').bind(parent_id).first<BotRow>()
  if (!parent) return c.json({ error: 'Bot pai não encontrado' }, 404)

  const newId    = `${parent_id}-clone-${Date.now().toString(36)}`
  const newDepth = (parent.clone_depth || 0) + 1

  // Combinar APIs do pai + novas
  const parentApis: number[] = (() => { try { return JSON.parse(parent.apis_linked || '[]') } catch { return [] } })()
  const allApis   = [...new Set([...parentApis, ...(extra_apis || [])])]

  // Enriquecer system prompt com especialização
  const enhancedSystem = specialization
    ? `${parent.system_prompt}\n\nESPECIALIZAÇÃO ADICIONAL: ${specialization}`
    : parent.system_prompt

  await db.prepare(`INSERT INTO bots (id,name,emoji,description,category,system_prompt,model,parent_id,clone_depth,apis_linked,knowledge_topics)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(
    newId, new_name || `${parent.name} Clone`, parent.emoji,
    `Clone de ${parent.name}${specialization ? ` — ${specialization}` : ''}`,
    parent.category, enhancedSystem, parent.model,
    parent_id, newDepth, JSON.stringify(allApis), parent.knowledge_topics
  ).run()

  // Copiar conhecimento do pai para o clone
  const { results: parentKnowledge } = await db.prepare('SELECT topic,category,subcategory,content,source_type,confidence,keywords FROM knowledge_base WHERE bot_id=? LIMIT 50').bind(parent_id).all<KnowledgeRow>()
  for (const k of parentKnowledge) {
    await db.prepare('INSERT INTO knowledge_base (bot_id,topic,category,subcategory,content,source_type,confidence,keywords) VALUES (?,?,?,?,?,?,?,?)').bind(newId,k.topic,k.category,k.subcategory||'',k.content,k.source_type,k.confidence,k.keywords||'').run()
  }
  await db.prepare('UPDATE bots SET knowledge_items=? WHERE id=?').bind(parentKnowledge.length, newId).run()
  await db.prepare("INSERT INTO learning_log (bot_id,action,query,result) VALUES (?,?,?,?)").bind(newId,'clone',`Clonado de ${parent_id}`,`${parentKnowledge.length} items de conhecimento copiados`).run()

  return c.json({ success: true, bot_id: newId, parent_id, clone_depth: newDepth, knowledge_copied: parentKnowledge.length })
})

// ─── ENSINAR BOT (adicionar conhecimento) ─────────────────────────────────
app.post('/api/bots/:id/learn', async (c) => {
  const bot_id = c.req.param('id')
  const { topic, category, content, source_url, source_type = 'manual', keywords = [] } = await c.req.json() as {
    topic: string; category: string; content: string
    source_url?: string; source_type?: string; keywords?: string[]
  }
  const db = c.env.DB

  const bot = await db.prepare('SELECT id FROM bots WHERE id=?').bind(bot_id).first()
  if (!bot) return c.json({ error: 'Bot não encontrado' }, 404)

  const { meta } = await db.prepare('INSERT INTO knowledge_base (bot_id,topic,category,content,source_url,source_type,keywords) VALUES (?,?,?,?,?,?,?)').bind(bot_id,topic,category,content,source_url||'',source_type,JSON.stringify(keywords)).run()
  await db.prepare('UPDATE bots SET knowledge_items=knowledge_items+1 WHERE id=?').bind(bot_id).run()
  await db.prepare("INSERT INTO learning_log (bot_id,action,query,result) VALUES (?,?,?,?)").bind(bot_id,'learn',topic,`Novo conhecimento: ${category}`).run()

  return c.json({ success: true, knowledge_id: meta.last_row_id, bot_id, topic, category })
})

// ─── KNOWLEDGE BASE ────────────────────────────────────────────────────────
app.get('/api/knowledge', async (c) => {
  const db       = c.env.DB
  const bot_id   = c.req.query('bot_id')
  const category = c.req.query('category')
  const search   = c.req.query('q')
  const limit    = Math.min(parseInt(c.req.query('limit') || '20'), 100)

  let sql = 'SELECT id,bot_id,topic,category,subcategory,content,source_type,confidence,keywords,used_count,created_at FROM knowledge_base WHERE 1=1'
  const p: any[] = []
  if (bot_id)   { sql += ' AND bot_id=?'; p.push(bot_id) }
  if (category) { sql += ' AND category=?'; p.push(category) }
  if (search)   { sql += ' AND (topic LIKE ? OR content LIKE ? OR keywords LIKE ?)'; p.push(`%${search}%`,`%${search}%`,`%${search}%`) }
  sql += ' ORDER BY used_count DESC, confidence DESC LIMIT ?'; p.push(limit)

  const { results } = await db.prepare(sql).bind(...p).all<KnowledgeRow>()
  return c.json({ total: results.length, knowledge: results })
})

// ─── CACHE ─────────────────────────────────────────────────────────────────
app.get('/api/cache', async (c) => {
  const db     = c.env.DB
  const source = c.req.query('source')
  const limit  = Math.min(parseInt(c.req.query('limit') || '20'), 100)
  let sql = 'SELECT id,query_text,source,response_type,hit_count,tokens_saved,created_at FROM cache_queries WHERE 1=1'
  const p: any[] = []
  if (source) { sql += ' AND source LIKE ?'; p.push(`%${source}%`) }
  sql += ' ORDER BY hit_count DESC, created_at DESC LIMIT ?'; p.push(limit)
  const { results } = await db.prepare(sql).bind(...p).all<CacheResult>()
  const stats = await db.prepare('SELECT COUNT(*) as total, COALESCE(SUM(hit_count),0) as total_hits, COALESCE(SUM(tokens_saved),0) as tokens_saved FROM cache_queries').first<any>()
  return c.json({ stats, cache: results })
})

// ─── CRAWL DE URL (extrai conhecimento de fontes web) ─────────────────────
app.post('/api/crawl', async (c) => {
  const { url, bot_id = 'master-bot', category = 'Web', auto_save = true } = await c.req.json() as {
    url: string; bot_id?: string; category?: string; auto_save?: boolean
  }
  if (!url) return c.json({ error: 'URL obrigatória' }, 400)

  // Fetch do conteúdo com timeout
  let rawContent = ''
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'SixTechKnowledgeBot/1.0' }, signal: AbortSignal.timeout(8000) })
    rawContent = await res.text()
    rawContent = rawContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 8000)
  } catch (e: any) {
    return c.json({ error: `Falha ao buscar URL: ${e?.message}` }, 500)
  }

  // IA extrai conhecimento estruturado
  const extracted = await callAI(c.env.AI, 'balanced',
    `Você é um extrator de conhecimento. Analise o conteúdo e extraia informações úteis em formato JSON com campos: topic, summary, key_facts (array de strings), apis_mentioned (array), tags (array). Responda APENAS com JSON válido.`,
    `URL: ${url}\n\nConteúdo (primeiros 4000 chars):\n${rawContent.slice(0,4000)}\n\nExtraia o conhecimento mais relevante.`,
    800
  )

  let knowledge: any = {}
  try { knowledge = JSON.parse(extracted) } catch { knowledge = { topic: url, summary: extracted.slice(0, 500), key_facts: [], tags: [] } }

  if (auto_save && knowledge.summary) {
    const { meta } = await c.env.DB.prepare('INSERT INTO knowledge_base (bot_id,topic,category,content,source_url,source_type,keywords) VALUES (?,?,?,?,?,?,?)').bind(
      bot_id, knowledge.topic || url, category,
      `${knowledge.summary}\n\nFatos: ${(knowledge.key_facts||[]).join('; ')}`,
      url, 'web', JSON.stringify(knowledge.tags || [])
    ).run()
    await c.env.DB.prepare('UPDATE bots SET knowledge_items=knowledge_items+1 WHERE id=?').bind(bot_id).run()
    await c.env.DB.prepare('UPDATE crawl_sources SET last_crawled=CURRENT_TIMESTAMP, items_extracted=items_extracted+1, status="active" WHERE url=?').bind(url).run()
    await c.env.DB.prepare("INSERT INTO crawl_sources (url,name,category,status) SELECT ?,?,?,'active' WHERE NOT EXISTS (SELECT 1 FROM crawl_sources WHERE url=?)").bind(url,knowledge.topic||url,category,url).run()
    return c.json({ success: true, knowledge_id: meta.last_row_id, knowledge, chars_read: rawContent.length })
  }

  return c.json({ success: true, knowledge, chars_read: rawContent.length, saved: false })
})

// ─── CONVERSA COM BOT (SSE streaming) ─────────────────────────────────────
app.post('/api/chat', async (c) => {
  const { message, bot_id = 'master-bot', history = [] } = await c.req.json() as {
    message: string; bot_id?: string; history?: {role:string,content:string}[]
  }
  if (!message?.trim()) return c.json({ error: 'Mensagem obrigatória' }, 400)

  const db = c.env.DB
  const bot = await db.prepare('SELECT * FROM bots WHERE id=?').bind(bot_id).first<BotRow>()

  // Buscar contexto da knowledge base
  const qNorm = normalizeQuery(message)
  const kbHits = await db.prepare('SELECT topic,content FROM knowledge_base WHERE bot_id=? AND (content LIKE ? OR keywords LIKE ?) ORDER BY used_count DESC LIMIT 3').bind(bot_id, `%${qNorm.slice(0,30)}%`, `%${qNorm.slice(0,30)}%`).all<{topic:string,content:string}>()
  const kbContext = kbHits.results.length > 0
    ? `\n\nCONHECIMENTO RELEVANTE DO BANCO:\n${kbHits.results.map(k => `### ${k.topic}\n${k.content.slice(0,300)}`).join('\n\n')}`
    : ''

  const systemPrompt = (bot?.system_prompt || 'Você é o KnowledgeBot da SixTech. Responda em português.') + kbContext

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map((h: any) => ({ role: h.role, content: h.content })),
    { role: 'user', content: message }
  ]

  const modelKey = bot?.model || 'balanced'
  const modelId  = MODELS[modelKey] || MODELS.balanced

  const stream = await (c.env.AI as any).run(modelId, { messages, max_tokens: 1500, stream: true })
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
  })
})

// ─── ESTATÍSTICAS / DASHBOARD ──────────────────────────────────────────────
app.get('/api/stats', async (c) => {
  const db = c.env.DB
  const [topCache, topKb, recentLog, botsStats] = await Promise.all([
    db.prepare('SELECT query_text,hit_count,source,created_at FROM cache_queries ORDER BY hit_count DESC LIMIT 5').all(),
    db.prepare('SELECT topic,category,used_count,confidence FROM knowledge_base ORDER BY used_count DESC LIMIT 5').all(),
    db.prepare('SELECT bot_id,action,query,cache_hit,created_at FROM learning_log ORDER BY created_at DESC LIMIT 10').all(),
    db.prepare('SELECT id,name,emoji,category,queries_answered,knowledge_items,clone_depth FROM bots WHERE is_active=1').all(),
  ])
  return c.json({ top_cached: topCache.results, top_knowledge: topKb.results, recent_activity: recentLog.results, bots: botsStats.results })
})

// ─── PÁGINA PRINCIPAL ──────────────────────────────────────────────────────
app.get('/', (c) => {
  return c.html(HTML_PAGE)
})
app.get('/*', (c) => c.html(HTML_PAGE))

// ─── HTML SPA ──────────────────────────────────────────────────────────────
const HTML_PAGE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>SixTech KnowledgeBot — API Intelligence</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0f1117;--bg2:#1a1d27;--bg3:#232736;--bg4:#2d3149;
  --accent:#6C63FF;--accent2:#4ECDC4;--accent3:#FFE66D;--accent4:#FF6B6B;
  --text:#e8eaf0;--text2:#9aa3b8;--border:#2d3149;
  --green:#22c55e;--yellow:#f59e0b;--red:#ef4444;--blue:#3b82f6;
}
body{background:var(--bg);color:var(--text);font-family:'Segoe UI',system-ui,sans-serif;min-height:100vh;display:flex;flex-direction:column}
/* HEADER */
header{background:var(--bg2);border-bottom:1px solid var(--border);padding:12px 20px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:100}
.logo{font-size:22px;font-weight:700;background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.logo span{font-size:13px;color:var(--text2);margin-left:6px;-webkit-text-fill-color:var(--text2)}
.header-stats{display:flex;gap:12px;margin-left:auto;flex-wrap:wrap}
.hstat{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:4px 10px;font-size:12px;color:var(--text2)}
.hstat strong{color:var(--accent2)}
/* LAYOUT */
.layout{display:flex;flex:1;overflow:hidden;height:calc(100vh - 57px)}
/* SIDEBAR */
nav{width:200px;min-width:200px;background:var(--bg2);border-right:1px solid var(--border);padding:16px 0;overflow-y:auto}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 16px;cursor:pointer;border-radius:0;transition:all .15s;font-size:13px;color:var(--text2);border-left:3px solid transparent}
.nav-item:hover{background:var(--bg3);color:var(--text)}
.nav-item.active{background:var(--bg3);color:var(--accent);border-left-color:var(--accent)}
.nav-item i{width:16px;text-align:center}
.nav-sep{padding:12px 16px 4px;font-size:10px;color:var(--text2);text-transform:uppercase;letter-spacing:1px}
/* MAIN */
main{flex:1;overflow-y:auto;padding:20px}
/* PANELS */
.panel{display:none}.panel.active{display:block}
/* CARDS */
.card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:16px}
.card-title{font-size:16px;font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px}
/* GRID */
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
@media(max-width:900px){.grid4{grid-template-columns:repeat(2,1fr)}.grid3{grid-template-columns:1fr 1fr}.grid2{grid-template-columns:1fr}.layout{flex-direction:column}nav{width:100%;min-width:unset;height:auto;display:flex;flex-wrap:wrap;padding:8px}}
/* STAT CARDS */
.stat-card{background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:16px;text-align:center}
.stat-card .num{font-size:28px;font-weight:700;color:var(--accent)}
.stat-card .lbl{font-size:11px;color:var(--text2);margin-top:4px}
/* BUSCADOR */
.search-wrap{position:relative;margin-bottom:16px}
.search-input{width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 44px 12px 16px;color:var(--text);font-size:14px;outline:none;transition:border .15s}
.search-input:focus{border-color:var(--accent)}
.search-icon{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:var(--text2)}
/* FILTROS */
.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.filter-btn{padding:5px 12px;border-radius:20px;border:1px solid var(--border);background:var(--bg3);color:var(--text2);font-size:12px;cursor:pointer;transition:all .15s}
.filter-btn:hover,.filter-btn.active{background:var(--accent);border-color:var(--accent);color:#fff}
/* API CARDS */
.api-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}
.api-card{background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:14px;transition:all .15s;cursor:pointer}
.api-card:hover{border-color:var(--accent);transform:translateY(-1px)}
.api-card-head{display:flex;align-items:flex-start;gap:10px;margin-bottom:8px}
.api-name{font-weight:600;font-size:13px;flex:1}
.api-badge{font-size:10px;padding:2px 8px;border-radius:10px;background:var(--bg4);border:1px solid var(--border)}
.api-badge.free{background:#14532d;color:#86efac;border-color:#15803d}
.api-badge.none{background:#1e1b4b;color:#a5b4fc;border-color:#3730a3}
.api-badge.apikey{background:#431407;color:#fdba74;border-color:#c2410c}
.api-desc{font-size:12px;color:var(--text2);margin-bottom:8px;line-height:1.4}
.api-tags{display:flex;gap:4px;flex-wrap:wrap}
.api-tag{font-size:10px;padding:2px 6px;border-radius:4px;background:var(--bg4);color:var(--text2)}
.api-footer{display:flex;gap:8px;margin-top:8px;align-items:center}
.api-url{font-size:10px;color:var(--accent2);font-family:monospace;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.api-score{display:flex;gap:1px}
.star{color:var(--accent3);font-size:10px}
/* CHAT */
.chat-layout{display:grid;grid-template-columns:220px 1fr;gap:16px;height:calc(100vh - 140px)}
.bot-list{background:var(--bg2);border:1px solid var(--border);border-radius:12px;overflow-y:auto;padding:8px}
.bot-item{padding:10px 12px;border-radius:8px;cursor:pointer;transition:all .15s;margin-bottom:4px}
.bot-item:hover{background:var(--bg3)}
.bot-item.active{background:var(--bg4);border:1px solid var(--accent)}
.bot-item-head{display:flex;align-items:center;gap:8px}
.bot-emoji{font-size:20px}
.bot-name{font-size:13px;font-weight:600}
.bot-cat{font-size:10px;color:var(--text2)}
.bot-stats{display:flex;gap:8px;margin-top:4px;font-size:10px;color:var(--text2)}
.chat-area{display:flex;flex-direction:column;background:var(--bg2);border:1px solid var(--border);border-radius:12px;overflow:hidden}
.chat-header{padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.msg{display:flex;gap:10px;max-width:85%}
.msg.user{align-self:flex-end;flex-direction:row-reverse}
.msg-bubble{padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.6;white-space:pre-wrap}
.msg.bot .msg-bubble{background:var(--bg3);border:1px solid var(--border);border-radius:12px 12px 12px 2px}
.msg.user .msg-bubble{background:var(--accent);color:#fff;border-radius:12px 12px 2px 12px}
.msg-avatar{width:30px;height:30px;border-radius:50%;background:var(--bg4);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.cache-badge{font-size:10px;padding:2px 6px;background:#14532d;color:#86efac;border-radius:4px;margin-top:4px;display:inline-block}
.chat-input-area{padding:12px;border-top:1px solid var(--border);display:flex;gap:8px}
.chat-input{flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 14px;color:var(--text);font-size:13px;outline:none;resize:none;max-height:120px}
.chat-input:focus{border-color:var(--accent)}
/* BOTÕES */
.btn{padding:8px 16px;border-radius:8px;border:none;cursor:pointer;font-size:13px;font-weight:500;transition:all .15s;display:inline-flex;align-items:center;gap:6px}
.btn-primary{background:var(--accent);color:#fff}.btn-primary:hover{opacity:.9}
.btn-secondary{background:var(--bg3);color:var(--text);border:1px solid var(--border)}.btn-secondary:hover{border-color:var(--accent)}
.btn-success{background:var(--green);color:#fff}.btn-success:hover{opacity:.9}
.btn-danger{background:var(--red);color:#fff}.btn-danger:hover{opacity:.9}
.btn-sm{padding:5px 10px;font-size:12px}
.btn:disabled{opacity:.4;cursor:default}
/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:24px;width:100%;max-width:520px;max-height:80vh;overflow-y:auto}
.modal-title{font-size:17px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px}
.modal-close{margin-left:auto;background:none;border:none;color:var(--text2);cursor:pointer;font-size:18px}
/* FORMULÁRIOS */
.form-group{margin-bottom:12px}
label{display:block;font-size:12px;color:var(--text2);margin-bottom:4px}
.form-input,.form-select,.form-textarea{width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;color:var(--text);font-size:13px;outline:none}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--accent)}
.form-textarea{resize:vertical;min-height:80px}
/* BOT CLONE */
.clone-tree{padding:8px 0}
.clone-node{padding:6px 10px;margin:3px 0;border-radius:6px;background:var(--bg3);border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:8px;font-size:12px}
.clone-node:hover{border-color:var(--accent2)}
.clone-indent{padding-left:20px;border-left:2px dashed var(--border);margin-left:15px}
/* KNOWLEDGE */
.kb-item{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:8px}
.kb-topic{font-weight:600;font-size:13px;margin-bottom:4px}
.kb-meta{display:flex;gap:8px;font-size:10px;color:var(--text2);margin-bottom:6px}
.kb-content{font-size:12px;color:var(--text2);line-height:1.5}
/* CACHE ITEMS */
.cache-item{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px;margin-bottom:6px}
.cache-query{font-size:12px;font-weight:500;margin-bottom:4px}
.cache-meta{display:flex;gap:8px;font-size:10px;color:var(--text2)}
.cache-resp{font-size:11px;color:var(--text2);margin-top:4px;max-height:60px;overflow:hidden;text-overflow:ellipsis}
/* BADGES */
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:10px;font-size:11px;font-weight:500}
.badge-green{background:#14532d;color:#86efac}
.badge-blue{background:#1e3a5f;color:#7dd3fc}
.badge-yellow{background:#422006;color:#fde68a}
.badge-purple{background:#2e1065;color:#c4b5fd}
.badge-red{background:#450a0a;color:#fca5a5}
/* PROGRESS */
.progress{height:6px;background:var(--bg4);border-radius:3px;overflow:hidden}
.progress-bar{height:100%;background:var(--accent);transition:width .3s}
/* EMPTY STATE */
.empty{text-align:center;padding:40px;color:var(--text2)}
.empty i{font-size:40px;margin-bottom:12px;opacity:.4}
/* LOADING */
.spin{animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
/* TOOLTIP */
[title]{position:relative}
/* TABS */
.tabs{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:16px}
.tab{padding:9px 18px;font-size:13px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;color:var(--text2);transition:all .15s}
.tab:hover{color:var(--text)}
.tab.active{color:var(--accent);border-bottom-color:var(--accent)}
.tab-panel{display:none}.tab-panel.active{display:block}
/* CRAWL */
.crawl-row{display:flex;gap:8px;margin-bottom:8px}
/* SCROLLBAR */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--bg4);border-radius:2px}
/* TYPING */
.typing-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--text2);margin:0 2px;animation:bounce .6s infinite alternate}
.typing-dot:nth-child(2){animation-delay:.15s}.typing-dot:nth-child(3){animation-delay:.3s}
@keyframes bounce{to{transform:translateY(-4px);opacity:.3}}
</style>
</head>
<body>

<header>
  <div class="logo">🧠 SixTech<span>KnowledgeBot</span></div>
  <div class="header-stats">
    <div class="hstat">🗄️ APIs: <strong id="h-apis">…</strong></div>
    <div class="hstat">🤖 Bots: <strong id="h-bots">…</strong></div>
    <div class="hstat">⚡ Cache: <strong id="h-cache">…</strong></div>
    <div class="hstat">🧠 Conhecimento: <strong id="h-kb">…</strong></div>
    <div class="hstat">💰 Tokens Poupados: <strong id="h-tokens">…</strong></div>
  </div>
</header>

<div class="layout">
<nav>
  <div class="nav-sep">Principal</div>
  <div class="nav-item active" onclick="showPanel('dash',this)"><i class="fas fa-chart-line"></i> Dashboard</div>
  <div class="nav-item" onclick="showPanel('chat',this)"><i class="fas fa-robot"></i> Chat com Bots</div>
  <div class="nav-item" onclick="showPanel('apis',this)"><i class="fas fa-plug"></i> APIs Gratuitas</div>
  <div class="nav-sep">Dados</div>
  <div class="nav-item" onclick="showPanel('knowledge',this)"><i class="fas fa-brain"></i> Base de Conhecimento</div>
  <div class="nav-item" onclick="showPanel('cache',this)"><i class="fas fa-database"></i> Cache de Consultas</div>
  <div class="nav-sep">Bots</div>
  <div class="nav-item" onclick="showPanel('bots',this)"><i class="fas fa-sitemap"></i> Gerenciar Bots</div>
  <div class="nav-item" onclick="showPanel('crawl',this)"><i class="fas fa-spider"></i> Crawl & Aprender</div>
</nav>

<main>

<!-- DASHBOARD -->
<section id="panel-dash" class="panel active">
  <div class="grid4" style="margin-bottom:16px">
    <div class="stat-card"><div class="num" id="s-apis">-</div><div class="lbl">APIs Gratuitas</div></div>
    <div class="stat-card"><div class="num" id="s-bots">-</div><div class="lbl">Bots Ativos</div></div>
    <div class="stat-card"><div class="num" id="s-cache">-</div><div class="lbl">Itens no Cache</div></div>
    <div class="stat-card"><div class="num" id="s-kb">-</div><div class="lbl">Base de Conhecimento</div></div>
  </div>

  <div class="grid2">
    <div class="card">
      <div class="card-title"><i class="fas fa-fire" style="color:var(--accent4)"></i> Top Cache (mais usados)</div>
      <div id="top-cache-list"><div class="empty"><i class="fas fa-spinner spin"></i><div>Carregando…</div></div></div>
    </div>
    <div class="card">
      <div class="card-title"><i class="fas fa-brain" style="color:var(--accent)"></i> Top Conhecimento</div>
      <div id="top-kb-list"><div class="empty"><i class="fas fa-spinner spin"></i></div></div>
    </div>
  </div>

  <div class="card">
    <div class="card-title"><i class="fas fa-history" style="color:var(--accent2)"></i> Atividade Recente</div>
    <div id="activity-list"><div class="empty"><i class="fas fa-spinner spin"></i></div></div>
  </div>

  <div class="card">
    <div class="card-title"><i class="fas fa-search" style="color:var(--accent3)"></i> Busca Inteligente (teste o cache-first)</div>
    <div style="display:flex;gap:8px;margin-bottom:12px">
      <input class="form-input" id="dash-search" placeholder="Ex: câmbio usd brl, previsão do tempo, CNPJ grátis…" style="flex:1">
      <select class="form-select" id="dash-bot" style="width:160px"></select>
      <button class="btn btn-primary" onclick="dashSearch()"><i class="fas fa-search"></i> Buscar</button>
    </div>
    <div id="dash-result"></div>
  </div>
</section>

<!-- CHAT -->
<section id="panel-chat" class="panel">
  <div class="chat-layout">
    <div class="bot-list" id="bot-list-sidebar">
      <div style="font-size:11px;color:var(--text2);padding:4px 8px 8px;text-transform:uppercase;letter-spacing:1px">Bots</div>
      <div class="empty"><i class="fas fa-spinner spin"></i></div>
    </div>
    <div class="chat-area">
      <div class="chat-header">
        <span id="chat-bot-emoji" style="font-size:22px">🤖</span>
        <div>
          <div id="chat-bot-name" style="font-weight:600">Selecione um bot</div>
          <div id="chat-bot-desc" style="font-size:11px;color:var(--text2)">Clique em um bot na lista ao lado</div>
        </div>
        <div style="margin-left:auto;display:flex;gap:8px">
          <button class="btn btn-secondary btn-sm" onclick="clearChat()"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div class="chat-messages" id="chat-messages">
        <div class="empty" style="margin:auto"><i class="fas fa-robot" style="font-size:40px;opacity:.3"></i><div style="margin-top:8px">Selecione um bot e comece a conversar</div></div>
      </div>
      <div class="chat-input-area">
        <textarea class="chat-input" id="chat-input" placeholder="Digite sua mensagem… (Enter para enviar, Shift+Enter para nova linha)" rows="1"></textarea>
        <button class="btn btn-primary" id="chat-send-btn" onclick="chatSend()" disabled><i class="fas fa-paper-plane"></i></button>
      </div>
    </div>
  </div>
</section>

<!-- APIs -->
<section id="panel-apis" class="panel">
  <div class="search-wrap">
    <input class="search-input" id="api-search" placeholder="Buscar APIs… ex: câmbio, clima, CNPJ, cripto, IA, chat, geolocalização…" oninput="filterApis()">
    <i class="fas fa-search search-icon"></i>
  </div>
  <div class="filters" id="api-category-filters"></div>
  <div id="api-grid" class="api-grid"></div>
</section>

<!-- KNOWLEDGE -->
<section id="panel-knowledge" class="panel">
  <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
    <input class="form-input" id="kb-search" placeholder="Buscar no conhecimento…" style="flex:1;min-width:200px">
    <select class="form-select" id="kb-bot-filter" style="width:150px" onchange="loadKnowledge()"><option value="">Todos os bots</option></select>
    <button class="btn btn-secondary" onclick="loadKnowledge()"><i class="fas fa-refresh"></i></button>
    <button class="btn btn-success" onclick="showLearnModal()"><i class="fas fa-plus"></i> Ensinar</button>
  </div>
  <div id="kb-list"></div>
</section>

<!-- CACHE -->
<section id="panel-cache" class="panel">
  <div class="card" style="margin-bottom:16px">
    <div class="grid4">
      <div class="stat-card"><div class="num" id="cs-total">-</div><div class="lbl">Entradas no Cache</div></div>
      <div class="stat-card"><div class="num" id="cs-hits">-</div><div class="lbl">Total de Cache Hits</div></div>
      <div class="stat-card"><div class="num" id="cs-tokens">-</div><div class="lbl">Tokens Economizados</div></div>
      <div class="stat-card"><div class="num" id="cs-economy">-</div><div class="lbl">% Economia Estimada</div></div>
    </div>
  </div>
  <div style="display:flex;gap:8px;margin-bottom:16px">
    <input class="form-input" id="cache-search" placeholder="Filtrar por source…" style="width:200px">
    <button class="btn btn-secondary" onclick="loadCache()"><i class="fas fa-refresh"></i> Atualizar</button>
  </div>
  <div id="cache-list"></div>
</section>

<!-- BOTS -->
<section id="panel-bots" class="panel">
  <div style="display:flex;gap:8px;margin-bottom:16px">
    <button class="btn btn-primary" onclick="showCloneModal()"><i class="fas fa-code-branch"></i> Clonar Bot</button>
    <button class="btn btn-secondary" onclick="loadBots()"><i class="fas fa-refresh"></i></button>
  </div>
  <div id="bots-grid"></div>
</section>

<!-- CRAWL -->
<section id="panel-crawl" class="panel">
  <div class="card">
    <div class="card-title"><i class="fas fa-spider" style="color:var(--accent4)"></i> Crawl de URL (Extrair & Aprender)</div>
    <p style="font-size:12px;color:var(--text2);margin-bottom:16px">Insira uma URL pública — o bot vai ler o conteúdo, extrair conhecimento estruturado e salvar automaticamente no banco de dados.</p>
    <div class="crawl-row">
      <input class="form-input" id="crawl-url" placeholder="https://exemplo.com/artigo-ou-documentacao" style="flex:1">
      <select class="form-select" id="crawl-bot" style="width:160px"></select>
      <select class="form-select" id="crawl-cat" style="width:130px">
        <option>Tecnologia</option><option>Finanças</option><option>Saúde</option>
        <option>Governo</option><option>Educação</option><option>Negócios</option><option>Geral</option>
      </select>
      <button class="btn btn-primary" onclick="doCrawl()"><i class="fas fa-spider"></i> Crawlear</button>
    </div>
    <div id="crawl-result" style="margin-top:12px"></div>
  </div>
  <div class="card">
    <div class="card-title"><i class="fas fa-list" style="color:var(--accent2)"></i> Fontes de Aprendizado Sugeridas</div>
    <div class="api-grid" id="crawl-sources">
      ${[
        ['GitHub Public APIs','https://raw.githubusercontent.com/public-apis/public-apis/master/README.md','Lista completa de APIs gratuitas'],
        ['BrasilAPI Docs','https://brasilapi.com.br','APIs gratuitas brasileiras'],
        ['Open-Meteo Docs','https://open-meteo.com/en/docs','Clima sem API key'],
        ['BACEN Dados Abertos','https://dadosabertos.bcb.gov.br','Dados do Banco Central'],
        ['Dev.to Latest','https://dev.to/api/articles?top=1&per_page=5','Artigos de tecnologia'],
        ['IBGE Localidades','https://servicodados.ibge.gov.br/api/v1/localidades/estados','Estados brasileiros'],
      ].map(([name,url,desc]) => `<div class="api-card" onclick="setCrawlUrl('${url}')"><div class="api-card-head"><div class="api-name">${name}</div></div><div class="api-desc">${desc}</div><div class="api-url">${url}</div></div>`).join('')}
    </div>
  </div>
</section>

</main>
</div>

<!-- MODAL: Ensinar Bot -->
<div class="modal-overlay" id="learn-modal" style="display:none">
  <div class="modal">
    <div class="modal-title"><i class="fas fa-graduation-cap" style="color:var(--accent3)"></i> Ensinar ao Bot <button class="modal-close" onclick="closeModal('learn-modal')">×</button></div>
    <div class="form-group"><label>Bot</label><select class="form-select" id="learn-bot-id"></select></div>
    <div class="form-group"><label>Tópico</label><input class="form-input" id="learn-topic" placeholder="Ex: Como usar CoinGecko"></div>
    <div class="form-group"><label>Categoria</label><input class="form-input" id="learn-category" placeholder="Ex: Finanças, Tecnologia, Saúde…"></div>
    <div class="form-group"><label>Conhecimento / Conteúdo</label><textarea class="form-textarea" id="learn-content" rows="5" placeholder="Descreva o conhecimento detalhado que o bot deve aprender…"></textarea></div>
    <div class="form-group"><label>URL Fonte (opcional)</label><input class="form-input" id="learn-source" placeholder="https://docs.exemplo.com"></div>
    <div class="form-group"><label>Palavras-chave (separadas por vírgula)</label><input class="form-input" id="learn-keywords" placeholder="api,gratis,json,curl"></div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px">
      <button class="btn btn-secondary" onclick="closeModal('learn-modal')">Cancelar</button>
      <button class="btn btn-success" onclick="submitLearn()"><i class="fas fa-save"></i> Salvar Conhecimento</button>
    </div>
  </div>
</div>

<!-- MODAL: Clonar Bot -->
<div class="modal-overlay" id="clone-modal" style="display:none">
  <div class="modal">
    <div class="modal-title"><i class="fas fa-code-branch" style="color:var(--accent2)"></i> Clonar Bot <button class="modal-close" onclick="closeModal('clone-modal')">×</button></div>
    <div class="form-group"><label>Bot Origem (para clonar)</label><select class="form-select" id="clone-parent-id"></select></div>
    <div class="form-group"><label>Nome do Novo Bot</label><input class="form-input" id="clone-name" placeholder="Ex: Finance Bot — Cripto Especializado"></div>
    <div class="form-group"><label>Especialização Adicional (opcional)</label><textarea class="form-textarea" id="clone-spec" rows="3" placeholder="Ex: Focado exclusivamente em criptomoedas DeFi e análise de contratos inteligentes…"></textarea></div>
    <div style="font-size:12px;color:var(--text2);background:var(--bg3);padding:10px;border-radius:8px;margin-bottom:12px">
      <i class="fas fa-info-circle" style="color:var(--accent2)"></i> O clone herda todo o conhecimento do bot pai (system prompt + base de conhecimento) e pode ser especializado ainda mais.
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button class="btn btn-secondary" onclick="closeModal('clone-modal')">Cancelar</button>
      <button class="btn btn-primary" onclick="submitClone()"><i class="fas fa-code-branch"></i> Clonar Bot</button>
    </div>
  </div>
</div>

<!-- MODAL: Detalhes da API -->
<div class="modal-overlay" id="api-modal" style="display:none">
  <div class="modal" style="max-width:600px">
    <div class="modal-title" id="api-modal-title">API <button class="modal-close" onclick="closeModal('api-modal')">×</button></div>
    <div id="api-modal-body"></div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
<script>
// ═══════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════
let state = {
  bots: [], apis: [], currentBot: null,
  chatHistory: [], allBotIds: []
}

// ═══════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════
async function init() {
  await Promise.all([loadStatus(), loadApis(), loadBots()])
  await Promise.all([loadStats(), loadKnowledge(), loadCache()])
}

// ═══════════════════════════════════════════════════════
// NAVEGAÇÃO
// ═══════════════════════════════════════════════════════
function showPanel(id, el) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'))
  document.getElementById('panel-' + id).classList.add('active')
  el.classList.add('active')
  if (id === 'knowledge') loadKnowledge()
  if (id === 'cache')     loadCache()
  if (id === 'bots')      renderBots()
}

// ═══════════════════════════════════════════════════════
// STATUS
// ═══════════════════════════════════════════════════════
async function loadStatus() {
  try {
    const { data } = await axios.get('/api/status')
    const s = data.stats
    document.getElementById('h-apis').textContent    = s.free_apis
    document.getElementById('h-bots').textContent    = s.active_bots
    document.getElementById('h-cache').textContent   = s.cache_entries
    document.getElementById('h-kb').textContent      = s.knowledge_items
    document.getElementById('h-tokens').textContent  = s.tokens_saved
    document.getElementById('s-apis').textContent    = s.free_apis
    document.getElementById('s-bots').textContent    = s.active_bots
    document.getElementById('s-cache').textContent   = s.cache_entries
    document.getElementById('s-kb').textContent      = s.knowledge_items
  } catch(e) { console.error(e) }
}

// ═══════════════════════════════════════════════════════
// APIS
// ═══════════════════════════════════════════════════════
let apisAll = [], currentCat = ''
async function loadApis() {
  const { data } = await axios.get('/api/apis?limit=200')
  apisAll = data.apis; state.apis = data.apis
  // Filtros de categoria
  const filtersEl = document.getElementById('api-category-filters')
  filtersEl.innerHTML = '<button class="filter-btn active" onclick="setCat(\\'\\')" id="cat-all">Todas</button>' +
    data.categories.map(c => \`<button class="filter-btn" onclick="setCat('\${c.category}')" id="cat-\${c.category}">\${c.category} <span style="opacity:.6">(\${c.total})</span></button>\`).join('')
  renderApis(apisAll)
}

function setCat(cat) {
  currentCat = cat
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
  document.getElementById(cat ? \`cat-\${cat}\` : 'cat-all')?.classList.add('active')
  filterApis()
}

function filterApis() {
  const q = document.getElementById('api-search').value.toLowerCase()
  let filtered = apisAll
  if (currentCat) filtered = filtered.filter(a => a.category === currentCat)
  if (q) filtered = filtered.filter(a => (a.name+a.description+JSON.stringify(a.tags)).toLowerCase().includes(q))
  renderApis(filtered)
}

function renderApis(apis) {
  const el = document.getElementById('api-grid')
  if (!apis.length) { el.innerHTML = '<div class="empty" style="grid-column:1/-1"><i class="fas fa-search"></i><div>Nenhuma API encontrada</div></div>'; return }
  el.innerHTML = apis.map(api => {
    const tags = Array.isArray(api.tags) ? api.tags.slice(0,4) : []
    const stars = '★'.repeat(Math.min(Math.round(api.quality_score/2),5)) + '☆'.repeat(5-Math.min(Math.round(api.quality_score/2),5))
    return \`<div class="api-card" onclick="showApiDetail(\${api.id})">
      <div class="api-card-head">
        <div class="api-name">\${api.name}</div>
        <span class="api-badge free">GRÁTIS</span>
        <span class="api-badge \${api.auth_type}">\${api.auth_type==='none'?'SEM KEY':api.auth_type.toUpperCase()}</span>
      </div>
      <div class="api-desc">\${api.description||''}</div>
      <div class="api-tags">\${tags.map(t=>\`<span class="api-tag">\${t}</span>\`).join('')}</div>
      <div class="api-footer">
        <span class="api-url">\${api.base_url||''}</span>
        <span class="api-score" title="Score: \${api.quality_score}/10">\${stars}</span>
      </div>
    </div>\`
  }).join('')
}

async function showApiDetail(id) {
  const api = apisAll.find(a => a.id === id)
  if (!api) return
  document.getElementById('api-modal-title').innerHTML = \`\${api.name} <button class="modal-close" onclick="closeModal('api-modal')">×</button>\`
  const tags = Array.isArray(api.tags) ? api.tags : []
  document.getElementById('api-modal-body').innerHTML = \`
    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
      <span class="badge badge-green">GRÁTIS</span>
      <span class="badge badge-blue">\${api.category}</span>
      \${api.subcategory?\`<span class="badge badge-purple">\${api.subcategory}</span>\`:''}
      <span class="badge badge-yellow">Auth: \${api.auth_type}</span>
      \${api.rate_limit?\`<span class="badge badge-red">Rate: \${api.rate_limit}</span>\`:''}
    </div>
    <p style="color:var(--text2);font-size:13px;margin-bottom:12px">\${api.description||''}</p>
    <div class="form-group"><label>URL Base</label><div style="font-family:monospace;font-size:12px;background:var(--bg3);padding:8px;border-radius:6px;color:var(--accent2)">\${api.base_url||''}</div></div>
    \${api.example_endpoint?\`<div class="form-group"><label>Endpoint de Exemplo</label><div style="font-family:monospace;font-size:12px;background:var(--bg3);padding:8px;border-radius:6px;color:var(--accent3)">GET \${api.base_url||''}\${api.example_endpoint}</div></div>\`:''}
    \${api.docs_url?\`<div class="form-group"><label>Documentação</label><a href="\${api.docs_url}" target="_blank" style="color:var(--accent);font-size:13px">\${api.docs_url} <i class="fas fa-external-link-alt"></i></a></div>\`:''}
    <div class="api-tags" style="margin-top:8px">\${tags.map(t=>\`<span class="api-tag">\${t}</span>\`).join('')}</div>
    <div style="margin-top:16px;display:flex;gap:8px">
      <button class="btn btn-secondary btn-sm" onclick="testApiInChat(\${api.id})"><i class="fas fa-comment"></i> Perguntar ao Bot</button>
      \${api.docs_url?\`<a href="\${api.docs_url}" target="_blank" class="btn btn-primary btn-sm"><i class="fas fa-book"></i> Ver Docs</a>\`:''}
    </div>
  \`
  document.getElementById('api-modal').style.display = 'flex'
}

function testApiInChat(id) {
  const api = apisAll.find(a => a.id === id)
  closeModal('api-modal')
  showPanel('chat', document.querySelector('.nav-item:nth-child(3)'))
  if (api && state.currentBot) {
    document.getElementById('chat-input').value = \`Como usar a API \${api.name}? Me dê um exemplo prático.\`
  }
}

// ═══════════════════════════════════════════════════════
// BOTS
// ═══════════════════════════════════════════════════════
async function loadBots() {
  const { data } = await axios.get('/api/bots')
  state.bots = data.bots
  const allBots = flattenBots(data.bots)
  state.allBotIds = allBots
  renderBotSidebar(allBots)
  renderBots()
  populateBotSelects(allBots)
}

function flattenBots(bots, result = []) {
  for (const b of bots) { result.push(b); if (b.children?.length) flattenBots(b.children, result) }
  return result
}

function renderBotSidebar(bots) {
  const el = document.getElementById('bot-list-sidebar')
  el.innerHTML = '<div style="font-size:11px;color:var(--text2);padding:4px 8px 8px;text-transform:uppercase;letter-spacing:1px">Bots</div>' +
    bots.map(b => \`<div class="bot-item" id="bitem-\${b.id}" onclick="selectBot('\${b.id}')">
      <div class="bot-item-head">
        <span class="bot-emoji">\${b.emoji||'🤖'}</span>
        <div><div class="bot-name">\${b.name}</div><div class="bot-cat">\${b.category}</div></div>
      </div>
      <div class="bot-stats">
        <span>💬 \${b.queries_answered||0}</span>
        <span>🧠 \${b.knowledge_items||0}</span>
        \${b.clone_depth>0?\`<span>🔀 clone(\${b.clone_depth})</span>\`:''}
      </div>
    </div>\`).join('')
}

function renderBots() {
  const el = document.getElementById('bots-grid')
  if (!el || !state.bots.length) return
  const allBots = flattenBots(state.bots)
  el.innerHTML = \`<div class="api-grid">\${allBots.map(b => \`
    <div class="api-card">
      <div class="api-card-head">
        <span style="font-size:22px">\${b.emoji||'🤖'}</span>
        <div><div class="api-name">\${b.name}</div><div style="font-size:11px;color:var(--text2)">\${b.category}</div></div>
        \${b.clone_depth>0?\`<span class="badge badge-purple" title="Clone profundidade \${b.clone_depth}">Clone \${b.clone_depth}</span>\`:'<span class="badge badge-green">Original</span>'}
      </div>
      <div class="api-desc">\${b.description||''}</div>
      <div class="api-footer">
        <span style="font-size:11px;color:var(--text2)">💬 \${b.queries_answered||0} consultas · 🧠 \${b.knowledge_items||0} itens</span>
      </div>
      <div style="display:flex;gap:6px;margin-top:8px">
        <button class="btn btn-secondary btn-sm" onclick="selectBotAndChat('\${b.id}')"><i class="fas fa-comment"></i> Chat</button>
        <button class="btn btn-primary btn-sm" onclick="prepClone('\${b.id}')"><i class="fas fa-code-branch"></i> Clonar</button>
      </div>
    </div>
  \`).join('')}</div>\`
}

function populateBotSelects(bots) {
  const opts = bots.map(b => \`<option value="\${b.id}">\${b.emoji||'🤖'} \${b.name}</option>\`).join('')
  const ids = ['dash-bot','learn-bot-id','clone-parent-id','crawl-bot']
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = opts })
  const kbFilter = document.getElementById('kb-bot-filter')
  if (kbFilter) kbFilter.innerHTML = '<option value="">Todos</option>' + opts
}

function selectBot(id) {
  const bot = state.allBotIds.find(b => b.id === id)
  if (!bot) return
  state.currentBot = bot
  state.chatHistory = []
  document.querySelectorAll('.bot-item').forEach(b => b.classList.remove('active'))
  document.getElementById('bitem-' + id)?.classList.add('active')
  document.getElementById('chat-bot-emoji').textContent = bot.emoji || '🤖'
  document.getElementById('chat-bot-name').textContent  = bot.name
  document.getElementById('chat-bot-desc').textContent  = bot.description || ''
  document.getElementById('chat-send-btn').disabled = false
  clearChat(true)
  addMsg('bot', \`Olá! Sou o **\${bot.name}** \${bot.emoji||''}. \${bot.description||''}\\n\\nComo posso ajudar? Tenho acesso a APIs gratuitas e à base de conhecimento acumulada.\`)
}

function selectBotAndChat(id) {
  showPanel('chat', document.querySelectorAll('.nav-item')[1])
  selectBot(id)
}

function prepClone(parentId) {
  document.getElementById('clone-parent-id').value = parentId
  showCloneModal()
}

// ═══════════════════════════════════════════════════════
// CHAT
// ═══════════════════════════════════════════════════════
function addMsg(role, content, extra = '') {
  const msgs = document.getElementById('chat-messages')
  // Remover empty state
  const empty = msgs.querySelector('.empty')
  if (empty) empty.remove()
  const avatar = role === 'user' ? '<i class="fas fa-user"></i>' : (state.currentBot?.emoji || '🤖')
  const div = document.createElement('div')
  div.className = \`msg \${role}\`
  div.innerHTML = \`<div class="msg-avatar">\${avatar}</div><div><div class="msg-bubble">\${mdToHtml(content)}</div>\${extra}</div>\`
  msgs.appendChild(div)
  msgs.scrollTop = msgs.scrollHeight
  return div
}

function mdToHtml(text) {
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/\`(.+?)\`/g,'<code style="background:var(--bg4);padding:1px 4px;border-radius:3px;font-family:monospace">$1</code>')
    .replace(/### (.+)/g,'<div style="font-weight:700;font-size:14px;margin-top:8px">$1</div>')
    .replace(/## (.+)/g,'<div style="font-weight:700;font-size:15px;margin-top:10px">$1</div>')
    .replace(/# (.+)/g,'<div style="font-weight:700;font-size:16px;margin-top:10px">$1</div>')
    .replace(/^- (.+)/gm,'<div style="padding-left:12px">• $1</div>')
    .replace(/\n/g,'<br>')
}

function clearChat(keepBotMsg = false) {
  const msgs = document.getElementById('chat-messages')
  msgs.innerHTML = ''
  state.chatHistory = []
}

async function chatSend() {
  const input = document.getElementById('chat-input')
  const msg   = input.value.trim()
  if (!msg || !state.currentBot) return
  input.value = ''; input.style.height = 'auto'

  addMsg('user', msg)
  state.chatHistory.push({ role: 'user', content: msg })

  // Typing indicator
  const msgs = document.getElementById('chat-messages')
  const typing = document.createElement('div')
  typing.className = 'msg bot'
  typing.innerHTML = \`<div class="msg-avatar">\${state.currentBot.emoji||'🤖'}</div><div class="msg-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>\`
  msgs.appendChild(typing)
  msgs.scrollTop = msgs.scrollHeight

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, bot_id: state.currentBot.id, history: state.chatHistory.slice(-6) })
    })
    typing.remove()

    const botDiv = addMsg('bot', '')
    const bubble = botDiv.querySelector('.msg-bubble')
    let full = ''
    const reader = res.body.getReader(); const dec = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = dec.decode(value, { stream: true })
      for (const line of chunk.split('\\n')) {
        if (!line.startsWith('data:')) continue
        const d = line.slice(5).trim()
        if (d === '[DONE]') break
        try { const obj = JSON.parse(d); full += obj.response || '' } catch {}
      }
      bubble.innerHTML = mdToHtml(full || '…')
      msgs.scrollTop = msgs.scrollHeight
    }
    state.chatHistory.push({ role: 'assistant', content: full })
  } catch(e) {
    typing.remove()
    addMsg('bot', '❌ Erro ao contatar o bot. Tente novamente.')
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const inp = document.getElementById('chat-input')
  if (inp) inp.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); chatSend() }
    setTimeout(() => { inp.style.height = 'auto'; inp.style.height = Math.min(inp.scrollHeight, 120) + 'px' }, 0)
  })
})

// ═══════════════════════════════════════════════════════
// BUSCA DASHBOARD
// ═══════════════════════════════════════════════════════
async function dashSearch() {
  const query  = document.getElementById('dash-search').value.trim()
  const bot_id = document.getElementById('dash-bot').value
  if (!query) return
  const res = document.getElementById('dash-result')
  res.innerHTML = '<div class="empty"><i class="fas fa-spinner spin"></i><div>Buscando (cache-first)…</div></div>'
  try {
    const { data } = await axios.post('/api/search', { query, bot_id, save: true })
    const icon = data.cache_hit ? '⚡ Cache Hit!' : '🤖 Resposta da IA'
    const src  = data.source === 'cache' ? 'cache' : data.source === 'knowledge_base' ? 'knowledge_base' : 'ai'
    const srcBadge = { cache: 'badge-green', knowledge_base: 'badge-blue', ai: 'badge-yellow' }[src] || 'badge-purple'
    const srcLabel = { cache: '⚡ Cache Local', knowledge_base: '🧠 Knowledge Base', ai: '🤖 IA (salvo)' }[src]
    res.innerHTML = \`
      <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap">
        <span class="badge \${srcBadge}">\${srcLabel}</span>
        <span class="badge badge-purple">⏱ \${data.duration_ms}ms</span>
        \${data.hit_count?\`<span class="badge badge-green">Usado \${data.hit_count}× do cache</span>\`:''}
      </div>
      <div class="kb-item">\${mdToHtml(data.response)}</div>
      \${data.related_apis?.length?\`<div style="font-size:12px;color:var(--accent2);margin-top:8px"><i class="fas fa-plug"></i> APIs usadas: \${data.related_apis.map(a=>a.name).join(', ')}</div>\`:''}
    \`
    loadStatus()
  } catch(e) { res.innerHTML = '<div class="empty"><i class="fas fa-exclamation-triangle"></i><div>Erro na busca</div></div>' }
}

// ═══════════════════════════════════════════════════════
// STATS / DASHBOARD
// ═══════════════════════════════════════════════════════
async function loadStats() {
  try {
    const { data } = await axios.get('/api/stats')
    // Top cache
    const tc = document.getElementById('top-cache-list')
    if (data.top_cached.length) {
      tc.innerHTML = data.top_cached.map(c => \`<div class="cache-item">
        <div class="cache-query">\${c.query_text}</div>
        <div class="cache-meta"><span>Source: \${c.source}</span><span>🔄 \${c.hit_count} hits</span><span>\${c.created_at?.slice(0,10)}</span></div>
      </div>\`).join('')
    } else tc.innerHTML = '<div class="empty"><i class="fas fa-database"></i><div>Cache ainda vazio</div></div>'
    // Top KB
    const tkb = document.getElementById('top-kb-list')
    if (data.top_knowledge.length) {
      tkb.innerHTML = data.top_knowledge.map(k => \`<div class="kb-item" style="margin-bottom:6px">
        <div class="kb-topic">\${k.topic}</div>
        <div class="kb-meta"><span class="badge badge-blue">\${k.category}</span><span>Usado \${k.used_count||0}×</span><span>Conf: \${Math.round((k.confidence||0)*100)}%</span></div>
      </div>\`).join('')
    } else tkb.innerHTML = '<div class="empty"><i class="fas fa-brain"></i><div>Conhecimento ainda vazio</div></div>'
    // Activity
    const act = document.getElementById('activity-list')
    if (data.recent_activity.length) {
      act.innerHTML = \`<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">
        <tr style="color:var(--text2);border-bottom:1px solid var(--border)"><th style="padding:6px;text-align:left">Bot</th><th>Ação</th><th>Query</th><th>Cache?</th><th>Quando</th></tr>
        \${data.recent_activity.map(a => \`<tr style="border-bottom:1px solid var(--border)">
          <td style="padding:6px">\${a.bot_id||'-'}</td>
          <td><span class="badge badge-blue">\${a.action}</span></td>
          <td>\${(a.query||'').slice(0,40)}</td>
          <td>\${a.cache_hit?'<span class="badge badge-green">✓ Hit</span>':'<span class="badge badge-yellow">Miss</span>'}</td>
          <td style="color:var(--text2)">\${a.created_at?.slice(11,19)||''}</td>
        </tr>\`).join('')}
      </table></div>\`
    } else act.innerHTML = '<div class="empty"><i class="fas fa-history"></i><div>Sem atividade ainda</div></div>'
  } catch(e) { console.error(e) }
}

// ═══════════════════════════════════════════════════════
// KNOWLEDGE BASE
// ═══════════════════════════════════════════════════════
async function loadKnowledge() {
  const botId  = document.getElementById('kb-bot-filter')?.value || ''
  const search = document.getElementById('kb-search')?.value || ''
  const params = new URLSearchParams({ limit: '30' })
  if (botId)  params.set('bot_id', botId)
  if (search) params.set('q', search)
  const { data } = await axios.get('/api/knowledge?' + params)
  const el = document.getElementById('kb-list')
  if (!data.knowledge.length) { el.innerHTML = '<div class="empty"><i class="fas fa-brain"></i><div>Nenhum conhecimento encontrado</div></div>'; return }
  el.innerHTML = data.knowledge.map(k => \`<div class="kb-item">
    <div class="kb-topic">\${k.topic}</div>
    <div class="kb-meta">
      <span class="badge badge-blue">\${k.category}</span>
      <span class="badge badge-purple">\${k.bot_id}</span>
      <span class="badge badge-yellow">Confiança \${Math.round((k.confidence||0)*100)}%</span>
      <span class="badge badge-green">Usado \${k.used_count||0}×</span>
      <span style="color:var(--text2)">\${k.created_at?.slice(0,10)}</span>
    </div>
    <div class="kb-content">\${(k.content||'').slice(0,300)}\${k.content?.length>300?'…':''}</div>
  </div>\`).join('')
}

// ═══════════════════════════════════════════════════════
// CACHE
// ═══════════════════════════════════════════════════════
async function loadCache() {
  const src = document.getElementById('cache-search')?.value || ''
  const params = new URLSearchParams({ limit: '30' })
  if (src) params.set('source', src)
  const { data } = await axios.get('/api/cache?' + params)
  const s = data.stats
  if (s) {
    document.getElementById('cs-total').textContent  = s.total || 0
    document.getElementById('cs-hits').textContent   = s.total_hits || 0
    document.getElementById('cs-tokens').textContent = s.tokens_saved || 0
    const pct = s.total > 0 ? Math.round((s.total_hits / (s.total_hits + s.total)) * 100) : 0
    document.getElementById('cs-economy').textContent = pct + '%'
  }
  const el = document.getElementById('cache-list')
  if (!data.cache.length) { el.innerHTML = '<div class="empty"><i class="fas fa-database"></i><div>Cache vazio — faça buscas para popular</div></div>'; return }
  el.innerHTML = data.cache.map(c => \`<div class="cache-item">
    <div class="cache-query">\${c.query_text}</div>
    <div class="cache-meta">
      <span class="badge badge-blue">\${c.source}</span>
      <span class="badge badge-green">🔄 \${c.hit_count} hits</span>
      <span class="badge badge-yellow">\${c.response_type}</span>
      <span style="color:var(--text2)">\${c.created_at?.slice(0,10)}</span>
    </div>
  </div>\`).join('')
}

// ═══════════════════════════════════════════════════════
// LEARN MODAL
// ═══════════════════════════════════════════════════════
function showLearnModal() {
  document.getElementById('learn-modal').style.display = 'flex'
}
async function submitLearn() {
  const bot_id   = document.getElementById('learn-bot-id').value
  const topic    = document.getElementById('learn-topic').value.trim()
  const category = document.getElementById('learn-category').value.trim()
  const content  = document.getElementById('learn-content').value.trim()
  const source   = document.getElementById('learn-source').value.trim()
  const kws      = document.getElementById('learn-keywords').value.split(',').map(k=>k.trim()).filter(Boolean)
  if (!topic || !category || !content) { alert('Preencha tópico, categoria e conteúdo'); return }
  try {
    await axios.post(\`/api/bots/\${bot_id}/learn\`, { topic, category, content, source_url: source, keywords: kws })
    closeModal('learn-modal')
    loadKnowledge(); loadStatus()
    alert('✅ Conhecimento salvo!')
  } catch(e) { alert('Erro ao salvar: ' + e.message) }
}

// ═══════════════════════════════════════════════════════
// CLONE MODAL
// ═══════════════════════════════════════════════════════
function showCloneModal() {
  document.getElementById('clone-modal').style.display = 'flex'
}
async function submitClone() {
  const parent_id     = document.getElementById('clone-parent-id').value
  const new_name      = document.getElementById('clone-name').value.trim()
  const specialization = document.getElementById('clone-spec').value.trim()
  if (!new_name) { alert('Digite o nome do novo bot'); return }
  try {
    const { data } = await axios.post('/api/bots/clone', { parent_id, new_name, specialization })
    closeModal('clone-modal')
    loadBots(); loadStatus()
    alert(\`✅ Bot clonado! ID: \${data.bot_id}\\n🧠 \${data.knowledge_copied} itens de conhecimento copiados\`)
  } catch(e) { alert('Erro ao clonar: ' + e.message) }
}

// ═══════════════════════════════════════════════════════
// CRAWL
// ═══════════════════════════════════════════════════════
function setCrawlUrl(url) {
  document.getElementById('crawl-url').value = url
  document.getElementById('panel-crawl').scrollIntoView()
}
async function doCrawl() {
  const url    = document.getElementById('crawl-url').value.trim()
  const bot_id = document.getElementById('crawl-bot').value
  const cat    = document.getElementById('crawl-cat').value
  const res    = document.getElementById('crawl-result')
  if (!url) { alert('Insira uma URL'); return }
  res.innerHTML = '<div class="empty"><i class="fas fa-spinner spin"></i><div>Crawleando e extraindo conhecimento…</div></div>'
  try {
    const { data } = await axios.post('/api/crawl', { url, bot_id, category: cat, auto_save: true })
    res.innerHTML = \`<div class="card">
      <div class="card-title" style="color:var(--green)"><i class="fas fa-check-circle"></i> Conhecimento Extraído!</div>
      <div style="font-size:13px"><strong>Tópico:</strong> \${data.knowledge.topic||url}</div>
      <div style="font-size:12px;color:var(--text2);margin-top:6px">\${data.knowledge.summary||''}</div>
      \${data.knowledge.key_facts?.length?\`<div style="margin-top:8px"><strong style="font-size:12px">Fatos extraídos:</strong><ul style="font-size:12px;color:var(--text2);padding-left:16px">\${data.knowledge.key_facts.map(f=>\`<li>\${f}</li>\`).join('')}</ul></div>\`:''}
      <div style="margin-top:8px;font-size:11px;color:var(--text2)">📖 \${data.chars_read} caracteres lidos · 🧠 Salvo na Knowledge Base (ID \${data.knowledge_id||'?'})</div>
    </div>\`
    loadKnowledge(); loadStatus()
  } catch(e) { res.innerHTML = \`<div class="empty"><i class="fas fa-exclamation-triangle"></i><div>Erro: \${e.response?.data?.error||e.message}</div></div>\` }
}

// ═══════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════
function closeModal(id) { document.getElementById(id).style.display = 'none' }
document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', e => { if (e.target === m) m.style.display = 'none' }))

// INIT
init()
</script>
</body>
</html>`

export default app
