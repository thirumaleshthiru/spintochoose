'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, RotateCcw, Share2, Download, Edit2, Clock } from 'lucide-react';
import Image from 'next/image';

interface SpinItem {
  id: number;
  text: string;
  color: string;
}

interface HistoryEntry {
  id: number;
  winner: string;
  timestamp: string;
}

const SpinTool: React.FC = () => {
  const [items, setItems] = useState<SpinItem[]>([
    { id: 1, text: 'Yes', color: '#F4A261' },
    { id: 2, text: 'No', color: '#2A9D8F' },
    { id: 3, text: 'Yes', color: '#E9C46A' },
    { id: 4, text: 'No', color: '#264653' },
  ]);
  const [newItem, setNewItem] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<SpinItem | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const colors: string[] = ['#F4A261', '#2A9D8F', '#E9C46A', '#264653', '#E76F51', '#219EBC', '#8ECAE6', '#023047'];

  useEffect(() => {
    if (showWinnerModal || showHistoryModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showWinnerModal, showHistoryModal]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editingId) {
        finishEditing();
      } else {
        addItem();
      }
    }
  };

  const addItem = () => {
    if (newItem.trim() && items.length < 12) {
      setItems([
        ...items,
        {
          id: Date.now(),
          text: newItem.trim(),
          color: colors[items.length % colors.length],
        },
      ]);
      setNewItem('');
    }
  };

  const removeItem = (id: number) => {
    if (items.length > 2) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setNewItem(text);
  };

  const finishEditing = () => {
    if (newItem.trim()) {
      setItems(
        items.map((item) =>
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

  const spinWheel = () => {
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
          items.length - 1 - Math.floor((totalRotation % 360) / (360 / items.length));
        const winningItem = items[winningIndex % items.length];
        setWinner(winningItem);
        setShowWinnerModal(true);
        setHistory([
          {
            id: Date.now(),
            winner: winningItem.text,
            timestamp: new Date().toLocaleString(),
          },
          ...history,
        ]);
      }, 5000);
    }
  };

  const resetWheel = () => {
    setRotation(0);
    setWinner(null);
    setIsSpinning(false);
  };

  const downloadResults = () => {
    if (winner) {
      const element = document.createElement('a');
      const file = new Blob([`Winner: ${winner.text}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'spin-result.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const shareResults = async () => {
    if (winner && navigator.share) {
      try {
        await navigator.share({
          title: 'Spin Wheel Result',
          text: `The winner is: ${winner.text}!`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 sm:p-6 overflow-x-hidden">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-[#264653]">
          Spin Wheel
        </h1>

        <div className="flex flex-col gap-6 w-full">
          <div className="flex justify-center">
            <div className="relative w-full max-w-[350px] sm:max-w-[500px] aspect-square">
              <div
                ref={wheelRef}
                className="relative w-full h-full transform-gpu transition-transform duration-[5000ms] ease-[cubic-bezier(0.2,0,0.3,1)]"
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {items.map((item, index) => {
                    const angleSize = (2 * Math.PI) / items.length;
                    const startAngle = index * angleSize - Math.PI / 2;
                    const endAngle = (index + 1) * angleSize - Math.PI / 2;
                    
                    const midAngle = (startAngle + endAngle) / 2;
                    const textRadius = 35;
                    const textX = 50 + textRadius * Math.cos(midAngle);
                    const textY = 50 + textRadius * Math.sin(midAngle);
                    const textRotationAngle = (midAngle * 180 / Math.PI);

                    return (
                      <g key={item.id}>
                        <path
                          d={createWheelPath(startAngle, endAngle)}
                          fill={item.color}
                          className="transition-all duration-300"
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill="#000000"
                          fontSize="4"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textRotationAngle}, ${textX}, ${textY})`}
                          className="select-none pointer-events-none uppercase"
                        >
                          {item.text}
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
                <Image src="/spin.png" alt="Spin Button" width={100} height={100} priority />
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
                placeholder={editingId ? 'Edit item' : 'Add new item'}
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
                  disabled={items.length >= 12}
                  className="p-3 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#219EBC] disabled:opacity-50 disabled:cursor-not-allowed transition-all max-w-fit"
                > 
                  <Plus size={20} />  
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: item.color }}
                >
                  <span className="text-white font-medium truncate">{item.text}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEditing(item.id, item.text)}
                      className="p-1 bg-white/20 text-white rounded hover:bg-white/30 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
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
              <button
                onClick={() => setShowHistoryModal(true)}
                className="p-3 bg-gray-100 text-[#264653] rounded-lg hover:bg-gray-200 transition-all"
              >
                <Clock size={20} />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">What is Spin Wheel?</h2>
            <p className="mb-4">
              Spin Wheel is the ultimate random picker and decision wheel that helps you make choices quickly and fairly. Whether you need a random name picker, a yes or no wheel, or a spinning wheel generator for any purpose, our customizable wheel spinner online makes the selection process fun and unbiased.
            </p>
            <p className="mb-4">
              This versatile spin wheel works as a random choice generator, a wheel of names, or even a truth or dare spinner. From simple yes or no decisions to complex choices, our spin wheel app helps you decide with a simple spin. It&apos;s the perfect coin flip alternative that adds excitement to decision-making!
            </p>
            <p className="mb-4">
              As a random decision maker, you can use it to answer &quot;what should I do&quot; questions or determine &quot;who will go first&quot; in games. The wheel features colorful segments that you can customize with your own options. Simply add your choices, spin to decide, and let our wheel for fun decisions guide your way!
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">How does the Spin Wheel work?</h3>
                <p>
                  Our random choice wheel arranges your custom options in a circle. When you click the &quot;SPIN&quot; button, the spinning wheel generator rotates multiple times before gradually slowing down to land on a randomly selected option. Whether you&apos;re using it as a yes or no randomizer or a random name picker, the selection is completely random and fair.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Is this Decision Wheel free to use?</h3>
                <p>
                  Yes! Our wheel spinner online is completely free to use. Whether you need a simple yes or no generator or a more complex random picker, there are no hidden fees, subscriptions, or in-app purchases required to enjoy the full functionality of the wheel for making decisions.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">How many options can I add to the wheel?</h3>
                <p>
                  You can add up to 12 different options to your wheel. This limit ensures that the wheel remains visually appealing and that each option has enough space to be clearly visible.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Can I edit or remove options after adding them?</h3>
                <p>
                  Yes! You can edit any option by clicking the edit icon next to it, or remove it entirely by clicking the trash icon. The wheel will automatically adjust to accommodate your changes.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Can I share my results with others?</h3>
                <p>
                  Absolutely! After spinning the wheel, you can share your results directly with friends through various platforms using the share button. This makes it easy to let others know which option was randomly selected.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Is there a history of my spins?</h3>
                <p>
                  Yes! The Spin Wheel keeps track of your previous spins, including the winning option and the time it was selected. You can view this history by clicking the clock icon in the controls section.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Can I use the Spin Wheel on mobile devices?</h3>
                <p>
                  Yes! Spin Wheel is fully responsive and works on all devices including smartphones, tablets, laptops, and desktop computers. The wheel is optimized for touch screens, making it easy to spin on mobile devices.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Fun Ways to Use Our Random Choice Generator</h2>
            <p className="mb-4">
              Our spin wheel app offers multiple ways to make decisions fun and easy:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the &quot;should I do it&quot; wheel for quick yes or no answers</li>
              <li>Spin the wheel yes or no for simple binary choices</li>
              <li>Create a yes no maybe wheel for more nuanced decisions</li>
              <li>Use as a truth or dare spinner for party games</li>
              <li>Set up a wheel of names to pick random winners</li>
              <li>Create a who will go first wheel for games</li>
              <li>Make a choice spinner for daily decisions</li>
              <li>Use as a decision maker wheel for group activities</li>
            </ul>
            <p className="mt-4">
              Whether you need a random name picker or a simple yes or no answer tool, our spin wheel makes decision-making fun and fair!
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Spin Wheel for Decision Making</h2>
            <p className="mb-4">
              When faced with multiple choices, the Spin Wheel can help you make decisions quickly and fairly. Here are some ways to use it for everyday decision-making:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Meal Planning:</strong> Add different meal options to the wheel and spin to decide what to cook for dinner.</li>
              <li><strong>Entertainment Choices:</strong> Use the wheel to randomly select movies, TV shows, or games to enjoy.</li>
              <li><strong>Travel Planning:</strong> Add potential destinations to the wheel and let it choose your next vacation spot.</li>
              <li><strong>Daily Activities:</strong> Create a list of activities you enjoy and let the wheel decide how to spend your free time.</li>
              <li><strong>Gift Ideas:</strong> When shopping for someone, add various gift options to the wheel for inspiration.</li>
            </ul>
            <p>
              The randomness of the Spin Wheel eliminates decision fatigue and adds an element of excitement to your choices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Spin Wheel for Group Activities</h2>
            <p className="mb-4">
              The Spin Wheel is perfect for group settings where fair selection is important. Here are some ways to use it with friends, family, or colleagues:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Team Assignments:</strong> Use the wheel to randomly assign team members for group projects or activities.</li>
              <li><strong>Turn Taking:</strong> Let the wheel decide whose turn it is in games or group discussions.</li>
              <li><strong>Prize Drawings:</strong> Use the wheel to randomly select winners for contests or giveaways.</li>
              <li><strong>Activity Selection:</strong> Have group members add their preferred activities to the wheel and spin to decide what to do together.</li>
              <li><strong>Fair Distribution:</strong> Use the wheel to fairly distribute tasks, responsibilities, or resources among group members.</li>
            </ul>
            <p>
              The Spin Wheel ensures that everyone has an equal chance of being selected, making it ideal for fair group decision-making.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Spin Wheel for Education</h2>
            <p className="mb-4">
              Teachers and educators can use the Spin Wheel as an interactive tool in the classroom:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Student Selection:</strong> Use the wheel to randomly call on students to answer questions or participate in activities.</li>
              <li><strong>Topic Selection:</strong> Add different topics or subjects to the wheel and let it decide what to study next.</li>
              <li><strong>Group Formation:</strong> Randomly assign students to groups for collaborative projects or discussions.</li>
              <li><strong>Reward System:</strong> Use the wheel to randomly select students for rewards or recognition.</li>
              <li><strong>Review Games:</strong> Create review questions and use the wheel to randomly select which ones to answer.</li>
            </ul>
            <p>
              The Spin Wheel adds an element of fun and fairness to classroom activities, keeping students engaged and excited about learning.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Spin Wheel for Personal Growth</h2>
            <p className="mb-4">
              The Spin Wheel can be a tool for personal development and breaking out of your comfort zone:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Habit Formation:</strong> Add different habits you want to develop and let the wheel decide which one to focus on each day.</li>
              <li><strong>Skill Development:</strong> Use the wheel to randomly select skills to practice or learn.</li>
              <li><strong>Reading Selection:</strong> Add books to your reading list and let the wheel decide which one to read next.</li>
              <li><strong>Exercise Variety:</strong> Add different types of exercises to the wheel and spin to create varied workout routines.</li>
              <li><strong>Social Activities:</strong> Use the wheel to randomly select social activities to help overcome social anxiety.</li>
            </ul>
            <p>
              The randomness of the Spin Wheel can help you break out of routines and try new things, promoting personal growth and discovery.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Spin Wheel Tips and Tricks</h2>
            <p className="mb-4">
              Get the most out of your Spin Wheel experience with these helpful tips:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Be Specific:</strong> Add clear, specific options to the wheel for the best results.</li>
              <li><strong>Use Color Coding:</strong> Take advantage of the different colors to visually distinguish between options.</li>
              <li><strong>Keep Options Balanced:</strong> Try to keep your options somewhat similar in length for a more visually appealing wheel.</li>
              <li><strong>Save Common Wheels:</strong> Create wheels for frequently used decisions and keep them handy.</li>
              <li><strong>Share with Others:</strong> Use the share button to let others know the result of your spin.</li>
              <li><strong>Check History:</strong> Review your spin history to see patterns or track your decisions over time.</li>
              <li><strong>Combine with Other Tools:</strong> Use the Spin Wheel alongside other decision-making tools for more complex choices.</li>
            </ul>
            <p>
              The Spin Wheel is designed to be simple and intuitive, but these tips can help you get even more value from using it.
            </p>
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
                  <span className="text-2xl">🎉</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Congratulations!</h2>
                <p className="text-gray-600 text-sm sm:text-base">The winner is:</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-2xl relative overflow-hidden animate-pulse ring-4 ring-emerald-200 ring-opacity-50">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-ping"></div>
                <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="relative z-10">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-2 animate-bounce">
                    {winner?.text}
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-1 bg-white/50 rounded-full"></div>
                    <span className="mx-3 text-white/80 text-sm font-semibold tracking-wider">WINNER</span>
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

      {showHistoryModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => setShowHistoryModal(false)}
        >
          <div 
            className="bg-white p-4 sm:p-6 rounded-2xl w-full max-w-sm sm:max-w-md mx-auto my-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg sm:text-xl font-medium text-[#264653] mb-4">Spin History</h3>
            <div className="space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2 flex-1">
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No spin history yet</p>
              ) : (
                history.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                  >
                    <div>
                      <p className="text-[#264653] font-medium text-sm sm:text-base">{entry.winner}</p>
                      <p className="text-xs text-gray-500">{entry.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#219EBC] transition-all text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default SpinTool;