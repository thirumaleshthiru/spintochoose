import type { Metadata } from 'next';
import './globals.css';
import CustomNavbar from './components/CustomNavbar';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'Spin Wheel- Spin to Choose Names, Yes or No, or Random Options',
  description: 'Use this free spin wheel to make fast decisions. Spin the wheel for names, tasks, yes or no answers, or any custom choices. Try SpinToChoose now.',
  keywords: [
    'spin wheel',
    'random picker',
    'yes or no wheel',
    'spin the wheel',
    'name picker',
    'decision wheel',
    'random choice generator'
  ],
  openGraph: {
    title: 'SpinToChoose - Free Spin Wheel for Random Choices',
    description: 'Spin a wheel to choose names, tasks, yes or no, or custom entries. Perfect for classrooms, games, or decisions. Try the spin wheel for free.',
    url: 'https://www.spintochoose.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Spin Wheel - Spin Names, Tasks, or Yes/No',
    description: 'The spin wheel helps you spin and decide—random name picker, yes or no wheel, and more. Use SpinToChoose for fun and fast decisions.',
  },
  alternates: {
    canonical: 'https://www.spintochoose.com',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'SpinToChoose',
              url: 'https://www.spintochoose.com',
              description: 'A free spin wheel that helps you choose names, tasks, yes/no answers, or random options. Spin the wheel and get results instantly.',
              applicationCategory: 'Utility',
              operatingSystem: 'Web',
              publisher: {
                '@type': 'Organization',
                name: 'SpinToChoose',
                url: 'https://www.spintochoose.com',
              },
              keywords: [
                'spin wheel',
                'random picker',
                'yes or no wheel',
                'spin the wheel',
                'name picker',
                'decision wheel',
                'random choice generator',
              ],
            }),
          }}
        />
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
          <CustomNavbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}