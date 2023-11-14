import classnames from "classnames";
import Avatar from "../Avatar/Avatar";
import styles from "./avatarstack.module.css";

interface AvatarStackProps {
  avatars: { id: any; image: string | null; name: string }[];
  max?: number;
  orientation?: "horizontal" | "vertical";
  distance?: "sm" | "md";
}
export default function AvatarStack({
  avatars,
  max,
  orientation = "horizontal",
  distance = "md",
}: AvatarStackProps) {
  const effectiveMax = max ?? avatars.length;
  const additional = avatars.length - effectiveMax;
  return (
    <div
      className={classnames(styles.container, {
        [styles.vertical]: orientation === "vertical",
        [styles.sm]: distance === "sm",
      })}
    >
      {additional > 0 && <div className={styles.additional}>+{additional}</div>}
      {avatars
        .toReversed()
        .slice(0, effectiveMax)
        .map((a) => (
          <Avatar
            key={a.id}
            name={a.name}
            image={a.image}
            className={classnames(styles.avatar, {
              [styles.vertical]: orientation === "vertical",
            })}
          />
        ))}
    </div>
  );
}
