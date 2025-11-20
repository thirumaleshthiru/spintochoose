'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Download, Share2, Lock, Unlock, Heart, Trash2, Check } from 'lucide-react';

interface Color {
  hex: string;
  locked: boolean;
}

interface SavedPalette {
  id: number;
  colors: Color[];
  timestamp: string;
}

const RandomColorPaletteGenerator: React.FC = () => {
  const [colors, setColors] = useState<Color[]>([
    { hex: '#F4A261', locked: false },
    { hex: '#2A9D8F', locked: false },
    { hex: '#E9C46A', locked: false },
    { hex: '#264653', locked: false },
    { hex: '#E76F51', locked: false },
  ]);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [mounted, setMounted] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('colorPalettes');
    if (saved) {
      try {
        setSavedPalettes(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved palettes:', e);
      }
    }
    generateRandomPalette();
  }, []);

  const generateRandomColor = (): string => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0');
  };

  const generateRandomPalette = (): void => {
    setColors(prevColors =>
      prevColors.map(color =>
        color.locked ? color : { ...color, hex: generateRandomColor() }
      )
    );
  };

  const toggleLock = (index: number): void => {
    setColors(prevColors =>
      prevColors.map((color, i) =>
        i === index ? { ...color, locked: !color.locked } : color
      )
    );
  };

  const copyToClipboard = (text: string, index?: number): void => {
    navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const copyAllColors = (): void => {
    const hexCodes = colors.map(c => c.hex).join(', ');
    copyToClipboard(hexCodes);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const downloadPalette = (): void => {
    const hexCodes = colors.map(c => c.hex).join('\n');
    const element = document.createElement('a');
    const file = new Blob([hexCodes], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'color-palette.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sharePalette = async (): Promise<void> => {
    if (navigator.share) {
      try {
        const hexCodes = colors.map(c => c.hex).join(', ');
        await navigator.share({
          title: 'Random Color Palette',
          text: `Check out this color palette: ${hexCodes}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const isCurrentPaletteSaved = (): boolean => {
    if (!mounted || savedPalettes.length === 0) return false;
    const currentHexes = colors.map(c => c.hex).sort().join(',');
    return savedPalettes.some(palette => {
      const paletteHexes = palette.colors.map(c => c.hex).sort().join(',');
      return paletteHexes === currentHexes;
    });
  };

  const getCurrentPaletteId = (): number | null => {
    if (!mounted || savedPalettes.length === 0) return null;
    const currentHexes = colors.map(c => c.hex).sort().join(',');
    const found = savedPalettes.find(palette => {
      const paletteHexes = palette.colors.map(c => c.hex).sort().join(',');
      return paletteHexes === currentHexes;
    });
    return found ? found.id : null;
  };

  const savePalette = (): void => {
    if (!mounted) return;
    
    const currentId = getCurrentPaletteId();
    
    if (currentId !== null) {
      const updated = savedPalettes.filter(p => p.id !== currentId);
      setSavedPalettes(updated);
      localStorage.setItem('colorPalettes', JSON.stringify(updated));
    } else {
      const newPalette: SavedPalette = {
        id: Date.now(),
        colors: colors.map(c => ({ ...c, locked: false })),
        timestamp: new Date().toLocaleString(),
      };
      const updated = [newPalette, ...savedPalettes.slice(0, 9)];
      setSavedPalettes(updated);
      localStorage.setItem('colorPalettes', JSON.stringify(updated));
    }
  };

  const deletePalette = (id: number): void => {
    const updated = savedPalettes.filter(p => p.id !== id);
    setSavedPalettes(updated);
    localStorage.setItem('colorPalettes', JSON.stringify(updated));
  };

  const loadPalette = (palette: SavedPalette): void => {
    setColors(palette.colors);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 sm:p-6 overflow-x-hidden">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-[#264653]">
          Random Color Palette Generator
        </h1>

        <div className="flex flex-col gap-6 w-full">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md w-full overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden shadow-md group cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyToClipboard(color.hex, index)}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                    <div className={`transition-opacity text-white text-center p-2 ${copiedIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {copiedIndex === index ? (
                        <div className="flex flex-col items-center gap-1">
                          <Check size={20} className="drop-shadow-lg" />
                          <p className="text-xs font-bold drop-shadow-lg">Copied!</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs font-bold drop-shadow-lg">{color.hex}</p>
                          <p className="text-xs mt-1">Click to copy</p>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLock(index);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-all"
                  >
                    {color.locked ? (
                      <Lock size={16} className="text-gray-800" />
                    ) : (
                      <Unlock size={16} className="text-gray-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all cursor-pointer"
                  onClick={() => copyToClipboard(color.hex, index)}
                >
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <span className="text-sm font-mono text-gray-700">{color.hex}</span>
                  {copiedIndex === index ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check size={14} />
                      <span className="text-xs">Copied</span>
                    </div>
                  ) : (
                    <Copy size={14} className="text-gray-500" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={generateRandomPalette}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center gap-2"
              >
                <RefreshCw size={20} />
                Generate New Palette
              </button>
              <button
                onClick={copyAllColors}
                className="px-6 py-3 bg-gray-100 text-[#264653] rounded-lg hover:bg-gray-200 transition-all font-medium flex items-center gap-2"
              >
                {copiedAll ? (
                  <>
                    <Check size={20} className="text-green-600" />
                    <span className="text-green-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    Copy All
                  </>
                )}
              </button>
              <button
                onClick={downloadPalette}
                className="px-6 py-3 bg-gray-100 text-[#264653] rounded-lg hover:bg-gray-200 transition-all font-medium flex items-center gap-2"
              >
                <Download size={20} />
                Download
              </button>
              <button
                onClick={sharePalette}
                className="px-6 py-3 bg-gray-100 text-[#264653] rounded-lg hover:bg-gray-200 transition-all font-medium flex items-center gap-2"
              >
                <Share2 size={20} />
                Share
              </button>
              <button
                onClick={savePalette}
                className={`px-6 py-3 rounded-lg transition-all font-medium flex items-center gap-2 ${
                  isCurrentPaletteSaved()
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-gray-100 text-[#264653] hover:bg-gray-200'
                }`}
              >
                <Heart size={20} className={isCurrentPaletteSaved() ? 'fill-red-600' : ''} />
                {isCurrentPaletteSaved() ? 'Unsave' : 'Save'}
              </button>
            </div>
          </div>

          {savedPalettes.length > 0 && (
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md w-full overflow-hidden">
              <h2 className="text-xl font-bold mb-4 text-[#264653]">Saved Palettes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedPalettes.map((palette) => {
                  const currentHexes = colors.map(c => c.hex).sort().join(',');
                  const paletteHexes = palette.colors.map(c => c.hex).sort().join(',');
                  const isActive = currentHexes === paletteHexes;
                  
                  return (
                    <div
                      key={palette.id}
                      className={`border rounded-lg p-3 hover:shadow-md transition-all cursor-pointer ${
                        isActive
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => loadPalette(palette)}
                    >
                      <div className="flex gap-1 mb-2">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="flex-1 aspect-square rounded"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{palette.timestamp}</span>
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => loadPalette(palette)}
                            className={`p-1.5 rounded transition-all ${
                              isActive
                                ? 'text-blue-700 bg-blue-100'
                                : 'text-blue-600 hover:bg-blue-50'
                            }`}
                            title="Load palette"
                          >
                            <RefreshCw size={16} />
                          </button>
                          <button
                            onClick={() => deletePalette(palette.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-all"
                            title="Delete palette"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">What is Random Color Palette Generator?</h2>
            <p className="mb-4">
              Random Color Palette Generator is a creative tool that generates beautiful, random color palettes to inspire your design projects. Whether you&apos;re a designer, artist, or developer, this tool helps you discover unique color combinations instantly.
            </p>
            <p className="mb-4">
              Each palette contains 5 carefully selected colors that work well together. You can lock colors you like, generate new ones for the unlocked colors, and save your favorite palettes for later use.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Features</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Generate random color palettes with 5 colors</li>
              <li>Lock colors you like to keep them while generating new ones</li>
              <li>Copy individual hex codes or all colors at once</li>
              <li>Download your palette as a text file</li>
              <li>Share palettes with others</li>
              <li>Save your favorite palettes for later</li>
              <li>Click on any color to copy its hex code instantly</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">How to Use</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Click &quot;Generate New Palette&quot; to create a random color palette</li>
              <li>Click the lock icon on colors you want to keep</li>
              <li>Generate again to change only the unlocked colors</li>
              <li>Click on any color or hex code to copy it to your clipboard</li>
              <li>Use &quot;Copy All&quot; to copy all hex codes at once</li>
              <li>Save your favorite palettes for future reference</li>
              <li>Download or share your palettes as needed</li>
            </ol>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Use Cases</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Web Design:</strong> Find color schemes for websites and applications</li>
              <li><strong>Graphic Design:</strong> Discover color combinations for logos and branding</li>
              <li><strong>Art Projects:</strong> Get inspiration for paintings and digital art</li>
              <li><strong>UI/UX Design:</strong> Create cohesive color systems for interfaces</li>
              <li><strong>Social Media:</strong> Choose colors for posts and graphics</li>
              <li><strong>Interior Design:</strong> Explore color combinations for spaces</li>
              <li><strong>Fashion:</strong> Find complementary color pairings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomColorPaletteGenerator;
