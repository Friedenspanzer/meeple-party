"use client";

import { RelationshipType } from "@/datatypes/relationship";
import FriendRequest from "@/feature/relationships/components/FriendRequest/FriendRequest";
import useRelationships from "@/feature/relationships/hooks/useRelationships";
import { useTranslation } from "@/i18n/client";
import { Container, Stack, Title } from "@mantine/core";

const FriendRequests: React.FC = () => {
  const { data: relationships } = useRelationships();
  const { t } = useTranslation("friends");

  const incoming =
    relationships?.filter(
      (r) => r.type === RelationshipType.FRIEND_REQUEST_RECEIVED
    ) || [];
  const sent =
    relationships?.filter(
      (r) => r.type === RelationshipType.FRIEND_REQUEST_SENT
    ) || [];

  return (
    <Container size="sm">
      <Stack>
        {incoming.length > 0 && (
          <Stack>
            <Title order={2}>{t("Requests.Incoming")}</Title>
            {incoming.map((r) => (
              <FriendRequest friendRequest={r} key={r.profile.id} />
            ))}
          </Stack>
        )}
        {sent.length > 0 && (
          <Stack>
            <Title order={2}>{t("Requests.Outgoing")}</Title>
            {sent.map((r) => (
              <FriendRequest friendRequest={r} key={r.profile.id} />
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default FriendRequests;
