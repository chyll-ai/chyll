import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2 } from '@/components/ui/footer2';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import SEOMetadata from '@/components/SEOMetadata';
import { Blog8 } from "@/components/ui/blog8";
import { initialBlogPosts, additionalBlogPosts, finalBlogPosts } from '@/components/blog/blog-data';
import { Link } from 'react-router-dom';

// New optimized blog posts focused on "chyll"
const chyllOptimizedPosts = [
  {
    id: 101,
    title: "C'est quoi chyll ? Un assistant commercial IA pour les entreprises modernes",
    excerpt: "Découvrez comment chyll révolutionne la prospection B2B en automatisant les tâches chronophages et en enrichissant vos leads avec des données de qualité.",
    category: "Présentation",
    date: "15 Mai 2025",
    readTime: "6 min",
    imageUrl: "https://images.unsplash.com/photo-1496065187959-7f07b8353c55?q=80&w=1200",
    url: "/blog/101",
    tags: ["chyll", "IA commerciale", "prospection B2B"]
  },
  {
    id: 102,
    title: "Comment chyll révolutionne la prospection B2B avec l'IA",
    excerpt: "Plongez dans les coulisses de la technologie chyll et découvrez comment notre IA transforme radicalement l'approche de la prospection commerciale.",
    category: "Technologie",
    date: "10 Mai 2025",
    readTime: "8 min",
    imageUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1200",
    url: "/blog/102",
    tags: ["chyll", "intelligence artificielle", "automatisation commerciale"]
  },
  {
    id: 103,
    title: "Top outils d'automatisation commerciale en 2025 – dont chyll",
    excerpt: "Analyse comparative des meilleures solutions d'automatisation pour les équipes commerciales. Découvrez pourquoi chyll se distingue dans ce paysage concurrentiel.",
    category: "Comparatif",
    date: "5 Mai 2025",
    readTime: "10 min",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
    url: "/blog/103",
    tags: ["chyll", "outils commerciaux", "comparatif"]
  },
  {
    id: 104,
    title: "Pourquoi nous avons créé chyll pour les startups",
    excerpt: "L'histoire de chyll racontée par ses fondateurs : notre vision pour résoudre les défis de prospection des startups et PME grâce à l'intelligence artificielle.",
    category: "Notre histoire",
    date: "1 Mai 2025",
    readTime: "7 min",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200",
    url: "/blog/104",
    tags: ["chyll", "startups", "fondateurs"]
  }
];

const Blog = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = React.useState(false);

  // Transform our blog data to match the Blog8 component's format
  const existingPosts = [...initialBlogPosts, ...additionalBlogPosts, ...finalBlogPosts].map(post => ({
    id: post.id.toString(),
    title: post.title,
    summary: post.excerpt,
    label: post.category,
    author: "Soufiane Lemqari",
    published: post.date,
    url: post.url,
    image: post.imageUrl,
    tags: [post.category],
  }));
  
  // Transform our new optimized blog posts
  const optimizedPosts = chyllOptimizedPosts.map(post => ({
    id: post.id.toString(),
    title: post.title,
    summary: post.excerpt,
    label: post.category,
    author: "Équipe chyll",
    published: post.date,
    url: post.url,
    image: post.imageUrl,
    tags: post.tags,
  }));
  
  // Combine all posts with optimized posts first
  const allPosts = [...optimizedPosts, ...existingPosts];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOMetadata 
        title="Blog chyll | Ressources sur l'assistant commercial IA"
        description="Découvrez les derniers articles du blog chyll sur la prospection B2B automatisée, l'enrichissement de leads et les solutions IA pour les équipes commerciales."
        canonicalUrl="/blog"
        keywords={["chyll", "blog chyll", "assistant commercial IA", "prospection B2B", "automatisation des ventes", "outils IA commerciaux"]}
        ogType="website"
      />
      
      <Navbar />
      
      <section className="bg-indigo-50 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Le blog de chyll</h1>
            <p className="text-lg text-gray-700">
              Découvrez nos articles, guides et études de cas sur l'assistant commercial chyll, la prospection B2B automatisée, et l'utilisation de l'IA dans les processus commerciaux.
            </p>
          </div>
        </div>
      </section>
      
      {/* Featured article section with internal linking */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Article à la une</h2>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl overflow-hidden shadow-md">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={optimizedPosts[0].image} 
                    alt="C'est quoi chyll ?"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 md:w-1/2">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    {optimizedPosts[0].label}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold mt-2 mb-3">
                    {optimizedPosts[0].title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {optimizedPosts[0].summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {optimizedPosts[0].published}
                    </div>
                    <Link 
                      to={optimizedPosts[0].url}
                      className="text-indigo-600 font-medium hover:text-indigo-800"
                    >
                      Lire l'article →
                    </Link>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                      Découvrez également comment <Link to="/" className="text-indigo-600 hover:text-indigo-800">chyll</Link> peut transformer votre approche commerciale ou explorez notre <Link to="/about-us" className="text-indigo-600 hover:text-indigo-800">histoire</Link> pour comprendre notre vision de la prospection B2B.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Use the Blog8 component for the rest of the articles */}
      <Blog8 
        heading="Les derniers articles de chyll"
        description="Découvrez nos dernières ressources sur l'assistant commercial chyll, la prospection B2B automatisée et l'IA commerciale"
        posts={allPosts}
      />
      
      {/* Cross-linking section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Explorez l'univers chyll</h2>
            <p className="text-lg text-gray-700 mb-8">
              Découvrez comment l'assistant commercial chyll peut transformer votre approche de la prospection B2B et vous aider à générer plus de leads qualifiés.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold text-lg mb-2">Découvrir chyll</h3>
                <p className="text-gray-600">Comment fonctionne notre assistant commercial IA et ce qu'il peut faire pour votre entreprise.</p>
              </Link>
              <Link to="/about-us" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold text-lg mb-2">À propos de chyll</h3>
                <p className="text-gray-600">L'histoire de chyll et pourquoi nous avons créé cette plateforme pour révolutionner la prospection.</p>
              </Link>
              <a href="https://cal.com/chyll.ai/30min" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold text-lg mb-2">Essayer chyll</h3>
                <p className="text-gray-100">Réservez une démonstration gratuite et découvrez l'impact de chyll sur votre processus commercial.</p>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer2 />
    </div>
  );
};

export default Blog;
