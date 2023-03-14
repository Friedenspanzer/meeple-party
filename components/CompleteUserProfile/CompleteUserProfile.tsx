"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";

export default function CompleteUserProfile() {
  const { user, loading } = useUser();

  if (!user) {
    throw new Error(
      "User profile completion component can only be called with a user"
    );
  }

  const [username, setUserName] = useState(user.name);
  const [realName, setRealName] = useState(user.realName || "");

  const [updating, setUpdating] = useState(false);

  const sendCurrentData = () => {
    setUpdating(true);
    fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({
        name: username,
        realName: realName,
      }),
    }).then(() => setUpdating(false));
  };

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
            value={user.email ?? ""}
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
            <div
              className="spinner-border spinner-border-sm"
              style={{ marginRight: "0.5rem" }}
            />
            Sending ...
          </>
        ) : (
          "Submit"
        )}
      </button>
    </>
  );
}
