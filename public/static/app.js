// SixTech MAS v3.0 — Frontend App
// Estado global
let allAgents = [], models = [], chatHistory = []
let _activeAgentId = null          // agente aberto no painel direito
let _inlineSessions = {}           // agentId -> { history, streaming }

// ════════════════════════════════════════════════════════════
// AUTH — Login / Logout
// ════════════════════════════════════════════════════════════
async function checkAuth() {
  try {
    const res = await fetch('/api/me')
    if (res.ok) {
      const data = await res.json()
      if (data.ok) { _showApp(data.user); return }
    }
  } catch {}
  _showLogin()
}

function _showLogin() {
  const overlay = document.getElementById('login-overlay')
  if (overlay) overlay.classList.remove('hidden')
  setTimeout(() => {
    const u = document.getElementById('l-user')
    if (u) u.focus()
  }, 80)
}

function _showApp(user) {
  const overlay = document.getElementById('login-overlay')
  if (overlay) overlay.classList.add('hidden')
  // Mostrar nome do usuário e botão sair no header
  const hdrUser = document.getElementById('hdr-user')
  const hdrUsername = document.getElementById('hdr-username')
  const logoutBtn = document.getElementById('logout-btn')
  if (hdrUser)     { hdrUser.style.display = 'flex' }
  if (hdrUsername) { hdrUsername.textContent = user }
  if (logoutBtn)   { logoutBtn.style.display = 'flex' }
  // Inicializar app
  init()
}

async function doLogin() {
  const userEl  = document.getElementById('l-user')
  const passEl  = document.getElementById('l-pass')
  const btn     = document.getElementById('login-btn')
  const errEl   = document.getElementById('login-error')

  const username = userEl?.value.trim()
  const password = passEl?.value

  if (!username || !password) {
    _loginError('Preencha usuário e senha')
    return
  }

  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:8px"></i>Entrando...' }
  if (errEl) errEl.style.display = 'none'

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (data.ok) {
      if (passEl) passEl.value = ''
      _showApp(data.user)
    } else {
      _loginError(data.error || 'Usuário ou senha incorretos')
    }
  } catch (e) {
    _loginError('Erro de conexão. Tente novamente.')
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-sign-in-alt" style="margin-right:8px"></i>Entrar' }
  }
}

function _loginError(msg) {
  const errEl = document.getElementById('login-error')
  if (errEl) { errEl.textContent = msg; errEl.style.display = 'block' }
  const passEl = document.getElementById('l-pass')
  if (passEl) { passEl.value = ''; passEl.focus() }
}

async function doLogout() {
  try { await fetch('/api/logout', { method: 'POST' }) } catch {}
  // Ocultar app, mostrar login
  const hdrUser   = document.getElementById('hdr-user')
  const logoutBtn = document.getElementById('logout-btn')
  if (hdrUser)   hdrUser.style.display = 'none'
  if (logoutBtn) logoutBtn.style.display = 'none'
  // Reset estado
  allAgents = []; models = []; chatHistory = []
  _activeAgentId = null; _inlineSessions = {}
  // Limpar tela
  const cats = document.getElementById('sidebar-categories')
  if (cats) cats.innerHTML = ''
  const catsGrid = document.getElementById('cats-grid')
  if (catsGrid) catsGrid.innerHTML = ''
  showHome(null)
  _showLogin()
}

// ── Categorias: ícone e cor
const CAT_META = {
  'Orquestração':   { icon: '🎯', color: '#22D3EE' },
  'Administrativo': { icon: '🏢', color: '#6C63FF' },
  'Financeiro':     { icon: '💰', color: '#F59E0B' },
  'Crédito':        { icon: '🏦', color: '#3B82F6' },
  'Seguros':        { icon: '🛡️', color: '#0EA5E9' },
  'Jurídico':       { icon: '⚖️', color: '#D97706' },
  'Afiliados':      { icon: '🤝', color: '#7C3AED' },
  'Marketing':      { icon: '📢', color: '#EC4899' },
  'Comercial':      { icon: '📞', color: '#059669' },
  'Imobiliário':    { icon: '🏠', color: '#0891B2' },
  'RH':             { icon: '👥', color: '#7C3AED' },
  'Saúde':          { icon: '🏥', color: '#EF4444' },
  'Automotivo':     { icon: '🚗', color: '#6366F1' },
  'Logística':      { icon: '🚚', color: '#78350F' },
  'Turismo':        { icon: '🌍', color: '#0284C7' },
  'Educação':       { icon: '📚', color: '#16A34A' },
  'Tecnologia':     { icon: '💻', color: '#F87171' },
  'Indústria':      { icon: '🏭', color: '#92400E' },
  'Agronegócio':    { icon: '🌾', color: '#65A30D' },
  'Governo':        { icon: '🏛️', color: '#1D4ED8' },
  'Criativo':       { icon: '🎨', color: '#BE185D' },
  'Diretoria':      { icon: '👑', color: '#92400E' },
}

// Perguntas rápidas por categoria
const QUICK_QUESTIONS = {
  'Financeiro':     ['Faça um DRE simples', 'Analise fluxo de caixa', 'Monte um budget mensal'],
  'Crédito':        ['Analise perfil de crédito', 'Crie régua de cobrança', 'Calcule score de risco'],
  'Jurídico':       ['Revise este contrato', 'Explique a LGPD', 'Crie NDA simples'],
  'Marketing':      ['Crie post para Instagram', 'Escreva e-mail marketing', 'Gere 5 ideias de conteúdo'],
  'Comercial':      ['Crie script de vendas', 'Responda objeção de preço', 'Monte proposta comercial'],
  'Tecnologia':     ['Crie uma API REST', 'Revise este código', 'Explique microserviços'],
  'RH':             ['Crie job description', 'Monte roteiro de entrevista', 'Elabore um PDI'],
  'Administrativo': ['Escreva e-mail formal', 'Crie ata de reunião', 'Monte agenda executiva'],
  'Orquestração':   ['Analise esta tarefa', 'Faça análise SWOT', 'Revise esta entrega'],
  'Diretoria':      ['Monte estratégia de negócio', 'Analise M&A', 'Crie plano de 90 dias'],
  'Criativo':       ['Crie um slogan', 'Escreva roteiro de vídeo', 'Gere copy persuasivo'],
  'Saúde':          ['Explique gestão hospitalar', 'Crie protocolo de atendimento', 'Indicadores de saúde'],
  'Educação':       ['Crie plano de aula', 'Monte trilha de aprendizado', 'Alinhe à BNCC'],
  'Logística':      ['Otimize rota de entrega', 'Analise supply chain', 'KPIs logísticos'],
  'Imobiliário':    ['Avalie este imóvel', 'Explique financiamento', 'Documentação necessária'],
  'Automotivo':     ['Compare veículos', 'Explique consórcio', 'Calcule financiamento'],
  'Agronegócio':    ['Gestão de safra', 'Crédito rural disponível', 'Rastreabilidade de produto'],
  'Governo':        ['Explique licitação', 'Prepare edital', 'Lei 14.133 na prática'],
  'Turismo':        ['Monte roteiro de viagem', 'Documentos necessários', 'Pacotes econômicos'],
  'Indústria':      ['Aplique Lean Manufacturing', 'Calcule OEE', 'Gestão ISO 9001'],
  'Seguros':        ['Compare coberturas', 'Como acionar sinistro', 'Seguro ideal para empresa'],
  'Afiliados':      ['Estruture comissões', 'Recrute afiliados', 'Métricas de performance'],
}

