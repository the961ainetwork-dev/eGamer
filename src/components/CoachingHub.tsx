import React, { useState, useRef, useEffect } from 'react';
import { MOCK_COACHES, INITIAL_TRANSACTIONS } from '../data';
import { CoachSessionBooking } from '../types';
import { Calendar, PenTool, Eraser, Trash2, Shield, Crosshair, Star, Clock, Zap, Target, RefreshCw } from 'lucide-react';

interface CoachingHubProps {
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
  xp: number;
  setXp: (xp: number) => void;
  username: string;
}

export default function CoachingHub({
  walletBalance,
  setWalletBalance,
  xp,
  setXp,
  username
}: CoachingHubProps) {
  // 1-on-1 Booking states
  const [selectedCoachId, setSelectedCoachId] = useState<string>("coach_1");
  const [bookings, setBookings] = useState<CoachSessionBooking[]>([]);
  const [bookingDate, setBookingDate] = useState<string>('2026-06-15');
  const [bookingSlot, setBookingSlot] = useState<string>('15:00 UTC - 16:00 UTC');
  const [vodLink, setVodLink] = useState<string>('');

  // Tactical Whiteboard States
  const whiteboardRef = useRef<HTMLCanvasElement | null>(null);
  const [drawingMap, setDrawingMap] = useState<'val_bind' | 'lol_rift' | 'rl_pitch'>('val_bind');
  const [brushColor, setBrushColor] = useState<string>('#ef4444');
  const [brushSize, setBrushSize] = useState<number>(4);
  const [whiteboardTool, setWhiteboardTool] = useState<'pencil' | 'eraser' | 'marker_shield' | 'marker_target' | 'marker_arrow'>('pencil');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Strategic markers layered on whiteboard coordinates
  interface StrategicMarker {
    x: number;
    y: number;
    type: 'shield' | 'target' | 'arrow';
    color: string;
  }
  const [markers, setMarkers] = useState<StrategicMarker[]>([]);

  // Aim Trainer States
  const [aimActive, setAimActive] = useState<boolean>(false);
  const [aimHits, setAimHits] = useState<number>(0);
  const [aimMisses, setAimMisses] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [targetPos, setTargetPos] = useState<{ x: number; y: number; id: number }>({ x: 50, y: 50, id: 0 });
  const [targetSpawnTime, setTargetSpawnTime] = useState<number>(0);

  const activeCoach = MOCK_COACHES.find(c => c.id === selectedCoachId) || MOCK_COACHES[0];

  // Load tactical maps as background layers or render styled base graphics.
  const tacticalMaps: Record<'val_bind' | 'lol_rift' | 'rl_pitch', string> = {
    val_bind: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=600", // Blueprint vector feel
    lol_rift: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600", // Summoners green top
    rl_pitch: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600"  // Hexagonal pitch green
  };

  // 1. Whiteboard Core Drawing Methods
  useEffect(() => {
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset whiteboard background
    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = tacticalMaps[drawingMap];
    bgImg.onload = () => {
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      // Overlay a grid
      ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw previous markers manually
      markers.forEach(m => {
        ctx.fillStyle = m.color;
        ctx.beginPath();
        if (m.type === 'shield') {
          ctx.arc(m.x, m.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "white";
          ctx.fillText("S", m.x - 3, m.y + 4);
        } else if (m.type === 'target') {
          ctx.arc(m.x, m.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "white";
          ctx.stroke();
          ctx.fillStyle = "white";
          ctx.fillText("T", m.x - 3, m.y + 4);
        } else {
          ctx.arc(m.x, m.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "white";
          ctx.fillText("A", m.x - 3, m.y + 4);
        }
      });
    };
  }, [drawingMap, markers]);

  const handleWhiteboardMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (whiteboardTool === 'pencil' || whiteboardTool === 'eraser') {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = whiteboardTool === 'eraser' ? "#0f172a" : brushColor;
      ctx.lineWidth = whiteboardTool === 'eraser' ? 24 : brushSize;
      ctx.lineCap = "round";
    } else {
      // Place static strategic marker
      const type = whiteboardTool === 'marker_shield' ? 'shield' : whiteboardTool === 'marker_target' ? 'target' : 'arrow';
      setMarkers([...markers, { x, y, type, color: brushColor }]);
    }
  };

  const handleWhiteboardMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleWhiteboardMouseUp = () => {
    setIsDrawing(false);
  };

  const clearWhiteboard = () => {
    setMarkers([]);
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // 2. Aim Trainer System Methods
  const triggerAimRoutineStart = () => {
    setAimActive(true);
    setAimHits(0);
    setAimMisses(0);
    setReactionTimes([]);
    spawnNewAimTarget();
  };

  const spawnNewAimTarget = () => {
    // Spawn grid range ~90% boundary of board
    const randX = Math.floor(Math.random() * 80) + 10;
    const randY = Math.floor(Math.random() * 75) + 12;
    setTargetPos({ x: randX, y: randY, id: Date.now() });
    setTargetSpawnTime(performance.now());
  };

  const handleAimTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!aimActive) return;

    const hitLatency = performance.now() - targetSpawnTime;
    setReactionTimes([...reactionTimes, hitLatency]);
    setAimHits(aimHits + 1);

    if (aimHits + 1 >= 15) {
      // Session finished
      setAimActive(false);
      setXp(xp + 100);
      alert(`Session Done! Average Reaction: ${calculateAverageLatency().toFixed(0)}ms. Precision: ${calculateAccuracyPrecision()}%! +100 XP gained.`);
    } else {
      spawnNewAimTarget();
    }
  };

  const handleBoardMissClick = () => {
    if (!aimActive) return;
    setAimMisses(aimMisses + 1);
  };

  const calculateAverageLatency = () => {
    if (reactionTimes.length === 0) return 0;
    return reactionTimes.reduce((sum, t) => sum + t, 0) / reactionTimes.length;
  };

  const calculateAccuracyPrecision = () => {
    const total = aimHits + aimMisses;
    if (total === 0) return 100;
    return Math.floor((aimHits / total) * 100);
  };

  // 3. Booking Coaching Handler
  const handleBookCoaching = (e: React.FormEvent) => {
    e.preventDefault();

    if (walletBalance < activeCoach.price) {
      alert("Insufficient wallet balance for this 1-on-1 coaching contract fee.");
      return;
    }

    const newBooking: CoachSessionBooking = {
      id: "booking_" + Date.now().toString(),
      coachId: activeCoach.id,
      coachName: activeCoach.name,
      date: bookingDate,
      timeSlot: bookingSlot,
      vodLink: vodLink,
      isConfirmed: true,
      price: activeCoach.price
    };

    setBookings([newBooking, ...bookings]);
    setWalletBalance(walletBalance - activeCoach.price);
    setVodLink('');
    alert(`Success! Scheduled VOD analysis with ${activeCoach.name} for ${bookingDate}. Contract processed.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="coaching-hub">
      
      {/* COLUMN LEFT (8-SPANS): Interactive Workbench for Mechanics */}
      <div className="lg:col-span-8 space-y-6" id="coaching-workbench-main">
        
        {/* Dynamic Whiteboard analyzer */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6" id="whiteboard-analyzer">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-slate-850 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-indigo-400" />
                Cooperative Strat-Map Whiteboard
              </h2>
              <p className="text-xs text-slate-400">
                Overlay tactics visually. Change background strategic zones, draw corridors, and place tactical shields.
              </p>
            </div>

            {/* Strategic Background Loader */}
            <div className="flex items-center gap-2 text-xs font-mono" id="map-loaders">
              <span className="text-slate-500">Zone Map:</span>
              <select
                value={drawingMap}
                onChange={(e) => { setDrawingMap(e.target.value as any); clearWhiteboard(); }}
                className="bg-slate-950 text-indigo-300 border border-slate-800 p-1.5 rounded focus:outline-none"
              >
                <option value="val_bind">Valorant Bind</option>
                <option value="lol_rift">Summoners Rift</option>
                <option value="rl_pitch">Rocket League Arena</option>
              </select>
            </div>
          </div>

          {/* Canvas Draw View */}
          <div className="relative flex justify-center bg-slate-950 p-4 rounded-xl border border-slate-800" id="whiteboard-viewport">
            <canvas
              ref={whiteboardRef}
              width={540}
              height={320}
              onMouseDown={whiteboardMouseDown => handleWhiteboardMouseDown(whiteboardMouseDown)}
              onMouseMove={whiteboardMouseMove => handleWhiteboardMouseMove(whiteboardMouseMove)}
              onMouseUp={whiteboardMouseUp => handleWhiteboardMouseUp()}
              className="border border-slate-850 bg-slate-950 rounded-lg max-w-full cursor-crosshair shadow-inner"
              id="strategic-canvas"
            />
          </div>

          {/* Whiteboard Toolbox Control bar */}
          <div className="mt-4 bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-wrap gap-4 items-center justify-between text-xs" id="whiteboard-toolbox">
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Tool selects */}
              <div className="flex gap-1 bg-slate-900 px-1 py-1 rounded border border-slate-800">
                <button
                  type="button"
                  onClick={() => setWhiteboardTool('pencil')}
                  className={`px-2.5 py-1 rounded font-mono ${
                    whiteboardTool === 'pencil' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Pencil
                </button>
                <button
                  type="button"
                  onClick={() => setWhiteboardTool('eraser')}
                  className={`px-2.5 py-1 rounded font-mono ${
                    whiteboardTool === 'eraser' ? 'bg-slate-800 text-slate-200' : 'text-slate-400'
                  }`}
                >
                  Eraser
                </button>
              </div>

              {/* Strategic Markers Placement options */}
              <div className="flex gap-1.5 items-center">
                <span className="text-slate-500 font-mono text-[11px]">Deploy Mark:</span>
                <button
                  type="button"
                  onClick={() => setWhiteboardTool('marker_shield')}
                  className={`p-1.5 rounded transition border ${
                    whiteboardTool === 'marker_shield' ? 'bg-indigo-950 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                  title="Deploy Defense Shield"
                >
                  <Shield className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setWhiteboardTool('marker_target')}
                  className={`p-1.5 rounded transition border ${
                    whiteboardTool === 'marker_target' ? 'bg-indigo-950 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                  title="Deploy Strategy Objective Target"
                >
                  <Target className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Color selectors */}
              <div className="flex gap-1">
                {['#ef4444', '#10b981', '#3b82f6', '#eab308'].map(col => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => { setBrushColor(col); setWhiteboardTool('pencil'); }}
                    className={`w-5 h-5 rounded-full transition-all ${
                      brushColor === col && whiteboardTool === 'pencil' ? 'ring-2 ring-white scale-110' : 'opacity-80'
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={clearWhiteboard}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-350 px-3.5 py-1.5 rounded font-bold font-mono transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              Reset Strat Map
            </button>
          </div>
        </div>

        {/* Dynamic Circular Aim Trainer game */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6" id="reflex-aim-box animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-500" />
              Pro Mechanics Aim-Reflex Trainer
            </h2>
            <p className="text-xs text-slate-400">
              Warm up before entering tournaments. Complete 15 target hits as fast as possible to verify skill level indexes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4" id="aimtrainer-grid">
            
            {/* Left stats cards */}
            <div className="md:col-span-1 space-y-3 font-mono" id="aimtrainer-sidebar-stats">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850/80">
                <span className="text-[10px] text-slate-500 block uppercase">Hits Cleared</span>
                <span className="text-sm font-bold text-emerald-400">{aimHits} / 15 Hits</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850/80">
                <span className="text-[10px] text-slate-500 block uppercase">Miss Penalty</span>
                <span className="text-sm font-bold text-red-400">{aimMisses} Misses</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850/80">
                <span className="text-[10px] text-slate-500 block uppercase">Reaction Index</span>
                <span className="text-sm font-bold text-indigo-300">
                  {reactionTimes.length > 0 ? `${calculateAverageLatency().toFixed(0)} ms` : '--'}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850/80">
                <span className="text-[10px] text-slate-500 block uppercase">Aim Precision</span>
                <span className="text-sm font-bold text-slate-200">
                  {calculateAccuracyPrecision()}%
                </span>
              </div>
            </div>

            {/* Target spawn board */}
            <div className="md:col-span-3 bg-slate-950 rounded-xl p-4 border border-slate-850 relative h-64 select-none cursor-crosshair overflow-hidden" onClick={handleBoardMissClick} id="aim-board-viewport">
              {!aimActive ? (
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 bg-slate-950/80" id="aim-starter-screen">
                  <Crosshair className="w-10 h-10 text-amber-500 mb-3 animate-ping" />
                  <h4 className="font-semibold text-sm text-slate-200">Reflex Assessment Chamber</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mb-4 leading-relaxed">
                    Test your trigger-response reflexes. Sphere positioning coordinates refresh upon successful click.
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); triggerAimRoutineStart(); }}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-2 px-5 rounded-lg font-mono transition uppercase tracking-wider"
                  >
                    Calibrate System
                  </button>
                </div>
              ) : (
                /* TARGET ORB SYSTEM */
                <button
                  key={targetPos.id}
                  onClick={handleAimTargetClick}
                  className="absolute w-8 h-8 rounded-full bg-radial from-amber-400 to-rose-600 border border-white flex items-center justify-center animate-pulse shadow-rose-950/40 shadow-xl"
                  style={{
                    left: `${targetPos.x}%`,
                    top: `${targetPos.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title="TARGET"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white opacity-80" />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* COLUMN RIGHT (4-SPANS): 1-on-1 Contract Booker & Active Booking summaries */}
      <div className="lg:col-span-4 space-y-6" id="coaching-contracts-sidebar">
        <div className="bg-slate-900 border border-slate-850 rounded-xl p-5" id="coaches-market-card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-100 text-sm">Professional Coaches</h3>
          </div>

          <div className="space-y-3.5" id="coaches-list-slots">
            {MOCK_COACHES.map(coach => (
              <button
                key={coach.id}
                onClick={() => setSelectedCoachId(coach.id)}
                className={`w-full text-left border rounded-lg p-3 flex gap-3 items-center transition ${
                  selectedCoachId === coach.id
                    ? 'bg-indigo-950/30 border-indigo-500 text-indigo-100'
                    : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800'
                }`}
                id={`coach-btn-${coach.id}`}
              >
                <img
                  src={coach.avatar}
                  alt={coach.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-slate-800 shrink-0"
                />
                <div className="space-y-0.5 flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-xs text-slate-200 truncate">{coach.name}</h4>
                    <span className="text-[10px] text-amber-500 font-bold font-mono">★ {coach.rating}</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 truncate font-mono">{coach.experience}</p>
                  <p className="text-[11px] text-indigo-400 font-bold font-mono">${coach.price.toFixed(2)} / Session</p>
                </div>
              </button>
            ))}
          </div>

          {/* Schedulers booking frame */}
          <form onSubmit={handleBookCoaching} className="mt-5 pt-5 border-t border-slate-800 space-y-3.5" id="booking-submit-form">
            <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wider">Book VOD / Screen Review Contract</span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Session Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="bg-slate-950 border border-slate-850 p-1.5 w-full rounded text-slate-300 font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Lobby Slot</label>
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="bg-slate-950 border border-slate-855 p-1.5 w-full rounded text-slate-300 font-mono focus:outline-none"
                >
                  <option value="15:00 UTC - 16:00 UTC">15:00 UTC</option>
                  <option value="17:00 UTC - 18:00 UTC">17:00 UTC</option>
                  <option value="19:00 UTC - 20:00 UTC">19:00 UTC</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase block mb-1">VOD Link (Twitch / YouTube / Medals)</label>
              <input
                type="url"
                placeholder="https://medal.tv/clips/..."
                value={vodLink}
                onChange={(e) => setVodLink(e.target.value)}
                className="bg-slate-950 border border-slate-850 p-2 text-xs w-full text-slate-300 rounded focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 rounded transition uppercase"
            >
              Confirm and Pay ${activeCoach.price}
            </button>
          </form>
        </div>

        {/* List of booked sessions */}
        <div className="bg-slate-900 border border-slate-850 rounded-xl p-5" id="bookings-history-card">
          <h3 className="font-bold text-sm text-slate-200 mb-3 font-mono uppercase tracking-wider">Scheduled Coach Review Sessions</h3>
          <div className="space-y-2.5 max-h-[180px] overflow-y-auto" id="bookings-scroller">
            {bookings.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 font-mono">No active scheduled review queues.</div>
            ) : (
              bookings.map(b => (
                <div key={b.id} className="bg-slate-950 p-3 rounded border border-slate-850 flex justify-between gap-3 text-xs" id={`booking-row-${b.id}`}>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-200 block">{b.coachName} Session</span>
                    <span className="text-[10px] text-slate-550 block font-mono">Date: {b.date} • {b.timeSlot}</span>
                    {b.vodLink && (
                      <a href={b.vodLink} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline text-[10px] truncate max-w-[150px] block">
                        Watch Raw VOD Clip
                      </a>
                    )}
                  </div>
                  <div className="shrink-0 text-right space-y-1.5 flex flex-col justify-between items-end">
                    <span className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 font-bold px-1.5 rounded uppercase">
                      CONFIRMED
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">${b.price} processed</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
