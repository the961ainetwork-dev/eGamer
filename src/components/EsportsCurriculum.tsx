import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Brain, 
  Gamepad2, 
  Trophy, 
  GraduationCap, 
  Sparkles, 
  Bookmark, 
  PlayCircle, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  RefreshCw, 
  ExternalLink,
  ShieldAlert,
  Terminal,
  Zap,
  Clock,
  Laptop
} from 'lucide-react';

interface ModuleData {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  duration: string;
  deliveryMethods: string[];
  rationale: string;
  learningObjectives: string[];
  keyTopics: string[];
  suggestedActivities: {
    name: string;
    description: string;
    type: string;
  }[];
  assessmentMethods: string[];
  bgIcon: React.ReactNode;
}

const MODULES_DATA: ModuleData[] = [
  {
    id: "mod-1",
    number: "MODULE 01",
    title: "FOUNDATIONAL ALGORITHMS & ESPORTS ANALYTICS",
    subtitle: "Reverse-engineering the tactical gameplay landscape through AI scrapers",
    duration: "2 Weeks (12 Contact Hours)",
    deliveryMethods: [
      "Cyber-lecture Screencasts",
      "Interactive Telemetry Data Labs",
      "Asynchronous Video Walkthroughs"
    ],
    rationale: "Understanding the underlying analytics engines and machine-learning frameworks gives pro players a decisive statistical edge, allowing them to decode game patches, weapon recoil heatmaps, and optimal rotation strategies ahead of the competition.",
    learningObjectives: [
      "Deconstruct game telemetry logs into actionable player coordination datasets",
      "Interpret regression heatmaps for weapon recoil balances and meta deviations",
      "Utilize computer-vision tools to measure individual and team target-acquisition latency"
    ],
    keyTopics: [
      "Computational Esports Mechanics & Telemetry extraction API flows",
      "Computer-vision mapping for target pixel tracking",
      "Weapon dispersion heatmaps and patch deviation analysis"
    ],
    suggestedActivities: [
      {
        name: "Telemetry Heatmap Scraping",
        description: "Review raw gameplay logs from a professional Valorant tournament and feed them into a telemetry model to isolate high-risk path nodes.",
        type: "Data Lab"
      },
      {
        name: "Computer-Vision Reflex Calibration",
        description: "Run automated webcam feed analysis to log physical peripheral response times, charting performance changes across sleep cycles.",
        type: "Reflex Calibration Studio"
      }
    ],
    assessmentMethods: [
      "Formative: Telemetry extraction query dashboard submission (Auto-graded)",
      "Summative: Comprehensive data-driven patch-impact strategy report (Verified Badge)"
    ],
    bgIcon: <Cpu className="w-12 h-12 text-cyan-400" />
  },
  {
    id: "mod-2",
    number: "MODULE 02",
    title: "AI STRATEGY MODELING & OPPONENT DECODING",
    subtitle: "Draft optimization and generative counter-play patterns",
    duration: "3 Weeks (18 Contact Hours)",
    deliveryMethods: [
      "Sandbox Prompt Playgrounds",
      "Synchronous Live Simulation Tournaments",
      "AI Coach Consultation Pods"
    ],
    rationale: "GenZ gamers thrive on decentralized, active strategic manipulation. Learning to co-author strategy blueprints with generative AI empowers players to dynamically adapt to complex opponent behaviors and draft configurations in real-time.",
    learningObjectives: [
      "Design advanced prompting blueprints to simulate specific professional opponent rosters",
      "Optimize agent draft pick selections using statistical AI decision trees",
      "Execute responsive real-time tactical countermeasures under active simulated crisis alerts"
    ],
    keyTopics: [
      "Structured GenAI prompts for game meta-scouting",
      "Generative reinforcement learning for strategic mapping",
      "Agent drafting state-space trees & counters"
    ],
    suggestedActivities: [
      {
        name: "Generative Meta-Scouting Sandbox",
        description: "Draft tactical prompt matrices to model the defensive rotations of premier competitive roster setups, predicting their retakes with extreme precision.",
        type: "Prompt Workshop"
      },
      {
        name: "Draft Tree Simulator",
        description: "Simulate a live pick-ban cycle against an adversarial AI bot trained on previous League of Legends championship results.",
        type: "Tactical Sandbox Match"
      }
    ],
    assessmentMethods: [
      "Formative: Draft state-space mapping schema review",
      "Summative: Prompt-engineered interactive counter-play matrix presentation evaluated by professional coaches"
    ],
    bgIcon: <Brain className="w-12 h-12 text-indigo-400" />
  },
  {
    id: "mod-3",
    number: "MODULE 03",
    title: "COGNITIVE SPEEDFLOW & PHYSIOLOGICAL SYNERGIES",
    subtitle: "Optimizing the human hardware inside the tactical game environment",
    duration: "2 Weeks (12 Contact Hours)",
    deliveryMethods: [
      "Biometric feedback visualization labs",
      "Micro-training reflex intervals",
      "Interactive cognitive-load testbeds"
    ],
    rationale: "Esports excellence is heavily tied to physical and cognitive recovery. Developing elite-level focus discipline involves coordinating biometrics, flow-state breathing routines, and target-focused reflex calibration.",
    learningObjectives: [
      "Calibrate optimal focus cycles using real-time heart rate variability (HRV) telemetry indicators",
      "Incorporate structured visual tracking drills to eliminate target misacquisition errors",
      "Deconstruct cognitive fatigue limits by analyzing micro-interaction performance metrics"
    ],
    keyTopics: [
      "Physiological esports endurance (HRV, eye-strain, finger latency)",
      "Cognitive flow-state entrainment breathing algorithms",
      "Dynamic visual sensory training paradigms"
    ],
    suggestedActivities: [
      {
        name: "Chronos HRV Recovery Loop",
        description: "Synchronize standard breathing loops to match target pacing, logging physiological state changes via ambient telemetry charts.",
        type: "Physiology Training"
      },
      {
        name: "Eye-Tracking Peripheral Check",
        description: "Conduct eye tracking tests using customized focal grids to identify blind response sectors during high-density team battles.",
        type: "Cognitive Focus Drill"
      }
    ],
    assessmentMethods: [
      "Formative: Personal fatigue-index telemetry log",
      "Summative: Verified physical aim-recovery loop benchmark certification (Minimum 90% accuracy)"
    ],
    bgIcon: <Zap className="w-12 h-12 text-rose-400" />
  },
  {
    id: "mod-4",
    number: "MODULE 04",
    title: "AI-COACHED SCENARIO LABS & TOURNAMENT WRAP",
    subtitle: "Live team simulations with dynamic telemetry feedback",
    duration: "3 Weeks (18 Contact Hours)",
    deliveryMethods: [
      "Live-action single-elimination tournament trials",
      "Micro-telemetry match reviews",
      "Collaborative whiteboard retro reviews"
    ],
    rationale: "Synthesizing tactical data analytics and cognitive discipline inside a high-stress competitive workspace converts theoretical proficiency into active competitive mastery and leadership.",
    learningObjectives: [
      "Translate live telemetry insights into rapid in-game play re-coordinations",
      "Execute high-accuracy physical maneuvers under simulated live broadcast stress levels",
      "Publish comprehensive post-match analytical retro-logs reviewed by professional academy refs"
    ],
    keyTopics: [
      "Live telemetry feed interpretation and real-time team adjustments",
      "Crisis management algorithms for team communications",
      "Professional portfolio building with NFT badge proofs"
    ],
    suggestedActivities: [
      {
        name: "Live AI-Coached Dev Cup Trial",
        description: "Compete in an accelerated tournament while receiving real-time automated prompt analysis and live tactic recommendations.",
        type: "Full Arena Simulation"
      },
      {
        name: "Interactive Retro Analysis Writeup",
        description: "Generate a complete mathematical breakdown of mistakes and success path indicators from your match files, assisted by AI review.",
        type: "Analytical Portfolio Project"
      }
    ],
    assessmentMethods: [
      "Formative: Prompt-assisted tactical retro-log",
      "Summative: Unified Capstone Championship Team Performance Metrics Evaluated by Esports Academy Board"
    ],
    bgIcon: <Trophy className="w-12 h-12 text-amber-400" />
  }
];

