import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Headers de segurança para bloquear indexação
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet, noimageindex, nocache")
  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, private")
  response.headers.set("Pragma", "no-cache")
  response.headers.set("Expires", "0")

  // Headers de segurança adicionais
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "no-referrer")
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()")

  // Bloquear user agents de bots conhecidos
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || ""

  const blockedBots = [
    "googlebot",
    "bingbot",
    "slurp",
    "duckduckbot",
    "baiduspider",
    "yandexbot",
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "whatsapp",
    "applebot",
    "crawler",
    "spider",
    "bot",
    "scraper",
  ]

  const isBot = blockedBots.some((bot) => userAgent.includes(bot))

  if (isBot) {
    // Retorna 403 Forbidden para bots
    return new NextResponse("Access Forbidden", {
      status: 403,
      headers: {
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex, nocache",
        "Cache-Control": "no-cache, no-store, must-revalidate, private",
      },
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
