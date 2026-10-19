import fs from 'fs';
import path from 'path';

// Load .env.local if present
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [k, ...v] = trimmed.split('=');
        if (k && v) {
          process.env[k.trim()] = v.join('=').trim();
        }
      }
    });
  }
} catch (e) {}

import { getDemoStoreData } from '../src/lib/data/sample-data';
import { classifyMerchantQuestion } from '../src/lib/ai/intent-classifier';
import { buildGroundedAnalysis } from '../src/lib/ai/grounding';
import { generateAIResponse } from '../src/lib/ai/provider';

async function testAI() {
  const dataset = getDemoStoreData();
  const q = 'Why are my sales lower this week?';
  const classified = classifyMerchantQuestion(q);
  const grounded = buildGroundedAnalysis(dataset, classified);
  console.log('Testing generateAIResponse with question:', q);
  const resp = await generateAIResponse(q, grounded);
  console.log('\n--- AI RESPONSE RESULT ---');
  console.log('Model Used:', resp.modelUsed);
  console.log('Is Fallback:', resp.isFallback);
  console.log('Grounded Facts Count:', resp.groundedFacts.length);
  console.log('\nResponse Text:\n', resp.content);
  console.log('--------------------------\n');
}

testAI().catch(console.error);
