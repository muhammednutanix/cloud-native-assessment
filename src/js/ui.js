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
// track whether overlay should be visible across renders
let overlayVisible = false;

/* ============================================================
 * Initialize UI
 * ============================================================
 */

export function initUI(
  mount = document.querySelector("[data-cna-assessment], #app"),
) {
  app = mount;

  if (!app) return;

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
          <div class="cta-buttons mt-4">
            <button class="btn btn-primary" id="startAssessmentBtn">Start Assessment</button>
          </div>
        </div>

      </section>


      <!-- Quiz overlay (hidden until user clicks Start Assessment) -->
      <div id="quizOverlay" class="quiz-overlay">

        <div class="quiz-container">

          <button id="closeQuizBtn" class="btn btn-secondary" style="position:absolute;right:28px;top:28px;border-radius:12px;">Close</button>

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
                  class="btn ${state.currentQuestion === QUESTIONS.length - 1 ? "report-btn" : "btn-primary"}"
                  id="nextButton"
                  disabled>
                  ${state.currentQuestion === QUESTIONS.length - 1 ? "See Report" : "Continue →"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  `;

  bindEvents(question);

  // restore overlay visibility after re-render (preserve open state)
  const overlayEl = app.querySelector("#quizOverlay");
  if (overlayVisible && overlayEl) {
    overlayEl.classList.add("show");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
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

  const options = app.querySelectorAll(".option");

  const nextBtn = app.querySelector("#nextButton");
  if (savedAnswer) {
    nextBtn.disabled = false;
  }
  const prevBtn = app.querySelector("#previousButton");

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

  // Overlay controls: start and close
  const overlay = app.querySelector("#quizOverlay");
  const startBtn = app.querySelector("#startAssessmentBtn");
  const closeBtn = app.querySelector("#closeQuizBtn");

  if (startBtn && overlay) {
    startBtn.addEventListener("click", () => {
      overlayVisible = true;
      overlay.classList.add("show");
      // Prevent background scrolling while overlay is open
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    });
  }

  if (closeBtn && overlay) {
    closeBtn.addEventListener("click", () => {
      overlayVisible = false;
      overlay.classList.remove("show");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    });
  }
}