// ── Inicialização
async function init() {
  try {
    const [agentsRes, modelsRes] = await Promise.all([
      fetch('/api/agents'), fetch('/api/models')
    ])
    allAgents = (await agentsRes.json()).agents
    models    = (await modelsRes.json()).models

    renderSidebarCategories()
    renderHomeCats()
    renderChatModels()
    loadStatus()

    const sbA = document.getElementById('sb-agents')
    if (sbA) sbA.textContent = allAgents.length
  } catch(e) {
    console.error('Init error:', e)
  }
}

// ════════════════════════════════════════════════════════════
// SIDEBAR — accordion com sub-agentes + clique abre chat full
// ════════════════════════════════════════════════════════════
function renderSidebarCategories() {
  const container = document.getElementById('sidebar-categories')
  if (!container) return

  // Agrupar por categoria respeitando ordem do CAT_META
  const groups = {}
  for (const cat of Object.keys(CAT_META)) {
    const list = allAgents.filter(a => a.category === cat)
    if (list.length > 0) groups[cat] = list
  }
  for (const a of allAgents) {
    if (!groups[a.category]) groups[a.category] = allAgents.filter(x => x.category === a.category)
  }

  container.innerHTML = Object.entries(groups).map(([cat, list]) => {
    const meta = CAT_META[cat] || { icon: '🤖', color: '#6C63FF' }

    // Sub-itens dos agentes
    const items = list.map(a => `
      <div class="sb-agent-item" data-agent-id="${a.id}">
        <span class="sb-ag-emoji">${a.emoji}</span>
        <span class="sb-ag-name">${a.name}</span>
        <span class="sb-ag-badge ${a.source === 'hybrid' ? 'badge-hybrid' : 'badge-cf'}">${a.source === 'hybrid' ? '⚡' : '☁️'}</span>
      </div>`
    ).join('')

    return `
      <div class="sb-cat-group">
        <div class="sb-cat-header" data-cat="${encodeURIComponent(cat)}">
          <span class="sb-cat-icon" style="background:${meta.color}22">${meta.icon}</span>
          <span class="sb-cat-name">${cat}</span>
          <span class="sb-cat-count">${list.length}</span>
          <span class="sb-cat-arrow">›</span>
        </div>
        <div class="sb-cat-agents">
          ${items}
        </div>
      </div>`
  }).join('')

  // Delegação: clique no header expande; clique no item abre chat full
  container.addEventListener('click', function(e) {
    // ── header: toggle accordion
    const hdr = e.target.closest('.sb-cat-header')
    if (hdr) {
      e.stopPropagation()
      const cat = decodeURIComponent(hdr.dataset.cat)
      _toggleSidebarCat(hdr, cat)
      return
    }
    // ── item: abrir chat full-screen
    const item = e.target.closest('.sb-agent-item')
    if (item) {
      e.stopPropagation()
      const id = item.dataset.agentId
      openAgentFullChat(id, item)
    }
  })
}

// Toggle accordion da categoria na sidebar
function _toggleSidebarCat(hdrEl, cat) {
  const agentsEl = hdrEl.nextElementSibling  // .sb-cat-agents
  const isOpen = agentsEl.classList.contains('open')

  // Fechar todos
  document.querySelectorAll('.sb-cat-agents').forEach(el => el.classList.remove('open'))
  document.querySelectorAll('.sb-cat-header').forEach(el => el.classList.remove('open'))

  if (!isOpen) {
    agentsEl.classList.add('open')
    hdrEl.classList.add('open')
  }
}

// ════════════════════════════════════════════════════════════
// CHAT FULL-SCREEN — ocupa toda a área direita
// ════════════════════════════════════════════════════════════
function openAgentFullChat(id, sidebarItemEl) {
  const agent = allAgents.find(a => a.id === id)
  if (!agent) return
  _activeAgentId = id

  // Marcar item ativo na sidebar
  document.querySelectorAll('.sb-agent-item').forEach(el => el.classList.remove('active'))
  if (sidebarItemEl) sidebarItemEl.classList.add('active')
  else {
    const el = document.querySelector(`.sb-agent-item[data-agent-id="${id}"]`)
    if (el) el.classList.add('active')
  }

  // Ativar painel de chat full-screen
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
  const panel = document.getElementById('tab-agent-chat')
  if (panel) panel.classList.add('active')

  // Garantir sessão
  if (!_inlineSessions[id]) _inlineSessions[id] = { history: [], streaming: false }

  // Preencher header
  const meta = CAT_META[agent.category] || { color: '#6C63FF' }
  const iconEl = document.getElementById('fc-agent-icon')
  const nameEl = document.getElementById('fc-agent-name')
  const subEl  = document.getElementById('fc-agent-sub')
  const capsEl = document.getElementById('fc-agent-caps')

  if (iconEl) { iconEl.textContent = agent.emoji; iconEl.style.background = agent.color + '33' }
  if (nameEl) nameEl.textContent = agent.name
  if (subEl)  subEl.textContent  = agent.category + ' · ' + (agent.model || '').split('/').pop()
  if (capsEl) capsEl.innerHTML   = (agent.capabilities || []).map(c => `<span class="cap-pill">${c}</span>`).join('')

  // Perguntas rápidas
  const qq = QUICK_QUESTIONS[agent.category] || QUICK_QUESTIONS['Orquestração'] || []
  const quickEl = document.getElementById('fc-quick')
  if (quickEl) {
    quickEl.innerHTML = qq.map(q =>
      `<button class="fc-qbtn" data-agent-id="${id}" data-q="${escHtml(q)}">${q}</button>`
    ).join('')
  }

  // Mensagens: recarregar histórico ou boas-vindas
  const msgsEl = document.getElementById('fc-msgs')
  if (msgsEl) {
    if (_inlineSessions[id].history.length === 0) {
      msgsEl.innerHTML = `
        <div class="fc-msg ai">
          <div class="fc-mn ai">${agent.emoji} ${agent.name}</div>
          <div>Olá! Sou o <strong>${agent.name}</strong>. ${agent.desc}<br><br>Como posso ajudar você hoje?</div>
        </div>`
    }
    msgsEl.scrollTop = msgsEl.scrollHeight
  }

  // Limpar input
  const inputEl = document.getElementById('fc-input')
  if (inputEl) { inputEl.value = ''; setTimeout(() => inputEl.focus(), 80) }

  // Resetar para aba Chat ao trocar de agente
  const chatTab = document.querySelector('.fc-tab[data-tab="chat"]')
  switchFcTab('chat', chatTab)

  // Inicializar tipos de documento para este agente
  initDocTypes()

  // Resetar doc/análise
  clearDocument()
  clearUpload()

  // Fechar sidebar no mobile
  if (window.innerWidth <= 540) {
    const s = document.getElementById('sidebar')
    const o = document.getElementById('sidebar-overlay')
    if (s && !s.classList.contains('collapsed')) {
      s.classList.add('collapsed')
      if (o) o.style.display = 'none'
    }
  }
}

