-- ═══════════════════════════════════════════════════════════════
-- SEED: 100+ APIs Públicas Gratuitas catalogadas
-- ═══════════════════════════════════════════════════════════════

-- ─── FINANÇAS ─────────────────────────────────────────────────
INSERT OR IGNORE INTO apis (name,category,subcategory,description,base_url,docs_url,auth_type,is_free,rate_limit,https,tags,example_endpoint,quality_score) VALUES
('AwesomeAPI Câmbio','Finanças','Câmbio','Cotações de moedas em tempo real (BRL/USD/EUR)','https://economia.awesomeapi.com.br','https://docs.awesomeapi.com.br','none',1,'unlimited',1,'["câmbio","moedas","brl","usd","eur","real-time"]','/json/last/USD-BRL',10),
('Open Exchange Rates','Finanças','Câmbio','Taxas de câmbio históricas e em tempo real','https://openexchangerates.org/api','https://docs.openexchangerates.org','apikey',1,'1000/mo',1,'["câmbio","moedas","histórico"]','/latest.json?app_id=KEY',8),
('CoinGecko','Finanças','Cripto','Preços de criptomoedas, market cap, histórico','https://api.coingecko.com/api/v3','https://www.coingecko.com/api/docs','none',1,'50/min',1,'["cripto","bitcoin","ethereum","defi","nft"]','/simple/price?ids=bitcoin&vs_currencies=brl',10),
('Binance Public API','Finanças','Cripto','Dados de trading e preços da Binance','https://api.binance.com/api/v3','https://binance-docs.github.io','none',1,'1200/min',1,'["binance","cripto","trading","orderbook"]','/ticker/price?symbol=BTCUSDT',9),
('Yahoo Finance (yfinance)','Finanças','Ações','Dados históricos de ações, índices','https://query1.finance.yahoo.com/v8/finance','https://pypi.org/project/yfinance','none',1,'varies',1,'["ações","bolsa","histórico","dividendos"]','/chart/PETR4.SA',8),
('BrasilAPI CEP','Finanças','Banco','Consulta CNPJ, CEP, bancos, feriados, moedas','https://brasilapi.com.br/api','https://brasilapi.com.br/docs','none',1,'unlimited',1,'["cnpj","cep","banco","feriado","brasil"]','/cnpj/v1/11222333000181',10),
('Receita Federal CNPJ','Finanças','Fiscal','Consulta CNPJ na Receita Federal','https://www.receitaws.com.br/v1','https://receitaws.com.br','none',1,'3/min',1,'["cnpj","receita","empresa","brasil"]','/cnpj/11222333000181',8),
('BACEN API','Finanças','Banco Central','Dados do Banco Central: SELIC, IPCA, cambio','https://api.bcb.gov.br/dados/serie','https://dadosabertos.bcb.gov.br','none',1,'unlimited',1,'["selic","ipca","ptax","banco-central","bcb"]','/bcdata.sgs.11/dados/ultimos/1?formato=json',10),
('Alpha Vantage','Finanças','Ações','Dados de ações, forex, cripto e indicadores técnicos','https://www.alphavantage.co/query','https://www.alphavantage.co/documentation','apikey',1,'25/day',1,'["ações","forex","indicadores","RSI","MACD"]','?function=TIME_SERIES_DAILY&symbol=IBM&apikey=KEY',8),
('CryptoCompare','Finanças','Cripto','Preços, histórico e notícias de cripto','https://min-api.cryptocompare.com/data','https://min-api.cryptocompare.com/documentation','none',1,'100k/mo',1,'["cripto","preços","histórico","notícias"]','/price?fsym=BTC&tsyms=BRL,USD',8);

