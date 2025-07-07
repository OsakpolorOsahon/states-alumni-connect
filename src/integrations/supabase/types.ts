export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          awarded_at: string | null
          awarded_by: string | null
          badge_code: string
          badge_name: string
          created_at: string | null
          description: string | null
          id: string
          member_id: string | null
          updated_at: string | null
        }
        Insert: {
          awarded_at?: string | null
          awarded_by?: string | null
          badge_code: string
          badge_name: string
          created_at?: string | null
          description?: string | null
          id?: string
          member_id?: string | null
          updated_at?: string | null
        }
        Update: {
          awarded_at?: string | null
          awarded_by?: string | null
          badge_code?: string
          badge_name?: string
          created_at?: string | null
          description?: string | null
          id?: string
          member_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "badges_awarded_by_fkey"
            columns: ["awarded_by"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "badges_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          event_date: string
          id: string
          location: string | null
          organizer_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_date: string
          id?: string
          location?: string | null
          organizer_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_date?: string
          id?: string
          location?: string | null
          organizer_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          thread_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          thread_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          thread_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_threads_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      hall_of_fame: {
        Row: {
          achievement_date: string | null
          achievement_description: string | null
          achievement_title: string
          created_at: string | null
          id: string
          member_id: string | null
          updated_at: string | null
        }
        Insert: {
          achievement_date?: string | null
          achievement_description?: string | null
          achievement_title: string
          created_at?: string | null
          id?: string
          member_id?: string | null
          updated_at?: string | null
        }
        Update: {
          achievement_date?: string | null
          achievement_description?: string | null
          achievement_title?: string
          created_at?: string | null
          id?: string
          member_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hall_of_fame_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applicant_id: string | null
          cover_letter: string | null
          created_at: string | null
          id: string
          job_id: string | null
          resume_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          applicant_id?: string | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      job_posts: {
        Row: {
          company: string
          created_at: string | null
          description: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          location: string | null
          posted_by: string | null
          salary_range: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          company: string
          created_at?: string | null
          description: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          posted_by?: string | null
          salary_range?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          company?: string
          created_at?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          posted_by?: string | null
          salary_range?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_posts_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          approved_at: string | null
          created_at: string | null
          current_council_office:
            | Database["public"]["Enums"]["council_office_enum"]
            | null
          dues_proof_url: string | null
          full_name: string
          id: string
          last_mowcub_position: Database["public"]["Enums"]["last_position_enum"]
          latitude: number | null
          longitude: number | null
          nickname: string | null
          paid_through: string | null
          photo_url: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          stateship_year: Database["public"]["Enums"]["stateship_year_enum"]
          status: Database["public"]["Enums"]["member_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          created_at?: string | null
          current_council_office?:
            | Database["public"]["Enums"]["council_office_enum"]
            | null
          dues_proof_url?: string | null
          full_name: string
          id?: string
          last_mowcub_position: Database["public"]["Enums"]["last_position_enum"]
          latitude?: number | null
          longitude?: number | null
          nickname?: string | null
          paid_through?: string | null
          photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          stateship_year: Database["public"]["Enums"]["stateship_year_enum"]
          status?: Database["public"]["Enums"]["member_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          created_at?: string | null
          current_council_office?:
            | Database["public"]["Enums"]["council_office_enum"]
            | null
          dues_proof_url?: string | null
          full_name?: string
          id?: string
          last_mowcub_position?: Database["public"]["Enums"]["last_position_enum"]
          latitude?: number | null
          longitude?: number | null
          nickname?: string | null
          paid_through?: string | null
          photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          stateship_year?: Database["public"]["Enums"]["stateship_year_enum"]
          status?: Database["public"]["Enums"]["member_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      mentorship_requests: {
        Row: {
          created_at: string | null
          id: string
          mentee_id: string | null
          mentor_id: string | null
          request_message: string | null
          responded_at: string | null
          status: Database["public"]["Enums"]["mentorship_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          request_message?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["mentorship_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          request_message?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["mentorship_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_requests_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_requests_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author_id: string | null
          content: string
          id: string
          is_published: boolean | null
          published_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          member_id: string | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          member_id?: string | null
          message: string
          title: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          member_id?: string | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      get_current_member_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_member_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_members: number
          active_members: number
          pending_members: number
          hall_of_fame_count: number
          recent_members: number
        }[]
      }
      get_nearby_members: {
        Args: { target_lat: number; target_lng: number; radius_km?: number }
        Returns: {
          id: string
          full_name: string
          nickname: string
          latitude: number
          longitude: number
          distance_km: number
        }[]
      }
      handover_secretary_role: {
        Args: { new_secretary_id: string }
        Returns: boolean
      }
      is_secretary: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      council_office_enum:
        | "President"
        | "Vice President (Diaspora)"
        | "Vice President (National)"
        | "Secretary-General"
        | "Assistant Secretary-General"
        | "Treasurer"
        | "Director of Finance"
        | "Director of Socials"
        | "Director of Public Relations"
        | "Provost Marshal"
        | "Deputy Provost Marshal"
        | "Ex-Officio (I)"
        | "Ex-Officio (II)"
        | "None"
      last_position_enum:
        | "CINC"
        | "CGS"
        | "AG"
        | "GOC"
        | "PM"
        | "EC"
        | "QMG"
        | "DSD"
        | "STO"
        | "BM"
        | "DO"
        | "FCRO"
        | "DOP"
        | "CSO"
        | "DOH"
        | "CDI"
        | "CMO"
        | "HOV"
        | "DAG"
        | "DPM"
        | "DQMG"
        | "DDSD"
        | "DBM"
        | "DDO"
        | "DFCRO"
        | "DDOP"
        | "DDOH"
        | "PC"
        | "ADC"
        | "DI"
        | "None"
      member_status: "Pending" | "Active" | "Rejected" | "Banned"
      mentorship_status: "pending" | "active" | "completed"
      notification_type:
        | "badge_awarded"
        | "member_approved"
        | "member_rejected"
        | "dues_reminder"
        | "general"
      stateship_year_enum:
        | "2015/2016"
        | "2016/2017"
        | "2017/2018"
        | "2018/2019"
        | "2019/2020"
        | "2020/2021"
        | "2021/2022"
        | "2022/2023"
        | "2023/2024"
        | "2024/2025"
        | "2025/2026"
      user_role: "member" | "secretary"
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
      council_office_enum: [
        "President",
        "Vice President (Diaspora)",
        "Vice President (National)",
        "Secretary-General",
        "Assistant Secretary-General",
        "Treasurer",
        "Director of Finance",
        "Director of Socials",
        "Director of Public Relations",
        "Provost Marshal",
        "Deputy Provost Marshal",
        "Ex-Officio (I)",
        "Ex-Officio (II)",
        "None",
      ],
      last_position_enum: [
        "CINC",
        "CGS",
        "AG",
        "GOC",
        "PM",
        "EC",
        "QMG",
        "DSD",
        "STO",
        "BM",
        "DO",
        "FCRO",
        "DOP",
        "CSO",
        "DOH",
        "CDI",
        "CMO",
        "HOV",
        "DAG",
        "DPM",
        "DQMG",
        "DDSD",
        "DBM",
        "DDO",
        "DFCRO",
        "DDOP",
        "DDOH",
        "PC",
        "ADC",
        "DI",
        "None",
      ],
      member_status: ["Pending", "Active", "Rejected", "Banned"],
      mentorship_status: ["pending", "active", "completed"],
      notification_type: [
        "badge_awarded",
        "member_approved",
        "member_rejected",
        "dues_reminder",
        "general",
      ],
      stateship_year_enum: [
        "2015/2016",
        "2016/2017",
        "2017/2018",
        "2018/2019",
        "2019/2020",
        "2020/2021",
        "2021/2022",
        "2022/2023",
        "2023/2024",
        "2024/2025",
        "2025/2026",
      ],
      user_role: ["member", "secretary"],
    },
  },
} as const
