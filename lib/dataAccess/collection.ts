import { GameCollectionResult } from "@/app/api/v2/user/[userId]/collection/route";
import axios from "axios";
import { UserId } from "../datatypes/client/userProfile";

export default function getCollection(
  userId: UserId
): Promise<GameCollectionResult> {
  return axios
    .get<GameCollectionResult>(`/api/v2/user/${userId}/collection`)
    .then((response) => response.data);
}
