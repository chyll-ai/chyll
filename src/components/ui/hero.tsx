
"use client";

import { useEffect } from "react";
import { renderCanvas } from "@/components/ui/canvas";
import { ArrowRight, Shapes } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <section id="home">
      <div className="animation-delay-8 animate-fadeIn mt-20 flex flex-col items-center justify-center px-4 text-center md:mt-20">
        <div className="z-10 mb-6 mt-10 sm:justify-center md:mb-4 md:mt-20">
          <div className="relative flex items-center whitespace-nowrap rounded-full border bg-popover px-3 py-1 text-xs leading-6 text-primary/60">
            <Shapes className="h-5 p-1" /> Introducing botis.
            <a
              href="/about"
              rel="noreferrer"
              className="hover:text-brand-blue ml-1 flex items-center font-semibold"
            >
              <div className="absolute inset-0 flex" aria-hidden="true" />
              Learn More{" "}
              <span aria-hidden="true">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>

        <div className="mb-10 mt-4 md:mt-6">
          <div className="px-2">
            <div className="border-brand-blue relative mx-auto h-full max-w-7xl border p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)] md:px-12 md:py-20">
              <h1 className="flex select-none flex-col px-3 py-2 text-center text-5xl font-semibold leading-none tracking-tight md:flex-col md:text-8xl lg:flex-row lg:text-8xl">
                <ArrowRight
                  strokeWidth={4}
                  className="text-brand-blue absolute -left-5 -top-5 h-10 w-10"
                />
                <ArrowRight
                  strokeWidth={4}
                  className="text-brand-blue absolute -bottom-5 -left-5 h-10 w-10"
                />
                <ArrowRight
                  strokeWidth={4}
                  className="text-brand-blue absolute -right-5 -top-5 h-10 w-10"
                />
                <ArrowRight
                  strokeWidth={4}
                  className="text-brand-blue absolute -bottom-5 -right-5 h-10 w-10"
                />
                Boost Revenue with 24/7 AI Automation
              </h1>
              <div className="flex items-center justify-center gap-1">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <p className="text-xs text-green-500">Available Now</p>
              </div>
            </div>
          </div>

          <h1 className="mt-8 text-2xl md:text-2xl">
            Work smarter, not harder with{" "}
            <span className="text-brand-blue font-bold">botis</span>
          </h1>

          <p className="md:text-md mx-auto mb-16 mt-2 max-w-2xl px-6 text-sm text-primary/60 sm:px-6 md:max-w-4xl md:px-20 lg:text-lg">
            Streamline your workflows, automate customer interactions, and scale your business operations.
          </p>
          <div className="flex justify-center gap-2">
            <a href="/dashboard">
              <Button variant="default" size="lg">
                Get Started
              </Button>
            </a>
            <a href="#demo">
              <Button variant="outline" size="lg">
                Book a Demo
              </Button>
            </a>
          </div>
        </div>
      </div>
      <canvas
        className="bg-skin-base pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      ></canvas>
    </section>
  );
}
