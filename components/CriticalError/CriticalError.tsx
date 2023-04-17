import classNames from "classnames";
import Link from "next/link";
import styles from "./criticalerror.module.css";

export interface CriticalErrorProps {
  message: string;
  details?: string;
}

const CriticalError: React.FC<CriticalErrorProps> = ({ message, details }) => {
  return (
    <div
      className={classNames("modal", styles.modal)}
      data-bs-backdrop="static"
    >
      <div
        className={classNames(
          "modal-dialog modal-dialog-centered modal-dialog-scrollable",
          styles.dialog
        )}
      >
        <div className={classNames("modal-content", styles.content)}>
          <div className={classNames("modal-header", styles.header)}>
            <h5 className="modal-title">Critical error</h5>
          </div>
          <div className="modal-body">
            <p>
              <strong>
                There was an error Meeple Party could not recover from.
              </strong>{" "}
              Try reloading the page or going back to the front page. If this
              persists, please contact your administrator.
            </p>
            <p>{message}</p>
            {details && (
              <div className="accordion" id="errorAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#detailCollapse"
                      aria-expanded="true"
                      aria-controls="detailCollapse"
                    >
                      Details
                    </button>
                  </h2>
                  <div
                    id="detailCollapse"
                    className="accordion-collapse collapse"
                    data-bs-parent="#errorAccordion"
                  >
                    <div className="accordion-body">{details}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={classNames("modal-footer", styles.footer)}>
            <Link href="/app" className="btn btn-secondary">
              Back to front page
            </Link>
            <button
              type="button"
              className="btn btn-primary"
              onClick={(e) => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalError;
