/**
 * ============================================================
 * Cloud Native Readiness Assessment
 * Main Entry Point
 * ============================================================
 */

import "../css/variables.scss";
import "../css/main.scss";
import "../css/lead-form.scss";
import "../css/quiz.scss";
import "../css/report.scss";

import { QUESTIONS } from "../data/questions";
import { LEVELS } from "../data/levels";
import { RESOURCES } from "../data/resources";

import { initUI } from "./ui";
import { initReport } from "./report";

document.addEventListener("DOMContentLoaded", () => {
  const reportMount = document.querySelector("[data-cna-report]");
  const assessmentMount = document.querySelector("[data-cna-assessment], #app");

  if (reportMount) initReport(reportMount);
  else if (assessmentMount) initUI(assessmentMount);
});
