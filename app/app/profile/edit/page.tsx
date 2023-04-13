"use client";

import GamePill from "@/components/GamePill/GamePill";
import GameSearch, {
  GameSearchChildren,
} from "@/components/GameSearch/GameSearch";
import Spinner from "@/components/Spinner/Spinner";
import { useUser } from "@/context/userContext";
import { Game } from "@/datatypes/game";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";

const EditProfile: React.FC = () => {
  const { user } = useUser();

  if (!user) {
    throw new Error("Could not load user");
  }

  const [profileName, setProfileName] = useState(user.name || "");
  const [profileNameError, setProfileNameError] = useState<string | false>(
    false
  );

  const [realName, setRealName] = useState(user.realName || "");
  const [realNameError, setRealNameError] = useState<string | false>(false);

  const [place, setPlace] = useState(user.place || "");
  const [placeError, setPlaceError] = useState<string | false>(false);

  const [about, setAbout] = useState(user.about || "");
  const [aboutError, setAboutError] = useState<string | false>(false);

  const [preferences, setPreferences] = useState(user.preference || "");
  const [preferencesError, setPreferencesError] = useState<string | false>(
    false
  );

  const [favorites, setFavorites] = useState<Game[] | false>(false);

  const [sending, setSending] = useState(false);

  const FavoriteGameResult: React.FC<GameSearchChildren> = ({
    searchResult,
  }) => {
    return (
      <>
        {searchResult.map(({ game, status, friendCollections }) => (
          <GamePill game={game} key={game.id}>
            &nbsp;
            <i
              className="bi bi-plus"
              style={{ cursor: "pointer" }}
              onClick={(_) => addToFavorites(game.id)}
            ></i>
          </GamePill>
        ))}
      </>
    );
  };

  const addToFavorites = useCallback(
    (gameId: number) => {
      //TODO Error handling
      fetch(`/api/games/${gameId}`)
        .then((response) => response.json())
        .then((game) => {
          setFavorites(favorites ? [...favorites, game] : [game]);
        });
    },
    [favorites]
  );

  const updateUser = () => {
    setSending(true);
    const newUserDetails = {
      ...user,
      name: profileName,
      realName,
      place,
      about,
      preference: preferences,
      favorites: favorites ? favorites.map((f) => f.id) : [],
    };
    //TODO Error Handling
    fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(newUserDetails),
    }).then(() => setSending(false));
  };

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

  useEffect(() => {
    if (about.length > 3000) {
      setAboutError("The text must not exceed 3000 characters.");
    } else {
      setAboutError(false);
    }
  }, [about]);

  useEffect(() => {
    if (preferences.length > 3000) {
      setPreferencesError("The text must not exceed 3000 characters.");
    } else {
      setPreferencesError(false);
    }
  }, [preferences]);

  useEffect(() => {
    fetch("/api/user")
      .then((response) => response.json())
      .then((u) => setFavorites(u.favorites));
  }, [user]);

  return (
    <form className="grid gap-3" noValidate>
      <div className="row">
        <div className="col-12">
          <h1>Edit your profile</h1>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
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

        <div className="col-md-4">
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

        <div className="col-md-4">
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

      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="place" className="form-label">
            About yourself
          </label>
          <textarea
            className={classNames({
              "form-control": true,
              "border-danger": !!aboutError,
            })}
            id="place"
            rows={10}
            value={about}
            onChange={(e) => setAbout(e.currentTarget.value)}
            placeholder="Write something about yourself"
          ></textarea>
          <div
            id="profileNameHelp"
            className={classNames({
              "form-text": true,
              "text-danger": aboutError,
            })}
          >
            {aboutError || "Will be publicly shown to everybody."}
          </div>
        </div>

        <div className="col-md-6">
          <label htmlFor="place" className="form-label">
            Your gaming preferences
          </label>
          <textarea
            className={classNames({
              "form-control": true,
              "border-danger": !!preferencesError,
            })}
            id="place"
            rows={10}
            value={preferences}
            onChange={(e) => setPreferences(e.currentTarget.value)}
            placeholder="Tell your friends about the kind of games you like"
          ></textarea>
          <div
            id="profileNameHelp"
            className={classNames({
              "form-text": true,
              "text-danger": preferencesError,
            })}
          >
            {preferencesError || "Will be publicly shown to everybody."}
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <label className="form-label">Your favorite games</label>
          <br />
          {favorites ? (
            <>
              {favorites.map((f) => (
                <GamePill game={f} key={f.id}>
                  &nbsp;
                  <i
                    className="bi bi-x"
                    style={{ cursor: "pointer" }}
                    onClick={(_) =>
                      setFavorites(favorites.filter((g) => g.id !== f.id))
                    }
                  ></i>
                </GamePill>
              ))}
              <br />
              <br />
              <button
                className="btn btn-secondary btn-sm"
                data-bs-toggle="collapse"
                data-bs-target="#collapseGameSearch"
                type="button"
                aria-expanded="false"
                aria-controls="collapseGameSearch"
              >
                Add games
              </button>
              <div className="collapse" id="collapseGameSearch">
                <GameSearch resultView={FavoriteGameResult} />
              </div>
            </>
          ) : (
            <Spinner />
          )}
        </div>
      </div>

      <div className="row mb-4">
        <div className="alert alert-warning col-md-8 order-md-2" role="alert">
          <i className="bi bi-exclamation-octagon-fill"></i>{" "}
          <strong>Beware:</strong> Everything that is shown to your friends may
          also be shown to people you send friend requests to (but not people
          sending friend requests to you).
        </div>
        <div className="col-4">
          <button
            type="button"
            className="btn btn-primary"
            disabled={
              sending ||
              !!profileNameError ||
              !!realNameError ||
              !!placeError ||
              !!aboutError ||
              !!preferencesError
            }
            onClick={(e) => updateUser()}
          >
            {sending && (
              <>
                <Spinner size="small" />
                &nbsp;
              </>
            )}
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditProfile;
