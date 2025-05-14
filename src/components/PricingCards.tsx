
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';

// French pricing plans
const frPricingPlans = [
  {
    name: "Starter",
    price: "99€",
    period: "/mois",
    description: "Parfait pour les petites équipes",
    features: [
      "50 numéros de téléphone ET adresses email par mois",
      "Personas illimités (LinkedIn)",
      "2 utilisateurs",
      "Interface CRM personnalisée",
      "Support par email",
      "Mise à jour quotidienne"
    ],
    highlight: false,
    color: "blue",
    trial: "Essai gratuit de 14 jours",
    buttonText: "Commencer l'essai",
    href: "https://buy.stripe.com/5kAeWh18h6cOenSeUV"
  },
  {
    name: "Growth",
    price: "200€",
    period: "/mois",
    description: "Pour les équipes en croissance",
    features: [
      "100 numéros de téléphone ET adresses email par mois",
      "Personas illimités (LinkedIn)",
      "3 utilisateurs",
      "Interface CRM personnalisée",
      "Support prioritaire",
      "Mises à jour en temps réel",
      "Export et import de data"
    ],
    highlight: true,
    color: "yellow",
    trial: "Essai gratuit de 14 jours",
    buttonText: "Réserver une démo",
    href: "https://cal.com/chyll.ai/30min"
  },
  {
    name: "Scale",
    price: "300€",
    period: "/mois",
    description: "Pour les équipes commerciales établies",
    features: [
      "200 numéros de téléphone ET adresses email par mois",
      "Personas illimités (LinkedIn)",
      "5 utilisateurs",
      "Interface CRM sur mesure",
      "Support dédié",
      "Mises à jour en temps réel",
      "Export et import de data",
      "Critères de recherche illimités",
      "Rapports de performance"
    ],
    highlight: false,
    color: "red",
    trial: "Essai gratuit de 14 jours",
    buttonText: "Réserver une démo",
    href: "https://cal.com/chyll.ai/30min"
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
  const { language } = useLanguage();
  const plans = frPricingPlans;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan, index) => (
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
              Populaire
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
              <a 
                href={plan.href} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {plan.buttonText}
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PricingCards;
