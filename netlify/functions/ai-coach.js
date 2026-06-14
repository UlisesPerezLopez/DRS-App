/**
 * Netlify Function: ai-coach
 * Proxy seguro (Backend-for-Frontend) en JavaScript nativo (CommonJS)
 * para comunicarse con la API de OpenRouter.
 */

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    const { messages } = JSON.parse(event.body);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://serene-lokum-76beb2.netlify.app/',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model: 'google/gemini-1.5-flash',
        messages: messages
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('AI Function Error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Server error' }) 
    };
  }
};
