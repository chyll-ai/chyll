
"use client";

import { Pricing } from "@/components/ui/pricing";
import { useLanguage } from "@/context/LanguageContext";

function PricingBasic() {
  const { t } = useLanguage();
  
  // Pricing plans with both monthly and annual pricing
  const pricingPlans = [
    {
      name: "chyll Starter",
      price: "99€",
      yearlyPrice: "99€", // One-time price stays the same
      period: "unique",
      features: [
        "Construction et livraison d'une automatisation chyll pour votre cas d'utilisation",
        "Interface simple (Airtable ou Notion)",
        "Configuration, paramétrage et test inclus",
        "Idéal pour une preuve de concept"
      ],
      description: "chyll pour les petites équipes",
      buttonText: "Essayer chyll",
      href: "https://buy.stripe.com/5kAeWh18h6cOenSeUV",
      isPopular: false,
    },
    {
      name: "chyll Growth",
      price: "200€",
      yearlyPrice: "1920€", // Annual price with 20% discount
      period: "/mois",
      features: [
        "Interface chyll personnalisée",
        "200 actions mensuelles alimentées par l'IA",
        "Configuration clé en main sans compétence technique",
        "Support continu et améliorations"
      ],
      description: "chyll pour les équipes en croissance",
      buttonText: "Réserver une démo",
      href: "https://cal.com/chyll.ai/30min",
      isPopular: true,
    },
    {
      name: "chyll Scale",
      price: "300€",
      yearlyPrice: "2880€", // Annual price with 20% discount
      period: "/mois",
      features: [
        "Flux de travail chyll personnalisés",
        "Intégration avec votre pile technologique existante",
        "1 000 actions d'automatisation mensuelles",
        "Support prioritaire et accès stratégique"
      ],
      description: "chyll pour les équipes commerciales établies",
      buttonText: "Contacter l'équipe chyll",
      href: "https://cal.com/chyll.ai/30min",
      isPopular: false,
    }
  ];

  return (
    <div className="overflow-y-auto">
      <Pricing 
        plans={pricingPlans}
        title="Tarifs simples et transparents"
        description="Essai sans engagement"
        language="fr"
      />
    </div>
  );
}

export { PricingBasic };
