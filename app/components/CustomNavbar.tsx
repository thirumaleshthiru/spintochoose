'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CircleDot, Shuffle, Text, Menu, X, Trophy, Utensils, Palette } from 'lucide-react';

function CustomNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const mainNavItems = [
    {
      path: '/',
      name: 'Spin Wheel',
      icon: CircleDot,
    },
    {
      path: '/random-number-picker',
      name: 'Random Number',
      icon: Shuffle,
    },
    {
      path: '/random-letter-picker',
      name: 'Random Letter',
      icon: Text,
    },
    {
      path: '/nfl-team-picker-wheel',
      name: 'NFL Team Picker',
      icon: Trophy,
    },
    {
      path: '/ipl-team-random-picker',
      name: 'IPL Team Random Picker',
      icon: Trophy,
    },
    {
      path: '/random-food-picker',
      name: 'Random Food Picker',
      icon: Utensils,
    },
    {
      path: '/random-color-palette-generator',
      name: 'Color Palette',
      icon: Palette,
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 z-50">
      <div className="max-w-full mx-auto px-4">
        <div className="flex md:justify-around justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-semibold text-blue-600">SpinToChoose</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-1 px-2 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden fixed top-0 right-0 h-full w-82 bg-white border-l border-gray-100 shadow-lg transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="px-4 pt-2 pb-3 space-y-1 z-50">
          {mainNavItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default CustomNavbar;
