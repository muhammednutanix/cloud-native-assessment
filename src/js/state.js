/**
 * ============================================================
 * Cloud Native Readiness Assessment
 * Application State
 * ============================================================
 */

export const state = {
  /**
   * Current question being displayed
   */
  currentQuestion: 0,

  /**
   * User selections
   * Example:
   * [
   *   { questionId: "modernization", optionId: 2, score: 2 },
   *   { questionId: "automation", optionId: 4, score: 4 }
   * ]
   */
  answers: [],

  /**
   * Assessment status
   */
  completed: false,

  /**
   * Report mode
   * preview | full
   */
  reportMode: "preview",
};

/**
 * Reset the assessment
 */
export function resetState() {
  state.currentQuestion = 0;
  state.answers = [];
  state.completed = false;
  state.reportMode = "preview";
}

/**
 * Save an answer
 */
export function saveAnswer(questionIndex, questionId, option) {
  state.answers[questionIndex] = {
    questionId,
    optionId: option.id,
    score: option.score,
    label: option.label,
  };
}

/**
 * Get answer for a question
 */
export function getAnswer(questionId) {
  return (
    state.answers.find((answer) => answer.questionId === questionId) || null
  );
}

/**
 * Move to next question
 */
export function nextQuestion() {
  state.currentQuestion++;
}

/**
 * Move to previous question
 */
export function previousQuestion() {
  if (state.currentQuestion > 0) {
    state.currentQuestion--;
  }
}

/**
 * Mark assessment complete
 */
export function completeAssessment() {
  state.completed = true;
}

/**
 * Set report mode
 */
export function setReportMode(mode) {
  state.reportMode = mode;
}
