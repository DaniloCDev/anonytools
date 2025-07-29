import type React from "react";
import ClientLayout from "./client-layout";
import { UserProvider } from "@/contexts/UserContext";
import { PurchaseProvider } from "@/contexts/PurchaseContext";
import "./globals.css";

export const metadata = {
  title: {
    default: "Nox24Proxy - Melhores Proxies Brasileiros | IPs Residenciais Premium",
    template: "%s | Nox24Proxy",
  },
  description:
    "Proxies brasileiros premium com 99.9% uptime. IPs residenciais rotativos, velocidade até 1Gbps, suporte 24/7. Teste grátis disponível!",
  keywords: [
    "proxy brasil",
    "proxy brasileiro",
    "ip brasileiro",
    "proxy residencial",
    "proxy rotativo",
    "proxy premium",
    "scraping brasil",
    "automação web",
    "proxy confiável",
    "ip nacional",
  ],
  authors: [{ name: "Nox24 Team" }],
  creator: "Nox24Proxy",
  publisher: "Nox24Proxy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://nox24proxy.com.br",
    siteName: "Nox24Proxy",
    title: "Nox24Proxy - Melhores Proxies Brasileiros",
    description:
      "Proxies brasileiros premium com 99.9% uptime. IPs residenciais rotativos, velocidade até 1Gbps, suporte 24/7.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ProxyBR - Proxies Brasileiros Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nox24Proxy - Melhores Proxies Brasileiros",
    description: "Proxies brasileiros premium com 99.9% uptime. IPs residenciais rotativos.",
    images: ["/twitter-image.jpg"],
    creator: "@Nox24Proxy",
  },
  verification: {
    google: "rFLdEQ_X9-3Dm0-hYH1DA9wNcwOesdntiEokArEzSDs",
  },
  alternates: {
    canonical: "https://nox24proxy.com.br",
    languages: {
      "pt-BR": "https://nox24proxy.com.br",
    },
  },
  category: "technology",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SHYXJXCJT0"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SHYXJXCJT0');
            `,
          }}
        />
      </head>
      <body className="bg-black text-white">
        <UserProvider>
          <PurchaseProvider>
            <ClientLayout>{children}</ClientLayout>
          </PurchaseProvider>
        </UserProvider>
      </body>
    </html>
  );
}
