import { NextResponse } from "next/server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const payload = {
      messages: [{ content: prompt, role: "user" }],
      user_id: uuidv4(),
      codeModelMode: true,
      agentMode: {
        mode: true,
        id: "ImageGenerationLV45LJp",
        name: "Image Generation",
      },
    };

    const response = await axios.post(
      "https://www.blackbox.ai/api/chat",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 11; Infinix X6816C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.98 Mobile Safari/537.36",
        },
      }
    );

    return NextResponse.json({ imageUrl: response.data.link });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}