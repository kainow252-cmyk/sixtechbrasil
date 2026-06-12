-- Seed: APIs públicas gratuitas catalogadas
INSERT OR IGNORE INTO public_apis (name,category,description,base_url,docs_url,auth_type,example,tags,quality) VALUES
-- FINANÇAS
('AwesomeAPI Câmbio','Finanças','Cotações em tempo real BRL/USD/EUR — sem autenticação','https://economia.awesomeapi.com.br','https://docs.awesomeapi.com.br','none','/json/last/USD-BRL','["câmbio","moedas","brl","usd","eur","real-time"]',10),
('CoinGecko','Finanças','Preços de criptomoedas, market cap, histórico','https://api.coingecko.com/api/v3','https://www.coingecko.com/api/docs','none','/simple/price?ids=bitcoin&vs_currencies=brl','["cripto","bitcoin","ethereum","defi"]',10),
('BrasilAPI','Finanças','CEP, CNPJ, bancos, feriados, FIPE — tudo gratuito','https://brasilapi.com.br/api','https://brasilapi.com.br/docs','none','/cnpj/v1/11222333000181','["cnpj","cep","banco","feriado","brasil","fipe"]',10),
('BACEN API','Finanças','Banco Central: SELIC, IPCA, PTAX, câmbio oficial','https://api.bcb.gov.br/dados/serie','https://dadosabertos.bcb.gov.br','none','/bcdata.sgs.11/dados/ultimos/1?formato=json','["selic","ipca","ptax","banco-central"]',10),
('Binance Public','Finanças','Preços e dados de trading cripto — sem key','https://api.binance.com/api/v3','https://binance-docs.github.io','none','/ticker/price?symbol=BTCUSDT','["binance","cripto","trading"]',9),
('Alpha Vantage','Finanças','Ações, forex, cripto e indicadores técnicos','https://www.alphavantage.co/query','https://www.alphavantage.co/documentation','apikey','?function=TIME_SERIES_DAILY&symbol=PETR4.SA&apikey=KEY','["ações","forex","indicadores","RSI","MACD"]',8),
('FIPE Veículos','Finanças','Tabela FIPE: carros, motos, caminhões','https://parallelum.com.br/fipe/api/v1','https://deividfortuna.github.io/fipe','none','/carros/marcas','["fipe","carro","veículo","preço"]',9),
-- CLIMA
('Open-Meteo','Clima','Previsão do tempo GRÁTIS sem API key — 10k req/dia','https://api.open-meteo.com/v1','https://open-meteo.com/en/docs','none','/forecast?latitude=-23.55&longitude=-46.63&current_weather=true','["clima","tempo","previsão","temperatura","chuva"]',10),
('OpenWeatherMap','Clima','Clima atual e previsão 5 dias','https://api.openweathermap.org/data/2.5','https://openweathermap.org/api','apikey','/weather?q=São Paulo&appid=KEY&lang=pt_br','["clima","tempo","previsão","mapa"]',9),
-- LOCALIZAÇÃO
('ViaCEP','Localização','CEP brasileiro — endereços completos','https://viacep.com.br/ws','https://viacep.com.br','none','/{cep}/json','["cep","endereço","brasil","correios"]',10),
('IBGE API','Localização','Municípios, estados, população — dados oficiais','https://servicodados.ibge.gov.br/api/v1','https://servicodados.ibge.gov.br/api/docs','none','/localidades/estados','["ibge","município","estado","brasil","população"]',10),
('IP-API','Localização','Geolocalização por IP — país, cidade, ISP','http://ip-api.com/json','https://ip-api.com/docs','none','/json/177.79.68.1?lang=pt-BR','["ip","geolocalização","país","cidade"]',9),
('RestCountries','Localização','Dados de todos os países do mundo','https://restcountries.com/v3.1','https://restcountries.com','none','/all?fields=name,capital,currencies','["países","moedas","idiomas","bandeiras"]',9),
-- TECNOLOGIA
('GitHub API','Tecnologia','Repositórios, issues, usuários do GitHub','https://api.github.com','https://docs.github.com/en/rest','none','/search/repositories?q=public-api&sort=stars','["github","repositórios","código","open-source"]',10),
('NPM Registry','Tecnologia','Dados de pacotes NPM','https://registry.npmjs.org','https://github.com/npm/registry','none','/{package}','["npm","javascript","pacotes","node"]',9),
('StackOverflow','Tecnologia','Perguntas e respostas de programação','https://api.stackexchange.com/2.3','https://api.stackexchange.com/docs','none','/questions?order=desc&sort=votes&site=stackoverflow','["stackoverflow","programação","Q&A","erros"]',8),
-- IA GRATUITA
('Cloudflare Workers AI','IA','Llama, DeepSeek, Qwen, Kimi — 10k neurons/dia grátis','https://api.cloudflare.com/client/v4/accounts/{id}/ai/run','https://developers.cloudflare.com/workers-ai','apikey','/@cf/meta/llama-3.1-8b-instruct','["llm","llama","deepseek","edge","serverless","cloudflare"]',10),
('Groq API','IA','Inferência ultra-rápida Llama, Mixtral, Gemma','https://api.groq.com/openai/v1','https://console.groq.com/docs','apikey','/chat/completions','["llm","groq","llama","fast","inferência"]',9),
('Google Gemini Free','IA','Gemini 1.5 Flash — tier gratuito generoso','https://generativelanguage.googleapis.com/v1beta','https://ai.google.dev/docs','apikey','/models/gemini-1.5-flash:generateContent','["gemini","google","LLM","multimodal","vision"]',9),
('Hugging Face Inference','IA','Modelos de ML gratuitos via API','https://api-inference.huggingface.co/models','https://huggingface.co/docs/api-inference','apikey','/distilbert-base-uncased-finetuned-sst-2-english','["IA","NLP","modelos","sentiment","HuggingFace"]',9),
('OpenRouter','IA','Gateway para 100+ LLMs — modelos gratuitos disponíveis','https://openrouter.ai/api/v1','https://openrouter.ai/docs','apikey','/chat/completions','["llm","gateway","modelos-gratuitos","gemma","mistral"]',9),
-- NOTÍCIAS & CONHECIMENTO
('Wikipedia API','Conhecimento','Busca e conteúdo da Wikipedia em PT','https://pt.wikipedia.org/api/rest_v1','https://en.wikipedia.org/api/rest_v1','none','/page/summary/Inteligência_artificial','["wikipedia","enciclopédia","artigos","conhecimento"]',10),
('HackerNews','Conhecimento','Notícias e discussões de tecnologia','https://hacker-news.firebaseio.com/v0','https://github.com/HackerNews/API','none','/topstories.json','["hackernews","tech","startup","IA"]',9),
('Dev.to API','Conhecimento','Artigos de programação — sem autenticação','https://dev.to/api','https://developers.forem.com/api','none','/articles?top=1&per_page=10','["dev","programação","artigos","tecnologia"]',9),
-- GOVERNO BRASIL
('Portal Transparência','Governo','Servidores, licitações, despesas federais','http://api.portaldatransparencia.gov.br/api-de-dados','https://api.portaldatransparencia.gov.br','apikey','/licitacoes?pagina=1','["governo","transparência","licitação","servidor"]',8),
('Câmara dos Deputados','Governo','Proposições, votações, deputados','https://dadosabertos.camara.leg.br/api/v2','https://dadosabertos.camara.leg.br/swagger/api.html','none','/proposicoes?ano=2024','["câmara","deputados","votações","legislação"]',8),
-- UTILIDADES
('QR Code Generator','Utilidades','Gera QR codes em PNG/SVG grátis — sem key','https://api.qrserver.com/v1','https://goqr.me/api','none','/create-qr-code/?size=200x200&data=https://sixtech.com','["qrcode","geração","png","svg","link"]',10),
('Random User','Utilidades','Gera usuários fictícios para testes — sem key','https://randomuser.me/api','https://randomuser.me/documentation','none','/?nat=br&results=5','["fake","usuário","teste","mock","dados"]',10),
('JSONPlaceholder','Utilidades','API fake para prototipagem — posts, users, todos','https://jsonplaceholder.typicode.com','https://jsonplaceholder.typicode.com/guide','none','/posts?_limit=5','["fake","json","mock","prototipagem","rest"]',10),
('Telegram Bot API','Comunicação','Envio de mensagens, fotos, documentos via bots','https://api.telegram.org/bot{TOKEN}','https://core.telegram.org/bots/api','apikey','/sendMessage','["telegram","bot","mensagem","notificação"]',10),
('Mercado Livre API','E-commerce','Produtos, preços, vendedores','https://api.mercadolibre.com','https://developers.mercadolivre.com.br','oauth','/sites/MLB/search?q=notebook','["mercadolivre","produtos","preços","marketplace"]',10);

