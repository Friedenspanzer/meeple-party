import PublicUserProfilePage from "@/components/pages/profile/PublicUserProfilePage";
import { prisma } from "@/db";
import { cleanUserDetails } from "@/pages/api/user";
import { isLoggedIn } from "@/utility/serverSession";
import { Relationship, User } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next/types";

export async function generateMetadata({
  params,
}: {
  params: { profileId: string };
}): Promise<Metadata> {
  const user = await getUser(params.profileId);
  if (!user || !user.profileComplete) {
    notFound();
  }
  return {
    title: user.name,
  };
}

type UserWithRelationships = User & {
  sentRelationships: Relationship[];
  receivedRelationships: Relationship[];
};

export default async function ProfilePage({
  params,
}: {
  params: { profileId: string };
}) {
  if (await isLoggedIn()) {
    redirect(`/app/profile/${params.profileId}`);
  } else {
    const user = await getUser(params.profileId);
    if (!user || !user.profileComplete) {
      notFound();
    }
    return <PublicUserProfilePage user={user} />;
  }
}

const getUser = async (id: string) => {
  const userData = await prisma.user.findUnique({
    where: { id },
  });

  if (userData) {
    return cleanUserDetails(userData);
  } else {
    return null;
  }
};
