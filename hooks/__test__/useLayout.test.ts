import { useMediaQuery } from "@mantine/hooks";
import useLayout from "../useLayout";

jest.mock("@mantine/hooks");

describe("useLayout", () => {
  it("returns desktop", () => {
    const mediaQueryMock = jest.mocked(useMediaQuery).mockReturnValue(false);
    const result = useLayout();
    expect(result.isDesktop).toBeTruthy();
    expect(result.isMobile).toBeFalsy();
    expect(mediaQueryMock.mock.calls[0][0]).toBe("(max-width: 48em)");
  });
  it("returns mobile", () => {
    const mediaQueryMock = jest.mocked(useMediaQuery).mockReturnValue(true);
    const result = useLayout();
    expect(result.isDesktop).toBeFalsy();
    expect(result.isMobile).toBeTruthy();
    expect(mediaQueryMock.mock.calls[0][0]).toBe("(max-width: 48em)");
  });
});
