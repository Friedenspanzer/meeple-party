import classNames from "classnames";
import Avatar from "../Avatar/Avatar";
import styles from "./person.module.css";

interface PersonProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  realName?: string;
  image?: string;
}

const Person: React.FC<PersonProps> = ({ name, realName, image, ...props }) => {
  return (
    <div {...props} className={classNames(styles.container, props.className)}>
      <div className={styles.avatar}>
        <Avatar name={name} image={image} />
      </div>
      <span className={styles.name}>{name}</span>
      <span className={styles.realName}>{realName}</span>
    </div>
  );
};

export default Person;
