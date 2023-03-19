import AppContainer from "@/components/AppContainer/AppContainer";
import { useFeatureFlagServer } from "@/utility/featureFlag";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showApp = await useFeatureFlagServer("show_app");
  return (
    <>
      {showApp && <AppContainer>{children}</AppContainer>}
      {!showApp && (
        <>
          <h1>Meeple Party is currently invite-only</h1>
          <p>Please ask the administrator to unlock your account.</p>
        </>
      )}
    </>
  );
}
