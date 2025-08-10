import { CheckCircle, CircleXIcon } from "lucide-react";

export default function ToggleCheck({ isActive }: { isActive: boolean }) {
  if (isActive) return <CheckCircle className="text-success" size={20} />;

  return <CircleXIcon className="text-danger" size={20} />;
}
