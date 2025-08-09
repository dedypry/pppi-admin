import { FileSearch } from "lucide-react";

interface Props {
  title?: string;
}
export default function EmptyContent({ title = "No Data" }: Props) {
  return (
    <div className="flex justify-center gap-2">
      <FileSearch className="font-bold text-2xl" />
      <p className="font-semibold text-xl">{title}</p>
    </div>
  );
}
