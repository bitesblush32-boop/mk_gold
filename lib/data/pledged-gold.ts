export const HOW_IT_WORKS = [
  {
    n: '1',
    title: 'Share your loan details',
    desc: 'Tell us the outstanding loan amount, the name of your lender, and the branch. We handle everything from there. Nothing is shared with anyone without your consent.',
  },
  {
    n: '2',
    title: 'We visit the lender together',
    desc: "We go to your lender's branch with you. The outstanding amount is paid directly to the lender, in your presence. You see every transaction happen.",
  },
  {
    n: '3',
    title: 'Your gold is released',
    desc: "The lender releases your gold to you. We then complete our purchase and you receive the balance — the difference between the gold's value and your outstanding loan.",
  },
] as const;

export const LENDERS = [
  'SBI', 'ICICI Bank', 'HDFC Bank', 'Axis Bank', 'Kotak Mahindra',
  'Muthoot Finance', 'Manappuram Finance', 'IIFL Finance',
  'Federal Bank', 'South Indian Bank', 'Karnataka Bank', 'Canara Bank',
  'Union Bank', 'Bank of Baroda', 'Indian Bank', 'Ujjivan',
  'All local NBFCs',
] as const;

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
