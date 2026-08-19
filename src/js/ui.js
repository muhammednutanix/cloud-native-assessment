console.log("UI Loaded");
/**
 * ============================================================
 * Cloud Native Readiness Assessment
 * UI Renderer
 * ============================================================
 */

import { QUESTIONS } from "../data/questions.js";
import { state, saveAnswer, nextQuestion, previousQuestion } from "./state.js";
import { createReportUrl } from "./encoder.js";

let app;

/* ============================================================
 * Initialize UI
 * ============================================================
 */

export function initUI() {
  app = document.getElementById("app");

  console.log("App element:", app);

  renderQuestion();
}

/* ============================================================
 * Render Current Question
 * ============================================================
 */

export function renderQuestion() {
  const question = QUESTIONS[state.currentQuestion];

  if (!question) return;

  const savedAnswer = state.answers.find(
    (answer) => answer.questionId === question.id,
  );

  app.innerHTML = `
    <main class="assessment">

      <section class="hero">

        <div class="container">

          <p class="eyebrow">
            Operational Readiness Assessment
          </p>

          <h1>
            How Ready Are You to Scale Cloud Native Operations?
          </h1>

          <p class="hero-copy">
            Cloud native has become the standard, but operating it shouldn't mean managing chaos. 
          </p>
          <p><small>Take this 1-minute benchmark assessment to evaluate your container operational readiness and pinpoint friction across VMs, Kubernetes, and enterprise data services.</small></p>

        </div>

      </section>

      <section class="quiz-section">

        <div class="quiz-container">

          ${renderProgress()}

          <div class="question-card">

            <div class="question-header">

              <span>
                Question ${state.currentQuestion + 1}
                of
                ${QUESTIONS.length}
              </span>

              <span>
                ${question.title}
              </span>

            </div>

            <h2>
              ${question.question}
            </h2>

            <p class="question-description">
              ${question.description}
            </p>

            <div class="options">

              ${question.options
                .map(
                  (option, index) => `
                    <button
                        class="option ${savedAnswer?.optionId === option.id ? "active" : ""}"
                        data-index="${index}">
                        <span class="option-letter">
                          ${String.fromCharCode(65 + index)}
                        </span>

                        <span class="option-text">
                          ${option.label}
                        </span>
                    </button>
                  `,
                )
                .join("")}

            </div>

            <div class="question-footer">

              <button
                  class="btn btn-secondary"
                  id="previousButton"
                  ${state.currentQuestion === 0 ? "disabled" : ""}>
                  Back
              </button>

              <button
                  class="btn btn-primary"
                  id="nextButton"
                  disabled>
                  Continue →
              </button>

            </div>

          </div>

        </div>

      </section>

    </main>
  `;

  bindEvents(question);
}

/* ============================================================
 * Progress
 * ============================================================
 */

function renderProgress() {
  const percent = (state.answers.length / QUESTIONS.length) * 100;

  return `
      <div class="progress">

          <div
              class="progress-bar">

              <div
                  class="progress-fill"
                  style="width:${percent}%">
              </div>

          </div>

      </div>
  `;
}

/* ============================================================
 * Events
 * ============================================================
 */

function bindEvents(question) {
  const savedAnswer = state.answers.find(
    (answer) => answer.questionId === question.id,
  );

  let selectedOption = null;

  const options = document.querySelectorAll(".option");

  const nextBtn = document.getElementById("nextButton");
  if (savedAnswer) {
    nextBtn.disabled = false;
  }
  const prevBtn = document.getElementById("previousButton");

  options.forEach((button, index) => {
    button.addEventListener("click", () => {
      options.forEach((option) => option.classList.remove("active"));

      button.classList.add("active");

      selectedOption = question.options[index];
      nextBtn.disabled = false;
    });
  });

  nextBtn.addEventListener("click", () => {
    if (!selectedOption) return;

    saveAnswer(state.currentQuestion, question.id, selectedOption);

    if (state.currentQuestion === QUESTIONS.length - 1) {
      window.location.assign(createReportUrl(state.answers));
      return;
    }

    nextQuestion();

    renderQuestion();
  });

  prevBtn.addEventListener("click", () => {
    previousQuestion();

    renderQuestion();
  });

  if (savedAnswer) {
    selectedOption = question.options.find(
      (option) => option.id === savedAnswer.optionId,
    );
  }
}
