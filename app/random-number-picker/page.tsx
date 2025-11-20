'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, X, Shuffle, Settings, Volume2, VolumeX, Copy, RotateCcw, Plus, Minus } from 'lucide-react';

interface HistoryItem {
  number: number;
  timestamp: string;
}

interface SettingsState {
  minNumber: number | string;
  maxNumber: number | string;
  sound: boolean;
  animationSpeed: number;
  excludeNumbers: string;
  onlyEven: boolean;
  onlyOdd: boolean;
}

const RandomNumber: React.FC = () => {
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState<SettingsState>({
    minNumber: 1,
    maxNumber: 100,
    sound: true,
    animationSpeed: 50,
    excludeNumbers: '',
    onlyEven: false,
    onlyOdd: false,
  });
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Create audio context
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Cleanup function
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playNumberSound = async (): Promise<void> => {
    if (!settings.sound || !audioContextRef.current) return;

    try {
      // Resume audio context if it's suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(220 + Math.random() * 440, audioContextRef.current.currentTime);

      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2);

      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.2);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const getValidNumbers = (): number[] => {
    const excludeArray = settings.excludeNumbers
      .split(',')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));

    const min = typeof settings.minNumber === 'number' ? settings.minNumber : parseInt(settings.minNumber) || 0;
    const max = typeof settings.maxNumber === 'number' ? settings.maxNumber : parseInt(settings.maxNumber) || 100;

    let numbers = Array.from(
      { length: max - min + 1 },
      (_, i) => i + min
    );

    // Apply filters
    numbers = numbers.filter(num => !excludeArray.includes(num));
    if (settings.onlyEven) numbers = numbers.filter(num => num % 2 === 0);
    if (settings.onlyOdd) numbers = numbers.filter(num => num % 2 !== 0);

    return numbers;
  };

  const generateRandomNumber = (): void => {
    const validNumbers = getValidNumbers();
    if (validNumbers.length === 0) return;

    setIsAnimating(true);
    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      const randomNumber = validNumbers[Math.floor(Math.random() * validNumbers.length)];
      setCurrentNumber(randomNumber);
      playNumberSound();
      count++;

      if (count >= maxCount) {
        clearInterval(interval);
        setIsAnimating(false);
        // Add to history
        setHistory(prev => [{
          number: randomNumber,
          timestamp: new Date().toLocaleTimeString()
        }, ...prev.slice(0, 9)]);
      }
    }, settings.animationSpeed);
  };

  const copyToClipboard = (text: number | string): void => {
    navigator.clipboard.writeText(text.toString());
  };

  const adjustRange = (field: 'minNumber' | 'maxNumber', increment: boolean): void => {
    const value = typeof settings[field] === 'number' ? settings[field] : parseInt(settings[field] as string) || 0;
    const newValue = increment ? value + 1 : value - 1;
    
    // Ensure values don't go below 0
    if (newValue < 0) return;
    
    const min = typeof settings.minNumber === 'number' ? settings.minNumber : parseInt(settings.minNumber as string) || 0;
    const max = typeof settings.maxNumber === 'number' ? settings.maxNumber : parseInt(settings.maxNumber as string) || 100;
    
    if (field === 'minNumber' && newValue < max) {
      setSettings(prev => ({ ...prev, minNumber: newValue }));
    } else if (field === 'maxNumber' && newValue > min) {
      setSettings(prev => ({ ...prev, maxNumber: newValue }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[32px] p-6 shadow-lg max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Random Number</h1>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Range Display */}
            <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-500">
              <span>{settings.minNumber || 0}</span>
              <div className="h-[2px] w-12 bg-gray-200"></div>
              <span>{settings.maxNumber || 0}</span>
            </div>

            {/* Main Display */}
            <div className="relative aspect-square mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center overflow-hidden">
              <div className={`text-[64px] sm:text-[80px] font-bold text-white transition-all transform ${
                isAnimating ? 'scale-110' : 'scale-100'
              }`}>
                {currentNumber}
              </div>
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-50"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
            </div>

            {/* Quick Range Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[10, 50, 100].map(num => (
                <button
                  key={num}
                  onClick={() => setSettings(prev => ({ ...prev, maxNumber: num }))}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    settings.maxNumber === num
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  1-{num}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <button
                onClick={generateRandomNumber}
                disabled={isAnimating}
                className="w-full py-4 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Shuffle size={20} />
                GENERATE NUMBER
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setSettings(prev => ({ ...prev, sound: !prev.sound }))}
                  className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  {settings.sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
                <button
                  onClick={() => copyToClipboard(currentNumber)}
                  className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <Copy size={20} />
                </button>
                <button
                  onClick={() => setCurrentNumber(0)}
                  className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-medium text-gray-600 mb-2">History</h2>
                <div className="space-y-2">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium">
                          {item.number}
                        </div>
                        <span className="text-sm text-gray-500">{item.timestamp}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(item.number)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Modal */}
            {showSettings && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Settings</h2>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Range
                      </label>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Min</label>
                          <div className="flex">
                            <button
                              onClick={() => adjustRange('minNumber', false)}
                              className="px-2 py-1 border border-gray-300 rounded-l-lg hover:bg-gray-100"
                            >
                              <Minus size={16} />
                            </button>
                            <input
                              type="number"
                              value={settings.minNumber}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                if (inputValue === '') {
                                  setSettings(prev => ({ ...prev, minNumber: '' }));
                                  return;
                                }
                                const value = parseInt(inputValue);
                                if (!isNaN(value)) {
                                  setSettings(prev => ({ ...prev, minNumber: value }));
                                }
                              }}
                              onBlur={(e) => {
                                const value = parseInt(e.target.value);
                                const max = typeof settings.maxNumber === 'number' ? settings.maxNumber : parseInt(settings.maxNumber as string);
                                if (!isNaN(value) && settings.maxNumber !== '' && value >= max) {
                                  setSettings(prev => ({ ...prev, minNumber: max - 1 }));
                                }
                              }}
                              className="w-20 px-2 py-1 border-y border-gray-300 text-center focus:outline-none"
                              min="0"
                            />
                            <button
                              onClick={() => adjustRange('minNumber', true)}
                              className="px-2 py-1 border border-gray-300 rounded-r-lg hover:bg-gray-100"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Max</label>
                          <div className="flex">
                            <button
                              onClick={() => adjustRange('maxNumber', false)}
                              className="px-2 py-1 border border-gray-300 rounded-l-lg hover:bg-gray-100"
                            >
                              <Minus size={16} />
                            </button>
                            <input
                              type="number"
                              value={settings.maxNumber}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                if (inputValue === '') {
                                  setSettings(prev => ({ ...prev, maxNumber: '' }));
                                  return;
                                }
                                const value = parseInt(inputValue);
                                if (!isNaN(value)) {
                                  setSettings(prev => ({ ...prev, maxNumber: value }));
                                }
                              }}
                              onBlur={(e) => {
                                const value = parseInt(e.target.value);
                                const min = typeof settings.minNumber === 'number' ? settings.minNumber : parseInt(settings.minNumber as string);
                                if (!isNaN(value) && settings.minNumber !== '' && value <= min) {
                                  setSettings(prev => ({ ...prev, maxNumber: min + 1 }));
                                }
                              }}
                              className="w-20 px-2 py-1 border-y border-gray-300 text-center focus:outline-none"
                            />
                            <button
                              onClick={() => adjustRange('maxNumber', true)}
                              className="px-2 py-1 border border-gray-300 rounded-r-lg hover:bg-gray-100"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exclude Numbers (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={settings.excludeNumbers}
                        onChange={(e) => setSettings(prev => ({ ...prev, excludeNumbers: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g. 13, 666, 777"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Only Even Numbers</span>
                      <button
                        onClick={() => {
                          if (!settings.onlyOdd) {
                            setSettings(prev => ({ ...prev, onlyEven: !prev.onlyEven }));
                          }
                        }}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.onlyEven ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          settings.onlyEven ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Only Odd Numbers</span>
                      <button
                        onClick={() => {
                          if (!settings.onlyEven) {
                            setSettings(prev => ({ ...prev, onlyOdd: !prev.onlyOdd }));
                          }
                        }}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.onlyOdd ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          settings.onlyOdd ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Animation Speed (ms)
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="200"
                        value={settings.animationSpeed}
                        onChange={(e) => setSettings(prev => ({ ...prev, animationSpeed: Number(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Fast</span>
                        <span>{settings.animationSpeed}ms</span>
                        <span>Slow</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* SEO Content Sections - Now Wider */}
          <div className="mt-12 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">What is Random Number?</h2>
              <p className="mb-4 text-gray-700 leading-relaxed">
                Random Number is a simple yet powerful random number picker and random number generator. Whether you want to spin the wheel number picker, use a number spinner, or pick a random number for games, raffles, or classroom activities, this number picker wheel provides a fair and engaging way to choose a random number instantly.
              </p>
              <p className="mb-4 text-gray-700 leading-relaxed">
                With our random number wheel, you can spin a number for lucky draws, giveaways, or as a classroom number picker. It's the perfect number randomizer and number selector tool for any situation where you need to generate random numbers instantly. Just spin the wheel to pick a number or pick a number from a list randomly—it's that easy!
              </p>
              <p className="text-gray-700 leading-relaxed">
                Use this online number generator tool for everything from random number between 1 and 100, to a number roulette wheel for games, or a random number generator wheel for fun and decision-making.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Features and Settings</h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>Spin the wheel number picker: Use the interactive number spinner to generate a random number instantly</li>
                <li>Custom Range: Set your own minimum and maximum numbers, like a random number between 1 and 100</li>
                <li>Exclude Numbers: Omit specific numbers from the draw for a custom random number picker experience</li>
                <li>Even/Odd Filters: Choose to generate only even or only odd numbers</li>
                <li>Animation Speed: Control the speed of the randomization animation</li>
                <li>Sound Effects: Enable or disable sound for a more interactive experience</li>
                <li>History Tracking: View and copy your previously generated numbers</li>
                <li>Quick Copy: Instantly copy the result to your clipboard</li>
                <li>Reset Option: Reset the number to zero with a single click</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Educational Applications</h2>
              <p className="mb-4 text-gray-700 leading-relaxed">
                This classroom number picker and random number generator wheel is a versatile tool for teachers and students:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>Math Games: Generate random numbers for math drills, quizzes, and games</li>
                <li>Classroom Raffles: Fairly select students or assign tasks with the number picker wheel</li>
                <li>Probability Lessons: Demonstrate randomness and probability concepts using the number randomizer</li>
                <li>Group Assignments: Randomly assign students to groups or teams</li>
                <li>Number Recognition: Help young learners practice recognizing numbers with the number selector tool</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Fun and Games</h2>
              <p className="mb-4 text-gray-700 leading-relaxed">
                Make activities more exciting with these creative uses for your random number picker:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>Raffles and Giveaways: Pick winners for contests and prize draws with the random number for giveaways feature</li>
                <li>Board Games: Replace dice or spinners with a random number generator or number roulette wheel</li>
                <li>Challenges: Set random goals or tasks for yourself or friends using the spin the wheel to pick a number option</li>
                <li>Trivia: Select random questions or categories with the number picker wheel</li>
                <li>Fitness: Generate random reps or sets for workouts</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Professional and Creative Uses</h2>
              <p className="mb-4 text-gray-700 leading-relaxed">
                Random Number can be used in many professional and creative scenarios:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>Data Sampling: Select random samples for surveys or experiments with the online number generator tool</li>
                <li>Project Management: Assign tasks or priorities randomly</li>
                <li>Brainstorming: Use numbers to spark new ideas or directions</li>
                <li>Art Projects: Generate random numbers for color, shape, or pattern selection</li>
                <li>Music: Compose using random numbers for notes or rhythms</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Tips for Best Results</h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>Set Your Range: Adjust the min and max to fit your needs, like a random number between 1 and 100</li>
                <li>Use Exclusions: Remove unwanted numbers for more control with the number randomizer</li>
                <li>Try Filters: Use even/odd filters for specific activities</li>
                <li>Leverage History: Track and reuse previous results from your random number picker for games</li>
                <li>Adjust Animation: Find the animation speed that works best for you</li>
                <li>Enable Sound: Make the experience more engaging with sound effects</li>
              </ul>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Try our random number generator wheel and pick a random number for any use case—generate random numbers instantly, spin a number, or choose a random number for your next activity!
              </p>
            </div>
          </div>
        </div>
      </div>
 
  );
};

export default RandomNumber;