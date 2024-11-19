import { useUser } from "@/feature/authentication/context/userContext";
import { useTranslation } from "@/i18n/client";
import { XMLParser } from "fast-xml-parser";
import { useCallback, useEffect } from "react";

export interface RequestProps {
  onDone: (bggObject: any) => void;
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
});

const Request: React.FC<RequestProps> = (props) => {
  const { onDone } = props;
  const { user, loading } = useUser();
  const { t } = useTranslation("import");

  if (!user) {
    throw new Error("Request component can only be called with a valid user.");
  }

  const tryFetchCollection = useCallback(() => {
    /*
     * TODO The API answers with 429 after too many requests. The timeout should be high enough
     * for that to not happen but it should be handled anyway
     */
    fetch(`https://api.geekdo.com/xmlapi/collection/${user.bggName}`)
      .then((response) => {
        if (response.status === 202) {
          setTimeout(tryFetchCollection, 20000);
        } else if (response.status === 200) {
          response
            .text()
            .then((xml) => xmlParser.parse(xml))
            .then((obj) => {
              onDone(obj);
            });
        } else {
          console.error("Unexpected response status from BGG API", response);
          throw new Error("Unexpected response status from BGG API");
        }
      })
      .catch((reason) => {
        console.error(
          "Fetching data from BGG API failed for unexpected reasons",
          reason
        );
        throw new Error(
          "Fetching data from BGG API failed for unexpected reasons"
        );
      });
  }, [onDone, user.bggName]);

  useEffect(() => {
    tryFetchCollection();
  }, [tryFetchCollection]);

  return (
    <>
      <p className="lead">{t("Request.Title")}</p>
      <p>{t("Request.Text")}</p>
    </>
  );
};

export default Request;
