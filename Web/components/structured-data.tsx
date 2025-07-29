export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nox24Proxy",
    description: "Proxies brasileiros premium com 99.9% uptime",
    url: "https://nox24proxy.com.br",
    logo: "https://nox24proxy.com.br/icon.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-11-99999-9999",
      contactType: "customer service",
      availableLanguage: "Portuguese",
    },
    sameAs: [],
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Proxy Brasileiro Premium",
    description: "Serviço de proxy brasileiro com IPs residenciais rotativos",
    provider: {
      "@type": "Organization",
      name: "Nox24Proxy",
    },
    areaServed: "BR",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Pacotes de Proxy",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Proxy Brasil 5GB",
          },
          price: "29.90",
          priceCurrency: "BRL",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Proxy Brasil 10GB",
          },
          price: "49.90",
          priceCurrency: "BRL",
        },
      ],
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "O que é um proxy brasileiro?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Um proxy brasileiro é um servidor intermediário localizado no Brasil que permite navegar na internet com um IP nacional, ideal para acessar conteúdo geo-restrito.",
        },
      },
      {
        "@type": "Question",
        name: "Como funciona o proxy residencial?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O proxy residencial utiliza IPs reais de provedores brasileiros, oferecendo maior anonimato e menor chance de bloqueio em sites e serviços.",
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  )
}
