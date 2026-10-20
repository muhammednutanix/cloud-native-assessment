import "../css/variables.scss";
import "../css/main.scss";
import "../css/lead-form.scss";
import "../css/report.scss";
import "../css/report-paper.scss";
import html2pdf from "html2pdf.js";

import { calculateScore, getLevel } from "./assessment.js";
import { QUESTIONS } from "../data/questions.js";
import { RESOURCES } from "../data/resources.js";
import { decodeResult } from "./encoder.js";
import { initMarketoForm } from "./marketo.js";

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
  if (!report) return;

  const fullResult = `CNA1-${decoded.answers.join("")}`;
  const unlocked = !decoded.preview;

  renderReport(report, mount, unlocked);

  if (decoded.preview) {
    initMarketoForm(mount, () => {
      const url = new URL(window.location.href);
      url.searchParams.set("result", fullResult);
      window.history.replaceState({}, "", url);
      renderReport(report, mount, true, true);
      mount.querySelector("#reportActions").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }
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
        <p class="section-intro">Your overall cloud native readiness at a glance.</p>
        <div id="assessmentBreakdown" class="opportunity-grid"></div>
        </section>

        <section class="report-section report-lead-form" id="reportLeadForm" aria-labelledby="leadFormTitle">
          <span class="section-eyebrow">YOUR FULL REPORT IS READY</span>
          <h2 id="leadFormTitle">Unlock your full readiness report</h2>
          <p class="section-intro">Complete the form to reveal your assessment breakdown, recommended next steps, and resources.</p>
          <div class="marketo-form-shell">
            <div class="marketo-loading" id="marketoLoading" role="status">Loading secure form…</div>
            <form id="mktoForm_4680"></form>
          </div>
          <div class="marketo-error" id="marketoError" role="alert" hidden>
            <p>The form could not be loaded. Check your connection and try again.</p>
            <button class="ghost-btn" type="button" id="retryMarketo">Try again</button>
          </div>
          <p class="marketo-success" id="marketoSuccess" role="status" hidden>Thanks. Your full report is now available below.</p>
        </section>

      </div>

      <div class="report-page-block report-page-actions" id="reportActions" hidden>
        <section class="report-section report-next-steps">
        <span class="section-eyebrow">RECOMMENDED NEXT STEPS</span>
        <p class="section-intro">Focused actions to advance your cloud native journey.</p>
        <div id="nextActions" class="action-grid"></div>
        </section>

      </div>

      <div class="report-page-block report-page-resources" id="reportResources" hidden>
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

function renderReport(report, mount, unlocked, justSubmitted = false) {
  mount.querySelector("#riskLevel").textContent = report.level.title;
  mount.querySelector("#scoreSummary").textContent = `${report.score}/20`;
  mount.querySelector("#riskSummary").textContent = report.level.summary;

  const levelNumber = report.level.subtitle.replace("Level ", "");
  mount.querySelector("#riskUrgency").textContent = `Level ${levelNumber}`;
  mount.querySelector(".readiness-meter span").style.width =
    `${(report.score / 20) * 100}%`;
  mount.querySelector(".readiness-caption").textContent = report.level.title;

  mount.querySelector("#reportLeadForm").hidden = unlocked && !justSubmitted;
  mount.querySelector(".report-summary-section").hidden = !unlocked;
  mount.querySelector("#reportActions").hidden = !unlocked;
  mount.querySelector("#reportResources").hidden = !unlocked;

  if (unlocked) {
    renderBreakdown(report, mount);
    renderActions(report, mount);
    renderResources(report, mount);
  }
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
        <h3>How to Level Up</h3>
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
      <span class="answer-label">HOW TO LEVEL UP</span>
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
  const reportPage = document.querySelector("[data-cna-report]");
  if (!element) return;

  element.classList.add("pdf-export");
  reportPage?.classList.add("pdf-rendering");

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
    .finally(() => {
      element.classList.remove("pdf-export");
      reportPage?.classList.remove("pdf-rendering");
    });
}

document.addEventListener("click", (event) => {
  if (event.target.closest("#downloadReport")) downloadPdf();
});
