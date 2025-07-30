export async function GET() {
  const robotsTxt = `
# Bloquear todos os bots de busca
User-agent: *
Disallow: /

# Bloquear especificamente os principais bots
User-agent: Googlebot
Disallow: /

User-agent: Bingbot
Disallow: /

User-agent: Slurp
Disallow: /

User-agent: DuckDuckBot
Disallow: /

User-agent: Baiduspider
Disallow: /

User-agent: YandexBot
Disallow: /

User-agent: facebookexternalhit
Disallow: /

User-agent: Twitterbot
Disallow: /

User-agent: LinkedInBot
Disallow: /

User-agent: WhatsApp
Disallow: /

User-agent: Applebot
Disallow: /

# Não há sitemap
# Sitemap: 

# Crawl-delay para todos os bots
Crawl-delay: 86400

# Bloquear arquivos específicos
Disallow: /*.js$
Disallow: /*.css$
Disallow: /*.json$
Disallow: /api/
Disallow: /_next/
Disallow: /static/
`.trim()

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex, nofollow",
    },
  })
}
