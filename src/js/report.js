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
  const answers = QUESTIONS.map((question, index) => {
    return (
      question.options.find((option) => option.id === answerIds[index]) || null
    );
  });

  if (answers.includes(null)) {
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
  const app = document.getElementById("app");

  app.innerHTML = `

<section class="report-page">

    <div class="container">

        <h1>
            ${report.level.title}
        </h1>

        <p>
            ${report.level.subtitle}
        </p>

      <div class="score-card">

    <span>Overall Score</span>

    <strong>
        ${report.score}
        /
        ${QUESTIONS.length * 4}
    </strong>

</div>
        

        <p>
            ${report.level.summary}
        </p>

        <section class="recommendations">

            <h3>
                Recommendations
            </h3>

            <ul>

                ${report.level.recommendations
                  .map((item) => `<li>${item}</li>`)
                  .join("")}

            </ul>

        </section>

        <section class="resources">

            <h3>
                Recommended Resources
            </h3>

            ${report.resources.resources
              .map(
                (resource) => `

                <article class="resource">

                    <span>${resource.type}</span>

                    <h4>${resource.title}</h4>

                    <a href="${resource.url}" target="_blank">

                        Learn More →

                    </a>

                </article>

            `,
              )
              .join("")}

        </section>

        <section class="cta">
            <h3>
                ${report.resources.cta.title}

            </h3>

            <button class="btn btn-primary">

                ${report.resources.cta.button}

            </button>

        </section>
    </div>

</section>

`;
}

/* ============================================================
 * Error
 * ============================================================
 */

function renderError(message) {
  document.getElementById("app").innerHTML = `

<div class="container">

    <h2>

        Unable to Load Report

    </h2>

    <p>

        ${message}

    </p>

</div>

`;
}
document.addEventListener("DOMContentLoaded", initReport);
