import { getServerSession } from "@/utility/serverSession";
import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";
import ProviderButton from "./ProviderButton/ProviderButton";
import Link from "next/link";
import EmailLogin from "./EmailLogin/EmailLogin";

export default async function SignIn() {
  const session = await getServerSession();

  if (session) {
    redirect("/app");
  }

  const providers = (await getProviders()) ?? [];

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-6 text-center">
          <h1>Log in to Meeple Party</h1>
        </div>
      </div>

      <div className="row mt-5 justify-content-center">
        <div className="col-6 text-center">
          <h4>Using your email address</h4>
        </div>
      </div>

      <EmailLogin />

      <div className="row mt-5 justify-content-center">
        <div className="col-6 text-center">
          <h4>Using social login</h4>
        </div>
      </div>

      {Object.values(providers)
        .filter((p) => p.id !== "email")
        .map((provider) => (
          <ProviderButton provider={provider} key={provider.id} />
        ))}

      <div className="row mt-5 justify-content-center">
        <div className="col-md-2 d-grid">
          <Link className="btn btn-secondary" href="/">
            <i className="bi bi-arrow-left"></i> Go back
          </Link>
        </div>
      </div>
    </>
  );
}
