
import { TestimonialsSection } from "@/components/ui/testimonials-section";

// Témoignages en français en dur
export function TestimonialsSectionDemo() {
  const testimonials = [
    {
      author: {
        name: "Thomas Martin",
        handle: "@thomasceo",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
      },
      text: "Notre agent chyll.ai a multiplié par 3 notre pipeline commercial en seulement 2 mois. C'est comme avoir un SDR qui travaille 24/7 sans jamais se fatiguer.",
      href: "#"
    },
    {
      author: {
        name: "Sophie Dubois",
        handle: "@sophiegrowthlead",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      text: "En tant que responsable croissance, chyll.ai a complètement transformé notre approche de la prospection. Plus besoin de passer des heures sur LinkedIn, tout est automatisé et notre CRM est toujours à jour.",
      href: "#"
    },
    {
      author: {
        name: "Marc Leroy",
        handle: "@marcfondateur",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
      },
      text: "Avec chyll.ai, nous avons réduit de 70% le temps consacré à la recherche de leads. Mon équipe commerciale peut maintenant se concentrer uniquement sur la conversion des prospects qualifiés.",
      href: "#"
    }
  ];

  return (
    <TestimonialsSection testimonials={testimonials} />
  );
}
