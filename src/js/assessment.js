/**
 * ============================================================
 * Cloud Native Readiness Assessment
 * Assessment Engine
 * ============================================================
 */

import { QUESTIONS } from "../data/questions.js";
import { LEVELS } from "../data/levels.js";
import { RESOURCES } from "../data/resources.js";

/* ============================================================
 * Calculate Score
 * ============================================================
 */

export function calculateScore(answers) {
  return answers.reduce((total, answer) => {
    return total + answer.score;
  }, 0);
}

/* ============================================================
 * Determine Readiness Level
 * ============================================================
 */

export function getLevel(score) {
  return (
    LEVELS.find(
      (level) => score >= level.minScore && score <= level.maxScore,
    ) || null
  );
}

/* ============================================================
 * Find Weakest Category
 * ============================================================
 */

export function getWeakestCategory(answers) {
  if (!answers.length) return null;

  return answers.reduce((lowest, current) => {
    return current.score < lowest.score ? current : lowest;
  });
}

/* ============================================================
 * Build Report Model
 * ============================================================
 */

export function getReportModel(answers) {
  const score = calculateScore(answers);

  const level = getLevel(score);

  const weakestCategory = getWeakestCategory(answers);

  const resources = RESOURCES[level?.id] || null;

  return {
    score,

    maxScore: QUESTIONS.length * 4,

    level,

    resources,

    weakestCategory,

    answers,
  };
}

/* ============================================================
 * Validation
 * ============================================================
 */

export function validateAnswers(answers) {
  if (!Array.isArray(answers)) {
    return false;
  }

  if (answers.length !== QUESTIONS.length) {
    return false;
  }

  return answers.every((answer) => {
    return answer && answer.questionId && answer.optionId && answer.score;
  });
}

/* ============================================================
 * Analytics Payload
 * ============================================================
 */

export function getAnalyticsPayload(answers) {
  const report = getReportModel(answers);

  return {
    assessment: "Cloud Native Readiness",

    version: "1.0.0",

    score: report.score,

    level: report.level.id,

    readiness: report.level.title,

    weakestCategory: report.weakestCategory.questionId,

    answers: answers.map((answer) => ({
      questionId: answer.questionId,

      optionId: answer.optionId,

      score: answer.score,
    })),
  };
}
