import styles from "./group.module.css";

export interface GroupProps {
  title: string;
  children: React.ReactNode;
}

const Group: React.FC<GroupProps> = ({ title, children }) => {
  return (
    <>
      <h6 className={styles.heading}>{title}</h6>
      {children}
    </>
  );
};

export default Group;
