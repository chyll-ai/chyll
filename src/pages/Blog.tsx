
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import SEOMetadata from '@/components/SEOMetadata';
import { Blog8 } from "@/components/ui/blog8";
import { initialBlogPosts, additionalBlogPosts, finalBlogPosts } from '@/components/blog/blog-data';

const Blog = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = React.useState(false);

  // Transform our blog data to match the Blog8 component's format
  const transformedPosts = [...initialBlogPosts, ...additionalBlogPosts, ...finalBlogPosts].map(post => ({
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

  return (
    <div className="min-h-screen flex flex-col">
      <SEOMetadata 
        title="Blog | Ressources & Actualités sur la Prospection B2B"
        description="Découvrez nos articles, guides et études de cas sur la prospection B2B automatisée, l'enrichissement de leads et l'optimisation commerciale grâce à l'IA."
        canonicalUrl="/blog"
        keywords={["prospection B2B", "enrichissement de leads", "SDR automatisé", "IA commerciale", "génération de leads"]}
        ogType="website"
      />
      
      <Navbar currentPath={location.pathname} />
      
      <section className="bg-indigo-50 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{t.blog.title}</h1>
            <p className="text-lg text-gray-700">
              {t.blog.subtitle}
            </p>
          </div>
        </div>
      </section>
      
      {/* Use the new Blog8 component instead of BlogSectionWithRichPreview */}
      <Blog8 
        heading="Nos articles récents"
        description="Découvrez nos dernières ressources sur la prospection B2B automatisée, l'enrichissement de leads et l'IA commerciale"
        posts={transformedPosts}
      />
      
      <Footer2Demo />
    </div>
  );
};

export default Blog;
