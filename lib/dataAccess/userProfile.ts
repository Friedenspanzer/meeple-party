import { MyUserProfile } from "@/lib/datatypes/client/userProfile";
import axios from "axios";

export function getMyUserProfile(): Promise<MyUserProfile> {
  //TODO update to API v2
  return axios
    .get<MyUserProfile>("/api/user")
    .then((response) => response.data);
}
