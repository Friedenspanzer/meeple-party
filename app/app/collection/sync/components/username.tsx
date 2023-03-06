import { UserContext } from "@/context/userContext";
import { useCallback, useContext, useState } from "react";

export interface UsernameProps {
  onDone: () => void;
}

const Username: React.FC<UsernameProps> = (props) => {
  const userProfile = useContext(UserContext);
  const [bggName, setBggName] = useState(userProfile.bggName);
  const [loading, setLoading] = useState(false);

  //TODO Input validation
  const onReady = () => {
    setLoading(true);
    userProfile.bggName = bggName;
    fetch("/api/database/activeUserProfile", {
      method: "POST",
      body: JSON.stringify({
        ...userProfile,
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
          <div className="spinner-border spinner-border-sm" />
        ) : (
          <i className="bi bi-caret-right-square"></i>
        )}
      </button>
    </>
  );
};

export default Username;
