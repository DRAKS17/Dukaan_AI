import { NextRequest, NextResponse } from 'next/server';
import { getDemoStoreData } from '@/lib/data/sample-data';
import { classifyMerchantQuestion } from '@/lib/ai/intent-classifier';
import { buildGroundedAnalysis } from '@/lib/ai/grounding';
import { generateAIResponse } from '@/lib/ai/provider';
import { StoreDataset } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, timeRange = '7d', customDataset } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Valid question string is required' },
        { status: 400 }
      );
    }

    const dataset: StoreDataset = customDataset || getDemoStoreData();

    // 1. Classify intent
    const classified = classifyMerchantQuestion(question);
    if (timeRange && (timeRange === '7d' || timeRange === '30d' || timeRange === '90d')) {
      classified.timeRange = timeRange;
    }

    // 2. Perform authoritative grounded calculations
    const grounded = buildGroundedAnalysis(dataset, classified);

    // 3. Generate response via LLM or deterministic fallback
    const aiResponse = await generateAIResponse(question, grounded);

    return NextResponse.json({
      success: true,
      message: {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        intent: grounded.intent,
        groundedFacts: aiResponse.groundedFacts,
        suggestedFollowUps: aiResponse.suggestedFollowUps,
        isFallback: aiResponse.isFallback,
        modelUsed: aiResponse.modelUsed,
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process chat query' },
      { status: 500 }
    );
  }
}
