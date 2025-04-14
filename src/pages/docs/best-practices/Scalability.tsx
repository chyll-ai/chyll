
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { LayoutGrid, BarChart2, Database, ServerCrash, RefreshCw, Split, Layers, Share2 } from 'lucide-react';

const Scalability = () => {
  const sidebarLinks = [
    { title: 'Best Practices Overview', url: '/documentation/best-practices' },
    { title: 'Performance Optimization', url: '/documentation/best-practices/performance' },
    { title: 'Security Guidelines', url: '/documentation/best-practices/security' },
    { title: 'Scalability Planning', url: '/documentation/best-practices/scalability', active: true },
    { title: 'Data Management', url: '/documentation/best-practices/data-management' },
  ];

  return (
    <DocLayout
      title="Scalability Planning"
      description="Design workflows that grow with your business needs"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'Best Practices', url: '/documentation/best-practices' },
        { title: 'Scalability Planning', url: '/documentation/best-practices/scalability' }
      ]}
      previousLink={{ title: 'Security Guidelines', url: '/documentation/best-practices/security' }}
      nextLink={{ title: 'Data Management', url: '/documentation/best-practices/data-management' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          Learn how to build automations that can handle growing workloads efficiently.
          Scalable workflows adapt to changing business demands without requiring complete redesigns,
          saving time and resources as your organization grows.
        </p>
        
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <LayoutGrid className="h-6 w-6 text-indigo-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Why Scalability Matters</h3>
              <p>
                Scalability ensures your automations can grow with your business. Without proper scalability planning,
                workflows that work well for small workloads may fail or become prohibitively expensive as volume increases.
                Investing in scalability early prevents costly rewrites and downtime later.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Scalability Fundamentals</h2>
        
        <div className="space-y-10">
          <div className="flex gap-5">
            <div className="flex-shrink-0 mt-1">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Layers className="h-6 w-6 text-indigo-700" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Types of Scalability</h3>
              <p className="mb-4">
                Understanding different scaling approaches helps you design more flexible systems:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold mb-3">Vertical Scaling (Scaling Up)</h4>
                  <p className="mb-3 text-sm">
                    Adding more resources (CPU, memory, storage) to existing servers or systems.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="text-green-500 font-bold mr-2">+</span>
                      <p className="text-sm">Simpler to implement</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 font-bold mr-2">+</span>
                      <p className="text-sm">No need to modify application architecture</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-500 font-bold mr-2">−</span>
                      <p className="text-sm">Hardware limitations</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-500 font-bold mr-2">−</span>
                      <p className="text-sm">Single point of failure</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold mb-3">Horizontal Scaling (Scaling Out)</h4>
                  <p className="mb-3 text-sm">
                    Adding more instances of servers or systems and distributing the load.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="text-green-500 font-bold mr-2">+</span>
                      <p className="text-sm">Virtually unlimited scaling potential</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 font-bold mr-2">+</span>
                      <p className="text-sm">Better fault tolerance and availability</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-500 font-bold mr-2">−</span>
                      <p className="text-sm">More complex to implement</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-500 font-bold mr-2">−</span>
                      <p className="text-sm">May require architectural changes</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 italic">
                Most modern scalable systems combine both approaches, using vertical scaling for specific components
                and horizontal scaling for the overall system architecture.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-shrink-0 mt-1">
              <div className="bg-indigo-100 p-3 rounded-full">
                <BarChart2 className="h-6 w-6 text-indigo-700" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Measuring Scalability</h3>
              <p className="mb-4">
                Define metrics to evaluate how well your workflows scale:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Throughput</strong>: Transactions or operations processed per unit of time</li>
                <li><strong>Response time</strong>: Time taken to complete a request as load increases</li>
                <li><strong>Resource utilization</strong>: CPU, memory, network usage under different loads</li>
                <li><strong>Cost efficiency</strong>: Cost per transaction as volume increases</li>
                <li><strong>Maximum capacity</strong>: Breaking point where performance degrades significantly</li>
              </ul>
              
              <div className="mt-5 bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-medium mb-3">Scalability Testing Approaches</h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-sm">Load Testing</h5>
                    <p className="text-sm">Gradually increase load to identify how the system responds to increasing demand</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Stress Testing</h5>
                    <p className="text-sm">Push the system beyond its expected capacity to find breaking points</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Soak Testing</h5>
                    <p className="text-sm">Run the system at high load for extended periods to identify resource leaks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Scalable Architecture Patterns</h2>
        
        <p className="mb-6">
          Implement these architectural patterns to create more scalable workflows:
        </p>
        
        <div className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Split className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-3">Modular Design</h3>
                <p className="mb-4">
                  Break workflows into smaller, independent modules that can scale independently:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Design each module to handle a specific function</li>
                  <li>Define clear interfaces between modules</li>
                  <li>Allow modules to be scaled and deployed independently</li>
                  <li>Minimize dependencies between modules</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Share2 className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-3">Distributed Processing</h3>
                <p className="mb-4">
                  Distribute workloads across multiple processors or servers:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use queue-based processing to distribute tasks</li>
                  <li>Implement worker pools to process tasks in parallel</li>
                  <li>Design for statelessness to enable easy horizontal scaling</li>
                  <li>Use load balancing to distribute requests evenly</li>
                </ul>
                
                <div className="mt-5 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Example: Queue-Based Processing</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 rounded p-2 mr-3">
                        <span className="font-medium text-indigo-800">Producer</span>
                      </div>
                      <div className="flex-1 border-t-2 border-gray-300 border-dashed"></div>
                      <div className="bg-gray-100 rounded p-2 mx-3">
                        <span className="font-medium">Queue</span>
                      </div>
                      <div className="flex-1 border-t-2 border-gray-300 border-dashed"></div>
                      <div className="bg-green-100 rounded p-2 ml-3">
                        <span className="font-medium text-green-800">Workers</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Tasks are added to a queue by producers and processed by multiple worker instances that can scale horizontally.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Database className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-3">Data Partitioning</h3>
                <p className="mb-4">
                  Divide data across multiple storage instances to improve scalability:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Horizontal partitioning (sharding)</strong>: Split data across multiple instances based on a key</li>
                  <li><strong>Vertical partitioning</strong>: Split different types of data across different storage systems</li>
                  <li><strong>Functional partitioning</strong>: Organize data storage around business functions</li>
                </ul>
                
                <p className="mt-3 text-sm text-gray-600">
                  When implementing data partitioning, carefully consider:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
                  <li>Partition key selection to ensure balanced distribution</li>
                  <li>Cross-partition query performance</li>
                  <li>Data consistency requirements</li>
                  <li>Repartitioning strategies as data grows</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Handling Scaling Challenges</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <RefreshCw className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-lg font-semibold">Statelessness</h3>
            </div>
            <p className="mb-4">
              Design workflows to be stateless whenever possible:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Store state in external databases or caches</li>
              <li>Pass necessary context with each request</li>
              <li>Avoid local storage of session data</li>
              <li>Design idempotent operations that can be safely retried</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <ServerCrash className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-lg font-semibold">Graceful Degradation</h3>
            </div>
            <p className="mb-4">
              Design systems to handle overload conditions gracefully:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Implement circuit breakers to prevent cascade failures</li>
              <li>Use rate limiting and throttling</li>
              <li>Prioritize critical functions under high load</li>
              <li>Design fallback mechanisms for when services are unavailable</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Common Scalability Bottlenecks</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Database Contention</h4>
              <p className="text-sm">
                Databases often become the first bottleneck in scaling. Consider read replicas, sharding,
                caching layers, and NoSQL alternatives for specific use cases.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Synchronous Processing</h4>
              <p className="text-sm">
                Operations that block until completion limit throughput. Move time-consuming operations
                to asynchronous processing whenever possible.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Shared Resources</h4>
              <p className="text-sm">
                Contention for shared resources creates bottlenecks. Minimize shared state and implement
                proper locking mechanisms when shared resources are necessary.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Inefficient Algorithms</h4>
              <p className="text-sm">
                Algorithms that don't scale linearly with data volume become problematic at scale.
                Optimize algorithms for large data sets and consider approximation algorithms
                when exact results aren't required.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Automated Scaling</h2>
        
        <p className="mb-6">
          Implement dynamic scaling to automatically adjust resources based on demand:
        </p>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Auto-scaling Strategies</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Strategy</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Best For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">Schedule-based Scaling</td>
                  <td className="px-4 py-3 text-sm">Automatically scale resources based on time of day or day of week</td>
                  <td className="px-4 py-3 text-sm">Predictable workload patterns (e.g., business hours vs. after hours)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">Metric-based Scaling</td>
                  <td className="px-4 py-3 text-sm">Scale based on resource utilization metrics (CPU, memory, queue length)</td>
                  <td className="px-4 py-3 text-sm">Variable loads with clear resource constraints</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">Event-based Scaling</td>
                  <td className="px-4 py-3 text-sm">Scale in response to specific events or triggers</td>
                  <td className="px-4 py-3 text-sm">Workloads triggered by specific business events</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">Predictive Scaling</td>
                  <td className="px-4 py-3 text-sm">Use machine learning to predict future demand and scale proactively</td>
                  <td className="px-4 py-3 text-sm">Complex workload patterns with historical data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Auto-scaling Best Practices</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Set appropriate scaling thresholds to avoid frequent scaling events</li>
            <li>Implement cooldown periods between scaling activities</li>
            <li>Use gradual scaling rather than large jumps in capacity</li>
            <li>Monitor scaling events and adjust thresholds as needed</li>
            <li>Test auto-scaling configurations under various load conditions</li>
            <li>Implement proper health checks to ensure new instances are ready before receiving traffic</li>
          </ul>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">Scalability Planning Checklist</h2>
        
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Use this checklist when designing for scalability</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-indigo-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="font-medium">Define scalability requirements</p>
                <p className="text-sm text-gray-600">Identify expected growth rates and peak loads</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-indigo-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="font-medium">Identify potential bottlenecks</p>
                <p className="text-sm text-gray-600">Analyze each component for scalability limitations</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-indigo-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="font-medium">Design for horizontal scaling</p>
                <p className="text-sm text-gray-600">Ensure components can be scaled by adding more instances</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-indigo-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="font-medium">Implement data partitioning strategy</p>
                <p className="text-sm text-gray-600">Plan how data will be distributed as volume grows</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-indigo-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="font-medium">Design stateless components</p>
                <p className="text-sm text-gray-600">Minimize state that needs to be shared between instances</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-indigo-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="font-medium">Implement caching strategies</p>
                <p className="text-sm text-gray-600">Reduce load on backend systems with appropriate caching</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-indigo-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="font-medium">Set up auto-scaling</p>
                <p className="text-sm text-gray-600">Configure dynamic resource allocation based on demand</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-indigo-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="font-medium">Conduct scalability testing</p>
                <p className="text-sm text-gray-600">Verify the system behaves as expected under increasing load</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-indigo-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="font-medium">Implement monitoring and alerting</p>
                <p className="text-sm text-gray-600">Track key metrics and set alerts for scaling events</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DocLayout>
  );
};

export default Scalability;
