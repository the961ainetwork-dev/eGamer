import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, ArrowRight, Trophy, GraduationCap, Gamepad2, Brain } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  img: string;
  tab: 'home' | 'tournaments' | 'lms' | 'dev_hub' | 'coaching' | 'wallet' | 'prd' | 'curriculum';
  action: string;
  badge: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "PRO COMPETE ARENA",
    subtitle: "CO-COORDINATED BATTLEFY SHOWDOWNS",
    description: "Mark live outcomes, dispute team results with snapshot evidence, and watch curved glass connectors dynamically illuminate victory paths.",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    tab: "tournaments",
    action: "ENTER COMPETE PORTAL",
    badge: "LIVE CHAMPIONSHIP"
  },
  {
    id: 2,
    title: "TACTICAL TRAINING MATRIX",
    subtitle: "MINT CRYPTO-CERTIFICATES & ACE QUIZZES",
    description: "Enroll in core strategy courses, unlock interactive assessment modules, and challenge yourself to earn glossy verified credentials.",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    tab: "lms",
    action: "STUDY ACADEMY TRACKS",
    badge: "STRATEGY SYLLABUS"
  },
  {
    id: 3,
    title: "INDIE SHOWCASE CHAMBER",
    subtitle: "VET COMMUNITY DESIGNS & PROTOTYPES",
    description: "Explore customized system layouts, experiment with live playable mechanics widgets, and upvote the next generation of creative indie hits.",
    img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop",
    tab: "dev_hub",
    action: "PLAY INDIE ARCHIVES",
    badge: "CREATOR ARCHIVES"
  },
  {
    id: 4,
    title: "TACTILE AIM REFLEX CORE",
    subtitle: "AIM TRAINER & WHITEBOARD STRATEGY",
    description: "Calibrate micro-reflexes inside standard grid targets, observe real-time latency telemetry logs, and diagram pro strategies.",
    img: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1200&auto=format&fit=crop",
    tab: "coaching",
    action: "CALIBRATE PLATFORM AIM",
    badge: "REFLEX TESTING"
  },
  {
    id: 5,
    title: "LEDGER ESCROW ECONOMY",
    subtitle: "MANAGE PRISTINE DIGITAL WALLETS",
    description: "Audit secure prize transactions, unlock immediate subscription upgrades, and inspect decentralized tournament cash ledgers.",
    img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
    tab: "wallet",
    action: "MANAGE WALLET LEDGER",
    badge: "SECURE CRYPTO NET"
  }
];

interface HeroSliderProps {
  onNavigate: (tab: 'home' | 'tournaments' | 'lms' | 'dev_hub' | 'coaching' | 'wallet' | 'prd' | 'curriculum') => void;
}

