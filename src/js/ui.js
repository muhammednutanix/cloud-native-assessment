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
let marketoScriptPromise = null;

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
              <span class="value-pillar-label">One-Minute Benchmark</span>
              <p>Five quick questions evaluating operational consistency and maturity.</p>
            </article>
            <article class="value-pillar">
              <span class="value-pillar-label">Score-Based Routing</span>
              <p>Evaluates your overall operational maturity to deliver targeted insights.</p>
            </article>
            <article class="value-pillar">
              <span class="value-pillar-label">Tailored Roadmap</span>
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
            <span>Cloud Native Readiness Assessment</span>
            <button
              id="closeQuizBtn"
              class="quiz-close-btn"
              type="button"
              aria-label="Close assessment"
              title="Close assessment">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

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
          renderLeadCaptureScreen();
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

function loadMarketoScript() {
  if (window.MktoForms2) return Promise.resolve(window.MktoForms2);
  if (marketoScriptPromise) return marketoScriptPromise;

  marketoScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://go.nutanix.com/js/forms2/js/forms2.min.js";
    script.async = true;
    script.dataset.marketoLoader = "true";
    script.addEventListener("load", () => resolve(window.MktoForms2), {
      once: true,
    });
    script.addEventListener(
      "error",
      () => reject(new Error("Marketo script failed to load")),
      { once: true },
    );
    document.body.appendChild(script);
  }).catch((error) => {
    marketoScriptPromise = null;
    throw error;
  });

  return marketoScriptPromise;
}

function showMarketoError() {
  const gate = document.getElementById("leadGate");
  if (!gate) return;

  const loading = gate.querySelector("#marketoLoading");
  const error = gate.querySelector("#marketoError");
  const retry = gate.querySelector("#retryMarketo");

  if (loading) loading.hidden = true;
  if (error) error.hidden = false;

  if (retry) {
    retry.addEventListener(
      "click",
      () => {
        if (error) error.hidden = true;
        if (loading) loading.hidden = false;
        loadMarketoForm();
      },
      { once: true },
    );
  }
}

async function loadMarketoForm() {
  const formElement = document.getElementById("mktoForm_4680");
  if (
    !formElement ||
    formElement.dataset.loading === "true" ||
    formElement.dataset.ready === "true"
  ) {
    return;
  }

  formElement.dataset.loading = "true";

  try {
    const MktoForms2 = await loadMarketoScript();
    if (!formElement.isConnected) return;

    MktoForms2.loadForm(
      "https://go.nutanix.com",
      "031-GVQ-112",
      4680,
      (form) => {
        if (!formElement.isConnected) return;

        formElement.dataset.loading = "false";
        formElement.dataset.ready = "true";

        const loading = document.getElementById("marketoLoading");
        if (loading) loading.hidden = true;

        form.getFormElem()[0].classList.add("nutanix-marketo-form");
        form.vals({ URL__c: window.location.href });

        const submitButton = form.getFormElem()[0].querySelector(".mktoButton");
        if (submitButton) submitButton.textContent = "View My Full Readiness Profile";

        form.onSuccess(() => {
          try {
            const reportUrl = createReportUrl(state.answers);
            window.location.assign(reportUrl);
          } catch (error) {
            showMarketoError();
          }
          return false;
        });
      },
    );
  } catch (error) {
    formElement.dataset.loading = "false";
    showMarketoError();
  }
}

function renderLeadCaptureScreen() {
  app.innerHTML = `
    <section class="lead-gate" id="leadGate" aria-live="polite">
      <div class="lead-gate-card">
        <p class="eyebrow">Your Assessment is Complete</p>
        <h1>Unlock your full readiness profile</h1>
        <p class="lead-copy">
          Enter your details below to instantly reveal your tailored architectural next steps and receive the downloadable PDF report.
        </p>

        <div class="marketo-form-shell">
          <div class="marketo-loading" id="marketoLoading" role="status">
            Loading secure form…
          </div>
          <form id="mktoForm_4680"></form>
        </div>

        <div class="marketo-error" id="marketoError" role="alert" hidden>
          <p>The form could not be loaded. Check your connection and try again.</p>
          <button class="ghost-btn" type="button" id="retryMarketo">Try again</button>
        </div>
      </div>
    </section>
  `;

  window.setTimeout(() => {
    loadMarketoForm();
  }, 120);
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
          <span></span>
        </div>
        <div class="processing-steps">
          <span><i></i>Responses scored</span>
          <span><i></i>Maturity mapped</span>
          <span><i></i>Resources matched</span>
        </div>
        <p class="processing-note">This usually takes less than 10 seconds. Your responses remain private.</p>
      </div>
    </section>
  `;

  const percentEl = app.querySelector("#processingPercent");
  const startedAt = performance.now();
  const duration = 2100;

  function updateProcessingPercent(now) {
    const progress = Math.min((now - startedAt) / duration, 1);
    percentEl.textContent = `${Math.round(progress * 100)}%`;

    if (progress < 1) requestAnimationFrame(updateProcessingPercent);
  }

  requestAnimationFrame(updateProcessingPercent);
}
