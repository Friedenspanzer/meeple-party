import { generateString } from "@/utility/test";
import useBasePath from "../useBasePath";

describe("useBasePath", () => {
  const env = process.env;
  afterEach(() => {
    jest.restoreAllMocks();
    process.env = env;
  });
  it("reads from window when environment variable is unavailable", () => {
    const expectedBasePath = generateString();

    jest
      .spyOn(window, "location", "get")
      .mockReturnValue({ origin: expectedBasePath } as any);

    const actualBasePath = useBasePath();

    expect(actualBasePath).toBe(expectedBasePath);
  });
  it("returns environment variable when available", () => {
    const expectedBasePath = generateString();
    process.env.BASE_URL = expectedBasePath;

    const actualBasePath = useBasePath();

    expect(actualBasePath).toBe(expectedBasePath);
  });
});
