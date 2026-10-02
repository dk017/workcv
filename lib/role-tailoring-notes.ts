export const roleTailoringNotes: Record<string, { title: string; variants: [string, string][]; caution: string }> = {
  retail: {
    title: "Supermarket or product-advice role? Change the emphasis",
    variants: [["Supermarket and stock duties", "Lead with a real example of checking labels, organising items or following a replenishment routine. Include till work only if you have done it."], ["Customer-facing product advice", "Lead with how you found out what a customer needed, explained an option and checked something you did not know. Do not invent product expertise or sales results."]],
    caution: "Keep the same employers and dates. For a first shop job, use the school or volunteering setting honestly; availability must fit your actual circumstances.",
  },
  warehouse: {
    title: "Picking and packing or goods-in? Choose relevant evidence",
    variants: [["Picking and packing", "Show how you checked an item against a list, followed a sequence and reported a mismatch. Name scanners or warehouse systems only if you have used them."], ["Goods-in and stock checks", "Lead with checking quantities or labels, recording differences and passing a clear handover. A volunteering example is useful when its setting is stated."]],
    caution: "Equipment awareness is not a forklift qualification. Check each advert's training, licence, shift and physical-task requirements against your own situation.",
  },
  "customer-service": {
    title: "Contact centre or shop floor? Use the right customer example",
    variants: [["Contact centre", "If true, lead with telephone or written enquiries, accurate case notes and escalation. Name only the CRM and channels you have actually used."], ["Shop-floor service", "Lead with face-to-face listening, explaining alternatives and coordinating with colleagues. Do not turn helping in a shop into telephone complaint-handling experience."]],
    caution: "A strong example explains what you checked, what you said and what happened next. Keep a result qualitative if you cannot support a percentage or target.",
  },
  "care-worker": {
    title: "Match the care setting without overstating your training",
    variants: [["Residential care", "If part of your experience, emphasise agreed routines, respecting preferences, recording observations and sharing information at handover."], ["First care role or home-care application", "Use genuine listening, reliability or community-volunteering evidence. Explain the setting and your boundaries. For home visits, address travel and availability only if relevant and accurate."]],
    caution: "Helping a relative or volunteering is not a clinical qualification. Do not claim medication administration, moving-and-handling training or safeguarding certification unless you actually have the stated training or responsibility.",
  },
  student: {
    title: "One education history, different first-job applications",
    variants: [["Part-time customer role", "Lead with a real event, club or volunteering example where you helped someone and explained information clearly."], ["Office or project-support role", "Lead with checking a list, organising a group task or using a spreadsheet. State the actual tools and level of skill; a class project is not paid administration work."]],
    caution: "Keep qualifications and expected completion dates accurate. A single saved CV may be sufficient if you are happy to revise it; separate versions help you retain what you sent to each employer.",
  },
};
