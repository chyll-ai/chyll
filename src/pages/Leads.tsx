
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LeadActions } from "@/components";
import { toast } from "@/components/ui/sonner";

interface Lead {
  id: string;
  full_name: string;
  email: string;
  company: string;
  job_title: string;
  created_at: string;
}

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data: leadsData, error } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setLeads(leadsData || []);
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast.error("Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Leads</h1>
      
      {leads.length === 0 ? (
        <div className="bg-muted p-8 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">No leads found</h3>
          <p className="text-muted-foreground">
            Start prospecting to find potential leads or import your contacts.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted border-b">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Company</th>
                <th className="text-left p-3">Job Title</th>
                <th className="text-left p-3">Date Added</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-muted/50">
                  <td className="p-3 font-medium">{lead.full_name || "N/A"}</td>
                  <td className="p-3">{lead.email || "N/A"}</td>
                  <td className="p-3">{lead.company || "N/A"}</td>
                  <td className="p-3">{lead.job_title || "N/A"}</td>
                  <td className="p-3">
                    {lead.created_at
                      ? new Date(lead.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    <LeadActions leadId={lead.id} email={lead.email} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
