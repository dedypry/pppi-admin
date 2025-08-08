import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { http } from "@/config/axios";
import { notifyError } from "@/utils/helpers/notify";
import { setToken } from "@/stores/features/auth/authSlice";
import { setUser } from "@/stores/features/user/userSlice";
import Loading from "@/components/loading/Loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { token } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const route = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      getProfile();
    }
  }, []);

  function getProfile() {
    setIsLoading(true);
    http
      .get("/profile", {
        headers: {
          Authorization: token,
        },
      })
      .then(({ data }) => {
        dispatch(setUser(data));
      })
      .catch((err) => {
        notifyError(err);
        dispatch(setToken(""));
        route("/login");
      })
      .finally(() => setIsLoading(false));
  }

  if (isLoading) return <Loading />;

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
