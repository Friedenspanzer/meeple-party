"use client";

import { useTranslation } from "@/i18n/client";
import Spinner from "@/lib/components/Spinner/Spinner";
import {
  AVATAR_ALLOWED_FILE_SIZE,
  AVATAR_ALLOWED_FILE_TYPES,
} from "@/lib/constants/avatar";
import useUserProfile from "@/lib/hooks/useUserProfile";
import { useCallback, useId, useState } from "react";

export default function AvatarUpload() {
  const { t } = useTranslation("profile");
  const fileUploadId = useId();
  const { invalidate } = useUserProfile();
  const [error, setError] = useState<false | string>(false);
  const [progress, setProgress] = useState<"waiting" | "uploading" | "done">(
    "waiting"
  );

  const onFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) {
        setError(t("Avatar.Errors.NoFile"));
      } else if (files.length > 1) {
        setError(t("Avatar.Errors.MultipleFiles"));
      } else if (files[0].size > AVATAR_ALLOWED_FILE_SIZE) {
        setError(t("Avatar.Errors.FileSize"));
      } else if (!AVATAR_ALLOWED_FILE_TYPES.includes(files[0].type)) {
        setError(t("Avatar.Errors.FileType"));
      } else {
        setError(false);
        setProgress("uploading");
        const formData = new FormData();
        formData.append("avatar", files[0]);
        fetch("/api/user/avatar", { method: "PUT", body: formData })
          .then((result) => {
            if (result.ok) {
              setProgress("done");
              invalidate();
            } else {
              throw Error(`${result.status}: ${result.statusText}`);
            }
          })
          .catch((error) => {
            setProgress("waiting");
            setError(t("Avatar.Errors.Upload"));
            console.error(error);
          });
      }
    },
    [invalidate, t]
  );

  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <label htmlFor={fileUploadId} className="form-label">
            {t("Avatar.Choose")}
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
            <div className="alert alert-success" role="alert">
              <i className="bi bi-check-circle-fill"></i> {t("Avatar.Success")}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
