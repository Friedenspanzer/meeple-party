import LoginButton from "@/components/Auth/LoginButton/LoginButton";
import LinkButton from "@/components/LinkButton/LinkButton";
import Logo from "@/components/Logo/Logo";
import UserCard from "@/components/UserCard/UserCard";
import { UserProfile } from "@/datatypes/userProfile";
import { getTranslation } from "@/i18n";
import { Center, Group, Stack, Text, Title } from "@mantine/core";

export interface PublicUserProfilePageProps {
  user: UserProfile;
}

export default async function PublicUserProfilePage({
  user,
}: Readonly<PublicUserProfilePageProps>) {
  const { t } = await getTranslation("profile");
  return (
    <Center p="md">
      <Stack align="center">
        <Group>
          <Logo size="md" unstyled />
          <Title style={{ fontWeight: 300 }}>
            <Text inherit span fw={900}>
              {user.name}
            </Text>{" "}
            {t("Public.IsOn")}{" "}
            <Text
              inherit
              span
              fw={900}
              variant="gradient"
              gradient={{ from: "murple", to: "mink", deg: 120 }}
            >
              Meeple Party
            </Text>
          </Title>
        </Group>
        <UserCard user={user} />
        <Text>{t("Public.CallToAction")}</Text>
        <Group>
          <LoginButton />
          <LinkButton href="/" variant="light">
            {t("Public.KnowMore")}
          </LinkButton>
        </Group>
      </Stack>
    </Center>
  );
}