// Enviar mensagem no chat full-screen
async function fcSend() {
  const id = _activeAgentId
  if (!id) return
  const session = _inlineSessions[id]
  if (!session || session.streaming) return

  const input = document.getElementById('fc-input')
  const msg = input ? input.value.trim() : ''
  if (!msg) return

  input.value = ''
  const agent = allAgents.find(a => a.id === id)
  if (!agent) return

  const msgsEl  = document.getElementById('fc-msgs')
  const typingEl = document.getElementById('fc-typing')
  const sendBtn  = document.getElementById('fc-send-btn')

  _fcAppendMsg('user', escHtml(msg), '👤 Você')
  session.history.push({ role: 'user', content: msg })

  session.streaming = true
  if (sendBtn) sendBtn.disabled = true
  if (typingEl) typingEl.style.display = 'flex'

  // Div da resposta streaming
  const aiEl = document.createElement('div')
  aiEl.className = 'fc-msg ai'
  aiEl.innerHTML = `<div class="fc-mn ai">${agent.emoji} ${agent.name}</div><div class="fc-stream"></div>`
  msgsEl.appendChild(aiEl)
  const streamDiv = aiEl.querySelector('.fc-stream')
  msgsEl.scrollTop = msgsEl.scrollHeight

  let fullText = ''

  try {
    const sysMsg = { role: 'system', content: agent.system || ('Você é ' + agent.name + '. Responda em português.') }
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [sysMsg, ...session.history], model: agent.model })
    })

    if (typingEl) typingEl.style.display = 'none'

    if (res.body) {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n\n')
        buffer = parts.pop() || ''
        for (const part of parts) {
          for (const line of part.split('\n')) {
            if (!line.startsWith('data:')) continue
            const data = line.slice(5).trim()
            if (data === '[DONE]') continue
            try {
              const json = JSON.parse(data)
              const chunk = json.response || (json.choices?.[0]?.delta?.content) || ''
              if (chunk) {
                fullText += chunk
                streamDiv.innerHTML = mdToHtml(fullText) +
                  '<span style="display:inline-block;width:2px;height:1em;background:var(--secondary);animation:blink .7s infinite;vertical-align:text-bottom;margin-left:2px"></span>'
                msgsEl.scrollTop = msgsEl.scrollHeight
              }
            } catch {}
          }
        }
      }
      streamDiv.innerHTML = mdToHtml(fullText)
    } else {
      const data = await res.json()
      fullText = data.response || data.content || 'Sem resposta'
      if (typingEl) typingEl.style.display = 'none'
      streamDiv.innerHTML = mdToHtml(fullText)
    }
  } catch (err) {
    if (typingEl) typingEl.style.display = 'none'
    streamDiv.innerHTML = `<span style="color:#F87171">❌ Erro: ${escHtml(err.message)}</span>`
  }

  session.history.push({ role: 'assistant', content: fullText })
  msgsEl.scrollTop = msgsEl.scrollHeight
  session.streaming = false
  if (sendBtn) sendBtn.disabled = false
  if (input) input.focus()
}

function _fcAppendMsg(role, html, name) {
  const msgsEl = document.getElementById('fc-msgs')
  if (!msgsEl) return
  const el = document.createElement('div')
  el.className = 'fc-msg ' + role
  el.innerHTML = `<div class="fc-mn ${role}">${name}</div><div>${html}</div>`
  msgsEl.appendChild(el)
  msgsEl.scrollTop = msgsEl.scrollHeight
}

// Limpar conversa do agente ativo
function fcClear() {
  if (!_activeAgentId) return
  _inlineSessions[_activeAgentId] = { history: [], streaming: false }
  const agent = allAgents.find(a => a.id === _activeAgentId)
  const msgsEl = document.getElementById('fc-msgs')
  if (msgsEl && agent) {
    msgsEl.innerHTML = `
      <div class="fc-msg ai">
        <div class="fc-mn ai">${agent.emoji} ${agent.name}</div>
        <div>Conversa reiniciada. Como posso ajudar?</div>
      </div>`
  }
}

// ════════════════════════════════════════════════════════════
// HOME — grid de categorias
// ════════════════════════════════════════════════════════════
function renderHomeCats() {
  const grid = document.getElementById('cats-grid')
  if (!grid) return

  const groups = {}
  for (const cat of Object.keys(CAT_META)) {
    const list = allAgents.filter(a => a.category === cat)
    if (list.length > 0) groups[cat] = list
  }

  grid.innerHTML = Object.entries(groups).map(([cat, list]) => {
    const meta = CAT_META[cat] || { icon: '🤖', color: '#6C63FF' }
    return `
      <div class="cat-card anim-in" data-cat="${encodeURIComponent(cat)}">
        <div class="cat-card-icon" style="background:${meta.color}22">${meta.icon}</div>
        <div class="cat-card-name">${cat}</div>
        <div class="cat-card-count">${list.length} agente${list.length !== 1 ? 's' : ''}</div>
      </div>`
  }).join('')

  grid.addEventListener('click', function(e) {
    const card = e.target.closest('.cat-card')
    if (card) {
      const cat = decodeURIComponent(card.dataset.cat)
      // Expandir na sidebar e navegar para tela de agentes
      const hdr = document.querySelector(`.sb-cat-header[data-cat="${encodeURIComponent(cat)}"]`)
      if (hdr) _toggleSidebarCat(hdr, cat)
      openCategoryScreen(cat)
    }
  })
}

