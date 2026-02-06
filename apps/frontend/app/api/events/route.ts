import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

async function getJwtToken() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const alg = "HS256";

  return await new SignJWT({ app: "its-my-live-frontend" })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("its-my-live-backend")
    .setAudience("its-my-live-audience")
    .setExpirationTime("1h")
    .sign(secret);
}

export async function GET(request: NextRequest) {
  try {
    const token = await getJwtToken();
    const backendUrl = process.env.API_URL;

    // Build target URL with query params
    const url = new URL(`${backendUrl}/events`);
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // Forward request to Go backend with JWT
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Backend responded with ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected exception";
    return NextResponse.json(
      { error: "Proxy error: " + message },
      { status: 500 },
    );
  }
}
