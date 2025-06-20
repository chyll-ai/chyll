import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';

// French pricing plans
const frPricingPlans = [
  {
    name: "Starter",
    price: "99€",
    period: "/mois",
    description: "Parfait pour les petites équipes",
    features: [
      "50 numéros de téléphone + 50 adresses email par mois",
      "Personas illimités (LinkedIn)",
      "2 utilisateurs",
      "Interface CRM personnalisée",
      "Support par email",
      "Mise à jour quotidienne"
    ],
    highlight: false,
    color: "blue",
    trial: "Bêta fermée - Liste d'attente",
    buttonText: "Liste d'attente",
    href: "/closed-beta-demo"
  },
  {
    name: "Growth",
    price: "199€",
    period: "/mois",
    description: "Pour les équipes en croissance",
    features: [
      "200 numéros de téléphone + 200 adresses email par mois",
      "Personas illimités (LinkedIn)",
      "3 utilisateurs",
      "Interface CRM personnalisée",
      "Support prioritaire",
      "Mises à jour en temps réel",
      "Export et import de data"
    ],
    highlight: true,
    color: "yellow",
    trial: "Bêta fermée - Liste d'attente",
    buttonText: "Liste d'attente",
    href: "/closed-beta-demo"
  },
  {
    name: "Scale",
    price: "399€",
    period: "/mois",
    description: "Pour les équipes commerciales établies",
    features: [
      "400 numéros de téléphone + 400 adresses email par mois",
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
    trial: "Bêta fermée - Liste d'attente",
    buttonText: "Liste d'attente",
    href: "/closed-beta-demo"
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
              <Link to={plan.href}>
                {plan.buttonText}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PricingCards;
