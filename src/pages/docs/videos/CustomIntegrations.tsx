
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Play, Clock, ChevronRight } from 'lucide-react';

const CustomIntegrations = () => {
  const sidebarLinks = [
    { title: 'All Videos', url: '/documentation/videos' },
    { title: 'Building AI Workflows', url: '/documentation/videos/ai-workflows' },
    { title: 'Advanced Automation', url: '/documentation/videos/advanced-automation' },
    { title: 'Custom Integrations', url: '/documentation/videos/custom-integrations', active: true },
    { title: 'Data Analysis', url: '/documentation/videos/data-analysis' },
  ];

  const videos = [
    {
      id: 'video3',
      title: 'Building Custom API Integrations',
      description: 'Connect to any external API and process data in your workflows',
      duration: '15:33',
      thumbnail: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=600&h=400&fit=crop',
      level: 'Intermediate'
    },
    {
      id: 'video7',
      title: 'Webhook Integration Patterns',
      description: 'Learn different patterns for webhook-based integrations and callbacks',
      duration: '14:29',
      thumbnail: 'https://images.unsplash.com/photo-1581472723648-909f4851d4ae?w=600&h=400&fit=crop',
      level: 'Intermediate'
    },
    {
      id: 'video13',
      title: 'Custom Database Connectors',
      description: 'Build specialized connectors for different database systems',
      duration: '17:42',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=400&fit=crop',
      level: 'Advanced'
    },
    {
      id: 'video14',
      title: 'Authentication Methods for Third-Party Services',
      description: 'Implement OAuth, API keys, and other authentication methods',
      duration: '12:18',
      thumbnail: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=600&h=400&fit=crop',
      level: 'Intermediate'
    }
  ];

  return (
    <DocLayout
      title="Custom Integrations"
      description="Connect GenerativSchool with external services and systems"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'Video Tutorials', url: '/documentation/videos' },
        { title: 'Custom Integrations', url: '/documentation/videos/custom-integrations' }
      ]}
      previousLink={{ title: 'Advanced Automation', url: '/documentation/videos/advanced-automation' }}
      nextLink={{ title: 'Data Analysis', url: '/documentation/videos/data-analysis' }}
    >
      <section className="mb-8">
        <p className="text-lg mb-6">
          Learn how to extend GenerativSchool by connecting to external services, APIs, and databases. These tutorials cover integration patterns, authentication, webhooks, and creating custom connectors.
        </p>
      </section>

      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={video.thumbnail}
                  alt={`${video.title} thumbnail`}
                  className="w-full h-auto object-cover aspect-video"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition-colors">
                    <Play className="h-6 w-6 text-indigo-600" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{video.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    video.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    video.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                    'bg-indigo-100 text-indigo-800'
                  }`}>
                    {video.level}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>
                <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                  Watch tutorial
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Popular Integrations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Salesforce', 'Slack', 'Google Workspace', 'Microsoft 365'].map((integration) => (
            <div key={integration} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-full mb-3 flex items-center justify-center">
                {/* Placeholder for integration icon */}
                <div className="w-6 h-6 bg-indigo-500 rounded-sm"></div>
              </div>
              <span className="text-center font-medium">{integration}</span>
            </div>
          ))}
        </div>
      </section>
    </DocLayout>
  );
};

export default CustomIntegrations;
