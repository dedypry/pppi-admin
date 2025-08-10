interface IListProfile {
  title: string;
  value: string;
  Icon: any;
}
export default function ListProfile({ title, value, Icon }: IListProfile) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={18} /> <span className="font-semibold">{title}</span> :{" "}
      {value}
    </div>
  );
}
