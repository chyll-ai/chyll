
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
        { text: "About Us", url: "#" },
        { text: "Team", url: "#" },
        { text: "Careers", url: "#" },
        { text: "Contact", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Blog", url: "#" },
        { text: "FAQ", url: "#faq" },
        { text: "Support", url: "#" },
        { text: "Documentation", url: "#" },
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
    { text: "Terms of Service", url: "#" },
    { text: "Privacy Policy", url: "#" },
    { text: "Cookie Policy", url: "#" },
  ],
};

function Footer2Demo() {
  return <Footer2 {...demoData} />;
}

export { Footer2Demo };
