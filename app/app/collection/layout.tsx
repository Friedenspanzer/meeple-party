import {
  NavigationBar,
  NavigationItem,
} from "@/components/NavigationBar/NavigationBar";
import { getTranslation } from "@/i18n";

export default async function Layout({
  children,
}: React.PropsWithChildren<{}>) {
  const { t } = await getTranslation("collection");
  return (
    <>
      <NavigationBar>
        <NavigationItem href="/app/collection">
          {t("Navbar.YourCollection")}
        </NavigationItem>
        <NavigationItem href="/app/collection/search">
          {t("Navbar.Search")}
        </NavigationItem>
        <NavigationItem href="/app/collection/import">
          {t("Navbar.Import")}
        </NavigationItem>
      </NavigationBar>
      {children}
    </>
  );
}
