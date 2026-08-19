console.log("report.js module loaded");
import "../css/variables.css";
import "../css/main.css";
import "../css/report.css";
/**
 * ============================================================
 * Cloud Native Readiness Assessment
 * Report Renderer
 * ============================================================
 */
import { calculateScore, getLevel } from "./assessment.js";
import { QUESTIONS } from "../data/questions.js";
import { LEVELS } from "../data/levels.js";
import { RESOURCES } from "../data/resources.js";

import { decodeResult } from "./encoder.js";

/* ============================================================
 * Initialize Report
 * ============================================================
 */

export function initReport() {
  console.log("Report JS Loaded");

  const params = new URLSearchParams(window.location.search);

  const result = params.get("result");

  console.log(result);

  if (!result) {
    renderError("Missing assessment result.");
    return;
  }

  const decoded = decodeResult(result);

  if (!decoded.valid) {
    renderError("Invalid assessment result.");
    return;
  }

  const report = buildReport(decoded.answers);

  renderReport(report);
}

/* ============================================================
 * Build Report
 * ============================================================
 */

function buildReport(answerIds) {
  const answers = QUESTIONS.map((question, index) => ({
    question,
    option:
      question.options.find((option) => option.id === answerIds[index]) || null,
  }));

  if (answers.some((a) => !a.option)) {
    renderError("Assessment data is invalid.");
    return;
  }

  const score = calculateScore(answers);
  const level = getLevel(score);

  const resources = level ? RESOURCES[level.id] : null;
  return {
    score,
    level,
    answers,
    resources,
  };
}

/* ============================================================
 * Render Report
 * ============================================================
 */

function renderReport(report) {
  console.log(report);
  console.log(report.level);
  console.log(report.score);

  document.getElementById("riskLevel").textContent = report.level.title;

  document.getElementById("scoreSummary").textContent = `${report.score} / 20`;

  document.getElementById("riskSummary").textContent = report.level.summary;

  document.getElementById("riskUrgency").textContent = report.level.subtitle;

  renderJourney(report);
  renderBreakdown(report);
  renderActions(report);
  renderResources(report);
}

function renderJourney(report) {
  document
    .querySelectorAll(".level-card")
    .forEach((card) => card.classList.remove("active"));

  const active =
    document.querySelectorAll(".level-card")[
      Number(report.level.subtitle.replace("Level ", "")) - 1
    ];

  if (active) {
    active.classList.add("active");
  }
}

function renderBreakdown(report) {
  const container = document.getElementById("assessmentBreakdown");
  console.log(report.answers);
  container.innerHTML = report.answers
    .map(
      (answer) => `

        <div class="report-card">
          <h3>${answer.question.title}</h3>
            <p>
                <strong>Your Answer</strong><br>
                ${answer.option.label}
            </p>
        </div>

    `,
    )
    .join("");
}

function renderActions(report) {
  const container = document.getElementById("nextActions");

  container.innerHTML = report.level.recommendations
    .map(
      (item) => `  <div class="report-card">
                <h3>Recommendation</h3>
                <p>${item}</p>
            </div>  `,
    )
    .join("");
}

function renderResources(report) {
  const container = document.getElementById("topRisks");

  if (!report.resources) {
    container.innerHTML = "";

    return;
  }

  container.innerHTML = `

        <div class="report-card report-highlight">

            <h3>
                ${report.resources.nextStep.title}
            </h3>

            <p>
                ${report.resources.nextStep.description}
            </p>

        </div>

        <div class="report-card">

            <h3>
                ${report.resources.solution.title}
            </h3>

            <p>
                ${report.resources.solution.description}
            </p>

        </div>

        ${report.resources.resources
          .map(
            (resource) => `

            <div class="report-card">

                <span class="resource-type">
                    ${resource.type}
                </span>

                <h3>
                    ${resource.title}
                </h3>

                <a
                    href="${resource.url}"
                    target="_blank">

                    Learn More →

                </a>

            </div>

        `,
          )
          .join("")}

        <div class="report-card report-cta">

            <h3>
                ${report.resources.cta.title}
            </h3>

            <button class="btn btn-primary">

                ${report.resources.cta.button}

            </button>

        </div>

    `;
}
/* ============================================================
 * Error
 * ============================================================
 */

function renderError(message) {
  console.trace("renderError called");
  document.body.innerHTML = `
    <main class="report-layout">
      <section class="report-hero">
        <h1>Unable to Load Report</h1>
        <p>${message}</p>
      </section>
    </main>
  `;
}
