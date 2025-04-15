
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

const pricingPlans = [
  {
    name: "Starter",
    price: "99€",
    period: "/month",
    description: "Designed for solo founders and small teams who want to automate the basics without friction.",
    features: [
      "Reviews AI: Reputation on Auto-Pilot",
      "Content AI: Cure to Blank Pages",
      "Funnel AI: High-Converting Pages"
    ],
    highlight: false,
    color: "blue",
    trial: "14-day free trial"
  },
  {
    name: "Pro",
    price: "199€",
    period: "/month",
    description: "Built for growing businesses ready to scale customer interactions and marketing efforts with smart automation.",
    features: [
      "Everything in Starter",
      "Workflow AI: Your Automation Weapon",
      "Conversation AI: Natural Live Chat"
    ],
    highlight: true,
    color: "yellow",
    trial: "14-day free trial"
  },
  {
    name: "Expert",
    price: "699€",
    period: "/month",
    description: "For high-volume teams needing full AI integration, advanced workflows, and always-on voice communication.",
    features: [
      "Everything in Pro",
      "Voice AI: Never Miss a Call",
      "Custom AI Setup & Strategy",
      "White-Glove Onboarding + Priority Support",
      "Monthly Strategy Calls + Performance Reviews"
    ],
    highlight: false,
    color: "red",
    trial: "14-day free trial"
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
              <a href="https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY" target="_blank" rel="noopener noreferrer">
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
