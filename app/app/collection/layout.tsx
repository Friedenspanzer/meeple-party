import {
  NavigationBar,
  NavigationItem,
} from "@/components/NavigationBar/NavigationBar";

interface CollectionLayoutProps {
  children: React.ReactNode;
}
const CollectionLayout: React.FC<CollectionLayoutProps> = ({ children }) => {
  return (
    <>
      <NavigationBar>
        <NavigationItem href="/app/collection">Owned</NavigationItem>
        <NavigationItem href="/app/collection/wishlist">Wishlist</NavigationItem>
        <NavigationItem href="/app/collection/wanttoplay">Want To Play</NavigationItem>
        <NavigationItem href="/app/collection/import">Import from BoardGameGeek</NavigationItem>
      </NavigationBar>
      {children}
    </>
  );
};

export default CollectionLayout;
