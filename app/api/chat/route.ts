import { generateObject } from "ai";
// 1. IMPORT from @ai-sdk/google
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { z } from "zod";

// 2. INITIALIZE the Google client
// It automatically reads the GOOGLE_GENERATIVE_AI_API_KEY from your .env.local
const google = createGoogleGenerativeAI();

// Your Zod schema remains exactly the same
const presentationSchema = z.object({
  message: z.string().describe("A brief explanation of what you created/changed"),
  presentation: z.object({
    title: z.string().describe("The title of the presentation"),
    slides: z.array(
      z.object({
        title: z.string().describe("The title of the slide"),
        content: z.array(z.string()).describe("An array of bullet points for the slide content"),
        notes: z.string().optional().describe("Optional speaker notes for the slide"),
        imageUrl: z
          .string()
          .url()
          .optional()
          .describe("An optional, relevant image URL for the slide."),
      })
    ),
  }),
});

export async function POST(req: Request) {
  try {
    const { messages, currentPresentation } = await req.json();
    console.log("[v0] Received request with", messages.length, "messages");

    // Your system prompt logic remains the same
    const systemPrompt = `You are a PowerPoint presentation assistant. Create or edit presentations based on user requests.
${
  currentPresentation
    ? `Current presentation:\n${JSON.stringify(currentPresentation, null, 2)}\n\nEdit this presentation based on the user's request.`
    : "Create a new presentation based on the user's request."
}
You can also add an 'imageUrl' property to any slide object.
Use placeholder URLs from 'https://via.placeholder.com/800x600?text=IMAGE_DESCRIPTION' where IMAGE_DESCRIPTION is URL-encoded.`;

    // Your message filtering logic remains the same
    const validMessages = messages.filter(
      (msg: any) => msg && msg.role === 'user' && typeof msg.content === 'string'
    );
    console.log(`[v0] Filtered messages: ${validMessages.length} (from ${messages.length})`);

    console.log("[v0] Calling Google AI model with generateObject...");
    
    const { object: parsedResponse } = await generateObject({
      // 3. UPDATE the model call to use the Google client and your specific model
      model: google("models/gemini-2.5-pro-preview-05-06"),
      schema: presentationSchema,
      system: systemPrompt,
      messages: validMessages, // <-- Use the corrected filtered array
      temperature: 0.7,
      maxTokens: 4000,
    });

    console.log("[v0] AI call successful, object parsed.");
    console.log("[v0] Returning response with", parsedResponse.presentation.slides.length, "slides");
    
    return NextResponse.json(parsedResponse);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[v0] Error in chat API:", errorMessage);
    console.error("[v0] Full error object:", error);
    
    return NextResponse.json(
      {
        message: "Sorry, I encountered an error. Please try again.",
        presentation: null,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}