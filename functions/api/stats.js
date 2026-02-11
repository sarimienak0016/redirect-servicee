// functions/api/stats.js
export async function onRequest(context) {
  const { request, env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (!env.ANALYTICS_KV) {
    return new Response(JSON.stringify({ 
      error: 'Analytics not enabled' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days')) || 7;
    
    const stats = await getAnalytics(env, days);
    
    return new Response(JSON.stringify({
      success: true,
      period: `${days} days`,
      ...stats
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to get analytics',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function getAnalytics(env, days) {
  const result = {
    totalClicks: 0,
    affiliateClicks: 0,
    directClicks: 0,
    byDate: {},
    byCountry: {},
    byLink: {},
    uniqueIps: new Set()
  };
  
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    
    const dailyStats = await env.ANALYTICS_KV.get(`stats_${dateKey}`, 'json');
    
    if (dailyStats) {
      result.byDate[dateKey] = dailyStats;
      result.totalClicks += dailyStats.total || 0;
      result.affiliateClicks += dailyStats.affiliate || 0;
      result.directClicks += dailyStats.direct || 0;
      
      // Aggregate country stats
      Object.entries(dailyStats.byCountry || {}).forEach(([country, count]) => {
        result.byCountry[country] = (result.byCountry[country] || 0) + count;
      });
      
      // Aggregate link stats
      Object.entries(dailyStats.byLink || {}).forEach(([link, count]) => {
        result.byLink[link] = (result.byLink[link] || 0) + count;
      });
    }
  }
  
  // Get unique IPs from recent clicks
  const allClicks = await env.ANALYTICS_KV.list({ prefix: 'click_' });
  
  for (const key of allClicks.keys) {
    const clickData = await env.ANALYTICS_KV.get(key.name, 'json');
    if (clickData && clickData.ip) {
      result.uniqueIps.add(clickData.ip);
    }
  }
  
  result.uniqueVisitors = result.uniqueIps.size;
  delete result.uniqueIps;
  
  // Convert to array for frontend
  result.byLinkArray = Object.entries(result.byLink)
    .map(([link, count]) => ({ link, count }))
    .sort((a, b) => b.count - a.count);
  
  result.byCountryArray = Object.entries(result.byCountry)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);
  
  return result;
}
