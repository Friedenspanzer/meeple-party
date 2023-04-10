import classNames from "classnames";
import styles from "./collectionchange.module.css";

interface CollectionChangeProps extends React.HTMLAttributes<HTMLDivElement> {
  operation: "add" | "change" | "remove";
  own?: boolean;
  wantToPlay?: boolean;
  wishlist?: boolean;
  image: string;
  text: string;
}

const CollectionChange: React.FC<CollectionChangeProps> = ({
  operation,
  own = false,
  wantToPlay = false,
  wishlist = false,
  image,
  text,
  ...props
}) => {
  return (
    <div
      {...props}
      className={classNames(props.className, styles.container, {
        [styles.add]: operation === "add",
        [styles.change]: operation === "change",
        [styles.remove]: operation === "remove",
      })}
    >
      <div className={styles.lists}>
        <i
          className={classNames(["bi bi-box-seam-fill", { [styles.own]: own }])}
        ></i>
        <i
          className={classNames([
            "bi bi-dice-3-fill",
            { [styles.wantToPlay]: wantToPlay },
          ])}
        ></i>
        <i
          className={classNames([
            "bi bi-gift-fill",
            { [styles.wishlist]: wishlist },
          ])}
        ></i>
      </div>
      <img src={image} alt={text} className={styles.picture} />
      {text}
    </div>
  );
};

export default CollectionChange;
