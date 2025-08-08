import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-primary-100">
      <Outlet />
    </div>
  );
}
