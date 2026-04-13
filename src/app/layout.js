import localFont from "next/font/local";
import { Inter, IBM_Plex_Mono } from 'next/font/google'
import Script from 'next/script';
import { ConsoleEaster } from './components/ConsoleEaster';
import "./globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const fivoSans = localFont({
  src: [
    {
      path: "./fonts/FivoSansModern-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/FivoSansModern-Bold.otf",
      weight: "700",
      style: "normal",
    }
  ],
  variable: "--font-fivo-sans",
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-ibm-plex-mono',
})

export const metadata = {
  title: "Letícia Vargas",
  description: "Pensar em uma descrição boa ... ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        {GTM_ID && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}
      </head>
      <body className={`${fivoSans.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <ConsoleEaster />
        {children}
      </body>
    </html>
  );
}
