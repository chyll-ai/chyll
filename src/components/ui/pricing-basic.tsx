
"use client";

import { Pricing } from "@/components/ui/pricing";
import { useLanguage } from "@/context/LanguageContext";

function PricingBasic() {
  const { language, t } = useLanguage();
  
  const demoPlans = language === 'fr' ? [
    {
      name: t.pricing.plans.once.name,
      price: t.pricing.plans.once.price,
      yearlyPrice: t.pricing.plans.once.price,
      period: t.pricing.plans.once.period,
      features: t.pricing.plans.once.features,
      description: t.pricing.plans.once.description,
      buttonText: t.pricing.plans.once.buttonText,
      href: "https://cal.com/generativschool/30min?overlayCalendar=true",
      isPopular: false,
    },
    {
      name: t.pricing.plans.automate.name,
      price: t.pricing.plans.automate.price,
      yearlyPrice: "159€",
      period: t.pricing.plans.automate.period,
      features: t.pricing.plans.automate.features,
      description: t.pricing.plans.automate.description,
      buttonText: t.pricing.plans.automate.buttonText,
      href: "https://cal.com/generativschool/30min?overlayCalendar=true",
      isPopular: true,
    },
    {
      name: t.pricing.plans.integrate.name,
      price: t.pricing.plans.integrate.price,
      yearlyPrice: "559€",
      period: t.pricing.plans.integrate.period,
      features: t.pricing.plans.integrate.features,
      description: t.pricing.plans.integrate.description,
      buttonText: t.pricing.plans.integrate.buttonText,
      href: "https://cal.com/generativschool/30min?overlayCalendar=true",
      isPopular: false,
    }
  ] : [
    {
      name: "ONCE",
      price: "99",
      yearlyPrice: "99",
      period: "per run",
      features: [
        "We build and deliver 1 automation for your use case",
        "Delivered with a simple interface (Airtable or Notion)",
        "Includes setup, configuration, and test run",
        "Great for proof-of-concept or small need"
      ],
      description: "One task, fully done-for-you.",
      buttonText: "Start with One Task",
      href: "https://cal.com/generativschool/30min?overlayCalendar=true",
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
      href: "https://cal.com/generativschool/30min?overlayCalendar=true",
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
      href: "https://cal.com/generativschool/30min?overlayCalendar=true",
      isPopular: false,
    }
  ];

  return (
    <div className="overflow-y-auto">
      <Pricing 
        plans={demoPlans}
        title={language === 'fr' ? t.pricing.title : "AI Automation Made Simple"}
        description={language === 'fr' ? t.pricing.description : "Try risk-free with our 14-day trial"}
      />
    </div>
  );
}

export { PricingBasic };
