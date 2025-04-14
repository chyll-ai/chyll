
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Since hiring Obi-One Voice AI, we've saved 20 hours a week and doubled our lead response time. It's like having a Jedi answer every call!",
    author: "Jane D.",
    title: "Marketing Lead",
    company: "Growth Agency",
    stars: 5
  },
  {
    quote: "Leia Conversation AI has transformed our customer service. We're handling twice as many calls with half the staff. The diplomatic skills are truly royal level.",
    author: "Michael T.",
    title: "Operations Manager",
    company: "ServiceTech Inc.",
    stars: 5
  },
  {
    quote: "As a solo founder, R2-View has become my most valuable team member. It handles our online reputation 24/7 without missing a beat - beep boop perfection!",
    author: "Sarah K.",
    title: "Founder",
    company: "Startup Ventures",
    stars: 5
  }
];

const TestimonialCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
  };

  const prevSlide = () => {
    setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div className="flex mx-auto max-w-3xl">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`min-w-full px-6 transition-transform duration-500 ease-in-out ${
              index === activeIndex ? "translate-x-0" : "translate-x-full absolute opacity-0"
            }`}
          >
            <div className="bg-white p-8 rounded-xl shadow-card border border-gray-100">
              <div className="flex mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 italic mb-6">"{testimonial.quote}"</blockquote>
              <div>
                <p className="font-medium text-gray-900">{testimonial.author}</p>
                <p className="text-gray-600">{testimonial.title}, {testimonial.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md text-gray-700 hover:text-brand-blue ml-2 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md text-gray-700 hover:text-brand-blue mr-2 transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="flex justify-center mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 mx-1 rounded-full transition-colors ${
              index === activeIndex ? "bg-brand-blue" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
