import { UserProfile } from "@/datatypes/userProfile";
import { Stack } from "@mantine/core";

export interface PublicUserProfilePageProps {
  user: UserProfile;
}

export default async function PublicUserProfilePage({
  user,
}: Readonly<PublicUserProfilePageProps>) {
  return (
    <Stack>
      <h2>{user.name}</h2>
    </Stack>
  );
}
