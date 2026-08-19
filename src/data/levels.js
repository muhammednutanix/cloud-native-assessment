/**
 * ============================================================
 * Cloud Native Readiness Assessment
 * Readiness Levels
 * ============================================================
 */

export const LEVELS = [
  {
    id: "L1",
    analyticsId: "FOUNDATION",

    minScore: 5,
    maxScore: 8,

    title: "Foundation Builder",

    subtitle: "Level 1",

    color: "#F59E0B",

    summary:
      "Operations are primarily manual, with limited standardization, automation and consistency across environments, but foundational cloud native capabilities are beginning to take shape.",

    recommendations: [
      "Standardize infrastructure management across environments.",
      "Introduce automation for repetitive operational tasks.",
      "Establish consistent operational processes.",
      "Create a roadmap for cloud native adoption.",
    ],
  },

  {
    id: "L2",
    analyticsId: "PLATFORM",

    minScore: 9,
    maxScore: 12,

    title: "Platform Operator",

    subtitle: "Level 2",

    color: "#3B82F6",

    summary:
      "Core operational practices are becoming more standardized, with growing use of automation and improved consistency across teams and platforms, but operational silos and process variations can still limit efficiency at scale.",

    recommendations: [
      "Expand automation across infrastructure and Kubernetes.",
      "Reduce manual provisioning activities.",
      "Adopt centralized operational standards.",
      "Improve operational consistency across teams.",
    ],
  },

  {
    id: "L3",
    analyticsId: "CLOUD_NATIVE",

    minScore: 13,
    maxScore: 16,

    title: "Cloud Native Operator",

    subtitle: "Level 3",

    color: "#14B8A6",

    summary:
      "Automation and standardized processes are well established, enabling more consistent management across infrastructure, Kubernetes and data services, but opportunities remain to further unify operations and simplify management across environments.",

    recommendations: [
      "Unify VM and Kubernetes operations.",
      "Expand self-service capabilities.",
      "Strengthen governance and platform engineering practices.",
      "Optimize operational workflows across environments.",
    ],
  },

  {
    id: "L4",
    analyticsId: "ENTERPRISE",

    minScore: 17,
    maxScore: 20,

    title: "Enterprise Ready Operator",

    subtitle: "Level 4",

    color: "#22C55E",

    summary:
      "Core capabilities are in place to support standardized operations, automation and scalable platform management across the enterprise, but continued optimization can help accelerate innovation, reduce operational complexity and support emerging workloads and future growth.",

    recommendations: [
      "Continue platform optimization.",
      "Expand developer self-service capabilities.",
      "Adopt AI-assisted platform operations.",
      "Prepare for next-generation cloud native workloads.",
    ],
  },
];
