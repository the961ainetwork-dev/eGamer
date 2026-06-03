import React, { useState } from 'react';
import { Course, QuizQuestion } from '../types';
import { 
  BookOpen, 
  Star, 
  Award, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  GraduationCap,
  Play,
  Terminal,
  Code,
  RotateCcw
} from 'lucide-react';

interface CuratedLesson {
  title: string;
  subtitle: string;
  content: string;
  blueprintTitle?: string;
  language?: 'cpp' | 'cs' | 'glsl' | 'js';
  codeSnippet?: string;
  execOutput?: string;
}

const CURATED_LESSONS: Record<string, CuratedLesson[]> = {
  "c_strategy_1": [
    {
      title: "Angle Offsets and Point-of-View Mathematics",
      subtitle: "FPS Sightlines & Coordinate Positioning",
      content: "Sightline advantage in tactical shooters is calculated via perspective geometry. When hugging close cover, an opponent positioning further back is able to resolve your player mesh several frame ticks before you can notice theirs. Learn to calculate optimal cover margins to secure sightline superiority.",
      blueprintTitle: "Perspective Coverage Raycaster",
      language: "cpp",
      codeSnippet: `// Calculated coverage offsets in C++\n#include <iostream>\n#include <cmath>\n\nbool calculate_cover_advantage(float d_p1, float d_p2, float angle_deg) {\n    float angle_rad = angle_deg * (3.14159f / 180.0f);\n    float p1_visibility = d_p1 * std::cos(angle_rad);\n    float p2_visibility = d_p2 * std::cos(angle_rad);\n    return p1_visibility > p2_visibility; // Return true if Player 1 is exposed first\n}\n\nint main() {\n    std::cout << "[VERDICT] Proximity factor analysis ready." << std::endl;\n    return 0;\n}`,
      execOutput: `[SIMULATOR] Initiating Cover Collision Tracing...\nPlayer1 (Cover Distance: 1.2m) | Player2 (Cover Distance: 4.5m)\nPeeking trajectory: 42° vertical slope\nVerdict: PLAYER 1 EXPOSED first due to proximity shadow disadvantage.`
    },
    {
      title: "Reaction Reflex Adjustments on Latency Snaps",
      subtitle: "Mitigating Peeking Latency Delays",
      content: "Human reflex operates with a native delay of around 180ms. Combined with an internet transmission latency of 30-50ms, a peeking defender needs wider coordinates to align their target acquisition. Discover how to mathematically offset crosshairs to achieve perfect snaps.",
      blueprintTitle: "Sight Margin Offset Calculator",
      language: "cs",
      codeSnippet: `// Adjust crosshair width in C#\npublic class ReflexOffset {\n    public static float ComputePerfectCrosshairWidth(float pingMs, float standardDpi) {\n        float lagFactor = pingMs / 1000f;\n        return (lagFactor * 0.45f) + (standardDpi / 2000f);\n    }\n}`,
      execOutput: `[SIMULATOR] Optimizing snap multipliers...\nPing: 45ms | Base DPI: 800\nOptimum crosshair center gap index: 0.420 units.\nRecommended setup: Aim wide by 1.2 coordinate steps.`
    }
  ],
  "c_gamedev_2": [
    {
      title: "Client-Side Movement Prediction Loops",
      subtitle: "Securing Zero-Latency Visual Flow",
      content: "In online matches, waiting for server responses before rendering local avatar steps introduces severe game delays. To solve this, developers run client-prediction loops: movement is processed immediately on local thread coordinate buffers and reconciled with server update frames subsequently.",
      blueprintTitle: "Godot Movement Prediction Solver",
      language: "cs",
      codeSnippet: `// Predict position locally in Godot/C#\nusing Godot;\n\npublic class LocalPredictor : CharacterBody3D {\n    public void PredictMovement(Vector3 inputs, float delta) {\n        Vector3 predictedVelocity = inputs * 15.3f;\n        GlobalPosition += predictedVelocity * delta;\n        QueueHistorySnapshot(GlobalPosition);\n    }\n}`,
      execOutput: `[SIMULATOR] Simulating client keyboard inputs [W, D]...\nFrame step tick #1201 | Predicted coordinates: X=45.21, Y=0.00, Z=12.98\nAuthorized input instantly. Latency perceived: 0ms.`
    },
    {
      title: "Deterministic Frame Synchronization Protocols",
      subtitle: "Enforcing Physics Verification in Godot Engine 4",
      content: "To build bulletproof competitive simulations, clients must run deterministic frames. If physics tick updates ever differ between a specific user device and the main server system, the server immediately forces a rollback, correcting coordinate discrepancies smoothly.",
      blueprintTitle: "RigidBody Synchronizer Handshake",
      language: "cpp",
      codeSnippet: `// C++ Physics Syncer Handshake\n#include <iostream>\n\nbool run_physics_checksum(unsigned int client_crc, unsigned int server_crc) {\n    if (client_crc != server_crc) {\n        std::cout << "[WARN] Physics divergence! Correcting state variables..." << std::endl;\n        return false;\n    }\n    return true;\n}`,
      execOutput: `[SIMULATOR] Checking CRC checksum for Frame #984...\nClient Checksum: 0x8A7F4D3C | Server Auth: 0x8A7F4D3C\nSync verified. No physics divergence observed.`
    }
  ],
  "c_gamedev_physics": [
    {
      title: "Continuous Collision Detection (CCD) Algebra",
      subtitle: "Reverse-Engineering Collision Tunneling",
      content: "When reverse engineering fast projectiles in competitive games, standard discrete collision calculations (checking overlapping coordinates each tick) fail because high-velocity objects (like bullet lines or Rocket League aerodynamic touches) can teleport past obstacle bounds between frames (tunneling). Sub-pixel continuous collision detection solves this by projecting vector interpolation rays from the previous frame to the new coordinate tick.",
      blueprintTitle: "Continuous Raycast Tunnel Solver",
      language: "cpp",
      codeSnippet: `// Sweep continuous vector ray path in C++\n#include <iostream>\n#include <cmath>\n\nbool check_ccd_tunnel(float x_prev, float x_curr, float x_wall) {\n    // If bullet swept across the wall threshold in a single tick, it is a hit!\n    return (x_prev < x_wall && x_curr > x_wall);\n}\n\nint main() {\n    float prev = 2.45f;  // previous tick\n    float curr = 18.22f; // current tick\n    float wall = 8.50f;  // wall barrier placement\n    std::cout << "Tunnel check is: " << (check_ccd_tunnel(prev, curr, wall) ? "TRUE" : "FALSE") << std::endl;\n}`,
      execOutput: `[SIMULATOR] Compiling C++ continuous ray tracer...\nProjectile frame trajectory traced: [x=2.45m] to [x=18.22m].\nWall boundary intersection detected at exactly [x=8.50m].\nTriggered hit response routine! Mesh tunneling successfully prevented.`
    },
    {
      title: "Restitution Vectors and Field Bounce Angles",
      subtitle: "The Math and Ballistics Behind Field Rebounds",
      content: "In competitive gravity arenas (like Rocket League), rebounds are computed by reflecting incident vectors over the normal vector of the collision plane. Sub-pixel precision ensures rigid bouncing kinetics are fully deterministic.",
      blueprintTitle: "Impulse Restitution Reflector",
      language: "cpp",
      codeSnippet: `// Vector rebound calculation in C++\n#include <iostream>\n\nstruct Vec2 { float x, y; };\n\nVec2 compute_rebound(Vec2 v_in, Vec2 normal, float coe_elasticity) {\n    float dot = v_in.x * normal.x + v_in.y * normal.y;\n    Vec2 v_out = {\n        (v_in.x - 2.0f * dot * normal.x) * coe_elasticity,\n        (v_in.y - 2.0f * dot * normal.y) * coe_elasticity\n    };\n    return v_out;\n}`,
      execOutput: `[SIMULATOR] Launching Sphere reflection model...\nIncoming Velocity: X=12.4m/s, Y=-9.8m/s\nSurface Normal Vector: X=0.0, Y=1.0 (Horizontal floor)\nRestitution applied: 0.90\nRebound result: Velocity outward = X=12.4m/s, Y=8.82m/s.`
    },
    {
      title: "Quadratic Ballistics under Atmospheric Drag",
      subtitle: "Simulating Trajectories in High-Reflex Lobbies",
      content: "Esports projectile drops require quadratic physics solvers. Gravity accelerates the asset downward, while atmospheric drag dampens speed proportional to the velocity squared. Master C# algorithms that map flight curvatures dynamically.",
      blueprintTitle: "Aerodynamic Ballistic Solver",
      language: "cs",
      codeSnippet: `// C# Projectile Drop with Drag Resistance\nusing System;\n\npublic class Ballistics {\n    public static void SimulateTick(ref float posX, ref float posY, ref float velX, ref float velY, float drag, float dt) {\n        velY -= 9.81f * dt; // gravity deceleration\n        velX -= velX * drag * dt; // air drag on X\n        velY -= velY * drag * dt; // air drag on Y\n        posX += velX * dt;\n        posY += velY * dt;\n    }\n}`,
      execOutput: `[SIMULATOR] Simulating 10 sub-ticks of ballistic travel...\nInitial Launch Velocity: 45.0 m/s at 25° angle.\nAir Drag Coefficient: 0.05\nStep #10: Coordinates reached X=38.4m, Y=12.2m | Velocity scaled to 36.2 m/s.`
    }
  ],
  "c_gamedev_netcode": [
    {
      title: "Server-Side Rolling Snapshot Registers",
      subtitle: "Rewinding Opponents Back to Account for Latency",
      content: "To evaluate if a client's hitscan coordinates connected, competitive netcode registers character snapshots in circular rolling queues. This permits C# and C++ servers to backtrack the target coordinate maps to find their exact coordinates when the player pulled the trigger.",
      blueprintTitle: "Server Hitbox Backtracking Queue",
      language: "cs",
      codeSnippet: `// C# Circular Frame Backtrack\nusing System;\nusing System.Collections.Generic;\n\npublic class NetHistoryQueue {\n    public struct Snapshot { public uint tickId; public float positionY; }\n    public static Snapshot GetRewoundTarget(List<Snapshot> archive, uint targetTick) {\n        return archive.Find(s => s.tickId == targetTick);\n    }\n}`,
      execOutput: `[SIMULATOR] Rewinding server coordinates to Match Client Firing clock...\nTarget tick logged: #45120 | Server Current Tick: #45125 (Delay: 5 ticks - 40ms)\nRetrieved archived coordinate snapshot: Position Y = 14.15m.\nRaycast Check outcome: COLLISION VERIFIED! Hitscan registered.`
    },
    {
      title: "Hermite Packet Jitter Interpolators",
      subtitle: "Polishing Visual Translation Between Ticks",
      content: "Packet delay jitter causes rendering stutter. Competitive netcode buffers incoming coordinates, performing hermit linear or cubic interpolation (lerping) smoothly across known snapshot variables to render butter-smooth coordinate steps.",
      blueprintTitle: "Smooth Hermite Interpolator",
      language: "cs",
      codeSnippet: `// C# Lerp coordinate smoothing\npublic class Interpolator {\n    public static float HermiteLerp(float y_start, float y_end, float alpha) {\n        float smoothAlpha = alpha * alpha * (3.0f - 2.0f * alpha);\n        return y_start + (y_end - y_start) * smoothAlpha;\n    }\n}`,
      execOutput: `[SIMULATOR] Initializing packet coordinate interpolater...\nPacket A Y=12.0m | Packet B Y=12.8m | Progress Alpha: 0.50\nOutput position: 12.40m smoothly interpolated. Jitter coefficient resolved to 0.00%.`
    },
    {
      title: "Determinism & Anticheat Memory Encryption",
      subtitle: "Securing System Variables against Injection Vector Tampering",
      content: "Competitive integrity requires shielding RAM coordinates from cheat software. Prevent coordinate spoofing and float manipulation by encoding visual coordinates with salt keys during physics processing ticks.",
      blueprintTitle: "C++ Memory Spoof Protection",
      language: "cpp",
      codeSnippet: `// C++ Memory Encryption wrapper\n#include <iostream>\n\nclass EncryptedFloat {\nprivate:\n    unsigned int salt_key;\n    unsigned int obfuscated_bits;\npublic:\n    EncryptedFloat(float val, unsigned int salt) : salt_key(salt) {\n        union { float f; unsigned int i; } conv;\n        conv.f = val;\n        obfuscated_bits = conv.i ^ salt_key;\n    }\n};`,
      execOutput: `[SIMULATOR] Mocking memory inspection tools...\nEncrypted value: x=15.0m with salt security code #DEADBEEF\nRaw Memory state scanned: 0x3F2A0D4B (Gibberish representation blocks cheat injection!)\nDecrypted read value on physics thread: 15.0m. Zero runtime overhead.`
    }
  ],
  "c_gamedev_assets": [
    {
      title: "Curvature Surface Vector Projection",
      subtitle: "Baking High-Poly sculpted details into Normal Map Textures",
      content: "To support high FPS limits of e-sports, full 3D sculpts are projected onto low-poly meshes. We measure coordinates and normal vector differences between high-res and low-res assets, compressing that spacing into RGB arrays. These act as normal maps for the shaders.",
      blueprintTitle: "Tangent-Space Ortho normal map baker",
      language: "glsl",
      codeSnippet: `// GLSL Normal Map Tangent Vector calculations\nvec3 get_tangent_normal(vec3 map_rgb, vec3 t, vec3 b, vec3 n) {\n    vec3 local_normal = map_rgb * 2.0 - 1.0;\n    mat3 tbn_trans = mat3(t, b, n);\n    return normalize(tbn_trans * local_normal);\n}`,
      execOutput: `[SIMULATOR] Baking Normal details with GPU shader threads...\nMeasured 120,400 polygon coordinate surface variables.\nLow-poly geometry updated: 850 triangles | Tangent space map baked successfully.\nVisual depth outcome and shadows preserved perfectly at 0.05% geometry cost.`
    },
    {
      title: "Frustum Clipping and Camera Viewport projection",
      subtitle: "Eliminating Off-Screen polygon rendering cycles",
      content: "Esports graphic engines must never waste cycles drawing off-screen actors. We implement frustum clipping: determining if the model's bounding box coordinate lies entirely within the camera's visual projection bounds.",
      blueprintTitle: "Viewport Frustum Culling Sweep",
      language: "cpp",
      codeSnippet: `// C++ Viewport Plane clipping\n#include <iostream>\n\nbool is_inside_frustum(float bounding_radius, float distance_to_camera, float fov_deg) {\n    float half_frustum_height = distance_to_camera * std::tan(fov_deg * 0.5f * (3.14f / 180.0f));\n    return bounding_radius < half_frustum_height;\n}`,
      execOutput: `[SIMULATOR] Camera panning coordinates swipe [fov=90°]...\nActor #12 (Radius: 2.5m, Distance: 15.2m) is within frustum boundaries: YES\nActor #13 (Radius: 1.0m, Distance: 8.5m) is within frustum boundaries: NO (Pruned from shaders).`
    }
  ]
};

