import { Relationship } from "@/datatypes/relationship";
import classNames from "classnames";
import Link from "next/link";
import ReactTimeAgo from "react-time-ago";
import Avatar from "../Avatar/Avatar";
import styles from "./friendrequest.module.css";

export interface GenericFriendRequestProps
  extends React.HTMLAttributes<HTMLDivElement> {
  request: Relationship;
  children: React.ReactNode;
}

const GenericFriendRequest: React.FC<GenericFriendRequestProps> = ({
  request,
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
        styles.friendRequest
      )}
    >
      <div className={classNames(styles.content, "col-md-7")}>
        <div className={styles.image}>
          <Link href={`/app/profile/${profile.id}`}>
            <Avatar image={profile.image} name={profile.name ?? ""} />
          </Link>
        </div>
        <div className={styles.name}>
          <Link href={`/app/profile/${profile.id}`}>
            {profile.name}
            {profile.realName && <small>{profile.realName}</small>}
          </Link>
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
