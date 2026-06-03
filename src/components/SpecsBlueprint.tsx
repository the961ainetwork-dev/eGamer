import React, { useState } from 'react';
import { Award, ShieldAlert, KeyRound, Server, Database, Milestone, BookOpen, Layers } from 'lucide-react';

export default function SpecsBlueprint() {
  const [docTab, setDocTab] = useState<'architecture' | 'db_schema' | 'roadmap'>('architecture');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6" id="documentation-blueprint">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5.5 h-5.5 text-indigo-400" />
            System Architecture Blueprint & PRD Specs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Product requirement indices and structural technical mapping for the next-generation scaling platform.
          </p>
        </div>

        {/* Nest doc navigation selectors */}
        <div className="flex gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setDocTab('architecture')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              docTab === 'architecture' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-100'
            }`}
            id="tab-doc-architecture"
          >
            Core Tech Stack
          </button>
          <button
            onClick={() => setDocTab('db_schema')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              docTab === 'db_schema' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-100'
            }`}
            id="tab-doc-db_schema"
          >
            Database Schema (relational)
          </button>
          <button
            onClick={() => setDocTab('roadmap')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              docTab === 'roadmap' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-100'
            }`}
            id="tab-doc-roadmap"
          >
            MVP Phased Roadmap Roadmap
          </button>
        </div>
      </div>

      {docTab === 'architecture' && (
        <div className="space-y-6 animate-fade-in" id="archi-view">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-850 space-y-2">
              <div className="p-2 rounded bg-indigo-500/10 text-indigo-400 w-fit">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-200 text-sm">Real-Time Core Engine</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Bracket states, seed queues, live match reports and dispute escalations run via unified **Socket.io / WebSockets** event protocols. Reduces polling limits on lobbies.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-lg border border-slate-850 space-y-2">
              <div className="p-2 rounded bg-amber-500/10 text-amber-400 w-fit">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-200 text-sm">Adaptive CDN LMS Frame</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Video classes, strategy reviews and gameplay assets are cached on edge networks using **Cloudflare CDN / AWS CloudFront**. Reduces system buffering metrics during heavy load.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-lg border border-slate-850 space-y-2">
              <div className="p-2 rounded bg-teal-500/10 text-teal-400 w-fit">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-200 text-sm">Digital Ledger Security</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Transaction ledgers, payouts and subscription fee splits are calculated client-side and committed on-chain via **Firestore Escrows** or payment processor nodes (e.g., Stripe hookups).
              </p>
            </div>
          </div>

          <div className="bg-slate-950 rounded-lg p-5 border border-slate-850 space-y-4" id="tech-stack-blueprint">
            <h3 className="font-semibold text-sm text-slate-200 uppercase tracking-wider font-mono">Structural Tech Stack Selections</h3>
            
            <div className="overflow-x-auto text-[11px] font-mono" id="tech-stack-table">
              <table className="w-full text-left text-slate-400 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-350">
                    <th className="pb-2.5">SERVICE STACK</th>
                    <th className="pb-2.5">FRAMEWORK TECHNOLOGY</th>
                    <th className="pb-2.5">PRIMARY VALUE ADDED</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b border-slate-900/60">
                    <td className="py-2.5 font-bold text-indigo-400">Frontend View</td>
                    <td className="py-2.5 text-slate-200">React (v19) + Vite + Tailwind CSS</td>
                    <td className="py-2.5">Ultra-responsive modular interfaces, local predicted animations via Framer Motion.</td>
                  </tr>
                  <tr className="border-b border-slate-900/60">
                    <td className="py-2.5 font-bold text-indigo-400">Backend Server</td>
                    <td className="py-2.5 text-slate-200">Node JS + Express Routing Engine</td>
                    <td className="py-2.5">Robust API proxies, sandboxed client execution nodes, lightweight memory foot-index.</td>
                  </tr>
                  <tr className="border-b border-slate-900/60">
                    <td className="py-2.5 font-bold text-indigo-400">Database Index</td>
                    <td className="py-2.5 text-slate-200">Google Cloud SQL (PostgreSQL) + Firestore</td>
                    <td className="py-2.5">ACID transactions for wallets, real-time sync for bracket nodes and disputes.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-indigo-400">Auth & Escrows</td>
                    <td className="py-2.5 text-slate-200">Firebase Auth + Stripe Checkout Hooks</td>
                    <td className="py-2.5">Secure SSO integration, auto transactional fee deductions of entry stakes.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {docTab === 'db_schema' && (
        <div className="space-y-6 animate-fade-in" id="schema-view">
          
          {/* SVG relational schematic maps */}
          <div className="bg-slate-950 p-5 rounded-lg border border-slate-850 flex flex-col items-center" id="svg-relation-panel">
            <h3 className="font-semibold text-xs text-slate-400 font-mono self-start uppercase tracking-wider mb-4">Relational Database Schemas (Model Mapping)</h3>
            
            <div className="w-full overflow-x-auto py-4" id="svg-scroller">
              <svg viewBox="0 0 760 210" className="w-[760px] mx-auto text-[11px] font-mono leading-tight">
                {/* User table */}
                <rect x="20" y="20" width="160" height="150" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
                <text x="35" y="45" fill="#f8fafc" fontWeight="bold">USERS TABLE</text>
                <text x="35" y="70" fill="#a5b4fc">id (PK): UUID</text>
                <text x="35" y="90" fill="#a5b4fc">username: string</text>
                <text x="35" y="110" fill="#a5b4fc">walletBalance: float</text>
                <text x="35" y="130" fill="#a5b4fc">isPremium: string</text>
                <text x="35" y="150" fill="#94a3b8">xp: integer</text>

                {/* Connector User -> Team */}
                <line x1="180" y1="95" x2="240" y2="95" stroke="#4f46e5" strokeWidth="2" strokeDasharray="3,3" />

                {/* Team table */}
                <rect x="240" y="20" width="160" height="150" rx="6" fill="#022c22" stroke="#10b981" strokeWidth="1.5" />
                <text x="255" y="45" fill="#f8fafc" fontWeight="bold">TEAMS TABLE</text>
                <text x="255" y="70" fill="#a7f3d0">id (PK): UUID</text>
                <text x="255" y="90" fill="#a7f3d0">teamName: string</text>
                <text x="255" y="110" fill="#a7f3d0">owner_id (FK): UUID</text>
                <text x="255" y="130" fill="#a7f3d0">skill_rank: int</text>
                <text x="255" y="150" fill="#94a3b8">activeLobby: bool</text>

                {/* Connector Team -> Tournament */}
                <line x1="400" y1="95" x2="460" y2="95" stroke="#10b981" strokeWidth="2" />

                {/* Tournament table */}
                <rect x="460" y="20" width="160" height="150" rx="6" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="475" y="45" fill="#f8fafc" fontWeight="bold">TOURNAMENTS TABLE</text>
                <text x="475" y="70" fill="#fde68a">id (PK): UUID</text>
                <text x="475" y="90" fill="#fde68a">gameType: string</text>
                <text x="475" y="110" fill="#fde68a">prizePool: decimal</text>
                <text x="475" y="130" fill="#fde68a">isStakeFee: decimal</text>
                <text x="475" y="150" fill="#94a3b8">lobbyStatus: string</text>

                {/* Connector Tournament -> Course LMS */}
                <path d="M 100 170 C 100 200, 540 200, 540 170" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3,3" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-1">* Dotted line index indicates indirect cross-reference structures.</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-lg border border-slate-850 space-y-4" id="db-relations-breakdown">
            <h3 className="font-semibold text-sm text-slate-200 uppercase tracking-wider font-mono">Entity Mapping Directory</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When a team registers for a tournament via the **TournamentEngine**, the engine fires on-chain balance verifies inside the digital payouts tables. If verified successfully, we append team references to the tournament rosters table, calculating brackets immediately.
            </p>
          </div>

        </div>
      )}

      {docTab === 'roadmap' && (
        <div className="space-y-6 animate-fade-in" id="roadmap-view">
          
          <div className="space-y-4" id="roadmap-phases-stack">
            {/* Phase 1 */}
            <div className="bg-slate-950 p-5 rounded-lg border border-indigo-950 flex flex-col md:flex-row gap-4 justify-between" id="phase-card-1">
              <div className="space-y-1.5 md:max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                    PHASE 1 (MVP Launch)
                  </span>
                  <span className="text-xs text-slate-500">Timeline Months 1 - 2</span>
                </div>
                <h3 className="font-bold text-slate-200 text-sm">Core Tournament Seeding & Bracket Engine</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Deliver robust web bracket progression nodes (Single Elim, Double Elim). Deploy the active dispute uploads, real-time match referee overlays, and player level index indices.
                </p>
              </div>
              <div className="shrink-0 flex items-center font-mono text-[10px] text-indigo-400 bg-indigo-500/5 px-3 py-1 rounded border border-indigo-500/10 self-start md:self-center">
                100% SPEC COMPLETED
              </div>
            </div>

            {/* Phase 2 */}
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-850 flex flex-col md:flex-row gap-4 justify-between" id="phase-card-2">
              <div className="space-y-1.5 md:max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                    PHASE 2 (LMS & Dev Hub)
                  </span>
                  <span className="text-xs text-slate-500">Timeline Months 3 - 4</span>
                </div>
                <h3 className="font-bold text-slate-200 text-sm">Esports Academy LMS & Playtester Showcase</h3>
                <p className="text-[11px] text-slate-405 leading-relaxed">
                  Marketplace framework for professional guides. Integrated certification evaluation models offering real-time progress indicators and playable sandbox indie web emulators.
                </p>
              </div>
              <div className="shrink-0 flex items-center font-mono text-[10px] text-emerald-400 bg-emerald-500/5 px-3 py-1 rounded border border-emerald-500/10 self-start md:self-center">
                DEVELOPMENT READY
              </div>
            </div>

            {/* Phase 3 */}
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-850 flex flex-col md:flex-row gap-4 justify-between" id="phase-card-3">
              <div className="space-y-1.5 md:max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-600/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                    PHASE 3 (Coaching & Wallet)
                  </span>
                  <span className="text-xs text-slate-500">Timeline Months 5 - 6</span>
                </div>
                <h3 className="font-bold text-slate-200 text-sm">Pro Mechanics, Strategic Map and Digital Wallets</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Interactive drawing strategic whiteboards with responsive map loaders. Core reflex/aim warm-up games. Ledger settlements for cash payouts, entry fees and tiered subscription services.
                </p>
              </div>
              <div className="shrink-0 flex items-center font-mono text-[10px] text-amber-400 bg-amber-500/5 px-3 py-1 rounded border border-amber-500/10 self-start md:self-center">
                CURRICULUM ASSIGNED
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
