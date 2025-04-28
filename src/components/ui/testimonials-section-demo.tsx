
import { TestimonialsSection } from "@/components/ui/testimonials-section";
import { useLanguage } from "@/context/LanguageContext";

export function TestimonialsSectionDemo() {
  const { language, t } = useLanguage();
  
  // Default testimonials in case translations are missing
  const defaultTestimonials = [
    {
      author: {
        name: "Rebecca Taylor",
        handle: "@rebecca_founder",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
      },
      text: "Our AI Communications Employee writes all our marketing copy, social posts, and email campaigns. The quality is amazing, and it's saved me 25 hours every week.",
      href: "#"
    },
    {
      author: {
        name: "Jason Kim",
        handle: "@jason_startup",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      text: "The AI Sales Employee handles our entire outbound process - from prospecting to follow-ups. We've tripled our pipeline with zero additional headcount.",
      href: "#"
    },
    {
      author: {
        name: "Maria Garcia",
        handle: "@maria_ceo",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
      },
      text: "My AI Customer Success Employee monitors customer health scores and proactively reaches out to at-risk accounts. Our retention rate has improved by 35%.",
      href: "#"
    },
  ];
  
  // Use testimonials from translations if available, otherwise use defaults
  const testimonials = language === 'fr' && t.home?.testimonials?.quotes
    ? (t.home.testimonials.quotes || []).map(quote => ({
        author: {
          name: quote.author,
          handle: quote.handle,
          avatar: getAvatarForName(quote.author)
        },
        text: quote.text,
        href: "#"
      }))
    : defaultTestimonials;
  
  // Default titles in case translations are missing
  const defaultTitle = "AI Employees Transforming Founder-Led Businesses";
  const defaultDescription = "See how founders and CEOs are using AI team members to scale faster with fewer resources";
  
  return (
    <TestimonialsSection
      title={language === 'fr' && t.home?.testimonials?.title ? t.home.testimonials.title : defaultTitle}
      description={language === 'fr' && t.home?.testimonials?.subtitle ? t.home.testimonials.subtitle : defaultDescription}
      testimonials={testimonials}
    />
  )
}

// Helper function to get avatar based on name
function getAvatarForName(name: string) {
  const avatarMap: {[key: string]: string} = {
    "Alex Chen": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "Sarah Miller": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    "Michael Rodriguez": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  };
  
  return avatarMap[name] || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
}
