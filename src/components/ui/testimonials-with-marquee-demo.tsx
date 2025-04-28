
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";
import { useLanguage } from "@/context/LanguageContext";

export function TestimonialsWithMarqueeDemo() {
  const { language, t } = useLanguage();

  // Default testimonials in case translations are missing
  const defaultTestimonials = [
    {
      author: {
        name: "Alex Chen",
        handle: "@alexfounder",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      text: "Our AI Employee handles all our customer emails with perfect accuracy. It's like having a dedicated team member who works 24/7 without breaks.",
      href: "#"
    },
    {
      author: {
        name: "Sarah Miller",
        handle: "@sarahstartup",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
      },
      text: "As a solo founder, my AI Employee manages our entire sales pipeline. It follows up with leads, qualifies prospects, and even closes deals while I sleep.",
      href: "#"
    },
    {
      author: {
        name: "Michael Rodriguez",
        handle: "@mikeceo",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      text: "We've reduced our support team costs by 70% since implementing AI Employees. They handle routine inquiries with incredible accuracy and empathy."
    }
  ];

  // Check if French testimonials are available
  const hasFrenchTestimonials = language === 'fr' && t.home && 'testimonials' in t.home && t.home.testimonials && 'quotes' in t.home.testimonials;
  
  // Use testimonials from translations if available
  const testimonials = hasFrenchTestimonials
    ? t.home.testimonials.quotes.map(quote => ({
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
  const defaultTitle = "Founders love our AI Employees";
  const defaultDescription = "Join thousands of business owners who are scaling their operations with our tireless AI team members";
  
  // Check if French titles are available
  const hasFrenchTitles = language === 'fr' && t.home && 'testimonials' in t.home && t.home.testimonials && 'title' in t.home.testimonials;
  const hasFrenchSubtitle = language === 'fr' && t.home && 'testimonials' in t.home && t.home.testimonials && 'subtitle' in t.home.testimonials;
  
  return (
    <TestimonialsSection
      title={hasFrenchTitles ? t.home.testimonials.title : defaultTitle}
      description={hasFrenchSubtitle ? t.home.testimonials.subtitle : defaultDescription}
      testimonials={testimonials}
    />
  );
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
