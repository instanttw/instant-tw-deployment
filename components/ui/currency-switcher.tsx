"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency, Currency } from "@/lib/currency-context";

const currencies: { value: Currency; label: string; symbol: string }[] = [
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "GBP", label: "British Pound", symbol: "£" },
];

export function CurrencySwitcher() {
  const { currency, setCurrency, symbol } = useCurrency();

  const currentCurrency = currencies.find((c) => c.value === currency);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <span className="text-base font-semibold">{symbol}</span>
          <span className="hidden sm:inline">{currentCurrency?.value}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.value}
            onClick={() => setCurrency(curr.value)}
            className={currency === curr.value ? "bg-accent" : ""}
          >
            <span className="mr-2">{curr.symbol}</span>
            {curr.label} ({curr.value})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
