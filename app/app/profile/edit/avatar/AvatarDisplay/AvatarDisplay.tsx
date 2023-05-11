"use client";

import Avatar from "@/components/Avatar/Avatar";
import Spinner from "@/components/Spinner/Spinner";
import { useUser } from "@/context/userContext";

const AvatarDisplay: React.FC = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Avatar name={user?.name || ""} image={user?.image} />
    </>
  );
};

export default AvatarDisplay;
