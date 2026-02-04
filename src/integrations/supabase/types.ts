export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      government_complaints: {
        Row: {
          complaint_type: string
          cpgrams_redirect_url: string | null
          created_at: string
          description: string | null
          distance_meters: number
          end_lat: number
          end_lng: number
          end_location: string
          id: string
          redirected_at: string
          route_hash: string
          start_lat: number
          start_lng: number
          start_location: string
          user_id: string
          walkability_score: number
        }
        Insert: {
          complaint_type: string
          cpgrams_redirect_url?: string | null
          created_at?: string
          description?: string | null
          distance_meters: number
          end_lat: number
          end_lng: number
          end_location: string
          id?: string
          redirected_at?: string
          route_hash: string
          start_lat: number
          start_lng: number
          start_location: string
          user_id: string
          walkability_score: number
        }
        Update: {
          complaint_type?: string
          cpgrams_redirect_url?: string | null
          created_at?: string
          description?: string | null
          distance_meters?: number
          end_lat?: number
          end_lng?: number
          end_location?: string
          id?: string
          redirected_at?: string
          route_hash?: string
          start_lat?: number
          start_lng?: number
          start_location?: string
          user_id?: string
          walkability_score?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      route_ratings: {
        Row: {
          accessibility_score: number | null
          comment: string | null
          created_at: string
          end_lat: number
          end_lng: number
          end_name: string | null
          id: string
          lighting_score: number | null
          overall_rating: number
          route_hash: string
          safety_score: number | null
          start_lat: number
          start_lng: number
          start_name: string | null
          updated_at: string
          user_id: string
          walkability_score: number | null
        }
        Insert: {
          accessibility_score?: number | null
          comment?: string | null
          created_at?: string
          end_lat: number
          end_lng: number
          end_name?: string | null
          id?: string
          lighting_score?: number | null
          overall_rating: number
          route_hash: string
          safety_score?: number | null
          start_lat: number
          start_lng: number
          start_name?: string | null
          updated_at?: string
          user_id: string
          walkability_score?: number | null
        }
        Update: {
          accessibility_score?: number | null
          comment?: string | null
          created_at?: string
          end_lat?: number
          end_lng?: number
          end_name?: string | null
          id?: string
          lighting_score?: number | null
          overall_rating?: number
          route_hash?: string
          safety_score?: number | null
          start_lat?: number
          start_lng?: number
          start_name?: string | null
          updated_at?: string
          user_id?: string
          walkability_score?: number | null
        }
        Relationships: []
      }
      route_score_sessions: {
        Row: {
          expires_at: string
          id: string
          locked_at: string
          route_hash: string
          user_id: string
          walkability_score: number
        }
        Insert: {
          expires_at?: string
          id?: string
          locked_at?: string
          route_hash: string
          user_id: string
          walkability_score: number
        }
        Update: {
          expires_at?: string
          id?: string
          locked_at?: string
          route_hash?: string
          user_id?: string
          walkability_score?: number
        }
        Relationships: []
      }
      saved_routes: {
        Row: {
          created_at: string
          distance_meters: number | null
          duration_seconds: number | null
          end_lat: number
          end_lng: number
          end_name: string
          id: string
          route_hash: string
          start_lat: number
          start_lng: number
          start_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          distance_meters?: number | null
          duration_seconds?: number | null
          end_lat: number
          end_lng: number
          end_name: string
          id?: string
          route_hash: string
          start_lat: number
          start_lng: number
          start_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          distance_meters?: number | null
          duration_seconds?: number | null
          end_lat?: number
          end_lng?: number
          end_name?: string
          id?: string
          route_hash?: string
          start_lat?: number
          start_lng?: number
          start_name?: string
          user_id?: string
        }
        Relationships: []
      }
      street_issues: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_urls: string[] | null
          issue_type: string
          lat: number
          lng: number
          location_name: string | null
          route_hash: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          issue_type: string
          lat: number
          lng: number
          location_name?: string | null
          route_hash: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          issue_type?: string
          lat?: number
          lng?: number
          location_name?: string | null
          route_hash?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement: Database["public"]["Enums"]["achievement_type"]
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement: Database["public"]["Enums"]["achievement_type"]
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement?: Database["public"]["Enums"]["achievement_type"]
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_contributions: {
        Row: {
          complaints_raised: number
          created_at: string
          id: string
          images_uploaded: number
          routes_analyzed: number
          scores_submitted: number
          updated_at: string
          user_id: string
        }
        Insert: {
          complaints_raised?: number
          created_at?: string
          id?: string
          images_uploaded?: number
          routes_analyzed?: number
          scores_submitted?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          complaints_raised?: number
          created_at?: string
          id?: string
          images_uploaded?: number
          routes_analyzed?: number
          scores_submitted?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      achievement_type:
        | "first_route"
        | "explorer_10"
        | "explorer_50"
        | "explorer_100"
        | "first_rating"
        | "rater_10"
        | "rater_50"
        | "rater_100"
        | "first_upload"
        | "photographer_10"
        | "photographer_50"
        | "first_complaint"
        | "advocate_10"
        | "advocate_50"
        | "safety_advocate"
        | "urban_explorer"
        | "active_contributor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      achievement_type: [
        "first_route",
        "explorer_10",
        "explorer_50",
        "explorer_100",
        "first_rating",
        "rater_10",
        "rater_50",
        "rater_100",
        "first_upload",
        "photographer_10",
        "photographer_50",
        "first_complaint",
        "advocate_10",
        "advocate_50",
        "safety_advocate",
        "urban_explorer",
        "active_contributor",
      ],
    },
  },
} as const