// ── Tela de agentes da categoria (grid de cards)
function openCategoryScreen(cat) {
  const meta = CAT_META[cat] || { icon: '🤖', color: '#6C63FF' }
  const list = allAgents.filter(a => a.category === cat)

  document.getElementById('agents-screen-icon').textContent = meta.icon
  document.getElementById('agents-screen-icon').style.background = meta.color + '22'
  document.getElementById('agents-screen-title').textContent = cat
  document.getElementById('agents-screen-sub').textContent =
    `${list.length} agente${list.length !== 1 ? 's' : ''} especializados disponíveis`

  const searchEl = document.getElementById('agent-search')
  if (searchEl) searchEl.value = ''

  renderAgentsGrid(list)

  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
  document.getElementById('tab-agents').classList.add('active')
}

// ── Render grid de agentes (cards clicáveis → abre chat full)
function renderAgentsGrid(list) {
  const grid = document.getElementById('agents-grid')
  if (!grid) return
  if (!list || !list.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted)">Nenhum agente encontrado</div>'
    return
  }

  grid.innerHTML = list.map(a => `
    <div class="agent-card anim-in" onclick="openAgentFullChat('${a.id}', null)">
      <div class="agent-card-top">
        <div class="agent-card-hdr">
          <div class="agent-icon" style="background:${a.color}33">${a.emoji}</div>
          <div style="flex:1;min-width:0">
            <div class="agent-card-name">${a.name}</div>
            <div class="agent-card-cat">${a.category}</div>
          </div>
          <span class="badge ${a.source === 'hybrid' ? 'badge-hybrid' : 'badge-cf'}">${a.source === 'hybrid' ? '⚡' : '☁️'}</span>
        </div>
        <div class="agent-card-desc">${a.desc}</div>
        <div class="caps">${(a.capabilities || []).map(c => `<span class="cap-pill">${c}</span>`).join('')}</div>
        ${a.basedOn ? `<div style="font-size:10px;color:#6B7280;margin-top:6px">📦 <span style="color:#a5b4fc">${a.basedOn}</span></div>` : ''}
      </div>
      <div class="agent-card-btn">
        <i class="fas fa-comments"></i> Conversar com ${a.name.split(' ')[0]}
      </div>
    </div>`
  ).join('')
}

// ── Filtrar agentes
function filterAgents(q) {
  const base = document.getElementById('agents-screen-title')?.textContent
  const catName = (base && base !== 'Agentes') ? base : null
  const list = catName ? allAgents.filter(a => a.category === catName) : allAgents
  const filtered = q.trim()
    ? list.filter(a =>
        a.name.toLowerCase().includes(q.toLowerCase()) ||
        a.desc.toLowerCase().includes(q.toLowerCase()) ||
        (a.capabilities || []).some(c => c.toLowerCase().includes(q.toLowerCase()))
      )
    : list
  renderAgentsGrid(filtered)
}

// ── Navegação tabs
function showHome(el) {
  _activeAgentId = null
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
  document.querySelectorAll('.sb-cat-header').forEach(h => h.classList.remove('open'))
  document.querySelectorAll('.sb-cat-agents').forEach(a => a.classList.remove('open'))
  document.querySelectorAll('.sb-agent-item').forEach(i => i.classList.remove('active'))
  document.getElementById('tab-home').classList.add('active')
  const navHome = document.getElementById('nav-home')
  if (navHome) navHome.classList.add('active')
}

function showTab(name, el) {
  _activeAgentId = null
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
  document.querySelectorAll('.sb-agent-item').forEach(i => i.classList.remove('active'))
  const panel = document.getElementById('tab-' + name)
  if (panel) panel.classList.add('active')
  if (el) el.classList.add('active')
  if (window.innerWidth <= 540) {
    const s = document.getElementById('sidebar')
    const o = document.getElementById('sidebar-overlay')
    if (s && !s.classList.contains('collapsed')) {
      s.classList.add('collapsed')
      if (o) o.style.display = 'none'
    }
  }
}

// ── Chat livre (tab Chat)
function renderChatModels() {
  const sel = document.getElementById('chat-model')
  if (!sel) return
  sel.innerHTML = models.map(m => `<option value="${m.id}">${m.label}</option>`).join('')
}

async function sendChat() {
  const input = document.getElementById('chat-input')
  const msg = input.value.trim()
  if (!msg) return
  input.value = ''

  const model = document.getElementById('chat-model')?.value || ''
  chatHistory.push({ role: 'user', content: msg })
  appendChatMsg('user', msg)
  document.getElementById('typing-indicator').style.display = ''
  document.getElementById('chat-send-btn').disabled = true

  const chatMsgs = document.getElementById('chat-messages')
  const aiEl = document.createElement('div')
  aiEl.className = 'msg msg-ai'
  aiEl.innerHTML = '<div class="msg-name ai">🤖 Assistente</div><div class="streaming-text"></div>'
  chatMsgs.appendChild(aiEl)
  const textEl = aiEl.querySelector('.streaming-text')
  chatMsgs.scrollTop = 9999

  let fullText = ''
  try {
    const res = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...chatHistory], model })
    })
    if (!res.body) throw new Error('Stream não disponível')
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      buffer = parts.pop() || ''
      for (const part of parts) {
        for (const line of part.split('\n')) {
          if (!line.startsWith('data:')) continue
          const data = line.slice(5).trim()
          if (data === '[DONE]') continue
          try {
            const json = JSON.parse(data)
            const chunk = json.response || (json.choices?.[0]?.delta?.content) || ''
            if (chunk) {
              fullText += chunk
              textEl.innerHTML = mdToHtml(fullText) + '<span class="cursor-blink"></span>'
              chatMsgs.scrollTop = 9999
            }
          } catch {}
        }
      }
    }
    textEl.innerHTML = mdToHtml(fullText)
    chatHistory.push({ role: 'assistant', content: fullText })
    updateChatHistory()
  } catch(e) {
    textEl.textContent = '❌ Erro: ' + e.message
  }

  document.getElementById('typing-indicator').style.display = 'none'
  document.getElementById('chat-send-btn').disabled = false
}

function appendChatMsg(role, text, name, emoji) {
  name = name || 'Assistente'; emoji = emoji || '🤖'
  const chatMsgs = document.getElementById('chat-messages')
  const el = document.createElement('div')
  el.className = role === 'user' ? 'msg msg-user' : 'msg msg-ai'
  if (role === 'user') {
    el.innerHTML = `<div class="msg-name user">👤 Você</div><div>${escHtml(text)}</div>`
  } else {
    el.innerHTML = `<div class="msg-name ai">${emoji} ${name}</div><div>${mdToHtml(text)}</div>`
  }
  chatMsgs.appendChild(el)
  chatMsgs.scrollTop = 9999
}

