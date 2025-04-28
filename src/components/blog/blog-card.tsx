
import React from 'react';
import { CalendarIcon, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
}

export const BlogCard = ({ post }: { post: BlogPost }) => {
  const { language } = useLanguage();
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <img 
        src={post.imageUrl} 
        alt={post.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
          <span className="flex items-center">
            <CalendarIcon size={14} className="mr-1" />
            {post.date}
          </span>
          <span className="flex items-center">
            <Clock size={14} className="mr-1" />
            {post.readTime}
          </span>
          <span className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
            <Tag size={14} className="mr-1" />
            {post.category}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <Link 
          to={`/blog/${post.id}`}
          className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
        >
          {language === 'fr' ? 'Lire la suite →' : 'Read more →'}
        </Link>
      </div>
    </div>
  );
};
