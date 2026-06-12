-- ═══════════════════════════════════════════════════
-- SixTech MAS — Banco de Conhecimento + Cache
-- ═══════════════════════════════════════════════════

-- Catálogo de APIs públicas gratuitas
CREATE TABLE IF NOT EXISTS public_apis (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,
  description   TEXT,
  base_url      TEXT,
  docs_url      TEXT,
  auth_type     TEXT DEFAULT 'none',
  example       TEXT,
  tags          TEXT,
  quality       INTEGER DEFAULT 8,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cache de consultas (cache-first: consulta aqui antes de chamar IA/API)
CREATE TABLE IF NOT EXISTS query_cache (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  query_hash    TEXT UNIQUE NOT NULL,
  query_text    TEXT NOT NULL,
  response      TEXT NOT NULL,
  source        TEXT NOT NULL,     -- 'ai' | 'api:nome' | 'manual'
  agent_id      TEXT,
  hit_count     INTEGER DEFAULT 0,
  tokens_saved  INTEGER DEFAULT 0,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at    DATETIME
);

-- Base de conhecimento acumulada pelos agentes
CREATE TABLE IF NOT EXISTS knowledge (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id      TEXT NOT NULL,
  topic         TEXT NOT NULL,
  category      TEXT NOT NULL,
  content       TEXT NOT NULL,
  source_url    TEXT,
  source_type   TEXT DEFAULT 'ai',  -- 'ai' | 'api' | 'manual' | 'web'
  confidence    REAL DEFAULT 0.9,
  used_count    INTEGER DEFAULT 0,
  keywords      TEXT,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_cache_hash    ON query_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_cache_agent   ON query_cache(agent_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_ag  ON knowledge(agent_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_cat ON knowledge(category);
CREATE INDEX IF NOT EXISTS idx_apis_cat      ON public_apis(category);
