import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export async function handleFunctionCall(toolCall, thread_id, run_id) {
  try {
    // Récupère la session utilisateur pour obtenir le token d'accès
    const { data } = await supabase.auth.getSession();
    const access_token = data.session?.access_token;
    const client_id = data.session?.user?.id;
    
    if (!access_token || !toolCall) {
      console.error("Impossible de traiter l'appel de fonction: token ou toolCall manquant");
      return;
    }

    console.log(`Traitement de l'appel de fonction: ${toolCall.function?.name}`);

    // Traitement spécifique selon le type de fonction
    if (toolCall.function?.name === "connect_gmail") {
      console.log("Appel de la fonction connect_gmail");
      
      const response = await fetch(`https://atsfuqwxfrezkxtnctmk.supabase.co/functions/v1/connect-gmail`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify({
          action: 'connect',
          thread_id,
          run_id,
          user_token: access_token,
          tool_call_id: toolCall.id,
          client_id,
          redirect_url: window.location.origin + window.location.pathname
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de la connexion à Gmail:", errorData);
        toast.error("Erreur lors de la connexion à Gmail");
        
        // Submit error result back to assistant
        await submitToolOutput(thread_id, run_id, toolCall.id, {
          connected: false,
          error: "Connection error"
        });
        return;
      }
      
      const result = await response.json();
      console.log("Résultat de la demande de connexion Gmail:", result);
      
      // Si nous avons déjà un token valide, on notifie l'utilisateur
      if (result.access_token) {
        toast.success("Gmail déjà connecté!");
        
        // Submit success result back to assistant
        await submitToolOutput(thread_id, run_id, toolCall.id, {
          connected: true,
          message: "User already connected"
        });
        return;
      } 
      
      if (result.oauth_url) {
        // Si nous avons une URL OAuth, on ouvre une nouvelle fenêtre
        window.open(result.oauth_url, '_blank');
        toast.success("Redirection vers la page de connexion Gmail...");
        
        // Start polling to check for token
        checkForGmailToken(client_id, thread_id, run_id, toolCall.id);
      }
    } else if (toolCall.function?.name === "is_gmail_connected") {
      console.log("Appel de la fonction is_gmail_connected");
      
      try {
        // Call the is-gmail-connected edge function
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/is-gmail-connected`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erreur lors de la vérification de la connexion Gmail:", errorData);
          
          // Submit the tool output back to OpenAI
          await submitToolOutput(thread_id, run_id, toolCall.id, {
            connected: false,
            reason: errorData.reason || 'api_error'
          });
          
          // If not connected, automatically prompt to connect
          setTimeout(() => {
            handleFunctionCall({
              id: `auto-${Date.now()}`,
              type: 'function',
              function: { name: 'connect_gmail', arguments: '{}' }
            }, thread_id, run_id);
          }, 1000);
          
          return;
        }
        
        // Process the response
        const connectionStatus = await response.json();
        console.log("Statut de la connexion Gmail:", connectionStatus);
        
        if (connectionStatus.connected) {
          toast.success("Gmail connecté avec succès!");
        } else if (connectionStatus.expired) {
          toast.error("Votre connexion Gmail a expiré. Veuillez vous reconnecter.");
          
          // Automatically prompt to reconnect
          setTimeout(() => {
            handleFunctionCall({
              id: `auto-${Date.now()}`,
              type: 'function',
              function: { name: 'connect_gmail', arguments: '{}' }
            }, thread_id, run_id);
          }, 1000);
        } else {
          toast.warning("Vous n'êtes pas connecté à Gmail.");
          
          // Automatically prompt to connect
          setTimeout(() => {
            handleFunctionCall({
              id: `auto-${Date.now()}`,
              type: 'function',
              function: { name: 'connect_gmail', arguments: '{}' }
            }, thread_id, run_id);
          }, 1000);
        }
        
        // Submit the tool output back to OpenAI
        await submitToolOutput(thread_id, run_id, toolCall.id, connectionStatus);
        
      } catch (error) {
        console.error("Erreur lors de la vérification de la connexion Gmail:", error);
        toast.error("Erreur lors de la vérification de la connexion Gmail");
        
        // Submit error to OpenAI
        await submitToolOutput(thread_id, run_id, toolCall.id, {
          connected: false,
          reason: 'internal_error',
          error: error.message
        });
      }
    } else if (toolCall.function?.name === "send_gmail_email") {
      console.log("Appel de la fonction send_gmail_email");
      
      // Parse les arguments de la fonction
      const args = JSON.parse(toolCall.function.arguments);
      const { to, subject, body } = args;
      
      if (!to || !subject || !body) {
        console.error("Paramètres d'email manquants");
        toast.error("Impossible d'envoyer l'email: paramètres manquants");
        
        // Submit error to OpenAI
        await submitToolOutput(thread_id, run_id, toolCall.id, {
          success: false,
          reason: 'missing_parameters'
        });
        return;
      }
      
      // Appel à la fonction Edge pour envoyer l'email
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/connect-gmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify({
          action: 'send_email',
          thread_id,
          run_id,
          tool_call_id: toolCall.id,
          client_id,
          email_data: {
            to,
            subject,
            body
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de l'envoi de l'email:", errorData);
        toast.error("Erreur lors de l'envoi de l'email");
        
        // Submit error to OpenAI
        await submitToolOutput(thread_id, run_id, toolCall.id, {
          success: false,
          error: errorData.message || "Sending failed"
        });
        return;
      }
      
      const result = await response.json();
      console.log("Email envoyé avec succès:", result);
      toast.success("Email envoyé avec succès!");
      
      // Submit success to OpenAI
      await submitToolOutput(thread_id, run_id, toolCall.id, {
        success: true,
        message: "Email sent successfully"
      });
    } else if (toolCall.function?.name === "save_onboarding_profile") {
      console.log("Appel de la fonction save_onboarding_profile");
      
      // Parse les arguments pour récupérer les données du profil
      const profileData = JSON.parse(toolCall.function.arguments);
      
      try {
        // Vérification si le profil existe déjà
        const { data: existingProfile, error: checkError } = await supabase
          .from('client_profile')
          .select('*')
          .eq('client_id', client_id)
          .maybeSingle();
          
        if (checkError) {
          console.error("Erreur lors de la vérification du profil:", checkError);
          toast.error("Erreur lors de la vérification du profil");
          return;
        }
        
        if (existingProfile) {
          // Mise à jour du profil existant
          const { error: updateError } = await supabase
            .from('client_profile')
            .update({
              ...profileData,
              is_complete: true // Ensure profile is marked as complete
            })
            .eq('client_id', client_id);
            
          if (updateError) {
            console.error("Erreur lors de la mise à jour du profil:", updateError);
            toast.error("Erreur lors de la mise à jour du profil");
            return;
          }
          
          toast.success("Profil mis à jour avec succès!");
        } else {
          // Création d'un nouveau profil
          const { error: insertError } = await supabase
            .from('client_profile')
            .insert({
              ...profileData,
              client_id,
              is_complete: true // Ensure profile is marked as complete
            });
            
          if (insertError) {
            console.error("Erreur lors de la création du profil:", insertError);
            toast.error("Erreur lors de la création du profil");
            return;
          }
          
          toast.success("Profil créé avec succès!");
        }
        
        // Soumettre le résultat de l'outil à OpenAI avec un message personnalisé pour orienter vers la génération de leads
        await submitToolOutput(thread_id, run_id, toolCall.id, { 
          success: true, 
          message: "Profile saved successfully. User should now be guided to generate leads/contacts before email campaigns.",
          next_step: "lead_generation"
        });
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du profil:", error);
        toast.error("Erreur lors de la sauvegarde du profil");
        
        // Submit error to OpenAI
        await submitToolOutput(thread_id, run_id, toolCall.id, {
          success: false,
          error: error.message || "Failed to save profile"
        });
      }
    } else if (toolCall.function?.name === "check_profile_status") {
      console.log("Appel de la fonction check_profile_status");
      
      try {
        console.log("Vérification du profil pour client_id:", client_id);
        
        // Vérifier si le profil existe et est complet
        const { data: profileData, error: profileError } = await supabase
          .from('client_profile')
          .select('*')
          .eq('client_id', client_id)
          .maybeSingle();
          
        console.log("Données du profil récupérées:", profileData);
        console.log("Erreur de récupération:", profileError);
          
        if (profileError) {
          console.error("Erreur lors de la vérification du profil:", profileError);
          
          // Submit error to OpenAI
          await submitToolOutput(thread_id, run_id, toolCall.id, {
            profile_complete: false,
            error: "Failed to check profile status",
            debug_info: profileError.message
          });
          return;
        }
        
        // Check if profile exists and has data
        const hasBasicData = profileData && 
                           profileData.company_name && 
                           profileData.industry && 
                           profileData.icp_title;
        
        const isMarkedComplete = profileData && profileData.is_complete === true;
        
        console.log("Profil trouvé:", !!profileData);
        console.log("Données de base présentes:", hasBasicData);
        console.log("Marqué comme complet:", isMarkedComplete);
        console.log("Évaluation finale:", hasBasicData && isMarkedComplete);
        
        const isComplete = hasBasicData && isMarkedComplete;
        
        // Si le profil a les données de base mais n'est pas marqué comme complet, le marquer
        if (hasBasicData && !isMarkedComplete) {
          console.log("Mise à jour du profil pour le marquer comme complet");
          const { error: updateError } = await supabase
            .from('client_profile')
            .update({ is_complete: true })
            .eq('client_id', client_id);
            
          if (updateError) {
            console.error("Erreur lors de la mise à jour du statut:", updateError);
          } else {
            console.log("Profil marqué comme complet avec succès");
          }
        }
        
        // Submit le statut du profil à l'assistant
        await submitToolOutput(thread_id, run_id, toolCall.id, {
          profile_complete: hasBasicData, // Use the real check, not just the flag
          profile_data: profileData,
          message: hasBasicData 
            ? "Profile is complete. User should be guided to lead generation instead of profile completion." 
            : "Profile needs to be completed first.",
          debug_info: {
            profile_exists: !!profileData,
            has_basic_data: hasBasicData,
            is_marked_complete: isMarkedComplete,
            company_name: profileData?.company_name,
            industry: profileData?.industry,
            icp_title: profileData?.icp_title
          }
        });
        
      } catch (error) {
        console.error("Erreur lors de la vérification du statut du profil:", error);
        
        // Submit error to OpenAI
        await submitToolOutput(thread_id, run_id, toolCall.id, {
          profile_complete: false,
          error: error.message || "Failed to check profile status"
        });
      }
    } else if (toolCall.function?.name === "redirect_to_dashboard") {
      console.log("Appel de la fonction redirect_to_dashboard");
      
      // This function will be handled by the Assistant component directly
      // We still need to submit a success response to OpenAI
      await submitToolOutput(thread_id, run_id, toolCall.id, {
        success: true,
        message: "Redirect initiated. User should be guided to lead generation first.",
        next_step: "lead_generation"
      });
      
    } else if (toolCall.function?.name === "launch_search") {
      console.log("Appel de la fonction launch_search");
      
      try {
        // Parse les arguments de la fonction
        const args = JSON.parse(toolCall.function.arguments);
        const { keyword, filters } = args;
        
        if (!keyword) {
          console.error("Mot-clé manquant pour la recherche");
          toast.error("Impossible de lancer la recherche: mot-clé manquant");
          
          // Submit error to OpenAI
          await submitToolOutput(thread_id, run_id, toolCall.id, {
            success: false,
            error: "Missing keyword parameter"
          });
          return;
        }
        
        console.log("Lancement de la recherche avec:", { keyword, filters });
        toast.loading("Génération des leads en cours...");
        
        // Appel à la nouvelle edge function launch-search
        const response = await fetch(`https://atsfuqwxfrezkxtnctmk.supabase.co/functions/v1/launch-search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
          },
          body: JSON.stringify({
            keyword,
            filters: filters || {},
            client_id
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erreur lors du lancement de la recherche:", errorData);
          toast.error("Erreur lors de la génération des leads");
          
          // Submit error to OpenAI
          await submitToolOutput(thread_id, run_id, toolCall.id, {
            success: false,
            error: errorData.error || "Search launch failed"
          });
          return;
        }
        
        const result = await response.json();
        console.log("Résultat de la génération de leads:", result);
        
        toast.success(`${result.leads_count} leads générés avec succès!`);
        
        // Submit success to OpenAI
        await submitToolOutput(thread_id, run_id, toolCall.id, { 
          success: true,
          message: result.message,
          leads_count: result.leads_count,
          keyword: result.keyword,
          location: result.location
        });
        
      } catch (error) {
        console.error("Erreur lors du lancement de la recherche:", error);
        toast.error("Erreur lors de la génération des leads");
        
        // Submit error to OpenAI
        await submitToolOutput(thread_id, run_id, toolCall.id, {
          success: false,
          error: error.message || "Search launch failed"
        });
      }
    } else if (toolCall.function?.name === "generate_messages") {
      console.log("Appel de la fonction generate_messages");
      
      try {
        // Submit success to OpenAI
        await submitToolOutput(thread_id, run_id, toolCall.id, { 
          status: "message_generation_triggered" 
        });
        
        toast.success("Génération des messages en cours...");
      } catch (error) {
        console.error("Erreur lors de la génération des messages:", error);
        toast.error("Erreur lors de la génération des messages");
        
        // Submit error to OpenAI
        await submitToolOutput(thread_id, run_id, toolCall.id, {
          success: false,
          error: error.message || "Message generation failed"
        });
      }
    } else if (toolCall.function?.name === "send_email") {
      console.log("Appel de la fonction send_email");
      
      try {
        // Parse les arguments de la fonction
        const args = JSON.parse(toolCall.function.arguments);
        const { lead_id, subject, body } = args;
        
        if (!lead_id || !subject || !body) {
          console.error("Paramètres d'email manquants");
          toast.error("Impossible d'envoyer l'email: paramètres manquants");
          return;
        }
        
        // Appel à la fonction Edge pour envoyer l'email
        const { error: invokeError } = await supabase.functions.invoke("send-email", {
          body: {
            user_id: client_id,
            lead_id,
            subject,
            body
          }
        });
        
        if (invokeError) {
          console.error("Erreur lors de l'envoi de l'email:", invokeError);
          toast.error("Erreur lors de l'envoi de l'email");
          return;
        }
        
        toast.success("Email envoyé avec succès!");
        
        // Submit success to OpenAI
        await submitToolOutput(thread_id, run_id, toolCall.id, { 
          success: true 
        });
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
        toast.error("Erreur lors de l'envoi de l'email");
        
        // Submit error to OpenAI
        await submitToolOutput(thread_id, run_id, toolCall.id, {
          success: false,
          error: error.message || "Failed to send email"
        });
      }
    } else if (toolCall.function?.name === "send_followup") {
      console.log("Appel de la fonction send_followup");
      
      try {
        // Parse les arguments de la fonction
        const args = JSON.parse(toolCall.function.arguments);
        const { lead_id } = args;
        
        if (!lead_id) {
          console.error("ID de lead manquant");
          toast.error("Impossible d'envoyer le suivi: ID de lead manquant");
          return;
        }
        
        // Appel à la fonction Edge pour envoyer le suivi
        const { error: invokeError } = await supabase.functions.invoke("send-followup", {
          body: {
            user_id: client_id,
            lead_id
          }
        });
        
        if (invokeError) {
          console.error("Erreur lors de l'envoi du suivi:", invokeError);
          toast.error("Erreur lors de l'envoi du suivi");
          return;
        }
        
        toast.success("Message de suivi envoyé avec succès!");
        
        // Submit success to OpenAI
        await submitToolOutput(thread_id, run_id, toolCall.id, { 
          success: true 
        });
      } catch (error) {
        console.error("Erreur lors de l'envoi du suivi:", error);
        toast.error("Erreur lors de l'envoi du suivi");
        
        // Submit error to OpenAI
        await submitToolOutput(thread_id, run_id, toolCall.id, {
          success: false,
          error: error.message || "Failed to send followup"
        });
      }
    } else {
      console.log(`Appel de fonction non géré: ${toolCall.function?.name}`);
      
      // Still submit a response to prevent the assistant from waiting
      await submitToolOutput(thread_id, run_id, toolCall.id, {
        success: false,
        error: "Unsupported function"
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'appel de fonction:", error);
    toast.error("Une erreur s'est produite lors du traitement de la demande");
    
    // If we have thread_id, run_id and toolCall.id, try to submit an error response
    if (thread_id && run_id && toolCall?.id) {
      try {
        await submitToolOutput(thread_id, run_id, toolCall.id, {
          success: false,
          error: error.message || "Unknown error"
        });
      } catch (submitError) {
        console.error("Failed to submit error response:", submitError);
      }
    }
  }
}

// Function to check if the Gmail token was successfully stored
const checkForGmailToken = async (clientId, threadId, runId, toolCallId, attempts = 0) => {
  if (attempts > 5) {
    console.log("Nombre maximum de tentatives atteint");
    toast.error("La connexion Gmail n'a pas pu être finalisée. Veuillez réessayer.");
    
    // Submit failure back to assistant
    if (threadId && runId && toolCallId) {
      await submitToolOutput(threadId, runId, toolCallId, {
        connected: false,
        reason: "polling_timeout"
      });
    }
    return;
  }
  
  try {
    // Attendre quelques secondes avant de vérifier
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Vérifier si le token existe
    const { data, error } = await supabase
      .from('tokens')
      .select('access_token')
      .eq('client_id', clientId)
      .maybeSingle();
      
    if (error) {
      console.error("Erreur lors de la vérification du token Gmail:", error);
      // Continue polling despite the error
      checkForGmailToken(clientId, threadId, runId, toolCallId, attempts + 1);
      return;
    }
    
    if (data && data.access_token) {
      console.log("Token Gmail trouvé!");
      toast.success("Connexion Gmail réussie!");
      
      // Submit success to OpenAI if we have the necessary IDs
      if (threadId && runId && toolCallId) {
        await submitToolOutput(threadId, runId, toolCallId, { 
          connected: true, 
          message: "Gmail connection successful" 
        });
      }
      return;
    }
    
    // Si pas encore de token, vérifier à nouveau après un délai
    console.log(`Aucun token trouvé pour l'instant, nouvelle vérification... (tentative ${attempts + 1})`);
    checkForGmailToken(clientId, threadId, runId, toolCallId, attempts + 1);
    
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    // Continue polling despite the error
    checkForGmailToken(clientId, threadId, runId, toolCallId, attempts + 1);
  }
};

// Helper function to submit tool outputs back to OpenAI
const submitToolOutput = async (threadId, runId, toolCallId, output) => {
  if (!threadId || !runId || !toolCallId) {
    console.error("Missing required parameters for submitToolOutput");
    return;
  }
  
  try {
    console.log(`Submitting tool output for tool call ${toolCallId}:`, output);
    
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
          tool_call_id: toolCallId,
          output: JSON.stringify(output)
        }]
      })
    });
    
    if (!response.ok) {
      console.error("Erreur lors de la soumission du résultat de l'outil:", await response.text());
    } else {
      const result = await response.json();
      console.log("Résultat de l'outil soumis avec succès:", result);
    }
  } catch (error) {
    console.error("Erreur lors de la soumission du résultat de l'outil:", error);
  }
};