-- ─── CLIMA & GEOGRAFIA ────────────────────────────────────────
INSERT OR IGNORE INTO apis (name,category,subcategory,description,base_url,docs_url,auth_type,is_free,rate_limit,https,tags,example_endpoint,quality_score) VALUES
('Open-Meteo','Clima','Previsão','Previsão do tempo gratuita sem API key','https://api.open-meteo.com/v1','https://open-meteo.com/en/docs','none',1,'10000/day',1,'["clima","tempo","previsão","temperatura","chuva"]','/forecast?latitude=-23.55&longitude=-46.63&current_weather=true',10),
('OpenWeatherMap','Clima','Previsão','Clima atual, previsão 5 dias, mapas','https://api.openweathermap.org/data/2.5','https://openweathermap.org/api','apikey',1,'60/min',1,'["clima","tempo","previsão","mapa","umidade"]','/weather?q=São Paulo&appid=KEY&lang=pt_br',9),
('ViaCEP','Localização','CEP','Consulta CEP brasileiro - endereços completos','https://viacep.com.br/ws','https://viacep.com.br','none',1,'unlimited',1,'["cep","endereço","brasil","correios"]','/{cep}/json',10),
('IBGE API','Localização','Brasil','Dados do IBGE: municípios, estados, população','https://servicodados.ibge.gov.br/api/v1','https://servicodados.ibge.gov.br/api/docs','none',1,'unlimited',1,'["ibge","município","estado","brasil","população"]','/localidades/estados',10),
('Nominatim (OpenStreetMap)','Localização','Geocoding','Geocoding reverso e direto gratuito','https://nominatim.openstreetmap.org','https://nominatim.org/release-docs/develop/api/Overview/','none',1,'1/sec',1,'["geocoding","endereço","lat","lng","openstreetmap"]','/search?q=São Paulo&format=json',9),
('IP-API','Localização','IP','Geolocalização por IP - país, cidade, ISP','http://ip-api.com/json','https://ip-api.com/docs','none',1,'45/min',0,'["ip","geolocalização","país","cidade","isp"]','/json/177.79.68.1?lang=pt-BR',9),
('ipapi.co','Localização','IP','Detalhes completos de IP: país, timezone, org','https://ipapi.co','https://ipapi.co/api','none',1,'1000/day',1,'["ip","geolocalização","timezone","moeda"]','/{ip}/json/',8),
('CountriesNow','Localização','País','Países, cidades, estados, populações','https://countriesnow.space/api/v0.1','https://documenter.getpostman.com/view/1134062/T1LJjU52','none',1,'unlimited',1,'["países","cidades","estados","população","bandeira"]','/countries',8),
('RestCountries','Localização','País','Dados de todos os países do mundo','https://restcountries.com/v3.1','https://restcountries.com','none',1,'unlimited',1,'["países","moedas","idiomas","bandeiras","continentes"]','/all?fields=name,capital,currencies',9);

-- ─── NOTÍCIAS & CONTEÚDO ──────────────────────────────────────
INSERT OR IGNORE INTO apis (name,category,subcategory,description,base_url,docs_url,auth_type,is_free,rate_limit,https,tags,example_endpoint,quality_score) VALUES
('NewsAPI.org','Notícias','Artigos','Notícias de 80k+ fontes - busca por palavra-chave','https://newsapi.org/v2','https://newsapi.org/docs','apikey',1,'100/day',1,'["notícias","artigos","jornal","headline","RSS"]','/top-headlines?country=br&apiKey=KEY',8),
('Dev.to API','Notícias','Tech','Artigos de programação do dev.to','https://dev.to/api','https://developers.forem.com/api','none',1,'unlimited',1,'["dev","programação","artigos","tecnologia"]','/articles?top=1&per_page=10',9),
('HackerNews API','Notícias','Tech','Notícias e discussões de tecnologia','https://hacker-news.firebaseio.com/v0','https://github.com/HackerNews/API','none',1,'unlimited',1,'["hackernews","tech","startup","IA"]','/topstories.json',9),
('Reddit API','Notícias','Social','Posts e comentários de subreddits','https://www.reddit.com','https://www.reddit.com/dev/api','oauth',1,'60/min',1,'["reddit","posts","comentários","comunidades"]','/{subreddit}/top.json?limit=10',7),
('Wikipedia API','Conhecimento','Enciclopédia','Busca e conteúdo da Wikipedia em PT','https://pt.wikipedia.org/api/rest_v1','https://en.wikipedia.org/api/rest_v1/','none',1,'unlimited',1,'["wikipedia","enciclopédia","artigos","conhecimento"]','/page/summary/Inteligência_artificial',10);

