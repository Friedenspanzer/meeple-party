"use client";

import { useEffect, useState } from "react";
import Spinner from "../Spinner/Spinner";
import useUserProfile from "@/hooks/useUserProfile";

export default function CompleteUserProfile() {
  const { isLoading, userProfile, invalidate } = useUserProfile();

  const [username, setUserName] = useState("");
  const [realName, setRealName] = useState("");

  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setUserName(userProfile.name || "");
      setRealName(userProfile.realName || "");
    }
  }, [userProfile]);

  const sendCurrentData = () => {
    setUpdating(true);
    fetch("/api/user", {
      method: "PATCH",
      body: JSON.stringify({
        name: username,
        realName: realName,
      }),
    })
      .then(() => setUpdating(false))
      .then(() => invalidate());
  };

  if (isLoading) {
    return <Spinner />;
  }

  //TODO Input sanitation and validation

  return (
    <>
      <h2>Complete your user profile</h2>
      <p>
        Hi there! 👋 Sorry to interrupt, but we still need some information from
        you.
      </p>
      <form className="container-sm row row-cols-3">
        <div className="col">
          <label>Display name</label>
          <input
            className="form-control"
            type="text"
            placeholder="Display name"
            value={username ?? ""}
            onChange={(e) => {
              setUserName(e.currentTarget.value);
            }}
            disabled={updating}
          />
          <p className="text-muted">What you will be publicly known as</p>
        </div>
        <div className="col">
          <label>Real name (optional)</label>
          <input
            className="form-control"
            type="text"
            placeholder="Display name"
            value={!!realName ? realName : ""}
            onChange={(e) => {
              setRealName(e.currentTarget.value);
            }}
            disabled={updating}
          />
          <p className="text-muted">Only shown to your friends</p>
        </div>
        <div className="col">
          <label>E-Mail address</label>
          <input
            className="form-control"
            type="email"
            placeholder="Enter email"
            disabled
            value={userProfile?.email ?? ""}
          />
        </div>
      </form>
      <button
        type="button"
        className="btn btn-primary"
        onClick={sendCurrentData}
        disabled={updating}
      >
        {updating ? (
          <>
            <Spinner style={{ marginRight: "0.5rem" }} />
            Sending ...
          </>
        ) : (
          "Submit"
        )}
      </button>
    </>
  );
}
