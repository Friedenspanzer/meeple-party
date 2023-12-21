import GameCollection, {
  GameInfo,
} from "@/components/GameCollection/GameCollection";
import GamePill from "@/components/GamePill/GamePill";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import { Game } from "@/datatypes/game";
import { UserProfile } from "@/datatypes/userProfile";
import { getTranslation } from "@/i18n";
import { Grid, GridCol, Stack, Text, Title } from "@mantine/core";

export interface UserProfilePageProps {
  user: UserProfile;
  isMe?: boolean;
  isFriend?: boolean;
  favorites?: Game[];
  collection?: GameInfo[];
}

export default async function UserProfilePage({
  user,
  isMe = false,
  isFriend = false,
  favorites = [],
  collection = [],
}: UserProfilePageProps) {
  const { t } = await getTranslation("profile");
  return (
    <Grid>
      <GridCol span={12}>
        <ProfileHeader user={user} friend={isFriend} myself={isMe} />
      </GridCol>
      <GridCol span={9}>
        {user.about && user.about.length > 0 && (
          <>
            <Title order={3}>{t("About", { name: user.name })}</Title>
            <Text>{user.about}</Text>
          </>
        )}
      </GridCol>
      <GridCol span={3}>
        {favorites.length > 0 && (
          <Stack align="flex-start">
            <Title order={3}>{t("FavoriteGames")}</Title>
            {favorites?.map((f) => (
              <GamePill gameId={f.id} key={f.id} />
            ))}
          </Stack>
        )}
      </GridCol>
      <GridCol span={12}>
        {collection.length > 0 && (
          <Stack>
            <Title order={3}>{t("UserCollection", { name: user.name })}</Title>
            <GameCollection games={collection} />
          </Stack>
        )}
      </GridCol>
    </Grid>
  );
}
