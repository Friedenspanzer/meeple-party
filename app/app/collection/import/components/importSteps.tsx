import { ImportStep } from "../page";
import styles from "./importsteps.module.css";
import Image from "next/image";

export interface ImportStepsProps {
  steps: ImportStep[];
}

const ImportSteps: React.FC<ImportStepsProps> = (props) => {
  const { steps } = props;
  return (
    <ul className={styles.importSteps}>
      {steps.map((s, i) => (
        <li key={i} className={styles.importStep}>
          {s.operation === "added" && (
            <i
              className={`bi bi-plus-circle-fill ${styles.importStepIcon}`}
            ></i>
          )}
          {s.image && (
            <Image
              src={s.image}
              width="50"
              height="50"
              alt={s.text}
              className={styles.importStepImage}
            />
          )}
          {s.text}
        </li>
      ))}
    </ul>
  );
};

export default ImportSteps;