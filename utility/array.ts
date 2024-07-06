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

/**
 * Gets all distinct elements in an array.
 *
 * @param array Array to search.
 * @returns Array that contains all values of the input array, but duplicates are elimated.
 */
export function distinct<T>(array: T[]): T[] {
  return array.reduce(
    (current, next) => (current.includes(next) ? current : [...current, next]),
    [] as T[]
  );
}

/**
 * Splits an array into multiple smaller batches containing all the elements. The batches are all of the same size, but the last batch may contain less elements.
 * @param array Array to split
 * @param size Size of the batches
 */
export function batch<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    return [array];
  }
  const toSplit = [...array];
  const result = [];
  while (toSplit.length > 0) {
    result.push(toSplit.splice(0, size));
  }
  return result;
}
