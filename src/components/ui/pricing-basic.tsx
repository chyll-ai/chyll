
"use client";

import { Pricing } from "@/components/ui/pricing";

const demoPlans = [
  {
    name: "ONCE",
    price: "99",
    period: "one-time",
    features: [
      "We build and deliver 1 automation for your use case",
      "Delivered with a simple interface (Airtable or Notion)",
      "Includes setup, configuration, and test run",
      "Great for proof-of-concept or small need",
    ],
    description: "One task, fully done-for-you.",
    buttonText: "Start with One Task",
    href: "https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY",
    isPopular: false,
  },
  {
    name: "AUTOMATE",
    price: "199",
    period: "per month",
    features: [
      "Access a custom interface connected to your AI workflows",
      "Includes 200 automation actions/month",
      "Tasks include scraping, enrichment, messaging, CRM updates, alerts",
      "No technical setup required – we handle everything",
      "Ongoing support and upgrades included"
    ],
    description: "An AI assistant you can control.",
    buttonText: "Start Free Trial – 14 Days",
    href: "https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY",
    isPopular: true,
  },
  {
    name: "INTEGRATE",
    price: "699",
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
