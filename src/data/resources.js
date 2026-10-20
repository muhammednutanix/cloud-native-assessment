/**
 * ============================================================
 * Cloud Native Readiness Assessment
 * Personalized Resources
 * ============================================================
 */

const MAPPED_SOLUTIONS = [
  {
    type: "PRODUCT",
    title: "Nutanix Kubernetes Platform",
    description:
      "Explore a complete and open enterprise Kubernetes platform that can run anywhere.",
    url: "https://www.nutanix.com/products/kubernetes-management-platform",
  },
  {
    type: "PRODUCT",
    title: "Nutanix Data Services",
    description:
      "Extend data services to containerized apps and simplify data management.",
    url: "https://www.nutanix.com/products/data-services-for-kubernetes",
  },
  {
    type: "SOLUTION",
    title: "Nutanix Cloud Native Solution",
    description:
      "Run your workloads on a full-stack, enterprise platform for containers and VMs.",
    url: "https://www.nutanix.com/solutions/cloud-native",
  },
];

export const RESOURCES = {
  L1: {
    mappedSolutions: MAPPED_SOLUTIONS,
    nextStep: {
      title: "Ready to accelerate your journey?",
      description:
        "Get a personalized roadmap session with a Nutanix cloud native architect.",
    },

    cta: {
      title: "Ready to accelerate your journey?",
      button: "Speak with an Expert",
    },

    solution: {
      title: "How to Level Up",
      description:
        "Minimize operational fragmentation by unifying VM and container management under a single, cohesive operating model.",
    },

    resources: [
      {
        type: "E-Book",
        title:
          "From Chaos to Control: A Cloud Native Strategy Guide for IT Leaders.",
        action: "Read eBook →",
        url: "https://www.nutanix.com/go/cloud-native-strategy-guide-for-it-leaders",
      },
      {
        type: "Blog",
        title:
          "The High Cost of Free: Why DIY Kubernetes Breaks Down in Production",
        action: "Read Blog →",
        url: "https://www.nutanix.com/tech-center/blog/the-high-cost-of-free-why-diy-kubernetes-breaks-down-in-production",
      },
      {
        type: "Video",
        title: "Unified VM & Kubernetes Operations with Nutanix",
        action: "Watch Demo →",
        url: "https://www.nutanix.com/tech-center/blog/unified-vm-k8s-operations",
      },
    ],
  },

  L2: {
    mappedSolutions: MAPPED_SOLUTIONS,
    nextStep: {
      title: "Ready to accelerate your journey?",
      description:
        "Get a personalized roadmap session with a Nutanix cloud native architect.",
    },

    cta: {
      title: "Ready to accelerate your journey?",
      button: "Speak with an Expert",
    },

    solution: {
      title: "How to Level Up",
      description:
        "Transition from partial automation to declarative, fleet-wide cluster management across your enterprise.",
    },

    resources: [
      {
        type: "E-Book",
        title: "What It Takes to Build a Production‑Ready Kubernetes Platform",
        action: "Read eBook →",
        url: "https://www.nutanix.com/library/ebooks/kubernetes-in-production",
      },
      {
        type: "Blog",
        title: "The Modern App Paradox: Why Your App Containers Are So Heavy",
        action: "Read Blog →",
        url: "https://www.nutanix.com/tech-center/blog/the-modern-app-paradox-why-your-app-containers-are-so-heavy",
      },
      {
        type: "Video",
        title:
          "Consistent Hybrid Multicloud Kubernetes experience for Platform Engineers and Developers",
        action: "Watch Video →",
        url: "https://www.youtube.com/watch?v=VKZtB0WUE2A",
      },
    ],
  },

  L3: {
    mappedSolutions: MAPPED_SOLUTIONS,
    nextStep: {
      title: "Ready to accelerate your journey?",
      description:
        "Get a personalized roadmap session with a Nutanix cloud native architect.",
    },

    cta: {
      title: "Ready to accelerate your journey?",
      button: "Speak with an Expert",
    },

    solution: {
      title: "How to Level Up",
      description:
        "Streamline day-2 operations by implementing automated, zero-downtime upgrades across your entire Kubernetes cluster fleet.",
    },

    resources: [
      {
        type: "E-Book",
        title: "Cloud Native Playbook for Platform Engineers",
        action: "Read eBook →",
        url: "https://www.nutanix.com/library/ebooks/cloud-native-playbook-for-platform-engineers",
      },
      {
        type: "Blog",
        title:
          "Operationalizing Kubernetes: Why the Future Belongs to Full-Stack Platforms",
        action: "Read Blog →",
        url: "https://www.nutanix.com/blog/operationalizing-kubernetes",
      },
      {
        type: "Video",
        title: "Kubernetes Lifecycle Management with NKP and Cluster API",
        action: "Watch Video →",
        url: "https://www.youtube.com/watch?v=jT6N2c32ETE",
      },
    ],
  },

  L4: {
    mappedSolutions: MAPPED_SOLUTIONS,
    nextStep: {
      title: "Ready to accelerate your journey?",
      description:
        "Get a personalized roadmap session with a Nutanix cloud native architect.",
    },

    cta: {
      title: "Ready to accelerate your journey?",
      button: "Speak with an Expert",
    },

    solution: {
      title: "How to Level Up",
      description:
        "Strengthen platform resilience with robust, full-stack software-defined networking, microsegmentation, and zero-trust security policies across all containerized and VM workloads.",
    },

    resources: [
      {
        type: "E-Book",
        title: "The Definitive Guide to Enterprise Cloud Native Deployment",
        action: "Read eBook →",
        url: "https://www.nutanix.com/library/ebooks/definitive-guide-to-cloud-native",
      },
      {
        type: "Blog",
        title:
          "Networking and Security for Full Stack NKP Production Grade Containerization",
        action: "Read Blog →",
        url: "https://next.nutanix.com/community-blog-154/networking-and-security-for-full-stack-nkp-production-grade-containerization-45228",
      },
      {
        type: "Video",
        title: "What Comes After: Day 2 Kubernetes Done Right",
        action: "Watch Video →",
        url: "https://www.nutanix.com/viewer/go/what-comes-after-day-2-kubernetes-done-right",
      },
    ],
  },
};
