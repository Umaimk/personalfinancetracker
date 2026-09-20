import { NextRequest, NextResponse } from "next/server";

const CATEGORIES = [
  "Salary",
  "Freelance",
  "Groceries",
  "Utilities",
  "Rent",
  "Transport",
  "Entertainment",
  "Other",
];

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();

    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Description is required." }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "AI service not configured." }, { status: 503 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        max_tokens: 20,
        messages: [
          {
            role: "user",
            content: `Categorize this transaction description into exactly one of these categories: ${CATEGORIES.join(", ")}.\n\nDescription: "${description}"\n\nRespond with ONLY the category name, nothing else.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error: ${errText}`);
    }

    const data = await response.json();
    const suggested = data.choices?.[0]?.message?.content?.trim();

    const category = CATEGORIES.includes(suggested ?? "") ? suggested : "Other";

    return NextResponse.json({ category });
  } catch (err) {
    console.error("Categorize error:", err);
    return NextResponse.json({ error: "Failed to categorize." }, { status: 500 });
  }
}