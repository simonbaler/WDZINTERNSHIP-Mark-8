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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ar_showroom_sessions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          host_user_id: string | null
          id: string
          participants: Json | null
          product_id: string | null
          session_id: string
          status: string | null
          webrtc_config: Json | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          host_user_id?: string | null
          id?: string
          participants?: Json | null
          product_id?: string | null
          session_id: string
          status?: string | null
          webrtc_config?: Json | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          host_user_id?: string | null
          id?: string
          participants?: Json | null
          product_id?: string | null
          session_id?: string
          status?: string | null
          webrtc_config?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ar_showroom_sessions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          max_discount_amount: number | null
          min_order_amount: number | null
          updated_at: string | null
          usage_count: number | null
          usage_limit: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_order_amount?: number | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_order_amount?: number | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      csv_import_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          dry_run: boolean | null
          error_count: number | null
          filename: string
          id: string
          processed_rows: number | null
          status: string
          success_count: number | null
          total_rows: number | null
          user_id: string
          validation_errors: Json | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          dry_run?: boolean | null
          error_count?: number | null
          filename: string
          id?: string
          processed_rows?: number | null
          status?: string
          success_count?: number | null
          total_rows?: number | null
          user_id: string
          validation_errors?: Json | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          dry_run?: boolean | null
          error_count?: number | null
          filename?: string
          id?: string
          processed_rows?: number | null
          status?: string
          success_count?: number | null
          total_rows?: number | null
          user_id?: string
          validation_errors?: Json | null
        }
        Relationships: []
      }
      edge_personalization_models: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          model_data: Json
          model_type: string
          updated_at: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          model_data: Json
          model_type: string
          updated_at?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          model_data?: Json
          model_type?: string
          updated_at?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string | null
          description: string | null
          flag_key: string
          id: string
          is_enabled: boolean | null
          metadata: Json | null
          requires_auth: boolean | null
          security_notes: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          flag_key: string
          id?: string
          is_enabled?: boolean | null
          metadata?: Json | null
          requires_auth?: boolean | null
          security_notes?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          flag_key?: string
          id?: string
          is_enabled?: boolean | null
          metadata?: Json | null
          requires_auth?: boolean | null
          security_notes?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      federated_learning_updates: {
        Row: {
          aggregated: boolean | null
          created_at: string | null
          differential_privacy_epsilon: number | null
          encrypted_gradients: Json
          id: string
          metadata: Json | null
          update_type: string
          user_id: string | null
        }
        Insert: {
          aggregated?: boolean | null
          created_at?: string | null
          differential_privacy_epsilon?: number | null
          encrypted_gradients: Json
          id?: string
          metadata?: Json | null
          update_type: string
          user_id?: string | null
        }
        Update: {
          aggregated?: boolean | null
          created_at?: string | null
          differential_privacy_epsilon?: number | null
          encrypted_gradients?: Json
          id?: string
          metadata?: Json | null
          update_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          created_at: string
          id: string
          low_stock_threshold: number | null
          product_id: string
          quantity: number
          reserved_quantity: number | null
          updated_at: string
          warehouse_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          low_stock_threshold?: number | null
          product_id: string
          quantity?: number
          reserved_quantity?: number | null
          updated_at?: string
          warehouse_id: string
        }
        Update: {
          created_at?: string
          id?: string
          low_stock_threshold?: number | null
          product_id?: string
          quantity?: number
          reserved_quantity?: number | null
          updated_at?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string | null
          cdn_url: string | null
          created_at: string
          draco_compressed: boolean | null
          file_size: number
          filename: string
          height: number | null
          id: string
          lod_levels: Json | null
          media_type: string
          metadata: Json | null
          mime_type: string
          original_filename: string
          polycount: number | null
          processing_status: string
          product_id: string | null
          storage_path: string
          tags: string[] | null
          updated_at: string
          user_id: string | null
          variants: Json | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          cdn_url?: string | null
          created_at?: string
          draco_compressed?: boolean | null
          file_size: number
          filename: string
          height?: number | null
          id?: string
          lod_levels?: Json | null
          media_type: string
          metadata?: Json | null
          mime_type: string
          original_filename: string
          polycount?: number | null
          processing_status?: string
          product_id?: string | null
          storage_path: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
          variants?: Json | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          cdn_url?: string | null
          created_at?: string
          draco_compressed?: boolean | null
          file_size?: number
          filename?: string
          height?: number | null
          id?: string
          lod_levels?: Json | null
          media_type?: string
          metadata?: Json | null
          mime_type?: string
          original_filename?: string
          polycount?: number | null
          processing_status?: string
          product_id?: string | null
          storage_path?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
          variants?: Json | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      media_processing_queue: {
        Row: {
          attempts: number | null
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          job_type: string
          max_attempts: number | null
          media_id: string
          priority: number | null
          result: Json | null
          started_at: string | null
          status: string
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_type: string
          max_attempts?: number | null
          media_id: string
          priority?: number | null
          result?: Json | null
          started_at?: string | null
          status?: string
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_type?: string
          max_attempts?: number | null
          media_id?: string
          priority?: number | null
          result?: Json | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_processing_queue_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          payment_status: string | null
          shipping_address: Json
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_number: string
          payment_method?: string | null
          payment_status?: string | null
          shipping_address: Json
          status?: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      product_embeddings: {
        Row: {
          content_hash: string | null
          created_at: string
          embedding: string | null
          embedding_type: string
          id: string
          metadata: Json | null
          product_id: string
          source_field: string | null
          updated_at: string
        }
        Insert: {
          content_hash?: string | null
          created_at?: string
          embedding?: string | null
          embedding_type: string
          id?: string
          metadata?: Json | null
          product_id: string
          source_field?: string | null
          updated_at?: string
        }
        Update: {
          content_hash?: string | null
          created_at?: string
          embedding?: string | null
          embedding_type?: string
          id?: string
          metadata?: Json | null
          product_id?: string
          source_field?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_embeddings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          original_price: number | null
          price: number
          slug: string
          specifications: Json | null
          stock: number
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          original_price?: number | null
          price: number
          slug: string
          specifications?: Json | null
          stock?: number
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          original_price?: number | null
          price?: number
          slug?: string
          specifications?: Json | null
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          latitude: number | null
          longitude: number | null
          phone_number: string | null
          pincode: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          phone_number?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          phone_number?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      provenance_events: {
        Row: {
          blockchain_hash: string | null
          created_at: string | null
          event_data: Json
          event_type: string
          id: string
          ledger_timestamp: string | null
          product_id: string
        }
        Insert: {
          blockchain_hash?: string | null
          created_at?: string | null
          event_data: Json
          event_type: string
          id?: string
          ledger_timestamp?: string | null
          product_id: string
        }
        Update: {
          blockchain_hash?: string | null
          created_at?: string | null
          event_data?: Json
          event_type?: string
          id?: string
          ledger_timestamp?: string | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provenance_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          results_count: number | null
          search_query: string
          search_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          results_count?: number | null
          search_query: string
          search_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          results_count?: number | null
          search_query?: string
          search_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      warehouses: {
        Row: {
          address: string | null
          city: string | null
          code: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          pincode: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          code: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      webauthn_credentials: {
        Row: {
          counter: number | null
          created_at: string | null
          credential_id: string
          id: string
          last_used_at: string | null
          public_key: string
          transports: string[] | null
          user_id: string
        }
        Insert: {
          counter?: number | null
          created_at?: string | null
          credential_id: string
          id?: string
          last_used_at?: string | null
          public_key: string
          transports?: string[] | null
          user_id: string
        }
        Update: {
          counter?: number | null
          created_at?: string | null
          credential_id?: string
          id?: string
          last_used_at?: string | null
          public_key?: string
          transports?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      webhook_configs: {
        Row: {
          created_at: string
          description: string | null
          event_type: string
          id: string
          is_active: boolean | null
          name: string
          retry_config: Json | null
          updated_at: string
          webhook_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_type: string
          id?: string
          is_active?: boolean | null
          name: string
          retry_config?: Json | null
          updated_at?: string
          webhook_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          retry_config?: Json | null
          updated_at?: string
          webhook_url?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          attempts: number | null
          completed_at: string | null
          created_at: string
          error_message: string | null
          event_data: Json
          event_type: string
          id: string
          idempotency_key: string
          last_attempt_at: string | null
          max_attempts: number | null
          next_retry_at: string | null
          response_body: string | null
          response_status: number | null
          status: string
          webhook_url: string
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          event_data: Json
          event_type: string
          id?: string
          idempotency_key: string
          last_attempt_at?: string | null
          max_attempts?: number | null
          next_retry_at?: string | null
          response_body?: string | null
          response_status?: number | null
          status?: string
          webhook_url: string
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          event_data?: Json
          event_type?: string
          id?: string
          idempotency_key?: string
          last_attempt_at?: string | null
          max_attempts?: number | null
          next_retry_at?: string | null
          response_body?: string | null
          response_status?: number | null
          status?: string
          webhook_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      search_products_by_embedding: {
        Args: {
          embedding_filter?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          product_data: Json
          product_id: string
          similarity: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "customer"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
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
      app_role: ["admin", "customer"],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
    },
  },
} as const
