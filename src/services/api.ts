import axios from "axios";
import type {
  AuthResponse,
  FaceEnrollData,
  FaceEnrollResponse,
  FaceLoginData,
  FaceTestData,
  FaceTestResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // Ensure config and headers objects exist before assigning to avoid runtime errors
  if (!config) config = {} as any;
  if (!config.headers) config.headers = {} as any;

  if (token) {
    // Use bracket notation to avoid TypeScript index signature issues
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.debug("[API] Sending login request:", { email: credentials.email });
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    console.debug("[API] Login response:", response.data);
    return response.data;
  },

  faceLogin: async (data: FaceLoginData): Promise<AuthResponse> => {
    console.debug("[API] Sending face login request:", { email: data.email });

    // API expects FormData, not JSON
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("face_image_base64", data.face_image_base64);

    try {
      const response = await api.post<AuthResponse>("/auth/face/login", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.debug("[API] Face login response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("[API] Face login error:", error.response?.data || error.message);
      throw error;
    }
  },

  enrollFace: async (data: FaceEnrollData): Promise<FaceEnrollResponse> => {
    console.debug("[API] Sending face enroll request");

    // API expects FormData, not JSON
    const formData = new FormData();
    formData.append("face_image_base64", data.face_image_base64);

    const response = await api.post<FaceEnrollResponse>(
      "/auth/face/enroll",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.debug("[API] Face enroll response:", response.data);
    return response.data;
  },

  testFace: async (data: FaceTestData): Promise<FaceTestResponse> => {
    console.debug("[API] Sending face test request:", { email: data.email });

    // API expects FormData, not JSON
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("face_image_base64", data.face_image_base64);

    const response = await api.post<FaceTestResponse>(
      "/auth/face/test",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.debug("[API] Face test response:", response.data);
    return response.data;
  },
};

// User endpoints
export const userService = {
  register: async (data: RegisterData): Promise<User> => {
    console.debug("[API] Sending register request:", { email: data.email, name: data.name });
    const response = await api.post<User>("/users/", data);
    console.debug("[API] Register response:", response.data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    console.debug("[API] Fetching current user");
    const response = await api.get<User>("/auth/me");
    console.debug("[API] Current user:", response.data);
    return response.data;
  },

  getAll: async (skip: number = 0, limit: number = 100): Promise<User[]> => {
    console.debug("[API] Fetching all users");
    const response = await api.get<User[]>(`/users/?skip=${skip}&limit=${limit}`);
    console.debug("[API] Users list:", response.data);
    return response.data;
  },

  getById: async (userId: number): Promise<User> => {
    console.debug("[API] Fetching user by ID:", userId);
    const response = await api.get<User>(`/users/${userId}`);
    console.debug("[API] User:", response.data);
    return response.data;
  },

  update: async (userId: number, data: Partial<RegisterData>): Promise<User> => {
    console.debug("[API] Updating user:", userId);
    const response = await api.put<User>(`/users/${userId}`, data);
    console.debug("[API] Updated user:", response.data);
    return response.data;
  },

  delete: async (userId: number): Promise<void> => {
    console.debug("[API] Deleting user:", userId);
    await api.delete(`/users/${userId}`);
    console.debug("[API] User deleted");
  },
};

export default api;
