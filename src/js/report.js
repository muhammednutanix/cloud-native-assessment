import "../css/variables.scss";
import "../css/main.scss";
import "../css/lead-form.scss";
import "../css/report.scss";
import html2pdf from "html2pdf.js";

import { calculateScore, getLevel } from "./assessment.js";
import { QUESTIONS } from "../data/questions.js";
import { RESOURCES } from "../data/resources.js";
import { decodeResult } from "./encoder.js";
import { initMarketoForm } from "./marketo.js";
import nutanixLogo from "../assets/nutanix-logo.svg?raw";

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
      const scrollToActions = () =>
        mount.querySelector("#reportActions").scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      const reportLayout = mount.querySelector(".report-layout");

      if (mount.classList.contains("report-is-printing")) {
        const handlePrintComplete = (event) => {
          if (event.animationName !== "report-paper-rise") return;
          reportLayout.removeEventListener("animationend", handlePrintComplete);
          scrollToActions();
        };
        reportLayout.addEventListener("animationend", handlePrintComplete);
      } else {
        scrollToActions();
      }
    });
  }
}

function reportTemplate() {
  return `
    <main class="report-layout">
      <div class="report-page-block report-page-summary">
        <section class="report-intro">
        <header class="report-header">
        <span class="header-label">ASSESSMENT REPORT</span>
        <div class="brand-mark">
          ${nutanixLogo}
        </div>
        </header>

        <div class="report-overview">
          <section class="report-hero">
            <h1 id="riskLevel">Cloud Native Operator</h1>
          </section>

          <section class="readiness-strip">
            <div class="score-circle">
              <svg class="score-ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
                <defs>
                  <linearGradient id="scoreRingGradient" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stop-color="#087f91" />
                    <stop offset="100%" stop-color="#6246c7" />
                  </linearGradient>
                </defs>
                <circle class="score-ring-track" cx="50" cy="50" r="44" />
                <circle class="score-ring-progress" cx="50" cy="50" r="44" />
              </svg>
              <span class="score-value"><span id="scoreSummary">14/20</span></span>
            </div>
            <div class="score-details">
              <span class="score-label">READINESS LEVEL</span>
              <strong id="riskUrgency" class="readiness-level">Level 3</strong>
              <div class="readiness-meter"><span></span></div>
            </div>
          </section>
        </div>

        <p id="riskSummary" class="hero-summary report-summary-copy"></p>
        </section>

        <section class="report-section report-challenges-section">
          <h2>Top Challenges</h2>
          <p class="section-intro">Areas with the most room to improve, based on your responses.</p>
          <div id="topChallenges" class="opportunity-grid"></div>
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
          <h2>How to Level Up</h2>
          <div id="nextActions" class="action-grid"></div>
        </section>

      </div>

      <div class="report-page-block report-page-resources" id="reportResources" hidden>
        <section class="report-section report-resources-section">
        <h2>Recommended Resources</h2>
        <div id="topRisks" class="resource-grid"></div>
        </section>

        <section class="report-section report-mapped-solutions-section">
          <h2>Mapped Solutions</h2>
          <div id="mappedSolutions" class="resource-grid"></div>
        </section>

        <section class="report-cta">
          <div class="cta-card">
            <span class="section-eyebrow">READY FOR WHAT'S NEXT?</span>
            <h2>Accelerate your cloud native journey.</h2>
            <p>Explore the recommended resources or speak with a Nutanix expert to build your roadmap.</p>
            <div class="cta-buttons">
              <button id="downloadReport" class="btn btn-primary"><span>Download PDF</span></button>
              <a href="/" data-cna-assessment-home class="btn btn-secondary"><span>Retake Assessment</span></a>
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
  mount.querySelector("#riskSummary").textContent = report.level.resultsSummary;

  const levelNumber = report.level.subtitle.replace("Level ", "");
  const scorePercentage = (report.score / 20) * 100;
  const scoreCircle = mount.querySelector(".readiness-strip .score-circle");
  const scoreCircleValue = scoreCircle.querySelector("span");
  const scoreRing = scoreCircle.querySelector(".score-ring-progress");
  const scoreRingCircumference = 2 * Math.PI * 44;
  scoreRing.style.strokeDasharray = `${scoreRingCircumference}`;
  scoreRing.style.strokeDashoffset = `${scoreRingCircumference * (1 - scorePercentage / 100)}`;
  scoreCircleValue.style.setProperty("color", "#20242b", "important");
  mount.querySelector("#riskUrgency").textContent = `Level ${levelNumber}`;
  mount.querySelector(".readiness-meter span").style.width =
    `${(report.score / 20) * 100}%`;

  mount.querySelector("#reportLeadForm").hidden = unlocked && !justSubmitted;
  mount.querySelector(".report-challenges-section").hidden = !unlocked;
  mount.querySelector("#reportActions").hidden = !unlocked;
  mount.querySelector("#reportResources").hidden = !unlocked;

  const printState = unlocked ? "full" : "preview";
  if (mount.dataset.printState !== printState) {
    mount.dataset.printState = printState;
    mount.classList.remove("report-is-printing", "report-motion-complete");

    const navigation = performance.getEntriesByType("navigation")[0];
    const isReload = navigation?.type === "reload";
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && !isReload) {
      void mount.offsetWidth;
      mount.classList.add("report-is-printing");
    } else {
      mount.classList.add("report-motion-complete");
    }
  }

  if (unlocked) {
    renderChallenges(report, mount);
    renderActions(report, mount);
    renderResources(report, mount);
    renderMappedSolutions(report, mount);
  }
}

function renderChallenges(report, mount) {
  const container = mount.querySelector("#topChallenges");
  const lowestScoringAnswers = [...report.answers]
    .sort((answerA, answerB) => answerA.option.score - answerB.option.score)
    .slice(0, 3);

  container.innerHTML = lowestScoringAnswers
    .map(
      (answer) => `
        <div class="report-card challenge-card">
          <span class="answer-label">CURRENT STATE</span>
          <h3>${answer.question.title}</h3>
          <p>${answer.option.label}</p>
        </div>
      `,
    )
    .join("");
}

function renderActions(report, mount) {
  const container = mount.querySelector("#nextActions");
  container.innerHTML = report.level.recommendations
    .map(
      (item, index) => `<article class="report-card action-card">
        <span class="card-number"><span>${String(index + 1).padStart(2, "0")}</span></span>
        <p>${item}</p>
      </article>`,
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
    ${report.resources.resources
      .map(
        (resource) => `
          <div class="report-card">
            <span class="answer-label">${resource.type}</span>
            <h3>${resource.title}</h3>
            <a href="${resource.url}" target="_blank">${resource.action}</a>
          </div>
        `,
      )
      .join("")}
  `;
}

