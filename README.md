# SixTech MAS — Multi-Agent System v3.0

## 🌐 URLs
- **Plataforma**: https://sixtech-mas.pages.dev
- **Landing Page**: https://sixtechbrasil.pages.dev
- **GitHub (MAS)**: https://github.com/kainow252-cmyk/sixtechbrasil
- **GitHub (Landing)**: https://github.com/kainow252-cmyk/sixtech

## 🤖 Agentes (9 no total)

### SixTech Workspace (Hybrid: interno → CF AI fallback)
| Agente | Modelo CF | Baseado em |
|--------|-----------|------------|
| 💻 Developer | Qwen2.5 Coder 32B | sixtech-workspace + OpenHands |
| 🔍 Pesquisador | Llama 3.3 70B | sixtech-workspace |
| ⚖️ Jurídico | Llama 3.3 70B | sixtech-workspace |
| 🎨 Designer | Llama 3.3 70B | sixtech-workspace |
| 📄 Documentos | Llama 3.1 8B | sixtech-workspace |

### Cloudflare AI Nativos
| Agente | Modelo | Função |
|--------|--------|--------|
| 📊 Analista | DeepSeek R1 32B | Análise chain-of-thought |
| 🛡️ Revisor QA | Llama 3.1 8B | Revisão e scoring |
| 💬 Assistente | Llama 3.1 8B + SSE | Chat em tempo real |
| 🎯 Super Orquestrador | Kimi K2.6 1T | CEO dos agentes |

## 🔧 APIs
- `GET /api/agents` — lista todos os agentes
- `GET /api/models` — lista todos os modelos
- `GET /api/status` — status da plataforma
- `POST /api/agent/:id` — executar agente individual
- `POST /api/orchestrate` — roteamento inteligente automático
- `POST /api/pipeline` — pipeline sequencial com contexto
- `POST /api/chat` — chat com streaming SSE

## 📦 Repos Integrados
- **sixtech-workspace** — FastAPI Python com 5 agentes (developer, research, legal, designer, documents)
- **sixtechworkspace** — CF Workers AI + SSE streaming chat
- **kndev-IA** — OpenHands + opencode
- **sixtechbrasil** — Plataforma principal CF Pages

## 🚀 Deploy
- **Plataforma**: Cloudflare Pages + Workers AI
- **Build**: `npm run build` → `dist/_worker.js` (74KB)
- **Deploy**: `wrangler pages deploy dist --project-name sixtech-mas`
- **Versão**: 3.0.0
- **Última atualização**: Junho 2026