const PROMPT_TEMPLATES = [
  {
    name: "Valorant Map Attack Optimizer",
    game: "Valorant",
    assistant: "Aim-Reflex Analyst",
    promptText: "Analyze raw coordinates (A-site entry) for defensive smoke cover. Identify peak choke points and optimal AI-recoiled counter-aim angles.",
    outputSimulated: "📍 ANALYZING VALORANT HEATMAP DATA:\n- Identified Choke Point: entry corridor [X: 142.2, Y: 89.4]\n- Recommended Counter-Aim: 12.5° upward pitch to compensate for heavy recoil spray decay.\n- Tactical Pathing: delay breach by 320ms to allow defensive vision flares to burn out."
  },
  {
    name: "LoL Pick/Ban Advisor",
    game: "League of Legends",
    assistant: "Strategy Draft Optimizer",
    promptText: "Given opposition bans (Yasuo, Syra, Vayne) and high-priority picks. Select meta counters maximizing map control values.",
    outputSimulated: "🤖 GENERATIVE DRAFT TREE MATRIX:\n- Win-Probability Rank:\n  1. Azir (74.2% synergy against active lane layout)\n  2. Viktor (68.9% area denial coefficient)\n- Recommended Action: Ban Jax next round to shield lower priority champions."
  },
  {
    name: "Rocket League Aerospace Calibrator",
    game: "Rocket League",
    assistant: "Opponent Meta Planner",
    promptText: "Simulate aerial speed offsets to bypass high-lying goalkeepers under 150ms boost conditions.",
    outputSimulated: "🚀 PHYSIOLOGICAL AERODYNAMIC TRAJECTORY:\n- Double-Jump latency offset: 18ms\n- Vector target angle: 42° pitch, 11° roll\n- Recommended physical training drill: 15 rapid vertical aerial hits on rebound arenas."
  }
];

