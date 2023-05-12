"use client";

import Spinner from "@/components/Spinner/Spinner";
import { AVATAR_ALLOWED_FILE_SIZE, AVATAR_ALLOWED_FILE_TYPES } from "@/constants/avatar";
import { useUser } from "@/context/userContext";
import { useCallback, useId, useState } from "react";

const AvatarUpload: React.FC = () => {
  const fileUploadId = useId();
  const { update: updateUser } = useUser();
  const [error, setError] = useState<false | string>(false);
  const [progress, setProgress] = useState<"waiting" | "uploading" | "done">(
    "waiting"
  );

  const onFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) {
        setError("No files selected.");
      } else if (files.length > 1) {
        setError("Multiple files selected.");
      } else if (files[0].size > AVATAR_ALLOWED_FILE_SIZE) {
        setError("File is bigger than 1MB.");
      } else if (!AVATAR_ALLOWED_FILE_TYPES.includes(files[0].type)) {
        setError("File type not allowed.");
      } else {
        setError(false);
        setProgress("uploading");
        const formData = new FormData();
        formData.append("avatar", files[0]);
        fetch("/api/user/avatar", { method: "PUT", body: formData })
          .then((result) => {
            if (result.ok) {
              setProgress("done");
              updateUser();
            } else {
              throw Error(`${result.status}: ${result.statusText}`);
            }
          })
          .catch((error) => {
            setProgress("waiting");
            setError("Error uploading file.");
            console.error(error);
          });
      }
    },
    [updateUser]
  );

  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <label htmlFor={fileUploadId} className="form-label">
            Choose an image file
          </label>
          <input
            className="form-control"
            type="file"
            id={fileUploadId}
            onChange={(e) => onFileSelect(e.target.files)}
          ></input>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-12">
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-octagon-fill"></i> {error}
            </div>
          )}
          {progress === "uploading" && <Spinner />}
          {progress === "done" && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-check-circle-fill"></i> Successfully uploaded
              your avatar!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AvatarUpload;
