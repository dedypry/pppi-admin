import { Button } from "@heroui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import RegisterMember from "@/components/auth/register";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getUserDetail } from "@/stores/features/user/action";
import { setUserDetail } from "@/stores/features/user/userSlice";

export default function MemberCreate() {
  const { id } = useParams();
  const route = useNavigate();
  const dispatch = useAppDispatch();
  const { detail: user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(getUserDetail({ id: id as any }));
    } else {
      dispatch(setUserDetail(null));
    }
  }, [id]);

  return (
    <div className="flex flex-col gap-5">
      <RegisterMember
        action={
          <div className="flex justify-end gap-3">
            <Button color="primary" type="submit" variant="shadow">
              {id ? "Update" : "Add"} Member
            </Button>
            <Button color="secondary" variant="bordered">
              Cancel
            </Button>
          </div>
        }
        user={user!}
        onSuccess={() => route("/member")}
      />
    </div>
  );
}