function renderMappedSolutions(report, mount) {
  const container = mount.querySelector("#mappedSolutions");
  container.innerHTML = (report.resources?.mappedSolutions || [])
    .map(
      (solution) => `
        <div class="report-card mapped-solution-card">
          <span class="answer-label">${solution.type}</span>
          <h3>${solution.title}</h3>
          <p>${solution.description}</p>
          <a href="${solution.url}" target="_blank" rel="noopener noreferrer">Explore ${solution.type.toLowerCase()} <span aria-hidden="true">→</span></a>
        </div>
      `,
    )
    .join("");
}

function renderError(message, mount) {
  mount.innerHTML = `
    <main class="report-layout">
      <section class="report-hero">
        <h1>Unable to Load Report</h1>
        <p class="hero-kicker">${message}</p>
      </section>
    </main>
  `;
}

let pdfExportInProgress = false;

async function downloadPdf() {
  const element = document.querySelector("[data-cna-report]");
  if (!element || pdfExportInProgress) return;

  pdfExportInProgress = true;
  const progress = document.createElement("div");
  progress.className = "pdf-progress-overlay";
  progress.setAttribute("role", "status");
  progress.setAttribute("aria-live", "polite");
  progress.innerHTML = `
    <div class="pdf-progress-message">
      <span class="pdf-progress-spinner" aria-hidden="true"></span>
      <span>Generating PDF…</span>
    </div>
  `;
  document.body.append(progress);

  const options = {
    margin: 0,
    filename: "Cloud-Native-Readiness-Report.pdf",
    width: 1024,
    windowWidth: 1024,
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      windowWidth: 1024,
      backgroundColor: "#ffffff",
    },
    jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css"] },
  };

  try {
    await new Promise((resolve) => setTimeout(resolve, 280));
    element.classList.add("pdf-export");
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await html2pdf().set(options).from(element).save();
  } finally {
    element.classList.remove("pdf-export");
    element.classList.add("report-motion-complete");
    progress.classList.add("is-closing");
    await new Promise((resolve) => setTimeout(resolve, 280));
    progress.remove();
    pdfExportInProgress = false;
  }
}

document.addEventListener("click", (event) => {
  if (event.target.closest("#downloadReport")) downloadPdf();
});
