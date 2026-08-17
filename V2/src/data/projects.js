import project1 from "../assets/project_1.jpg";
import project2 from "../assets/project_2.jpg";
import project3 from "../assets/project_3.jpg";

export const projects = [
  {
    slug: "synergy-analytics",
    title: "Synergy Analytics",
    description: "A real-time analytics engine and dashboard visualizing user flows, conversions, and revenue metrics across multi-tenant SaaS structures.",
    stack: ["React", "Node.js", "Express", "MongoDB", "GSAP"],
    image: project1,
    url: "https://github.com/AbishekR05/synergy-analytics"
  },
  {
    slug: "sentinel-gateway",
    title: "Sentinel Gateway",
    description: "High-performance API Gateway with custom rate limiting, JWT verification, and dynamic routing resolving up to 10k requests per second.",
    stack: ["Flask", "Python", "Redis", "Docker", "Node.js"],
    image: project2,
    url: "https://github.com/AbishekR05/sentinel-gateway"
  },
  {
    slug: "helix-sync",
    title: "Helix Sync",
    description: "Globally distributed document database replication controller ensuring active-active conflict resolution and high availability.",
    stack: ["Next.js", "React", "MongoDB", "Express", "Node.js"],
    image: project3,
    url: "https://github.com/AbishekR05/helix-sync"
  }
];
