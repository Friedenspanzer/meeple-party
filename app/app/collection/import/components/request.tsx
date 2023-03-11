import { UserContext } from "@/context/userContext";
import { XMLParser } from "fast-xml-parser";
import { useCallback, useContext, useEffect } from "react";

export interface RequestProps {
  onDone: (bggObject: any) => void;
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
});

const Request: React.FC<RequestProps> = (props) => {
  const { onDone } = props;
  const userProfile = useContext(UserContext);

  const tryFetchCollection = useCallback(() => {
    /*
     * TODO The API answers with 429 after too many requests. The timeout should be high enough
     * for that to not happen but it should be handled anyway
     */
    fetch(`https://api.geekdo.com/xmlapi/collection/${userProfile.bggName}`)
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
  }, [onDone, userProfile.bggName]);

  useEffect(() => {
    tryFetchCollection();
  }, [tryFetchCollection]);

  return (
    <>
      <p className="lead">Requesting your collection.</p>
      <p>
        This may take a couple of minutes depending on BoardGameGeek workload.
        There&apos;s nothing you can do here. You can leave this page and come
        back later without losing progress.
      </p>
    </>
  );
};

export default Request;
