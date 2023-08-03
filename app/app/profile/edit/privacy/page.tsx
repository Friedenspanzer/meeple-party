import PlaceSearchable from "@/components/AutoUpdateToggle/Toggles/PlaceSearchable";
import SendAnalyticsData from "@/components/AutoUpdateToggle/Toggles/SendAnalyticsData";
import ShowPlaceInProfile from "@/components/AutoUpdateToggle/Toggles/ShowPlaceInProfile";
import ShowRealName from "@/components/AutoUpdateToggle/Toggles/ShowRealName";

export const metadata = {
  title: "Privacy settings",
};

export default async function Privacy() {
  return (
    <>
      <div className="row">
        <div className="col offset-md-2">
          <h2>Profile information visibility</h2>
        </div>
      </div>

      <ShowRealName />
      <ShowPlaceInProfile />

      <div className="row">
        <div className="col offset-md-2">
          <h2>Disoverability</h2>
        </div>
      </div>

      <PlaceSearchable />

      <div className="row">
        <div className="col offset-md-2">
          <h2>Tracking</h2>
        </div>
      </div>

      <SendAnalyticsData />
    </>
  );
}
