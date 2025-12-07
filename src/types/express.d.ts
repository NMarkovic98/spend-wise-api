import { User } from "../entities/user";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      fullname?: string;
      google_id?: string;
    }
  }
}
