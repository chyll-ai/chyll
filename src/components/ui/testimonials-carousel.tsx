
import React from "react";
import TestimonialCarousel from "@/components/TestimonialCarousel";

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
  return (
    <div className={className}>
      <TestimonialCarousel />
    </div>
  );
}
