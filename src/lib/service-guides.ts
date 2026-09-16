export const serviceGuides: Record<string, { fit: string; example: string; steps: { title: string; body: string }[] }> = {
  "business-analysis": {
    fit: "For teams planning a new product, improving an internal process, or aligning stakeholders before investing in development.",
    example: "A customer onboarding review with current and future process maps, agreed business requirements, user stories, acceptance criteria, and a prioritized implementation backlog.",
    steps: [
      { title: "Understand the business", body: "Interview stakeholders, review existing workflows and data, and agree on the problem, constraints, and measures of success." },
      { title: "Define the requirements", body: "Map the future process and document business rules, user needs, dependencies, and acceptance criteria with the people responsible for delivery." },
      { title: "Agree on the next steps", body: "Prioritize by business value, effort, and risk, validate the scope with stakeholders, and prepare a roadmap the team can act on." },
    ],
  },
  "digital-marketing": {
    fit: "For businesses that need their website, content, search and campaigns to work toward the same commercial goal.",
    example: "A connected launch plan: audience priorities, a channel calendar, campaign messages, landing-page recommendations and a measurement framework.",
    steps: [
      { title: "Find the starting point", body: "Review your audience, current channels and customer journey to identify gaps and decide what deserves attention first." },
      { title: "Build the channel plan", body: "Give each channel a clear job, with messages, creative requirements and a practical publishing sequence." },
      { title: "Learn and refine", body: "Agree on meaningful events to measure, review the evidence and use it to shape the next round of work." },
    ],
  },
  "websites-web-apps": {
    fit: "For teams launching a new website, replacing a difficult-to-manage site or turning a product idea into a useful web application.",
    example: "A responsive service website with a reusable design system, editable content, inquiry forms and a clear launch handover.",
    steps: [
      { title: "Map the experience", body: "Define the users, key tasks, page structure and content needs before moving into interface design." },
      { title: "Design and develop", body: "Build responsive layouts and reusable components around real content, with accessible controls and clear interaction states." },
      { title: "Test and hand over", body: "Review performance, forms and device layouts, then document the content workflow and agreed maintenance needs." },
    ],
  },
  seo: {
    fit: "For businesses whose useful services and expertise are hard to discover through search, or whose content needs a clearer structure.",
    example: "A search roadmap connecting keyword intent to service pages, supporting articles, internal links and technical fixes.",
    steps: [
      { title: "Audit and prioritize", body: "Review crawlability, indexation, site structure and existing content to build a prioritized list of opportunities." },
      { title: "Match content to intent", body: "Map relevant questions to pages, develop useful briefs and improve titles, headings and internal links." },
      { title: "Measure search visibility", body: "Use agreed search and analytics data to review discovery and inquiries. Rankings and traffic improvements are never guaranteed." },
    ],
  },
  "social-media": {
    fit: "For brands that need a consistent social presence, stronger creative direction or a repeatable approach to producing useful content.",
    example: "A monthly content system with themes, post concepts, captions, short-form video briefs and a publishing calendar.",
    steps: [
      { title: "Set the editorial direction", body: "Define who the content serves, the voice it uses and the themes that give people a reason to follow." },
      { title: "Create the content", body: "Translate the plan into platform-specific posts, stories and video briefs with a recognizable visual language." },
      { title: "Publish and listen", body: "Agree on approvals and publishing responsibilities, then use audience responses to improve the next content cycle." },
    ],
  },
  "paid-media": {
    fit: "For businesses with a clear offer and a useful destination page that want to test paid acquisition with a defined budget.",
    example: "A campaign test plan with audience hypotheses, creative variations, landing-page alignment and conversion-event checks.",
    steps: [
      { title: "Prepare the test", body: "Clarify the offer, budget and audience, then check that the landing page and measurement setup support the campaign." },
      { title: "Launch creative variations", body: "Develop distinct messages and assets to test what resonates, with clear approval and spending boundaries." },
      { title: "Review and optimize", body: "Compare the agreed indicators and improve targeting, creative and the destination. Advertising spend is scoped separately." },
    ],
  },
  "brand-content": {
    fit: "For businesses whose story, voice and visual content no longer reflect the quality of what they offer.",
    example: "A practical brand toolkit with positioning, message hierarchy, voice guidance and adaptable content templates.",
    steps: [
      { title: "Clarify the story", body: "Understand the audience, offer and distinct point of view, then establish a message hierarchy people can understand." },
      { title: "Shape the expression", body: "Develop a coherent voice and visual direction across website copy, editorial imagery and campaign content." },
      { title: "Make it repeatable", body: "Document the principles and create useful templates so future content stays consistent without feeling repetitive." },
    ],
  },
};