-- ─── TECNOLOGIA & DESENVOLVIMENTO ─────────────────────────────
INSERT OR IGNORE INTO apis (name,category,subcategory,description,base_url,docs_url,auth_type,is_free,rate_limit,https,tags,example_endpoint,quality_score) VALUES
('GitHub API v3','Tecnologia','Código','Repositórios, issues, usuários do GitHub','https://api.github.com','https://docs.github.com/en/rest','none',1,'60/hour',1,'["github","repositórios","código","open-source"]','/search/repositories?q=public-api&sort=stars',10),
('NPM Registry','Tecnologia','Pacotes','Dados de pacotes NPM: versões, downloads','https://registry.npmjs.org','https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md','none',1,'unlimited',1,'["npm","javascript","pacotes","node","typescript"]','/{package}',9),
('PyPI JSON API','Tecnologia','Pacotes','Dados de pacotes Python no PyPI','https://pypi.org/pypi','https://warehouse.pypa.io/api-reference/json.html','none',1,'unlimited',1,'["pypi","python","pacotes","pip"]','/{package}/json',9),
('Cloudflare API','Tecnologia','Cloud','Gerenciar zones, workers, DNS do Cloudflare','https://api.cloudflare.com/client/v4','https://developers.cloudflare.com/api','apikey',1,'1200/5min',1,'["cloudflare","dns","workers","pages","cdn"]','/zones',8),
('Vercel API','Tecnologia','Deploy','Deploy e projetos do Vercel','https://api.vercel.com','https://vercel.com/docs/rest-api','bearer',1,'varies',1,'["vercel","deploy","serverless","nextjs"]','/v6/deployments',7),
('StackOverflow API','Tecnologia','Q&A','Perguntas e respostas de programação','https://api.stackexchange.com/2.3','https://api.stackexchange.com/docs','none',1,'300/day',1,'["stackoverflow","programação","Q&A","erros"]','/questions?order=desc&sort=votes&site=stackoverflow',8),
('Caniuse-api','Tecnologia','Web','Compatibilidade de features CSS/JS nos browsers','https://caniuse-api.surge.sh','https://github.com/nicedoc/caniuse-api','none',1,'unlimited',1,'["css","javascript","browser","compatibilidade","html5"]','/{feature}',7);

-- ─── SAÚDE & MEDICINA ─────────────────────────────────────────
INSERT OR IGNORE INTO apis (name,category,subcategory,description,base_url,docs_url,auth_type,is_free,rate_limit,https,tags,example_endpoint,quality_score) VALUES
('OpenFDA','Saúde','Medicamentos','Dados FDA: medicamentos, eventos adversos, recalls','https://api.fda.gov','https://open.fda.gov/apis','none',1,'240/min',1,'["fda","medicamentos","efeitos","recall","anvisa"]','/drug/label.json?search=aspirin&limit=1',8),
('Disease.sh (COVID-19)','Saúde','Epidemias','Dados COVID-19 e doenças por país','https://disease.sh/v3/covid-19','https://disease.sh','none',1,'unlimited',1,'["covid","pandemia","doença","casos","mortes"]','/countries/Brazil',8),
('MedlinePlus','Saúde','Informação','Informações médicas da biblioteca nacional EUA','https://wsearch.nlm.nih.gov/ws/query','https://medlineplus.gov/webservices.html','none',1,'unlimited',1,'["saúde","medicina","doença","tratamento","sintomas"]','?db=healthTopics&term=diabetes',7),
('Nutritionix','Saúde','Nutrição','Informações nutricionais de alimentos','https://trackapi.nutritionix.com/v2','https://developer.nutritionix.com','apikey',1,'500/day',1,'["nutrição","calorias","alimentos","dieta","proteína"]','/natural/nutrients',7);

