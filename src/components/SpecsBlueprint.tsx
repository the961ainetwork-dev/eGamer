import React, { useState } from 'react';
import { 
  Award, 
  ShieldAlert, 
  KeyRound, 
  Server, 
  Database, 
  Milestone, 
  BookOpen, 
  Layers,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Play,
  Users,
  Coins,
  TrendingUp,
  Terminal,
  ArrowRight,
  Code,
  Copy,
  PlusCircle,
  Check,
  Workflow,
  Sparkles,
  Search,
  HelpCircle
} from 'lucide-react';

// Interfaces for structured data
interface TableColumn {
  field: string;
  type: string;
  constraint: string;
  description: string;
}

interface TableSchema {
  tableName: string;
  description: string;
  columns: TableColumn[];
  indexes: string[];
}

export default function SpecsBlueprint() {
  const [docTab, setDocTab] = useState<'prd' | 'state_machine' | 'database' | 'integrations'>('prd');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // --- 1. Interactive States Simulator ---
  const [activeSimState, setActiveSimState] = useState<'draft' | 'registration' | 'checkin' | 'inprogress' | 'disputed' | 'completed'>('draft');

  const SIM_STATES = {
    draft: {
      name: "Draft State",
      meta: "Tournament constructed. Waiting for publish authorization.",
      serverJobs: [
        "Store configuration settings directly in Firestore/relational systems.",
        "Awaiting organizer action to announce public tournament URL."
      ],
      dbActions: [
        "INSERT INTO Tournaments (status: 'draft', config: JSON_BLOB)"
      ],
      webhookLog: "N/A (No external hooks spawned during draft setup)",
      nextState: "registration"
    },
    registration: {
      name: "Registration Open",
      meta: "Rosters opening. Accepting captain-driven applications and enforcing gates.",
      serverJobs: [
        "Query game platform API limits to verify rosters' competitive rank threshold.",
        "Authorize Stripe escrow payment holds for stake fees.",
        "Issue secure email validation tokens for teammates join-flows."
      ],
      dbActions: [
        "INSERT INTO Teams (status: 'pending')",
        "INSERT INTO TeamMembers (role: 'captain', user_id: 'UUID')",
        "UPDATE Tournaments SET current_registered_teams = current_registered_teams + 1"
      ],
      webhookLog: "POST /v1/webhooks/escrow-lock-success - Payload STATUS: SUCCESS",
      nextState: "checkin"
    },
    checkin: {
      name: "Check-In Live",
      meta: "60-minute absolute match gate. Resolving actual participant availability.",
      serverJobs: [
        "Run 60-minute ticking triggers. Auto-invalidate non-responsive registrations.",
        "Advance waitlisted rosters with higher average match rankings into active slots.",
        "Generate cryptographic Match IDs ready for seeded scheduling brackets."
      ],
      dbActions: [
        "UPDATE Teams SET checked_in = true WHERE last_ping < 60m",
        "DELETE FROM TournamentEntries WHERE checked_in = false AND queue_order > capacity",
        "INSERT INTO Matches (match_status: 'seeding_ready')"
      ],
      webhookLog: "POST /v1/webhooks/checkin-gate-close - Target: active-teams-confirmed",
      nextState: "inprogress"
    },
    inprogress: {
      name: "In Progress",
      meta: "Active matches executing. Live game instances reporting game metrics.",
      serverJobs: [
        "Command game cluster APIs via webhooks to build private static lobbies.",
        "Deliver match dashboard credentials (game access codes) instantly using Socket.io.",
        "Poll endpoints for automatic round completion JSON scores."
      ],
      dbActions: [
        "INSERT INTO Matches (team_a_id: 'UUID', team_b_id: 'UUID', score_a: NULL, status: 'playing')",
        "UPDATE Matches SET server_address = 'IP:PORT', lobby_pwd = 'CODE'"
      ],
      webhookLog: "POST /v1/webhooks/match-created - Server IP: 162.254.195.42:27015",
      nextState: "disputed"
    },
    disputed: {
      name: "Disputed Fallback",
      meta: "Automated scoring discrepancy or player-flagged cheat protest.",
      serverJobs: [
        "Freeze progression tree on active bracket branch branch node in real-time.",
        "Push immediate high-priority Webhook notification alerts to live human moderator Discord/Slack channels.",
        "Accept manual image/video artifact uploads via secured pipeline endpoints."
      ],
      dbActions: [
        "UPDATE Matches SET status = 'disputed', dispute_reason = 'mismatch_manual_report'",
        "INSERT INTO Disputes (match_id: 'UUID', reporter_id: 'UUID', category: 'evidence_upload')"
      ],
      webhookLog: "POST /v1/webhooks/operator-alert - Priority: CRITICAL (Admin Dispatch)",
      nextState: "completed"
    },
    completed: {
      name: "Completed & Settled",
      meta: "All match tiers resolved. Clear list of winners verified on anti-cheat trackers.",
      serverJobs: [
        "Initiate Escrow wallet pool distributions based on percentage splits (e.g., 60-30-10).",
        "Settle profile digital purses directly using robust database transactions.",
        "Audit champion match behaviors to write milestone achievement badges to profiles."
      ],
      dbActions: [
        "UPDATE Tournaments SET status = 'completed', completed_at = NOW()",
        "INSERT INTO Transactions (sender: 'escrow_wallet', receiver: 'UUID', amount: FLOAT)",
        "INSERT INTO EarnedBadges (user_id: 'UUID', badge_template_id: 'CHAMPION_UUID')"
      ],
      webhookLog: "POST /v1/webhooks/escrow-payouts-settled - Sent: $12,500 USD to 8 players",
      nextState: "draft"
    }
  };

  const triggerCopy = (txt: string, keyId: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedText(keyId);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // --- 2. Interactive Wizard Settings Mockup ---
  const [wizGame, setWizGame] = useState<'valorant' | 'cs2' | 'fortnite'>('valorant');
  const [wizBracket, setWizBracket] = useState<'single_elim' | 'double_elim' | 'round_robin' | 'swiss'>('double_elim');
  const [wizFormat, setWizFormat] = useState<'1v1' | '2v2' | '5v5'>('5v5');
  const [wizRankCeil, setWizRankCeil] = useState<'no_limit' | 'gold_only' | 'diamond_under'>('gold_only');
  const [wizEntryFee, setWizEntryFee] = useState<number>(10);
  const [wizForfeitTime, setWizForfeitTime] = useState<number>(15);

  const calculatedPayoutSplits = (() => {
    if (wizEntryFee === 0) return { pot: "Free ($0 Entry)", split1: "$0", split2: "$0", split3: "$0" };
    const estPot = wizEntryFee * 32 * (wizFormat === '5v5' ? 1 : 5); // 32 teams model
    return {
      pot: `$${estPot} USD (Est. 32 Rosters)`,
      split1: `$${(estPot * 0.6).toFixed(1)} USD (60%)`,
      split2: `$${(estPot * 0.3).toFixed(1)} USD (30%)`,
      split3: `$${(estPot * 0.1).toFixed(1)} USD (10%)`
    };
  })();

  const activeJsonBlueprint = `{
  "tournament_configuration": {
    "engine_version": "v2.1-battlefy-upgraded",
    "metadata": {
      "game_title": "${wizGame.toUpperCase()}",
      "platform_binding": "PC_STEAM_RIOT_INTEG",
      "region_lock": "NA_EAST_AUTO",
      "roster_format": "${wizFormat}"
    },
    "bracket_logic": {
      "type": "${wizBracket.toUpperCase()}",
      "has_consolation_bracket": ${wizBracket === 'double_elim' ? 'true' : 'false'},
      "swiss_stages_count": ${wizBracket === 'swiss' ? 5 : 0},
      "seeding_method": "SKILL_AVERAGE_EXTERNAL_MMR"
    },
    "schedule_matrix": {
      "check_in_window_minutes": 60,
      "round_interval_buffer_minutes": 45,
      "walk_over_forfeit_timer_minutes": ${wizForfeitTime},
      "auto_advance_unresponsive_matches": true
    },
    "entry_gating": {
      "rank_enforcement": {
        "enabled": ${wizRankCeil !== 'no_limit' ? 'true' : 'false'},
        "api_ceiling_rank_id": "${wizRankCeil === 'gold_only' ? 'RIOT_GOLD_III' : wizRankCeil === 'diamond_under' ? 'VAL_DIAMOND_I' : 'ALL_RANKS_ALLOWED'}",
        "allow_unranked_candidates": false
      },
      "financials": {
        "gateway_escrow": "STRIPE_CONNECT",
        "entry_currency": "USD",
        "entry_fee_per_slot": ${wizEntryFee}.00,
        "platform_service_tariff_pct": 5.0
      }
    },
    "prize_escrow": {
      "pool_model": "DYNAMIC_POT_ESCALATION",
      "base_guaranteed_pool": 250.00,
      "payout_split_tiers": [60, 30, 10]
    }
  }
}`;

  // --- 3. Database Schema Models ---
  const DATABASE_SCHEMAS: TableSchema[] = [
    {
      tableName: "Tournaments",
      description: "Primary parameters defining esports game limits, entrance escrow constraints, active statuses, and timing intervals.",
      columns: [
        { field: "id", type: "UUID", constraint: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Cryptographic system identifier for database lookups." },
        { field: "title", type: "VARCHAR(255)", constraint: "NOT NULL", description: "Esports league tournament name registered by hosts." },
        { field: "game_slug", type: "VARCHAR(50)", constraint: "NOT NULL", description: "Identifier (e.g. 'valorant', 'cs2', 'fortnite') mapping API actions." },
        { field: "bracket_type", type: "VARCHAR(20)", constraint: "NOT NULL DEFAULT 'single_elim'", description: "Valid types: 'single_elim', 'double_elim', 'round_robin', 'swiss'." },
        { field: "status", type: "VARCHAR(30)", constraint: "NOT NULL DEFAULT 'draft'", description: "State pipeline tracking: draft, registration, checkin, running, completed." },
        { field: "rank_ceiling_id", type: "VARCHAR(100)", constraint: "NULL", description: "Maximum authorized competitive rating id checked on third-party servers." },
        { field: "entry_fee", type: "DECIMAL(10,2)", constraint: "NOT NULL DEFAULT 0.00", description: "Stake value in fiat or credits required per player to join." },
        { field: "escrow_payout_splits", type: "INT[]", constraint: "NOT NULL DEFAULT '{60, 30, 10}'", description: "Array defining percent reward payouts for 1st, 2nd, and 3rd ranks." },
        { field: "forfeit_countdown_mins", type: "INT", constraint: "NOT NULL DEFAULT 15", description: "Grace period before registering default forfeit losses." },
        { field: "created_at", type: "TIMESTAMP", constraint: "NOT NULL DEFAULT NOW()", description: "UTC creation time log." }
      ],
      indexes: [
        "CREATE INDEX idx_tournaments_status ON Tournaments(status);",
        "CREATE INDEX idx_tournaments_game ON Tournaments(game_slug, bracket_type);"
      ]
    },
    {
      tableName: "Teams",
      description: "Aggregates users registered as rosters. Links owners, backup players, checked-in indicators, and skill stats indexes.",
      columns: [
        { field: "id", type: "UUID", constraint: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Cryptographic identifier representing roster entities." },
        { field: "tournament_id", type: "UUID", constraint: "FOREIGN KEY REFERENCES Tournaments(id) ON DELETE CASCADE", description: "Target tournament roster map index links." },
        { field: "team_name", type: "VARCHAR(128)", constraint: "NOT NULL", description: "The public name of the squad." },
        { field: "captain_id", type: "UUID", constraint: "NOT NULL REFERENCES Users(id)", description: "Responsible creator having administrative squad controls." },
        { field: "invite_token", type: "VARCHAR(64)", constraint: "NOT NULL UNIQUE", description: "Secure cryptographically generated onboarding link path." },
        { field: "average_rank_score", type: "INT", constraint: "NOT NULL DEFAULT 0", description: "The collective seed MMR calculated by polling Riot/Valve API profiles." },
        { field: "checked_in", type: "BOOLEAN", constraint: "NOT NULL DEFAULT FALSE", description: "Indicator ensuring active presence during check-in window gates." }
      ],
      indexes: [
        "CREATE INDEX idx_teams_tourney_ranked ON Teams(tournament_id, average_rank_score DESC);",
        "CREATE INDEX idx_teams_invite ON Teams(invite_token);"
      ]
    },
    {
      tableName: "Matches",
      description: "Individual matchups representing distinct bracket nodes. Controls server credentials, live scoring inputs, and active dispute events.",
      columns: [
        { field: "id", type: "UUID", constraint: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique identifier mapping bracket nodes." },
        { field: "tournament_id", type: "UUID", constraint: "FOREIGN KEY REFERENCES Tournaments(id)", description: "Links matches securely to overarching events." },
        { field: "team_a_id", type: "UUID", constraint: "REFERENCES Teams(id) ON DELETE SET NULL", description: "Identifies Team A side." },
        { field: "team_b_id", type: "UUID", constraint: "REFERENCES Teams(id) ON DELETE SET NULL", description: "Identifies Team B side." },
        { field: "round_index", type: "INT", constraint: "NOT NULL DEFAULT 1", description: "Identifies active bracket wave sequence rounds." },
        { field: "lobby_access_code", type: "VARCHAR(100)", constraint: "NULL", description: "Automated generated game password pushed via WebSocket states." },
        { field: "score_a", type: "INT", constraint: "NULL", description: "Score markers acquired by Team A. Extracted automatically from webhooks" },
        { field: "score_b", type: "INT", constraint: "NULL", description: "Score markers acquired by Team B." },
        { field: "match_status", type: "VARCHAR(35)", constraint: "NOT NULL DEFAULT 'pending'", description: "Valid states: pending, ready_check, playing, disputed, completed, forfeit." },
        { field: "dispute_evidence_json", type: "JSONB", constraint: "NULL", description: "Contains dispute links, logs, screenshots, and live moderator notes." }
      ],
      indexes: [
        "CREATE INDEX idx_matches_tourney_round ON Matches(tournament_id, round_index);",
        "CREATE INDEX idx_matches_status_dispute ON Matches(match_status) WHERE match_status = 'disputed';"
      ]
    },
    {
      tableName: "PrizeEscrows",
      description: "Ensures financial integrity. Houses cash deposits from entry tokens, escrow balances, and payout routes on completion.",
      columns: [
        { field: "id", type: "UUID", constraint: "PRIMARY KEY", description: "Identifier mapping to financial ledger records." },
        { field: "tournament_id", type: "UUID", constraint: "UNIQUE REFERENCES Tournaments(id)", description: "Ensures unique escrow maps per league event." },
        { field: "total_pot_value", type: "DECIMAL(12,2)", constraint: "NOT NULL DEFAULT 0.00", description: "Cumulative cash sums secured inside Stripe custody nodes." },
        { field: "payout_status", type: "VARCHAR(30)", constraint: "NOT NULL DEFAULT 'escrow_hold'", description: "Statuses: escrow_hold, disputed_freeze, paid_out." },
        { field: "settled_at", type: "TIMESTAMP", constraint: "NULL", description: "Time ledger completed disbursement." }
      ],
      indexes: [
        "CREATE INDEX idx_escrows_status ON PrizeEscrows(payout_status);"
      ]
    },
    {
      tableName: "EarnedBadges",
      description: "Gamification progression logs. Records verifiable achievements awarded to players and host profiles.",
      columns: [
        { field: "id", type: "UUID", constraint: "PRIMARY KEY", description: "Unique catalog log row id." },
        { field: "user_id", type: "UUID", constraint: "NOT NULL REFERENCES Users(id)", description: "Recipient of the gamified achievement token." },
        { field: "badge_type", type: "VARCHAR(64)", constraint: "NOT NULL", description: "E.g., PLACE_1ST, GIANTSLAY_SEEDS, GRIND_TOURN_10, RESP_DISPUTE_SPEED." },
        { field: "verifiable_match_context_id", type: "UUID", constraint: "NULL REFERENCES Matches(id)", description: "Secure proof link mapping back to the match demonstrating criteria fulfillment." },
        { field: "timestamp_rewarded", type: "TIMESTAMP", constraint: "NOT NULL DEFAULT NOW()", description: "UTC time index earned." }
      ],
      indexes: [
        "CREATE INDEX idx_badges_user_type ON EarnedBadges(user_id, badge_type);"
      ]
    }
  ];

  // --- 4. Mock API Integrated Webhooks Specs ---
  const API_INTEGRATIONS_DEMOS = {
    valorant: {
      provider: "Riot Games Tournament Service API",
      title: "Riot API Valorant Match Automation Payload",
      endpointUrl: "POST https://api.riotgames.com/val/match/v1/tournaments",
      description: "Automated Valorant Private Custom Server Spawning webhook, triggered when both teams ready-up.",
      requestPayload: `{
  "custom_server_config": {
    "tournament_code": "VAL-TOURNEY-BATTLEFY-REVOLUTION",
    "region": "na-east",
    "map_pool_slug": "de_bind",
    "server_mode": "TOURNAMENT_MOD_EXCLUSIVE",
    "allow_spectators": false,
    "cheats_enabled": false
  },
  "rosters_authorized": {
    "team_blue_captain_riot_id": "TenZ#NA1",
    "team_blue_member_uuids": ["user-1111", "user-2222", "user-3333", "user-4444"],
    "team_red_captain_riot_id": "Wardell#NA1",
    "team_red_member_uuids": ["user-5555", "user-6666", "user-7777", "user-8888"]
  },
  "callback_delivery_url": "https://api.battlefy-v2.platform/v1/webhooks/val-score-extractor"
}`,
      webhookCallback: `{
  "event_id": "val-evt-88a29d11",
  "event_type": "MATCH_SERIES_COMPLETED",
  "timestamp": "2026-06-03T12:00:05Z",
  "data": {
    "tournament_code": "VAL-TOURNEY-BATTLEFY-REVOLUTION",
    "match_id": "val-match-990a42f",
    "game_duration_seconds": 2145,
    "scores": {
      "blue_score": 13,
      "red_score": 9
    },
    "statistics_summary": [
      { "riot_id": "TenZ#NA1", "kills": 32, "deaths": 12, "headshots_pct": 42.1 },
      { "riot_id": "Wardell#NA1", "kills": 21, "deaths": 15, "headshots_pct": 31.8 }
    ]
  }
}`
    },
    cs2: {
      provider: "Valve Server CS2 Game-State Integration (GSI)",
      title: "Valve CS2 Match Server Spawning Hook & GSI Output",
      endpointUrl: "POST https://api.battlefy-v2.platform/v1/webhooks/cs2-server-provisioner",
      description: "Dispatches commands via CS2 Matchmaking API Webhooks to assign game instances on dedicated Linux CS2 nodes.",
      requestPayload: `{
  "match_server_allocation": {
    "datacenter": "dallas-ux-3",
    "max_tickrate": 128,
    "map": "de_mirage",
    "kick_bots": true,
    "password_protection": "SecureBattlefy99CS"
  },
  "game_rules": {
    "overtime_enabled": true,
    "max_rounds": 24,
    "grenade_trajectory_preview": false
  }
}`,
      webhookCallback: `{
  "server_state_gsi": {
    "match_id": "cs2-node-77a82b",
    "status": "game_finished",
    "map_rounds": 22,
    "score_t": 13,
    "score_ct": 9,
    "t_team_name": "Liquid-V2",
    "ct_team_name": "Fnatic-Classic",
    "mvp_name": "EliGE",
    "unusual_activity_anti_cheat_score": 0.04
  }
}`
    },
    fortnite: {
      provider: "Epic Games Fortnite Custom Keys Engine",
      title: "Epic Games Fortnite Tournament Custom Match Spec",
      endpointUrl: "POST https://api.epicgames.com/fortnite/v2/custom-lobbies",
      description: "Allocates randomized Matchmaking portal join keys pushed directly in real-time to up to 100 players' devices.",
      requestPayload: `{
  "epic_custom_match": {
    "host_organization_id": "org_battlefy_v2",
    "playlist_id": "playlist_trios_competitive",
    "custom_matchmaking_key": "BATTLEFY_TRIOS_FINALS_KEY_7a8f9",
    "allow_spectators": true,
    "force_input_type": "KEYBOARD_MOUSE_ONLY",
    "max_trios_count": 33
  }
}`,
      webhookCallback: `{
  "epic_tournament_placement": {
    "custom_matchmaking_key": "BATTLEFY_TRIOS_FINALS_KEY_7a8f9",
    "total_rosters_joined": 30,
    "lobby_placement_rankings": [
      { "trio_id": "trio-alpha", "rank": 1, "total_elims": 15, "victory_royale": true },
      { "trio_id": "trio-bravo", "rank": 2, "total_elims": 8, "victory_royale": false }
    ]
  }
}`
    }
  };

  const [activeApiDemoTab, setActiveApiDemoTab] = useState<'valorant' | 'cs2' | 'fortnite'>('valorant');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6" id="prd-blueprint-main">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Workflow className="w-6 h-6 text-indigo-400" />
            Tournament Engineering &amp; PRD Specs Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upgraded Battlefy-v2 Esports Infrastructure Blueprint. Core workflow automations, DB relational indices, and third-party Webhook specs.
          </p>
        </div>

        {/* Navigation Selector */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-850">
          <button
            onClick={() => setDocTab('prd')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
              docTab === 'prd' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Product Specs (PRD)
          </button>
          <button
            onClick={() => setDocTab('state_machine')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
              docTab === 'state_machine' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            Dynamic State Diagram
          </button>
          <button
            onClick={() => setDocTab('database')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
              docTab === 'database' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Database Schema (Relational)
          </button>
          <button
            onClick={() => setDocTab('integrations')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
              docTab === 'integrations' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            API Webhook Payload Console
          </button>
        </div>
      </div>

      {/* SECTION 1: MAIN PRD COMPILATION */}
      {docTab === 'prd' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 border border-indigo-950 rounded-lg flex items-start gap-3">
            <Settings className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-200">
              <span className="font-bold text-white block mb-0.5">Author: Principal Esports Systems Architect</span>
              This document establishes the architecture for the **Real-Time Esports Tournament Creation Engine**, deploying zero-human-intervention match cycles via game APIs.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* PRD Text */}
            <div className="lg:col-span-7 space-y-6 text-xs text-slate-300 leading-relaxed">
              
              {/* Module 1 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-1.5">
                  <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-mono text-[10px]">M-1</span>
                  The Tournament Setup Wizard (The Blueprint)
                </h3>
                <p>
                  To provide organizers with ultimate flexibility, the creation workflow must compile a detailed **Tournament Blueprint JSON** that drives subsequent real-time state cycles.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                  <li><strong className="text-slate-200">Game Parameter Binding:</strong> Capture target game engines, operating platforms (PC, Console, Mobile crossplays), server regions (NA, EU, APAC), and match format splits ranging from <code className="text-slate-300 font-mono">1v1</code> up to standard <code className="text-slate-300 font-mono">5v5</code> squad rosters.</li>
                  <li><strong className="text-slate-200">Bracket Logic Selection:</strong> Dynamic runtime structures. Must support <code className="text-slate-300 font-mono">Single Elimination</code>, <code className="text-slate-300 font-mono">Double Elimination</code> (generating separated Winner and Consolation brackets), <code className="text-slate-300 font-mono">Round Robin</code> pools, or mathematical <code className="text-slate-300 font-mono">Swiss Stage</code> rounds.</li>
                  <li><strong className="text-slate-200">Schedule Matrix:</strong> Defines check-in time windows, exact buffer intervals between rounds, and **Automatic Forfeit Timers** (the engine tracks if teams enter server lobbies, firing default forfeits after a 15-minute failure).</li>
                </ul>
              </div>

              {/* Module 2 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-1.5">
                  <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-mono text-[10px]">M-2</span>
                  Advanced Registration &amp; Entry Gating Workflows
                </h3>
                <p>
                  Secures structural entry barriers against Smurfing/Cheating and implements escrow gateways:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                  <li><strong className="text-slate-200">Captain-Led Roster Logic:</strong> Captain creates a Team, receives a high-security cryptographic checkout URL/Token, and teammates invite-validate themselves to fill necessary roster slots (including substitute rosters).</li>
                  <li><strong className="text-slate-200">API Rank Ceilings integration:</strong> Automatically queries player accounts against game API profiles (Riot Games API, Steam WebAPI, Epic Games Connectors) to enforce competitive boundaries (e.g. Reject Radiant player from 'Diamond &amp; Under' lobbies).</li>
                  <li><strong className="text-slate-200">Escrow Entrance Payment:</strong> Handles paid stakes (cash buy-ins, custom tokens, or platform-native coins) that are held in platform-managed escrow before distribution.</li>
                </ul>
              </div>

              {/* Module 3 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-1.5">
                  <span className="bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-mono text-[10px]">M-3</span>
                  Real-Time Bracket Gen &amp; Match Execution
                </h3>
                <p>
                  Zero-human match progression lifecycle:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                  <li><strong className="text-slate-200">Dynamic Esports Seeding:</strong> Computes seed weights using either random distributions or average match rankings parsed across active roster members.</li>
                  <li><strong className="text-slate-200">Automated Lobbies Spawning:</strong> Seamlessly dispatches match servers via API, pushes unique lobby passwords using WebSockets to checked-in players, and registers direct scoreboard webhooks.</li>
                  <li><strong className="text-slate-200">Interactive Screenshot Disputes:</strong> Discrepancy triggers immediately lock affected tree forks, dispatches immediate Discord alerts to web moderators, and spawns graphic uploads.</li>
                </ul>
              </div>

              {/* Module 4 & 5 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-1.5">
                  <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono text-[10px]">M-4/5</span>
                  Prize Purses &amp; Gamification Achievements
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                  <li><strong className="text-slate-200">Escrow Token Closures:</strong> When brackets resolve, payouts are finalized and auto-pushed from secure Stripe escrows into individual player accounts, avoiding manual payouts.</li>
                  <li><strong className="text-slate-200">Verifiable Profile Credentials:</strong> Accomplishment records write directly to users including, <code className="text-slate-300 font-mono">Champion</code> plaques, status achievements <code className="text-slate-300 font-mono">Giant Slayer</code> (defeating high-tier seeds), and organizer speed ratings for quick reviews.</li>
                </ul>
              </div>

            </div>

            {/* Simulated Live Setup Config (Build-A-Blueprint Component) */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-semibold text-slate-200 flex items-center gap-1.5 uppercase">
                  <Settings className="w-4 h-4 text-indigo-400" />
                  Blueprint Generator
                </h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-450 border border-emerald-900/40 px-1 py-0.5 rounded font-mono font-bold">LIVE PREVIEW</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Tweak parameters to dynamically generate the JSON document Battlefy uses to boot dynamic brackets, payment systems, and check-in parameters.
              </p>

              {/* Input fields */}
              <div className="space-y-3 font-sans text-xs text-slate-300">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Target Engine Protocol (Game API)</label>
                  <select 
                    value={wizGame} 
                    onChange={(e) => setWizGame(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-350"
                  >
                    <option value="valorant">Riot Games Valorant API</option>
                    <option value="cs2">Valve CS2 Server GSI Instance</option>
                    <option value="fortnite">Epic Games Fortnite Custom Portal</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Bracket Model</label>
                    <select 
                      value={wizBracket} 
                      onChange={(e) => setWizBracket(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-350 text-xs"
                    >
                      <option value="single_elim">Single Elimination</option>
                      <option value="double_elim">Double Elimination</option>
                      <option value="round_robin">Round Robin Groups</option>
                      <option value="swiss">Swiss Engine Matches</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Squad Roster Format</label>
                    <select 
                      value={wizFormat} 
                      onChange={(e) => setWizFormat(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-350 text-xs"
                    >
                      <option value="1v1">Solo Duels (1v1)</option>
                      <option value="2v2">Double Duos (2v2)</option>
                      <option value="5v5">Pro Competitive (5v5)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Rank ceiling</label>
                    <select 
                      value={wizRankCeil} 
                      onChange={(e) => setWizRankCeil(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-350 text-xs"
                    >
                      <option value="no_limit">None (Open/Radiant/Global)</option>
                      <option value="diamond_under">Diamond and Under</option>
                      <option value="gold_only">Under Gold (Under Gold-III)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Forfeit countdown</label>
                    <input 
                      type="number" 
                      value={wizForfeitTime}
                      onChange={(e) => setWizForfeitTime(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-350 text-xs" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Buy-In Entry Fee: ${wizEntryFee} USD</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5"
                    value={wizEntryFee}
                    onChange={(e) => setWizEntryFee(Number(e.target.value))}
                    className="w-full accent-indigo-500 bg-slate-900" 
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>Free ($0)</span>
                    <span>High Stakes ($100)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Payout Summary Card */}
              <div className="bg-slate-900 border border-slate-800 p-3 rounded space-y-1.5">
                <span className="text-[9px] font-mono font-bold text-indigo-400 block uppercase tracking-wider">Dynamic Payout Escrow Splits (Stripe Secure)</span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-500 block">Total Pot Value:</span>
                    <span className="text-white font-bold font-mono">{calculatedPayoutSplits.pot}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">1st place split:</span>
                    <span className="text-emerald-400 font-bold font-mono">{calculatedPayoutSplits.split1}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">2nd place split:</span>
                    <span className="text-slate-300 font-medium font-mono">{calculatedPayoutSplits.split2}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">3rd place split:</span>
                    <span className="text-amber-500 font-medium font-mono">{calculatedPayoutSplits.split3}</span>
                  </div>
                </div>
              </div>

              {/* Copy Blueprint Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-mono">JSON SPEC BLUEPRINT OUTPUT</span>
                  <button 
                    onClick={() => triggerCopy(activeJsonBlueprint, 'blueprint')}
                    className="hover:text-white transition flex items-center gap-1 font-mono hover:bg-slate-900 px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    {copiedText === 'blueprint' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPY SEC_BLOB</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-slate-900/80 rounded-md p-3 text-[10px] font-mono text-emerald-450 border border-slate-850 max-h-56 overflow-y-auto leading-relaxed">
                  <pre>{activeJsonBlueprint}</pre>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: TOURNAMENT LIFE STATE MACHINE */}
      {docTab === 'state_machine' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-5 rounded-lg border border-slate-850" id="live-state-visualization">
            <h3 className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Workflow className="w-4.5 h-4.5 text-indigo-400" />
              Tournament State Lifecycle Transition Flowchart
            </h3>

            {/* Interactive Flow Diagram SVG */}
            <div className="w-full overflow-x-auto py-2">
              <div className="flex items-center justify-between min-w-[750px] px-4">
                
                {/* DRAFT */}
                <button
                  onClick={() => setActiveSimState('draft')}
                  className={`flex flex-col items-center p-3 rounded-lg border transition text-center w-28 relative ${
                    activeSimState === 'draft' 
                      ? 'bg-slate-900 border-indigo-500 text-indigo-400 shadow shadow-indigo-600/20' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-xs font-bold mb-1.5 font-mono">1</div>
                  <span className="text-[10px] font-bold block leading-tight">1. Draft</span>
                  <span className="text-[9px] text-slate-500 font-mono mt-1">Config Mode</span>
                  {activeSimState === 'draft' && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rotate-45" />}
                </button>

                <ArrowRight className="w-4 h-4 text-slate-600 animate-pulse shrink-0" />

                {/* REGISTRATION */}
                <button
                  onClick={() => setActiveSimState('registration')}
                  className={`flex flex-col items-center p-3 rounded-lg border transition text-center w-28 relative ${
                    activeSimState === 'registration' 
                      ? 'bg-slate-900 border-indigo-500 text-indigo-400 shadow shadow-indigo-600/20' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-xs font-bold mb-1.5 font-mono">2</div>
                  <span className="text-[10px] font-bold block leading-tight">2. Registering</span>
                  <span className="text-[9px] text-slate-500 font-mono mt-1">API Roster Sync</span>
                  {activeSimState === 'registration' && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rotate-45" />}
                </button>

                <ArrowRight className="w-4 h-4 text-slate-600 animate-pulse shrink-0" />

                {/* CHECKIN */}
                <button
                  onClick={() => setActiveSimState('checkin')}
                  className={`flex flex-col items-center p-3 rounded-lg border transition text-center w-28 relative ${
                    activeSimState === 'checkin' 
                      ? 'bg-slate-900 border-indigo-500 text-indigo-400 shadow shadow-indigo-600/20' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-xs font-bold mb-1.5 font-mono">3</div>
                  <span className="text-[10px] font-bold block leading-tight">3. Check-In</span>
                  <span className="text-[9px] text-slate-500 font-mono mt-1">60m Lock Gate</span>
                  {activeSimState === 'checkin' && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rotate-45" />}
                </button>

                <ArrowRight className="w-4 h-4 text-slate-600 animate-pulse shrink-0" />

                {/* RUNNING */}
                <button
                  onClick={() => setActiveSimState('inprogress')}
                  className={`flex flex-col items-center p-3 rounded-lg border transition text-center w-28 relative ${
                    activeSimState === 'inprogress' 
                      ? 'bg-slate-900 border-indigo-500 text-indigo-400 shadow shadow-indigo-600/20' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-xs font-bold mb-1.5 font-mono">4</div>
                  <span className="text-[10px] font-bold block leading-tight">4. Running</span>
                  <span className="text-[9px] text-slate-500 font-mono mt-1">Lobby Spawn</span>
                  {activeSimState === 'inprogress' && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rotate-45" />}
                </button>

                <ArrowRight className="w-4 h-4 text-slate-600 animate-pulse shrink-0" />

                {/* DISPUTED */}
                <button
                  onClick={() => setActiveSimState('disputed')}
                  className={`flex flex-col items-center p-3 rounded-lg border transition text-center w-28 relative ${
                    activeSimState === 'disputed' 
                      ? 'bg-slate-900 border-indigo-500 text-indigo-400 shadow shadow-indigo-600/20' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-xs font-bold mb-1.5 font-mono">5</div>
                  <span className="text-[10px] font-bold block leading-tight">5. Disputed</span>
                  <span className="text-[9px] text-slate-500 font-mono mt-1">Mod Dispatch</span>
                  {activeSimState === 'disputed' && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rotate-45" />}
                </button>

                <ArrowRight className="w-4 h-4 text-slate-600 animate-pulse shrink-0" />

                {/* SETTLED */}
                <button
                  onClick={() => setActiveSimState('completed')}
                  className={`flex flex-col items-center p-3 rounded-lg border transition text-center w-28 relative ${
                    activeSimState === 'completed' 
                      ? 'bg-slate-900 border-indigo-500 text-indigo-400 shadow shadow-indigo-600/20' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-xs font-bold mb-1.5 font-mono">6</div>
                  <span className="text-[10px] font-bold block leading-tight">6. Completed</span>
                  <span className="text-[9px] text-slate-500 font-mono mt-1">Escrow Settled</span>
                  {activeSimState === 'completed' && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rotate-45" />}
                </button>

              </div>
            </div>
            
            <p className="text-[10.5px] text-slate-500 text-center font-mono mt-2.5">
              * Click any stage above to inspect live backend cloud micro-actions, database commands, and API telemetry logs.
            </p>
          </div>

          {/* Interactive State Details Monitor Panel */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 grid grid-cols-1 md:grid-cols-3 gap-6" id="state-monitoring-cockpit">
            
            {/* Server Microservices */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 border-b border-indigo-950 pb-2">
                <Server className="w-4 h-4 text-indigo-400" />
                ACTIVE SERVER ROUTINES
              </h4>
              <p className="text-[10.5px] text-indigo-300 font-mono leading-relaxed bg-indigo-950/20 border border-indigo-950 p-2.5 rounded">
                State: {SIM_STATES[activeSimState].name.toUpperCase()}
              </p>
              <div className="space-y-2 text-xs text-slate-400">
                {SIM_STATES[activeSimState].serverJobs.map((job, idx) => (
                  <div key={idx} className="flex gap-2 items-start bg-slate-900/50 p-2 rounded border border-slate-850">
                    <span className="text-indigo-400 text-[10px] font-bold font-mono">#{idx+1}</span>
                    <p className="text-[11px] leading-relaxed">{job}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated DB queries */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 border-b border-emerald-950 pb-2">
                <Database className="w-4 h-4 text-emerald-400" />
                SQL/DATABASE OPERATION LOG
              </h4>
              <p className="text-[10.5px] text-slate-500 leading-normal">
                Executing low-overhead, transaction-isolated records to prevent race conditions during rapid registrations and payments:
              </p>
              <div className="space-y-1.5 font-mono text-[10px]">
                {SIM_STATES[activeSimState].dbActions.map((act, id) => (
                  <div key={id} className="bg-slate-900 border border-emerald-950/40 p-2.5 rounded text-emerald-300 overflow-x-auto leading-relaxed">
                    <code>{act};</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Webhook Console */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 border-b border-rose-950 pb-2">
                <Terminal className="w-4 h-4 text-rose-450" />
                API TELEMETRY WEBHOOK STREAM
              </h4>
              <p className="text-[10.5px] text-slate-500 leading-normal">
                Outward webhook loops communicating status to game clusters and discord-alerts:
              </p>
              <div className="bg-slate-900 rounded p-3 text-[10px] font-mono text-rose-400 border border-rose-950/40 leading-relaxed overflow-x-auto">
                <p>&gt; telemetry_engine --listen</p>
                <p className="text-slate-300 mt-1.5">&gt; {SIM_STATES[activeSimState].webhookLog}</p>
              </div>

              {/* Advance action button */}
              <button
                onClick={() => {
                  const nextS = SIM_STATES[activeSimState].nextState as any;
                  setActiveSimState(nextS);
                }}
                className="w-full bg-indigo-600 hover:bg-slate-800 text-white font-mono rounded-lg px-3 py-2 text-xs font-bold transition flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                STEP TO NEXT LIFE-STATE
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 3: SYSTEM DATABASE RELATIONAL SCHEMAS */}
      {docTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 border border-emerald-950/40 rounded-lg flex items-start gap-3">
            <Database className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed text-left">
              <span className="font-bold text-emerald-400 block mb-0.5">Database Architectural Decisions</span>
              We design under **ACID compliance principles** using clean PostgreSQL schemas coupled with **Firestore real-time compound keys** on the live brackets nodes to permit sub-pixel updates during match play.
            </div>
          </div>

          <div className="space-y-6">
            {DATABASE_SCHEMAS.map((schema, sIdx) => (
              <div key={sIdx} className="bg-slate-950 border border-slate-850 rounded-lg overflow-hidden" id={`db-table-${schema.tableName.toLowerCase()}`}>
                <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-emerald-450 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      TABLE name: <span className="text-slate-100 underline decoration-emerald-800">{schema.tableName}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{schema.description}</p>
                  </div>
                  <span className="text-[9px] bg-slate-950 border border-slate-800 px-2.5 py-0.5 rounded font-mono font-bold text-indigo-400">POSTGRES TABLE</span>
                </div>

                {/* Table structure */}
                <div className="overflow-x-auto text-[11px] font-mono leading-normal" id="db-fields-scroller">
                  <table className="w-full text-slate-300 border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-850 text-slate-500 text-[10px]">
                        <th className="px-4 py-2.5 bg-slate-900/35">FIELD COLUMN</th>
                        <th className="px-4 py-2.5 bg-slate-900/35">DATA TYPE</th>
                        <th className="px-4 py-2.5 bg-slate-900/35">DB CONSTRAINTS</th>
                        <th className="px-4 py-2.5 bg-slate-900/35">FIELD EXPLANATION &amp; VALIDATIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {schema.columns.map((col, cIdx) => (
                        <tr key={cIdx} className="hover:bg-slate-900/40">
                          <td className="px-4 py-2.5 font-bold text-indigo-300">{col.field}</td>
                          <td className="px-4 py-2.5 text-emerald-400 font-semibold">{col.type}</td>
                          <td className="px-4 py-2.5 text-slate-500 text-[10px] max-w-[12rem] truncate">{col.constraint}</td>
                          <td className="px-4 py-2.5 text-slate-405 leading-relaxed font-sans">{col.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Index suggestions */}
                <div className="bg-slate-900/50 p-3 border-t border-slate-900 font-mono text-[10px] space-y-1.5 text-left">
                  <span className="font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wide">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    Compound Query Performance Indexes (Real-time Bracket optimizations):
                  </span>
                  <div className="space-y-1">
                    {schema.indexes.map((idxSql, iKey) => (
                      <div key={iKey} className="bg-slate-950 p-2 rounded border border-slate-850/60 overflow-x-auto">
                        <code className="text-emerald-400">{idxSql}</code>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: WEBHOOKS & API INTERACTION SPEC LOGGER */}
      {docTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 border border-rose-950/40 rounded-lg flex items-start gap-3">
            <Code className="w-5 h-5 text-rose-455 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-normal text-left">
              <span className="font-bold text-rose-400 block mb-0.5">Machine-To-Machine Orchestrator Spec</span>
              Esports play requires standard matchmaking systems to automatically spin up lobbies, detect complete scopes, and resolve disputes. The API payload loops demonstrated below represent completed web interfaces.
            </div>
          </div>

          <div>
            <div className="flex gap-2 border-b border-slate-800 pb-3" id="provider-tabs">
              <button
                onClick={() => setActiveApiDemoTab('valorant')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                  activeApiDemoTab === 'valorant' ? 'bg-indigo-600/10 border border-indigo-500 text-indigo-400 shadow' : 'bg-slate-950 text-slate-500 hover:text-slate-350 border border-transparent'
                }`}
              >
                Riot Games API (Valorant)
              </button>
              <button
                onClick={() => setActiveApiDemoTab('cs2')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                  activeApiDemoTab === 'cs2' ? 'bg-indigo-600/10 border border-indigo-500 text-indigo-400 shadow' : 'bg-slate-950 text-slate-500 hover:text-slate-350 border border-transparent'
                }`}
              >
                Valve Server (CS2)
              </button>
              <button
                onClick={() => setActiveApiDemoTab('fortnite')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                  activeApiDemoTab === 'fortnite' ? 'bg-indigo-600/10 border border-indigo-500 text-indigo-400 shadow' : 'bg-slate-950 text-slate-500 hover:text-slate-350 border border-transparent'
                }`}
              >
                Epic Games custom (Fortnite)
              </button>
            </div>
          </div>

          {/* Active Integration console details */}
          <div className="bg-slate-950 border border-slate-850 rounded-lg p-5 space-y-4" id="payload-explorer-frame">
            <div>
              <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-slate-400 text-[10px] font-mono font-black uppercase">
                INTEGRATION PROVIDER: {API_INTEGRATIONS_DEMOS[activeApiDemoTab].provider}
              </span>
              <p className="text-xs text-slate-400 mt-2">
                {API_INTEGRATIONS_DEMOS[activeApiDemoTab].description}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Outbound request payload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>OUTWARD HTTP PROVISIONING REQUEST</span>
                  <button 
                    onClick={() => triggerCopy(API_INTEGRATIONS_DEMOS[activeApiDemoTab].requestPayload, 'req_copy')}
                    className="hover:text-white transition flex items-center gap-1 hover:bg-slate-900 px-1 py-0.5 rounded cursor-pointer"
                  >
                    {copiedText === 'req_copy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedText === 'req_copy' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-slate-900 p-2 rounded-md font-mono text-[10px] text-emerald-450 border border-slate-850 overflow-x-auto max-h-96 leading-relaxed">
                  <span className="text-yellow-500 font-bold font-mono text-[9px] block mb-2">{API_INTEGRATIONS_DEMOS[activeApiDemoTab].endpointUrl}</span>
                  <pre>{API_INTEGRATIONS_DEMOS[activeApiDemoTab].requestPayload}</pre>
                </div>
              </div>

              {/* Inbound webhook response payload logic */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>INCOMING WEBHOOK RESULT DATA CALLBACK</span>
                  <button 
                    onClick={() => triggerCopy(API_INTEGRATIONS_DEMOS[activeApiDemoTab].webhookCallback, 'res_copy')}
                    className="hover:text-white transition flex items-center gap-1 hover:bg-slate-900 px-1 py-0.5 rounded cursor-pointer"
                  >
                    {copiedText === 'res_copy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedText === 'res_copy' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-slate-900 p-2 rounded-md font-mono text-[10px] text-indigo-300 border border-slate-850 overflow-x-auto max-h-96 leading-relaxed font-semibold">
                  <span className="text-[9px] font-mono uppercase bg-slate-950 text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded block mb-2 w-fit">POST CALLBACK GATEWAY</span>
                  <pre>{API_INTEGRATIONS_DEMOS[activeApiDemoTab].webhookCallback}</pre>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
