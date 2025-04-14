
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { renderCanvas } from "@/components/ui/canvas";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["cost-saving", "customer-converting", "time-saving", "revenue-boosting", "always-on"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  // Initialize canvas effect
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4">
              <Bot className="w-4 h-4" /> Introducing GenerativSchool <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-brand-blue">Scale your business with</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
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

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Transform your business with AI employees that never sleep, never take vacations, 
              and consistently deliver exceptional results. Streamline operations, 
              reduce costs, and scale your business like never before.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="outline" asChild>
              <a href="https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY" target="_blank" rel="noopener noreferrer">
                Book a demo <PhoneCall className="w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" className="gap-4" variant="rainbow" asChild>
              <a href="https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY" target="_blank" rel="noopener noreferrer">
                Get started now <MoveRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
