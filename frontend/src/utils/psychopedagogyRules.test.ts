import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateReaction,
  validatePairing,
  computeEvolutionIndex
} from './psychopedagogyRules.ts';

test('evaluateReaction computes high score for focused and independent session', () => {
  const result = evaluateReaction({
    timeTakenMs: 12000,
    expectedTimeMs: 15000,
    mistakesCount: 0,
    touchesCount: 8,
    autonomy: 'independente',
    sensoryState: 'focado',
  });

  assert.ok(result.score >= 85, `Expected score >= 85, got ${result.score}`);
  assert.equal(result.engagementLevel, 5);
  assert.equal(result.needsSensoryBreak, false);
});

test('evaluateReaction detects sensory break requirement when overloaded', () => {
  const result = evaluateReaction({
    timeTakenMs: 45000,
    expectedTimeMs: 10000,
    mistakesCount: 6,
    touchesCount: 15,
    autonomy: 'apoio_fisico_leve',
    sensoryState: 'sobrecarregado',
  });

  assert.equal(result.needsSensoryBreak, true);
  assert.ok(result.clinicalSummary.includes('pausa sensorial'));
});

test('validatePairing correctly matches colors and shapes', () => {
  assert.equal(
    validatePairing({ color: 'verde', shape: 'circulo' }, { expectedColor: 'verde' }),
    true
  );
  assert.equal(
    validatePairing({ color: 'azul', shape: 'quadrado' }, { expectedColor: 'verde' }),
    false
  );
  assert.equal(
    validatePairing({ shape: 'triangulo' }, { expectedShape: 'triangulo' }),
    true
  );
});

test('computeEvolutionIndex tracks evolution progress and trends', () => {
  const scores = [65, 70, 72, 85, 88, 90];
  const { average, trend } = computeEvolutionIndex(scores);
  assert.ok(average > 75);
  assert.equal(trend, 'alta');
});
