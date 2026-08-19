/**
 * ============================================================
 * Cloud Native Readiness Assessment
 * Main Entry Point
 * ============================================================
 */

import "../css/main.css";
import "../css/quiz.css";

import { QUESTIONS } from "../data/questions";
import { LEVELS } from "../data/levels";
import { RESOURCES } from "../data/resources";

import { initUI } from "./ui";

document.addEventListener("DOMContentLoaded", () => {
  console.group("🚀 Cloud Native Readiness Assessment");

  console.log("Questions:", QUESTIONS.length);
  console.log("Levels:", LEVELS.length);
  console.log("Resources:", Object.keys(RESOURCES).length);

  console.groupEnd();

  initUI({
    questions: QUESTIONS,
    levels: LEVELS,
    resources: RESOURCES,
  });
});
