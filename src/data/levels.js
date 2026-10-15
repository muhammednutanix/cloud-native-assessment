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
      "You have established the core foundation for your cloud native journey, but operational fragmentation and manual processes result in significant friction. Managing virtual machines, early Kubernetes clusters, and data services in separate silos can bog down your team with repetitive administrative tasks, slowing overall delivery speed.",

    recommendations: [
      "Minimize operational fragmentation by unifying VM and container management under a single, cohesive operating model.",
      "Replace manual, step-by-step provisioning with standardized, automated infrastructure templates.",
      "Centralize core governance and storage policies to maintain control and performance across all deployments.",
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
      "You are actively scaling cloud native workloads, but managing isolated clusters and varied operating models across different teams or locations is creating operational overhead. Bridging these environments with standardized automation will unlock true multicluster agility without increasing administrative overhead.",

    recommendations: [
      "Transition from partial automation to declarative, fleet-wide cluster management across your enterprise.",
      "Implement unified data management policies, so stateful Kubernetes applications share the same enterprise resiliency as your VMs.",
      "Standardize deployment blueprints to reduce environment-specific bottlenecks when rolling out new applications.",
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
      "Your organization operates with high consistency, and is now ready to transition from automation to policy-driven scaling and security. By integrating governance directly into your workflows, you can expand rapidly while still adhering to your enterprise standards for compliance and protection.",

    recommendations: [
      "Streamline day-2 operations by implementing automated, zero-downtime upgrades across your entire Kubernetes cluster fleet.",
      "Extend policy-driven data protection, continuous snapshots, and instant disaster recovery to all modern application workloads.",
      "Unify security policies and infrastructure governance to enforce compliance consistently across every environment.",
    ],
  },

  {
    id: "L4",
    analyticsId: "ENTERPRISE",

    minScore: 17,
    maxScore: 20,

    title: "Enterprise Ready",

    subtitle: "Level 4",

    color: "#22C55E",

    summary:
      "You operate a unified enterprise platform with fleet-level automation and consistency across environments. Your operational foundation is already optimized, so now your goal is to ease scalability across distributed environments, by leveraging intelligent operations to refine complex workflows, increase lifecycle automation, and continuously optimize processes.",

    recommendations: [
      "Strengthen platform resilience with robust, full-stack software-defined networking, microsegmentation, and zero-trust security policies across all containerized and VM workloads.",
      "Optimize operational efficiency with intelligent capabilities to standardize management for fleets of clusters.",
      "Accelerate next-generation AI/ML and stateful application deployment, using zero-friction self-service infrastructure blueprints.",
    ],
  },
];
