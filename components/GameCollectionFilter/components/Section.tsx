import classNames from "classnames";
import { useId } from "react";
import styles from "./section.module.css";

interface SectionProps {
  title: string;
  value?: string;
  active?: boolean;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  value,
  active = false,
  children,
}) => {
  const collapseId = useId();
  const elementId = useId();

  return (
    <div
      className={classNames("accordion accordion-flush", styles.accordion)}
      id={collapseId}
    >
      <div className="accordion-item">
        <h2
          className={classNames("accordion-header", styles.header, {
            [styles.activeHeader]: active,
          })}
        >
          <button
            className={classNames("accordion-button collapsed", styles.button, {
              [styles.activeButton]: active,
            })}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#${elementId}`}
            aria-expanded="false"
            aria-controls={elementId}
          >
            {title}
            {value && (
              <>
                <small className={styles.value}>{value}</small>
              </>
            )}
          </button>
        </h2>
        <div
          id={elementId}
          className="accordion-collapse collapse"
          data-bs-parent={`#${collapseId}`}
        >
          <div className="accordion-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Section;
