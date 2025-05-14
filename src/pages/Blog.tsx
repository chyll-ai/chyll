
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { BlogList } from '@/components/blog/blog-list';
import { initialBlogPosts, additionalBlogPosts, finalBlogPosts } from '@/components/blog/blog-data';
import { BlogPost } from '@/components/blog/blog-card';
import { useLanguage } from '@/context/LanguageContext';
import SEOMetadata from '@/components/SEOMetadata';

const Blog = () => {
  const allPosts: BlogPost[] = [...initialBlogPosts, ...additionalBlogPosts, ...finalBlogPosts];
  const { toast } = useToast();
  const location = useLocation();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = React.useState(false);

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
      
      <section className="py-16">
        <div className="container-custom">
          {allPosts.length > 0 ? (
            <BlogList 
              posts={allPosts} 
              isLoading={isLoading} 
              hasMore={false}
              onLoadMore={() => {}} 
            />
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-medium text-gray-600">No articles available</h2>
              <p className="text-gray-500 mt-2">Check back soon for new content!</p>
            </div>
          )}
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default Blog;
