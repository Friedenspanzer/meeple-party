"use client";

import { ClientSafeProvider, signIn } from "next-auth/react";

interface ProviderButtonProps {
  provider: ClientSafeProvider;
}

const ProviderButton: React.FC<ProviderButtonProps> = ({ provider }) => {
  return (
    <div className="row mb-2 justify-content-center">
      <div className="col-md-2 d-grid">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => signIn(provider.id)}
        >
          <>
            {getIcon(provider.id)}&nbsp;{provider.name}
          </>
        </button>
      </div>
    </div>
  );
};

export default ProviderButton;

function getIcon(id: string) {
  switch (id) {
    case "google":
      return <i className="bi bi-google"></i>;
    case "github":
      return <i className="bi bi-github"></i>;
      case "twitter":
        return <i className="bi bi-twitter"></i>;
    default:
      return <></>;
  }
}
