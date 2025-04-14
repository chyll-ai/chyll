
"use client";

import { Pricing } from "@/components/ui/pricing";

const demoPlans = [
  {
    name: "STARTER",
    price: "99",
    yearlyPrice: "79",
    period: "per month",
    features: [
      "Reviews AI: Reputation on Auto-Pilot",
      "Content AI: Cure to Blank Pages",
      "Funnel AI: High-Converting Pages",
      "Basic analytics",
      "48-hour support response time"
    ],
    description: "Designed for solo founders and small teams who want to automate the basics without friction.",
    buttonText: "Book a Demo",
    href: "https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY",
    isPopular: false,
  },
  {
    name: "PROFESSIONAL",
    price: "199",
    yearlyPrice: "159",
    period: "per month",
    features: [
      "Everything in Starter",
      "Workflow AI: Your Automation Weapon",
      "Conversation AI: Natural Live Chat",
      "Advanced analytics",
      "24-hour support response time",
      "Team collaboration"
    ],
    description: "Built for growing businesses ready to scale customer interactions and marketing efforts with smart automation.",
    buttonText: "Book a Demo",
    href: "https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY",
    isPopular: true,
  },
  {
    name: "EXPERT",
    price: "699",
    yearlyPrice: "559",
    period: "per month",
    features: [
      "Everything in Pro",
      "Voice AI: Never Miss a Call",
      "Custom AI Setup & Strategy",
      "White-Glove Onboarding + Priority Support",
      "Monthly Strategy Calls + Performance Reviews",
      "SSO Authentication",
      "Advanced security",
      "Custom contracts"
    ],
    description: "For high-volume teams needing full AI integration, advanced workflows, and always-on voice communication.",
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
        description="5x Return on Investment"
      />
    </div>
  );
}

export { PricingBasic };
