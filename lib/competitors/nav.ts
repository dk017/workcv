// Names and paths only, for client components such as the site breadcrumbs, so they
// do not bundle the full comparison copy. tests/competitor-pages.test.ts keeps this in
// step with lib/competitors.
export const competitorNav = [
  { slug: "myperfectcv", name: "MyPerfectCV", altLabel: "MyPerfectCV", vsPath: "/workcv-vs-myperfectcv", altPath: "/myperfectcv-alternative-uk" },
  { slug: "zety", name: "Zety", altLabel: "Zety", vsPath: "/workcv-vs-zety", altPath: "/zety-alternative-uk" },
  { slug: "resume-io", name: "Resume.io", altLabel: "Resume.io", vsPath: "/workcv-vs-resume-io", altPath: "/resume-io-alternative-uk" },
  { slug: "livecareer", name: "LiveCareer", altLabel: "LiveCareer", vsPath: "/workcv-vs-livecareer", altPath: "/livecareer-alternative" },
  { slug: "canva", name: "Canva", altLabel: "Canva CV", vsPath: "/workcv-vs-canva", altPath: "/canva-cv-alternative-uk" },
  { slug: "cvmaker", name: "CVmaker", altLabel: "CVmaker", vsPath: "/workcv-vs-cvmaker", altPath: "/cvmaker-alternative" },
  { slug: "enhancv", name: "Enhancv", altLabel: "Enhancv", vsPath: "/workcv-vs-enhancv", altPath: "/enhancv-alternative-uk" },
  { slug: "kickresume", name: "Kickresume", altLabel: "Kickresume", vsPath: "/workcv-vs-kickresume", altPath: "/kickresume-alternative-uk" },
  { slug: "novoresume", name: "Novorésumé", altLabel: "Novorésumé", vsPath: "/workcv-vs-novoresume", altPath: "/novoresume-alternative-uk" },
  { slug: "standout-cv", name: "StandOut CV", altLabel: "StandOut CV", vsPath: "/workcv-vs-standout-cv", altPath: "/standout-cv-alternative-uk" },
  { slug: "cv-genius", name: "CV Genius", altLabel: "CV Genius", vsPath: "/workcv-vs-cv-genius", altPath: "/cv-genius-alternative-uk" },
  { slug: "flowcv", name: "FlowCV", altLabel: "FlowCV", vsPath: "/workcv-vs-flowcv", altPath: "/flowcv-alternative-uk" },
] as const;
