
"use client";

import { Pricing } from "@/components/ui/pricing";
import { useLanguage } from "@/context/LanguageContext";

function PricingBasic() {
  const { t } = useLanguage();
  
  // Pricing plans with both monthly and annual pricing
  const pricingPlans = [
    {
      name: "Starter",
      price: "99€",
      yearlyPrice: "950€", // Annual price with discount
      period: "/mois",
      features: [
        "50 numéros de téléphone ET adresses email par mois",
        "Personas illimités (LinkedIn)",
        "2 utilisateurs",
        "Interface CRM personnalisée",
        "Support par email",
        "Mise à jour quotidienne"
      ],
      description: "Parfait pour les petites équipes",
      buttonText: "Commencer l'essai",
      href: "https://buy.stripe.com/5kAeWh18h6cOenSeUV",
      isPopular: false,
    },
    {
      name: "Growth",
      price: "200€",
      yearlyPrice: "1920€", // Annual price with 20% discount
      period: "/mois",
      features: [
        "100 numéros de téléphone ET adresses email par mois",
        "Personas illimités (LinkedIn)",
        "3 utilisateurs",
        "Interface CRM personnalisée",
        "Support prioritaire",
        "Mises à jour en temps réel",
        "Export et import de data"
      ],
      description: "Pour les équipes en croissance",
      buttonText: "Réserver une démo",
      href: "https://cal.com/chyll.ai/30min",
      isPopular: true,
    },
    {
      name: "Scale",
      price: "300€",
      yearlyPrice: "2880€", // Annual price with 20% discount
      period: "/mois",
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
      description: "Pour les équipes commerciales établies",
      buttonText: "Réserver une démo",
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
