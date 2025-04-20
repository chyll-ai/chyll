"use client";

import { Pricing } from "@/components/ui/pricing";

const demoPlans = [
  {
    name: "ONCE",
    price: "99",
    yearlyPrice: "99", // One-time payment remains the same
    period: "by run", // Changed to lowercase
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
    name: "ENTERPRISE AI OPS",
    price: "699",
    yearlyPrice: "559",
    period: "per month",
    features: [
      "1,000 Monthly Automation Actions",
      "Scale your operations with high-volume task execution across departments — sales, support, HR, marketing, and beyond",
      "Custom-Built Workflows",
      "We design and deploy intelligent workflows tailored to your unique business needs, processes, and team structure",
      "Integrates with Your Existing Stack",
      "Your AI agents seamlessly connect to your CRM, ATS, support desk, project management tools, and internal systems — no disruption",
      "Personalized White-Glove Onboarding",
      "Dedicated setup sessions to map your workflows, install your AI employees, and ensure a smooth handover with your team",
      "Priority Support & Strategy Access",
      "You get a direct line to our automation experts for troubleshooting, performance tuning, and quarterly strategy reviews",
      "SLA & Operational Reporting",
      "We commit to guaranteed uptime and deliver clear, actionable reports on usage, performance, and ROI",
      "Advanced Security & Access Controls",
      "Single sign-on (SSO), encrypted data handling, and permission-based interface access — your data stays safe and segmented"
    ],
    description: "Your Dedicated Automation Layer – Tailored for Growth, Reliability, and Scale",
    buttonText: "Talk to Our Team",
    href: "https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY",
    isPopular: false,
  }
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
