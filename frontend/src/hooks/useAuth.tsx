/** @jsxImportSource react */
import { useState, createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import type { User } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  );

  // Check auth status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = authService.isAuthenticated();
      setIsAuthenticated(authStatus);
    };

    // Check initially
    checkAuth();

    // Listen for storage changes (for multi-tab support)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // Fetch current user
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      // Re-check auth status before fetching
      const authStatus = authService.isAuthenticated();
      if (!authStatus) {
        throw new Error("Not authenticated");
      }
      return authService.getCurrentUser();
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 0, // Always check fresh
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login({ email, password }),
    onSuccess: () => {
      setIsAuthenticated(true);
      refetch();
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    queryClient.clear();
  };

  const refetchUser = () => {
    // Update auth state from localStorage
    const authStatus = authService.isAuthenticated();
    setIsAuthenticated(authStatus);
    if (authStatus) {
      refetch();
    }
  };

  const value = {
    user: user || null,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
