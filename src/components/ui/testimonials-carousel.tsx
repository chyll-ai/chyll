
import React from "react";
import TestimonialCarousel from "@/components/TestimonialCarousel";

interface TestimonialsCarouselProps {
  className?: string;
}

export function TestimonialsCarousel({
  className,
}: TestimonialsCarouselProps = {}) {
  return (
    <div className={className}>
      <TestimonialCarousel />
    </div>
  );
}
