import { TreeNode } from "react-organizational-chart";

import KepengurusanCard from "./card";

import { IKepengurusanNode } from "@/interface/IKepengurusan";

interface Props {
  node: IKepengurusanNode;
  canEdit?: boolean;
  onEditUser?: (node: IKepengurusanNode) => void;
}

export default function KepengurusanItem({
  node,
  canEdit,
  onEditUser,
}: Props) {
  return (
    <TreeNode
      label={
        <KepengurusanCard
          canEdit={canEdit}
          node={node}
          onEditUser={onEditUser}
        />
      }
    >
      {node.children?.map((child) => (
        <KepengurusanItem
          key={child.id}
          canEdit={canEdit}
          node={child}
          onEditUser={onEditUser}
        />
      ))}
    </TreeNode>
  );
}
