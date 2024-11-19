"use client";

import { useTranslation } from "@/i18n/client";
import Logo from "@/lib/components/Logo/Logo";
import IconBoardGameGeek from "@/lib/icons/BoardGameGeek/BoardGameGeek";
import { Divider, Group, Stack, Text, Title } from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandMastodon,
  IconMail
} from "@tabler/icons-react";
import Link from "next/link";
import styles from "./footer.module.css";

const ICON_SIZE = 20;

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className={styles.container}>
      <Stack className={styles.stack} gap="sm">
        <Group align="flex-start" justify="space-between">
          <Stack>
            <Group gap="xs" align="center">
              <Logo size="sm" unstyled />
              <Text
                fw={900}
                variant="gradient"
                gradient={{ from: "murple", to: "mink", deg: 120 }}
                size="xl"
              >
                Meeple Party
              </Text>
            </Group>
            <Text size="xs">
              {t("Footer.Data")} <IconBoardGameGeek height={16} />
              BoardGameGeek.
            </Text>
          </Stack>
          <Group gap="xl" align="flex-start">
            <Stack className={styles.links}>
              <Title order={4}>{t("Footer.Development.Header")}</Title>
              <Link
                href="https://github.com/Friedenspanzer/meeple-party/issues"
                target="_blank"
              >
                {t("Footer.Development.Issues")}
              </Link>
              <Link href="/changelog">
                {t("Footer.Development.LatestChanges")}
              </Link>
            </Stack>
            <Stack className={styles.links}>
              <Title order={4}>{t("Footer.Community.Header")}</Title>
              <Link
                href="https://brettspiel.space/@meepleparty"
                title="Mastodon"
                rel="me"
              >
                {t("Footer.Community.Mastodon")}
              </Link>
              <Link
                href="https://github.com/Friedenspanzer/meeple-party/"
                title="Github"
              >
                {t("Footer.Community.Github")}
              </Link>
            </Stack>
          </Group>
        </Group>
        <Divider my="sm" />
        <Group align="center" justify="space-between">
          <Text c="dimmed" size="sm">
            <Link href="https://greilach.dev">Pascal Greilach</Link>, 2023
          </Text>
          <div>
            <ul className={styles.social}>
              <li>
                <Link href="mailto:contact@meeple.party" title="E-Mail">
                  <IconMail size={ICON_SIZE} />
                </Link>
              </li>
              <li>
                <Link
                  href="https://brettspiel.space/@meepleparty"
                  title="Mastodon"
                  rel="me"
                >
                  <IconBrandMastodon size={ICON_SIZE} />
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/Friedenspanzer/meeple-party/"
                  title="Github"
                >
                  <IconBrandGithub size={ICON_SIZE} />
                </Link>
              </li>
            </ul>
          </div>
        </Group>
      </Stack>
    </footer>
  );
}
