
"use client";

import { Pricing } from "@/components/ui/pricing";

function PricingBasic() {
  // Tarifs avec contenu en français uniquement
  const pricingPlans = [
    {
      name: "Starter",
      price: "99",
      yearlyPrice: (99 * 12 * 0.8).toFixed(0) + "€",
      period: "mois",
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
      price: "200",
      yearlyPrice: (200 * 12 * 0.8).toFixed(0) + "€",
      period: "mois",
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
      href: "https://tally.so/r/wA0pJl",
      isPopular: true,
    },
    {
      name: "Scale",
      price: "300",
      yearlyPrice: (300 * 12 * 0.8).toFixed(0) + "€",
      period: "mois",
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
      href: "https://tally.so/r/wA0pJl",
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
