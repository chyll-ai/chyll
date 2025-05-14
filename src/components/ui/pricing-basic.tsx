
"use client";

import { Pricing } from "@/components/ui/pricing";
import { useLanguage } from "@/context/LanguageContext";

function PricingBasic() {
  const { t } = useLanguage();
  
  // Pricing plans with both monthly and annual pricing
  const pricingPlans = [
    {
      name: t.pricing.plans.once.name,
      price: t.pricing.plans.once.price,
      yearlyPrice: t.pricing.plans.once.price, // One-time price stays the same
      period: t.pricing.plans.once.period,
      features: t.pricing.plans.once.features || [],
      description: t.pricing.plans.once.description,
      buttonText: t.pricing.plans.once.buttonText || "Commencer",
      href: "https://buy.stripe.com/5kAeWh18h6cOenSeUV",
      isPopular: false,
    },
    {
      name: t.pricing.plans.automate.name,
      price: t.pricing.plans.automate.price,
      // Use price as fallback if yearlyPrice doesn't exist in translations
      yearlyPrice: t.pricing.plans.automate.price ? 
        (parseFloat(t.pricing.plans.automate.price.replace('€', '')) * 12 * 0.8).toFixed(0) + '€' : 
        "159€",
      period: t.pricing.plans.automate.period,
      features: t.pricing.plans.automate.features || [],
      description: t.pricing.plans.automate.description,
      buttonText: t.pricing.plans.automate.buttonText || "Réserver une démo",
      href: "https://cal.com/chyll.ai/30min",
      isPopular: true,
    },
    {
      name: t.pricing.plans.integrate.name,
      price: t.pricing.plans.integrate.price,
      // Use price as fallback if yearlyPrice doesn't exist in translations
      yearlyPrice: t.pricing.plans.integrate.price ? 
        (parseFloat(t.pricing.plans.integrate.price.replace('€', '')) * 12 * 0.8).toFixed(0) + '€' : 
        "559€",
      period: t.pricing.plans.integrate.period,
      features: t.pricing.plans.integrate.features || [],
      description: t.pricing.plans.integrate.description,
      buttonText: t.pricing.plans.integrate.buttonText || "Contacter l'équipe",
      href: "https://cal.com/chyll.ai/30min",
      isPopular: false,
    }
  ];

  return (
    <div className="overflow-y-auto">
      <Pricing 
        plans={pricingPlans}
        title={t.pricing.title || "Tarifs simples et transparents"}
        description={t.pricing.description || "Essai sans engagement"}
        language="fr"
      />
    </div>
  );
}

export { PricingBasic };
