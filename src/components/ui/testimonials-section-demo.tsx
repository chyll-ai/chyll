
import { TestimonialsSection } from "@/components/ui/testimonials-section";
import { useLanguage } from "@/context/LanguageContext";

export function TestimonialsSectionDemo() {
  const { language } = useLanguage();
  
  // French testimonials
  const testimonials = [
    {
      author: {
        name: "Rebecca Taylor",
        handle: "@rebecca_founder",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
      },
      text: "Notre agent chyll.ai rédige tous nos textes marketing, posts sur les réseaux sociaux et campagnes email. La qualité est incroyable, et cela m'a fait économiser 25 heures chaque semaine.",
      href: "#"
    },
    {
      author: {
        name: "Jason Kim",
        handle: "@jason_startup",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      text: "L'agent chyll.ai gère tout notre processus de prospection sortante - de la recherche de prospects au suivi. Nous avons triplé notre pipeline sans embaucher personne.",
      href: "#"
    },
    {
      author: {
        name: "Maria Garcia",
        handle: "@maria_ceo",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
      },
      text: "Mon agent chyll.ai surveille les scores de santé des clients et contacte proactivement les comptes à risque. Notre taux de rétention s'est amélioré de 35%.",
      href: "#"
    },
  ];
  
  return (
    <TestimonialsSection
      testimonials={testimonials}
    />
  )
}
