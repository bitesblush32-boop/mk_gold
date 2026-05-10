export interface HowToStep {
  name: string;
  text: string;
}

export function howToSchema(steps: HowToStep[], name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
