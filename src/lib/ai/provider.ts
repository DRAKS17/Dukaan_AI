/**
 * DukaanAI - AI Provider Abstraction
 * Triple-redundancy: Google Gemini -> OpenAI -> Deterministic Analytics Engine
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GroundedAnalysis } from './grounding';

export interface AIResponsePayload {
  content: string;
  isFallback: boolean;
  modelUsed: string;
  groundedFacts: Array<{ label: string; value: string }>;
  suggestedFollowUps: string[];
}

/**
 * Generate a transparent deterministic analytical response when no LLM is configured or available.
 */
export function generateDeterministicResponse(grounded: GroundedAnalysis): AIResponsePayload {
  const content = `### 📊 Business Analysis (${grounded.observationWindow})

**${grounded.headlineSummary}**

---

#### 🔍 Verified Facts from Store Records:
${grounded.evidencePoints.map((pt) => `- ${pt}`).join('\n')}

---

#### 💡 Recommended Action:
> **Action:** ${grounded.suggestedAction}  
> **Why it matters:** ${grounded.actionRationale}

---

#### ⚠️ Assumptions & Limitations:
${grounded.limitations.map((l) => `- *${l}*`).join('\n')}
`;

  return {
    content,
    isFallback: true,
    modelUsed: 'DukaanAI Deterministic Analytics Engine (Offline Grounded)',
    groundedFacts: grounded.facts,
    suggestedFollowUps: grounded.suggestedFollowUps,
  };
}

/**
 * Generate an AI response using Gemini or OpenAI with transparent deterministic fallback.
 */
export async function generateAIResponse(
  userQuestion: string,
  grounded: GroundedAnalysis
): Promise<AIResponsePayload> {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const systemPrompt = `You are "DukaanAI Business Assistant", an expert AI Business Growth Copilot for Indian Kirana and small retail store owners.
You must adhere strictly to these rules:
1. Speak in simple, respectful, and direct language suitable for a busy Indian shopkeeper.
2. Ground all claims STRICTLY in the verified store data provided below. NEVER invent or hallucinate metrics, prices, customer counts, or inventory levels.
3. Structure your response clearly:
   - Direct Observation & Headline
   - Key Evidence & Numbers (cite the observation dates)
   - Diagnostic Reason (why this is happening)
   - Concrete Actionable Next Step
   - Any assumptions or limitations
4. Always use Indian Rupee (₹) formatting.
5. If the merchant asks for something not supported by the data, state that clearly without guessing.`;

  const prompt = `${systemPrompt}

STORE DATA & VERIFIED GROUNDED FACTS:
Intent: ${grounded.intent}
Observation Period: ${grounded.observationWindow}
Comparison Period: ${grounded.comparisonWindow}
Headline: ${grounded.headlineSummary}

Verified Numerical Facts:
${grounded.facts.map((f) => `- ${f.label}: ${f.value}`).join('\n')}

Evidence Points:
${grounded.evidencePoints.map((e) => `- ${e}`).join('\n')}

Calculated Suggested Action:
${grounded.suggestedAction}

Calculated Action Rationale:
${grounded.actionRationale}

Assumptions & Limitations:
${grounded.limitations.map((l) => `- ${l}`).join('\n')}

MERCHANT QUESTION:
"${userQuestion}"

Please write a clear, helpful response explaining this to the shopkeeper.`;

  // 1. Try Gemini first
  if (geminiKey) {
    for (const modelName of ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro']) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text && text.trim().length > 0) {
          return {
            content: text,
            isFallback: false,
            modelUsed: `Google Gemini (${modelName})`,
            groundedFacts: grounded.facts,
            suggestedFollowUps: grounded.suggestedFollowUps,
          };
        }
      } catch (e) {
        // try next model
      }
    }
  }

  // 2. Try OpenAI if Gemini was unavailable or blocked
  if (openaiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 800,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text && text.trim().length > 0) {
          return {
            content: text,
            isFallback: false,
            modelUsed: 'OpenAI GPT-4o-mini',
            groundedFacts: grounded.facts,
            suggestedFollowUps: grounded.suggestedFollowUps,
          };
        }
      }
    } catch (e) {
      // fallback to deterministic
    }
  }

  // 3. Guaranteed Deterministic Analytics Engine Fallback
  return generateDeterministicResponse(grounded);
}
