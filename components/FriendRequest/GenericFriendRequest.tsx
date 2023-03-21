import { Relationship, RelationshipType } from "@/datatypes/relationship";
import ReactTimeAgo from "react-time-ago";
import Avatar from "../Avatar/Avatar";
import styles from "./friendrequest.module.css";

export interface GenericFriendRequestProps {
  request: Relationship;
  stale: boolean;
  children: React.ReactNode;
}

const GenericFriendRequest: React.FC<GenericFriendRequestProps> = ({
  request,
  stale,
  children,
}) => {
  const { profile, lastUpdate } = request;
  return (
    <div className={`${styles.friendRequest} ${stale && styles.stale}`}>
      <Avatar image={profile.image} name={profile.name ?? ""} />
      <div className={styles.content}>
        <div className={styles.name}>
          {profile.name}
          {"realName" in profile && <small>{profile.realName}</small>}
        </div>
        <div className={styles.meta}>
          <ReactTimeAgo date={lastUpdate} />
        </div>
      </div>
      <div className={styles.actionButtons}>{children}</div>
    </div>
  );
};

export default GenericFriendRequest;
