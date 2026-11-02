import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/components/CartContext';

export const metadata = {
  metadataBase: new URL('https://bobotsbakery.com'),
  title: {
    default: 'Filipino Bakery in Salinas, CA | Fresh Pandesal & Ube Bread',
    template: "%s — Bobot's Bakery",
  },
  description: "Bobot's Bakery — fresh Filipino pandesal, ube bread, and baked goods in Salinas, CA.",
  icons: { icon: '/images/logo.png' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  name: 'Bobots Bakery',
  image: 'https://bobotsbakery.com/images/logo.png',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Salinas',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  servesCuisine: 'Filipino',
  url: 'https://bobotsbakery.com',
};

export default function RootLayout({ children }) {
  return (
    // "no-js" is removed right away by the script below; the FAQ CSS uses it as a no-JavaScript fallback.
    <html lang="en" className="no-js" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.remove('no-js');" }} />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora:wght@400;500;600&family=Caveat:wght@400;700&display=swap"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>

        <Script src="https://www.googletagmanager.com/gtag/js?id=G-KLWZS8LQX0" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KLWZS8LQX0');
          `}
        </Script>
      </body>
    </html>
  );
}
