"use client";

import CriticalError from "@/components/CriticalError/CriticalError";
import GamePill from "@/components/GamePill/GamePill";
import GameSearch, {
  GameSearchChildren,
} from "@/components/GameSearch/GameSearch";
import PrefetchedGameData from "@/components/Prefetches/PrefetchedGameData";
import Spinner from "@/components/Spinner/Spinner";
import { Game } from "@/datatypes/game";
import { useGameQuery, useGameQueryKey } from "@/hooks/api/useGame";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import useUserProfile from "@/hooks/useUserProfile";
import classNames from "classnames";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const EditProfile: React.FC = () => {
  const {
    isLoading,
    userProfile,
    invalidate,
    update: updateUserProfile,
  } = useUserProfile();
  const { preferences, loading: preferencesLoading } = useUserPreferences();

  if (!isLoading && !userProfile) {
    throw new Error("Could not load user");
  }

  const [profileName, setProfileName] = useState("");
  const [profileNameError, setProfileNameError] = useState<string | false>(
    false
  );

  const [realName, setRealName] = useState("");
  const [realNameError, setRealNameError] = useState<string | false>(false);

  const [place, setPlace] = useState("");
  const [placeError, setPlaceError] = useState<string | false>(false);

  const [about, setAbout] = useState("");
  const [aboutError, setAboutError] = useState<string | false>(false);

  const [favorites, setFavorites] = useState<Game[] | false>(false);

  const [sending, setSending] = useState(false);

  const [apiError, setApiError] = useState<string | false>(false);
  const [apiErrorDetail, setApiErrorDetail] = useState<string>();

  const getGame = useGameQuery();

  const addToFavorites = useCallback(
    (gameId: number) => {
      getGame(gameId)
        .then((game) => {
          setFavorites(favorites ? [...favorites, game] : [game]);
        })
        .catch((error) => {
          setApiError(`Error fetching game data for game ${gameId}.`);
          setApiErrorDetail(error);
        });
    },
    [favorites, getGame]
  );

  const FavoriteGameResult = useMemo(
    () => bindFavoriteGameResult(addToFavorites),
    [addToFavorites]
  );

  const updateUser = () => {
    setSending(true);
    updateUserProfile({
      name: profileName,
      realName,
      place,
      about,
      favorites: favorites ? favorites : [],
    })
      .then(() => {
        setSending(false);
      })
      .catch((error) => {
        setApiError(`Error updating profile data.`);
        setApiErrorDetail(error);
      });
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
    if (userProfile) {
      setProfileName(userProfile?.name || "");
      setRealName(userProfile?.realName || "");
      setPlace(userProfile?.place || "");
      setAbout(userProfile?.about || "");
      setFavorites(userProfile?.favorites);
    }
  }, [userProfile]);

  return (
    <>
      {apiError && (
        <CriticalError message={apiError} details={apiErrorDetail} />
      )}
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
              {profileNameError || "Will be shown to everybody. Must be set."}
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
              {realNameError ||
                getPrivacyStatement(!preferences?.showRealNameInProfile)}
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
              {placeError ||
                getPrivacyStatement(!preferences?.showPlaceInProfile)}
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <label htmlFor="place" className="form-label">
              Your profile
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
              placeholder="Write something to spice up your profile page."
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
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <label className="form-label">Your favorite games</label>
            <br />
            {favorites ? (
              <PrefetchedGameData data={favorites}>
                {favorites.map((f) => (
                  <GamePill gameId={f.id} key={f.id}>
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
              </PrefetchedGameData>
            ) : (
              <Spinner />
            )}
          </div>
        </div>

        <div className="row mb-4">
          <div className="alert alert-info col-md-8 order-md-2" role="alert">
            <i className="bi bi-info-circle"></i> For some things you can change
            what&apos;s shown to everybody in your{" "}
            <Link href="/app/profile/edit/privacy">privacy settings</Link>.
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
                !!aboutError
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
    </>
  );
};

function bindFavoriteGameResult(
  addToFavorites: (gameId: number) => void
): React.FC<GameSearchChildren> {
  const FavoriteGameResult: React.FC<GameSearchChildren> = ({
    searchResult,
  }) => {
    return (
      <PrefetchedGameData data={searchResult.map((c) => c.game)}>
        {searchResult.map(({ game }) => (
          <GamePill gameId={game.id} key={game.id}>
            &nbsp;
            <i
              className="bi bi-plus"
              style={{ cursor: "pointer" }}
              onClick={(_) => addToFavorites(game.id)}
            ></i>
          </GamePill>
        ))}
      </PrefetchedGameData>
    );
  };
  return FavoriteGameResult;
}

function getPrivacyStatement(privateInformation: boolean) {
  if (privateInformation) {
    return <PrivacyStatementPrivate />;
  } else {
    return <PrivacyStatementPublic />;
  }
}

const PrivacyStatementPrivate: React.FC = () => {
  return (
    <>
      Will only be shown to your friends.{" "}
      <Link href="/app/profile/edit/privacy">Change</Link>
    </>
  );
};

const PrivacyStatementPublic: React.FC = () => {
  return (
    <>
      Will be shown to everybody.{" "}
      <Link href="/app/profile/edit/privacy">Change</Link>
    </>
  );
};

export default EditProfile;
