import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IPL Team Picker Wheel -  Choose a Random IPL Team',
  description: 'Choose a random IPL team instantly. Use this online tool to randomly select one of 10 IPL teams. Fast and simple.',
  keywords: [
    'ipl team picker',
    'ipl team wheel',
    'random ipl team generator',
    'spin ipl team picker',
    'random ipl team wheel',
    'random ipl team',
    'pick a random ipl team',
    'ipl spinner',
    'ipl team selector',
    'ipl team randomizer',
    'cricket team picker',
    'indian premier league team picker',
  ],
  openGraph: {
    title: 'IPL Team Picker - Random IPL Team Generator',
    description: 'Free online IPL team wheel. Spin to get a random IPL team. No setup, just click and spin the wheel to pick a team.',
    url: 'https://www.spintochoose.com/ipl-team-random-picker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spin the IPL Team Wheel - Get a Random Team Now',
    description: 'Click to spin the IPL team picker. A simple wheel that picks one team at random from all 10 in the league.',
  },
  alternates: {
    canonical: 'https://www.spintochoose.com/ipl-team-random-picker',
  },
};

export default function IPLTeamPickerLayout({
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
            name: 'IPL Team Picker',
            url: 'https://www.spintochoose.com/ipl-team-random-picker',
            description: 'Online tool to spin a wheel and pick a random IPL team. One click to get a team from the full list of 10 IPL teams. Simple and free to use.',
            applicationCategory: 'Utility',
            operatingSystem: 'Web',
            publisher: {
              '@type': 'Organization',
              name: 'SpinToChoose',
              url: 'https://www.spintochoose.com',
            },
            keywords: [
              'ipl team picker',
              'ipl team wheel',
              'random ipl team generator',
              'spin ipl team picker',
              'random ipl team wheel',
              'random ipl team',
              'pick a random ipl team',
              'ipl spinner',
              'ipl team selector',
              'ipl team randomizer',
              'cricket team picker',
              'indian premier league team picker',
            ],
          }),
        }}
      />
      {children}
    </>
  );
}

