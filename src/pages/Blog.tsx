
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { BlogList } from '@/components/blog/blog-list';
import { initialBlogPosts, additionalBlogPosts, finalBlogPosts } from '@/components/blog/blog-data';
import { BlogPost } from '@/components/blog/blog-card';
import { useLanguage } from '@/context/LanguageContext';
import { BlogSectionWithRichPreview } from '@/components/ui/blog-section-with-rich-preview';

const Blog = () => {
  // Empty blog posts since we've deleted all articles
  const allPosts: BlogPost[] = [];
  const { toast } = useToast();
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
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
          <div className="text-center py-20">
            <h2 className="text-2xl font-medium text-gray-600">No articles available</h2>
            <p className="text-gray-500 mt-2">Check back soon for new content!</p>
          </div>
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default Blog;
