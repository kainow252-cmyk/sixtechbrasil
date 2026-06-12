-- ═══════════════════════════════════════════════════════════════
-- SixTech KnowledgeBot — Schema Principal
-- Estratégia: Consulta local primeiro, API externa só se necessário
-- ═══════════════════════════════════════════════════════════════

-- ─── CATÁLOGO DE APIs PÚBLICAS GRATUITAS ─────────────────────
CREATE TABLE IF NOT EXISTS apis (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  subcategory TEXT,
  description TEXT,
  base_url    TEXT,
  docs_url    TEXT,
  auth_type   TEXT DEFAULT 'none',  -- none | apikey | oauth | bearer
  is_free     INTEGER DEFAULT 1,
  rate_limit  TEXT,
  cors        TEXT DEFAULT 'unknown',
  https       INTEGER DEFAULT 1,
  tags        TEXT,  -- JSON array como string
  example_endpoint TEXT,
  response_example TEXT,
  quality_score INTEGER DEFAULT 5,  -- 1-10
  last_checked  DATETIME,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─── CACHE DE CONSULTAS (coração do sistema) ─────────────────
-- Antes de chamar API externa, verifica aqui primeiro
CREATE TABLE IF NOT EXISTS cache_queries (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  query_hash   TEXT UNIQUE NOT NULL,  -- hash da pergunta normalizada
  query_text   TEXT NOT NULL,
  source       TEXT NOT NULL,         -- api_name | bot_id | manual
  response     TEXT NOT NULL,         -- resposta JSON/texto salva
  response_type TEXT DEFAULT 'text',  -- text | json | html | markdown
  hit_count    INTEGER DEFAULT 0,     -- quantas vezes foi servida do cache
  tokens_saved INTEGER DEFAULT 0,     -- tokens de IA economizados
  api_id       INTEGER,               -- qual API gerou este cache
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at   DATETIME,              -- NULL = nunca expira
  FOREIGN KEY (api_id) REFERENCES apis(id)
);

-- ─── BASE DE CONHECIMENTO (LLM próprio por categorias) ───────
CREATE TABLE IF NOT EXISTS knowledge_base (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  bot_id      TEXT NOT NULL,          -- qual bot "aprendeu" isso
  topic       TEXT NOT NULL,
  category    TEXT NOT NULL,
  subcategory TEXT,
  content     TEXT NOT NULL,          -- conhecimento acumulado
  source_url  TEXT,
  source_type TEXT DEFAULT 'ai',      -- ai | api | manual | web
  confidence  REAL DEFAULT 0.8,       -- 0.0 a 1.0
  language    TEXT DEFAULT 'pt-BR',
  keywords    TEXT,                   -- JSON array
  used_count  INTEGER DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─── BOTS (agentes clonaveis) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS bots (
  id           TEXT PRIMARY KEY,      -- slug único ex: 'finance-bot-01'
  name         TEXT NOT NULL,
  emoji        TEXT DEFAULT '🤖',
  description  TEXT,
  category     TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  model        TEXT DEFAULT 'balanced',
  parent_id    TEXT,                  -- bot clonado de outro
  clone_depth  INTEGER DEFAULT 0,     -- profundidade da clonagem
  apis_linked  TEXT,                  -- JSON: [api_id, ...]
  knowledge_topics TEXT,             -- JSON: [topic, ...]
  is_active    INTEGER DEFAULT 1,
  queries_answered INTEGER DEFAULT 0,
  knowledge_items  INTEGER DEFAULT 0,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES bots(id)
);

-- ─── LOG DE APRENDIZADO (rastrear crescimento do LLM) ────────
CREATE TABLE IF NOT EXISTS learning_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  bot_id      TEXT,
  action      TEXT NOT NULL,          -- query | learn | crawl | clone
  query       TEXT,
  result      TEXT,
  cache_hit   INTEGER DEFAULT 0,      -- 1 = servido do cache local
  api_called  TEXT,                   -- qual API externa foi chamada
  tokens_used INTEGER DEFAULT 0,
  duration_ms INTEGER DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─── FONTES WEB PARA CRAWL ────────────────────────────────────
CREATE TABLE IF NOT EXISTS crawl_sources (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  url         TEXT NOT NULL,
  name        TEXT,
  category    TEXT,
  auto_crawl  INTEGER DEFAULT 0,      -- crawl automático periódico
  last_crawled DATETIME,
  items_extracted INTEGER DEFAULT 0,
  status      TEXT DEFAULT 'pending', -- pending | active | error
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─── ÍNDICES ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_apis_category    ON apis(category);
CREATE INDEX IF NOT EXISTS idx_apis_free        ON apis(is_free);
CREATE INDEX IF NOT EXISTS idx_cache_hash       ON cache_queries(query_hash);
CREATE INDEX IF NOT EXISTS idx_cache_source     ON cache_queries(source);
CREATE INDEX IF NOT EXISTS idx_knowledge_bot    ON knowledge_base(bot_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_topic  ON knowledge_base(topic);
CREATE INDEX IF NOT EXISTS idx_knowledge_cat    ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_bots_cat         ON bots(category);
CREATE INDEX IF NOT EXISTS idx_learning_bot     ON learning_log(bot_id);
CREATE INDEX IF NOT EXISTS idx_learning_action  ON learning_log(action);
