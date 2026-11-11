export type SensorySensitivity = 'baixa' | 'moderada' | 'alta';

export interface SensoryProfile {
  auditorySensitivity: SensorySensitivity;
  visualSensitivity: SensorySensitivity;
  tactileSensitivity: SensorySensitivity;
  hyperfocusInterests: string[];
  sensoryTriggers: string[];
  calmingTechniques: string[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  birthDate: string;
  diagnosis: string; // Ex: TEA Nível 1, TEA Nível 2, TDAH, Atraso do Desenvolvimento
  cid: string;
  guardianName: string;
  guardianPhone: string;
  schoolGrade: string;
  avatarColor: string;
  sensoryProfile: SensoryProfile;
  notes: string;
  createdAt: string;
  sessionsCount: number;
  lastSessionDate: string;
}

export interface GameMetricRecord {
  id: string;
  sessionId?: string;
  patientId: string;
  gameId: string;
  gameTitle: string;
  date: string;
  durationSeconds: number;
  score: number;
  touchesCount: number;
  mistakesCount: number;
  autonomy: 'independente' | 'dica_verbal' | 'apoio_gestual' | 'apoio_fisico_leve';
  sensoryState: 'calmo' | 'focado' | 'em_alerta' | 'sobrecarregado' | 'desatento';
  clinicalNotes: string;
}

export interface SessionRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  durationMinutes: number;
  therapistName: string;
  initialMood: 'alegre' | 'calmo' | 'inquieto' | 'resistente' | 'cansado';
  finalMood: 'alegre' | 'calmo' | 'regulado' | 'cansado';
  gamesPlayed: string[];
  clinicalObservations: string;
  familyRecommendations: string;
  gameMetrics: GameMetricRecord[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  status: 'confirmado' | 'em_atendimento' | 'concluido' | 'cancelado';
  targetGoals: string[];
}

export interface EvolutionIndicator {
  skill: string;
  category: 'cognitivo' | 'motor' | 'emocional' | 'comunicacao';
  baselineScore: number;
  currentScore: number;
  progressPercent: number;
  notes: string;
}
