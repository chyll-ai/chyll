
import React from 'react';
import { PricingBasic } from '@/components/ui/pricing-basic';
import { CurrencySelector } from '@/components/CurrencySelector';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <CurrencySelector />
        </div>
        <PricingBasic />
      </div>
    </div>
  );
};

export default PricingPage;
