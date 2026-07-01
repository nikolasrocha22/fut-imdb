export type MatchStatus = 'live' | 'completed' | 'scheduled';

export interface Score {
  home: number;
  away: number;
  penHome?: number;
  penAway?: number;
}

export interface MatchStats {
  possession: number[];
  shots: number[];
  shotsOnTarget: number[];
  xG: number[];
  fouls: number[];
  corners: number[];
  yellowCards: number[];
  redCards: number[];
}

export interface Player {
  name: string;
  number: number;
  pos: string;
  x: number; // Porcentagem (0 a 100) no eixo horizontal do campo
  y: number; // Porcentagem (0 a 100) no eixo vertical do campo
}

export interface LineupTeam {
  formation: string;
  players: Player[];
}

export interface Lineups {
  home: LineupTeam;
  away: LineupTeam;
}

export interface TimelineEvent {
  minute: number;
  type: 'goal' | 'card' | 'sub' | 'var';
  team: 'home' | 'away';
  detail: string;
  icon: string;
}

export interface Review {
  id: string;
  username: string;
  rating: number; // Nota de 0.0 a 10.0
  text: string;
  date: string;
  likes: number;
  createdAt?: string;
}

export interface Match {
  id: string;
  league: string;
  leagueEmoji: string;
  homeTeam: string;
  homeEmoji: string;
  awayTeam: string;
  awayEmoji: string;
  status: MatchStatus;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:MM
  score: Score | null;
  stadium: string;
  referee: string;
  rating: number;
  votes: number;
  stats: MatchStats | null;
  lineups: Lineups | null;
  timeline: TimelineEvent[];
  tacticalAnalysis: string;
  reviews: Review[];
  userRating?: number | null; // Se o usuário atual deu nota
}

export interface User {
  id: string;
  username: string;
  email: string;
}
