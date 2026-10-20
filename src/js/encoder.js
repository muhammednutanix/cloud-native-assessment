/**
 * ============================================================
 * Cloud Native Readiness Assessment
 * URL Encoder / Decoder
 * ============================================================
 */

const VERSION = "CNA1";
const PREVIEW_VERSION = "PCNA1";

/**
 * Convert answers into a compact string.
 *
 * Example:
 * [
 *   { optionId: 2 },
 *   { optionId: 3 },
 *   { optionId: 1 },
 *   { optionId: 4 },
 *   { optionId: 2 }
 * ]
 *
 * becomes
 *
 * 23142
 */
export function encodeAnswers(answers) {
  return answers.map((answer) => answer.optionId).join("");
}

/**
 * Convert encoded string back to answer array.
 *
 * Example:
 *
 * "23142"
 *
 * becomes
 *
 * [2,3,1,4,2]
 */
export function decodeAnswers(encoded) {
  return encoded
    .split("")
    .map(Number)
    .filter((value) => value >= 1 && value <= 4);
}

/**
 * Build the assessment result string.
 *
 * Example:
 *
 * CNA1-23142
 */
export function encodeResult(answers) {
  return `${VERSION}-${encodeAnswers(answers)}`;
}

/**
 * Decode assessment result.
 *
 * Returns:
 *
 * {
 *   valid: true,
 *   version: "CNA1",
 *   answers: [2,3,1,4,2]
 * }
 */
export function decodeResult(result) {
  try {
    if (!result) {
      throw new Error("Missing result");
    }

    const [version, encodedAnswers] = result.split("-");

    if (version !== VERSION && version !== PREVIEW_VERSION) {
      throw new Error("Unsupported assessment version");
    }

    const answers = decodeAnswers(encodedAnswers);

    return {
      valid: true,
      version,
      preview: version === PREVIEW_VERSION,
      answers,
    };
  } catch (error) {
    return {
      valid: false,
      version: null,
      preview: true,
      answers: [],
      error: error.message,
    };
  }
}

/**
 * Create report URL
 */
export function createReportUrl(answers) {
  const result = encodeResult(answers);
  const assessmentPath = window.location.pathname.replace(/\/+$/, "");

  return `${assessmentPath}/report/?result=${encodeURIComponent(result)}`;
}

export function createPreviewReportUrl(answers) {
  const result = `${PREVIEW_VERSION}-${encodeAnswers(answers)}`;
  const assessmentPath = window.location.pathname.replace(/\/+$/, "");

  return `${assessmentPath}/report/?result=${encodeURIComponent(result)}`;
}
