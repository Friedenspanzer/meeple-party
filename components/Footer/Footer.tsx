import { getTranslation } from "@/i18n";
import Link from "next/link";
import styles from "./footer.module.css";

export default async function Footer() {
  const { t } = await getTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.stack}>
        {" "}
        <ul className={styles.social}>
          <li>
            <Link href="mailto:contact@meeple.party" title="E-Mail">
              <i className="bi bi-envelope-fill"></i>
            </Link>
          </li>
          <li>
            <Link
              href="https://brettspiel.space/@meepleparty"
              title="Mastodon"
              rel="me"
            >
              <i className="bi bi-mastodon"></i>
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/Friedenspanzer/meeple-party/"
              title="Github"
            >
              <i className="bi bi-github"></i>
            </Link>
          </li>
          <li>
            <Link href="https://discord.gg/x9R46w4SME" title="Discord">
              <i className="bi bi-discord"></i>
            </Link>
          </li>
        </ul>
      </div>
      <div className={styles.stack}>
        <strong>Meeple Party</strong>
        <small>Pascal Greilach</small>
        <small>2023</small>
      </div>
      <div className={styles.stack}>
        <Link
          href="https://github.com/Friedenspanzer/meeple-party/issues"
          target="_blank"
        >
          {t("Footer.Issues")}{" "}
        </Link>
        <Link href="/changelog">{t("Footer.LatestChanges")}</Link>
      </div>
    </div>
  );
}
