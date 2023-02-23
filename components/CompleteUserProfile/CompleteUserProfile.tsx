import { UserProfile } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface CompleteUserProfileProps {
  userProfile: UserProfile;
  onUserProfileComplete: (userProfile: UserProfile) => void;
}

export default function CompleteUserProfile(props: CompleteUserProfileProps) {
  const { userProfile, onUserProfileComplete } = props;
  const [username, setUserName] = useState(userProfile.name);
  const [realName, setRealName] = useState(userProfile.realName || "");

  const [updating, setUpdating] = useState(false);

  const router = useRouter();

  const sendCurrentData = () => {
    setUpdating(true);
    fetch("/api/database/activeUserProfile", {
      method: "POST",
      body: JSON.stringify({
        email: userProfile.email,
        name: username,
        realName: realName,
        picture: userProfile.picture,
      }),
    })
      .then((value) => value.json())
      .then((value) => {
        onUserProfileComplete(value);
      });
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
            value={username}
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
            value={userProfile.email}
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
