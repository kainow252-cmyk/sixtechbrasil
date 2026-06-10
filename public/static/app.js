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
  sel.addEventListener('change', () => {
    const badge = document.getElementById('chat-model-badge')
    if (badge) {
      const found = models.find(m => m.id === sel.value)
      badge.textContent = found ? found.label : sel.value
    }
  })
  const agentSel = document.getElementById('chat-agent')
  if (agentSel) {
    agentSel.innerHTML = '<option value="">Nenhum (chat livre)</option>' +
      allAgents.map(a => `<option value="${a.id}">${a.emoji} ${a.name}</option>`).join('')
  }
}

async function sendChat() {
  const input = document.getElementById('chat-input')
  const msg = input.value.trim()
  if (!msg) return
  const agentId = document.getElementById('chat-agent').value
  input.value = ''

  if (agentId) {
    appendChatMsg('user', msg)
    document.getElementById('typing-indicator').style.display = ''
    try {
      const res = await fetch('/api/agent/' + agentId, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      })
      const data = await res.json()
      document.getElementById('typing-indicator').style.display = 'none'
      const agent = allAgents.find(a => a.id === agentId)
      appendChatMsg('assistant', data.response || 'Sem resposta', agent?.name || 'Agente', agent?.emoji || '🤖')
    } catch(e) {
      document.getElementById('typing-indicator').style.display = 'none'
      appendChatMsg('assistant', '❌ Erro: ' + e.message)
    }
    return
  }

  const model = document.getElementById('chat-model').value
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
