import 'express-session';

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  isActiveInstructor: boolean;
  instructorId?: number;
}

declare module 'express-session' {
  interface SessionData {
    user?: SessionUser;
  }
}
