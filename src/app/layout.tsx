import type { Metadata } from 'next';
import './globals.css';
import { data } from '@/lib/data';

export const metadata: Metadata = {
  title: `${data.personal.name} - ${data.personal.jobTitle}`,
  description: data.seo.metaDescription,
  keywords: data.seo.keywords,
  openGraph: {
    title: data.seo.openGraph.title,
    url: data.seo.openGraph.url,
    type: 'website',
  },
  twitter: {
    card: data.seo.twitterCard,
    title: data.seo.openGraph.title,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🖥️</text></svg>" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
