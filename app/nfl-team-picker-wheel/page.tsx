'use client';

import React, { useState, useRef, useEffect } from 'react';

import {   Share2, Download, RotateCcw } from 'lucide-react';

interface NFLTeam {
  id: number;
  text: string;
  color: string;
}

const NFLTeamPicker: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<NFLTeam | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const wheelRef = useRef<HTMLDivElement>(null);

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

  const nflTeams: NFLTeam[] = [
    { id: 1, text: 'New York Jets', color: '#125740' },
    { id: 2, text: 'Pittsburgh Steelers', color: '#101820' },
    { id: 3, text: 'Tennessee Titans', color: '#0C2340' },
    { id: 4, text: 'Arizona Cardinals', color: '#97233F' },
    { id: 5, text: 'Atlanta Falcons', color: '#A71930' },
    { id: 6, text: 'Carolina Panthers', color: '#0085CA' },
    { id: 7, text: 'Chicago Bears', color: '#0B162A' },
    { id: 8, text: 'Dallas Cowboys', color: '#003594' },
    { id: 9, text: 'Detroit Lions', color: '#0076B6' },
    { id: 10, text: 'Green Bay Packers', color: '#203731' },
    { id: 11, text: 'Los Angeles Rams', color: '#003594' },
    { id: 12, text: 'Minnesota Vikings', color: '#4F2683' },
    { id: 13, text: 'New Orleans Saints', color: '#101820' },
    { id: 14, text: 'New York Giants', color: '#0B2265' },
    { id: 15, text: 'Philadelphia Eagles', color: '#004C54' },
    { id: 16, text: 'San Francisco 49ers', color: '#AA0000' },
    { id: 17, text: 'Seattle Seahawks', color: '#002244' },
    { id: 18, text: 'Tampa Bay Buccaneers', color: '#FF7900' },
    { id: 19, text: 'Washington Commanders', color: '#5A1414' },
    { id: 20, text: 'Baltimore Ravens', color: '#241773' },
    { id: 21, text: 'Buffalo Bills', color: '#00338D' },
    { id: 22, text: 'Cincinnati Bengals', color: '#FB4F14' },
    { id: 23, text: 'Cleveland Browns', color: '#311D00' },
    { id: 24, text: 'Denver Broncos', color: '#FB4F14' },
    { id: 25, text: 'Houston Texans', color: '#03202F' },
    { id: 26, text: 'Indianapolis Colts', color: '#002C5F' },
    { id: 27, text: 'Jacksonville Jaguars', color: '#101820' },
    { id: 28, text: 'Kansas City Chiefs', color: '#E31837' },
    { id: 29, text: 'Las Vegas Raiders', color: '#000000' },
    { id: 30, text: 'Los Angeles Chargers', color: '#0080C6' },
    { id: 31, text: 'Miami Dolphins', color: '#008E97' },
    { id: 32, text: 'New England Patriots', color: '#002244' },
  ];

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
          nflTeams.length - 1 - Math.floor((totalRotation % 360) / (360 / nflTeams.length));
        const winningItem = nflTeams[winningIndex % nflTeams.length];
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
          title: 'NFL Team Picker Result',
          text: `The selected team is: ${winner.text}!`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const downloadResults = (): void => {
    if (winner) {
      const element = document.createElement('a');
      const file = new Blob([`Selected Team: ${winner.text}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'nfl-team-picker-result.txt';
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
          NFL Team Picker
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
                  {nflTeams.map((team, index) => {
                    const angleSize = (2 * Math.PI) / nflTeams.length;
                    const startAngle = index * angleSize - Math.PI / 2;
                    const endAngle = (index + 1) * angleSize - Math.PI / 2;
                    
                    const midAngle = (startAngle + endAngle) / 2;
                    const textRadius = 35;
                    const textX = 50 + textRadius * Math.cos(midAngle);
                    const textY = 50 + textRadius * Math.sin(midAngle);
                    const textRotationAngle = (midAngle * 180 / Math.PI);

                    return (
                      <g key={team.id}>
                        <path
                          d={createWheelPath(startAngle, endAngle)}
                          fill={team.color}
                          className="transition-all duration-300"
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill="#FFFFFF"
                          fontSize="2"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textRotationAngle}, ${textX}, ${textY})`}
                          className="select-none pointer-events-none uppercase"
                        >
                          {team.text}
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
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">What is NFL Team Picker?</h2>
            <p className="mb-4">
              NFL Team Picker is an interactive spinning wheel tool designed to randomly select NFL teams for various purposes. Whether you&apos;re deciding which team to root for, choosing teams for a fantasy league, or just having fun with friends, our wheel makes the selection process exciting and fair.
            </p>
            <p className="mb-4">
              The wheel features all 32 NFL teams with their official colors, making it both functional and visually appealing. Simply spin the wheel and let fate decide which team you&apos;ll be supporting!
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">How does the NFL Team Picker wheel work?</h3>
                <p>
                  The wheel contains all 32 NFL teams arranged in a circle. When you click the &quot;SPIN&quot; button in the center, the wheel rotates multiple times before gradually slowing down to land on a randomly selected team. The selection is completely random and fair, ensuring no team has an advantage.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Is the NFL Team Picker free to use?</h3>
                <p>
                  Yes! NFL Team Picker is completely free to use. There are no hidden fees, subscriptions, or in-app purchases required to enjoy the full functionality of the wheel.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Can I share my results with friends?</h3>
                <p>
                  Absolutely! After spinning the wheel, you can share your results directly with friends through various platforms using the share button. This makes it easy to let others know which team was randomly selected for you.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">How can I use the NFL Team Picker for fantasy football?</h3>
                <p>
                  The NFL Team Picker is perfect for fantasy football! Use it to randomly assign teams to players in your fantasy league, or to decide which team&apos;s players to focus on when building your fantasy roster. It adds an element of fun and fairness to your fantasy football experience.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Does the wheel include all current NFL teams?</h3>
                <p>
                  Yes, our wheel is regularly updated to include all 32 current NFL teams with their official colors and logos. We stay current with any team relocations, rebranding, or other changes in the NFL.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Can I use the NFL Team Picker on mobile devices?</h3>
                <p>
                  Yes! NFL Team Picker is fully responsive and works on all devices including smartphones, tablets, laptops, and desktop computers. The wheel is optimized for touch screens, making it easy to spin on mobile devices.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Is there a limit to how many times I can spin the wheel?</h3>
                <p>
                  No, there are no limits! You can spin the wheel as many times as you want. Each spin is independent and completely random, so you can keep spinning until you&apos;re satisfied with your selection.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">Fun Ways to Use NFL Team Picker</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Decide which team to root for during the NFL season</li>
              <li>Assign teams for fantasy football leagues</li>
              <li>Choose teams for friendly competitions or bets</li>
              <li>Add excitement to NFL watch parties</li>
              <li>Help undecided fans pick a team to support</li>
              <li>Create random matchups for NFL discussions</li>
              <li>Add an element of surprise to NFL-themed games</li>
              <li>Make team selection fair and unbiased</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">NFL Team Picker for Fantasy Football</h2>
            <p className="mb-4">
              Fantasy football enthusiasts love using our NFL Team Picker to add excitement to their leagues. Here are some creative ways to incorporate the wheel into your fantasy football experience:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Draft Order:</strong> Use the wheel to determine the draft order for your fantasy league, making the process fair and exciting.</li>
              <li><strong>Team Assignments:</strong> Randomly assign NFL teams to fantasy players to create themed teams based on real NFL rosters.</li>
              <li><strong>Weekly Matchups:</strong> When deciding which players to start, use the wheel to randomly select a team&apos;s players to focus on for your lineup.</li>
              <li><strong>Trade Evaluations:</strong> Use the wheel to randomly select teams when evaluating potential trades between fantasy owners.</li>
              <li><strong>League Events:</strong> Add the wheel to your fantasy football draft party or watch parties for interactive fun.</li>
            </ul>
            <p>
              The randomness of the NFL Team Picker adds an element of surprise and fairness to your fantasy football experience, making it more enjoyable for everyone involved.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">NFL Team Picker for Watch Parties</h2>
            <p className="mb-4">
              NFL watch parties are more exciting when everyone has a team to root for. Our NFL Team Picker makes it easy to assign teams to guests who don&apos;t have a favorite team or want to switch things up:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Team Assignments:</strong> Have each guest spin the wheel to get assigned a random NFL team for the day.</li>
              <li><strong>Friendly Competitions:</strong> Create small competitions where guests root for their randomly assigned teams.</li>
              <li><strong>Prize Drawings:</strong> Use the wheel to randomly select winners for NFL-themed prizes or contests.</li>
              <li><strong>Game Predictions:</strong> Spin the wheel to make predictions about which teams will win upcoming games.</li>
              <li><strong>Theme Nights:</strong> Dedicate watch parties to specific teams by using the wheel to select the theme team.</li>
            </ul>
            <p>
              Adding the NFL Team Picker to your watch parties creates a more interactive and engaging experience for all your football-loving friends.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">NFL Team Picker for Education</h2>
            <p className="mb-4">
              Teachers and parents can use the NFL Team Picker as an educational tool to teach children about NFL teams, geography, and probability:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Geography Lessons:</strong> Teach children about the cities and states where NFL teams are located.</li>
              <li><strong>Color Recognition:</strong> Help young children learn colors by identifying team colors on the wheel.</li>
              <li><strong>Probability Concepts:</strong> Use the wheel to demonstrate basic probability concepts in a fun way.</li>
              <li><strong>Team History:</strong> Assign students NFL teams to research and present information about.</li>
              <li><strong>Math Activities:</strong> Create math problems based on the wheel, such as calculating the probability of landing on specific teams.</li>
            </ul>
            <p>
              The NFL Team Picker makes learning about football and related subjects more engaging and interactive for students of all ages.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-[#264653]">NFL Team Picker Tips and Tricks</h2>
            <p className="mb-4">
              Get the most out of your NFL Team Picker experience with these helpful tips:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Multiple Spins:</strong> If you&apos;re not satisfied with your first result, spin again! Each spin is completely independent.</li>
              <li><strong>Share Your Results:</strong> Use the share button to let friends know which team was randomly selected for you.</li>
              <li><strong>Download Your Selection:</strong> Save your result using the download button for future reference.</li>
              <li><strong>Reset the Wheel:</strong> Use the reset button to start fresh if needed.</li>
              <li><strong>Mobile Optimization:</strong> For the best experience on mobile devices, hold your phone in landscape mode.</li>
              <li><strong>Group Activities:</strong> When using the wheel with a group, have each person take turns spinning for a fair experience.</li>
              <li><strong>Create Challenges:</strong> Develop fun challenges based on the teams selected by the wheel.</li>
            </ul>
            <p>
              The NFL Team Picker is designed to be simple and intuitive, but these tips can help you get even more enjoyment from using it.
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
                  <span className="text-2xl">🏈</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Your Team!</h2>
                <p className="text-gray-600 text-sm sm:text-base">The selected NFL team is:</p>
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
                  Share Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFLTeamPicker;
