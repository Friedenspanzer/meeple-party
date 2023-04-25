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
        <NavigationItem href="/app/collection">Your collection</NavigationItem>
        <NavigationItem href="/app/collection/search">Search</NavigationItem>
        <NavigationItem href="/app/collection/import">
          Import from BoardGameGeek
        </NavigationItem>
      </NavigationBar>
      {children}
    </>
  );
};

export default CollectionLayout;
