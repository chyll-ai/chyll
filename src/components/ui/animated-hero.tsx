
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { renderCanvas } from "@/components/ui/canvas";
import { useLanguage } from "@/context/LanguageContext";
import { useResponsive } from "@/hooks/use-responsive";

function Hero() {
  const { language, t } = useLanguage();
  const { isMobile } = useResponsive();
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = t.home.hero.actions || [
    "automatisée.",
    "simplifiée.",
    "efficace.",
    "sans effort.",
    "optimisée."
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles.length]);

  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      renderCanvas();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="container mx-auto px-4">
        <div className="flex gap-6 py-12 md:py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-4xl sm:text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="rainbow-text-static">{t.home.hero.title}</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold rainbow-text"
                    initial={{ opacity: 0, y: 50 }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-base md:text-lg lg:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              {t.home.hero.description}
            </p>
          </div>
          <div className="flex justify-center w-full">
            <Button size={isMobile ? "default" : "lg"} className="gap-2 w-full sm:w-auto" variant="rainbow" asChild>
              <a href="/waitlist-subscription">
                <Users className="w-4 h-4" />
                Rejoindre la liste d'attente
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