-- ─── TRANSPORTE & LOGÍSTICA ───────────────────────────────────
INSERT OR IGNORE INTO apis (name,category,subcategory,description,base_url,docs_url,auth_type,is_free,rate_limit,https,tags,example_endpoint,quality_score) VALUES
('Correios FRETE','Logística','Frete','Cálculo de frete dos Correios','https://brasilapi.com.br/api','https://brasilapi.com.br/docs','none',1,'unlimited',1,'["correios","frete","cep","encomenda","pac","sedex"]','/correios/v1/frete',8),
('FIPE Veículos','Transporte','Veículos','Tabela FIPE: preços de carros, motos, caminhões','https://brasilapi.com.br/api','https://brasilapi.com.br/docs','none',1,'unlimited',1,'["fipe","carro","veículo","preço","tabela"]','/fipe/marcas/v1/carros',10),
('OpenSky Network','Transporte','Aviação','Rastreamento de voos em tempo real','https://opensky-network.org/api','https://openskynetwork.github.io/opensky-api','none',1,'400/day',1,'["voos","aviação","rastreamento","aeronave","ICAO"]','/states/all?lamin=-33&lamax=5&lomin=-73&lomax=-34',8),
('MotorAPI FIPE','Transporte','Veículos','Preços FIPE, modelos, anos de veículos','https://parallelum.com.br/fipe/api/v1','https://deividfortuna.github.io/fipe','none',1,'unlimited',1,'["fipe","carro","moto","caminhão","preço"]','/carros/marcas',9);

-- ─── EDUCAÇÃO & CONHECIMENTO ──────────────────────────────────
INSERT OR IGNORE INTO apis (name,category,subcategory,description,base_url,docs_url,auth_type,is_free,rate_limit,https,tags,example_endpoint,quality_score) VALUES
('Open Library','Educação','Livros','Catálogo de livros do Internet Archive','https://openlibrary.org/api','https://openlibrary.org/developers','none',1,'unlimited',1,'["livros","biblioteca","ISBN","autor","obra"]','/books?bibkeys=ISBN:9780140286397&format=json',9),
('Google Books API','Educação','Livros','Busca e dados de livros do Google','https://www.googleapis.com/books/v1','https://developers.google.com/books','none',1,'1000/day',1,'["livros","google","ISBN","preview","autor"]','/volumes?q=inteligencia+artificial',8),
('MusicBrainz','Educação','Música','Base de dados de músicas, artistas, álbuns','https://musicbrainz.org/ws/2','https://musicbrainz.org/doc/MusicBrainz_API','none',1,'1/sec',1,'["música","artista","álbum","faixa","gênero"]','/artist/?query=Beatles&fmt=json',8),
('QuoteSlate','Educação','Citações','Citações famosas por autor e tema','https://api.quotable.io','https://github.com/lukePeavey/quotable','none',1,'unlimited',1,'["citações","frases","motivação","autor"]','/quotes/random',8),
('DictionaryAPI','Educação','Dicionário','Definições, pronúncia, exemplos em inglês','https://api.dictionaryapi.dev/api/v2','https://dictionaryapi.dev','none',1,'unlimited',1,'["dicionário","definição","palavra","pronúncia","inglês"]','/entries/en/innovation',9);

