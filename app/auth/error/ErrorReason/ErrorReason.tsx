"use client";

import Spinner from "@/components/Spinner/Spinner";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const ErrorReason: React.FC = () => {
  const searchParams = useSearchParams();
  const reason = searchParams?.get("error");

  switch (reason) {
    case "Verification":
      return (
        <>
          <p>
            The provided verfication token has expired or has already been used.
          </p>
          <Link className="btn btn-primary" href="/api/auth/signin">
            Try login in again
          </Link>
        </>
      );
    case "Configuration":
    case "AccessDenied":
      return (
        <p>
          There is something wrong with the server configuration. If this
          persists please contact the server administrator.
        </p>
      );
    default:
      return (
        <p>
          Sorry, no further information is available at this time. If this
          persists please contact the server administrator.
        </p>
      );
  }
};

export default ErrorReason;
