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
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/connect-gmail`, {
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
          redirect_url: window.location.origin + '/assistant'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de la connexion à Gmail:", errorData);
        toast.error("Erreur lors de la connexion à Gmail");
        return;
      }
      
      const result = await response.json();
      console.log("Résultat de la demande de connexion Gmail:", result);
      
      // Si nous avons déjà un token valide, on notifie l'utilisateur
      if (result.access_token) {
        toast.success("Gmail déjà connecté!");
      } else if (result.oauth_url) {
        // Si nous avons une URL OAuth, on ouvre une nouvelle fenêtre
        window.open(result.oauth_url, '_blank');
        toast.success("Redirection vers la page de connexion Gmail...");
      }
    } else if (toolCall.function?.name === "send_gmail_email") {
      console.log("Appel de la fonction send_gmail_email");
      
      // Parse les arguments de la fonction
      const args = JSON.parse(toolCall.function.arguments);
      const { to, subject, body } = args;
      
      if (!to || !subject || !body) {
        console.error("Paramètres d'email manquants");
        toast.error("Impossible d'envoyer l'email: paramètres manquants");
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
        return;
      }
      
      const result = await response.json();
      console.log("Email envoyé avec succès:", result);
      toast.success("Email envoyé avec succès!");
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
            .update(profileData)
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
              client_id
            });
            
          if (insertError) {
            console.error("Erreur lors de la création du profil:", insertError);
            toast.error("Erreur lors de la création du profil");
            return;
          }
          
          toast.success("Profil créé avec succès!");
        }
        
        // Soumettre le résultat de l'outil à OpenAI
        const toolOutputResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/openai-assistant`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE'}`
          },
          body: JSON.stringify({
            action: 'submit_tool_outputs',
            threadId: thread_id,
            runId: run_id,
            toolOutputs: [{
              tool_call_id: toolCall.id,
              output: JSON.stringify({ success: true, message: "Profile saved successfully" })
            }]
          })
        });
        
        if (!toolOutputResponse.ok) {
          console.error("Erreur lors de la soumission du résultat de l'outil");
        }
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du profil:", error);
        toast.error("Erreur lors de la sauvegarde du profil");
      }
    } else if (toolCall.function?.name === "launch_search") {
      console.log("Appel de la fonction launch_search");
      
      try {
        // Parse les arguments de la fonction
        const args = JSON.parse(toolCall.function.arguments);
        const { keyword, filters } = args;
        
        if (!keyword) {
          console.error("Mot-clé manquant pour la recherche");
          toast.error("Impossible de lancer la recherche: mot-clé manquant");
          return;
        }
        
        // Insertion d'une nouvelle recherche dans la table queue_search
        const { error: insertError } = await supabase
          .from("queue_search")
          .insert({
            client_id,
            keyword,
            parsed_filters: filters || {}
          });
          
        if (insertError) {
          console.error("Erreur lors de l'ajout de la recherche à la file d'attente:", insertError);
          toast.error("Erreur lors du lancement de la recherche");
          return;
        }
        
        toast.success("Recherche lancée avec succès!");
        
        // Soumettre le résultat de l'outil à OpenAI
        const toolOutputResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/openai-assistant`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE'}`
          },
          body: JSON.stringify({
            action: 'submit_tool_outputs',
            threadId: thread_id,
            runId: run_id,
            toolOutputs: [{
              tool_call_id: toolCall.id,
              output: JSON.stringify({ success: true })
            }]
          })
        });
        
        if (!toolOutputResponse.ok) {
          console.error("Erreur lors de la soumission du résultat de l'outil");
        }
      } catch (error) {
        console.error("Erreur lors du lancement de la recherche:", error);
        toast.error("Erreur lors du lancement de la recherche");
      }
    } else if (toolCall.function?.name === "generate_messages") {
      console.log("Appel de la fonction generate_messages");
      
      try {
        // Ici, on pourrait faire plus d'opérations si nécessaire
        
        // Soumettre le résultat de l'outil à OpenAI
        const toolOutputResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/openai-assistant`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE'}`
          },
          body: JSON.stringify({
            action: 'submit_tool_outputs',
            threadId: thread_id,
            runId: run_id,
            toolOutputs: [{
              tool_call_id: toolCall.id,
              output: JSON.stringify({ status: "message_generation_triggered" })
            }]
          })
        });
        
        if (!toolOutputResponse.ok) {
          console.error("Erreur lors de la soumission du résultat de l'outil");
        }
        
        toast.success("Génération des messages en cours...");
      } catch (error) {
        console.error("Erreur lors de la génération des messages:", error);
        toast.error("Erreur lors de la génération des messages");
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
        
        // Soumettre le résultat de l'outil à OpenAI
        const toolOutputResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/openai-assistant`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE'}`
          },
          body: JSON.stringify({
            action: 'submit_tool_outputs',
            threadId: thread_id,
            runId: run_id,
            toolOutputs: [{
              tool_call_id: toolCall.id,
              output: JSON.stringify({ success: true })
            }]
          })
        });
        
        if (!toolOutputResponse.ok) {
          console.error("Erreur lors de la soumission du résultat de l'outil");
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
        toast.error("Erreur lors de l'envoi de l'email");
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
        
        // Soumettre le résultat de l'outil à OpenAI
        const toolOutputResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/openai-assistant`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE'}`
          },
          body: JSON.stringify({
            action: 'submit_tool_outputs',
            threadId: thread_id,
            runId: run_id,
            toolOutputs: [{
              tool_call_id: toolCall.id,
              output: JSON.stringify({ success: true })
            }]
          })
        });
        
        if (!toolOutputResponse.ok) {
          console.error("Erreur lors de la soumission du résultat de l'outil");
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du suivi:", error);
        toast.error("Erreur lors de l'envoi du suivi");
      }
    } else {
      console.log(`Appel de fonction non géré: ${toolCall.function?.name}`);
    }
  } catch (error) {
    console.error("Erreur lors de l'appel de fonction:", error);
    toast.error("Une erreur s'est produite lors du traitement de la demande");
  }
}
