'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Share2, Download, RotateCcw, Plus, Trash2, Edit2 } from 'lucide-react';

interface FoodItem {
  id: number;
  text: string;
  color: string;
}

const RandomFoodPicker: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<FoodItem | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const [foods, setFoods] = useState<FoodItem[]>([
    { id: 1, text: 'Pizza', color: '#F4A261' },
    { id: 2, text: 'Burger', color: '#2A9D8F' },
    { id: 3, text: 'Pasta', color: '#E9C46A' },
    { id: 4, text: 'Sushi', color: '#264653' },
    { id: 5, text: 'Tacos', color: '#E76F51' },
    { id: 6, text: 'Salad', color: '#219EBC' },
  ]);

  const colors: string[] = ['#F4A261', '#2A9D8F', '#E9C46A', '#264653', '#E76F51', '#219EBC', '#8ECAE6', '#023047', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181'];

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
      if (editingId) {
        finishEditing();
      } else {
        addItem();
      }
    }
  };

  const addItem = (): void => {
    if (newItem.trim() && foods.length < 12) {
      setFoods([
        ...foods,
        {
          id: Date.now(),
          text: newItem.trim(),
          color: colors[foods.length % colors.length],
        },
      ]);
      setNewItem('');
    }
  };

  const removeItem = (id: number): void => {
    if (foods.length > 2) {
      setFoods(foods.filter((item) => item.id !== id));
    }
  };

  const startEditing = (id: number, text: string): void => {
    setEditingId(id);
    setNewItem(text);
  };

  const finishEditing = (): void => {
    if (newItem.trim()) {
      setFoods(
        foods.map((item) =>
          item.id === editingId ? { ...item, text: newItem.trim() } : item
        )
      );
      setEditingId(null);
      setNewItem('');
    }
  };

  const createWheelPath = (startAngle: number, endAngle: number): string => {
    const radius = 50;
    const center = { x: 50, y: 50 };

    const start = {
      x: center.x + radius * Math.cos(startAngle),
      y: center.y + radius * Math.sin(startAngle),
    };

    const end = {
      x: center.x + radius * Math.cos(endAngle),
      y: center.y + radius * Math.sin(endAngle),
    };

    const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

    return `
      M ${center.x} ${center.y}
      L ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
      Z
    `;
  };

  const spinWheel = (): void => {
    if (!isSpinning) {
      setIsSpinning(true);
      setWinner(null);
      const extraSpins = 5;
      const randomDegrees = Math.floor(Math.random() * 360);
      const totalRotation = rotation + 360 * extraSpins + randomDegrees;
      setRotation(totalRotation);

      setTimeout(() => {
        setIsSpinning(false);
        const winningIndex =
          foods.length - 1 - Math.floor((totalRotation % 360) / (360 / foods.length));
        const winningItem = foods[winningIndex % foods.length];
        setWinner(winningItem);
        setShowWinnerModal(true);
      }, 5000);
    }
  };

  const resetWheel = (): void => {
    setRotation(0);
    setWinner(null);
    setIsSpinning(false);
  };

  const shareResults = async (): Promise<void> => {
    if (winner && navigator.share) {
      try {
        await navigator.share({
          title: 'Random Food Picker Result',
          text: `I'm going to eat: ${winner.text}!`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const downloadResults = (): void => {
    if (winner) {
      const element = document.createElement('a');
      const file = new Blob([`Selected Food: ${winner.text}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'food-picker-result.txt';
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
          Random Food Picker
        </h1>

        <div className="flex flex-col gap-6 w-full">
          <div className="flex justify-center">
            <div className="relative w-full max-w-[500px] sm:max-w-[600px] aspect-square">
              <div
                ref={wheelRef}
                className="relative w-full h-full transform-gpu transition-transform duration-[5000ms] ease-[cubic-bezier(0.2,0,0.3,1)]"
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {foods.map((food, index) => {
                    const angleSize = (2 * Math.PI) / foods.length;
                    const startAngle = index * angleSize - Math.PI / 2;
                    const endAngle = (index + 1) * angleSize - Math.PI / 2;
                    
                    const midAngle = (startAngle + endAngle) / 2;
                    const textRadius = 35;
                    const textX = 50 + textRadius * Math.cos(midAngle);
                    const textY = 50 + textRadius * Math.sin(midAngle);
                    const textRotationAngle = (midAngle * 180 / Math.PI);

                    return (
                      <g key={food.id}>
                        <path
                          d={createWheelPath(startAngle, endAngle)}
                          fill={food.color}
                          className="transition-all duration-300"
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill="#FFFFFF"
                          fontSize="3"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textRotationAngle}, ${textX}, ${textY})`}
                          className="select-none pointer-events-none uppercase"
                        >
                          {food.text}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                onClick={spinWheel}
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <span className="text-xl font-bold text-gray-800">SPIN</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={editingId ? 'Edit food item' : 'Add food option'}
                className="flex-1 px-4 py-3 bg-gray-100 text-[#264653] border border-gray-300 rounded-lg focus:outline-none focus:border-[#2A9D8F] transition-all placeholder-gray-500"
                maxLength={20}
              />
              {editingId ? (
                <button
                  onClick={finishEditing}
                  className="p-3 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#219EBC] transition-all"
                >
                  <Edit2 size={20} />
                </button>
              ) : (
                <button
                  onClick={addItem}
                  disabled={foods.length >= 12}
                  className="p-3 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#219EBC] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {foods.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: food.color }}
                >
                  <span className="text-white font-medium truncate">{food.text}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEditing(food.id, food.text)}
                      className="p-1 bg-white/20 text-white rounded hover:bg-white/30 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => removeItem(food.id)}
                      className="p-1 bg-white/20 text-white rounded hover:bg-white/30 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={resetWheel}
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
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">What is Random Food Picker?</h2>
            <p className="mb-4">
              Random Food Picker is an interactive spinning wheel tool designed to help you decide what to eat when you can&apos;t make up your mind. Whether you&apos;re choosing between restaurants, deciding on a meal, or picking a snack, our wheel makes the decision process fun and fair.
            </p>
            <p className="mb-4">
              The wheel features customizable food options with colorful segments, making it both functional and visually appealing. Simply add your food choices, spin the wheel, and let fate decide what you&apos;ll be eating!
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">How does the Random Food Picker work?</h3>
                <p>
                  The wheel contains your custom food options arranged in a circle. When you click the &quot;SPIN&quot; button in the center, the wheel rotates multiple times before gradually slowing down to land on a randomly selected food option. The selection is completely random and fair.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Can I customize the food options?</h3>
                <p>
                  Yes! You can add, edit, or remove food options to match your preferences. Simply use the input field to add new options, or click the edit/delete buttons on existing items to modify them.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">How many food options can I add?</h3>
                <p>
                  You can add up to 12 different food options to your wheel. This limit ensures that the wheel remains visually appealing and that each option has enough space to be clearly visible.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Is the Random Food Picker free to use?</h3>
                <p>
                  Yes! Random Food Picker is completely free to use. There are no hidden fees, subscriptions, or in-app purchases required.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Can I share my results with friends?</h3>
                <p>
                  Absolutely! After spinning the wheel, you can share your results directly with friends through various platforms using the share button.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Fun Ways to Use Random Food Picker</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Decide what to eat for dinner when you can&apos;t choose</li>
              <li>Pick a restaurant to visit with friends or family</li>
              <li>Choose a snack when you&apos;re indecisive</li>
              <li>Plan your weekly meals randomly</li>
              <li>Make group dining decisions fair and fun</li>
              <li>Try new foods by adding them to the wheel</li>
              <li>Break out of your food routine</li>
              <li>Make meal planning more exciting</li>
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
                  <span className="text-2xl">🍽️</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Time to Eat!</h2>
                <p className="text-gray-600 text-sm sm:text-base">The selected food is:</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-2xl relative overflow-hidden animate-pulse ring-4 ring-emerald-200 ring-opacity-50">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-ping"></div>
                <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="relative z-10">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center mb-2 animate-bounce">
                    {winner?.text}
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

export default RandomFoodPicker;

