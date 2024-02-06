export default function ObjectData({ object }: { object: object }) {
  return (
    <>
      {Object.entries(object).map(([key, value]) => (
        <div data-testid={key} key={key}>
          {JSON.stringify(value)}
        </div>
      ))}
    </>
  );
}
