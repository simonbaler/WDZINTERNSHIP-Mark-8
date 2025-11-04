import React from 'react';
import { useState } from 'react';

const currencies = [
  { code: 'INR', symbol: '₹', locale: 'en-IN' },
  { code: 'USD', symbol: '$', locale: 'en-US' },
  { code: 'EUR', symbol: '€', locale: 'de-DE' },
];

export const CurrencySwitcher: React.FC = () => {
  const [currency, setCurrency] = useState(currencies[0]);

  return (
    <div className="flex items-center gap-2">
      <select
        value={currency.code}
        onChange={(e) => setCurrency(currencies.find(c => c.code === e.target.value) || currencies[0])}
        className="px-2 py-1 border rounded"
        aria-label="Select currency"
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>{c.code}</option>
        ))}
      </select>
      <span className="text-sm text-muted-foreground">{currency.symbol}</span>
    </div>
  );
};

export default CurrencySwitcher;
