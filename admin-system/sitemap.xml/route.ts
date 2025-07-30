export async function GET() {
  // Retorna um sitemap vazio para não fornecer URLs para indexação
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Nenhuma URL para indexação -->
</urlset>`

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex, nofollow",
    },
  })
}
