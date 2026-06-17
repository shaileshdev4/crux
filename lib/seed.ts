import { Decision } from "@/lib/types";

const d = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 86_400_000).toISOString();

/** Sample ledger: four months of a founding PM - tuned so the mirror tells a story. */
export const SAMPLE_LEDGER: Decision[] = [
  {
    id: "s1",
    question: "Should we open-source the core SDK before Series A?",
    options: [
      {
        label: "Keep it closed until post-raise",
        aiRecommended: true,
        chosen: false,
        provenance: "ai",
      },
      {
        label: "Open-source now for distribution",
        chosen: true,
        provenance: "human",
      },
    ],
    reasons: ["Community pull is real", "Competitors already leaking features"],
    aiStance: "overrode",
    confidence: 72,
    category: "strategy",
    committedAt: d(118),
    revisitAt: d(73),
    outcome: "better",
    resolvedAt: d(70),
    note: "Three enterprise pilots came inbound within six weeks.",
    isSample: true,
  },
  {
    id: "s2",
    question: "Hire the senior backend candidate with the flashy resume?",
    options: [
      { label: "Make the offer", chosen: true, provenance: "human" },
      {
        label: "Keep searching - culture fit is shaky",
        aiRecommended: true,
        provenance: "ai",
      },
    ],
    reasons: ["We need velocity", "They shipped at scale before"],
    aiStance: "overrode",
    confidence: 78,
    category: "hiring",
    committedAt: d(105),
    revisitAt: d(60),
    outcome: "worse",
    resolvedAt: d(58),
    note: "Left after 11 weeks. The AI was right about people.",
    isSample: true,
  },
  {
    id: "s3",
    question: "Raise prices 20% for new customers this quarter?",
    options: [
      {
        label: "Raise now",
        aiRecommended: true,
        chosen: true,
        provenance: "ai",
      },
      { label: "Hold pricing through Q2", provenance: "human" },
    ],
    reasons: ["Usage grew but NRR flat", "Support costs up"],
    aiStance: "followed",
    confidence: 65,
    category: "pricing",
    committedAt: d(98),
    revisitAt: d(53),
    outcome: "expected",
    resolvedAt: d(50),
    isSample: true,
  },
  {
    id: "s4",
    question: "Pivot messaging to 'AI ops' or stay on decision intelligence?",
    options: [
      {
        label: "Stay on decision intelligence",
        chosen: true,
        provenance: "human",
      },
      {
        label: "Pivot to AI ops positioning",
        aiRecommended: true,
        provenance: "ai",
      },
    ],
    reasons: ["Our wedge is accountability", "Ops is crowded"],
    aiStance: "overrode",
    confidence: 81,
    category: "strategy",
    committedAt: d(88),
    revisitAt: d(43),
    outcome: "better",
    resolvedAt: d(40),
    isSample: true,
  },
  {
    id: "s5",
    question: "Promote the IC PM to lead the growth squad?",
    options: [
      { label: "Promote now", chosen: true, provenance: "human" },
      {
        label: "Run a 90-day acting period first",
        aiRecommended: true,
        provenance: "ai",
      },
    ],
    reasons: ["They already run the roadmap", "Morale risk if we wait"],
    aiStance: "overrode",
    confidence: 70,
    category: "hiring",
    committedAt: d(76),
    revisitAt: d(31),
    outcome: "worse",
    resolvedAt: d(28),
    isSample: true,
  },
  {
    id: "s6",
    question: "Ship the v2 API rewrite or patch the monolith?",
    options: [
      {
        label: "Patch the monolith",
        aiRecommended: true,
        chosen: true,
        provenance: "ai",
      },
      { label: "Full rewrite", provenance: "human" },
    ],
    reasons: ["Incidents are manageable", "Rewrite would slip the launch"],
    aiStance: "followed",
    confidence: 58,
    category: "engineering",
    committedAt: d(70),
    revisitAt: d(25),
    outcome: "expected",
    resolvedAt: d(22),
    isSample: true,
  },
  {
    id: "s7",
    question: "Take the acquihire meeting seriously?",
    options: [
      {
        label: "Decline and stay independent",
        chosen: true,
        provenance: "human",
      },
      {
        label: "Explore - terms could fund runway",
        aiRecommended: true,
        provenance: "ai",
      },
    ],
    reasons: ["We're not done", "Market window is now"],
    aiStance: "overrode",
    confidence: 85,
    category: "strategy",
    committedAt: d(62),
    revisitAt: d(17),
    outcome: "better",
    resolvedAt: d(14),
    isSample: true,
  },
  {
    id: "s8",
    question: "Hire the referral from our investor?",
    options: [
      {
        label: "Pass - weak portfolio",
        aiRecommended: true,
        chosen: true,
        provenance: "ai",
      },
      { label: "Hire for relationship capital", provenance: "human" },
    ],
    reasons: ["Interview was thin", "Role needs depth"],
    aiStance: "followed",
    confidence: 62,
    category: "hiring",
    committedAt: d(55),
    revisitAt: d(10),
    outcome: "expected",
    resolvedAt: d(8),
    isSample: true,
  },
  {
    id: "s9",
    question: "Launch paid ads before product-led motion works?",
    options: [
      {
        label: "Wait for PLG",
        aiRecommended: true,
        chosen: true,
        provenance: "ai",
      },
      { label: "Spend on ads now", provenance: "human" },
    ],
    reasons: ["Activation still leaky", "CAC unknown"],
    aiStance: "followed",
    confidence: 55,
    category: "marketing",
    committedAt: d(48),
    revisitAt: d(3),
    outcome: "better",
    resolvedAt: d(1),
    isSample: true,
  },
  {
    id: "s10",
    question: "Add a free tier or stay invite-only?",
    options: [
      { label: "Stay invite-only", chosen: true, provenance: "human" },
      {
        label: "Add free tier for top-of-funnel",
        aiRecommended: true,
        provenance: "ai",
      },
    ],
    reasons: ["Quality of first users matters", "Support isn't ready"],
    aiStance: "overrode",
    confidence: 74,
    category: "product",
    committedAt: d(40),
    revisitAt: null,
    outcome: null,
    resolvedAt: null,
    isSample: true,
  },
];

export const EXAMPLE_CONVERSATIONS: { title: string; text: string }[] = [
  {
    title: "Hiring call",
    text: `Me: I'm leaning toward making an offer to Jordan. Strong systems background, shipped payments at scale.

Assistant: I'd be cautious. In the transcript they dodge questions about conflict and blame prior teams. Your bar for early hires is culture carriers - I'd keep searching unless you see ownership in the next round.

Me: Fair, but we're underwater on backend. I'm gonna make the offer Monday - we can coach the gaps.`,
  },
  {
    title: "Pricing move",
    text: `Me: Should we bump new-customer pricing 20% this quarter?

Assistant: Yes - your usage grew 40% but NRR is flat. A measured increase with grandfathering is reasonable. I'd target 15-20%.

Me: Done. 20% from April 1, existing customers locked.`,
  },
];
