import FriendRequestsBadge from "@/feature/relationships/components/FriendRequestsBadge/FriendRequestsBadge";
import { getTranslation } from "@/i18n";
import {
  NavigationBar,
  NavigationItem,
} from "@/lib/components/NavigationBar/NavigationBar";

const Navbar: React.FC = async () => {
  const { t } = await getTranslation("friends");
  return (
    <NavigationBar>
      <NavigationItem href="/app/friends">
        {t("Navbar.Activity")}
      </NavigationItem>
      <NavigationItem href="/app/friends/requests">
        {t("Navbar.Requests")} &nbsp;
        <FriendRequestsBadge />
      </NavigationItem>
    </NavigationBar>
  );
};

export default Navbar;
