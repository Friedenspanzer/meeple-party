"use client";

import { useUser } from "@/context/userContext";
import classNames from "classnames";
import { useEffect, useState } from "react";

const EditProfile: React.FC = ({}) => {
  const { user } = useUser();

  if (!user) {
    throw new Error("Could not load user");
  }

  const [about, setAbout] = useState(user.about || "");
  const [preferences, setPreferences] = useState(user.preference || "");

  const [profileName, setProfileName] = useState(user.name || "");
  const [profileNameError, setProfileNameError] = useState<string | false>(
    false
  );

  const [realName, setRealName] = useState(user.realName || "");
  const [realNameError, setRealNameError] = useState<string | false>(false);

  const [place, setPlace] = useState(user.place || "");
  const [placeError, setPlaceError] = useState<string | false>(false);

  useEffect(() => {
    if (!profileName || profileName.length === 0) {
      setProfileNameError("You must enter a profile name.");
    } else if (profileName.length > 30) {
      setProfileNameError("Your profile name must not exceed 30 characters.");
    } else {
      setProfileNameError(false);
    }
  }, [profileName]);

  useEffect(() => {
    if (realName.length > 60) {
      setRealNameError("The name given to us must not exceed 60 characters.");
    } else {
      setRealNameError(false);
    }
  }, [realName]);

  useEffect(() => {
    if (place.length > 30) {
      setPlaceError("The place given to us must not exceed 30 characters.");
    } else {
      setPlaceError(false);
    }
  }, [place]);

  return (
    <form className="grid gap-3" noValidate>
      <div className="row">
        <div className="col-12">
          <h1>Edit your profile</h1>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-4">
          <label htmlFor="profileName" className="form-label">
            Profile name
          </label>
          <input
            type="text"
            className={classNames({
              "form-control": true,
              "border-danger": !!profileNameError,
            })}
            id="profileName"
            placeholder="Profile name"
            aria-describedby="profileNameHelp"
            value={profileName}
            onChange={(e) => setProfileName(e.currentTarget.value)}
          />
          <div
            id="profileNameHelp"
            className={classNames({
              "form-text": true,
              "text-danger": profileNameError,
            })}
          >
            {profileNameError ||
              "Will be publicly shown to everybody. Must be set."}
          </div>
        </div>

        <div className="col-4">
          <label htmlFor="realName" className="form-label">
            Real name
          </label>
          <input
            type="text"
            className={classNames({
              "form-control": true,
              "border-danger": !!realNameError,
            })}
            id="realName"
            placeholder="Real name"
            aria-describedby="realNameHelp"
            value={realName}
            onChange={(e) => setRealName(e.currentTarget.value)}
          />
          <div
            id="profileNameHelp"
            className={classNames({
              "form-text": true,
              "text-danger": realNameError,
            })}
          >
            {realNameError || "Will only be shown to your friends."}
          </div>
        </div>

        <div className="col-4">
          <label htmlFor="place" className="form-label">
            Place
          </label>
          <input
            type="text"
            className={classNames({
              "form-control": true,
              "border-danger": !!placeError,
            })}
            id="place"
            placeholder="Where you live"
            aria-describedby="placeHelp"
            value={place}
            onChange={(e) => setPlace(e.currentTarget.value)}
          />
          <div
            id="profileNameHelp"
            className={classNames({
              "form-text": true,
              "text-danger": placeError,
            })}
          >
            {placeError || "Will only be shown to your friends."}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-6">
          <label htmlFor="place" className="form-label">
            About yourself
          </label>
          <textarea
            className="form-control"
            id="place"
            rows={3}
            value={about}
          ></textarea>
          <div id="placeHelp" className="form-text">
            Will be publicly shown to everybody.
          </div>
        </div>

        <div className="col-6">
          <label htmlFor="place" className="form-label">
            Your gaming preferences
          </label>
          <textarea
            className="form-control"
            id="place"
            rows={3}
            value={preferences}
          ></textarea>
          <div id="placeHelp" className="form-text">
            Will be publicly shown to everybody.
          </div>
        </div>
      </div>

      <div className="row justify-content-between">
        <div className="col-1">
          <button type="button" className="btn btn-primary">
            Save
          </button>
        </div>
        <div className="alert alert-warning col-8" role="alert">
          <i className="bi bi-exclamation-octagon-fill"></i>{" "}
          <strong>Beware:</strong> Everything that is shown to your friends may
          also be shown to people you send friend requests to (but not people
          sending friend requests to you).
        </div>
      </div>
    </form>
  );
};

export default EditProfile;
