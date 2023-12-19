import { getTranslation } from "@/i18n";
import {
  Center,
  Container,
  List,
  ListItem,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";

export default async function NotFound() {
  const { t } = await getTranslation("404");
  return (
    <Center>
      <Container size="xs" mt="lg">
        <Stack>
          <Title order={1}>{t("Heading")}</Title>
          <Text>{t("Explanation")}</Text>
          <List>
            <ListItem>
              {t("NotLoggedIn.Start")}
              <Link href="/auth/signin">{t("NotLoggedIn.Link")}</Link>
              {t("NotLoggedIn.End")}
            </ListItem>
            <ListItem>{t("InvalidLink")}</ListItem>
            <ListItem>{t("Broken")}</ListItem>
          </List>
        </Stack>
      </Container>
    </Center>
  );
}
