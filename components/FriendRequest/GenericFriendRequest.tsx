import { Relationship, RelationshipType } from "@/datatypes/relationship";
import ReactTimeAgo from "react-time-ago";
import Avatar from "../Avatar/Avatar";
import styles from "./friendrequest.module.css";

export interface GenericFriendRequestProps {
  request: Relationship;
  children: React.ReactNode;
}

const GenericFriendRequest: React.FC<GenericFriendRequestProps> = (props) => {
  const { profile, lastUpdate } = props.request;
  return (
    <div className={styles.friendRequest}>
      <Avatar image={profile.picture} name={profile.name} />
      <div className={styles.content}>
        <div className={styles.name}>
          {profile.name}
          {"realName" in profile && <small>{profile.realName}</small>}
        </div>
        <div className={styles.meta}>
          <ReactTimeAgo date={lastUpdate} />
        </div>
      </div>
      <div className={styles.actionButtons}>{props.children}</div>
    </div>
  );
};

export default GenericFriendRequest;
