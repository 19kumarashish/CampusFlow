import { IUser } from "@/modules/users/models/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};