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
  console.log('Model Used:', resp.modelUsed);
  console.log('Is Fallback:', resp.isFallback);
  console.log('Facts count:', resp.groundedFacts.length);
  console.log('\n--- Content Preview ---');
  console.log(resp.content.slice(0, 400));
  console.log('-----------------------\n');
}

testAI().catch(console.error);