interface QuizState {
  currentQuestion: number;
  selectedOption: number | null;
  score: number;
  completed: boolean;
}

const QUIZ_QUESTIONS = [
  {
    text: "What does computer-vision tracking measure inside elite aim telemetry structures?",
    options: [
      "The exact latency between a target appearing on-screen and peripheral movement start",
      "The color rendering index of the user's desktop monitor",
      "The total memory allocation of the game engine's graphic buffers",
      "The frequency rate of physical mouse wheel clicks"
    ],
    correct: 0,
    explanation: "Computer-vision tracks individual frames to count the exact time interval between a pixel-level target state change and the responsive cursor trajectory acceleration."
  },
  {
    text: "In Module 02 strategy prompting, what is the core benefit of utilizing a 'Draft Decision Space Tree'?",
    options: [
      "It automatically logs into the user's private game accounts to play matches",
      "It mathematically maps out potential hero pick/ban outcomes based on champion synergy ratios",
      "It reduces ambient router latency across the network",
      "It triggers physical vibration feedback in gamepad controllers"
    ],
    correct: 1,
    explanation: "Draft trees recursively calculate meta matchups to predict high-tier opponent selections and recommend maximum statistical synergies under standard team composition rules."
  },
  {
    text: "How does Heart Rate Variability (HRV) telemetry help in mitigating cognitive fatigue?",
    options: [
      "It adjusts the graphics quality of the game clients down to 30fps",
      "It detects physiological stress spikes and triggers cognitive focus/breathing cycles to lower cortisol",
      "It generates a new random passcode for secure wallets",
      "It increases the mouse tracking DPI coefficient autonomously"
    ],
    correct: 1,
    explanation: "HRV monitors the delicate micro-balance of sympathetic and parasympathetic nervous activation, allowing players to calibrate breathing routines so they remain in deep focus without hitting fatigue spikes."
  }
];

