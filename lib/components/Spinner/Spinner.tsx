import classNames from "classnames";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "small" | "normal";
}

const Spinner: React.FC<SpinnerProps> = ({ size = "normal", ...props }) => {
  return (
    <div
      className={classNames(props.className, {
        "spinner-border": true,
        "spinner-border-sm": size === "small",
      })}
    />
  );
};

export default Spinner;
