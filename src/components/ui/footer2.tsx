
import React from 'react';

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer2 = ({
  tagline = "Intelligent automation for your business.",
  menuItems = [
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
  copyright = "© 2024 GenerativSchool. All rights reserved.",
  bottomLinks = [
    { text: "Terms of Service", url: "#" },
    { text: "Privacy Policy", url: "#" },
    { text: "Cookie Policy", url: "#" },
  ],
}: Footer2Props) => {
  return (
    <section className="py-16 bg-[#1A1F2C] text-white">
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <p className="text-xl font-semibold text-white">GenerativSchool</p>
              <p className="mt-4 font-bold text-[#aaadb0]">{tagline}</p>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-white">{section.title}</h3>
                <ul className="space-y-4 text-[#8E9196]">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-[#9b87f5] transition-colors"
                    >
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-col justify-between gap-4 border-t border-gray-700 pt-8 text-sm font-medium text-[#8E9196] md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex flex-wrap gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="hover:text-[#9b87f5] transition-colors">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer2 };
