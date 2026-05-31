/**
 * Netlify Function: ai-coach
 * Proxy seguro (Backend-for-Frontend) para comunicarse con la API de OpenRouter
 * utilizando el modelo Qwen (qwen/qwen-2.5-72b-instruct:free).
 */

export const handler = async (event: any, context: any) => {
  // Solo permitir solicitudes POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing or invalid messages array" }),
      };
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "OPENROUTER_API_KEY environment variable is not configured.",
        }),
      };
    }

    // Petición asíncrona a la API de OpenRouter
    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://serene-lokum-76beb2.netlify.app/",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen/qwen-2.5-72b-instruct:free",
          messages: messages,
        }),
      },
    );

    if (!openRouterResponse.ok) {
      const errorDetails = await openRouterResponse.text();
      return {
        statusCode: openRouterResponse.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: `OpenRouter error: ${errorDetails}` }),
      };
    }

    const data = await openRouterResponse.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message || "Internal Server Error" }),
    };
  }
};
