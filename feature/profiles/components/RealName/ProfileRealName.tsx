import { Title } from "@mantine/core";
import { PropsWithChildren } from "react";

export default function ProfileRealName({
  children,
}: Readonly<PropsWithChildren<{}>>) {
  return (
    <Title order={3} style={{ fontWeight: 200 }}>
      {children}
    </Title>
  );
}
