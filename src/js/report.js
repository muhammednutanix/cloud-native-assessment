import "../css/variables.css";
import "../css/main.css";
import "../css/report.css";
import html2pdf from "html2pdf.js";
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

export function initReport(
  mount = document.querySelector("[data-cna-report]"),
) {
  if (!mount) return;

  mount.innerHTML = reportTemplate();

  const assessmentHome = mount.querySelector("[data-cna-assessment-home]");
  if (assessmentHome) {
    assessmentHome.href =
      window.location.pathname.replace(/\/report\/?$/, "") || "/";
  }

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

  renderReport(report, mount);
}

function reportTemplate() {
  return `
    <main class="report-layout">
      <section class="report-hero">
        <span class="report-eyebrow"> CLOUD NATIVE READINESS REPORT </span>
        <h1 id="riskLevel">Cloud Native Operator</h1>
        <div class="score-wrapper">
          <div class="score-circle"><span id="scoreSummary">14 / 20</span></div>
          <div class="score-details">
            <span class="score-label"> Overall Readiness </span>
            <div id="riskUrgency" class="urgency-badge"></div>
          </div>
        </div>
        <p id="riskSummary" class="hero-summary"></p>
      </section>
      <section class="report-section">
        <h2>Assessment Summary</h2>
        <div id="assessmentBreakdown" class="opportunity-grid"></div>
      </section>
      <section class="report-section">
        <h2>Recommended Next Steps</h2>
        <div id="nextActions" class="action-grid"></div>
      </section>
      <section class="report-section">
        <h2>Recommended Resources</h2>
        <div id="topRisks" class="resource-grid"></div>
      </section>
      <section class="report-cta">
        <div class="cta-card">
          <h2>Ready to accelerate your cloud native journey?</h2>
          <p>Explore the recommended resources or speak with a Nutanix expert to build your roadmap.</p>
          <div class="cta-buttons">
            <button id="downloadReport" class="btn btn-primary">Download PDF</button>
            <a href="/" data-cna-assessment-home class="btn btn-secondary">Retake Assessment</a>
          </div>
        </div>
      </section>
    </main>
  `;
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

function renderReport(report, mount) {
  mount.querySelector("#riskLevel").textContent = report.level.title;

  mount.querySelector("#scoreSummary").textContent = `${report.score} / 20`;

  mount.querySelector("#riskSummary").textContent = report.level.summary;

  mount.querySelector("#riskUrgency").textContent = report.level.subtitle;

  renderJourney(report, mount);
  renderBreakdown(report, mount);
  renderActions(report, mount);
  renderResources(report, mount);
}

function renderJourney(report, mount) {
  mount
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

function renderBreakdown(report, mount) {
  const container = mount.querySelector("#assessmentBreakdown");
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

function renderActions(report, mount) {
  const container = mount.querySelector("#nextActions");

  container.innerHTML = report.level.recommendations
    .map(
      (item) => `  <div class="report-card">
                <h3>Recommendation</h3>
                <p>${item}</p>
            </div>  `,
    )
    .join("");
}

function renderResources(report, mount) {
  const container = mount.querySelector("#topRisks");

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

function renderError(message, mount) {
  const container = mount || document.querySelector("[data-cna-report]");

  if (!container) return;

  container.innerHTML = `
    <main class="report-layout">
      <section class="report-hero">
        <h1>Unable to Load Report</h1>
        <p>${message}</p>
      </section>
    </main>
  `;
}

function downloadPdf() {
  const element = document.querySelector(".report-layout");

  const options = {
    margin: 0.5,
    filename: "Cloud-Native-Readiness-Report.pdf",
    image: {
      type: "jpeg",
      quality: 1,
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
    },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait",
    },
  };

  html2pdf().set(options).from(element).save();
}

document.addEventListener("click", (event) => {
  if (event.target.closest("#downloadReport")) downloadPdf();
});
