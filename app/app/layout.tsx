import AppContainer from "@/components/AppContainer/AppContainer";
import DataContainer from "@/components/DataContainer/DataContainer";
import { notFound } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    return (
      <>
        <DataContainer>
          <AppContainer>{children}</AppContainer>
        </DataContainer>
      </>
    );
  } catch {
    notFound();
  }
}