export default function EsportsCurriculum() {
  const [selectedModule, setSelectedModule] = useState<ModuleData>(MODULES_DATA[0]);
  const [activeModuleTab, setActiveModuleTab] = useState<'objectives' | 'topics' | 'activities' | 'assessments'>('objectives');
  
  // Prompt Playground State
  const [selectedGame, setSelectedGame] = useState<string>("Valorant");
  const [selectedRole, setSelectedRole] = useState<string>("Strategy Draft Optimizer");
  const [customPrompt, setCustomPrompt] = useState<string>("Analyze opposition early eco-round rotations and suggest dynamic flank patterns.");
  const [simulatedOutput, setSimulatedOutput] = useState<string>("");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Learning Outcomes Tracker States
  const [completedObjectives, setCompletedObjectives] = useState<Record<string, boolean>>({
    'Deconstruct game telemetry logs into actionable player coordination datasets': true,
    'Deconstruct cognitive fatigue limits by analyzing micro-interaction performance metrics': false,
    'Design advanced prompting blueprints to simulate specific professional opponent rosters': false,
  });

  // Quiz State
  const [quiz, setQuiz] = useState<QuizState>({
    currentQuestion: 0,
    selectedOption: null,
    score: 0,
    completed: false
  });
  const [quizStarted, setQuizStarted] = useState<boolean>(false);

  // Auto layout selection helper matching the standard prompts
  const fillPromptFromTemplate = (tpl: typeof PROMPT_TEMPLATES[0]) => {
    setSelectedGame(tpl.game);
    setSelectedRole(tpl.assistant);
    setCustomPrompt(tpl.promptText);
    setSimulatedOutput(tpl.outputSimulated);
  };

  const runSimulatedPrompt = () => {
    if (!customPrompt.trim()) return;
    setIsSimulating(true);
    setSimulatedOutput("");

    setTimeout(() => {
      // Find matching template or generate creative AI text
      const templateMatch = PROMPT_TEMPLATES.find(p => p.promptText.toLowerCase().includes(customPrompt.toLowerCase()) || customPrompt.toLowerCase().includes(p.promptText.toLowerCase()));
      
      if (templateMatch) {
        setSimulatedOutput(templateMatch.outputSimulated);
      } else {
        setSimulatedOutput(`💻 [AI AGENT CORE RUNNING MULTI-THREAD ANALYSIS]...\nGame Target: ${selectedGame}\nAnalyst Protocol: ${selectedRole}\nPrompt: "${customPrompt}"\n\n🎯 GENERATED ES-TACTICAL INSIGHT:\n- Telemetry Confidence: 94.8%\n- Recommendations:\n  1. Exploit defensive movement delays with reactive flash elements.\n  2. Restructure physical rotation pathing via outer bounds of the arena.\n  3. Conduct physiological recovery interval checks under active match tension.\n- Code Signature Verified.`);
      }
      setIsSimulating(false);
    }, 1200);
  };

  const handleToggleObjective = (objText: string) => {
    setCompletedObjectives(prev => ({
      ...prev,
      [objText]: !prev[objText]
    }));
  };

  const handleOptionSelect = (optIdx: number) => {
    setQuiz(prev => ({ ...prev, selectedOption: optIdx }));
  };

  const handleNextQuestion = () => {
    if (quiz.selectedOption === null) return;

    const isCorrect = quiz.selectedOption === QUIZ_QUESTIONS[quiz.currentQuestion].correct;
    const nextScore = isCorrect ? quiz.score + 1 : quiz.score;
    const nextQuestion = quiz.currentQuestion + 1;

    if (nextQuestion >= QUIZ_QUESTIONS.length) {
      setQuiz(prev => ({
        ...prev,
        score: nextScore,
        completed: true
      }));
    } else {
      setQuiz({
        currentQuestion: nextQuestion,
        selectedOption: null,
        score: nextScore,
        completed: false
      });
    }
  };

  const resetQuiz = () => {
    setQuiz({
      currentQuestion: 0,
      selectedOption: null,
      score: 0,
      completed: false
    });
    setQuizStarted(false);
  };

  // Percent calculation
  const totalChecked = Object.values(completedObjectives).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((totalChecked / 8) * 100)); // normalized to 8 major goals

  return (
    <div className="space-y-8 pb-12 text-left" id="curriculum-portal-viewport">
      
      {I18N_AND_INSTRUCTIONAL_ANALYSIS_MARKDOWN}

      {/* Hero Header Section */}
      <div className="bg-black border border-white/10 p-6 md:p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6" id="curriculum-welcome-banner">
        <div className="space-y-3 z-10">
          <div className="flex flex-wrap gap-2.5 items-center">
            <span className="px-2.5 py-0.5 bg-cyan-400 text-black text-[9px] font-black tracking-widest uppercase rounded shadow-[0_0_12px_rgba(34,211,238,0.4)]">
              INSTRUCTIONAL DESIGN SYLLABUS
            </span>
            <span className="px-2 py-0.5 border border-white/20 text-white text-[9px] font-mono tracking-wider bg-black/40 rounded-sm">
              TARGET: GEN-Z GAMERS
            </span>
            <span className="px-2 py-0.5 bg-indigo-900 border border-indigo-700 text-indigo-200 text-[9px] font-mono tracking-wider rounded-sm">
              LEVEL: PROFESSIONAL PROFICIENCY
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-[0.95] text-white">
            EGAMING TECHNIQUES & <br />
            <span className="text-transparent text-outline-cyan block mt-1 font-sans">
              AI CO-TACTIC TOOLS
            </span>
          </h1>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed uppercase tracking-wider font-bold">
            An advanced, research-validated instructional blueprint co-authored by esports pedagogical experts. Master live telemetry extraction API flows, build simulated opponent counter-play pick draft trees, and optimize real-time reflex hardware.
          </p>
        </div>
        
        {/* Interactive progress circles */}
        <div className="shrink-0 bg-slate-900/85 backdrop-blur-md p-4 border border-white/10 rounded-xl flex items-center gap-4 z-10" id="curriculum-pacing-tracker">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" fill="transparent" stroke="#1e293b" strokeWidth="4" />
              <circle cx="32" cy="32" r="28" fill="transparent" stroke="#22d3ee" strokeWidth="4" 
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - progressPercent / 100)}
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              />
            </svg>
            <span className="absolute text-xs font-mono font-black text-cyan-400">{progressPercent}%</span>
          </div>
          <div>
            <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-widest font-bold">ACQUISITION SCORE</span>
            <span className="text-xs font-bold font-mono text-white uppercase block leading-none mt-1">CURRICULUM MAPPED</span>
            <span className="text-[10px] text-cyan-400 font-bold block mt-1">{totalChecked} / 8 OBJECTIVES ACED</span>
          </div>
        </div>

        {/* Backdrop decorative block lines */}
        <div className="absolute -bottom-10 -right-20 text-[200px] font-black text-white/[0.015] leading-none select-none pointer-events-none">
          EDUCATE
        </div>
      </div>

      {/* Main Grid: Modules Navigator & Strategy Toolbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="curriculum-interactive-grid">
        
        {/* LEFT COLUMN: Modules Accordion/Explorer (Span 7) */}
        <div className="lg:col-span-7 space-y-6" id="curriculum-modules-column">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5" id="modules-browser-box">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
              <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-widest font-mono flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                <span>ACTIVE SYLLABUS GATEWAY ({MODULES_DATA.length} MODULES)</span>
              </h3>
              <span className="text-[10px] font-mono text-zinc-400 bg-black/60 px-2 py-1 border border-white/10 rounded">
                ECTS CREDITS: 6
              </span>
            </div>

            {/* Modules Horizontal Pills */}
            <div className="flex flex-wrap gap-2 mb-6" id="module-selector-tabs">
              {MODULES_DATA.map((mod) => {
                const isSelected = selectedModule.id === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setSelectedModule(mod);
                      setActiveModuleTab('objectives');
                    }}
                    className={`px-3 py-2 text-left transition rounded flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 text-white font-black shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                        : 'bg-black/40 border-white/15 text-slate-400 hover:text-slate-200 hover:bg-black/60'
                    }`}
                  >
                    <span className={`text-[9px] font-mono uppercase ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`}>0{mod.id.split('-')[1]}</span>
                    <span className="text-[10px] uppercase font-bold tracking-tight">{mod.title.split(' ')[0]} {mod.title.split(' ')[1] || ""}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Module Detail Pane */}
            <div className="bg-black/80 rounded-xl p-5 border border-white/10 relative" id="selected-module-pane">
              
              {/* Background decorative absolute icon */}
              <div className="absolute right-4 top-4 opacity-5 pointer-events-none select-none">
                {selectedModule.bgIcon}
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 bg-indigo-900 border border-indigo-700 text-indigo-300 text-[9px] font-bold tracking-widest uppercase font-mono rounded">
                    {selectedModule.number}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    CONTACT DURATION: {selectedModule.duration}
                  </span>
                </div>

                <h3 className="text-lg font-black tracking-tight uppercase text-white leading-tight">
                  {selectedModule.title}
                </h3>
                <p className="text-xs text-cyan-400 font-medium italic">
                  &ldquo;{selectedModule.subtitle}&rdquo;
                </p>

                <p className="text-xs text-zinc-400 leading-relaxed uppercase tracking-wide bg-slate-950 p-3 border border-white/5 rounded-lg">
                  <span className="font-bold text-slate-350 block text-[10px] text-cyan-400 font-mono mb-1 uppercase">MODULE PEDAGOGICAL RATIONALE</span>
                  {selectedModule.rationale}
                </p>
              </div>

              {/* Sub tabs inside the module */}
              <div className="mt-6 border-b border-white/5 flex gap-1 text-[11px] font-mono" id="sub-module-nav-tabs">
                <button
                  onClick={() => setActiveModuleTab('objectives')}
                  className={`px-3 py-2 border-b-2 transition ${
                    activeModuleTab === 'objectives' ? 'border-cyan-400 text-cyan-400 font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  LEARNING OUTCOMES
                </button>
                <button
                  onClick={() => setActiveModuleTab('topics')}
                  className={`px-3 py-2 border-b-2 transition ${
                    activeModuleTab === 'topics' ? 'border-cyan-400 text-cyan-400 font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  CURRICULUM TOPICS
                </button>
                <button
                  onClick={() => setActiveModuleTab('activities')}
                  className={`px-3 py-2 border-b-2 transition ${
                    activeModuleTab === 'activities' ? 'border-cyan-400 text-cyan-400 font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  SUGGESTED ACTIVITES
                </button>
                <button
                  onClick={() => setActiveModuleTab('assessments')}
                  className={`px-3 py-2 border-b-2 transition ${
                    activeModuleTab === 'assessments' ? 'border-cyan-400 text-cyan-400 font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  EVALUATIONS (GRADES)
                </button>
              </div>

              {/* Inner Sub Tab rendering Content */}
              <div className="mt-4 min-h-[140px] text-xs leading-relaxed" id="sub-module-content">
                
                {activeModuleTab === 'objectives' && (
                  <div className="space-y-3">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">MEASURABLE STUDENT ACTION OUTCOMES:</p>
                    {selectedModule.learningObjectives.map((obj, oIdx) => {
                      const isChecked = !!completedObjectives[obj];
                      return (
                        <div 
                          key={oIdx} 
                          onClick={() => handleToggleObjective(obj)}
                          className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                            isChecked 
                              ? 'bg-cyan-950/20 border-cyan-500/30 text-white' 
                              : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-white/10'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-cyan-400 border-cyan-400' : 'border-zinc-500'
                          }`}>
                            {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                          </div>
                          <div>
                            <span className={`font-mono text-[10px] ${isChecked ? 'text-cyan-400 font-bold' : 'text-zinc-500'}`}>GOAL 0X{oIdx+1}:</span>
                            <p className="text-xs tracking-wide uppercase font-medium mt-0.5">{obj}</p>
                          </div>
                        </div>
                      );
                    })}
                    <p className="text-[9px] text-zinc-500 italic mt-1 font-mono uppercase">* CLICK ANY GOAL CARD TO MARK IN YOUR MINDMAP PORTFOLIO AS ACED OR UNDER REVIEW.</p>
                  </div>
                )}

                {activeModuleTab === 'topics' && (
                  <div className="space-y-3">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">KEY SYLLABUS TOPICS COVERED:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedModule.keyTopics.map((topic, tIdx) => (
                        <div key={tIdx} className="p-3 bg-zinc-900/60 border border-white/5 rounded-lg flex gap-2">
                          <span className="text-cyan-400 font-mono text-xs">#{tIdx+1}</span>
                          <span className="font-mono text-[10px] tracking-wide uppercase font-bold text-slate-300">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeModuleTab === 'activities' && (
                  <div className="space-y-3">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">INNOVATIVE COACTIVE LAB CHALLENGES:</p>
                    <div className="space-y-2">
                      {selectedModule.suggestedActivities.map((act, aIdx) => (
                        <div key={aIdx} className="p-3.5 bg-zinc-950 border border-white/10 rounded-lg flex flex-col md:flex-row justify-between gap-3 items-start md:items-center">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-400/30 rounded font-black uppercase tracking-wider">
                              {act.type}
                            </span>
                            <span className="font-extrabold text-xs text-white block uppercase tracking-tight">{act.name}</span>
                            <p className="text-[11px] text-zinc-400">{act.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeModuleTab === 'assessments' && (
                  <div className="space-y-3">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">EVALUATION METRICS & COURSE WORK VALUE:</p>
                    <div className="space-y-2">
                      {selectedModule.assessmentMethods.map((ass, assIdx) => {
                        const isSummative = ass.toLowerCase().includes('summative');
                        return (
                          <div key={assIdx} className="p-3 bg-zinc-900/40 border border-white/5 rounded-lg flex items-start gap-2.5">
                            <span className={`px-1.5 py-0.5 font-mono text-[9px] font-black rounded ${
                              isSummative ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/25'
                            }`}>
                              {isSummative ? 'SUMMATIVE' : 'FORMATIVE'}
                            </span>
                            <p className="text-[11px] text-slate-200 uppercase font-mono tracking-wider">{ass}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* Biometrics and Digital Portfolio Integrator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5" id="biometrics-portfolio-card">
            <div className="flex gap-4.5 items-start">
              <div className="p-3 rounded-lg bg-teal-500/10 text-teal-400">
                <Laptop className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold font-mono text-teal-400 uppercase tracking-widest">DIGITAL TWIN BIOTECH PORTFOLIO</span>
                  <span className="px-1.5 py-0.2 bg-emerald-900 border border-emerald-700 text-emerald-200 text-[8px] font-mono rounded">API READY</span>
                </div>
                <h4 className="font-extrabold text-xs text-white uppercase tracking-tight">MINT SECURE WEB3 GRADUATION PROOFS</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed uppercase tracking-wide">
                  Completing each module's final assessments immediately mints cryptographic NFT credentials straight to your dynamic wallet. Showcase live performance telemetry benchmarks, fast reaction latency ratings, and certified team strategy mapping blueprints.
                </p>
                <div className="pt-2">
                  <a href="#welcome-banner" className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-teal-400 hover:underline hover:text-white uppercase">
                    <span>Audit dynamic smart-contract wallet</span>
                    <ExternalLink className="w-3 h-3 text-teal-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Generative Co-Tactic Tool Simulator & Practice Quizzes (Span 5) */}
        <div className="lg:col-span-5 space-y-6" id="curriculum-interactive-tools">
          
          {/* S1: Dynamic Generative Co-Tactic Prompt Engine */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left" id="co-tactic-prompt-simulator">
            <div className="space-y-1 mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#22d3ee] text-black text-[9px] font-black tracking-widest uppercase">INTERACTIVE DEMO</span>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">AI CO-TACTIC PROMPTER</span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Simulate tactical gameplay analytics & meta drafts directly with AI prompts</p>
            </div>

            {/* Quick Templates Buttons */}
            <div className="mb-4">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 font-bold">Syllabus Template Scenarios:</span>
              <div className="flex flex-col gap-1.5">
                {PROMPT_TEMPLATES.map((tpl, tIdx) => (
                  <button
                    key={tIdx}
                    onClick={() => fillPromptFromTemplate(tpl)}
                    className="p-2 text-left bg-black hover:bg-zinc-900/80 border border-white/10 rounded font-mono text-[9.5px] text-zinc-300 hover:text-white transition flex items-center justify-between gap-2"
                  >
                    <span className="truncate max-w-[200px] uppercase">{tpl.name}</span>
                    <span className="text-[8px] bg-cyan-950/60 text-cyan-400 px-1.5 py-0.5 tracking-wider rounded border border-cyan-400/20">{tpl.game}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              
              {/* Game select row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase tracking-wide block mb-1">Target Esports Title:</label>
                  <select
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="w-full bg-black border border-white/15 p-2 rounded text-[10px] uppercase text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Valorant">Valorant (Tactical FPS)</option>
                    <option value="League of Legends">League of Legends (MOBA)</option>
                    <option value="Rocket League">Rocket League (Aerocars)</option>
                    <option value="Indie Master">Indie Showcase Trial</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase tracking-wide block mb-1">Coach Assistant Protocol:</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-black border border-white/15 p-2 rounded text-[10px] uppercase text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Strategy Draft Optimizer">Draft Pick Optimizer</option>
                    <option value="Aim-Reflex Analyst">Biometrics & aiming Reflex</option>
                    <option value="Opponent Meta Planner">Opponent Counter-Play</option>
                  </select>
                </div>
              </div>

              {/* Input text prompt */}
              <div>
                <label className="text-[9px] text-zinc-500 uppercase tracking-wide block mb-1">Syllabus Practice Co-Tactic Prompt:</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={2}
                  className="w-full bg-black border border-white/15 p-2 rounded text-[10.5px] text-slate-200 placeholder-zinc-700 uppercase focus:outline-none focus:border-cyan-400"
                  placeholder="ENTER TACTICAL PROMPT SCHEMAS..."
                />
              </div>

              {/* Action Button trigger */}
              <button
                onClick={runSimulatedPrompt}
                disabled={isSimulating}
                className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-wider text-[10.5px] rounded transition flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(34,211,238,0.2)]"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-black animate-spin" />
                    <span>EXTRACTING CO-TACTIC DATA MODEL...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                    <span>SIMULATE PROMPT OUTPUT</span>
                  </>
                )}
              </button>

              {/* Simulated Output Log Pane */}
              <div className="bg-black/90 border border-white/10 rounded-lg p-3 min-h-[120px] relative overflow-hidden">
                <div className="absolute top-2 right-2 text-[8px] font-mono text-zinc-650 flex items-center gap-1 select-none">
                  <Terminal className="w-2.5 h-2.5" />
                  <span>AI TERMINAL OUT</span>
                </div>
                
                {simulatedOutput ? (
                  <pre className="text-[9px] text-teal-400 leading-relaxed font-mono whitespace-pre-wrap select-text uppercase pr-4">
                    {simulatedOutput}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center py-6 text-center">
                    <span className="text-[10px] text-zinc-650 font-bold block">LOG IS EMPTY</span>
                    <span className="text-[9px] text-zinc-700 block mt-0.5 uppercase">Select or compose an instruction prompt and run modeling.</span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* S2: Quick Practice Telemetry Quizzes */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left" id="syllabus-quiz-playground">
            <div className="space-y-1 mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[9px] font-black tracking-widest uppercase border border-rose-500/20">
                  REFLEX VERIFICATION TEST
                </span>
                <span className="text-xs font-mono font-bold text-rose-450 uppercase tracking-wider">SYLLABUS QUIZ</span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Validate understanding to progress levels</p>
            </div>

            {!quizStarted ? (
              <div className="text-center py-6 space-y-4" id="quiz-pre-start">
                <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                  <Bookmark className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-white tracking-widest">Syllabus Knowledge Check</h4>
                  <p className="text-[10.5px] text-zinc-400 max-w-xs mx-auto leading-relaxed uppercase tracking-wider font-semibold">
                    ACE 3 SCENARIO QUESTIONS REGARDING TELEMETRY SCRAPING, HRV HEART RATE INDICATORS, AND ML DECISION TREE DRAFT STRUCTURES.
                  </p>
                </div>
                <button
                  onClick={() => setQuizStarted(true)}
                  className="px-5 py-2.5 bg-black border border-white/15 hover:border-cyan-400 text-white hover:text-cyan-400 text-[10px] font-mono font-black uppercase tracking-wider rounded transition-all"
                >
                  START SYLLABUS CHALLENGE
                </button>
              </div>
            ) : quiz.completed ? (
              <div className="text-center py-6 space-y-4" id="quiz-results">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-white tracking-widest">Assessment Completed!</h4>
                  <p className="text-lg font-mono font-bold text-emerald-400">{quiz.score} / {QUIZ_QUESTIONS.length} CORRECT</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wide max-w-xs mx-auto">
                    {quiz.score === QUIZ_QUESTIONS.length 
                      ? "Flawless score! Cryptographic certification badge unlocked in system specs dashboard." 
                      : "Syllabus reviewed. You are eligible to retake the testing anytime to achieve complete mastery."}
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={resetQuiz}
                    className="px-4 py-2 bg-black border border-white/10 text-zinc-400 text-[9.5px] uppercase tracking-wide font-mono hover:text-white"
                  >
                    RESET TRIAL
                  </button>
                  <button
                    onClick={() => {
                      // Trigger visual XP booster mock or similar
                      resetQuiz();
                    }}
                    className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black text-[9.5px] font-black uppercase tracking-wide"
                  >
                    MINT BADGE PROOF
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4" id="active-quiz-flow">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase">
                  <span>SCENARIO {quiz.currentQuestion + 1} OF {QUIZ_QUESTIONS.length}</span>
                  <span className="text-cyan-400 font-bold">SCORE: {quiz.score} CORRECT</span>
                </div>

                <div className="w-full bg-zinc-900 h-1 rounded overflow-hidden">
                  <div 
                    className="bg-rose-400 h-full transition-all"
                    style={{ width: `${((quiz.currentQuestion) / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>

                <p className="text-xs text-white font-extrabold uppercase leading-relaxed tracking-wider">
                  {QUIZ_QUESTIONS[quiz.currentQuestion].text}
                </p>

                <div className="space-y-2">
                  {QUIZ_QUESTIONS[quiz.currentQuestion].options.map((opt, optIdx) => {
                    const isSelected = quiz.selectedOption === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleOptionSelect(optIdx)}
                        className={`w-full text-left p-2.5 rounded transition font-mono text-[10px] uppercase border ${
                          isSelected
                            ? 'bg-rose-950/20 border-rose-500 text-white font-bold'
                            : 'bg-black hover:bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-zinc-500 font-black mr-2">0{optIdx + 1}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quiz.selectedOption !== null && (
                  <div className="p-3 bg-black/60 border border-white/5 rounded-lg text-[9.5px] uppercase font-mono text-cyan-400 tracking-wide">
                    <span className="font-bold underline text-cyan-500 block mb-0.5">SYLLABUS FOCUS DEPICTION:</span>
                    {QUIZ_QUESTIONS[quiz.currentQuestion].explanation}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleNextQuestion}
                    disabled={quiz.selectedOption === null}
                    className="w-full py-2 bg-white text-black hover:bg-cyan-400 hover:text-black font-black uppercase text-xs rounded transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>NEXT SCENARIO</span>
                    <PlayCircle className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

// Injected static design documentation for E-gaming & AI instructional framework
const I18N_AND_INSTRUCTIONAL_ANALYSIS_MARKDOWN = (
  <div className="bg-slate-900/60 border border-white/10 p-5 rounded-2xl text-left text-xs text-zinc-300 leading-relaxed font-sans" id="instruction-design-document-capsule">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
      <span className="font-mono font-bold tracking-widest text-cyan-400 uppercase text-[10px]">PEDAGOGICAL CORE SPECIFICATION DOCS</span>
    </div>
    
    <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono border-b border-white/5 pb-2 mb-3">
      SYSTEM ANALYSIS & CURRICULAR MAPPING FRAMEWORK
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2" id="instructional-design-scroll">
      <div>
        <h5 className="font-extrabold text-white uppercase text-[10px] mb-1">1. RELEVANCE TO AUDIENCE</h5>
        <p className="text-[10.5px] uppercase text-zinc-400 font-medium">
          GenZ gamers seek immediate, data-backed proof of competitive growth. Bridging high-tier egaming mechanics with generative AI training assets directly optimizes their self-curated, skill-acquisition routines.
        </p>
      </div>

      <div>
        <h5 className="font-extrabold text-white uppercase text-[10px] mb-1">2. LEARNING OUTCOMES</h5>
        <p className="text-[10.5px] uppercase text-zinc-400 font-medium">
          Graduates must prove proficiency in three vector outcomes: telemetry data manipulation via API triggers, prompt-driven competitive scouting drafting, and biomarker feedback tracking.
        </p>
      </div>

      <div>
        <h5 className="font-extrabold text-white uppercase text-[10px] mb-1">3. TARGET AUDIENCE PROFILE</h5>
        <p className="text-[10.5px] uppercase text-zinc-400 font-medium font-mono text-zinc-500">
          - Age Bracket: GenZ (14-26 years under active academic enrollment)<br />
          - Primary Driver: Decentralized Esports validation, immediate loop feedback<br />
          - Key Challenges: Cognitive oversaturation, aim accuracy plateaus, team coordination friction
        </p>
      </div>

      <div>
        <h5 className="font-extrabold text-white uppercase text-[10px] mb-1">4. INSTRUCTIONAL STRATEGIES</h5>
        <p className="text-[10.5px] uppercase text-zinc-400 font-medium">
          - Experiential Sandbox Playgrounds: direct interaction with live AI prompts<br />
          - Micro-Dose Telemetry Interval Drills: focusing on granular reflex targets<br />
          - Crisis-Scouting Simulation Labs: testing decision drafting under match pressure.
        </p>
      </div>

      <div>
        <h5 className="font-extrabold text-white uppercase text-[10px] mb-1">5. INNOVATIVE TRAINING TECH</h5>
        <p className="text-[10.5px] uppercase text-zinc-400 font-medium">
          - Interactive AI Co-Tactical Prompter mimicking modern competitive coaching engines<br />
          - Real-Time HRV calibration breathing modules paired with custom web animations.
        </p>
      </div>

      <div>
        <h5 className="font-extrabold text-white uppercase text-[10px] mb-1">6. ACCESSIBILITY & STYLES</h5>
        <p className="text-[10.5px] uppercase text-zinc-400 font-medium">
          Highly responsive visual contrast levels compliant with WCAG AAA design paradigms. Staggered typographic hierarchies utilize Inter and JetBrains Mono fonts for enhanced text legibility and cognitive scanning ease.
        </p>
      </div>

      <div>
        <h5 className="font-extrabold text-white uppercase text-[10px] mb-1">7. EVALUATION SCENARIOS</h5>
        <p className="text-[10.5px] uppercase text-zinc-400 font-medium">
          Formative: interactive telemetry extraction puzzles & scenario validation checks.<br />
          Summative: verified final performance badge minting on completing all strategic prompts of the platform.
        </p>
      </div>

      <div>
        <h5 className="font-extrabold text-white uppercase text-[10px] mb-1">8. REAL-WORLD OUTLET</h5>
        <p className="text-[10.5px] uppercase text-zinc-400 font-medium">
          Students acquire professional certification credits and telemetry scraping expertise suitable for direct entry into junior esports analytics or community coaching careers.
        </p>
      </div>
    </div>
  </div>
);
