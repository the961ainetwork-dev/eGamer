/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  INITIAL_PROFILE, 
  INITIAL_TOURNAMENTS, 
  INITIAL_COURSES, 
  INITIAL_GAMES, 
  INITIAL_TRANSACTIONS 
} from './data';
import { UserProfile, Tournament, Course, IndieGameSpec, CoinTransaction } from './types';

// Import subcomponents
import TournamentEngine from './components/TournamentEngine';
import AcademyLMS from './components/AcademyLMS';
import DeveloperHub from './components/DeveloperHub';
import CoachingHub from './components/CoachingHub';
import EconomyWallet from './components/EconomyWallet';
import SpecsBlueprint from './components/SpecsBlueprint';
import HeroSlider from './components/HeroSlider';
import EsportsCurriculum from './components/EsportsCurriculum';

// Lucide icons
import { 
  Trophy, 
  GraduationCap, 
  Gamepad2, 
  Target, 
  Wallet, 
  Layers, 
  LayoutDashboard, 
  User, 
  Bell, 
  ShieldCheck, 
  Sparkles, 
  Coins, 
  CheckCircle2, 
  X,
  History,
  Brain
} from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [games, setGames] = useState<IndieGameSpec[]>(INITIAL_GAMES);
  const [transactions, setTransactions] = useState<CoinTransaction[]>(INITIAL_TRANSACTIONS);
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'home' | 'tournaments' | 'lms' | 'dev_hub' | 'coaching' | 'wallet' | 'prd' | 'curriculum'>('home');

  // Notification lists
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to Esports Academy! Complete course quizzes to mint secure profile badges.", read: false },
    { id: 2, text: "Tournament Bracket Generated: Absolute Valorant Showdown Semi-Finals are live.", read: false }
  ]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleWalletBalanceUpdate = (newBalance: number) => {
    setProfile(prev => ({ ...prev, walletBalance: newBalance }));
  };

  const handleXpUpdate = (newXp: number) => {
    const levelProgress = newXp - profile.xp;
    let nextLvl = profile.level;
    let nextXp = newXp;
    
    // Simple level up criteria (every 1000 XP is a level)
    if (nextXp >= (profile.level + 1) * 350) {
      nextLvl += 1;
      // Trigger user alerts
      setNotifications([
        { id: Date.now(), text: `🎉 LEVEL UP! You reached Level ${nextLvl}!`, read: false },
        ...notifications
      ]);
    }

    setProfile(prev => ({
      ...prev,
      xp: nextXp,
      level: nextLvl
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased font-sans" id="applet-viewport">
      
      {/* Top Navbar display */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-6 py-3.5 flex justify-between items-center" id="platform-navbar">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-indigo-600/10 shadow-lg">
            <Trophy className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-indigo-400 block font-mono">
              The Next-Gen Blueprint
            </span>
            <h1 className="text-base font-bold text-slate-150 leading-tight">
              Esports Academy &amp; Tournament Hub
            </h1>
          </div>
        </div>

        {/* Mid Navigation Shortcuts */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-xs" id="nav-shortcuts">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'home' ? 'bg-slate-900 text-indigo-400 border border-slate-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'tournaments' ? 'bg-slate-900 text-indigo-400 border border-slate-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tournaments
          </button>
          <button
            onClick={() => setActiveTab('lms')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'lms' ? 'bg-slate-900 text-indigo-400 border border-slate-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Esports Academy (LMS)
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-3 py-1.5 rounded-md font-medium bg-cyan-950/40 border border-cyan-800/40 hover:border-cyan-400 text-cyan-400 transition ${
              activeTab === 'curriculum' ? 'bg-cyan-500 text-black border-cyan-400 font-bold shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'text-cyan-400'
            }`}
            id="nav-btn-curriculum"
          >
            AI Strategy Curriculum
          </button>
          <button
            onClick={() => setActiveTab('dev_hub')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'dev_hub' ? 'bg-slate-900 text-indigo-400 border border-slate-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Indie Showcase Hub
          </button>
          <button
            onClick={() => setActiveTab('coaching')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'coaching' ? 'bg-slate-900 text-indigo-400 border border-slate-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pro Mechanics Draw
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'wallet' ? 'bg-slate-900 text-indigo-400 border border-slate-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Wallet Escrows
          </button>
          <button
            onClick={() => setActiveTab('prd')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'prd' ? 'bg-indigo-600 font-bold text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Specs Blueprint
          </button>
        </nav>

        {/* Right side Profile Quick Status panel */}
        <div className="flex items-center gap-4" id="right-nav-details">
          
          {/* Notifications indicator */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-405 relative transition"
              id="btn-bell"
            >
              <Bell className="w-4 h-4 text-slate-350" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2.5 bg-slate-900 border border-slate-800 rounded-lg p-4 w-72 shadow-2xl z-50 text-xs text-slate-300 space-y-2" id="notifications-box">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-1.5">
                  <span className="font-semibold text-slate-100">Incident Alerts</span>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] text-indigo-400 hover:underline"
                  >
                    Clear markers
                  </button>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className="p-2 rounded bg-slate-950 border border-slate-850 relative">
                    <p className="pr-4 leading-tight">{n.text}</p>
                    {!n.read && <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-3 bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-850 font-mono text-xs" id="quick-wallet-display">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <Coins className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-slate-150">${profile.walletBalance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main viewport Container: grid sidebar navigation with main pane */}
      <div className="flex-1 flex flex-col lg:flex-row" id="applet-body">
        
        {/* Dynamic Sidebar menu */}
        <aside className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between gap-6" id="dashboard-sidebar">
          
          <div className="space-y-6">
            {/* Bold Brand Logo */}
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <span className="text-3xl font-black tracking-tighter text-white">NEXUS</span>
              <span className="px-2 py-0.5 bg-cyan-400 text-black text-[9px] font-black tracking-widest uppercase">ACADEMY</span>
            </div>

            {/* Quick Profile Summary component */}
            <div className="bg-black p-4 border border-white/15" id="sidebar-profile-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-400 flex items-center justify-center font-black text-black text-sm shrink-0">
                  {profile.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-xs text-white truncate block uppercase tracking-tight">{profile.username}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  </div>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/40 border border-cyan-400/30 px-1.5 py-0.5 font-mono font-semibold uppercase mt-0.5 inline-block">
                    {profile.isPremium} Member
                  </span>
                </div>
              </div>

              {/* Progress bar tracking level progression */}
              <div className="mt-3.5 pt-3 border-t border-slate-900 space-y-1 text-[10px] font-mono">
                <div className="flex justify-between text-slate-400 font-semibold">
                  <span>LEVEL {profile.level}</span>
                  <span className="text-slate-500">{profile.xp} / {(profile.level + 1) * 350} XP</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-300" 
                    style={{ width: `${Math.min(100, Math.floor((profile.xp / ((profile.level + 1) * 350)) * 100))}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Navigation Lists with Lucide Icons */}
            <div className="space-y-1.5" id="sidebar-nav-routes">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-2.5">
                Dashboard Modules
              </span>
              
              <button
                onClick={() => setActiveTab('home')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'home' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
                id="btn-nav-home"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Summary Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('tournaments')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'tournaments' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
                id="btn-nav-tournaments"
              >
                <Trophy className="w-4 h-4" />
                <span>Tournament Brackets</span>
              </button>

              <button
                onClick={() => setActiveTab('lms')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'lms' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
                id="btn-nav-lms"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Esports Academy (LMS)</span>
              </button>

              <button
                onClick={() => setActiveTab('curriculum')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-black transition ${
                  activeTab === 'curriculum' 
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/15' 
                    : 'text-cyan-400 hover:bg-slate-800/50 bg-cyan-950/25 border border-cyan-400/10'
                }`}
                id="btn-nav-curriculum"
              >
                <Brain className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                <span>AI Strategy Curriculum</span>
              </button>

              <button
                onClick={() => setActiveTab('dev_hub')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'dev_hub' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
                id="btn-nav-dev_hub"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Indie Showcase Hub</span>
              </button>

              <button
                onClick={() => setActiveTab('coaching')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'coaching' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
                id="btn-nav-coaching"
              >
                <Target className="w-4 h-4" />
                <span>Mechanics &amp; Drills</span>
              </button>

              <button
                onClick={() => setActiveTab('wallet')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'wallet' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
                id="btn-nav-wallet"
              >
                <Wallet className="w-4 h-4" />
                <span>Ledger Wallet escrows</span>
              </button>

              <div className="border-t border-slate-800/60 my-4" />

              <span className="text-[10px] font-bold text-slate-505 uppercase tracking-wider block mb-2 px-2.5">
                Technical Blueprint
              </span>

              <button
                onClick={() => setActiveTab('prd')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'prd' 
                    ? 'bg-amber-600/90 text-white shadow-lg shadow-amber-600/10' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
                id="btn-nav-prd"
              >
                <Layers className="w-4 h-4 text-amber-500" />
                <span>System Spec Docs (PRD)</span>
              </button>
            </div>
          </div>

          {/* Quick legal credit */}
          <div className="text-[10px] text-slate-600 font-mono leading-tight px-1 hidden lg:block" id="legal-credit-box">
            <span>Esports Hub Pro v1.2</span>
            <span className="block mt-1">Google AI Studio Sandboxed Devnet</span>
          </div>

        </aside>

        {/* Primary Page Layout router panel */}
        <main className="flex-1 p-6 overflow-y-auto" id="primary-view-container">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            {/* A. Summary Hub Dashboard ('home') */}
            {activeTab === 'home' && (
              <div className="space-y-6 animate-fade-in" id="dashboard-tab-content">
              
              {/* Gorgeous Futuristic Hero Slider with Fill Images of all services */}
              <HeroSlider onNavigate={(tab) => setActiveTab(tab)} />

              {/* Stat Grid Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="stats-summary-grid">
                
                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Matches Win Rate</span>
                    <span className="text-sm font-bold text-slate-200">{profile.winRate}% ({(profile.winRate * profile.matchesPlayed / 100).toFixed(0)} Won)</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Academy Badges</span>
                    <span className="text-sm font-bold text-slate-200">{courses.filter(c => c.certificateEarned).length} Verified NFT</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-teal-500/10 text-teal-400">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Showcase Plays</span>
                    <span className="text-sm font-bold text-slate-200">{games.length} Indie Prototypes</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-rose-500/10 text-rose-400">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Settled Escrow</span>
                    <span className="text-sm font-bold text-slate-200">${profile.walletBalance.toFixed(2)} USD</span>
                  </div>
                </div>

              </div>

              {/* Nested Column Grid layout (Dashboard left vs dashboard right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-two-column">
                
                {/* Left 8-Span: Quick activities and schedules */}
                <div className="lg:col-span-8 space-y-6" id="dash-left-col">
                  
                  {/* Current enrolled course quick tracker */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="enrolled-course-quick-card">
                    <h3 className="font-bold text-sm text-slate-200 mb-3 uppercase tracking-wider font-mono">Current Course Syllabus Tracker</h3>
                    {courses.filter(c => c.enrolled).length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-500">No active course enrollments. Unlock deep strategy in Academy LMS.</div>
                    ) : (
                      courses.filter(c => c.enrolled).map(c => (
                        <div key={c.id} className="bg-slate-950 p-4 rounded-lg border border-slate-850 flex justify-between items-center gap-4">
                          <div className="space-y-1 flex-1">
                            <span className="text-[10px] bg-slate-905 uppercase text-indigo-300 font-mono px-1.5 py-0.2 border border-slate-805 rounded">{c.category}</span>
                            <span className="font-bold text-slate-150 block text-xs mt-1">{c.title}</span>
                            <span className="text-[10.5px] text-slate-500 block">Lessons Completed: {c.progress > 0 ? `${(c.progress / 10).toFixed(0)} / ${c.lessonsCount}` : 'None Started'}</span>
                          </div>
                          
                          <div className="text-right space-y-2">
                            <span className="text-xs text-indigo-400 font-bold font-mono block">{c.progress}% done</span>
                            <button
                              onClick={() => setActiveTab('lms')}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] px-3 py-1 rounded transition"
                            >
                              Resume Track
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Active Match dispute panel or bracket recap */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="bracket-snapshot-card">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider font-mono text-left">Active Tournament Progression</h3>
                      <button
                        onClick={() => setActiveTab('tournaments')}
                        className="text-[11px] text-indigo-400 hover:underline"
                      >
                        All tournaments
                      </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-amber-400 font-bold uppercase block">ACTIVE MATCH</span>
                        <span className="font-bold text-slate-200 block text-xs mt-1">Team Liquid Dust vs G2 Ascents</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Absolute Valorant Showdown Round 2 • Semi-Final A</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('tournaments')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1 px-3 rounded text-[10px] uppercase font-mono shadow"
                      >
                        Report Match/Resolve
                      </button>
                    </div>
                  </div>

                </div>

                {/* Right 4-Span: Activities streams */}
                <div className="lg:col-span-4 space-y-6" id="dash-right-col">
                  
                  {/* Ledger quick statement */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="recent-ledger-dash-card">
                    <h3 className="font-bold text-sm text-slate-200 mb-3 uppercase tracking-wider font-mono">Recent Payout Logs</h3>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto" id="dash-txs-scroller">
                      {transactions.slice(0, 3).map(tx => (
                        <div key={tx.id} className="p-3 bg-slate-950 rounded border border-slate-850 flex justify-between gap-2 text-xs font-mono">
                          <div>
                            <span className="text-slate-300 block truncate max-w-[120px]">{tx.description}</span>
                            <span className="text-[10px] text-slate-550 block font-normal">{tx.date}</span>
                          </div>
                          <span className={`font-bold ${
                            tx.type === 'deposit' || tx.type === 'prize_payout' ? 'text-emerald-400' : 'text-slate-400'
                          }`}>
                            {tx.type === 'deposit' || tx.type === 'prize_payout' ? '+' : '-'}${tx.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setActiveTab('wallet')}
                      className="w-full bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850 px-2.5 py-1.5 rounded text-xs font-sans mt-3 font-semibold transition text-center block"
                    >
                      Audit Ledger Statement
                    </button>
                  </div>

                  {/* Aim Benchmark record tracker */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="aims-best-dash-card">
                    <h3 className="font-bold text-sm text-slate-200 mb-3 uppercase tracking-wider font-mono">Reflex Records Base</h3>
                    
                    <div className="bg-slate-950 p-4 rounded border border-slate-850 text-xs font-mono space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Fastest reaction latency:</span>
                        <span className="text-amber-400 font-bold">185 ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Perfect accurate benchmark:</span>
                        <span className="text-emerald-400 font-bold">95% score</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('coaching')}
                      className="w-full bg-slate-950 text-indigo-400 hover:text-indigo-200 border border-indigo-950 px-2.5 py-1.5 rounded text-xs mt-3 font-semibold text-center block"
                    >
                      Calibrate Aim Targets
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* B. Tournament Bracket Engine ('tournaments') */}
          {activeTab === 'tournaments' && (
            <TournamentEngine
              tournaments={tournaments}
              setTournaments={setTournaments}
              walletBalance={profile.walletBalance}
              setWalletBalance={handleWalletBalanceUpdate}
              username={profile.username}
            />
          )}

          {/* C. Academy LMS ('lms') */}
          {activeTab === 'lms' && (
            <AcademyLMS
              courses={courses}
              setCourses={setCourses}
              walletBalance={profile.walletBalance}
              setWalletBalance={handleWalletBalanceUpdate}
              xp={profile.xp}
              setXp={handleXpUpdate}
            />
          )}

          {/* D. Sandbox Developer Showcase ('dev_hub') */}
          {activeTab === 'dev_hub' && (
            <DeveloperHub
              games={games}
              setGames={setGames}
              xp={profile.xp}
              setXp={handleXpUpdate}
              username={profile.username}
            />
          )}

          {/* E. Drawing board whiteboard & reflex mechanics game ('coaching') */}
          {activeTab === 'coaching' && (
            <CoachingHub
              walletBalance={profile.walletBalance}
              setWalletBalance={handleWalletBalanceUpdate}
              xp={profile.xp}
              setXp={handleXpUpdate}
              username={profile.username}
            />
          )}

          {/* F. Economy digital wallets & subscription modifiers ('wallet') */}
          {activeTab === 'wallet' && (
            <EconomyWallet
              walletBalance={profile.walletBalance}
              setWalletBalance={handleWalletBalanceUpdate}
              transactions={transactions}
              setTransactions={setTransactions}
              profile={profile}
              setProfile={setProfile}
              xp={profile.xp}
              setXp={handleXpUpdate}
            />
          )}

          {/* G. Direct specs and code roadmap blueprint documentation ('prd') */}
          {activeTab === 'prd' && (
            <SpecsBlueprint />
          )}

          {/* H. Interactive Esports AI Tactic Curriculum ('curriculum') */}
          {activeTab === 'curriculum' && (
            <EsportsCurriculum />
          )}

        </motion.div>
      </main>

      </div>

    </div>
  );
}
