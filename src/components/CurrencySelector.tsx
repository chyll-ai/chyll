
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Euro } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency} onValueChange={(value: 'USD' | 'EUR') => setCurrency(value)}>
      <SelectTrigger className="w-[120px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            {currency === 'USD' ? (
              <>
                <DollarSign className="h-4 w-4" />
                <span>USD</span>
              </>
            ) : (
              <>
                <Euro className="h-4 w-4" />
                <span>EUR</span>
              </>
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="USD">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>USD ($)</span>
          </div>
        </SelectItem>
        <SelectItem value="EUR">
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4" />
            <span>EUR (€)</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
