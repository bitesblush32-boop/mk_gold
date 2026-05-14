export const HOW_TO_STEPS = [
  {
    name: 'Walk In',
    text: 'Visit any MK Gold branch — no appointment needed. Open Monday to Saturday, 9:30 AM to 7:00 PM.',
  },
  {
    name: 'Weigh Your Gold',
    text: 'We weigh your gold on certified digital scales. The exact weight is shown to you openly — no hidden deductions.',
  },
  {
    name: 'XRF Purity Test',
    text: "Our Bruker S1 Titan XRF spectrometer reads your gold's exact purity in under 2 minutes. Non-destructive — no acid, no scratching.",
  },
  {
    name: 'See Your Quote',
    text: "We show you today's live MCX rate and our buying rate side by side. No hidden calculations — you see exactly how your price is arrived at.",
  },
  {
    name: 'Accept or Walk Away',
    text: 'No pressure. If you are not satisfied with the offer, you are free to leave. No fees charged, no forms filled.',
  },
  {
    name: 'Receive Payment',
    text: 'Accept the offer and receive payment immediately — cash, NEFT, or UPI. Most customers leave within 45 minutes of walking in.',
  },
];

export const GOLD_TYPES = [
  {
    title: 'Gold Jewellery',
    purities: ['18K', '20K', '22K', '24K'] as string[],
    desc: 'Any design, any age, any jeweller. Necklaces, bangles, rings, earrings, chains. Condition does not reduce your price.',
  },
  {
    title: 'Gold Coins',
    purities: ['24K', '22K'] as string[],
    desc: 'Bank coins, jeweller coins, government minted coins. Any denomination from 1g to 100g.',
  },
  {
    title: 'Gold Bars',
    purities: ['24K', '22K'] as string[],
    desc: 'MMTC-PAMP, Malabar, Tanishq, or any assay-card bar. Any weight from 5g to 1kg.',
  },
  {
    title: 'Broken Gold',
    purities: ['18K', '20K', '22K', '24K'] as string[],
    desc: 'Bent, broken, melted, or damaged pieces. We test actual purity and pay accordingly — no penalty for condition.',
  },
];

export const PAYMENT_METHODS = [
  {
    method: 'Cash',
    limit: 'Up to ₹1,99,999',
    detail: 'Counted in front of you. Ready immediately on acceptance.',
  },
  {
    method: 'NEFT / RTGS',
    limit: 'No upper limit',
    detail: 'Bank transfer for larger amounts. Credited within 2 hours.',
  },
  {
    method: 'UPI',
    limit: 'Up to ₹1,00,000',
    detail: 'Instant transfer to any UPI ID. Works with all UPI apps.',
  },
] as const;

export const REQUIRED_DOCS = [
  'Aadhaar Card',
  'PAN Card',
  'Passport',
  'Voter ID',
  'Driving Licence',
] as const;

export const NOT_NEEDED = [
  'Original purchase receipt',
  'Hallmark certificate',
  'Box or original packaging',
  'Purchase invoice',
  'Appointment or prior booking',
] as const;