-- Conhecimento inicial semeado
INSERT OR IGNORE INTO knowledge (agent_id,topic,category,content,source_type,confidence,keywords) VALUES
('orchestrator','Como usar AwesomeAPI para câmbio','Finanças','GET https://economia.awesomeapi.com.br/json/last/USD-BRL — retorna bid(compra), ask(venda), pctChange(variação%). Sem autenticação. Suporta EUR-BRL, BTC-BRL, ETH-BRL. Sem limite de requisições.','manual',1.0,'["câmbio","usd","brl","awesomeapi","grátis"]'),
('fin-controller','Como consultar CNPJ grátis','Finanças','BrasilAPI: GET https://brasilapi.com.br/api/cnpj/v1/{CNPJ}. Retorna razão social, endereço, situação cadastral, porte, CNAE. Sem autenticação necessária.','manual',1.0,'["cnpj","receita","empresa","brasilapi"]'),
('fin-controller','Taxa SELIC e IPCA via BACEN','Finanças','BACEN API: GET https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/1?formato=json (SELIC). Série 433 = IPCA. Série 1 = BM&F. Totalmente gratuita e oficial.','manual',1.0,'["selic","ipca","bacen","banco-central","juros"]'),
('orchestrator','Previsão do tempo sem API key','Clima','Open-Meteo: GRÁTIS, sem autenticação. GET https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&current_weather=true Suporta temperatura, precipitação, vento. Até 10.000 req/dia.','manual',1.0,'["clima","tempo","open-meteo","previsão","grátis"]'),
('developer','Workers AI modelos gratuitos','Tecnologia','Cloudflare Workers AI free tier: @cf/meta/llama-3.1-8b-instruct-fp8, @cf/meta/llama-3.3-70b-instruct-fp8-fast, @cf/deepseek-ai/deepseek-r1-distill-qwen-32b, @cf/qwen/qwen2.5-coder-32b-instruct, @cf/moonshotai/kimi-k2.6. Plano gratuito: 10k "neurons" por dia.','manual',1.0,'["cloudflare","workers-ai","llama","deepseek","kimi","grátis"]'),
('orchestrator','Estratégia cache-first para economizar','Sistema','1) Normalizar a query (lowercase, sem acentos), 2) Gerar hash SHA-256, 3) Buscar em query_cache, 4) Se hit: retornar do banco (0 custo), 5) Se miss: chamar IA + salvar no cache. Redução típica de 60-80% em chamadas externas.','manual',1.0,'["cache","otimização","hash","economia","banco"]');
