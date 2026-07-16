import { TreeNode } from "react-organizational-chart";

import CardItemOrg from "./card-item";

import { IOrganizations } from "@/interface/IOrganization";

interface Props {
  item: IOrganizations;
  onPickUser: (item: IOrganizations) => void;
}

export default function Item({ item, onPickUser }: Props) {
  return (
    <TreeNode
      label={<CardItemOrg item={item} onPickUser={() => onPickUser(item)} />}
    >
      {item?.children?.map((child) => (
        <Item key={child.id} item={child} onPickUser={onPickUser} />
      ))}
    </TreeNode>
  );
}
