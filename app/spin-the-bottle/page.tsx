'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, RotateCcw, Share2, Download } from 'lucide-react';

interface Player {
  id: number;
  name: string;
}

const SpinTheBottle: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Player 1' },
    { id: 2, name: 'Player 2' },
    { id: 3, name: 'Player 3' },
    { id: 4, name: 'Player 4' },
  ]);
  const [newPlayer, setNewPlayer] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const bottleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (showWinnerModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showWinnerModal, mounted]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  const addPlayer = (): void => {
    if (newPlayer.trim() && players.length < 12) {
      setPlayers([
        ...players,
        {
          id: Date.now(),
          name: newPlayer.trim(),
        },
      ]);
      setNewPlayer('');
    }
  };

  const removePlayer = (id: number): void => {
    if (players.length > 2) {
      setPlayers(players.filter((player) => player.id !== id));
    }
  };

  const spinBottle = (): void => {
    if (!isSpinning && players.length >= 2) {
      setIsSpinning(true);
      setWinner(null);
      const extraSpins = 5;
      const randomDegrees = Math.floor(Math.random() * 360);
      const totalRotation = rotation + 360 * extraSpins + randomDegrees;
      setRotation(totalRotation);

      setTimeout(() => {
        setIsSpinning(false);
        const anglePerPlayer = 360 / players.length;
        const normalizedAngle = ((totalRotation % 360) + 360) % 360;
        const winningIndex = Math.floor(normalizedAngle / anglePerPlayer);
        const winningPlayer = players[winningIndex % players.length];
        setWinner(winningPlayer);
        setShowWinnerModal(true);
      }, 5000);
    }
  };

  const resetBottle = (): void => {
    setRotation(0);
    setWinner(null);
    setIsSpinning(false);
  };

  const shareResults = async (): Promise<void> => {
    if (winner && navigator.share) {
      try {
        await navigator.share({
          title: 'Spin the Bottle Result',
          text: `The bottle landed on: ${winner.name}!`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const downloadResults = (): void => {
    if (winner) {
      const element = document.createElement('a');
      const file = new Blob([`Spin the Bottle Result: ${winner.name}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'spin-the-bottle-result.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 sm:p-6 overflow-x-hidden">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-[#264653]">
          Spin the Bottle
        </h1>

        <div className="flex flex-col gap-6 w-full">
          <div className="flex justify-center">
            <div className="relative w-full max-w-[400px] sm:max-w-[500px] aspect-square">
              <div className="relative w-full h-full flex items-center justify-center">
                <div
                  ref={bottleRef}
                  className="relative w-32 h-32 sm:w-40 sm:h-40 transform-gpu transition-transform duration-[5000ms] ease-[cubic-bezier(0.2,0,0.3,1)]"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                  }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M 50 10 L 60 90 L 50 95 L 40 90 Z"
                      fill="#8B4513"
                      stroke="#654321"
                      strokeWidth="1"
                    />
                    <path
                      d="M 50 10 L 60 90 L 50 95 L 40 90 Z"
                      fill="#D2691E"
                      opacity="0.3"
                    />
                    <line
                      x1="50"
                      y1="10"
                      x2="50"
                      y2="95"
                      stroke="#654321"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
              </div>

              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 cursor-pointer z-10"
                onClick={spinBottle}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-4 border-[#264653]">
                  <span className="text-lg sm:text-xl font-bold text-[#264653]">SPIN</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                value={newPlayer}
                onChange={(e) => setNewPlayer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add player name"
                className="flex-1 px-4 py-3 bg-gray-100 text-[#264653] border border-gray-300 rounded-lg focus:outline-none focus:border-[#2A9D8F] transition-all placeholder-gray-500"
                maxLength={20}
              />
              <button
                onClick={addPlayer}
                disabled={players.length >= 12}
                className="p-3 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#219EBC] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-[#2A9D8F] to-[#219EBC]"
                >
                  <span className="text-white font-medium truncate">{player.name}</span>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="p-1 bg-white/20 text-white rounded hover:bg-white/30 transition-all ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={resetBottle}
                className="p-3 bg-gray-100 text-[#264653] rounded-lg hover:bg-gray-200 transition-all"
              >
                <RotateCcw size={20} />
              </button>
              <button
                onClick={shareResults}
                disabled={!winner}
                className="p-3 bg-gray-100 text-[#264653] rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-all"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={downloadResults}
                disabled={!winner}
                className="p-3 bg-gray-100 text-[#264653] rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-all"
              >
                <Download size={20} />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">What is Spin the Bottle?</h2>
            <p className="mb-4">
              Spin the Bottle is a classic party game that helps you randomly select a player from your group. Our online spin the bottle game lets you play instantly with friends without needing a physical bottle. Whether you&apos;re playing truth or dare, choosing teams, or just having fun, this virtual bottle spinner makes selection fair and exciting.
            </p>
            <p className="mb-4">
              This free spin the bottle simulator works as a random bottle spinner and party game tool. Simply add your players&apos; names, spin the bottle, and let it randomly choose who goes next. Perfect for parties, games, or any group activity where you need a fair way to pick someone.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">How does the online spin the bottle work?</h3>
                <p>
                  Add your players&apos; names to the game. When you click &quot;SPIN&quot;, the virtual bottle rotates multiple times before landing on a randomly selected player. The selection is completely random and fair.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Can I play spin the bottle online with friends?</h3>
                <p>
                  Yes! This online spin the bottle game is perfect for playing with friends. You can add up to 12 players and spin to randomly select who goes next. It works great for truth or dare, party games, or any group activity.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Is this spin the bottle game free?</h3>
                <p>
                  Yes! Our spin the bottle generator is completely free to use. There are no hidden fees, subscriptions, or downloads required.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Can I use this for truth or dare?</h3>
                <p>
                  Absolutely! This bottle spinner is perfect for truth or dare games. Just add your players, spin the bottle, and let it randomly choose who answers the truth or does the dare.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Fun Ways to Use Spin the Bottle</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Play truth or dare with friends using the bottle spinner</li>
              <li>Choose teams or players for party games</li>
              <li>Decide who goes first in group activities</li>
              <li>Randomly select players for challenges or tasks</li>
              <li>Use as a party game tool for icebreakers</li>
              <li>Play spin the bottle for couples or groups</li>
              <li>Create fair selections for any group activity</li>
            </ul>
          </div>
        </div>
      </div>

      {showWinnerModal && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => setShowWinnerModal(false)}
        >
          <div 
            className="bg-white rounded-[20px] w-full max-w-[320px] sm:max-w-[400px] mx-auto my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <span className="text-2xl">🍾</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Bottle Landed On!</h2>
                <p className="text-gray-600 text-sm sm:text-base">The selected player is:</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-2xl relative overflow-hidden animate-pulse ring-4 ring-emerald-200 ring-opacity-50">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-ping"></div>
                <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="relative z-10">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center mb-2 animate-bounce">
                    {winner?.name}
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-1 bg-white/50 rounded-full"></div>
                    <span className="mx-3 text-white/80 text-sm font-semibold tracking-wider">SELECTED</span>
                    <div className="w-8 h-1 bg-white/50 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setShowWinnerModal(false)}
                  className="w-full sm:min-w-[120px] px-6 py-3 bg-gray-100 text-sm sm:text-base text-gray-600 rounded-xl hover:bg-gray-200 transition-all font-medium"
                >
                  Close
                </button>
                <button
                  onClick={shareResults}
                  className="w-full sm:min-w-[120px] px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-sm sm:text-base text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all font-medium shadow-md"
                >
                  Share Result
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinTheBottle;

