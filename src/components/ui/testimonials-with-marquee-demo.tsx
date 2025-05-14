
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";

export function TestimonialsWithMarqueeDemo() {
  // Témoignages en français
  const testimonials = [
    {
      author: {
        name: "Alex Chen",
        handle: "@alexfondateur",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      text: "Notre agent IA gère tous nos emails clients avec une précision parfaite. C'est comme avoir un membre d'équipe dédié qui travaille 24/7 sans pauses.",
      href: "#"
    },
    {
      author: {
        name: "Sarah Miller",
        handle: "@sarahstartup",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
      },
      text: "En tant que fondatrice solo, mon agent IA gère tout notre pipeline de vente. Il suit les leads, qualifie les prospects et conclut même des affaires pendant que je dors.",
      href: "#"
    },
    {
      author: {
        name: "Michael Rodriguez",
        handle: "@mikeceo",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      text: "Nous avons réduit les coûts de notre équipe de support de 70% depuis l'implémentation des employés IA. Ils gèrent les demandes de routine avec une précision et une empathie incroyables."
    }
  ];
  
  return (
    <TestimonialsSection
      testimonials={testimonials}
    />
  );
}
