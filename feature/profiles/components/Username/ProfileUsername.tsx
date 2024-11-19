import { Title } from "@mantine/core";
import { PropsWithChildren } from "react";

export default function ProfileUsername({
  children,
}: Readonly<PropsWithChildren<{}>>) {
  return (
    <Title order={2} style={{ fontWeight: 500 }}>
      {children}
    </Title>
  );
}
