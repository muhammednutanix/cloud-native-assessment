console.log("UI Loaded");
/**
 * ============================================================
 * Cloud Native Readiness Assessment
 * UI Renderer
 * ============================================================
 */

import { QUESTIONS } from "../data/questions.js";
import { state, saveAnswer, nextQuestion, previousQuestion } from "./state.js";
import { createPreviewReportUrl } from "./encoder.js";

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
            <button class="btn btn-primary" id="startAssessmentBtn">Start 1-Minute Assessment</button>
          </div>

               <section class="value-pillars" aria-label="Assessment value pillars">
        <div class="container">
          <div class="value-pillars-grid">
            <article class="value-pillar">
              <span class="value-pillar-label">One-Minute<br>Benchmark</span>
              <p>Five quick questions evaluating operational consistency and maturity.</p>
            </article>
            <article class="value-pillar">
              <span class="value-pillar-label">Score-Based<br>Routing</span>
              <p>Evaluates your overall operational maturity to deliver targeted insights.</p>
            </article>
            <article class="value-pillar">
              <span class="value-pillar-label">Tailored<br>Roadmap</span>
              <p>Receive immediate benchmark analysis with specific next steps and assets.</p>
            </article>
          </div>
        </div>
      </section>
        </div>

      </section>

 


      <!-- Quiz overlay (hidden until user clicks Start Assessment) -->
      <div id="quizOverlay" class="quiz-overlay">

        <div class="quiz-container">

          <div class="quiz-window-header">
            <span class="quiz-window-title">Cloud Native Readiness Assessment</span>
            <button
              id="closeQuizBtn"
              class="quiz-close-btn"
              type="button"
              aria-label="Close assessment"
              title="Close assessment">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="question-card">
            <span class="question-watermark" aria-hidden="true">
              ${String(state.currentQuestion + 1).padStart(2, "0")}
            </span>

            <div class="question-header">
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
                class="quiz-nav-btn quiz-nav-back"
                id="previousButton"
                type="button"
                aria-label="Go back"
                title="Go back"
                ${state.currentQuestion === 0 ? "disabled" : ""}>
                <span aria-hidden="true">&larr;</span>
              </button>

              <button
                class="quiz-nav-btn quiz-nav-next"
                id="nextButton"
                type="button"
                  aria-label="${state.currentQuestion === QUESTIONS.length - 1 ? "See report" : "Next"}"
                  title="${state.currentQuestion === QUESTIONS.length - 1 ? "See report" : "Next"}"
                disabled>
                  <span class="quiz-next-label">Next</span>
              </button>

            </div>

          </div>

        </div>

        ${renderProgress()}

      </div>

    </main>
  `;

  bindEvents(question);

  // restore overlay visibility after re-render (preserve open state)
  const overlayEl = app.querySelector("#quizOverlay");
  if (overlayVisible && overlayEl) {
    overlayEl.classList.add("show");
    app.querySelector(".assessment")?.classList.add("quiz-open");
    app
      .querySelector(".assessment > .hero")
      ?.setAttribute("aria-hidden", "true");
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
  const progressState =
    state.answers.length === 0
      ? "progress--pending"
      : state.answers.length === 1
        ? "progress--entering"
        : "";

  return `
      <div class="progress ${progressState}">

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

    nextBtn.disabled = true;
    options.forEach((option) => {
      option.disabled = true;
    });

    saveAnswer(state.currentQuestion, question.id, selectedOption);

    const questionCard = app.querySelector(".question-card");
    const progressFill = app.querySelector(".progress-fill");
    const nextPercent = (state.answers.length / QUESTIONS.length) * 100;

    if (progressFill) progressFill.style.width = `${nextPercent}%`;
    if (questionCard) questionCard.classList.add("is-transitioning");

    window.setTimeout(() => {
      if (state.currentQuestion === QUESTIONS.length - 1) {
        renderProcessingScreen();
        window.setTimeout(() => {
          window.location.assign(createPreviewReportUrl(state.answers));
        }, 2200);
        return;
      }

      nextQuestion();
      renderQuestion();
    }, 420);
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
  const hero = app.querySelector(".assessment > .hero");

  if (startBtn && overlay) {
    startBtn.addEventListener("click", () => {
      overlayVisible = true;
      overlay.classList.add("show");
      app.querySelector(".assessment")?.classList.add("quiz-open");
      hero?.setAttribute("aria-hidden", "true");
      // Prevent background scrolling while overlay is open
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    });
  }

  if (closeBtn && overlay) {
    closeBtn.addEventListener("click", () => {
      overlayVisible = false;
      overlay.classList.remove("show");
      app.querySelector(".assessment")?.classList.remove("quiz-open");
      hero?.removeAttribute("aria-hidden");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    });
  }
}

function renderProcessingScreen() {
  app.innerHTML = `
    <section class="processing-screen" aria-live="polite">
      <div class="processing-card">
        <div class="processing-icon" aria-hidden="true">✦</div>
        <h1>Building your readiness profile</h1>
        <p class="processing-copy">
          We&rsquo;re comparing your responses across all five dimensions and
          prioritizing the actions with the highest operational impact.
        </p>
        <div class="processing-progress-label">
          <span>Tailoring recommendations</span>
          <strong id="processingPercent">0%</strong>
        </div>
        <div class="processing-progress-track">
          <span id="processingProgressFill"></span>
        </div>
        <div class="processing-steps">
          <span data-step="33"><i aria-hidden="true"></i>Responses scored</span>
          <span data-step="66"><i aria-hidden="true"></i>Maturity mapped</span>
          <span data-step="100"><i aria-hidden="true"></i>Resources matched</span>
        </div>
        <p class="processing-note">This usually takes less than 10 seconds. Your responses remain private.</p>
      </div>
    </section>
  `;

  const percentEl = app.querySelector("#processingPercent");
  const progressFill = app.querySelector("#processingProgressFill");
  const steps = [...app.querySelectorAll(".processing-steps [data-step]")];
  const startedAt = performance.now();
  const duration = 2100;

  function updateProcessingPercent(now) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const percent = Math.round(progress * 100);
    percentEl.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;
    steps.forEach((step) => {
      step.classList.toggle(
        "is-complete",
        percent >= Number(step.dataset.step),
      );
    });

    if (progress < 1) requestAnimationFrame(updateProcessingPercent);
  }

  requestAnimationFrame(updateProcessingPercent);
}
