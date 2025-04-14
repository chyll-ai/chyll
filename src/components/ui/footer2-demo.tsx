
import { Footer2 } from "@/components/ui/footer2";

const demoData = {
  tagline: "Intelligent automation for your business.",
  menuItems: [
    {
      title: "Product",
      links: [
        { text: "Overview", url: "#" },
        { text: "Features", url: "#features" },
        { text: "How It Works", url: "#how-it-works" },
        { text: "Pricing", url: "#pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About Us", url: "/about-us" },
        { text: "Careers", url: "/careers" },
        { text: "Contact", url: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Blog", url: "/blog" },
        { text: "FAQ", url: "/faq" },
        { text: "Support", url: "/support" },
        { text: "Documentation", url: "/documentation" },
      ],
    },
    {
      title: "Connect",
      links: [
        { text: "Twitter", url: "#" },
        { text: "LinkedIn", url: "#" },
        { text: "Instagram", url: "#" },
        { text: "YouTube", url: "#" },
      ],
    },
  ],
  copyright: "© 2024 GenerativSchool. All rights reserved.",
  bottomLinks: [
    { text: "Terms of Service", url: "/terms" },
    { text: "Privacy Policy", url: "/privacy" },
    { text: "Cookie Policy", url: "/cookies" },
  ],
};

function Footer2Demo() {
  return <Footer2 {...demoData} />;
}

export { Footer2Demo };
