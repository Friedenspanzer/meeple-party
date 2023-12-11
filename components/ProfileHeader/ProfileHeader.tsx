"use client";

import { UserProfile } from "@/datatypes/userProfile";
import { useTranslation } from "@/i18n/client";
import { Group, Stack, Text, Title } from "@mantine/core";
import { Role } from "@prisma/client";
import Avatar from "../Avatar/Avatar";
import LinkButton from "../LinkButton/LinkButton";
import ProfileBadge from "../ProfileBadge/ProfileBadge";
import ShareProfile from "../ShareProfile/ShareProfile";
import styles from "./ProfileHeader.module.css";

export interface ProfileHeaderProps {
  user: UserProfile;
  myself?: boolean;
  friend?: boolean;
}

export default function ProfileHeader({
  user,
  myself = false,
  friend = false,
}: Readonly<ProfileHeaderProps>) {
  const { t } = useTranslation("profile");
  return (
    <Group justify="space-between">
      <Group gap="xl">
        <Stack gap="xs" align="center">
          <Avatar name={user.name || ""} image={user.image} />
          {getRoleBadge(user.role)}
          {myself && <ProfileBadge type="me" />}
          {friend && <ProfileBadge type="friend" />}
        </Stack>
        <Stack gap="xs">
          <Title order={2} className={styles.name}>
            {user.name}
          </Title>
          <Title order={3} className={styles.realName}>
            {user.realName}
          </Title>
          <Text className={styles.subline}>
            {t("Header.BggName", { name: user.bggName })}
          </Text>
        </Stack>
      </Group>
      {myself && (
        <Stack>
          <ShareProfile profileId={user.id} />
          <LinkButton href="/app/profile/edit">{t("Edit")}</LinkButton>
        </Stack>
      )}
    </Group>
  );
}

function getRoleBadge(role: Role) {
  switch (role) {
    case "ADMIN":
      return <ProfileBadge type="admin" />;
    case "FRIENDS_FAMILY":
      return <ProfileBadge type="family" />;
    case "PREMIUM":
      return <ProfileBadge type="premium" />;
    case "USER":
      return <ProfileBadge type="user" />;
  }
}
