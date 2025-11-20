import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Random Letter Generator - Pick a Random Letter from A to Z',
  description: 'Generate random letters instantly with our free alphabet picker. Choose uppercase, lowercase, exclude letters, and get truly random results. Perfect for games, education, and creative projects.',
  keywords: [
    'random letter generator',
    'random alphabet picker',
    'alphabet spinner',
    'random letter',
    'pick random letter',
    'letter picker',
    'alphabet wheel',
    'random letter from A to Z',
    'alphabet randomizer',
  ],
  openGraph: {
    title: 'Random Letter Generator - Free Alphabet Picker',
    description: 'Generate random letters instantly. Choose uppercase, lowercase, exclude letters. Perfect for games, education, and creative projects.',
    url: 'https://www.spintochoose.com/randome-letter-picker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Random Letter Generator - Pick Random Letters Instantly',
    description: 'Free random letter generator with customizable options. Generate truly random letters for games, education, and more.',
  },
  alternates: {
    canonical: 'https://www.spintochoose.com/randome-letter-picker',
  },
};

export default function RandomLetterPickerLayout({
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
            name: 'Random Letter Generator',
            url: 'https://www.spintochoose.com/randome-letter-picker',
            description: 'A free random letter generator that helps you pick random letters from A to Z. Customize your options, exclude specific letters, choose uppercase or lowercase, and get truly random results instantly.',
            applicationCategory: 'Utility',
            operatingSystem: 'Web',
            publisher: {
              '@type': 'Organization',
              name: 'SpinToChoose',
              url: 'https://www.spintochoose.com',
            },
            keywords: [
              'random letter generator',
              'random alphabet picker',
              'alphabet spinner',
              'random letter',
              'pick random letter',
              'letter picker',
              'alphabet wheel',
              'random letter from A to Z',
              'alphabet randomizer',
            ],
          }),
        }}
      />
      {children}
    </>
  );
}

