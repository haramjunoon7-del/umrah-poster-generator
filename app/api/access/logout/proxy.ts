
import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname === "/access" ||
    pathname === "/api/access/login" ||
    pathname === "/api/access/logout"
  ) {
    return NextResponse.next();
  }

  const secret = process.env.ACCESS_SECRET;

  if (!secret) {
    return new NextResponse("Server access settings are missing.", {
      status: 500,
    });
  }

  const cookieToken = request.cookies.get("hj_client_access")?.value;

  if (cookieToken) {
    const expectedToken = createHmac("sha256", secret)
      .update("haram-junoon-client-access")
      .digest("hex");

    const actual = Buffer.from(cookieToken);
    const expected = Buffer.from(expectedToken);

    if (
      actual.length === expected.length &&
      timingSafeEqual(actual, expected)
    ) {
      return NextResponse.next();
    }
  }

  const loginUrl = new URL("/access", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
