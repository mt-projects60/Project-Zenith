export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  rate: number;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", symbol: "$",   name: "US Dollar",         rate: 1 },
  { code: "EUR", symbol: "€",   name: "Euro",              rate: 0.92 },
  { code: "GBP", symbol: "£",   name: "British Pound",     rate: 0.79 },
  { code: "NGN", symbol: "₦",   name: "Nigerian Naira",    rate: 1560 },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling",   rate: 130 },
  { code: "GHS", symbol: "₵",   name: "Ghanaian Cedi",     rate: 14.5 },
  { code: "ZAR", symbol: "R",   name: "South African Rand",rate: 19.2 },
  { code: "EGP", symbol: "E£",  name: "Egyptian Pound",    rate: 48.5 },
  { code: "INR", symbol: "₹",   name: "Indian Rupee",      rate: 83.5 },
  { code: "AED", symbol: "AED", name: "UAE Dirham",        rate: 3.67 },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar",   rate: 1.37 },
  { code: "AUD", symbol: "A$",  name: "Australian Dollar", rate: 1.55 },
  { code: "JPY", symbol: "¥",   name: "Japanese Yen",      rate: 149 },
  { code: "CNY", symbol: "¥",   name: "Chinese Yuan",      rate: 7.24 },
  { code: "SGD", symbol: "S$",  name: "Singapore Dollar",  rate: 1.35 },
  { code: "BRL", symbol: "R$",  name: "Brazilian Real",    rate: 5.05 },
];

export function convertAmount(usdAmount: number, currency: CurrencyOption): string {
  const converted = usdAmount * currency.rate;
  if (converted >= 1_000_000_000) return `${currency.symbol}${(converted / 1_000_000_000).toFixed(1)}B`;
  if (converted >= 1_000_000)     return `${currency.symbol}${(converted / 1_000_000).toFixed(1)}M`;
  if (converted >= 1_000)         return `${currency.symbol}${(converted / 1_000).toFixed(0)}K`;
  return `${currency.symbol}${converted.toFixed(0)}`;
}

export function parseUsdString(val: string): number {
  const clean = val.replace(/[^0-9.]/g, "");
  const num = parseFloat(clean) || 0;
  if (val.toLowerCase().includes("b")) return num * 1_000_000_000;
  if (val.toLowerCase().includes("m")) return num * 1_000_000;
  if (val.toLowerCase().includes("k")) return num * 1_000;
  return num;
}
