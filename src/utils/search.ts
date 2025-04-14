
import { Route } from '../types/search';

// Define all documentation routes with searchable content
export const documentationRoutes: Route[] = [
  {
    path: '/documentation/getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of using GenerativSchool',
    keywords: ['basics', 'introduction', 'overview', 'start', 'beginning'],
  },
  {
    path: '/documentation/getting-started/quick-start',
    title: 'Quick Start Guide',
    description: 'Get up and running with GenerativSchool quickly',
    keywords: ['quick', 'guide', 'fast', 'setup', 'start'],
  },
  {
    path: '/documentation/getting-started/platform-overview',
    title: 'Platform Overview',
    description: 'Understand the GenerativSchool platform components',
    keywords: ['platform', 'overview', 'components', 'structure', 'architecture'],
  },
  {
    path: '/documentation/getting-started/account-setup',
    title: 'Setting Up Your Account',
    description: 'Configure your GenerativSchool account for success',
    keywords: ['account', 'setup', 'configuration', 'profile', 'settings'],
  },
  {
    path: '/documentation/getting-started/first-automation',
    title: 'Creating Your First Automation',
    description: 'Build your first automation workflow in GenerativSchool',
    keywords: ['automation', 'workflow', 'create', 'first', 'tutorial'],
  },
  {
    path: '/documentation/api',
    title: 'API Documentation',
    description: 'Integrate with our API',
    keywords: ['api', 'integration', 'developers', 'endpoints', 'programming'],
  },
  {
    path: '/documentation/api/reference',
    title: 'API Reference',
    description: 'Complete reference for the GenerativSchool API',
    keywords: ['api', 'reference', 'endpoints', 'methods', 'parameters'],
  },
  {
    path: '/documentation/api/authentication',
    title: 'Authentication',
    description: 'Secure your API calls with proper authentication',
    keywords: ['authentication', 'auth', 'security', 'tokens', 'keys'],
  },
  {
    path: '/documentation/api/rate-limits',
    title: 'Rate Limits',
    description: 'Understand API request limitations and quotas',
    keywords: ['rate', 'limits', 'quotas', 'throttling', 'requests'],
  },
  {
    path: '/documentation/api/webhooks',
    title: 'Webhooks',
    description: 'Implement webhooks for real-time notifications',
    keywords: ['webhooks', 'events', 'notifications', 'callbacks', 'real-time'],
  },
  {
    path: '/documentation/user-management',
    title: 'User Management',
    description: 'Control access and permissions',
    keywords: ['users', 'management', 'access', 'control', 'permissions'],
  },
  {
    path: '/documentation/user-management/roles',
    title: 'User Roles and Permissions',
    description: 'Configure user roles and permission levels',
    keywords: ['roles', 'permissions', 'access', 'users', 'privileges'],
  },
  {
    path: '/documentation/user-management/collaboration',
    title: 'Team Collaboration',
    description: 'Enhance productivity through effective team collaboration',
    keywords: ['team', 'collaboration', 'sharing', 'workflow', 'productivity'],
  },
  {
    path: '/documentation/user-management/access-control',
    title: 'Access Control',
    description: 'Manage resource access and security settings',
    keywords: ['access', 'control', 'security', 'permissions', 'restrictions'],
  },
  {
    path: '/documentation/user-management/audit-logs',
    title: 'Audit Logs',
    description: 'Track and analyze user activities for security and compliance',
    keywords: ['audit', 'logs', 'tracking', 'activity', 'compliance', 'security'],
  },
];

// Search function that returns matching routes based on query
export const searchDocumentation = (query: string): Route[] => {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return documentationRoutes.filter(route => {
    // Search in title
    if (route.title.toLowerCase().includes(normalizedQuery)) {
      return true;
    }
    
    // Search in description
    if (route.description.toLowerCase().includes(normalizedQuery)) {
      return true;
    }
    
    // Search in keywords
    if (route.keywords?.some(keyword => keyword.toLowerCase().includes(normalizedQuery))) {
      return true;
    }
    
    return false;
  });
};
