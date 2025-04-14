
import React from 'react';
import { BookOpen } from 'lucide-react';

const CollaborativeAnalytics = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Collaborative Analytics and Reporting</h2>
      
      <p className="mb-6">
        GenerativSchool allows teams to collaboratively analyze workflow performance and create shared reports.
      </p>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Shared Dashboards</h3>
        <p className="mb-4">
          Create interactive dashboards that can be accessed by multiple team members, providing a central 
          place to monitor key metrics and performance indicators.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Creating a Shared Dashboard</h4>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Go to Analytics {"->"} Dashboards</li>
              <li>Click "New Dashboard"</li>
              <li>Add widgets with relevant metrics</li>
              <li>Configure refresh intervals</li>
              <li>Set sharing permissions</li>
              <li>Save and publish</li>
            </ol>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Dashboard Collaboration Features</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Multiple editors can work simultaneously</li>
              <li>Comment on specific widgets or metrics</li>
              <li>Schedule automated reports</li>
              <li>Export data in various formats</li>
              <li>Share insights with annotations</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <BookOpen className="h-6 w-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Learn More</h3>
            <p className="mb-4">
              Explore our additional resources on team collaboration to get the most out of GenerativSchool:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:underline">Collaboration Webinar Series</a>
                <p className="text-sm text-gray-600">Monthly live sessions on effective team collaboration.</p>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">Team Workflow Templates</a>
                <p className="text-sm text-gray-600">Ready-to-use templates for common team scenarios.</p>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">Collaboration Case Studies</a>
                <p className="text-sm text-gray-600">Real-world examples of successful team setups.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollaborativeAnalytics;
