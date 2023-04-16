import { Relationship } from "@/datatypes/relationship";
import classNames from "classnames";
import ReactTimeAgo from "react-time-ago";
import Avatar from "../Avatar/Avatar";
import styles from "./friendrequest.module.css";

export interface GenericFriendRequestProps
  extends React.HTMLAttributes<HTMLDivElement> {
  request: Relationship;
  stale: boolean;
  children: React.ReactNode;
}

const GenericFriendRequest: React.FC<GenericFriendRequestProps> = ({
  request,
  stale,
  children,
  className,
  ...props
}) => {
  const { profile, lastUpdate } = request;
  return (
    <div
      {...props}
      className={classNames(
        className,
        "row align-items-center gy-2 gy-md-0",
        styles.friendRequest,
        {
          [styles.stale]: stale,
        }
      )}
    >
      <div className={classNames(styles.content, "col-md-7")}>
        <div className={styles.image}>
          <Avatar image={profile.image} name={profile.name ?? ""} />
        </div>
        <div className={styles.name}>
          {profile.name}
          {"realName" in profile && <small>{profile.realName}</small>}
        </div>
        <div className={styles.meta}>
          <ReactTimeAgo date={lastUpdate} />
        </div>
      </div>
      <div className={classNames("col-md-5", styles.actionButtons)}>
        {children}
      </div>
    </div>
  );
};

export default GenericFriendRequest;
