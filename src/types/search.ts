
export interface Route {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  lastModified?: string;
  priority?: number;
}

export const siteRoutes: Route[] = [
  {
    path: "/",
    title: "chyll.ai - La prospection B2B, automatisée",
    description: "chyll.ai trouve les bons prospects, les enrichit, et met à jour ton CRM pendant que tu bosses sur autre chose.",
    keywords: ["chyll.ai", "chyll", "prospection B2B", "SDR agent", "enrichissement", "leads B2B", "automation", "CRM"],
    lastModified: "2025-05-13",
    priority: 1.0,
  },
  {
    path: "/about-us",
    title: "À propos de chyll.ai | Agent SDR automatisé",
    description: "Découvrez comment chyll.ai révolutionne la prospection B2B avec notre solution d'agent SDR automatisé pour les équipes commerciales.",
    keywords: ["chyll.ai", "à propos", "histoire", "mission", "SDR virtuel", "équipe", "prospection automatisée"],
    lastModified: "2025-05-13",
    priority: 0.8,
  },
  {
    path: "/contact",
    title: "Contactez-nous | chyll.ai - Assistant de prospection B2B",
    description: "Des questions sur notre agent SDR automatisé? Prêt à booster votre prospection? Contactez l'équipe chyll.ai.",
    keywords: ["chyll.ai", "contact", "démo", "agent SDR", "prospection B2B", "support"],
    lastModified: "2025-05-13",
    priority: 0.7,
  },
  {
    path: "/blog",
    title: "Blog | Stratégies de prospection B2B et conseils SDR | chyll.ai",
    description: "Découvrez nos articles sur l'automatisation de la prospection, les meilleures pratiques SDR et les stratégies d'enrichissement de leads.",
    keywords: ["chyll.ai", "blog", "prospection B2B", "SDR", "sales development", "enrichissement", "automation"],
    lastModified: "2025-05-13",
    priority: 0.9,
  },
  {
    path: "/faq",
    title: "Questions fréquentes | Agent SDR automatisé | chyll.ai",
    description: "Trouvez des réponses à vos questions sur chyll.ai, notre plateforme d'agent SDR virtuel et d'enrichissement de leads B2B.",
    keywords: ["chyll.ai", "FAQ", "questions", "agent SDR", "enrichissement", "leads", "automation B2B"],
    lastModified: "2025-05-13",
    priority: 0.7,
  }
];

// Function to generate the sitemap URLs from routes
export const generateSitemapFromRoutes = (baseUrl: string, routes: Route[]): string => {
  const sitemapStart = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const sitemapEnd = '</urlset>';
  
  const urlEntries = routes.map(route => {
    const priority = route.priority || 0.5;
    const lastModified = route.lastModified || '2025-05-13';
    
    return `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('');
  
  return `${sitemapStart}${urlEntries}\n${sitemapEnd}`;
};
