import { Request } from "express";

import { IUser } from "@/modules/users/models/user.interface";

export interface AuthRequest extends Request {
  user?: IUser;
}

