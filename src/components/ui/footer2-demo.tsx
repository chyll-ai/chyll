
import { Footer2 } from "@/components/ui/footer2";
import { useLanguage } from "@/context/LanguageContext";

function Footer2Demo() {
  const { t } = useLanguage();
  
  const demoData = {
    tagline: t.footer.tagline,
    menuItems: [
      {
        title: t.footer.menuTitles.product,
        links: [
          { text: "Overview", url: "#" },
          { text: t.nav.features, url: "#features" },
          { text: t.nav.howItWorks, url: "#how-it-works" },
          { text: t.nav.pricing, url: "#pricing" },
        ],
      },
      {
        title: t.footer.menuTitles.company,
        links: [
          { text: "About Us", url: "/about-us" },
          { text: "Careers", url: "/careers" },
          { text: t.common.contactUs, url: "/contact" },
        ],
      },
      {
        title: t.footer.menuTitles.resources,
        links: [
          { text: "Blog", url: "/blog" },
          { text: "FAQ", url: "/faq" },
          { text: "Support", url: "/support" },
        ],
      },
      {
        title: t.footer.menuTitles.connect,
        links: [
          { text: "Twitter", url: "#" },
          { text: "LinkedIn", url: "#" },
          { text: "Instagram", url: "#" },
          { text: "YouTube", url: "#" },
        ],
      },
    ],
    copyright: t.footer.copyright,
    bottomLinks: [
      { text: t.footer.links.terms, url: "/terms" },
      { text: t.footer.links.privacy, url: "/privacy" },
      { text: t.footer.links.cookies, url: "/cookies" },
    ],
  };

  return <Footer2 {...demoData} />;
}

export { Footer2Demo };
