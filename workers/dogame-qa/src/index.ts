/**
 * DoGame Q&A Worker — Cloudflare Workers AI proxy for breed-specific
 * Hebrew Q&A. Answers questions like "Is this breed good with kids?" with
 * a friendly veterinarian persona, grounded in the breed context the site
 * provides per request.
 *
 * Endpoint: POST /  with JSON body { breedName, question, breedContext }
 * Returns: { answer: string }
 */

export interface Env {
  AI: Ai;
}

interface AskBody {
  breedName?: string;
  breedNameEn?: string;
  question?: string;
  breedContext?: string;
}

const ALLOWED_ORIGINS = new Set([
  "https://dogame.pages.dev",
  "http://localhost:3000",
]);

function corsHeaders(origin: string | null): Record<string, string> {
  const allow =
    origin && (ALLOWED_ORIGINS.has(origin) || origin.endsWith(".dogame.pages.dev"))
      ? origin
      : "https://dogame.pages.dev";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

const SYSTEM_PROMPT =
  `You are a friendly dog breed expert (veterinarian + trainer). ` +
  `The user's question is written in Hebrew. ` +
  `Step 1 (silent): understand the Hebrew question. ` +
  `Step 2: write your answer in clear, warm ENGLISH — 2 to 4 short sentences. ` +
  `Rules:\n` +
  `1. Output only English text. Do NOT include the Hebrew question.\n` +
  `2. Answer the user's exact question. Be specific to the named breed.\n` +
  `3. For medical questions, briefly recommend consulting a vet.\n` +
  `4. If you don't know, say so honestly. Never invent facts.\n` +
  `5. No "Great question" preambles — just the answer.`;

function buildUserMessage(
  breedNameEn: string,
  ctx: string,
  questionHe: string
): string {
  return (
    `Breed (English name): ${breedNameEn}\n` +
    (ctx ? `Context about this breed: ${ctx}\n` : "") +
    `\nUser's question (in Hebrew, understand it then answer in English):\n${questionHe}\n\n` +
    `Now write your English answer (2-4 sentences), specific to the ${breedNameEn}.`
  );
}

const MAX_QUESTION = 500;
const MAX_CTX = 2000;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers });
    }

    let body: AskBody;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON", 400, headers);
    }

    const breedName = (body.breedName ?? "").toString().slice(0, 100).trim();
    const breedNameEn = (body.breedNameEn ?? "").toString().slice(0, 100).trim();
    const question = (body.question ?? "").toString().slice(0, MAX_QUESTION).trim();
    const breedContext = (body.breedContext ?? "").toString().slice(0, MAX_CTX).trim();

    if (!breedName || !question) {
      return jsonError("Missing breedName or question", 400, headers);
    }

    try {
      // Workers AI models reliably emit `?` placeholders for non-ASCII chars,
      // so we let Llama answer in English (which it does well, even given the
      // Hebrew question in the user message), then translate to Hebrew via
      // m2m100 (English → Hebrew direction is reliable).

      const chatResult = (await env.AI.run(
        "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
        {
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: buildUserMessage(
                breedNameEn || breedName,
                breedContext,
                question
              ),
            },
          ],
          max_tokens: 350,
          temperature: 0.4,
        }
      )) as { response?: string };
      const answerEn = chatResult.response?.trim() ?? "";

      if (!answerEn) {
        return jsonError("Empty answer from AI", 502, headers);
      }

      // Translate English answer → Hebrew via m2m100
      const aTranslation = (await env.AI.run("@cf/meta/m2m100-1.2b", {
        text: answerEn,
        source_lang: "english",
        target_lang: "hebrew",
      })) as { translated_text?: string };
      const answer = aTranslation.translated_text?.trim() || answerEn;

      return new Response(JSON.stringify({ answer }), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI error";
      return jsonError(`AI error: ${message}`, 500, headers);
    }
  },
};

function jsonError(message: string, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}
