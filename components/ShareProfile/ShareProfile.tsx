"use client";

import { useTranslation } from "@/i18n/client";
import { Button, Group } from "@mantine/core";
import { IconShare2 } from "@tabler/icons-react";
import { useCallback } from "react";

export interface ShareProfileProps {
  profileId: string;
}

export default function ShareProfile({ profileId }: ShareProfileProps) {
  const { t } = useTranslation("profile");
  const share = useCallback(() => {
    const shareData: ShareData = {
      url: `${process.env.BASE_URL}/app/profile/${profileId}`
    };
    if (navigator.canShare(shareData)) {
      navigator.share(shareData);
    }
  }, [profileId]);
  return (
    <Group>
      <Button variant="filled" onClick={share} leftSection={<IconShare2 />}>
        {t("Share")}
      </Button>
    </Group>
  );
}
