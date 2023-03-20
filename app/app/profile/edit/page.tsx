"use client";

const EditProfile: React.FC = ({}) => {
  return (
    <div className="grid gap-3">
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
            className="form-control"
            id="profileName"
            placeholder="Profile name"
            aria-describedby="profileNameHelp"
          />
          <div id="profileNameHelp" className="form-text">
            Will be publicly shown to everybody. Must be set.
          </div>
        </div>

        <div className="col-4">
          <label htmlFor="realName" className="form-label">
            Real name
          </label>
          <input
            type="text"
            className="form-control"
            id="realName"
            placeholder="Real name"
            aria-describedby="realNameHelp"
          />
          <div id="realNameHelp" className="form-text">
            Will only be shown to your friends.
          </div>
        </div>

        <div className="col-4">
          <label htmlFor="place" className="form-label">
            Place
          </label>
          <input
            type="text"
            className="form-control"
            id="place"
            placeholder="Where you live"
            aria-describedby="placeHelp"
          />
          <div id="placeHelp" className="form-text">
            Will only be shown to your friends.
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-6">
          <label htmlFor="place" className="form-label">
            About yourself
          </label>
          <textarea className="form-control" id="place" rows={3}></textarea>
          <div id="placeHelp" className="form-text">
            Will be publicly shown to everybody.
          </div>
        </div>

        <div className="col-6">
          <label htmlFor="place" className="form-label">
            Your gaming preferences
          </label>
          <textarea className="form-control" id="place" rows={3}></textarea>
          <div id="placeHelp" className="form-text">
            Will be publicly shown to everybody.
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
