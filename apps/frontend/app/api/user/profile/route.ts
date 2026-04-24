import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.split(" ")[1];
    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token provided" },
        { status: 401 },
      );
    }

    const backendUrl = process.env.API_URL;
    const response = await fetch(`${backendUrl}/user/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Backend responded with ${response.status}: ${errorText}`,
      );
    }
    const data = await response.json();
    // TODO: type the response data
    const nextResponse = NextResponse.json(data, {
      status: 200,
    });
    return nextResponse;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected exception";
    return NextResponse.json(
      { error: "Proxy error: " + message },
      { status: 500 },
    );
  }
}
