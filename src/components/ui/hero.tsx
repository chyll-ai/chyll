
"use client";

import { useEffect, useState } from "react";
import { renderCanvas } from "@/components/ui/canvas";
import { ArrowRight, SquareCode, MoveRight, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
  const { language } = useLanguage();
  
  // Initialize rotating words for the animation
  const [wordIndex, setWordIndex] = useState(0);
  const rotatingWords = [
    "automatisée.",
    "simplifiée.",
    "efficace.",
    "sans effort.",
    "optimisée."
  ];

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
            <SquareCode className="h-5 p-1" /> Présentation de chyll.ai
            <a
              href="/about"
              rel="noreferrer"
              className="hover:text-brand-blue ml-1 flex items-center font-semibold"
            >
              En savoir plus{" "}
              <span aria-hidden="true">
                <MoveRight className="h-5 p-1" />
              </span>
            </a>
          </div>
        </div>

        <div className="mb-6 md:mb-10">
          <div className="typography-h1 font-extrabold leading-tight tracking-tight text-center">
            <span className="block text-5xl xl:text-8xl rainbow-text-static">Prospection B2B</span>
            <div className="inline-block rainbow-text text-5xl xl:text-8xl">
              {rotatingWords[wordIndex]}
            </div>
          </div>
        </div>

        <p className="max-w-3xl text-lg font-semibold text-gray-700 mb-4 md:text-xl md:leading-relaxed">
          L'assistant commercial IA qui révolutionne la prospection B2B
        </p>

        <p className="max-w-2xl text-gray-600 mb-10">
          Automatisez votre prospection, enrichissez vos leads et gérez votre pipeline commercial avec notre intelligence artificielle avancée.
        </p>

        <div className="flex justify-center">
          <Button
            variant="rainbow"
            size="lg"
            className="inline-flex items-center justify-center whitespace-nowrap gap-2"
            asChild
          >
            <a href="/waitlist-subscription">
              <Users className="size-5" />
              Rejoindre la liste d'attente
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
