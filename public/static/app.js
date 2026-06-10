// SixTech MAS v3.0 — Frontend App
// Estado global
let agents = [], models = [], chatHistory = [], allAgents = []

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
  container.innerHTML = agents.map(a => `
    <label class="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-white/5 transition-colors agent-check-item" data-source="${a.source}">
      <input type="checkbox" value="${a.id}" class="accent-purple-500 agent-checkbox"
        onchange="updateAgentCount()">
      <span class="text-lg">${a.emoji}</span>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-white truncate">${a.name}</div>
        <div class="text-xs truncate" style="color:#6B7280">${a.category}</div>
      </div>
      <span class="badge ${a.source === 'hybrid' ? 'badge-hybrid' : 'badge-cf'} shrink-0">
        ${a.source === 'hybrid' ? 'hybrid' : 'cf'}
      </span>
    </label>
  `).join('')
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
  try {
    const res = await fetch('/api/orchestrate', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({task})
    })
    if (!res.ok) return
    const data = await res.json()
    data.agentsUsed.forEach(id => {
      const cb = document.querySelector(`.agent-checkbox[value="${id}"]`)
      if (cb) cb.checked = true
    })
    updateAgentCount()
    document.querySelector('input[name="mode"][value="orchestrate"]').checked = true
  } catch(e) {
    console.error('autoRoute error:', e)
  }
}

// ── Run Pipeline
async function runPipeline() {
  const task = document.getElementById('pipeline-task').value.trim()
  if (!task) { alert('Digite uma tarefa!'); return }

  const selectedIds = [...document.querySelectorAll('.agent-checkbox:checked')].map(cb => cb.value)
  if (!selectedIds.length) { alert('Selecione ao menos um agente!'); return }

  const mode = document.querySelector('input[name="mode"]:checked').value
  const btn = document.getElementById('run-btn')
  btn.disabled = true
  btn.innerHTML = '<i class="fas fa-spinner spin mr-2"></i>Executando...'

  // Progress bar
  const pb = document.getElementById('progress-bar')
  pb.classList.remove('hidden')
  const steps = document.getElementById('progress-steps')
  steps.innerHTML = selectedIds.map((id) => {
    const a = agents.find(x => x.id === id)
    return `<div class="progress-step pending flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" id="step-${id}"
      style="background:var(--card);border:1px solid var(--border)">
      <span>${a ? a.emoji : '🤖'}</span><span>${a ? a.name : id}</span>
    </div>`
  }).join('')

  // Clear results
  const container = document.getElementById('results-container')
  const placeholder = document.getElementById('results-placeholder')
  if (placeholder) placeholder.remove()
  container.innerHTML = ''

  try {
    if (mode === 'orchestrate') {
      document.getElementById('progress-info').textContent = 'Roteamento inteligente...'
      selectedIds.forEach(id => {
        const el = document.getElementById('step-' + id)
        if (el) el.classList.add('done')
      })
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
          stepEl.innerHTML += ' <i class="fas fa-spinner spin"></i>'
        }
        document.getElementById('progress-info').textContent = `${i+1}/${selectedIds.length}`

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
          const spinner = stepEl.querySelector('.fa-spinner')
          if (spinner) spinner.remove()
          stepEl.innerHTML += ' ✓'
        }
      }
    }
  } catch(e) {
    container.innerHTML += `<div class="glass rounded-2xl p-5" style="border:1px solid #991b1b">
      <div style="color:#F87171">❌ Erro: ${e.message}</div></div>`
  }

  btn.disabled = false
  btn.innerHTML = '<i class="fas fa-play mr-2"></i>Executar Pipeline'
}

