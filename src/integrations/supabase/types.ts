export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string | null
          client_id: string | null
          context: Json | null
          created_at: string | null
          id: string
        }
        Insert: {
          action?: string | null
          client_id?: string | null
          context?: Json | null
          created_at?: string | null
          id?: string
        }
        Update: {
          action?: string | null
          client_id?: string | null
          context?: Json | null
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          title: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
        }
        Relationships: []
      }
      client_profile: {
        Row: {
          banned_phrases: string | null
          calendly_url: string | null
          client_id: string
          common_objections: string | null
          company_name: string | null
          created_at: string | null
          icp_location: string | null
          icp_size: string | null
          icp_title: string | null
          id: string
          industry: string | null
          is_complete: boolean | null
          linkedin_url: string | null
          offer: string | null
          primary_goal: string | null
          tone: string | null
          updated_at: string | null
          value_prop: string | null
        }
        Insert: {
          banned_phrases?: string | null
          calendly_url?: string | null
          client_id: string
          common_objections?: string | null
          company_name?: string | null
          created_at?: string | null
          icp_location?: string | null
          icp_size?: string | null
          icp_title?: string | null
          id?: string
          industry?: string | null
          is_complete?: boolean | null
          linkedin_url?: string | null
          offer?: string | null
          primary_goal?: string | null
          tone?: string | null
          updated_at?: string | null
          value_prop?: string | null
        }
        Update: {
          banned_phrases?: string | null
          calendly_url?: string | null
          client_id?: string
          common_objections?: string | null
          company_name?: string | null
          created_at?: string | null
          icp_location?: string | null
          icp_size?: string | null
          icp_title?: string | null
          id?: string
          industry?: string | null
          is_complete?: boolean | null
          linkedin_url?: string | null
          offer?: string | null
          primary_goal?: string | null
          tone?: string | null
          updated_at?: string | null
          value_prop?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          client_id: string
          created_at: string
          id: string
          type: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          type: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      email_jobs: {
        Row: {
          body: string | null
          client_id: string | null
          error: string | null
          id: string
          lead_id: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          type: string | null
        }
        Insert: {
          body?: string | null
          client_id?: string | null
          error?: string | null
          id?: string
          lead_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type?: string | null
        }
        Update: {
          body?: string | null
          client_id?: string | null
          error?: string | null
          id?: string
          lead_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_jobs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          client_id: string | null
          company: string | null
          created_at: string | null
          email: string | null
          enriched_from: Json | null
          full_name: string | null
          id: string
          job_title: string | null
          linkedin_url: string | null
          location: string | null
          phone_number: string | null
          search_id: string | null
          status: string | null
        }
        Insert: {
          client_id?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          enriched_from?: Json | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone_number?: string | null
          search_id?: string | null
          status?: string | null
        }
        Update: {
          client_id?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          enriched_from?: Json | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone_number?: string | null
          search_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "queue_search"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          role: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      queue_search: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          keyword: string | null
          parsed_filters: Json | null
          status: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          keyword?: string | null
          parsed_filters?: Json | null
          status?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          keyword?: string | null
          parsed_filters?: Json | null
          status?: string | null
        }
        Relationships: []
      }
      tokens: {
        Row: {
          access_token: string | null
          client_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          provider: string | null
          provider_token_id: string | null
          refresh_token: string | null
          scope: string[] | null
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          client_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider?: string | null
          provider_token_id?: string | null
          refresh_token?: string | null
          scope?: string[] | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          client_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider?: string | null
          provider_token_id?: string | null
          refresh_token?: string | null
          scope?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          discord_joined: boolean
          email: string
          id: string
          points: number
          referral_code: string
          referred_by: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discord_joined?: boolean
          email: string
          id?: string
          points?: number
          referral_code?: string
          referred_by?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discord_joined?: boolean
          email?: string
          id?: string
          points?: number
          referral_code?: string
          referred_by?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "waitlist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "waitlist_with_position"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      waitlist_with_position: {
        Row: {
          created_at: string | null
          discord_joined: boolean | null
          email: string | null
          id: string | null
          points: number | null
          referral_code: string | null
          referral_count: number | null
          referred_by: string | null
          updated_at: string | null
          user_id: string | null
          waitlist_position: number | null
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "waitlist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "waitlist_with_position"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_user_email: {
        Args: { _user_id: string }
        Returns: string
      }
      get_waitlist_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      handle_waitlist_signup: {
        Args: { p_email: string; p_referral_code?: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_superadmin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_discord_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      update_message_toolcalls: {
        Args: { message_id: string; tool_calls: Json }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "superadmin" | "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["superadmin", "admin", "user"],
    },
  },
} as const
