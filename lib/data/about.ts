export const VALUES = [
  {
    heading: 'Transparency',
    body: 'We show you our margin next to the MCX rate. Every time. You always know exactly how your payment is calculated — nothing hidden.',
  },
  {
    heading: 'Fairness',
    body: 'You know the formula. No hidden deductions, no surprise charges. The offer is derived openly from live market data.',
  },
  {
    heading: 'Dignity',
    body: 'No judgment. No pressure. Your gold, your decision. You are free to walk away at any point — no forms, no fees.',
  },
  {
    heading: 'Reliability',
    body: 'Same certified XRF process at all our branches. Same MCX-linked rate. Same promise everywhere, every day.', // was: all 16 branches
  },
] as const;

export const CITIES = [
  { name: 'Bangalore', branches: 2,  href: '/sell-gold-bangalore', comingSoon: false },
  { name: 'Mysore',    branches: 0,  href: '/sell-gold-mysore',    comingSoon: true  },
  { name: 'Mangalore', branches: 0,  href: '/sell-gold-mangalore', comingSoon: true  },
  { name: 'Davangere', branches: 0,  href: '/sell-gold-davangere', comingSoon: true  },
] as const;
