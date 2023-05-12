import SendAnalyticsData from "@/components/AutoUpdateToggle/Toggles/SendAnalyticsData";

export const metadata = {
  title: 'Privacy settings',
}

export default async function Privacy() {
  return (
    <>
      <div className="row">
        <div className="col offset-md-2">
          <h2>Tracking</h2>
        </div>
      </div>

      <SendAnalyticsData />
    </>
  );
}
