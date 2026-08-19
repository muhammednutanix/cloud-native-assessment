/**
 * ============================================================
 * Cloud Native Readiness Assessment
 * Questions
 * ============================================================
 */

export const QUESTIONS = [
  {
    id: "modernization",
    analyticsId: "PM",
    title: "Platform Modernization",
    question: "What does your infrastructure look like today?",
    description:
      "Select the option that best reflects your current application environment.",

    options: [
      {
        id: 1,
        label: "Primarily VMs",
        score: 1,
      },
      {
        id: 2,
        label: "Mix VMs & Containers",
        score: 2,
      },
      {
        id: 3,
        label: "Primarily Kubernetes",
        score: 3,
      },
      {
        id: 4,
        label: "Unified Platform",
        score: 4,
      },
    ],
  },

  {
    id: "automation",
    analyticsId: "FA",
    title: "Fleet Automation",
    question: "How are multiple clusters managed across your enterprise?",
    description:
      "Select the option that best describes your operational model.",

    options: [
      {
        id: 1,
        label: "Mostly manual",
        score: 1,
      },
      {
        id: 2,
        label: "Partially automated",
        score: 2,
      },
      {
        id: 3,
        label: "Standard processes",
        score: 3,
      },
      {
        id: 4,
        label: "Fully automated",
        score: 4,
      },
    ],
  },

  {
    id: "consistency",
    analyticsId: "OC",
    title: "Operational Consistency",
    question:
      "How consistent are operations across datacenter, public cloud and edge?",
    description: "Consider deployment, monitoring and operational workflows.",

    options: [
      {
        id: 1,
        label: "Mostly manual",
        score: 1,
      },
      {
        id: 2,
        label: "Different by environment",
        score: 2,
      },
      {
        id: 3,
        label: "Mostly standardized",
        score: 3,
      },
      {
        id: 4,
        label: "Consistent everywhere",
        score: 4,
      },
    ],
  },

  {
    id: "standardization",
    analyticsId: "PS",
    title: "Platform Standardization",
    question:
      "How consistent are operational standards across Kubernetes, infrastructure and data management?",
    description: "Think about governance, tooling and operational standards.",

    options: [
      {
        id: 1,
        label: "Ad-hoc",
        score: 1,
      },
      {
        id: 2,
        label: "Fragmented",
        score: 2,
      },
      {
        id: 3,
        label: "Mostly centralized",
        score: 3,
      },
      {
        id: 4,
        label: "Unified platform",
        score: 4,
      },
    ],
  },

  {
    id: "agility",
    analyticsId: "BA",
    title: "Business Agility & Scale",
    question: "How fast can your organization roll out major new initiatives?",
    description: "Consider provisioning, deployment and operational speed.",

    options: [
      {
        id: 1,
        label: "Slow — major manual effort",
        score: 1,
      },
      {
        id: 2,
        label: "Moderate — some bottlenecks",
        score: 2,
      },
      {
        id: 3,
        label: "Fast — standardized templates & pipelines",
        score: 3,
      },
      {
        id: 4,
        label: "Immediate — seamlessly",
        score: 4,
      },
    ],
  },
];
