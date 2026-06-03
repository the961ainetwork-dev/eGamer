import { UserProfile, Tournament, Course, IndieGameSpec, CoachSessionBooking, CoinTransaction } from './types';

export const INITIAL_PROFILE: UserProfile = {
  username: "ApexTactician",
  rank: "Radiant / Challenger III",
  earnings: 2450.00,
  xp: 3450,
  level: 18,
  matchesPlayed: 142,
  winRate: 64.5,
  isPremium: 'Free',
  walletBalance: 150.00,
  freeAgentStatus: true,
  avatarSeed: "gamer"
};

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: "tourney_val_1",
    name: "Absolute Valorant Showdown",
    game: "Valorant",
    format: "Single Elimination",
    prizeLimit: 500,
    entryFee: 10,
    maxTeams: 8,
    status: "active",
    participants: [
      { id: "team_1", name: "Team Liquid Dust", ranking: 1800, members: ["User", "Axe", "Zephyr", "Riot", "Sage"] },
      { id: "team_2", name: "Sentinels Elite", ranking: 1950, members: ["TenZ", "Zellsis", "Johnqt", "Sacy", "Zekken"] },
      { id: "team_3", name: "Fnatic Phantom", ranking: 1720, members: ["Boaster", "Chronicle", "Derke", "Leo", "Alfajer"] },
      { id: "team_4", name: "NaVi Shadows", ranking: 1680, members: ["Shao", "Zyppan", "SUYGETSU", "ANGE1", "Ardiis"] },
      { id: "team_5", name: "G2 Ascents", ranking: 1650, members: ["trent", "valyn", "JonahP", "leaf", "icy"] },
      { id: "team_6", name: "Paper Rex Bounce", ranking: 1850, members: ["f0rsaken", "mindfreak", "d4v41", "something", "Jinggg"] },
      { id: "team_7", name: "DRX Shifters", ranking: 1710, members: ["stax", "MaKo", "Buzz", "BuZz", "Foxy9"] },
      { id: "team_8", name: "KRÜ Fire", ranking: 1620, members: ["keznit", "mzn", "Klaus", "Melser", "Shyy"] }
    ],
    matches: [
      { id: "m1_1", round: 1, teamA: "Team Liquid Dust", teamB: "KRÜ Fire", scoreA: 13, scoreB: 9, winnerId: "team_1", status: "completed", time: "10:30 UTC" },
      { id: "m1_2", round: 1, teamA: "Sentinels Elite", teamB: "DRX Shifters", scoreA: 13, scoreB: 11, winnerId: "team_2", status: "completed", time: "11:15 UTC" },
      { id: "m1_3", round: 1, teamA: "Fnatic Phantom", teamB: "Paper Rex Bounce", scoreA: 8, scoreB: 13, winnerId: "team_6", status: "completed", time: "12:00 UTC" },
      { id: "m1_4", round: 1, teamA: "NaVi Shadows", teamB: "G2 Ascents", scoreA: 12, scoreB: 14, winnerId: "team_5", status: "completed", time: "12:45 UTC" },
      
      { id: "m2_1", round: 2, teamA: "Team Liquid Dust", teamB: "G2 Ascents", status: "active", time: "14:00 UTC" },
      { id: "m2_2", round: 2, teamA: "Sentinels Elite", teamB: "Paper Rex Bounce", status: "scheduled", time: "14:45 UTC" },
      
      { id: "m3_1", round: 3, teamA: "Winner Semi 1", teamB: "Winner Semi 2", status: "scheduled", time: "16:00 UTC" }
    ]
  },
  {
    id: "tourney_lol_2",
    name: "Summoners Rift Amateur Open",
    game: "League of Legends",
    format: "Swiss",
    prizeLimit: 1200,
    entryFee: 15,
    maxTeams: 8,
    status: "upcoming",
    participants: [
      { id: "team_a", name: "T1 Devs", ranking: 2100, members: ["Faker", "Zeus", "Oner", "Gumayusi", "Keria"] },
      { id: "team_b", name: "G2 Esports Academy", ranking: 1950, members: ["Caps", "BrokenBlade", "Yike", "HansSama", "Mikyx"] },
      { id: "team_c", name: "GenG Juniors", ranking: 2050, members: ["Chovy", "Kiin", "Canyon", "Peyz", "Lehends"] },
      { id: "team_d", name: "Hanwha Life Juniors", ranking: 1900, members: ["Zeka", "Viper", "Delight", "Doran", "Peanut"] }
    ],
    matches: []
  },
  {
    id: "tourney_rl_3",
    name: "Rocket League Octane Mayhem",
    game: "Rocket League",
    format: "Double Elimination",
    prizeLimit: 300,
    entryFee: 5,
    maxTeams: 4,
    status: "completed",
    participants: [
      { id: "rl_1", name: "Vitality Stars", ranking: 2200, members: ["Zen", "Alpha54", "Radosin"] },
      { id: "rl_2", name: "Karmine Kop", ranking: 2100, members: ["Vatira", "Atow", "Rise"] },
      { id: "rl_3", name: "G2 Strikers", ranking: 2050, members: ["Daniel", "BeastMode", "Atomic"] },
      { id: "rl_4", name: "BDS Flight", ranking: 2000, members: ["M0nkeyM00n", "ExoTiiK", "Dralii"] }
    ],
    matches: [
      { id: "rl_m1", round: 1, teamA: "Vitality Stars", teamB: "BDS Flight", scoreA: 4, scoreB: 3, winnerId: "rl_1", status: "completed", time: "09:00 UTC" },
      { id: "rl_m2", round: 1, teamA: "Karmine Kop", teamB: "G2 Strikers", scoreA: 1, scoreB: 4, winnerId: "rl_3", status: "completed", time: "09:30 UTC" },
      { id: "rl_m3", round: 2, teamA: "Vitality Stars", teamB: "G2 Strikers", scoreA: 4, scoreB: 2, winnerId: "rl_1", status: "completed", time: "10:00 UTC" }
    ]
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: "c_strategy_1",
    title: "FPS Positioning, Seeding & Clutch Architecture",
    category: "Esports Strategy",
    instructor: "Coach Joshua (Ex-Radiant Rank #14)",
    duration: "4.5 hours",
    lessonsCount: 12,
    rating: 4.9,
    price: 35.00,
    enrolled: true,
    progress: 75,
    skills: ["Target crosshair isolation", "Flanking positioning", "Map coordinate control"],
    isLocked: false,
    quizzes: [
      {
        id: "q_fps1",
        question: "When holding a standard defense position, which crosshair placement maximizes reaction response time against peeking enemies?",
        options: [
          "Glued to the edge of the direct cover line",
          "Offset slightly wide of the corner to account for human reflex lag",
          "Aimed at crouch-level coordinates to stop slide rushes",
          "Frequently sweeping back and forth across the doorway"
        ],
        correctIndex: 1
      },
      {
        id: "q_fps2",
        question: "What is the primary advantage of the 'one-way' smoke choke tactic?",
        options: [
          "It deals passive acid damage over 5 seconds",
          "It blocks all bullet penetration indicators",
          "It permits you to see their legs/indicators before they can resolve your outline",
          "It prevents enemy flashes from flashing your display screen"
        ],
        correctIndex: 2
      }
    ]
  },
  {
    id: "c_gamedev_2",
    title: "Robust Multiplayer Mechanics in Godot Engine 4",
    category: "Game Development",
    instructor: "Devin Sparks (Developer at IndieNexus)",
    duration: "10.2 hours",
    lessonsCount: 22,
    rating: 4.8,
    price: 55.00,
    enrolled: false,
    progress: 0,
    skills: ["Client-Side Prediction", "Local RPC Handshakes", "Server Authority Nodes"],
    isLocked: false,
    quizzes: [
      {
        id: "q_gamedev1",
        question: "Under the WebSockets/TCP network state, how does Godot handle lag/high-ping visual snapping?",
        options: [
          "By completely reloading the active map scene file",
          "Employing linear/hermite interpolation (lerp) to smooth positions between ticks",
          "Ignoring packets and letting client predictions take over forever",
          "Decreasing the game's physics ticks limit down to 5 frames"
        ],
        correctIndex: 1
      },
      {
        id: "q_gamedev2",
        question: "Which RPC mode ensures that ONLY the hosting server process can run the called function?",
        options: [
          "@rpc(\"any_peer\")",
          "@rpc(\"call_local\")",
          "@rpc(\"authority\")",
          "@rpc(\"server\")"
        ],
        correctIndex: 3
      }
    ]
  },
  {
    id: "c_mental_3",
    title: "Neuro-Reflex Stabilization & Performance Mastery",
    category: "Mental Health",
    instructor: "Dr. Evelyn Vance (Esports Neuropsychologist)",
    duration: "3 hours",
    lessonsCount: 8,
    rating: 4.95,
    price: 25.00,
    enrolled: false,
    progress: 0,
    skills: ["Heart-rate variability control", "Cognitive tilt mitigation", "Warm-up sequence dynamics"],
    isLocked: false,
    quizzes: [
      {
        id: "q_mental1",
        question: "What physiochemical reaction triggers gaming 'tilt' causing poor shooting accuracy and rushed choices?",
        options: [
          "An rapid drop in core arterial blood oxygen levels",
          "Amygdala highjack stimulating immediate release of cortisol/adrenaline overrides structural cortex planning",
          "The temporary depletion of spinal cord glucose reserves",
          "Extreme pupil dilation blocks light spectrum analysis"
        ],
        correctIndex: 1
      }
    ]
  },
  {
    id: "c_content_4",
    title: "Brand Architecture & Twitch Analytics Automation",
    category: "Content Creation",
    instructor: "Mark 'GamerPrism' Lee",
    duration: "5 hours",
    lessonsCount: 14,
    rating: 4.7,
    price: 19.99,
    enrolled: false,
    progress: 0,
    skills: ["API trigger OBS scenes", "Metadata indexing techniques", "Subscriber value retainment"],
    isLocked: false,
    quizzes: [
      {
        id: "q_content1",
        question: "Which factor has the highest weight ratio in search indexing on video algorithm platforms?",
        options: [
          "Absolute pixel frame-rate output",
          "High click-through-rate matched with continuous watch-duration velocity",
          "Total number of hashtags pasted in the description footer",
          "Stereo audio sound quality indicators in the metadata file"
        ],
        correctIndex: 1
      }
    ]
  },
  {
    id: "c_gamedev_physics",
    title: "Competitive Physics: Ballistic Trajectories & Sub-pixel Interpolation",
    category: "Game Development",
    instructor: "Sarah Vance (IndieNexus Engineering Lead)",
    duration: "9.5 hours",
    lessonsCount: 3,
    rating: 4.9,
    price: 40.00,
    enrolled: true,
    progress: 33,
    skills: ["C++ Vector Math", "Hitbox Projection Matrices", "Sub-pixel Collision Resolvers"],
    isLocked: false,
    quizzes: [
      {
        id: "q_physics_1",
        question: "In standard sub-pixel collision physics, how is 'tunneling' (where high-speed bullets clip through thin mesh walls) avoided in performance-focused game engines like Unreal Engine and Godot?",
        options: [
          "By rendering the walls as double-sided transparent materials",
          "By implementing Continuous Collision Detection (CCD) to raycast the trajectory from the origin coordinate to the terminal destination",
          "By decreasing the client-side frame-rate refresh to 30Hz",
          "By running an active script that forces the player coordinates to translate backward on tick"
        ],
        correctIndex: 1
      },
      {
        id: "q_physics_2",
        question: "Which mathematical operation is used to calculate the bounce angle when a ball collides with an angled wall or pitch border?",
        options: [
          "Reflecting the velocity vector across the contact surface normal vector using the formula: V_out = V_in - 2 * (V_in · N) * N",
          "Running a fast Fourier transform over the sound coordinates",
          "Averaging the distance of all static polygon nodes on the map",
          "Calculating the logarithmic inverse of the speed coefficient"
        ],
        correctIndex: 0
      }
    ]
  },
  {
    id: "c_gamedev_netcode",
    title: "Netcode Secrets: Lag Compensation, Client-Side Prediction & Anti-Cheat",
    category: "Game Development",
    instructor: "Sarah Vance (IndieNexus Engineering Lead)",
    duration: "12.0 hours",
    lessonsCount: 3,
    rating: 5.0,
    price: 45.00,
    enrolled: false,
    progress: 0,
    skills: ["C# Deterministic Physics", "Server-Side Rollback Frames", "Memory Buffer Integrity"],
    isLocked: false,
    quizzes: [
      {
        id: "q_netcode_1",
        question: "When reverse engineering modern hitscan shooters, why does the server perform backward reconciliation (lag compensation) instead of accepting the client's direct hit confirmed packet?",
        options: [
          "To optimize graphic card rendering efficiency on host hosts",
          "To prevent client-side coordinate spoofing cheats and evaluate hit indices based on historical state snapshots corresponding to client ping latency",
          "To force both clients into equivalent network speed thresholds",
          "To save hard drive storage space on remote database servers"
        ],
        correctIndex: 1
      },
      {
        id: "q_netcode_2",
        question: "What is client-side prediction in fast-paced action titles?",
        options: [
          "Allowing the client to run local movement and physics interactions instantly without waiting for server network responses, then correcting if discrepancies occur",
          "Using machine learning models to speculate whether players will buy skins",
          "A system that shuts down game processes if network packets are dropping",
          "Relying on hardware clock systems to pre-render the future state of the map"
        ],
        correctIndex: 0
      }
    ]
  },
  {
    id: "c_gamedev_assets",
    title: "Low-Poly Asset Creation & Shader Blueprints: Baking High-Detail Aesthetics",
    category: "Game Development",
    instructor: "Devin Sparks (Lead Technical Artist)",
    duration: "7.0 hours",
    lessonsCount: 3,
    rating: 4.7,
    price: 30.00,
    enrolled: false,
    progress: 0,
    skills: ["High-to-Low Poly Normal Baking", "GPU Vertex Shaders", "Specular Map Allocations"],
    isLocked: false,
    quizzes: [
      {
        id: "q_asset_1",
        question: "What is the primary technical objective of 'normal mapping' when designing visual assets for competitive esports titles?",
        options: [
          "To increase the physics collision mesh precision by 1000x",
          "To encode high-frequency depth, shadow, and curvature data from a high-poly sculpt onto a lightweight low-poly mesh, maintaining pristine graphics at low GPU rendering costs",
          "To define the boundaries of local server routers",
          "To convert coordinates from 3D coordinates into orthographic perspective variables"
        ],
        correctIndex: 1
      }
    ]
  }
];

