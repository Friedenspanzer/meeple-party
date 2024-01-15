"use client";

import Avatar from "@/components/Avatar/Avatar";
import Spinner from "@/components/Spinner/Spinner";
import useMyUserProfile from "@/lib/hooks/data/useMyUserProfile";
import { useCallback, useState } from "react";

const AvatarDisplay: React.FC = () => {
  const { isLoading, userProfile, invalidate } = useMyUserProfile();
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
      .then(invalidate)
      .catch((error) => {
        console.error(error);
      });
  }, [invalidate]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="row mt-4">
      <div className="col-2">
        <Avatar name={userProfile?.name || ""} image={userProfile?.image} />
      </div>
      <div className="col">
        {userProfile?.image && (
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