-- ─── IA & MACHINE LEARNING GRATUITOS ─────────────────────────
INSERT OR IGNORE INTO apis (name,category,subcategory,description,base_url,docs_url,auth_type,is_free,rate_limit,https,tags,example_endpoint,quality_score) VALUES
('Hugging Face Inference','IA','Modelos','Modelos de ML gratuitos via API','https://api-inference.huggingface.co/models','https://huggingface.co/docs/api-inference','apikey',1,'varies',1,'["IA","NLP","modelos","sentiment","classificação","HuggingFace"]','/distilbert-base-uncased-finetuned-sst-2-english',9),
('Cloudflare Workers AI','IA','LLM','Llama, Mistral, Qwen, DeepSeek grátis no edge','https://api.cloudflare.com/client/v4/accounts/{id}/ai/run','https://developers.cloudflare.com/workers-ai','apikey',1,'10k neurons/day',1,'["llm","llama","mistral","edge","serverless","cloudflare"]','/@cf/meta/llama-3.1-8b-instruct',10),
('Groq API','IA','LLM','Inferência ultra-rápida Llama, Mixtral, Gemma','https://api.groq.com/openai/v1','https://console.groq.com/docs','apikey',1,'varies',1,'["llm","groq","llama","fast","inferência"]','/chat/completions',9),
('Google Gemini Free','IA','LLM','Gemini 1.5 Flash com tier gratuito generoso','https://generativelanguage.googleapis.com/v1beta','https://ai.google.dev/docs','apikey',1,'60/min free',1,'["gemini","google","LLM","multimodal","vision"]','/models/gemini-1.5-flash:generateContent',9),
('Mistral AI Free','IA','LLM','Mistral Large e outros modelos com tier free','https://api.mistral.ai/v1','https://docs.mistral.ai','apikey',1,'1 req/sec free',1,'["mistral","llm","código","português","europeu"]','/chat/completions',8),
('Together AI','IA','LLM','Llama, Falcon, BLOOM - $25 grátis no início','https://api.together.xyz/v1','https://docs.together.ai','apikey',1,'varies',1,'["llm","open-source","llama","falcon","mistral"]','/chat/completions',8),
('Cohere Free','IA','NLP','Embed, classify, generate - tier gratuito','https://api.cohere.ai/v1','https://docs.cohere.com','apikey',1,'100/min free',1,'["nlp","embed","classificação","geração","cohere"]','/generate',8),
('OpenRouter','IA','LLM Gateway','Gateway para 100+ LLMs com modelos gratuitos','https://openrouter.ai/api/v1','https://openrouter.ai/docs','apikey',1,'varies',1,'["llm","gateway","modelos-gratuitos","openai","claude","gemma"]','/chat/completions',9);

-- ─── DADOS ABERTOS BRASIL ─────────────────────────────────────
INSERT OR IGNORE INTO apis (name,category,subcategory,description,base_url,docs_url,auth_type,is_free,rate_limit,https,tags,example_endpoint,quality_score) VALUES
('Dados Abertos MEC','Governo','Educação','Escolas, cursos, notas ENEM/ENADE','https://dadosabertos.mec.gov.br/api','https://dadosabertos.mec.gov.br','none',1,'unlimited',1,'["mec","enem","escola","curso","educação","brasil"]','/datastore/search?resource_id=xyz',7),
('Portal Transparência','Governo','Federal','Servidores, licitações, despesas do governo federal','http://api.portaldatransparencia.gov.br/api-de-dados','https://api.portaldatransparencia.gov.br','apikey',1,'unlimited',1,'["governo","transparência","licitação","servidor","despesa"]','/licitacoes?pagina=1',8),
('ReceitaWS','Governo','Fiscal','CNPJ, CPF, CEP da Receita Federal','https://www.receitaws.com.br/v1','https://receitaws.com.br','none',1,'3/min',1,'["cnpj","cpf","cep","receita-federal","empresa"]','/cnpj/{cnpj}',9),
('Diário Oficial (DOU)','Governo','Legislação','Publicações do Diário Oficial da União','https://www.in.gov.br/servicos/buscar-diario-oficial','https://www.in.gov.br/api','none',1,'unlimited',1,'["dou","diário-oficial","legislação","portaria","decreto"]','/pesquisa/api/pesquisa',7),
('Câmara dos Deputados','Governo','Legislação','Proposições, votações, deputados','https://dadosabertos.camara.leg.br/api/v2','https://dadosabertos.camara.leg.br/swagger/api.html','none',1,'unlimited',1,'["câmara","deputados","votações","projetos","legislação"]','/proposicoes?ano=2024',8),
('INEP Microdados','Governo','Educação','ENEM, Censo Escolar, ENADE microdados','https://enem.api.fabrica.io','https://github.com/fabricadesoftware-ifc','none',1,'unlimited',1,'["enem","inep","escola","vestibular","notas"]','/questoes',7);

