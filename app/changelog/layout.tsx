import Logo from "@/components/Logo/Logo";
import { getTranslation } from "@/i18n";
import Link from "next/link";
import styles from "./changelog.module.css";

export const metadata = {
  title: "Changelog",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = await getTranslation("changelog");
  return (
    <div className="container mb-5">
      <div className="row align-items-center">
        <div className="col-2">
          <Logo size="md" />
        </div>
        <div className="col">
          <h1 className="display-2">{t("Title")}</h1>
          <Link href="/" className={styles.link}>
            <i className="bi bi-arrow-left"></i> {t("Back")}
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
