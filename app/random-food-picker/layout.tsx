import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Random Food Picker - Decide What to Eat Instantly',
  description: 'Can\'t decide what to eat? Spin the random food picker wheel to choose your meal instantly. Add custom food options and let the wheel decide for you. Perfect for indecisive eaters!',
  keywords: [
    'random food picker',
    'what to eat',
    'food decision wheel',
    'random meal picker',
    'decide what to eat',
    'food spinner',
    'restaurant picker',
    'meal decision maker',
    'random food generator',
    'food choice wheel',
  ],
  openGraph: {
    title: 'Random Food Picker - Decide What to Eat',
    description: 'Spin the wheel to decide what to eat. Add your favorite foods and let the random food picker choose for you. Perfect for when you can\'t decide!',
    url: 'https://www.spintochoose.com/random-food-picker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Random Food Picker - Spin to Decide What to Eat',
    description: 'Can\'t decide what to eat? Spin the wheel and let it choose for you. Add custom food options and make meal decisions fun!',
  },
  alternates: {
    canonical: 'https://www.spintochoose.com/random-food-picker',
  },
};

export default function RandomFoodPickerLayout({
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
            name: 'Random Food Picker',
            url: 'https://www.spintochoose.com/random-food-picker',
            description: 'A free random food picker that helps you decide what to eat. Add your favorite foods, spin the wheel, and let it choose your meal. Perfect for indecisive eaters!',
            applicationCategory: 'Utility',
            operatingSystem: 'Web',
            publisher: {
              '@type': 'Organization',
              name: 'SpinToChoose',
              url: 'https://www.spintochoose.com',
            },
            keywords: [
              'random food picker',
              'what to eat',
              'food decision wheel',
              'random meal picker',
              'decide what to eat',
              'food spinner',
              'restaurant picker',
              'meal decision maker',
              'random food generator',
              'food choice wheel',
            ],
          }),
        }}
      />
      {children}
    </>
  );
}

