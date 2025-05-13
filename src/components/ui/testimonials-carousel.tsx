
import React from "react";
import TestimonialCarousel from "@/components/TestimonialCarousel";

interface TestimonialsCarouselProps {
  className?: string;
  title?: string;
  description?: string;
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
  title,
  description,
  testimonials,
}: TestimonialsCarouselProps = {}) {
  return (
    <div className={className}>
      {title && <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">{title}</h2>}
      {description && <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 text-center">{description}</p>}
      <TestimonialCarousel />
    </div>
  );
}