const getLessonContent = (courseId: string, index: number, courseTitle: string, courseCategory: string): CuratedLesson => {
  const curated = CURATED_LESSONS[courseId];
  if (curated && curated[index]) {
    return curated[index];
  }
  
  // Dynamic fallback mapping
  const unitNum = index + 1;
  return {
    title: `Unit ${unitNum}: Applied Competitive Analysis`,
    subtitle: `Laboratory exercise for ${courseTitle}`,
    content: `In this unit of the ${courseCategory} track, candidates build on top of previous milestones. You will examine telemetry variables, coordinate indices, and performance frameworks corresponding to "${courseTitle}". Complete this unit walkthrough to clear upcoming assessment questions.`,
    blueprintTitle: `${courseTitle} Workspace Sandbox`,
    language: "cs",
    codeSnippet: `// Lesson Unit ${unitNum} Blueprint template\nusing System;\n\npublic class DiagnosticSolver {\n    public static void RunDiagnostic() {\n        Console.WriteLine("Executing diagnostic testbed for category: ${courseCategory}...");\n    }\n}`,
    execOutput: `[EMULATOR] Workspace compiled successfully.\nRunning structural diagnostics for "${courseTitle}"...\nTests passed: 20/20 | System State: ROBUST.`
  };
};

interface AcademyLMSProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
  xp: number;
  setXp: (xp: number) => void;
}

