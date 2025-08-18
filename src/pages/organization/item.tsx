import { TreeNode } from "react-organizational-chart";

import CardItemOrg from "./card-item";

import { IOrganizations } from "@/interface/IOrganization";

interface Props {
  item: IOrganizations;
}
export default function Item({ item }: Props) {
  return (
    <TreeNode label={<CardItemOrg item={item} />}>
      {item?.children?.map((child) => <Item key={child.id} item={child} />)}
    </TreeNode>
  );
}
