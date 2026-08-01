/*
 * SHΞN zero GIT - Cloudflare Pages Function
 * API Proxy for GitHub, AI Models, and Serper
 *
 * Environment Variables Required:
 * - GITHUB_TOKEN
 * - GEMINI_API_KEY
 * - DEEPSEEK_API_KEY
 * - OPENAI_API_KEY
 * - SERPER_API_KEY
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '');

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    // Route handling
    if (path.startsWith('github/')) {
      return await handleGitHub(path.replace('github/', ''), request, env);
    } else if (path.startsWith('gemini/')) {
      return await handleGemini(path.replace('gemini/', ''), request, env);
    } else if (path.startsWith('deepseek/')) {
      return await handleDeepSeek(path.replace('deepseek/', ''), request, env);
    } else if (path.startsWith('openai/')) {
      return await handleOpenAI(path.replace('openai/', ''), request, env);
    } else if (path.startsWith('serper/')) {
      return await handleSerper(path.replace('serper/', ''), request, env);
    } else {
      return new Response(JSON.stringify({ error: 'Unknown endpoint' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// GitHub API Handler
async function handleGitHub(endpoint, request, env) {
  if (!env.GITHUB_TOKEN) {
    return new Response(JSON.stringify({ error: 'GITHUB_TOKEN not configured' }), { status: 500 });
  }

  const url = endpoint.startsWith('http') ? endpoint : `https://api.github.com/${endpoint}`;
  const headers = {
    'Authorization': `token ${env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
  };

  if (request.headers.get('content-type')) {
    headers['Content-Type'] = request.headers.get('content-type');
  }

  const response = await fetch(url, {
    method: request.method,
    headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// Gemini API Handler
async function handleGemini(endpoint, request, env) {
  if (!env.GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), { status: 500 });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${env.GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: request.body,
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// DeepSeek API Handler
async function handleDeepSeek(endpoint, request, env) {
  if (!env.DEEPSEEK_API_KEY) {
    return new Response(JSON.stringify({ error: 'DEEPSEEK_API_KEY not configured' }), { status: 500 });
  }

  const url = 'https://api.deepseek.com/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: request.body,
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// OpenAI API Handler
async function handleOpenAI(endpoint, request, env) {
  if (!env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not configured' }), { status: 500 });
  }

  const url = 'https://api.openai.com/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: request.body,
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// Serper API Handler
async function handleSerper(endpoint, request, env) {
  if (!env.SERPER_API_KEY) {
    return new Response(JSON.stringify({ error: 'SERPER_API_KEY not configured' }), { status: 500 });
  }

  const url = 'https://google.serper.dev/search';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': env.SERPER_API_KEY,
    },
    body: request.body,
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
