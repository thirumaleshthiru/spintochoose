import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NFL Team Picker Wheel - Choose a Random NFL Team',
  description: 'Choose a random NFL team instantly. Use this online tool to randomly select one of 32 NFL teams. Fast and simple.',
  keywords: [
    'nfl team picker',
    'nfl team wheel',
    'random nfl team generator',
    'spin nfl team picker',
    'random nfl team wheel',
    'random nfl team',
    'pick a random nfl team',
    'nfl spinner',
    'nfl team selector',
    'nfl team randomizer',
  ],
  openGraph: {
    title: 'NFL Team Picker - Random NFL Team Generator',
    description: 'Free online NFL team wheel. Spin to get a random NFL team. No setup, just click and spin the wheel to pick a team.',
    url: 'https://www.spintochoose.com/nfl-team-picker-wheel',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spin the NFL Team Wheel - Get a Random Team Now',
    description: 'Click to spin the NFL team picker. A simple wheel that picks one team at random from all 32 in the league.',
  },
  alternates: {
    canonical: 'https://www.spintochoose.com/nfl-team-picker-wheel',
  },
};

export default function NFLTeamPickerLayout({
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
            name: 'NFL Team Picker',
            url: 'https://www.spintochoose.com/nfl-team-picker-wheel',
            description: 'Online tool to spin a wheel and pick a random NFL team. One click to get a team from the full list of 32 NFL teams. Simple and free to use.',
            applicationCategory: 'Utility',
            operatingSystem: 'Web',
            publisher: {
              '@type': 'Organization',
              name: 'SpinToChoose',
              url: 'https://www.spintochoose.com',
            },
            keywords: [
              'nfl team picker',
              'nfl team wheel',
              'random nfl team generator',
              'spin nfl team picker',
              'random nfl team wheel',
              'random nfl team',
              'pick a random nfl team',
              'nfl spinner',
              'nfl team selector',
              'nfl team randomizer',
            ],
          }),
        }}
      />
      {children}
    </>
  );
}

