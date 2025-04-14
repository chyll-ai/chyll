
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const pricingPlans = [
  {
    name: "Starter",
    price: "99€",
    period: "/month",
    description: "Ideal for small teams or solo founders looking to automate the essentials.",
    features: [
      "Voice & Conversation AI",
      "Basic Workflow Automation",
      "Reviews AI",
      "24/7 Multichannel Support"
    ],
    highlight: false
  },
  {
    name: "Pro",
    price: "199€",
    period: "/month",
    description: "Perfect for growing businesses ready to scale their AI operations.",
    features: [
      "Everything in Starter",
      "Funnel AI & Content Automation",
      "Advanced Workflow Builder",
      "Dedicated Onboarding"
    ],
    highlight: true
  },
  {
    name: "Expert",
    price: "699€",
    period: "/month",
    description: "For businesses that want full AI integration and maximum performance.",
    features: [
      "Everything in Pro",
      "Custom Voice Agents",
      "White-Glove Setup",
      "Priority Support + AI Strategy Sessions"
    ],
    highlight: false
  }
];

const PricingCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {pricingPlans.map((plan, index) => (
        <div 
          key={index} 
          className={`pricing-card flex flex-col h-full ${
            plan.highlight 
              ? 'border-brand-blue shadow-lg relative' 
              : ''
          }`}
        >
          {plan.highlight && (
            <div className="absolute -top-4 left-0 right-0 mx-auto w-max px-4 py-1 bg-brand-blue text-white text-sm font-medium rounded-full">
              Most Popular
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <div className="flex items-end mb-2">
              <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-gray-500 ml-1">{plan.period}</span>
            </div>
            <p className="text-gray-600">{plan.description}</p>
          </div>
          
          <ul className="space-y-3 mb-8 flex-grow">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button 
            className={`w-full mt-auto ${
              plan.highlight 
                ? 'bg-brand-blue hover:bg-brand-blue-dark' 
                : 'bg-white hover:bg-gray-50 text-brand-blue border border-brand-blue'
            }`}
          >
            Book a Demo
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PricingCards;
