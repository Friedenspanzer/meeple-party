"use client";

import FriendRequestStatus from "@/components/FriendRequests/FriendRequestStatus/FriendRequestStatus";
import { UserProfile } from "@/datatypes/userProfile";
import useLayout from "@/hooks/useLayout";
import { useTranslation } from "@/i18n/client";
import { Group, MantineTheme, Stack } from "@mantine/core";
import { Role } from "@prisma/client";
import Avatar from "../../Avatar/Avatar";
import LinkButton from "../../LinkButton/LinkButton";
import { ProfileAdditionalInformation } from "../AdditionalInformation/ProfileAdditionalInformation";
import ProfileBadge from "../ProfileBadge/ProfileBadge";
import ProfileRealName from "../RealName/ProfileRealName";
import ShareProfile from "../ShareProfile/ShareProfile";
import ProfileUsername from "../Username/ProfileUsername";

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
        <ButtonBlock user={user} myself={myself} />
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
        <Stack>
          <ButtonBlock user={user} myself={myself} />
        </Stack>
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
  return (
    <>
      <ProfileUsername>{user.name}</ProfileUsername>
      {user.realName && <ProfileRealName>{user.realName}</ProfileRealName>}
      <ProfileAdditionalInformation
        place={user.place || undefined}
        bggName={user.bggName || undefined}
      />
    </>
  );
}

function ButtonBlock({ user, myself }: Readonly<ProfileHeaderProps>) {
  const { t } = useTranslation("profile");
  if (myself) {
    return (
      <>
        <ShareProfile profileId={user.id} />
        <LinkButton href="/app/profile/edit">{t("Edit")}</LinkButton>
      </>
    );
  } else {
    return <FriendRequestStatus userId={user.id} />;
  }
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