export const INITIAL_GAMES: IndieGameSpec[] = [
  {
    id: "g_starship",
    name: "Starship Deflector: Void Strike",
    developer: "Forge_Fire_Games",
    genre: "Space Action Arcade",
    description: "Deflect retro meteor storms and counter strike interceptor hulls in this client-side orbital reaction runner. Build logs, playtester systems, and feedback are active.",
    plays: 1420,
    rating: 4.6,
    reviews: [
      { id: "rev_1", author: "ViperLover", rating: 5, comment: "Incredibly active developer. Mechanics feel punchy! Can find small collision issues in edges.", date: "2026-05-18", isPlaytester: true },
      { id: "rev_2", author: "CodeCrusader", rating: 4, comment: "I reported the collision glitch on stage 3. The dev responded within 4 hours. Epic playtester portal!", date: "2026-05-24", isPlaytester: true }
    ],
    bugs: [
      { id: "bug_1", reporter: "CodeCrusader", description: "V-sync toggle in option menu sometimes screen locks secondary overlays.", severity: "medium", status: "fixing", date: "2026-05-24" },
      { id: "bug_2", reporter: "TenzFan42", description: "Audio triggers are delayed by 20ms under Chrome browser instances.", severity: "low", status: "open", date: "2026-05-28" }
    ]
  },
  {
    id: "g_dungeon",
    name: "Reflex Dungeon: React or Die",
    developer: "RetroMage_Studios",
    genre: "Puzzle Platformer Reflexive",
    description: "A fast-paced reflexive trap dodger using 1D visual pathways. Compete on timers and report gameplay balance requests.",
    plays: 890,
    rating: 4.2,
    reviews: [
      { id: "rev_3", author: "Yuri_V", rating: 4, comment: "Excellent level scaling, but standard bounce rate is too slow. Make the spikes trigger instantly!", date: "2026-05-20", isPlaytester: false }
    ],
    bugs: [
      { id: "bug_3", reporter: "Yuri_V", description: "Spikes animation loops during the load screen, lowering frame-rates.", severity: "low", status: "resolved", date: "2026-05-20" }
    ]
  }
];

export const MOCK_COACHES = [
  { id: "coach_1", name: "Coach Joshua", game: "Valorant", experience: "Ex-Radiant Top 20", rating: 4.9, price: 25.00, avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" },
  { id: "coach_2", name: "Devin Sparks", game: "Indie Game", experience: "Lead Dev at IndieNexus", rating: 4.8, price: 30.00, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" },
  { id: "coach_3", name: "Evelyn Vance", game: "League of Legends", experience: "Mental & Synergy Coach", rating: 5.0, price: 40.00, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" }
];

export const INITIAL_TRANSACTIONS: CoinTransaction[] = [
  { id: "tx_1", type: "deposit", amount: 200.00, description: "Card Deposit Visa **4242", date: "2026-05-10 14:32" },
  { id: "tx_2", type: "course_buy", amount: 35.00, description: "Bought Course: FPS Positioning, Seeding & Clutch Architecture", date: "2026-05-11 10:15" },
  { id: "tx_3", type: "entry_fee", amount: 15.00, description: "Tournament Entry Fee: Summoners Rift Amateur Open", date: "2026-05-14 18:00" }
];
