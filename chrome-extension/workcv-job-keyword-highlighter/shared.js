(function (scope) {
  "use strict";

  var groups = {
    hard: [
      "account management", "administration", "agile", "auditing", "budget management",
      "business analysis", "business development", "cash handling", "change management",
      "clinical care", "compliance", "content creation", "contract management", "credit control",
      "crm", "customer service", "data analysis", "data entry", "digital marketing",
      "email marketing", "employee relations", "excel", "financial analysis",
      "financial reporting", "forecasting", "forklift", "fundraising", "google analytics",
      "health and safety", "inventory management", "javascript", "lead generation",
      "machine learning", "manual handling", "market research", "microsoft 365",
      "microsoft office", "microsoft teams", "networking", "nhs", "payroll", "power bi",
      "procurement", "project management", "python", "quality assurance", "recruitment",
      "risk assessment", "risk management", "safeguarding", "sage", "sales", "salesforce",
      "seo", "social media", "sql", "stakeholder management", "stock control",
      "supply chain", "tableau", "typescript", "warehouse management", "word", "wordpress"
    ],
    soft: [
      "adaptable", "analytical", "attention to detail", "collaborative", "communication",
      "confident", "creative", "customer focused", "customer-focused", "flexible",
      "independent", "initiative", "leadership", "negotiation", "organised", "organized",
      "problem solving", "problem-solving", "proactive", "reliable", "resilient",
      "results driven", "results-driven", "self motivated", "self-motivated",
      "team player", "time management"
    ],
    qualification: [
      "aat", "acca", "aca", "a level", "a-level", "btec", "cima", "cipd", "cpc",
      "cscs card", "dbs", "degree", "driving licence", "gcse", "hcpc", "hnd", "hnc",
      "iosh", "itil", "master's degree", "mba", "nebosh", "nmc", "nvq", "phd",
      "pmp", "prince2", "qts", "sia licence"
    ]
  };

  var actionTerms = {
    achieve: ["achieve", "achieved", "achieving"],
    analyse: ["analyse", "analysed", "analysing", "analyze", "analyzed", "analyzing"],
    build: ["build", "built", "building"],
    coordinate: ["coordinate", "coordinated", "coordinating"],
    create: ["create", "created", "creating"],
    deliver: ["deliver", "delivered", "delivering"],
    develop: ["develop", "developed", "developing"],
    drive: ["drive", "drove", "driven", "driving"],
    implement: ["implement", "implemented", "implementing"],
    improve: ["improve", "improved", "improving"],
    lead: ["lead", "led", "leading"],
    manage: ["manage", "managed", "managing"],
    monitor: ["monitor", "monitored", "monitoring"],
    negotiate: ["negotiate", "negotiated", "negotiating"],
    optimise: ["optimise", "optimised", "optimising", "optimize", "optimized", "optimizing"],
    organise: ["organise", "organised", "organising", "organize", "organized", "organizing"],
    prepare: ["prepare", "prepared", "preparing"],
    present: ["present", "presented", "presenting"],
    reduce: ["reduce", "reduced", "reducing"],
    report: ["report", "reported", "reporting"],
    resolve: ["resolve", "resolved", "resolving"],
    support: ["support", "supported", "supporting"],
    train: ["train", "trained", "training"]
  };

  var categoryLabels = {
    hard: "Skills and tools",
    soft: "Ways of working",
    qualification: "Qualifications",
    action: "Action verbs"
  };

  var definitions = Object.keys(groups).flatMap(function (category) {
    return groups[category].map(function (term) {
      return { term: term, label: term, category: category };
    });
  }).concat(Object.keys(actionTerms).flatMap(function (label) {
    return actionTerms[label].map(function (term) {
      return { term: term, label: label, category: "action" };
    });
  })).sort(function (a, b) {
    return b.term.length - a.term.length;
  });

  scope.WorkCVKeywordData = {
    definitions: definitions,
    categoryLabels: categoryLabels
  };
})(globalThis);
