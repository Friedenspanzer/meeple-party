import AppContainer from "@/components/AppContainer/AppContainer";
import { useFeatureFlagServer } from "@/utility/featureFlag";
import { notFound } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
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
  } catch {
    notFound();
  }
}
