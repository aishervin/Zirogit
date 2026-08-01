/*
 * SHΞN zero GIT - Cloudflare Pages Function
 * API Proxy for GitHub, AI Models, Serper, and Turnstile
 * 
 * Environment Variables Required:
 * - GITHUB_TOKEN
 * - GEMINI_API_KEY
 * - DEEPSEEK_API_KEY
 * - OPENAI_API_KEY
 * - SERPER_API_KEY
 * - TURNSTILE_SECRET
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
    } else if (path === 'turnstile/verify') {
      return await handleTurnstileVerify(request, env);
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

  // Copy content-type if present
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
    headers: {
      'Content-Type': 'application/json',
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

// Turnstile Verify Handler
async function handleTurnstileVerify(request, env) {
  if (!env.TURNSTILE_SECRET) {
    return new Response(JSON.stringify({ error: 'TURNSTILE_SECRET not configured' }), { status: 500 });
  }

  try {
    const formData = await request.formData();
    const token = formData.get('cf-turnstile-response');
    
    // Get client IP from headers
    const clientIp = request.headers.get('CF-Connecting-IP') || 
                     request.headers.get('X-Forwarded-For') || 
                     'unknown';

    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'Missing turnstile token' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Canonical siteverify call
    const siteverifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const params = new URLSearchParams({
      secret: env.TURNSTILE_SECRET,
      response: token,
      remoteip: clientIp,
    });

    const response = await fetch(siteverifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`siteverify returned ${response.status}`);
    }

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 403,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
