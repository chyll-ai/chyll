
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

const pricingPlans = [
  {
    name: "Once",
    price: "$99",
    period: "one-time",
    description: "One task, fully done-for-you.",
    features: [
      "We build and deliver 1 automation for your use case",
      "Delivered with a simple interface (Airtable or Notion)",
      "Includes setup, configuration, and test run",
      "Great for proof-of-concept or small need"
    ],
    highlight: false,
    color: "blue",
    trial: null
  },
  {
    name: "Automate",
    price: "$199",
    period: "/month",
    description: "An AI assistant you can control.",
    features: [
      "Access a custom interface connected to your AI workflows",
      "Includes 200 automation actions/month",
      "Tasks include scraping, enrichment, messaging, CRM updates, alerts",
      "No technical setup required – we handle everything",
      "Ongoing support and upgrades included"
    ],
    highlight: true,
    color: "yellow",
    trial: "14-day free trial"
  },
  {
    name: "Integrate",
    price: "$699",
    period: "/month",
    description: "Full-stack AI setup across your operations.",
    features: [
      "Custom-built workflows across departments",
      "Works with your stack (CRM, HR, project tools, etc.)",
      "Up to 1,000 automation actions/month",
      "Personalized onboarding, support & strategy",
      "SLA, reporting, and dedicated expert sessions"
    ],
    highlight: false,
    color: "red",
    trial: null
  }
];

const getPlanIcon = (color: string) => {
  switch (color) {
    case "blue":
      return <div className="inline-block w-5 h-5 mr-2 bg-blue-500 rounded-sm">🟦</div>;
    case "yellow":
      return <div className="inline-block w-5 h-5 mr-2 bg-yellow-400 rounded-sm">🟨</div>;
    case "red":
      return <div className="inline-block w-5 h-5 mr-2 bg-red-500 rounded-sm">🟥</div>;
    default:
      return null;
  }
};

const PricingCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {pricingPlans.map((plan, index) => (
        <Card 
          key={index} 
          className={`pricing-card flex flex-col h-full border-2 ${
            plan.highlight 
              ? 'border-yellow-400 shadow-lg relative' 
              : plan.color === 'blue' 
                ? 'border-blue-500' 
                : 'border-red-500'
          }`}
        >
          {plan.highlight && (
            <div className="absolute -top-4 left-0 right-0 mx-auto w-max px-4 py-1 bg-yellow-400 text-white text-sm font-medium rounded-full">
              Most Popular
            </div>
          )}
          
          <CardHeader className="pb-2">
            <div className="flex items-center mb-2">
              {getPlanIcon(plan.color)}
              <h3 className="text-xl font-bold text-gray-900">{plan.name} — {plan.price}{plan.period}</h3>
            </div>
            <p className="text-gray-600">{plan.description}</p>
            <div className="mt-2">
              <p className="text-sm font-medium text-green-600">{plan.trial}</p>
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow">
            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          
          <CardFooter className="pt-4">
            <Button 
              variant={plan.highlight ? "rainbow" : "default"}
              className={`w-full ${
                !plan.highlight 
                  ? (plan.color === 'blue'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white')
                  : ''
              }`}
              asChild
            >
              <a href="https://cal.com/generativschool/30min?overlayCalendar=true" target="_blank" rel="noopener noreferrer">
                Book a Demo
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PricingCards;
