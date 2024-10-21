"use client";

import Avatar from "@/feature/profiles/components/Avatar/Avatar";
import { useTranslation } from "@/i18n/client";
import Spinner from "@/lib/components/Spinner/Spinner";
import useUserProfile from "@/lib/hooks/useUserProfile";
import { useCallback, useState } from "react";

const AvatarDisplay: React.FC = () => {
  const { t } = useTranslation("profile");
  const { isLoading, userProfile, invalidate } = useUserProfile();
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
            {t("Avatar.Remove")}
          </button>
        )}
      </div>
    </div>
  );
};

export default AvatarDisplay;
