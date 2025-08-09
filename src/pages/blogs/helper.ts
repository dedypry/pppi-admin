export function getColorStatus(status: string) {
  let color = "warning";

  switch (status) {
    case "publish":
      color = "success";
      break;

    case "draft":
      color = "default";
      break;

    case "rejected":
      color = "danger";
      break;

    default:
      color = "warning";
      break;
  }

  return color;
}
