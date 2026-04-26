export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthUser {
  id: number | string
  name: string
  email: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface ApiValidationError {
  message: string
  errors?: Record<string, string[]>
}

export async function apiLogin(payload: LoginPayload): Promise<AuthResponse> {
  const { public: { apiHost } } = useRuntimeConfig()
  return $fetch<AuthResponse>('/auth/login', {
    method: 'POST',
    baseURL: apiHost,
    body: payload
  })
}

export async function apiRegister(payload: RegisterPayload): Promise<AuthResponse> {
  const { public: { apiHost } } = useRuntimeConfig()
  return $fetch<AuthResponse>('/auth/register', {
    method: 'POST',
    baseURL: apiHost,
    body: payload
  })
}