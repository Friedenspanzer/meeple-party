"use client";

import Avatar from "@/components/Avatar/Avatar";
import Spinner from "@/components/Spinner/Spinner";
import { useUser } from "@/context/userContext";
import { useCallback, useState } from "react";

const AvatarDisplay: React.FC = () => {
  const { user, loading: loadingUser, update: updateUser } = useUser();
  const [loading, setLoading] = useState(false);

  const removeAvatar = useCallback(() => {
    setLoading(true);
    fetch("/api/user/avatar", { method: "DELETE" })
      .then((result) => {
        if (!result.ok) {
          throw Error(`${result.status}: ${result.statusText}`);
        }
      })
      .then(() => setLoading(false))
      .then(updateUser)
      .catch((error) => {
        console.error(error);
      });
  }, [updateUser]);

  if (loadingUser) {
    return <Spinner />;
  }

  return (
    <div className="row mt-4">
      <div className="col-2">
        <Avatar name={user?.name || ""} image={user?.image} />
      </div>
      <div className="col">
        {user?.image && (
          <button
            type="button"
            className="btn btn-warning"
            onClick={removeAvatar}
            disabled={loading}
          >
            Remove avatar
          </button>
        )}
      </div>
    </div>
  );
};

export default AvatarDisplay;