export default function AcademyLMS({
  courses,
  setCourses,
  walletBalance,
  setWalletBalance,
  xp,
  setXp
}: AcademyLMSProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("c_strategy_1");
  const [activeQuizQuestionIdx, setActiveQuizQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [activeLessonIdx, setActiveLessonIdx] = useState<number>(0);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Compiler simulation states
  const [isSimulatingUnit, setIsSimulatingUnit] = useState<boolean>(false);
  const [simulatedUnitLog, setSimulatedUnitLog] = useState<string>('');

  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const handleBuyCourse = (course: Course) => {
    if (walletBalance < course.price) {
      alert("Insufficient wallet balance to purchase this academy track.");
      return;
    }

    const updated = courses.map(c => {
      if (c.id === course.id) {
        return { ...c, enrolled: true, progress: 5 };
      }
      return c;
    });

    setCourses(updated);
    setWalletBalance(walletBalance - course.price);
    alert(`Successfully purchased "${course.title}"! Lessons unlocked.`);
  };

  const handleSelectAnswer = (questionId: string, optionIdx: number) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIdx });
  };

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    
    currentCourse.quizzes.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });

    setQuizScore(score);
    setQuizFinished(true);

    if (score === currentCourse.quizzes.length) {
      // Unlocked badge/certificate!
      const updated = courses.map(c => {
        if (c.id === currentCourse.id) {
          return { ...c, progress: 100, certificateEarned: true };
        }
        return c;
      });
      setCourses(updated);
      setXp(xp + 450); // XP bonus for mastery certificate!
    }
  };

  const resetQuizState = () => {
    setActiveQuizQuestionIdx(0);
    setSelectedAnswers({});
    setQuizFinished(false);
    setQuizScore(0);
  };

  const selectCourseSafely = (id: string) => {
    setSelectedCourseId(id);
    resetQuizState();
    setActiveLessonIdx(0);
    setShowCertificate(false);
    setIsSimulatingUnit(false);
    setSimulatedUnitLog('');
  };

  const selectUnitSafely = (idx: number) => {
    setActiveLessonIdx(idx);
    setIsSimulatingUnit(false);
    setSimulatedUnitLog('');
  };

  const handleNextLesson = () => {
    if (activeLessonIdx < currentCourse.lessonsCount - 1) {
      const nextIdx = activeLessonIdx + 1;
      selectUnitSafely(nextIdx);
      // increment progress
      const nextProgress = Math.min(90, Math.floor((nextIdx / currentCourse.lessonsCount) * 100));
      const updated = courses.map(c => {
        if (c.id === currentCourse.id) {
          return { ...c, progress: nextProgress };
        }
        return c;
      });
      setCourses(updated);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="academy-lms">
      {/* List of active marketplace courses */}
      <div className="lg:col-span-1 space-y-5" id="lms-marketplace-sidebar">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="lms-courses-list-card">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-100">Course Marketplace</h3>
          </div>

          <div className="space-y-4" id="lms-courses-cards">
            {courses.map(c => (
              <div
                key={c.id}
                onClick={() => { setSelectedCourseId(c.id); resetQuizState(); setActiveLessonIdx(0); setShowCertificate(false); }}
                className={`cursor-pointer border rounded-xl p-4 transition-all relative ${
                  selectedCourseId === c.id
                    ? 'bg-indigo-950/30 border-indigo-500'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
                id={`course-selector-${c.id}`}
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-[10px] font-semibold bg-slate-800 border border-slate-700 text-slate-300 font-mono px-2 py-0.5 rounded">
                    {c.category}
                  </span>
                  
                  {c.certificateEarned && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/35 px-1.5 py-0.5 rounded">
                      <Award className="w-3 h-3" />
                      CERTIFIED
                    </span>
                  )}
                </div>

                <h4 className="font-semibold text-sm text-slate-100 line-clamp-2 leading-tight mb-2">
                  {c.title}
                </h4>

                <p className="text-xs text-slate-500 line-clamp-1 mb-3">By {c.instructor}</p>

                {/* Progress bar or fee */}
                <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-slate-800/60 text-slate-400">
                  {c.enrolled ? (
                    <div className="w-full space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span>Track progress:</span>
                        <span className="text-emerald-400 font-bold">{c.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
                        <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${c.progress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="text-indigo-400 text-sm font-bold">${c.price.toFixed(2)}</span>
                      <span className="text-slate-500">{c.duration}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box Academy */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="stats-academy-card">
          <h3 className="font-semibold text-slate-200 text-sm mb-2.5 flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-amber-400" />
            LMS Certification Engine
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Perform assignments, watch lecture guidelines, and pass quizzes with perfect accuracy to mint your platform digital badge. Badges raise player entry priority and lower match fees.
          </p>
          
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between" id="cert-counter">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-indigo-400" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">My Badges Minted</span>
                <span className="text-sm font-bold text-slate-200">
                  {courses.filter(c => c.certificateEarned).length} Completed Certification
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main LMS curriculum details panel */}
      <div className="lg:col-span-2 space-y-6" id="academy-content">
        <div className="bg-slate-900 border border-slate-850 rounded-xl p-6" id="course-frame">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block font-mono">
                {currentCourse.category} Curriculum
              </span>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight mt-1">{currentCourse.title}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Curriculum syllabus curated by <span className="text-indigo-300 font-semibold">{currentCourse.instructor}</span>.
              </p>
            </div>

            {!currentCourse.enrolled && (
              <button
                onClick={() => handleBuyCourse(currentCourse)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-lg text-xs tracking-wide shadow-lg shadow-indigo-600/10 transition"
              >
                Enroll Course for ${currentCourse.price}
              </button>
            )}
          </div>

          {!currentCourse.enrolled ? (
            <div className="p-10 text-center bg-slate-950 rounded-xl border border-dashed border-slate-800" id="locked-course-state">
              <Lock className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-350">LMS Content Locked</h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto mb-6 leading-relaxed">
                Unlock full-stack access to written strategy modules, digital testing quizzes, visual aids, and verified player badges.
              </p>
              <button
                onClick={() => handleBuyCourse(currentCourse)}
                className="bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 px-5 py-2.5 rounded text-xs font-semibold font-mono transition"
              >
                Unlock Lifetime Access (${currentCourse.price})
              </button>
            </div>
          ) : (
            /* ENROLLED / CONTENT VIEW STATE */
            <div className="space-y-6" id="course-active-workbench">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col md:flex-row justify-between gap-4 text-xs font-mono" id="progress-banner">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Lesson:</span>
                  <span className="text-indigo-400 font-bold">{activeLessonIdx + 1} of {currentCourse.lessonsCount}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-500">Skills Focus:</span>
                  <div className="flex flex-wrap gap-1">
                    {currentCourse.skills.map((s, idx) => (
                      <span key={idx} className="bg-slate-900 px-2 py-0.5 rounded text-indigo-300 text-[10px] border border-indigo-905 bg-indigo-950/10 font-mono">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic curriculum layout */}
              {(() => {
                const activeLessonObj = getLessonContent(currentCourse.id, activeLessonIdx, currentCourse.title, currentCourse.category);
                return (
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-5" id="lesson-interactive-readout">
                    <div>
                      <h3 className="text-sm font-semibold text-indigo-300 flex items-center gap-1.5 mb-1">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                        Unit {activeLessonIdx + 1}: {activeLessonObj.title}
                      </h3>
                      <h4 className="text-xs font-medium text-indigo-400/70 font-mono mb-3">{activeLessonObj.subtitle}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activeLessonObj.content}
                      </p>
                    </div>

                    {activeLessonObj.codeSnippet && (
                      <div className="space-y-4 border-t border-slate-900 pt-4" id="project-blueprint-interactive">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Code className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold text-slate-200 font-mono">{activeLessonObj.blueprintTitle || "Competitive Sandbox Script"}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono uppercase">
                            {activeLessonObj.language || "cpp"} Engine Track
                          </span>
                        </div>

                        {/* Code editor mockup */}
                        <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg overflow-hidden font-mono" id="code-snippet-box">
                          <div className="bg-slate-950 px-3 py-1.5 text-[10px] text-slate-500 border-b border-slate-800 flex justify-between items-center">
                            <span>main.{activeLessonObj.language === 'cs' ? 'cs' : activeLessonObj.language === 'glsl' ? 'glsl' : 'cpp'}</span>
                            <span className="text-indigo-400 animate-pulse text-[9px] font-semibold">● BLUEPRINT READY</span>
                          </div>
                          <pre className="p-4 text-[11px] text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed font-mono">
                            <code>{activeLessonObj.codeSnippet}</code>
                          </pre>
                        </div>

                        {/* Interactive local environment execute */}
                        <div className="space-y-3" id="compiler-sandbox">
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setIsSimulatingUnit(true);
                                setSimulatedUnitLog('');
                                setTimeout(() => {
                                  setIsSimulatingUnit(false);
                                  setSimulatedUnitLog(activeLessonObj.execOutput || '');
                                }, 900);
                              }}
                              disabled={isSimulatingUnit}
                              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg px-4 py-2 text-xs font-bold font-mono tracking-wide transition flex items-center gap-2 cursor-pointer"
                            >
                              {isSimulatingUnit ? (
                                <>
                                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                                  COMPILING BLUEPRINT...
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  RUN REVERSE-ENGINEERED SIMULATION
                                </>
                              )}
                            </button>
                            {simulatedUnitLog && (
                              <button
                                onClick={() => setSimulatedUnitLog('')}
                                className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-300 text-xs px-3 py-2 rounded-lg font-mono transition"
                              >
                                Clear Console
                              </button>
                            )}
                          </div>

                          {/* Action Log Output Terminal */}
                          {(isSimulatingUnit || simulatedUnitLog) && (
                            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[10px] leading-relaxed relative overflow-hidden" id="sandbox-log">
                              <div className="absolute top-2 right-2 flex items-center gap-1.5 text-slate-600">
                                <Terminal className="w-3.5 h-3.5" />
                                <span className="text-[9px] uppercase font-bold">Terminal</span>
                              </div>
                              {isSimulatingUnit ? (
                                <div className="space-y-1 text-indigo-400/80">
                                  <p className="animate-pulse">&gt; Loading compiler dependencies...</p>
                                  <p className="animate-pulse">&gt; Executing mathematical vector matrix projection solver...</p>
                                </div>
                              ) : (
                                <div className="space-y-1.5 text-slate-300 text-left">
                                  <div className="text-emerald-400 font-mono font-semibold mb-1">
                                    [SUCCESS] Zero errors. Binary trace execution output:
                                  </div>
                                  <pre className="text-slate-200 font-mono text-[10px] whitespace-pre-wrap leading-relaxed">
                                    {simulatedUnitLog}
                                  </pre>
                                  <div className="text-slate-500 text-[9px] font-mono mt-1 border-t border-slate-900 pt-1 flex justify-between">
                                    <span>RAM allocated: 42 KB</span>
                                    <span>Compiled in: 12ms</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex justify-between items-center border-t border-slate-900/60 pt-4" id="lesson-controllers">
                      <button
                        disabled={activeLessonIdx === 0}
                        onClick={() => selectUnitSafely(Math.max(0, activeLessonIdx - 1))}
                        className="bg-slate-900 border border-slate-800 text-slate-400 rounded px-3 py-1.5 text-xs hover:border-slate-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Previous Unit
                      </button>
                      <button
                        disabled={activeLessonIdx >= currentCourse.lessonsCount - 1}
                        onClick={handleNextLesson}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded px-4 py-1.5 text-xs font-semibold transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Continue Unit
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Quiz Module and Certificate */}
              <div className="border-t border-slate-800 pt-6 space-y-4" id="quiz-anchor">
                <div className="flex justify-between items-center bg-slate-900 border border-slate-800/80 p-4 rounded-xl">
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      Digital Certification Challenge
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Answer syllabus queries perfectly to receive the verified digital credential.
                    </p>
                  </div>

                  {currentCourse.certificateEarned ? (
                    <button
                      onClick={() => setShowCertificate(true)}
                      className="bg-amber-600/95 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                    >
                      View Badge Certificate
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 font-mono">
                      Must complete 100% quiz score
                    </span>
                  )}
                </div>

                {!currentCourse.certificateEarned && (
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-5" id="quiz-interface">
                    <h4 className="text-xs font-semibold text-slate-400 font-mono mb-4 uppercase tracking-wider">
                      Active Seeding Assessment Questionnaire ({currentCourse.quizzes.length} Questions)
                    </h4>

                    {!quizFinished ? (
                      <form onSubmit={handleSubmitQuiz} className="space-y-5">
                        {currentCourse.quizzes.map((q, qIndex) => (
                          <div key={q.id} className="space-y-2" id={`quiz-block-${q.id}`}>
                            <span className="text-xs font-bold text-indigo-400 font-mono">Question {qIndex + 1}:</span>
                            <p className="text-xs text-slate-200 font-semibold">{q.question}</p>
                            
                            <div className="space-y-1.5" id={`quiz-options-${q.id}`}>
                              {q.options.map((opt, oIdx) => (
                                <label
                                  key={oIdx}
                                  className={`flex items-start gap-2.5 p-2.5 rounded border text-xs cursor-pointer transition ${
                                    selectedAnswers[q.id] === oIdx
                                      ? 'bg-indigo-950/20 border-indigo-500 text-indigo-100 font-medium'
                                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-350'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`quiz_q_${q.id}`}
                                    checked={selectedAnswers[q.id] === oIdx}
                                    onChange={() => handleSelectAnswer(q.id, oIdx)}
                                    className="mt-0.5 accent-indigo-600"
                                  />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}

                        <button
                          type="submit"
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded transition uppercase tracking-wide"
                        >
                          Submit Quiz Answers
                        </button>
                      </form>
                    ) : (
                      <div className="text-center py-6 space-y-4" id="quiz-results-card">
                        <div className="flex justify-center">
                          {quizScore === currentCourse.quizzes.length ? (
                            <Award className="w-12 h-12 text-amber-400 animate-bounce" />
                          ) : (
                            <HelpCircle className="w-12 h-12 text-red-400" />
                          )}
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-slate-200">
                            {quizScore === currentCourse.quizzes.length
                              ? "Outstanding! 100% Score Cleared"
                              : "Review Strategy and Try Again"}
                          </h4>
                          <span className="text-xs font-mono text-slate-500 block mt-1">
                            Score Index: {quizScore} / {currentCourse.quizzes.length} Correct
                          </span>
                        </div>

                        {quizScore === currentCourse.quizzes.length ? (
                          <div className="space-y-2">
                            <p className="text-xs text-slate-400">
                              Digital Platform Certificate Minted in your Profile! +450 XP Awarded.
                            </p>
                            <button
                              onClick={() => setShowCertificate(true)}
                              className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 px-4 rounded text-xs transition"
                            >
                              Open Certification Badge
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={resetQuizState}
                            className="bg-slate-800 border border-slate-700 text-slate-300 font-bold py-1.5 px-4 rounded text-xs transition hover:border-slate-600"
                          >
                            Restart Test Attempt
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Retro Certificate Overlay Modal */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="certificate-modal">
          <div className="bg-slate-950 border border-amber-600/60 rounded-xl p-8 max-w-2xl w-full relative shadow-3xl text-center" id="certification-shield">
            {/* Ambient gold glow */}
            <div className="absolute inset-0 border-[3px] border-amber-500/20 m-2 pointer-events-none rounded-lg" />
            
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-xl font-mono"
            >
              ×
            </button>

            <div className="space-y-6 py-8">
              <div className="flex justify-center">
                <Award className="w-16 h-16 text-amber-400 animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="text-amber-500 text-[10px] tracking-[0.25em] font-mono block uppercase">
                  VERIFIED DIGITAL ACCREDITATION
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-slate-100 font-serif">
                  CERTIFICATE of ESPORTS MASTERY
                </h1>
                <p className="text-xs text-slate-500 font-mono">
                  MINT ID: BFY-LMS-{currentCourse.id.toUpperCase()}-2026
                </p>
              </div>

              <div className="max-w-md mx-auto py-3 border-y border-slate-800/80 my-4 text-slate-400 font-serif leading-relaxed text-xs">
                This certifies that the candidate <span className="font-mono text-emerald-400 text-sm font-bold bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded">ApexTactician</span> has successfully cleared the advanced training syllabus, interactive curriculum exercises, and 100% quiz assessment for:
                <span className="block italic text-slate-200 font-extrabold text-sm mt-3">{currentCourse.title}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-slate-500 max-w-sm mx-auto">
                <div className="text-left border-r border-slate-900 pr-4">
                  <span className="block text-slate-400 font-semibold">{currentCourse.instructor}</span>
                  <span>Head of Curriculum</span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-450 font-semibold">Verified on Solana Testnet</span>
                  <span>Authority Google AI Studio</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => { alert("Credential downloaded directly as metadata JSON payload."); }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-5 rounded shadow"
                >
                  Download Verification NFT
                </button>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs py-2 px-5 rounded border border-slate-800"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
