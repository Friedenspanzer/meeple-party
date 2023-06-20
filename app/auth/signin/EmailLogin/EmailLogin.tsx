"use client";

import Spinner from "@/components/Spinner/Spinner";
import classNames from "classnames";
import { signIn } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import validator from "validator";

const EmailLogin: React.FC = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(true);

  const tryLogin = useCallback((address: string) => {
    if (validator.isEmail(address)) {
      setLoading(true);
      signIn("email", { email: address })
        .then((result) => {
          if (!result?.ok) {
            throw new Error(`Error logging you in: ${result?.error}`);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    setValid(validator.isEmail(address));
  }, [address]);

  return (
    <div className="row justify-content-center">
      <div className="col-3 d-flex">
        <div className="input-group needs-validation">
          <input
            type="email"
            className={classNames("form-control", {
              ["is-valid"]: valid && address.length > 0,
              ["is-invalid"]: !valid && address.length > 0,
            })}
            placeholder="name@example.com"
            value={address}
            onChange={(e) => setAddress(e.currentTarget.value)}
            disabled={loading}
            aria-invalid={!valid}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => tryLogin(address)}
            disabled={loading || !valid || address.length === 0}
          >
            {loading ? (
              <Spinner size="small" />
            ) : (
              <i className="bi bi-forward-fill"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailLogin;
