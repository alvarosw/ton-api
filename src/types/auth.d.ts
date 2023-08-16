export interface UserCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  expiresIn: number
}