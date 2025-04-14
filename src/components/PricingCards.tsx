
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useTranslation } from '@/contexts/TranslationContext';

const PricingCards = () => {
  const { t } = useTranslation();

  const pricingPlans = [
    {
      name: t('starter'),
      price: "99€",
      period: t('month'),
      description: t('starter_description'),
      features: [
        t('reviews_ai_description'),
        t('content_ai_description'),
        t('funnel_ai_description')
      ],
      highlight: false,
      color: "blue"
    },
    {
      name: t('pro'),
      price: "199€",
      period: t('month'),
      description: t('pro_description'),
      features: [
        t('everything_in_starter'),
        t('workflow_ai_description'),
        t('conversation_ai_description')
      ],
      highlight: true,
      color: "yellow"
    },
    {
      name: t('expert'),
      price: "699€",
      period: t('month'),
      description: t('expert_description'),
      features: [
        t('everything_in_pro'),
        t('voice_ai_description'),
        t('custom_ai_setup'),
        t('white_glove_onboarding'),
        t('monthly_strategy_calls')
      ],
      highlight: false,
      color: "red"
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
              {t('most_popular')}
            </div>
          )}
          
          <CardHeader className="pb-2">
            <div className="flex items-center mb-2">
              {getPlanIcon(plan.color)}
              <h3 className="text-xl font-bold text-gray-900">{plan.name} — {plan.price}{plan.period}</h3>
            </div>
            <p className="text-gray-600">{plan.description}</p>
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
                {t('book_demo')}
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PricingCards;
