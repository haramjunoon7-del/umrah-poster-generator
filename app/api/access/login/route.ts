
import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

export async function POST(request: NextRequest) {
  try {
    const configuredPassword = process.env.ACCESS_PASSWORD;
    const secret = process.env.ACCESS_SECRET;

    if (!configuredPassword || !secret) {
      return NextResponse.json(
        { error: "Server password settings are missing." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const submittedPassword = body?.password;

    if (typeof submittedPassword !== "string") {
      return NextResponse.json(
        { error: "Please enter your password." },
        { status: 400 }
      );
    }

    const submitted = Buffer.from(submittedPassword);
    const expected = Buffer.from(configuredPassword);

    const passwordMatches =
      submitted.length === expected.length &&
      timingSafeEqual(submitted, expected);

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const token = createHmac("sha256", secret)
      .update("haram-junoon-client-access")
      .digest("hex");

    const response = NextResponse.json({ success: true });

    response.cookies.set("hj_client_access", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
