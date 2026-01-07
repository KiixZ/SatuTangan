export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: "DONOR" | "CREATOR" | "ADMIN";
  is_email_verified: boolean;
  profile_photo_url?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
