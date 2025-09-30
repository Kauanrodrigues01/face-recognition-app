export interface User {
  id: number;
  email: string;
  name: string;
  is_active?: boolean;
  is_superuser?: boolean;
  face_enrolled: boolean;
  created_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
  is_superuser?: boolean;
}

export interface FaceLoginData {
  email: string;
  face_image_base64: string;
}

export interface FaceEnrollData {
  face_image_base64: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

export interface FaceEnrollResponse {
  success: boolean;
  message: string;
  quality_score: number;
  face_enrolled: boolean;
}

export interface ApiError {
  detail: string;
}

export interface FaceTestData {
  email: string;
  face_image_base64: string;
}

export interface FaceTestResponse {
  match: boolean;
  confidence: number;
  message: string;
  user?: User;
}