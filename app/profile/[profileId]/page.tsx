import { generateMetadata as appGenerateMetaData } from "@/app/app/profile/[profileId]/page";
import PublicUserProfilePage from "@/components/pages/profile/PublicUserProfilePage";
import { prisma } from "@/db";
import { cleanUserDetails } from "@/pages/api/user";
import { isLoggedIn } from "@/utility/serverSession";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next/types";

export async function generateMetadata(params: {
  params: { profileId: string };
}): Promise<Metadata> {
  return appGenerateMetaData(params);
}

export default async function ProfilePage({
  params,
}: Readonly<{
  params: { profileId: string };
}>) {
  if (await isLoggedIn()) {
    redirect(`/app/profile/${params.profileId}`);
  } else {
    const user = await getUser(params.profileId);
    if (!user?.profileComplete) {
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
