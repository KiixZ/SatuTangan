import { create } from "zustand";
import { getCookie, setCookie, removeCookie } from "@admin/lib/cookies";

const ACCESS_TOKEN = "thisisjustarandomstring";
const USER_DATA = "user_data_cookie";

interface AuthUser {
  accountNo: string;
  email: string;
  role: string[];
  exp: number;
}

interface AuthState {
  auth: {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    accessToken: string;
    setAccessToken: (accessToken: string) => void;
    resetAccessToken: () => void;
    reset: () => void;
    isAuthenticated: boolean;
  };
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN);
  const initToken = cookieState ? JSON.parse(cookieState) : "";

  // Load user data from cookie
  const userCookie = getCookie(USER_DATA);
  const initUser = userCookie ? JSON.parse(userCookie) : null;

  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          if (user) {
            setCookie(USER_DATA, JSON.stringify(user));
          } else {
            removeCookie(USER_DATA);
          }
          return {
            ...state,
            auth: {
              ...state.auth,
              user,
              isAuthenticated: !!user && !!state.auth.accessToken,
            },
          };
        }),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken));
          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken,
              isAuthenticated: !!state.auth.user && !!accessToken,
            },
          };
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken: "",
              isAuthenticated: false,
            },
          };
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          removeCookie(USER_DATA);
          return {
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: "",
              isAuthenticated: false,
            },
          };
        }),
      isAuthenticated: !!initUser && !!initToken,
    },
  };
});
