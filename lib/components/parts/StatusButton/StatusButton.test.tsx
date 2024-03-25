import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StatusButton from "./StatusButton";

jest.mock("@/i18n/client");
jest.mock("@/hooks/api/useCollectionStatus");

describe("Status Button", () => {
  test.each(["own", "wanttoplay", "wishlist"])(
    "matches snapshot for %s when active",
    async (status) => {
      const { container } = render(
        <StatusButton status={status as any} active={true} />
      );
      expect(container).toMatchSnapshot();
    }
  );
  test.each(["own", "wanttoplay", "wishlist"])(
    "matches snapshot for %s when not active",
    async (status) => {
      const { container } = render(
        <StatusButton status={status as any} active={false} />
      );
      expect(container).toMatchSnapshot();
    }
  );
  it("matches snapshot when loading", async () => {
    const { container } = render(
      <StatusButton status="own" active={false} loading={true} />
    );
    expect(container).toMatchSnapshot();
  });
  it("passes class names to container", async () => {
    const { container } = render(
      <StatusButton status="own" active={true} className="passed class names" />
    );
    expect(container).toMatchSnapshot();
  });
  it("passes styles to container", async () => {
    const { container } = render(
      <StatusButton
        status="own"
        active={true}
        style={{ width: "100%", alignSelf: "end", marginBlockStart: "1em" }}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("calls callback on clicking button", async () => {
    const user = userEvent.setup();
    let called = false;
    const callback = () => {
      called = true;
    };
    render(<StatusButton status="own" active={false} clicked={callback} />);
    const button = screen.getByRole("button");
    await user.click(button);
    expect(called).toBeTruthy();
  });
  it("calls callback on key press", async () => {
    const user = userEvent.setup();
    let called = false;
    const callback = () => {
      called = true;
    };
    render(<StatusButton status="own" active={false} clicked={callback} />);
    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("[Enter]");
    expect(called).toBeTruthy();
  });
});
