
"use client";

import { useEffect, useState } from "react";
import { renderCanvas } from "@/components/ui/canvas";
import { ArrowRight, SquareCode, MoveRight, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
  const { t } = useLanguage();
  
  // Initialize rotating words for the animation
  const [wordIndex, setWordIndex] = useState(0);
  const rotatingWords = t.home.hero.actions;

  // Set up animation interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [rotatingWords]);

  // Initialize canvas effect
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <section id="home">
      <div className="animation-delay-8 animate-fadeIn mt-20 flex flex-col items-center justify-center px-4 text-center md:mt-20">
        <div className="z-10 mb-6 mt-10 sm:justify-center md:mb-4 md:mt-20">
          <div className="relative flex items-center whitespace-nowrap rounded-full border bg-popover px-3 py-1 text-xs leading-6 text-primary/60">
            <SquareCode className="h-5 p-1" /> {t.home.hero.introducing}
            <a
              href="/about"
              rel="noreferrer"
              className="hover:text-brand-blue ml-1 flex items-center font-semibold"
            >
              {t.common.learnMore}{" "}
              <span aria-hidden="true">
                <MoveRight className="h-5 p-1" />
              </span>
            </a>
          </div>
        </div>

        <div className="mb-6 md:mb-10">
          <div className="typography-h1 font-extrabold leading-tight tracking-tight text-center">
            <span className="block text-5xl xl:text-8xl">{t.home.hero.title}</span>
            <div className="inline-block bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] bg-clip-text text-transparent text-5xl xl:text-8xl">
              {rotatingWords[wordIndex]}
            </div>
          </div>
        </div>

        <p className="max-w-3xl text-lg font-semibold text-gray-700 mb-4 md:text-xl md:leading-relaxed">
          {t.home.hero.subtitle}
        </p>

        <p className="max-w-2xl text-gray-600 mb-10">
          {t.home.hero.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="rainbow"
            size="lg"
            className="inline-flex items-center justify-center whitespace-nowrap gap-1"
            asChild
          >
            <a href="https://cal.com/generativschool/30min?overlayCalendar=true" target="_blank" rel="noopener noreferrer">
              <PhoneCall className="size-5" />
              {t.home.hero.buttons.bookDemo}
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="inline-flex items-center justify-center whitespace-nowrap gap-1"
            asChild
          >
            <a href="#features">
              {t.home.hero.buttons.hireNow} <ArrowRight className="size-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
