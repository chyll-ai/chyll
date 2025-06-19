
import React from "react";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { useLanguage } from "@/context/LanguageContext";

interface TestimonialsCarouselProps {
  className?: string;
  testimonials?: Array<{
    author: {
      name: string;
      handle: string;
      avatar: string;
    };
    text: string;
    href: string;
  }>;
}

export function TestimonialsCarousel({
  className,
  testimonials,
}: TestimonialsCarouselProps = {}) {
  const { language } = useLanguage();
  
  return (
    <div className={className}>
      <TestimonialCarousel />
    </div>
  );
}
