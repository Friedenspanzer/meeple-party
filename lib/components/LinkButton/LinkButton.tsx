import { Button, ButtonProps } from "@mantine/core";
import Link from "next/link";
import { PropsWithChildren } from "react";

export interface LinkButtonProps extends ButtonProps {
  href: string;
}

export default function LinkButton({
  href,
  children,
  ...props
}: Readonly<PropsWithChildren<LinkButtonProps>>) {
  return (
    <Button {...props} component={Link} href={href}>
      {children}
    </Button>
  );
}
