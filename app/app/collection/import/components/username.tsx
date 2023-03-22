import Spinner from "@/components/Spinner/Spinner";
import { useUser } from "@/context/userContext";
import { useState } from "react";
import validator from "validator";

export interface UsernameProps {
  onDone: () => void;
}

const Username: React.FC<UsernameProps> = (props) => {
  const { user } = useUser();

  if (!user) {
    throw new Error("Username component can only be called with a valid user.");
  }

  const [bggName, setBggName] = useState(user.bggName);
  const [nameError, setNameError] = useState<string | false>(false);
  const [loading, setLoading] = useState(false);

  const onReady = () => {
    const sanitizedName = sanitizeBggName(bggName!);
    const validationResult = validateBggName(sanitizedName)
    if (!validationResult) {
      setNameError(false);
      setLoading(true);
      user.bggName = sanitizeBggName(sanitizedName);
      fetch("/api/user", {
        method: "PATCH",
        body: JSON.stringify({
          bggName: sanitizeBggName(sanitizedName),
        }),
      }).then(() => {
        setLoading(false);
        props.onDone();
      });
    } else {
      setNameError(validationResult);
    }
  };

  return (
    <>
      <form className="container-sm row row-cols-3">
        <div className="col">
          <label>Your BoardGameGeek username</label>
          <input
            className="form-control"
            type="text"
            placeholder="BoardGameGeek username"
            value={!!bggName ? bggName : ""}
            onChange={(e) => setBggName(e.currentTarget.value)}
            aria-describedby="bggNameHelp"
          />
          {nameError &&
            <div
              id="bggNameHelp"
              className="form-text text-danger"
            >
              {nameError}
            </div>
          }
        </div>
      </form>
      <button
        type="button"
        className="btn btn-primary"
        onClick={onReady}
        disabled={loading}
      >
        Next{" "}
        {loading ? (
          <Spinner size="small" />
        ) : (
          <i className="bi bi-caret-right-square"></i>
        )}
      </button>
    </>
  );
};

export default Username;

function validateBggName(name: string): string | false {
  if (!validator.isLength(name, { min: 1, max: 50 })) {
    return "Name is too long or to short";
  }
  if (!validator.isAlphanumeric(name)) {
    return "Name contains invalid chars";
  }
  return false;
}

function sanitizeBggName(name: string): string {
  return validator.trim(name);
}