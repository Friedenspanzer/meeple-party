export function partition<T>(
  array: T[],
  discriminator: (element: T) => boolean
) {
  //TODO Test this
  return array.reduce(
    ([pass, fail], e) =>
      discriminator(e) ? [[...pass, e], fail] : [pass, [...fail, e]],
    [[] as T[], [] as T[]]
  );
}
