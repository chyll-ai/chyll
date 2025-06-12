
"use client";

import { Pricing } from "@/components/ui/pricing";
import { useLanguage } from "@/context/LanguageContext";

function PricingBasic() {
  const { t } = useLanguage();
  
  // Pricing plans with demo links instead of Stripe
  const pricingPlans = [
    {
      name: "Starter",
      price: "99€",
      yearlyPrice: "950€",
      period: "/mois",
      features: [
        "50 numéros de téléphone + 50 adresses email par mois",
        "Personas illimités (LinkedIn)",
        "2 utilisateurs",
        "Interface CRM personnalisée",
        "Support par email",
        "Mise à jour quotidienne"
      ],
      description: "Parfait pour les petites équipes",
      buttonText: "Voir la démo",
      yearlyButtonText: "Voir la démo",
      href: "/closed-beta-demo",
      isPopular: false,
    },
    {
      name: "Growth",
      price: "199€",
      yearlyPrice: "1910€",
      period: "/mois",
      features: [
        "200 numéros de téléphone + 200 adresses email par mois",
        "Personas illimités (LinkedIn)",
        "3 utilisateurs",
        "Interface CRM personnalisée",
        "Support prioritaire",
        "Mises à jour en temps réel",
        "Export et import de data"
      ],
      description: "Pour les équipes en croissance",
      buttonText: "Voir la démo",
      yearlyButtonText: "Voir la démo",
      href: "/closed-beta-demo",
      isPopular: true,
    },
    {
      name: "Scale",
      price: "399€",
      yearlyPrice: "3830€",
      period: "/mois",
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
      description: "Pour les équipes commerciales établies",
      buttonText: "Voir la démo",
      yearlyButtonText: "Voir la démo",
      href: "/closed-beta-demo",
      isPopular: false,
    }
  ];

  return (
    <div className="overflow-y-auto">
      <Pricing 
        plans={pricingPlans}
        title="Tarifs simples et transparents"
        description="Réservez une démonstration personnalisée"
        language="fr"
      />
    </div>
  );
}

export { PricingBasic };
