
"use client";

import { Pricing } from "@/components/ui/pricing";
import { useLanguage } from "@/context/LanguageContext";

function PricingBasic() {
  const { t } = useLanguage();
  
  // French pricing plans
  const pricingPlans = [
    {
      name: t.pricing.plans.once.name,
      price: t.pricing.plans.once.price,
      yearlyPrice: t.pricing.plans.once.price,
      period: t.pricing.plans.once.period,
      features: t.pricing.plans.once.features || [],
      description: t.pricing.plans.once.description,
      buttonText: t.pricing.plans.once.buttonText || "Commencer",
      href: "https://cal.com/chyll-ai/30min?overlayCalendar=true",
      isPopular: false,
    },
    {
      name: t.pricing.plans.automate.name,
      price: t.pricing.plans.automate.price,
      yearlyPrice: t.pricing.plans.automate.price,
      period: t.pricing.plans.automate.period,
      features: t.pricing.plans.automate.features || [],
      description: t.pricing.plans.automate.description,
      buttonText: t.pricing.plans.automate.buttonText || "Réserver une démo",
      href: "https://cal.com/chyll-ai/30min?overlayCalendar=true",
      isPopular: true,
    },
    {
      name: t.pricing.plans.integrate.name,
      price: t.pricing.plans.integrate.price,
      yearlyPrice: t.pricing.plans.integrate.price,
      period: t.pricing.plans.integrate.period,
      features: t.pricing.plans.integrate.features || [],
      description: t.pricing.plans.integrate.description,
      buttonText: t.pricing.plans.integrate.buttonText || "Contacter l'équipe",
      href: "https://cal.com/chyll-ai/30min?overlayCalendar=true",
      isPopular: false,
    }
  ];

  return (
    <div className="overflow-y-auto">
      <Pricing 
        plans={pricingPlans}
        title={t.pricing.title || "Tarifs simples et transparents"}
        description={t.pricing.description || "Essai gratuit de 14 jours sans carte bancaire"}
      />
    </div>
  );
}

export { PricingBasic };
