import { ReactNode } from "react";

interface Props {
  title: string;
  val: string;
  rightIcon?: ReactNode;
  fontSize?: string;
  width?: number;
  horizontal?: boolean;
}
export default function TextHeader({
  title,
  val,
  rightIcon,
  fontSize = "12px",
  width = 60,
  horizontal = false,
}: Props) {
  return (
    <div
      className={`flex ${horizontal ? "flex-col" : "flex-row items-center align-middle gap-2"} text-[${fontSize}] text-gray-500`}
    >
      <p style={{ width: width }}>{title}</p>
      {!horizontal && <p>:</p>}

      <p>{val}</p>
      {rightIcon && rightIcon}
    </div>
  );
}
