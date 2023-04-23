import { useId } from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  const collapseId = useId();
  const elementId = useId();

  return (
    <div className="accordion accordion-flush" id={collapseId}>
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#${elementId}`}
            aria-expanded="false"
            aria-controls={elementId}
          >
            {title}
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
