"use client";

import { UserProfile } from "@/datatypes/userProfile";
import useLayout from "@/hooks/useLayout";
import { useTranslation } from "@/i18n/client";
import { Group, MantineTheme, Stack, Text, Title } from "@mantine/core";
import { Role } from "@prisma/client";
import Avatar from "../Avatar/Avatar";
import LinkButton from "../LinkButton/LinkButton";
import ProfileUsername from "../Profile/Username/ProfileUsername";
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
  const { isMobile } = useLayout();
  const containerStyle = (theme: MantineTheme) => ({
    backgroundColor: theme.colors[theme.primaryColor][2],
  });
  if (isMobile) {
    return (
      <Stack align="center" style={containerStyle} p="md">
        <AvatarBlock user={user} myself={myself} friend={friend} />
        <NameBlock user={user} />
        <ButtonBlock user={user} />
      </Stack>
    );
  } else {
    return (
      <Group justify="space-between" style={containerStyle} p="md">
        <Group gap="xl">
          <Stack gap="xs" align="center">
            <AvatarBlock user={user} myself={myself} friend={friend} />
          </Stack>
          <Stack gap="xs">
            <NameBlock user={user} />
          </Stack>
        </Group>
        {myself && (
          <Stack>
            <ButtonBlock user={user} />
          </Stack>
        )}
      </Group>
    );
  }
}

function AvatarBlock({ user, myself, friend }: Readonly<ProfileHeaderProps>) {
  return (
    <>
      <Avatar name={user.name || ""} image={user.image} />
      {getRoleBadge(user.role)}
      {myself && <ProfileBadge type="me" />}
      {friend && <ProfileBadge type="friend" />}
    </>
  );
}

function NameBlock({ user }: Readonly<Pick<ProfileHeaderProps, "user">>) {
  const { t } = useTranslation("profile");
  return (
    <>
      <ProfileUsername>{user.name}</ProfileUsername>
      <Title order={3} className={styles.realName}>
        {user.realName}
      </Title>
      {user.bggName && (
        <Text className={styles.subline}>
          {t("Header.BggName", { name: user.bggName })}
        </Text>
      )}
    </>
  );
}

function ButtonBlock({ user }: Readonly<Pick<ProfileHeaderProps, "user">>) {
  const { t } = useTranslation("profile");
  return (
    <>
      <ShareProfile profileId={user.id} />
      <LinkButton href="/app/profile/edit">{t("Edit")}</LinkButton>
    </>
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
