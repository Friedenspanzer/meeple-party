import useCollectionStatus from "@/hooks/api/useCollectionStatus";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { generateBoolean } from "../../utility/test";
import StatusButton from "./StatusButton";

jest.mock("@/i18n/client");
jest.mock("@/hooks/api/useCollectionStatus");

describe("Status Button", () => {
  test.each(["own", "wanttoplay", "wishlist"])(
    "matches snapshot for %s on true",
    async (status) => {
      jest.mocked(useCollectionStatus).mockReturnValue({
        invalidate: () => {},
        isError: false,
        isLoading: false,
        mutate: () => {},
        data: {
          gameId: 123,
          own: true,
          userId: "abc123",
          wantToPlay: true,
          wishlist: true,
          updatedAt: null,
        },
      });
      const { container } = render(
        <StatusButton gameId={123} status={status as any} />
      );
      expect(container).toMatchSnapshot();
    }
  );
  test.each(["own", "wanttoplay", "wishlist"])(
    "matches snapshot for %s on false",
    async (status) => {
      jest.mocked(useCollectionStatus).mockReturnValue({
        invalidate: () => {},
        isError: false,
        isLoading: false,
        mutate: () => {},
        data: {
          gameId: 123,
          own: false,
          userId: "abc123",
          wantToPlay: false,
          wishlist: false,
          updatedAt: null,
        },
      });
      const { container } = render(
        <StatusButton gameId={123} status={status as any} />
      );
      expect(container).toMatchSnapshot();
    }
  );
  it("matches snapshot when loading", async () => {
    jest.mocked(useCollectionStatus).mockReturnValue({
      invalidate: () => {},
      isError: false,
      isLoading: true,
      mutate: () => {},
      data: {
        gameId: 123,
        own: false,
        userId: "abc123",
        wantToPlay: false,
        wishlist: false,
        updatedAt: null,
      },
    });
    const { container } = render(<StatusButton gameId={123} status="own" />);
    expect(container).toMatchSnapshot();
  });
  it("passes class names to container", async () => {
    jest.mocked(useCollectionStatus).mockReturnValue({
      invalidate: () => {},
      isError: false,
      isLoading: false,
      mutate: () => {},
      data: {
        gameId: 123,
        own: false,
        userId: "abc123",
        wantToPlay: false,
        wishlist: false,
        updatedAt: null,
      },
    });
    const { container } = render(
      <StatusButton gameId={123} status="own" className="passed class names" />
    );
    expect(container).toMatchSnapshot();
  });
  it("passes styles to container", async () => {
    jest.mocked(useCollectionStatus).mockReturnValue({
      invalidate: () => {},
      isError: false,
      isLoading: false,
      mutate: () => {},
      data: {
        gameId: 123,
        own: false,
        userId: "abc123",
        wantToPlay: false,
        wishlist: false,
        updatedAt: null,
      },
    });
    const { container } = render(
      <StatusButton
        gameId={123}
        status="own"
        style={{ width: "100%", alignSelf: "end", marginBlockStart: "1em" }}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("updates owned status when clicking button", async () => {
    const user = userEvent.setup();
    const expectedStatus = generateBoolean();
    let actualStatus = null;
    jest.mocked(useCollectionStatus).mockReturnValue({
      invalidate: () => {},
      isError: false,
      isLoading: false,
      mutate: (data) => {
        actualStatus = data.own;
      },
      data: {
        gameId: 123,
        own: !expectedStatus,
        userId: "abc123",
        wantToPlay: generateBoolean(),
        wishlist: generateBoolean(),
        updatedAt: null,
      },
    });
    render(<StatusButton gameId={123} status="own" />);
    const button = screen.getByRole("button");
    await user.click(button);
    expect(actualStatus).toEqual(expectedStatus);
  });
  it("updates want to play status when clicking button", async () => {
    const user = userEvent.setup();
    const expectedStatus = generateBoolean();
    let actualStatus = null;
    jest.mocked(useCollectionStatus).mockReturnValue({
      invalidate: () => {},
      isError: false,
      isLoading: false,
      mutate: (data) => {
        actualStatus = data.wantToPlay;
      },
      data: {
        gameId: 123,
        own: generateBoolean(),
        userId: "abc123",
        wantToPlay: !expectedStatus,
        wishlist: generateBoolean(),
        updatedAt: null,
      },
    });
    render(<StatusButton gameId={123} status="wanttoplay" />);
    const button = screen.getByRole("button");
    await user.click(button);
    expect(actualStatus).toEqual(expectedStatus);
  });
  it("updates wishlist status when clicking button", async () => {
    const user = userEvent.setup();
    const expectedStatus = generateBoolean();
    let actualStatus = null;
    jest.mocked(useCollectionStatus).mockReturnValue({
      invalidate: () => {},
      isError: false,
      isLoading: false,
      mutate: (data) => {
        actualStatus = data.wishlist;
      },
      data: {
        gameId: 123,
        own: generateBoolean(),
        userId: "abc123",
        wantToPlay: generateBoolean(),
        wishlist: !expectedStatus,
        updatedAt: null,
      },
    });
    render(<StatusButton gameId={123} status="wishlist" />);
    const button = screen.getByRole("button");
    await user.click(button);
    expect(actualStatus).toEqual(expectedStatus);
  });
  it("updates status on key press", async () => {
    const user = userEvent.setup();
    const expectedStatus = generateBoolean();
    let actualStatus = null;
    jest.mocked(useCollectionStatus).mockReturnValue({
      invalidate: () => {},
      isError: false,
      isLoading: false,
      mutate: (data) => {
        actualStatus = data.wishlist;
      },
      data: {
        gameId: 123,
        own: generateBoolean(),
        userId: "abc123",
        wantToPlay: generateBoolean(),
        wishlist: !expectedStatus,
        updatedAt: null,
      },
    });
    render(<StatusButton gameId={123} status="wishlist" />);
    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("[Enter]");
    expect(actualStatus).toEqual(expectedStatus);
  });
});
