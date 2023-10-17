import Spinner from "@/components/Spinner/Spinner";
import { getTranslation } from "@/i18n";
import { Suspense } from "react";
import ErrorReason from "./ErrorReason/ErrorReason";

export default async function Page() {
  const { t } = await getTranslation("auth");
  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h1>{t("Error")}</h1>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <Suspense fallback={<Spinner size="small" />}>
            <ErrorReason />
          </Suspense>
        </div>
      </div>
    </>
  );
}