function updateChatHistory() {
  const list = document.getElementById('chat-history-list')
  if (!list) return
  const userMsgs = chatHistory.filter(m => m.role === 'user')
  if (!userMsgs.length) return
  list.innerHTML = userMsgs.slice(-5).reverse().map(m =>
    `<div style="padding:4px 6px;border-radius:6px;cursor:pointer;font-size:11px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m.content.slice(0, 35)}…</div>`
  ).join('')
}

function clearChat() {
  chatHistory = []
  const chatMsgs = document.getElementById('chat-messages')
  chatMsgs.innerHTML = `
    <div class="msg msg-ai">
      <div class="msg-name ai">🤖 Assistente SixTech</div>
      <div>Olá! Como posso ajudar?</div>
    </div>`
  const list = document.getElementById('chat-history-list')
  if (list) list.innerHTML = '<div style="text-align:center;padding:12px 0;font-size:11px;color:var(--muted)">Nenhuma conversa</div>'
}

// ── Status
async function loadStatus() {
  try {
    const res = await fetch('/api/status')
    const data = await res.json()
    const container = document.getElementById('status-details')
    if (!container) return

    const reposHtml = Object.entries(data.repos || {}).map(([name, info]) => `
      <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:10px;background:var(--bg);border:1px solid var(--border)">
        <span style="color:#34D399;margin-top:2px;font-size:8px">●</span>
        <div>
          <div style="font-size:13px;font-weight:500;color:#fff">${name}</div>
          <div style="font-size:11px;margin-top:2px;color:#6B7280">${info.type || ''}</div>
          ${info.url ? `<a href="${info.url}" target="_blank" style="font-size:11px;color:#6C63FF">${info.url}</a>` : ''}
          ${info.note ? `<div style="font-size:11px;margin-top:2px;color:#F59E0B">${info.note}</div>` : ''}
        </div>
      </div>`).join('')

    const featuresHtml = (data.features || []).map(f => `
      <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:var(--bg)">
        <i class="fas fa-check-circle" style="color:#34D399;font-size:12px"></i>
        <span style="font-size:13px;color:#fff">${f}</span>
      </div>`).join('')

    container.innerHTML = `
      <div class="card">
        <div class="card-title"><i class="fas fa-code-branch" style="color:var(--primary)"></i>Repositórios</div>
        <div style="display:flex;flex-direction:column;gap:8px">${reposHtml}</div>
      </div>
      <div class="card">
        <div class="card-title"><i class="fas fa-server" style="color:var(--secondary)"></i>Funcionalidades</div>
        <div style="display:flex;flex-direction:column;gap:6px">${featuresHtml}</div>
        <div style="margin-top:12px;padding:10px 12px;border-radius:8px;font-size:11px;background:rgba(108,99,255,.1);border:1px solid rgba(108,99,255,.3);color:#a5b4fc">
          <i class="fas fa-info-circle" style="margin-right:6px"></i>Cloudflare Pages Edge — latência global &lt; 50ms
        </div>
      </div>`

    const statAgents = document.getElementById('stat-agents')
    const statModels = document.getElementById('stat-models')
    if (statAgents) statAgents.textContent = data.agents
    if (statModels) statModels.textContent = data.models
    document.getElementById('status-text').textContent = 'Online v' + data.version
  } catch(e) {
    const el = document.getElementById('status-text')
    if (el) el.textContent = 'Verificando...'
  }
}

