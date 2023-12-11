import { useMediaQuery } from "@mantine/hooks";

export interface UseLayoutResult {
  isMobile: boolean;
  isDesktop: boolean;
}

export default function useLayout() {
  const mobile = useMediaQuery("(max-width: 48em)");
  return { isMobile: !!mobile, isDesktop: !mobile };
}
