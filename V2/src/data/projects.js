import project1 from "../assets/project_1.jpg";
import project2 from "../assets/project_2.jpg";
import project3 from "../assets/project_3.jpg";

export const projects = [
  {
    slug: "nifty-50-ml-trading",
    title: "NIFTY 50 ML Trading",
    description: "Engineered an end-to-end XGBoost pipeline with feature engineering, time-series validation, and SHAP explainability to generate NIFTY 50 trading signals.",
    stack: ["Python", "Scikit-learn", "XGBoost", "yfinance"],
    image: project1,
    url: "https://github.com/AbishekR05"
  },
  {
    slug: "live-subtitle-gen",
    title: "Live Subtitle Gen",
    description: "Developed an offline real-time subtitle generator with English-Tamil translation, transparent overlay, sentiment-aware captioning, profanity filtering, and subtitle export.",
    stack: ["React.js", "Electron", "Flask", "Faster-Whisper"],
    image: project2,
    url: "https://github.com/AbishekR05"
  },
  {
    slug: "ai-integrated-ide",
    title: "AI Integrated IDE",
    description: "Built a multi-language online IDE with AI-assisted code explanation and execution support for Java, Python, and C via Judge0 API.",
    stack: ["React.js", "Node.js", "Express.js", "Judge0 API"],
    image: project3,
    url: "https://github.com/AbishekR05"
  }
];
