/**
 * Servicio AI Coach: src/services/aiService.ts
 * Gestor de la comunicación frontend con el asistente inteligente.
 * Diseñado con tolerancia a fallos y resiliencia Offline-First de alta fidelidad.
 */
import i18n from "../i18n/config";

const OFFLINE_TIPS = [
  "Parece que estamos sin conexión. Mi consejo offline: mantén tu déficit calórico y prioriza la proteína.",
  "Actualmente estás sin conexión. Recuerda hidratarte bien: el agua optimiza el metabolismo celular.",
  "Sin conexión. Consejo rápido: descansa adecuadamente para favorecer la reconstrucción muscular.",
  "Modo sin conexión activo. No dejes de registrar tus alimentos; la constancia sostiene tus hábitos.",
];

export interface CoachResponse {
  content: string;
  isOffline: boolean;
}

/**
 * Envía el historial de conversación al AI Coach asíncronamente.
 * Si el dispositivo está sin conexión o la petición falla, retorna una respuesta
 * háptica y textual desde la heurística offline local.
 */
export async function askCoach(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
): Promise<CoachResponse> {
  // MANDATORIO (Offline-First): Evaluar si está desconectado del todo
  if (typeof window !== "undefined" && !navigator.onLine) {
    const randomIndex = Math.floor(Math.random() * OFFLINE_TIPS.length);
    return {
      content: OFFLINE_TIPS[randomIndex],
      isOffline: true,
    };
  }

  try {
    const response = await fetch("/api/ai-coach", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Extraer respuesta compatible con la API estándar de Chat Completions de OpenRouter/OpenAI
    const aiChoice = data.choices?.[0]?.message;
    if (!aiChoice || !aiChoice.content) {
      throw new Error("No chat choices returned from AI proxy");
    }

    return {
      content: aiChoice.content,
      isOffline: false,
    };
  } catch (error) {
    if (typeof window !== "undefined" && navigator.onLine) {
      console.error("AI Service Error:", error);
      return {
        content: i18n.t("aiCoach.serverError", {
          defaultValue:
            "Error de conexión con el servidor de IA. Revisa la consola o intenta más tarde.",
        }),
        isOffline: false,
      };
    }

    console.warn("AI Coach request failed, falling back to local tips:", error);
    // Recuperar consejo heurístico local ante cualquier fallo de red o del proxy
    const randomIndex = Math.floor(Math.random() * OFFLINE_TIPS.length);
    return {
      content: OFFLINE_TIPS[randomIndex],
      isOffline: true,
    };
  }
}
