import {
  NavigationBar,
  NavigationItem,
} from "@/components/NavigationBar/NavigationBar";
import { getTranslation } from "@/i18n";

interface CollectionLayoutProps {
  children: React.ReactNode;
}
const ProfileEditLayout = async ({ children }: CollectionLayoutProps) => {
  const { t } = await getTranslation("settings");
  return (
    <>
      <NavigationBar>
        <NavigationItem href="/app/profile/edit">{t("Navigation.Profile")}</NavigationItem>
        <NavigationItem href="/app/profile/edit/settings">{t("Navigation.Settings")}</NavigationItem>
        <NavigationItem href="/app/profile/edit/avatar">{t("Navigation.Avatar")}</NavigationItem>
        <NavigationItem href="/app/profile/edit/privacy">{t("Navigation.Privacy")}</NavigationItem>
      </NavigationBar>
      {children}
    </>
  );
};

export default ProfileEditLayout;
