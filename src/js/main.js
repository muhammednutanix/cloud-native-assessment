/**
 * ============================================================
 * Cloud Native Readiness Assessment
 * Main Entry Point
 * ============================================================
 */

import "../css/variables.css";
import "../css/main.css";
import "../css/quiz.css";
import "../css/report.css";

import { QUESTIONS } from "../data/questions";
import { LEVELS } from "../data/levels";
import { RESOURCES } from "../data/resources";

import { initUI } from "./ui";
import { initReport } from "./report";

document.addEventListener("DOMContentLoaded", () => {
  const page = window.location.pathname.split("/").pop() || "index.html";

  console.log("Current page:", page);

  if (page === "report.html") {
    console.log("Initializing REPORT");
    initReport();
  } else {
    console.log("Initializing QUIZ");
    initUI();
  }
});