// ── Utils
function escHtml(t) {
  if (!t) return ''
  return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

function mdToHtml(md) {
  if (!md) return ''
  let s = String(md)
  s = s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  s = s.replace(/```(\w*)?\n?([\s\S]*?)```/g, (_,__,code) =>
    '<pre style="background:#0d0d1a;border:1px solid #2A2D40;border-radius:8px;padding:10px;overflow-x:auto;margin:6px 0"><code style="color:#e2e8f0;font-family:monospace;font-size:12px">' + code.trim() + '</code></pre>')
  s = s.replace(/`([^`]+)`/g, '<code style="background:#1e2030;padding:1px 5px;border-radius:4px;color:#f472b6;font-family:monospace">$1</code>')
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:white">$1</strong>')
  s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
  s = s.replace(/^### (.+)$/gm, '<h3 style="color:#22D3EE;font-size:.9rem;font-weight:600;margin:10px 0 4px">$1</h3>')
  s = s.replace(/^## (.+)$/gm, '<h2 style="color:#a5b4fc;font-size:1rem;font-weight:700;margin:12px 0 6px">$1</h2>')
  s = s.replace(/^# (.+)$/gm, '<h1 style="color:white;font-size:1.1rem;font-weight:800;margin:12px 0 6px">$1</h1>')
  s = s.replace(/^[-*] (.+)$/gm, '<li style="margin:2px 0;padding-left:4px">• $1</li>')
  s = s.replace(/^(\d+)\. (.+)$/gm, '<li style="margin:2px 0;padding-left:4px">$1. $2</li>')
  s = s.replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #6C63FF;padding-left:10px;color:#9CA3AF;margin:6px 0">$1</blockquote>')
  s = s.replace(/\n/g, '<br>')
  return s
}

// Inicializar quando DOM pronto — verifica sessão antes de mostrar o app
document.addEventListener('DOMContentLoaded', checkAuth)

// ════════════════════════════════════════════════════════════
// ABAS DO AGENTE (Chat / Gerar Documento / Analisar)
// ════════════════════════════════════════════════════════════
function switchFcTab(tab, el) {
  document.querySelectorAll('.fc-tab').forEach(t => t.classList.remove('active'))
  document.querySelectorAll('.fc-tab-panel').forEach(p => p.classList.remove('active'))
  if (el) el.classList.add('active')
  const panel = document.getElementById('fc-panel-' + tab)
  if (panel) panel.classList.add('active')

  // Ajustar botão "Limpar" conforme aba
  const clearBtn = document.getElementById('fc-clear-btn')
  if (clearBtn) {
    if (tab === 'chat') { clearBtn.style.display = 'flex'; clearBtn.onclick = fcClear }
    else if (tab === 'doc') { clearBtn.style.display = 'flex'; clearBtn.onclick = clearDocument }
    else { clearBtn.style.display = 'none' }
  }
}

// ════════════════════════════════════════════════════════════
// GERAR DOCUMENTO
// ════════════════════════════════════════════════════════════

// Tipos de documento por categoria do agente
const DOC_TYPES = {
  'Jurídico':       ['NDA','Contrato de Prestação','Contrato de Trabalho','LGPD/Política de Privacidade','Procuração','Distrato','Termo de Confidencialidade'],
  'Financeiro':     ['DRE','Fluxo de Caixa','Relatório de Budget','Análise de Investimento','Relatório Financeiro'],
  'Administrativo': ['Ata de Reunião','E-mail Formal','Ofício','Memorando','Proposta Comercial','Manual de Procedimentos'],
  'RH':             ['Contrato CLT','Job Description','Política de Férias','Avaliação de Desempenho','PDI','Carta de Demissão'],
  'Comercial':      ['Proposta Comercial','Script de Vendas','Contrato de Venda','Carta de Cobrança'],
  'Marketing':      ['Briefing de Campanha','Roteiro de Vídeo','Plano de Marketing','Relatório de Resultados'],
  'Tecnologia':     ['Especificação Técnica','API Docs','README','Política de Segurança','SLA'],
  'Diretoria':      ['Plano Estratégico','Relatório Executivo','Board Report','OKRs','Plano de 90 Dias'],
  'Crédito':        ['Política de Crédito','Régua de Cobrança','Relatório de Risco','Contrato de Empréstimo'],
  'default':        ['Relatório','Contrato','Proposta','Manual','Documento Personalizado']
}

let _docContent = ''    // texto puro do documento gerado
let _docTitle   = ''    // título do documento
let _analysisContent = '' // texto puro da análise

function initDocTypes() {
  const agent = allAgents.find(a => a.id === _activeAgentId)
  if (!agent) return
  const types = DOC_TYPES[agent.category] || DOC_TYPES['default']
  const grid = document.getElementById('doc-types-grid')
  if (!grid) return
  grid.innerHTML = types.map(t =>
    `<button class="doc-type-btn" onclick="selectDocType(this,'${escHtml(t)}')">${t}</button>`
  ).join('')
}

function selectDocType(btn, type) {
  document.querySelectorAll('.doc-type-btn').forEach(b => b.classList.remove('sel'))
  btn.classList.add('sel')
  const inp = document.getElementById('doc-type-input')
  if (inp) inp.value = type
}

async function generateDocument() {
  const agentId  = _activeAgentId
  if (!agentId) return
  const docType  = document.getElementById('doc-type-input')?.value.trim()
  const parties  = document.getElementById('doc-parties')?.value.trim()
  const instrRaw = document.getElementById('doc-instructions')?.value.trim()
  if (!docType) { alert('Informe o tipo de documento'); return }

  const instructions = [instrRaw, parties ? `Partes: ${parties}` : ''].filter(Boolean).join(' | ')

  const btn    = document.getElementById('btn-gen-doc')
  const status = document.getElementById('doc-gen-status')
  const previewArea = document.getElementById('doc-preview-area')
  const toolbar = document.getElementById('doc-result-toolbar')

  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando...' }
  if (status) status.textContent = 'Aguardando IA...'
  if (toolbar) toolbar.style.display = 'none'
  if (previewArea) {
    previewArea.className = 'doc-streaming'
    previewArea.innerHTML = '<span style="color:var(--muted);font-size:12px"><i class="fas fa-spinner fa-spin"></i> Gerando documento...</span>'
  }

  _docContent = ''
  _docTitle   = docType

  try {
    const res = await fetch('/api/document/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, docType, instructions })
    })

    if (!res.ok) { throw new Error('Erro ' + res.status) }
    if (!res.body) { throw new Error('Stream não disponível') }

    if (previewArea) previewArea.innerHTML = ''

    const reader  = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      buffer = parts.pop() || ''
      for (const part of parts) {
        for (const line of part.split('\n')) {
          if (!line.startsWith('data:')) continue
          const data = line.slice(5).trim()
          if (data === '[DONE]') continue
          try {
            const json  = JSON.parse(data)
            const chunk = json.response || json.choices?.[0]?.delta?.content || ''
            if (chunk) {
              _docContent += chunk
              if (previewArea) {
                previewArea.innerHTML = docMdToHtml(_docContent) +
                  '<span style="display:inline-block;width:2px;height:1em;background:var(--secondary);animation:blink .7s infinite;vertical-align:text-bottom"></span>'
                previewArea.scrollTop = previewArea.scrollHeight
              }
            }
          } catch {}
        }
      }
    }

    // Finalizar
    if (previewArea) { previewArea.className = 'doc-preview'; previewArea.innerHTML = docMdToHtml(_docContent) }
    if (toolbar) {
      toolbar.style.display = 'flex'
      const titleEl = document.getElementById('doc-result-title')
      if (titleEl) titleEl.textContent = docType
    }
    if (status) status.textContent = '✅ Documento gerado!'
    setTimeout(() => { if (status) status.textContent = '' }, 3000)

  } catch(err) {
    if (previewArea) {
      previewArea.className = 'doc-preview'
      previewArea.innerHTML = `<div style="color:#F87171;padding:20px"><i class="fas fa-exclamation-circle"></i> Erro ao gerar: ${escHtml(err.message)}</div>`
    }
    if (status) status.textContent = '❌ Erro'
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-magic"></i> Gerar Documento com IA' }
  }
}

function clearDocument() {
  _docContent = ''; _docTitle = ''
  const previewArea = document.getElementById('doc-preview-area')
  const toolbar = document.getElementById('doc-result-toolbar')
  if (previewArea) {
    previewArea.className = 'doc-preview doc-empty'
    previewArea.innerHTML = '<div class="doc-empty-icon">📄</div><div style="font-size:14px;font-weight:600;color:var(--text)">Nenhum documento gerado</div><div style="font-size:12px">Preencha o formulário e clique em Gerar Documento com IA</div>'
  }
  if (toolbar) toolbar.style.display = 'none'
  const inp = document.getElementById('doc-type-input')
  const parties = document.getElementById('doc-parties')
  const instr = document.getElementById('doc-instructions')
  if (inp) inp.value = ''
  if (parties) parties.value = ''
  if (instr) instr.value = ''
  document.querySelectorAll('.doc-type-btn').forEach(b => b.classList.remove('sel'))
}

// ── Download de documento
function downloadDoc(format) {
  if (!_docContent) return
  const title = _docTitle || 'documento'
  _downloadContent(_docContent, title, format)
}

function downloadAnalysis(format) {
  if (!_analysisContent) return
  _downloadContent(_analysisContent, 'analise-documento', format)
}

function _downloadContent(content, title, format) {
  const slug = title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').slice(0,40)
  const date = new Date().toISOString().slice(0,10)
  const fileName = `${slug}-${date}`

  if (format === 'txt') {
    _triggerDownload(content, fileName + '.txt', 'text/plain;charset=utf-8')

  } else if (format === 'word') {
    // RTF com suporte a caracteres especiais — abre no Word
    const rtf = _mdToRtf(content, title)
    _triggerDownload(rtf, fileName + '.rtf', 'application/rtf')

  } else if (format === 'pdf') {
    // Gera PDF via print do browser em iframe oculto
    _printAsPdf(content, title, fileName)
  }
}

function _triggerDownload(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = fileName
  document.body.appendChild(a); a.click()
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 500)
}

function _mdToRtf(md, title) {
  // Converte markdown para RTF básico
  const esc = s => s.replace(/\\/g,'\\\\').replace(/\{/g,'\\{').replace(/\}/g,'\\}')
    .replace(/[^\x00-\x7F]/g, c => {
      const code = c.charCodeAt(0)
      return code > 255 ? `\\u${code}?` : `\\'${code.toString(16).padStart(2,'0')}`
    })
  let lines = md.split('\n')
  let rtf = '{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Times New Roman;}{\\f1 Arial;}}{\\colortbl;\\red108\\green99\\blue255;\\red34\\blue238\\green211;}\\paperw12240\\paperh15840\\margl1800\\margr1800\\margt1440\\margb1440\n'
  rtf += `{\\pard\\qc\\b\\f1\\fs32 ${esc(title)}\\par}\\pard\\fs4\\par\n`
  for (const line of lines) {
    const l = line.trim()
    if (!l) { rtf += '\\pard\\fs4\\par\n'; continue }
    if (l.startsWith('# '))   { rtf += `\\pard\\b\\f1\\fs28 ${esc(l.slice(2))}\\b0\\par\n`; continue }
    if (l.startsWith('## '))  { rtf += `\\pard\\b\\f1\\fs24\\cf1 ${esc(l.slice(3))}\\cf0\\b0\\par\n`; continue }
    if (l.startsWith('### ')) { rtf += `\\pard\\b\\f1\\fs22 ${esc(l.slice(4))}\\b0\\par\n`; continue }
    if (l.startsWith('---'))  { rtf += '\\pard\\brdrb\\brdrs\\brdrw10\\brsp20\\par\n'; continue }
    if (l.match(/^[-*] /))    { rtf += `\\pard\\fi-360\\li360 • ${esc(l.slice(2))}\\par\n`; continue }
    // Bold **text**
    const formatted = esc(l)
      .replace(/\*\*([^*]+)\*\*/g, '{\\b $1}')
    rtf += `\\pard\\f0\\fs22 ${formatted}\\par\n`
  }
  rtf += '}'
  return rtf
}

