import ThemeColor from "@/components/Header/ThemeColor";

export default function Head() {
  return (
    <>
      <title>Meeple Party</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content="Find out what games to play with your friends."
      />
      <ThemeColor color="hsl(269, 80%, 56%)" />
      <link rel="icon" href="/logo.svg" />
    </>
  );
}
