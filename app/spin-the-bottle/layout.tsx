import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online Spin the Bottle - Play Instantly With Friends | Free Bottle Spinner',
  description: 'Play spin the bottle online for free! Spin the bottle game for truth or dare, party games, or random player selection. Virtual bottle spinner that works instantly - no app needed.',
  keywords: [
    'spin the bottle',
    'online spin the bottle',
    'spin the bottle game',
    'virtual spin the bottle',
    'bottle spinner online',
    'spin the bottle generator',
    'random bottle spinner',
    'truth or dare bottle spinner',
    'play spin the bottle online',
    'spin the bottle game for friends',
    'spin the bottle wheel online',
    'spin the bottle for truth or dare',
    'free spin the bottle simulator',
    'random spinner for party games',
    'spin a bottle digitally',
    'spin the bottle without app',
    'spin the bottle multiplayer online',
    'party spin the bottle game',
    'spin the bottle for fun',
    'spin the bottle for couples',
    'truth or dare spin tool',
    'spin bottle to choose player',
    'spin the bottle selector',
    'simple bottle spinner',
    'random picker spin bottle',
    'online spinner like bottle',
  ],
  openGraph: {
    title: 'Online Spin the Bottle - Play Instantly With Friends',
    description: 'Free online spin the bottle game. Add players, spin the bottle, and randomly select who goes next. Perfect for truth or dare, party games, and group activities.',
    url: 'https://www.spintochoose.com/spin-the-bottle',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spin the Bottle Online - Free Virtual Bottle Spinner',
    description: 'Play spin the bottle online instantly. Add your friends, spin the bottle, and let it randomly choose players. Perfect for truth or dare and party games!',
  },
  alternates: {
    canonical: 'https://www.spintochoose.com/spin-the-bottle',
  },
};

export default function SpinTheBottleLayout({
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
            name: 'Spin the Bottle Online',
            url: 'https://www.spintochoose.com/spin-the-bottle',
            description: 'Free online spin the bottle game. Add players, spin the virtual bottle, and randomly select who goes next. Perfect for truth or dare, party games, and group activities.',
            applicationCategory: 'Game',
            operatingSystem: 'Web',
            publisher: {
              '@type': 'Organization',
              name: 'SpinToChoose',
              url: 'https://www.spintochoose.com',
            },
            keywords: [
              'spin the bottle',
              'online spin the bottle',
              'spin the bottle game',
              'virtual spin the bottle',
              'bottle spinner online',
              'spin the bottle generator',
              'random bottle spinner',
              'truth or dare bottle spinner',
              'play spin the bottle online',
              'spin the bottle game for friends',
              'spin the bottle wheel online',
              'spin the bottle for truth or dare',
              'free spin the bottle simulator',
              'random spinner for party games',
              'spin a bottle digitally',
              'spin the bottle without app',
              'spin the bottle multiplayer online',
              'party spin the bottle game',
              'spin the bottle for fun',
              'spin the bottle for couples',
              'truth or dare spin tool',
              'spin bottle to choose player',
              'spin the bottle selector',
              'simple bottle spinner',
              'random picker spin bottle',
              'online spinner like bottle',
            ],
          }),
        }}
      />
      {children}
    </>
  );
}

