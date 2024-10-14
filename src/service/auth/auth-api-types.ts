export type LoginResponse = {
  data: string
  httpCode: number
  messages: string
  resultCode: number
}
export type LoginArgs = {
  email: string
  password: string
}
export type UserArgs = {
  email: string
  login: string
  name: string
  password: string
  surname: string
}
export type UserResponse = {
  email: string
  login: string
  name: string
  password: string
  surname: string
}

export type verifyEmailResponse = {
  data?: any
  httpCode: number
  messages: string
  resultCode: number
}
