export function chipColor(status: string) {
  let color = "";

  if (status === "approved") {
    color = "success";
  } else if (status == "rejected") {
    color = "danger";
  } else {
    color = "secondary";
  }

  return color;
}