-- ─── UTILIDADES ───────────────────────────────────────────────
INSERT OR IGNORE INTO apis (name,category,subcategory,description,base_url,docs_url,auth_type,is_free,rate_limit,https,tags,example_endpoint,quality_score) VALUES
('QR Code Generator','Utilidades','Geração','Gera QR codes em PNG/SVG grátis','https://api.qrserver.com/v1','https://goqr.me/api','none',1,'unlimited',1,'["qrcode","geração","png","svg","link"]','/create-qr-code/?size=200x200&data=https://sixtech.com',10),
('UrlScan.io','Utilidades','Segurança','Análise de URLs suspeitas e segurança web','https://urlscan.io/api/v1','https://urlscan.io/docs/api','apikey',1,'5000/mo free',1,'["url","segurança","phishing","scan","malware"]','/scan',7),
('Short.io','Utilidades','URL','Encurtador de URL com analytics','https://api.short.io/links','https://developers.short.io','apikey',1,'unlimited free',1,'["url","encurtador","analytics","link","redirect"]','/links',7),
('Random User Generator','Utilidades','Dados fake','Gera usuários fictícios para testes','https://randomuser.me/api','https://randomuser.me/documentation','none',1,'unlimited',1,'["fake","usuário","teste","mock","dados"]','/?nat=br&results=5',10),
('JSONPlaceholder','Utilidades','Dados fake','API fake para prototipagem — posts, users, todos','https://jsonplaceholder.typicode.com','https://jsonplaceholder.typicode.com/guide','none',1,'unlimited',1,'["fake","json","mock","prototipagem","rest"]','/posts?_limit=5',10),
('Lorem Picsum','Utilidades','Imagens','Imagens placeholder aleatórias','https://picsum.photos','https://picsum.photos','none',1,'unlimited',1,'["imagem","placeholder","lorem","foto","random"]','/seed/42/400/300',10),
('Dicebear Avatars','Utilidades','Imagens','Avatares SVG únicos por seed','https://api.dicebear.com/7.x','https://www.dicebear.com/introduction','none',1,'unlimited',1,'["avatar","imagem","SVG","usuário","identicon"]','/initials/svg?seed=João',9),
('TimeAPI.io','Utilidades','Tempo','Hora atual por timezone','https://timeapi.io/api','https://timeapi.io','none',1,'unlimited',1,'["hora","timezone","data","UTC","GMT"]','/Time/current/zone?timeZone=America/Sao_Paulo',9),
('Wordnik API','Utilidades','Texto','Dicionário, sinônimos, exemplos em inglês','https://api.wordnik.com/v4','https://developer.wordnik.com','apikey',1,'100/min',1,'["dicionário","sinônimo","definição","exemplo","inglês"]','/word.json/{word}/definitions',7),
('icanhazdadjoke','Utilidades','Entretenimento','Piadas em inglês via API simples','https://icanhazdadjoke.com','https://icanhazdadjoke.com/api','none',1,'unlimited',1,'["piada","humor","entretenimento","inglês"]','/',8);

-- ─── REDES SOCIAIS & COMUNICAÇÃO ──────────────────────────────
INSERT OR IGNORE INTO apis (name,category,subcategory,description,base_url,docs_url,auth_type,is_free,rate_limit,https,tags,example_endpoint,quality_score) VALUES
('Telegram Bot API','Comunicação','Bot','Envio de mensagens, fotos, documentos via bots','https://api.telegram.org/bot{TOKEN}','https://core.telegram.org/bots/api','apikey',1,'30/sec',1,'["telegram","bot","mensagem","notificação","chat"]','/sendMessage',10),
('Discord API','Comunicação','Bot','Bots, webhooks, servidores Discord','https://discord.com/api/v10','https://discord.com/developers/docs','bearer',1,'50/sec',1,'["discord","bot","webhook","servidor","comunidade"]','/channels/{id}/messages',9),
('WhatsApp Business API','Comunicação','Mensagem','Envio de mensagens WhatsApp (free trial)','https://graph.facebook.com/v17.0','https://developers.facebook.com/docs/whatsapp','apikey',1,'1000/mo free',1,'["whatsapp","mensagem","business","notificação"]','/{phone_id}/messages',7);

