
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

// Function to handle tool calls, specifically for connect_gmail, send_gmail_email, and save_onboarding_profile
export const handleFunctionCall = async (toolCall, threadId, runId) => {
  if (toolCall.function.name === 'connect_gmail') {
    try {
      console.log("Processing connect_gmail function call");
      // Get the user's session to extract the access token
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.error("No active session found");
        toast.error("Vous devez être connecté pour utiliser cette fonctionnalité");
        return;
      }
      
      const user_token = data.session.access_token;
      const client_id = data.session.user.id;
      
      // Get the current URL to use as redirect URL
      const redirectUrl = window.location.origin + window.location.pathname;
      
      // Make the request to the connect-gmail edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/connect-gmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_token}`
        },
        body: JSON.stringify({
          action: 'connect',
          thread_id: threadId,
          run_id: runId,
          user_token: user_token,
          tool_call_id: toolCall.id,
          client_id: client_id, // Add client_id to check for existing tokens
          redirect_url: redirectUrl // Pass the current URL as the redirect URL
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error connecting to Gmail:", errorData);
        toast.error("Erreur lors de la connexion à Gmail");
        return;
      }
      
      // Log the result but don't show anything in the UI
      const result = await response.json();
      console.log("Gmail connection initiated:", result);
      
      // If we already have a valid token, notify the user
      if (result.access_token) {
        toast.success("Gmail déjà connecté!");
        return;
      }
      
      if (result.oauth_url) {
        console.log("OAuth URL generated:", result.oauth_url);
        // Open the OAuth URL in a new tab
        window.open(result.oauth_url, '_blank');
        toast.success("Redirection vers la page de connexion Gmail...");
      }
      
      // We don't display anything in the UI as the assistant will handle the response
    } catch (error) {
      console.error("Error initiating Gmail connection:", error);
      toast.error("Erreur lors de la connexion à Gmail");
    }
  } else if (toolCall.function.name === 'send_gmail_email') {
    try {
      console.log("Processing send_gmail_email function call");
      // Get the user's session to extract the access token
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.error("No active session found");
        toast.error("Vous devez être connecté pour utiliser cette fonctionnalité");
        return;
      }
      
      const user_token = data.session.access_token;
      const client_id = data.session.user.id;
      
      // Parse the function arguments
      const args = JSON.parse(toolCall.function.arguments);
      const { access_token, to, subject, body } = args;
      
      if (!to || !subject || !body) {
        console.error("Missing required email parameters");
        toast.error("Impossible d'envoyer l'email: paramètres manquants");
        return;
      }
      
      // If no access token provided in the args, try to get it from the database
      let tokenToUse = access_token;
      if (!tokenToUse) {
        console.log("No access token provided, checking database");
        const { data: tokenData, error: tokenError } = await supabase
          .from('tokens')
          .select('access_token')
          .eq('client_id', client_id)
          .maybeSingle();
          
        if (tokenError || !tokenData?.access_token) {
          console.error("Error fetching token or no token found:", tokenError);
          toast.error("Aucun token Gmail trouvé. Veuillez d'abord connecter votre compte Gmail.");
          return;
        }
        
        tokenToUse = tokenData.access_token;
        console.log("Using token from database");
      }
      
      // Make the request to the connect-gmail edge function to send email
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/connect-gmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_token}`
        },
        body: JSON.stringify({
          action: 'send_email',
          thread_id: threadId,
          run_id: runId,
          tool_call_id: toolCall.id,
          client_id: client_id,
          email_data: {
            access_token: tokenToUse,
            to,
            subject,
            body
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error sending email via Gmail:", errorData);
        toast.error("Erreur lors de l'envoi de l'email");
        return;
      }
      
      const result = await response.json();
      console.log("Email sent successfully:", result);
      toast.success("Email envoyé avec succès!");
      
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Erreur lors de l'envoi de l'email");
    }
  } else if (toolCall.function.name === 'save_onboarding_profile') {
    try {
      console.log("Processing save_onboarding_profile function call");
      // Get the user's session
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.error("No active session found");
        toast.error("Vous devez être connecté pour sauvegarder votre profil");
        return;
      }
      
      const userId = data.session.user.id;
      
      // Parse the function arguments
      const profileData = JSON.parse(toolCall.function.arguments);
      console.log("Profile data to save:", profileData);
      
      // Check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('client_profile')
        .select('*')
        .eq('client_id', userId)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking existing profile:", checkError);
        toast.error("Erreur lors de la vérification du profil");
        return;
      }
      
      let result;
      
      if (existingProfile) {
        // Update existing profile
        const { data: updateData, error: updateError } = await supabase
          .from('client_profile')
          .update({
            ...profileData,
            client_id: userId
          })
          .eq('client_id', userId);
          
        if (updateError) {
          console.error("Error updating profile:", updateError);
          toast.error("Erreur lors de la mise à jour du profil");
          return;
        }
        
        result = updateData;
        toast.success("Profil mis à jour avec succès!");
      } else {
        // Create new profile
        const { data: insertData, error: insertError } = await supabase
          .from('client_profile')
          .insert({
            ...profileData,
            client_id: userId
          });
          
        if (insertError) {
          console.error("Error creating profile:", insertError);
          toast.error("Erreur lors de la création du profil");
          return;
        }
        
        result = insertData;
        toast.success("Profil créé avec succès!");
      }
      
      console.log("Profile saved successfully:", result);
      
      // Submit the tool output back to OpenAI if thread and run IDs are available
      if (threadId && runId) {
        try {
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/openai-assistant`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE'}`
            },
            body: JSON.stringify({
              action: 'submit_tool_outputs',
              threadId,
              runId,
              toolOutputs: [{
                tool_call_id: toolCall.id,
                output: JSON.stringify({ success: true, message: "Profile saved successfully" })
              }]
            })
          });
          
          if (!response.ok) {
            console.error("Error submitting tool output to OpenAI");
          } else {
            console.log("Tool output submitted successfully");
          }
        } catch (error) {
          console.error("Error during tool output submission:", error);
        }
      }
      
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Erreur lors de la sauvegarde du profil");
    }
  } else {
    console.log(`Function call detected but not handled: ${toolCall.function.name}`);
  }
};