function _printAsPdf(md, title, fileName) {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${escHtml(title)}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;color:#111;padding:2.5cm 3cm;max-width:21cm;margin:0 auto}
  h1{font-size:18pt;font-weight:700;text-align:center;margin:0 0 20px;border-bottom:2px solid #333;padding-bottom:10px}
  h2{font-size:14pt;font-weight:700;margin:20px 0 8px;color:#1a1a2e}
  h3{font-size:12pt;font-weight:700;margin:16px 0 6px}
  p{margin:6px 0}
  hr{border:none;border-top:1px solid #ccc;margin:16px 0}
  ul,ol{margin:8px 0 8px 24px}
  li{margin:3px 0}
  strong{font-weight:700}
  em{font-style:italic}
  table{width:100%;border-collapse:collapse;margin:10px 0}
  th{background:#f0f0f0;padding:6px 10px;border:1px solid #ccc;font-weight:700;font-size:11pt}
  td{padding:6px 10px;border:1px solid #ccc;font-size:11pt}
  pre{background:#f8f8f8;border:1px solid #ddd;border-radius:4px;padding:10px;font-family:monospace;font-size:10pt;overflow-x:auto}
  code{font-family:monospace;background:#f0f0f0;padding:0 3px;border-radius:2px}
  blockquote{border-left:3px solid #6C63FF;padding-left:12px;color:#555;margin:8px 0}
  @media print{body{padding:0}@page{margin:2cm 2.5cm}button{display:none}}
</style>
</head>
<body>
${mdToHtmlPrint(md)}
<script>window.onload=function(){window.print();setTimeout(()=>window.close(),1000)}<\/script>
</body>
</html>`
  const w = window.open('','_blank','width=900,height=700')
  if (w) { w.document.write(html); w.document.close() }
}

function mdToHtmlPrint(md) {
  if (!md) return ''
  let s = md
  s = s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  s = s.replace(/```[\s\S]*?```/g, m => `<pre>${m.replace(/```\w*\n?/g,'').replace(/```/g,'')}</pre>`)
  s = s.replace(/`([^`]+)`/g,'<code>$1</code>')
  s = s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
  s = s.replace(/\*([^*\n]+)\*/g,'<em>$1</em>')
  s = s.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  s = s.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  s = s.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  s = s.replace(/^[-*] (.+)$/gm, '<li>$1</li>')
  s = s.replace(/^(\d+)\. (.+)$/gm, '<li>$1. $2</li>')
  s = s.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  s = s.replace(/^---$/gm,'<hr>')
  // Agrupar <li> em <ul>
  s = s.replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
  s = s.replace(/\n\n+/g,'</p><p>').replace(/\n/g,'<br>')
  return `<p>${s}</p>`
}

function copyDocument() {
  if (!_docContent) return
  navigator.clipboard.writeText(_docContent).then(() => {
    const btn = document.querySelector('.btn-copy-doc')
    if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Copiado!'; setTimeout(() => { btn.innerHTML = '<i class="fas fa-copy"></i> Copiar' }, 2000) }
  })
}

// ── Markdown para HTML do preview (versão completa para docs)
function docMdToHtml(md) {
  if (!md) return ''
  let s = String(md)
  s = s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  s = s.replace(/```(\w*)?\n?([\s\S]*?)```/g, (_,__,code) =>
    `<pre><code>${code.trim()}</code></pre>`)
  s = s.replace(/`([^`]+)`/g,'<code>$1</code>')
  s = s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
  s = s.replace(/\*([^*\n]+)\*/g,'<em>$1</em>')
  s = s.replace(/^# (.+)$/gm,'<h1>$1</h1>')
  s = s.replace(/^## (.+)$/gm,'<h2>$1</h2>')
  s = s.replace(/^### (.+)$/gm,'<h3>$1</h3>')
  s = s.replace(/^[-*] (.+)$/gm,'<li>• $1</li>')
  s = s.replace(/^(\d+)\. (.+)$/gm,'<li>$1. $2</li>')
  s = s.replace(/^> (.+)$/gm,'<blockquote>$1</blockquote>')
  s = s.replace(/^---$/gm,'<hr>')
  // Tabelas Markdown
  s = s.replace(/^\|(.+)\|$/gm, (row) => {
    const cells = row.split('|').slice(1,-1)
    const isHeader = cells.every(c => c.trim())
    return `<tr>${cells.map(c => `<td>${c.trim()}</td>`).join('')}</tr>`
  })
  s = s.replace(/(<tr>.*<\/tr>\n?)+/g, m => `<table>${m}</table>`)
  s = s.replace(/(<li>.*\n?)+/g, m => `<ul>${m}</ul>`)
  s = s.replace(/\n/g,'<br>')
  return s
}

// ════════════════════════════════════════════════════════════
// ANALISAR ARQUIVO
// ════════════════════════════════════════════════════════════
let _uploadedFile     = null
let _uploadedContent  = ''

function handleFileSelect(input) {
  const file = input.files?.[0]
  if (file) _loadFile(file)
  input.value = ''
}

function handleFileDrop(e) {
  e.preventDefault()
  document.getElementById('upload-zone')?.classList.remove('drag-over')
  const file = e.dataTransfer.files?.[0]
  if (file) _loadFile(file)
}

async function _loadFile(file) {
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) { alert('Arquivo muito grande. Máximo 5 MB.'); return }

  _uploadedFile = file
  const nameEl = document.getElementById('upload-file-name')
  const labelEl = document.getElementById('upload-file-label')
  if (nameEl) nameEl.style.display = 'flex'
  if (labelEl) labelEl.textContent = `${file.name} (${(file.size/1024).toFixed(1)} KB)`

  // Ler conteúdo
  const ext = file.name.split('.').pop().toLowerCase()
  if (ext === 'txt' || ext === 'md') {
    _uploadedContent = await file.text()
  } else if (ext === 'pdf') {
    // Tenta ler o PDF como texto usando FileReader (extração básica)
    _uploadedContent = await _extractPdfText(file)
  } else if (ext === 'doc' || ext === 'docx') {
    // Lê como texto puro (extração de texto bruto de DOCX)
    _uploadedContent = await _extractDocxText(file)
  } else {
    _uploadedContent = await file.text()
  }
}

async function _extractPdfText(file) {
  // Leitura de texto bruto do PDF (funciona para PDFs baseados em texto)
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const binary = e.target.result
      // Extração simples de texto do PDF
      let text = ''
      try {
        const matches = binary.match(/\(([^)]{1,200})\)/g) || []
        text = matches.map(m => m.slice(1,-1)).join(' ')
          .replace(/\\n/g,'\n').replace(/\\r/g,'').replace(/\\\\/g,'\\')
        if (text.length < 50) {
          text = `[Arquivo PDF: ${file.name}]\n\nNota: O conteúdo deste PDF não pôde ser extraído automaticamente. Por favor, cole o texto do documento no campo de instrução.`
        }
      } catch { text = `[PDF: ${file.name}]` }
      resolve(text)
    }
    reader.readAsBinaryString(file)
  })
}

async function _extractDocxText(file) {
  // Para DOCX, tentamos ler o XML interno
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        // DOCX é um ZIP — tentar extrair texto do word/document.xml
        const arrayBuf = e.target.result
        // Leitura simples: procurar padrões de texto no binário
        const decoder = new TextDecoder('utf-8', { fatal: false })
        const text = decoder.decode(arrayBuf)
        // Extrai texto entre tags XML de parágrafo
        const matches = text.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) || []
        const extracted = matches.map(m => m.replace(/<[^>]+>/g,'')).join(' ')
        resolve(extracted.length > 30 ? extracted : `[Arquivo: ${file.name}]\n\nConteúdo não extraível automaticamente. Cole o texto no campo de instrução.`)
      } catch {
        resolve(`[Arquivo: ${file.name}]`)
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

function clearUpload() {
  _uploadedFile = null; _uploadedContent = ''
  const nameEl = document.getElementById('upload-file-name')
  if (nameEl) nameEl.style.display = 'none'
  _analysisContent = ''
  const resultEl = document.getElementById('analyze-result')
  if (resultEl) resultEl.innerHTML = '<div class="doc-empty" style="padding:30px 0"><div class="doc-empty-icon">🔍</div><div style="font-size:14px;font-weight:600;color:var(--text)">Nenhuma análise realizada</div><div style="font-size:12px">Envie um arquivo e clique em Analisar com IA</div></div>'
  const dlBar = document.getElementById('doc-result-toolbar-analyze')
  if (dlBar) dlBar.style.display = 'none'
}

async function analyzeFile() {
  const agentId = _activeAgentId
  if (!agentId) return
  if (!_uploadedFile || !_uploadedContent) { alert('Envie um arquivo primeiro'); return }

  const instruction = document.getElementById('analyze-instruction')?.value.trim() || ''
  const btn = document.getElementById('btn-analyze')
  const resultEl = document.getElementById('analyze-result')
  const dlBar = document.getElementById('doc-result-toolbar-analyze')

  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analisando...' }
  if (dlBar) dlBar.style.display = 'none'
  if (resultEl) resultEl.innerHTML = '<div style="padding:20px;color:var(--muted);font-size:13px"><i class="fas fa-spinner fa-spin"></i> Agente analisando o documento...</div>'

  _analysisContent = ''

  try {
    const res = await fetch('/api/document/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId,
        fileContent: _uploadedContent,
        fileName: _uploadedFile.name,
        instruction
      })
    })

    if (!res.ok) throw new Error('Erro ' + res.status)
    if (!res.body) throw new Error('Stream indisponível')

    if (resultEl) resultEl.innerHTML = ''

    const reader  = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      buffer = parts.pop() || ''
      for (const part of parts) {
        for (const line of part.split('\n')) {
          if (!line.startsWith('data:')) continue
          const data = line.slice(5).trim()
          if (data === '[DONE]') continue
          try {
            const json  = JSON.parse(data)
            const chunk = json.response || json.choices?.[0]?.delta?.content || ''
            if (chunk) {
              _analysisContent += chunk
              if (resultEl) {
                resultEl.innerHTML = docMdToHtml(_analysisContent) +
                  '<span style="display:inline-block;width:2px;height:1em;background:var(--secondary);animation:blink .7s infinite;vertical-align:text-bottom"></span>'
                resultEl.scrollTop = resultEl.scrollHeight
              }
            }
          } catch {}
        }
      }
    }

    if (resultEl) resultEl.innerHTML = docMdToHtml(_analysisContent)
    if (dlBar) { dlBar.style.display = 'flex' }

  } catch(err) {
    if (resultEl) resultEl.innerHTML = `<div style="color:#F87171;padding:20px"><i class="fas fa-exclamation-circle"></i> Erro: ${escHtml(err.message)}</div>`
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-microscope"></i> Analisar com IA' }
  }
}


// Listener global para perguntas rápidas do chat full-screen
document.addEventListener('click', function(e) {
  const qbtn = e.target.closest('.fc-qbtn')
  if (qbtn) {
    const id = qbtn.dataset.agentId || _activeAgentId
    const q  = qbtn.dataset.q
    const inp = document.getElementById('fc-input')
    if (inp && id) { inp.value = q; _activeAgentId = id; fcSend() }
  }
})

// Fechar accordions da sidebar quando clicar fora
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && _activeAgentId) showHome(null)
})
