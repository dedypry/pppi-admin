import { IUser } from "./IUser";

export interface IOrganizations {
  id: number;
  parent_id?: number;
  user_id: number;
  title: string;
  description: string;
  user?: IUser;
  children: IOrganizations[];
}
