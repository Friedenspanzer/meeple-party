import { UserProfile } from "@/datatypes/userProfile";

export interface PublicUserProfilePageProps {
  user: UserProfile;
}

export default async function PublicUserProfilePage({
  user,
}: Readonly<PublicUserProfilePageProps>) {
  return <>{JSON.stringify(user)}</>;
}
