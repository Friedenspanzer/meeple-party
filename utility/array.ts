/**
 * Splits an array in two using a discriminator function.
 *
 * @param array Array to split
 * @param discriminator Function that returns true for array elements that should pass the test, false otherwise.
 * @returns Array with to elements. The first element is an array of all elements that passed the test, the second element an array of all elements that failed the test. Can be destructured, eg `const [pass, fail] = partition(…)`.
 */
export function partition<T>(
  array: T[],
  discriminator: (element: T) => boolean
) {
  return array.reduce(
    ([pass, fail], e) =>
      discriminator(e) ? [[...pass, e], fail] : [pass, [...fail, e]],
    [[] as T[], [] as T[]]
  );
}
