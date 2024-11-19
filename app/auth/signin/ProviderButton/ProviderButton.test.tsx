import { generateString, render } from "@/lib/utility/test";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientSafeProvider, signIn } from "next-auth/react";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import ProviderButton from "./ProviderButton";

jest.mock("@/i18n/client");
jest.mock("next-auth/react");

describe("Link button", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("matches snapshot", () => {
    const provider: ClientSafeProvider = {
      id: "id",
      name: "test provider",
      type: "credentials",
      signinUrl: "https://example.com/signin-url",
      callbackUrl: "https://example.com/callback-url",
    };
    const { container } = render(<ProviderButton provider={provider} />);
    expect(container).toMatchSnapshot();
  });
  test.each(["google", "github", "discord", "twitch"])(
    "matches snapshot for provider %s",
    (providerType) => {
      const provider: ClientSafeProvider = {
        id: providerType,
        name: "test provider",
        type: "oauth",
        signinUrl: "https://example.com/signin-url",
        callbackUrl: "https://example.com/callback-url",
      };
      const { container } = render(<ProviderButton provider={provider} />);
      expect(container).toMatchSnapshot();
    }
  );
  it("calls signIn", async () => {
    const user = userEvent.setup();

    const provider: ClientSafeProvider = {
      id: generateString(),
      name: generateString(),
      type: "credentials",
      signinUrl: "https://example.com/signin-url",
      callbackUrl: "https://example.com/callback-url",
    };
    const signInMock = jest.mocked(signIn).mockRejectedValue("");

    render(<ProviderButton provider={provider} />);
    const button = screen.getByRole("button");

    await user.click(button);

    expect(signInMock.mock.calls.length).toBe(1);
    expect(signInMock.mock.calls[0][0]).toBe(provider.id);
    expect(signInMock.mock.calls[0][1]).toEqual({
      callbackUrl: undefined,
    });
  });
  it("passes callback URL to signIn", async () => {
    const user = userEvent.setup();

    const provider: ClientSafeProvider = {
      id: generateString(),
      name: generateString(),
      type: "credentials",
      signinUrl: "https://example.com/signin-url",
      callbackUrl: "https://example.com/callback-url",
    };
    const callbackUrl = generateString();
    const signInMock = jest.mocked(signIn).mockRejectedValue("");
    const searchParams = new URLSearchParams();
    searchParams.append("callbackUrl", callbackUrl);

    render(
      <SearchParamsContext.Provider value={searchParams}>
        <ProviderButton provider={provider} />
      </SearchParamsContext.Provider>
    );
    const button = screen.getByRole("button");

    await user.click(button);

    expect(signInMock.mock.calls.length).toBe(1);
    expect(signInMock.mock.calls[0][0]).toBe(provider.id);
    expect(signInMock.mock.calls[0][1]).toEqual({
      callbackUrl,
    });
  });
});
