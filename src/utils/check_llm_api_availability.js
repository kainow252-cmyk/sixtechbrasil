async function checkLlmApiAvailability(baseUrl, apiKey = '', model, type = 'openai', apiVersion = '') {
  if (!baseUrl && !['gemini', 'claude'].includes(type.toLowerCase())) {
    return { status: false, message: 'Base URL is required.' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let apiUrl = '';
  let headers = { 'Content-Type': 'application/json' };
  let body = {};

  try {
    const providerType = (type || 'openai').toLowerCase();

    switch (providerType) {
      case 'azure':
        apiUrl = `${baseUrl.replace(/\/$/, '')}/openai/deployments/${model}/chat/completions?api-version=${apiVersion || '2023-05-15'}`;
        headers['api-key'] = apiKey;
        body = {
          messages: [{ role: "user", content: "hello" }],
          max_tokens: 5
        };
        break;

      case 'gemini':
        apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        body = {
          contents: [{ parts: [{ text: "hello" }] }]
        };
        break;

      case 'claude':
        apiUrl = 'https://api.anthropic.com/v1/messages';
        headers['x-api-key'] = apiKey;
        headers['anthropic-version'] = '2023-06-01';
        body = {
          model: model,
          messages: [{ role: "user", content: "hello" }],
          max_tokens: 5
        };
        break;

      case 'openrouter':
        apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiKey}`;
        body = {
          model: model,
          messages: [{ role: "user", content: "hello" }],
          max_tokens: 5
        };
        break;

      default: // OpenAI compatible
        apiUrl = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
        headers['Authorization'] = `Bearer ${apiKey}`;
        body = {
          model: model,
          messages: [{ role: "user", content: "hello" }],
          max_tokens: 5
        };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      
      // Validation logic per provider
      let success = false;
      if (providerType === 'gemini') {
        success = !!(data && data.candidates && data.candidates.length > 0);
      } else if (providerType === 'claude') {
        success = !!(data && data.content && data.content.length > 0);
      } else {
        success = !!(data && data.choices && data.choices.length > 0);
      }

      if (success) {
        return { status: true, message: 'LLM API call succeeded.' };
      } else {
        return { status: false, message: 'LLM API call succeeded, but response data is not as expected.', data };
      }
    } else {
      const errorText = await response.text();
      return { status: false, message: `LLM API call failed, HTTP status: ${response.status}, error: ${errorText}` };
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      return { status: false, message: `LLM API call timed out` };
    } else {
      return { status: false, message: `Network or other error: ${error.message}` };
    }
  }
}

module.exports = exports = checkLlmApiAvailability;
