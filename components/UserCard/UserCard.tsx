"use client";

import { UserProfile } from "@/datatypes/userProfile";
import { useTranslation } from "@/i18n/client";
import { MantineTheme, Stack, Text, Title } from "@mantine/core";
import { Role } from "@prisma/client";
import Avatar from "../Avatar/Avatar";
import ProfileBadge from "../ProfileBadge/ProfileBadge";

export interface UserCardProps {
  user: UserProfile;
}

export default function UserCard({ user }: UserCardProps) {
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
      <Title order={2} style={{ fontWeight: 500 }}>
        {user.name}
      </Title>
      {user.realName && (
        <Title order={3} style={{ fontWeight: 200 }}>
          {user.realName}
        </Title>
      )}
      {user.bggName && (
        <Text style={{ fontWeight: 200 }}>
          {t("Header.BggName", { name: user.bggName })}
        </Text>
      )}
      {user.place && (
        <Text style={{ fontWeight: 200 }}>
          {t("Header.Place", { place: user.place })}
        </Text>
      )}
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
