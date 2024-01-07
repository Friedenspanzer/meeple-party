"use client";

import { UserProfile } from "@/datatypes/userProfile";
import { useTranslation } from "@/i18n/client";
import { MantineTheme, Stack } from "@mantine/core";
import { Role } from "@prisma/client";
import Avatar from "../Avatar/Avatar";
import { ProfileAdditionalInformation } from "../Profile/AdditionalInformation/ProfileAdditionalInformation";
import ProfileUsername from "../Profile/Username/ProfileUsername";
import ProfileBadge from "../ProfileBadge/ProfileBadge";

export interface UserCardProps {
  user: UserProfile;
}

export default function UserCard({ user }: Readonly<UserCardProps>) {
  const { t } = useTranslation("profile");
  return (
    <Stack
      p="md"
      gap="sm"
      align="center"
      w={{ base: "95vw", md: 300 }}
      style={(theme: MantineTheme) => ({
        backgroundColor: theme.colors[theme.primaryColor][2],
      })}
    >
      <Avatar image={user.image} name={user.name || ""} />
      {getRoleBadge(user.role)}
      <ProfileUsername>{user.name}</ProfileUsername>
      <ProfileAdditionalInformation
        place={user.place || undefined}
        bggName={user.bggName || undefined}
      />
    </Stack>
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
