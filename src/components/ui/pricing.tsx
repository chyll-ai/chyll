
"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
  language?: string;
}

export function Pricing({
  plans,
  title = "",
  description = "",
  language = "en"
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          "hsl(var(--primary))",
          "hsl(var(--accent))",
          "hsl(var(--secondary))",
          "hsl(var(--muted))",
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  // Always use Euro symbol for this application
  const currencySymbol = "€";

  // Calculate savings for yearly price
  const calculateYearlySavings = (price: string) => {
    const monthlyPrice = parseFloat(price);
    if (isNaN(monthlyPrice)) return price;
    
    // Calculate yearly price with 20% discount (multiply by 12 months, then apply 0.8 for 20% off)
    const yearlyPrice = (monthlyPrice * 12 * 0.8).toFixed(0);
    return yearlyPrice;
  };

  return (
    <div className="container py-20">
      {(title || description) && (
        <div className="text-center space-y-4 mb-12">
          {title && (
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground text-lg whitespace-pre-line">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-center mb-10">
        <label className="relative inline-flex items-center cursor-pointer">
          <Label>
            <Switch
              ref={switchRef as any}
              checked={!isMonthly}
              onCheckedChange={handleToggle}
              className="relative"
            />
          </Label>
        </label>
        <span className="ml-2 font-semibold">
          {language === "fr" ? "Facturation annuelle " : "Annual billing "}
          <span className="text-primary">
            {language === "fr" ? "(Économisez 20%)" : "(Save 20%)"}
          </span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 sm:2 gap-4">
        {plans.map((plan, index) => {
          // Use yearly price if provided, otherwise calculate it from monthly price
          const displayedYearlyPrice = plan.yearlyPrice === plan.price
            ? calculateYearlySavings(plan.price)
            : plan.yearlyPrice;

          return (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 1 }}
              whileInView={
                isDesktop
                  ? {
                      y: plan.isPopular ? -20 : 0,
                      opacity: 1,
                      x: index === 2 ? -30 : index === 0 ? 30 : 0,
                      scale: index === 0 || index === 2 ? 0.94 : 1.0,
                    }
                  : {}
              }
              viewport={{ once: true }}
              transition={{
                duration: 1.6,
                type: "spring",
                stiffness: 100,
                damping: 30,
                delay: 0.4,
                opacity: { duration: 0.5 },
              }}
              className={cn(
                `rounded-2xl border-[1px] p-6 bg-background text-center lg:flex lg:flex-col lg:justify-center relative`,
                plan.isPopular ? "border-primary border-2" : "border-border",
                "flex flex-col",
                !plan.isPopular && "mt-5",
                index === 0 || index === 2
                  ? "z-0 transform translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg]"
                  : "z-10",
                index === 0 && "origin-right",
                index === 2 && "origin-left"
              )}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-primary py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
                  <Star className="text-primary-foreground h-4 w-4 fill-current" />
                  <span className="text-primary-foreground ml-1 font-sans font-semibold">
                    {language === "fr" ? "Populaire" : "Popular"}
                  </span>
                </div>
              )}
              <div className="flex-1 flex flex-col">
                <p className="text-base font-semibold text-muted-foreground">
                  {plan.name}
                </p>
                <div className="mt-6 flex items-center justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-foreground">
                    {/* Display price based on billing period */}
                    <span>
                      {isMonthly ? plan.price : displayedYearlyPrice}{currencySymbol}
                    </span>
                  </span>
                  {plan.period !== "Next 3 months" && (
                    <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                      {isMonthly 
                        ? plan.period 
                        : language === "fr" ? "/an" : "/year"}
                    </span>
                  )}
                </div>

                {!isMonthly && (
                  <div className="mt-1 text-xs text-green-600 font-medium">
                    {language === "fr" 
                      ? "Engagement 1 an" 
                      : "1 year commitment"}
                  </div>
                )}

                {plan.name !== "ONCE" && plan.name !== "Une fois" && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-green-600">
                      {language === "fr" ? "Essai gratuit de 14 jours" : "14-day free trial"}
                    </p>
                  </div>
                )}

                <ul className="mt-5 gap-2 flex flex-col">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-left">{feature}</span>
                    </li>
                  ))}
                </ul>

                <hr className="w-full my-4" />

                <a
                  href={plan.href}
                  className={cn(
                    buttonVariants({
                      variant: plan.isPopular ? "rainbow" : "outline",
                    }),
                    "group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter",
                    "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-1",
                    !plan.isPopular && "hover:bg-primary hover:text-primary-foreground"
                  )}
                >
                  {plan.buttonText}
                </a>
                <p className="mt-6 text-xs leading-5 text-muted-foreground">
                  {plan.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
