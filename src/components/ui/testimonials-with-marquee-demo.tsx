
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";
import { useLanguage } from "@/context/LanguageContext";

export function TestimonialsWithMarqueeDemo() {
  const { language } = useLanguage();

  // French testimonials
  const testimonials = [
    {
      author: {
        name: "Alex Chen",
        handle: "@alexfounder",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      text: "Notre Employé IA gère tous nos emails clients avec une précision parfaite. C'est comme avoir un membre d'équipe dédié qui travaille 24/7 sans pause.",
      href: "#"
    },
    {
      author: {
        name: "Sarah Miller",
        handle: "@sarahstartup",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
      },
      text: "En tant que fondatrice solo, mon Employé IA gère tout notre pipeline commercial. Il fait le suivi des prospects, qualifie les leads et conclut même des ventes pendant que je dors.",
      href: "#"
    },
    {
      author: {
        name: "Michael Rodriguez",
        handle: "@mikeceo",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      text: "Nous avons réduit nos coûts d'équipe support de 70% depuis l'implémentation d'Employés IA. Ils gèrent les demandes routinières avec une précision et une empathie incroyables."
    }
  ];
  
  return (
    <TestimonialsSection
      testimonials={testimonials}
    />
  );
}
