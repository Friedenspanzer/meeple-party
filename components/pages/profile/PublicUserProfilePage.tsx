import UserCard from "@/components/UserCard/UserCard";
import { UserProfile } from "@/datatypes/userProfile";

export interface PublicUserProfilePageProps {
  user: UserProfile;
}

export default async function PublicUserProfilePage({
  user,
}: Readonly<PublicUserProfilePageProps>) {
  return <UserCard user={user} />;
}
