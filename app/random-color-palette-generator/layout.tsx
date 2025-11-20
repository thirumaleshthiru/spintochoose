import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Random Color Palette Generator - Generate Beautiful Color Schemes',
  description: 'Generate random color palettes instantly. Create beautiful color schemes for design projects, websites, and art. Lock colors, save favorites, and export hex codes. Free color palette generator tool.',
  keywords: [
    'random color palette generator',
    'color palette generator',
    'random color scheme',
    'color picker',
    'color generator',
    'palette generator',
    'color combination generator',
    'random colors',
    'color scheme generator',
    'hex color generator',
    'design color palette',
    'color inspiration',
  ],
  openGraph: {
    title: 'Random Color Palette Generator - Create Beautiful Color Schemes',
    description: 'Generate random color palettes with 5 colors. Lock colors you like, save favorites, and export hex codes. Perfect for designers and artists!',
    url: 'https://www.spintochoose.com/random-color-palette-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Random Color Palette Generator - Free Color Scheme Tool',
    description: 'Generate beautiful random color palettes instantly. Lock colors, save favorites, and copy hex codes. Perfect for design projects!',
  },
  alternates: {
    canonical: 'https://www.spintochoose.com/random-color-palette-generator',
  },
};

export default function RandomColorPaletteGeneratorLayout({
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
            name: 'Random Color Palette Generator',
            url: 'https://www.spintochoose.com/random-color-palette-generator',
            description: 'A free tool to generate random color palettes with 5 colors. Lock colors, save favorites, and export hex codes. Perfect for designers, artists, and developers.',
            applicationCategory: 'DesignApplication',
            operatingSystem: 'Web',
            publisher: {
              '@type': 'Organization',
              name: 'SpinToChoose',
              url: 'https://www.spintochoose.com',
            },
            keywords: [
              'random color palette generator',
              'color palette generator',
              'random color scheme',
              'color picker',
              'color generator',
              'palette generator',
              'color combination generator',
              'random colors',
              'color scheme generator',
              'hex color generator',
              'design color palette',
              'color inspiration',
            ],
          }),
        }}
      />
      {children}
    </>
  );
}

