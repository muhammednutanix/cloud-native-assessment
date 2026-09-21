import "../css/variables.css";
import "../css/main.css";
import "../css/report.css";
import html2pdf from "html2pdf.js";

import { calculateScore, getLevel } from "./assessment.js";
import { QUESTIONS } from "../data/questions.js";
import { RESOURCES } from "../data/resources.js";
import { decodeResult } from "./encoder.js";

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

  const result = new URLSearchParams(window.location.search).get("result");
  if (!result) {
    renderError("Missing assessment result.", mount);
    return;
  }

  const decoded = decodeResult(result);
  if (!decoded.valid) {
    renderError("Invalid assessment result.", mount);
    return;
  }

  const report = buildReport(decoded.answers, mount);
  if (report) renderReport(report, mount);
}

function reportTemplate() {
  return `
    <main class="report-layout">
      <div class="report-page-block report-page-summary">
        <header class="report-header">
        <div class="brand-mark">
          <img
            src="https://resources.nutanix.com/is/image/nutanix/thumb-nutanix-logo-white"
            alt="Nutanix"
            crossorigin="anonymous"
          />
        </div>
        <span class="header-label">CLOUD NATIVE</span>
        </header>

        <section class="report-hero">
        <span class="report-eyebrow">CLOUD NATIVE READINESS REPORT</span>
        <h1 id="riskLevel">Cloud Native Operator</h1>
        <p class="hero-kicker">Your readiness at a glance</p>
        </section>

        <section class="readiness-strip">
        <div class="score-circle"><span id="scoreSummary">14/20</span></div>
        <div class="score-details">
          <span class="score-label">OVERALL READINESS</span>
          <strong id="riskUrgency" class="readiness-level">Level 3</strong>
          <div class="readiness-meter"><span></span></div>
        </div>
        <span class="readiness-caption">Established</span>
        </section>

        <p id="riskSummary" class="hero-summary"></p>

        <section class="report-section report-summary-section">
        <span class="section-eyebrow">ASSESSMENT SUMMARY</span>
        <p class="section-intro">Five dimensions. One readiness snapshot.</p>
        <div id="assessmentBreakdown" class="opportunity-grid"></div>
        </section>

      </div>

      <div class="report-page-block report-page-actions">
        <section class="report-section report-next-steps">
        <span class="section-eyebrow">RECOMMENDED NEXT STEPS</span>
        <p class="section-intro">Focused actions to advance your cloud native journey.</p>
        <div id="nextActions" class="action-grid"></div>
        </section>

      </div>

      <div class="report-page-block report-page-resources">
        <section class="report-section report-resources-section">
        <span class="section-eyebrow">RECOMMENDED RESOURCES</span>
        <p class="section-intro">Practical guidance for your next stage of growth.</p>
        <div id="topRisks" class="resource-grid"></div>
        </section>

        <section class="report-cta">
        <div class="cta-card">
          <span class="section-eyebrow">READY FOR WHAT'S NEXT?</span>
          <h2>Accelerate your cloud native journey.</h2>
          <p>Explore the recommended resources or speak with a Nutanix expert to build your roadmap.</p>
          <div class="cta-buttons">
            <button id="downloadReport" class="btn btn-primary">Download PDF</button>
            <a href="/" data-cna-assessment-home class="btn btn-secondary">Retake Assessment</a>
          </div>
        </div>
        </section>

      </div>
    </main>
  `;
}

function buildReport(answerIds, mount) {
  const answers = QUESTIONS.map((question, index) => ({
    question,
    option:
      question.options.find((option) => option.id === answerIds[index]) || null,
  }));

  if (answers.some((answer) => !answer.option)) {
    renderError("Assessment data is invalid.", mount);
    return null;
  }

  const score = calculateScore(answers);
  const level = getLevel(score);

  return {
    score,
    level,
    answers,
    resources: level ? RESOURCES[level.id] : null,
  };
}

function renderReport(report, mount) {
  mount.querySelector("#riskLevel").textContent = report.level.title;
  mount.querySelector("#scoreSummary").textContent = `${report.score}/20`;
  mount.querySelector("#riskSummary").textContent = report.level.summary;

  const levelNumber = report.level.subtitle.replace("Level ", "");
  mount.querySelector("#riskUrgency").textContent = `Level ${levelNumber}`;
  mount.querySelector(".readiness-meter span").style.width =
    `${(report.score / 20) * 100}%`;
  mount.querySelector(".readiness-caption").textContent =
    report.level.title.replace(" Operator", "");

  renderBreakdown(report, mount);
  renderActions(report, mount);
  renderResources(report, mount);
}

function renderBreakdown(report, mount) {
  const container = mount.querySelector("#assessmentBreakdown");
  container.innerHTML = report.answers
    .map(
      (answer, index) => `
        <div class="report-card dimension-card">
          <span class="card-number">${String(index + 1).padStart(2, "0")}</span>
          <h3>${answer.question.title}</h3>
          <span class="answer-label">YOUR ANSWER</span>
          <p>${answer.option.label}</p>
        </div>
      `,
    )
    .join("");

  container.insertAdjacentHTML(
    "beforeend",
    `<div class="report-card readiness-card">
      <span class="answer-label">READINESS</span>
      <strong>Level ${report.level.subtitle.replace("Level ", "")}</strong>
      <p>${report.level.title}</p>
    </div>`,
  );
}

function renderActions(report, mount) {
  const container = mount.querySelector("#nextActions");
  container.innerHTML = report.level.recommendations
    .map(
      (item, index) => `<div class="report-card action-card">
        <span class="card-number">${String(index + 1).padStart(2, "0")}</span>
        <h3>Recommendation</h3>
        <p>${item}</p>
      </div>`,
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
      <span class="answer-label">NEXT STEP</span>
      <h3>${report.resources.nextStep.title}</h3>
      <p>${report.resources.nextStep.description}</p>
    </div>
    <div class="report-card">
      <span class="answer-label">RECOMMENDED FOCUS</span>
      <h3>${report.resources.solution.title}</h3>
      <p>${report.resources.solution.description}</p>
    </div>
    ${report.resources.resources
      .map(
        (resource) => `
          <div class="report-card">
            <span class="answer-label">${resource.type}</span>
            <h3>${resource.title}</h3>
            <a href="${resource.url}" target="_blank">Learn More</a>
          </div>
        `,
      )
      .join("")}
  `;
}

function renderError(message, mount) {
  mount.innerHTML = `
    <main class="report-layout">
      <section class="report-hero">
        <span class="report-eyebrow">CLOUD NATIVE READINESS REPORT</span>
        <h1>Unable to Load Report</h1>
        <p class="hero-kicker">${message}</p>
      </section>
    </main>
  `;
}

function downloadPdf() {
  const element = document.querySelector(".report-layout");
  if (!element) return;

  element.classList.add("pdf-export");

  const options = {
    margin: 0,
    filename: "Cloud-Native-Readiness-Report.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    },
    jsPDF: { unit: "pt", format: [576, 768], orientation: "portrait" },
    pagebreak: { mode: ["css"] },
  };

  html2pdf()
    .set(options)
    .from(element)
    .save()
    .finally(() => element.classList.remove("pdf-export"));
}

document.addEventListener("click", (event) => {
  if (event.target.closest("#downloadReport")) downloadPdf();
});
