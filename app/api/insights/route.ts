import { NextRequest, NextResponse } from "next/server";
import { Transaction } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { transactions } = (await req.json()) as { transactions: Transaction[] };

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json({ error: "No transactions provided." }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "AI service not configured." }, { status: 503 });
    }

    const summary = transactions
      .map((t) => `${t.date} | ${t.type} | ${t.category} | $${t.amount} | ${t.description}`)
      .join("\n");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
       model: "openai/gpt-oss-120b",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `You are a personal finance assistant. Here is a list of transactions:\n\n${summary}\n\nWrite a short, friendly 3-4 sentence summary of this person's spending. Mention their biggest expense category, any noticeable pattern, and one practical suggestion. Do not use markdown formatting, just plain sentences.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error: ${errText}`);
    }

    const data = await response.json();
    const insight = data.choices?.[0]?.message?.content?.trim();

    if (!insight) {
      return NextResponse.json({ error: "No insight generated." }, { status: 502 });
    }

    return NextResponse.json({ insight });
  } catch (err) {
    console.error("Insights error:", err);
    return NextResponse.json({ error: "Failed to generate insights." }, { status: 500 });
  }
}