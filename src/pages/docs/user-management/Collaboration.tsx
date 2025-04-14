import React from 'react';
import DocLayout from '@/components/DocLayout';
import { UsersRound, Share2, MessageSquare, GitMerge, Zap, BookOpen } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const Collaboration = () => {
  const sidebarLinks = [
    { title: 'User Management Overview', url: '/documentation/user-management' },
    { title: 'User Roles and Permissions', url: '/documentation/user-management/roles' },
    { title: 'Team Collaboration', url: '/documentation/user-management/collaboration', active: true },
    { title: 'Access Control', url: '/documentation/user-management/access-control' },
    { title: 'Audit Logs', url: '/documentation/user-management/audit-logs' },
  ];

  return (
    <DocLayout
      title="Team Collaboration"
      description="Enhance productivity through effective team collaboration features"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'User Management', url: '/documentation/user-management' },
        { title: 'Team Collaboration', url: '/documentation/user-management/collaboration' }
      ]}
      previousLink={{ title: 'User Roles and Permissions', url: '/documentation/user-management/roles' }}
      nextLink={{ title: 'Access Control', url: '/documentation/user-management/access-control' }}
    >
      <section className="mb-12">
        <p className="text-lg mb-6">
          GenerativSchool provides powerful collaboration features that allow teams to work together 
          efficiently on workflows, share knowledge, and coordinate activities. Learn how to leverage 
          these capabilities to enhance your team's productivity.
        </p>
        
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-3">Collaboration Essentials</h3>
          <p className="mb-4">
            Effective collaboration in GenerativSchool is built on three key pillars: shared workspaces, 
            real-time communication, and version control. These elements work together to create a 
            seamless collaborative environment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <UsersRound className="h-5 w-5 text-indigo-600 mr-2" />
                <h4 className="font-medium">Shared Workspaces</h4>
              </div>
              <p className="text-sm text-gray-600">
                Central environments where teams can access and work on the same resources.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-5 w-5 text-indigo-600 mr-2" />
                <h4 className="font-medium">Real-time Communication</h4>
              </div>
              <p className="text-sm text-gray-600">
                Built-in messaging and notification features to coordinate efforts.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <GitMerge className="h-5 w-5 text-indigo-600 mr-2" />
                <h4 className="font-medium">Version Control</h4>
              </div>
              <p className="text-sm text-gray-600">
                Track changes, manage revisions, and prevent conflicts in workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Sharing and Permissions</h2>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Sharing Workflows</h3>
          <p className="mb-4">
            Sharing workflows with team members allows for collaborative development and execution.
            You can control exactly what level of access each team member has to your workflows.
          </p>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h4 className="font-medium mb-4">How to Share a Workflow</h4>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <span className="font-medium">Navigate to the workflow</span>
                <p className="text-sm text-gray-600 mt-1">
                  Go to the workflow you want to share from your workflow dashboard.
                </p>
              </li>
              <li>
                <span className="font-medium">Click the Share button</span>
                <p className="text-sm text-gray-600 mt-1">
                  Located in the top-right corner of the workflow editor.
                </p>
              </li>
              <li>
                <span className="font-medium">Enter emails or select team members</span>
                <p className="text-sm text-gray-600 mt-1">
                  Add the people you want to share with by email or by selecting from your team list.
                </p>
              </li>
              <li>
                <span className="font-medium">Set permission levels</span>
                <p className="text-sm text-gray-600 mt-1">
                  Choose from View, Edit, or Manage access levels for each recipient.
                </p>
              </li>
              <li>
                <span className="font-medium">Add an optional message</span>
                <p className="text-sm text-gray-600 mt-1">
                  Provide context about what you're sharing and why.
                </p>
              </li>
              <li>
                <span className="font-medium">Click "Share"</span>
                <p className="text-sm text-gray-600 mt-1">
                  Recipients will receive a notification and can access the workflow.
                </p>
              </li>
            </ol>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Workflow Sharing Permission Levels</h3>
            <Table>
              <TableCaption>Workflow sharing permission levels and capabilities</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission Level</TableHead>
                  <TableHead>Can View</TableHead>
                  <TableHead>Can Edit</TableHead>
                  <TableHead>Can Share</TableHead>
                  <TableHead>Can Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">View</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✗</TableCell>
                  <TableCell>✗</TableCell>
                  <TableCell>✗</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Edit</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✗</TableCell>
                  <TableCell>✗</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Manage</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Collaborative Workflow Development</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Real-time Collaboration</h3>
            <p className="mb-4">
              Multiple team members can work on the same workflow simultaneously, seeing each other's 
              changes in real-time. This facilitates rapid iteration and prevents the need to manually 
              merge changes.
            </p>
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <h4 className="font-medium mb-2">Pro Tip</h4>
              <p className="text-sm">
                Use the built-in chat function when collaborating in real-time to coordinate efforts 
                and discuss changes as they happen.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Version Control</h3>
            <p className="mb-4">
              Every edit to a workflow is automatically saved and versioned. This allows you to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>View the complete history of a workflow</li>
              <li>Revert to previous versions if needed</li>
              <li>Compare different versions to understand changes</li>
              <li>Create named checkpoints for important milestones</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Comments and Feedback</h3>
          <p className="mb-4">
            Add comments to specific parts of a workflow to provide context, ask questions, or suggest improvements.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-2">How to Use Comments</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Click the comment icon in the workflow editor to add a comment to a specific node</li>
              <li>Use @mentions to notify specific team members</li>
              <li>Resolve comments once they've been addressed</li>
              <li>Filter to view only unresolved comments</li>
            </ul>
          </div>
          <p>
            Comments are preserved in the workflow history, allowing you to track discussions and decisions 
            over time.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Team Workspaces</h2>
        
        <p className="mb-6">
          Team workspaces are dedicated environments where members can collaborate on workflows and resources 
          that are specific to their team.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Creating a Team Workspace</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Go to the Workspaces section in the main navigation</li>
              <li>Click "Create New Workspace"</li>
              <li>Enter a name and description for your workspace</li>
              <li>Invite team members and assign roles</li>
              <li>Configure workspace settings</li>
              <li>Click "Create"</li>
            </ol>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Workspace Features</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Shared workflow library</li>
              <li>Team-specific resources and templates</li>
              <li>Collaborative dashboards</li>
              <li>Activity feeds and notifications</li>
              <li>Workspace-level permissions</li>
              <li>Resource usage tracking</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
          <div className="flex items-start mb-4">
            <Zap className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Best Practices for Team Workspaces</h3>
              <p className="mb-4">
                Follow these guidelines to make the most of your team workspaces:
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Organization</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Use clear, consistent naming conventions</li>
                <li>Create folder structures for different workflow types</li>
                <li>Archive unused or outdated workflows</li>
                <li>Pin important workflows for easy access</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Communication</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Use workspace announcements for important updates</li>
                <li>Document complex workflows with descriptions</li>
                <li>Schedule regular sync meetings</li>
                <li>Create dashboards to share progress</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Quality Control</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Implement workflow review processes</li>
                <li>Create test cases for critical workflows</li>
                <li>Monitor workflow performance metrics</li>
                <li>Document known issues and solutions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Knowledge Sharing</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Create reusable components and templates</li>
                <li>Document common patterns and solutions</li>
                <li>Train new team members using example workflows</li>
                <li>Share successful use cases</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

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
                <li>Go to Analytics > Dashboards</li>
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
    </DocLayout>
  );
};

export default Collaboration;
