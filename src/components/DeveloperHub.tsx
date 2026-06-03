import React, { useState, useRef, useEffect } from 'react';
import { IndieGameSpec, GameReview, BugReport } from '../types';
import { Play, Bug, Star, MessageSquare, Sparkles, Plus, CheckCircle2, ShieldCheck, Gamepad2, ArrowLeft } from 'lucide-react';

interface DeveloperHubProps {
  games: IndieGameSpec[];
  setGames: React.Dispatch<React.SetStateAction<IndieGameSpec[]>>;
  xp: number;
  setXp: (xp: number) => void;
  username: string;
}

export default function DeveloperHub({
  games,
  setGames,
  xp,
  setXp,
  username
}: DeveloperHubProps) {
  const [selectedGameId, setSelectedGameId] = useState<string>("g_starship");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [reviewText, setReviewText] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [isTester, setIsTester] = useState<boolean>(true);

  // Bug reporting
  const [bugDesc, setBugDesc] = useState<string>('');
  const [bugSeverity, setBugSeverity] = useState<'low' | 'medium' | 'high'>('low');

  // Mini retro Canvas game states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const currentGame = games.find(g => g.id === selectedGameId) || games[0];

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    const newReview: GameReview = {
      id: "rev_" + Date.now().toString(),
      author: username,
      rating: reviewRating,
      comment: reviewText,
      date: new Date().toISOString().split('T')[0],
      isPlaytester: isTester
    };

    const updated = games.map(g => {
      if (g.id === currentGame.id) {
        const nextReviews = [newReview, ...g.reviews];
        // recalculate rating index
        const average = parseFloat((nextReviews.reduce((sum, r) => sum + r.rating, 0) / nextReviews.length).toFixed(1));
        return {
          ...g,
          reviews: nextReviews,
          rating: average
        };
      }
      return g;
    });

    setGames(updated);
    setReviewText('');
    setXp(xp + 150); // XP bonus for leaving structured review!
    alert("Playtester review logged! +150 XP rewarded.");
  };

  const handleAddBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugDesc.trim()) return;

    const newBug: BugReport = {
      id: "bug_" + Date.now().toString(),
      reporter: username,
      description: bugDesc,
      severity: bugSeverity,
      status: 'open',
      date: new Date().toISOString().split('T')[0]
    };

    const updated = games.map(g => {
      if (g.id === currentGame.id) {
        return {
          ...g,
          bugs: [newBug, ...g.bugs]
        };
      }
      return g;
    });

    setGames(updated);
    setBugDesc('');
    setXp(xp + 200); // Bug reporting requires effort!
    alert("Indie bug report logged to repository database! +200 XP rewarded.");
  };

  const handleResolveBug = (bugId: string) => {
    const updated = games.map(g => {
      if (g.id === currentGame.id) {
        return {
          ...g,
          bugs: g.bugs.map(b => b.id === bugId ? { ...b, status: 'resolved' as const } : b)
        };
      }
      return g;
    });
    setGames(updated);
    alert("Bug marked as resolved under playtester supervision.");
  };

  // Canvas Retro Game Core Logic (Dodger Game with Mouse or Touch Coordinates)
  useEffect(() => {
    if (!isPlaying || !canvasRef.current || !gameActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let scoreVal = 0;
    
    // Game Entities
    const player = {
      x: canvas.width / 2,
      y: canvas.height - 40,
      width: 24,
      height: 24,
      speed: 6,
      color: "#6366f1" // Custom Indigo
    };

    interface Projectile {
      x: number;
      y: number;
      radius: number;
      speed: number;
      color: string;
      type: 'comet' | 'star';
    }

    let items: Projectile[] = [];
    let spawnTimer = 0;

    // Tracker for mouse positioning
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // center canvas coordinate mouse tracker
      const relX = e.clientX - rect.left;
      player.x = Math.max(10, Math.min(canvas.width - 10 - player.width, relX - player.width / 2));
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Main running game loop
    const renderLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep space grid background
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw active Player space shield
      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y + player.height);
      ctx.lineTo(player.x + player.width / 2, player.y);
      ctx.lineTo(player.x + player.width, player.y + player.height);
      ctx.closePath();
      ctx.fill();

      // glowing engines
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(player.x + player.width / 3, player.y + player.height, player.width / 3, 4);

      // Entity spawns
      spawnTimer++;
      if (spawnTimer % 25 === 0) {
        const isComet = Math.random() > 0.35;
        items.push({
          x: Math.random() * (canvas.width - 20) + 10,
          y: -10,
          radius: isComet ? Math.random() * 8 + 6 : 6,
          speed: Math.random() * 3 + 2.5,
          color: isComet ? "#f43f5e" : "#10b981", // Comet (avoid) vs Crystal (collect)
          type: isComet ? 'comet' : 'star'
        });
      }

      // Update entity coordinate ticks
      for (let k = 0; k < items.length; k++) {
        const item = items[k];
        item.y += item.speed;

        // Draw entity
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fill();

        // Simple box collision
        const dist = Math.hypot(item.x - (player.x + player.width / 2), item.y - (player.y + player.height / 2));
        if (dist < item.radius + player.width / 2) {
          if (item.type === 'comet') {
            // GameOver trigger
            setGameActive(false);
            setGameOver(true);
            setIsPlaying(false);
            // Reward half experience
            setXp(xp + scoreVal * 5);
            return;
          } else {
            // Score capture!
            scoreVal += 100;
            setGameScore(scoreVal);
            items.splice(k, 1);
            k--;
            continue;
          }
        }

        // Out of bounds cleanup
        if (item.y > canvas.height + 10) {
          items.splice(k, 1);
          k--;
        }
      }

      // Draw score in UI
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px monospace";
      ctx.fillText(`SCORE: ${scoreVal}`, 15, 25);

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying, gameActive]);

  const startGameRunner = () => {
    setGameScore(0);
    setGameOver(false);
    setGameActive(true);
    setIsPlaying(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="developer-hub">
      {/* Sidebar selection */}
      <div className="lg:col-span-1 space-y-5" id="games-catalogue-sidebar">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="explore-showcase-card">
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-100">Playtester Showcase</h3>
          </div>

          <div className="space-y-4" id="indie-games-selector-column">
            {games.map(g => (
              <div
                key={g.id}
                onClick={() => { setSelectedGameId(g.id); setIsPlaying(false); setGameOver(false); }}
                className={`cursor-pointer border rounded-xl p-4 transition-all ${
                  selectedGameId === g.id
                    ? 'bg-indigo-950/30 border-indigo-500'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
                id={`game-selector-${g.id}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                    {g.genre}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{g.rating}</span>
                  </div>
                </div>

                <h4 className="font-semibold text-sm text-slate-100 mt-1">{g.name}</h4>
                <p className="text-xs text-slate-500">By {g.developer}</p>

                <div className="mt-3 flex justify-between items-center font-mono text-[10px] text-slate-500 border-t border-slate-850 pt-2">
                  <span>Plays: {g.plays}</span>
                  <span className="text-rose-450 text-[10px] flex items-center gap-1">
                    <Bug className="w-3 h-3 text-rose-500" />
                    {g.bugs.filter(b => b.status === 'open').length} Open Issues
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Playtester Certification Notice */}
        <div className="bg-gradient-to-br from-indigo-950/30 to-slate-950 border border-indigo-900/30 rounded-xl p-5" id="tester-notice-card">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4.5 h-4.5 text-indigo-400" />
            Approved Tester Status
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your profile coordinates are registered under playtesting directories. Reporting functional crashes, timing delays, or balancing issues rewards immediate platform experience modifiers.
          </p>
        </div>
      </div>

      {/* Playable emulator frame & logs */}
      <div className="lg:col-span-2 space-y-6" id="game-main-workbench">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6" id="emulator-panel">
          <div className="flex justify-between items-center pb-4 border-b border-slate-805 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">{currentGame.name}</h2>
              <span className="text-xs text-slate-400 font-mono">Developer ID: {currentGame.developer}</span>
            </div>
            
            {isPlaying && (
              <button
                onClick={() => { setIsPlaying(false); setGameActive(false); }}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Stop Build Emulation
              </button>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-6 bg-slate-950 p-3 rounded.lg border border-slate-805">
            {currentGame.description}
          </p>

          {/* Interactive WebGL / Canvas Container */}
          {!isPlaying ? (
            <div className="bg-slate-950 rounded-xl border border-dashed border-slate-800 p-12 text-center relative overflow-hidden" id="play-teaser-board">
              <div className="max-w-md mx-auto relative z-10">
                <Gamepad2 className="w-14 h-14 text-indigo-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-lg font-bold text-slate-200">Load Client Sandboxed WebGL Build</h3>
                <p className="text-xs text-slate-400 mt-2 mb-6">
                  Test the gameplay physics, collision parameters, and report anomalies directly through our unified console frame.
                </p>
                <button
                  onClick={startGameRunner}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-lg text-xs tracking-wider transition uppercase"
                  id="btn-trigger-emulator"
                >
                  Launch Web Player Build
                </button>
              </div>
            </div>
          ) : (
            /* GAME RUNNING WINDOW */
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 text-center space-y-4" id="embed-screen-frame">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400 px-1">
                <span>SYSTEM SPEED: 60FPS</span>
                <span className="text-indigo-400 font-bold">CONTROL: Move Mouse Left/Right</span>
              </div>

              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={320}
                  className="border border-slate-800 bg-slate-950 rounded-lg max-w-full cursor-none shadow-indigo-950/20 shadow-2xl"
                  id="retro-game-canvas"
                />
              </div>

              {gameOver && (
                <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg" id="game-over-banner">
                  <span className="text-red-400 font-bold font-mono text-xs block">COLLISION DETECTED! SHIP Hull CRITICAL</span>
                  <span className="text-[11px] text-slate-400 font-mono">Your testing Score is {gameScore} | Experience Reward processing...</span>
                </div>
              )}

              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={startGameRunner}
                  className="bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold px-4 py-1.5 rounded text-xs transition"
                >
                  Restart Instance
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setGameActive(false); }}
                  className="bg-rose-950/40 border border-rose-900/60 text-rose-300 font-semibold px-4 py-1.5 rounded text-xs transition"
                >
                  Disconnect Core Emulator
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Review feedback & Bug tracker grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="subsections-dev-ecosystem">
          {/* Tracker 1: Bug Reports */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="bugs-tracker-box">
            <h3 className="font-bold text-sm text-slate-200 mb-4 flex items-center gap-2">
              <Bug className="w-4 h-4 text-rose-500" />
              Tester Incident database
            </h3>

            {/* Incident submit form */}
            <form onSubmit={handleAddBug} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 mb-4 space-y-3">
              <span className="text-[10px] text-indigo-400 font-mono block uppercase">File New Crash Log</span>
              
              <input
                type="text"
                placeholder="Describe bug or asset clipping glitch"
                value={bugDesc}
                onChange={(e) => setBugDesc(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-100 rounded p-2 text-xs w-full focus:outline-none focus:border-indigo-600"
              />

              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map(sev => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setBugSeverity(sev)}
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold border transition ${
                        bugSeverity === sev
                          ? sev === 'high' ? 'bg-red-950/40 border-red-500 text-red-400' : 'bg-slate-900 border-indigo-500 text-indigo-300'
                          : 'bg-slate-900/60 border-slate-850 text-slate-500'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] py-1 px-3 rounded uppercase"
                >
                  Log Issue
                </button>
              </div>
            </form>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1" id="bugs-logs-list">
              {currentGame.bugs.length === 0 ? (
                <div className="text-center text-xs text-slate-500 py-6">No reported issues open for tracking.</div>
              ) : (
                currentGame.bugs.map(b => (
                  <div key={b.id} className="bg-slate-950/60 p-3 rounded.lg border border-slate-850 flex justify-between gap-3 text-xs" id={`bug-row-${b.id}`}>
                    <div className="space-y-1">
                      <p className="text-slate-300 leading-tight font-mono">{b.description}</p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                        <span>Reporter: {b.reporter}</span>
                        <span>•</span>
                        <span className={`uppercase font-bold ${
                          b.severity === 'high' ? 'text-red-400' : 'text-slate-400'
                        }`}>{b.severity}</span>
                      </div>
                    </div>

                    <div className="text-right flex flex-col justify-between items-end gap-1 shrink-0">
                      <span className="text-[9px] font-mono text-slate-550">{b.date}</span>
                      {b.status === 'open' ? (
                        <button
                          onClick={() => handleResolveBug(b.id)}
                          className="bg-rose-955/20 hover:bg-rose-900/40 text-rose-350 border border-rose-900/40 text-[9px] font-mono px-1.5 py-0.5 rounded"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-emerald-400 text-[10px] inline-flex items-center gap-0.5">
                          ✓ Fixed
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tracker 2: Playtester Reviews */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="reviews-box">
            <h3 className="font-bold text-sm text-slate-200 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              Community Playtester Journal
            </h3>

            {/* Leave review form */}
            <form onSubmit={handleAddReview} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 mb-4 space-y-3">
              <span className="text-[10px] text-indigo-400 font-mono block uppercase">Author Playtest Verdict</span>
              
              <input
                type="text"
                placeholder="Your balance suggestions, visual feedback, or praise..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-100 rounded p-2 text-xs w-full focus:outline-none focus:border-indigo-600"
              />

              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1 text-slate-400 font-mono">
                  <span>Rating:</span>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    className="bg-slate-900 text-amber-400 border border-slate-800 font-bold p-1 rounded"
                  >
                    <option value="5">★★★★★</option>
                    <option value="4">★★★★☆</option>
                    <option value="3">★★★☆☆</option>
                    <option value="2">★★☆☆☆</option>
                    <option value="1">★☆☆☆☆</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] py-1 px-3 rounded uppercase"
                >
                  Save Review
                </button>
              </div>
            </form>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1" id="reviews-scroll-list">
              {currentGame.reviews.map(r => (
                <div key={r.id} className="bg-slate-950/60 p-3 rounded.lg border border-slate-850 space-y-1.5" id={`review-row-${r.id}`}>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 font-mono">{r.author}</span>
                      {r.isPlaytester && (
                        <span className="text-[9px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-1.5 rounded">
                          VERIFIED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 text-amber-500 font-bold">
                      {"★".repeat(r.rating)}
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 leading-tight italic">
                    "{r.comment}"
                  </p>
                  
                  <span className="text-[9px] font-mono text-slate-600 block text-right">{r.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