function renderResult(r, container) {
  const sourceLabel = r.usedFallback ? '☁️ CF Fallback' : r.source === 'internal' ? '🖥️ Interno' : '☁️ Cloudflare'
  const sourceBadge = r.usedFallback ? 'badge-hybrid' : r.source === 'internal' ? 'badge-int' : 'badge-cf'
  const formatted = mdToHtml(r.response || r.error || 'Sem resposta')
  const modelName = r.model ? r.model.split('/').pop() : ''

  const el = document.createElement('div')
  el.className = 'result-card glass rounded-2xl overflow-hidden'
  el.innerHTML = `
    <div class="flex items-center gap-3 p-4" style="border-bottom:1px solid var(--border);background:linear-gradient(90deg,${r.color}22,transparent)">
      <span class="text-2xl">${r.emoji}</span>
      <div class="flex-1">
        <div class="font-semibold text-white">${r.name}</div>
        <div class="text-xs" style="color:#6B7280">${modelName}</div>
      </div>
      <span class="badge ${sourceBadge}">${sourceLabel}</span>
      <span class="text-xs" style="color:#6B7280">${(r.duration/1000).toFixed(1)}s</span>
    </div>
    <div class="p-5 text-sm leading-relaxed" style="color:#D1D5DB">${formatted}</div>
  `
  container.appendChild(el)
  el.scrollIntoView({behavior:'smooth', block:'nearest'})
}

// ── Chat
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
      agents.map(a => `<option value="${a.id}">${a.emoji} ${a.name}</option>`).join('')
  }
}