export default function HeroSlider({ onNavigate }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 6200);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <div 
      className="relative w-full overflow-hidden bg-black border border-white/10 rounded-2xl md:min-h-[380px] flex flex-col justify-between" 
      id="futuristic-hero-slider"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Background Slides with AnimatePresence */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${currentSlide.img})`,
            }}
          />
        </AnimatePresence>
        
        {/* Solid dark overlay for clean text legibility without gradients */}
        <div className="absolute inset-0 bg-black/65 z-10" />
        
        {/* Subtle cyan-indigo ambient bloom shadows inside the slider */}
        <div className="absolute right-[10%] top-[10%] w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none select-none z-10" />
        <div className="absolute left-[30%] bottom-[5%] w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none select-none z-10" />
      </div>

      {/* Main Slide Content pane */}
      <div className="relative z-20 p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 h-full flex-1 min-h-[300px]">
        
        {/* Slide Info (Left Section) */}
        <div className="space-y-4 max-w-2xl select-none text-left">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-0.5 bg-cyan-400 text-black text-[9px] font-black tracking-widest uppercase rounded-sm shadow-[0_0_12px_rgba(34,211,238,0.4)] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-black" />
              {currentSlide.badge}
            </span>
            <span className="px-2.5 py-0.5 border border-white/20 text-white text-[9px] font-mono tracking-wider bg-black/40 rounded-sm">
              SLIDE INDEX 0{currentSlide.id} / 0{SLIDES.length}
            </span>
          </div>

          <h2 className="text-2xl md:text-5xl font-black tracking-tighter uppercase leading-[0.95] text-white">
            {currentSlide.title} <br />
            <span className="text-transparent text-outline-cyan block mt-1.5 font-sans">
              {currentSlide.subtitle}
            </span>
          </h2>

          <p className="text-xs text-zinc-300 leading-relaxed uppercase tracking-wide font-medium max-w-xl">
            {currentSlide.description}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onNavigate(currentSlide.tab)}
              className="group relative px-6 py-3.5 bg-cyan-400 text-black font-black uppercase tracking-tighter text-xs hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2.5 rounded shadow-[0_4px_20px_rgba(34,211,238,0.25)] shrink-0"
              id={`btn-hero-action-${currentSlide.id}`}
            >
              <span>{currentSlide.action}</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1.5 transition-transform" />
            </button>

            {/* Quick Actions Panel */}
            <div className="flex flex-wrap items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 border border-white/5 rounded-lg" id="carousel-quick-actions-bar">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#22d3ee] uppercase px-2 max-sm:w-full">
                QUICK LAUNCH:
              </span>
              <button
                onClick={() => onNavigate('tournaments')}
                className="px-3 py-1.5 text-[9px] font-mono font-black uppercase tracking-wider bg-zinc-900 hover:bg-cyan-500/20 border border-white/15 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition flex items-center gap-1.5 rounded-md"
                id="btn-quick-create-tourney"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>CREATE TOURNAMENT</span>
              </button>
              <button
                onClick={() => onNavigate('lms')}
                className="px-3 py-1.5 text-[9px] font-mono font-black uppercase tracking-wider bg-zinc-900 hover:bg-cyan-500/20 border border-white/15 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition flex items-center gap-1.5 rounded-md"
                id="btn-quick-view-lessons"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>VIEW LESSONS</span>
              </button>
              <button
                onClick={() => onNavigate('dev_hub')}
                className="px-3 py-1.5 text-[9px] font-mono font-black uppercase tracking-wider bg-zinc-900 hover:bg-cyan-500/20 border border-white/15 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition flex items-center gap-1.5 rounded-md"
                id="btn-quick-join-showcase"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>JOIN SHOWCASE</span>
              </button>
              <button
                onClick={() => onNavigate('curriculum')}
                className="px-3 py-1.5 text-[9px] font-mono font-black uppercase tracking-wider bg-[#22d3ee]/10 hover:bg-[#22d3ee]/25 border border-[#22d3ee]/35 hover:border-[#22d3ee] text-[#22d3ee] transition flex items-center gap-1.5 rounded-md shadow-[0_0_8px_rgba(34,211,238,0.15)]"
                id="btn-quick-ai-strategy"
              >
                <Brain className="w-3.5 h-3.5 text-[#22d3ee]" />
                <span>AI STRATEGY SYLLABUS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Visual Pagers (Right Section) */}
        <div className="flex md:flex-col items-center gap-2.5 md:bg-black/50 md:backdrop-blur-md md:p-3 md:border md:border-white/10 rounded-xl max-sm:w-full justify-between shrink-0">
          <div className="hidden md:block text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest text-center border-b border-white/5 pb-2 w-full">
            NAV MATRIX
          </div>
          {SLIDES.map((slide, sIdx) => {
            const isActive = currentIndex === sIdx;
            return (
              <button
                key={slide.id}
                onClick={() => handleSelect(sIdx)}
                className={`flex items-center gap-2.5 p-1.5 md:w-44 text-left transition ${
                  isActive 
                    ? 'text-cyan-400 border border-cyan-400/20 bg-cyan-950/20' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
                style={{ borderRadius: '6px' }}
              >
                <span className={`text-[10px] font-mono font-black ${isActive ? 'text-cyan-400' : 'text-zinc-650'}`}>
                  0{slide.id}
                </span>
                <span className="hidden md:inline text-[9px] font-semibold tracking-wider uppercase truncate max-w-[120px]">
                  {slide.badge.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Manual Left/Right indicators and continuous status bar */}
      <div className="relative z-20 px-6 py-3 border-t border-white/5 bg-black/40 backdrop-blur-sm flex justify-between items-center" id="hero-slider-bar">
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrev}
            className="p-1 px-2.5 bg-slate-950 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition"
            style={{ borderRadius: '4px' }}
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleNext}
            className="p-1 px-2.5 bg-slate-950 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition"
            style={{ borderRadius: '4px' }}
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 px-2.5 bg-slate-950 border border-white/10 text-slate-400 hover:text-white transition flex items-center gap-1.5 text-[9px] font-mono font-bold"
            style={{ borderRadius: '4px' }}
          >
            {isPlaying ? (
              <>
                <Pause className="w-2.5 h-2.5" />
                <span>PAUSE CYCLE</span>
              </>
            ) : (
              <>
                <Play className="w-2.5 h-2.5" />
                <span>AUTO PLAY</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Glowing Cycle Progress Bar container */}
        <div className="w-64 max-sm:hidden bg-zinc-900 h-1.5 overflow-hidden relative" style={{ borderRadius: '3px' }}>
          {isPlaying && (
            <motion.div 
              key={currentIndex}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 6.2, ease: "linear" }}
              className="bg-cyan-400 h-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            />
          )}
          {!isPlaying && (
            <div className="bg-zinc-650 h-full w-2/3" />
          )}
        </div>
      </div>
    </div>
  );
}
