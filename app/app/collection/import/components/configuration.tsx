import { ImportConfiguration } from "../page";

export interface ConfigurationProps {
  onDone: (configuration: ImportConfiguration) => void;
}

const Configuration: React.FC<ConfigurationProps> = (props) => {
  return (
    <>
      <p>Currently there is nothing to do here.</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={(e) => props.onDone({})}
      >
        Go on then! <i className="bi bi-caret-right-square"></i>
      </button>
    </>
  );
};

export default Configuration;