async function sendChat() {
  const input = document.getElementById('chat-input')
  const msg = input.value.trim()
  if (!msg) return

  const agentId = document.getElementById('chat-agent').value
  input.value = ''
  input.style.height = 'auto'

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
      appendChatMsg('assistant', data.response || 'Sem resposta', agent ? agent.name : 'Agente', agent ? agent.emoji : '🤖')
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

  const chatMsgs = document.getElementById('chat-messages')
  const aiEl = document.createElement('div')
  aiEl.className = 'msg-ai rounded-xl p-4 text-sm'
  aiEl.innerHTML = '<div class="font-medium mb-1" style="color:#22D3EE">🤖 Assistente</div><div class="streaming-text"></div>'
  chatMsgs.appendChild(aiEl)
  const textEl = aiEl.querySelector('.streaming-text')
  chatMsgs.scrollTop = 9999

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
      const parts = buffer.split('\n\n')
      buffer = parts.pop() || ''
      for (const part of parts) {
        for (const line of part.split('\n')) {
          if (!line.startsWith('data:')) continue
          const data = line.slice(5).trim()
          if (data === '[DONE]') continue
          try {
            const json = JSON.parse(data)
            const chunk = json.response || (json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content) || ''
            if (chunk) {
              fullText += chunk
              textEl.innerHTML = mdToHtml(fullText) + '<span class="typing-cursor"></span>'
              chatMsgs.scrollTop = 9999
            }
          } catch(_) {}
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

function appendChatMsg(role, text, name, emoji) {
  name = name || 'Assistente'
  emoji = emoji || '🤖'
  const chatMsgs = document.getElementById('chat-messages')
  const el = document.createElement('div')
  el.className = role === 'user' ? 'msg-user rounded-xl p-4 text-sm ml-8' : 'msg-ai rounded-xl p-4 text-sm'
  if (role === 'user') {
    el.innerHTML = `<div class="font-medium mb-1" style="color:#a5b4fc">👤 Você</div><div>${escHtml(text)}</div>`
  } else {
    el.innerHTML = `<div class="font-medium mb-1" style="color:#22D3EE">${emoji} ${name}</div><div>${mdToHtml(text)}</div>`
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
    `<div class="px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer truncate">${m.content.slice(0,35)}...</div>`
  ).join('')
}

function clearChat() {
  chatHistory = []
  const chatMsgs = document.getElementById('chat-messages')
  chatMsgs.innerHTML = `
    <div class="msg-ai rounded-xl p-4 text-sm">
      <div class="font-medium mb-1" style="color:#22D3EE">🤖 Assistente SixTech</div>
      <div>Olá! Como posso ajudar?</div>
    </div>`
  const list = document.getElementById('chat-history-list')
  if (list) list.innerHTML = '<div class="text-center py-4">Nenhuma conversa</div>'
}

// ── Agents Grid
function renderAgentsGrid(filtered) {
  const list = filtered || allAgents
  const grid = document.getElementById('agents-grid')
  if (!grid) return
  grid.innerHTML = list.map(a => `
    <div class="agent-card glass rounded-2xl overflow-hidden">
      <div class="p-5" style="border-bottom:1px solid var(--border);background:linear-gradient(135deg,${a.color}22,transparent)">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <span class="text-3xl">${a.emoji}</span>
            <div>
              <div class="font-bold text-white">${a.name}</div>
              <div class="text-xs" style="color:#6B7280">${a.category}</div>
            </div>
          </div>
          <span class="badge ${a.source === 'hybrid' ? 'badge-hybrid' : 'badge-cf'}">${a.source}</span>
        </div>
        <p class="text-xs leading-relaxed" style="color:#9CA3AF">${a.desc}</p>
      </div>
      <div class="p-4">
        <div class="mb-3">
          <div class="text-xs font-medium mb-2" style="color:#6B7280">CAPACIDADES</div>
          <div class="flex flex-wrap gap-1">
            ${(a.capabilities || []).map(c => `<span class="cap-pill">${c}</span>`).join('')}
          </div>
        </div>
        ${a.basedOn ? `<div class="text-xs mb-3" style="color:#6B7280">📦 <span style="color:#a5b4fc">${a.basedOn}</span></div>` : ''}
        <div class="text-xs mb-3" style="color:#6B7280">🤖 <span style="color:#22D3EE">${a.model ? a.model.split('/').pop() : ''}</span></div>
        <button onclick="testAgent('${a.id}')"
          class="w-full py-2 rounded-xl text-xs font-semibold"
          style="background:rgba(108,99,255,.2);border:1px solid rgba(108,99,255,.4);color:#a5b4fc">
          <i class="fas fa-flask mr-1"></i>Testar Agente
        </button>
      </div>
    </div>
  `).join('')
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
    b.style.background = 'var(--card)'
    b.style.color = 'var(--muted)'
  })
  if (event && event.currentTarget) {
    event.currentTarget.style.background = 'var(--primary)'
    event.currentTarget.style.color = 'white'
  }
  renderAgentsGrid(src === 'all' ? allAgents : allAgents.filter(a => a.source === src))
}

async function testAgent(id) {
  const task = prompt('Teste o agente — digite uma tarefa:')
  if (!task) return
  // Ir para pipeline e executar
  document.querySelectorAll('.tab-btn')[0].click()
  setTimeout(() => {
    document.getElementById('pipeline-task').value = task
    document.querySelectorAll('.agent-checkbox').forEach(cb => cb.checked = cb.value === id)
    updateAgentCount()
    runPipeline()
  }, 150)
}

// ── Status
async function loadStatus() {
  try {
    const res = await fetch('/api/status')
    const data = await res.json()
    const container = document.getElementById('status-details')
    if (!container) return

    const reposHtml = Object.entries(data.repos || {}).map(([name, info]) => `
      <div class="flex items-start gap-3 p-3 rounded-xl" style="background:var(--bg);border:1px solid var(--border)">
        <span style="color:#34D399;margin-top:2px">●</span>
        <div>
          <div class="font-medium text-white text-sm">${name}</div>
          <div class="text-xs mt-1" style="color:#6B7280">${info.type || ''}</div>
          ${info.url ? `<a href="${info.url}" target="_blank" class="text-xs" style="color:#6C63FF">${info.url}</a>` : ''}
          ${info.note ? `<div class="text-xs mt-1" style="color:#F59E0B">${info.note}</div>` : ''}
        </div>
      </div>
    `).join('')

    const featuresHtml = (data.features || []).map(f => `
      <div class="flex items-center gap-3 p-2.5 rounded-xl" style="background:var(--bg)">
        <i class="fas fa-check-circle" style="color:#34D399"></i>
        <span class="text-sm text-white">${f}</span>
      </div>
    `).join('')

    container.innerHTML = `
      <div class="glass rounded-2xl p-5">
        <h3 class="font-semibold text-white mb-4">
          <i class="fas fa-code-branch mr-2" style="color:var(--primary)"></i>Repositórios Integrados
        </h3>
        <div class="space-y-3">${reposHtml}</div>
      </div>
      <div class="glass rounded-2xl p-5">
        <h3 class="font-semibold text-white mb-4">
          <i class="fas fa-server mr-2" style="color:var(--secondary)"></i>Funcionalidades
        </h3>
        <div class="space-y-2">${featuresHtml}</div>
        <div class="mt-4 p-3 rounded-xl text-xs" style="background:rgba(108,99,255,.1);border:1px solid rgba(108,99,255,.3);color:#a5b4fc">
          <i class="fas fa-info-circle mr-2"></i>
          Plataforma no Cloudflare Pages Edge — latência global &lt; 50ms
        </div>
      </div>
    `

    const statAgents = document.getElementById('stat-agents')
    const statModels = document.getElementById('stat-models')
    if (statAgents) statAgents.textContent = data.agents
    if (statModels) statModels.textContent = data.models

    document.getElementById('status-text').textContent = 'Online v' + data.version
  } catch(e) {
    const statusText = document.getElementById('status-text')
    if (statusText) statusText.textContent = 'Verificando...'
  }
}

// ── Clear All
function clearAll() {
  document.getElementById('pipeline-task').value = ''
  document.querySelectorAll('.agent-checkbox').forEach(cb => cb.checked = false)
  updateAgentCount()
  document.getElementById('results-container').innerHTML = `
    <div id="results-placeholder" class="glass rounded-2xl p-12 text-center">
      <div class="text-5xl mb-4">🤖</div>
      <div class="text-white font-medium mb-2">Pronto para executar</div>
      <div class="text-sm" style="color:var(--muted)">Configure a tarefa, selecione os agentes e clique em Executar</div>
    </div>`
  document.getElementById('progress-bar').classList.add('hidden')
}

// ── Utils
function escHtml(t) {
  if (!t) return ''
  return String(t)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
}

function mdToHtml(md) {
  if (!md) return ''
  let s = String(md)
  // escape HTML first
  s = s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  // code blocks
  s = s.replace(/```(\w*)?\n?([\s\S]*?)```/g, function(_, lang, code) {
    return '<pre style="background:#0d0d1a;border:1px solid #2A2D40;border-radius:8px;padding:12px;overflow-x:auto;margin:8px 0"><code style="color:#e2e8f0;font-family:monospace;font-size:13px">' + code.trim() + '</code></pre>'
  })
  // inline code
  s = s.replace(/`([^`]+)`/g, '<code style="background:#1e2030;padding:2px 6px;border-radius:4px;color:#f472b6;font-family:monospace">$1</code>')
  // bold
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:white">$1</strong>')
  // italic
  s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
  // h3
  s = s.replace(/^### (.+)$/gm, '<h3 style="color:#22D3EE;font-size:1rem;font-weight:600;margin:12px 0 6px">$1</h3>')
  // h2
  s = s.replace(/^## (.+)$/gm, '<h2 style="color:#a5b4fc;font-size:1.1rem;font-weight:700;margin:16px 0 8px">$1</h2>')
  // h1
  s = s.replace(/^# (.+)$/gm, '<h1 style="color:white;font-size:1.25rem;font-weight:800;margin:16px 0 8px">$1</h1>')
  // lists
  s = s.replace(/^[-*] (.+)$/gm, '<li style="margin:3px 0;padding-left:4px">• $1</li>')
  s = s.replace(/^(\d+)\. (.+)$/gm, '<li style="margin:3px 0;padding-left:4px">$1. $2</li>')
  // blockquote
  s = s.replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #6C63FF;padding-left:12px;color:#9CA3AF;margin:8px 0">$1</blockquote>')
  // newlines
  s = s.replace(/\n/g, '<br>')
  return s
}

// ── Inicializar quando DOM pronto
document.addEventListener('DOMContentLoaded', init)
