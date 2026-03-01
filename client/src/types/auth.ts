export interface AuthUser {
  id: number
  name: string
  email: string
  isAdmin: boolean
  isActiveInstructor: boolean
  instructorId?: number
}
