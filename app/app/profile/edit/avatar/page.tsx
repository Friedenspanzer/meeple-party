import AvatarDisplay from "./AvatarDisplay/AvatarDisplay";
import AvatarUpload from "./AvatarUpload/AvatarUpload";

export const metadata = {
  title: "Edit your avatar",
};

export default async function AvatarPage() {
  return (
    <>
      <div className="row">
        <div className="col-6">
          <h2>Your current avatar</h2>
          <AvatarDisplay />
        </div>
        <div className="col-6">
          <h2>Upload new avatar</h2>
          <AvatarUpload />
        </div>
      </div>
      <div className="row">
        <div className="col-6"></div>
        <div className="col-6 mt-2">
          <div className="alert alert-info" role="alert">
            <i className="bi bi-info-circle"></i> Only file types allowed are
            JPG and PNG. Files may not exceed 1MB.
          </div>
        </div>
      </div>
    </>
  );
}
