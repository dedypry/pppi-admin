import { ReactNode, useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { http } from "@/config/axios";
import { setToken } from "@/stores/features/auth/authSlice";
import { setUser } from "@/stores/features/user/userSlice";
import Loading from "@/components/loading/Loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { token: stateToken } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const route = useNavigate();
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const hasFetched = useRef(false);

  const token = stateToken || query.get("token");

  useEffect(() => {
    if (token && !hasFetched.current) {
      hasFetched.current = true;
      if (!stateToken) {
        dispatch(setToken(token));
      }
      getProfile();
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
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
        console.error("AUTH GUARD", err);
        // notifyError(err);
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
