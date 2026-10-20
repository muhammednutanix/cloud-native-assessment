/**
 * ============================================================
 * Cloud Native Readiness Assessment
 * URL Encoder / Decoder
 * ============================================================
 */

const VERSION = "CNA1";

export function createDateStamp(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export function createAnalyticsHash() {
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

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
  return answers
    .map((answer) => {
      const optionId = typeof answer === "object" ? answer?.optionId : answer;
      return /^[1-4]$/.test(String(optionId ?? "")) ? optionId : "";
    })
    .join("");
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
 * CNA123142F20261020<hash>
 */
export function encodeResult(
  answers,
  dateStamp = createDateStamp(),
  analyticsHash = createAnalyticsHash(),
) {
  return `${VERSION}${encodeAnswers(answers)}F${dateStamp}${analyticsHash}`;
}

export function encodePreviewResult(
  answers,
  dateStamp = createDateStamp(),
  analyticsHash = createAnalyticsHash(),
) {
  return `${VERSION}${encodeAnswers(answers)}P${dateStamp}${analyticsHash}`;
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

    if (!result.startsWith(VERSION)) {
      throw new Error("Unsupported assessment version");
    }

    const valuePattern = /^([1-4]+)([PF])(\d{8})([\da-f]{32})$/i;
    const value = result.slice(VERSION.length).match(valuePattern);
    if (!value) throw new Error("Invalid assessment result value");

    const [, encodedAnswers, marker, dateStamp, analyticsHash] = value;
    const answers = decodeAnswers(encodedAnswers);

    return {
      valid: true,
      version: VERSION,
      preview: marker === "P",
      answers,
      dateStamp,
      analyticsHash: analyticsHash.toLowerCase(),
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
  const params = new URLSearchParams({ result });

  return `${assessmentPath}/report/?${params.toString()}`;
}

export function createPreviewReportUrl(answers) {
  const result = encodePreviewResult(answers);
  const assessmentPath = window.location.pathname.replace(/\/+$/, "");
  const params = new URLSearchParams({ result });

  return `${assessmentPath}/report/?${params.toString()}`;
}
