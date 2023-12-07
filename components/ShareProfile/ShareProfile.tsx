"use client";

import { useCallback } from "react";

export interface ShareProfileProps {
  profileId: string;
}

export default function ShareProfile({ profileId }: ShareProfileProps) {
  const share = useCallback(() => {
    if (navigator.canShare()) {
      navigator.share({
        url: `${process.env.BASE_URL}/app/profile/${profileId}`,
      });
    }
  }, [profileId]);
  return (
    <button type="button" className="btn btn-primary" onClick={share}>
      <i className="bi bi-share"></i>&nbsp;Share profile
    </button>
  );
}
