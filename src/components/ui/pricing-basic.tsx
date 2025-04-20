
"use client";

import { Pricing } from "@/components/ui/pricing";

const demoPlans = [
  {
    name: "ONCE",
    price: "99",
    yearlyPrice: "99", // One-time payment remains the same
    period: "one-time",
    features: [
      "We build and deliver 1 automation for your use case",
      "Delivered with a simple interface (Airtable or Notion)",
      "Includes setup, configuration, and test run",
      "Great for proof-of-concept or small need"
    ],
    description: "One task, fully done-for-you.",
    buttonText: "Start with One Task",
    href: "https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY",
    isPopular: false,
  },
  {
    name: "AUTOMATE",
    price: "199",
    yearlyPrice: "159", 
    period: "per month",
    features: [
      "Custom AI Interface",
      "Get a tailored dashboard where you can interact with your agent and track its performance",
      "200 Monthly AI-Powered Actions",
      "Your agent can automate tasks like outreach, follow-ups, scheduling, content creation, CRM updates, alerts, and more — depending on its role",
      "Done-for-You Setup: No technical skills needed",
      "We build, connect, and launch your AI employee for you",
      "Ongoing Support & Improvements",
      "We provide continuous updates, monitoring, and hands-on support to keep your agent sharp and aligned with your business goals"
    ],
    description: "An AI assistant you can control.",
    buttonText: "Book a Demo",
    href: "https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY",
    isPopular: true,
  },
  {
    name: "INTEGRATE",
    price: "699",
    yearlyPrice: "559", // Added yearlyPrice property with 20% discount
    period: "per month",
    features: [
      "Custom-built workflows across departments",
      "Works with your stack (CRM, HR, project tools, etc.)",
      "Up to 1,000 automation actions/month",
      "Personalized onboarding, support & strategy",
      "SLA, reporting, and dedicated expert sessions"
    ],
    description: "Full-stack AI setup across your operations.",
    buttonText: "Talk to Our Team",
    href: "https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY",
    isPopular: false,
  },
];

function PricingBasic() {
  return (
    <div className="overflow-y-auto">
      <Pricing 
        plans={demoPlans}
        title="AI Automation Made Simple"
        description="Try risk-free with our 14-day trial"
      />
    </div>
  );
}

export { PricingBasic };

