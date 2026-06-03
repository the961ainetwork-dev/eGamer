export interface UserProfile {
  username: string;
  rank: string;
  earnings: number;
  xp: number;
  level: number;
  matchesPlayed: number;
  winRate: number;
  isPremium: 'Free' | 'Pro Player' | 'Elite Academy';
  walletBalance: number;
  freeAgentStatus: boolean;
  avatarSeed: string;
}

export interface MatchDispute {
  matchId: string;
  reportedBy: string;
  reason: string;
  evidenceUrl: string; // Base64 or placeholder
  status: 'pending' | 'resolved';
  createdAt: string;
}

export interface Match {
  id: string;
  round: number;
  teamA: string;
  teamB: string;
  scoreA?: number;
  scoreB?: number;
  winnerId?: string;
  status: 'scheduled' | 'active' | 'completed' | 'disputed';
  time: string;
  disputeReason?: string;
  disputeEvidence?: string;
}

export interface Participant {
  id: string;
  name: string;
  ranking: number;
  members: string[];
}

export interface Tournament {
  id: string;
  name: string;
  game: 'League of Legends' | 'Valorant' | 'Rocket League' | 'Indie Game';
  format: 'Single Elimination' | 'Double Elimination' | 'Swiss' | 'Round Robin';
  prizeLimit: number;
  entryFee: number;
  participants: Participant[];
  maxTeams: number;
  status: 'upcoming' | 'active' | 'completed';
  matches: Match[];
  tags?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Course {
  id: string;
  title: string;
  category: 'Esports Strategy' | 'Mental Health' | 'Game Development' | 'Content Creation';
  instructor: string;
  duration: string;
  lessonsCount: number;
  rating: number;
  price: number;
  enrolled: boolean;
  progress: number; // Percentage
  skills: string[];
  quizzes: QuizQuestion[];
  isLocked: boolean;
  certificateEarned?: boolean;
}

export interface GameReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  isPlaytester: boolean;
}

export interface BugReport {
  id: string;
  reporter: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'fixing' | 'resolved';
  date: string;
}

export interface IndieGameSpec {
  id: string;
  name: string;
  developer: string;
  genre: string;
  description: string;
  plays: number;
  rating: number;
  reviews: GameReview[];
  bugs: BugReport[];
}

export interface CoachSessionBooking {
  id: string;
  coachId: string;
  coachName: string;
  date: string;
  timeSlot: string;
  vodLink?: string;
  isConfirmed: boolean;
  price: number;
}

export interface CoinTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'entry_fee' | 'prize_payout' | 'course_buy' | 'coaching_buy';
  amount: number;
  description: string;
  date: string;
}
