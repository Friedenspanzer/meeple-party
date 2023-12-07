"use client";

import { Button, Group } from "@mantine/core";
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
    <Group>
      <Button variant="filled" onClick={share}>
        Button
      </Button>
    </Group>
  );
}
