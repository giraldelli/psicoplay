/**
 * Pure business and clinical logic for psychopedagogical game evaluation,
 * reaction scoring, sensory regulation assessment, and progress metrics.
 */

export type SensoryState = 'calmo' | 'focado' | 'em_alerta' | 'sobrecarregado' | 'desatento';
export type AutonomyLevel = 'independente' | 'dica_verbal' | 'apoio_gestual' | 'apoio_fisico_leve';

export interface ReactionEvaluationInput {
  timeTakenMs: number;
  expectedTimeMs: number;
  mistakesCount: number;
  touchesCount: number;
  autonomy: AutonomyLevel;
  sensoryState: SensoryState;
}

export interface ReactionEvaluationResult {
  score: number; // 0 to 100
  paceScore: number; // 0 to 100
  engagementLevel: number; // 1 to 5
  sensoryBalanceScore: number; // 0 to 100
  clinicalSummary: string;
  needsSensoryBreak: boolean;
}

/**
 * Evaluates a patient's reaction and performance during a psychopedagogical activity.
 */
export function evaluateReaction(input: ReactionEvaluationInput): ReactionEvaluationResult {
  const { timeTakenMs, expectedTimeMs, mistakesCount, touchesCount, autonomy, sensoryState } = input;

  // Pace score based on expected vs actual time (lenient for neurodivergent children)
  const ratio = timeTakenMs / (expectedTimeMs || 1000);
  let paceScore = 100;
  if (ratio > 3) {
    paceScore = 60;
  } else if (ratio > 2) {
    paceScore = 75;
  } else if (ratio > 1.5) {
    paceScore = 85;
  } else {
    paceScore = 95;
  }

  // Penalty for mistakes, capped
  const accuracyScore = Math.max(40, 100 - mistakesCount * 12);

  // Autonomy factor
  const autonomyWeights: Record<AutonomyLevel, number> = {
    independente: 1.0,
    dica_verbal: 0.9,
    apoio_gestual: 0.8,
    apoio_fisico_leve: 0.7,
  };
  const autonomyFactor = autonomyWeights[autonomy] || 0.8;

  // Sensory regulation factor
  const sensoryScores: Record<SensoryState, number> = {
    calmo: 95,
    focado: 100,
    em_alerta: 75,
    desatento: 65,
    sobrecarregado: 50,
  };
  const sensoryBalanceScore = sensoryScores[sensoryState] || 80;

  // Final score weighted toward emotional & sensory balance rather than purely speed
  const weighted = Math.round(
    accuracyScore * 0.4 + paceScore * 0.2 + sensoryBalanceScore * 0.4
  );
  const score = Math.min(100, Math.max(20, Math.round(weighted * autonomyFactor)));

  // Engagement rating 1 to 5
  let engagementLevel = 3;
  if (sensoryState === 'focado' && mistakesCount <= 2) {
    engagementLevel = 5;
  } else if (sensoryState === 'calmo' || (touchesCount > 3 && mistakesCount <= 4)) {
    engagementLevel = 4;
  } else if (sensoryState === 'sobrecarregado') {
    engagementLevel = 2;
  } else if (sensoryState === 'desatento') {
    engagementLevel = 2;
  }

  const needsSensoryBreak = sensoryState === 'sobrecarregado' || (mistakesCount >= 5 && ratio > 2.5);

  let clinicalSummary = 'Desempenho harmônico com boa regulação e ritmo adequado.';
  if (needsSensoryBreak) {
    clinicalSummary = 'Sinais de sobrecarga ou fadiga cognitiva observados. Recomenda-se pausa sensorial.';
  } else if (autonomy === 'independente' && engagementLevel >= 4) {
    clinicalSummary = 'Excelente autonomia e alta conexão visual com os estímulos apresentados.';
  } else if (autonomy === 'apoio_fisico_leve' || autonomy === 'apoio_gestual') {
    clinicalSummary = 'Mediação psicopedagógica foi fundamental para guiar o foco e estruturar a ação motora.';
  }

  return {
    score,
    paceScore,
    engagementLevel,
    sensoryBalanceScore,
    clinicalSummary,
    needsSensoryBreak,
  };
}

/**
 * Checks matching rules for color or shape pairing.
 */
export function validatePairing(
  item: { color?: string; shape?: string },
  target: { expectedColor?: string; expectedShape?: string }
): boolean {
  if (target.expectedColor && item.color) {
    if (item.color.toLowerCase() !== target.expectedColor.toLowerCase()) return false;
  }
  if (target.expectedShape && item.shape) {
    if (item.shape.toLowerCase() !== target.expectedShape.toLowerCase()) return false;
  }
  return true;
}

/**
 * Computes average evolution metrics across recorded sessions.
 */
export function computeEvolutionIndex(scores: number[]): { average: number; trend: 'alta' | 'estavel' | 'revisao' } {
  if (!scores || scores.length === 0) {
    return { average: 0, trend: 'estavel' };
  }
  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  const average = Math.round(sum / scores.length);

  if (scores.length >= 3) {
    const recent = scores.slice(-3);
    const older = scores.slice(0, scores.length - 3);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;

    if (recentAvg - olderAvg >= 5) {
      return { average, trend: 'alta' };
    }
    if (olderAvg - recentAvg >= 8) {
      return { average, trend: 'revisao' };
    }
  }

  return { average, trend: 'estavel' };
}
