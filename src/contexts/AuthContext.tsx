import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService, userService } from "../services/api";
import type {
  FaceEnrollData,
  FaceLoginData,
  LoginCredentials,
  RegisterData,
  User,
} from "../types";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  faceLogin: (data: FaceLoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  enrollFace: (
    data: FaceEnrollData
  ) => Promise<{ success: boolean; quality_score: number }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        // Optionally verify token is still valid
        try {
          const currentUser = await userService.getMe();
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        } catch (error) {
          // Token invalid, clear storage
          logout();
        }
      }
    } catch (error) {
      console.error("Error loading stored data:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      console.debug("[Auth] login response:", response);
      if (!response || !response.access_token) {
        throw new Error("Resposta de autenticação inválida");
      }

      localStorage.setItem("token", response.access_token);

      // Try to get user data; if it fails, clear token and rethrow to let UI handle it
      const userData = await userService.getMe();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.error("[Auth] login error:", err);
      // If fetching user fails, clean up
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      throw err;
    }
  };

  const faceLogin = async (data: FaceLoginData) => {
    try {
      const response = await authService.faceLogin(data);
      console.debug("[Auth] faceLogin response:", response);
      if (!response || !response.access_token) {
        throw new Error("Resposta de autenticação inválida");
      }

      localStorage.setItem("token", response.access_token);

      if (response.user) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      } else {
        // Try to fetch user if not returned
        const userData = await userService.getMe();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (err) {
      console.error("[Auth] faceLogin error:", err);
      // If fetching user fails, clean up
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      throw err;
    }
  };

  const register = async (data: RegisterData) => {
    await userService.register(data);
    // Auto login after registration
    await login({ email: data.email, password: data.password });
  };

  const enrollFace = async (data: FaceEnrollData) => {
    const response = await authService.enrollFace(data);

    // Update user data to reflect face enrollment
    if (user) {
      const updatedUser = { ...user, face_enrolled: response.face_enrolled };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    return {
      success: response.success,
      quality_score: response.quality_score,
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        faceLogin,
        register,
        enrollFace,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
