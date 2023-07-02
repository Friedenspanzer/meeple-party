"use client";

import useUserProfile from "@/hooks/useUserProfile";
import { useState } from "react";
import Spinner from "../Spinner/Spinner";

type Step = "Button" | "Confirmation" | "Input" | "Deleting";

const DeleteAccount: React.FC = ({}) => {
  const [step, setStep] = useState<Step>("Button");
  const [confirmation, setConfirmation] = useState("");
  const { userProfile } = useUserProfile();

  const deleteAccount = () => {
    setStep("Deleting");
  };

  switch (step) {
    case "Button":
      return (
        <button
          onClick={() => setStep("Confirmation")}
          className="btn btn-warning"
        >
          <i className="bi bi-trash3-fill"></i> Delete my account
        </button>
      );
    case "Confirmation":
      return (
        <>
          <p className="alert alert-danger" role="alert">
            <strong>This can not be undone.</strong> We will not retain any of
            your data. Everything you contributed to Meeple Party will be lost
            forever. Your friends will not be notified of this. Are you sure you
            want to do this?
          </p>
          <button onClick={() => setStep("Input")} className="btn btn-danger">
            <i className="bi bi-hand-thumbs-up-fill"></i> Yes, I&apos;m sure
          </button>
        </>
      );
    case "Input":
      return (
        <>
          <p className="alert alert-danger" role="alert">
            Please type your account name <strong>{userProfile?.name}</strong>{" "}
            to verify that you really mean it.
          </p>
          <input
            type="text"
            className="form-control"
            value={confirmation}
            onChange={(e) => setConfirmation(e.currentTarget.value)}
          />
          <button
            onClick={deleteAccount}
            className="btn btn-danger mt-3"
            disabled={confirmation !== userProfile?.name}
          >
            <i className="bi bi-trash3-fill"></i> Delete my account
          </button>
        </>
      );
    case "Deleting":
      return (
        <>
          <Spinner />
          <p>
            Deleting your account. This may take a moment. After we&apos;re done
            you will be redirected to the front page. Bye!
          </p>
        </>
      );
  }
};

export default DeleteAccount;
