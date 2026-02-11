// functions/api/links.js
export async function onRequest(context) {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  
  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Simple auth (optional)
  const authToken = env.API_TOKEN;
  if (authToken) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${authToken}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
  
  try {
    switch (request.method) {
      case 'GET':
        return await getLinks(env, corsHeaders);
      case 'POST':
        return await updateLinks(request, env, corsHeaders);
      case 'DELETE':
        return await deleteLinks(request, env, corsHeaders);
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function getLinks(env, corsHeaders) {
  let links = getDefaultLinks();
  
  if (env.AFFILIATE_KV) {
    const storedLinks = await env.AFFILIATE_KV.get('affiliate_links', 'json');
    if (storedLinks) {
      links = storedLinks;
    }
  } else if (env.AFFILIATE_LINKS) {
    links = JSON.parse(env.AFFILIATE_LINKS);
  }
  
  return new Response(JSON.stringify({ 
    success: true, 
    links: links,
    count: links.length 
  }), {
    headers: { 
      ...corsHeaders, 
      'Content-Type': 'application/json' 
    }
  });
}

async function updateLinks(request, env, corsHeaders) {
  if (!env.AFFILIATE_KV) {
    return new Response(JSON.stringify({ 
      error: 'KV storage not configured' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  const body = await request.json();
  
  if (!body.links || !Array.isArray(body.links)) {
    return new Response(JSON.stringify({ 
      error: 'Invalid links format. Must be an array.' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  // Validate links
  const validLinks = body.links.filter(link => 
    typeof link === 'string' && 
    link.startsWith('https://') &&
    link.includes('shopee.co.id')
  );
  
  if (validLinks.length === 0) {
    return new Response(JSON.stringify({ 
      error: 'No valid Shopee links provided' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  await env.AFFILIATE_KV.put('affiliate_links', JSON.stringify(validLinks));
  
  // Reset rotation index
  await env.AFFILIATE_KV.put('last_index', '0');
  
  return new Response(JSON.stringify({ 
    success: true, 
    message: `Updated ${validLinks.length} links`,
    links: validLinks 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function deleteLinks(request, env, corsHeaders) {
  if (!env.AFFILIATE_KV) {
    return new Response(JSON.stringify({ 
      error: 'KV storage not configured' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  await env.AFFILIATE_KV.delete('affiliate_links');
  await env.AFFILIATE_KV.delete('last_index');
  
  return new Response(JSON.stringify({ 
    success: true, 
    message: 'All links deleted. System will use default links.' 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
