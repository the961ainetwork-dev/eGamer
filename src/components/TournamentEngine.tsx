import React, { useState, useEffect } from 'react';
import { Tournament, Match, Participant } from '../types';
import { Trophy, AlertCircle, ShieldAlert, Upload, CheckCircle2, User, HelpCircle, Users, Sparkles, Filter, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface TournamentEngineProps {
  tournaments: Tournament[];
  setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>;
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
  username: string;
}

export default function TournamentEngine({
  tournaments,
  setTournaments,
  walletBalance,
  setWalletBalance,
  username
}: TournamentEngineProps) {
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>('tourney_val_1');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [reportScoreA, setReportScoreA] = useState<string>('');
  const [reportScoreB, setReportScoreB] = useState<string>('');
  const [disputeReason, setDisputeReason] = useState<string>('');
  const [disputeImage, setDisputeImage] = useState<string>('');
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [registerTeamName, setRegisterTeamName] = useState<string>('');
  const [bracketSearchQuery, setBracketSearchQuery] = useState<string>('');
  
  const currentTournament = tournaments.find(t => t.id === selectedTournamentId) || tournaments[0];

  // Tab within Tournament Engine: "Bracket Explorer" or "Admin/Ref Panel"
  const [engineTab, setEngineTab] = useState<'bracket' | 'referee'>('bracket');

  // State to track exact relative coordinates of match boxes for drawing connectors
  const [matchCoords, setMatchCoords] = useState<Record<string, { x: number, y: number, w: number, h: number }>>({});

  // Function to calculate exact relative positions of each match box within the bracket container
  const updateCoords = () => {
    const container = document.getElementById('scrolling-bracket-container');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const coords: Record<string, { x: number, y: number, w: number, h: number }> = {};
    
    currentTournament.matches.forEach(match => {
      const el = document.getElementById(`match-block-${match.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        coords[match.id] = {
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top,
          w: rect.width,
          h: rect.height
        };
      }
    });
    setMatchCoords(coords);
  };

  // Re-run coordinates measurement under dynamic variables or window resizing
  useEffect(() => {
    const timer = setTimeout(() => {
      updateCoords();
    }, 150);

    window.addEventListener('resize', updateCoords);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateCoords);
    };
  }, [selectedTournamentId, engineTab, currentTournament.matches]);

  // Look up connections for the active tournament is either absolute valorant showdown (8 teams) or rocket league (4 teams)
  const getConnections = () => {
    if (selectedTournamentId === 'tourney_val_1') {
      return [
        { from: 'm1_1', to: 'm2_1', slot: 'A' },
        { from: 'm1_4', to: 'm2_1', slot: 'B' },
        { from: 'm1_2', to: 'm2_2', slot: 'A' },
        { from: 'm1_3', to: 'm2_2', slot: 'B' },
        { from: 'm2_1', to: 'm3_1', slot: 'A' },
        { from: 'm2_2', to: 'm3_1', slot: 'B' }
      ];
    } else if (selectedTournamentId === 'tourney_rl_3') {
      return [
        { from: 'rl_m1', to: 'rl_m3', slot: 'A' },
        { from: 'rl_m2', to: 'rl_m3', slot: 'B' }
      ];
    }
    return [];
  };
  
  const isMatchHighlighted = (match: Match) => {
    if (!bracketSearchQuery.trim()) return false;
    const q = bracketSearchQuery.toLowerCase();
    const teamA = (match.teamA || '').toLowerCase();
    const teamB = (match.teamB || '').toLowerCase();
    return teamA.includes(q) || teamB.includes(q);
  };

  // Dispute structures managed locally or pushed to matches
  const handleRegisterTournament = (tourney: Tournament) => {
    if (walletBalance < tourney.entryFee) {
      alert("Insufficient wallet balance for registration entry fee.");
      return;
    }
    
    // Add user team
    const userTeam: Participant = {
      id: "user_registered_team",
      name: registerTeamName || `${username}'s Gladiators`,
      ranking: 1550,
      members: [username, "Recruit_Alpha", "Recruit_Beta", "Recruit_Gamma", "Recruit_Delta"]
    };

    const updated = tournaments.map(t => {
      if (t.id === tourney.id) {
        return {
          ...t,
          participants: [...t.participants, userTeam],
          status: t.participants.length + 1 >= t.maxTeams ? 'active' as const : t.status
        };
      }
      return t;
    });

    setTournaments(updated);
    setWalletBalance(walletBalance - tourney.entryFee);
    setShowRegisterModal(false);
    setRegisterTeamName('');
    alert(`Success! Enrolled "${userTeam.name}" in ${tourney.name}. Entry fee processed.`);
  };

  const handleReportScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;

    const scoreA = parseInt(reportScoreA);
    const scoreB = parseInt(reportScoreB);

    if (isNaN(scoreA) || isNaN(scoreB)) {
      alert("Please enter valid integral scores.");
      return;
    }

    // Identify winner
    let winnerName = "";
    if (scoreA > scoreB) {
      winnerName = selectedMatch.teamA;
    } else if (scoreB > scoreA) {
      winnerName = selectedMatch.teamB;
    } else {
      alert("Ties are not allowed in progression brackets. Please select a clear winner.");
      return;
    }

    const updated = tournaments.map(t => {
      if (t.id === selectedTournamentId) {
        const nextMatches = t.matches.map(m => {
          if (m.id === selectedMatch.id) {
            return {
              ...m,
              scoreA,
              scoreB,
              winnerId: scoreA > scoreB ? 'teamA' : 'teamB', // structural representation
              status: 'completed' as const
            };
          }
          // Simple Bracket progression seeding logic:
          // If Round 1 match finishes, update Round 2 Team slots
          if (selectedMatch.id === "m2_1") {
            // Semi-final 1 progression to Finals!
            if (m.id === "m3_1") {
              return { ...m, teamA: scoreA > scoreB ? selectedMatch.teamA : selectedMatch.teamB };
            }
          }
          if (selectedMatch.id === "m2_2") {
            // Semi-final 2 progression to Finals!
            if (m.id === "m3_1") {
              return { ...m, teamB: scoreA > scoreB ? selectedMatch.teamA : selectedMatch.teamB };
            }
          }
          return m;
        });

        // If finals (m3_1) is completed, set tournament as completed
        const isFinals = selectedMatch.id === "m3_1";
        return {
          ...t,
          matches: nextMatches,
          status: isFinals ? 'completed' as const : t.status
        };
      }
      return t;
    });

    setTournaments(updated);
    setSelectedMatch(null);
    setReportScoreA('');
    setReportScoreB('');
    alert(`Match result saved! ${winnerName} advances.`);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;

    if (!disputeReason.trim()) {
      alert("Please specify a logical violation reason.");
      return;
    }

    const updated = tournaments.map(t => {
      if (t.id === selectedTournamentId) {
        const nextMatches = t.matches.map(m => {
          if (m.id === selectedMatch.id) {
            return {
              ...m,
              status: 'disputed' as const,
              // Cache dispute info on match object dynamically
              disputeReason,
              disputeEvidence: disputeImage || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600"
            };
          }
          return m;
        });
        return { ...t, matches: nextMatches };
      }
      return t;
    });

    setTournaments(updated);
    setSelectedMatch(null);
    setDisputeReason('');
    setDisputeImage('');
    alert("Dispute filed! A senior tournament referee has been flagged.");
  };

  const handleRefereeVerdict = (matchId: string, rulingWinner: 'A' | 'B') => {
    let winningTeamName = "";
    const updated = tournaments.map(t => {
      if (t.id === selectedTournamentId) {
        const targetMatch = t.matches.find(m => m.id === matchId);
        if (!targetMatch) return t;

        winningTeamName = rulingWinner === 'A' ? targetMatch.teamA : targetMatch.teamB;

        const nextMatches = t.matches.map(m => {
          if (m.id === matchId) {
            return {
              ...m,
              status: 'completed' as const,
              scoreA: rulingWinner === 'A' ? 13 : 0,
              scoreB: rulingWinner === 'B' ? 13 : 0,
              winnerId: rulingWinner === 'A' ? 'teamA' : 'teamB'
            };
          }
          // Propagate winner
          if (matchId === "m2_1" && m.id === "m3_1") {
            return { ...m, teamA: winningTeamName };
          }
          if (matchId === "m2_2" && m.id === "m3_1") {
            return { ...m, teamB: winningTeamName };
          }
          return m;
        });

        const isFinals = matchId === "m3_1";
        return {
          ...t,
          matches: nextMatches,
          status: isFinals ? 'completed' as const : t.status
        };
      }
      return t;
    });

    setTournaments(updated);
    alert(`Referee verdict issued in favor of ${winningTeamName}! Bracket propagated successfully.`);
  };

  // Simulated screenshot selector
  const selectMockScreenshot = () => {
    const mockScreenshots = [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=500", // In-game screen
      "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=80&w=500", // Leaderboard screen
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=500"  // Console error screen
    ];
    // Select random screen
    const chosen = mockScreenshots[Math.floor(Math.random() * mockScreenshots.length)];
    setDisputeImage(chosen);
  };

  // Group matches by rounds for clean bracket view
  const activeDisputedMatches = currentTournament.matches.filter(m => m.status === 'disputed');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="tournament-engine">
      {/* Side selector & quick stats */}
      <div className="lg:col-span-1 space-y-5" id="tourney-listing-panel">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="tourney-filters-card">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-100">Live Tournaments</h3>
          </div>
          <div className="space-y-3" id="tourney-selectors">
            {tournaments.map(t => (
              <button
                key={t.id}
                onClick={() => { setSelectedTournamentId(t.id); setSelectedMatch(null); }}
                className={`w-full text-left p-3.5 rounded-lg transition-all border ${
                  selectedTournamentId === t.id
                    ? 'bg-indigo-950/40 border-indigo-500 text-indigo-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
                id={`btn-tourney-${t.id}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {t.game}
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${
                    t.status === 'active' ? 'text-amber-400' : t.status === 'completed' ? 'text-emerald-400' : 'text-blue-400'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <h4 className="font-semibold text-sm line-clamp-1 mb-2">{t.name}</h4>
                <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                  <span>Pool: ${t.prizeLimit}</span>
                  <span>Fee: ${t.entryFee}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Help card for Seeding bracket rules */}
        <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-900/40 rounded-xl p-5" id="bracket-rules-card">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-sm text-slate-100">Battlefy Progression</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All teams register on-chain or via wallet stake. Seeding is computed based on historical rating rank indexes. Real-time bracket connectivity processes outcomes instantly below.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
              <span className="block text-slate-500">Format</span>
              <span className="text-slate-200">{currentTournament.format}</span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
              <span className="block text-slate-500">Max Teams</span>
              <span className="text-slate-200">{currentTournament.maxTeams} Teams</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary tournament panel */}
      <div className="lg:col-span-3 space-y-6" id="tourney-board-main">
        {/* Header Ribbon */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="tourney-ribbon">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">{currentTournament.name}</h2>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {currentTournament.game}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Active tournament system managing <span className="font-semibold text-slate-200">{currentTournament.participants.length} / {currentTournament.maxTeams} teams</span>.
            </p>
          </div>

          <div className="flex items-center gap-3" id="tourney-controls-right">
            {/* Nav tabs for users */}
            <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex gap-1">
              <button
                onClick={() => setEngineTab('bracket')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  engineTab === 'bracket' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                id="btn-tab-bracket"
              >
                Tournament Bracket
              </button>
              <button
                onClick={() => setEngineTab('referee')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
                  engineTab === 'referee'
                    ? 'bg-amber-600/90 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                id="btn-tab-referee"
              >
                Ref Panel
                {activeDisputedMatches.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
              </button>
            </div>

            {currentTournament.status === 'upcoming' && (
              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg transition"
                id="btn-register-tourney"
              >
                Register Team
              </button>
            )}
          </div>
        </div>

        {/* Dynamic bracket view tab */}
        {engineTab === 'bracket' && (
          <div className="space-y-6">
            {/* If upcoming, show registered roster instead of brackets */}
            {currentTournament.status === 'upcoming' ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center" id="upcoming-roster-view">
                <div className="max-w-md mx-auto">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-200">Registration is Open!</h3>
                  <p className="text-sm text-slate-400 mt-1 mb-6">
                    This match-pair matches have not been generated yet. Seed bracket calculations begin when {currentTournament.maxTeams} teams are signed up.
                  </p>
                  
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-left space-y-3" id="enrolled-rosters-list">
                    <h4 className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider">Registered Roster List:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {currentTournament.participants.map((p, idx) => (
                        <div key={p.id} className="flex justify-between items-center text-xs bg-slate-900 px-3 py-2 rounded border border-slate-800">
                          <span className="font-semibold text-slate-200">{idx + 1}. {p.name}</span>
                          <span className="text-slate-500 font-mono">Skill Index: #{p.ranking}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={() => setShowRegisterModal(true)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
                    >
                      Enlist Team Now (${currentTournament.entryFee})
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ACTIVE OR COMPLETED BRACKET MAP */
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6" id="bracket-map-viewport">
                
                {/* Seeded Team Locator Search Bar */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-white/5 pb-4" id="bracket-search-header">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-cyan-400 text-black text-[9px] font-black tracking-widest uppercase">BRACKET DEPTH</span>
                      <span className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">SEEDED LOCATOR</span>
                    </div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">Highlight key matches, paths and active contestants</p>
                  </div>
                  
                  <div className="relative w-full md:w-80">
                    <input
                      type="text"
                      value={bracketSearchQuery}
                      onChange={(e) => setBracketSearchQuery(e.target.value)}
                      placeholder="ENTER TEAM NAME TO HIGHLIGHT..."
                      className="w-full pl-10 pr-16 py-2 bg-black border border-white/10 rounded uppercase font-mono text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    {bracketSearchQuery && (
                      <button
                        onClick={() => setBracketSearchQuery('')}
                        className="absolute right-2 top-2 text-[9px] font-mono text-cyan-400 hover:text-white px-2 py-1 bg-cyan-950/40 border border-cyan-400/30 rounded"
                      >
                        RESET
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[700px] flex justify-between items-stretch gap-8 relative py-8" id="scrolling-bracket-container">
                    
                    {/* SVG-based curved connectors */}
                    <svg className="absolute inset-0 pointer-events-none w-full h-full z-0 overflow-visible" style={{ minWidth: '700px' }}>
                      {getConnections().map((conn, idx) => {
                        const fromCoord = matchCoords[conn.from];
                        const toCoord = matchCoords[conn.to];
                        if (!fromCoord || !toCoord) return null;

                        const startX = fromCoord.x + fromCoord.w;
                        const startY = fromCoord.y + fromCoord.h / 2;
                        const endX = toCoord.x;
                        const endY = toCoord.y + (conn.slot === 'A' ? toCoord.h * 0.35 : toCoord.h * 0.65);

                        const dx = (endX - startX) * 0.45;
                        const pathD = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;

                        const fromMatch = currentTournament.matches.find(m => m.id === conn.from);
                        const isCompleted = fromMatch?.status === 'completed';

                        return (
                          <g key={`conn-${conn.from}-${conn.to}-${idx}`}>
                            {/* Background default connector line showing potential path */}
                            <path
                              d={pathD}
                              fill="none"
                              stroke="rgba(255, 255, 255, 0.08)"
                              strokeWidth="2"
                            />
                            {/* Foreground animated highlight winner connector line */}
                            <motion.path
                              d={pathD}
                              fill="none"
                              stroke="#22d3ee"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ 
                                 pathLength: isCompleted ? 1 : 0,
                                 opacity: isCompleted ? 1 : 0
                              }}
                              transition={{ 
                                duration: 0.8, 
                                ease: [0.16, 1, 0.3, 1] 
                              }}
                              style={{ filter: 'drop-shadow(0px 0px 4px rgba(34, 211, 238, 0.6))' }}
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Round 1 (Semi Finals) or Quarter Finals */}
                    <div className="flex-1 flex flex-col justify-around gap-12" id="round-col-1">
                      <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2 border-b border-slate-800 pb-1">
                        Semi-Final Matches
                      </div>
                      {currentTournament.matches.filter(m => m.round === 1 || m.id.startsWith("m1")).map(match => (
                        <div
                          key={match.id}
                          onClick={() => setSelectedMatch(match)}
                          className={`group cursor-pointer relative p-3 rounded-lg border transition-all ${
                            isMatchHighlighted(match)
                              ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-450 shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-[1.02] z-10'
                              : match.status === 'disputed'
                              ? 'bg-amber-950/20 border-amber-600 hover:border-amber-500'
                              : match.status === 'completed'
                              ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                              : 'bg-indigo-950/20 border-indigo-900 hover:border-indigo-700'
                          }`}
                          id={`match-block-${match.id}`}
                        >
                          {isMatchHighlighted(match) && (
                            <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse z-20" />
                          )}

                          {/* Status tag */}
                          <div className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-950 text-slate-400 border border-slate-800">
                            {match.status}
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between items-center">
                              <span className={`font-medium truncate max-w-[120px] ${
                                bracketSearchQuery && match.teamA.toLowerCase().includes(bracketSearchQuery.toLowerCase())
                                  ? 'bg-cyan-400/20 text-cyan-300 px-1 border border-cyan-400/30'
                                  : match.winnerId === 'teamA' || (match.scoreA !== undefined && match.scoreA > (match.scoreB || 0))
                                  ? 'text-indigo-400 font-bold'
                                  : 'text-slate-300'
                              }`}>
                                {match.teamA}
                              </span>
                              <span className="font-mono font-bold text-slate-200">{match.scoreA !== undefined ? match.scoreA : '-'}</span>
                            </div>
                            
                            <div className="border-t border-slate-800/60 my-1" />
                            
                            <div className="flex justify-between items-center">
                              <span className={`font-medium truncate max-w-[120px] ${
                                bracketSearchQuery && match.teamB.toLowerCase().includes(bracketSearchQuery.toLowerCase())
                                  ? 'bg-cyan-400/20 text-cyan-300 px-1 border border-cyan-400/30'
                                  : match.winnerId === 'teamB' || (match.scoreB !== undefined && match.scoreB > (match.scoreA || 0))
                                  ? 'text-indigo-400 font-bold'
                                  : 'text-slate-300'
                              }`}>
                                {match.teamB}
                              </span>
                              <span className="font-mono font-bold text-slate-200">{match.scoreB !== undefined ? match.scoreB : '-'}</span>
                            </div>
                          </div>

                          <div className="mt-2 text-[10px] text-slate-500 flex justify-between items-center">
                            <span className="font-mono">{match.time}</span>
                            <span className="text-indigo-400 group-hover:underline text-[9px]">Details</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Round 2 */}
                    <div className="flex-1 flex flex-col justify-center gap-24 relative" id="round-col-2">
                      <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2 border-b border-slate-800 pb-1">
                        Conference finals
                      </div>
                      {currentTournament.matches.filter(m => m.round === 2 || m.id.startsWith("m2")).map(match => (
                        <div
                          key={match.id}
                          onClick={() => setSelectedMatch(match)}
                          className={`group cursor-pointer relative p-3 rounded-lg border transition-all ${
                            isMatchHighlighted(match)
                              ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-450 shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-[1.02] z-10'
                              : match.status === 'disputed'
                              ? 'bg-amber-950/20 border-amber-600 hover:border-amber-500'
                              : match.status === 'completed'
                              ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                              : 'bg-indigo-950/20 border-indigo-955/60 hover:border-indigo-600'
                          }`}
                          id={`match-block-${match.id}`}
                        >
                          {isMatchHighlighted(match) && (
                            <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse z-20" />
                          )}

                          <div className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-950 text-slate-400 border border-slate-800">
                            {match.status}
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between items-center">
                              <span className={`font-medium truncate max-w-[120px] ${
                                bracketSearchQuery && match.teamA && match.teamA.toLowerCase().includes(bracketSearchQuery.toLowerCase())
                                  ? 'bg-cyan-400/20 text-cyan-300 px-1 border border-cyan-400/30'
                                  : match.scoreA !== undefined && match.scoreA > (match.scoreB || 0)
                                  ? 'text-indigo-400 font-bold'
                                  : 'text-slate-300'
                              }`}>
                                {match.teamA || "TBD Round 1"}
                              </span>
                              <span className="font-mono font-bold text-slate-200">{match.scoreA !== undefined ? match.scoreA : '-'}</span>
                            </div>
                            
                            <div className="border-t border-slate-800/60 my-1" />
                            
                            <div className="flex justify-between items-center">
                              <span className={`font-medium truncate max-w-[120px] ${
                                bracketSearchQuery && match.teamB && match.teamB.toLowerCase().includes(bracketSearchQuery.toLowerCase())
                                  ? 'bg-cyan-400/20 text-cyan-300 px-1 border border-cyan-400/30'
                                  : match.scoreB !== undefined && match.scoreB > (match.scoreA || 0)
                                  ? 'text-indigo-400 font-bold'
                                  : 'text-slate-300'
                              }`}>
                                {match.teamB || "TBD Round 1"}
                              </span>
                              <span className="font-mono font-bold text-slate-200">{match.scoreB !== undefined ? match.scoreB : '-'}</span>
                            </div>
                          </div>

                          <div className="mt-2 text-[10px] text-slate-500 flex justify-between items-center">
                            <span className="font-mono">{match.time}</span>
                            <span className="text-indigo-400 group-hover:underline text-[9px]">Details</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Grand Finals Round */}
                    <div className="flex-1 flex flex-col justify-center gap-32 relative" id="round-col-3">
                      <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2 border-b border-slate-800 pb-1">
                        Grand Champions
                      </div>
                      {currentTournament.matches.filter(m => m.round === 3 || m.id.startsWith("m3")).map(match => (
                        <div
                          key={match.id}
                          onClick={() => setSelectedMatch(match)}
                          className={`group cursor-pointer relative p-4 rounded-xl border border-dashed transition-all ${
                            isMatchHighlighted(match)
                              ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-450 shadow-[0_0_25px_rgba(34,211,238,0.6)] scale-[1.02] z-10'
                              : match.status === 'completed'
                              ? 'bg-amber-950/20 border-amber-500 text-amber-200'
                              : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                          }`}
                          id={`match-block-${match.id}`}
                        >
                          {isMatchHighlighted(match) && (
                            <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse z-20" />
                          )}

                          <div className="absolute -top-2.5 right-4 bg-amber-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Final Trophy Match
                          </div>

                          <div className="space-y-2 text-xs py-2">
                            <div className="flex justify-between items-center">
                              <span className={`font-semibold ${
                                bracketSearchQuery && match.teamA && match.teamA.toLowerCase().includes(bracketSearchQuery.toLowerCase())
                                  ? 'bg-cyan-400/20 text-cyan-300 px-1 border border-cyan-400/30'
                                  : 'text-slate-200'
                              }`}>{match.teamA || "TBD Semi 1"}</span>
                              <span className="font-mono text-slate-300">{match.scoreA !== undefined ? match.scoreA : '-'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`font-semibold ${
                                bracketSearchQuery && match.teamB && match.teamB.toLowerCase().includes(bracketSearchQuery.toLowerCase())
                                  ? 'bg-cyan-400/20 text-cyan-300 px-1 border border-cyan-400/30'
                                  : 'text-slate-200'
                              }`}>{match.teamB || "TBD Semi 2"}</span>
                              <span className="font-mono text-slate-300">{match.scoreB !== undefined ? match.scoreB : '-'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium pt-2 border-t border-slate-800/60">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            <span>Winner: {match.winnerId ? (match.winnerId === 'teamA' ? match.teamA : match.teamB) : 'Deciding...'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive reporting details panel */}
            {selectedMatch && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6" id="report-or-dispute-section">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-100 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      Manage Match Outcomes
                    </h3>
                    <p className="text-xs text-slate-400">
                      ID: {selectedMatch.id} | Round {selectedMatch.round} | Standard Seeding
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="text-slate-400 hover:text-slate-200 text-xs font-mono"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="match-management-columns">
                  {/* Action 1: Report Score */}
                  <div className="bg-slate-950 p-5 rounded-lg border border-slate-800" id="box-report-score">
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Submit Match Score
                    </h4>
                    <form onSubmit={handleReportScoreSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-500 block uppercase font-mono mb-1 truncate">{selectedMatch.teamA}</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="Score"
                            value={reportScoreA}
                            onChange={(e) => setReportScoreA(e.target.value)}
                            className="bg-slate-900 text-slate-100 px-3 py-2 text-sm rounded border border-slate-800 focus:outline-none focus:border-indigo-600 w-full font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 block uppercase font-mono mb-1 truncate">{selectedMatch.teamB}</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="Score"
                            value={reportScoreB}
                            onChange={(e) => setReportScoreB(e.target.value)}
                            className="bg-slate-900 text-slate-100 px-3 py-2 text-sm rounded border border-slate-800 focus:outline-none focus:border-indigo-600 w-full font-mono"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded transition"
                      >
                        Publish Results
                      </button>
                    </form>
                  </div>

                  {/* Action 2: File Dispute */}
                  <div className="bg-slate-950 p-5 rounded-lg border border-slate-800" id="box-file-dispute">
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                      Open Moderator Dispute
                    </h4>
                    <form onSubmit={handleDisputeSubmit} className="space-y-4">
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">Reason for Dispute</label>
                        <input
                          type="text"
                          placeholder="e.g. Substituted non-roster player / cheating"
                          value={disputeReason}
                          onChange={(e) => setDisputeReason(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs w-full text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">Evidence Capture</label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={selectMockScreenshot}
                            className="flex items-center gap-2 px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition"
                          >
                            <Upload className="w-3.5 h-3.5 text-slate-400" />
                            Simulation Upload
                          </button>
                          {disputeImage && (
                            <span className="text-[11px] font-mono text-emerald-400 truncate max-w-[200px]">✓ Screenshot Loaded</span>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2 rounded transition"
                      >
                        Trigger Admin Escalation
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Referee moderator tab view */}
        {engineTab === 'referee' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6" id="referee-escalations-panel">
            <h3 className="font-semibold text-lg text-slate-100 mb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Tournament Referee Console
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Review and resolve contested match-pairs immediately. Verdicts override self-reported coordinates and propagate brackets.
            </p>

            {activeDisputedMatches.length === 0 ? (
              <div className="text-center py-12 bg-slate-950 rounded-lg border border-slate-800/60" id="no-disputes-view">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <h4 className="font-semibold text-sm text-slate-200">System Clear</h4>
                <p className="text-xs text-slate-500 mt-1">
                  No pending disputes or lobby conflicts exist for {currentTournament.name}.
                </p>
              </div>
            ) : (
              <div className="space-y-4" id="ref-disputes-list">
                {activeDisputedMatches.map(dm => (
                  <div key={dm.id} className="bg-slate-950 p-5 rounded-lg border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6" id={`dispute-row-${dm.id}`}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">
                          DISPUTED
                        </span>
                        <span className="text-xs font-mono text-slate-400">Match ID: {dm.id}</span>
                      </div>
                      <h4 className="font-semibold text-slate-200">
                        {dm.teamA} <span className="text-slate-500 font-normal">vs</span> {dm.teamB}
                      </h4>
                      <p className="text-xs text-slate-400 bg-slate-900 p-3 rounded border border-slate-800/80 leading-relaxed font-mono">
                        <span className="text-amber-500 font-bold block mb-1">CLAIMED INCIDENT:</span>
                        {dm.disputeReason || "No context specified."}
                      </p>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleRefereeVerdict(dm.id, 'A')}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded transition"
                        >
                          Rule For {dm.teamA}
                        </button>
                        <button
                          onClick={() => handleRefereeVerdict(dm.id, 'B')}
                          className="flex-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold py-2 rounded transition"
                        >
                          Rule For {dm.teamB}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-400 block font-mono">UPLOADED ATTACHMENT EVIDENCE:</span>
                      <div className="rounded border border-slate-800 overflow-hidden bg-slate-900 aspect-video flex items-center justify-center relative">
                        {dm.disputeEvidence ? (
                          <img
                            src={dm.disputeEvidence as string}
                            alt="Dispute evidence mockup"
                            referrerPolicy="no-referrer"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="text-center text-xs text-slate-500 p-4">
                            No visual proof uploaded by players.
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur text-[9px] text-slate-300 font-mono px-2 py-0.5 border border-slate-800 rounded">
                          Lobby Screen Match-Id Matcher
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Registration Modal overlay */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="register-team-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-lg"
            >
              ×
            </button>
            
            <Trophy className="w-10 h-10 text-indigo-400 mb-3" />
            <h3 className="text-lg font-bold text-slate-100">Battlefy Championship Registration</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Join <span className="font-bold text-slate-200">{currentTournament.name}</span>. Secure lobby entry requires on-chain balance confirmation.
            </p>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-2 text-xs font-mono mb-4 text-slate-300">
              <div className="flex justify-between">
                <span>Entry Stake:</span>
                <span className="text-amber-400 font-bold">${currentTournament.entryFee}.00 USD</span>
              </div>
              <div className="flex justify-between">
                <span>User Wallet:</span>
                <span className="text-emerald-400">${walletBalance.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-semibold">Your Registered Team Name</label>
                <input
                  type="text"
                  placeholder="e.g. Liquid Gladiators"
                  value={registerTeamName}
                  onChange={(e) => setRegisterTeamName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-100 rounded px-3 py-2 w-full text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs py-2 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRegisterTournament(currentTournament)}
                  disabled={walletBalance < currentTournament.entryFee}
                  className={`flex-1 rounded text-xs py-2 text-white font-bold transition ${
                    walletBalance >= currentTournament.entryFee
                      ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Confirm & Stake Fee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
