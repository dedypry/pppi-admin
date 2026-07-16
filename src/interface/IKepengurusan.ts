import { IUser } from "@/interface/IUser";

export interface IKepengurusanNode {
  id: string;
  title: string;
  type: "wilayah" | "pengurus" | "user";
  wilayah?: string;
  pengurus?: string;
  region?: string;
  user?: IUser;
  children: IKepengurusanNode[];
}
