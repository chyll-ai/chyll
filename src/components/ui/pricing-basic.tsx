"use client";

import { Pricing } from "@/components/ui/pricing";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";

function PricingBasic() {
  const { t } = useLanguage();
  const { getCurrencySymbol } = useCurrency();
  
  // Pricing plans with currency symbol from context
  const pricingPlans = [
    {
      name: t('pricing.starter.name', 'Starter'),
      price: `99${getCurrencySymbol()}`,
      yearlyPrice: `950${getCurrencySymbol()}`,
      period: t('pricing.period', '/mois'),
      features: [
        t('pricing.starter.feature1', '50 numéros de téléphone + 50 adresses email par mois'),
        t('pricing.starter.feature2', 'Personas illimités (LinkedIn)'),
        t('pricing.starter.feature3', '2 utilisateurs'),
        t('pricing.starter.feature4', 'Interface CRM personnalisée'),
        t('pricing.starter.feature5', 'Support par email'),
        t('pricing.starter.feature6', 'Mise à jour quotidienne')
      ],
      description: t('pricing.starter.description', 'Parfait pour les petites équipes'),
      buttonText: t('pricing.waitlist', 'Liste d\'attente'),
      yearlyButtonText: t('pricing.waitlist', 'Liste d\'attente'),
      href: "/closed-beta-demo",
      isPopular: false,
    },
    {
      name: t('pricing.growth.name', 'Growth'),
      price: `199${getCurrencySymbol()}`,
      yearlyPrice: `1910${getCurrencySymbol()}`,
      period: t('pricing.period', '/mois'),
      features: [
        t('pricing.growth.feature1', '200 numéros de téléphone + 200 adresses email par mois'),
        t('pricing.growth.feature2', 'Personas illimités (LinkedIn)'),
        t('pricing.growth.feature3', '3 utilisateurs'),
        t('pricing.growth.feature4', 'Interface CRM personnalisée'),
        t('pricing.growth.feature5', 'Support prioritaire'),
        t('pricing.growth.feature6', 'Mises à jour en temps réel'),
        t('pricing.growth.feature7', 'Export et import de data')
      ],
      description: t('pricing.growth.description', 'Pour les équipes en croissance'),
      buttonText: t('pricing.waitlist', 'Liste d\'attente'),
      yearlyButtonText: t('pricing.waitlist', 'Liste d\'attente'),
      href: "/closed-beta-demo",
      isPopular: true,
    },
    {
      name: t('pricing.scale.name', 'Scale'),
      price: `399${getCurrencySymbol()}`,
      yearlyPrice: `3830${getCurrencySymbol()}`,
      period: t('pricing.period', '/mois'),
      features: [
        t('pricing.scale.feature1', '400 numéros de téléphone + 400 adresses email par mois'),
        t('pricing.scale.feature2', 'Personas illimités (LinkedIn)'),
        t('pricing.scale.feature3', '5 utilisateurs'),
        t('pricing.scale.feature4', 'Interface CRM sur mesure'),
        t('pricing.scale.feature5', 'Support dédié'),
        t('pricing.scale.feature6', 'Mises à jour en temps réel'),
        t('pricing.scale.feature7', 'Export et import de data'),
        t('pricing.scale.feature8', 'Critères de recherche illimités'),
        t('pricing.scale.feature9', 'Rapports de performance')
      ],
      description: t('pricing.scale.description', 'Pour les équipes commerciales établies'),
      buttonText: t('pricing.waitlist', 'Liste d\'attente'),
      yearlyButtonText: t('pricing.waitlist', 'Liste d\'attente'),
      href: "/closed-beta-demo",
      isPopular: false,
    }
  ];

  return (
    <div className="overflow-y-auto">
      <Pricing 
        plans={pricingPlans}
        title={t('pricing.title', 'Tarifs simples et transparents')}
        description={t('pricing.description', 'Rejoignez notre liste d\'attente gamifiée')}
        language="fr"
      />
    </div>
  );
}

export { PricingBasic };
