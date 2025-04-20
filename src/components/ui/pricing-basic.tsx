
"use client";

import { Pricing } from "@/components/ui/pricing";

const demoPlans = [
  {
    name: "STARTER",
    price: "99",
    yearlyPrice: "79",
    period: "per month",
    features: [
      "1 AI Employee (of your choice)",
      "Up to 50 automated actions per month",
      "Dedicated interface",
      "Standard support (48h response time)",
      "Knowledge base access"
    ],
    description: "Perfect for solo founders who want to automate a specific business task.",
    buttonText: "Book a Demo",
    href: "https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY",
    isPopular: false,
  },
  {
    name: "GROWTH",
    price: "199",
    yearlyPrice: "159",
    period: "per month",
    features: [
      "Up to 3 active AI Employees",
      "Up to 200 automated actions per month",
      "Custom interfaces for each use case",
      "Priority support (24h)",
      "Usage dashboard",
      "Monthly performance review"
    ],
    description: "For startups and growing teams ready to scale with automation.",
    buttonText: "Book a Demo",
    href: "https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY",
    isPopular: true,
  },
  {
    name: "SCALE",
    price: "699",
    yearlyPrice: "559",
    period: "per month",
    features: [
      "Full access to the AI Employee suite",
      "Up to 1,000 automated actions per month",
      "Integration with your internal tools",
      "Dedicated support team",
      "Personalized onboarding",
      "Secure multi-user access",
      "Monthly strategy calls"
    ],
    description: "For businesses ready to fully integrate AI into their operations.",
    buttonText: "Book a Demo",
    href: "https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY",
    isPopular: false,
  },
];

function PricingBasic() {
  return (
    <div className="overflow-y-auto">
      <Pricing 
        plans={demoPlans}
        title="AI Employees at 1/10 the Cost"
        description="5x Return on Investment - All plans include a 14-day free trial"
      />
    </div>
  );
}

export { PricingBasic };