-- ─── E-COMMERCE & NEGÓCIOS ────────────────────────────────────
INSERT OR IGNORE INTO apis (name,category,subcategory,description,base_url,docs_url,auth_type,is_free,rate_limit,https,tags,example_endpoint,quality_score) VALUES
('Mercado Livre API','E-commerce','Marketplace','Produtos, preços, vendedores do ML','https://api.mercadolibre.com','https://developers.mercadolivre.com.br','oauth',1,'varies',1,'["mercadolivre","produtos","preços","vendedor","marketplace"]','/sites/MLB/search?q=notebook',10),
('Shopify API','E-commerce','Loja','Gestão de loja Shopify','https://{store}.myshopify.com/admin/api/2024-01','https://shopify.dev/docs/api','apikey',1,'40/sec',1,'["shopify","loja","produto","pedido","estoque"]','/products.json',8),
('Stripe API','E-commerce','Pagamento','Pagamentos, checkout, assinaturas','https://api.stripe.com/v1','https://stripe.com/docs/api','apikey',1,'100/sec',1,'["stripe","pagamento","cobrança","cartão","assinatura"]','/charges',9),
('Pagseguro','E-commerce','Pagamento','Pagamentos brasileiros Pagseguro','https://api.pagseguro.com','https://dev.pagseguro.uol.com.br','apikey',1,'varies',1,'["pagseguro","pagamento","pix","cartão","brasil"]','/charges',7);

-- ─── BOTS PADRÃO DO SISTEMA ───────────────────────────────────
INSERT OR IGNORE INTO bots (id,name,emoji,description,category,system_prompt,model,apis_linked,knowledge_topics) VALUES
('master-bot','Master KnowledgeBot','🧠','Orquestrador principal — roteia perguntas para bots especializados e acumula conhecimento','Orquestração',
'Você é o Master KnowledgeBot da SixTech. Sua missão: 1) Consultar o banco de conhecimento local PRIMEIRO antes de usar IA, 2) Identificar qual API gratuita pode responder a pergunta do usuário, 3) Acumular cada resposta no banco de dados, 4) Rotear para bots especializados. Responda SEMPRE em português.',
'balanced','[]','["geral","orquestração","roteamento"]'),

('finance-bot','Finance Bot','💰','Especialista em finanças — câmbio, cripto, ações, CNPJ, SELIC','Finanças',
'Você é o Finance Bot da SixTech. Especialista em: câmbio (AwesomeAPI), cripto (CoinGecko), ações (Alpha Vantage), dados brasileiros (BrasilAPI/BACEN). SEMPRE consulte o cache antes de chamar APIs. Acumule conhecimento financeiro no banco de dados. Responda em português.',
'reason','[1,2,3,4,5,6,7,8,9,10]','["câmbio","cripto","ações","cnpj","selic","ipca"]'),

('geo-bot','Geo & Clima Bot','🌍','Localização, clima, CEP, países, geolocalização IP','Localização',
'Você é o Geo Bot da SixTech. APIs: Open-Meteo (clima), ViaCEP (endereços), IBGE (dados Brasil), IP-API (geolocalização). Sempre salve dados consultados no cache. Responda em português.',
'balanced','[11,12,13,14,15,16,17,18,19]','["clima","cep","localização","ip","países","ibge"]'),

('dev-bot','Dev Knowledge Bot','💻','APIs de tecnologia, GitHub, NPM, Stack Overflow, documentação','Tecnologia',
'Você é o Dev Bot da SixTech. Especialista em: GitHub API, NPM, PyPI, StackOverflow, Cloudflare Workers AI. Acumule snippets de código, exemplos e soluções no banco. Responda em português com código quando necessário.',
'coder','[22,23,24,25,26,27,28]','["github","npm","código","apis","cloudflare","javascript","python"]'),

('data-bot','Open Data Bot','📊','Dados abertos do governo, Wikipedia, notícias, pesquisa','Dados',
'Você é o Data Bot da SixTech. Fontes: Wikipedia, HackerNews, Portal Transparência, IBGE, Câmara dos Deputados. Extraia e salve conhecimento estruturado no banco de dados para consultas futuras. Responda em português.',
'powerful','[30,31,32,33,34]','["dados-abertos","governo","wikipedia","notícias","pesquisa"]'),

('util-bot','Utilities Bot','🔧','QR codes, CEP, FIPE, validações, dados mock para desenvolvimento','Utilidades',
'Você é o Utilities Bot da SixTech. Especialista em: BrasilAPI, ViaCEP, FIPE, QR Code, Random User, JSONPlaceholder. Gere exemplos e salve templates de uso no banco. Responda em português.',
'fast','[13,37,38,39,40,41,42,43,44]','["cep","fipe","qrcode","mock","validação","utilidades"]');

