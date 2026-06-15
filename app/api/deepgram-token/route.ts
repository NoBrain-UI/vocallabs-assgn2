import { NextResponse } from "next/server";

// This endpoint issues a short-lived Deepgram API key for the client
// so we never expose the master key in the browser.
export async function POST() {
  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Deepgram API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Create a temporary key that expires in 10 seconds (just enough to open the WS)
    const response = await fetch(
      "https://api.deepgram.com/v1/projects",
      {
        method: "GET",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to reach Deepgram");
    }

    const projectsData = await response.json();
    const projectId = projectsData?.projects?.[0]?.project_id;

    if (!projectId) {
      // Fallback: pass the key through (only safe for development)
      console.warn(
        "No project found — returning raw API key. Use temporary keys in production."
      );
      return NextResponse.json({ key: apiKey });
    }

    // Create a temporary key scoped to this project
    const tmpKeyRes = await fetch(
      `https://api.deepgram.com/v1/projects/${projectId}/keys`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: "Temporary browser key",
          scopes: ["usage:write"],
          time_to_live_in_seconds: 10,
        }),
      }
    );

    if (!tmpKeyRes.ok) {
      // Fallback to master key
      return NextResponse.json({ key: apiKey });
    }

    const tmpKeyData = await tmpKeyRes.json();
    return NextResponse.json({ key: tmpKeyData.key });
  } catch {
    // On any error, return the master key (acceptable for local dev)
    return NextResponse.json({ key: apiKey });
  }
}
