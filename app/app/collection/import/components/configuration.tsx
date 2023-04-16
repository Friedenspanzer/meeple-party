import { ImportConfiguration } from "../page";

export interface ConfigurationProps {
  onDone: (configuration: ImportConfiguration) => void;
}

const Configuration: React.FC<ConfigurationProps> = (props) => {
  return (
    <div className="row align-items-center g-4">
      <div className="col-md-auto">Currently there is nothing to do here.</div>
      <div className="col">
        <button
          type="button"
          className="btn btn-primary"
          onClick={(e) => props.onDone({})}
        >
          Go on then! <i className="bi bi-caret-right-square"></i>
        </button>
      </div>
    </div>
  );
};

export default Configuration;
