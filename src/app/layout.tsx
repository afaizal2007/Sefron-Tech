import type { Metadata } from 'next';
import { Outfit, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '../context/StoreContext';
import ToastContainer from '../components/ToastContainer';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SEFRON TECH | Modern Tech & Flagship Electronics',
  description:
    'Explore premium flagship smartphones, noise-cancelling audio, GaN fast chargers, and gaming hardware. Fast & secure shipping across India.',
  keywords: [
    'SEFRON Tech',
    'flagship tech store',
    'AirPods Pro',
    'GaN charger',
    'iPhone 16 Pro',
    'PlayStation 5',
    'fast charging India',
  ],
  authors: [{ name: 'SEFRON TECH' }],
  openGraph: {
    title: 'SEFRON TECH | Flagship Electronics & Gadgets',
    description: 'Precision engineered tech accessories, gaming consoles, and mobile gadgets.',
    siteName: 'SEFRON TECH',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`light ${outfit.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-[#f8fafc] text-[#0f172a] font-sans antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
        <StoreProvider>
          {children}
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