-- ─── CONHECIMENTO INICIAL (seed do LLM próprio) ───────────────
INSERT OR IGNORE INTO knowledge_base (bot_id,topic,category,subcategory,content,source_type,confidence,keywords) VALUES
('finance-bot','Como consultar câmbio BRL/USD','Finanças','Câmbio',
'A AwesomeAPI oferece cotações em tempo real GRÁTIS sem autenticação. Endpoint: GET https://economia.awesomeapi.com.br/json/last/USD-BRL. Retorna: bid (compra), ask (venda), pctChange (variação %). Também suporta: EUR-BRL, BTC-BRL, ETH-BRL. Sem limite de requisições.',
'manual',1.0,'["câmbio","usd","brl","awesomeapi","cotação","grátis"]'),

('finance-bot','Consulta CNPJ gratuita','Finanças','Fiscal',
'BrasilAPI: GET https://brasilapi.com.br/api/cnpj/v1/{CNPJ}. Retorna razão social, endereço, situação cadastral, porte, CNAE. Também disponível: ReceitaWS (3 req/min). Sem autenticação necessária.',
'manual',1.0,'["cnpj","receita","empresa","brasilapi","grátis"]'),

('finance-bot','Taxa SELIC via BACEN','Finanças','Banco Central',
'BACEN API: GET https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/1?formato=json. Retorna a taxa SELIC atual. Série 11 = SELIC. Série 433 = IPCA. Série 1 = BM&F. Totalmente gratuita e oficial.',
'manual',1.0,'["selic","ipca","bacen","banco-central","juros","grátis"]'),

('geo-bot','Previsão do tempo sem API key','Clima','Previsão',
'Open-Meteo: GRÁTIS, sem autenticação. GET https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&current_weather=true&hourly=temperature_2m,precipitation. Suporta temperatura, precipitação, vento, umidade. Até 10.000 req/dia gratuitos.',
'manual',1.0,'["clima","tempo","open-meteo","previsão","grátis","sem-api-key"]'),

('dev-bot','Workers AI modelos gratuitos','Tecnologia','IA',
'Cloudflare Workers AI: Modelos gratuitos disponíveis: @cf/meta/llama-3.1-8b-instruct-fp8, @cf/meta/llama-3.3-70b-instruct-fp8-fast, @cf/deepseek-ai/deepseek-r1-distill-qwen-32b, @cf/qwen/qwen2.5-coder-32b-instruct, @cf/moonshotai/kimi-k2.6. Plano gratuito: 10k "neurons" por dia. Ideal para Workers e Pages.',
'manual',1.0,'["cloudflare","workers-ai","llama","deepseek","kimi","grátis","edge"]'),

('master-bot','Estratégia cache-first','Sistema','Arquitetura',
'Para economizar chamadas a APIs externas: 1) Normalizar a query (lowercase, sem acentos), 2) Gerar hash MD5/SHA, 3) Buscar em cache_queries, 4) Se hit: retornar do banco (0 custo), 5) Se miss: chamar API + salvar no cache. Redução típica de 60-80% em chamadas externas.',
'manual',1.0,'["cache","otimização","hash","economia","banco-de-dados"]');

-- ─── FONTES DE CRAWL PRÉ-CONFIGURADAS ─────────────────────────
INSERT OR IGNORE INTO crawl_sources (url,name,category,auto_crawl,status) VALUES
('https://github.com/public-apis/public-apis/raw/master/README.md','Public APIs GitHub','Catálogo',1,'pending'),
('https://brasilapi.com.br/docs','BrasilAPI Docs','Brasil',0,'pending'),
('https://dadosabertos.camara.leg.br/swagger/api.html','Câmara Aberta API','Governo',0,'pending'),
('https://dadosabertos.bcb.gov.br','BACEN Dados Abertos','Finanças',0,'pending'),
('https://servicodados.ibge.gov.br/api/docs','IBGE API Docs','Dados',0,'pending');
