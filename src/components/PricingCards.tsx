import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';

// French pricing plans
const frPricingPlans = [
  {
    name: "chyll Starter",
    price: "99€",
    period: "unique",
    description: "chyll pour les petites équipes",
    features: [
      "Nous construisons et livrons 1 automatisation pour votre cas d'utilisation",
      "Livré avec une interface simple (Airtable ou Notion)",
      "Comprend la configuration, le paramétrage et le test",
      "Parfait pour une preuve de concept ou un besoin spécifique"
    ],
    highlight: false,
    color: "blue",
    trial: null,
    buttonText: "Essayer chyll",
    href: "https://buy.stripe.com/5kAeWh18h6cOenSeUV"
  },
  {
    name: "chyll Growth",
    price: "200€",
    period: "/mois",
    description: "chyll pour les équipes en croissance",
    features: [
      "Interface IA personnalisée",
      "Obtenez un tableau de bord sur mesure où vous pouvez interagir avec votre agent et suivre ses performances",
      "200 actions mensuelles alimentées par l'IA",
      "Votre agent peut automatiser des tâches comme la prospection, le suivi, la planification, la création de contenu, les mises à jour CRM, les alertes, et plus — selon son rôle",
      "Configuration clé en main : Aucune compétence technique requise",
      "Nous construisons, connectons et lançons votre employé IA pour vous",
      "Support continu et améliorations",
      "Nous fournissons des mises à jour continues, une surveillance et un support pratique pour garder votre agent performant et aligné avec vos objectifs commerciaux"
    ],
    highlight: true,
    color: "yellow",
    trial: "Essai gratuit de 14 jours"
  },
  {
    name: "chyll Scale",
    price: "300€",
    period: "/mois",
    description: "chyll pour les équipes commerciales établies",
    features: [
      "Flux de travail personnalisés",
      "Nous concevons et déployons des flux de travail intelligents adaptés à vos besoins commerciaux uniques, à vos processus et à la structure de votre équipe",
      "S'intègre à votre pile technologique existante",
      "Vos agents IA se connectent facilement à votre CRM, ATS, service d'assistance, outils de gestion de projet et systèmes internes — sans perturbation",
      "1 000 actions d'automatisation mensuelles",
      "Développez vos opérations avec une exécution de tâches à haut volume dans tous les départements — ventes, support, RH, marketing, et au-delà",
      "Intégration personnalisée haut de gamme",
      "Sessions de configuration dédiées pour cartographier vos flux de travail, installer vos employés IA et assurer une transition en douceur avec votre équipe",
      "Support prioritaire et accès stratégique",
      "Vous obtenez une ligne directe vers nos experts en automatisation pour le dépannage, l'optimisation des performances et les révisions stratégiques trimestrielles"
    ],
    highlight: false,
    color: "red",
    trial: "Essai gratuit de 14 jours"
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
              Le plus populaire
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
                href={index === 0 ? "https://buy.stripe.com/5kAeWh18h6cOenSeUV" : "https://cal.com/chyll.ai/30min"} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {index === 0 
                  ? "Essayer chyll" 
                  : (index === 1 ? "Réserver une démo" : "Contacter l'équipe chyll")}
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PricingCards;
