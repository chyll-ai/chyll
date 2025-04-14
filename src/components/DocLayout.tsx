
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';
import DocSearch from '@/components/DocSearch';

interface DocLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  previousLink?: { title: string; url: string };
  nextLink?: { title: string; url: string };
  sidebarLinks?: Array<{ title: string; url: string; active?: boolean }>;
  breadcrumbs?: Array<{ title: string; url: string }>;
}

const DocLayout = ({
  children,
  title,
  description,
  previousLink,
  nextLink,
  sidebarLinks,
  breadcrumbs = []
}: DocLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-indigo-50 py-10">
        <div className="container-custom">
          {breadcrumbs.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <Link to="/documentation" className="hover:text-indigo-600">Documentation</Link>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <ChevronRight className="h-4 w-4" />
                  <Link to={crumb.url} className="hover:text-indigo-600">{crumb.title}</Link>
                </React.Fragment>
              ))}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
              {description && (
                <p className="text-lg text-gray-700">{description}</p>
              )}
            </div>
            <div className="w-full md:w-64">
              <DocSearch placeholder="Search docs..." />
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row gap-10">
          {sidebarLinks && sidebarLinks.length > 0 && (
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="font-semibold mb-4 text-gray-900">In this section</h3>
                <nav className="space-y-1">
                  {sidebarLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.url}
                      className={`block py-2 px-3 rounded-md ${
                        link.active
                          ? 'bg-indigo-50 text-indigo-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {link.title}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          )}
          
          <div className="flex-1 max-w-4xl">
            <div className="prose prose-indigo max-w-none">
              {children}
            </div>
            
            {(previousLink || nextLink) && (
              <div className="mt-12 border-t border-gray-200 pt-6 flex justify-between">
                {previousLink ? (
                  <Link
                    to={previousLink.url}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {previousLink.title}
                  </Link>
                ) : (
                  <div></div>
                )}
                
                {nextLink && (
                  <Link
                    to={nextLink.url}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    {nextLink.title}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer2Demo />
    </div>
  );
};

export default DocLayout;
