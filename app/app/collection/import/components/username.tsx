import Spinner from "@/components/Spinner/Spinner";
import { useUser } from "@/context/userContext";
import { useContext, useState } from "react";

export interface UsernameProps {
  onDone: () => void;
}

const Username: React.FC<UsernameProps> = (props) => {
  const { user } = useUser();

  if (!user) {
    throw new Error("Username component can only be called with a valid user.");
  }

  const [bggName, setBggName] = useState(user.bggName);
  const [loading, setLoading] = useState(false);

  //TODO Input validation
  const onReady = () => {
    setLoading(true);
    user.bggName = bggName;
    fetch("/api/user", {
      method: "PATCH",
      body: JSON.stringify({
        bggName: bggName,
      }),
    }).then(() => {
      setLoading(false);
      props.onDone();
    });
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
          />
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
