import {
  NavigationBar,
  NavigationItem,
} from "@/components/NavigationBar/NavigationBar";
import FriendRequestsBadge from "@/components/FriendRequestsBadge/FriendRequestsBadge";

const Navbar: React.FC = () => {
  return (
    <NavigationBar>
      <NavigationItem href="/app/friends">Activity</NavigationItem>
      <NavigationItem href="/app/friends/requests">
        Your requests &nbsp;
        <FriendRequestsBadge />
      </NavigationItem>
    </NavigationBar>
  );
};

export default Navbar;
