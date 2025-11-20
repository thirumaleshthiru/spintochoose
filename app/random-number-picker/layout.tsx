import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Random Number Generator - Pick a Random Number Instantly',
  description: 'Generate random numbers instantly with our free random number picker. Choose any range, exclude numbers, filter by even/odd, and get truly random results. Perfect for games, raffles, and decision-making.',
  keywords: [
    'random number generator',
    'random number picker',
    'number generator',
    'random number',
    'pick random number',
    'number picker wheel',
    'random number between',
    'random number selector',
  ],
  openGraph: {
    title: 'Random Number Generator - Free Random Number Picker',
    description: 'Generate random numbers instantly. Choose any range, exclude numbers, filter by even/odd. Perfect for games, raffles, and decision-making.',
    url: 'https://www.spintochoose.com/random-number-picker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Random Number Generator - Pick Random Numbers Instantly',
    description: 'Free random number generator with customizable range, exclusions, and filters. Generate truly random numbers for games, raffles, and more.',
  },
  alternates: {
    canonical: 'https://www.spintochoose.com/random-number-picker',
  },
};

export default function RandomNumberPickerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Random Number Generator',
            url: 'https://www.spintochoose.com/random-number-picker',
            description: 'A free random number generator that helps you pick random numbers within any range. Customize your range, exclude specific numbers, filter by even or odd, and get truly random results instantly.',
            applicationCategory: 'Utility',
            operatingSystem: 'Web',
            publisher: {
              '@type': 'Organization',
              name: 'SpinToChoose',
              url: 'https://www.spintochoose.com',
            },
            keywords: [
              'random number generator',
              'random number picker',
              'number generator',
              'random number',
              'pick random number',
              'number picker wheel',
              'random number between',
              'random number selector',
            ],
          }),
        }}
      />
      {children}
    </>
  );
}

