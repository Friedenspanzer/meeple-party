import {
  defaultUserPreferences,
  UserPreferences,
  UserProfile,
} from "@/datatypes/userProfile";
import { generatePrismaUser } from "@/utility/test";
import { convertToUserProfile } from "./utility";

describe("convertToUserProfile", () => {
  it("returns a full profile for friends", () => {
    const user = generatePrismaUser();
    const result = convertToUserProfile(user, true);
    const expected: UserProfile = {
      id: user.id,
      name: user.name,
      role: user.role,
      image: user.image,
      realName: user.realName,
      about: user.about,
      place: user.place,
      bggName: user.bggName,
    };

    expect(result).toEqual(expected);
  });
  it("returns a full profile for friends even when fields are hidden", () => {
    const user = generatePrismaUser();
    const userSettings: UserPreferences = {
      ...defaultUserPreferences,
      showPlaceInProfile: false,
      showRealNameInProfile: false,
    };
    user.preferences = userSettings;
    const result = convertToUserProfile(user, true);
    const expected: UserProfile = {
      id: user.id,
      name: user.name,
      role: user.role,
      image: user.image,
      realName: user.realName,
      about: user.about,
      place: user.place,
      bggName: user.bggName,
    };

    expect(result).toEqual(expected);
  });
  it("respects privacy settings for non-friends", () => {
    const user = generatePrismaUser();
    const userSettings: UserPreferences = {
      ...defaultUserPreferences,
      showPlaceInProfile: false,
      showRealNameInProfile: false,
    };
    user.preferences = userSettings;
    const result = convertToUserProfile(user, false);
    const expected: UserProfile = {
      id: user.id,
      name: user.name,
      role: user.role,
      image: user.image,
      realName: null,
      about: user.about,
      place: null,
      bggName: null,
    };

    expect(result).toEqual(expected);
  });
});
