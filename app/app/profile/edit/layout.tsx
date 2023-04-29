import { NavigationBar, NavigationItem } from "@/components/NavigationBar/NavigationBar";

interface CollectionLayoutProps {
  children: React.ReactNode;
}
const ProfileEditLayout: React.FC<CollectionLayoutProps> = ({ children }) => {
  return (
    <>
      <NavigationBar>
        <NavigationItem href="/app/profile/edit">Profile</NavigationItem>
        <NavigationItem href="/app/profile/edit/privacy">Privacy</NavigationItem>
      </NavigationBar>
      {children}
    </>
  );
};

export default ProfileEditLayout;
